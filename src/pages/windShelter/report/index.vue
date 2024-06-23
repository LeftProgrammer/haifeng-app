<route lang="json5">
{
  style: {
    navigationBarTitleText: '避风报备',
  },
}
</route>
<template>
  <view class="bg-#f5f5f5 h-100% px-2 pt-2.5 box-border overflow-auto">
    <view
      v-for="item in list"
      :key="item.id"
      class="bg-#fff mb-2.5 border-rd-1.5 pb-4"
      @click="routerTo(item)"
    >
      <view class="flex title-bg border-rd-1.5 py-4 px-2">
        <image src="/static/shelterWind/shelterWind.png" class="w-12 h-12 ml-1 mr-2"></image>
        <view class="flex flex-col flex-1">
          <text class="color-#1D2129 font-4.5 line-height-5 mb-1.5">{{ item.name }}</text>
          <text class="color-#86909C font-3 line-height-5">{{ item.createTime }}</text>
        </view>
        <uv-tags text="已报备" v-if="item.type == 2" type="success" shape="circle"></uv-tags>
      </view>
      <view
        v-if="item.type == 1"
        class="h-7 flex-items-center mx-3 px-2.5 mb-2.5 bg-#FFF5EB font-3.5 line-height-4 flex justify-between"
      >
        <text class="color-#4E5969">
          <image src="/static/shelterWind/hourglass.png" class="w-4 h-4 mr-1.5"></image>
          距离截止上报时间还剩
        </text>
        <text class="color-#FF7D00">{{ item.dateCN }}</text>
      </view>
      <view class="color-#4E5969 mx-3 font-4 line-height-7.75">
        <text class="color-#86909C">计划避风开始时间：</text>
        {{ item.planStartDate }}
      </view>
      <view class="color-#4E5969 mx-3 font-4 line-height-7.75">
        <text class="color-#86909C">计划避风结束时间：</text>
        {{ item.planEndDate }}
      </view>
      <view class="color-#4E5969 mx-3 font-4 line-height-7.75 mb-2.5">
        <text class="color-#86909C">本次截止上报时间：</text>
        {{ item.deadline }}
      </view>
      <uv-line></uv-line>
      <view class="color-#1D2129 mt-2.5 mx-2.5 font-4 line-height-4.5">
        通知人员：
        {{
          JSON.parse(item.receiverInfo)
            .map((x) => x.name)
            .join('、')
        }}
      </view>
    </view>
  </view>
</template>

<script setup>
import { getwindShelter } from '@/service/windShelter/report/index.js'
import dayjs from 'dayjs'
import { onLoad, onShow } from '@dcloudio/uni-app'
const list = ref([])
onShow(() => {
  getList()
})
/**
 * @description 获取报备列表
 */
const getList = () => {
  getwindShelter().then((res) => {
    const unReportedList = res.result.unReportedList || []
    const reportedList = res.result.reportedList || []
    list.value = [
      ...unReportedList.map((x) => {
        x.type = 1
        const start = dayjs(new Date())
        const end = dayjs(x.deadline)
        if (start.isBefore(end)) {
          const totalMinutes = end.diff(start, 'minute')
          const days = Math.floor(totalMinutes / (24 * 60))
          const hours = Math.floor((totalMinutes % (24 * 60)) / 60)
          const minutes = totalMinutes % 60
          x.dateCN = `${days} 天 ${hours}小时 ${minutes}分`
        } else {
          x.dateCN = '已结束'
        }
        return x
      }),
      ...reportedList.filter((x) => (x.type = 2)),
    ]
  })
}
const routerTo = (item) => {
  uni.navigateTo({
    url: `/pages/windShelter/report/detail?id=${item.id}&name=${item.name}&type=${item.type}&deadline=${item.deadline}`,
  })
}
</script>

<style lang="scss" scoped>
.title-bg {
  background: linear-gradient(360deg, rgba(157, 214, 255, 0.16) 20%, rgb(50 84 255 / 16%) 100%);
  box-shadow: 0px 4px 6px 0px rgba(152, 178, 244, 0.1);
}
</style>
