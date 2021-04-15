<template>
  <div>
    <div class="nav" style="margin-top: 10px;">
      <p>请选择发票类型</p>
      <van-row type="flex" justify="space-between" class="invoice-type">
        <van-col span="12" v-show="ifElectronic ==='true'">
          <div
            :class="{'invoice-type_blue_box': childInvoiceForm.property=='电子', 'invoice-type_gray_box': childInvoiceForm.property!='电子' }"
            style="margin-right:5px"
            @click="changeElectronic">
            <p style="font-size: 16px; margin-top: -6px">电子发票</p>
            <p style="font-size: 12px; margin-top: 6px">{{electronicInvoiceMakeTime}}</p>
          </div>
        </van-col>
        <van-col span="12" v-show="this.ifPaper ==='true'">
          <div
            :class="{'invoice-type_blue_box': childInvoiceForm.property=='纸质', 'invoice-type_gray_box': childInvoiceForm.property!='纸质' }"
            style="margin-left:5px" @click="changePaper">
            <p style="font-size: 16px; margin-top: -6px">纸质发票</p>
            <p style="font-size: 12px; margin-top: 6px">预计一周送达</p>
          </div>
        </van-col>
      </van-row>
    </div>
    <div class="page-part invoice-con">
      <p>发票详情</p>
      <form action="" id="formBox" ref="childInvoiceForm" :model="childInvoiceForm">
        <van-cell title="抬头类型" center>
          <van-radio-group class="van-radio-group_type" v-model="childInvoiceForm.type" direction="horizontal"
                           @change="selectInvoiceType">
            <van-radio name="企业">企业</van-radio>
            <van-radio name="个人">个人/事业单位</van-radio>
          </van-radio-group>
        </van-cell>
        <van-cell title="发票类型" center v-show="childInvoiceForm.property == '纸质'">
          <van-radio-group class="van-radio-group_type" v-model="childInvoiceForm.category" direction="horizontal"
          >
            <van-radio style="margin-bottom: 5px;" name="增值税普通发票">增值税普通发票</van-radio>
            <van-radio name="增值税专用发票" v-if="childInvoiceForm.type==='企业'">增值税专用发票</van-radio>
          </van-radio-group>
        </van-cell>
        <van-field label="发票抬头" v-if="childInvoiceForm.type === '个人'" placeholder="请输入姓名/事业单位"
                   v-model="childInvoiceForm.purchaserName"/>
        <van-field label="发票抬头" readonly v-if="childInvoiceForm.type === '企业'" @click="gotoCompany"
                   right-icon="arrow"
                   placeholder="请选择发票抬头" v-model="childCompany.name"/>
        <van-field label="税号" value="" readonly v-if="childInvoiceForm.type === '企业'" v-model="childCompany.taxNumber"/>
        <van-field label="更多" right-icon="arrow-down" v-if="childInvoiceForm.type    === '企业'" @click="purchaserMore"
                   v-show="hide"
                   readonly placeholder="地址、电话、开户行等"/>
        <div v-show="show">
          <van-field v-if="childInvoiceForm.type === '企业'" @click="purchaserMoreHide" label="地址" value="" readonly
                     v-model="childCompany.address" right-icon="arrow-up"/>
          <van-field v-if="childInvoiceForm.type === '企业'" label="电话" value="" readonly v-model="childCompany.phone"/>
          <van-field v-if="childInvoiceForm.type === '企业'" label="开户行" value="" readonly v-model="childCompany.bank"/>
          <van-field v-if="childInvoiceForm.type === '企业'" label="银行账号" value="" readonly
                     v-model="childCompany.bankAccount"/>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
  import {getDefaultCompany} from "../../api/company";
  import {getDefaultAddress} from "../../api/address";
  import {findSetting} from '../../api/setting'

  export default {
    name: "Invoice",
    props: [
      "ifElectronic",
      "invoiceForm",
      "ifPaper",
      "company",
      "isHide",
      "isShow",
    ],
    data() {
      return {
        address: "",
        electronicInvoiceMakeTime: "最快1分钟开具",
        show: this.isShow,
        hide: this.isHide,
        childInvoiceForm: {
          type: "",
          category: "",
          property: "",
          purchaserName: "",
          purchaserTaxpayerNumber: "",
          purchaserAddress: "",
          purchaserPhone: "",
          purchaserBank: "",
          purchaserBankAccount: "",
          companyId: ""
        },
        childCompany: {
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

    methods: {
      changeElectronic() {
        this.$emit("getcategorydata", this.childInvoiceForm.category = "增值税电子普通发票");
        this.$emit("getpropertydata", this.childInvoiceForm.property = "电子");
      },
      changePaper() {
        this.$emit("getcategorydata", this.childInvoiceForm.category = "增值税普通发票");
        this.$emit("getpropertydata", this.childInvoiceForm.property = "纸质");
      },
      selectInvoiceType() {
        localStorage.setItem("type", this.childInvoiceForm.type);
        if (this.childInvoiceForm.type === "企业") {
          this.getDefaultCompany();
          this.getDefaultAddress();
        } else if (this.childInvoiceForm.type === "个人") {
          this.childInvoiceForm.purchaserName = "";
          this.childInvoiceForm.purchaserTaxpayerNumber = "";
          this.childInvoiceForm.purchaserAddress = "";
          this.childInvoiceForm.purchaserPhone = "";
          this.childInvoiceForm.purchaserBank = "";
          this.childInvoiceForm.purchaserBankAccount = "";
          this.childInvoiceForm.companyId = "";
        }
      },
      /** 前往抬头管理页 */
      gotoCompany() {
        console.log(this.childCompany.name);
        this.$router.push({
          path: "/company/",
          name: "Company",
          params: {
            id: this.childCompany ? this.childCompany.companyId : "",
            from: "make"
          }
        });
      },
      /** 购买方更多信息 */
      purchaserMore() {
        this.show = true;
        this.hide = false;
      },
      /** 隐藏购买方更多信息 */
      purchaserMoreHide() {
        this.show = false;
        this.hide = true;
      },
      getDefaultCompany() {
        getDefaultCompany().then((res) => {
          if (res.data.code === 1) {
            this.childCompany = res.data.content;
            this.childInvoiceForm.purchaserName = this.childCompany.name;
            this.childInvoiceForm.purchaserTaxpayerNumber = this.childCompany.taxNumber;
            this.childInvoiceForm.purchaserAddress = this.childCompany.address;
            this.childInvoiceForm.purchaserPhone = this.childCompany.phone;
            this.childInvoiceForm.purchaserBank = this.childCompany.bank;
            this.childInvoiceForm.purchaserBankAccount = this.childCompany.bankAccount;
            this.childInvoiceForm.companyId = this.childCompany.companyId;
          }
        });
      },
      getDefaultAddress() {
        getDefaultAddress().then((res) => {
          if (res.data.code === 1) {
            this.address = res.data.content;
            this.childInvoiceForm.addressId = this.address.addressId;
          }
        });
      },
      /**
       * 获取电子发票文案说明
       */
      findSetting() {
        findSetting({fieldKeys: "electronic_invoice_make_time"}).then(res => {
          if (res.data.code === 1) {
            this.electronicInvoiceMakeTime = res.data.content[0].fieldValue
          }
        })
      },
    },
    mounted() {
      this.findSetting();
      this.childInvoiceForm = this.invoiceForm;
      this.childCompany = this.company;
    }
  };
</script>

<style scoped>
  .invoice-type {
    height: 70px;
    text-align: center;
    background: #fff;
    padding: 20px 10px
  }

  .invoice-type_blue_box {
    box-sizing: border-box;
    padding: 17px 0;
    font-size: 15px;
    height: 70px;
    border: 1px solid #1989fa;
    color: #1989fa;
    border-radius: 4px;
  }

  .invoice-type_gray_box {
    box-sizing: border-box;
    padding: 17px 0;
    font-size: 15px;
    height: 70px;
    border: 1px solid #999;
    color: #999;
    border-radius: 4px;
  }
</style>
