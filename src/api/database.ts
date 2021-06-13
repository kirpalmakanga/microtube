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

class Database {
    async signIn(idToken: string, accessToken: string) {
        const auth = getAuth();
        const credential = GoogleAuthProvider.credential(idToken, accessToken);

        return signInWithCredential(auth, credential);
    }

    async signOut() {
        const auth = getAuth();

        return signOut(auth);
    }

    async set(path: string, data: string | object) {
        const db = getDatabase();

        return set(ref(db, path), data);
    }

    async subscribe(path: string, callback: Function) {
        const reference = ref(getDatabase(), path);
        const handler = (snapshot: DataSnapshot) =>
            callback(snapshot.val() || undefined);

        onValue(reference, handler);

        return () => off(reference, 'value', handler);
    }
}

export default new Database();
