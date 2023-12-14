<template>
  <div class="flex flex-col mt-2">
    <div class="flex justify-center items-center h-14">
      <button class="text-gold h-10 flex justify-center items-center p-0 mt-5 mx-1 mb-0 cursor-pointer" type="button" @click="togglePopularMovies()">
        <font-awesome-icon :icon="['fas', 'film']" size="2x"/>
      </button>
      <input v-focus class="bg-black text-white placeholder:text-grey-dark h-10 border-b border-gold focus:outline-none w-full max-w-prose p-0 mt-5 mx-1 mb-0"
             ref="searchInput" v-on:input="searchTerm = $event.target.value" placeholder="Find the movie you're looking for" @blur="clearSearchInput()">
      <button class="text-gold h-10 w-10 flex justify-center items-center p-0 mt-5 mx-1 mb-0 cursor-pointer" :class="{ active: adult }" type="button" @click="toggleAdult()">
        <font-awesome-icon v-if="adult" :icon="['fas', 'mug-hot']" size="xl" />
        <font-awesome-icon v-if="!adult" :icon="['fas', 'coffee']" size="xl" transform="down-5" />
      </button>

      <SearchResults :results="results" @getMediaInformation="getMediaInformation" @getActorInformation="getActorInformation"/>
    </div>

    <PopularMovies v-if="showPopularMovies" @getMediaInformation="getMediaInformation"/>

    <MediaInformation :mediaInformation="mediaInformation" :trailer="trailer" :movieCast="cast" @getActorInformation="getActorInformation"/>

    <ActorInformation :actorInformation="actorInformation" :credits="credits" @getMediaInformation="getMediaInformation"/>
  </div>
</template>

<script>
import axios from 'axios';
import _ from 'lodash';
import SearchResults from '@/components/SearchResults.vue';
import ActorInformation from '@/components/ActorInformation.vue';
import MediaInformation from '@/components/MediaInformation.vue';
import PopularMovies from '@/components/PopularMovies.vue';
import utils from '../util/utils';

const apiKey = import.meta.env.VITE_VUE_APP_API_KEY;

export default {
  name: 'app-search',
  components: {
    ActorInformation,
    MediaInformation,
    PopularMovies,
    SearchResults,
  },
  data() {
    return {
      searchTerm: '',
      results: null,
      mediaInformation: null,
      actorInformation: null,
      trailer: null,
      cast: null,
      credits: null,
      showPopularMovies: true,
      displayPopOver: false,
      positionXY: null,
      selectedCastMember: null,
      adult: false,
      screenWidth: 0,
    };
  },
  created() {
    this.getImageUrl = utils.getImageUrl;
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
  beforeUnmount() {
    document.removeEventListener('click', this.onClickOutsidePopOver);
  },
  methods: {
    clearSearchInput() {
      _.delay(() => {
        this.searchTerm = '';
        this.results = null;
      }, 200);
    },
    togglePopularMovies() {
      this.clearFields();
      this.showPopularMovies = true;
    },
    searchMulti() {
      if (this.searchTerm) {
        axios
            .get(`https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&query=${this.searchTerm}&language=en-US&page=1&include_adult=${this.adult}`)
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
    getMediaInformation(mediaType, mediaId) {
      const that = this;
      this.clearFields();
      this.showPopularMovies = false;
      axios
          .get(`https://api.themoviedb.org/3/${mediaType}/${mediaId}?api_key=${apiKey}&language=en-US`)
          .then(response => {
            this.mediaInformation = response.data;
            document.body.style.backgroundImage = 'url(' + this.getImageUrl('original', this.mediaInformation.backdrop_path) + ')';
            document.body.style.backgroundSize = 'cover';
            document.body.style.backgroundPosition = 'center';
            that.$refs.searchInput.focus();
          });
      this.getTrailer(mediaType, mediaId);
      this.getCast(mediaType, mediaId);
      this.getExternalIDs(mediaType, mediaId);
    },
    getTrailer(mediaType, mediaId) {
      axios
          .get(`https://api.themoviedb.org/3/${mediaType}/${mediaId}/videos?api_key=${apiKey}&language=en-US`)
          .then(response => {
            let trailers = response.data.results;
            trailers = trailers.filter(t => t.site === 'YouTube' && t.key !== undefined);
            this.trailer = trailers.length > 0 ? `https://www.youtube.com/watch?v=${trailers[0].key}` : undefined;
          });
    },
    getCast(mediaType, mediaId) {
      axios
          .get(`https://api.themoviedb.org/3/${mediaType}/${mediaId}/credits?api_key=${apiKey}`)
          .then(response => {
            this.cast = response.data.cast.filter(c => c.profile_path !== null).slice(0, 9);
          });
    },
    getExternalIDs(mediaType, mediaId) {
      const that = this;
      axios
          .get(`https://api.themoviedb.org/3/${mediaType}/${mediaId}/external_ids?api_key=${apiKey}`)
          .then(response => {
            that.mediaInformation = {
              ...that.mediaInformation,
              externalIds: response.data,
            };
          });
    },
    getActorInformation(actorId) {
      const that = this;
      this.clearFields();
      this.showPopularMovies = false;
      axios
          .get(`https://api.themoviedb.org/3/person/${actorId}?api_key=${apiKey}&language=en-US`)
          .then(response => {
            this.actorInformation = response.data;
            that.$refs.searchInput.focus();
          });
      this.getActorCredits(actorId);
    },
    getActorCredits(actorId, mediaType = 'combined',) {
      axios
          .get(`https://api.themoviedb.org/3/person/${actorId}/${mediaType}_credits?api_key=${apiKey}&language=en-US`)
          .then(response => {
            this.credits = _.uniqBy(response.data.cast, 'id')
                .filter(c => c.poster_path !== null)
                .sort((a, b) => b.popularity - a.popularity);
          });
    },
    getResultTitle(result) {
      return result.media_type === 'movie' ? result.original_title : result.media_type === 'tv' ? result.original_name : result.name;
    },
    toggleAdult() {
      this.adult = !this.adult;
    },
    openPopOverForCastMember(castMember) {
      console.log('clicked');
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
      document.body.style.backgroundImage = '';
      this.mediaInformation = null;
      this.actorInformation = null;
      this.trailer = null;
    }
  }
};
</script>
