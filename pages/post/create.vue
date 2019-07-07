<template>
  <div class="container">
    <el-row type="flex" justify="space-between">
      <div class="main">
        <h2>发表新攻略</h2>
        <p class="create-desc">分享你的个人游记，让更多人看到</p>
        <el-form>
          <!-- 标题 -->
          <el-form-item>
            <el-input placeholder="请输入标题" v-model="form.title"></el-input>
          </el-form-item>
          <!-- 内容 -->
          <el-form-item>
            <VueEditor :config="config" ref="vueEditor" />
          </el-form-item>
          <!-- 选择城市下拉框 -->
          <el-form-item label="选择城市">
            <el-autocomplete
              v-model="cityName"
              :fetch-suggestions="querySearchAsync"
              @select="handleSelect"
              placeholder="请搜索游玩城市"
              class="el-autocomplete"
            ></el-autocomplete>
          </el-form-item>
        </el-form>
        <div class="create-button">
          <el-button type="primary" size="small" @click="handlePublish">发布</el-button>
          <span class="submit-side">
            或者
            <a href="javascript:;" @click="handleSaveDraft">保存到草稿</a>
          </span>
        </div>
      </div>
      <div class="aside">
        <div class="draft-box">
          <h4 class="draft-title">草稿箱（{{drafts.length}}）</h4>
          <div class="draft-list">
            <div class="draft-item" v-for="(item, index) in drafts" :key="index">
              <div class="draft-post-title" @click="handleReEdit(item)">
                {{item.title}}
                <span class="iconfont el-icon-edit"></span>
              </div>
              <p>{{item.time}}</p>
            </div>
          </div>
        </div>
      </div>
    </el-row>
  </div>
</template>

<script>
import moment from "moment";
import "quill/dist/quill.snow.css"
let VueEditor;
if (process.browser) {
    VueEditor = require('vue-word-editor').default
}
export default {
  data() {
    return {
      form: {
        title: "",
        content: "",
        city: "",
      },
        cityName: "",
        config: {
                modules: { 
                    // 工具栏
                    toolbar: [
                        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
                        [{ 'header': 1 }, { 'header': 2 }],               // custom button values
                        ['image', 'video'],
                    ]
                },
                // 主题
                theme: 'snow',
                uploadImage: {
                    url: `${this.$axios.defaults.baseURL}/upload`,
                    name: "files",
                    uploadSuccess: (res, insert) => {
                        const file = res.data[0];
                        insert(this.$axios.defaults.baseURL + file.url);
                    },
                },
                uploadVideo: {
                    url: `${this.$axios.defaults.baseURL}/upload`,
                    name: "files",
                    uploadSuccess(res, insert){
                        const file = res.data[0];
                        insert(this.$axios.defaults.baseURL + file.url);
                    },
                }
            },
            isLoading: false,
            drafts: [],
        }
    },
     components: {
        VueEditor
    },
     mounted(){
        this.$store.replaceState({
            ...this.$store.state, 
            post: {posts: JSON.parse(localStorage.getItem("posts") || `[]`) } 
        })

        const {post} = this.$store.state;

        this.drafts = post.posts;
    },

    methods: {
        querySearchAsync(queryString, cb) {
            if(!queryString){
                return cb([]);
            }
            if(this.isLoading) return;
            
            const {api} = this.$store.state;

            this.$axios({
                url:"/airs/city",
                params: {
                    name: queryString
                }
            }).then(res => {
                this.isLoading = false;
                
                const {data} = res.data;
                
                const arr = data.map(v => {
                    return {
                        ...v,
                        value: v.name
                    }
                })

                cb(arr);
            })
        },

        handleSelect(item){
            this.form.city = item.id;
            this.cityName = item.name
        },

        // 保存到草稿
        handleSaveDraft(){
            const {commit} = this.$store;

            commit("post/addPost", {
                title: this.form.title,
                content:  this.$refs.vueEditor.editor.root.innerHTML,
                cityName: this.cityName,
                time: moment().format(`YYYY-MM-DD`)
            });
        },

        // 从草稿箱编辑
        handleReEdit(item){
            this.form.title = item.title;
            this.$refs.vueEditor.editor.root.innerHTML = item.content;
            this.cityName = item.cityName
        },

        handlePublish(){

            // 获取富文本编辑器的内容
            //console.log(this.$refs.vueEditor.editor.getContents())
            this.form.content = this.$refs.vueEditor.editor.root.innerHTML;
            this.form.city = this.form.city || this.cityName;

            const rules = {
                title: {require: true, defaults: this.form.title, message: "请填写标题"},
                content: {require: true, defaults: this.form.content, message: "请填写内容"},
                city: {require: true, defaults: this.form.city, message: "请选择城市" },
            }

            // valid
            let valid = true;
            Object.keys(rules).forEach(v => {
                if(!valid) return;
                const item = rules[v];

                if(item.require && !item.defaults){
                    valid = false;
                    this.$confirm(item.message, '提示', {
                      confirmButtonText: '确定',
                      showCancelButton: false,
                      type: 'warning'
                    })
                }
            });
            if(!valid) return;

            const { user: {userInfo}} = this.$store.state;
            
            this.$axios({
                url: "/posts",
                method: "POST",
                data: this.form,
                headers: {
                    Authorization: `Bearer ${userInfo.token}`
                }
            }).then(res => {
                const {status, message} = res.data;
                if(!status){
                    this.$message({
                        message,
                        type: "success"
                    });
                }

                 // 初始化表单
                this.form = {
                    title: "",
                    content: "",
                    city: ""
                }
                this.$refs.vueEditor.editor.root.innerHTML = "";
                this.cityName = "";
            }).catch(err => {

            })
        }
    }
}
</script>

<style scoped lang="less">
.container {
  width: 1000px;
  margin: 0 auto;
  padding: 20px 0;
}
.main {
  width: 750px;
  h2 {
    font-weight: normal;
    font-size: 22px;
    margin-bottom: 10px;
  }
  p {
    color: #999;
    font-size: 12px;
    margin-bottom: 10px;
  }
  .create-desc{
            font-size:12px;
            color:#999;
            margin-bottom:10px;
        }
        
        .submit-side{
            margin-left:10px;
            font-size: 14px;
            a{
                color:orange;
                &:hover{
                    text-decoration: underline;
                }
            }
        }

        /deep/ #editor{
            height:400px;
        }
    }

    .aside{
        width:200px;
        .draft-box{
            border:1px #ddd solid;
            padding:10px;
            .draft-title{
                margin-bottom:10px;
                font-weight: normal;
                color:#666;
            }

            .draft-item{
                margin-bottom:10px;
                font-size: 14px;

                .draft-post-title{
                    cursor: pointer;
                    &:hover{
                        color:orange;
                        text-decoration: underline;
                    }
                }

                p{
                    color:#999;
                }
            }
        }
    }
</style>
