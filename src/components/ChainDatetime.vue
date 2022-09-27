<template>
  <v-container fluid elevation-2>
    <!-- API: {{loadingApi}}<br> -->
    <span id="datetime" class="text-h4 text-md-h3 text-sm-h2 text-lcd"><v-icon large>mdi-link-variant</v-icon> {{ formatDatetime(clockTime) }}</span><br>
    <span id="block" class="text-h4 text-md-h3 text-sm-h2 text-lcd"><v-icon large>mdi-cube-outline</v-icon> {{header.number}}</span>
    <Loading :loading="loading" :absolute="true" />
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import moment from 'moment-timezone'
import Loading from './Loading.vue'

export default Vue.extend({
  name: 'ChainDatetime',
  components: {
    Loading
  },
  props: {
    loading: {
      type: Boolean
    },
    clockTime: {
      type: Number,
      required: true
    },
    header: {
      type: Object,
      required: true
    }
  },
  watch: {
    clockTime () {
      const el = document.getElementById('datetime') || new HTMLElement()
      el.classList.toggle('active')
      setTimeout(() => {
        el.classList.toggle('active')
      }, 1000)
    },
    header: {
      deep: true,
      handler () {
        const el = document.getElementById('block') || new HTMLElement()
        el.classList.toggle('active')
        setTimeout(() => {
          el.classList.toggle('active')
        }, 1000)
      }
    }
  },
  data () {
    return {
      datetimeFormat: 'YYYY.MM.DD HH:mm:ss'
    }
  },
  methods: {
    formatDatetime (dt: any) {
      return moment(Number(dt)).format(this.datetimeFormat)
    }
  }
})
</script>

<style scoped>
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
.active {
  color: red;
}
</style>
