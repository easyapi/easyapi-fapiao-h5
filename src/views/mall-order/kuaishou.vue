<script setup lang='ts'>
import { showConfirmDialog, showToast } from 'vant'
import makeMixins from '../make/mixins/make'
import kuaishou01 from '@/assets/images/kuaishou-01.png'
import kuaishou02 from '@/assets/images/kuaishou-02.png'
import { showImagePreview } from 'vant';

const { checkEmailMobile } = makeMixins()

const state = reactive({
  shopName: '娃哈哈',
  orderForm: {
    number: '',
    price: '',
    email: '',
  },
  keyboardShow: false,
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
  showTip: false,
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
  state.showTip = true
}

const showPreview = (index: any) => {
  // 调用函数式预览
  showImagePreview({
    images: [kuaishou01, kuaishou02],
    startPosition: index,
    closeable: true
  });
};

function receiveCompany(val: any) {
  state.company = val
}

function receiveCategory(val) {
  state.invoiceForm.category = val
}
</script>

<template>
  <div class="mall-order">
    <div class="image">
      <img src="https://qiniu.easyapi.com/mall/kuaishou.png">
    </div>
    <div class="title">
      {{ state.shopName }}快手店铺——订单开票
    </div>
    <Invoice
      :is-show="false"
      :is-hide="false"
      :invoice-form="state.invoiceForm"
      :company="state.company"
      @get-company="receiveCompany"
      @get-invoice-category="receiveCategory"
    />
    <van-cell-group title="订单信息" inset>
      <van-field
        v-model="state.orderForm.number"
        label="订单号"
        placeholder="请输入快手订单号"
        required
      />
      <van-field
        v-model="state.orderForm.price"
        readonly
        clickable
        label="金额"
        placeholder="请输入快手订单金额"
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
      我不知道快手订单在哪里
    </div>
    <van-cell-group title="接收方式" inset>
      <van-field
        v-model="state.orderForm.email"
        label="邮箱"
        placeholder="请输入接收邮箱"
      />
    </van-cell-group>
    <div class="tips">
      <!-- <p>xxxxxx</p>
      <p>xxxxxx</p> -->
    </div>
    <div class="bottom fixed-bottom-bgColor">
      <van-button type="primary" class="submit" block @click="makeInvoice">
        开票
      </van-button>
    </div>
  </div>
  <van-dialog v-model:show="state.showTip" title="温馨提示">
    <div class="img-tip">
      <div>
        <div class="tip-text">
          第1步：找到商家客服，点击底部的订单查询。
        </div>
        <img src="@/assets/images/kuaishou-01.png" alt="" class="img-size"  @click="showPreview(0)" />
      </div>
      <div>
        <div class="tip-text">
          第2步，点击要开票的订单号后面的复制图标，复制快手订单编号。
        </div>
        <img src="@/assets/images/kuaishou-02.png" alt="" class="img-size"   @click="showPreview(1)" />
      </div>
    </div>
  </van-dialog>
</template>

<style lang='less'>
@import './mall-order.less';
</style>
