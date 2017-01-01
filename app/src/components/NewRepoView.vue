<template lang="html">
  <div class="">
    <h2 class="md-title">
      New Repository
      <md-spinner v-show="!isLoadDone" md-indeterminate :md-size="20"></md-spinner>
    </h2>
    <form @submit.stop.prevent="submit">
      <md-input-container :class="{ 'md-input-invalid' : hasError }">
        <label>Owner/Repository</label>
        <md-input v-model="newRepositoryName" v-focus></md-input>
        <span v-if="hasError" :class="{ 'md-error' : hasError }">{{message.text}}</span>
      </md-input-container>
    </form>
    <transition name="float-button-transition" enter-active-class="animated zoomIn" leave-active-class="animated zoomOut">
      <md-button
        class="md-icon-button md-raised md-mini md-success md-fab md-fab-custom"
        v-if="isDoneAvailable"
        @click="submit"
      >
        <md-icon>done</md-icon>
      </md-button>
  </transition>
  </div>
</template>

<script>
import _ from 'lodash'
const baseAPI = 'https://api.github.com/repos/'
export default {
  name: 'new-repo-view',
  created: function () {
    this.setMessage(true, '')
  },
  data: function () {
    return {
      newRepositoryName: '',
      newRepository: {},
      message: {},
      preview: {},
      isLoadDone: true,
      hasRelease: false
    }
  },
  watch: {
    newRepositoryName: function (newName) {
      if (!this.isValidInput) {
        this.isLoadDone = true
        return
      }
      this.isLoadDone = false
      this.getRepositoryInfo()
    }
  },
  computed: {
    hasError: function () {
      return !this.isValidInput
    },
    isDoneAvailable: function () {
      const repo = JSON.parse(JSON.stringify(this.newRepositoryName))
      return repo.trim().length !== 0 && !this.hasError && this.isLoadDone && this.hasRelease
    },
    isValidInput: function () {
      const repo = JSON.parse(JSON.stringify(this.newRepositoryName))
      if (repo.trim() === '') {
        this.setMessage(false, '')
        return false
      }
      const validatedNewName = repo.split('/')

      if (validatedNewName.length !== 2) {
        this.setMessage(false, 'Invalid format. using owner/repo')
        return false
      }

      for (let i = 0; i < 2; i++) {
        if (!validatedNewName[i].trim()) {
          this.setMessage(false, 'Invalid format. using owner/repo')
          return false
        }
      }
      this.setMessage(true, '')
      return true
    }
  },
  methods: {
    submit: function () {
      if (this.isDoneAvailable) {
        const newRepo = JSON.parse(JSON.stringify(this.newRepository))
        this.$store.dispatch('createRepository', newRepo).then(function () {
          this.$store.dispatch('changeViewState', 'list')
        }.bind(this))
      }
    },
    setMessage: function (valid, text) {
      this.message.valid = valid
      this.message.text = text
    },
    getLatestRepository: function (url) {
      const vm = this
      return new Promise(function (resolve, reject) {
        vm.$http.get(url).then(function (response) {
          resolve(response)
        }).catch(function (error) {
          reject(error)
        })
      })
    },
    getRepositoryInfo: _.debounce(
      function () {
        const vm = this
        let url = `${baseAPI}${vm.newRepositoryName}`
        vm.hasRelease = false
        vm.$http.get(url).then(function (response) {
          const data = response.data
          console.log(data)
          vm.newRepository = data
          let releaseURL = `${url}/releases/latest`
          console.log('request release')
          vm.getLatestRepository(releaseURL).then(function (response) {
            vm.newRepository.latest_release = response.data
            vm.isLoadDone = true
            vm.hasRelease = true
            console.log(vm.newRepository.latest_release)
            console.log('success release')
          }).catch(function () {
            vm.isLoadDone = true
            vm.hasRelease = false
            console.log('failed release')
          })
        }).catch(function () {
          console.log('failed repo')
          vm.isLoadDone = true
          vm.hasRelease = false
        })
      }, 1000
    )
  }
}
</script>

<style lang="scss">
</style>
