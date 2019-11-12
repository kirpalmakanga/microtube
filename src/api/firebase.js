import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

import { FIREBASE_CONFIG } from '../config/api';

import { throttle } from '../lib/helpers';

firebase.initializeApp(FIREBASE_CONFIG);

const getRef = (path) => firebase.database().ref(path);

export const signIn = (idToken, accessToken) => {
    const credential = firebase.auth.GoogleAuthProvider.credential(
        idToken,
        accessToken
    );

    return firebase.auth().signInWithCredential(credential);
};

export const signOut = () => firebase.auth().signOut();

export const get = async (path) => {
    const snapshot = await getRef(path).once('value');

    return snapshot.val();
};

export const set = (path, data) => getRef(path).set(data);

export const listen = (path, callback = () => {}) =>
    getRef(path).on(
        'value',
        throttle((snapshot) => callback(snapshot.val() || undefined), 200)
    );