<template>
  <div>
    <div v-if="ifOrderMake === true">
      <van-cell-group title="订单开票">
        <van-cell v-for="(type) in orderTypeList" :key="type.orderTypeId" :value="type.name" is-link
                  :to="{ path: '/out-order', query: { type: type.name }}"
                  size="large"/>
      </van-cell-group>
    </div>
    <div>
      <van-cell-group title="发票管理">
        <van-cell title="开票记录" is-link to="/invoice/"/>
        <van-cell title="开票规则" is-link to="/rule"/>
        <van-cell title="抬头管理" is-link :to="{ path: '/company/', params: { from: index }}"/>
        <van-cell title="地址管理" is-link :to="{ path: '/address/', params: { from: index }}"/>
      </van-cell-group>
    </div>

    <div v-if="ifProductMake || ifMoneyMake" class="bottom">
      <van-button type="info" class="submit" block @click="gotoMake">我要开票</van-button>
    </div>
  </div>
</template>
<script>
  import {Toast} from "vant";
  import {getOrderTypeList} from "../api/order-type";
  import {getShopSupport, getShop} from "../api/shop";

  export default {
    name: "Index",
    data() {
      return {
        index: "",
        ifProductMake: false,//是否支持商品清单开票
        ifMoneyMake: false,//是否支持金额开票
        ifOrderMake: false,//是否支持订单开票
        orderTypeList: ""//订单开票类型列表
      };
    },
    methods: {
      gotoMake() {
        if (this.ifProductMake) {
          this.$router.push(`/make/product`);
        }
        if (this.ifMoneyMake) {
          this.$router.push(`/make/category`);
        }
      },
      /**
       * 获取发票类型
       */
      getShop() {
        getShop().then(res => {
          localStorage.setItem("ifElectronic", res.data.content.ifElectronic);
          localStorage.setItem("ifPaper", res.data.content.ifPaper);
        });
      },
      /**
       * 获取订单类型列表
       */
      getOrderTypeList() {
        getOrderTypeList().then(res => {
          if (res.status === 200) {
            this.orderTypeList = res.data.content;
            setTimeout(function () {
              Toast.clear();
            }, 1500);
          }
        }).catch(error => {
          Toast.clear();
          Toast(error.response.data.message);
        });
      },
      /**
       * 获取发票开票类型
       */
      getShopSupport() {
        getShopSupport().then(res => {
          this.ifProductMake = res.data.content.ifProduct;
          localStorage.setItem("ifProductMake", this.ifProductMake);
          this.ifMoneyMake = res.data.content.ifMoney;
          localStorage.setItem("ifMoneyMake", this.ifMoneyMake);
          this.ifOrderMake = res.data.content.ifOrder;
          localStorage.setItem("ifOrderMake", this.ifOrderMake);
        }).catch(error => {
          Toast(error.response.data.message);
        });
      }
    },
    created() {
      this.getShop();
      localStorage.removeItem("ifProductMake");
      localStorage.removeItem("ifMoneyMake");
      localStorage.removeItem("ifOrderMake");
      if (this.$route.query.accessToken) {
        localStorage.setItem("accessToken", this.$route.query.accessToken);
      } else {
        if (!localStorage.getItem("accessToken")) {
          this.$router.push("/error");
        }
      }
    },
    mounted() {
      let _this = this;
      Toast.loading({
        message: '加载中...',
        forbidClick: true,
      });
      _this.getOrderTypeList();
      setTimeout(function () {
        _this.getShopSupport();
      }, 1000);
    },
  };
</script>

<style scoped>

  .bottom {
    margin-top: 10px;
    position: fixed;
    bottom: 0;
    width: 100%;
    background-color: #fff;
    padding-top: 10px;
  }

  .bottom .submit {
    left: 50%;
    transform: translateX(-50%);
    width: 95%;
    border: none;
    height: 40px;
    border-radius: 5px;
    color: #fff;
    font-size: 18px;
    margin-bottom: 10px;
  }

  .bottom .van-button__text {
    font-size: 17px;
    font-weight: 500;
    letter-spacing: 5px;
    text-indent: 5px
  }
</style>
