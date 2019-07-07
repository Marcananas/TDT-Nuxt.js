<template>
  <div>
    <!-- 图文左右排列 -->
    <el-row
      type="flex"
      justify="space-between"
      align="middle"
      class="post-item image-text"
      v-if="showType === `imageText`"
    >
      <el-row align="middle" class="post-cover">
        <nuxt-link :to="`/post/detail?id=${data.id}`">
          <img :src="data.images[0]" />
        </nuxt-link>
      </el-row>

      <div class="post-content">
        <h4 :title="data.title" class="post-title">
          <nuxt-link :to="`/post/detail?id=${data.id}`">{{data.title}}</nuxt-link>
        </h4>
        <p class="post-desc">
          <nuxt-link :to="`/post/detail?id=${data.id}`" v-html="data.summary"></nuxt-link>
        </p>

        <el-row type="flex" justify="space-between" class="post-info">
          <el-row type="flex" align="middle" class="post-info-left">
            <span>
              <i class="el-icon-location-outline"></i>
              {{data.city.name}}
            </span>
            <el-row type="flex" align="middle" class="post-user">
              by
              <nuxt-link to="/user/personal">
                <img :src="$axios.defaults.baseURL + data.account.defaultAvatar" />
              </nuxt-link>
              <nuxt-link to="/user/personal">{{data.account.nickname}}</nuxt-link>
            </el-row>
            <span>
              <i class="el-icon-view"></i>
              {{data.watch || 0}}
            </span>
          </el-row>
          <span class="post-info-right">{{data.like || 0}} 赞</span>
        </el-row>
      </div>
    </el-row>

    <!-- 带有图片列表 -->
    <div v-if="showType === `card`" class="post-item card">
      <h4 :title="data.title" class="post-title">
        <nuxt-link :to="`/post/detail?id=${data.id}`">{{data.title}}</nuxt-link>
      </h4>

      <p class="post-desc">
        <nuxt-link :to="`/post/detail?id=${data.id}`" v-html="data.summary"></nuxt-link>
      </p>

      <el-row type="flex" justify="space-between" align="middle" class="card-images">
        <nuxt-link
          :to="`/post/detail?id=${data.id}`"
          v-for="(item, index) in data.images"
          :key="index"
          v-if="index<3"
          >
          <img :src="item" />
        </nuxt-link>
      </el-row>

      <el-row type="flex" justify="space-between" class="post-info">
        <el-row type="flex" align="middle" class="post-info-left">
          <span>
            <i class="el-icon-location-outline"></i>
            {{data.city.name}}
          </span>
          <el-row type="flex" align="middle" class="post-user">
            by
            <nuxt-link to="/user/personal">
              <img :src="$axios.defaults.baseURL +data.account.defaultAvatar" />
            </nuxt-link>
            <nuxt-link to="/user/personal">{{data.account.nickname}}</nuxt-link>
          </el-row>
          <span>
            <i class="el-icon-view"></i>
            {{data.watch || 0}}
          </span>
        </el-row>
        <span class="post-info-right">{{data.like || 0}} 赞</span>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default: {
        images: []
      }
    }
  },

  data() {
    return {
      showType: "imageText"
    };
  },

  updated() {
    if (this.data.images && this.data.images.length >= 3) {
      this.showType = "card";
    } else {
      this.showType = "imageText";
    }
  },

  mounted() {
    if (this.data.images && this.data.images.length >= 3) {
      this.showType = "card";
    } else {
      this.showType = "imageText";
    }
  }
};
</script>

<style scoped lang="less">
.post-item {
  width: 100%;
  padding: 20px 0;
  border-bottom: 1px #eee solid;
}

.image-text {
  .post-content {
    width: 470px;
  }
}

.post-cover {
  width: 220px;
  height: 150px;
  overflow: hidden;
  flex-shrink: 0;
  margin-right: 10px;

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.post-title {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 15px;
  font-weight: normal;
  font-size: 18px;

  a:hover {
    color: orange;
  }
}

.post-desc {
  margin-bottom: 15px;
  line-height: 1.5;
  font-size: 14px;
  height: 1.5 * 14px * 3;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;

  a {
    color: #666;
  }
}

.post-user {
  img {
    display: block;
    width: 16px;
    height: 16px;
    border-radius: 100px;
    margin: 5px;
  }

  a {
    color: orange;
  }
}

.post-info-left {
  font-size: 12px;
  color: #999;

  > * {
    margin-right: 10px;
  }
}

.post-info-right {
  color: orange;
}

.card-images {
  margin: 15px 0;
  img {
    width: 220px;
    height: 150px;
    display: block;
    object-fit: cover;
  }
}
</style>
