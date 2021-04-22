import { initializeApp } from 'firebase/app';
import {
    getAuth,
    GoogleAuthProvider,
    signInWithCredential,
    signOut
} from 'firebase/auth';
import { getDatabase, ref, set, onValue, off } from 'firebase/database';

import { FIREBASE_CONFIG } from '../../config/api';

initializeApp(FIREBASE_CONFIG);

export default {
    signIn: (idToken, accessToken) => {
        const auth = getAuth();
        const credential = GoogleAuthProvider.credential(idToken, accessToken);

        return signInWithCredential(auth, credential);
    },
    signOut: () => {
        const auth = getAuth();

        return signOut(auth);
    },
    set: (path, data) => {
        const db = getDatabase();

        return set(ref(db, path), data);
    },
    subscribe: (path, callback) => {
        const reference = ref(getDatabase(), path);
        const handler = (snapshot) => callback(snapshot.val() || undefined);

        onValue(reference, handler);

        return () => off(ref, 'value', handler);
    }
};
