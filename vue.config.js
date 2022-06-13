const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
    transpileDependencies: [
        'vuetify'
    ],
    lintOnSave: false, //문법 검사 중지 
    devServer: {        
        proxy: {
            '/api': {
                target: 'http://odean-server.iptime.org:8081/',
                changeOrigin: true,
                pathRewrite: {
                    "^/api" : '/api'
                }
            },
        }    
    }

})
