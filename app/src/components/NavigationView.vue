<template lang="html">
	<div class="">
		<md-toolbar>
		  <h2 class="md-title brand-title" style="flex: 1" @click="changeViewState('list')">Releases!!</h2>
      <transition
        name="navigation-button-transition"
        enter-active-class="animated zoomIn"
        leave-active-class="animated zoomOut"
      >
        <md-button
          class="md-icon-button"
          v-if="isMainView"
          @click="changeViewState('setting')"
        >
  		    <md-icon>settings</md-icon>
  		  </md-button>
        <md-button
          class="md-icon-button"
          v-if="isNotMainView"
          @click="changeViewState('list')"
        >
  		    <md-icon>clear</md-icon>
  		  </md-button>
      </transition>
		</md-toolbar>
    <transition
      name="float-button-transition"
      enter-active-class="animated zoomIn"
      leave-active-class="animated zoomOut"
    >
      <md-button
        class="md-icon-button md-raised md-mini md-primary md-fab md-fab-custom"
        v-if="isMainView"
        @click="changeViewState('new')"
      >
        <md-icon>add</md-icon>
      </md-button>
    </transition>
	</div>
</template>

<script>
import store from 'src/vuex/store'

export default {
  name: 'navigation',
  props: ['connected'],
  computed: {
    currentState: function () {
      return this.$store.getters.currentState
    },
    isMainView: function () {
      return this.currentState === 'list' && this.connected
    },
    isNotMainView: function () {
      return !this.isMainView && this.connected
    }
  },
  methods: {
    changeViewState: function (nextState) {
      if (nextState === this.currentState) {
        return
      }
      console.log(nextState)
      this.$store.dispatch('changeViewState', nextState)
    },
    toggleLeftSidenav: function () {
      this.$refs.leftSidenav.toggle()
    },
    open: function (ref) {
      console.log('Opened: ' + ref)
    },
    close: function (ref) {
      console.log('Closed: ' + ref)
    }
  },
  store
}
</script>

<style lang="css" scoped>
.brand-title {
  cursor: pointer;
}
</style>
