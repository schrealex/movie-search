<template>
  <div id="app">
    <Search/>
    <img class="moviedb-logo" src="@/assets/powered-by-rectangle-green.png"/>
    <img class="moviedb-small-logo" src="@/assets/tmdb.png"/>
  </div>
</template>

<script>
import Search from './components/Search.vue';

export default {
  name: 'app',
  components: {
    Search
  }
};
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

  @media screen and (max-width: 992px) {
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    margin-top: 20px;
  }

  background-image: linear-gradient(rgba(0, 0, 0, 0.9) 15%, rgba(0, 0, 0, 0.2) 60%, rgba(0, 0, 0, 0.95) 90%);
}

.moviedb-logo {
  width: 150px;
  position: absolute;
  left: 10px;
  bottom: 10px;

  @media screen and (max-width: 992px) {
    display: none;
  }
}

.moviedb-small-logo {
  width: 50px;
  position: absolute;
  right: 10px;
  top: 10px;

  @media screen and (min-width: 991px) {
    display: none;
  }

  @media screen and (max-width: 530px) {
    display: none;
  }
}

::-webkit-scrollbar {
  width: 10px;
}

/* Track */
::-webkit-scrollbar-track {
  background: rgba(128, 128, 128, 0.4);
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: rgba(128, 128, 128, 0.8);
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: gold;
}

ul {
  list-style: none;
}

span {
  display: block;
}

a {
  text-decoration: none;
  color: #ffffff;

  &:active, &:visited {
    color: #ffffff;
  }
}

</style>
