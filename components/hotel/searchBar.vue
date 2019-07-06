<!-- 搜索栏 -->
<template>
    <el-form :inline="true" :model="searchFormData">
        <el-form-item>
            <el-autocomplete 
              v-model="searchFormData.cityName"
              placeholder="目的地"
              value-key="name"
              :fetch-suggestions="querySearch"
              @select="handleCitySelect"
            />
        </el-form-item>

        <el-date-picker 
          v-model="daterange"
          :editable="false"
          :clearable="false"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="入住日期"
          end-placeholder="离店日期"
          @change="onDateChange"
        />

        <el-form-item>
            <memberSelector 
              :adultMemberList="adultMemberList"
              :childMemberList="childMemberList"
              :onChange="onMemeberChange"
            />
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="onSubmit">查看价格</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
    import memberSelector from './memberSelector'

    function range(start,to){
        const r = []
        for (let i = start;i<to;i++){
            r.push(i)
        }
        return r
    }
    export default {
        props:['onChange', 'defaultValue'],
        data() {
            // const {
            //     city,
            //     cityName,
            //     enterTime,
            //     leftTime,
            //     adultCount,
            //     childCount
            //   } = this.defaultValue
            // const daterange = [enterTime,leftTime].filter(v => !!v)
            return {
                cityList: [],
                daterange:[],
                adultMemberList:range(1,8),
                childMemberList:range(0,5),
                searchFormData: {
                    cityName:'南京',
                    city:'',
                    enterTime:'',
                    leftTime:'',
                    adultCount:'',
                    childCount:''
                }
            };
        },
        components: {
        memberSelector  
        },
        computed: {},
        watch: {},
        methods: {
            async querySearch(queryString,cb) {
                if(!queryString){
                    return cb([])
                }
                const res = await this.$axios({
                    url: '/cities',
                    params:{name:queryString}
                })
                const {data} = res.data
                let results = data.filter(this.createFilter(queryString))
                cb(results)
                // console.log(results)
            },
            createFilter(queryString) {
                return city => {
                    return (city.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
                }
            },
            handleCitySelect(c) {
                console.log(c)
                this.searchFormData.city = c.id 
                this.onChange(this.searchFormData)
            },
            onDateChange([enterTime,leftTime]) {
                this.searchFormData.enterTime = enterTime
                this.searchFormData.leftTime = leftTime
            },
            onMemeberChange([adultCount,childCount]){
                this.searchFormData.adultCount = adultCount
                this.searchFormData.childCount = childCount
            },
            onSubmit(){
                this.onChange(this.searchFormData)
            }
        },
        mounted () {
            this.onSubmit()
        }
    }
</script>
<style lang='less'>
//@import url(); 引入公共css类

</style>