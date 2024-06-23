<route lang="json5">
{
  style: {
    navigationStyle: 'custom',
  },
}
</route>

<template>
  <uv-navbar leftText="返回" :fixed="false" title="应用管理" :safeAreaInsetTop="false">
    <template v-slot:left>
      <view class="uv-nav-slot">
        <text v-if="isEdit" class="cancel-btn" @click="handleCancelEdit">取消</text>
        <uv-icon v-else name="arrow-left" size="19" @click="handleGoBack"></uv-icon>
      </view>
    </template>
    <template v-slot:right>
      <text class="edit-btn" @click="handleEdit">
        {{ isEdit ? '保存' : '编辑' }}
      </text>
    </template>
  </uv-navbar>
  <view class="app-manager bg-white overflow-hidden pt-2 px-4">
    <view class="home-apps">
      <AppGrid
        title="首页应用"
        :apps="editingHomeApps"
        :editable="isEdit"
        removable
        @remove="removeHomeApp"
        :col="4"
      />
    </view>

    <view class="module-apps mt-8">
      <view v-for="module in modules" :key="module.id" class="module-item mb-4">
        <AppGrid
          :title="module.name"
          :apps="module.apps"
          :editable="isEdit"
          @add="addHomeApp"
          :col="4"
        />
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { useAppStore, AppItem, ModuleItem } from '@/store/app'
import { useToast } from '@/utils/modals/index'
import AppGrid from './components/AppGrid.vue'

const appStore = useAppStore()

// 是否处于编辑状态
const isEdit = ref(false)

// 首页应用列表
const homeApps = computed(() => appStore.homeApps)
const editingHomeApps = computed(() => appStore.editingHomeApps)

// 所有模块和应用数据
const modules = ref<ModuleItem[]>([
  {
    id: '1',
    name: '模块一',
    apps: [
      { id: '101', name: '应用 A', icon: 'home', path: '/pages/app-a/index' },
      { id: '102', name: '应用 B', icon: 'home', path: '/pages/app-b/index' },
      { id: '103', name: '应用 C', icon: 'home', path: '/pages/app-b/index' },
      { id: '104', name: '应用 D', icon: 'home', path: '/pages/app-b/index' },
      { id: '105', name: '应用 E', icon: 'home', path: '/pages/app-b/index' },
    ],
  },
])

// 返回上一页
const handleGoBack = () => {
  uni.navigateBack()
}

// 处理编辑按钮点击事件
const handleEdit = () => {
  isEdit.value = !isEdit.value
}

// 处理取消编辑按钮点击事件
const handleCancelEdit = () => {
  isEdit.value = false
}

// 添加应用到首页
const addHomeApp = (app: AppItem) => {
  if (editingHomeApps.value.length >= 8) {
    useToast('首页应用最多添加 8 个')
    return
  }
  appStore.addHomeApp(app)
}

// 从首页移除应用
const removeHomeApp = (app: AppItem) => {
  appStore.removeHomeApp(app.id)
}

// 监听 isEdit 变化，保存时更新缓存
watch(isEdit, (newVal) => {
  if (!newVal) {
    // 当 isEdit 变为 false 时，即退出编辑模式，保存到缓存
    appStore.updateHomeApps([...editingHomeApps.value])
  }
})

onMounted(() => {
  appStore.updateEditingHomeApps([...homeApps.value])
})
</script>
