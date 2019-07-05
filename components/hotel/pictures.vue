<template>
  <el-row :gutter="20">
    <el-col :span="16">
      <img :src="bigImg" :alt="data.name" class="big" />
    </el-col>
    <el-col :span="8">
      <el-row :gutter="20">
        <el-col :span="12" v-for="(item,index) in data.src" :key="index">
          <img :src="item" :alt="data.name" @click="changeImg(index)" />
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
export default {
  data() {
    return {
      bigImg: ""
    };
  },
  props: {
    data: {
      type: Object,
      default: {}
    }
  },

  components: {},

  computed: {},

  mounted() {
    this.bigImg = this.data.src[0];
    console.log(this.bigImg);
  },

  methods: {
    changeImg(index) {
      // console.log(this.data.src[index]);
      this.bigImg = this.data.src[index];
      // console.log(this.bigImg);
    }
  }
};
</script>
<style lang='less' scoped>
.big {
  height: 359px;
}
.el-col {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
  img {
    width: 100%;
  }
}
</style>