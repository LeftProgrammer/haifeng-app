<route lang="json5">
{
  style: {
    navigationBarTitleText: '施工',
  },
}
</route>

<template>
  <view class="page h-full px-2 bg-#F5F5F5" :style="{ paddingTop: safeAreaInsets?.top + 'px' }">
    <view class="min-h-full py-2.5 bg-#F5F5F5">
      <uv-collapse accordion class="p-2 bg-#FFF rounded-1">
        <template v-for="(value, key, index1) in list" :key="index1">
          <uv-collapse-item :title="key">
            <view
              class="item"
              v-for="(item, index2) in value"
              :key="index2"
              @click="handleClick(item)"
            >
              <view class="item-header">
                <image class="img" src="../../static/shelterWind/list-icon.png"></image>
                <view class="title">{{ item.name }}</view>
              </view>
              <view class="item-content">
                <view class="content-left">
                  <view class="line"></view>
                </view>
                <view class="content-right">
                  <view class="right-content">
                    <view class="content">
                      <view class="content-desc">
                        <view class="text">已施工</view>
                        <view class="sign">{{ item.percentage }}%</view>
                      </view>
                      <uv-line-progress
                        class="progress"
                        :percentage="item.percentage"
                        activeColor="#3254FF"
                        height="16rpx"
                      ></uv-line-progress>
                    </view>
                    <uv-button class="btn" type="primary" text="查看"></uv-button>
                  </view>
                </view>
              </view>
            </view>
          </uv-collapse-item>
        </template>
      </uv-collapse>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { constructionList } from '@/service/construction/index'
import { listRes } from './mock'
// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = uni.getSystemInfoSync()

const list = ref([])
const urlType = ref('')

onLoad((options) => {
  console.log('options', options)
  const { type } = options
  if (type === 'windTurbine') {
    urlType.value = 'B06A01A01'
  } else if (type === 'submarineCable') {
    urlType.value = 'B06A01A02'
  }
})

onShow(async () => {
  const { code, message, result } = await constructionList({ type: urlType.value })
  list.value = result
  console.log('list.value', list.value)
})

const handleClick = (item) => {
  uni.navigateTo({
    url: `/pages/construction/list?pbsId=${item.id}`,
  })
}
</script>

<style lang="scss" scoped>
.page {
  :deep(.uv-line) {
    border: none;
  }
}
.item {
  display: flex;
  flex-direction: column;
}
.item-header {
  display: flex;
  align-items: center;
  .img {
    width: 24rpx;
    height: 24rpx;
    margin-right: 20rpx;
  }
  .title {
    font-size: 32rpx;
    line-height: 44rpx;
    color: #1d2129;
  }
}
.item-content {
  display: flex;
  flex: 1;
  .content-left {
    display: flex;
    justify-content: center;
    width: 24rpx;
    height: 100%;
    margin-right: 20rpx;
    .line {
      width: 4rpx;
      height: 100%;
      background: #e5e6eb;
    }
  }
  .content-right {
    flex: 1;
    margin: 32rpx 0;
    border-bottom: 1rpx solid #e5e6eb;
    .right-content {
      display: flex;
      justify-content: space-between;
      margin-bottom: 32rpx;
    }
    .content {
      flex: 1;
    }
    .content-desc {
      display: flex;
      align-items: center;
      margin-bottom: 10rpx;
      font-size: 28rpx;
      .text {
        margin-right: 14rpx;
        line-height: 44rpx;

        color: #4e5969;
      }
      .sign {
        color: #3254ff;
      }
    }
    .btn {
      width: 112rpx;
      height: 48rpx;
      margin-left: 90rpx;
    }
  }
}
</style>
