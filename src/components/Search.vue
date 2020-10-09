<template>
  <div class="search">
    <div class="input-wrap">
      <input v-focus ref="searchInput" v-on:input="searchTerm = $event.target.value"
             placeholder="Find the movie you're looking for"
             @blur="clearSearchInput()">
      <button class="adult" :class="{ active: adult }" type="button" @click="toggleAdult()">
        <font-awesome-layers class="fa-lg">
          <font-awesome-icon :style="{ visibility: adult ? 'visible' : 'hidden' }" :icon="['fas', 'heat']"
                             transform="flip-v up-18 right-4"/>
          <font-awesome-icon :icon="['fas', 'coffee']" size="lg"/>
        </font-awesome-layers>
      </button>
    </div>

    <SearchResults :results="results" @getMovieInformation="getMovieInformation" @getTVInformation="getTVInformation"
                   @getActorInformation="getActorInformation"/>

    <MovieInformation :movieInformation="movieInformation" :movieTrailer="movieTrailer" :movieCast="movieCast"
                      @getActorInformation="getActorInformation"/>

    <ActorInformation :actorInformation="actorInformation" :movieCredits="movieCredits"
                      @getMovieInformation="getMovieInformation"/>


    <PopOver v-if="displayPopOver" id="pop-over" :content="getImageUrl('w185', selectedCastMember.profile_path)"
             :position="positionXY"/>
  </div>
</template>

<script>
import axios from 'axios';
import _ from 'lodash';
import SearchResults from '@/components/SearchResults';
import MovieInformation from '@/components/MovieInformation';
import ActorInformation from '@/components/ActorInformation';

export default {
  name: 'Search',
  components: {
    SearchResults,
    ActorInformation,
    MovieInformation,
  },
  data() {
    return {
      searchTerm: '',
      movies: null,
      results: null,
      movieInformation: null,
      actorInformation: null,
      movieTrailer: null,
      movieCast: null,
      movieCredits: null,
      displayPopOver: false,
      positionXY: null,
      selectedCastMember: null,
      adult: false,
      screenWidth: 0,
    };
  },
  watch: {
    searchTerm: _.debounce(function () {
      this.searchMulti();
    }, 300)
  },
  mounted() {
    document.addEventListener('click', this.onClickOutsidePopOver);

    window.addEventListener('resize', () => {
      this.screenWidth = window.innerWidth;
    });
    this.screenWidth = window.innerWidth;
  },
  beforeDestroy() {
    document.removeEventListener('click', this.onClickOutsidePopOver);
  },
  methods: {
    clearSearchInput() {
      _.delay(() => {
        this.searchTerm = '';
        this.movies = null;
        this.results = null;
      }, 200);
    },
    searchMulti() {
      if (this.searchTerm) {
        axios
            .get(`https://api.themoviedb.org/3/search/multi?api_key=${process.env.VUE_APP_API_KEY}&query=${this.searchTerm}&language=en-US&page=1&include_adult=${this.adult}`)
            .then(response => (this.results = response.data.results.map(result => {
              return {
                id: result.id,
                title: this.getResultTitle(result),
                year: result.release_date,
                firstAirDate: result.first_air_date,
                mediaType: result.media_type,
                adult: result.adult,
              };
            })));
      }
    },
    getMovieInformation(movieId) {
      const that = this;
      this.clearFields();
      axios
          .get(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${process.env.VUE_APP_API_KEY}&language=en-US`)
          .then(response => {
            this.movieInformation = response.data;
            document.body.style.backgroundImage = 'url(' + this.getImageUrl('w1280', this.movieInformation.backdrop_path) + ')';
            document.body.style.backgroundSize = 'cover';
            that.$refs.searchInput.focus();
          });
      this.getMovieTrailer(movieId);
      this.getMovieCast(movieId);
    },
    getMovieTrailer(movieId) {
      axios
          .get(`https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${process.env.VUE_APP_API_KEY}&language=en-US`)
          .then(response => {
            let trailers = response.data.results;
            trailers = trailers.filter(t => t.site === 'YouTube');
            this.movieTrailer = `https://www.youtube.com/watch?v=${trailers[0].key}`;
          });
    },
    getMovieCast(movieId) {
      axios
          .get(`https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${process.env.VUE_APP_API_KEY}`)
          .then(response => {
            this.movieCast = response.data.cast.slice(0, 5);
          });
    },
    getTVInformation(tvId) {
      const that = this;
      this.clearFields();
      axios
          .get(`https://api.themoviedb.org/3/tv/${tvId}?api_key=${process.env.VUE_APP_API_KEY}&language=en-US`)
          .then(response => {
            this.movieInformation = response.data;
            document.body.style.backgroundImage = 'url(' + this.getImageUrl('w1280', this.movieInformation.backdrop_path) + ')';
            document.body.style.backgroundSize = 'cover';
            that.$refs.searchInput.focus();
          });
      //this.getMovieTrailer(movieId);
      //this.getMovieCast(movieId);
    },
    getActorInformation(actorId) {
      const that = this;
      this.clearFields();
      axios
          .get(`https://api.themoviedb.org/3/person/${actorId}?api_key=${process.env.VUE_APP_API_KEY}&language=en-US`)
          .then(response => {
            this.actorInformation = response.data;
            that.$refs.searchInput.focus();
          });
      this.getActorMovieCredits(actorId);
    },
    getActorMovieCredits(actorId) {
      axios
          .get(`https://api.themoviedb.org/3/person/${actorId}/movie_credits?api_key=${process.env.VUE_APP_API_KEY}&language=en-US`)
          .then(response => {
            this.movieCredits = response.data.cast.sort((a, b) => b.popularity - a.popularity).slice(0, 8);
          });
    },
    getResultTitle(result) {
      return result.media_type === 'movie' ? result.original_title : result.media_type === 'tv' ? result.original_name : result.name;
    },
    getImageUrl(size, filePath) {
      return 'http://image.tmdb.org/t/p/' + size + filePath;
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
.search {
  display: flex;
  flex-direction: column;

  .input-wrap {
    position: relative;

    input {
      border: 0;
      margin: 20px 20px 0 40px;
      padding: 5px;
      width: 600px;

      @media screen and (max-width: 992px) {
        width: 390px;
        margin: 20px 4px 0 0;
      }

      @media screen and (max-width: 600px) {
        width: 320px;
      }

      align-self: center;

      background-color: transparent;
      color: #ffffff;

      border-bottom: 1px solid gold;

      transition: all 0.30s ease-in-out;

      &:focus {
        box-shadow: 0 2px rgba(255, 215, 0, 1);
        outline: none;
      }
    }

    button.adult {
      position: absolute;
      width: 30px;
      height: 30px;
      background: none;
      color: rgba(255, 255, 255, 0.5);
      padding: 0;
      margin-top: 20px;
      border: none;
      cursor: pointer;

      &:focus {
        outline: none;
      }

      &.active {
        color: gold;
      }
    }
  }
}
</style>
