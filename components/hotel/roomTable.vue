<template>
  <el-table
    style="width: 100%"
    :row-style="{'cursor': 'pointer'}"
    :data="data"
    @row-click="goToSleep"
  >
    <el-table-column prop="name" label="价格来源" align="left"></el-table-column>
    <el-table-column prop="bestType" label="低价房型" align="center"></el-table-column>
    <el-table-column prop="price" label="最低价格/每晚" align="right">
      <template slot-scope="scope">
        <i>￥{{scope.row.price}}</i>
        <span>起</span>
        <i class="el-icon-arrow-right"></i>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: {
    data: {
      Type: Array,
      default: [
        {
          name: "",
          bestType: "",
          price: ""
        }
      ]
    }
  },

  components: {},

  computed: {},

  mounted() {},

  methods: {
    goToSleep() {
      window.open(
        "https://hotels.ctrip.com/hotel/20206101.html#ctm_ref=ctr_hp_sb_lst"
      );
    }
  }
};
</script>
<style lang='less' scoped>
i {
  color: orange;
}
</style>