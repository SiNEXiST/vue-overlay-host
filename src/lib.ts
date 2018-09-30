import { Store } from 'vuex';

import { PluginSettings, NAMESPACE_NAME } from './common';
import OverlayHost from './components/OverlayHost.vue';
import { createModule } from './store';

export * from './common';
export { OverlayHost };
export function OverlayHostPlugin(store: Store<any>, settings: PluginSettings) {
    store.registerModule(NAMESPACE_NAME, createModule(settings));
}
