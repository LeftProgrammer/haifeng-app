<template>
  <view>
    <uv-scroll-list :indicator="true" indicatorColor="#fff0f0" indicatorActiveColor="#f56c6c">
      <view v-for="(item, index) in list" :key="index">
        <image :src="item.image" mode="heightFix" style="height: 200px"></image>
      </view>
    </uv-scroll-list>
  </view>
</template>
<script lang="js" setup>
// import { getIsTabbar } from '@/utils/index'

defineProps({
  menuList: {
    type: Array,
    default: () => [],
  },
})
// 获取页面栈
const pages = getCurrentPages()
// const isTabbar = getIsTabbar()
// console.log({ isTabbar, pagesLen: pages.length })

// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = uni.getSystemInfoSync()
</script>

<style lang="scss" scoped></style>
