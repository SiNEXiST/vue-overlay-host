<template>
  <v-container class="example">
    <h1>Overlay Host</h1>
    <h2>Example</h2>

    <v-layout mt-3 row wrap>
        <v-flex md8 pa-3 class="settings">
            <v-card>
                <v-card-title>
                    <div class="headline">Options</div>
                </v-card-title>

                <v-card-text>
                    <v-checkbox
                        v-model="settings.overlay.show"
                        label="Show Overlay"
                    />
                    <v-checkbox
                        v-model="settings.overlay.closeOnClick"
                        :disabled="!settings.overlay.show"
                        label="Close overlay on click"
                    />
                    <v-checkbox
                        v-model="doTimeout"
                        label="Use timeout"
                    />
                    <v-slider
                        v-model="settings.timeout"
                        :disabled="!doTimeout"
                        :messages="[(this.settings.timeout / 1000) + 's']"
                        thumb-label
                        min="0"
                        max="10000"
                        step="100"
                        label="Timeout"
                    />
                    <v-checkbox
                        v-model="settings.closeOnEscape"
                        label="Close on Escape"
                    />
                    <v-text-field
                        v-model="settings.props.title"
                        label="Toast Title"
                    />
                    <v-textarea
                        v-model="settings.props.message"
                        label="Toast Message"
                    />
                </v-card-text>
            </v-card>
        </v-flex>

        <v-flex md4 pa-3>
            <v-layout column>
                <v-flex xs-12 pb-3>
                    <v-card>
                        <v-card-title>
                            <div class="headline">Toast Settings</div>
                        </v-card-title>

                        <v-card-text>
                            <pre class="output">{{ finalSettings }}</pre>
                        </v-card-text>
                    </v-card>
                </v-flex>
                
                <v-flex xs-12 pt-3>
                    <v-card>
                        <v-card-title>
                            <div class="headline">Log</div>
                        </v-card-title>

                        <v-card-text>
                            <pre class="log">{{ log }}</pre>
                        </v-card-text>
                    </v-card>
                </v-flex>
            </v-layout>
        </v-flex>
    </v-layout>

    <v-btn depressed class="show-toast-btn" color="primary" @click="showToast">Show Toast</v-btn>
  </v-container>
</template>

<script>
export default {
    name: 'example',
    data() {
        return {
            doTimeout: true,
            log: '',
            settings: {
                overlay: {
                    show: true,
                    closeOnClick: true
                },
                timeout: 3000,
                closeOnEscape: true,
                props: {
                    title: 'Hello World!',
                    message: 'This is an example of a simple Toast implementation using the Overlay Host!'
                }
            }
        };
    },
    computed: {
        finalSettings() {
            return {
                ...this.settings,
                timeout: this.doTimeout ? this.settings.timeout : -1,
            };
        }
    },
    methods: {
        showToast() {
            if (this.log !== '') {
                this.log += '\n';
            }
            this.$store
                .dispatch('overlay-host/show', {
                    ...this.finalSettings,
                    component: 'toast'
                })
                .then(obj => {
                    this.log += 'Opened Toast: ' + JSON.stringify(obj);
                    return obj.promise;
                })
                .then(res => {
                    this.log += '\nToast closed: ' + JSON.stringify(res);
                });
        }
    }
};
</script>

<style lang="scss">
img {
    display: block;
    margin: 0 auto;
}

h1,
h2 {
    text-align: center;
}

.output {
    white-space: pre-wrap;
}

.show-toast-btn {
    display: block;
    margin: 16px auto;
}
</style>
