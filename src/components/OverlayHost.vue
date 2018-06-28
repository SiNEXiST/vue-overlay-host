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

<script>
import { mapState } from 'vuex';

export default {
    name: 'overlay-host',
    created() {
        this.storeWatcher = this.$store.watch(
            state => state['overlay-host'].items,
            this.itemsChange,
            {
                deep: true
            }
        );
        window.addEventListener('keydown', this.handleWindowKeydown);
    },
    beforeDestroy() {
        if (this.storeWatcher != null) {
            this.storeWatcher();
        }
        window.removeEventListener('keydown', this.handleWindowKeydown);
    },
    data() {
        return {
            storeWatcher: null,
            showOverlay: false
        };
    },
    computed: {
        ...mapState('overlay-host', ['items'])
    },
    methods: {
        itemsChange() {
            this.showOverlay = false;
            for (let i = 0; i < this.items.length; i++) {
                if (this.items[i].settings.overlay.show) {
                    this.showOverlay = true;
                    break;
                }
            }
        },
        overlayClick() {
            this.removeLast('click');
        },
        handleWindowKeydown(event) {
            if (event.key === 'Escape' || event.keyCode === 27) {
                event.preventDefault();
                this.removeLast('escape');
            }
        },
        removeLast(origin) {
            // No items to iterate over
            if (this.items.length <= 0) {
                return;
            }
            let removed = false;

            // Iterate over the array in reverse to get the latestly added item
            // which should be closed on escape
            for (let i = this.items.length - 1; i >= 0; i--) {
                const item = this.items[i];
                if (!item.settings.overlay.show ||
                    (origin === 'escape' && !item.settings.closeOnEscape) ||
                    (origin === 'click' && !item.settings.overlay.closeOnClick)
                ) {
                    continue;
                }

                clearTimeout(item.timeoutId);
                item.resolver({ value: undefined, origin });
                this.items.splice(i, 1);
                removed = true;
                break;
            }

            if (removed) {
                this.$store.commit('overlay-host/setItems', this.items);
            }
        }
    }
};
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
    background: rgba(0,0,0,0.175);
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
