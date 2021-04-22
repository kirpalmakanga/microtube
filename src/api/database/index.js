class Database {
    client = null;

    init = async () => {
        if (!this.client) {
            try {
                const { default: client } = await import('./init');

                this.client = client;
            } catch (error) {
                console.error(new Error('Database connection failed'));
                console.error(error);
            }
        }
    };

    signIn = async (idToken, accessToken) => {
        await this.init();

        return this.client.signIn(idToken, accessToken);
    };

    signOut = async () => {
        await this.init();

        this.client.signOut();
    };

    set = async (path, data) => {
        await this.init();

        return this.client.set(path, data);
    };

    subscribe = async (path, callback = () => {}) => {
        await this.init();

        return this.client.subscribe(path, callback);
    };
}

export default new Database();
