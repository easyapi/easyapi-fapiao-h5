<script setup lang='ts'>
import invoice from '@/api/invoice'
import outOrder from '@/api/out-order'
import { useStore } from '@/stores'
import { idTypes, vehicleTypes } from '@/utils/business'
import { triggerDownload } from '@/utils/download'
import { copyText } from '@/utils/invoice'
import { getIconByStatements } from '@/utils/invoice-category'
import Clipboard from 'clipboard'
import { closeToast, showDialog, showImagePreview, showLoadingToast, showToast } from 'vant'

const store = useStore()
const route = useRoute()
const router = useRouter()

const state = reactive({
  outOrderCount: 0,
  popupVisible: false,
  showEmail: false,
  email: '',
  invoiceDetail: {
    state: 0,
    category: '',
    statements: '',
    auditState: '',
    consoleReason: '',
    purchaserName: '',
    purchaserTaxpayerNumber: '',
    purchaserAddress: '',
    purchaserPhone: '',
    purchaserBank: '',
    purchaserBankAccount: '',
    price: '',
    remark: '',
    email: '',
    mobile: '',
    updateTime: '',
    electronicInvoiceImg: '',
    electronicInvoiceUrl: '',
    url: '',
  } as any,
  copyInfo: '',
  attachList: [],
})

/**
 * 查看发票
 */
function viewPicture() {
  if (state.invoiceDetail.state === 1)
    state.popupVisible = true
  else
    showToast(`发票${state.invoiceDetail.statements}`)
}

/**
 * 前往外部订单列表
 */
function gotoOutOrder() {
  router.push({
    path: '/invoice/out-order',
    query: { id: route.query.id },
  })
}

function copyLink(value) {
  if (value) {
    showDialog({
      title: '发票信息',
      message: `<div class="copy_invoice">${state.copyInfo}<div>`,
      allowHtml: true,
    })
  }
  const newClipboard = new Clipboard('.copyPdfUrl')
  newClipboard.on('success', () => {
    showToast('复制成功')
  })
  newClipboard.on('error', () => {
    showToast('复制失败')
  })
}

/**
 * 获取发票详情
 */
function getInvoiceDetail() {
  showLoadingToast({
    duration: 0,
    message: '加载中...',
    forbidClick: true,
  })
  invoice.getInvoice(route.query.id).then((res) => {
    closeToast()
    if (res.code === 1) {
      state.invoiceDetail = res.content
      state.invoiceDetail.downloadUrl = res.content.downloadUrl ? res.content.downloadUrl : res.content.electronicInvoiceUrl
      state.copyInfo = copyText(res.content)
      state.attachList = res.content.invoiceExtends && res.content.invoiceExtends.length > 0 ? res.content.invoiceExtends.filter(item => item.fieldKey === 'attch' && item.fieldValue)[0].fieldValue.split(',') : []
      showIdTypeAndVehicle()
    }
  })
}

/**
 * 获取外部订单数量
 */
function getOutOrderCount() {
  outOrder.getOutOrderCount({ invoiceId: route.query.id }).then((res) => {
    if (res.code === 1)
      state.outOrderCount = res.content
  })
}

function openShowEmail() {
  state.showEmail = true
  state.email = state.invoiceDetail.email
}

/**
 * 发送邮箱
 */
function sendToEmail() {
  if (!state.email)
    return showToast('请输入邮箱')
  const params = {
    email: state.email,
    outOrderNo: state.invoiceDetail.outOrderNo,
  }
  invoice.sendEmail(params).then((res) => {
    if (res.code === 1) {
      showToast(res.message)
      state.showEmail = false
    }
  })
}

function viewImagePreview(imgs: any, index: number) {
  showImagePreview({
    images: imgs,
    startPosition: index,
  })
}

/**
 * 转换证件类型和交通工具
 */
function showIdTypeAndVehicle() {
  state.invoiceDetail.specificBusiness.forEach((item) => {
    const idType = idTypes.find(type => type.value === Number(item?.idType))
    const vehicleType = vehicleTypes.find(type => type.value === item?.vehicleType)
    item.idType = idType ? idType.text : ''
    item.vehicleType = vehicleType ? vehicleType.text : ''
  })
}

async function downloadInvoice() {
  try {
    await triggerDownload(state.invoiceDetail.electronicInvoiceUrl ? state.invoiceDetail.electronicInvoiceUrl : state.invoiceDetail.downloadUrl)
  }
  catch {
    showToast('下载失败，请重试')
  }
}

onMounted(() => {
  document.title = '发票详情'
  getInvoiceDetail()
  getOutOrderCount()
})
</script>

<template>
  <Header v-if="store.ifShowH5NavBar" header-title="发票详情" />
  <div class="invoice-detail">
    <div class="types">
      <van-icon :name="getIconByStatements(state.invoiceDetail.statements)" size="20" />
      {{ state.invoiceDetail.statements }}
    </div>
    <van-cell-group inset @click="viewPicture">
      <van-cell :title="`${state.invoiceDetail.category}`" is-link />
      <van-cell
        v-if="state.outOrderCount > 0" :title="`1张发票，含${state.outOrderCount}个订单`"
        :label="state.invoiceDetail.updateTime" is-link @click="gotoOutOrder"
      />
      <van-cell v-if="state.invoiceDetail.consoleReason" title="原因：">
        <van-tag type="warning">
          {{ state.invoiceDetail.consoleReason }}
        </van-tag>
      </van-cell>
    </van-cell-group>
    <van-cell-group title="发票详情" inset>
      <van-cell :value="state.invoiceDetail.purchaserName" title="发票抬头" />
      <van-cell :value="state.invoiceDetail.purchaserTaxpayerNumber" title="税号" />
      <van-cell :value="`${state.invoiceDetail.purchaserAddress}&nbsp;&nbsp;${state.invoiceDetail.purchaserPhone}`" title="地址、电话" />
      <van-cell :value="`${state.invoiceDetail.purchaserBank}&nbsp;&nbsp;${state.invoiceDetail.purchaserBankAccount}`" title="开户行及账号" />
      <van-cell :value="state.invoiceDetail.price" title="发票金额">
        ￥{{ state.invoiceDetail.price }}
      </van-cell>
      <van-cell :value="state.invoiceDetail.remark" title="备注" />
    </van-cell-group>
    <van-cell-group v-for="(item, index) in state.invoiceDetail.specificBusiness" :key="index" :title="`出行人${index + 1}信息`" inset>
      <van-cell :value="item.traveler" title="出行人" />
      <van-cell :value="item.travelDate" title="出行日期" />
      <van-cell :value="item.idType" title="证件类型" />
      <van-cell :value="item.idNumber" title="证件号码" />
      <van-cell :value="item.travelDeparturePlace" title="出发地" />
      <van-cell :value="item.travelDestinationPlace" title="目的地" />
      <van-cell :value="item.vehicleType" title="交通工具" />
      <van-cell :value="item.level" title="等级" />
    </van-cell-group>
    <div v-if="state.attachList.length > 0" class="card">
      <div class="title">
        附件
      </div>
      <div class="attachment">
        <img
          v-for="(item, index) in state.attachList" :key="index" :src="`${item}!icon.jpg`"
          @click="viewImagePreview(state.attachList, index)"
        >
      </div>
    </div>
    <van-cell-group v-if="state.invoiceDetail.category.includes('电子')" title="接收方式" inset>
      <van-cell :value="state.invoiceDetail.email" title="电子邮件" />
      <van-cell :value="state.invoiceDetail.mobile" title="手机号码" />
    </van-cell-group>
    <van-cell-group
      v-if="state.invoiceDetail.category === '增值税普通发票' || state.invoiceDetail.category === '增值税专用发票'"
      title="接收方式" inset
    >
      <van-field label="收件人" readonly />
      <van-field label="手机号码" readonly />
    </van-cell-group>
    <van-action-bar v-if="state.invoiceDetail.state === 1">
      <van-action-bar-button
        data-clipboard-action="copy" class="copyPdfUrl" :data-clipboard-text="state.copyInfo"
        color="#01a8b9" text="复制发票信息" @click="copyLink(true)"
      />
      <van-action-bar-button color="#409eff" text="预览发票" @click="viewPicture" />
      <van-action-bar-button
        v-if="state.invoiceDetail.category.includes('电子')" type="success" text="发送邮箱"
        @click="openShowEmail"
      />
    </van-action-bar>
    <van-popup v-model:show="state.showEmail" align="center" class="send-email">
      <div class="title">
        发送邮箱
      </div>
      <van-field v-model="state.email" clickable label="邮箱" placeholder="请输入邮箱" required border />
      <van-button type="primary" block @click="sendToEmail">
        发送
      </van-button>
    </van-popup>
    <van-popup v-model:show="state.popupVisible">
      <div class="invoice-preview">
        <div class="title">
          发票预览
        </div>
        <img :src="state.invoiceDetail.electronicInvoiceImg" alt="" @click="viewImagePreview([state.invoiceDetail.electronicInvoiceImg], 0)">
        <div class="downloadUrl">
          <span>发票下载地址：</span>
          <a :href="state.invoiceDetail.downloadUrl">{{ state.invoiceDetail.downloadUrl }}</a>
        </div>
        <div class="copyPdfUrl_btn">
          <div>
            <van-button
              type="primary"
              data-clipboard-action="copy"
              class="copyPdfUrl"
              :data-clipboard-text="state.invoiceDetail.downloadUrl"
              block
              @click="copyLink(false)"
            >
              仅复制下载地址
            </van-button>
          </div>
          <div>
            <van-button
              type="success"
              block
              @click="downloadInvoice"
            >
              发票下载
            </van-button>
          </div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<style lang='less'>
.invoice-detail {
  margin-bottom: 65px;

  .types {
    position: absolute;
    top: 0;
    margin: 0 auto;
    background-color: #00B2C7;
    color: white;
    width: 100%;
    height: 120px;
    line-height: 80px;
    font-size: 22px;
    text-align: center;
    border-bottom-left-radius: 20px;
    border-bottom-right-radius: 20px;
  }

  .van-cell__value {
    min-width: 70%;
    text-align: left;

    span {
      display: inline-block;
      word-break: break-all;
    }
  }
}

.send-email {
  padding: 20px;

  .title {
    font-size: 18px;
  }

  .van-field {
    margin: 20px 0;
    flex-wrap: nowrap;
  }
}

.copy_invoice {
  word-break: break-all !important;
  text-align: left !important;
  line-height: 24px;
}
</style>

<style lang='less' scoped>
.invoice-detail {
  padding-top: 80px;

  .card {
    padding: 0 15px;

    .title {
      color: #969799;
      padding: 15px 0;
    }

    .attachment {
      padding: 15px 15px 5px 15px;
      background: #fff;
      border-radius: 8px;
      overflow: hidden;
      display: flex;
      flex-wrap: wrap;

      img {
        width: 120px;
        height: 120px;
        margin-right: 10px;
        margin-bottom: 10px;
      }
    }
  }
}

.invoice-preview {
  padding: 20px;

  .title {
     font-size: 18px;
     text-align: center;
  }

  img {
    width: 100%;
     margin-top: 10px;
  }

  .downloadUrl {
    margin-top: 10px;
    line-height: 24px;

    a {
      overflow-wrap: break-word;
      word-break: break-all;
      color: #007BFF;
    }
  }

  .copyPdfUrl_btn {
    margin-top: 10px;
    display: flex;
    justify-content: space-between;

    div {
      width: 49%;
    }
  }
}
</style>
