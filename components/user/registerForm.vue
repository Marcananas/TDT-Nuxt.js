<template>
  <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" class="form">
    <el-form-item prop="username">
      <el-input v-model="ruleForm.username" placeholder="手机号"></el-input>
    </el-form-item>
    <el-form-item prop="captcha">
      <el-input v-model="ruleForm.captcha" placeholder="验证码">
        <el-button slot="append" @click="getCode">获取验证码</el-button>
      </el-input>
    </el-form-item>
    <el-form-item prop="nickname">
      <el-input v-model="ruleForm.nickname" placeholder="昵称"></el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input type="password" v-model="ruleForm.password" autocomplete="off" placeholder="密码"></el-input>
    </el-form-item>
    <el-form-item prop="checkPass">
      <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off" placeholder="确认密码"></el-input>
    </el-form-item>
    <el-button type="primary" @click="submitForm" class="submit">注册</el-button>
  </el-form>
</template>

<script>
export default {
  data() {
    var validateUser = (rule, value, callback) => {
      let check = /^1[34578]\d{9}$/;
      if (value === "") {
        callback(new Error("请输入手机号"));
      } else if (!check.test(value)) {
        callback(new Error("目前只支持中国大陆的手机号码"));
      } else {
        callback();
      }
    };
    var validatePass = (rule, value, callback) => {
      let check = /^\d{6}$/;
      if (value === "") {
        callback(new Error("请输入密码"));
      } else if (!check.test(value)) {
        callback(new Error("密码为六位数字"));
      } else {
        if (this.ruleForm.checkPass !== "") {
          this.$refs.ruleForm.validateField("checkPass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        username: "",
        nickname: "",
        captcha: "",
        password: "",
        checkPass: ""
      },
      rules: {
        username: [{ validator: validateUser, trigger: "blur" }],
        nickname: [{ required: true, message: "请输入昵称", trigger: "blur" }],
        captcha: [{ required: true, message: "请输入验证码", trigger: "blur" }],
        password: [{ validator: validatePass, trigger: "blur" }],
        checkPass: [{ validator: validatePass2, trigger: "blur" }]
      }
    };
  },
  methods: {
    submitForm() {
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          // 注册提交
          const { checkPass, ...props } = this.ruleForm;
          this.$axios({
            url: "/accounts/register",
            method: "post",
            data: props
          }).then(res => {
            this.$store.commit('user/setUserInfo',res.data)
            this.$message({
              message: "注册成功，正在跳转",
              type: "success"
            });
            setTimeout(() => {
              this.$router.replace("/");
            }, 1000);
          });
        }
      });
    },
    getCode() {
      let check = /^1[34578]\d{9}$/;
      let tel = this.ruleForm.username;
      if (!tel) {
        this.$confirm("手机号码不能为空", "提示", {
          confirmButtonText: "确定",
          showCancelButton: false,
          type: "warning"
        });
      } else if (!check.test(tel)) {
        this.$confirm("手机号码格式错误", "提示", {
          confirmButtonText: "确定",
          showCancelButton: false,
          type: "warning"
        });
      } else {
        this.$axios({
          url: `captchas`,
          method: "POST",
          data: { tel }
        }).then(res => {
          this.$confirm(`验证码为：${res.data.code}`, "提示", {
            confirmButtonText: "确定",
            showCancelButton: false,
            type: "warning"
          });
        });
      }
    }
  }
};
</script>
<style lang='less' scoped>
.form {
  padding: 25px;
}

.form-item {
  margin-bottom: 20px;
}

.form-text {
  font-size: 12px;
  color: #409eff;
  text-align: right;
  line-height: 1;
}

.submit {
  width: 100%;
  margin-top: 10px;
}
</style>