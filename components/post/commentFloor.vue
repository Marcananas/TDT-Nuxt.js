<template>
    <div class="cmt-floor">
        <post-comment-floor v-if="comment.parent" :comment="comment.parent" @preview="handlePreview" @reply="handleReply"></post-comment-floor>
        <div class="cmt-content">
            <div class="cmt-info">
                {{comment.account.nickname}}
                <i>{{comment.created_at | timestamp}}</i>
                <span>{{comment.level}}</span>
            </div>
            <p class="cmt-message">
                {{comment.content}}
            </p>
            <el-row type="flex">
                <div class="cmt-pic" v-for="(pic, picIndex) in comment.pics" :key="picIndex">
                    <img :src="$axios.defaults.baseURL +pic.url" @click="handlePreview(pic)">
                </div>
            </el-row>
            <div class="cmt-ctrl">
                <a href="javascript:;" @click="handleReply">回复</a>
            </div>
        </div>
    </div>
</template>

<script>
import moment from "moment"

export default {
    name: "post-comment-floor",

    data () {
        return {}
    },

    props: {
        comment: {
            type: Object
        }
    },

    methods:{
        handlePreview(file){
            this.$emit("preview", file)
        },

        handleReply(){
            this.$emit("reply", this.comment)
        }
    },

    filters: {
        timestamp(value){
            return moment(value).format("YYYY-MM-DD h:mm")
        }
    }
}
</script>

<style lang="less" scoped>
 .cmt-floor{
        background:#f9f9f9;
        border:1px #ddd solid;
        padding:2px;
        
        .cmt-content{
            padding:5px 10px 0;
            .cmt-info{
                font-size:12px;
                color:#666;
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


            &:hover{
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
</style>
