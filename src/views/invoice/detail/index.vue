<template>
  <div class="invoice-detail">
    <van-cell-group @click="viewPicture" inset>
      <van-cell
        :title="state.invoiceDetail.category + '（' + state.invoiceDetail.statements + '）'"
        is-link
      ></van-cell>
      <van-cell v-if="state.invoiceDetail.auditState" title="未通过原因：">
        <van-tag type="warning">{{ state.invoiceDetail.consoleReason }}</van-tag>
      </van-cell>
    </van-cell-group>

    <van-cell-group title="发票详情" inset>
      <van-cell :value="state.invoiceDetail.purchaserName" title="发票抬头" />
      <van-cell :value="state.invoiceDetail.purchaserTaxpayerNumber" title="税号" />
      <van-cell
        :value="state.invoiceDetail.purchaserAddress + state.invoiceDetail.purchaserPhone"
        title="地址、电话"
      />
      <van-cell
        :value="state.invoiceDetail.purchaserBank + state.invoiceDetail.purchaserBankAccount"
        title="开户行及账号"
      />
      <van-cell :value="state.invoiceDetail.price" title="发票金额" />
      <van-cell :value="state.invoiceDetail.remark" title="备注" />
    </van-cell-group>

    <van-cell-group
      v-if="state.invoiceDetail.category == '增值税电子普通发票'"
      title="接收方式"
      inset
    >
      <van-field label="电子邮件" v-model="state.invoiceDetail.email" />
      <van-field label="手机号码" v-model="state.invoiceDetail.addrMobile" />
      <van-cell
        @click="goAssociatedOrder"
        v-if="state.outOrderCount > 0"
        :title="'1张发票，含' + state.outOrderCount + '个订单'"
        :label="state.invoiceDetail.updateTime"
        is-link
      ></van-cell>
    </van-cell-group>

    <van-cell-group
      v-if="
        state.invoiceDetail.category == '增值税普通发票' ||
        state.invoiceDetail.category == '增值税专用发票'
      "
      title="接收方式"
      inset
    >
      <van-field label="收件人" readonly></van-field>
      <van-field label="手机号码" readonly></van-field>
    </van-cell-group>

    <van-popup v-model="state.popupVisible" style="padding: 30px" align="center">
      <p style="fontsize: 17px">发票预览</p>
      <img :src="state.invoiceDetail.electronicInvoiceImg" alt="" style="width: 350px" />
      <div style="margin-bottom: 20px">
        <van-button
          type="info"
          data-clipboard-action="copy"
          class="copyPdfUrl submit"
          :data-clipboard-text="state.invoiceDetail.url"
          @click="copyLink"
        >
          复制发票下载地址
        </van-button>
      </div>
      <div style="width: 200px; font-size: 12px">
        <textarea :value="url" style="width: 300px" />
      </div>
      <p style="margin-top: 7px">复制发票下载地址并在浏览器中打开进行下载</p>
    </van-popup>
  </div>
</template>

<script setup lang="ts">
import { showToast, showLoadingToast, closeToast } from 'vant';
import { getInvoiceApi } from '@/api/invoice';
import { getOutOrderCountApi } from '@/api/out-order';

const route = useRoute();
const router = useRouter();

const state = reactive({
  outOrderCount: 0,
  popupVisible: false,
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
    addrMobile: '',
    updateTime: '',
    electronicInvoiceImg: '',
    url: '',
  },
});

//查看发票
const viewPicture = () => {
  if (state.invoiceDetail.state === 1) {
    state.popupVisible = true;
  } else if (state.invoiceDetail.state === 2) {
    showToast('当前发票作废了');
  } else if (state.invoiceDetail.state === 3) {
    showToast('当前发票退票中');
  } else if (state.invoiceDetail.state === 4) {
    showToast('正在开票中');
  } else {
    showToast('等待后台审核通过');
  }
};

const goAssociatedOrder = () => {
  router.push({
    path: '/invoice/out-order',
    query: { id: route.query.id },
  });
};

const copyLink = () => {
  // let that = this;
  // let clipboard = new this.clipboard('.copyPdfUrl');
  // clipboard.on('success', function () {
  //   // that.$toast({ message: '复制成功', className: 'top-toast' });
  // });
  // clipboard.on('error', function () {
  //   // that.$toast({ message: '复制失败', className: 'top-toast' });
  // });
};

/**
 * 获取发票详情
 */
const getInvoiceDetail = () => {
  showLoadingToast({
    duration: 0,
    message: '加载中...',
    forbidClick: true,
  });
  getInvoiceApi(route.query.id).then(res => {
    closeToast();
    if (res.code === 1) {
      state.invoiceDetail = res.content;
    }
  });
};

/**
 * 获取外部订单数量
 */
const getOutOrderCount = () => {
  getOutOrderCountApi({ invoiceId: route.query.id }).then(res => {
    if (res.code === 1) {
      state.outOrderCount = res.content;
    }
  });
};

onMounted(() => {
  getInvoiceDetail();
  getOutOrderCount();
});
</script>
<style lang="less">
.invoice-detail {
  .van-cell__value {
    min-width: 60%;
    text-align: left;
    span {
      display: inline-block;
      word-break: break-all;
    }
  }
}
</style>
<style lang="less" scoped>
.invoice-detail {
  padding-top: 20px;

  .submit {
    border: none;
    height: 40px;
    border-radius: 5px;
    color: #fff;
  }
}
</style>