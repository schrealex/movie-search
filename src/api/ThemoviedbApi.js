import axios from 'axios';

const getMediaInformation = (mediaType, mediaId) => {
    // eslint-disable-next-line no-console
    console.log({mediaType, mediaId});
    // return axios
    //     .get(`https://api.themoviedb.org/3/${mediaType}/${mediaId}?api_key=${process.env.VUE_APP_API_KEY}&language=en-US`)
    //     .then(response => {
    //         // this.mediaInformation = response.data;
    //         // eslint-disable-next-line no-console
    //         console.log({data: response.data});
    //         return response.data;
    //         // document.body.style.backgroundImage = 'url(' + this.getImageUrl('w1280', this.mediaInformation.backdrop_path) + ')';
    //         // document.body.style.backgroundSize = 'cover';
    //     });
    // getTrailer(mediaType, mediaId);
    // getCast(mediaType, mediaId);
    // getExternalIDs(mediaType, mediaId);

    return axios.all([
        axios.get(`https://api.themoviedb.org/3/${mediaType}/${mediaId}?api_key=${process.env.VUE_APP_API_KEY}&language=en-US`),
        axios.get(`https://api.themoviedb.org/3/${mediaType}/${mediaId}/videos?api_key=${process.env.VUE_APP_API_KEY}&language=en-US`),
        axios.get(`https://api.themoviedb.org/3/${mediaType}/${mediaId}/credits?api_key=${process.env.VUE_APP_API_KEY}`),
        axios.get(`https://api.themoviedb.org/3/${mediaType}/${mediaId}/external_ids?api_key=${process.env.VUE_APP_API_KEY}`)
    ])
        .then(axios.spread((mediaInformation, trailer, cast, externalIds) => {
            return {
                information: mediaInformation.data,
                trailer: trailer.data,
                cast: cast.data,
                externalIds: externalIds.data,
            };
        }))
        .catch((error) => error);
};

const getTrailer = (mediaType, mediaId) => {
    axios
        .get(`https://api.themoviedb.org/3/${mediaType}/${mediaId}/videos?api_key=${process.env.VUE_APP_API_KEY}&language=en-US`)
        .then(response => {
            // eslint-disable-next-line no-unused-vars
            let trailers = response.data.results;
            trailers = trailers.filter(t => t.site === 'YouTube');
            // this.trailer = `https://www.youtube.com/watch?v=${trailers[0].key}`;
        });
};

const getCast = (mediaType, mediaId) => {
    axios
        .get(`https://api.themoviedb.org/3/${mediaType}/${mediaId}/credits?api_key=${process.env.VUE_APP_API_KEY}`)
        // eslint-disable-next-line no-unused-vars
        .then(response => {
            // this.cast = response.data.cast.slice(0, 5);
        });
};

export const getExternalIDs = (mediaType, mediaId) => {
    axios
        .get(`https://api.themoviedb.org/3/${mediaType}/${mediaId}/external_ids?api_key=${process.env.VUE_APP_API_KEY}`)
        // eslint-disable-next-line no-unused-vars
        .then(response => {
            // this.mediaInformation = {
            //     ...this.mediaInformation,
            //     externalIds: response.data,
            // };
        });
};

const api = {
    getMediaInformation,
    getTrailer,
    getCast
};

export default api;
