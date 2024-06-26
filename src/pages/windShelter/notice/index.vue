<route lang="json5">
{
  style: {
    navigationBarTitleText: '避风通知',
  },
}
</route>
<template>
  <view class="bg-#f5f5f5 h-100% px-2 pt-2.5 box-border overflow-auto">
    <template v-for="(item, index) in list" :key="index">
      <jh-card :image="item.img" :title="item.name" :tag="item.tag" @click="handleGoDetail(item)">
        <template v-slot:body>
          <view class="tui-default">计划避风开始时间: {{ item.planStartDate }}</view>
          <view class="tui-default">计划避风结束时间: {{ item.planEndDate }}</view>
          <view class="tui-default">本次截止上报时间: {{ item.deadline }}</view>
        </template>
        <template v-slot:footer>
          <view class="tui-default">通知人员： 张三、李四、王未</view>
        </template>
      </jh-card>
    </template>
    <uv-button type="primary" text="新增避风通知" @click="handleGoDetail({})"></uv-button>
  </view>
</template>

<script setup>
import JhCard from '@/components/jh-card/index.vue'

import { noticeList } from '@/service/windShelter/notice/index'
import dayjs from 'dayjs'
import { onLoad, onShow } from '@dcloudio/uni-app'
import { useToast } from '@/utils/modals'
const list = ref([])
onShow(() => {
  getList()
})
/**
 * @description 获取报备列表
 */
const getList = () => {
  noticeList().then((res) => {
    const { code, message, result } = res
    if (code === 200) {
      const unPublishedList = result.unPublishedList || []
      const publishedList = result.publishedList || []
      const hasEndedList = result.hasEndedList || []
      list.value = [...unPublishedList, ...publishedList, ...hasEndedList]
    } else {
      useToast(message)
    }
  })
}
const handleGoDetail = (item) => {
  // delete item.receiverInfo
  uni.navigateTo({
    url: `/pages/windShelter/notice/detail?item=${encodeURIComponent(JSON.stringify(item))}`,
  })
}

// const routerTo = (item) => {
//   uni.navigateTo({
//     url: `/pages/windShelter/notice/detail?id=${item.id}&name=${item.name}&type=${item.type}&deadline=${item.deadline}`,
//   })
// }
</script>
