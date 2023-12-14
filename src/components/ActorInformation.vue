<template>
  <div v-if="actorInformation" class="flex flex-col lg:flex-row justify-center max-w-5xl mt-12 mx-auto bg-black/60 text-white">
    <img class="max-w-xs sm:max-w-sm md:max-w-lg max-h-[780px]" :src="getImageUrl('w780', actorInformation.profile_path)" alt="profile-picture">
    <div class="max-w-xs sm:max-w-sm md:max-w-lg p-3.5">
      <a :href="'https://www.imdb.com/name/' + actorInformation.imdb_id" target="_blank"><h1>{{ actorInformation.name }}</h1></a>
      <h5 v-if="actorInformation.birthday">{{ getYear(actorInformation.birthday, 'YYYY') }}</h5>
      <h4>{{ actorInformation.place_of_birth }}</h4>
      <span class="flex max-h-72 overflow-hidden" :class="{ 'max-h-none': fullBiography }">{{ actorInformation.biography }}</span>
      <div v-if="displayReadMore()" class="flex justify-end my-3">
        <a class="hover:cursor-pointer hover:text-gold" @click="fullBiography = !fullBiography">{{ !fullBiography ? 'Read More' : 'Read Less' }}</a>
      </div>

      <div class="flex flex-row justify-items-start items-start mt-5 overflow-auto scroll-smooth snap-x">
        <ul ref="actors" class="flex flex-row justify-between items-start">
          <li class="relative flex flex-col flex-1 mx-1.5 first:ml-0 last-mr-0 snap-start hover:cursor-pointer"
              v-for="credit in credits" :key="credit.id" :title="credit.title || credit.name" @click="onCreditsClick(credit)">
            <img class="object-cover max-w-[120px] hover:border-gold hover:border-4" :src="getImageUrl('w500', credit.poster_path)" alt="movie-credit">
            <span class="inline-block text-sm">{{ credit.title || credit.name }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import utils from '@/util/utils';
import dayjs from "dayjs";
import _ from "lodash";

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
  watch: {
    actorInformation() {
      _.delay(() => {
        this.$refs.actors?.firstElementChild?.scrollIntoView();
      }, 200)
    },
  },
  mounted() {
    window.addEventListener('resize', () => {
      this.screenWidth = window.innerWidth;
    });
    this.screenWidth = window.innerWidth;
  },
  methods: {
    onCreditsClick(credit) {
      this.fullBiography = false;
      this.$emit('getMediaInformation', credit.media_type, credit.id);
    },
    getYear(date, dateFormat) {
      return dayjs(String(date)).format(dateFormat);
    },
    displayReadMore() {
      return this.actorInformation.biography.length > 720;
    }
  }
};
</script>
