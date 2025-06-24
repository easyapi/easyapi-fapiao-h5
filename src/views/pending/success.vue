<script setup lang="ts">
const route = useRoute()
const router = useRouter()

const state = reactive({
  invoiceForm: null,
})

function goback() {
  router.go(-1)
}

onMounted(() => {
  document.title = '开票申请成功'
  if (route.query.invoiceForm) {
    state.invoiceForm = JSON.parse(route.query.invoiceForm)
  }
})
</script>

<template>
  <div class="success-page">
    <div class="success-icon">
      <van-icon name="checked" color="white" size="50" />
      <div class="py-1">
        开票申请成功
      </div>
      <div class="opacity-60">
        请与商家确认并索取开具的发票
      </div>
    </div>
    <van-cell title="发票抬头" :value="state.invoiceForm?.purchaserName" />
    <van-cell title="税号" :value="state.invoiceForm?.purchaserTaxpayerNumber" />
    <van-cell title="开票代码" :value="state.invoiceForm?.code" />
    <div class="goback">
      <van-button type="default" plain block round @click="goback">
        返回首页
      </van-button>
    </div>
  </div>
</template>

<style scoped lang="less">
.success-page {
  height: 100%;

  .success-icon {
    background: #1989FA;
    text-align: center;
    color: white;
    padding: 48px 0 24px;

    .py-1 {
      margin-top: 10px;
      font-size: 16px;
    }

    .opacity-60 {
      margin-top: 10px;
      opacity: 0.6;
      font-size: 14px;
    }
  }

  .goback {
    margin-top: 32px;
    padding: 0 16px;
  }
}
</style>
