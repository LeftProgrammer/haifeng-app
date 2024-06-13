<route lang="json5">
{
  style: {
    navigationStyle: 'custom',
  },
}
</route>
<template>
  <view class="bg-white h-full overflow-hidden">
    <!-- <view class="mt-8">
      <image src="/static/logo.png" alt="" class="w-20 h-20 block mx-auto" />
      <view class="text-2xl text-center mt-4 font-bold">
        {{ appName }}
      </view>
    </view> -->
    <view class="banner"></view>
    <view class="main" style="width: 100%">
      <view>用户登录</view>
      <uv-form ref="form" :model="form" :rules="rules" labelPosition="top">
        <uv-form-item>
          <template v-slot:label>
            <view class="flex flex-justify-startflex-items-center">
              <uv-icon name="account" color="#2979ff"></uv-icon>
              <view>账号</view>
            </view>
          </template>
          <uv-input v-model="form.username" placeholder="请输入账号" border="bottom" />
        </uv-form-item>
        <uv-form-item>
          <template v-slot:label>
            <view class="flex flex-justify-start flex-items-center">
              <uv-icon name="lock" color="#2979ff"></uv-icon>
              <view>密码</view>
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
          <uv-checkbox v-model="form.rememberMe">记住密码</uv-checkbox>
        </uv-form-item>
        <uv-button
          type="primary"
          text="登录"
          customStyle="margin-top: 10px"
          @click="handleSubmit"
        ></uv-button>
      </uv-form>
    </view>

    <view class="absolute inset-x-0 bottom-0 text-center mb-4 text-gray-400 text-sm">
      <view>
        Supported by
        <text class="text-primary-500 underline active:text-primary-700" @click="handleInfo">
          {{ enterpriseInfo.name }}
        </text>
        v{{ version }}
      </view>
    </view>
  </view>
</template>

<script>
import { version } from '../../../package.json'
import { appName, enterpriseInfo } from '@/configs/index'
import coderJSON from '@/utils/coderJSON'

export default {
  data() {
    return {
      appName,
      enterpriseInfo,
      version,
      form: {
        username: '',
        password: '',
        rememberMe: false,
      },
    }
  },
  onShow() {},
  methods: {
    handleInfo() {
      this.$Router.push({
        path: '/webview',
        query: {
          title: 'viarotel',
          src: 'https://viarotel.eu.org/',
        },
      })
    },
    handleAgree() {
      this.$Router.push({ path: '/pages/statement/index' })
    },
    async handleLogin() {
      const params = {}
      params.username = this.form.username
      params.password = this.form.password

      await this.$store.user.login(params)
      await this.$toast('登录成功', { type: 'success' })
      this.handleSuccess()
    },
    async handleSuccess() {
      if (this.form.rememberMe) {
        // 如果用户选择了记住密码，你可以在这里将账号和密码保存到本地存储
        uni.setStorageSync('username', this.form.username)
        uni.setStorageSync('password', this.form.password)
      }
      // const user = this.$store.user
      // try {
      //   await user.getUserInfo()
      //   if (this.$Route.query.redirect) {
      //     const redirect = coderJSON.parse(this.$Route.query.redirect)
      //     // console.log('redirect', redirect)
      //     this.$Router.replaceAll(redirect)
      //   } else {
      //     this.$Router.replaceAll('/')
      //   }
      // } catch (error) {
      //   console.warn('error', error)
      // }
    },
  },
}
</script>

<style></style>
