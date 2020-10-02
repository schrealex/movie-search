<template>
  <div class="popular-movies">
    <div v-if="loading">Loading...</div>

    <div class="popular-movies">
      <div v-for="movie in popularMovies" :key="movie.id" class="movie" @click="getMovieInformation(movie.id)">
        <img :src="getImageUrl('w154', movie.poster_path)">
        <span class="movie-title">{{ movie.title }}</span>
        <span class="movie-rating">{{ movie.vote_average }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import _ from 'lodash';

export default {
  name: 'PopularMovies',
  data() {
    return {
      popularMovies: [],
      loading: false,
      screenWidth: 0,
    };
  },
  watch: {
    searchTerm: _.debounce(function () {
      this.searchMulti();
    }, 300)
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
    getResultTitle(result) {
      return result.media_type === 'movie' ? result.original_title : result.media_type === 'tv' ? result.original_name : result.name;
    },
    getImageUrl(size, filePath) {
      return 'http://image.tmdb.org/t/p/' + size + filePath;
    },
    getRuntime(runtime) {
      return Math.round(runtime / 60) + 'h ' + (runtime % 60) + 'min';
    },
    getGenres() {
      return this.movieInformation.genres.map(genre => genre.name).join(', ');
    },
    toggleAdult() {
      this.adult = !this.adult;
    },
    openPopOverForCastMember(event, castMember) {
      this.selectedCastMember = castMember;
      const xPosition = event.target.offsetLeft + 25;
      const yPosition = event.target.offsetTop + 25;
      this.positionXY = {
        x: xPosition,
        y: yPosition,
      };
      this.displayPopOver = true;
      event.stopPropagation();
    },
    onClickOutsidePopOver(event) {
      const popOver = document.querySelector('#pop-over');
      if (this.displayPopOver && (event.target !== popOver && !popOver.contains(event.target))) {
        this.displayPopOver = false;
      }
    },
    clearFields() {
      this.searchTerm = '';
      this.$refs.searchInput.value = '';
      this.movies = null;
      this.movieInformation = null;
      this.actorInformation = null;
    }
  }
};
</script>

<style lang="scss" scoped>
.popular-movies {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;

  .movie {
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 140px;
    height: 350px;
    padding: 0 14px;

    &:hover {
      cursor: pointer;
    }
  }
}
</style>
