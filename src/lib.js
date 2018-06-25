import OverlayHost from './components/overlay-host';
import store from './store';

export { OverlayHost };
export function OverlayHostPlugin(vuex, settings) {
    vuex.registerModule('overlay-host', store(settings));
}
