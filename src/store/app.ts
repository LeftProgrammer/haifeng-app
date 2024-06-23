import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface AppItem {
  id: string
  name: string
  icon: string
  path?: string
}

export interface ModuleItem {
  id: string
  name: string
  apps: AppItem[]
}

export interface AppState {
  homeApps: AppItem[]
  editingHomeApps: AppItem[]
}

export const useAppStore = defineStore(
  'app',
  () => {
    const homeApps = ref<AppItem[]>([])
    const editingHomeApps = ref<AppItem[]>([])

    const addHomeApp = (app: AppItem) => {
      editingHomeApps.value.push(app)
    }

    const removeHomeApp = (id: string | number) => {
      const index = homeApps.value.findIndex((app) => app.id === id)
      if (index !== -1) {
        editingHomeApps.value.splice(index, 1)
      }
    }

    const updateEditingHomeApps = (newHomeApps: AppItem[]) => {
      editingHomeApps.value = newHomeApps
    }

    const updateHomeApps = (newHomeApps: AppItem[]) => {
      homeApps.value = newHomeApps
      // pinia-plugin-persistedstate 会自动将修改同步到缓存
    }

    return {
      homeApps,
      editingHomeApps,
      addHomeApp,
      removeHomeApp,
      updateHomeApps,
      updateEditingHomeApps,
    }
  },
  {
    persist: true,
  },
)
