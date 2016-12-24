// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const {ipcRenderer} = require('electron')

const app = new Vue({
  el: '#app',
  created: function () {
    this.state = 'list'
    console.log(ipcRenderer)
    ipcRenderer.send('db:initialize')
    ipcRenderer.on('db:responseDB', function(event, args){
      console.log('response db')
      console.log(args);
    })
  },
  data: function () {
    return {
      state: '',
      repositories: [],
      newRepositoryName: '',
      newRepository: '',
      requestMessage: '',
      currentIndex: -1,
      isLoading: false
    }
  },
  watch: {
    state: function (nextState, oldState) {
      if(nextState === 'list') {
        this.newRepositoryName = '';
        this.newRepository = '';
        this.requestMessage = '';
        this.currentIndex = -1
      }

      if(nextState === 'edit') {
        this.newRepository = this.repositories[this.currentIndex];
        this.newRepositoryName = this.newRepository.full_name;
      }
    },
    newRepositoryName: function (newName) {
      // newName 형식 체크 해야함
      const validation = this.validateRepo(newName);
      if(!validation.isValid) {
        this.requestMessage = validation.message
        return;
      }
      this.newRepository = '';
      this.requestMessage = '';
      this.isLoading = true;
      this.getGithub()
    }
  },
  methods: {
    validateRepo: function(repo) {
      if(repo.trim() === '') {
        return {isValid: false, message: 'Need `owner/repo`'};
      }
      const validatedNewName = repo.split('/');
      if(validatedNewName.length !== 2) {
        return {isValid: false, message: 'Need one `/`'};
      }
      for(let i = 0; i < 2; i++) {
        if(!validatedNewName[i].trim()) {
          return {isValid: false, message: 'Not empty owner and repository'};
        }
      }
      return {isValid: true, message: 'Valid'};
    },
    getGithub: _.debounce(
      function () {
        const vm = this;
        let url = `https://api.github.com/repos/${vm.newRepositoryName}`;
        axios.get(url)
        .then(function(response) {
          vm.newRepository = response.data
          vm.requestMessage = '';
          vm.isLoading = false;
        })
        .catch(function(error){
          vm.requestMessage = error.response.data.message;
          vm.newRepository = '';
          vm.isLoading = false;
        });
      }, 500
    ),
    changeState: function (nextState, repoIndex) {
      if (nextState === 'edit' && repoIndex !== -1) {
        this.currentIndex = repoIndex
      }
      this.state = nextState
    },
    addRepository: function () {
      if(!this.newRepository) {
        return;
      }
      this.repositories.push(this.newRepository)
      this.changeState('list')
    },
    updateRepository: function () {
      this.changeState('list')
    },
    removeRepository: function () {
      this.repositories.splice(this.currentIndex, 1)
      this.changeState('list')
    }
  }
})
