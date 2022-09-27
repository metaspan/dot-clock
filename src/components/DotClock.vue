<template>
  <v-container fluid fill-height>
    <v-row align="center">
      <v-col>
        <ClockFace :seconds2="seconds2"></ClockFace>
      </v-col>
      <v-col class="text-center">
        <span class="text-h4 text-md-h3 text-sm-h2 text-lcd"><v-icon large>mdi-clock-outline</v-icon> {{ formatDatetime(localTime) }}</span><br>
        <!-- <v-progress-circular :value="progress"></v-progress-circular> {{ progress.toFixed(2) }}<br> -->
        <ChainDatetime :clockTime="clockTime" :header="header" :loading="loadingApi" />
        <span class="text-body-2 text-sm-body-1">
          Era: {{era}}<br>
          Epoch: {{epoch.epochIndex}}<br>
          <!-- diff: {{slot - epoch.startSlot}}<br> -->
          Slot: {{slot}} (duration: {{epoch.duration / 10/60}}hr)<br>
          <v-progress-linear color="primary"
            size="15"
            width="3"
            :value="(slot - epoch.startSlot) / epoch.duration * 100"
            ></v-progress-linear>
        </span>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <Referenda :block="header.number" :interval="50" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
// import {
//   ApiPromise,
//   WsProvider
// } from '@polkadot/api'
// import {
//   ScProvider,
//   WellKnownChain
// } from '@polkadot/rpc-provider/substrate-connect'
import moment from 'moment-timezone'
import ClockFace from './ClockFace.vue'
import ChainDatetime from './ChainDatetime.vue'
import Referenda from './Referenda.vue'

interface IEpoch {
  epochIndex: number
  startSlot: number
  duration: number
  authorities: any[]
  randomness: string
  config: any
}

// eslint-disable-next-line
interface IData {
  localTime: number
  clockTime: number
  header: any
  progress: number
  datetimeFormat: string
  loadingApi: boolean
  // provider: null | WsProvider | ScProvider
  // api: null | ApiPromise
  // eslint-disable-next-line
  // clockSub: any
  unsub: Record<string, any>
  era: number
  epoch: IEpoch
  session: number
  slot: number
  // referenda: IReferendum[]
}
// eslint-disable-next-line
interface IMethods {
  formatDatetime (dt: any): string
  setLocalTime (): void
  setApi (): void
  subChainClock (): void
  subChainHeads (): void
  setProgress (): void
  unsubAll (): void
  readReferenda (): void
}
// eslint-disable-next-line
interface IComputed {
  chainId: string
  chains: any
  rpcApi: boolean
  seconds2: number
}
// eslint-disable-next-line
interface IProps {
  chainId_: string
}

const endpoints = {
  kusama: '',
  polkadot: ''
}

export default Vue.extend<IData, IMethods, IComputed, IProps>({
  name: 'DotClock',
  components: {
    ClockFace,
    ChainDatetime,
    Referenda
  },
  props: {
    chainId_: {
      type: String,
      required: false
    }
  },
  computed: {
    ...mapState(['chainId', 'chains', 'rpcApi']),
    seconds2 () {
      return moment(this.clockTime).seconds()
    }
  },
  watch: {
    chainId (val) {
      this.setApi()
    },
    rpcApi (val) {
      this.setApi()
    }
  },
  data () {
    return {
      localTime: 0,
      clockTime: 0,
      header: {
        number: 0
      },
      progress: 0,
      datetimeFormat: 'YYYY.MM.DD HH:mm:ss',
      // rpcApi: false,
      loadingApi: true,
      provider: null,
      api: null,
      // clockSub: null,
      unsub: {
        clock: null,
        chainHeads: null
      },
      era: 0,
      epoch: {
        epochIndex: 0,
        startSlot: 0,
        duration: 0,
        authorities: [],
        randomness: '',
        config: {}
      },
      session: 0,
      slot: 0
    }
  },
  methods: {
    formatDatetime (dt) {
      return moment(Number(dt)).format(this.datetimeFormat)
    },
    async setApi () {
      console.debug('setApi(), rpc:', this.rpcApi, 'chain:', this.chainId)
      this.loadingApi = true
      this.header = { number: 0 }
      this.unsubAll()
      const ci = await this.$substrate.connect(this.chainId, this.rpcApi)
      await this.$store.dispatch('setChainInfo', ci)
      // console.log('provider', provider)
      this.loadingApi = false
      this.subChainClock()
      this.subChainHeads()
    },
    setLocalTime () {
      const lt = new Date().getTime()
      // console.debug('tick...', lt)
      this.localTime = lt // Number(moment().milliseconds())
      this.setProgress()
    },
    setProgress () {
      this.progress = (this.localTime - this.clockTime) / 1000 / 6 * 100
    },
    async subChainClock () {
      this.unsub.clock = await this.$substrate.api?.query.timestamp.now((ts: any) => {
        // console.log(`${i++} The last block has a timestamp of ${moment(Number(ts.toString())).format(numberFormat)}`)
        this.clockTime = Number(ts.toString())
        this.setProgress()
      })
    },
    async subChainHeads () {
      this.unsub.chainHeads = await this.$substrate.api?.rpc.chain.subscribeNewHeads(async (lastHeader: any) => {
        // console.log(`${chain}: last block #${lastHeader.number} has hash ${lastHeader.hash}`)
        // console.debug('lastHeader', lastHeader.toJSON())
        this.header = lastHeader.toJSON()

        // https://wiki.polkadot.network/docs/maintain-polkadot-parameters
        // https://guide.kusama.network/docs/kusama-parameters/
        // era has 6 epochs (or sessions)
        // An era is 24 hours on Polkadot and 6 hours on Kusama
        // A slot is ~6 seconds
        const era = await this.$substrate.api.query.staking.currentEra()
        // console.debug('era:', era.toString())
        this.era = Number(era.toString())

        // const activeEra = await this.$substrate.api.query.staking.activeEra()
        // console.debug('activeEra', activeEra.toJSON())

        // const currSession = await this.$substrate.api.query.staking.currentPlannedSession()
        // console.debug('currSession', currSession.toJSON())

        const epoch = await this.$substrate.api.call.babeApi.currentEpoch()
        // console.debug('epoch', epoch.toJSON())
        this.epoch = epoch.toJSON()

        const slot = await this.$substrate.api.query.babe.currentSlot()
        // console.debug('slot', slot.toJSON())
        this.slot = Number(slot.toString())

        // const currentPhase = await this.$substrate.api.query.electionProviderMultiPhase.currentPhase()
        // console.debug('currentPhase', currentPhase.toJSON())

        // // every 10 blocks, read refernda
        // if (this.header.number % 10 === 0) {
        //   this.readReferenda()
        // }
      })
    },
    async unsubAll () {
      console.debug('unsubAll()...')
      if (this.unsub.clock) this.unsub.clock()
      if (this.unsub.chainHeads) this.unsub.chainHeads()
    }
  },
  async created () {
    console.debug(this.$route, this.$router)
    if (this.chainId_ !== this.$store.state.chainId) {
      await this.$store.dispatch('setChain', this.chainId_)
    }
  },
  async mounted () {
    console.debug('mounted...', this.chainId)
    this.setApi()
    setInterval(() => {
      this.setLocalTime()
    }, 1000)
  },
  beforeDestroy () {
    this.unsubAll()
  }
})
</script>

<style scoped>
.full {
  background-color: pink;
  height: 100vh;
}
/* .text-center {
  text-align: center !important;
} */
@font-face{
 font-family:'digital-clock-font';
 /* src: url('/src/assets/open_24_display_st/Open 24 Display St.ttf'); */
 /* src: url('/src/assets/hacked_crt/Hacked CRT.ttf'); */
 src: url('/src/assets/Calculator.ttf');
}
.text-lcd {
  /* font-family: 'Orbitron', sans-serif; */
  font-family:'digital-clock-font' !important;
}
</style>
