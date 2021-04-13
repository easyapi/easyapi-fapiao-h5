/**
 * 开票页Mixin
 */

import {getRule} from "../../../api/info";
import {getShopSupport} from "../../../api/shop";
import {Toast} from "vant";
import Isemail from "isemail";
import isChinesePhoneNumber from "is-chinese-phone-number";

export default {
  name: 'makeMixins',
  props: {},

  data() {
    return {
      remarkPlaceholder: "",//发票备注填写说明
      ifNeedMobile: false,//手机号码是否必填
      ifNeedEmail: false,//邮箱是否必填
      ifCheckEmailMobile: true,//邮箱和手机是否效验通过
      invoiceForm: {
        category: "",
        property: ""
      }
    };
  },
  watch: {},
  computed: {},
  async mounted() {
    this.getInvoiceRemark();
    this.getShopSupport()
  },
  methods: {
    /**
     * 获取发票备注填写说明
     */
    getInvoiceRemark() {
      if (localStorage.getItem("invoiceForm")) {
        this.invoiceForm.remark = JSON.parse(localStorage.getItem("invoiceForm")).remark;
      }
      else {
        getRule().then((res) => {
          this.remarkPlaceholder = res.data.content.remark;
        });
      }
    },
    /**
     * 获取手机和邮箱是否必填
     */
    getShopSupport() {
      getShopSupport().then(res => {
        this.ifNeedMobile = res.data.content.ifNeedMobile;
        this.ifNeedEmail = res.data.content.ifNeedEmail;
      }).catch(error => {
        Toast(error.response.data.message);
      });
    },
    /**
     * 检查邮箱和手机号码
     */
    async checkEmailMobile() {
      //验证邮箱
      if (this.ifNeedEmail === true) {
        if (this.invoiceForm.email === "") {
          Toast("请输入邮箱");
          this.ifCheckEmailMobile = false;
        } else if (!Isemail.validate(this.invoiceForm.email)) {
          Toast("邮箱格式不正确")
          this.ifCheckEmailMobile = false;
        }
      } else {
        if (this.invoiceForm.email) {
          if (!Isemail.validate(this.invoiceForm.email)) {
            Toast("邮箱格式不正确")
            this.ifCheckEmailMobile = false;
          }
        }
      }
      //手机号验证
      if (this.ifNeedMobile === true) {
        if (this.invoiceForm.addrMobile === "") {
          Toast("请输入手机号码");
          this.ifCheckEmailMobile = false;
        } else if (!isChinesePhoneNumber.mobile(this.invoiceForm.addrMobile)) {
          Toast("手机格式不正确");
          this.ifCheckEmailMobile = false;
        }
      } else {
        if (this.invoiceForm.addrMobile) {
          if (!isChinesePhoneNumber.mobile(this.invoiceForm.addrMobile)) {
            Toast("手机格式不正确");
            this.ifCheckEmailMobile = false;
          }
        }
      }
    },
    receiveCategory(val) {
      this.invoiceForm.category = val;
    },
    receiveProperty(val) {
      this.invoiceForm.property = val;
    },
  },
};
