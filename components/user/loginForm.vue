<template>
  <el-form :model="form" ref="form" :rules="rules" class="form">
    <el-form-item class="form-item" prop="username">
      <el-input placeholder="手机" v-model="form.username"></el-input>
    </el-form-item>

    <el-form-item class="form-item" prop="password">
      <el-input placeholder="密码" type="password" v-model="form.password"></el-input>
    </el-form-item>

    <p class="form-text">
      <nuxt-link to="#">忘记密码</nuxt-link>
    </p>

    <el-button class="submit" type="primary" @click="handleLoginSubmit">登录</el-button>
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
        callback();
      }
    };
    return {
      // 表单数据
      form: {
        username: "",
        password: ""
      },
      // 表单规则
      rules: {
        username: [{ validator: validateUser, trigger: "blur" }],
        password: [{ validator: validatePass, trigger: "blur" }]
      }
    };
  },
  methods: {
    // 提交登录
    handleLoginSubmit() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          //   this.$axios({
          //       url:'/accounts/login',
          //       method:'post',
          //       data:this.form
          //   }).then(res=>{
          //       console.log(res.data)
          //   })
          this.$store.dispatch("user/login", this.form).then(res => {
            this.$message({
              message: "登录成功，正在跳转",
              type: "success"
            });
            setTimeout(() => {
              this.$router.replace("/");
            }, 1000);
          });
        }
      });
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