<template>
  <div v-if="actorInformation" class="actor-content">
    <img class="actor-content__image" :src="getImageUrl('w780', actorInformation.profile_path)">
    <div class="actor-information">
      <a :href="'https://www.imdb.com/name/' + actorInformation.imdb_id" target="_blank"><h1>{{
          actorInformation.name
        }}</h1></a>
      <h5>{{ actorInformation.birthday | formatDate('D MMMM YYYY') }}</h5>
      <h4>{{ actorInformation.place_of_birth }}</h4>
      <span class="actor-information__biography" :class="{ full: fullBiography }">{{
          actorInformation.biography
        }}</span>
      <div v-if="!fullBiography" class="actor-information__read-more">
        <a class="actor-information__read-more-button" @click="fullBiography = true">
          Read More
        </a>
      </div>

      <div class="actor-movie-credits">
        <ul class="actor-movie-credits__list">
          <li v-for="credit in credits" :key="credit.id" class="actor-movie-credits__list-item"
              :title="credit.title || credit.name"
              @click="onCreditsClick(credit)">
            <img :src="getImageUrl('w500', credit.poster_path)">
            <span class="movie-cast-movie">{{ credit.title || credit.name }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import utils from '@/util/utils';

export default {
  name: 'ActorInformation',
  props: {
    actorInformation: {
      type: Object,
      default: () => {
      },
    },
    credits: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      fullBiography: false,
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
    onCreditsClick(credit) {
      this.fullBiography = false;
      this.$emit('getMediaInformation', credit.media_type, credit.id);
    },
  }
};
</script>

<style scoped lang="scss">
.actor-content {
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

  @media screen and (max-width: 420px) {
    max-width: 100%;
    margin: 0 auto;
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

    @media screen and (max-width: 420px) {
      margin-bottom: 16px;
      width: 412px;
    }
  }

  .actor-information {
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

    &__biography {
      position: relative;
      max-height: 310px;
      overflow: hidden;
      margin-right: -1em;
      padding-right: 1em;

      @media screen and (max-width: 420px) {
        margin-right: 0;
      }

      &.full {
        max-height: initial;
      }
    }

    &__read-more {
      display: flex;
      justify-content: flex-end;
    }

    &__read-more-button {
      cursor: pointer;

      &:hover {
        color: gold;
      }
    }

    ul {
      padding-left: 0;

      li {
        padding: 4px 0;
      }
    }
  }

  .actor-movie-credits {
    width: 540px;
    overflow-x: auto;

    @media screen and (max-width: 420px) {
      width: 376px;
    }

    &__list {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      flex-direction: row;
      width: 1200px;
      margin-bottom: 0;
    }

    &__list-item {
      cursor: pointer;
      max-width: 140px;
    }
  }
}
</style>
