// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const {ipcRenderer} = require('electron');
const open = require('open');
const MinToMillis = 60000;
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
const SORT_OPTIONS = [
        {name:'Name (DESC)', value: 'name-desc' },
        {name:'Name (ASC)', value: 'name-asc' },
        {name:'Updated Time (DESC)', value: 'update-desc' },
        {name:'Updated Time (ASC)', value: 'update-asc' }
];
const REFRESH_TIMES = [ // value : Min
        {name:'Every 30 Minutes', value: 30 },
        {name:'Every Hours', value: 60 },
        {name:'Every Two Hours', value: 120 },
        {name:'Every Three Hours', value: 180 },
        {name:'Every Six Hours', value: 360 }
];
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
    // Load DB
    ipcRenderer.send('db:initialize')

    ipcRenderer.on('db:response-setting', function (event, setting) {
      console.log('bind setting');
      this.setting = setting;
      setInterval(function(){
        this.checkUpdatedRepositories();
      }.bind(this), this.setting.refreshWhen * MinToMillis)
    }.bind(this))

    ipcRenderer.on('db:response-repo', function (event, repos) {
      console.log('bind repos');
      this.repositories = repos;
      this.checkUpdatedRepositories();
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
      isLoading: false,
      isUnReloadable: false,
      refreshTimes: REFRESH_TIMES,
      sortOptions: SORT_OPTIONS,
      setting: {
        id: 'default',
        sortBy: 'name-desc',
        refreshWhen: 30
      }
    }
  },
  watch: {
    setting: {
      handler: function (newSetting, oldSetting) {
        ipcRenderer.send('db:update-setting', newSetting);
      },
      deep: true
    },
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
        let sorted = 1;
        let nameA = '';
        let nameB = '';
        switch(this.setting.sortBy) {
          case 'name-desc':
            nameA = a.full_name.toUpperCase();
            nameB = b.full_name.toUpperCase();
            sorted = nameA < nameB;
          break;
          case 'name-asc':
            nameA = a.full_name.toUpperCase();
            nameB = b.full_name.toUpperCase();
            sorted = nameA > nameB;
          break;
          case 'updated-desc':
            sorted = (new Date(b.latest_release.published_at).getTime()) -
             (new Date(a.latest_release.published_at).getTime());
          break;
          case 'updated-asc':
            sorted = (new Date(a.latest_release.published_at).getTime()) -
              (new Date(b.latest_release.published_at).getTime());
          break;
        }
        return sorted;
      }.bind(this));
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
        const addTarget = JSON.parse(JSON.stringify(this.newRepository));
        ipcRenderer.send('db:add-repository',addTarget);
        ipcRenderer.on('db:add-repository-response-success', function (event, args) {
          console.log('db:add-repository-response-success');
          const isExists = this.repositories.indexOf(args);
          if(isExists !== -1) {
            return;
          }
          this.repositories.push(this.newRepository);
          this.requestMessage = '';
          this.isNoRelease = false;
          this.spawnNotification('New Repository!!', `${this.newRepository.full_name} - ${this.newRepository.latest_release.tag_name}`);
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
      const removeTarget = JSON.parse(JSON.stringify(this.repositories[index]))
      ipcRenderer.send('db:remove-repository', removeTarget);
      ipcRenderer.on('db:remove-repository-response', function () {
        this.repositories.splice(index, 1)
      }.bind(this))
    },
    spawnNotification: function (theTitle, theBody,theIcon) {
      var options = {
          body: theBody,
          icon: theIcon
      }
      var n = new Notification(theTitle,options);
    },
    checkUpdatedRepositories: function () {
      const vm = this;
      this.isUnReloadable = true;
      setTimeout(function() {
        vm.isUnReloadable = false;
      }, 1000)
      this.repositories.forEach(function(repo) {
        console.log(`Check ${repo.full_name}, current ${repo.latest_release.tag_name} ${new Date()}`);
        vm.getLatestRelease(repo, function (latestRelease) {
          if (repo.latest_release.tag_name !== latestRelease.tag_name) {
            repo.latest_release = latestRelease;
            vm.spawnNotification('Updated!!', repo.full_name);
          } else  {
            console.log(`same ${latestRelease.tag_name} ${new Date()}`);
          }
        }, function () {})
      })

    }
  }
});
