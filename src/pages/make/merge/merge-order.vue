<template>
  <div>
    <Header
      @head-back="goBack()"
      :headerTitle="headerTitle"
      v-if="show"
    ></Header>
    <div class="nav" style="margin-top: 0px">
      <div id="loading">
        <van-loading color="#56cbf6" v-show="loadingList"/>
      </div>
      <Invoice :isShow="isShow" :isHide="isHide" :ifElectronic="ifElectronic" :invoiceForm="invoiceForm"
               :ifPaper="ifPaper" :company="company"
               @getcategorydata="receiveCategory" @getpropertydata="receiveProperty"></Invoice>
    </div>
    <div class="invoice-contents">
      <p>发票内容</p>
      <van-field label="发票内容" v-model="orderType" readonly></van-field>
      <van-field
        class="merge-order_price"
        label="发票金额"
        v-model="invoiceForm.price"
        readonly
      ></van-field>
      <van-field label="发票备注" v-model="invoiceForm.remark" :placeholder="remarkPlaceholder"></van-field>
    </div>
    <Receive :ifElectronic="ifElectronic" :invoiceForm="invoiceForm" :address="address"></Receive>
    <div class="bottom">
      <van-button
        type="info"
        class="submit"
        @click="makeInvoice"
      >提交
      </van-button>
    </div>
  </div>
</template>

<script>
  import {mergeMakeInvoice} from "../../../api/make";
  import Header from "../../../components/Header.vue";
  import {Toast} from "vant";
  import {Dialog} from 'vant';
  import Invoice from "../../../components/make/Invoice";
  import Receive from "../../../components/make/Receive";
  import makeMixins from "../mixins/make";

  export default {
    name: "MergeOrder",
    components: {
      Header,
      Invoice,
      Receive
    },
    mixins: [makeMixins],
    data() {
      return {
        headerTitle: "开具电子发票",
        loadingList: true,
        ifElectronic: localStorage.getItem("ifElectronic"),
        ifPaper: localStorage.getItem("ifPaper"),
        isShow: false,
        isHide: true,
        orderType: "",
        company: {},
        address: {},
        outOrderIds: "",
        invoiceForm: {
          type: "企业",
          category: "增值税电子普通发票",
          property: localStorage.getItem("ifElectronic") === 'true' ? "电子" : "纸质",
          purchaserName: "",
          purchaserTaxpayerNumber: "",
          purchaserAddress: "",
          purchaserPhone: "",
          purchaserBank: "",
          purchaserBankAccount: "",
          addrMobile: "",
          email: "",
          remark: "",
          price: 0.0
        },
      };
    },
    computed: {
      show() {
        return this.$store.state.ifShowH5NavBar;
      }
    },
    methods: {
      goBack() {
        history.go(-1);
      },
      getOrder() {
        this.orderType = localStorage.getItem("orderType");
        this.invoiceForm.price = localStorage.getItem("tot");
        this.seletedOutOrderList = JSON.parse(localStorage.getItem("seleted"));
        for (let i = 0; i < this.seletedOutOrderList.length; i++) {
          this.outOrderIds += this.seletedOutOrderList[i].outOrderId + ",";
          this.invoiceForm.outOrderIds = this.outOrderIds;
          this.invoiceForm.category = "增值税电子普通发票";
          this.invoiceForm.property = "电子";
        }
      },
      /**
       * 提交开票信息
       */
      makeInvoice() {
        if (this.invoiceForm.type === '个人') {
          if (this.invoiceForm.purchaserName == "") {
            return Toast("请输入发票抬头");
          }
        }
        this.checkEmailMobile()
        if (!this.ifCheckEmailMobile) {
          return;
        }
        Dialog.confirm({
          title: '提示',
          message: '确认抬头和金额正确并申请开票吗？',
        }).then(() => {
          Toast.loading({
            message: '开票中...',
            forbidClick: true,
          });
          mergeMakeInvoice(this.invoiceForm).then((res) => {
            if (res.data.code === 1) {
              Toast.clear();
              this.$router.push(`/make/success`);
            }
          }).catch((error) => {
            Toast(error.response.data.message);
          });
        }).catch(() => {
        });
      },
      changeElectronic() {
        this.invoiceForm.category = "增值税电子普通发票";
        this.invoiceForm.property = "电子";
      },
      changePaper() {
        this.invoiceForm.property = "纸质";
        this.invoiceForm.category = "增值税普通发票";
      },
    },
    watch: {},
    created() {
      if (localStorage.getItem("type")) {
        this.invoiceForm.type = localStorage.getItem("type");
      }
    },
    activated() {
      event.$on("select", function (data) {
        this.address = data;
        this.$forceUpdate();
      });
    },
    mounted() {
      this.getOrder();
    }
  };
</script>

<style scoped>
  @import "../make.css";

  .van-cell__value {
    min-width: 74%;
  }

  .page-part .van-cell__title {
    width: 6.2em;
    flex: none;
  }

  .page-part .van-cell__value {
    flex: 3;
    text-align: left;
  }

  .twoBox {
    height: 70px;
    /* border: 2px solid blue; */
    text-align: center;
    background: #fff;
    padding: 20px 10px
  }

  .blueBox {
    box-sizing: border-box;
    padding: 17px 0;
    font-size: 15px;
    height: 70px;
    border: 1px solid #1989fa;
    color: #1989fa;
    border-radius: 4px;
  }

  .grayBox {
    box-sizing: border-box;
    padding: 17px 0;
    font-size: 15px;
    height: 70px;
    border: 1px solid #999;
    color: #999;
    border-radius: 4px;
  }
</style>
