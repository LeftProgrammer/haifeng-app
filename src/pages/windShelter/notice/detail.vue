<route lang="json5">
{
  style: {
    navigationBarTitleText: '新增避风通知',
  },
}
</route>

<template>
  <view class="page bg-#f5f5f5 h-full pa-4 flex flex-col">
    <uv-form :model="formData" ref="form" :rules="rules" label-width="100" class="flex-grow-1">
      <uv-form-item label="通知编号" prop="code" borderBottom required>
        <uv-input v-model="formData.code" border="none" :disabled="isViewMode" />
      </uv-form-item>
      <uv-form-item label="通知名称" prop="name" borderBottom required>
        <uv-input v-model="formData.name" border="none" :disabled="isViewMode" />
      </uv-form-item>
      <uv-form-item
        label="计划避风开始时间"
        prop="planStartDate"
        borderBottom
        @click="handleOpenTime('start')"
        required
      >
        <uv-input v-model="planStartDate" border="none" placeholder="请选择开始时间" readonly />
        <uv-datetime-picker
          ref="planStartDatePicker"
          v-model="formData.planStartDate"
          mode="datetime"
          :disabled="isViewMode"
          :formatter="formatter"
          border="none"
          @confirm="handleConfirmStart"
        />
        <template v-slot:right>
          <uv-icon name="arrow-right"></uv-icon>
        </template>
      </uv-form-item>
      <uv-form-item
        label="计划避风结束时间"
        prop="planEndDate"
        borderBottom
        @click="handleOpenTime('end')"
        required
      >
        <uv-input v-model="planEndDate" border="none" placeholder="请选择结束时间" readonly />
        <uv-datetime-picker
          ref="planEndDatePicker"
          v-model="formData.planEndDate"
          mode="datetime"
          :min-date="formData.planStartDate"
          :disabled="isViewMode"
          border="none"
          @confirm="handleConfirmEnd"
        />

        <template v-slot:right>
          <uv-icon name="arrow-right"></uv-icon>
        </template>
      </uv-form-item>
      <uv-form-item
        label="截止上报时间"
        prop="deadline"
        borderBottom
        @click="handleOpenTime('deadline')"
        required
      >
        <uv-input v-model="deadline" border="none" placeholder="请选择截止上报时间" readonly />
        <uv-datetime-picker
          ref="deadlinePicker"
          v-model="formData.deadline"
          mode="datetime"
          :min-date="formData.planStartDate"
          :disabled="isViewMode"
          border="none"
          @confirm="handleConfirmDeadline"
        />

        <template v-slot:right>
          <uv-icon name="arrow-right"></uv-icon>
        </template>
      </uv-form-item>
      <uv-form-item
        label="联系人"
        prop="contactInfo"
        borderBottom
        @click="handleOpenSelect1"
        required
      >
        <view>{{ contactInfo }}</view>

        <jh-select
          :list="allPerson1"
          ref="aaa"
          reverse
          textField="name"
          valueField="id"
          :show="selectShow1"
          @confirm="confirmSelect1"
          @close="onCloseSelect1"
        ></jh-select>
      </uv-form-item>
      <uv-form-item
        label="通知人员"
        prop="receiverInfo"
        borderBottom
        required
        @click="handleOpenSelect2"
      >
        <view>{{ receiverInfo }}</view>
        <jh-select
          :list="allPerson2"
          ref="bbb"
          reverse
          textField="name"
          valueField="id"
          multiple
          :show="selectShow2"
          @confirm="confirmSelect2"
          @close="onCloseSelect2"
        ></jh-select>
      </uv-form-item>

      <uv-form-item label="避风内容" prop="content" borderBottom>
        <uv-textarea v-model="formData.content" placeholder="请输入避风内容"></uv-textarea>
      </uv-form-item>
      <uv-form-item label="附件上传" prop="attachments">
        <uv-upload
          :fileList="formData.attachments"
          @afterRead="afterRead"
          @delete="deletePic"
          :maxCount="3"
          multiple
          :disabled="isViewMode"
        />
      </uv-form-item>
    </uv-form>
    <view class="footer">
      <uv-button
        class="btn"
        v-if="formData.state === 0"
        type="primary"
        :plain="true"
        @click="submitForm('save')"
      >
        保存草稿
      </uv-button>
      <uv-button
        class="btn"
        v-if="formData.state === 0"
        type="primary"
        @click="submitForm('release')"
      >
        发布
      </uv-button>
      <uv-button class="btn" v-if="formData.state === 1" type="primary" @click="submitForm('end')">
        结束避风
      </uv-button>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted } from 'vue'
import JhSelect from '@/components/jh-select/index.vue'
import dayjs from 'dayjs'
import { cloneDeep, pick, map } from 'lodash-es'
import {
  noticeAdd,
  noticeEdit,
  noticeRelease,
  noticeSetEnd,
} from '@/service/windShelter/notice/index'
import { getAllPerson } from '@/service/common/index'

import { useUserStore } from '@/store'
import { useToast } from '@/utils/modals'

interface FormDataType {
  id: string
  code: string
  name: string
  planStartDate: string
  planEndDate: string
  deadline: string
  contactInfo: any
  receiverInfo: any
  content: string
  file: string
  attachments: any[]
  state: number
}

const formData = reactive<FormDataType>({
  id: '',
  code: '',
  name: '',
  planStartDate: '',
  planEndDate: '',
  deadline: '',
  contactInfo: {},
  receiverInfo: [],
  content: '',
  file: '',
  attachments: [],
  state: 0, // 状态: 0草稿, 1已发布, 2已结束
})

const rules = {
  // planStartDate: [
  //   {
  //     required: true,
  //     message: '请选择施工开始时间',
  //     trigger: ['blur', 'change'],
  //   },
  // ],
  // planEndDate: [
  //   {
  //     required: true,
  //     message: '请选择施工结束时间',
  //     trigger: ['blur', 'change'],
  //   },
  // ],
  // useTime: [
  // {
  //   required: true,
  //   message: '请输入耗时',
  //   trigger: ['blur', 'change'],
  // },
  // {
  //   validator: (value: number) => {
  //     if (value <= 0) {
  //       return '耗时必须大于0'
  //     }
  //     return true
  //   },
  //   trigger: ['blur', 'change'],
  // },
  // ],
  // createName: [
  //   {
  //     required: true,
  //     message: '请填写填报人',
  //     trigger: 'blur',
  //   },
  // ],
  // unitName: [
  //   {
  //     required: true,
  //     message: '请填写施工单位',
  //     trigger: 'blur',
  //   },
  // ],
}
const VITE_UPLOAD_BASEURL = import.meta.env.VITE_UPLOAD_BASEURL
const allPerson1 = ref([])
const allPerson2 = ref([])
const form = ref()
const planStartDatePicker = ref()
const planEndDatePicker = ref()
const deadlinePicker = ref()
const planStartDate = ref('')
const planEndDate = ref('')
const deadline = ref('')

const selectShow1 = ref(false)
const selectShow2 = ref(false)
const contactInfo = ref('')
const receiverInfo = ref('')

const isViewMode = ref(false) // 默认非查看模式

const userInfo = useUserStore().userInfo

onLoad((options) => {
  const params = JSON.parse(decodeURIComponent(options.item))
  Object.assign(formData, { ...params })
  isViewMode.value = params.statue === 2
  if (formData.file) {
    formData.attachments = formData.file.split(',').map((item) => ({
      url: item,
    }))
  } else {
    formData.attachments = []
  }
  formData.planStartDate &&
    (planStartDate.value = dayjs(formData.planStartDate).format('YYYY-MM-DD HH:mm'))
  formData.planEndDate &&
    (planEndDate.value = dayjs(formData.planEndDate).format('YYYY-MM-DD HH:mm'))
  formData.deadline && (deadline.value = dayjs(formData.deadline).format('YYYY-MM-DD HH:mm'))
  if (formData.contactInfo) {
    formData.contactInfo = JSON.parse(formData.contactInfo)
  } else {
    formData.contactInfo = {}
  }
  contactInfo.value = formData.contactInfo.name

  if (formData.receiverInfo) {
    formData.receiverInfo = JSON.parse(formData.receiverInfo)
  } else {
    formData.receiverInfo = []
  }
  receiverInfo.value = formData.receiverInfo.map((item) => item.name).toString()
  getPerson().then(() => {
    console.error('formData.contactInfo', allPerson1.value)
  })
})

const getPerson = () => {
  return new Promise((resolve, reject) => {
    getAllPerson()
      .then((res) => {
        const { code, result = {} } = res
        if (code === 200) {
          allPerson1.value = cloneDeep(result.records || [])
          const obj = allPerson1.value.find((item) => item.id === formData.contactInfo?.id)
          obj && (obj.checked = true)

          allPerson2.value = cloneDeep(result.records || [])
          allPerson2.value.forEach((item) => {
            item.checked = false
            formData.receiverInfo.forEach((item2) => {
              if (item.id === item2.id) {
                item.checked = true
              }
            })
          })
        }
        resolve(result.records)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

const handleOpenSelect1 = () => {
  selectShow1.value = true
}
const handleOpenSelect2 = () => {
  selectShow2.value = true
}
const confirmSelect1 = (e) => {
  formData.contactInfo = pick(e.options, ['id', 'name', 'phone'])
  contactInfo.value = formData.contactInfo.name
  onCloseSelect1()
}
const confirmSelect2 = (e) => {
  formData.receiverInfo = map(e.options, (item) => pick(item, ['id', 'name', 'phone']))
  receiverInfo.value = formData.receiverInfo.map((item) => item.name).toString()
  onCloseSelect2()
}
const onCloseSelect1 = () => {
  selectShow1.value = false
}
const onCloseSelect2 = () => {
  selectShow2.value = false
}

const formatter = (type, value) => {
  if (type === 'year') {
    return `${value}年`
  }
  if (type === 'month') {
    return `${value}月`
  }
  if (type === 'day') {
    return `${value}日`
  }
  return value
}

const handleOpenTime = (type) => {
  if (type === 'start') {
    !formData.planStartDate &&
      (formData.planStartDate = dayjs(Date.now()).format('YYYY-MM-DD HH:mm'))
    planStartDatePicker.value.open()
  } else if (type === 'end') {
    !formData.planEndDate && (formData.planEndDate = dayjs(Date.now()).format('YYYY-MM-DD HH:mm'))
    planEndDatePicker.value.open()
  } else if (type === 'deadline') {
    !formData.deadline && (formData.deadline = dayjs(Date.now()).format('YYYY-MM-DD HH:mm'))
    deadlinePicker.value.open()
  }
}
const handleConfirmStart = (e) => {
  planStartDate.value = dayjs(e.value).format('YYYY-MM-DD HH:mm')
}
const handleConfirmEnd = (e) => {
  planEndDate.value = dayjs(e.value).format('YYYY-MM-DD HH:mm')
}
const handleConfirmDeadline = (e) => {
  deadline.value = dayjs(e.value).format('YYYY-MM-DD HH:mm')
}

// 上传图片
const afterRead = async (event: any) => {
  console.error('event', event)
  const { file } = event
  try {
    const data = new FormData()
    data.append('biz111', 'temp') // 添加 biz 参数
    data.append('file111', file.file) // 添加 file 参数，注意使用 file.file 获取文件对象

    const uploadResult = await uni.uploadFile({
      url: VITE_UPLOAD_BASEURL, // 替换为你的上传地址
      name: 'file',
      data,
    })

    console.error('uploadResult', uploadResult)

    if (uploadResult.statusCode !== 200) {
      throw new Error(`上传失败，状态码：${uploadResult.statusCode}`)
    }
    const response = JSON.parse(uploadResult.data)
    // 处理上传成功后的逻辑，例如更新 formData.attachments
    formData.attachments.push({
      url: response.message, // 使用后端返回的 url
    })
  } catch (error) {
    console.error('上传失败：', error)
    // 处理上传失败的逻辑
  }
}

// 删除图片
const deletePic = (event: any) => {
  formData.attachments.splice(event.index, 1)
}

// 提交表单
const submitForm = async (type) => {
  console.log('formData.contactInfo===>', formData.contactInfo)
  formData.contactInfo = JSON.stringify(formData.contactInfo)
  formData.receiverInfo = JSON.stringify(formData.receiverInfo)
  let res
  if (type === 'save') {
    if (!formData.id) {
      res = await noticeAdd(formData)
    } else {
      res = await noticeEdit(formData)
    }
  } else if (type === 'release') {
    res = await noticeRelease(formData)
  } else if (type === 'end') {
    res = await noticeSetEnd(formData)
  }
  const { code, message } = res
  if (code === 200) {
    useToast('操作成功')
    uni.navigateBack()
  } else {
    useToast(message)
  }

  // form.value.validate(async (valid: boolean) => {
  //   if (valid) {
  //     // 表单校验通过，提交数据
  //     console.log('表单数据：', formData)
  //     const params = { constructionLogs: [formData] }
  //     const { code } = await constructionAddList(params)
  //   } else {
  //     // 表单校验失败
  //     uni.showToast({
  //       title: '表单校验失败',
  //       icon: 'error',
  //     })
  //   }
  // })
}
</script>
<style lang="scss">
.footer {
  display: flex;
  align-content: center;
  justify-content: space-around;
  .btn {
    width: 264rpx;
  }
}
</style>
