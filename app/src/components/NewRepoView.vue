<template lang="html">
  <div class="">
    <form @submit.stop.prevent="submit">
      <md-input-container :class="{ 'md-input-invalid' : hasError }">
        <label>Owner/Repository</label>
        <md-input v-model="newRepository" v-focus></md-input>
        <span v-if="hasError" :class="{ 'md-error' : hasError }">{{message.text}}</span>
      </md-input-container>
    </form>
    <transition name="float-button-transition" enter-active-class="animated zoomIn" leave-active-class="animated zoomOut">
      <md-button
        class="md-icon-button md-raised md-mini md-success md-fab md-fab-bottom-right"
        v-if="isDoneAvailable"
      >
        <md-icon>done</md-icon>
      </md-button>
  </transition>
  </div>
</template>

<script>
export default {
  name: 'new-repo-view',
  created: function () {
    this.setMessage(true, '')
  },
  data: function () {
    return {
      newRepository: '',
      message: {}
    }
  },
  computed: {
    hasError: function () {
      return !this.isValidInput
    },
    isDoneAvailable: function () {
      const repo = JSON.parse(JSON.stringify(this.newRepository))
      return repo.trim().length !== 0 && !this.hasError
    },
    isValidInput: function () {
      const repo = JSON.parse(JSON.stringify(this.newRepository))
      if (repo.trim() === '') {
        this.setMessage(true, '')
        return true
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
      window.alert('')
    },
    setMessage: function (valid, text) {
      this.message.valid = valid
      this.message.text = text
    }
  }
}
</script>

<style lang="scss">
</style>
