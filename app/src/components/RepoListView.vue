<template lang="html">
  <div class="phone-viewport">
    <md-list class="md-double-line md-dense">
      <md-list-item>
        <md-avatar>
          <img src="https://placeimg.com/40/40/people/1" alt="People">
        </md-avatar>

        <div class="md-list-text-container">
          <span>vuejs/vue</span>
          <span>ABCD</span>
        </div>

        <md-list-expand>
          <div class="item-actions">
            <md-button class="md-icon-button md-dense">
              <md-icon>home</md-icon>
              <md-tooltip md-delay="200" md-direction="left">Show Github Repository</md-tooltip>
            </md-button>
            <md-button class="md-icon-button md-dense">
              <md-icon>label</md-icon>
              <md-tooltip md-delay="200" md-direction="left">Open Github Release note</md-tooltip>
            </md-button>
            <md-button class="md-icon-button md-dense">
              <md-icon>delete</md-icon>
              <md-tooltip md-delay="200" md-direction="left">Remove this repo</md-tooltip>
            </md-button>
          </div>
          <div class="md-body-1 repo-details">
            asdfasdfasdfasdf
          </div>
        </md-list-expand>
      </md-list-item>

    </md-list>
  </div>
</template>

<script>
export default {
  name: 'repo-list-view'
}
</script>

<style lang="scss">
.item-actions {
  text-align: right;
}
.repo-details {
  padding: 10px;
}
</style>
