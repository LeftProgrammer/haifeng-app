<route lang="json5">
{
  style: {
    navigationBarTitleText: '工序列表',
  },
}
</route>

<template>
  <view class="page">
    <uni-table :border="false" :stripe="false" style="max-width: 100%">
      <!-- 表头 -->
      <uni-tr>
        <uni-th align="center" width="120rpx">序号</uni-th>
        <uni-th align="center">工序名称</uni-th>
        <uni-th align="center" width="200rpx">状态</uni-th>
      </uni-tr>

      <!-- 表格内容 -->
      <uni-tr v-for="(item, index) in tableData" :key="index" @click="handleClick(item)">
        <uni-td align="center">{{ index }}</uni-td>
        <uni-td align="left">{{ item.processName }}</uni-td>
        <uni-td align="center">
          <view v-if="item.id" class="c-#00B42A">已完成</view>
          <view v-else>未开始</view>
        </uni-td>
      </uni-tr>
    </uni-table>
  </view>
</template>
<script lang="ts" setup>
import { constructionQueryList } from '@/service/construction/index'
import { processList } from './mock'
const tableData = ref([])
const params = ref({})

onLoad((options) => {
  console.log('options', options)
  params.value = options
})
onShow(async () => {
  const { code, message, result } = await constructionQueryList({ pbsId: params.value.pbsId })
  tableData.value = result
  console.log('tableData', tableData.value)
})

const handleClick = (item) => {
  uni.navigateTo({
    url: `/pages/construction/detail?item=${encodeURIComponent(JSON.stringify(item))}`,
  })
}
</script>
<style lang="scss">
.uni-table {
  width: 100%; /* 表格宽度不超过父级元素 */
  border: none;
  .uni-table-tr:nth-child(2n) {
    background-color: #f1f3ff;
  }

  // .uni-table-td {
  //   color: #3254ff;
  // }

  .uni-table-th {
    color: #ffffff;
    background-color: #007aff;
  }
  /* 描述列内容换行 */
  .uni-table-td:nth-child(2) {
    color: #3254ff;
    word-break: break-all;
    word-wrap: break-word;
    white-space: normal;
  }
}
</style>
