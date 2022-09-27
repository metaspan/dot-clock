<template>
  <v-fade-transition>
    <v-overlay :value="loading" :absolute="absolute">
      <v-container fluid>
        <v-progress-circular
        :size="size"
        color="primary"
        indeterminate
      ></v-progress-circular>
      </v-container>
    </v-overlay>
  </v-fade-transition>
</template>

<script lang="ts">
import Vue from 'vue'
// import { mapState } from 'vuex'

export default Vue.extend({
  // eslint-disable-next-line
  name: 'Loading',
  props: {
    loading: {
      type: Boolean,
      required: true
    },
    size: {
      type: Number,
      required: false,
      default: 150
    },
    absolute: {
      type: Boolean,
      required: false,
      default: false
    }
  }
  // created () {
  //   console.debug('Loading.vue: created')
  // },
  // mounted () {
  //   console.debug('Loading.vue: mounted')
  // }
})
</script>

<style scoped>
.fade-transition-enter-active {
  background-color: #b2fab2;
  transition: background-color 2s, all 2s;
}
.fade-transition-enter-to {
  background-color: white;
}
.fade-transition-leave-active {
  background-color: white;
  transition: background-color 2s, all 2s;
}
.fade-transition-leave-to {
  background-color: #fccece;
}
</style>
