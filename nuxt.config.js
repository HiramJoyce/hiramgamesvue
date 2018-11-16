const pkg = require('./package')

module.exports = {
  mode: 'universal',

  /*
  ** Headers of the page
  */
  head: {
    title: pkg.name,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },

  /*
  ** Global CSS
  */
  css: [
    {src:'element-ui/lib/theme-chalk/index.css'}
  ],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    {src:'~plugins/element-ui', ssr: false}
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    '@nuxtjs/axios'
  ],

  axios: {
    proxy: true
  },

  // proxy: [{
  //   '/api': 'http://127.0.0.1:8080'
  // },{
  //   '/player': 'http://127.0.0.1:8080'
  // }],

  proxy: {
    '/api': 'http://127.0.0.1:8080'
  },

  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {

    },
    vendor: ['element-ui', 'vuex']
  }
}
