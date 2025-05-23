<script setup lang="ts">
import company from '@/api/company'
import setting from '@/api/setting'
import { invoiceTag } from '@/utils/invoice-category'
import { localStorage } from '@/utils/local-storage'

const props = defineProps({
  invoiceForm: {
    type: Object,
  },
  company: {
    type: Object,
  },
  isHide: {
    type: Boolean,
  },
  isShow: {
    type: Boolean,
  },
})
const emits = defineEmits(['getInvoiceCategory', 'getCompany'])
const router = useRouter()
const state = reactive({
  address: {
    addressId: '',
  },
  electronicInvoiceMakeTime: '最快1分钟开具',
  show: props.isShow,
  hide: props.isHide,
  childInvoiceForm: {
    type: '',
    category: '',
    purchaserName: '',
    purchaserTaxpayerNumber: '',
    purchaserAddress: '',
    purchaserPhone: '',
    purchaserBank: '',
    purchaserBankAccount: '',
    companyId: '',
    addressId: '',
    email: '',
  },
  childCompany: {
    name: '',
    taxNumber: '',
    address: '',
    phone: '',
    bank: '',
    bankAccount: '',
    companyId: '',
  },
  invoiceCategories: [],
  selectInvoiceCategories: '',
})

function changeInvoiceCategories(category) {
  state.selectInvoiceCategories = category
  emits('getInvoiceCategory', category)
}

/**
 * 前往抬头管理页
 */
function gotoCompany() {
  router.push({
    path: '/company/list',
  })
}

/**
 * 购买方更多信息
 */
function purchaserMore() {
  state.show = true
  state.hide = false
}

/**
 * 隐藏购买方更多信息
 */
function purchaserMoreHide() {
  state.show = false
  state.hide = true
}

function getDefaultCompany() {
  company.getDefaultCompany().then((res) => {
    if (res.code === 1) {
      state.childCompany = res.content
      emits('getCompany', state.childCompany)
      state.childInvoiceForm.purchaserName = state.childCompany.name
      state.childInvoiceForm.purchaserTaxpayerNumber = state.childCompany.taxNumber
      state.childInvoiceForm.purchaserAddress = state.childCompany.address
      state.childInvoiceForm.purchaserPhone = state.childCompany.phone
      state.childInvoiceForm.purchaserBank = state.childCompany.bank
      state.childInvoiceForm.purchaserBankAccount = state.childCompany.bankAccount
      state.childInvoiceForm.companyId = state.childCompany.companyId
      state.childInvoiceForm.email = state.childCompany.email
    }
  })
}

function selectInvoiceType() {
  localStorage.set('type', state.childInvoiceForm.type)
  if (state.childInvoiceForm.type === '企业') {
    getDefaultCompany()
  }
  else if (state.childInvoiceForm.type === '个人') {
    state.childInvoiceForm.purchaserName = ''
    state.childInvoiceForm.purchaserTaxpayerNumber = ''
    state.childInvoiceForm.purchaserAddress = ''
    state.childInvoiceForm.purchaserPhone = ''
    state.childInvoiceForm.purchaserBank = ''
    state.childInvoiceForm.purchaserBankAccount = ''
    state.childInvoiceForm.companyId = ''
  }
}

/**
 * 获取电子发票文案说明
 */
function findSetting() {
  setting.findSetting({
    fieldKeys: 'electronic_invoice_make_time,h5_pc_invoice_categories',
  }).then((res) => {
    if (res.code === 1) {
      res.content.forEach((item) => {
        if (item.fieldKey === 'electronic_invoice_make_time')
          state.electronicInvoiceMakeTime = item.fieldValue

        if (item.fieldKey === 'h5_pc_invoice_categories') {
          state.invoiceCategories = JSON.parse(item.fieldValue)
          changeInvoiceCategories(state.invoiceCategories[0])
        }
      })
    }
  })
}

onMounted(() => {
  findSetting()
  state.childInvoiceForm = props.invoiceForm as any
})
</script>

<template>
  <div>
    <div class="invoice-type">
      <p class="title">
        请选择发票类型
      </p>
      <div
        v-for="(item, index) in state.invoiceCategories"
        :key="index"
        class="invoice-type-list"
        :style="
          state.selectInvoiceCategories === item
            ? `border:2px solid ${invoiceTag(item).color}`
            : 'border:2px solid #f8f8f8'
        "
        @click="changeInvoiceCategories(item)"
      >
        <van-tag
          class="invoice-tag"
          size="large"
          type="primary"
          :color="
            state.selectInvoiceCategories === item
              ? invoiceTag(item).color
              : '#969799'
          "
        >
          {{ invoiceTag(item).name }}
        </van-tag>
        <span
          class="invoice-title"
          :style="
            state.selectInvoiceCategories === item
              ? `color:${invoiceTag(item).color}`
              : 'color:#969799'
          "
        >{{ item }}</span>
      </div>
    </div>

    <van-cell-group title="发票详情" inset>
      <van-cell>
        <template #title>
          <div>
            <span style="margin-right: 3px; color: #ee0a24">*</span>
            <span class="custom-title">抬头类型</span>
          </div>
        </template>
        <van-radio-group
          v-model="state.childInvoiceForm.type"
          direction="horizontal"
          @change="selectInvoiceType"
        >
          <van-radio name="企业">
            企业
          </van-radio>
          <van-radio name="个人">
            个人/事业单位
          </van-radio>
        </van-radio-group>
      </van-cell>
      <van-cell
        v-if="state.childInvoiceForm.property === '纸质'"
        title="发票类型"
      >
        <van-radio-group
          v-model="state.childInvoiceForm.category"
          direction="horizontal"
        >
          <van-radio style="margin-bottom: 5px" name="增值税普通发票">
            增值税普通发票
          </van-radio>
          <van-radio
            v-if="state.childInvoiceForm.type === '企业'"
            name="增值税专用发票"
          >
            增值税专用发票
          </van-radio>
        </van-radio-group>
      </van-cell>
      <van-field
        v-if="state.childInvoiceForm.type === '个人'"
        v-model="state.childInvoiceForm.purchaserName"
        label="发票抬头"
        placeholder="请输入姓名或事业单位名称"
        required
      />
      <van-field
        v-if="state.childInvoiceForm.type === '企业'"
        v-model="state.childCompany.name"
        label="发票抬头"
        readonly
        right-icon="arrow"
        placeholder="请选择发票抬头"
        required
        @click="gotoCompany"
      />
      <van-field
        v-if="state.childInvoiceForm.type === '企业'"
        v-model="state.childCompany.taxNumber"
        label="税号"
        readonly
        required
      />
      <van-field
        v-if="state.childInvoiceForm.type === '企业'"
        v-show="state.hide"
        label="更多"
        right-icon="arrow-down"
        readonly
        placeholder="地址、电话、开户行等"
        @click="purchaserMore"
      />
      <div v-if="state.show">
        <van-field
          v-if="state.childInvoiceForm.type === '企业'"
          v-model="state.childCompany.address"
          label="地址"
          readonly
          right-icon="arrow-up"
          @click="purchaserMoreHide"
        />
        <van-field
          v-if="state.childInvoiceForm.type === '企业'"
          v-model="state.childCompany.phone"
          label="电话"
          readonly
        />
        <van-field
          v-if="state.childInvoiceForm.type === '企业'"
          v-model="state.childCompany.bank"
          label="开户行"
          readonly
        />
        <van-field
          v-if="state.childInvoiceForm.type === '企业'"
          v-model="state.childCompany.bankAccount"
          label="银行账号"
          readonly
        />
      </div>
    </van-cell-group>
  </div>
</template>

<style lang="less" scoped>
.invoice-tag {
  margin-right: 8px;
}

.invoice-type {
  padding: 0 16px;

  .title {
    padding: 15px 0 5px 0;
    color: #969799;
  }

  .invoice-type-list {
    display: flex;
    align-items: center;
    background: #fff;
    padding: 12px 10px;
    border-radius: 8px;
    margin-top: 10px;

    .invoice-title {
      font-size: 16px;
      font-weight: bolder;
    }
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
}
</style>
