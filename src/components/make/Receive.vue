<template>
  <div>
    <div class="page-part" style="margin-bottom: 60px" v-show="ifElectronic">
      <p>接收方式</p>
      <van-field label="电子邮箱" v-model="childForm.email"></van-field>
      <van-field label="手机号码" v-model="childForm.addrMobile"></van-field>
    </div>
    <div class="page-part" style="margin-bottom: 60px" v-if="!ifElectronic">
      <p>接收方式</p>
      <van-field
        right-icon="arrow"
        label="收件人"
        readonly
        @click="gotoAddress"
        v-model="childAddress.name"
      ></van-field>
      <van-field
        label="手机号码"
        v-model="childAddress.mobile"
        readonly
      ></van-field>
      <van-cell
        title="邮寄地址"
        :value="childAddress.province + childAddress.city + childAddress.district + childAddress.addr"
        readonly
      ></van-cell>
    </div>
    <div class="page-part" style="margin-bottom: 60px" v-show="!ifElectronic">
      <p>开票金额不足200元，需支付邮费</p>
    </div>
  </div>
</template>

<script>
  import {getDefaultAddress} from "../../api/address";
  import {getCustomer} from "../../api/customer";

  export default {
    name: "Receive",
    data() {
      return {
        childForm: {
          type: "",
          category: "",
          purchaserName: "",
          purchaserTaxpayerNumber: "",
          purchaserAddress: "",
          purchaserPhone: "",
          purchaserBank: "",
          purchaserBankAccount: "",
          companyId: "",
          addrMobile: "",
          email: ""
        },
        childAddress: {
          name: "",
          taxNumber: "",
          address: "",
          phone: "",
          bank: "",
          bankAccount: "",
          companyId: ""
        }
      };
    },
    props: [
      "ifElectronic",
      "invoiceForm",
    ],
    methods: {
      /** 前往地址管理页 */
      gotoAddress() {
        this.$router.push({
          path: "/address/",
          name: "Address",
          params: {
            id: this.childAddress ? this.childAddress.addressId : "",
            from: "make"
          }
        });
      },
      /**
       * 获取默认地址
       */
      getDefaultAddress() {
        getDefaultAddress().then((res) => {
          if (res.data.code === 1) {
            this.childAddress = res.data.content;
            this.childForm.addressId = this.childAddress.addressId;
          }
        });
      },
      /**
       * 获取开票用户信息
       */
      getCustomer() {
        if (localStorage.getItem("invoiceForm")) {
          this.childForm.email = JSON.parse(localStorage.getItem("invoiceForm")).email;
          this.childForm.mobile = JSON.parse(localStorage.getItem("invoiceForm")).mobile;
        }
        else {
          getCustomer({}).then((res) => {
            this.childForm.email = res.data.content.email ? res.data.content.email : "";
            this.childForm.mobile = res.data.content.mobile ? res.data.content.mobile : "";
          });
        }
      },
    },
    mounted() {
      this.childForm = this.invoiceForm;
      this.getDefaultAddress();
      this.getCustomer();
    }
  };
</script>

<style scoped>
  .page-part .van-cell__title {
    width: 6.2em;
    flex: none;
  }

  .page-part .van-cell__value {
    flex: 3;
    text-align: left;
  }

  .van-cell__value {
    min-width: 74%;
  }
</style>
