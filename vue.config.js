module.exports = {
    baseUrl: './',
    assetsDir: 'static',
    productionSourceMap: false,
    //访问路径
    publicPath: process.env.NODE_ENV='magnet-system-web'
    // devServer: {
    //     proxy: {
    //         '/api':{
    //             target:'http://jsonplaceholder.typicode.com',
    //             changeOrigin:true,
    //             pathRewrite:{
    //                 '/api':''
    //             }
    //         }
    //     }
    // }
}
