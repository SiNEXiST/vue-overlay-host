<template>
    <div class="overlay-host">
        <transition>
            <div v-if="showOverlay" class="overlay" @click.prevent="overlayClick"></div>
        </transition>

        <transition-group tag="div" class="elements">
            <template v-for="item in items">
                <component
                    :key="item.id"
                    :is="item.settings.component"
                    :class="item.settings.class"
                    v-bind="item.settings.props"
                />
            </template>
        </transition-group>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { namespace } from 'vuex-class';

import { NAMESPACE_NAME, EntrySetting } from '../common';

const moduleNamespace = namespace(NAMESPACE_NAME);

@Component({
    name: 'overlay-host'
})
export default class OverlayHost extends Vue {
    /**
     * Flag if the Overlay (behind the elements) should be shown.
     */
    public showOverlay = false;

    @moduleNamespace.State('items')
    public items: EntrySetting[];

    /**
     * Handle of the store-watcher which should be removed once the
     * component is getting destroyed.
     */
    // tslint:disable-next-line:no-empty
    private storeWatcher() { }

    created() {
        this.storeWatcher = this.$store.watch(state => state[NAMESPACE_NAME].items, () => this.itemsChange(), {
            deep: true
        });
        window.addEventListener('keydown', event => {
            this.handleWindowKeydown(event);
        });
    }

    beforeDestroy() {
        if (this.storeWatcher != null) {
            this.storeWatcher();
        }
        window.removeEventListener('keydown', event => {
            this.handleWindowKeydown(event);
        });
    }

    itemsChange() {
        this.showOverlay = false;
        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i].settings.overlay.show) {
                this.showOverlay = true;
                break;
            }
        }
    }

    overlayClick() {
        this.removeLast('click');
    }

    handleWindowKeydown(event: KeyboardEvent) {
        if (event.key === 'Escape' || event.keyCode === 27) {
            event.preventDefault();
            this.removeLast('escape');
        }
    }

    removeLast(origin: 'click' | 'escape') {
        // No items to iterate over
        if (this.items.length <= 0) {
            return;
        }
        let removed = false;

        // Clone the items to be able to edit it
        const workItems = [...this.items];

        // Iterate over the array in reverse to get the latestly added item
        // which should be closed on escape
        for (let i = workItems.length - 1; i >= 0; i--) {
            const item = workItems[i];
            if (
                (origin === 'click' && (!item.settings.overlay.show || !item.settings.overlay.closeOnClick)) ||
                (origin === 'escape' && !item.settings.closeOnEscape)
            ) {
                continue;
            }

            clearTimeout(item.timeoutId);
            item.resolver({ value: undefined, origin });
            workItems.splice(i, 1);
            removed = true;
            break;
        }

        if (removed) {
            this.$store.commit(`${NAMESPACE_NAME}/setItems`, workItems);
        }
    }
}
</script>

<style>
.overlay-host {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 999;
    pointer-events: none;
    background: none;
    overflow: hidden;
}

.overlay {
    width: 100%;
    height: 100%;
    position: absolute;
    pointer-events: all;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.175);
    z-index: 1000;
    opacity: 1;
}

.overlay.v-enter,
.overlay.v-leave-to {
    opacity: 0;
}

.overlay.v-enter-to,
.overlay.v-leave {
    opacity: 1;
}

.overlay.v-enter-active,
.overlay.v-leave-active {
    transition: 350ms;
}
</style>
