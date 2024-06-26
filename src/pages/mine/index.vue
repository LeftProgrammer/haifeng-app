<route lang="json5">
{
  style: {
    navigationBarTitleText: '我的',
  },
}
</route>

<template>
  <view class="charts-box">
    <qiun-data-charts type="column" :opts="opts" :chartData="chartData" />
  </view>
</template>

<script>
export default {
  data() {
    return {
      chartData: {},
      opts: {
        xAxis: {
          disableGrid: true,
        },
        yAxis: {
          data: [
            {
              min: 0,
            },
          ],
        },
        extra: {
          column: {
            type: 'group',
          },
        },
      },
    }
  },
  onReady() {
    this.getServerData()
  },
  methods: {
    getServerData() {
      setTimeout(() => {
        // 模拟服务器返回数据，如果数据格式和标准格式不同，需自行按下面的格式拼接
        const res = {
          categories: ['2016', '2017', '2018', '2019', '2020', '2021'],
          series: [
            {
              name: '目标值',
              data: [35, 36, 31, 33, 13, 34],
            },
            {
              name: '完成量',
              data: [18, 27, 21, 24, 6, 28],
            },
          ],
        }
        this.chartData = JSON.parse(JSON.stringify(res))
      }, 500)
    },
  },
}
</script>

<style scoped>
/* 请根据实际需求修改父元素尺寸，组件自动识别宽高 */
.charts-box {
  width: 100%;
  height: 300px;
}
</style>
