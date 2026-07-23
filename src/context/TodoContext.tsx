import React, { useState, useEffect } from 'react';
import type { TodoItem } from '../types';
import { db } from '../lib/firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { getErrorMessage, logError, retryWithBackoff, isRetriableError } from '../lib/errors';
import { createContext } from 'react';
import type { TodoContextType } from '../types';

export const TodoContext = createContext<TodoContextType | undefined>(undefined);
import { listenToUserCollection } from '../lib/firestore';

const TODOS_COLLECTION = 'todos';

export const TodoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const { showSuccess, showError, showInfo } = useToast();
    const [todos, setTodos] = useState<TodoItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [lastError, setLastError] = useState<string | null>(null);
    const [lastFailedOperation, setLastFailedOperation] = useState<(() => Promise<void>) | null>(null);

    // Load todos from Firestore scoped to current user with real-time updates
    useEffect(() => {
        if (!user) {
            setTodos([]);
            setIsLoading(false);
            return;
        }

        let isMounted = true;  // ✅ Prevent state updates after unmount
        let hasLoaded = false;

        setIsLoading(true);
        setLastError(null);

        const unsubscribe = listenToUserCollection<TodoItem>({
            collectionName: TODOS_COLLECTION,
            userId: user.uid,
            mapFn: (raw) => raw as TodoItem,
            onData: (items) => {
                if (!isMounted) return;
                items.sort((a, b) => b.createdAt - a.createdAt);
                setTodos(items);
                setLastError(null);
                if (!hasLoaded) {
                    setIsLoading(false);
                    hasLoaded = true;
                }
            },
            onError: (message) => {
                if (!isMounted) return;
                setLastError(message);
                showError('Failed to load todos', message);
                setIsLoading(false);
            }
        });

        return () => {
            isMounted = false;
            unsubscribe();
        };
    }, [user, showError]);  // ✅ Added showError to dependency array

    const clearError = () => setLastError(null);

    const retryLastOperation = () => {
        if (lastFailedOperation) {
            lastFailedOperation();
            setLastFailedOperation(null);
        }
    };

    const addTodo = async (text: string) => {
        if (!user) return;
        
        const operation = async () => {
            setIsSaving(true);
            showInfo('Adding todo...', 'Creating new task');
            
            try {
                const newTodo: Omit<TodoItem, 'id'> & { userId: string } = {
                    text,
                    completed: false,
                    createdAt: Date.now(),
                    userId: user.uid
                };
                const docRef = await addDoc(collection(db, TODOS_COLLECTION), newTodo);
                setTodos(prev => [{ text, completed: false, createdAt: Date.now(), id: docRef.id }, ...prev]);
                showSuccess('Todo added', 'New task created successfully');
                setLastError(null);
            } catch (error) {
                const errorMessage = getErrorMessage(error);
                logError(error, 'Add Todo');
                setLastError(errorMessage);
                showError('Failed to add todo', errorMessage);
                
                // Store operation for retry if it's retriable
                if (isRetriableError(error)) {
                    setLastFailedOperation(() => () => addTodo(text));
                }
                throw error;
            } finally {
                setIsSaving(false);
            }
        };

        try {
            await retryWithBackoff(operation, 3, 1000);
        } catch {
            // Error already handled in operation
        }
    };

    const toggleTodo = async (id: string) => {
        if (!user) return; // Auth guard
        const operation = async () => {
            setIsSaving(true);
            
            try {
                const todo = todos.find(t => t.id === id);
                if (todo) {
                    await updateDoc(doc(db, TODOS_COLLECTION, id), { completed: !todo.completed });
                    setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
                    
                    const action = todo.completed ? 'marked as incomplete' : 'completed';
                    showSuccess('Todo updated', `Task ${action}`);
                    setLastError(null);
                }
            } catch (error) {
                const errorMessage = getErrorMessage(error);
                logError(error, 'Toggle Todo');
                setLastError(errorMessage);
                showError('Failed to update todo', errorMessage);
                
                // Store operation for retry if it's retriable
                if (isRetriableError(error)) {
                    setLastFailedOperation(() => () => toggleTodo(id));
                }
                throw error;
            } finally {
                setIsSaving(false);
            }
        };

        try {
            await retryWithBackoff(operation, 3, 1000);
        } catch {
            // Error already handled in operation
        }
    };

    const deleteTodo = async (id: string) => {
        if (!user) return; // Auth guard
        const operation = async () => {
            setIsSaving(true);
            showInfo('Deleting...', 'Removing task');
            
            try {
                await deleteDoc(doc(db, TODOS_COLLECTION, id));
                setTodos(prev => prev.filter(t => t.id !== id));
                showSuccess('Todo deleted', 'Task removed successfully');
                setLastError(null);
            } catch (error) {
                const errorMessage = getErrorMessage(error);
                logError(error, 'Delete Todo');
                setLastError(errorMessage);
                showError('Failed to delete todo', errorMessage);
                
                // Store operation for retry if it's retriable
                if (isRetriableError(error)) {
                    setLastFailedOperation(() => () => deleteTodo(id));
                }
                throw error;
            } finally {
                setIsSaving(false);
            }
        };

        try {
            await retryWithBackoff(operation, 3, 1000);
        } catch {
            // Error already handled in operation
        }
    };

    return (
        <TodoContext.Provider value={{ 
            todos, 
            isLoading, 
            isSaving,
            lastError,
            addTodo, 
            toggleTodo, 
            deleteTodo,
            clearError,
            retryLastOperation
        }}>
            {children}
        </TodoContext.Provider>
    );
};

