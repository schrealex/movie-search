<template>
  <div class="mt-12">
    <div v-if="loading">Loading...</div>

    <div v-if="!loading" class="flex flex-wrap justify-center items-center">
      <div v-for="movie in popularMovies" :key="movie.id"
           class="flex flex-col items-center relative max-w-[154px] h-[350px] mx-3 hover:cursor-pointer"
           @click="$emit('getMediaInformation', 'movie', movie.id)"
      >
        <img class="h-[231px] object-cover" :src="getImageUrl('w154', movie.poster_path)" alt="poster-path">
        <span class="w-full mt-7 font-normal text-white">{{ movie.title }}</span>

        <span class="absolute left-0 bottom-24 text-gold">
          <font-awesome-icon :icon="['far', 'circle']" size="3x" class="bg-grey-dark rounded-full"/>
          <span class="absolute top-3 left-3 inline font-medium text-white">{{ getVoteAverage(movie?.vote_average) }}</span>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import utils from '@/util/utils';

const apiKey = import.meta.env.VITE_VUE_APP_API_KEY;
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
    this.getPopularMovies();
  },
  methods: {
    getPopularMovies() {
      const url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&query=${this.searchTerm}&language=en-US&page=1&sort_by=popularity.desc&include_adult=${this.adult}`;
      axios.get(url).then((response) => {
        this.popularMovies = response.data.results;
      });
    },
    getVoteAverage(value) {
      return value.toFixed(1);
    }
  }
};
</script>
