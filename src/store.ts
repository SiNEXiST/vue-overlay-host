import { Module, Store } from 'vuex';

import { EntrySetting, OverlayHostState, PluginSettings, RemoveRequest, ShowOptions, ShowResponse, FinalShowOptions } from './common';

function validateShowOptions(options: ShowOptions, defaultTimeout: number): FinalShowOptions {
    if (options == null || typeof options !== 'object') {
        throw new TypeError('The Settings have to be specified!');
    }

    if (
        !options.hasOwnProperty('component') ||
        options.component == null ||
        (typeof options !== 'string' && typeof options !== 'object')
    ) {
        throw new TypeError('The Settings does not have a valid component property!');
    }

    // Default the Overlay-Settings to an object
    if (typeof options.overlay === 'boolean') {
        options.overlay = {
            show: options.overlay,
            closeOnClick: true
        };
        // Default it to not show an overlay
    } else if (options.overlay == null || typeof options.overlay !== 'object') {
        options.overlay = {
            show: false,
            closeOnClick: false
        };
    }

    // Default the timeout to -1 (deactivating it)
    if (typeof options.timeout !== 'number' || isNaN(options.timeout) || !isFinite(options.timeout)) {
        options.timeout = defaultTimeout;
    }

    // Default the closeOnEscape to true
    if (typeof options.closeOnEscape  !== 'boolean') {
        options.closeOnEscape = true;
    }

    return options as FinalShowOptions;
}

function validateRemoveRequest(payload: number | RemoveRequest): RemoveRequest {
    if (typeof payload === 'number') {
        payload = { id: payload };
    }
    return payload;
}

function removeEntryFromStore(store: Store<OverlayHostState>, id: number): false | EntrySetting {
    let removed = false;
    let removedItem = null;
    const workItems = [...store.state.items];

    for (let i = 0; i < workItems.length; i++) {
        const item = workItems[i];
        if (item.id === id) {
            clearTimeout(item.timeoutId);
            workItems.splice(i, 1);
            removed = true;
            removedItem = item;
            break;
        }
    }

    if (removed) {
        store.commit('setItems', workItems);
        return removedItem as EntrySetting;
    }

    return false;
}

export function createModule(pluginSettings: PluginSettings): Module<OverlayHostState, any> {
    if (typeof pluginSettings === 'number') {
        pluginSettings = {
            timeout: pluginSettings
        };
    } else if (pluginSettings == null || typeof pluginSettings !== 'object' || Array.isArray(pluginSettings)) {
        // Apply default
        pluginSettings = {};
    }

    const defaultTimeout = pluginSettings.timeout == null ? -1 : pluginSettings.timeout;

    const state: OverlayHostState = {
        items: [],
        idCounter: 0
    };

    const mutations = {
        setItems(state: OverlayHostState, items: EntrySetting[]) {
            state.items = items;
        },
        increaseCounter(state: OverlayHostState) {
            state.idCounter++;
        }
    };

    const actions = {
        show(store: Store<OverlayHostState>, options: ShowOptions): Promise<ShowResponse> {
            let resolve = () => {};
            let reject = () => {};
            const promise = new Promise<RemoveRequest>((re, rj) => {
                resolve = re;
                reject = rj;
            });
            const id = store.state.idCounter;
            store.commit('increaseCounter');

            const item: EntrySetting = {
                id,
                resolver: resolve,
                rejector: reject,
                settings: validateShowOptions(options, defaultTimeout),
            };

            if (item.settings.timeout != null && item.settings.timeout > 0) {
                item.timeoutId = setTimeout(() => {
                    store.dispatch('close', { id: item.id, origin: 'timeout' } as RemoveRequest);
                }, item.settings.timeout);
            }

            // Clone the items and push the new Item onto it
            // Then commit it to the store
            const workItems = [...store.state.items];
            workItems.push(item);
            store.commit('setItems', workItems);

            return Promise.resolve({
                id,
                promise,
                close: (value?: any, origin?: string) =>
                    store.dispatch('close', { id, value, origin } as RemoveRequest),
                abort: (value?: any, origin?: string) => store.dispatch('abort', { id, value, origin } as RemoveRequest)
            });
        },
        close(store: Store<OverlayHostState>, payload: RemoveRequest): Promise<boolean> {
            payload = validateRemoveRequest(payload);
            const didRemoveElement = removeEntryFromStore(store, payload.id);

            if (!didRemoveElement) {
                return Promise.resolve(false);
            }

            didRemoveElement.resolver({ value: payload.value, origin: payload.origin });
            return Promise.resolve(true);
        },
        abort(store: Store<OverlayHostState>, payload: RemoveRequest): Promise<boolean> {
            payload = validateRemoveRequest(payload);
            const didRemoveElement = removeEntryFromStore(store, payload.id);

            if (!didRemoveElement) {
                return Promise.resolve(false);
            }

            didRemoveElement.rejector({ value: payload.value, origin: payload.origin });
            return Promise.resolve(true);
        }
    };

    return {
        namespaced: true,
        state,
        mutations,
        actions: actions as any,
    };
}
