<template>
  <section class="container">
    <div>
      <logo/>
      <h1 class="title">
        Hiram Games
      </h1>
      <div style="width: 210px; margin: auto;">
        <el-input
          style="margin: 10px 0 0;"
          placeholder="E-MAIL or USERNAME"
          v-model="usernameOrEmail">
        </el-input>
        <el-input
          style="margin: 10px 0;"
          placeholder="PASSWORD"
          type="password"
          v-model="password">
        </el-input>
      </div>
      <el-button-group>
        <el-button @click="signUp" type="primary" icon="el-icon-edit-outline">Sign up</el-button>
        <el-button :loading="loading" @click="signIn" type="success">Sign in<i class="el-icon-arrow-right el-icon--right"></i></el-button>
      </el-button-group>
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
      usernameOrEmail: 'zhangsan',
      password: '123456',
      token: '',
      loading: false
    }
  },
  created () {
    if (process.browser) {
      this.setToken();
    }
  },
  methods: {
    openUrl(url, target) {
      window.open(url, target)
    },
    signIn() {
      let vm = this;
      console.log('login');
      vm.loading = true;
      let params = new URLSearchParams();
      params.append('usernameOrEmail', vm.usernameOrEmail);
      params.append('password', vm.password);
      this.$axios.post('/api/player/signin', params).then((res) => {
        console.log(res.data);
        let reps = res.data;
        if (reps.code === 0) {
          window.sessionStorage.setItem('token', reps.data.token);
          window.sessionStorage.setItem('nickname', reps.data.nickname);
          window.sessionStorage.setItem('username', reps.data.username);
          window.sessionStorage.setItem('email', reps.data.email);
          window.sessionStorage.setItem('id', reps.data.id);
          vm.openUrl('/games', '_self')
        } else {
          this.$message({
            message: '可恶啊~竟然登录失败了呢!',
            type: 'error',
            center: true
          });
        }
        vm.loading = false
      })
    },
    signUp() {
      this.openUrl('/signup', '_self')
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
    height: 100vh;
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
</style>
