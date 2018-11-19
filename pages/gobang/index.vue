<template>
  <div>
    <div style="justify-content: center; text-align: center;">
      <h2 style="margin: 10px;">
        五子棋游戏大厅
      </h2>
      <el-button size="mini" type="primary" @click="getGoBangRooms">刷新房间信息</el-button>
    </div>
    <div style="display: flex; flex-wrap: wrap; flex-flow: row wrap; justify-content: center;">
      <el-card v-for="room,i in rooms" :key="room.id + i" style="width: 300px; margin: 10px;">
        <div slot="header" style="height: 0; line-height: 0; padding: 0; text-align: center; position: relative;">
          <span>{{room.name}}</span>
          <el-button v-if="room.members.length>1" style="position: absolute; top: -18px; right: 0; font-size: 12px;" type="text">观战</el-button>
        </div>
        <div style="display: flex; justify-content: center; padding: 0;">
          <div style="width: 110px; line-height: 48px; text-align: right; padding-right: 10px;">
            {{room.members[0].nickname}}
          </div>
          <div style="width: 50px; height: 50px; text-align: center; line-height: 45px; font-size: 22px; background-color: burlywood; border-radius: 4px; color: #f7f8fb">vs</div>
          <div style="width: 110px; line-height: 48px; text-align: left; padding-left: 10px;" v-if="room.members.length>1">
            {{room.members[1].nickname}}
          </div>
          <div style="width: 110px; line-height: 45px;" v-else>
            <el-button style="margin-left: 10px; font-size: 14px;" type="text" @click="openUrl('/gobang/game?id=' + room.id)">加入游戏</el-button>
          </div>
        </div>
      </el-card>
      <el-card style="width: 300px; height: 127px; margin: 10px; border: 2px #ebeef5 dashed;">
        <div style="display: flex; justify-content: center; padding: 0;">
          <div style="width: 110px; line-height: 103px; text-align: center;">
            <el-button @click="createRoom" style="border: none;">
              <el-icon style="font-size: 40px; color: darkgray;" class="el-icon-plus" />
            </el-button>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import Logo from '~/components/Logo.vue'
export default {
  components: {
    Logo
  },
  data () {
    return {
      rooms: [],
      token: '',
      nickname: '',
      username: '',
      email: '',
      id: '',
      newRoomName: ''
    }
  },
  created () {
    if (process.browser) {
      this.setPlayInfo();
    }
    this.getGoBangRooms();
  },
  methods: {
    getGoBangRooms () {
      let vm = this;
      this.$axios.get('/api/gobang/rooms').then((res) => {
        vm.rooms = res.data.data
      });
    },
    openUrl (url) {
      window.open(url)
    },
    createRoom () {
      let vm = this;
      this.$prompt('请输入房间名', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(({ value }) => {
        if (value && value.length > 0) {
          vm.newRoomName = value;
          let params = new URLSearchParams();
          params.append('roomname', vm.newRoomName);
          params.append('token', vm.token);
          this.$axios.post('/api/gobang/createRoom', params).then((res) => {
            console.log(res.data);
            if (res.data.code === 0) {
              vm.openUrl('/gobang/game?id=' + res.data.data)
            } else {
              alert(res.data.msg)
            }
          })
        }
      }).catch(() => {
        console.log('cancel')
      });
    },
    setPlayInfo () {
      let vm = this;
      vm.token = window.sessionStorage.getItem('token');
      vm.nickname = window.sessionStorage.getItem('nickname');
      vm.username = window.sessionStorage.getItem('username');
      vm.email = window.sessionStorage.getItem('email');
      vm.id = window.sessionStorage.getItem('id');
    }
  }
}
</script>

<style>

</style>
