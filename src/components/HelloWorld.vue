<template>
  <div class="hello">
    <h1>Vue Overlay Host</h1>
    <button @click="showToast">Show Toast</button>
  </div>
</template>

<script>
export default {
  name: "HelloWorld",
  methods: {
    showToast() {
      this.$store.dispatch("overlay-host/show", {
        component: "toast",
        overlay: {
          show: true,
          closeOnClick: true
        },
        timeout: -1,
        closeOnEscape: true,
        props: {
          title: "Hello World!",
          message:
            "This is an example of a simple Toast implementation using Vue Overlay Host!"
        }
      });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
