<template>
  <div>
    <Header
      @head-back="goBack()"
      :headerTitle="headerTitle"
      v-if="show"
    ></Header>
    <div class="nav" style="margin-top: 0px">
      <div id="loading">
        <van-loading v-show="loadingList" type="spinner" color="#56cbf6"/>
      </div>
      <Invoice :isShow="isShow" :isHide="isHide" :ifElectronic="ifElectronic" :invoiceForm="invoiceForm"
               :ifPaper="ifPaper" :company="company"
               @getcategorydata="receiveCategory" @getpropertydata="receiveProperty"></Invoice>
    </div>
    <div class="invoice-contents">
      <p>发票内容</p>
      <ul class="contents-title">
        <li style="width: 35%">商品名称</li>
        <li style="width: 35%">规格型号</li>
        <li>单位</li>
        <li>数量</li>
        <li>单价</li>
        <li>操作</li>
      </ul>
      <van-cell class="line"/>
      <ul
        class="contents-content"
        v-for="(product, index) in productList"
        :key="index"
      >
        <li style="width: 35%; line-height: 15px;padding-top:12px">
          {{ product.name }}
        </li>
        <li style="width: 35%; line-height: 15px;padding-top:12px">{{ product.specification }}</li>
        <li>{{ product.unit }}</li>
        <li>{{ product.number }}</li>
        <li>{{ product.price }}</li>
        <li
          style="color: #1989fa"
          @click="deleteProduct(product.productId)"
        >
          删除
        </li>
      </ul>
      <!-- <van-cell class="line"/> -->
      <!-- <div class="btn">
        <van-button class="submit-btn" @click="showSearchPopup">
          +添加发票内容
        </van-button
        >
      </div> -->
      <van-cell class="line"/>
      <van-field
        class="merge-order_price"
        label="发票金额"
        v-model="invoiceForm.price"
        readonly
      ></van-field>
      <van-field
        label="发票备注"
        :placeholder="remarkPlaceholder"
        v-model="invoiceForm.remark"
      ></van-field>
    </div>
    <Receive :ifElectronic="ifElectronic" :invoiceForm="invoiceForm" :address="address"></Receive>
    <div class="bottom">
      <van-button
        type="info"
        class="submit"
        @click="makeInvoice"
        v-if="showDisabled"
      >提交
      </van-button>
      <van-button class="submit" v-else>开票中...</van-button>
    </div>
    <div>
      <router-view @seletedOrder="seletedOrder"></router-view>
    </div>
  </div>
</template>

<script>
  import {mergeMakeInvoice} from "../../../api/make";
  import Header from "../../../components/Header.vue";
  import {Toast} from "vant";
  import {Dialog} from "vant";
  import Invoice from "../../../components/make/Invoice";
  import Receive from "../../../components/make/Receive";
  import makeMixins from "../mixins/make";

  export default {
    name: "singleOrder",
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
        amountOfMoney: 0,
        productList: "",//商品列表
        address: {},
        outOrder: "",
        contentList: "",
        outOrderNo: "",
        accessToken: "",
        showDisabled: true,
        selected: "1",
        company: {},
        itemIds: "",
        sum: 0,
        item: {},
        mergeTax: 0,
        howMany: "",
        returnUrl: "",
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
        }
      };
    },
    methods: {
      goBack() {
        history.go(-1);
      },
      seletedOrder(item) {
        this.loadingList = false;
        this.company = item;
      },
      getOutOrder() {
        let outOrderNo = this.outOrderNo;
        this.$ajax.get("/out-orders", {
          params: {
            size: this.size,
            accessToken: this.accessToken,
            taxNumber: this.taxNumber,
            state: 0,
            no: outOrderNo
          }
        }).then(res => {
          if (res.data.code == 1) {
            this.$router.push({
              path: "/invoice/detail",
              query: {id: res.data.content.invoice.invoiceId}
            });
          }
          this.outOrder = res.data.content[0];
          this.calculatedAmount();
        });
      },
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
          this.invoiceForm.addrMobile = this.invoiceForm.addrMobile;
          this.invoiceForm.email = this.email;
          this.invoiceForm.type = this.invoiceForm.type;
          this.invoiceForm.category = "增值税电子普通发票";
          this.invoiceForm.property = "电子";
          this.invoiceForm.outOrderIds = this.outOrder.outOrderId;
          mergeMakeInvoice(this.invoiceForm).then(res => {
            if (res.data.code === 1) {
              this.$messagebox.alert(res.data.message);
              this.$router.push({
                path: "/single-order-success",
                query: {returnUrl: this.returnUrl}
              });
            }
          }).catch(error => {
            this.showDisabled = false;
            Toast(error.response.data.message);
            this.showDisabled = true;
          });
        }).catch(error => {
        })
      },
      /**  计算发票金额 */
      calculatedAmount() {
        if (this.outOrder !== null) {
          this.amountOfMoney = this.outOrder.price.toFixed(2);
        }
      },
      /** 删除商品 */
      deleteProduct(id) {
        for (let i = 0; i < this.productList.length; i++) {
          if (id === this.productList[i].productId) {
            this.productList.splice(i, 1);
          }
          localStorage.setItem("productList", JSON.stringify(this.productList));
          this.productList = JSON.parse(localStorage.getItem("productList"));
        }
        this.invoiceForm.price = 0;
        this.calcAmount();
      },
    },
    watch: {},
    created() {
      if (this.$route.query.accessToken) {
        localStorage.setItem("accessToken", this.$route.query.accessToken);
        this.accessToken = localStorage.getItem("accessToken");
      } else if (this.accessToken === "") {
        Toast("accessToken不能为空！");
      }
      if (this.$route.query.outOrderNo) {
        localStorage.setItem("outOrderNo", this.$route.query.outOrderNo);
        this.outOrderNo = localStorage.getItem("outOrderNo");
      } else if (this.outOrderNo === "") {
        Toast("outOrderNo不能为空！");
      }
      if (this.$route.query.returnUrl) {
        localStorage.setItem("returnUrl", this.$route.query.returnUrl);
        this.accessToken = localStorage.getItem("returnUrl");
      } else if (this.returnUrl === "") {
        Toast("returnUrl不能为空！");
      }
      this.accessToken = localStorage.getItem("accessToken");
      this.taxNumber = localStorage.getItem("taxNumber");
      this.outOrderNo = localStorage.getItem("outOrderNo");
      this.invoiceForm.type = localStorage.getItem("type");
      if (this.invoiceForm.type) {
        this.invoiceForm.type = localStorage.getItem("type");
      } else {
        this.invoiceForm.type = "企业";
      }
    },
    activated() {
      this.seletedOrder();
    },
    mounted() {
      this.getOutOrder();
    },
    computed: {
      show() {
        return this.$store.state.ifShowH5NavBar;
      }
    }
  };
</script>

<style scoped>
  @import '../make.css';

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
