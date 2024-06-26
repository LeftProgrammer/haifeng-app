<template>
  <view class="common-menu">
    <view class="menu-header" v-if="showHeader">
      <slot name="left">
        <view class="menu-title" v-if="title">{{ title }}</view>
      </slot>
      <slot name="right">
        <view class="more-btn" v-if="moreText" @click="handleMoreClick">{{ moreText }}</view>
      </slot>
    </view>
    <uv-scroll-list
      ref="scrollList"
      class="scroll-list"
      :scroll-x="true"
      :scroll-y="false"
      :indicator="showIndicator"
      v-bind="$attrs"
    >
      <view class="menu-items">
        <view
          class="menu-item"
          v-for="(item, index) in menuList"
          :key="index"
          @click="handleItemClick(item)"
          :style="itemWidth ? { width: itemWidth + 'px' } : null"
        >
          <uv-icon class="item-image" :name="item.icon" color="#3254FF" size="40"></uv-icon>
          <!-- <image class="item-image" :src="menuBaseUrl + item.icon" mode=""></image> -->
          <text class="item-text">{{ item.text }}</text>
        </view>
      </view>
    </uv-scroll-list>
  </view>
</template>

<script setup>
import { defineEmits, ref, onMounted, nextTick, computed } from 'vue'

const props = defineProps({
  // 组件标题
  title: {
    type: String,
    default: '常用功能',
  },
  // 更多按钮文字
  moreText: {
    type: String,
    default: '更多 >',
  },
  // 菜单列表数据
  menuList: {
    type: Array,
    default: () => [],
    required: true,
  },
  // 页面可显示的列数
  col: {
    type: Number,
    default: 5,
  },
})

const emit = defineEmits(['moreMenu', 'itemClick'])

const scrollList = ref(null)
const scrollWidth = ref(0)
const itemWidth = ref(0)

const showHeader = computed(() => {
  return !!props.title || !!props.moreText
})

const showIndicator = computed(() => {
  return props.menuList.length > props.col
})

onMounted(async () => {
  await nextTick()
  scrollWidth.value = document.querySelector('.scroll-list').offsetWidth
  console.log('scrollWidth', scrollWidth.value)
  if (props.col && props.col > 2) {
    const width = scrollWidth.value / props.col
    itemWidth.value = width < 100 ? width : 100
  }
  console.log('itemWidth', itemWidth.value)
})

const handleMoreClick = () => {
  emit('moreMenu')
}

const handleItemClick = (item) => {
  if (emit('itemClick', item)) {
    emit('itemClick', item)
  } else {
    item.path && uni.navigateTo(item.path)
  }
}
</script>

<style lang="scss" scoped>
.common-menu {
  .menu-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 22rpx;

    .menu-title {
      font-size: 31rpx;
      font-weight: bold;
      line-height: 46rpx;
      color: #1d2129;
    }

    .more-btn {
      font-size: 27rpx;
      color: #86909c;
    }
  }

  .scroll-list {
    position: relative;
    overflow-x: auto;
    white-space: nowrap;

    .menu-items {
      display: flex;
    }

    .menu-item {
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
      align-items: center;
      justify-content: space-between;
      // margin-right: 10px;
      &:last-child {
        margin-right: 0;
      }
      .item-text {
        display: block;
        margin-top: 11rpx;
        font-size: 27rpx;
        line-height: 42rpx;
        color: #4e5969;
        text-align: center;
      }
    }
    :deep(.uv-scroll-list) {
      padding-bottom: 0;
      margin-top: 19rpx;
    }
  }
}
</style>
