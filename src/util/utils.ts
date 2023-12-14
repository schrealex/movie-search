export default {
    getImageUrl: (size: number, filePath: string): string => {
        if (!filePath) return '';
        return 'https://image.tmdb.org/t/p/' + size + filePath;
    },
};
