<route lang="json5">
{
  style: {
    navigationStyle: 'custom',
  },
}
</route>
<template>
  <view class="page h-full bg-f8fcfd overflow-hidden">
    <view class="banner"></view>
    <view class="main">
      <view class="header">用户登录</view>
      <uv-form ref="formRef" :model="form" :rules="rules" labelPosition="top">
        <uv-form-item prop="username">
          <template v-slot:label>
            <view class="flex flex-justify-start flex-items-center">
              <uv-icon name="account" size="24" color="#2979ff" class="mr-1"></uv-icon>
              <view class="label">账号</view>
            </view>
          </template>
          <uv-input v-model="form.username" placeholder="请输入账号" border="bottom" />
        </uv-form-item>
        <uv-form-item prop="password">
          <template v-slot:label>
            <view class="flex flex-justify-start flex-items-center">
              <uv-icon name="lock" size="24" color="#2979ff" class="mr-1"></uv-icon>
              <view class="label">密码</view>
            </view>
          </template>
          <uv-input
            v-model="form.password"
            type="password"
            placeholder="请输入密码"
            border="bottom"
          />
        </uv-form-item>
        <uv-form-item>
          <uv-checkbox-group v-model="rememberMe">
            <uv-checkbox :label="true" name="记住密码">记住密码</uv-checkbox>
          </uv-checkbox-group>
        </uv-form-item>
        <uv-button
          type="primary"
          text="登录"
          customStyle="margin-top: 10px"
          @click="handleLogin"
        ></uv-button>
      </uv-form>
    </view>

    <view class="absolute inset-x-0 bottom-0 text-center mb-4 text-gray-400 text-sm">
      <view>
        Supported by
        <text class="text-primary-500 active:text-primary-700" @click="handleInfo">
          {{ enterpriseInfo.name }}
        </text>
        v{{ version }}
      </view>
    </view>
  </view>
</template>

<script lang="js" setup>
import { ref } from 'vue'
import { version } from '../../../package.json'
import { appName, enterpriseInfo } from '@/configs/index'
import { login, queryByUsername } from '@/service/home/login'
import { useUserStore } from '@/store'
import { useToast } from '@/utils/modals'
import { getUrlObj } from '@/utils/index'

const formRef = ref(null)
const userStore = useUserStore()

const form = ref({
  username: '',
  password: '',
})
const rememberMe = ref([])
const rules = ref({
  username: [
    { type: 'string', required: true, message: '请输入用户名', trigger: ['blur', 'change'] },
  ],
  password: [
    {
      type: 'string',
      required: true,
      message: '密码由数字、字母和特殊符号组成，长度8-16位',
      trigger: ['blur', 'change'],
    },
  ],
})

const handleInfo = () => {
  console.log('handleInfo')
}

const handleLogin = async () => {
  const valid = await formRef.value.validate()
  if (!valid) {
    return
  }
  console.log('handleLogin', form.value)
  const params = {
    username: form.value.username,
    password: form.value.password,
  }
  const { code, message, result } = await login(params)

  if (code === 200) {
    const loginInfo = result.userInfo || {}
    loginInfo.token = result.token
    userStore.setUserInfo(loginInfo)

    const {
      code: companyCode,
      message: companyMessage,
      result: companyResult,
    } = await queryByUsername({})
    console.log('companyResult', companyResult)

    if (companyCode === 200) {
      loginInfo.name = companyResult.name
      loginInfo.department = companyResult.department
      loginInfo.departmentId = companyResult.departmentId
      loginInfo.code = companyResult.code
      userStore.setUserInfo(loginInfo)
      const isLogined = userStore.isLogined
      console.log('isLogined', isLogined)

      const currentRoute = getCurrentPages().pop().route
      console.error('currentRoute', currentRoute)
      const { query } = getUrlObj(currentRoute)
      const redirectUrl = query.redirect || '/'
      uni.reLaunch({
        url: redirectUrl,
      })
      useToast('登录成功')
      handleSuccess()
    } else {
      useToast('登录失败')
    }
  }
}

const handleSuccess = () => {
  if (rememberMe.value.length > 0) {
    uni.setStorageSync('username', form.value.username)
    uni.setStorageSync('password', form.value.password)
  }
}
</script>

<style lang="scss" scoped>
.page {
  position: relative;
}
.banner {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  height: 318px;
  background-image: url('@/static/login/banner.png');
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100% 100%;
}
.main {
  position: absolute;
  top: 217px;
  right: 28px;
  bottom: 167px;
  left: 28px;
  z-index: 10;
  padding: 30px 28px;
  background: #fff;
  border-radius: 18px 18px 18px 18px;
  box-shadow: 0px 3px 10px 0px rgba(172, 196, 219, 0.3);
}
.header {
  height: 20px;
  margin-bottom: 34px;
  font-size: 18px;
  line-height: 20px;
  color: #1d2129;
  text-align: left;
}
.label {
  font-size: 16px;
}
</style>
