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
  <view
    class="page h-full px-2 pb-5 relative overflow-auto bg-no-repeat bg-center bg-cover"
    :style="{ paddingTop: safeAreaInsets?.top + 'px' }"
  >
    <view class="mt-4">
      <view class="header flex c-#fff">
        <view class="avatar w-12 h-12 m-r-3 border-2 border-white rounded-1.5">
          <image class="w-full h-full rounded-1.5" src="../../static/home/avatar.png"></image>
        </view>
        <view class="userinfo flex flex-col justify-between flex-1">
          <view class="userinfo-header flex items-center justify-start h-7 text-5">
            <view class="name">你好，{{ userInfo.name }}</view>
            <!-- <uv-tags class="tags ml-4 text-4" text="已登船" type="warning" shape="circle"></uv-tags> -->
          </view>
          <view class="tip text-3.5">今日工作辛苦了！</view>
        </view>
      </view>
      <view class="info flex justify-between h-35 mt-5">
        <view
          class="info-left relative p-3 text-white rounded-lg shadow-[0_1_2_0_rgba(37,70,233,0.32)]"
          @click="handleGoWeather"
        >
          <view class="flex items-center">
            <image class="w-12 h-12" src="../../static/home/weather-1.png"></image>
            <view class="ml-2.5 text-8">{{ weatherData?.temperature }}</view>
            <view class="flex flex-col justify-around h-full ml-1.7">
              <view class="text-3.5">℃</view>
              <view class="text-3.5">{{ weatherData?.weatherDescription }}</view>
            </view>
          </view>
          <view
            class="left-bottom absolute top-17 right-0 bottom-0 left-0 flex flex-col justify-between py-2.25 px-3 rounded-lg"
          >
            <view class="flex items-center text-3.5">
              <view class="desc h-6 px-3 leading-6 text-center rounded-md">
                {{ weatherData?.windMark ? `${weatherData?.windMark}风` : '无' }}
              </view>
              <view class="ml-2.5" v-if="weatherData?.windMark">
                {{ weatherData?.windSpeed }}级
              </view>
            </view>
            <view class="flex items-center text-3.5">
              <view class="desc h-6 px-3 leading-6 text-center rounded-md">能见度</view>
              <view class="ml-2.5">{{ weatherData?.visibility }}km</view>
            </view>
          </view>
        </view>
        <view class="flex flex-1 flex-col justify-between ml-2.5">
          <view class="flex h-16.5 px-3 py-4 bg-white rounded-lg" @click="handleOpenCode">
            <image class="w-10 h-10" src="../../static/home/code-icon.png"></image>
            <view class="flex flex-col justify-between ml-3">
              <view class="text-4 font-bold leading-5 text-[#1d2129]">我的通行码</view>
              <view class="mt-0.5 text-3 leading-5 text-[#3254ff]">出航请出示</view>
            </view>
          </view>
          <view class="flex h-16.5 px-3 py-4 bg-white rounded-lg">
            <image class="w-10 h-10" src="../../static/home/record-icon.png"></image>
            <view class="flex flex-col justify-between ml-3">
              <view class="text-4 font-bold leading-5 text-[#1d2129]">出航记录</view>
              <view class="mt-0.5 text-3 leading-5 text-[#5ab76f]">已出航23次</view>
            </view>
          </view>
        </view>
      </view>

      <view
        class="menu p-2.75 mt-2.75 bg-white rounded-1.875 shadow-[0_1_1.375_0_rgba(152,178,244,0.1)]"
      >
        <jh-menus :menu-list="menuData" @moreMenu="handleMore" @itemClick="handleItemClick" />
      </view>

      <view class="mt-3">
        <jh-card v-bind="weatherCard">
          <template v-slot:body>
            <view class="py-3 mx-3 border-b border-[#e5e6eb]">
              <template v-if="extremeWeatherData?.content">
                <view class="text-4 text-[#ff7d00] mb-2">暴雨橙色预警</view>
                <uv-read-more show-height="130rpx" :toggle="true" closeText="全文">
                  <view class="text-4 leading-6 text-[#1d2129]">
                    {{ extremeWeatherData?.content }}
                  </view>
                </uv-read-more>
                <view class="text-3.5 text-[#86909c] mt-3">
                  数据来源： {{ extremeWeatherData?.releaseSource }}
                </view>
              </template>
              <uv-empty
                v-else
                mode="data"
                text="暂无数据"
                icon="https://cdn.uviewui.com/uview/empty/data.png"
              ></uv-empty>
            </view>
          </template>

          <template v-slot:footer>
            <view class="w-full h-11.5 flex items-center justify-center">
              <view v-if="extremeWeatherData?.content" class="text-4 leading-6 text-[#3254ff]">
                预警详情
              </view>
              <view v-else class="text-4 leading-6 text-[#ebedf0]">预警详情</view>
            </view>
          </template>
        </jh-card>
      </view>
      <view class="mt-3">
        <jh-card v-bind="windShelter">
          <template v-slot:body>
            <view class="py-3 mx-3 border-b border-[#e5e6eb]">
              <template v-if="windnotifycationData?.content">
                <uv-read-more show-height="130rpx" :toggle="true" closeText="全文">
                  <view class="text-4 leading-6 text-[#1d2129]">
                    {{ windnotifycationData?.content }}
                  </view>
                </uv-read-more>
                <view class="text-3.5 text-[#86909c] mt-3">
                  联系人：{{ windnotifycationData?.contactInfo?.name }}
                  {{ windnotifycationData?.contactInfo?.phone }}
                </view>
              </template>
              <uv-empty
                v-else
                mode="data"
                text="暂无数据"
                icon="https://cdn.uviewui.com/uview/empty/data.png"
              ></uv-empty>
            </view>
          </template>
          <template v-slot:footer>
            <view class="w-full h-11.5 flex items-center justify-center">
              <view
                v-if="windnotifycationData?.content"
                class="text-4 leading-6 text-[#3254ff]"
                @click="handleGo('windnotifycation')"
              >
                避风监控
              </view>
              <view v-else class="text-4 leading-6 text-[#ebedf0]">避风监控</view>
            </view>
          </template>
        </jh-card>
      </view>
      <view class="mt-3">
        <jh-card v-bind="fence">
          <template v-slot:body>
            <view class="py-3 mx-3">
              <template v-if="shipAlarmData.length > 0">
                <view
                  class="flex items-center justify-between pb-2.5 border-b border-[#e5e6eb]"
                  v-for="(item, index) in shipAlarmData"
                  :key="index"
                >
                  <view class="flex-1">
                    <view class="text-3.5 text-[#1d2129] leading-5.5">{{ item.name }}</view>
                    <view class="text-3 text-[#86909c] leading-5">
                      {{ dayjs(item.lasttime).format('YYYY-MM-DD HH:mm') }}
                    </view>
                  </view>
                  <view class="text-4 text-[#3254ff] leading-6">定位 ></view>
                </view>
              </template>
              <uv-empty
                v-else
                mode="data"
                text="暂无数据"
                icon="https://cdn.uviewui.com/uview/empty/data.png"
              ></uv-empty>
            </view>
          </template>
        </jh-card>
      </view>
    </view>
  </view>
</template>

<script setup>
import JhMenus from '@/components/jh-menus/index.vue'
import JhCard from '@/components/jh-card/index.vue'
import { useToast } from '@/utils/modals/index'
import { useAppStore, useUserStore } from '@/store'
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
const appStore = useAppStore()

const menuData = computed(() => appStore.homeApps)

console.error('menuData', menuData)

onLoad(() => {
  getData()
})

// const menuData = ref([
//   {
//     icon: 'home',
//     text: '避风计划',
//   },
//   {
//     icon: 'star',
//     text: '避风通知',
//     path: '/pages/windShelter/notice/index',
//   },
//   {
//     icon: 'integral',
//     text: '风机施工',
//     path: '/pages/construction/index?type=windTurbine',
//   },
//   {
//     icon: 'star',
//     text: '海缆施工',
//     path: '/pages/construction/index?type=submarineCable',
//   },
//   {
//     icon: 'grid',
//     text: '登船检验',
//     path: '/pages/inspection/index?type=boarding',
//   },
//   {
//     icon: 'grid-fill',
//     text: '下船检验',
//     path: '/pages/inspection/index?type=disembarking',
//   },
//   {
//     icon: 'account',
//     text: '视频监控',
//   },
//   {
//     icon: 'star',
//     text: '气象评估',
//   },
// ])

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

const handleGo = (type) => {
  switch (key) {
    case 'extremeWeatherData':
      uni.navigateTo({ url: '' })
      break
    case 'windnotifycationData':
      uni.navigateTo({ url: '' })
      break
    case 'shipAlarmData':
      uni.navigateTo({ url: '' })
      break
  }
}
// onShow(() => {
//   getData()
// })
</script>

<style lang="scss" scoped>
.page {
  background-image: url('@/static/home/banner.png');
}

.info {
  .info-left {
    background: linear-gradient(180deg, #4b88ff 0%, #2041e4 100%);
  }
  .left-bottom {
    background: linear-gradient(180deg, #ffffff 0%, #267fe6 100%);
  }
  .desc {
    background: rgba(255, 255, 255, 0.25);
  }
}
</style>
