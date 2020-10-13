<template>
  <div v-if="mediaInformation" class="movie-content">
    <img :src="getImageUrl('w780', mediaInformation.poster_path)">
    <div class="movie-information">
      <a v-if="mediaInformation.externalIds"
         :href="'https://www.imdb.com/title/' + mediaInformation.externalIds.imdb_id" target="_blank"><h1>{{
          mediaInformation.original_title ?
              mediaInformation.original_title : mediaInformation.name
        }} ({{
          mediaInformation.release_date ? mediaInformation.release_date : mediaInformation.first_air_date | formatDate('YYYY')
        }})</h1></a>
      <h3>
        <font-awesome-icon :icon="['fad', 'popcorn']"/>
        <span class="votes-large">{{ mediaInformation.vote_average }}</span><span class="votes-small">/ 10</span>

        <a :href="movieTrailer" target="_blank">
          <font-awesome-icon :icon="['fal', 'film']"/>
        </a>
      </h3>
      <h4>{{ mediaInformation.tagline }}</h4>
      <span>{{ mediaInformation.overview }}</span>
      <h5 v-if="mediaInformation.runtime">{{ getRuntime(mediaInformation.runtime) }}</h5>

      <h4>{{ getGenres() }}</h4>

      <h4>{{ mediaInformation.year | formatDate('D MMMM YYYY') }}</h4>

      <ul class="movie-cast-members">
        <li class="movie-cast-member" v-for="castMember in movieCast" v-bind:key="castMember.id"
            @click="$emit('getActorInformation', castMember.id)">
          <img class="movie-cast-member__image"
               :src="getImageUrl( isLargeScreen ? 'w185' : 'w92', castMember.profile_path)">
          <div class="movie-cast-member__name-character">
            <span class="movie-cast-member__name">{{ castMember.name }}</span>
            <span class="movie-cast-member__character">{{ castMember.character }}</span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import utils from '@/util/utils';

export default {
  name: 'MediaInformation',
  props: {
    mediaInformation: {
      type: Object,
      default: () => {
      },
    },
    movieTrailer: {
      type: String,
      default: () => ''
    },
    movieCast: {
      type: Array,
      default: () => [],
    },
  },
  created() {
    this.getImageUrl = utils.getImageUrl;
  },
  mounted() {
    window.addEventListener('resize', () => {
      this.screenWidth = window.innerWidth;
    });
    this.screenWidth = window.innerWidth;
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
    getRuntime(runtime) {
      return Math.round(runtime / 60) + 'h ' + (runtime % 60) + 'min';
    },
    getGenres() {
      return this.mediaInformation.genres ? this.mediaInformation.genres.map(genre => genre.name).join(', ') : [];
    },
  }
};
</script>

<style scoped lang="scss">
.movie-content {
  width: 1024px;
  height: 100%;
  margin: 50px auto;

  @media screen and (max-width: 1200px) {
    max-width: 800px;
    max-height: 630px;
    grid-template-columns: 420px auto;
  }

  @media screen and (max-width: 992px) {
    max-width: 500px;
    grid-template-columns: 1fr 300px;
  }

  @media screen and (max-width: 600px) {
    max-width: 400px;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 1fr;

    img {
      grid-row: 2 / span 1;
    }
  }

  background-color: rgba(0, 0, 0, 0.6);

  display: grid;
  grid-template-columns: 450px auto;
  grid-template-rows: 1fr;

  img {
    grid-column: 1 / span 1;
    width: 100%;


    @media screen and (max-width: 600px) {
      margin-bottom: 40px;
    }
  }

  .movie-information {
    margin: 15px;

    text-align: left;

    h1, h3 {
      text-transform: uppercase;
      margin-bottom: 10px;
    }

    h4, h5 {
      font-family: Verdana, serif;
      color: gold;

      span {
        display: inline-block;
      }
    }

    span {
      text-align: left;
    }

    .fa-popcorn, .fa-film {
      font-size: 26px;
    }

    .votes-large {
      display: inline-block;
      font-size: 26px;
      font-weight: 700;
      margin-left: 10px;
    }

    .votes-small {
      display: inline-block;
      font-size: 12px;
      color: #c4c4c4;
      margin-right: 24px;
    }

    ul {
      padding-left: 0;

      li {
        padding: 4px 0;
      }
    }

    .movie-cast-members {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: flex-start;
      width: 100%;
      margin: 12px 0;

      @media screen and (max-width: 1200px) {
        display: initial;
      }

      .movie-cast-member {
        width: 100px;
        margin: 0 5px;
        display: flex;
        flex-direction: column;

        &:first-child {
          margin-left: 0;
        }

        &:last-child {
          margin-right: 0;
        }

        @media screen and (max-width: 1200px) {
          display: grid;
          grid-template-columns: 100px 1fr;
          grid-template-rows: 1fr;
          grid-column-gap: 12px;
          width: 100%;
          font-size: initial;
        }

        cursor: pointer;
        font-size: 12px;

        &__name {
          font-weight: bold;
          margin-bottom: 8px;

          @media screen and (max-width: 1200px) {
            margin-bottom: 0;
            grid-column: 2;
          }
        }

        &__character {
          @media screen and (max-width: 1200px) {
            grid-column: 2;
            grid-row: 1;
          }
        }

        &__image {
          @media screen and (max-width: 1200px) {
            width: 100px;
            grid-column: 1;
          }
        }

        &__divider {
          text-align: center;
        }
      }
    }
  }
}
</style>
