export default {
    port: 3005,
    bodyLimit: '300kb',
    mongodb: '~',
    jwtTokenTime: 60 * 60 * 24 * 15,
    jwtTokenSecret: '~',
    mongoosePaginate: {
        limit: 50,
        page: 1
    }
}
