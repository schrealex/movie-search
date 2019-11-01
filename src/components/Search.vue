<template>
    <div class="search">
        <input v-model="searchTerm" placeholder="Find the movie you're looking for" v-on:keyup.enter="searchMovie">
        <div class="movies">
            <ul>
                <li v-for="movie in movies" :key="movie.id" @click="getMovieInformation(movie.id)">{{ movie.title }}</li>
            </ul>
        </div>

        <div v-if="loading">Loading...</div>

        <div v-if="movieInformation" class="movie-content">
            <img :src="getImageUrl('w780', movieInformation.poster_path)">
            <div class="movie-information">
                <h1>{{ movieInformation.original_title }}</h1>
                <h4>{{ movieInformation.tagline }}</h4>
                <span>{{ movieInformation.overview }}</span>
                <h4>{{ getGenres() }}</h4>

            </div>
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
                    .then(response => {
                        this.movieInformation = response.data;
                        // eslint-disable-next-line no-console
                        console.log({response: response.data});
                        document.body.style.backgroundImage = 'url(' + this.getImageUrl('w1280', this.movieInformation.backdrop_path) + ')';
                        document.body.style.backgroundSize = 'cover';
                    })
            },
            getImageUrl(size, filePath) {
                return 'http://image.tmdb.org/t/p/' + size + filePath;
            },
            getGenres() {
                return this.movieInformation.genres.map(genre => genre.name).join(', ')
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
    .search input {
        border: 0;
        margin-top: 20px;
        padding: 5px;
        width: 200px;

        background-color: #000000;
        color: #ffffff;

        border-bottom: 1px solid gold;

        -webkit-transition: all 0.30s ease-in-out;
        -moz-transition: all 0.30s ease-in-out;
        -o-transition: all 0.30s ease-in-out;

        &:focus {
            box-shadow: 0 2px rgba(255, 215, 0, 1);
            outline: none;
        }
    }

    .movie-content {
        width: 900px;
        height: 600px;
        margin: 50px auto;

        display: grid;
        grid-template-columns: 400px auto;
        grid-template-rows: 1fr;

        img {
            grid-column: 1 / span 1;
            width: 100%;
        }

        .movie-information {
            margin: 15px;

            h1 {
                text-transform: uppercase;
                margin-bottom: 10px;
            }

            h4 {
                font-family: Verdana, serif;
                color: gold;
                text-align: left;

                span {
                    display: inline-block;
                }
            }

            span {
                text-align: left;
            }
        }
    }

    ul {
        list-style: none;
    }

    span {
        display: block;
    }
</style>
