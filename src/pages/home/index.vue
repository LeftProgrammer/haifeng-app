<!-- 使用 type="home" 属性设置首页，其他页面不需要设置，默认为page；推荐使用json5，更强大，且允许注释 -->
<route lang="json5" type="home">
{
  style: {
    navigationStyle: 'custom',
  },
  needLogin: true,
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
            <view class="name">你好，{{ userInfo.name }}</view>
            <!-- <uv-tags class="tags" text="已登船" type="warning" shape="circle"></uv-tags> -->
          </view>
          <view class="tip">今日工作辛苦了！</view>
        </view>
      </view>
      <view class="info">
        <view class="info-left" @click="handleGoWeather">
          <view class="left-top">
            <view class="img">{{ weatherData?.weatherDescription }}</view>
            <view class="num">{{ weatherData?.temperature }}</view>
            <view class="top-right">
              <view class="text unit">℃</view>
              <view class="text weather">{{ weatherData?.weatherDescription }}</view>
            </view>
          </view>
          <view class="left-bottom">
            <view class="bottom-item">
              <view class="desc">{{ weatherData?.windMark || '无' }}风</view>
              <view class="value" v-if="weatherData?.windMark">{{ weatherData?.windSpeed }}级</view>
            </view>
            <view class="bottom-item">
              <view class="desc">能见度</view>
              <view class="value">{{ weatherData?.visibility }}km</view>
            </view>
          </view>
        </view>
        <view class="info-right">
          <view class="right-item" @click="handleOpenCode">
            <image class="img" src="../../static/home/avatar.png"></image>
            <view class="item-right">
              <view class="desc">我的通行码</view>
              <view class="tips code">出航请出示</view>
            </view>
          </view>
          <view class="right-item">
            <image class="img" src="../../static/home/avatar.png"></image>
            <view class="item-right">
              <view class="desc">出航记录</view>
              <view class="tips record">已出航23次</view>
            </view>
          </view>
        </view>
      </view>

      <view class="menu">
        <common-menu :menu-list="menuData" @moreMenu="handleMore" @itemClick="handleItemClick" />
      </view>

      <view class="card">
        <jh-card v-bind="weatherCard">
          <template v-slot:body>
            <view class="content">
              <template v-if="extremeWeatherData?.content">
                <view class="content-header">暴雨橙色预警</view>
                <view class="content-main">
                  <uv-read-more show-height="120rpx" :toggle="true" closeText="全文">
                    {{ extremeWeatherData?.content }}
                  </uv-read-more>
                </view>
                <view class="content-footer">
                  数据来源： {{ extremeWeatherData?.releaseSource }}
                </view>
              </template>
              <uv-empty
                v-else
                mode="data"
                icon="https://cdn.uviewui.com/uview/empty/data.png"
              ></uv-empty>
            </view>
          </template>

          <template v-slot:footer>
            <view class="footer">
              <view v-if="true" class="btn">预警详情</view>
              <view v-else class="btn" style="color: #ebedf0">预警详情</view>
            </view>
          </template>
        </jh-card>
      </view>
      <view class="card">
        <jh-card v-bind="windShelter">
          <template v-slot:body>
            <view class="content">
              <view class="content-main">
                <uv-read-more show-height="120rpx" :toggle="true" closeText="全文">
                  {{ windnotifycationData?.content }}
                </uv-read-more>
              </view>
              <view class="content-footer">
                联系人：{{ windnotifycationData?.contactInfo?.name }}
                {{ windnotifycationData?.contactInfo?.phone }}
              </view>
            </view>
          </template>
          <template v-slot:footer>
            <view class="footer">
              <view v-if="true" class="btn">避风监控</view>
              <view v-else class="btn" style="color: #ebedf0">避风监控</view>
            </view>
          </template>
        </jh-card>
      </view>
      <view class="fence card">
        <jh-card v-bind="fence">
          <template v-slot:body>
            <view class="content">
              <view class="item" v-for="(item, index) in shipAlarmData" :key="index">
                <view class="item-left">
                  <view class="title">{{ item.name }}</view>
                  <view class="date">{{ dayjs(item.lasttime).format('YYYY-MM-DD HH:mm') }}</view>
                </view>
                <view class="btn">定位 ></view>
              </view>
            </view>
          </template>
        </jh-card>
      </view>
    </view>
  </view>
</template>

<script setup>
import CommonMenu from '@/components/CommonMenu/index.vue'
import JhCard from '@/components/jh-card/index.vue'
import { useToast } from '@/utils/modals/index'
import { useUserStore } from '@/store'
import {
  getRealTimeWeather,
  getExtremeWeather,
  windnotifycation,
  getShipAlarm,
} from '@/service/home/login'
import { maxBy } from 'lodash-es'
import dayjs from 'dayjs'

defineOptions({
  name: 'Home',
})

// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = uni.getSystemInfoSync()
const userInfo = useUserStore().userInfo

onLoad(() => {})

const menuData = ref([
  {
    icon: 'home',
    text: '避风计划',
  },
  {
    icon: 'star',
    text: '避风通知',
    path: '/pages/windShelter/notice/index',
  },
  {
    icon: 'integral',
    text: '风机施工',
    path: '/pages/construction/index?type=windTurbine',
  },
  {
    icon: 'star',
    text: '海缆施工',
    path: '/pages/construction/index?type=submarineCable',
  },
  {
    icon: 'grid',
    text: '登船检验',
    path: '/pages/inspection/index?type=boarding',
  },
  {
    icon: 'grid-fill',
    text: '下船检验',
    path: '/pages/inspection/index?type=disembarking',
  },
  {
    icon: 'account',
    text: '视频监控',
  },
  {
    icon: 'star',
    text: '气象评估',
  },
])

const handleGoWeather = () => {
  uni.navigateTo({
    url: '/pages/weather/index',
  })
}

const handleMore = () => {
  uni.navigateTo({
    url: '/pages/application/index',
  })
}
const handleItemClick = (item) => {
  uni.navigateTo({
    url: item.path,
  })
}

const handleOpenCode = () => {
  uni.navigateTo({
    url: '/pages/QRCode/index',
  })
}

const weatherData = ref(null) // 天气
const extremeWeatherData = ref(null) // 气象
const windnotifycationData = ref(null) // 避风
const shipAlarmData = ref(null) // 围栏

const weatherCard = reactive({
  header: {
    bgcolor:
      'linear-gradient(360deg, rgba(255, 228, 157, 0.06) 20%, rgba(246, 160, 32, 0.16) 100%)',
  },
  border: true,
  line: true,
  imageUrl: '../../static/home/card-icon-1.png',
  title: {
    text: '气象预警',
  },
  tag: {
    text: '无',
  },
})
const windShelter = reactive({
  header: {
    bgcolor: 'linear-gradient(360deg, rgba(157, 214, 255, 0.06) 20%, rgba(50, 84, 255, 0.16) 100%)',
  },
  border: true,
  line: true,
  imageUrl: '../../static/home/card-icon-2.png',
  title: {
    text: '避风通知',
  },
  tag: {
    text: '无',
  },
})
const fence = reactive({
  header: {
    bgcolor: 'linear-gradient( 360deg, rgba(255,192,157, 0.06) 0%, rgba(247,104,43, 0.16) 100%)',
  },
  border: true,
  line: true,
  imageUrl: '../../static/home/card-icon-3.png',
  title: {
    text: '围栏警告',
  },
  tag: {
    text: '无',
  },
})

const promiseMap = new Map([
  ['weatherData', getRealTimeWeather()],
  ['extremeWeatherData', getExtremeWeather()],
  ['windnotifycationData', windnotifycation()],
  ['shipAlarmData', getShipAlarm()],
])
const getData = () => {
  Promise.allSettled(promiseMap.values()).then((results) => {
    let index = 0
    for (const [key, promise] of promiseMap.entries()) {
      const res = results[index++]

      console.error('result===>', res)
      if (res.status === 'fulfilled') {
        switch (key) {
          case 'weatherData':
            weatherData.value = res.value?.result || {}
            break
          case 'extremeWeatherData':
            extremeWeatherData.value = res.value?.result || {}
            weatherCard.tag.text = extremeWeatherData.value?.releaseDate
              ? `${extremeWeatherData.value?.releaseDate} 发布`
              : '无'
            break
          case 'windnotifycationData':
            windnotifycationData.value = res.value?.result || {}
            windnotifycationData.value.contactInfo = JSON.parse(
              windnotifycationData.value?.contactInfo || '{}',
            )
            windShelter.tag.text = windnotifycationData.value?.updateTime
              ? `${windnotifycationData.value?.updateTime} 发布`
              : '无'
            break
          case 'shipAlarmData':
            shipAlarmData.value = res.value?.result?.inShip || []
            // if (shipAlarmData.value.length > 0) {
            //   const latestObj = maxBy(shipAlarmData.value, 'lasttime')
            //   fence.tag.text = latestObj
            //     ? `${dayjs(latestObj.lasttime).format('YYYY-MM-DD HH:mm')} 发布`
            //     : '无'
            // }
            break
        }
      } else if (result.status === 'rejected') {
        console.error(`${key} 失败:`, result.reason)
        // 处理失败的请求...
      }
    }
  })
}
onShow(() => {
  getData()
})
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
      .code {
        color: #3254ff;
      }
      .record {
        color: #5ab76f;
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

.card {
  margin-top: 24rpx;

  .content {
    padding: 20rpx 24rpx 0;

    .content-header {
      font-size: 32rpx;
      color: #ff7d00;
      margin-bottom: 16rpx;
    }

    .content-main {
      .uv-read-more__content {
        height: auto !important;
      }

      .uv-read-more__content__inner {
        font-size: 32rpx;
        color: #1d2129;
        line-height: 48rpx;
      }
    }

    .content-footer {
      font-size: 28rpx;
      color: #86909c;
      padding-top: 32rpx;
      padding-bottom: 24rpx;
      border-bottom: 2rpx solid #e5e6eb;
    }
  }

  .footer {
    width: 100%;
    height: 92rpx;
    display: flex;
    justify-content: center;
    align-items: center;

    .btn {
      font-size: 32rpx;
      color: #3254ff;
    }
  }
}

.fence {
  .content {
    padding: 20rpx 24rpx 32rpx;

    .item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 20rpx;
      border-bottom: 2rpx solid #e5e6eb;
    }

    .item-left {
      flex: 1;
    }

    .title {
      font-size: 28rpx;
      color: #1d2129;
      line-height: 44rpx;
    }

    .date {
      font-size: 24rpx;
      color: #86909c;
      line-height: 40rpx;
    }

    .btn {
      font-size: 32rpx;
      color: #3254ff;
      line-height: 48rpx;
    }
  }
}
</style>
