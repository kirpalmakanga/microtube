import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

import { FIREBASE_CONFIG } from '../../config/api';

firebase.initializeApp(FIREBASE_CONFIG);

export default firebase;
