// import Vue from 'vue'
import { ScProvider, WellKnownChain } from '@polkadot/rpc-provider/substrate-connect'
// import { ApiPromise } from '@polkadot/api'
import { ApiPromise, WsProvider } from '@polkadot/api'

import store from '../store'

type TEndpoints = Record<string, Record<string, string>>
const endpoints: TEndpoints = {
  polkadot: {
    parity: 'wss://rpc.polkadot.io',
    onFinality: 'wss://polkadot.api.onfinality.io/public-ws',
    dwellir: 'wss://polkadot-rpc.dwellir.com'
  },
  kusama: {
    // local: 'wss://192.168.1.85:30225',
    // local: 'http://192.168.1.85:40224',
    onFinality: 'wss://kusama.api.onfinality.io/public-ws',
    parity: 'wss://kusama-rpc.polkadot.io',
    dwellir: 'wss://kusama-rpc.dwellir.com'
  },
  westend: {
    // local: 'wss://192.168.1.85:30225',
    // local: 'http://192.168.1.85:40224',
    onFinality: 'wss://westend.api.onfinality.io/public-ws',
    parity: 'wss://westend-rpc.polkadot.io',
    dwellir: 'wss://westend-rpc.dwellir.com'
  }
  // parallel: {
  //   onFinality: 'wss://parallel.api.onfinality.io/public-ws'
  // }
}

class SubstrateAPI {
  // eslint-disable-next-line
  config: any = {
    lite: false,
    chain: 'kusama',
    endpoint: 'onFinality'
  }

  chainId = ''

  // // eslint-disable-next-line
  // kusama: any
  // // eslint-disable-next-line
  // polkadot: any

  // eslint-disable-next-line
  provider: any
  // eslint-disable-next-line
  api: any

  // eslint-disable-next-line
  constructor (options: any) {
    this.config = { ...this.config, ...options }
  }

  async onError (err: any) {
    console.warn(`plugins/substrate.ts: on('error', ${this.chainId})`)
    await store.dispatch('apiError', { chainId: this.chainId, error: err })
    console.error(err)
  }

  async onConnected () {
    console.debug(`plugins/substrate.ts: on('connected', ${this.chainId})`)
    await store.dispatch('apiConnected', this.chainId)
  }

  async onDisconnected (evt: any) {
    console.debug(`plugins/substrate.ts: on('disconnected', ${this.chainId})`)
    console.debug(evt)
    await store.dispatch('apiDisconnected', this.chainId)
  }

  async createWsProvider (chainId = 'kusama', endpoint = 'parity'): Promise<WsProvider> {
    // const _chain = chain || 'kusama'
    // const _endpoint = endpoint || 'parity'
    console.debug('plugins/substrate.ts: createWsProvider()', chainId, endpoint)
    this.provider = new WsProvider(endpoints[chainId][endpoint])
    this.provider.on('error', this.onError)
    this.provider.on('connected', this.onConnected)
    this.provider.on('disconnected', this.onDisconnected)
    console.debug('plugins/substrate.ts: about to connect', chainId)
    await this.provider.connect()
    const api = await ApiPromise.create({ provider: this.provider })
    await api.isReady
    console.debug(`subsrate.ts: createWsProvider(${chainId}) api isReady`)
    this.api = api
    return this.provider
  }

  async createScProvider (chain: string): Promise<ScProvider> {
    console.debug('plugins/substrate.ts: createScProvider()', chain)
    switch (chain) {
      case 'kusama':
        this.provider = new ScProvider(WellKnownChain.ksmcc3)
        break
      case 'polkadot':
        this.provider = new ScProvider(WellKnownChain.polkadot)
        break
      case 'westend':
        this.provider = new ScProvider(WellKnownChain.westend2)
        break
    }
    this.provider.on('error', this.onError)
    this.provider.on('connected', this.onConnected)
    this.provider.on('disconnected', this.onDisconnected)
    await this.provider.connect()
    const api = await ApiPromise.create({ provider: this.provider })
    await api.isReady
    this.api = api
    return this.provider
  }

  async connect (chainId = 'kusama', rpc = true): Promise<void> {
    this.chainId = chainId
    if (this.provider) { this.api?.disconnect(); this.provider = null }
    if (!rpc) {
      console.debug('Creating ScProvider()')
      await this.createScProvider(chainId)
    } else {
      console.debug('Creating WsProvider()')
      await this.createWsProvider(chainId)
    }
    console.debug(`plugins/substrate.ts: connect(${chainId}): we have an api...`)
    const ci = await this.chainInfo(chainId)
    return ci
  }

  // eslint-disable-next-line
  async chainInfo (chainId: string): Promise<any> {
    console.debug('plugins/substrate.ts: chainInfo()', chainId)
    // const chainInfo = await this[chain].api.registry.getChainProperties()
    const chainInfo = await this.api.registry.getChainProperties()
    console.debug(`plugins/substrate.ts: chainInfo(${chainId})`, chainInfo)
    return chainInfo.toJSON()
  }
}

export { SubstrateAPI }
