<script setup lang="ts">
import area from '@/api/area'
import travelers from '@/api/travelers'
import { idTypes, planeLevels, shippingLevels, trainLevels, vehicleTypes } from '@/utils/business'
import dayjs from 'dayjs'
import { showConfirmDialog, showToast } from 'vant'

const emit = defineEmits(['getTripPeople'])
const state = reactive({
  ifDefault: true,
  tripData: [],
  invoiceForm: [] as any,
})
const tripPeoplesRef = ref(null)

function onConfirm(event: any, index: any, item: any) {
  const { selectedOptions, selectedValues } = event
  if (index === 1) {
    item.showPopup = false
    item.pickerValueOne = selectedOptions[0].text
    item.idTypeList = selectedValues
    item.tripPeopleForm.idType = item.idTypeList[0]
  }
  else if (index === 2) {
    item.showVehicle = false
    if (item.tripPeopleForm.level) {
      item.tripPeopleForm.level = ''
    }
    item.pickerValueTwo = selectedOptions[0].text
    item.vehicleTypeList = selectedValues
    item.tripPeopleForm.vehicleType = item.vehicleTypeList[0]
  }
  else if (index === 3) {
    item.showLevel = false
    item.tripPeopleForm.level = selectedOptions[0].text
    item.selectLevel = selectedValues
  }
}

/**
 * 获取省市区地址
 */
function getAreaList() {
  area.getAreaList().then((res) => {
    areaListData(res.provinces)
    state.invoiceForm.forEach((item) => {
      item.areaList = JSON.parse(JSON.stringify(res.provinces))
      item.areaListTwo = JSON.parse(JSON.stringify(res.provinces))
    })
  })
}

function onFinish(Event: any, item: any, index: any) {
  const { selectedOptions } = Event
  if (index === 1) {
    item.showCascader = false
    item.tripPeopleForm.travelDeparturePlace = selectedOptions.map(option => option.text).join('')
  }
  else {
    item.showCascaderTwo = false
    item.tripPeopleForm.travelDestinationPlace = selectedOptions.map(option => option.text).join('')
  }
}

/**
 * 将接口数据转化为vant-picker组件需要的数据格式
 */
function areaListData(data) {
  data.forEach((item) => {
    item.value = item.name
    item.text = item.name
    item.children = item.cities
    delete item.name
    if (item.cities && item.cities.length > 0) {
      areaListData(item.cities)
    }
    delete item.cities
  })
}

/**
 * 打开出行人弹出框选择出行人
 */
function selectTripPeople(index: number) {
  tripPeoplesRef.value.showDialog(index)
}

/**
 * 是否显示等级选择框
 */
function ifShowSelect(item: any) {
  if (item.tripPeopleForm?.vehicleType === 1 || item.tripPeopleForm?.vehicleType === 2 || item.tripPeopleForm?.vehicleType === 7) {
    return true
  }
  else {
    return false
  }
}

/**
 * 增加出行人
 */
function addTripPeople() {
  const day = dayjs().format('YYYY-MM-DD')
  state.invoiceForm.push({
    tripPeopleForm: {
      idType: 201,
    },
    travelDateFormatter: [day.slice(0, 4), day.slice(5, 7), day.slice(8, 10)],
    idTypeList: [201],
  })
  findFieldKeyList()
  getAreaList()
  getDefaultDate()
  getData()
}

function deleteTripPeople(index) {
  showConfirmDialog({
    title: '提示',
    message: '您确定删除出行人吗？',
  })
    .then(() => {
      state.invoiceForm.splice(index, 1)
      getData()
      showToast('删除成功')
    })
}

/**
 * 选择出行日期
 */
function selectDate(item) {
  item.showPicker = false
  item.tripPeopleForm.travelDate = item.travelDateFormatter.join('-')
}

/**
 * 显示证件类型&交通工具
 */
function showIdTypeAndVehicle() {
  state.invoiceForm.forEach((item: any) => {
    const idType = idTypes.find(type => type.value === Number(item.tripPeopleForm?.idType))
    const vehicleType = vehicleTypes.find(type => type.value === item.tripPeopleForm?.vehicleType)
    item.pickerValueOne = idType ? idType.text : ''
    item.pickerValueTwo = vehicleType ? vehicleType.text : ''
  })
}

/**
 * 获取默认时间
 */
function getDefaultDate() {
  state.invoiceForm.forEach((item: any) => {
    item.tripPeopleForm.travelDate = item.travelDateFormatter.join('-')
  })
}

/**
 * 提示超出20位的信息
 */
function tipInfo(value) {
  if (value.length === 20) {
    showToast('证件号码最多输入20位')
  }
}

/**
 * 获取默认配置信息
 */
function findFieldKeyList() {
  const params = {
    fieldKeys: 'select-drawer-type,show-receiver-checker-name,show-purchaser-address-phone-bank,show-seller-address-phone-bank,default-travel-departure-place,default-travel-destination-place,default-vehicle-type,default-level',
  }
  travelers.findFieldKeyList(params).then((res) => {
    if (res.code === 1) {
      for (const setting of res.content) {
        if (setting.fieldKey === 'default-travel-departure-place') {
          state.invoiceForm.forEach((item: any) => {
            if (!item.tripPeopleForm.travelDeparturePlace) {
              item.tripPeopleForm.travelDeparturePlace = setting.fieldValue
            }
          })
        }
        else if (setting.fieldKey === 'default-travel-destination-place') {
          state.invoiceForm.forEach((item: any) => {
            if (!item.tripPeopleForm.travelDestinationPlace) {
              item.tripPeopleForm.travelDestinationPlace = setting.fieldValue
            }
          })
        }
        else if (setting.fieldKey === 'default-vehicle-type') {
          state.invoiceForm.forEach((item: any) => {
            if (!item.tripPeopleForm.vehicleType) {
              item.tripPeopleForm.vehicleType = Number(setting.fieldValue)
              item.vehicleTypeList = []
              item.vehicleTypeList.push(Number(setting.fieldValue))
            }
          })
        }
        else if (setting.fieldKey === 'default-level') {
          state.invoiceForm.forEach((item: any) => {
            // if (item.tripPeopleForm.vehicleType === 2) {
            item.tripPeopleForm.level = setting.fieldValue
            item.selectLevel = []
            item.selectLevel.push(setting.fieldValue)
            // }
          })
        }
      }
      showIdTypeAndVehicle()
    }
  })
}

/**
 * 是否选中等级
 */
function ifShowSelectLevel(item) {
  if (item.tripPeopleForm?.vehicleType === 1 || item.tripPeopleForm?.vehicleType === 2 || item.tripPeopleForm?.vehicleType === 7) {
    item.showLevel = true
  }
  else {
    item.showLevel = false
  }
}

function setTripPeopleData(tripPeopleData: any, index: number) {
  state.invoiceForm[index].tripPeopleForm = tripPeopleData
  showIdTypeAndVehicle()
  getDefaultDate()
  tripPeoplesRef.value.closeDialog()
  getData()
}

/**
 * 返回数据给父组件
 */
function getData() {
  state.tripData = []
  state.invoiceForm.forEach((item: any) => {
    state.tripData.push(item.tripPeopleForm)
  })
  emit('getTripPeople', state.tripData)
}

onMounted(() => {
})
</script>

<template>
  <van-cell-group v-for="(item, index) in state.invoiceForm" :key="index" :title="`出行人${index + 1}信息`" inset>
    <van-field v-model="item.tripPeopleForm.traveler" required clickable label="出行人" placeholder="请输入出行人">
      <template #right-icon>
        <text class="create selectText" @click="selectTripPeople(index)">
          选择出行人
        </text>
      </template>
    </van-field>
    <van-field
      v-model="item.tripPeopleForm.travelDate" clickable required label="出行日期" readonly placeholder="请选择出行日期"
      @click="item.showPicker = true"
    >
      <template #right-icon>
        <van-icon name="arrow" />
      </template>
    </van-field>
    <van-popup v-model:show="item.showPicker" position="bottom" round style="height: 50% ">
      <van-date-picker
        v-model="item.travelDateFormatter" title="选择出行日期" @cancel="item.showPicker = false"
        @confirm="selectDate(item)"
      />
    </van-popup>
    <van-field
      v-model="item.pickerValueOne"
      required clickable label="证件类型" readonly placeholder="请选择证件类型"
      @click="item.showPopup = true"
    >
      <template #right-icon>
        <van-icon name="arrow" />
      </template>
    </van-field>
    <van-popup v-model:show="item.showPopup" round position="bottom">
      <van-picker
        v-model="item.idTypeList" :columns="idTypes" @cancel="item.showPopup = false"
        @confirm="onConfirm($event, 1, item)"
      />
    </van-popup>
    <van-field
      v-model="item.tripPeopleForm.idNumber"
      required clickable label="证件号码" placeholder="请填写证件号码" maxlength="20"
      @update:model-value="tipInfo"
    />
    <van-field v-model="item.tripPeopleForm.travelDeparturePlace" required clickable label="出发地" placeholder="请输入出发地">
      <template #right-icon>
        <text class="create selectText" @click="item.showCascader = true">
          选择出发地
        </text>
      </template>
    </van-field>
    <van-popup v-model:show="item.showCascader" round position="bottom">
      <van-cascader
        v-model="item.cascaderValue" title="请选择所在地区" :options="item.areaList"
        @close="item.showCascader = false" @finish="(event) => onFinish(event, item, 1)"
      />
    </van-popup>
    <van-field v-model="item.tripPeopleForm.travelDestinationPlace" required clickable label="目的地" placeholder="请输入目的地">
      <template #right-icon>
        <text class="create selectText" @click="item.showCascaderTwo = true">
          选择目的地
        </text>
      </template>
    </van-field>
    <van-popup v-model:show="item.showCascaderTwo" round position="bottom">
      <van-cascader
        v-model="item.cascaderTwoValue" title="请选择所在地区" :options="item.areaListTwo"
        @close="item.showCascaderTwo = false" @finish="(event) => onFinish(event, item, 2)"
      />
    </van-popup>
    <van-field
      v-model="item.pickerValueTwo"
      required clickable readonly label="交通工具" placeholder="请选择交通工具"
      @click="item.showVehicle = true"
    >
      <template #right-icon>
        <van-icon name="arrow" />
      </template>
    </van-field>
    <van-popup v-model:show="item.showVehicle" round position="bottom">
      <van-picker
        v-model="item.vehicleTypeList" :columns="vehicleTypes" @cancel="item.showVehicle = false"
        @confirm="onConfirm($event, 2, item)"
      />
    </van-popup>
    <van-field
      v-model="item.tripPeopleForm.level"
      :required="ifShowSelect(item)" :readonly="ifShowSelect(item)" clickable label="等级"
      :placeholder="ifShowSelect(item) ? '请选择等级' : '请填写等级'" @click="ifShowSelectLevel(item)"
    >
      <template #right-icon>
        <van-icon v-if="ifShowSelect(item)" name="arrow" />
      </template>
    </van-field>
    <van-popup v-model:show="item.showLevel" round position="bottom">
      <van-picker
        v-if="item.tripPeopleForm.vehicleType === 1"
        v-model="item.selectLevel"
        :columns="planeLevels" @cancel="item.showLevel = false"
        @confirm="onConfirm($event, 3, item)"
      />
      <van-picker
        v-if="item.tripPeopleForm.vehicleType === 2"
        v-model="item.selectLevel"
        :columns="trainLevels" @cancel="item.showLevel = false"
        @confirm="onConfirm($event, 3, item)"
      />
      <van-picker
        v-if="item.tripPeopleForm.vehicleType === 7"
        v-model="item.selectLevel"
        :columns="shippingLevels"
        @cancel="item.showLevel = false" @confirm="onConfirm($event, 3, item)"
      />
    </van-popup>
    <div class="tripButton delete" @click="deleteTripPeople(index)">
      删除出行人
    </div>
  </van-cell-group>
  <div class="tripBottom">
    <van-button color="#f5f5f5" plain style="width: 100%" type="primary" @click="addTripPeople">
      <div style="color: #1989fa">
        添加出行人
      </div>
    </van-button>
  </div>
  <tripPeoplesList ref="tripPeoplesRef" @select-trip-people-data="setTripPeopleData" />
</template>

<style scoped lang="less">
.tripButton {
  display: flex;
  justify-content: center;
  cursor: pointer;
  padding: 15px 0;
}

.create {
  color: #1989fa;
}

.delete {
  color: #ee0a24;
}

.selectText {
  font-size: 2.8vw;
}

.tripBottom {
  padding: 10px 16px;
}
</style>
