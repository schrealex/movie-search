<template>
    <div class="search">
        <input v-model="searchTerm" placeholder="Find the movie you're looking for" v-on:keyup.enter="searchMovie">
        <div class="movies">
            <ul>
                <li v-for="movie in movies" :key="movie.id" @click="getMovieInformation(movie.id)">{{ movie.title }}</li>
            </ul>
        </div>

        <div v-if="loading">Loading...</div>

        <div v-if="movieInformation" class="movie-info"
             v-bind:style="{ 'background-image': 'url(' + getImageUrl('w1280', movieInformation.backdrop_path) + ')', 'background-size' : 'cover' }">
            <img :src="getImageUrl('w780', movieInformation.poster_path)">
            <span>{{ movieInformation.original_title }}</span>
            <span>{{ movieInformation.overview }}</span>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';

    export default {
        name: 'Search',
        data() {
            return {
                searchTerm: '',
                movies: null,
                movieInformation: null,
                loading: false
            };
        },
        methods: {
            searchMovie() {
                axios
                    .get('https://api.themoviedb.org/3/search/movie?api_key=f16bfeb0210b43f1f12d8d4ccc114ee9&query=' + this.searchTerm +
                        '&language=en-US&page=1&include_adult=true')
                    .then(response => (this.movies = response.data.results.map(movie => {
                        return {
                            id: movie.id,
                            title: movie.original_title
                        }
                    })))
            },
            getMovieInformation(movieId) {
                this.searchTerm = '';
                this.movies = null;
                axios
                    .get('https://api.themoviedb.org/3/movie/' + movieId + '?api_key=f16bfeb0210b43f1f12d8d4ccc114ee9&language=en-US')
                    .then(response => (this.movieInformation = response.data))
            },
            getImageUrl(size, filePath) {
                return 'http://image.tmdb.org/t/p/' + size + filePath;
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .search input {
        border: 0;
        padding: 5px;
        width: 200px;

        background-color: #000000;
        color: #ffffff;
    }

    .search input:focus {
        outline: #ffffff auto 1px;
    }

    ul {
        list-style: none;
    }

    span {
        display: block;
    }
</style>
