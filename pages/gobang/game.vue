<template>
  <div class="container">
    <h3 style="margin: 10px;">{{name}}{{finish?'':'对战中...'}}{{roomId}}</h3>
    <!--- 棋盘 -->
    <!--
    ////////////////////////////////////////////////////////////////////
    //                                                                //
    //                          棋盘                                   //
    //                                                                //
    //       两个叠加的表格，一个用来显示网格，一个隐藏起来用来点击           //
    //       两个表错开一个单元格的宽度的一半的宽度来保证点击的位置在交点处    //
    //                                                                //
    ////////////////////////////////////////////////////////////////////
    -->
    <div style="margin: auto; width: 700px; display: flex; justify-content: center;">
      <el-card style="width: 100px; height: 100px;">
        <div>
          <span>张三</span>
        </div>
      </el-card>
      <div
        style="position: relative;height: 480px; width: 480px; margin: auto; background-color: burlywood; border-radius: 5px;">
        <table cellpadding="0" cellspacing="0" border="1"
               style="width: 420px; height: 420px; position: absolute; top: 30px; left: 30px;">
          <tr v-for="y in 14" :key="y">
            <td v-for="x in 14" :key="x"></td>
          </tr>
        </table>
        <table cellpadding="0" cellspacing="0"
               style="width: 450px; height: 450px; position: absolute; top: 15px; left: 15px;">
          <tr v-for="y in 15" :key="y">
            <td v-for="x in 15" :key="x" @click="movePieces(y, x)" style="position: relative;">
              <div style="width: 30px; height: 30px;">
                <div
                  :style="{'display': (x==4&&y==4)||(x==4&&y==12)||(x==12&&y==4)||(x==12&&y==12)||(x==8&&y==8)?'':'none'}"
                  style="width: 5px; height: 5px; background-color: #47494e; position: absolute; top: 12px; left: 12px;"></div>
                <div :class="getPieces(y, x)"
                     style="width: 28px; height: 28px; border-radius: 14px; position: absolute"></div>
              </div>
            </td>
          </tr>
        </table>
      </div>
      <el-card style=" width: 100px; height: 100px; margin-top: 380px; background-color: #47494e; color: #f7f8fb">
        <div>
          <span>张三</span>
        </div>
      </el-card>
    </div>
    <div style="margin: 10px;">
      <el-button type="info" @click="retract" round>悔棋</el-button>
      <el-button type="warning" @click="giveUp" round>认输</el-button>
    </div>
    <el-dialog
      title="游戏结束！"
      :visible.sync="finish"
      width="30%">
      <span>您{{win?'赢':'输'}}了！{{win?'恭喜您！':'再接再厉！'}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="info" @click="openUrl('/gobang')">离开</el-button>
        <el-button type="primary" @click="finish = false">继续</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        roomId: '',
        token: '',
        nickname: '',
        username: '',
        email: '',
        name: '五子棋',
        pieceColor: 0,
        steps: [],
        finish: false,
        win: false
      }
    },
    created () {
      if (process.browser) {
        this.setPlayInfo();
        this.roomId = this.getQueryString('id');
        if ('WebSocket' in window) {
          this.webSocket = new WebSocket("ws://localhost:8080/hiramgames");
          this.initWebSocket();
          console.log('Support webSocket')
        }
        else {
          console.log('Not support webSocket')
        }
      }
    },
    methods: {
      movePieces(y, x) {
        let vm = this
        console.log(y + ', ' + x)
        for (var i = 0; i < vm.steps.length; i++) {
          if (vm.steps[i].x == x && vm.steps[i].y == y) {
            console.log('Already moved!')
            return;
          }
        }
        vm.steps.push({y: y, x: x, color: vm.pieceColor})
        vm.pieceColor++
        console.log(vm.steps)
      },
      getPieces(y, x) {
        let vm = this
        let style = {
          white: false,
          black: false
        }
        for (var i = 0; i < vm.steps.length; i++) {
          if (vm.steps[i].x == x && vm.steps[i].y == y) {
            style.white = vm.steps[i].color % 2 == 0
            style.black = vm.steps[i].color % 2 == 1
          }
        }
        return style
      },
      retract() {
        let vm = this
        if (vm.steps.pop()) {
          vm.pieceColor--;
        }
      },
      giveUp() {
        let vm = this
        this.$confirm('是否确定认输本局游戏?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          vm.finish = true
          vm.win = false
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '您取消认输，游戏继续!'
          });
        });
      },
      openUrl (url) {
        window.open(url)
      },
      getQueryString: function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
      },
      setPlayInfo () {
        let vm = this;
        vm.token = window.sessionStorage.getItem('token');
        vm.nickname = window.sessionStorage.getItem('nickname');
        vm.username = window.sessionStorage.getItem('username');
        vm.email = window.sessionStorage.getItem('email');
      },
      initWebSocket() {
        this.webSocket.onopen = this.webSocketOpen;
        this.webSocket.onmessage = this.webSocketMessage;
        this.webSocket.onclose = this.webSocketClose;
        this.webSocket.onerror = this.webSocketError;
      },
      webSocketOpen() {//打开
        console.log("WebSocket连接成功")
        let initRoomInfo = {}
        initRoomInfo.requireType = 'joinGame'
        initRoomInfo.roomId = this.roomId
        initRoomInfo.token = this.token
        initRoomInfo.username = this.username
        initRoomInfo.nickname = this.nickname
        this.finalSend(JSON.stringify(initRoomInfo))
      },
      webSocketMessage(e) { //数据接收
        let vm = this;
        let message = JSON.parse(e.data);
        console.log(message);
      },
      webSocketClose() {  //关闭
        console.log("WebSocket关闭");
      },
      webSocketError() {  //失败
        console.log("WebSocket连接失败");
      },
      sendMessage() {
        let vm = this;
        if (vm.nickName.length <= 0) {
          this.open3();
          return;
        }
        if (vm.textarea && vm.textarea.length > 0) {
          let message = {};
          message.msg = vm.textarea;
          message.sendType = 'sendMsg';
          message.nickName = vm.nickName;
          this.finalSend(JSON.stringify(message));
          vm.textarea = null
        }
      },
      finalSend(message) {
        console.log('will send: ' + message)
        this.webSocket.send(message);
      }
    }
  }
</script>

<style>
  .container {
    text-align: center;
  }

  .white {
    background-color: #F5F5F5;
  }

  .black {
    background-color: #47494e;
  }
</style>
