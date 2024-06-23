<route lang="json5">
{
  style: {
    navigationBarTitleText: '检核',
  },
}
</route>

<template>
  <view class="page bg-white overflow-hidden pt-2 px-4">
    <view>
      <uv-form labelPosition="left" :model="model" ref="form" label-width="100">
        <uv-form-item label="核检船舶" prop="ship" borderBottom @click="handleShowShipPicker">
          <uv-input
            v-model="model.shipName"
            disabled
            disabledColor="#ffffff"
            placeholder="请选择船舶"
            border="none"
          ></uv-input>
          <template v-slot:right>
            <uv-icon name="arrow-right"></uv-icon>
          </template>
        </uv-form-item>
        <uv-picker
          ref="shipPicker"
          @confirm="handleShipConfirm"
          :columns="ships"
          keyName="name"
        ></uv-picker>
      </uv-form>
    </view>
    <view class="header">
      <view class="inspector" v-show="model.shipName">
        <text class="label">核检员：</text>
        <text class="value">{{ currentShipData?.inspector || '请选择核检员' }}</text>
        <uv-button
          v-if="!isStarted"
          type="primary"
          :text="currentStatus ? '登船核验' : '下船核验'"
          @click="handleInspection"
        ></uv-button>
        <template v-else>
          <uv-button
            v-if="currentStatus"
            type="primary"
            text="结束登船"
            @click="handleEndBoarding"
          ></uv-button>
          <uv-button
            v-else
            type="primary"
            text="结束下船"
            :disabled="!isAllOffboarded"
            @click="handleEndOffboarding"
          ></uv-button>
        </template>
      </view>
    </view>
    <view class="content">
      <uv-grid :col="3" :border="false">
        <uv-grid-item v-for="(person, index) in currentShipData?.users || []" :key="index">
          <view class="person-item" :class="{ 'gray-out': !person.onboarded && !currentStatus }">
            <u-avatar
              size="large"
              :src="person.avatar || '../../static/images/user-icon-1.png'"
            ></u-avatar>
            <view class="name">{{ person.userName }}</view>
            <view class="icon-wrapper" @click="handlePersonAction(person)">
              <u-icon :name="getIconName(person)" size="20" color="#fff"></u-icon>
            </view>
          </view>
        </uv-grid-item>
      </uv-grid>
    </view>
    <view class="footer">
      <uv-button type="primary" text="开始核验" @click="handleScan"></uv-button>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useToast, useDialog } from '@/utils/modals/index'
import { useInspectionStore, Person, ShipData } from '@/store/inspection' // 引入 pinia store
import { shipList, shipLeave, shipBack, shipUsers } from '@/service/inspection/index'
import { useUserStore } from '@/store'

const inspectionStore = useInspectionStore()

const shipPicker = ref(null)

const handleShowShipPicker = () => {
  shipPicker.value.open()
}

const model = reactive({
  shipName: '',
  shipId: '',
})

const ships = ref([])
const inspectors = ref([
  { shipId: '1', name: '张三' },
  { shipId: '2', name: '李四' },
])
const inspector = ref('')

const showShipPicker = ref(false)
const currentStatus = ref(true) // true: 登船核验，false: 下船核验
const isStarted = ref(false)

const currentShipData = computed(() => inspectionStore.getShipData(model.shipId))

const isAllOffboarded = computed(
  () => currentShipData.value && currentShipData.value.users.every((person) => person.offboarded),
)

const userInfo = useUserStore().userInfo
const option = ref('')
onLoad((options) => {
  const { type } = options
  if (type === 'boarding') {
    option.value = '1'
  } else if (type === 'disembarking') {
    option.value = '2'
  }
})
onMounted(() => {
  getShipList({ option: option.value })
})

const getShipList = async (params) => {
  const { code, message, result } = await shipList(params)
  if (code === 200) {
    ships.value = [result]
  }
}

const handleShipConfirm = (e: any) => {
  model.shipName = e.value[0].name
  model.shipId = e.value[0].shipDataId

  let shipData = inspectionStore.getShipData(model.shipId)
  if (!shipData) {
    shipData = {
      shipId: model.shipId,
      shipName: model.shipName,
      departmentId: userInfo.departmentId,
      departmentName: userInfo.name,
      inspector: userInfo.name || '', // 确保 inspector 有值
      users: [],
    }
    // 或创建一个新的  initShipData  方法来初始化船舶数据
    inspectionStore.allShipData[model.shipId] = shipData
    console.log('inspectionStore.allShipData', inspectionStore.allShipData)
  }
  showShipPicker.value = false
}

const handleInspection = async () => {
  try {
    const text = currentStatus.value ? '登船核验' : '下船核验'
    await useDialog(`确认进行${text}？`)
    isStarted.value = true
  } catch (error) {
    // 用户点击了取消按钮或关闭了对话框，不做任何操作
  }
}

const handleScan = async () => {
  if (!model.shipId) {
    useToast('请选择船只')
    return
  }

  try {
    // const res = await uni.scanCode({ scanType: ['qrCode'] })
    // console.log('res===>', res)

    // const urlParams = new URLSearchParams(res.result)

    const numbers = ['1-1', '1-2', '1-3', '1-4', '1-5']
    const randomIndex = Math.floor(Math.random() * numbers.length)
    const randomValue = numbers[randomIndex]
    const person = {
      userId: randomValue,
      userName: randomValue,
      avatar: '',
      departmentId: userInfo.departmentId,
      departmentName: userInfo.name,
      createTime: new Date().getTime(),
    }

    const existingPerson = currentShipData.value?.users.find((p) => p.userId === person.userId)

    if (existingPerson) {
      // 处理已存在人员
      if (currentStatus.value && existingPerson.onboarded) {
        useToast('该人员已登船')
      } else if (!currentStatus.value && existingPerson.offboarded) {
        useToast('该人员已下船')
      } else {
        // 更新人员状态
        existingPerson.onboarded = currentStatus.value
        existingPerson.offboarded = !currentStatus.value
      }
    } else {
      // 新增人员
      const newPerson: Person = {
        ...person,
        onboarded: currentStatus.value,
        offboarded: false,
        reason: '',
        reasonType: '',
      }
      inspectionStore.addPerson(model.shipId, newPerson)
    }
  } catch (error) {
    console.error('扫码失败：', error)
  }
}

const handlePersonAction = async (person: Person) => {
  if (currentStatus.value) {
    // 登船核验时，点击 X 删除人员
    try {
      const result = await useDialog(`确认删除人员 ${person.userName}？`, {
        showCancelButton: true, // 显示取消按钮
      })

      inspectionStore.removePerson(model.shipId, person.userId)
    } catch (error) {}
  } else {
    // 下船核验时，点击编辑图标修改下船状态或填写原因
    try {
      await useDialog(person.offboarded ? '该人员已下船，是否修改状态？' : '请确认该人员已下船', {
        title: '确认下船',
        confirmButtonText: person.offboarded ? '修改' : '确认',
      })
      person.offboarded = !person.offboarded
    } catch (error) {
      // 用户点击了取消按钮或关闭了对话框，不做任何操作
    }
  }
}

const handleEndBoarding = async () => {
  try {
    await useDialog('确认结束登船核验？结束后将无法再次扫码登船。', {
      showCancelButton: true,
    })
    const { code, message, result } = await shipLeave(currentShipData.value)
    console.log('handleEndBoarding', code, result)
    if (code === 200) {
      currentStatus.value = false // 切换到下船核验
      isStarted.value = false
      console.log('currentShipData.value.shipId', currentShipData.value)
      console.log('inspectionStore', inspectionStore.allShipData)
      inspectionStore.clearShipData(currentShipData.value.shipId)
    } else {
      useToast(message)
    }
    console.log('currentShipData.value.shipId', currentShipData.value)
    console.log('inspectionStore', inspectionStore.allShipData)
    // inspectionStore.clearShipData(currentShipData.value.shipId)
    // inspectionStore.clearAllShipData()
  } catch (error) {}
}

const handleEndOffboarding = async () => {
  if (!isAllOffboarded.value) {
    useToast('尚有人员未进行下船核验')
    return
  }

  try {
    await useDialog('确认结束下船核验？')
    // 提交下船数据
    // console.log('提交下船数据：', checkedPersons.value)
    isStarted.value = false
    // 返回上一页
    uni.navigateBack()
  } catch (error) {
    // 用户点击了取消按钮或关闭了对话框，不做任何操作
  }
}

const getIconName = (person: Person) => {
  if (currentStatus.value) {
    return 'uicon-close'
  } else {
    return person.offboarded ? 'uicon-edit-pen' : 'uicon-edit-pen'
  }
}

// 获取船只检核信息
const getShipUsers = async () => {
  const { code, result } = await shipUsers(model)
}

onMounted(() => {
  // 页面加载时，可以根据实际需求初始化数据
})
</script>

<style lang="scss" scoped>
.page {
  display: flex;
  flex-direction: column;
  height: 100%;
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px;
    .title {
      font-size: 18px;
      font-weight: bold;
    }
    .end-btn {
      padding: 8px 16px;
      color: #fff;
      background-color: #007aff;
      border-radius: 4px;
      &.disabled {
        opacity: 0.5;
      }
    }
  }
  .inspector {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin-bottom: 10px;
    .label {
      font-size: 14px;
      color: #666;
    }
    .value {
      margin-left: 10px;
      font-size: 14px;
    }
  }
  .content {
    flex: 1;
    padding: 20px;
    overflow-y: auto;
    .person-item {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 10px;
      margin-bottom: 10px;
      background-color: #f5f5f5;
      border-radius: 8px;
      &.gray-out {
        opacity: 0.5;
      }
      .name {
        margin-top: 5px;
        font-size: 14px;
      }
      .icon-wrapper {
        position: absolute;
        top: 10px;
        right: 10px;
        padding: 4px;
        background-color: rgba(0, 0, 0, 0.5);
        border-radius: 50%;
      }
    }
  }
}
</style>
