<route lang="json5">
{
  style: {
    navigationBarTitleText: '避风报备',
  },
}
</route>

<template>
  <view class="bg-#f5f5f5 h-100% position-relative">
    <view class="content">
      <view class="bg-white px-4 mb-2.5 pt-2.5">
        <BlockHeader title="基础信息" bgColor="white" barColor="#007aff"></BlockHeader>
        <uv-form labelPosition="left" :model="model" :rules="rules" ref="form" labelWidth="100">
          <uv-form-item label="避风通知" prop="name" :required="true" borderBottom>
            <uv-input v-model="model.name" border="none" readonly inputAlign="right"></uv-input>
          </uv-form-item>
          <uv-form-item label="截止上报时间" prop="deadline" :required="true" borderBottom>
            <uv-input v-model="model.deadline" border="none" readonly inputAlign="right"></uv-input>
          </uv-form-item>
          <uv-form-item
            label="联系人"
            prop="name"
            :required="true"
            borderBottom
            @click="showPicker(1)"
          >
            <uv-input
              v-model="model.contactInfoName"
              disabled
              inputAlign="right"
              disabledColor="#ffffff"
              placeholder="请选择联系人"
              border="none"
            ></uv-input>
            <template v-slot:right>
              <uv-icon name="arrow-right"></uv-icon>
            </template>
          </uv-form-item>
          <uv-form-item label="填报人" prop="userInfo.reporter" borderBottom>
            <uv-input v-model="model.reporter" inputAlign="right" border="none" readonly></uv-input>
          </uv-form-item>
          <uv-form-item label="施工单位" prop="userInfo.unitName" borderBottom>
            <uv-input v-model="model.unitName" border="none" readonly inputAlign="right"></uv-input>
          </uv-form-item>
          <uv-form-item label="备注" prop="userInfo.remark">
            <uv-input
              v-model="model.remark"
              border="none"
              placeholder="请输入备注信息"
              inputAlign="right"
            ></uv-input>
          </uv-form-item>
        </uv-form>
      </view>
      <view class="bg-white px-4">
        <BlockHeader title="参与避风船舶" bgColor="white" barColor="#007aff"></BlockHeader>
        <uv-list>
          <uv-list-item :border="true" class="h-14" v-for="item in shipList" :key="item">
            <view class="flex flex-justify-between flex-items-center">
              <view class="color-#4E5969">
                <text class="mr-4">{{ item.name }}</text>
                <text>{{ item.mmsi }}</text>
              </view>
              <uv-button
                :type="item.state == 1 ? 'success' : 'primary'"
                class="w-14 h-8"
                :text="item.state == 1 ? '已报备' : '未报备'"
                @click="showReport(item)"
              ></uv-button>
            </view>
          </uv-list-item>
        </uv-list>
      </view>
    </view>
    <view class="px-14.25 py-3 bg-white position-absolute bottom-0 left-0 right-0">
      <uv-button type="primary" @click="submit" text="保存数据"></uv-button>
    </view>
    <!-- 选择器 -->
    <uv-picker
      ref="picker"
      keyName="name"
      :columns="selectType == 1 ? personList : portList"
      @confirm="pickerConfirm"
    ></uv-picker>
    <!-- 弹出层 -->
    <uv-modal
      ref="modal"
      :title="title"
      @confirm="confirm"
      zIndex="996"
      negativeTop="550rpx"
      :showCancelButton="true"
    >
      <view class="slot-content">
        <uv-form
          labelPosition="left"
          :model="shipItem"
          :rules="rules1"
          ref="form1"
          labelWidth="130"
        >
          <uv-form-item label="船上紧急联系电话" :required="true" prop="shipContact" borderBottom>
            <uv-input
              v-model="shipItem.shipContact"
              type="number"
              placeholder="请填写船上紧急联系电话"
              inputAlign="right"
              border="none"
            ></uv-input>
          </uv-form-item>
          <uv-form-item label="在船人数" prop="personTotal" borderBottom :required="true">
            <uv-input
              inputAlign="right"
              v-model="shipItem.personTotal"
              placeholder="请填写在船人数"
              type="number"
              border="none"
            ></uv-input>
          </uv-form-item>
          <uv-form-item
            label="避风港"
            prop="fenceName"
            borderBottom
            :required="true"
            @click="showPicker(2)"
          >
            <uv-input
              v-model="shipItem.fenceName"
              inputAlign="right"
              disabled
              disabledColor="#ffffff"
              placeholder="请选择避风港"
              border="none"
            ></uv-input>
            <template v-slot:right>
              <uv-icon name="arrow-right"></uv-icon>
            </template>
          </uv-form-item>
        </uv-form>
      </view>
    </uv-modal>
  </view>
</template>

<script setup>
import BlockHeader from '@/components/BlockHeader/index.vue'
import { onLoad } from '@dcloudio/uni-app'
import {
  getDetail,
  getPerson,
  getPort,
  getUser,
  getShip,
  add,
  edit,
} from '@/service/windShelter/report/detail.js'
const model = ref({})
const rules = ref({
  title: {
    type: 'string',
    required: true,
    message: '请填写避风通知',
    trigger: ['blur', 'change'],
  },
  date: {
    type: 'string',
    required: true,
    message: '请填写截止上报时间',
    trigger: ['blur', 'change'],
  },

  name: {
    type: 'string',
    required: true,
    message: '请填写联系人',
    trigger: ['blur', 'change'],
  },
})
const rules1 = ref({
  shipContact: [
    {
      type: 'number',
      required: true,
      message: '请填写紧急联系电话',
      trigger: ['blur', 'change'],
    },
    {
      validator: (rule, value, callback) => {
        const regex = /^1[3-9]\d{9}$/
        return regex.test(value)
      },
      message: '电话号码格式错误',
      trigger: ['blur'],
    },
  ],
  personTotal: {
    type: 'number',
    required: true,
    message: '请填写在船人数',
    trigger: ['blur', 'change'],
  },
  fenceName: {
    type: 'string',
    required: true,
    message: '请选择避风港',
    trigger: ['blur', 'change'],
  },
})
const personList = ref([])
const portList = ref([])
const shipList = ref([])
const title = ref('')
const picker = ref('')
const shipItem = ref({})
const form = ref(null)
const form1 = ref(null)
const modal = ref(null)
const modalType = ref('')
/**
 * @description 获取路由传参
 */
onLoad((e) => {
  const { id, name, type, deadline } = e
  modalType.value = type
  model.value.name = name
  model.value.deadline = deadline
  model.value.notifyId = id
  getShipList()
  getPersonList()
  getPortList()
  getUserInfo()
  if (type === '2') {
    getDetail({ notifyId: id }).then((res) => {
      Object.assign(model.value, res.result)
      model.value.contactInfoName = personList.value[0].find(
        (x) => x.id === model.value.contactInfo,
      ).name
      if (res.result.details.length > 0) {
        const ids = model.value.details.map((y) => y.shipId)
        shipList.value = shipList.value.map((x) => {
          const index = ids.indexOf(x.shipDataId)
          if (index > -1) {
            const { fenceId, personTotal, shipContact } = model.value.details[index]
            return {
              ...x,
              state: '1',
              fenceId,
              personTotal,
              shipContact,
              dataId: model.value.details[index].id,
            }
          } else {
            return x
          }
        })
      }
    })
  }
})
/**
 * @description 获取联系人list
 */
const getPersonList = () => {
  getPerson().then((res) => {
    personList.value = [res.result.records]
  })
}
/**
 * @description 获取港口list
 */
const getPortList = () => {
  getPort().then((res) => {
    portList.value = [res.result.records]
  })
}
/**
 * @description 获取用户信息
 */
const getUserInfo = () => {
  getUser().then((res) => {
    model.value.reporter = res.result.name
    model.value.unitName = res.result.department
  })
}
/**
 * @description 获取船舶
 */
const getShipList = () => {
  getShip().then((res) => {
    shipList.value = res.result
  })
}
/**
 * @description 显示报备
 */
const showReport = (row) => {
  // if (row.state === '1') return
  title.value = `${row.name}  ${row.mmsi}`
  shipItem.value = row

  if (row.fenceId) {
    const fenceName = portList.value[0].find((x) => x.id === row.fenceId).name
    shipItem.value.fenceName = fenceName
  }
  modal.value.open()
}
/**
 * @description 报备确定
 */
const confirm = () => {
  form1.value
    .validate()
    .then((res) => {
      console.log('🚀 ~ .then ~ res:', res)
      shipItem.value.state = '1'
      const index = shipList.value.findIndex((x) => x.mmsi === shipItem.value.mmsi)
      shipList.value.splice(index, 1, shipItem.value)
      modal.value.close()
    })
    .catch((errors) => {})
}
/**
 * @description 提交数据
 */
const submit = () => {
  form.value
    .validate()
    .then((res) => {
      const data = {
        ...model.value,
        details: shipList.value
          .filter((x) => x.state === '1')
          .map((x) => {
            return {
              shipId: x.shipDataId,
              mmsi: x.mmsi,
              shipContact: x.shipContact,
              fenceId: x.fenceId,
              personTotal: x.personTotal,
              shipName: x.name,
              id: x.dataId,
            }
          }),
      }
      const http = modalType.value === '1' ? add(data) : edit(data)
      http.then((res) => {
        uni.navigateBack()
      })
    })
    .catch((errors) => {})
}
const selectType = ref('')
/**
 * @description 显示选择框
 * @param {Number} type 类型1：联系人 2：避风港
 */
const showPicker = (type) => {
  selectType.value = type
  picker.value.open()
}
/**
 * @description 选择器确认
 * @param {Object} e 事件对象
 */
const pickerConfirm = (e) => {
  if (selectType.value === 1) {
    model.value.contactInfo = e.value[0].id
    model.value.contactInfoName = e.value[0].name
  } else {
    shipItem.value.fenceName = e.value[0].name
    shipItem.value.fenceId = e.value[0].id
  }
}
</script>

<style lang="scss" scoped>
.content {
  height: calc(100% - 64px);
  overflow: auto;
}
.uv-list {
  .uv-list-item {
    &:first-child {
      .uv-list--border {
        display: none;
      }
    }
  }
}
</style>
