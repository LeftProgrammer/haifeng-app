<route lang="json5">
{
  style: {
    navigationBarTitleText: '避风通知',
  },
}
</route>
<template>
  <view>
    <NewCard :image="weatherCard.img" :title="weatherCard.title" :tag="weatherCard.tag">
      <template v-slot:body>
        <view class="tui-default">钦州东南海面一带已经出现40毫米降雨，目前降雨云</view>
      </template>
      <template v-slot:footer>
        <view class="tui-default">预警详情</view>
      </template>
    </NewCard>
  </view>
</template>

<script lang="ts" setup>
import NewCard from '@/components/NewCard/index.vue'
</script>
