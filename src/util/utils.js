export default {
    getImageUrl: (size, filePath) => {
        return 'http://image.tmdb.org/t/p/' + size + filePath;
    }
};
