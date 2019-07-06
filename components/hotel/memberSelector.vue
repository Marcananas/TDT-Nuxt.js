<!-- 成员选择 -->
<template>
    <el-popover
      trigger="click"
      placement="bottom"
      width="300"
      v-model="visible"
      :visible-arrow="false"
    >
        <el-input
          readonly
          placeholder="人数未定"
          :value="totalCountLabel"
          slot="reference"
          @click="visible = !visible"
        >
          <i slot="suffix" class="el-input__icon iconfont iconuser"></i>
        </el-input>

        <el-row type="flex" :gutter="10" align="middle">
          <el-col>每间</el-col>
          <el-col>
              <el-select
                size="mini"
                :value="adultCount + '成人'"
                placeholder="请选择"
                @change="handleAudltChange"
              >
                <el-option
                  v-for="item in adultMemberList"
                  :key="item"
                  :value="item"
                />
              </el-select>
          </el-col>
          <el-col>
            <el-select
                size="mini"
                :value="childCount + ' 儿童'"
                placeholder="请选择"
                @change="handleChildChange"
            >
                <el-option
                    v-for="item in childMemberList"
                    :key="item"
                    :value="item"
                />
            </el-select>
           </el-col>
        </el-row>
        <el-row type="flex" justify="end" class="btn-col">
            <el-button size="mini" @click="onClick" type="primary">确定</el-button>
        </el-row>
    </el-popover>
</template>

<script>

export default {
    props:['adultMemberList','childMemberList','onChange'],
    data() {
        return {
            visible:false,
            totalCountLabel:null,
            totalCount:[],
            adultCount:2,
            childCount:0
        };
    },
    methods: {
        handleAudltChange(v){
            this.adultCount = v
        },
        handleChildChange(v){
            this.childCount = v
        },
        onClick(){
            this.totalCount = [this.adultCount, this.childCount]
            const suffix = ['成人','儿童']
            this.totalCountLabel = this.totalCount
                .filter(n=> n>0)
                .map((n,i)=> `${n}${suffix[i]}`)
                .join(' ')
            
            this.visible = false
            this.onChange(this.totalCount)
        }
    }
}
</script>
<style lang='less' scoped>
  .btn-col {
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid #ddd;
  }

</style>