<template lang="pug">
	div {{currentState}}
		button(v-if="isMainView", @click="changeViewState('setting')") S
		button(v-if="isMainView", @click="changeViewState('new')") N
		button(v-if="isNotMainView", @click="changeViewState('list')") X
</template>

<script>
import store from 'src/vuex/store'

export default {
  name: 'navigation',
  computed: {
    currentState: function () {
      return this.$store.getters.currentState
    },
    isMainView: function () {
      return this.currentState === 'list'
    },
    isNotMainView: function () {
      return !this.isMainView
    }
  },
  methods: {
    changeViewState: function (nextState) {
      if (nextState === this.currentState) {
        return
      }
      console.log(nextState)
      this.$store.dispatch('changeViewState', nextState)
    }
  },
  store
}
</script>

<style lang="css" scoped>
</style>
