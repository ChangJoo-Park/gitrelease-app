<template lang="html">
  <md-list-item>
    <md-avatar class="avatar">
      <img :src="repo.owner.avatar_url">
    </md-avatar>
    <div class="md-list-text-container">
      <span>{{repo.full_name}}</span>
      <span>{{repo.latest_release.tag_name}}</span>
      <!-- <div class="item-actions">
        <md-button class="md-icon-button md-dense" @click="openURL(repo.html_url)">
          <md-icon>home</md-icon>
          <md-tooltip md-delay="200" md-direction="left">Show Github Repository</md-tooltip>
        </md-button>
        <md-button class="md-icon-button md-dense" @click="openURL(repo.latest_release.html_url)">
          <md-icon>label</md-icon>
          <md-tooltip md-delay="200" md-direction="left">Open Github Release note</md-tooltip>
        </md-button>
        <md-button class="md-icon-button md-dense" @click="removeReposotiry(repo)">
          <md-icon>delete</md-icon>
          <md-tooltip md-delay="200" md-direction="left">Remove this repo</md-tooltip>
        </md-button>
      </div>
      <div class="md-body-1 repo-details">
        <p class="md-caption">{{repo.description}}</p>
        <div class="markdown">
          <div v-html="parsedMarkdown">
          </div>
        </div>
      </div> -->
    </div>
    <md-menu md-direction="bottom left" md-size="4">
      <md-button class="md-icon-button" md-menu-trigger>
        <md-icon>more_vert</md-icon>
      </md-button>

      <md-menu-content>
        <md-menu-item @click="openURL(repo.html_url)">
          <span>Open Github Repo</span>
          <md-icon>home</md-icon>
        </md-menu-item>

        <md-menu-item @click="openURL(repo.latest_release.html_url)">
          <span>Open Release Note</span>
          <md-icon>label</md-icon>
        </md-menu-item>

        <md-menu-item @click="removeReposotiry(repo)">
          <span>Delete this</span>
          <md-icon>delete</md-icon>
        </md-menu-item>
      </md-menu-content>
    </md-menu>
  </md-list-item>
</template>

<script>
import marked from 'marked'
export default {
  props: ['repo'],
  computed: {
    parsedMarkdown: function () {
      const markedRenderer = new marked.Renderer()
      markedRenderer.link = function (href, title, text) {
        var external, newWindow, out
        external = /^https?:\/\/.+$/.test(href)
        newWindow = external || title === 'newWindow'
        out = `<a href="${href}"`
        if (newWindow) {
          out += ' target="_blank"'
        }
        if (title && title !== 'newWindow') {
          out += `title=${title}`
        }
        out += `> ${text}</a>`
        return out
      }

      marked.setOptions({
        renderer: markedRenderer,
        gfm: true,
        tables: true,
        breaks: false,
        pedantic: false,
        sanitize: false,
        smartLists: true,
        smartypants: false
      })

      return marked(this.repo.latest_release.body)
    }
  },
  methods: {
    openURL: function (url) {
      console.log(url)
      if (url.trim() === '') {
        return
      }
      window.open(url)
    },
    removeReposotiry: function (repo) {
      const repository = JSON.parse(JSON.stringify(repo))
      console.log(repository)
      this.$store.dispatch('destroyRepository', repository)
    }
  }
}
</script>

<style lang="scss">
  .markdown {
    padding: 5px;
    font-size: 0.9em;
  }
</style>
