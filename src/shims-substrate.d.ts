// vuex-shim.d.ts

import { ComponentCustomProperties } from 'vue'
// // import { Store } from 'vuex'
// import { Store } from '@/store'

import { SubstrateAPI } from './plugins/substrate'
// Vue.prototype.$polkadot = new PolkadotAPI({ chain: 'kusama' })

declare module '@vue/runtime-core' {
  // Declare your own store states.
  // interface State {
  //   count: number
  // }

  interface ComponentCustomProperties {
    $substrate: SubstrateAPI
  }
}