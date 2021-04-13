<template>
  <div>
    <Header @head-back="goBack()" :headerTitle="headerTitle" v-if="show"></Header>
    <div class="invoiced" style="margin-top: 5px">
      <a @click="viewPicture">
        <van-cell :title=" invoiceDetail.category+ '（' + invoiceDetail.statements + '）'" is-link></van-cell>
        <van-cell v-if="invoiceDetail.auditState" title="未通过原因："><van-tag type="warning">{{invoiceDetail.consoleReason}}</van-tag></van-cell>
      </a>
    </div>
    <div class="page-part invoice-con">
      <p>发票详情</p>
      <van-cell :value="invoiceDetail.purchaserName" title="发票抬头"/>
      <van-cell :value="invoiceDetail.purchaserTaxpayerNumber" title="税号"/>
      <van-cell :value="invoiceDetail.purchaserAddress+invoiceDetail.purchaserPhone" title="地址、电话"/>
      <van-cell :value="invoiceDetail.purchaserBank+invoiceDetail.purchaserBankAccount" title="开户行及账号"/>
      <van-cell :value="invoiceDetail.price" title="发票金额"/>
      <van-cell :value="invoiceDetail.remark" title="备注"/>
    </div>
    <div class="page-part" v-show="invoiceDetail.category=='增值税电子普通发票'">
      <p>接收方式</p>
      <van-field label="电子邮件" v-model="invoiceDetail.email"/>
      <van-field label="联系方式" v-model="invoiceDetail.addrMobile"/>
      <a @click="goAssociatedOrder">
        <van-cell :title="'1张发票，含'+ invoiceItems.length + '个商品'" :label="invoiceDetail.updateTime" is-link></van-cell>
      </a>
      <!-- <div class="bottom"> -->
      <!--<mt-button class="submit" @click="goElectronicInvoice">重发电子发票与订单</mt-button>-->
      <!-- </div> -->
    </div>
    <div class="page-part" v-show="invoiceDetail.category=='增值税普通发票' ||invoiceDetail.category=='增值税专用发票'">
      <p>接收方式</p>
      <van-field label="收件人" readonly></van-field>
      <van-field label="联系方式" readonly></van-field>
      <!--<van-cell title="邮寄地址" :value="address.province + address.city + address.district + address.addr"-->
      <!--readonly></van-cell>-->
    </div>
    <van-popup
      v-model="popupVisible"
      style="padding:30px"
      align="center">
      <p style="fontSize:17px">发票预览</p>
      <img :src="imgUrl" alt="" style="width:350px">
      <div style="margin-bottom:20px">
        <van-button
          type="info"
          data-clipboard-action="copy"
          class="copyPdfUrl submit"
          :data-clipboard-text="url"
          @click="copyLink"
        >复制发票下载地址
        </van-button>
      </div>
      <div style="width:200px,fontSize:12px">
        <textarea :value="url" style="width:300px"/>
      </div>
      <p style="margin-top:7px">复制发票下载地址并在浏览器中打开进行下载</p>
    </van-popup>
  </div>
</template>

<script>
  import { getInvoice, getOutOrderList } from "../../../api/invoice";
  import Header from "../../../components/Header.vue";
  import Clipboard from "clipboard";

  export default {
    name: "InvoiceDetail",
    components: {
      Header
    },
    data() {
      return {
        headerTitle: "发票详情",
        active: "tab-container1",
        invoiceDetail: {},
        invoiceItems: [],
        invoiceDetailItems: [],
        serviceType: "",
        url: "",
        imgUrl: "",
        popupVisible: false
      };
    },

    methods: {
      //查看发票
      viewPicture() {
        if (this.invoiceDetail.state === 1) {
          this.popupVisible = true;
        } else if (this.invoiceDetail.state === 2) {
          this.$toast("当前发票作废了");
        } else if (this.invoiceDetail.state === 3) {
          this.$toast("当前发票退票中");
        } else if (this.invoiceDetail.state === 4) {
          this.$toast("正在开票中");
        } else {
          this.$toast("等待后台审核通过");
        }
      },
      goBack() {
        history.go(-1);
      },
      goElectronicInvoice() {
        this.$router.push(`/invoice/out-order`);
      },
      getInvoiceDetail() {
        getInvoice(this.$route.query.id).then(res => {
          this.invoiceDetail = res.data.content;
          this.url = res.data.content.electronicInvoiceUrl;
          this.imgUrl = res.data.content.electronicInvoiceImg;
          this.serviceType = res.data.content.serviceType;
          this.invoiceItems = this.invoiceDetail.invoiceItems;
        }).catch(error => {
          Toast(error.response.data.message);
        });
      },
      getOutOrderList() {
        console.log(11);
        let params = {
          invoiceId: this.$route.query.id
        };
        getOutOrderList(params).then(res => {
          this.invoiceDetailItems = res.data.content;
        }).catch(error => {
          Toast(error.response.data.message);
        });
      },
      goAssociatedOrder() {
        this.$router.push({
          path: "/invoice/out-order",
          query: { id: this.$route.query.id }
        });
      },
      copyLink() {
        let _this = this;
        let clipboard = new this.clipboard(".copyPdfUrl");
        clipboard.on("success", function() {
          _this.$toast({ message: "复制成功", className: "top-toast" });
        });
        clipboard.on("error", function() {
          _this.$toast({ message: "复制失败", className: "top-toast" });
        });
      }
    },
    created() {
      this.id = this.$route.query.id;
    },
    watch: {},
    computed: {
      show() {
        return this.$store.state.ifShowH5NavBar;
      }
    },
    mounted() {
      this.getInvoiceDetail();
      this.getOutOrderList();
    }
  };
</script>

<style scoped>
  .tag {
    margin-left: 16px;
  }

  .invoiced {
    margin-top: 60px;
  }

  .page-part p {
    height: 40px;
    line-height: 40px;
    margin-left: 10px;
    color: #666;
  }

  .page-part a {
    border-bottom: 1px solid #f4f4f4;
  }

  .bottom {
    padding: 0 10px;
    margin-top: 20px;
  }

  .bottom .submit {
    width: 100%;
    background: #56cbf6;
    border: none;
    height: 50px;
    border-radius: 10px;
    color: #fff;
  }

  .mint-cell-wrapper {
    background: none !important;
  }

  .submit {
    border: none;
    height: 40px;
    border-radius: 5px;
    color: #fff;
  }

  .van-button__text {
    font-size: 15px;
    font-weight: 500;
    /* letter-spacing:2px;
    text-indent: 2px */
  }

  .van-cell__value {
    min-width: 74%;
    text-align: left;
  }
</style>
