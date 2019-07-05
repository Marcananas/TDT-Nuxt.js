<template>
  <el-row>
    <el-col :span="16">
      <div id="container"></div>
    </el-col>
  </el-row>
</template>

<script>
export default {
  data() {
    return {
      center: {
        latitude: 0,
        longitude: 0
      }
    };
  },
  props: {
    data: {
      Type: Object,
      default: {}
    }
  },

  components: {},

  computed: {},

  mounted() {
    this.center = this.data;

    console.log(this.center, 123);
    window.onLoad = function() {
      var map = new AMap.Map("container", {
        resizeEnable: true,
        center: [116.39, 39.9],
        zoom: 13
      });
      // 创建一个 Marker 实例：
      var marker = new AMap.Marker({
        position: new AMap.LngLat(116.39, 39.9), // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
        title: "北京"
      });

      // 将创建的点标记添加到已有的地图实例：
      map.add(marker);
    };
    var url =
      "https://webapi.amap.com/maps?v=1.4.15&key=fba2b64d44d7a6a083c9da30e70135c2&callback=onLoad";
    var jsapi = document.createElement("script");
    jsapi.charset = "utf-8";
    jsapi.src = url;
    document.head.appendChild(jsapi);
  },

  methods: {}
};
</script>
<style lang='less' scoped>
.el-row {
  height: 400px;
  #container {
    height: 400px;
  }
}
</style>
	