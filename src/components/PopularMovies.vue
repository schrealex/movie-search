<template>
  <div class="popular-movies">
    <div v-if="loading">Loading...</div>

    <div class="popular-movies">
      <div v-for="movie in popularMovies" :key="movie.id" class="movie"
           @click="$emit('getMediaInformation', 'movie', movie.id)">
        <img :src="getImageUrl('w154', movie.poster_path)">
        <span class="movie-title">{{ movie.title }}</span>
        <span class="movie-rating">
          <font-awesome-icon :icon="['far', 'circle']" size="3x"
          />
          <span class="movie-rating--text">{{ movie.vote_average | toSingleDecimal }}</span>
        </span>
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
  filters: {
    toSingleDecimal(value) {
      return value.toFixed(1);
    }
  },
  methods: {
    getPopularMovies() {
      axios
          .get(`https://api.themoviedb.org/3/discover/movie?api_key=${process.env.VUE_APP_API_KEY}&query=${this.searchTerm}&language=en-US&page=1&sort_by=popularity.desc&include_adult=${this.adult}`)
          .then(response => {
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

  img {
    height: 231px;
    width: 154px;
  }

  .movie {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    max-width: 150px;
    height: 350px;
    padding: 0 14px;

    .movie-title {
      width: 100%;
      margin-top: 30px;
      text-align: left;
      font-weight: bold;
    }

    .movie-rating {
      position: absolute;
      left: 12px;
      bottom: 144px;
      color: gold;

      .fa-circle {
        border-radius: 50%;
        background-color: #444444;
        position: absolute;
      }

      &--text {
        display: inline;
        font-weight: 900;
        position: absolute;
        color: #eeeeee;
        top: 13px;
        left: 12px;
      }
    }

    &:hover {
      cursor: pointer;
    }
  }
}
</style>
