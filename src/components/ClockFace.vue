<template>
  <v-container fluid class="clock simple">
    <!-- {{hands}} -->
    <!-- {{seconds2}} -->
    {{am ? 'AM' : 'PM'}}
    <div class="hours-container">
      <div class="hours"></div>
    </div>
    <div class="minutes-container">
      <div class="minutes"></div>
    </div>
    <div class="seconds2-container">
      <div class="seconds2"></div>
    </div>
    <div class="seconds-container">
      <div class="seconds"></div>
    </div>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    seconds2: {
      type: Number,
      required: false
    }
  },
  computed: {
    am () {
      return this.date.hours <= 11
    }
  },
  data () {
    return {
      hands: {
        hours: 0,
        minutes: 0,
        seconds: 0,
        seconds2: 0
      },
      date: {
        // year: 0,
        // month: 0,
        // day: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
      }
    }
  },
  watch: {
    seconds2 (val: number) {
      // console.debug('seconds2', val)
      this.$nextTick(() => {
        this.setSecond2Hand()
      })
    }
  },
  methods: {
    setDate () {
      var date = new Date()
      this.date = {
        hours: date.getHours(), // TODO 24 hours?
        minutes: date.getMinutes(),
        seconds: date.getSeconds()
      }
      this.setSecondHand()
      // this.setSecond2Hand()
    },
    setHourHand () {
      var el = document.querySelector('.hours-container') || new HTMLElement()
      var h = (this.date.hours > 11) ? (this.date.hours - 12) : this.date.hours
      var deg = (h + 1) * 360 / 12
      this.hands.hours = deg
      el.style.webkitTransform = 'rotateZ(' + this.hands.hours + 'deg)'
      el.style.transform = 'rotateZ(' + this.hands.hours + 'deg)'
    },
    setMinuteHand () {
      var el = document.querySelector('.minutes-container') || new HTMLElement()
      var deg = this.date.minutes * 360 / 60
      // console.debug('minutes', this.date.minute, deg)
      this.hands.minutes = deg
      el.style.webkitTransform = 'rotateZ(' + this.hands.minutes + 'deg)'
      el.style.transform = 'rotateZ(' + this.hands.minutes + 'deg)'
      this.setHourHand()
    },
    setSecondHand () {
      var el = document.querySelector('.seconds-container') || new HTMLElement()
      var deg = this.date.seconds * 360 / 60
      this.hands.seconds = deg
      // console.debug('seconds', this.date.second, deg)
      el.style.webkitTransform = 'rotateZ(' + this.hands.seconds + 'deg)'
      el.style.transform = 'rotateZ(' + this.hands.seconds + 'deg)'
      this.setMinuteHand()
    },
    setSecond2Hand () {
      // console.debug('setSecond2Hand()...', this.seconds2)
      var el = document.querySelector('.seconds2-container') || new HTMLElement()
      var deg = this.seconds2 * 360 / 60
      this.hands.seconds2 = deg
      // console.debug('seconds2', this.seconds2, 'deg', deg)
      el.style.webkitTransform = 'rotateZ(' + deg + 'deg)'
      el.style.transform = 'rotateZ(' + deg + 'deg)'
    }
  },
  created () {
    console.debug('ClockFace.vue: created()...')
    // this.initLocalClocks()
  },
  mounted () {
    // this.moveMinuteHands()
    // this.moveSecondHands()
    setInterval(() => {
      this.setDate()
    }, 1000)
  }
})
</script>

<style scoped>
.clock {
  border-radius: 50%;
  background: #fff url(/src/assets/ios_clock.svg) no-repeat center;
  background-size: 88%;
  height: 20em;
  padding-bottom: 31%;
  position: relative;
  width: 20em;
}

.clock.simple:after {
  background: #000;
  border-radius: 50%;
  content: "";
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 5%;
  height: 5%;
  z-index: 10;
}

.minutes-container, .hours-container, .seconds-container, .seconds2-container {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

.hours {
  background: #000;
  border-radius: 15px;
  height: 17%;
  left: 48.75%; /* 2x this + width = 100 */
  position: absolute;
  top: 30%;
  transform-origin: 50% 100%;
  width: 2.5%;
}

.minutes {
  background: #000;
  border-radius: 15px;
  height: 26.5%;
  left: 49%;
  position: absolute;
  top: 20%;
  transform-origin: 50% 100%;
  width: 2%;
}

.seconds {
  /* display: none; */
  /* background: #000; */
  background: navy;
  top: 18%;
  height: 40%;
  left: 49.5%;
  position: absolute;
  transform-origin: 50% 80%;
  width: 1%;
  border-radius: 10px;
  /* width: 4px; */
  z-index: 8;
}
.seconds2 {
  background: red;
  border-radius: 15px;
  height: 45%;
  left: 49.5%;
  position: absolute;
  top: 14%;
  transform-origin: 50% 80%;
  width: 1%;
  z-index: 7;
}

.hours-container {
  /* animation: rotate 43200s infinite linear; */
  animation: rotate 43200s infinite steps(12);
}

.minutes-container {
  /* transition: transform 0.3s cubic-bezier(.4,2.08,.55,.44); */
  animation: rotate 3600s infinite steps(60);
}
.seconds-container {
  /* transition: transform 0.2s cubic-bezier(.4,2.08,.55,.44); */
  animation: rotate 3600s infinite steps(60);
}
.seconds2-container {
  transition: transform 0.25s cubic-bezier(.4,2.08,.55,.44);
  /* animation: rotate 3600s infinite steps(60); */
}
</style>
