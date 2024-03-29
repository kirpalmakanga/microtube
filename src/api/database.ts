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

export const signIntoDatabase = (idToken: string, accessToken: string) =>
    signInWithCredential(
        getAuth(),
        GoogleAuthProvider.credential(idToken, accessToken)
    );

export const signOutOfDatabase = () => signOut(getAuth());

export const saveData = async (path: string, data: string | object) =>
    set(getRef(path), data);

export const subscribeToData = (path: string, callback: Function) => {
    const reference = getRef(path);
    const handler = (snapshot: DataSnapshot) =>
        callback(snapshot.val() || undefined);

    onValue(reference, handler);

    return () => off(reference, 'value', handler);
};
