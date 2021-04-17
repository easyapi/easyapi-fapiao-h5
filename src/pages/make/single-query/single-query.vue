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
               @getInvoiceCategory="receiveCategory" @getInvoiceProperty="receiveProperty"></Invoice>
    </div>
    <div class="invoice-contents">
      <p>发票内容</p>
      <van-field name="rate" label="发票内容">
        <template #input>
          <van-tag type="primary" size="medium" :class="{active:active=='商品明细'}" @click="showDetail('商品明细')">
            商品明细
          </van-tag>
          <van-tag type="primary" plain size="medium" :class="{active:active=='商品类别'}"
                   @click="showDetail('商品类别')" style="margin-left:5px">商品类别
          </van-tag>
        </template>
      </van-field>
      <van-field
        class="merge-order_price"
        label="发票金额"
        v-model="invoiceForm.price"
        readonly
      ></van-field>
      <van-field label="发票备注" :placeholder="remarkPlaceholder" v-model="invoiceForm.remark"></van-field>
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
  import {queryShopOrder, getState} from "../../../api/query";
  import {makeInvoice} from "../../../api/make";
  import {Toast} from "vant";
  import {Dialog} from "vant";
  import Invoice from "../../../components/make/Invoice";
  import Receive from "../../../components/make/Receive";
  import makeMixins from "../mixins/make";

  export default {
    name: "singleOrder",
    components: {
      Invoice,
      Receive
    },
    mixins: [makeMixins],
    data() {
      return {
        headerTitle: "开具电子发票",
        isHide: true,
        isShow: false,
        ifElectronic: localStorage.getItem("ifElectronic"),
        ifPaper: localStorage.getItem("ifPaper"),
        active: '商品明细',
        list: [
          {
            name: '商品明细'
          },
          {
            name: '商品类别'
          }
        ],
        loadingList: true,
        outOrder: "",
        outOrderNo: "",//商户外部订单号
        address: {},
        company: {},
        invoiceForm: {
          type: "企业",
          category: "增值税电子普通发票",
          property: localStorage.getItem("ifElectronic") === "true" ? "电子" : "纸质",
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
      showDetail(name) {
        this.active = name
      },
      goBack() {
        history.go(-1);
      },
      getShopOrder() {
        getState(this.outOrderNo).then(res => {
          if (res.data.code === 1 && res.data.content) {
            this.$router.replace({path: "/invoice/detail", query: {id: res.data.content[0].invoiceId}});
          }
        });
        queryShopOrder(this.outOrderNo).then(res => {
          if (res.data.code === 1) {
            this.outOrder = res.data.content;
            this.invoiceForm.price = res.data.content.price;
          }
        });
      },
      makeInvoice() {
        if (this.invoiceForm.type === '个人' && this.invoiceForm.purchaserName === "") {
          return Toast("请输入发票抬头");
        }
        this.checkEmailMobile();
        if (!this.ifCheckEmailMobile) {
          return;
        }
        Dialog.confirm({
          title: '提示',
          message: '确认抬头正确并开票吗',
          showCancelButton: true
        }).then(action => {
          if (action === "confirm") {
            this.invoiceForm.category = "增值税电子普通发票";
            this.invoiceForm.property = "电子";
            this.invoiceForm.outOrderNo = this.outOrder.outOrderNo;
            this.invoiceForm.items = this.outOrder.items;
            makeInvoice(this.invoiceForm).then(res => {
              if (res.data.code === 1) {
                Toast(res.data.message);
                this.$router.go(0)
              }
            }).catch(error => {
              Toast(error.response.data.message);
            });
          }
        });
      },
    },
    watch: {},
    created() {
      if (this.$route.query.accessToken) {
        localStorage.setItem("accessToken", this.$route.query.accessToken);
      }
      if (this.$route.query.taxNumber) {
        localStorage.setItem("taxNumber", this.$route.query.taxNumber);
      }
      if (localStorage.getItem("type")) {
        this.invoiceForm.type = localStorage.getItem("type");
      }
      if (this.$route.query.outOrderNo) {
        localStorage.setItem("outOrderNo", this.$route.query.outOrderNo);
        this.outOrderNo = localStorage.getItem("outOrderNo");
      } else if (this.outOrderNo === "") {
        Toast("outOrderNo不能为空！");
      }
      this.outOrderNo = localStorage.getItem("outOrderNo");
    },
    activated() {
    },
    mounted() {
      this.getShopOrder()
    }
  };
</script>

<style scoped>
  @import '../make.css';

  .nav {
    margin-top: 0;
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
