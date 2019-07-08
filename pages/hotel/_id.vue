<template>
  <div class="container">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/hotel' }">{{hotleData.big_cate}}</el-breadcrumb-item>
      <el-breadcrumb-item
        :to="{ path: `/hotel?city=${hotleData.city.id}` }"
      >{{hotleData.real_city}}{{hotleData.big_cate}}</el-breadcrumb-item>
      <el-breadcrumb-item>{{hotleData.name}}</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 酒店标题 -->
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
    <!-- 地图部分 -->
    <el-row class="map" :gutter="20">
      <el-col :span="16">
        <!-- 地图组件 -->
        <HotelMap class="gaode" :data="center" />
        <!-- <HotelMap class="gaode" /> -->
      </el-col>
      <el-col :span="8">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane
            v-for="(item,index) in mapTab"
            :key="index"
            :label="item.name"
            :name="item.value"
          >
            <ul>
              <li
                v-for="(item,index) in pois"
                :key="index"
                style="margin-bottom: 20px"
                @mouseover="movePoi(item.location)"
              >
                <span>{{item.name}}</span>
              </li>
            </ul>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Pictures from "@/components/hotel/pictures.vue";
import RoomTable from "@/components/hotel/roomTable.vue";
import HotelMap from "@/components/hotel/hotelMap.vue";
// import HotelMap from "@/components/hotel/map.vue";
export default {
  data() {
    return {
      hotleData: {
        city: {},
        hotellevel: {},
        products: [],
        location: {
          latitude: 0,
          longitude: 0
        }
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
      },
      activeName: "scenic",
      changeTab: {
        scenic: "风景名胜",
        traffic: "交通设施服务"
      },
      pois: [],
      mapTab: [
        { value: "scenic", name: "风景" },
        { value: "traffic", name: "交通" }
      ],
      center: []
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
      this.getPois();
    });
  },

  methods: {
    getPois() {
      const types = this.changeTab[this.activeName];
      this.$axios({
        url: "https://restapi.amap.com/v3/place/text?parameters",
        params: {
          keywords: "",
          city: this.hotleData.realcity,
          location: `${this.hotleData.location.longitude},${this.hotleData.location.latitude}`,
          types,
          output: "json",
          page: 1,
          offset: 10,
          key: "79041dfa1c752f49599e2b507c64da42"
        }
      }).then(res => {
        this.pois = res.data.pois.map(v=>{
          let location={
            longitude:+v.location.split(",")[0],
              latitude:+v.location.split(",")[1]
              }
              let name=v.name
          return {...location,name}
        })
        console.log(this.pois);
        localStorage.setItem("lpp", JSON.stringify(this.pois));
      });
    },
    handleClick(tab, event) {
      // console.log(tab, event);
      // console.log(this.activeName);
      this.getPois();
    },
    movePoi(center) {
      this.center = center;
    }
  }
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
    .iconhuangguan {
      color: #f90;
    }
  }
  .pics {
    margin: 50px auto;
  }
  .map {
    margin: 50px auto;
    .gaode {
      height: 400px;
    }
    .el-tab-pane {
      overflow: auto;
      height: 345px;
      span {
        font-size: 14px;
      }
    }
  }
}
</style>