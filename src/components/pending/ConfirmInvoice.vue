<script setup lang="ts">
import pending from '@/api/pending'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  invoiceForm: {
    type: Object,
  },
  accessToken: {
    type: String,
  },
})

const emit = defineEmits(['update:modelValue'])

const router = useRouter()

const state = reactive({
  show: false,
})

function handleClose() {
  emit('update:modelValue', false)
}

/**
 * 开具发票
 */
function makeInvoice() {
  const data = {
    ...props.invoiceForm,
    accessToken: props.accessToken,
  }
  pending.createPending(data).then((res) => {
    if (res.code === 1) {
      handleClose()
      router.push(`/pending/success?invoiceForm=${JSON.stringify(props.invoiceForm)}`)
    }
  })
}

watch(() => props.modelValue, (val: any) => {
  state.show = val
}, { immediate: true })
</script>

<template>
  <van-popup
    v-model:show="state.show"
    position="bottom"
    round
    closeable
    title="确认开票"
    :style="{ height: 'auto', paddingBottom: '60px' }"
    @close="handleClose"
  >
    <div class="popup-title">
      确认开票
    </div>
    <van-cell title="发票抬头" :value="props.invoiceForm.purchaserName" />
    <van-cell title="税号" :value="props.invoiceForm.purchaserTaxpayerNumber" />
    <van-cell title="地址" :value="props.invoiceForm.purchaserAddress" />
    <van-cell title="电话" :value="props.invoiceForm.purchaserPhone" />
    <van-cell title="开户行" :value="props.invoiceForm.purchaserBank" />
    <van-cell title="银行账号" :value="props.invoiceForm.purchaserBankAccount" />
    <div class="bottom fixed-bottom-bgColor">
      <van-button type="primary" class="submit" block @click="makeInvoice">
        确认开票
      </van-button>
    </div>
  </van-popup>
</template>

<style scoped lang="less">
.popup-title {
  padding: 10px 16px;
  text-align: center;
  font-size: 16px;
}

.bottom {
  position: fixed;
  bottom: 0;
  width: 100%;
  padding: 10px 16px;

  .submit {
    border: none;
    height: 40px;
    border-radius: 5px;
    font-size: 18px;
    font-weight: 500;
    letter-spacing: 2px;
    text-indent: 2px;
  }
}
</style>
