<template>
  <view class="app-grid">
    <view v-if="title" class="grid-title">{{ title }}</view>
    <uv-grid :col="col" :border="false" :square="false" v-if="apps.length > 0">
      <uv-grid-item v-for="(app, index) in apps" :key="index" @click="handleAppClick(app)">
        <view class="grid-item">
          <view class="icon-wrap relative">
            <uv-icon
              class="item-image"
              :name="app.icon"
              color="#3254FF"
              size="40"
              :customStyle="{ paddingTop: 20 + 'rpx' }"
            />
            <view
              v-if="isRemovable"
              class="delete-btn absolute top-1 right-0"
              @click.stop="handleRemoveApp(app)"
            >
              <uv-icon name="minus-circle" color="#CBCBCB" size="18" />
            </view>
            <view
              v-if="isAddable(app)"
              class="add-btn absolute top-1 right-0"
              @click.stop="handleAddApp(app)"
            >
              <uv-icon name="plus-circle" color="#3254FF" size="18" />
            </view>
          </view>
          <text class="app-name text-xs text-gray-600 mt-2">{{ app.name }}</text>
        </view>
      </uv-grid-item>
    </uv-grid>
    <view v-else>暂无数据</view>
  </view>
</template>

<script lang="ts" setup>
import { computed, useAttrs } from 'vue'
import { useAppStore, AppItem } from '@/store/app'
import { useToast } from '@/utils/modals/index'

// 定义 props
const props = defineProps<{
  title: string
  apps: AppItem[]
  col: number
  editable: boolean
  homeApps?: AppItem[] // 首页应用
}>()

// 定义 emits
const emit = defineEmits(['add', 'remove'])

// 计算是否可添加
const isAddable = computed(() => (app: AppItem) => {
  return props.editable && !isHomeApp(app.id)
})

// 计算是否可移除
const isRemovable = computed(() => {
  return props.editable && !props.homeApps
})

// 判断应用是否已存在于首页
const isHomeApp = (appId: string) => {
  return props.homeApps && props.homeApps.some((app) => app.id === appId)
}

const handleAppClick = (app: AppItem) => {
  if (!props.editable && app.path) {
    uni.navigateTo({ url: app.path })
  }
}

const handleAddApp = (app: AppItem) => {
  emit('add', app)
}

const handleRemoveApp = (app: AppItem) => {
  emit('remove', app)
}
</script>

<style lang="scss" scoped>
.app-grid {
  .grid-title {
    margin-bottom: 10px;
    font-size: 16px;
    font-weight: bold;
  }

  .grid-item {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}
</style>
