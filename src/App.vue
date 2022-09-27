<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <div class="d-flex align-center">
        DotClock
        <!-- <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
          transition="scale-transition"
          width="40"
        /> -->

        <!-- <v-img
          alt="Vuetify Name"
          class="shrink mt-1 hidden-sm-and-down"
          contain
          min-width="100"
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-name-dark.png"
          width="100"
        /> -->
      </div>

      <v-spacer></v-spacer>

      <!-- <v-btn
        href="https://github.com/vuetifyjs/vuetify/releases/latest"
        target="_blank"
        text
      >
        <span class="mr-2">Latest Release</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn> -->

      <v-toolbar-items>

        <v-container fluid width="150px">
          <v-row>
            <v-col class="col-4">Direct</v-col>
            <v-col class="col-4">
              <v-switch small
                v-model="rpcApi"
              ></v-switch>
            </v-col>
            <v-col class="col-4">RPC</v-col>
          </v-row>
        </v-container>

        <v-menu>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="primary"
              dark
              v-bind="attrs"
              v-on="on"
            >
              {{ getChain.name }}
            </v-btn>
          </template>
          <v-list>
            <v-list-item
              v-for="(item, index) in chains"
              :key="index"
              @click="setChain(item)"
            >
              <v-list-item-title>{{ item.name }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>

      </v-toolbar-items>

      <!-- <v-menu>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            color="primary"
            dark
            v-bind="attrs"
            v-on="on"
          >
            {{ getChain.name }}
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            v-for="(item, index) in chains"
            :key="index"
            @click="setChain(item)"
          >
            <v-list-item-title>{{ item.name }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu> -->
    </v-app-bar>

    <v-main>
      <router-view/>
      <!-- <DotClock /> -->
    </v-main>

  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
// import DotClock from './components/DotClock.vue'

export default Vue.extend({
  name: 'App',
  components: {
    // DotClock
  },
  computed: {
    ...mapState(['chains', 'chainId']),
    getChain () {
      return this.chains[this.chainId] || {}
    },
    rpcApi: {
      get () { return this.$store.state.rpcApi },
      set (val) { this.$store.dispatch('setRpcApi', val) }
    }
  },
  // watch: {
  //   rpcApi (val) {
  //     this.rpcApi_ = val
  //   },
  // },
  // data: () => ({
  //   rpcApi_: false
  // }),
  methods: {
    async setChain (item: any) {
      await this.$store.dispatch('setChain', item.id)
      this.$router.push(`/${item.id}`)
    }
  },
  async created () {
    if (this.$route.path === '/') {
      this.$store.dispatch('setChain', 'kusama')
      this.$router.push('/kusama')
    }
  }
})
</script>
