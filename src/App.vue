<template>
    <div id="app">
        <Search/>
        <img src="@/assets/powered-by-rectangle-green.png" style="width: 150px;position: absolute;left: 10px;bottom: 10px;">
    </div>
</template>

<script>
    import Search from './components/Search.vue'

    export default {
        name: 'app',
        components: {
            Search
        }
    }
</script>

<style lang="scss">
    html, body {
        margin: 0;
        padding: 0;
        background-color: #000000;
        color: #ffffff;
        height: 100%;
    }

    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;

        height: 100%;

        display: flex;
        align-items: flex-start;
        justify-content: center;

        background-image: linear-gradient(rgba(0, 0, 0, 0.9) 15%, rgba(0, 0, 0, 0.2) 60%, rgba(0, 0, 0, 0.95) 90%);
    }
</style>
