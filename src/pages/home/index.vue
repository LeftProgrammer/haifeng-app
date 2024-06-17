<!-- 使用 type="home" 属性设置首页，其他页面不需要设置，默认为page；推荐使用json5，更强大，且允许注释 -->
<route lang="json5" type="home">
{
  style: {
    navigationStyle: 'custom',
  },
}
</route>
<template>
  <view class="page h-full pt-2 px-4" :style="{ marginTop: safeAreaInsets?.top + 'px' }">
    <view class="banner"></view>
    <view class="main">
      <view class="header">
        <view class="header-left">
          <view class="avatar">
            <uv-image
              src="../../static/home/avator.png"
              width="48px"
              height="48px"
              radius="4px"
            ></uv-image>
          </view>
          <view class="userinfo">
            <view class="userinfo-header">
              <view class="name">你好，小熊</view>
              <uv-tags class="tags" text="已登船" type="warning" shape="circle"></uv-tags>
            </view>
            <view class="tip">今日出航幸苦了！</view>
          </view>
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
          <view class="right-item">
            <view class="item-img"></view>
            <view class="item-right">
              <view class="desc">我的通行码</view>
              <view class="tips">出航请出示</view>
            </view>
          </view>
          <view class="right-item">
            <view class="item-img"></view>
            <view class="item-right">
              <view class="desc">我的通行码</view>
              <view class="tips">出航请出示</view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="js" setup>
import PLATFORM from '@/utils/platform'

defineOptions({
  name: 'Home',
})

// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = uni.getSystemInfoSync()
const author = ref('菲鸽')
const description = ref(
  'unibest 是一个集成了多种工具和技术的 uniapp 开发模板，由 uniapp + Vue3 + Ts + Vite4 + UnoCss + UniUI + VSCode 构建，模板具有代码提示、自动格式化、统一配置、代码片段等功能，并内置了许多常用的基本组件和基本功能，让你编写 uniapp 拥有 best 体验。',
)

onLoad(() => {
  console.log(author)
})
const handleClick = () => {
  console.log('handleClick')
  uni.navigateTo({ url: '/pages/login/index' })
}
</script>

<style lang="scss" scoped>
.page {
  position: relative;
  background: #e9edf6;
}
.banner {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  height: 408px;
  background-image: url('@/static/home/banner.png');
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100% 100%;
}
.main {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 10;
  padding: 18px 8px;
}
.header {
  display: flex;
  color: #fff;
  .header-left {
    display: flex;
  }
  .avatar {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 52px;
    height: 52px;
    padding: 2px;
    margin-right: 12px;
    background: #fff;
    border-radius: 4px;
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

    height: 28px;
    font-size: 20px;
    .tags {
      margin-left: 16px;
      font-size: 16px;
    }
  }
  .tip {
    font-size: 14px;
  }
}
.info {
  display: flex;
  justify-content: space-between;
  height: 140px;
  margin-top: 22px;
  .info-left {
    // height: 100%;
    // width: 181px;
    // flex-shrink: 0;
    position: relative;
    padding: 12px 20px;
    color: #fff;
    background: linear-gradient(180deg, #4b88ff 0%, #2041e4 100%);
    border-radius: 4px 4px 4px 4px;
    box-shadow: 0px 4px 8px 0px rgba(37, 70, 233, 0.32);
    .left-top {
      display: flex;
      align-items: center;
    }
    .img {
      width: 48px;
      height: 48px;
    }
    .num {
      margin-left: 16px;
      font-size: 32px;
    }
    .top-right {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      height: 100%;
      margin-left: 7px;
      .text {
        font-size: 14px;
      }
    }
    .left-bottom {
      position: absolute;
      top: 68px;
      right: 0;
      bottom: 0;
      left: 0;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      // z-index: 10;
      padding: 9px 20px;
      // height: 72px;
      background: linear-gradient(180deg, #ffffff 0%, #267fe6 100%);
      border-radius: 4px 4px 4px 4px;
      .bottom-item {
        display: flex;
        align-items: center;
        font-size: 14px;
      }
      .desc {
        height: 24px;
        padding: 0 6px;
        line-height: 24px;
        text-align: center;
        background: rgba(255, 255, 255, 0.25);
        border-radius: 2px 2px 2px 2px;
      }
      .value {
        margin-left: 12px;
      }
    }
  }
  .info-right {
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: space-between;
    margin-left: 10px;
    .right-item {
      display: flex;
      // width: 100%;
      height: 42px;
      padding: 12px 8px;
      background: #ffffff;
      border-radius: 4px 4px 4px 4px;
      .item-img {
        width: 40px;
        height: 40px;
        border-radius: 14px 14px 14px 14px;
      }
      .item-right {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        margin-left: 12px;
      }
      .desc {
        font-size: 16px;
        font-weight: bold;
        line-height: 20px;
        color: #1d2129;
      }
      .value {
        font-size: 12px;
        line-height: 20px;
      }
    }
  }
}
</style>
