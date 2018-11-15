<template>
  <div>
    <div style="justify-content: center; text-align: center;">
      <h3 class="title">
        GoBang
      </h3>
      <el-button size="mini" type="primary" @click="getGoBangRooms">刷新房间信息</el-button>
    </div>
    <div style="display: flex; flex-wrap: wrap; flex-flow: row wrap; justify-content: space-around;">
      <el-card v-for="room,i in rooms" :key="room.id + i" style="width: 300px; margin: 10px;">
        <div slot="header" style="height: 0; line-height: 0; padding: 0; text-align: center;">
          <span>{{room.name}}</span>
        </div>
        <div style="display: flex; justify-content: center; padding: 0;">
          <div style="width: 110px; line-height: 48px; text-align: right; padding-right: 10px;">
            {{room.members[0].name}}
          </div>
          <div style="width: 50px; height: 50px; text-align: center; line-height: 45px; font-size: 22px; background-color: burlywood; border-radius: 4px; color: #f7f8fb">vs</div>
          <div style="width: 110px; line-height: 48px; text-align: left; padding-left: 10px;" v-if="room.members.length>1">
            {{room.members[1].name}}
          </div>
          <div style="width: 110px; line-height: 45px;" v-else>
            <el-button style="margin-left: 10px; font-size: 14px;" type="text">加入房间</el-button>
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
      rooms: [
        {id:'zhangsan09039',members:[{name:'张三',id:'zhangsan'},{name:'李四',id:'lisi'}],name:'张三的房间'},
        {id:'zhangsan09039',members:[{name:'张三',id:'zhangsan'}],name:'张三的房间'},
        {id:'zhangsan09039',members:[{name:'张三',id:'zhangsan'}],name:'张三的房间'},
        {id:'zhangsan09039',members:[{name:'张三',id:'zhangsan'}],name:'张三的房间'}
      ]
    }
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

</style>
