<!-- 分液器 -->
<template>
  <div class="pagination">
    <el-button
      size="mini"
      icon="el-icon-arrow-left"
      @click="handlePrev"
      :disabled="current === pageData[0]"
    >上一页</el-button>

    <span v-for="i in pageData" class="page-item" :key="i">
      <el-button size="mini" type="text" v-if="current === i" :disabled="true">{{i}}</el-button>
      <el-button size="mini" type="text" v-else @click="() => handleClick(i)">{{i}}</el-button>
    </span>

    <el-button
      size="mini"
      @click="handleNext"
      :disabled="current === pageData[length - 1]"
    >
      下一页
      <i class="el-icon-arrow-right el-icon--right"></i>
    </el-button>
  </div>
</template>

<script>
  export default {
    props: {
      total: {type: Number},
      length: {type: Number, default: 5},
      defaultValue: {type: Number, default: 1},
      onChange: {type: Function, default: () => {}}
    },

    data() {
      return {
        current: this.defaultValue
      }
    },

    computed: {
      pageData: function() {
        const { current, total, length } = this
        let start = Math.max(0, current - 2)
        const end = Math.min(total, start + length)
        if (end - start < length) {
          start = Math.max(0, end - length)
        }

        return [...new Array(total)].map((_, i) => i + 1).slice(start, end)
      }
    },

    methods: {
      handleClick(current) {
        this.current = current

        this.onChange(this.current)
      },
      handlePrev() {
        this.current = Math.max(this.current - 1, 1)
        this.onChange(this.current)
      },
      handleNext() {
        this.current = Math.min(this.current + 1, this.total)
        this.onChange(this.current)
      }
    }
  }
</script>

<style scoped lang="less">
  .page-item {
    display: inline-block;
    margin: 0 5px;

    .is-disabled:hover {
      cursor: text !important;
    }
  }
</style>
