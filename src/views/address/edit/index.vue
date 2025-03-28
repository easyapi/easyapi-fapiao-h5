<script setup lang='ts'>
import address from '@/api/address'
import area from '@/api/area'
import { useStore } from '@/stores'
import { showConfirmDialog } from 'vant'

const store = useStore()

const route = useRoute()

const state = reactive({
  addressForm: {
    name: '',
    area: '',
    province: '',
    city: '',
    district: '',
    mobile: '',
    addr: '',
    ifDefault: false,
  },
  name: '',
  showPopup: false,
  areaList: {},
})

/**
 * 获取地址详情
 */
function getAddress() {
  address.getAddress(route.query.id).then((res) => {
    if (res.code === 1) {
      state.addressForm = res.content
      state.addressForm.area
        = state.addressForm.province + state.addressForm.city + state.addressForm.district
    }
  })
}

/**
 * 获取省市区列表
 */
function getAreaList() {
  area.getAreaList().then((res) => {
    if (res.status === '1') {
      const provinces = res.provinces
      const province_list = {}
      const city_list = {}
      const county_list = {}
      for (const a of provinces) {
        const provinceKey = a.code.toString()
        province_list[provinceKey] = a.name
        for (const i of a.cities) {
          const cityKey = i.code.toString()
          city_list[cityKey] = i.name
          if (i.districts.length > 0) {
            for (const k of i.districts) {
              const districtsKey = k.id.toString()
              county_list[districtsKey] = k.name
            }
          }
          else {
            county_list[cityKey] = i.name
          }
        }
      }
      state.areaList.province_list = province_list
      state.areaList.city_list = city_list
      state.areaList.county_list = county_list
    }
  })
}

/**
 * 删除地址
 */
function deleteData() {
  showConfirmDialog({
    title: '提示',
    message: '确定删除?',
  }).then(() => {
    address.deleteAddress(route.query.id).then((res) => {
      if (res.code === 1)
        history.back()
    })
  })
}

function confirm() {
  showConfirmDialog({
    title: '提示',
    message: '确定提交吗？',
  }).then(() => {
    if (route.query.id) {
      address.updateAddress(route.query.id, state.addressForm).then((res) => {
        if (res.code === 1)
          history.back()
      })
    }
    else {
      address.createAddress(state.addressForm).then((res) => {
        if (res.code === 1)
          history.back()
      })
    }
  })
}
function onAddrConfirm(e) {
  state.addressForm.province = e.selectedOptions[0].text
  state.addressForm.city = e.selectedOptions[1].text
  state.addressForm.district = e.selectedOptions[2].text
  state.addressForm.area
    = state.addressForm.province + state.addressForm.city + state.addressForm.district
  state.showPopup = false
}

onMounted(() => {
  if (route.query.id) {
    document.title = '编辑地址'
    getAddress()
  }
  else {
    document.title = '新增地址'
  }
  getAreaList()
})
</script>

<template>
  <Header v-if="store.ifShowH5NavBar" header-title="编辑地址" />
  <div class="address-edit">
    <van-form @submit="confirm">
      <van-cell-group inset>
        <van-field
          v-model="state.addressForm.name" label="收件人" placeholder="请输入收货人姓名" border required
          :rules="[{ required: true, message: '请输入收货人姓名' }]"
        />
        <van-field
          v-model="state.addressForm.mobile" label="联系电话" placeholder="请输入收货人手机号" border required
          :rules="[{ required: true, message: '请输入收货人手机号' }]"
        />
        <van-field
          v-model="state.addressForm.area" label="所在地区" placeholder="请选择省市区县" border readonly required
          :rules="[{ required: true, message: '请选择省市区县' }]" @click="state.showPopup = true"
        />
        <van-field
          v-model="state.addressForm.addr" label="详细地址" placeholder="请输入街道、小区门牌号" border required autosize
          rows="1" type="textarea" :rules="[{ required: true, message: '请输入街道、小区门牌号' }]"
        />
      </van-cell-group>

      <van-cell-group class="default" inset>
        <van-cell center title="设置为默认地址">
          <template #right-icon>
            <van-switch v-model="state.addressForm.ifDefault" active-color="#FFC2A8" />
          </template>
        </van-cell>
      </van-cell-group>

      <van-popup v-model:show="state.showPopup" position="bottom" :style="{ height: '50%' }">
        <van-area
          title="请选择所在地区" :area-list="state.areaList" @confirm="onAddrConfirm"
          @cancel="state.showPopup = false"
        />
      </van-popup>
      <div class="bottom fixed-bottom-bgColor" :class="{ 'single-button': !route.query.id }">
        <div>
          <van-button type="primary" block native-type="submit">
            保存
          </van-button>
        </div>
        <div v-if="route.query.id">
          <van-button type="danger" block @click="deleteData">
            删除
          </van-button>
        </div>
      </div>
    </van-form>
  </div>
</template>

<style lang='less' scoped>
.address-edit {
  padding-top: 15px;

  .default {
    margin-top: 15px;
  }

  .bottom {
    position: fixed;
    bottom: 0;
    width: 100%;
    padding: 10px 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    div {
      width: 48%;
    }

  }

  .single-button {
    display: block;

    div {
      width: 100%;
    }
  }
}
</style>
