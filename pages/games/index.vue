<template>
  <section class="container">
    <div>
      <logo/>{{token}}
      <div class="links">
        <a
          @click="openUrl('/gobang')"
          target="_blank"
          class="button--green">GoBang</a>
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
      token: ''
    }
  },
  created () {
    if (process.browser) {
      this.setToken()
    }
  },
  methods: {
    openUrl (url) {
      window.open(url)
    },
    setToken () {
      let vm = this;
      vm.token = window.sessionStorage.getItem('token');
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

.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 80px;
  color: #35495e;
  letter-spacing: 1px;
}

.links {
  padding-top: 15px;
}
</style>
