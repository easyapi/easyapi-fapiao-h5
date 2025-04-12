<script setup lang='ts'>
import invoice from '@/api/invoice'
import mallOrder from '@/api/mall-order'
import kuaishou01 from '@/assets/images/kuaishou-01.png'
import kuaishou02 from '@/assets/images/kuaishou-02.png'
import { copyText } from '@/utils/invoice'
import { getColorByStatements, invoiceTag } from '@/utils/invoice-category'
import { localStorage } from '@/utils/local-storage'
import { validEmail } from '@/utils/validate'
import Clipboard from 'clipboard'
import { closeToast, showConfirmDialog, showImagePreview, showLoadingToast, showToast } from 'vant'

const route = useRoute()
const router = useRouter()

const state = reactive({
  taxNumber: '' as any,
  qrCode: '' as any,
  shopInfo: null as any,
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
  showTipDialog: false,
  showInvoiceListDialog: false,
  invoiceList: [],
  ifCopy: false,
})

/**
 * 获取订单详情
 */
function getOrderDetail() {
  if (!state.outOrderNo) {
    return
  }
  if (state.outOrderNo.length !== 16) {
    return showToast('快手小店订单号为16位，请仔细检查')
  }
  showLoadingToast({
    message: '加载中...',
    forbidClick: true,
    duration: 0,
  })
  const params = {
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
      clearOrderDetail()
    }
  }).catch(() => {
    clearOrderDetail()
  })
}

function onChange() {
  if (state.outOrderNo.length === 16) {
    getOrderDetail()
    return
  }
  if (state.orderDetail) {
    clearOrderDetail()
  }
}

/**
 * 查找单条电商平台信息
 */
function findMall() {
  const params = {
    taxNumber: state.taxNumber,
    qrCode: state.qrCode,
  }
  mallOrder.findMall(params).then((res) => {
    if (res.code === 1) {
      state.shopInfo = res.content
    }
  })
}

/**
 * 根据订单号获取发票列表
 */
function getInvoiceListByOutOrderNo() {
  return new Promise((resolve) => {
    invoice.getInvoiceListByOutOrderNo(state.outOrderNo).then((res) => {
      if (res.code === 1) {
        state.invoiceList = res.content
        resolve(true)
      }
      else {
        state.invoiceList = []
        resolve(false)
      }
    })
  })
}

/**
 * 点击开票
 */
async function makeInvoice() {
  if (!state.outOrderNo) {
    return showToast('请输入快手小店订单号')
  }
  if (!state.invoiceForm.category) {
    return showToast('请选择发票类型')
  }
  if (!state.invoiceForm.purchaserName) {
    return showToast(state.invoiceForm.type === '企业' ? '请选择发票抬头' : '请输入发票抬头')
  }
  if (!state.invoiceForm.email) {
    return showToast('请输入接收邮箱')
  }
  if (!validEmail(state.invoiceForm.email)) {
    return showToast('邮箱格式不正确')
  }
  // 根据订单号获取发票列表
  if (await getInvoiceListByOutOrderNo()) {
    state.showInvoiceListDialog = true
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
    const data = {
      ...state.orderDetail,
      ...state.invoiceForm,
      mallCode: 'kuaishou',
      taxNumber: state.taxNumber,
      shopName: state.shopInfo.shopName,
      shopCode: state.shopInfo.shopCode,
    }
    delete data.companyId
    mallOrder.createMallOrder(data).then((res) => {
      closeToast()
      if (res.code === 1) {
        showToast(res.message)
        state.outOrderNo = ''
        clearOrderDetail()
      }
    })
  })
}

/**
 * 点击提示
 */
function openTips() {
  state.showTipDialog = true
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

/**
 * 跳转详情
 */
function gotoDetail(id: any) {
  if (state.ifCopy) {
    return
  }
  router.push({ path: '/invoice/detail', query: { id } })
  clearOrderDetail()
}

/**
 * 复制
 */
function copyLink() {
  state.ifCopy = true
  const newClipboard = new Clipboard('.copyBtn')
  newClipboard.on('success', () => {
    showToast('复制成功')
    state.ifCopy = false
  })
  newClipboard.on('error', () => {
    showToast('复制失败')
    state.ifCopy = false
  })
}

/**
 * 清除订单详情
 */
function clearOrderDetail() {
  state.orderDetail = null
  sessionStorage.removeItem('orderDetail')
}

onMounted(() => {
  document.title = '快手小店订单开票'
  if (route.query.taxNumber && route.query.qrCode) {
    state.taxNumber = route.query.taxNumber
    state.qrCode = route.query.qrCode
    findMall()
  }
  else {
    showToast('请联系小店客服，重新索取开票地址或二维码')
    return
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
      {{ state.shopInfo?.shopName }} 快手小店订单开票
    </div>
    <van-cell-group title="订单信息" inset>
      <van-field v-model="state.outOrderNo" label="快手小店订单编号" placeholder="请输入快手小店订单编号" required clearable
        @blur="getOrderDetail" @input="onChange" @clear="clearOrderDetail">
        <template #button>
          <van-button size="small" icon="search" type="primary" @click="getOrderDetail">
            查询
          </van-button>
        </template>
      </van-field>
      <van-field v-if="state.orderDetail && state.orderDetail.price" v-model="state.orderDetail.price" label="开票金额"
        readonly class="price" />
    </van-cell-group>
    <div class="tips-forget" @click="openTips">
      我不知道快手小店订单编号在哪里
    </div>
    <div v-if="state.orderDetail">
      <Invoice :is-show="false" :is-hide="false" :invoice-form="state.invoiceForm"
        @get-invoice-category="receiveCategory" />
      <van-cell-group title="接收方式" inset>
        <van-field v-model="state.invoiceForm.email" label="邮箱" placeholder="请输入接收邮箱" required />
      </van-cell-group>
    </div>
    <div class="tips">
      <p>注：</p>
      <p>1、请确认快手小店订单是否已签收，签收完成后方可申请开票</p>
      <p>2、开票申请提交后，请耐心等待审核开具，预计24-48小时完成</p>
    </div>
    <div class="bottom fixed-bottom-bgColor">
      <van-button type="primary" class="submit" block @click="makeInvoice">
        开票
      </van-button>
    </div>
    <van-dialog v-model:show="state.showTipDialog" title="温馨提示" close-on-click-overlay>
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
    <van-dialog v-model:show="state.showInvoiceListDialog" title="开票记录" close-on-click-overlay>
      <div class="record-list">
        <div v-for="(item, index) in state.invoiceList" :key="index" class="record-list_item"
          @click="gotoDetail(item.invoiceId)">
          <div class="record-list_item_top">
            <div>
              <span class="price">￥{{ item.price }}</span>
              <van-tag :color="invoiceTag(item.category).color">
                {{ invoiceTag(item.category).name }}
              </van-tag>
            </div>
            <span :style="`color:${getColorByStatements(item.statements)}`" class="status">{{ item.statements }}</span>
          </div>
          <div class="record-list_item_bottom">
            <p class="text">
              <span>{{ item.purchaserName }}</span>
            </p>
            <p class="record-list_item_bottom_time">
              <span>{{ item.addTime }}</span>
              <van-button v-if="item.state === 1" class="copyBtn" size="mini" type="primary"
                data-clipboard-action="copy" :data-clipboard-text="copyText(item)" @click="copyLink">
                复制发票信息
              </van-button>
            </p>
          </div>
        </div>
      </div>
    </van-dialog>
  </div>
</template>

<style lang='less'>
@import './mall-order.less';
</style>

<style lang='less' scoped>
.record-list {
  padding: 0 10px 10px;

  .record-list_item {
    background: url('@/assets/images/record-bg.png') no-repeat center;
    background-size: 100% 100%;
    padding: 10px;
    margin-top: 10px;

    .record-list_item_top {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .status {
        color: #1989fa;
      }

      .price {
        color: #ff4848;
        margin-right: 10px;
      }
    }

    .record-list_item_bottom {
      margin-top: 30px;

      .text {
        color: #333;
        font-size: 14px;
      }

      .record-list_item_bottom_time {
        margin-top: 10px;
        color: #666;
        font-size: 12px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
    }
  }
}
</style>
