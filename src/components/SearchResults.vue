<template>
  <div v-if="results" class="absolute top-20 flex w-full max-w-prose h-screen items-start justify-center font-bold -mt-2 z-10">
    <ul class="w-full max-w-prose ml-4 mr-6 bg-black/50 text-white decoration-transparent">
      <template v-for="result in results">
        <li v-if="result.mediaType === 'movie'" :key="result.id" @click="$emit('getMediaInformation', 'movie', result.id)"
        class="p-1 hover:cursor-pointer hover:bg-gold">
          <font-awesome-icon :icon="['fas', 'film']" size="lg" class="mr-1"/>
          {{ result.title }} ({{ getYear(result.year, 'YYYY') }})
        </li>
        <li v-if="result.mediaType === 'tv'" :key="result.id" @click="$emit('getMediaInformation', 'tv', result.id)"
            class="p-1 hover:cursor-pointer hover:bg-gold">
          <font-awesome-icon :icon="['fas', 'tv']" size="lg" class="mr-1"/>
          {{ result.title }} ({{ getYear(result.firstAirDate, 'YYYY') }})
        </li>
        <li v-if="result.mediaType === 'person'" :key="result.id" @click="$emit('getActorInformation', result.id)"
            class="p-1 flex hover:cursor-pointer hover:bg-gold">
          <font-awesome-icon v-if="!result.adult" :icon="['fas', 'user']" size="lg" class="mr-2" />
          <div v-else class="mr-2">
            <font-awesome-icon :icon="['fas', 'times']" size="lg"/>
            <font-awesome-icon :icon="['fas', 'times']" size="lg"/>
            <font-awesome-icon :icon="['fas', 'times']" size="lg"/>
          </div>
          {{ result.title }}
        </li>
      </template>
    </ul>
  </div>
</template>

<script>
import dayjs from 'dayjs';
export default {
  name: 'SearchResults',
  props: {
    results: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    getYear(date, dateFormat) {
      return dayjs(String(date)).format(dateFormat);
    },
  }
};
</script>
