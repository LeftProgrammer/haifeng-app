<route lang="json5">
{
  style: {
    navigationBarTitleText: '观豚日志',
  },
}
</route>
<template>
  <view class="bg-#f5f5f5 h-100% position-relative">
    <view
      style="z-index: 100"
      class="h-12 bg-#fff flex pl-2 pr-4 flex-justify-between flex-items-center position-fixed top-11 w-100%"
    >
      <view class="flex flex-items-center" @click="open">
        <uv-image
          src="../../static/dolphinWatch/date-icon.png"
          width="24px"
          height="24px"
          class="mr-2"
        ></uv-image>
        <text v-if="date" class="color-#1D2129 font-3.5 line-height-5.5">{{ date }}</text>
        <text v-else class="color-#86909C font-3.5 line-height-5.5">请选择日期</text>
      </view>
      <uv-icon
        name="close-circle"
        class="mr-2.5"
        color="#4E5969"
        size="16"
        v-if="date"
        @click="reset"
      ></uv-icon>
    </view>
    <view class="box px-2 pb-16 pt-14.5 bg-#f5f5f5">
      <uv-swipe-action>
        <uv-swipe-action-item
          :options="options"
          class="uv-border-bottom"
          v-for="item in listData"
          :key="item.id"
          @click="handlClick(2, item)"
        >
          <view class="swipe-action uv-border-top uv-border-bottom">
            <view class="swipe-action__content">
              <view class="bg-#fff h-33 border-rd-1 px-2 pt-3" @click="handlClick(3, item)">
                <view class="flex mb-2.5 pb-2.5 title-info">
                  <uv-image
                    src="../../static/dolphinWatch/dolphin.png"
                    width="64px"
                    height="64px"
                    class="mr-2"
                  ></uv-image>
                  <view class="py-1.5">
                    <view class="mb-2.5 color-#86909C font-size-3.5 line-height-5">
                      观测人员:{{ item.username }}
                    </view>
                    <view class="color-#86909C font-size-3.5 line-height-5">
                      所属船舶:{{ item.shipId_dictText }}
                    </view>
                  </view>
                </view>
                <view
                  class="flex mt-2.5 flex-justify-between line-height-5 font-size-3.5 color-#86909C"
                >
                  <view class="">
                    观测日期
                    <text class="color-#3254FF font-500">{{ item.watchDate }}</text>
                  </view>
                  <view>
                    记录数量
                    <text class="color-#3254FF font-500">{{ item.details.length }}条</text>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </uv-swipe-action-item>
      </uv-swipe-action>
      <uv-load-more :status="status" />
    </view>
    <view style="z-index: 100" class="h-16 bg-#fff py-3 px-14 position-fixed bottom-0 w-100%">
      <uv-button type="primary" color="#3254FF" @click="routerTo(1)" text="新增记录"></uv-button>
    </view>
  </view>
  <uv-calendars ref="calendars" @confirm="confirm" />
</template>

<script setup>
import { list } from '@/service/dolphinWatch/index'
import { onLoad } from '@dcloudio/uni-app'
import dayjs from 'dayjs'
const pageNo = ref(1)
const pageSize = ref(10)
const total = ref(0)
const pages = ref(0)
const listData = ref([])
const status = ref('loadmore')
const options = ref([
  {
    text: '编辑',
    style: {
      backgroundColor: '#3254FF',
    },
  },
])
onShow(() => {
  pageNo.value = 1
  listData.value = []
  getList()
})
const getList = () => {
  list({
    start: date.value,
    end: date.value,
    pageNo: pageNo.value,
    pageSize: pageSize.value,
  }).then((res) => {
    total.value = res.result.total
    pages.value = Math.ceil(total.value / pageSize.value)
    listData.value = [...listData.value, ...res.result.records]
    status.value = 'loadmore'
  })
}
const reset = () => {
  date.value = ''
  pageNo.value = 1
  pageSize.value = 10
  listData.value = []
  getList()
}
onReachBottom(() => {
  if (pageNo.value < pages.value) {
    status.value = 'loading'
    pageNo.value += 1
    getList()
  } else {
    status.value = 'nomore'
  }
})
// 选择日期
const calendars = ref(null)
const date = ref('')
const open = () => {
  calendars.value.open()
}
const confirm = (e) => {
  date.value = e.fulldate
  getList()
}
// 跳转
const handlClick = (type, item) => {
  routerTo(type, item.id)
}
/**
 *
 * @param type 1新增 2编辑 3查看 4新增但是是已有当天数据时新增
 * @param id
 */
const routerTo = (type, id) => {
  if (type === 1) {
    // 新增 判断当天是否已经添加过数据 有数据进行编辑
    const nowDate = dayjs(new Date()).format('YYYY-MM-DD')
    const data = listData.value.find((x) => x.watchDate === nowDate)
    if (data) {
      uni.navigateTo({
        url: `/pages/dolphinWatch/detail?type=4&id=${data.id}`,
      })
    } else {
      uni.navigateTo({
        url: `/pages/dolphinWatch/detail?type=1`,
      })
    }
  } else {
    uni.navigateTo({
      url: `/pages/dolphinWatch/detail?type=${type}${id ? `&id=${id}` : ''}`,
    })
  }
}
</script>
<style scoped lang="scss">
.box {
  // height: calc(100% - 48px);
  .title-info {
    border-bottom: 1px solid #e5e6eb;
  }
  .uv-swipe-action {
    background-color: #f5f5f5;
  }
  .uv-swipe-action-item {
    margin-bottom: 10px;
    border-radius: 4px;
  }
  .swipe-action {
    border: none;
  }
}
</style>
