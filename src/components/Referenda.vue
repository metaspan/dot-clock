<template>
  <v-card>
    <v-card-title>
      <v-row>
        <v-col>
          Referenda <v-btn text disabled :loading="loading"></v-btn>
        </v-col>
        <v-col align="end">
          <a :href="`https://polkadot.js.org/apps/?rpc=${endpoint}#/democracy`" class="external-link" target="_blank">
            <span class="text-h6">Democracy <v-icon small>mdi-open-in-new</v-icon></span>
          </a>
        </v-col>
      </v-row>
    </v-card-title>
    <v-card-text>
      <v-list dense>
        <v-list-item v-for="item in referenda" v-bind:key="item.index">
          <!-- {{item}} -->
          <!-- <v-list-item-icon></v-list-item-icon> -->
          <v-list-item-content>
            <v-list-item-title>
              <v-row>
                <v-col>
                  <v-icon small>mdi-vote-outline</v-icon>
                  {{item.index}} {{item?.threshold}} ({{item?.end}} - {{estimateTime(item)}})
                </v-col>
                <v-col></v-col>
                <v-col align="end">
                  <v-icon small>mdi-thumb-up-outline</v-icon> {{ parseHex(item?.tally?.ayes) }} /
                  <v-icon small>mdi-thumb-down-outline</v-icon> {{ parseHex(item?.tally?.nays) }}
                </v-col>
              </v-row>
            </v-list-item-title>
            <v-list-item-subtitle>
              <v-progress-linear
                background-color="red"
                color="blue"
                :value="item?.tally?.ayes / item?.tally?.ayes + item?.tally?.nays">
              </v-progress-linear>
            </v-list-item-subtitle>
          </v-list-item-content>
          <!-- <v-list-item-action>
            <v-list-item-action-text>lll</v-list-item-action-text>
            link
          </v-list-item-action> -->
        </v-list-item>
      </v-list>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
// import { hashToNumber } from '@polkadot/api'
import { hexToString, hexToNumber, hexToBigInt } from '@polkadot/util'
import { mapState } from 'vuex'
import moment from 'moment-timezone'

interface IRefTally {
  ayes: number
  nays: number
  turnout: string
}
interface IRefOngoing {
  delay: number // blocks?
  end: number // block
  proposalHash: string
  tally: IRefTally
  threshold: string // "SimpleMajority"
}
interface IRefFinished {
  approved: boolean
  end: number // block
}
interface IReferendum {
  index: number
  finished?: IRefFinished
  ongoing?: IRefOngoing
}
interface IData {
  loading: boolean
  referenda: IReferendum[]
  numDecimals: number
}
interface IMethods {
  estimateTime (ref: IReferendum): any
  toCoin (val: any): string
  parseHex (val: any): any
  readReferenda (): void
}
interface IComputed {
  chainId: string
  chainInfo: any
  endpoint: any
  chains: any
  decimals: Record<string, number>
  // items: any[]
}
interface IProps {
  block: number
  interval: number
}

export default Vue.extend<IData, IMethods, IComputed, IProps>({
  name: 'ChainReferenda',
  props: {
    block: {
      type: Number,
      required: true
    },
    interval: {
      type: Number,
      required: false,
      default: 50 // 5 minutes // block=6s
    }
  },
  computed: {
    ...mapState(['chainId', 'decimals', 'chainInfo', 'chains']),
    endpoint () {
      console.debug('chains', this.chains)
      return this.chains[this.chainId].endpoint
    }
  },
  data () {
    return {
      loading: true,
      referenda: [],
      numDecimals: 0
    }
  },
  watch: {
    chainId () {
      if (!this.loading) {
        this.referenda = []
        this.readReferenda()
      }
    },
    block (val: number) {
      if (!this.loading && val % this.interval === 0) this.readReferenda()
    }
  },
  methods: {
    estimateTime (ref: IReferendum) {
      // console.debug('estimateTime()', ref)
      const remainingBlocks = (ref.end || 0) - this.block
      return moment().add(remainingBlocks * 6, 'seconds').fromNow()
    },
    toCoin (val: any) {
      // console.debug('toCoin()', val)
      const decimalPlaces = this.chainInfo?.tokenDecimals?.toJSON()[0] || 0
      // const denom = this.denoms[this.chainInfo.tokenDecimals]
      return (Number(val) / this.decimals[decimalPlaces])
        .toLocaleString('en-GB', { maximumFractionDigits: this.numDecimals }) // .toFixed(4)
    },
    parseHex (val: any) {
      // console.debug('parseHex()', val)
      // return hexToString(val)
      // return hexToNumber(val)
      try {
        return this.toCoin(hexToBigInt(val))
      } catch (err) {
        return this.toCoin(val)
      }
    },
    async readReferenda () {
      this.loading = true
      const count = await this.$substrate.api.query.democracy?.referendumCount()
      // console.debug('count', count?.toJSON() || 0)
      var list: IReferendum[] = []
      for (var i = 0; i < count; i++) {
        const info = await this.$substrate.api.query.democracy.referendumInfoOf(i)
        const ref: IReferendum = info.toJSON()
        // console.debug(ref)
        if (ref?.ongoing) {
          // console.debug(i, info.toJSON())
          list.push({ index: i, ...ref.ongoing })
        }
      }
      this.referenda = list
      this.loading = false
    }
  },
  async mounted () {
    console.debug('Referenda.vue: mounted()')
    // await this.$substrate.isReady
    setTimeout(() => {
      this.readReferenda()
    }, 3000)
  }
})
</script>

<style scoped>
.external-link {
  text-decoration: none;
}
</style>
