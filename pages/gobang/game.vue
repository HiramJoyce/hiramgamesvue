<template>
  <div class="container">
    <h3 style="margin: 10px;">{{name}}{{finish?'':'对战中...'}}{{finish?'':nowColor==0?'白方执子':'黑方执子'}}</h3>
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
      <el-card :class="{white:pieceColor==0,black:pieceColor==1}" style="width: 100px; height: 100px;">
        <div>
          <span>{{opnickname}}</span>
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
      <el-card :class="{white:pieceColor==1,black:pieceColor==0}" style=" width: 100px; height: 100px; margin-top: 380px;">
        <div>
          <span>{{nickname}}</span>
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
      <span>您{{win?'赢':'输'}}了！{{win?'恭喜您！':'再接再厉！'}} {{reason.length>0?'(' + reason + ')':''}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="info" @click="openUrl('/gobang')">离开</el-button>
        <el-button type="primary" @click="reStart">继续</el-button>
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
        opnickname: '', // 对手昵称
        email: '',
        name: '五子棋',
        pieceColor: 0,
        steps: [],
        finish: false,
        win: false,
        nowColor: 1,
        reason: '',
        number: 0
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
        // 已落子的点不能再次选择
        for (var i = 0; i < vm.steps.length; i++) {
          if (vm.steps[i].x == x && vm.steps[i].y == y) {
            return;
          }
        }
        // 判断是否是当前回合
        if (vm.nowColor == vm.pieceColor) {
          this.$message({
            message: '未到您的回合~',
            type: 'warning',
            center: true,
            size: 'mini'
          });
          return;
        }
        /////////////// NetWork ///////////////
        let move = {}
        move.requireType = 'movePiece'
        move.point = {y: y, x: x, color: vm.pieceColor}
        move.token = this.token
        move.username = this.username
        move.nickname = this.nickname
        move.roomId = this.roomId
        this.finalSend(JSON.stringify(move))
        ///////////////////////////////////////
      },
      // 根据坐标和颜色返回特定样式
      getPieces(y, x) {
        let vm = this
        let style = {
          white: false,
          black: false
        }
        for (var i = 0; i < vm.steps.length; i++) {
          if (vm.steps[i].x == x && vm.steps[i].y == y) {
            style.white = vm.steps[i].color == 1
            style.black = vm.steps[i].color == 0
          }
        }
        return style
      },
      // 悔棋
      retract() {
        let vm = this
        if (vm.steps.length <= 0) {
          this.$message({
            message: '暂无落子!',
            center: true
          });
          return;
        }
        for (let i = 0; i < vm.steps.length; i++) {
          if (vm.steps[i].color == vm.pieceColor) {
            this.$confirm('悔棋需对方同，是否申请悔棋?', '提示', {
              confirmButtonText: '申请悔棋',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              let message = {}
              message.requireType = 'retractApply'
              message.username = this.username
              message.roomId = this.roomId
              vm.finalSend(JSON.stringify(message))
              this.$message({
                type: 'info',
                message: '已发出申请!',
                center: true
              });
            }).catch(() => {
            });
            return;
          }
        }
        this.$message({
          type: 'info',
          message: '棋盘上没有你的棋子无法悔棋!',
          center: true
        });
      },
      // 认输
      giveUp() {
        let vm = this
        this.$confirm('是否确定认输本局游戏?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          vm.finish = true
          vm.win = false
          vm.steps = []
          vm.nowColor = vm.pieceColor==1?0:1
          let message = {}
          message.requireType = 'giveUp'
          message.username = this.username
          message.roomId = this.roomId
          vm.finalSend(JSON.stringify(message))
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '您取消认输，游戏继续!',
            center: true
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
        if (message.requireType == 'movePiece') {
          vm.nowColor = message.move.color
          vm.steps.push(message.move)
          console.log(message)
          console.log(message.result)
          if (message.result != null) {
            console.log('--- 游戏结束 ---')
            vm.finish = true
            vm.steps = []
            vm.win = message.result==vm.pieceColor
          }
        } else if (message.requireType == 'joinGame') {
          if (message.roomHistory && message.roomHistory.length > 0) {
            vm.steps = message.roomHistory
            vm.nowColor = message.roomHistory[message.roomHistory.length-1].color
          } else {
            vm.nowColor = 1
          }
          if (vm.number == 0 && message.msg.members.length == 1) {
            vm.number = 1
          }
          for (let i = 0; i < message.msg.members.length; i++) {
            if (message.msg.members[i].username == vm.username) {
              vm.pieceColor = message.msg.members[i].color
            } else {
              vm.opnickname = message.msg.members[i].nickname
              if (vm.number == 1 && message.msg.members.length == 2) {
                this.$message({
                  message: '对手[' + vm.opnickname + ']加入房间',
                  center: true
                });
              }
            }
          }
        } else if(message.requireType == 'retractApply') {
          this.$confirm('对方申请悔棋?', '提示', {
            confirmButtonText: '同意悔棋',
            cancelButtonText: '拒绝',
            type: 'warning'
          }).then(() => {
            let message = {}
            message.requireType = 'retractReply'
            message.username = this.username
            message.roomId = this.roomId
            message.reply = true
            vm.finalSend(JSON.stringify(message))
          }).catch(() => {
            let message = {}
            message.requireType = 'retractReply'
            message.username = this.username
            message.roomId = this.roomId
            message.reply = false
            vm.finalSend(JSON.stringify(message))
          });
        } else if(message.requireType == 'retractReply') {
          console.log('retractReply')
          this.$message({
            message: message.msg,
            center: true
          });
          vm.steps = message.roomHistory?message.roomHistory:[]
          vm.nowColor = message.roomHistory && message.roomHistory.length > 0?message.roomHistory[message.roomHistory.length-1].color:1
        } else if (message.requireType == 'giveUp') {
          vm.finish = true
          vm.win = true
          vm.steps = []
          vm.nowColor = vm.pieceColor
        } else if (message.requireType == 'escape') {
          vm.finish = true
          vm.win = true
          vm.steps = []
          vm.number = 1
          vm.reason = '对方逃跑'
          vm.opnickname = ''
        } else {
          console.log(message.requireType);
        }
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
      },
      reStart() {
        let vm = this
        vm.finish = false
        if (vm.opnickname.length > 0) {
          this.$message({
            message: '游戏开始', // vm.win?'对方执子':'你执子',
            center: true
          });
        } else {
          this.$message({
            message: '等待对手',
            center: true
          });
        }
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
    color: #f7f8fb
  }
</style>
