<template>
  <div class="container">
    <!-- 面包屑 -->
    <div class="breadcrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>酒店</el-breadcrumb-item>
        <el-breadcrumb-item>{{cityName}}酒店预订</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <!-- 搜索栏 -->
    <searchBar :defaultValue="{cityName, ...searchParams }" :onChange="handleSearchSubmit" class="hotel-search-bar" />

    <!-- 搜索结果 -->
    <div class="hotel-list" v-if="loaded">
      <div class="no-result" v-if="hotels.total === 0">
        没你找的，回家睡吧
      </div>
      <div v-else>
        <hotelView v-for="item in hotels.data" :key="item.id" :dataSource="item"/>
        <div class="pagination-box" v-if="totalPages > 0">
          <Pagination :defaultValue="searchParams.page" :total="totalPages" :onChange="handlePageChange" />
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import _omit from 'lodash/omit'
import _pickBy from 'lodash/pickBy'
import searchBar from "@/components/hotel/searchBar"
import hotelView from "@/components/hotel/hotelView"
import Pagination from "@/components/hotel/Pagination"
function parseQueryString(params) {
    let qs = ''
    for (let key in params) {
      if (params.hasOwnProperty(key)) {
        let v = params[key]
        if (Array.isArray(v)) {
          v.forEach(x => {
            if (x) {
              qs += `&${key}_in=${x}`
            }
          })
        } else {
          if(v) qs += `&${key}=${v}`
        }
      }
    }
    return qs ? `?${qs}` : qs
  }
export default {
  data(){
    return{
      cityName:'南京',
      loaded:false,
      cityData:null,
      searchParams:{...this.$route.query},
      hotels: {}
    }
  },
  components: {
    searchBar,
    hotelView,
    Pagination
  },
  methods: {
    getCityData(name){
      return this.$axios({url:'/cities',params:{name}})
    },
    async handleSearchSubmit(searchParams = {}){
      const {cityName, ...othersParams} = searchParams
      const params = {...this.searchParams, ...othersParams}
      const {page = 1} = params
      this.searchParams = _omit(params,['adultCount', 'childCount', 'cityName'])
      this.loaded = false
      this.hotels = {}

      if(this.cityName !== cityName || !this.searchParams.city){
        const {data: {data: [cityData]}} = await this.getCityData(cityName || this.cityName)
        this.cityData = cityData
        this.searchParams.city = cityData.id
        this.cityName = cityData.name
      }

      this.$router.replace({
        path:'hotel',
        query:_pickBy(this.searchParams,v=> v&&v.toString().length > 0)
      })

      const qsParams = _omit(this.searchParams, 'page')
      const qs = parseQueryString({...qsParams, _start: (page - 1) * 5})

      const res = await this.$axios({
        url:`/hotels${qs}`
      })

      this.hotels = res.data
      if(res.data.total) {
        this.locationList = res.data.data[0].location
      }
      this.loaded = true
    },
    handlePageChange(page) {
      this.handleSearchSubmit({page})
    },
  },
  computed: {
    totalPages() {
      return Math.ceil(this.hotels.total / 5)
    }
  }
}
</script>

<style lang='less' scoped>
    .container {
    width: 1000px;
    margin: 0 auto;

      .breadcrumb {
        overflow: hidden;
        padding: 20px 0;
      }
      .hotel-option-row {
        min-height: 260px;
        margin-bottom: 20px;
      }

      .pagination-box {
        display: flex;
        justify-content: flex-end;
        padding: 20px 0 40px 0;
      }

      .no-result,
      .hotel-list-loading {
        text-align: center;
        height: 300px;
        margin-top: 20px;
      }
    }
</style>
