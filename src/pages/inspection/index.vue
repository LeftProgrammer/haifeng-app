<route lang="json5">
{
  style: {
    navigationBarTitleText: '检核',
  },
}
</route>

<template>
  <view class="bg-#f5f5f5 h-full box-border relative overflow-hidden">
    <view class="bg-#fff px-4">
      <uv-form labelPosition="left" label-width="100">
        <uv-form-item label="核检船舶" prop="ship" @click="handleShowShipPicker" required>
          <uv-input
            v-model="selectedShip.shipName"
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
    <view v-if="selectedShip.shipId" class="main bg-#f5f5f5 p-2 overflow-hidden">
      <view class="bg-#fff rounded-1 overflow-auto">
        <view class="header flex items-center justify-between p-2 rounded-1">
          <view class="flex items-center justify-start mb-2 w-full" v-show="selectedShip.shipId">
            <image class="w-12 h-12 mr-4" src="../../static/images/user-icon-3.png"></image>

            <view class="flex flex-col justify-between flex-1">
              <text class="text-4 text-[#1d2129] leading-5">
                {{ currentShipData?.inspectorName || '暂无核检员' }}
              </text>
              <uv-tags
                class="w-12.5 h-4 mt-1 bg-gray-400"
                text="安全员"
                size="mini"
                type="success"
              ></uv-tags>
            </view>

            <tempalte v-if="shipType === 1">
              <uv-button
                v-if="inspectionStatus === 1"
                type="primary"
                text="登船核验"
                @click="handleInspection"
              ></uv-button>
              <uv-button
                v-else
                type="error"
                text="结束登船"
                :disabled="inspectionStatus === 3"
                @click="handleEndBoarding"
              ></uv-button>
            </tempalte>
            <template v-else>
              <uv-button
                v-if="inspectionStatus === 1"
                type="primary"
                text="下船核验"
                @click="handleInspection"
              ></uv-button>
              <uv-button
                v-else
                type="error"
                text="结束下船"
                :disabled="inspectionStatus === 3 || !isAllOffboarded"
                @click="handleEndOffboarding"
              ></uv-button>
            </template>
          </view>
        </view>
        <view class="flex-1 mx-2 py-2 overflow-auto border-t">
          <uv-grid :col="4" :border="false">
            <uv-grid-item v-for="(person, index) in currentShipData?.users || []" :key="index">
              <view
                class="relative flex flex-col items-center p-2 rounded-md"
                :class="{ 'gray-out': shipType === 2 && !person.offboarded }"
              >
                <image class="w-12 h-12" src="../../static/images/user-icon-1.png" />
                <view class="mt-1 text-4 text-[#4e5969] leading-5">
                  {{ person.userName }}
                </view>
                <view
                  v-show="inspectionStatus === 2"
                  class="absolute top-1.5 right-1.5 p-1 rounded-full bg-black/50"
                  @click="handlePersonAction(person)"
                >
                  <uv-icon :name="getIconName(person)" size="10" color="#fff"></uv-icon>
                </view>
              </view>
            </uv-grid-item>
          </uv-grid>
        </view>
      </view>
    </view>

    <view
      v-show="inspectionStatus === 2"
      class="absolute bottom-0 left-0 right-0 h-16 flex items-center flex-justify-around bg-white"
    >
      <uv-button class="w-35" type="primary" text="开始核检" @click="handleScan"></uv-button>
    </view>

    <uv-empty
      v-if="!selectedShip.shipId"
      icon="https://cdn.uviewui.com/uview/empty/data.png"
      text="请选择核检船舶后再开始检核人员"
    ></uv-empty>

    <uv-modal
      ref="reasonModal"
      title=""
      @confirm="handleReasonConfirm"
      show-cancel-button="true"
      @close="closeModal"
    >
      <view class="slot-content">
        <uv-form
          :model="personData"
          ref="reasonform"
          :rules="reasonRules"
          label-width="80"
          class="flex-grow-1"
        >
          <uv-form-item label="处理原因" prop="result" @click="showResultSelect" required>
            <uv-input
              v-model="resultText"
              disabled
              disabledColor="#ffffff"
              placeholder="请选择处理原因"
              border="none"
            ></uv-input>
            <template v-slot:right>
              <uv-icon name="arrow-right"></uv-icon>
            </template>
          </uv-form-item>
          <uv-form-item label="备注" prop="remark" required>
            <uv-textarea
              v-model="personData.remark"
              placeholder="请输入备注"
              maxlength="200"
              height="50"
            ></uv-textarea>
          </uv-form-item>
        </uv-form>
      </view>
      <uv-action-sheet
        ref="resultSelect"
        :actions="actions"
        title="请选择原因类型"
        @select="handleResultSelect"
      ></uv-action-sheet>
    </uv-modal>
  </view>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useToast, useDialog } from '@/utils/modals/index'
import { useInspectionStore, Person, ShipData } from '@/store/inspection' // 引入 pinia store
import { shipList, shipLeave, shipBack, shipUsers } from '@/service/inspection/index'
import { useUserStore } from '@/store'

interface FormDataType {
  id: string
  result: string
  resultText: string
  remark: string
}

const resultText = computed(() => {
  const action = actions.find((item) => item.type === personData.result)
  return action ? action.name : '' // 如果找不到匹配的 action，则返回空字符串
})

const reasonRules = []
const reasonModal = ref(null)
const reasonform = ref(null)
const handleReasonConfirm = () => {
  console.log('personData', personData)
  personData.offboarded = true
  inspectionStore.updatePerson(selectedShip.shipId, personData.userId, personData)
}
const closeModal = () => {
  Object.keys(personData).forEach((key) => {
    personData[key] = ''
  })
}
// const openModal = () => {
//   reasonModal.value.open()
// }
const actions = [
  {
    type: '1',
    name: '已转乘其他船舶',
    subname: '备注转乘船舶名称',
  },
  {
    type: '2',
    name: '已下船，未打卡',
  },
  {
    type: '3',
    name: '人员失踪',
  },
  {
    type: '4',
    name: '其他',
  },
]
const resultSelect = ref(null)
const showResultSelect = () => {
  resultSelect.value.open()
}
const handleResultSelect = (e) => {
  console.log('e', e)
  personData.result = e.type
}
const shipPicker = ref(null)
const handleShowShipPicker = () => {
  shipPicker.value.open()
}

const userInfo = useUserStore().userInfo
const inspectionStore = useInspectionStore()

const shipType = ref() // 1登船，2下船
const ships = ref([]) // 船只数据
// 所选船只
const selectedShip = reactive({
  shipName: '',
  shipId: '',
})

const inspectionStatus = ref(1) // 是否开始核检: 1未开始，2已开始，3已结束
const currentShipData = computed(() => inspectionStore.getShipData(selectedShip.shipId)) // 当前船详情
// 是否已下船
const isAllOffboarded = computed(
  () => currentShipData.value && currentShipData.value.users.every((person) => person.offboarded),
)

const personData = reactive<Person>({} as Person)

onLoad((options) => {
  const { type } = options
  if (type === 'boarding') {
    shipType.value = 1
  } else if (type === 'disembarking') {
    shipType.value = 2
  }
})
onMounted(() => {
  getShipList({ option: shipType.value })
})

// 获取所有船只
const getShipList = async (params) => {
  const { code, message, result } = await shipList(params)
  if (code === 200) {
    if (result.length > 0) {
      ships.value = [result]
    }
  } else {
    useToast(message)
  }
}

// 选择船只
const handleShipConfirm = async (e: any) => {
  // inspectionStore.clearAllShipData() // TODO
  selectedShip.shipName = e.value[0].name
  selectedShip.shipId = e.value[0].shipDataId

  searchShipData()
}
const searchShipData = async () => {
  const shipData = inspectionStore.getShipData(selectedShip.shipId)
  if (!shipData) {
    if (shipType.value === 1) {
      createShipData()
    } else {
      const { code, message, result } = await shipUsers(selectedShip)
      if (code === 200) {
        if (result) {
          result.inspector = userInfo.id
          result.inspectorName = userInfo.name
          inspectionStore.allShipData[selectedShip.shipId] = result
        } else {
          createShipData()
        }
      } else {
        useToast(message)
      }
    }
  }
}
const createShipData = () => {
  const shipData = {
    shipId: selectedShip.shipId,
    shipName: selectedShip.shipName,
    departmentId: userInfo.departmentId,
    departmentName: userInfo.department,
    inspector: userInfo.id,
    inspectorName: userInfo.name,
    users: [],
  }
  // 或创建一个新的  initShipData  方法来初始化船舶数据
  inspectionStore.allShipData[selectedShip.shipId] = shipData
  console.log('inspectionStore.allShipData', inspectionStore.allShipData)
}

const handleInspection = async () => {
  const text = shipType.value === 1 ? '登船核验' : '下船核验'
  await useDialog(`确认进行${text}？`, {
    showCancelButton: true,
  })
  inspectionStatus.value = 2
}

// 扫码核检
const handleScan = async () => {
  if (!selectedShip.shipId) {
    useToast('请选择船只')
    return
  }

  try {
    // const res = await uni.scanCode({ scanType: ['qrCode'] })
    const res = {
      scanType: 'QR_CODE',
      path: '',
      charSet: 'UTF-8',
      result:
        '{"userId":"e9ca23d68d884d4ebb19d07889727dae","userName":"admin","departmentId":"1796098221604528130","departmentName":"长江设计集团","createTime":1719303370512}',
      errMsg: 'scanCode:ok',
    }
    console.log('res===>', res)

    const codeParams = JSON.parse(res.result) || {}
    codeParams.createTime = new Date() // TODO
    const timeDiff = new Date() - codeParams.createTime

    // 判断是否超过 10 分钟 (10 * 60 * 1000 毫秒)
    if (timeDiff > 10 * 60 * 1000) {
      useToast('二维码已失效，请重新生成')
    } else {
      // 二维码有效，继续处理逻辑
      const numbers = [
        '1-1',
        '1-2',
        '1-3',
        '1-4',
        '1-5',
        '1-6',
        '1-7',
        '1-8',
        '1-9',
        '12-1',
        '12-2',
        '12-3',
        '12-4',
        '12-5',
        '12-6',
        '12-7',
        '12-8',
        '12-9',
      ]
      const randomIndex = Math.floor(Math.random() * numbers.length)
      const randomValue = numbers[randomIndex]
      numbers.splice(randomIndex, 1)
      const person = {
        ...codeParams,
        userId: randomValue || codeParams.userId, // TODO
      }
      const existingPerson = currentShipData.value?.users.find((p) => p.userId === person.userId)

      if (existingPerson) {
        // 处理已存在人员
        if (shipType.value === 1 && existingPerson.onboarded) {
          useToast('该人员已登船')
        } else if (shipType.value === 2 && existingPerson.offboarded) {
          useToast('该人员已下船')
        } else {
          // 更新人员状态
          shipType.value === 1 && (existingPerson.onboarded = true)
          shipType.value === 2 && (existingPerson.offboarded = true)
        }
      } else {
        // 新增人员
        const newPerson: Person = {
          ...person,
          onboarded: shipType.value === 1,
          offboarded: shipType.value === 2,
          remark: '',
          result: '',
        }
        inspectionStore.addPerson(selectedShip.shipId, newPerson)
      }
    }
  } catch (error) {
    console.error('扫码失败：', error)
  }
}

const handlePersonAction = async (person: Person) => {
  if (shipType.value === 1) {
    // 登船核验时，点击 X 删除人员
    const result = await useDialog(`确认删除人员 ${person.userName}？`, {
      showCancelButton: true,
    })
    inspectionStore.removePerson(selectedShip.shipId, person.userId)
  } else {
    // 下船核验时，点击编辑图标修改下船状态或填写原因
    Object.assign(personData, person)
    reasonModal.value.open()
  }
}

const handleEndBoarding = async () => {
  await useDialog('确认结束登船核验？结束后将无法再次扫码登船。', {
    showCancelButton: true,
  })
  const { code, message, result } = await shipLeave(currentShipData.value)
  console.log('handleEndBoarding', code, result)
  if (code === 200) {
    inspectionStatus.value = 3
    inspectionStore.clearShipData(currentShipData.value.shipId)
  } else {
    useToast(message)
  }
}

const handleEndOffboarding = async () => {
  if (!isAllOffboarded.value) {
    useToast('尚有人员未进行下船核验')
    return
  }

  await useDialog('确认结束下船？结束后无法在进行人员下船', {
    showCancelButton: true,
  })

  const { code, message, result } = await shipBack(currentShipData.value)
  console.log('handleEndBoarding', code, result)
  if (code === 200) {
    inspectionStatus.value = 3
    inspectionStore.clearShipData(currentShipData.value.shipId)
    //   // 返回上一页
    // uni.navigateBack()
  } else {
    useToast(message)
  }
}

const getIconName = (person: Person) => {
  if (shipType.value === 1) {
    return 'close'
  } else {
    return 'file-text'
  }
}
</script>

<style lang="scss" scoped>
.header {
  background: linear-gradient(360deg, rgba(157, 214, 255, 0.06) 20%, rgba(50, 84, 255, 0.16) 100%);
}
.gray-out {
  opacity: 0.5;
}
</style>
