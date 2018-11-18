import runtime from 'offline-plugin/runtime';

runtime.install({
    onUpdateReady() {
        console.log('App update ready');
        runtime.applyUpdate();
    },

    onUpdated() {
        console.log('App updated');
        location.reload();
    }
});
