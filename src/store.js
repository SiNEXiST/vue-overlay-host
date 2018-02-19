export default function (pluginSettings) {
    if (typeof pluginSettings === 'number') {
        pluginSettings = {
            timeout: pluginSettings
        };
    } else if (
        pluginSettings == null ||
        typeof pluginSettings !== 'object' ||
        Array.isArray(pluginSettings)
    ) {
        // Apply default
        pluginSettings = {};
    }
    const defaultTimeout = pluginSettings.timeout | 5000;

    return {
        namespaced: true,
        state: {
            items: [],
            idCounter: 0
        },
        mutations: {
            setItems(state, items) {
                state.items = items;
            },
            increaseCounter(state) {
                state.idCounter++;
            }
        },
        actions: {
            show: (store, settings) => {
                if (settings == null || typeof settings !== 'object') {
                    new TypeError('The Settings have to be specified!');
                    return;
                }
                if (
                    !settings.hasOwnProperty('component') ||
                    settings.component == null ||
                    (typeof settings !== 'string' &&
                        typeof settings !== 'object')
                ) {
                    new TypeError('The Settings does not have a valid component property!');
                    return;
                }

                if (typeof settings.overlay !== 'object' || settings.overlay == null) {
                    const overlay = {
                        show: !!settings.overlay,
                        closeOnClick: true
                    };
                } else {
                    settings.overlay = {
                        show: false,
                        closeOnClick: true,
                        ...settings.overlay
                    };
                }

                let resolve = () => {};
                let reject = () => {};
                const promise = new Promise((re, rj) => {
                    resolve = re;
                    reject = rj;
                });
                const id = store.state.idCounter;
                store.commit('increaseCounter');

                const item = {
                    id,
                    resolver: resolve,
                    rejector: reject,
                    settings: {
                        timeout: defaultTimeout,
                        closeOnEscape: true,
                        class: null,
                        props: {},
                        ...settings
                    }
                };

                if (item.settings.timeout > 0) {
                    item.timeoutId = setTimeout(() => {
                        store.dispatch('close', item.id);
                    }, item.settings.timeout);
                }
                const items = store.state.items;
                items.push(item);
                store.commit('setItems', items);

                return {
                    id,
                    promise,
                    close: (value, origin) => store.dispatch('close', {
                        id,
                        value,
                        origin
                    }),
                };
            },
            close: (store, payload) => {
                if (typeof payload === 'string') {
                    payload = { id: payload };
                }
                const { id, value, origin } = payload;
                return new Promise((resolve, reject) => {
                    let removed = false;
                    const items = store.state.items;

                    for (let i = 0; i < items.length; i++) {
                        const item = items[i];
                        if (item.id === id) {
                            clearTimeout(item.timeoutId);
                            item.resolver({ value, origin });
                            items.splice(i, 1);
                            removed = true;
                            break;
                        }
                    }

                    if (removed) {
                        store.commit('setItems', items);
                    } else {
                        reject();
                    }

                    resolve(removed);
                });
            },
        }
    };
}
