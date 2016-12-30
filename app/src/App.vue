<template lang="pug">
  div
    navigation
    new-repo-view(v-if="currentState === 'new'")
    repo-list-view(v-else-if="currentState === 'list'")
    setting-view(v-else-if="currentState === 'setting'")
    footer-view
</template>

<script>
  import store from 'src/vuex/store'
  // Components
  import Navigation from './components/NavigationView'
  import FooterView from './components/FooterView'
  import NewRepoView from './components/NewRepoView'
  import RepoListView from './components/RepoListView'
  import SettingView from './components/SettingView'

  export default {
    components: {
      Navigation,
      FooterView,
      NewRepoView,
      RepoListView,
      SettingView
    },
    computed: {
      currentState: function () {
        return this.$store.getters.currentState
      }
    },
    store
  }
</script>

<style>
</style>
