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

<style>
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

        background-image: linear-gradient(rgba(0, 0, 0, 0.85) 15%, rgba(0, 0, 0, 0.2) 40%, rgba(0, 0, 0, 1) 90%);
    }
</style>
