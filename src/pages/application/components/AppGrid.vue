<template>
  <view class="app-grid">
    <view v-if="title" class="grid-title">{{ title }}</view>
    <uv-grid :col="col" :border="false" :square="false">
      <uv-grid-item v-for="(app, index) in apps" :key="index" @click="handleAppClick(app)">
        <view class="grid-item">
          <view class="icon-wrap relative">
            <uv-icon class="item-image" :name="app.icon" color="#3254FF" size="40" />
            <view
              v-if="editable && removable && isRemovable(app)"
              class="delete-btn absolute top-0 right-0"
              @click.stop="handleRemoveApp(app)"
            >
              <uv-icon name="minus-circle" color="#F56C6C" size="18" />
            </view>
            <view
              v-if="editable && !removable && isAddable(app)"
              class="add-btn absolute top-0 right-0"
              @click.stop="handleAddApp(app)"
            >
              <uv-icon name="plus-circle" color="#67C23A" size="18" />
            </view>
          </view>
          <text class="app-name text-xs text-gray-600 mt-2">{{ app.name }}</text>
        </view>
      </uv-grid-item>
    </uv-grid>
  </view>
</template>

<script lang="ts" setup>
import { defineProps, computed, useAttrs } from 'vue'
import { useAppStore, AppItem } from '@/store/app'
import { useToast } from '@/utils/modals/index'

// 定义 props
const props = defineProps<{
  title: string
  apps: AppItem[]
  col: number
  editable: boolean
  removable?: boolean // 是否可移除
}>()

// 定义 emits
const emit = defineEmits(['add', 'remove'])

// 计算是否可添加
const isAddable = computed(() => (app: AppItem) => {
  if (props.removable) return false
  return !isHomeApp(app.id)
})

// 计算是否可移除
const isRemovable = computed(() => (app: AppItem) => {
  if (!props.removable) return false
  return isHomeApp(app.id)
})

const attrs = useAttrs()
const appStore = useAppStore()
const editingHomeApps = computed(() => appStore.editingHomeApps)

// 判断应用是否已存在于首页
const isHomeApp = (appId: string) => {
  return editingHomeApps.value.some((app) => app.id === appId)
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

    .icon-wrap {
      width: 48px;
      height: 48px;
    }

    .app-icon {
      width: 100%;
      height: 100%;
    }

    .add-btn,
    .delete-btn {
      top: 5px;
      right: 5px;
    }
  }
}
</style>
