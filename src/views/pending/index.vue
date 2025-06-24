<script setup lang="ts">
import company from '@/api/company'
import config from '@/api/config'
import pending from '@/api/pending'
import ConfirmInvoice from '@/components/pending/ConfirmInvoice.vue'
import { validEmail, validMobile } from '@/utils/validate'
import { showToast } from 'vant'

const route = useRoute()

const state = reactive({
  isShow: false,
  isHide: true,
  formData: {
    code: '',
    type: '企业',
    purchaserName: '',
    purchaserTaxpayerNumber: '',
    purchaserAddress: '',
    purchaserPhone: '',
    purchaserBank: '',
    purchaserBankAccount: '',
    mobile: '',
    email: '',
    remark: '',
  },
  company: null as any,
  accessToken: '' as any,
  showConfirm: false,
  searchList: [], // 智能提示的抬头列表
  listShow: false,
  isComposing: false,
})

function changeType() {
  if (state.formData.type === '个人') {
    state.formData.purchaserTaxpayerNumber = ''
    state.formData.purchaserAddress = ''
    state.formData.purchaserPhone = ''
    state.formData.purchaserBank = ''
    state.formData.purchaserBankAccount = ''
  }
}

function searchCompanyList() {
  if (state.formData.purchaserName.length < 4) {
    state.searchList = []
    state.listShow = false
    return
  }
  const params = {
    name: state.formData.purchaserName,
    accessToken: state.accessToken,
  }
  company.getCompanyCodeList(params).then((res) => {
    if (res.code === 1) {
      state.searchList = res.content
      openDropDown()
    }
    else {
      state.searchList = []
      inputBlur()
    }
  }).catch(() => {
    state.searchList = []
  })
}

function chooseCompany(index) {
  state.formData.purchaserName = state.searchList[index].name
  state.formData.purchaserTaxpayerNumber = state.searchList[index].taxNumber
  state.formData.purchaserAddress = state.searchList[index].address
  state.formData.purchaserPhone = state.searchList[index].phone
  state.formData.purchaserBank = state.searchList[index].bank
  state.formData.purchaserBankAccount = state.searchList[index].bankAccount
  state.listShow = false
}

/**
 * 选择微信抬头
 */
function selectWeiXinCompany() {
  config.getWeiXinConfig(window.location.href).then((res) => {
    if (res) {
      wx.config({
        beta: true,
        timestamp: res.timestamp,
        nonceStr: res.nonceStr,
        signature: res.signature,
        appId: res.appId,
        jsApiList: ['chooseInvoiceTitle'],
      })
      wx.ready(() => {
        wx.invoke(
          'chooseInvoiceTitle',
          {
            scene: '1', // 不是必填  使用场景 1开具发票 2其他
          },
          (res) => {
            const invoiceTitleInfo = res.choose_invoice_title_info
            if (invoiceTitleInfo) {
              const target = JSON.parse(invoiceTitleInfo)
              if (target.type === '1') {
                showToast('暂不支持添加个人发票抬头')
                return
              }
              state.formData.type = '企业'
              state.formData.purchaserName = target.title
              state.formData.purchaserTaxpayerNumber = target.taxNumber
              state.formData.purchaserAddress = target.companyAddress
              state.formData.purchaserPhone = target.telephone
              state.formData.purchaserBank = target.bankName
              state.formData.purchaserBankAccount = target.bankAccount
            }
          },
        )
      })
      wx.error((error) => {
        showToast(JSON.stringify(error))
      })
    }
  })
}

function handleInput() {
  if (!state.isComposing) {
    searchCompanyList()
  }
}
function handleCompositionStart() {
  state.isComposing = true
}
function handleCompositionEnd() {
  state.isComposing = false
  searchCompanyList()
}

/**
 * 发票抬头失焦后
 */
function inputBlur() {
  state.listShow = false
}
/**
 * 发票抬头聚焦后
 */
function inputFocus() {
  if (state.formData.purchaserName.length > 3 && state.searchList.length > 0) {
    openDropDown()
  }
}
function openDropDown() {
  const helper = document.querySelector('.helper') as any
  const element = document.querySelector('.searchList') as any
  const distanceToTop = helper.offsetTop
  element.style.top = `${distanceToTop}px`
  state.listShow = true
}

/**
 * 购买方更多信息
 */
function purchaserMore() {
  state.isShow = true
  state.isHide = false
}
/**
 * 隐藏购买方更多信息
 */
function purchaserMoreHide() {
  state.isShow = false
  state.isHide = true
}

function recentVerify() {
  if (!state.formData.purchaserName) {
    showToast('请填写发票抬头')
    return
  }
  if (state.formData.type === '企业' && !state.formData.purchaserTaxpayerNumber) {
    showToast('请填写纳税人识别号')
    return
  }
  if (state.formData.mobile) {
    if (!validMobile(state.formData.mobile)) {
      showToast('手机号码格式不正确')
      return
    }
  }
  if (state.formData.email) {
    if (!validEmail(state.formData.email)) {
      showToast('电子邮箱格式不正确')
      return
    }
  }
  state.showConfirm = true
}

function getCompanyByCode(code) {
  pending.getCompanyByCode(code).then((res) => {
    if (res.code === 1) {
      state.company = res.content.shop
      state.accessToken = res.content.accessToken
    }
  })
}

onMounted(() => {
  document.title = '开票信息'
  if (route.query.code) {
    state.formData.code = route.query.code
    getCompanyByCode(route.query.code)
  }
})
</script>

<template>
  <div class="pending">
    <div class="make-invoice">
      <van-cell-group title="开票商家" inset>
        <div class="invoice-company">
          <div class="text-base">
            {{ state.company?.name }}
          </div>
        </div>
      </van-cell-group>

      <van-cell-group title="发票详情" inset>
        <van-cell>
          <template #title>
            <div>
              <span style="margin-right: 3px; color: #ee0a24">*</span>
              <span class="custom-title">抬头类型</span>
            </div>
          </template>
          <van-radio-group v-model="state.formData.type" direction="horizontal" @change="changeType">
            <van-radio name="企业">
              企业
            </van-radio>
            <van-radio name="个人">
              个人/事业单位
            </van-radio>
          </van-radio-group>
        </van-cell>
        <van-field v-if="state.formData.type === '个人'" v-model="state.formData.purchaserName" label="发票抬头"
          placeholder="请输入姓名或事业单位名称" required />
        <div v-else>
          <van-field v-model="state.formData.purchaserName" label="发票抬头" placeholder="发票抬头" required clearable
            @compositionstart="handleCompositionStart" @compositionend="handleCompositionEnd" @input="handleInput"
            @focus="inputFocus" @blur="inputBlur" @clear="searchCompanyList">
            <template #right-icon>
              <span class="wx-company" @click="selectWeiXinCompany">微信抬头</span>
            </template>
          </van-field>
          <div class="helper" />
          <div v-show="state.listShow && state.searchList.length > 0" class="searchList">
            <ul>
              <li v-for="(item, index) in state.searchList" :key="index" class="searchList-item"
                @mousedown="chooseCompany(index)">
                {{ item.name }}
              </li>
              <li class="searchList-item none-of-them" @click="state.listShow = false">
                以上都不是，手工填写
              </li>
            </ul>
          </div>
          <van-field v-model="state.formData.purchaserTaxpayerNumber" label="税号" clearable placeholder="纳税人识别号"
            required />
          <van-field v-show="state.isHide" label="更多" right-icon="arrow-down" readonly placeholder="地址、电话、开户行等"
            @click="purchaserMore" />
          <div v-show="state.isShow">
            <van-field v-model="state.formData.purchaserAddress" label="地址" placeholder="地址" right-icon="arrow-up"
              clearable @click-right-icon="purchaserMoreHide" />
            <van-field v-model="state.formData.purchaserPhone" clearable label="电话" placeholder="电话" />
            <van-field v-model="state.formData.purchaserBank" clearable label="开户行" placeholder="开户行" />
            <van-field v-model="state.formData.purchaserBankAccount" clearable label="银行账号" placeholder="银行账号" />
          </div>
        </div>
      </van-cell-group>

      <van-cell-group title="接收方式" inset>
        <van-field v-model="state.formData.mobile" label="手机号码" maxlength="11" placeholder="手机号码" />
        <van-field v-model="state.formData.email" label="电子邮箱" placeholder="电子邮箱" />
      </van-cell-group>

      <van-cell-group title="备注" inset>
        <van-field v-model="state.formData.remark" label="备注" rows="1" autosize type="textarea" placeholder="备注" />
      </van-cell-group>

      <div class="bottom fixed-bottom-bgColor">
        <van-button type="primary" class="submit" block @click="recentVerify">
          申请开票
        </van-button>
      </div>
    </div>
    <!-- 底部弹出 -->
    <ConfirmInvoice v-model="state.showConfirm" :invoice-form="state.formData" :access-token="state.accessToken" />
  </div>
</template>

<style lang="less">
@import '../make/make.less';

.pending {
  .invoice-company {
    padding: 16px;

    .text-base {
      font-size: 16px;
    }

  }

  .wx-company {
    cursor: pointer;
    color: #1989fa;
  }

  .searchList {
    position: fixed;
    background-color: #fff;
    right: 16px;
    left: 16px;
    bottom: 0;
    padding: 0 16px;
    z-index: 999;
    overflow-y: scroll;

    .searchList-item {
      font-size: 14px;
      color: #1989FA;
      padding: 10px 0;
      line-height: 24px;
      border-bottom: 1px solid rgba(235, 237, 240, .5);
    }

    .none-of-them {
      font-size: 12px;
      border: none;
      color: #999;
    }
  }

}
</style>
