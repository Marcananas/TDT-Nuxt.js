<template>
    <el-row type="flex" justify="space-between" class="container">
        <div class="main">
            <!-- 面包屑标题 -->
            <div class="breadcrumb">
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item to="/post">旅游攻略</el-breadcrumb-item>
                    <el-breadcrumb-item>攻略详情</el-breadcrumb-item>
                </el-breadcrumb>
            </div>

            <!-- 文章大标题 -->
            <h1>{{detail.title}}</h1>

            <!-- 文章信息 -->
            <div class="post-info">
                <span>攻略：{{detail.created_at | timestamp}}</span>
                <span>阅读：{{detail.watch}}</span>
            </div>

            <!-- 文章内容 -->
            <div class="post-content" v-html="detail.content"></div>

            <!-- 文章分享 -->
            <div class="post-ctrl">
                <el-row type="flex" justify="center">
                    <div class="ctrl-item">
                        <i class="iconfont iconpinglun"></i>
                        <p>评论({{commentsTotal}})</p>
                    </div>
                    <div class="ctrl-item" @click="handleStar">
                        <i class="iconfont iconstar1"></i>
                        <p>收藏</p>
                    </div>
                    <div class="ctrl-item">
                        <i class="iconfont iconfenxiang"></i>
                        <p>分享</p>
                    </div>
                    <div class="ctrl-item" @click="handleLike">
                        <i class="iconfont iconding"></i>
                        <p>点赞({{detail.like || 0}})</p>
                    </div>
                </el-row>
            </div>

            <!-- 文章评论 -->
            <div class="cmt-wrapper">
                <h4 class="cmt-title">评论</h4>
                
                <el-tag
                closable
                type="info"
                class="replyTag"
                v-if="reply.nickname"
                @close="handleCloseReply">
                回复 @{{reply.nickname}}
                </el-tag>
                
                <!-- 评论输入框 -->
                <div class="cmt-input" ref="cmtInput">
                    <el-input 
                    type="textarea" 
                    resize="none" 
                    placeholder="说点什么吧..."
                    v-model="cmtForm.content">
                    </el-input>
                </div>
                <el-row type="flex" justify="space-between" class="cmt-input-ctrls">
                    <div class="cmt-pics">
                        <el-upload
                            :action="$axios.defaults.baseURL + `/upload`"
                            list-type="picture-card"
                            :file-list="cmtForm.pics"
                            name="files"
                            :on-success="handleSuccess"
                            :on-preview="handlePictureCardPreview"
                            :on-remove="handleRemove">
                            <i class="el-icon-plus"></i>
                        </el-upload>
                        <el-dialog :visible.sync="dialogVisible">
                            <img width="100%" :src="$axios.defaults.baseURL + dialogImageUrl" alt="">
                        </el-dialog>
                    </div>
                    <div>
                        <el-button 
                        type="primary" 
                        size="mini" 
                        class="cmt-submit"
                        @click="handleCmtSubmit">
                        提交
                        </el-button>
                    </div>
                </el-row>

                <!-- 无评论时 -->
                <div class="cmt-empty" v-if="!commentsTotal">
                    暂无评论，赶紧抢占沙发！
                </div>

                <!-- 评论列表 -->
                <div class="cmt-list" v-if="commentsTotal">
                    <div class="cmt-item" 
                    v-for="(item, index) in comments" 
                    :key="index">
                        <div class="cmt-info">
                            <img :src="$axios.defaults.baseURL + item.account.defaultAvatar">
                            {{item.account.nickname}} 
                            <i>{{item.created_at | timestamp}}</i>
                            <span>{{item.level}}</span>
                        </div>
                        <div class="cmt-content">

                            <!-- 评论楼层 -->
                            <CommentFloor 
                            v-if="item.parent" 
                            :comment="item.parent" 
                            @preview="handlePictureCardPreview"
                            @reply="handleReply"/>

                            <div class="cmt-new">
                                <p class="cmt-message">
                                    {{item.content}}
                                </p>
                                <el-row type="flex">
                                    <div class="cmt-pic" v-for="(pic, picIndex) in item.pics" :key="picIndex">
                                        <img :src="$axios.defaults.baseURL + pic.url" @click="handlePictureCardPreview(pic)">
                                    </div>
                                </el-row>
                                <div class="cmt-ctrl">
                                    <a href="javascript:;" @click="handleReply(item)">回复</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 分页 -->
                <el-row type="flex" 
                justify="center" 
                v-if="commentsTotal"
                 style="margin-top:10px;">
                    <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="Math.floor(start / limit) + 1"
                        :page-sizes="[2, 4, 6, 8]"
                        :page-size="limit"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="commentsTotal">
                    </el-pagination>
                </el-row>
            </div>
        </div>

        <div class="aside">
            <!-- 推荐文章 -->
            <h4 class="aside-title">相关攻略</h4>
            <div class="recommend-list">
                <nuxt-link :to="`/post/detail?id=${item.id}`"
                class="recommend-item" 
                v-for="(item, index) in recommends"
                :key="index">
                    <el-row type="flex" class="post-imgText">
                        <el-row type="flex" align="middle" class="post-img">
                            <img :src="item.images[0]" alt="">
                        </el-row>
                        <div class="post-text">
                            <div>
                                {{item.title}}
                            </div>
                            <p>{{item.created_at | timestamp}} 阅读 {{item.watch}}</p>
                        </div>
                    </el-row>
                </nuxt-link>
            </div>
        </div>
    </el-row>
</template>

<script>
import CommentFloor from "@/components/post/commentFloor";
import moment from "moment";

export default {
    data(){
        return {
            dialogImageUrl: '',
            dialogVisible: false,
            detail: {},
            comments: [],
            commentsTotal: 0,
            // filters
            start: 0,
            limit: 2,

            // comment form
            cmtForm: {
                content: "",
                pics: []
            },

            reply: {},
            recommends: [],
        }
    },
    methods: {
        handleSuccess(file, fileList){
            file[0].url = this.$axios.defaults.baseURL + file[0].url;
            this.cmtForm.pics.push(file[0]);
        },
        handleRemove(file, fileList) {
            this.cmtForm = fileList.map(v => {
                return v.response[0]
            })
        },
        handleCmtSubmit(){
            const {api, user: {userinfo}} = this.$store.state;

            this.cmtForm = {
                ...this.cmtForm,
                post: this.$route.query.id,
            }

            this.$axios({
                url: api.COMMENTS,
                method: "POST",
                data: this.cmtForm,
                headers: {
                    Authorization: `Bearer ${userinfo.token}`
                }
            }).then(res => {
                const {message, status} = res.data;
                if(status == 0){
                    this.$message({
                        message,
                        type: "success"
                    });

                    this.cmtForm = {
                        content: "",
                        pics: []
                    };

                    this.getComments();
                } 
            })
        },

        handlePictureCardPreview(file) {
            if(file.response){
                file = file.response[0]
            }
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },
        handleReply(comment){
            this.reply = comment.account;
            this.cmtForm.follow = comment.id;
            window.scrollTo(0, this.$refs.cmtInput.offsetTop);
        },

        handleCloseReply(){
            this.reply = {};
            this.cmtForm.follow = ""
        },

        getComments(){
            this.$axios({
                url: "/posts/comments",
                params: {
                    post: this.$route.query.id,
                    _start: this.start,
                    _limit: this.limit
                }
            }).then(res => {
                const {data, total} = res.data;
                this.comments = data;
                this.commentsTotal =total;
            })
        },
        handleSizeChange(value){
            this.limit = value;
            this.start = 0;
            this.getComments();
        },

        handleCurrentChange(value){
            this.start = this.limit * value - 2;
            this.getComments();
        },

        // 收藏
        handleStar(){
            const {api, user: {userinfo}} = this.$store.state;

            this.$axios({
                url: api.POST_STAR,
                params: {
                    id: this.detail.id
                },
                headers: {
                    Authorization: `Bearer ${userinfo.token}`
                }
            }).then(res => {
                const {status, message} = res.data;
                if(status == 0){
                    this.$message({
                        message,
                        type: "success"
                    })
                }
            })
        },

        // 点赞
        handleLike(){
            const {api, user: {userinfo}} = this.$store.state;

            this.$axios({
                url: api.POST_LIKE,
                params: {
                    id: this.detail.id
                },
                headers: {
                    Authorization: `Bearer ${userinfo.token}`
                }
            }).then(res => {
                const {status, message} = res.data;
                if(status == 0){
                    this.$message({
                        message,
                        type: "success"
                    })

                    this.detail.like += 1;
                }
            })
        },

        // 推荐文章
        getPostRecmmend(){
            const {api} = this.$store.state;

            this.$axios({
                url:api.POST_RECOMMEND
            }).then(res => {
                const {data} = res.data;
                this.recommends = data;
            })
        }
    },
    components: {
        CommentFloor
    },

    filters: {
        timestamp(value){
            return moment(value).format("YYYY-MM-DD h:mm");
        }
    },

    watch: {
        $route(){
            window.location.reload();
        }
    },

    mounted(){
        const {id} = this.$route.query;

        this.$axios({
            url: `/posts/${id}`,
        }).then(res => {
            const {data} = res;
            this.detail = data;
        })
        
        // 文章评论
        this.getComments(id);

        this.getPostRecmmend();
    },
}
</script>

<style scoped lang="less">
    .container{
        width:1000px;
        margin:0 auto;
        padding-top:20px;
    }

    .main{
        width: 700px;

        h1{
            padding:20px 0;
            border-bottom:1px #ddd solid;
        }

        .post-content{
            line-height: 1.5;

            /deep/ *{
                max-width: 700px!important;
            }

            /deep/ img{
                margin:10px 0;
            }
        }

        .post-info{
            color:#999;
            padding:20px;
            text-align:right;

            span{
                margin-left:20px;
            }
        }

        .post-ctrl{
            padding: 50px 0 30px;
            .ctrl-item{
                margin:0 20px;
                font-size:20px;
                text-align:center;
                cursor: pointer;
                
                i{
                    display:block;
                    font-size: 28px;
                    color:orange;
                    
                   
                }

                &:nth-child(2){
                    i{
                        transform: scale(1.4);

                    }              
                }
                p{
                    margin-top:5px;
                    font-size: 14px;
                    color:#999;
                }
            }
        }

        /* 评论 */
        .cmt-wrapper{
            margin-bottom:20px;
        }

        .replyTag{
            margin-bottom:10px;
        }

        .cmt-title{
            font-weight: normal;
            font-size: 18px;
            margin-bottom: 20px;
        }

        .cmt-input{
            margin-bottom:10px;
        }

        .cmt-input-ctrls{
            margin-bottom:30px;
            /deep/ .el-upload--picture-card{
                width:100px;
                height:100px;
                line-height: 100px;
            }

            /deep/ .el-upload-list {
                li {
                    width:100px;
                    height:100px;
                }

                img{
                    object-fit: cover;
                }
            }
        }

        .cmt-empty{
            color:#999;
            font-size: 14px;
            text-align: center;
            padding:30px 0;
            border:1px #ddd dashed;
        }

        .cmt-list{
            border: 1px #ddd solid;
        }

        .cmt-item{
            border-bottom: 1px #ddd dashed;
            padding: 20px 20px 5px;

            &:last-child{
                border-bottom: none;
            }

            .cmt-content{
                padding:0 0 0 30px;
            }

            .cmt-info{
                margin-bottom:10px;
                font-size:12px;
                color:#666;

                *{
                    vertical-align: top;
                }

                img{
                    width:16px;
                    height:16px;
                    border-radius:50%;
                }

                i{
                    color:#999;
                }
                span{
                    float: right;
                }
            }
            .cmt-message{
                margin-top:10px;
            }

            .cmt-pic{
                width:80px;
                height:80px;
                border-radius: 6px;
                overflow: hidden;
                margin-right:5px;
                margin-top:10px;
                padding:5px;
                border:1px #ddd dashed;

                img{
                    display:block;
                    width:100%;
                    height:100%;
                    object-fit: cover;
                    cursor: pointer;
                }
            }

            /*  这里和comment floor不一样，鼠标在最新内容上才hover */
            .cmt-new:hover{
               .cmt-ctrl{
                    * { display:inline };
                }
            }

            .cmt-ctrl{
                height:20px;
                line-height: 20px;
                font-size:12px;
                color:#1e50a2;
                text-align:right;

                *{
                    display:none;
                }

                a:hover{
                    text-decoration: underline;
                }
            }
        }
    }

    /* 侧边栏 */
    .aside{
        width:280px;

        .aside-title{
            font-weight: normal;
            font-size:18px;
            padding-bottom: 10px;
            border-bottom: 1px #ddd solid;
        }

        .recommend-item{
            display: block;
            padding: 20px 0;
            border-bottom: 1px #ddd solid;

            .post-imgText{
                .post-img{
                    width:100px;
                    height:80px;
                    flex-shrink: 0;
                    background:#ddd;
                    overflow: hidden;
                    margin-right:10px;
                    img{
                        width:100%;
                        height:100%;
                        object-fit: cover;

                    }
                }

                .post-text{
                    flex: 1;
                    position: relative;
                    div{
                        position:relative;
                        line-height:1.4em;
                        /*设置容器高度为3倍行高就是显示3行*/
                        height:2.8em;
                        overflow:hidden;
                        position:absolute;
                        left:0;
                        top:0;
                        width:100%;
                    }

                    p{
                        position: absolute;
                        bottom:0;
                        left:0;
                        font-size:12px;
                        color:#999;
                    }
                }
            }

            
        }
    }
</style>
