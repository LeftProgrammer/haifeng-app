<!-- 使用 type="home" 属性设置首页，其他页面不需要设置，默认为page；推荐使用json5，更强大，且允许注释 -->
<route lang="json5" type="home">
{
  style: {
    navigationStyle: 'custom',
  },
}
</route>
<template>
  <view class="page h-full px-2" :style="{ paddingTop: safeAreaInsets?.top + 'px' }">
    <view class="main">
      <view class="header">
        <view class="avatar">
          <image class="img" src="../../static/home/avatar.png"></image>
        </view>
        <view class="userinfo">
          <view class="userinfo-header">
            <view class="name">你好，小熊</view>
            <uv-tags class="tags" text="已登船" type="warning" shape="circle"></uv-tags>
          </view>
          <view class="tip">今日工作辛苦了！</view>
        </view>
      </view>
      <view class="info">
        <view class="info-left">
          <view class="left-top">
            <view class="img">云</view>
            <view class="num">27</view>
            <view class="top-right">
              <view class="text unit">℃</view>
              <view class="text weather">多云</view>
            </view>
          </view>
          <view class="left-bottom">
            <view class="bottom-item">
              <view class="desc">东南风</view>
              <view class="value">1级</view>
            </view>
            <view class="bottom-item">
              <view class="desc">能见度</view>
              <view class="value">9km</view>
            </view>
          </view>
        </view>
        <view class="info-right">
          <view class="right-item" @click="handleOpenCode">
            <image class="img" src="../../static/home/avatar.png"></image>
            <view class="item-right">
              <view class="desc">我的通行码</view>
              <view class="tips">出航请出示</view>
            </view>
          </view>
          <view class="right-item">
            <image class="img" src="../../static/home/avatar.png"></image>
            <view class="item-right">
              <view class="desc">我的通行码</view>
              <view class="tips">出航请出示</view>
            </view>
          </view>
        </view>
      </view>

      <view class="menu">
        <common-menu :menu-list="menuData" @moreMenu="handleMore" @itemClick="handleItemClick" />
      </view>

      <NewCard :image="weatherCard.img" :title="weatherCard.title" :tag="weatherCard.tag">
        <template v-slot:body>
          <view class="tui-default">钦州东南海面一带已经出现40毫米降雨，目前降雨云</view>
        </template>
        <template v-slot:footer>
          <view class="tui-default">预警详情</view>
        </template>
      </NewCard>
    </view>
  </view>
</template>

<script setup>
import CommonMenu from '@/components/CommonMenu/index.vue'
import NewCard from '@/components/NewCard/index.vue'
import BlockHeader from '@/components/BlockHeader/index.vue'
import { useToast } from '@/utils/modals/index'

defineOptions({
  name: 'Home',
})

// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = uni.getSystemInfoSync()

onLoad(() => {})

const menuData = ref([
  { icon: 'home', text: '避风计划' },
  { icon: 'account', text: '风机施工', path: '/pages/construction/index?type=windTurbine' },
  { icon: 'account', text: '海缆施工', path: '/pages/construction/index?type=submarineCable' },
  { icon: 'home', text: '登船检验', path: '/pages/inspection/index?type=boarding' },
  { icon: 'home', text: '下船检验', path: '/pages/inspection/index?type=disembarking' },
  { icon: 'star', text: '视频监控' },
  { icon: 'star', text: '气象评估' },
])
const handleMore = () => {
  uni.navigateTo({ url: '/pages/application/index' })
}
const handleItemClick = (item) => {
  useToast(`点击了${item.text}`)
  uni.navigateTo({ url: item.path })
}

const handleOpenCode = () => {
  uni.navigateTo({ url: '/pages/QRCode/index' })
}

const weatherCard = {
  img: {
    url: '/static/home/avatar.jpg',
    width: 80,
    height: 80,
    circle: true,
  },
  title: {
    text: '气象预警',
  },
  tag: {
    text: '1小时前',
  },
}
</script>

<style lang="scss" scoped>
.page {
  position: relative;
  overflow: auto;
  background-image: url('@/static/home/banner.png');
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100% 100%;
}
.main {
  padding: 20rpx;
  margin-top: 40rpx;
}
.header {
  display: flex;
  color: #fff;
  .avatar {
    width: 96rpx;
    height: 96rpx;
    margin-right: 24rpx;
    border: 4rpx solid #ffffff;
    border-radius: 12rpx 12rpx 12rpx 12rpx;
  }
  .img {
    width: 100%;
    height: 100%;
    border-radius: 12rpx 12rpx 12rpx 12rpx;
  }
  .userinfo {
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: space-between;
  }
  .userinfo-header {
    display: flex;
    align-items: center;
    justify-content: flex-start;

    height: 56rpx;
    font-size: 40rpx;
    .tags {
      margin-left: 32rpx;
      font-size: 32rpx;
    }
  }
  .tip {
    font-size: 28rpx;
  }
}
.info {
  display: flex;
  justify-content: space-between;
  height: 280rpx; // 140 * 2
  margin-top: 44rpx; // 22 * 2
  .info-left {
    // height: 100%;
    // width: 362rpx; // 181 * 2
    // flex-shrink: 0;
    position: relative;
    padding: 24rpx 40rpx; // 12 * 2 20 * 2
    color: #fff;
    background: linear-gradient(180deg, #4b88ff 0%, #2041e4 100%);
    border-radius: 8rpx 8rpx 8rpx 8rpx; // 4 * 2
    box-shadow: 0rpx 8rpx 16rpx 0rpx rgba(37, 70, 233, 0.32); // 0 * 2 4 * 2 8 * 2
    .left-top {
      display: flex;
      align-items: center;
    }
    .img {
      width: 96rpx; // 48 * 2
      height: 96rpx; // 48 * 2
    }
    .num {
      margin-left: 32rpx; // 16 * 2
      font-size: 64rpx; // 32 * 2
    }
    .top-right {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      height: 100%;
      margin-left: 14rpx; // 7 * 2
      .text {
        font-size: 28rpx; // 14 * 2
      }
    }
    .left-bottom {
      position: absolute;
      top: 136rpx; // 68 * 2
      right: 0;
      bottom: 0;
      left: 0;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      // z-index: 10;
      padding: 18rpx 40rpx; // 9 * 2 20 * 2
      // height: 144rpx; // 72 * 2
      background: linear-gradient(180deg, #ffffff 0%, #267fe6 100%);
      border-radius: 8rpx 8rpx 8rpx 8rpx; // 4 * 2
      .bottom-item {
        display: flex;
        align-items: center;
        font-size: 28rpx; // 14 * 2
      }
      .desc {
        height: 48rpx; // 24 * 2
        padding: 0 12rpx; // 0 6 * 2
        line-height: 48rpx; // 24 * 2
        text-align: center;
        background: rgba(255, 255, 255, 0.25);
        border-radius: 4rpx 4rpx 4rpx 4rpx; // 2 * 2
      }
      .value {
        margin-left: 24rpx; // 12 * 2
      }
    }
  }
  .info-right {
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: space-between;
    margin-left: 20rpx; // 10 * 2
    .right-item {
      display: flex;
      // width: 100%;
      height: 132rpx; // 42 * 2
      padding: 24rpx 16rpx; // 12 * 2 8 * 2
      background: #ffffff;
      border-radius: 8rpx; // 4 * 2
      .img {
        width: 80rpx; // 40 * 2
        height: 80rpx; // 40 * 2
        border-radius: 28rpx; // 14 * 2
      }
      .item-right {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        margin-left: 24rpx; // 12 * 2
      }
      .desc {
        font-size: 32rpx; // 16 * 2
        font-weight: bold;
        line-height: 40rpx; // 20 * 2
        color: #1d2129;
      }
      .tips {
        font-size: 24rpx; // 12 * 2
        line-height: 40rpx; // 20 * 2
      }
    }
  }
}
.menu {
  padding: 22rpx;
  margin-top: 22rpx;
  background: #ffffff;
  border-radius: 15rpx 15rpx 15rpx 15rpx;
  box-shadow: 0rpx 8rpx 11rpx 0rpx rgba(152, 178, 244, 0.1);
}
</style>
