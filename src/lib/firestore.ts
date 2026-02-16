import { db } from './firebase';
import {
    collection,
    query,
    where,
    getDocs,
    onSnapshot,
    writeBatch,
    doc as firestoreDoc,
    type QueryConstraint,
    type DocumentData,
    type QuerySnapshot,
    type Unsubscribe
} from 'firebase/firestore';
import { getErrorMessage, logError } from './errors';

/**
 * Build a user-scoped query for a given top-level collection.
 * Ensures every query is filtered by userId.
 */
export const buildUserCollectionQuery = (
    collectionName: string,
    userId: string,
    ...constraints: QueryConstraint[]
) => {
    const baseRef = collection(db, collectionName);
    const userConstraint = where('userId', '==', userId);
    return query(baseRef, userConstraint, ...constraints);
};

/**
 * Map a Firestore query snapshot to a strongly-typed array.
 */
export const mapSnapshot = <T>(
    snapshot: QuerySnapshot<DocumentData>,
    mapFn: (data: DocumentData & { id: string }) => T
): T[] => {
    return snapshot.docs.map((doc) =>
        mapFn({
            id: doc.id,
            ...(doc.data() as DocumentData)
        })
    );
};

/**
 * Fetch a user-scoped collection once using getDocs.
 */
export const fetchUserCollection = async <T>(
    collectionName: string,
    userId: string,
    mapFn: (data: DocumentData & { id: string }) => T,
    ...constraints: QueryConstraint[]
): Promise<T[]> => {
    const q = buildUserCollectionQuery(collectionName, userId, ...constraints);
    const snapshot = await getDocs(q);
    return mapSnapshot(snapshot, mapFn);
};

interface ListenToUserCollectionParams<T> {
    collectionName: string;
    userId: string;
    mapFn: (data: DocumentData & { id: string }) => T;
    onData: (items: T[]) => void;
    onError?: (message: string) => void;
    constraints?: QueryConstraint[];
}

/**
 * Subscribe to a user-scoped collection with real-time updates.
 */
export const listenToUserCollection = <T>({
    collectionName,
    userId,
    mapFn,
    onData,
    onError,
    constraints = []
}: ListenToUserCollectionParams<T>): Unsubscribe => {
    const q = buildUserCollectionQuery(collectionName, userId, ...constraints);

    return onSnapshot(
        q,
        (snapshot) => {
            const items = mapSnapshot(snapshot, mapFn);
            onData(items);
        },
        (error) => {
            logError(error, `Listen ${collectionName}`);
            if (onError) {
                onError(getErrorMessage(error));
            }
        }
    );
};

/**
 * Delete all documents for a user across a set of collections,
 * using batched writes and handling the 500-op Firestore limit.
 */
export const deleteUserDataAcrossCollections = async (
    collectionNames: string[],
    userId: string
): Promise<void> => {
    const BATCH_LIMIT = 500;

    for (const collectionName of collectionNames) {
        const q = buildUserCollectionQuery(collectionName, userId);
        const snapshot = await getDocs(q);

        if (snapshot.empty) continue;

        let batch = writeBatch(db);
        let opCount = 0;

        for (const docSnap of snapshot.docs) {
            batch.delete(firestoreDoc(db, collectionName, docSnap.id));
            opCount++;

            if (opCount === BATCH_LIMIT) {
                await batch.commit();
                batch = writeBatch(db);
                opCount = 0;
            }
        }

        if (opCount > 0) {
            await batch.commit();
        }
    }
};

