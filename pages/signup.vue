<template>
  <section class="container">
    <div>
      <logo/>
      <div style="width: 230px; margin: auto;">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label-width="0" prop="username">
            <el-input v-model="ruleForm.username" placeholder="用户名（数字或字母组合，用于登录）"></el-input>
          </el-form-item>
          <el-form-item label-width="0" prop="nickname">
            <el-input v-model="ruleForm.nickname" placeholder="昵称"></el-input>
          </el-form-item>
          <el-form-item label-width="0" prop="email">
            <el-input v-model="ruleForm.email" placeholder="邮箱"></el-input>
          </el-form-item>
          <el-form-item label-width="0" prop="password1">
            <el-input type="password" v-model="ruleForm.password1" placeholder="密码"></el-input>
          </el-form-item>
          <el-form-item label-width="0" prop="password2">
            <el-input type="password" v-model="ruleForm.password2" placeholder="确认密码"></el-input>
          </el-form-item>
          <el-button type="success" @click="signup" icon="el-icon-check" circle></el-button>
        </el-form>
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
    let validatorUsername = (rule, value, callback) => {
      if(!/^[a-zA-Z0-9]+$/.test(value)) {
        callback(new Error('用户名只能包含字母或数字!'));
      } else {
        callback();
      }
    };
    let validatePassword2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.ruleForm.password1) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        username: '',
        nickname: '',
        email: '',
        password1: '',
        password2: ''
      },
      rules: {
        username: [
          { validator: validatorUsername, trigger: 'blur' },
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        nickname: [
          { required: true, message: '请输入昵称', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
        ],
        email: [
          { type: 'email', required: true, message: '邮箱格式不正确', trigger: 'blur' }
        ],
        password1: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
        ],
        password2: [
          { validator: validatePassword2, trigger: 'blur' },
          { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    openUrl (url) {
      window.open(url)
    },
    signup () {
      let vm = this;
      let params = new URLSearchParams();
      params.append('username', vm.ruleForm.username);
      params.append('nickname', vm.ruleForm.nickname);
      params.append('email', vm.ruleForm.email);
      params.append('password', vm.ruleForm.password2);
      vm.$axios.post('/api/player/signup', params).then(function (res) {
        console.log(res.data);
        let reps = res.data;
        if (reps.code === 0) {
          vm.$alert('注册成功', '提示', {
            confirmButtonText: '前往登录',
            callback: action => {
              vm.openUrl('/')
            }
          });
        } else {
          this.$message({
            message: '注册失败，请检查注册信息',
            type: 'error',
            center: true
          });
        }
      })
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
</style>
