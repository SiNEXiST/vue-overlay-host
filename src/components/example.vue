<template>
  <div class="example">
    <h1>Overlay Host</h1>
    <h3>Example</h3>
    <button @click="showToast">Show Toast</button>
  </div>
</template>

<script>
export default {
    name: 'example',
    methods: {
        showToast() {
            this.$store
                .dispatch('overlay-host/show', {
                    component: 'toast',
                    overlay: {
                        show: true,
                        closeOnClick: true
                    },
                    timeout: -1,
                    closeOnEscape: true,
                    props: {
                        title: 'Hello World!',
                        message: 'This is an example of a simple Toast implementation using the Overlay Host!'
                    }
                })
                .then(obj => {
                    console.log('opened toast!', obj);
                    setTimeout(() => obj.close('closed after timeout!', 'timeout'), 3000);
                    return obj.promise;
                })
                .then(res => console.log(res));
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
    margin: 10px 0 20px;
}

a {
    color: #42b983;
}

button {
    padding: 10px 20px;
    background-color: #42b983;
    border: 2px solid #2c3e50;
    border-bottom: none;
    outline: none;
    font-size: 16px;
}
</style>
