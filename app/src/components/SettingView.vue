<template lang="html">
  <div class="">
    <h2 class="md-title">Setting</h2>
    <div class="field-group">
      <md-input-container>
        <label for="sort">Sort by</label>
        <md-select name="sort" id="sort" v-model="setting.sort">
          <md-option v-for="sortOption in sortOptions" :value="sortOption.value">
            {{sortOption.name}}
          </md-option>
        </md-select>
      </md-input-container>
      <md-input-container>
        <label for="sort">Refresh when</label>
        <md-select name="refresh" id="refresh" v-model="setting.refresh">
          <md-option v-for="refreshOption in refreshOptions" :value="refreshOption.value">
            {{refreshOption.name}}
          </md-option>
        </md-select>
      </md-input-container>
      <div class="button-wrapper">
        <md-button class="md-dense" @click="openURL('https://github.com/ChangJoo-Park/gitrelease-app')">
          Github Repository
        </md-button>
        <md-button class="md-dense" @click="openURL('https://github.com/ChangJoo-Park/gitrelease-app/issues')">
          Report an Issue
        </md-button>
      </div>
    </div>
  </div>
</template>

<script>
import { refreshOptions, sortOptions } from '../settings'

export default {
  name: 'setting-view',
  created: function () {
    this.refreshOptions = refreshOptions
    this.sortOptions = sortOptions
    this.setting = JSON.parse(JSON.stringify(this.$store.getters.mainSettings))
  },
  data: function () {
    return {
      refreshOptions: [],
      sortOptions: [],
      setting: {}
    }
  },
  watch: {
    setting: {
      handler: function (newVal, oldVal) {
        console.log(newVal)
        this.updateSetting()
      },
      deep: true
    }
  },
  methods: {
    updateSetting: function () {
      this.$store.dispatch('updateSetting', this.setting)
    },
    openURL: function (url) {
      window.open(url)
    }
  }
}
</script>

<style lang="scss">
.button-wrapper {
  text-align: center;
}
</style>
