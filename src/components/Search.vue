<template>
    <div class="search">
        <div class="input-wrap">
            <input v-focus ref="searchInput" v-on:input="searchTerm = $event.target.value" placeholder="Find the movie you're looking for"
                   @blur="clearSearchInput()">
            <button class="adult" :class="{ active: adult }" type="button" @click="toggleAdult()">
                <font-awesome-layers class="fa-lg">
                    <font-awesome-icon :style="{ visibility: adult ? 'visible' : 'hidden' }" :icon="['fas', 'heat']" transform="flip-v up-18 right-4"/>
                    <font-awesome-icon :icon="['fas', 'coffee']" size="lg"/>
                </font-awesome-layers>
            </button>
        </div>
        <div class="results">
            <ul v-if="results">
                <template v-for="result in results">
                    <li v-if="result.mediaType === 'movie'" :key="result.id" @click="getMovieInformation(result.id)">
                        <font-awesome-icon :icon="['fal', 'film']" size="lg"/> {{ result.title }} ({{ result.year | formatDate('YYYY') }})
                    </li>
                    <li v-if="result.mediaType === 'tv'" :key="result.id" @click="getTVInformation(result.id)">
                        <font-awesome-icon :icon="['far', 'tv-retro']" size="lg"/> {{ result.title }} ({{ result.firstAirDate | formatDate('YYYY') }})</li>
                    <li v-if="result.mediaType === 'person'" :key="result.id" @click="getActorInformation(result.id)">
                        <font-awesome-icon :icon="['fas', 'user']" size="lg"/> {{ result.title }}
                    </li>
                </template>
            </ul>
        </div>

        <div v-if="loading">Loading...</div>

        <div v-if="movieInformation" class="movie-content">
            <img :src="getImageUrl('w780', movieInformation.poster_path)">
            <div class="movie-information">
                <a :href="'https://www.imdb.com/title/' + movieInformation.imdb_id" target="_blank"><h1>{{ movieInformation.original_title
                    }} ({{ movieInformation.year | formatDate('YYYY') }})</h1></a>
                <h3>
                    <font-awesome-icon :icon="['fad', 'popcorn']"/>
                    <span class="votes-large">{{ movieInformation.vote_average }}</span><span class="votes-small">/ 10</span>

                    <a :href="movieTrailer" target="_blank">
                        <font-awesome-icon :icon="['fal', 'film']"/>
                    </a>
                </h3>
                <h4>{{ movieInformation.tagline }}</h4>
                <span>{{ movieInformation.overview }}</span>
                <h5>{{ getRuntime(movieInformation.runtime) }}</h5>

                <h4>{{ getGenres() }}</h4>

                <h4>{{ movieInformation.year | formatDate('D MMMM YYYY') }}</h4>

                <ul>
                    <li class="movie-cast-member" v-for="castMember in movieCast" v-bind:key="castMember.id"
                        @click="openPopOver($event, castMember)">
                        <span class="movie-cast-member__name">{{ castMember.name }}</span>
                        <span class="movie-cast-member__character">{{ castMember.character }}</span>
                    </li>
                </ul>

                <PopOver v-if="displayPopOver" id="pop-over" :content="getImageUrl('w185', selectedCastMember.profile_path)"
                         :position="positionXY"/>
            </div>
        </div>

        <div v-if="actorInformation" class="actor-content">
            <img :src="getImageUrl('w780', actorInformation.profile_path)">
            <div class="actor-information">
                <a :href="'https://www.imdb.com/name/' + actorInformation.imdb_id" target="_blank"><h1>{{ actorInformation.name }}</h1></a>
                <h5>{{ actorInformation.birthday | formatDate('D MMMM YYYY') }}</h5>
                <h4>{{ actorInformation.place_of_birth }}</h4>
                <span>{{ actorInformation.biography }}</span>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';
    import _ from 'lodash';
    import PopOver from './PopOver';

    export default {
        name: 'Search',
        components: {
            PopOver,
        },
        data() {
            return {
                searchTerm: '',
                movies: null,
                results: null,
                movieInformation: null,
                actorInformation: null,
                movieTrailer: null,
                movieCast: null,
                loading: false,
                displayPopOver: false,
                positionXY: null,
                selectedCastMember: null,
                adult: false,
            };
        },
        watch: {
            searchTerm: _.debounce(function () {
                this.searchMulti();
            }, 300)
        },
        mounted() {
            document.addEventListener('click', this.onClickOutsidePopOver);
        },
        beforeDestroy() {
            document.removeEventListener('click', this.onClickOutsidePopOver);
        },
        methods: {
            clearSearchInput() {
                _.delay(() => {
                    this.searchTerm = '';
                    this.movies = null;
                    this.results = null;
                }, 200);
            },
            searchMulti() {
                if (this.searchTerm) {
                    axios
                        .get('https://api.themoviedb.org/3/search/multi?api_key=f16bfeb0210b43f1f12d8d4ccc114ee9&query=' + this.searchTerm +
                            '&language=en-US&page=1&include_adult=' + this.adult)
                        .then(response => (this.results = response.data.results.map(result => {
                            return {
                                id: result.id,
                                title: this.getResultTitle(result),
                                year: result.release_date,
                                firstAirDate: result.first_air_date,
                                mediaType: result.media_type,
                            };
                        })))
                }
            },
            searchMovie() {
                if (this.searchTerm) {
                    axios
                        .get('https://api.themoviedb.org/3/search/movie?api_key=f16bfeb0210b43f1f12d8d4ccc114ee9&query=' + this.searchTerm +
                            '&language=en-US&page=1&include_adult=' + this.adult)
                        .then(response => (this.movies = response.data.results.map(movie => {
                            // eslint-disable-next-line no-console
                            console.log({movie});
                            return {
                                id: movie.id,
                                title: movie.original_title,
                                year: movie.release_date
                            }
                        })))
                }
            },
            getMovieInformation(movieId) {
                const that = this;

                this.searchTerm = '';
                this.movies = null;
                this.movieInformation = null;
                this.actorInformation = null;
                axios
                    .get('https://api.themoviedb.org/3/movie/' + movieId + '?api_key=f16bfeb0210b43f1f12d8d4ccc114ee9&language=en-US')
                    .then(response => {
                        this.movieInformation = response.data;
                        // eslint-disable-next-line no-console
                        console.log({response: response.data});
                        document.body.style.backgroundImage = 'url(' + this.getImageUrl('w1280', this.movieInformation.backdrop_path) + ')';
                        document.body.style.backgroundSize = 'cover';
                        that.$refs.searchInput.focus();
                    });
                this.getMovieTrailer(movieId);
                this.getMovieCast(movieId);
            },
            getMovieTrailer(movieId) {
                axios
                    .get('https://api.themoviedb.org/3/movie/' + movieId + '/videos?api_key=f16bfeb0210b43f1f12d8d4ccc114ee9&language=en-US')
                    .then(response => {
                        let trailers = response.data.results;
                        trailers = trailers.filter(t => t.site === 'YouTube');
                        this.movieTrailer = `https://www.youtube.com/watch?v=${trailers[0].key}`;
                    });
            },
            getMovieCast(movieId) {
                axios
                    .get('https://api.themoviedb.org/3/movie/' + movieId + '/credits?api_key=f16bfeb0210b43f1f12d8d4ccc114ee9')
                    .then(response => {
                        this.movieCast = response.data.cast.slice(0, 5);
                    });
            },
            getTVInformation(tvId) {
                const that = this;

                this.searchTerm = '';
                this.results = null;
                axios
                    .get('https://api.themoviedb.org/3/tv/' + tvId + '?api_key=f16bfeb0210b43f1f12d8d4ccc114ee9&language=en-US')
                    .then(response => {
                        this.movieInformation = response.data;
                        // eslint-disable-next-line no-console
                        console.log({response: response.data});
                        document.body.style.backgroundImage = 'url(' + this.getImageUrl('w1280', this.movieInformation.backdrop_path) + ')';
                        document.body.style.backgroundSize = 'cover';
                        that.$refs.searchInput.focus();
                    });
                //this.getMovieTrailer(movieId);
                //this.getMovieCast(movieId);
            },
            getActorInformation(actorId) {
                const that = this;
                this.searchTerm = '';
                this.actorInformation = null;
                this.movieInformation = null;
                axios
                    .get('https://api.themoviedb.org/3/person/' + actorId + '?api_key=f16bfeb0210b43f1f12d8d4ccc114ee9&language=en-US')
                    .then(response => {
                        this.actorInformation = response.data;
                        // eslint-disable-next-line no-console
                        console.log({response: response.data});
                        document.body.style.backgroundImage = 'url(' + this.getImageUrl('w1280', this.actorInformation.backdrop_path) + ')';
                        document.body.style.backgroundSize = 'cover';
                        that.$refs.searchInput.focus();
                    });
            },
            getResultTitle(result) {
                return result.media_type === 'movie' ? result.original_title : result.media_type === 'tv' ? result.original_name : result.name;
            },
            getImageUrl(size, filePath) {
                return 'http://image.tmdb.org/t/p/' + size + filePath;
            },
            getRuntime(runtime) {
                return Math.round(runtime / 60) + 'h ' + (runtime % 60) + 'min';
            },
            getGenres() {
                return this.movieInformation.genres.map(genre => genre.name).join(', ')
            },
            toggleAdult() {
                this.adult = !this.adult;
            },
            openPopOver(event, castMember) {
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
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
    .search {
        display: flex;
        flex-direction: column;

        .input-wrap {
            position: relative;

            input {
                border: 0;
                margin: 20px 40px 0 40px;
                padding: 5px;
                width: 600px;

                @media screen and (max-width: 992px) {
                    width: 390px;
                    margin: 0;
                }

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

                &.active {
                    color: gold;
                }
            }
        }

        .results {
            align-self: center;
            font-weight: bold;
            margin-top: -15px;
            background-color: red;

            ul {
                position: absolute;
                text-align: left;
                padding: 5px;
                margin-left: 25px;
                background-color: rgba(0, 0, 0, 0.5);
                left: calc(50% - 325px);
                width: 600px;

                @media screen and (max-width: 992px) {
                    width: 390px;
                    left: calc(50% - 240px);
                }

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

    .movie-content, .actor-content {
        width: 900px;
        height: 600px;
        margin: 50px auto;

        @media screen and (max-width: 1200px) {
            max-width: 800px;
        }

        @media screen and (max-width: 992px) {
            max-width: 500px;
            grid-template-columns: 1fr 300px;
        }

        /* On screens that are 600px or less, set the background color to olive */
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
        grid-template-columns: 400px auto;
        grid-template-rows: 1fr;

        img {
            grid-column: 1 / span 1;
            width: 100%;
        }

        .movie-information, .actor-information {
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

            .movie-cast-member {
                display: grid;
                grid-template-columns: 1fr 1fr;
                grid-template-rows: 1fr;
                grid-column-gap: 12px;
                cursor: pointer;

                &__divider {
                    text-align: center;
                }
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
