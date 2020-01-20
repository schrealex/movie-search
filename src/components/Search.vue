<template>
    <div class="search">
        <input v-focus ref="searchInput" v-model="searchTerm" placeholder="Find the movie you're looking for" v-on:keyup.enter="searchMovie">
        <div class="movies">
            <ul v-if="movies">
                <li v-for="movie in movies" :key="movie.id" @click="getMovieInformation(movie.id)">{{ movie.title }} ({{ movie.year |
                    formatDate('YYYY') }})
                </li>
            </ul>
        </div>

        <div v-if="loading">Loading...</div>

        <div v-if="movieInformation" class="movie-content">
            <img :src="getImageUrl('w780', movieInformation.poster_path)">
            <div class="movie-information">
                <a :href="'https://www.imdb.com/title/' + movieInformation.imdb_id" target="_blank"><h1>{{ movieInformation.original_title
                    }} ({{ movieInformation.release_date | formatDate('YYYY') }})</h1></a>
                <h3>
                    <font-awesome-icon :icon="['fad', 'popcorn']"/>
                    <span class="votes-large">{{ movieInformation.vote_average }}</span><span class="votes-small">/ 10</span>
                </h3>
                <h4>{{ movieInformation.tagline }}</h4>
                <span>{{ movieInformation.overview }}</span>
                <h5>{{ getRuntime(movieInformation.runtime) }}</h5>

                <h4>{{ getGenres() }}</h4>

                <h4>{{ movieInformation.release_date | formatDate('D MMMM YYYY') }}</h4>

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
                        // eslint-disable-next-line no-console
                        console.log({movie});
                        return {
                            id: movie.id,
                            title: movie.original_title,
                            year: movie.release_date
                        }
                    })))
            },
            getMovieInformation(movieId) {
                const that = this;

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
                        that.$refs.searchInput.focus();
                    })
            },
            getImageUrl(size, filePath) {
                return 'http://image.tmdb.org/t/p/' + size + filePath;
            },
            getRuntime(runtime) {
                return Math.round(runtime / 60) + 'h ' + (runtime % 60) + 'min';
            },
            getGenres() {
                return this.movieInformation.genres.map(genre => genre.name).join(', ')
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
    .search {
        display: flex;
        flex-direction: column;

        input {
            border: 0;
            margin-top: 20px;
            margin-left: 40px;
            padding: 5px;
            width: 400px;

            align-self: center;

            background-color: transparent;
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

        .movies {
            align-self: center;
            font-weight: bold;
            margin-top: -16px;

            ul {
                position: absolute;
                text-align: left;
                padding: 5px;
                margin-left: 40px;
                background-color: rgba(0, 0, 0, 0.5);
                left: calc(50% - 225px);
                width: 400px;

                li {
                    padding: 5px;

                    &:hover {
                        cursor: pointer;
                        color: #000000;
                        background-color: gold;
                    }
                }
            }
        }
    }

    .movie-content {
        width: 900px;
        height: 600px;
        margin: 50px auto;
        background-color: rgba(0, 0, 0, 0.6);

        display: grid;
        grid-template-columns: 400px auto;
        grid-template-rows: 1fr;

        img {
            grid-column: 1 / span 1;
            width: 100%;
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

            .fa-popcorn {
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
            }
        }
    }

    ul {
        list-style: none;
    }

    span {
        display: block;
    }

    a {
        text-decoration: none;
        color: #ffffff;

        &:active, &:visited {
            color: #ffffff;
        }
    }
</style>
