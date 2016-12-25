// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const {ipcRenderer} = require('electron')
const open = require('open');
const markedRenderer = new marked.Renderer();
markedRenderer.link = function(href, title, text) {
  var external, newWindow, out;
  external = /^https?:\/\/.+$/.test(href);
  newWindow = external || title === 'newWindow';
  out = "<a href=\"" + href + "\"";
  if (newWindow) {
    out += ' target="_blank"';
  }
  if (title && title !== 'newWindow') {
    out += " title=\"" + title + "\"";
  }
  return out += ">" + text + "</a>";
};

const RepositoryComponent = Vue.component('repository', {
  template: '#repository',
  props: ['repo'],
  data: function () {
    return {
      isOpen: false
    }
  },
  computed: {
    compiledMarkdown: function () {
      marked.setOptions({renderer: markedRenderer});
      return marked(this.repo.latest_release.body, { sanitize: true })
    }
  },
  methods: {
    toggleOpen: function () {
      this.isOpen = !this.isOpen;
    }
  }
})

const app = new Vue({
  el: '#app',
  created: function () {
    this.state = 'list'
    ipcRenderer.send('db:initialize')
    ipcRenderer.on('db:responseDB', function (event, args) {
      this.repositories = args;
    }.bind(this))
  },
  data: function () {
    return {
      state: '',
      repositories: [],
      newRepositoryName: '',
      newRepository: '',
      requestMessage: '',
      isNoRelease: false,
      isDisabled: false,
      isLoading: false
    }
  },
  watch: {
    state: function (nextState, oldState) {
      this.newRepositoryName = '';
      this.newRepository = '';
      this.requestMessage = '';
      this.isDisabled = false;
    },
    newRepositoryName: function (newName) {
      // newName 형식 체크 해야함
      const validation = this.validateRepo(newName);
      if(!validation.isValid) {
        this.newRepository = '';
        this.isLoading = false;
        this.isNoRelease = false;
        this.requestMessage = validation.message
        return;
      }
      this.newRepository = '';
      this.requestMessage = '';
      this.isLoading = true;
      this.isDisabled = false;
      this.getGithub()
    }
  },
  computed: {
    sortedRepositories: function () {
      return this.repositories.sort(function (a, b) {
        return (new Date(b.latest_release.published_at).getTime()) -
               (new Date(a.latest_release.published_at).getTime())
      });
    },
    repositoriesCount: function () {
      if(this.repositories.length === 1) {
        return `${this.repositories.length} Repository`;
      }
      return `${this.repositories.length} Repositories`;
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
    getLatestRelease: function (repo, resolve, reject) {
      var fullName = repo.full_name;
      var url = `https://api.github.com/repos/${fullName}/releases/latest`;
      axios.get(url)
      .then(function (response){
        resolve(response.data);
      })
      .catch(function (error){
        reject(error);
      })

    },
    changeState: function (nextState) {
      this.state = nextState
    },
    addRepository: function () {
      if(!this.newRepository) {
        return;
      }
      this.requestMessage = 'Load Latest Release...';
      this.getLatestRelease(this.newRepository, function(data) {
        let latestRelease = data;
        this.newRepository.latest_release = latestRelease;
        ipcRenderer.send('db:add-repository',this.newRepository);
        ipcRenderer.on('db:add-repository-response-success', function (event, args) {
          console.log('db:add-repository-response-success');
          const isExists = this.repositories.indexOf(args);
          if(isExists !== -1) {
            return;
          }
          this.repositories.push(this.newRepository);
          this.requestMessage = '';
          this.isNoRelease = false;
          this.changeState('list');
        }.bind(this))
        // On Error
        ipcRenderer.on('db:add-repository-response-error', function (event, error) {
          this.requestMessage = error.message;
          this.isSavable = false;
          this.isNoRelease = false;
          this.isDisabled = true;
        }.bind(this))
      }.bind(this), function (error) {
        console.error(error);
        this.requestMessage = 'There is no release.';
        this.isNoRelease = true;
      }.bind(this));

    },
    removeRepository: function (index) {
      ipcRenderer.send('db:remove-repository', this.repositories[index]);
      ipcRenderer.on('db:remove-repository-response', function () {
        this.repositories.splice(index, 1)
      }.bind(this))
    }
  }
});
