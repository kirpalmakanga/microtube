import { debounce } from '../../lib/helpers';

class Database {
    db = null;

    init = async () => {
        if (!this.db) {
            try {
                const { default: db } = await import('./init');

                this.db = db;
            } catch (error) {}
        }
    };

    signIn = async (idToken, accessToken) => {
        await this.init();

        const credential = this.db.auth.GoogleAuthProvider.credential(
            idToken,
            accessToken
        );

        return this.db.auth().signInWithCredential(credential);
    };

    signOut = async () => {
        await this.init();

        this.db.auth().signOut();
    };

    getRef = async (path) => {
        await this.init();

        return this.db.database().ref(path);
    };

    get = async (path) => {
        const ref = await this.getRef(path);
        const snapshot = ref.once('value');

        return snapshot.val();
    };

    set = async (path, data) => {
        const ref = await this.getRef(path);

        return ref.set(data);
    };

    listen = async (path, callback = () => {}) => {
        const ref = await this.getRef(path);

        ref.on(
            'value',
            debounce((snapshot) => callback(snapshot.val() || undefined), 200)
        );
    };
}

export default new Database();
