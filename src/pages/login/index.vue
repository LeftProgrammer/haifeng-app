<route lang="json5">
{
  style: {
    navigationStyle: 'custom',
  },
}
</route>
<template>
  <view class="bg-white h-full overflow-hidden page">
    <view class="banner"></view>
    <view class="main">
      <view class="header">用户登录</view>
      <uv-form ref="form" :model="form" :rules="rules" labelPosition="top">
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
import { postFooAPI } from '@/service/home/login'

export default {
  data() {
    return {
      appName,
      enterpriseInfo,
      version,
      form: {
        username: '',
        password: '',
      },
      rememberMe: [],
      rules: {
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
          // { min: 8, max: 16, message: '密码由数字、字母和特殊符号组成，长度8-16位', trigger: ['blur', 'change'] },
          // { pattern: /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[~!@#$%^&*])[\da-zA-Z~!@#$%^&*]{8,16}$/ , message: '密码由数字、字母和特殊符号组成，长度8-16位', trigger: ['blur', 'change']}
        ],
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
    async handleLogin() {
      console.log('handleLogin', this.form)
      const params = {}
      params.username = this.form.username
      params.password = this.form.password

      const { loading, error, data, run } = useRequest(() => getFooAPI(params))
      // console

      // await this.$store.user.login(params)
      // await this.$toast('登录成功', { type: 'success' })
      this.handleSuccess()
    },
    async handleSuccess() {
      if (this.rememberMe.length > 0) {
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

<style lang="scss" scoped>
.page {
  position: relative;
  background: #f8fcfd;
}
.banner {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  height: 318px;
  background-image: url('@/static/home/banner.png');
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
