import OverlayHost from './components/OverlayHost';
import store from './store';

export { OverlayHost };
export function OverlayHostPlugin(vuex, settings) {
    vuex.registerModule('overlay-host', store(settings));
}
