<template>
  <div v-if="mediaInformation" class="flex flex-col lg:flex-row justify-center max-w-5xl mt-12 mx-auto bg-black/60 text-white">
    <img class="max-w-xs sm:max-w-sm md:max-w-lg" :src="getImageUrl('w780', mediaInformation.poster_path)" alt="poster-path">
    <div class="max-w-xs sm:max-w-sm md:max-w-lg p-3.5">
      <a v-if="mediaInformation.externalIds" :href="'https://www.imdb.com/title/' + mediaInformation.externalIds.imdb_id" target="_blank">
        <h1 class="mb-2.5 uppercase">
          {{ mediaInformation.original_title ? mediaInformation.original_title : mediaInformation.name }}
          ({{ getDateFormatted(mediaInformation.release_date ? mediaInformation.release_date : mediaInformation.first_air_date, 'YYYY') }})
        </h1></a>
      <div>
        <font-awesome-icon :icon="['fas', 'star']" size="xl"/>
        <span class="inline-block text-2xl font-bold ml-2.5">{{ getVoteAverage(mediaInformation.vote_average) }}</span>
        <span class="inline-block text-xs text-grey-light mr-7">/ 10</span>
        <a v-if="trailer" :href="trailer" target="_blank">
          <font-awesome-icon :icon="['fas', 'film']"/>
        </a>
      </div>
      <h4>{{ mediaInformation.tagline }}</h4>
      <span>{{ mediaInformation.overview }}</span>
      <h5 v-if="mediaInformation.runtime">{{ getRuntime(mediaInformation.runtime) }}</h5>

      <h4>{{ getGenres() }}</h4>

      <h4 v-if="mediaInformation.release_date">{{ getDateFormatted(mediaInformation.release_date, 'D MMMM YYYY') }}</h4>

      <div class="flex flex-row justify-items-start items-start mt-10 overflow-auto scroll-smooth snap-x">
        <ul ref="castmembers" class="flex flex-row justify-between items-start">
          <li class="flex flex-col flex-1 mx-1.5 first:ml-0 last-mr-0 snap-start hover:cursor-pointer"
              v-for="castMember in movieCast" v-bind:key="castMember.id" @click="onCastMemberClick(castMember.id)">
            <img class="object-cover max-w-[110px]" :src="getImageUrl('w185', castMember.profile_path)" alt="cast-profile-picture">
            <div class="flex flex-col">
              <span class="inline-block font-bold text-sm">{{ castMember.name }}</span>
              <span class="inline-block text-sm">{{ castMember.character }}</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="js">
import utils from '@/util/utils';
import dayjs from "dayjs";
import _ from 'lodash';

export default {
  name: 'MediaInformation',
  props: {
    mediaInformation: {
      type: Object,
      default: () => {
      },
    },
    trailer: {
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
  watch: {
    mediaInformation() {
      _.delay(() => {
        this.$refs.castmembers?.firstElementChild?.scrollIntoView();
      }, 200)
    },
  },
  methods: {
    onCastMemberClick(castMemberId) {
      this.$emit('getActorInformation', castMemberId);
    },
    getVoteAverage(value) {
      return value?.toFixed(1);
    },
    getRuntime(runtime) {
      return Math.round(runtime / 60) + 'h ' + (runtime % 60) + 'min';
    },
    getGenres() {
      return this.mediaInformation.genres ? this.mediaInformation.genres.map(genre => genre.name).join(', ') : [];
    },
    getDateFormatted(date, dateFormat) {
      return dayjs(String(date)).format(dateFormat);
    },
  }
};
</script>
