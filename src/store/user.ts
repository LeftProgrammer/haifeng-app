import { defineStore } from 'pinia'
import { ref } from 'vue'

const initState = {
  id: '',
  avatar: '',
  username: '',
  name: '',
  departmentId: '',
  department: '',
  code: '',
}

export const useUserStore = defineStore(
  'user',
  () => {
    const userInfo = ref<IUserInfo>({ ...initState })
    const token = ref('')

    const setToken = (val) => {
      token.value = val
    }
    const clearToken = () => {
      token.value = ''
    }
    const setUserInfo = (val: IUserInfo) => {
      userInfo.value = val
    }
    const clearUserInfo = () => {
      userInfo.value = { ...initState }
    }
    // 一般没有reset需求，不需要的可以删除
    const reset = () => {
      userInfo.value = { ...initState }
    }
    const isLogined = computed(() => !!token.value)

    return {
      token,
      setToken,
      clearToken,
      userInfo,
      setUserInfo,
      clearUserInfo,
      isLogined,
      reset,
    }
  },
  {
    persist: true,
  },
)
