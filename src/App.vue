<template>
    <div id="app">
        <!--    <Search/>-->

        <PopularMovies v-if="showPopularMovies" @getMediaInformation="getMediaInformation"/>

        <img class="moviedb-logo" src="@/assets/powered-by-rectangle-green.png"/>
        <img class="moviedb-small-logo" src="@/assets/tmdb.png"/>
    </div>
</template>

<script>
    import PopularMovies from '@/components/PopularMovies';
    import ThemoviedbApi from './api/ThemoviedbApi';
    import utils from '@/util/utils';

    export default {
        name: 'app',
        components: {
            // Search
            PopularMovies
        },
        data() {
            return {
                // searchTerm: '',
                // results: null,
                // mediaInformation: null,
                // actorInformation: null,
                // trailer: null,
                // cast: null,
                // credits: null,
                showPopularMovies: true,
                // displayPopOver: false,
                // positionXY: null,
                // selectedCastMember: null,
                // adult: false,
                // screenWidth: 0,
            };
        },
        methods: {
            async getMediaInformation(mediaType, mediaId) {
                const mediaInformation = await ThemoviedbApi.getMediaInformation(mediaType, mediaId);
                // eslint-disable-next-line no-console
                console.log(mediaInformation);
                document.body.style.backgroundImage = 'url(' + utils.getImageUrl('w1280', mediaInformation.information.backdrop_path) + ')';
                document.body.style.backgroundSize = 'cover';
            }
        }
    };
</script>

<style lang="scss">
    html, body {
        margin: 0;
        padding: 0;
        background-color: #000000;
        color: #ffffff;
        height: 100%;
    }

    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;

        display: grid;
        grid-template-rows: 1fr 1fr 1fr;
        height: 100vh;
        width: 100vw;

        @media screen and (max-width: 992px) {
            flex-direction: column;
            justify-content: flex-start;
            align-items: center;
            margin-top: 20px;
        }

        background-image: linear-gradient(rgba(0, 0, 0, 0.9) 15%, rgba(0, 0, 0, 0.2) 60%, rgba(0, 0, 0, 0.95) 90%);
    }

    .moviedb-logo {
        width: 150px;
        position: absolute;
        left: 10px;
        bottom: 10px;

        @media screen and (max-width: 992px) {
            display: none;
        }
    }

    .moviedb-small-logo {
        width: 50px;
        position: absolute;
        right: 10px;
        top: 10px;

        @media screen and (min-width: 991px) {
            display: none;
        }

        @media screen and (max-width: 530px) {
            display: none;
        }
    }

    ::-webkit-scrollbar {
        width: 10px;
    }

    /* Track */
    ::-webkit-scrollbar-track {
        background: rgba(128, 128, 128, 0.4);
    }

    /* Handle */
    ::-webkit-scrollbar-thumb {
        background: rgba(128, 128, 128, 0.8);
    }

    /* Handle on hover */
    ::-webkit-scrollbar-thumb:hover {
        background: gold;
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
