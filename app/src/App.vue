<template lang="html">
  <div class="">
    <navigation v-bind:connected="isOnline"></navigation>
    <div v-if="isOnline">
      <setting-view class="container" v-if="currentState === 'setting'"></setting-view>
      <new-repo-view class="container" v-if="currentState === 'new'"></new-repo-view>
      <repo-list-view class="container" v-if="currentState === 'list'"></repo-list-view>
    </div>
    <div v-else class="warning-wrapper">
      <div class="warning-item">
        <md-icon class="warning-icon">signal_wifi_off</md-icon>
        <div class="warning-text">Please Check Connection!!</div>
      </div>
    </div>
  </div>

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
    data: function () {
      return {
        isOnline: false
      }
    },
    created: function () {
      this.isOnline = navigator.onLine
      setInterval(() => { this.isOnline = navigator.onLine }, 1000)
    },
    watch: {
      isOnline: function (newVal, oldVal) {
        console.log(newVal)
      }
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
* {
  animation-duration: 0.2s
}

.container {
  padding: 16px;
}

.warning-wrapper {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.warning-item {
  width: 100%;
  text-align: center;
}
.warning-icon {
  font-size: 3em;
  margin-bottom: 1em;
}
.wanring-text {
  font-size: 2em;
  line-height: 2.3em;
}
</style>
