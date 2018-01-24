<template>
    <div class="toast">
        <h1>{{ title }}</h1>
        <p>{{ message }}</p>
    </div>
</template>

<script>
export default {
    props: ['title', 'message']
}
</script>

<style>
.toast {
    position: absolute;
    right: 15px;
    top: 20px;
    background: rgb(230, 141, 68);
    transform: translateX(0);
    z-index: 1050;
}

.toast h1 {
    margin: 0;
    font-size: 18px;
    padding: 5px 15px;
    text-align: center;
    display: block;
}

.toast p {
    margin: 0;
    font-size: 14px;
    padding: 10px 15px;
    display: inline-block;
}

.toast.v-enter,
.toast.v-leave-to {
    transform: translateX(200%);
}

.toast.v-enter-to,
.toast.v-leave {
    transform: translateX(0);
}

.toast.v-enter-active,
.toast.v-leave-active {
    transition: 1s;
}
</style>
