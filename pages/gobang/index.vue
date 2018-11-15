<template>
  <div>
    <section class="container">
      <h3 class="title">
        GoBang
      </h3>
    </section>
    <el-button @click="getGoBangRooms">hah</el-button>
  </div>
</template>

<script>
import Logo from '~/components/Logo.vue'
export default {
  components: {
    Logo
  },
  methods: {
    getGoBangRooms () {
      this.$axios.get('/api/gobangRooms').then((res) => {
        console.log(res.data)
      })
    }
  }
}
</script>

<style>

.container {
  display: flex;
  justify-content: center;
  text-align: center;
}

.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 50px;
  color: #35495e;
  letter-spacing: 1px;
}
</style>
