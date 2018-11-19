<template>
  <section class="container">
    <div>
      <logo/>
      <div class="links">
        <a v-for="game in games"
           :key="game.id"
          @click="openUrl(game.path)"
          target="_blank"
          class="button--green">{{game.cnname}}</a>
      </div>
    </div>
  </section>
</template>

<script>
import Logo from '~/components/Logo.vue'

export default {
  components: {
    Logo
  },
  data () {
    return {
      token: '',
      games: []
    }
  },
  created () {
    if (process.browser) {
      this.setToken()
    }
    this.getGames()
  },
  methods: {
    openUrl (url) {
      window.open(url)
    },
    setToken () {
      let vm = this;
      vm.token = window.sessionStorage.getItem('token');
    },
    getGames () {
      let vm = this;
      this.$axios.get('/api/games').then((res) => {
        vm.games = res.data.data
      });
    }
  }
}
</script>

<style>
.container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  text-align: center;
}
  .button--green {
    margin: 10px;
  }
</style>
