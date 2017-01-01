<template lang="html">
  <div class="phone-viewport md-list-view">
    <md-list class="md-double-line">
      <repo-item v-for="repo in repositories" v-bind:repo="repo"></repo-item>
    </md-list>
  </div>
</template>

<script>
import RepoItem from './RepoItem'

export default {
  name: 'repo-list-view',
  components: {
    RepoItem
  },
  computed: {
    repositories: function () {
      return this.$store.getters.mainRepositories
    }
  }
}
</script>

<style lang="scss">
.md-list-view {
  padding-bottom: 45px;
}
.item-actions {
  text-align: right;
}
.repo-details {
  padding: 10px;
}
.avatar {
  border-radius: 0 !important;
}
</style>
