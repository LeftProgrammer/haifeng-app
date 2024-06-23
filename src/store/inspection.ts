import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface Person {
  userId?: string
  userName?: string
  avatar?: string
  departmentId?: string
  departmentName?: string
  onboarded?: boolean
  offboarded?: boolean
  reason?: string
  reasonType?: string
}

export interface ShipData {
  shipId: string
  shipName: string
  departmentId?: string
  departmentName?: string
  inspector?: string
  users: Person[]
}

export const useInspectionStore = defineStore(
  'inspection',
  () => {
    const allShipData = ref<Record<string, ShipData>>({})

    // 获取指定船只的核检数据
    const getShipData = (shipId: string): ShipData | undefined => {
      return allShipData.value[shipId]
    }

    // 添加人员到指定船只
    const addPerson = (shipId: string, person: Person): void => {
      if (!allShipData.value[shipId]) {
        allShipData.value[shipId] = {
          shipId,
          shipName: '', // 根据实际情况设置船名
          departmentId: '',
          departmentName: '',
          inspector: '', // 根据实际情况设置核检员
          users: [],
        }
      }
      allShipData.value[shipId].users.push(person)
    }

    // 从指定船只中移除人员
    const removePerson = (shipId: string, personId: string): void => {
      const shipData = allShipData.value[shipId]
      if (shipData) {
        shipData.users = shipData.users.filter((p) => p.userId !== personId)
      }
    }

    // 清除指定船只的核检数据
    const clearShipData = (shipId: string): void => {
      console.log('clearShipData', shipId, allShipData.value)
      delete allShipData.value[shipId]
      console.log('clearShipData', allShipData.value)
    }

    // 清除所有船只的核检数据
    const clearAllShipData = (): void => {
      allShipData.value = {}
    }

    return {
      allShipData,
      getShipData,
      addPerson,
      removePerson,
      clearShipData,
      clearAllShipData,
    }
  },
  {
    persist: true, // 使用 pinia-plugin-persistedstate 持久化存储
  },
)
