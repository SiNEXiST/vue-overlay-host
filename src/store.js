function validateSettings(settings) {
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
        settings.overlay = {
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

    return settings;
}

function removeItem(store, payload) {
    if (typeof payload === 'string') {
        payload = { id: payload };
    }
    const { id, value, origin } = payload;
    let removed = false;
    let removedItem = null;
    const items = store.state.items;

    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.id === id) {
            clearTimeout(item.timeoutId);
            items.splice(i, 1);
            removed = true;
            removedItem = item;
            break;
        }
    }

    if (removed) {
        store.commit('setItems', items);
    }

    return {
        id,
        value,
        origin,
        removed,
        item: removedItem
    };
}

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
            show(store, settings) {
                settings = validateSettings(settings);

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
                        ...settings
                    }
                };

                if (item.settings.timeout > 0) {
                    item.timeoutId = setTimeout(() => {
                        store.dispatch('close', { id: item.id, origin: 'timeout' });
                    }, item.settings.timeout);
                }
                const items = store.state.items;
                items.push(item);
                store.commit('setItems', items);

                return {
                    id,
                    promise,
                    close: (value, origin) => store.dispatch('close', { id, value, origin }),
                    abort: (value, origin) => store.dispatch('abort', { id, value, origin }),
                }
            },
            close(store, payload) {
                const res = removeItem(store, payload);
                const { removed, item, value, origin } = res;
                if (removed) {
                    item.resolver({ value, origin });
                }
                return removed;
            },
            abort(store, payload) {
                const res = removeItem(store, payload);
                const { removed, item, value, origin } = res;
                if (removed) {
                    item.rejector({ value, origin });
                }
                return removed;
            }
        }
    };
}
