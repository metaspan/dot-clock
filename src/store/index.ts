import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    decimals: {
      0: 1,
      1: 10,
      2: 100,
      3: 1000,
      4: 10000,
      5: 100000,
      6: 1000000,
      7: 10000000,
      8: 100000000,
      9: 1000000000,
      10: 10000000000,
      11: 100000000000,
      12: 1000000000000
    },
    providers: {
      parity: {
        kusama: 'wss://kusama-rpc.polkadot.io',
        polkadot: 'wss://rpc.polkadot.io',
        westend: 'wss://westend-rpc.polkadot.io'
      }
    },
    chains: {
      kusama: {
        id: 'kusama',
        name: 'Kusama',
        endpoint: 'wss://kusama-rpc.polkadot.io'
      },
      polkadot: {
        id: 'polkadot',
        name: 'Polkadot',
        endpoint: 'wss://rpc.polkadot.io'
      },
      westend: {
        id: 'westend',
        name: 'Westend',
        endpoint: 'wss://westend-rpc.polkadot.io'
      }
    },
    chainId: 'kusama',
    chainInfo: {},
    apiConnected: false,
    rpcApi: true // false
  },
  getters: {
  },
  mutations: {
    SET_CHAIN (state: any, chainId: string) {
      state.chainId = chainId
    },
    SET_CHAIN_INFO (state: any, chainInfo: any) {
      state.chainInfo = chainInfo
    },
    SET_RPC_API (state: any, rpcApi: boolean) {
      state.rpcApi = rpcApi
    },
    API_CONNECTED (state: any, connected: boolean) {
      state.apiConnected = connected
    }
  },
  actions: {
    setChain ({ commit }: any, chainId: string) {
      commit('SET_CHAIN', chainId)
    },
    setChainInfo ({ commit }, chainInfo: any) {
      commit('SET_CHAIN_INFO', chainInfo)
    },
    setRpcApi ({ commit }: any, rpcApi: boolean) {
      commit('SET_RPC_API', rpcApi)
    },
    apiConnected ({ commit }) {
      commit('API_CONNECTED', true)
    },
    apiDisconnected ({ commit }) {
      commit('API_CONNECTED', false)
    },
    // eslint-disable-next-line
    apiError ({}, error: any) {
      console.log(error)
    }
  },
  modules: {
  }
})
