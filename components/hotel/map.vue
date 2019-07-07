<template>
  <el-amap vid="amap" :plugin="plugin" class="amap-demo" :center="center" :events="events">
    <el-amap-marker
      v-for="(marker, index) in markers"
      :position="marker.position"
      :key="index"
      :vid="index"
      :events="marker.events"
    ></el-amap-marker>
  </el-amap>
</template>

<script>
import * as _ from "lodash";
export default {
  data() {
    let self = this;
    return {
      center: [121.59996, 31.197646],
      events: {
        init(map) {
          let markers = _.cloneDeep(self.markers);
          markers.forEach((item, index) => {
            AMapUI.loadUI(["overlay/SimpleMarker"], function(SimpleMarker) {
              item = new SimpleMarker({
                iconLabel: {
                  innerHTML: index,
                  style: {
                    color: "#fff"
                  }
                },
                iconStyle: "#1995f5",
                map: map,
                position: item.position
              });
            });
          });
        }
      },
      plugin: [
        {
          pName: "Geolocation",
          events: {
            click: o => {
              o.getCurrentPosition((status, result) => {
                if (result && result.position) {
                  self.lng = result.position.lng;
                  self.lat = result.position.lat;
                  self.center = [self.lng, self.lat];
                  self.$nextTick();
                }
              });
            }
          },
          buttonPosition: "LT"
        }
      ],
      markers: [
        {
          position: [121.59996, 31.197646],
          events: {
            click: () => {
              this.$router.push({ path: "/single/250" });
            }
          },
          visible: true,
          clickable: true
        },
        {
          position: [122.59996, 32.197646],
          events: {
            click: () => {
              this.$router.push({ path: "/single/250" });
            }
          },
          visible: true,
          clickable: true
        }
      ]
    };
  },
  props: {
    data: {
      Type: Array,
      default: []
    }
  },
  components: {},

  computed: {},

  mounted() {},

  methods: {}
};
</script>
<style lang='less' scoped>
</style>