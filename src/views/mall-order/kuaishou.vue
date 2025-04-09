<script setup lang='ts'>
import mallOrder from '@/api/mall-order'
import kuaishou01 from '@/assets/images/kuaishou-01.png'
import kuaishou02 from '@/assets/images/kuaishou-02.png'
import { localStorage } from '@/utils/local-storage'
import { closeToast, showConfirmDialog, showImagePreview, showLoadingToast, showToast } from 'vant'

const route = useRoute()

const state = reactive({
  taxNumber: '' as any,
  qrCode: '' as any,
  shopName: '',
  outOrderNo: '' as any,
  orderDetail: null as any,
  invoiceForm: {
    type: '企业',
    category: '增值税电子普通发票',
    purchaserName: '',
    purchaserTaxpayerNumber: '',
    purchaserAddress: '',
    purchaserPhone: '',
    purchaserBank: '',
    purchaserBankAccount: '',
    email: '',
  },
  showTip: false,
})

/**
 * 获取订单详情
 */
function getOrderDetail() {
  if (!state.outOrderNo) {
    return
  }
  if (state.orderDetail && state.outOrderNo === state.orderDetail.outOrderNo) {
    return
  }
  showLoadingToast({
    message: '加载中...',
    forbidClick: true,
    duration: 0,
  })
  let params = {
    oid: state.outOrderNo,
    taxNumber: state.taxNumber,
  }
  mallOrder.getOrderDetail(params).then((res) => {
    closeToast()
    if (res.code === 1) {
      if (res.content.accessToken) {
        localStorage.set('accessToken', res.content.accessToken)
        sessionStorage.setItem('orderDetail', JSON.stringify(res.content))
      }
      state.orderDetail = res.content
    }
    else {
      state.orderDetail = null
      sessionStorage.removeItem('orderDetail')
    }
  }).catch(() => {
    state.orderDetail = null
    sessionStorage.removeItem('orderDetail')
  })
}

/**
 * 查找单条电商平台信息
 */
function findMall() {
  let params = {
    taxNumber: state.taxNumber,
    qrCode: state.qrCode,
  }
  mallOrder.findMall(params).then((res) => {
    if (res.code === 1) {
      state.shopName = res.content.shopName
    }
  })
}

/**
 * 点击开票
 */
function makeInvoice() {
  if (!state.outOrderNo) {
    showToast('请输入订单号')
    return
  }
  showConfirmDialog({
    title: '提示',
    message: '确认抬头和金额正确并申请开票吗？',
  }).then(() => {
    showLoadingToast({
      message: '开票中...',
      forbidClick: true,
      duration: 0,
    })
    let data = {
      ...state.orderDetail,
      ...state.invoiceForm,
      mallCode: 'kuaishou',
      taxNumber: state.taxNumber,
      shopName: state.shopName,
    }
    delete data.companyId
    mallOrder.createMallOrder(data).then((res) => {
      closeToast()
      if (res.code === 1) {
        showToast(res.message)
        state.outOrderNo = ''
        state.orderDetail = null
        sessionStorage.removeItem('orderDetail')
      }
    })
  })
}

/**
 * 点击提示
 */
function openTips() {
  state.showTip = true
}

/**
 * 图片预览
 */
function showPreview(index: any) {
  showImagePreview({
    images: [kuaishou01, kuaishou02],
    startPosition: index,
    closeable: true,
  })
}

function receiveCategory(val: any) {
  state.invoiceForm.category = val
}

onMounted(() => {
  if (route.query.taxNumber && route.query.code) {
    state.taxNumber = route.query.taxNumber
    state.qrCode = route.query.code
    findMall()
  }
  if (sessionStorage.getItem('orderDetail')) {
    state.orderDetail = JSON.parse(sessionStorage.getItem('orderDetail'))
    state.outOrderNo = state.orderDetail.outOrderNo
  }
})
</script>

<template>
  <div class="mall-order">
    <div class="image">
      <img src="https://qiniu.easyapi.com/mall/kuaishou.png">
    </div>
    <div class="mall-order_title">
      {{ state.shopName }}快手店铺——订单开票
    </div>
    <van-cell-group title="订单信息" inset>
      <van-field
        v-model="state.outOrderNo"
        label="快手小店订单号"
        placeholder="请输入快手订单号"
        required
        @blur="getOrderDetail"
      />
      <van-field
        v-if="state.orderDetail && state.orderDetail.price"
        v-model="state.orderDetail.price"
        label="订单金额"
        readonly
        class="price"
      />
    </van-cell-group>
    <div class="tips-forget" @click="openTips">
      我不知道快手订单在哪里
    </div>
    <div v-if="state.orderDetail">
      <Invoice
        :is-show="false"
        :is-hide="false"
        :invoice-form="state.invoiceForm"
        @get-invoice-category="receiveCategory"
      />
      <van-cell-group title="接收方式" inset>
        <van-field
          v-model="state.invoiceForm.email"
          label="邮箱"
          placeholder="请输入接收邮箱"
        />
      </van-cell-group>
    </div>
    <div class="bottom fixed-bottom-bgColor">
      <van-button type="primary" class="submit" block @click="makeInvoice">
        开票
      </van-button>
    </div>
    <van-dialog v-model:show="state.showTip" title="温馨提示">
      <div class="img-tip">
        <div>
          <div class="tip-text">
            第1步：找到商家客服，点击底部的订单查询。
          </div>
          <img src="@/assets/images/kuaishou-01.png" alt="" class="img-size" @click="showPreview(0)">
        </div>
        <div>
          <div class="tip-text">
            第2步，点击要开票的订单号后面的复制图标，复制快手订单编号。
          </div>
          <img src="@/assets/images/kuaishou-02.png" alt="" class="img-size" @click="showPreview(1)">
        </div>
      </div>
    </van-dialog>
  </div>
</template>

<style lang='less'>
@import './mall-order.less';
</style>
