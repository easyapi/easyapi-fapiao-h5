<script setup lang='ts'>
import { showConfirmDialog, showDialog, showToast } from 'vant'
import makeMixins from '../make/mixins/make'

const { checkEmailMobile } = makeMixins()

const state = reactive({
  shopName: '娃哈哈',
  orderForm: {
    number: '',
    price: '',
    email: '',
  },
  keyboardShow: false,
  isShow: false,
  isHide: false,
  company: {
    companyId: '',
  },
  invoiceForm: {
    outOrderNo: `H5${new Date().getTime()}`,
    type: '企业',
    category: '增值税电子普通发票',
    purchaserName: '',
    purchaserTaxpayerNumber: '',
    purchaserAddress: '',
    purchaserPhone: '',
    purchaserBank: '',
    purchaserBankAccount: '',
    mobile: '',
    email: '',
    remark: '',
    price: 0.0,
    companyId: '',
    outOrderIds: '',
  },
})

/**
 * 点击开票
 */
function makeInvoice() {
  if (state.orderForm.number === '') {
    showToast('请输入订单号')
    return
  }

  if (state.orderForm.price === '') {
    showToast('请输入订单金额')
    return
  }

  if (!checkEmailMobile(state.orderForm))
    return
  showConfirmDialog({
    title: '提示',
    message: '确认抬头和金额正确并申请开票吗？',
  }).then(() => {
  })
}

/**
 * 点击提示
 */
function openTips() {
  showDialog({
    title: '温馨提示',
    message: '代码是写出来给人看的，附带能在机器上运行。',
  }).then(() => {
    // on close
  })
}

function receiveCompany(val) {
  state.company = val
}
</script>

<template>
  <div class="mall-order">
    <div class="image">
      <img src="https://qiniu.easyapi.com/mall/youzan.png">
    </div>
    <div class="title">
      {{ state.shopName }}有赞订单开票
    </div>
    <Invoice
      :is-show="state.isShow"
      :is-hide="state.isHide"
      :invoice-form="state.invoiceForm"
      :company="state.company"
      @get-company="receiveCompany"
      @get-invoice-category="receiveCategory"
    />

    <van-cell-group title="订单信息" inset>
      <van-field
        v-model="state.orderForm.number"
        label="订单号"
        placeholder="请输入有赞订单号"
        required
      />
      <van-field
        v-model="state.orderForm.price"
        readonly
        clickable
        label="金额"
        placeholder="请输入有赞订单金额"
        required
        @touchstart.stop="state.keyboardShow = true"
      />
      <van-number-keyboard
        v-model="state.orderForm.price"
        :show="state.keyboardShow"
        theme="custom"
        extra-key="."
        close-button-text="完成"
        @blur="state.keyboardShow = false"
      />
    </van-cell-group>
    <div class="tips-forget" @click="openTips">
      我不知道订单在哪里
    </div>
    <van-cell-group title="接收方式" inset>
      <van-field
        v-model="state.orderForm.email"
        label="邮箱"
        placeholder="请输入接收邮箱"
      />
    </van-cell-group>
    <div class="tips">
      <p>xxxxxx</p>
      <p>xxxxxx</p>
    </div>
    <div class="bottom fixed-bottom-bgColor">
      <van-button type="primary" class="submit" block @click="makeInvoice">
        开票
      </van-button>
    </div>
  </div>
</template>

<style lang='less' scoped>
@import './mall-order.less';
</style>
