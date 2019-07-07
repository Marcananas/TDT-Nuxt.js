<template>
  <div id="container"></div>
</template>
<script src='https://webapi.amap.com/maps?v=1.4.15&key=fba2b64d44d7a6a083c9da30e70135c2&callback=onLoad'/>

<script>
export default {
  data() {
    return {
      // pois: [{ location: "0,0" }]
    };
  },
  // props: {
  //   data: {
  //     Type: Array,
  //     default: []
  //   }
  // },

  components: {},

  computed: {},

  mounted() {
    let pois = JSON.parse(localStorage.getItem("lpp"));
    let center = pois[0].location.split(",");
    window.onLoad = function() {
      setTimeout(() => {}, 2000);
      var map = new AMap.Map("container", {
        resizeEnable: true,
        center,
        zoom: 13
      });
      // 创建一个 Marker 实例：
      // var marker = new AMap.Marker({
      //   position: new AMap.LngLat(116.39, 39.9), // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
      //   title: "北京"
      // });

      let markerList = [];
      // pois.forEach(item => {
      //   item = item.location.split(",");
      // });
      console.log(pois, 999999);

      pois.forEach(item => {
        markerList.push(
          new AMap.Marker({
            position: new AMap.LngLat(
              +item.location.split(",")[0],
              +item.location.split(",")[1]
            ),
            title: item.name
          })
        );
      });
      // console.log(markerList, "1");
      // 将创建的点标记添加到已有的地图实例：
      map.add(markerList);
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
</style>
	