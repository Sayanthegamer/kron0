import type { TodoItem } from './index';

export interface TodoContextType {
    todos: TodoItem[];
    isLoading: boolean;
    isSaving: boolean;
    lastError: string | null;
    addTodo: (text: string) => Promise<void>;
    toggleTodo: (id: string) => Promise<void>;
    deleteTodo: (id: string) => Promise<void>;
    clearError: () => void;
    retryLastOperation: () => void;
}
