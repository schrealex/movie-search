<template>
  <div class="popular-movies">
    <div v-if="loading">Loading...</div>

    <div class="popular-movies">
      <div v-for="movie in popularMovies" :key="movie.id" class="movie"
           @click="$emit('getMediaInformation', 'movie', movie.id)">
        <img :src="getImageUrl('w154', movie.poster_path)">
        <span class="movie-title">{{ movie.title }}</span>
        <span class="movie-rating">{{ movie.vote_average }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import utils from '@/util/utils';

export default {
  name: 'PopularMovies',
  data() {
    return {
      popularMovies: [],
      loading: false,
      screenWidth: 0,
    };
  },
  created() {
    this.getImageUrl = utils.getImageUrl;
  },
  mounted() {
    window.addEventListener('resize', () => {
      this.screenWidth = window.innerWidth;
    });
    this.screenWidth = window.innerWidth;

    this.getPopularMovies();
  },
  computed: {
    isLargeScreen() {
      return this.screenWidth > 1200;
    },
    isSmallScreen() {
      return this.screenWidth > 930 && this.screenWidth <= 1200;
    },
    isMobileScreen() {
      return this.screenWidth > 700 && this.screenWidth <= 930;
    },
    isSmallMobileScreen() {
      return this.screenWidth !== 0 && this.screenWidth <= 700;
    },
  },
  methods: {
    getPopularMovies() {
      axios
          .get(`https://api.themoviedb.org/3/discover/movie?api_key=${process.env.VUE_APP_API_KEY}&query=${this.searchTerm}&language=en-US&page=1&sort_by=popularity.desc&include_adult=${this.adult}`)
          .then(response => {
            // eslint-disable-next-line no-console
            console.log(response.data.results);
            this.popularMovies = response.data.results;
          });
    },
  }
};
</script>

<style lang="scss" scoped>
.popular-movies {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  margin-top: 40px;

  .movie {
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 150px;
    height: 350px;
    padding: 0 14px;

    &:hover {
      cursor: pointer;
    }
  }
}
</style>
