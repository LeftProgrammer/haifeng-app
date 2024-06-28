<route lang="json5">
{
  style: {
    navigationBarTitleText: '避风通知',
  },
}
</route>
<template>
  <view class="bg-#f5f5f5 h-100% box-border relative overflow-hidden">
    <view class="px-2 pt-2.5 pb-16 h-100% overflow-auto">
      <uv-swipe-action>
        <uv-swipe-action-item
          :options="options"
          class="uv-border-bottom"
          v-for="(item, index) in list"
          :key="index"
          :disabled="item.disabled"
          @click="handlDelete(item.id)"
        >
          <jh-card
            class="mb-2.5"
            :titleText="item.name"
            :tagText="item.tagText"
            v-bind="cardProps"
            @click="handleGoDetail(item)"
          >
            <template v-slot:right>
              <uv-tags :text="item.tagDesc" size="mini" :type="item.tagType || 'info'"></uv-tags>
            </template>

            <template v-slot:body>
              <view class="py-3 mx-3 border-b border-[#e5e6eb] h-30 flex flex-col justify-between">
                <view class="text-4 c-#86909C">
                  计划避风开始时间:
                  <text class="text-4 c-#4E5969 ml-1">{{ item.planStartDate }}</text>
                </view>
                <view class="text-4 c-#86909C">
                  计划避风结束时间:
                  <text class="text-4 c-#4E5969 ml-1">{{ item.planEndDate }}</text>
                </view>
                <view class="text-4 c-#86909C">
                  本次截止上报时间:
                  <text class="text-4 c-#4E5969 ml-1">{{ item.deadline }}</text>
                </view>
              </view>
            </template>

            <template v-slot:footer>
              <view
                class="w-full p-3 text-4 overflow-hidden c-#1D2129 text-ellipsis whitespace-nowrap align-middle"
              >
                通知人员： {{ item.receiver }}
              </view>
            </template>
          </jh-card>
        </uv-swipe-action-item>
      </uv-swipe-action>
    </view>

    <view
      class="absolute bottom-0 left-0 right-0 h-16 flex items-center flex-justify-around bg-white z-10"
    >
      <view class="w-35">
        <uv-button type="primary" text="新增避风通知" @click="handleGoDetail({})"></uv-button>
      </view>
    </view>
  </view>
</template>

<script setup>
import JhCard from '@/components/jh-card/index.vue'

import { noticeList, noticeDelete } from '@/service/windShelter/notice/index'
import dayjs from 'dayjs'
import { onLoad, onShow } from '@dcloudio/uni-app'
import { useToast, useDialog } from '@/utils/modals'

const tagObj = [
  {
    desc: '草稿',
    state: 0,
    type: 'info',
  },
  {
    desc: '已发布',
    state: 1,
    type: 'success',
  },
  {
    desc: '已结束',
    state: 2,
    type: 'primary',
  },
]
const cardProps = reactive({
  header: {
    bgcolor: 'linear-gradient( 360deg, rgba(157,214,255,0) 20%, rgba(50, 84, 255, 0.16) 100%)',
  },
  imageUrl: '../../../static/home/card-icon-1.png',
  // title: {
  //   text: '气象预警',
  // },
  tag: {
    text: '无',
  },
})
const list = ref([])

const options = [
  {
    text: '删除',
    style: {
      backgroundColor: '#f56c6c',
    },
  },
]

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
      list.value.forEach((item) => {
        item.tagText = item?.updateTime ? item?.updateTime : '无'
        const obj = tagObj.find((e) => e.state === item.state)
        item.tagDesc = obj.desc
        item.state = obj.state
        item.tagType = obj.type
        const receiverAry = JSON.parse(item.receiverInfo) || []
        if (receiverAry.length > 0) {
          item.receiver = receiverAry.map((e) => e.name).join('，')
        }
        if ([1, 2].includes(item.state)) {
          item.disabled = true
        }
      })
    } else {
      useToast(message)
    }
  })
}
const handlDelete = async (id) => {
  await useDialog(`确认删除？`, {
    showCancelButton: true,
  })
  const { code, message } = await noticeDelete(id)
  if (code === 200) {
    useToast('操作成功')
  } else {
    useToast(message)
  }
}
const handleGoDetail = (item) => {
  uni.navigateTo({
    url: `/pages/windShelter/notice/detail?item=${encodeURIComponent(JSON.stringify(item))}`,
  })
}
</script>
