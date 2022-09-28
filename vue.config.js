const { defineConfig } = require('@vue/cli-service')
// import { defineConfig } from '@vue/cli-service'

module.exports = defineConfig({

  publicPath: process.env.NODE_ENV === 'production'
    ? '/dot-clock/'
    : '/',

  transpileDependencies: [
    'vuetify'
  ]
})
