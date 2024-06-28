<route lang="json5">
{
  style: {
    navigationBarTitleText: '气象预警',
  },
}
</route>
<template>
  <view class="bg-#f5f5f5 px-2 pt-2.5 h-100% overflow-auto">
    <uv-collapse accordion>
      <uv-collapse-item
        v-for="item in list"
        class="bg-#fff mb-2.5 border-rd-2"
        :class="{
          weatherType1: item.warningLevel === '红色',
          weatherType2: item.warningLevel === '黄色',
          weatherType3: item.warningLevel === '橙色',
          weatherType4: item.warningLevel === '蓝色',
          weatherType5: item.warningLevel === '白色',
        }"
        :clickable="false"
        :title="`${item.type}${item.warningLevel}预警`"
        :key="item.id"
        :label="`${item.releaseDate}发布`"
      >
        <template v-slot:icon>
          <uv-icon name="tags-fill" size="20"></uv-icon>
        </template>
        <view class="uv-collapse-content color-#1D2129 font-4 line-height-6">
          {{ item.content }}
        </view>
        <view class="color-#86909c font-size-3.5 line-height-5.5 mt-2.5">
          数据来源：{{ item.releaseSource }}
        </view>
      </uv-collapse-item>
    </uv-collapse>
    <view class="mt-1.5 color-#3254ff font-size-3 line-height-5 text-center mb-4">
      查看更多天气影响
    </view>
  </view>
</template>

<script setup>
import { getWeatherWarn } from '@/service/weather/index'
import { onLoad } from '@dcloudio/uni-app'
import dayjs from 'dayjs'
const list = ref([])
onLoad(() => {
  getWeatherWarn({ releaseDate: dayjs('2024-06-26').format('YYYY-MM-DD') }).then((res) => {
    console.log('🚀 ~ getWeatherWarn ~ res:', res)
    list.value = res.result.records
  })
})
</script>
<style scoped lang="scss">
:deep(.uv-line) {
  display: none;
}
.weatherType1 {
  :deep(.uv-cell__title-text) {
    color: #f53f3f;
  }
}
.weatherType2 {
  :deep(.uv-cell__title-text) {
    color: #ff7d00;
  }
}
.weatherType3 {
  :deep(.uv-cell__title-text) {
    color: #fb6728;
  }
}
.weatherType4 {
  :deep(.uv-cell__title-text) {
    color: #3254ff;
  }
}
.weatherType5 {
  :deep(.uv-cell__title-text) {
    color: #a0aabb;
  }
}
</style>
