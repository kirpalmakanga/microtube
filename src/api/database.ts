import { DataSnapshot } from 'firebase/database/dist/database/index';

import { initializeApp } from 'firebase/app';
import {
    getAuth,
    GoogleAuthProvider,
    signInWithCredential,
    signOut
} from 'firebase/auth';
import { getDatabase, ref, set, onValue, off } from 'firebase/database';

import { FIREBASE_CONFIG } from '../config/api';

initializeApp(FIREBASE_CONFIG);

const getRef = (path: string) => ref(getDatabase(), path);

export const signIntoDatabase = (idToken: string, accessToken: string) => {
    const auth = getAuth();
    const credential = GoogleAuthProvider.credential(idToken, accessToken);

    return signInWithCredential(auth, credential);
};

export const signOutOfDatabase = () => {
    const auth = getAuth();

    return signOut(auth);
};

export const saveData = async (path: string, data: string | object) =>
    set(getRef(path), data);

export const subscribeToData = (path: string, callback: Function) => {
    const reference = getRef(path);
    const handler = (snapshot: DataSnapshot) =>
        callback(snapshot.val() || undefined);

    onValue(reference, handler);

    return () => {
        off(reference, 'value', handler);
    };
};
