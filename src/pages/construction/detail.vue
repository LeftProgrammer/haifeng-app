<route lang="json5">
{
  style: {
    navigationBarTitleText: '工序填报',
  },
}
</route>

<template>
  <view class="page bg-#f5f5f5 h-full pa-4 flex flex-col">
    <uv-form :model="formData" ref="form" :rules="rules" label-width="100" class="flex-grow-1">
      <uv-form-item label="工序名称" prop="processName" borderBottom>
        <uv-input v-model="formData.processName" border="none" readonly />
      </uv-form-item>
      <uv-form-item
        label="施工开始时间"
        prop="startTime"
        borderBottom
        @click="handleOpenTime('start')"
        required
      >
        <uv-input v-model="startTime" border="none" placeholder="请选择开始时间" readonly />
        <uv-datetime-picker
          ref="startTimePicker"
          v-model="formData.startTime"
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
        label="施工结束时间"
        prop="endTime"
        borderBottom
        @click="handleOpenTime('end')"
        required
      >
        <uv-input v-model="endTime" border="none" placeholder="请选择结束时间" readonly />
        <uv-datetime-picker
          ref="endTimePickerr"
          v-model="formData.endTime"
          mode="datetime"
          :min-date="formData.startTime"
          :disabled="isViewMode"
          border="none"
          @confirm="handleConfirmEnd"
        />

        <template v-slot:right>
          <uv-icon name="arrow-right"></uv-icon>
        </template>
      </uv-form-item>
      <uv-form-item label="耗时(分钟)" prop="useTime" borderBottom>
        <uv-input
          v-model="formData.useTime"
          type="number"
          @input="handleDurationInput"
          border="none"
          readonly
        />
      </uv-form-item>
      <uv-form-item label="填报人" prop="createName" borderBottom>
        <uv-input v-model="formData.createName" border="none" :disabled="isViewMode" />
      </uv-form-item>
      <uv-form-item label="施工单位" prop="unitName" borderBottom>
        <uv-input v-model="formData.unitName" border="none" :disabled="isViewMode" />
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
    <uv-button v-if="!isViewMode" type="primary" @click="submitForm">提交</uv-button>
  </view>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted } from 'vue'
import { constructionAddList } from '@/service/construction/index'
import { useUserStore } from '@/store'
import { useToast } from '@/utils/modals'

interface FormDataType {
  processName: string
  pbsId: string
  processId: string
  startTime: string
  endTime: string
  useTime: number
  createBy: string
  createName: string
  unitId: string
  unitName: string
  file: string
  attachments: any[]
  constructionState: number
}

const formData = reactive<FormDataType>({
  processName: '',
  pbsId: '',
  processId: '',
  startTime: '',
  endTime: '2024-06-20 12:00',
  useTime: 0,
  createBy: '',
  createName: '',
  unitId: '',
  unitName: '',
  file: '',
  attachments: [],
  constructionState: 2, // 状态: 1未开始, 2已完成
})

const rules = {
  // startTime: [
  //   {
  //     required: true,
  //     message: '请选择施工开始时间',
  //     trigger: ['blur', 'change'],
  //   },
  // ],
  // endTime: [
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
const form = ref()
const startTimePicker = ref()
const endTimePickerr = ref()
const startTime = ref('')
const endTime = ref('')
const isViewMode = ref(false) // 默认非查看模式

const userInfo = useUserStore().userInfo

onLoad((options) => {
  const params = JSON.parse(decodeURIComponent(options.item))
  console.log('params', params)
  console.log('userInfo', userInfo)
  isViewMode.value = !!params.endTime
  Object.assign(formData, { ...params })
  if (formData.file) {
    formData.attachments = formData.file.split(',').map((item) => ({
      url: item,
    }))
  } else {
    formData.attachments = []
  }

  formData.createBy = params.createBy || userInfo.username
  formData.createName = params.createName || userInfo.name
  formData.unitId = params.unitId || userInfo.departmentId
  formData.unitName = params.unitName || userInfo.department

  startTime.value = formatDate(formData.startTime)
  endTime.value = formatDate(formData.endTime)

  console.log('formData', formData)
  // calculateDuration()
})

const formatDate = (timestamp) => {
  if (timestamp) {
    const date = new Date(timestamp)
    const year = date.getFullYear()
    const month = ('0' + (date.getMonth() + 1)).slice(-2) // 月份从 0 开始，需要 +1
    const day = ('0' + date.getDate()).slice(-2)
    const hours = ('0' + date.getHours()).slice(-2)
    const minutes = ('0' + date.getMinutes()).slice(-2)

    return `${year}-${month}-${day} ${hours}:${minutes}`
  } else {
    return ''
  }
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
    !formData.startTime && (formData.startTime = formatDate(Date.now()))
    startTimePicker.value.open()
  } else if (type === 'end') {
    !formData.endTime && (formData.endTime = formatDate(Date.now()))
    endTimePickerr.value.open()
  }
}
const handleConfirmStart = (e) => {
  startTime.value = formatDate(e.value)
  nextTick(() => {
    calculateDuration()
  })
}
const handleEndOpen = () => {
  endTimePickerr.value.open()
}
const handleConfirmEnd = (e) => {
  endTime.value = formatDate(e.value)
  nextTick(() => {
    calculateDuration()
  })
}

// 计算耗时
const calculateDuration = () => {
  if (formData.startTime && formData.endTime) {
    const startTime = new Date(formData.startTime).getTime()
    const endTime = new Date(formData.endTime).getTime()
    formData.useTime = Math.floor((endTime - startTime) / (1000 * 60))
  } else {
    formData.useTime = 0
  }
}

// 手动修改耗时
const handleDurationInput = () => {
  // 可以根据需要添加校验逻辑
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
const submitForm = async () => {
  formData.constructionState = 2
  const params = { constructionLogs: [formData], pbsId: formData.pbsId }
  const { code, message, result } = await constructionAddList(params)
  if (code === 200) {
    useToast('填报成功')
    uni.navigateBack()
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

// 设置查看模式，例如：
// const route = useRoute();
// isViewMode.value = route.query.mode === 'view';

// onMounted(() => {
//   // getReporterInfo()
//   calculateDuration()
// })
</script>
