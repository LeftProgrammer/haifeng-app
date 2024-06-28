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
  allApps: ModuleItem[]
  homeApps: AppItem[]
  editingHomeApps: AppItem[]
}

export const useAppStore = defineStore(
  'app',
  () => {
    const allApps = ref<ModuleItem[]>([])
    const homeApps = ref<AppItem[]>([])

    const setAllApps = (newAllApps: ModuleItem[]) => {
      allApps.value = newAllApps
    }
    const clearAllApps = () => {
      allApps.value = []
    }

    const addHomeApp = (app: AppItem) => {
      homeApps.value.push(app)
    }

    const removeHomeApp = (id: string | number) => {
      const index = homeApps.value.findIndex((app) => app.id === id)
      if (index !== -1) {
        homeApps.value.splice(index, 1)
      }
    }

    const updateHomeApps = (newHomeApps: AppItem[]) => {
      homeApps.value = newHomeApps
    }

    const clearHomeApps = () => {
      homeApps.value = []
    }

    return {
      allApps,
      homeApps,
      setAllApps,
      clearAllApps,
      addHomeApp,
      removeHomeApp,
      updateHomeApps,
      clearHomeApps,
    }
  },
  {
    persist: true,
  },
)
