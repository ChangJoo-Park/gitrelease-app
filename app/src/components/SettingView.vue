<template lang="html">
  <div class="">
    <div class="field-group">
      <md-input-container>
        <label for="sort">Sort by</label>
        <md-select name="sort" id="sort" v-model="sort">
          <md-option v-for="sortOption in sortOptions" :value="sortOption.value">
            {{sortOption.name}}
          </md-option>
        </md-select>
      </md-input-container>
      <md-input-container>
        <label for="sort">Refresh when</label>
        <md-select name="refresh" id="refresh" v-model="refresh">
          <md-option v-for="refreshOption in refreshOptions" :value="refreshOption.value">
            {{refreshOption.name}}
          </md-option>
        </md-select>
      </md-input-container>
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
  },
  data: function () {
    return {
      refreshOptions: [],
      sortOptions: [],
      sort: 'name-desc',
      refresh: 30,
      onRefresh: false
    }
  }
}
</script>

<style lang="scss">
</style>
