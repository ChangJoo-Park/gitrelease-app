// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const app = new Vue({
  el: '#app',
  created: function () {
    this.state = 'list'
  },
  data: function () {
    return {
      state: '',
      repositories: [],
      newRepository: '',
      currentIndex: -1
    }
  },
  methods: {
    changeState: function (nextState, repoIndex) {
      if (nextState === 'edit' && repoIndex !== -1) {
        this.currentIndex = repoIndex
      }
      this.state = nextState;
    },
    addRepository: function () {
      var newRepo = this.newRepository.trim();
      if(!newRepo)  {
        console.log('empty')
        return;
      }
      this.repositories.push(newRepo)
      this.changeState('list')
    },
    updateRepository: function () {
      this.backToList();
    },
    removeRepository: function () {
      this.repositories.splice(this.currentIndex, 1);
      this.backToList();
    },
    backToList: function () {
      this.changeState('list');
      this.currentIndex = -1;
    }
  }
});
