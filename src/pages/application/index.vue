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
        <text v-if="isEdit" class="text-3.5 c-#3254FF" @click="handleCancelEdit">取消</text>
        <uv-icon v-else name="arrow-left" size="19" @click="handleGoBack"></uv-icon>
      </view>
    </template>
    <template v-slot:right>
      <uv-button
        type="primary"
        :text="isEdit ? '保存' : '编辑'"
        @click="handleEdit"
        size="small"
      ></uv-button>
    </template>
  </uv-navbar>
  <view class="app-manager bg-#F5F5F5 overflow-hidden pt-2 px-4">
    <view class="home-apps">
      <AppGrid
        title="首页应用"
        :apps="originalHomeApps"
        :editable="isEdit"
        @remove="removeHomeApp"
        :col="5"
      />
    </view>

    <view class="module-apps mt-8">
      <view v-for="module in allApps" :key="module.id" class="module-item mb-4">
        <AppGrid
          :title="module.name"
          :homeApps="originalHomeApps"
          :apps="module.apps"
          :editable="isEdit"
          @add="addHomeApp"
          :col="5"
        />
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { useAppStore, AppItem, ModuleItem } from '@/store/app'
import { useToast, useDialog } from '@/utils/modals/index'
import AppGrid from './components/AppGrid.vue'

const appStore = useAppStore()

// 是否处于编辑状态
const isEdit = ref(false)

// 首页应用列表
const homeApps = computed(() => appStore.homeApps)
const allApps = computed(() => appStore.allApps)
const originalHomeApps = ref<AppItem[]>([])

// 所有模块和应用数据
const menus = [
  {
    id: '1',
    name: '登船检核',
    apps: [
      { id: '101', name: '登船检验', icon: 'grid', path: '/pages/inspection/index?type=boarding' },
      {
        id: '102',
        name: '下船检核',
        icon: 'grid-fill',
        path: '/pages/inspection/index?type=disembarking',
      },
    ],
  },
  {
    id: '2',
    name: '施工管理',
    apps: [
      {
        id: '201',
        name: '风机施工',
        icon: 'home',
        path: '/pages/construction/index?type=windTurbine',
      },
      {
        id: '202',
        name: '海缆施工',
        icon: 'home',
        path: '/pages/construction/index?type=windTurbine',
      },
      { id: '203', name: '观豚日志', icon: 'home', path: '/pages/dolphinWatch/index' },
    ],
  },
  {
    id: '3',
    name: '安全管理',
    apps: [
      {
        id: '301',
        name: '视频监控',
        icon: 'home',
        path: '',
      },
      {
        id: '302',
        name: '气象评估',
        icon: 'home',
        path: '',
      },
      { id: '303', name: '避风通知', icon: 'home', path: '/pages/windShelter/notice/index' },
      { id: '304', name: '避风计划', icon: 'home', path: '' },
      { id: '305', name: '避风监控', icon: 'home', path: '' },
      { id: '306', name: '避风报备', icon: 'home', path: '/pages/windShelter/report/index' },
    ],
  },
  {
    id: '4',
    name: '综合查询',
    apps: [
      {
        id: '401',
        name: '出航统计',
        icon: 'home',
        path: '',
      },
      {
        id: '402',
        name: '施工进度',
        icon: 'home',
        path: '',
      },
      { id: '403', name: '运输进度', icon: 'home', path: '' },
      { id: '404', name: '观豚分析', icon: 'home', path: '' },
      { id: '405', name: '通讯录', icon: 'home', path: '' },
    ],
  },
  {
    id: '5',
    name: '气象管理',
    apps: [
      {
        id: '501',
        name: '气象预警',
        icon: 'home',
        path: '/pages/weather/weatherWarn',
      },
    ],
  },
]

onLoad(() => {
  // TODO 有网则请求并更新缓存，无网则走缓存
  if (allApps.value.length === 0) {
    appStore.setAllApps(menus)
  }
  originalHomeApps.value = [...homeApps.value]
})

// 返回上一页
const handleGoBack = () => {
  uni.navigateBack()
}

// 处理编辑按钮点击事件
const handleEdit = () => {
  if (!isEdit.value) {
    // 进入编辑模式，更新副本
    originalHomeApps.value = [...homeApps.value]
    console.log('originalHomeApps.value', originalHomeApps.value)
  } else {
    // 保存修改到缓存
    appStore.updateHomeApps([...originalHomeApps.value])
    useToast('保存成功')
    handleGoBack()
  }
  isEdit.value = !isEdit.value
}

// 处理取消编辑按钮点击事件
const handleCancelEdit = async () => {
  originalHomeApps.value = [...homeApps.value]
  isEdit.value = false
}

// 添加应用到首页
const addHomeApp = (app: AppItem) => {
  if (originalHomeApps.value.length >= 10) {
    useToast('首页应用最多添加 10 个')
    return
  }
  originalHomeApps.value.push(app)
}

// 从首页移除应用
const removeHomeApp = (app: AppItem) => {
  const index = originalHomeApps.value.findIndex((item) => item.id === app.id)
  if (index > -1) {
    originalHomeApps.value.splice(index, 1)
  }
}
</script>
