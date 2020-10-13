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

    <SearchResults :results="results" @getMediaInformation="getMediaInformation"
                   @getActorInformation="getActorInformation"/>

    <MediaInformation :mediaInformation="mediaInformation" :trailer="trailer" :movieCast="cast"
                      @getActorInformation="getActorInformation"/>

    <ActorInformation :actorInformation="actorInformation" :credits="credits"
                      @getMediaInformation="getMediaInformation"/>


    <PopOver v-if="displayPopOver" id="pop-over" :content="getImageUrl('w185', selectedCastMember.profile_path)"
             :position="positionXY"/>
  </div>
</template>

<script>
import axios from 'axios';
import _ from 'lodash';
import SearchResults from '@/components/SearchResults';
import MediaInformation from '@/components/MediaInformation';
import ActorInformation from '@/components/ActorInformation';
import utils from '@/util/utils';

export default {
  name: 'Search',
  components: {
    SearchResults,
    ActorInformation,
    MediaInformation,
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
  beforeDestroy() {
    document.removeEventListener('click', this.onClickOutsidePopOver);
  },
  methods: {
    clearSearchInput() {
      _.delay(() => {
        this.searchTerm = '';
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
    getMediaInformation(mediaType, mediaId) {
      const that = this;
      this.clearFields();
      axios
          .get(`https://api.themoviedb.org/3/${mediaType}/${mediaId}?api_key=${process.env.VUE_APP_API_KEY}&language=en-US`)
          .then(response => {
            this.mediaInformation = response.data;
            document.body.style.backgroundImage = 'url(' + this.getImageUrl('w1280', this.mediaInformation.backdrop_path) + ')';
            document.body.style.backgroundSize = 'cover';
            that.$refs.searchInput.focus();
          });
      this.getTrailer(mediaType, mediaId);
      this.getCast(mediaType, mediaId);
      this.getExternalIDs(mediaType, mediaId);
    },
    getTrailer(mediaType, mediaId) {
      axios
          .get(`https://api.themoviedb.org/3/${mediaType}/${mediaId}/videos?api_key=${process.env.VUE_APP_API_KEY}&language=en-US`)
          .then(response => {
            let trailers = response.data.results;
            trailers = trailers.filter(t => t.site === 'YouTube');
            this.trailer = `https://www.youtube.com/watch?v=${trailers[0].key}`;
          });
    },
    getCast(mediaType, mediaId) {
      axios
          .get(`https://api.themoviedb.org/3/${mediaType}/${mediaId}/credits?api_key=${process.env.VUE_APP_API_KEY}`)
          .then(response => {
            this.cast = response.data.cast.slice(0, 5);
          });
    },
    getExternalIDs(mediaType, mediaId) {
      const that = this;
      axios
          .get(`https://api.themoviedb.org/3/${mediaType}/${mediaId}/external_ids?api_key=${process.env.VUE_APP_API_KEY}`)
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
      axios
          .get(`https://api.themoviedb.org/3/person/${actorId}?api_key=${process.env.VUE_APP_API_KEY}&language=en-US`)
          .then(response => {
            this.actorInformation = response.data;
            that.$refs.searchInput.focus();
          });
      this.getActorCredits(actorId);
    },
    getActorCredits(actorId, mediaType = 'combined',) {
      axios
          .get(`https://api.themoviedb.org/3/person/${actorId}/${mediaType}_credits?api_key=${process.env.VUE_APP_API_KEY}&language=en-US`)
          .then(response => {
            this.credits = _.uniqBy(response.data.cast, 'id')
                .filter(c => c.vote_count >= 60)
                .sort((a, b) => b.popularity - a.popularity)
                .slice(0, 8);
          });
    },
    getResultTitle(result) {
      return result.media_type === 'movie' ? result.original_title : result.media_type === 'tv' ? result.original_name : result.name;
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
      document.body.style.backgroundImage = '';
      this.mediaInformation = null;
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
