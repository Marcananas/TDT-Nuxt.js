<template>
  <section class="contianer">
    <el-row type="flex" justify="space-between">
      <!-- 顶部过滤列表 -->
      <div class="flights-content">
        <!-- 过滤条件 -->
        <FlightsFilters :data="flightsData" @setDataList="setDataList" />

        <!-- 航班头部布局 -->
        <FlightsListHead />

        <!-- 航班信息 -->
        <FlightsItem v-for="(item,index) in dataList" :key="index" :data="item" />
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageIndex"
          :page-sizes="[5, 10, 15, 20]"
          :page-size="5"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>

      <!-- 侧边栏 -->
      <div class="aside">
        <!-- 侧边栏组件 -->
        <FlightsAside />
      </div>
    </el-row>
  </section>
</template>

<script>
// import moment from "moment";
import FlightsListHead from "@/components/air/flightsListHead";
import FlightsItem from "@/components/air/flightsItem";
import FlightsFilters from "@/components/air/flightsFilters";
import FlightsAside from "@/components/air/flightsAside";

export default {
  data() {
    return {
      originalData: [],
      pageSize: 5,
      pageIndex: 1,
      total: 0,
      flightsData: {
        // 航班总数据
        flights: [],
        info: {},
        options: {}
      }
    };
  },
  methods: {
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.pageSize = val;
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.pageIndex = val;
    },
    setDataList(arr) {
      this.originalData = arr;
      this.total = arr.length;
      this.pageIndex = 1;
    },
    getData() {
      this.$axios({
        url: "/airs",
        params: this.$route.query
      }).then(res => {
        this.originalData = res.data.flights;
        this.total = res.data.flights.length;
        // console.log(res.data);
        this.flightsData = res.data;
        console.log(this.flightsData);
        // this.$store.commit("air/setAirInfo", res.data.info);
        // console.log(this.originalData);
        // console.log(this.dataList);
      });
      // this.$axios({
      //   url: "/posts?id=6"
      // }).then(res => {
      //   console.log(res.data);
      // });
    }
  },
  computed: {
    dataList: function() {
      const start = (this.pageIndex - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.originalData.slice(start, end);
    }
  },
  components: {
    FlightsListHead,
    FlightsItem,
    FlightsFilters,
    FlightsAside
  },
  mounted() {
    this.getData();
  },
  watch: {
    $route() {
      this.getData();
    }
  }
};
</script>

<style scoped lang="less">
.contianer {
  width: 1000px;
  margin: 20px auto;
}

.flights-content {
  width: 745px;
  font-size: 14px;
}

.aside {
  width: 240px;
}
</style>