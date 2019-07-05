<template>
  <div class="container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/hotel' }">{{hotleData.big_cate}}</el-breadcrumb-item>
      <el-breadcrumb-item
        :to="{ path: `/hotel?city=${hotleData.city.id}` }"
      >{{hotleData.real_city}}{{hotleData.big_cate}}</el-breadcrumb-item>
      <el-breadcrumb-item>{{hotleData.name}}</el-breadcrumb-item>
    </el-breadcrumb>
    <el-row>
      <h4>
        {{hotleData.name}}
        <i
          class="iconfont iconhuangguan"
          v-for="(item,index) in hotleData.hotellevel.level"
          :key="index"
        ></i>
      </h4>
      <div>{{hotleData.alias}}</div>
      <div>
        <i class="iconfont iconlocation"></i>
        <span>{{hotleData.address}}</span>
      </div>
    </el-row>
    <!-- 图片组件 -->
    <Pictures :data="pics" class="pics" />
    <!-- 房间列表 -->
    <RoomTable :data="hotleData.products" />
    <!-- 地图组件 -->
    <HotelMap class="map" :data="hotleData.location" />
  </div>
</template>

<script>
import Pictures from "@/components/hotel/pictures.vue";
import RoomTable from "@/components/hotel/roomTable.vue";
import HotelMap from "@/components/hotel/hotelMap.vue";
export default {
  data() {
    return {
      hotleData: {
        city: {},
        hotellevel: {},
        products: [],
        location: {}
      },
      pics: {
        name: "",
        src: [
          "http://157.122.54.189:9093/images/hotel-pics/1.jpeg",
          "http://157.122.54.189:9093/images/hotel-pics/2.jpeg",
          "http://157.122.54.189:9093/images/hotel-pics/3.jpeg",
          "http://157.122.54.189:9093/images/hotel-pics/4.jpeg",
          "http://157.122.54.189:9093/images/hotel-pics/5.jpeg",
          "http://157.122.54.189:9093/images/hotel-pics/6.jpeg"
        ]
      }
    };
  },

  components: {
    Pictures,
    RoomTable,
    HotelMap
  },

  computed: {},

  mounted() {
    let id = this.$route.params.id;
    this.$axios({
      url: `/hotels?id=${id}`
    }).then(res => {
      this.hotleData = res.data.data[0];
      console.log(this.hotleData);
      this.pics.name = this.hotleData.name;
    });
  },

  methods: {}
};
</script>
<style lang='less' scoped>
.container {
  width: 1000px;
  margin: 0 auto;
  .el-breadcrumb {
    margin: 20px 0;
  }
  h4 {
    color: #333;
    font-weight: 400;
    font-size: x-large;
    // .iconfont {
    //   font-family: "iconfont" !important;
    //   font-size: 16px;
    //   font-style: normal;
    //   -webkit-font-smoothing: antialiased;
    //   -moz-osx-font-smoothing: grayscale;
    // }
    .iconhuangguan {
      color: #f90;
    }
  }
  // .iconfont {
  //   font-family: "iconfont" !important;
  //   font-size: 16px;
  //   font-style: normal;
  //   -webkit-font-smoothing: antialiased;
  // }
  .pics {
    margin: 50px auto;
  }
  .map {
    margin: 50px auto;
  }
}
</style>