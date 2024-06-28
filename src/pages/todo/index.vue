<route lang="json5">
{
  style: {
    navigationBarTitleText: '待办',
  },
  needLogin: true,
}
</route>

<template>
  <view class="bg-#f5f5f5 overflow-auto pt-2.5 px-2 h-100%">
    <jh-card
      class="mb-2.5"
      v-bind="windShelter"
      v-for="item in listData"
      :key="item.id"
      :titleText="item.windNotification.name"
      :tagText="item.windNotification.createTime"
      @longpress="handleLongPress(item)"
    >
      <template v-slot:body>
        <view class="pb-3 mx-3 border-b border-[#e5e6eb]">
          <view
            class="h-7 flex-items-center px-2.5 mb-2.5 bg-#FFF5EB font-3.5 line-height-4 flex justify-between"
          >
            <text class="color-#4E5969">
              <image src="/static/shelterWind/hourglass.png" class="w-4 h-4 mr-1.5"></image>
              {{ item.type === '2' ? '超时' : '距离截止上报时间还剩' }}
            </text>
            <text class="color-#FF7D00">{{ item.dateCN }}</text>
          </view>
          <view class="color-#4E5969 mx-3 font-4 line-height-5.5">
            {{ item.windNotification.content }}
          </view>
        </view>
      </template>

      <template v-slot:footer>
        <view class="w-full h-11.5 flex px-3 items-center justify-between" @click="routerTo(item)">
          <text :class="item.type == 1 ? 'color-#1D2129' : 'color-#4E5969'">填写避风内容</text>
          <uv-icon name="arrow-right" color="#4E5969" size="16"></uv-icon>
        </view>
      </template>
    </jh-card>
  </view>
</template>

<script setup>
import { list, remove } from '@/service/todo/index'
import JhCard from '@/components/jh-card/index.vue'
import { onLoad, onShow } from '@dcloudio/uni-app'
import { useDialog, useToast } from '@/utils/modals/index'
import dayjs from 'dayjs'
const windShelter = reactive({
  header: {
    bgcolor:
      'linear-gradient(360deg, rgba(157, 255, 249, 0.03) 20%, rgb(17, 203, 233, 0.16) 100%);',
  },
  border: true,
  line: true,
  imageUrl: '../../static/home/card-icon-2.png',
  title: {
    text: '避风通知',
  },
  tag: {
    text: '',
  },
})
const listData = ref([])
onShow(() => {
  getList()
})
const getList = () => {
  list().then((res) => {
    listData.value = res.result.map((x) => {
      const start = dayjs(new Date())
      const end = dayjs(x.windNotification.deadline)
      if (start.isBefore(end)) {
        const totalMinutes = end.diff(start, 'minute')
        const days = Math.floor(totalMinutes / (24 * 60))
        const hours = Math.floor((totalMinutes % (24 * 60)) / 60)
        const minutes = totalMinutes % 60
        x.dateCN = `${days} 天 ${hours}小时 ${minutes}分`
        x.type = 1
      } else {
        x.type = 2
        x.dateCN = '未报备'
      }
      return x
    })
  })
}
const handleLongPress = (item) => {
  useDialog('确定删除待办?', {
    showCancelButton: true,
  }).then((res) => {
    remove({ id: item.id }).then((res) => {
      useToast('删除成功')
      getList()
    })
  })
}
const routerTo = (item) => {
  if (item.type === 2) return
  uni.navigateTo({
    url: `/pages/windShelter/report/detail?id=${item.windNotification.id}&name=${
      item.windNotification.name
    }&type=1&deadline=${item.windNotification.deadline}`,
  })
}
</script>

<style lang="scss" scoped></style>
