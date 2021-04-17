<template>
  <div>
    <Header @head-back="goBack()" headerTitle="开具电子发票" v-if="show"></Header>
    <div class="nav" style="margin-top: 0px">
      <div id="loading">
        <van-loading v-show="loadingList" type="spinner" color="#56cbf6"/>
      </div>
      <Invoice :isShow="isShow" :isHide="isHide" :ifElectronic="ifElectronic" :invoiceForm="invoiceForm"
               :ifPaper="ifPaper" :company="company"
               @getCompany="receiveCompany"
               @getInvoiceCategory="receiveCategory" @getInvoiceProperty="receiveProperty"></Invoice>
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
      <van-cell class="line"/>
      <div class="btn">
        <van-button class="submit-btn" @click="showProductSearchPopup">
          +添加发票内容
        </van-button
        >
      </div>
      <van-cell class="line"/>
      <van-field class="merge-order_price" label="发票金额" v-model="invoiceForm.price" readonly></van-field>
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
    <van-popup
      class="popupClass"
      v-model="showPopup"
      position="bottom"
      style="height: 75%; padding-top: 4px;"
    >
      <van-search
        v-model="productKeyword"
        placeholder="请输入搜索关键词"
        @input="onProductSearch"
      />
      <van-list
        :finished="true"
        finished-text="没有更多了"
      >
        <van-radio-group>
          <van-cell v-for="item in productListAll" :key="item.productId">
            <van-row type="flex" align="center">
              <van-col span="6">
                <van-image width="60" height="60" :src="item.img"/>
              </van-col>
              <van-col span="11">
                <span style="display: block">{{ item.name }}</span>
                <span style="display: block; font-size: 12px; color: #888">{{ item.specification }}</span>
                <span>￥</span>
                <input style="width: 40px; text-align: center; border:none;" v-model=" item.price "
                       @change="calcTotalPrice"/>
                <span> 元 / {{ item.unit }}</span>
              </van-col>
              <van-col span="7">
                <van-stepper v-model="item.number" integer min="0" default-value="0" @change="calcTotalPrice"/>
              </van-col>
            </van-row>
          </van-cell>
        </van-radio-group>
      </van-list>
      <van-submit-bar :price="productPrice * 100" button-text="添加商品" @submit="appendProduct" button-color="#1989fa"/>
    </van-popup>
  </div>
</template>

<script>
  import {getProductList} from "../../../api/product";
  import {productMakeInvoice} from "../../../api/make";
  import Header from "../../../components/Header.vue";
  import {Toast} from "vant";
  import {Dialog} from "vant";
  import Invoice from "../../../components/make/Invoice";
  import Receive from "../../../components/make/Receive";
  import makeMixins from "../mixins/make";

  export default {
    name: "MakeProduct",
    components: {
      Header,
      Invoice,
      Receive
    },
    mixins: [makeMixins],
    data() {
      return {
        loadingList: true,
        isShow: false,
        isHide: true,
        ifElectronic: localStorage.getItem("ifElectronic"),
        ifPaper: localStorage.getItem("ifPaper"),
        showPopup: false,
        productList: "",//商品列表
        company: {},//公司抬头
        address: {},//地址对象
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
          remark: "",
          addrMobile: "",
          email: "",
          companyId: null,
          addressId: null,
          price: 0.0
        },
        productListAll: [],
        productKeyword: "",//商品服务搜索关键字
        productPrice: 0//选择商品总价
      };
    },

    methods: {
      goBack() {
        history.go(-1);
      },
      /** 计算发票金额 */
      calcAmount() {
        let money = 0;
        if (this.productList !== null) {
          for (let i = 0; i < this.productList.length; i++) {
            money += this.productList[i].price * this.productList[i].number;
          }
          this.invoiceForm.price = money.toFixed(2);
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
      /** 获取商品服务列表 */
      getProductList(params) {
        getProductList(params).then(res => {
          this.productListAll = res.data.content;
        });
      },
      /** 追加商品服务 */
      appendProduct() {
        let obj = {};
        for (let i = 0; i < this.productListAll.length; i++) {
          if (this.productListAll[i].number > 0) {
            obj = {
              productId: this.productListAll[i].productId,
              specification: this.productListAll[i].specification,
              unit: this.productListAll[i].unit,
              price: this.productListAll[i].price,
              name: this.productListAll[i].name,
              number: this.productListAll[i].number
            };
            let oldList = JSON.parse(localStorage.getItem("productList")) || [];
            oldList.push(obj);
            localStorage.setItem("productList", JSON.stringify(oldList));
            this.productList = JSON.parse(localStorage.getItem("productList"));
          }
        }
        this.calcAmount();
        this.showPopup = false;
      },
      /** 显示选择商品弹框 */
      showProductSearchPopup() {
        this.productPrice = 0;
        this.showPopup = true;
        this.productKeyword = "";
        this.getProductList();
      },
      /** 搜索商品 */
      onProductSearch() {
        this.getProductList({name: this.productKeyword});
      },
      /** 计算追加商品总价 */
      calcTotalPrice() {
        let total = 0;
        if (this.productListAll !== null) {
          for (let i = 0; i < this.productListAll.length; i++) {
            total += this.productListAll[i].price * (this.productListAll[i].number || 0);
          }
          this.productPrice = total;
        }
      },
      receiveCompany(val) {
        this.company = val;
      },
      receiveCategory(val) {
        this.invoiceForm.category = val;
      },
      receiveProperty(val) {
        this.invoiceForm.property = val;
      },
      makeInvoice() {
        if (this.invoiceForm.type === '个人' && this.invoiceForm.purchaserName === "") {
          return Toast("请输入发票抬头");
        }
        if (this.productList === null) {
          return Toast("商品服务不能为空");
        }
        this.checkEmailMobile();
        if (!this.ifCheckEmailMobile) {
          return;
        }
        Dialog.confirm({
          title: "提示",
          message: "确认抬头正确并开票吗？"
        }).then(() => {
          Toast.loading({
            message: "开票中...",
            forbidClick: true
          });
          this.invoiceForm.companyId = this.company.companyId;
          this.invoiceForm.products = this.productList;
          productMakeInvoice(this.invoiceForm).then(res => {
            if (res.data.code === 1) {
              Toast.clear();
              this.$router.push(`/make/success`);
            }
          }).catch(error => {
            Toast(error.response.data.message);
          });
        }).catch(() => {
        });
        localStorage.removeItem("productList");
      },
    },
    mounted() {
      this.getProductList();
    },
    created() {
      if (localStorage.getItem("type")) {
        this.invoiceForm.type = localStorage.getItem("type");
      }
    },
    activated() {
    },
    mounted() {
      this.calcAmount();
      this.productList = JSON.parse(localStorage.getItem("productList"));
      this.loadingList = false;
    },
    computed: {
      show() {
        return this.$store.state.ifShowH5NavBar;
      }
    },
    watch: {
      '$route'(to, from) {
      }
    },
  };
</script>

<style scoped>
  @import '../make.css';

  .mint-btn div {
    margin: 20px;
    height: 44px;
    background-color: #1989fa;
    border-radius: 8px;
    box-shadow: 0px 3px 15px 0px rgba(12, 143, 192, 0.23);
    color: #fff;
    text-align: center;
    line-height: 44px;
    font-size: 16px;
  }

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

  .line {
    padding: 1px;
  }

</style>
