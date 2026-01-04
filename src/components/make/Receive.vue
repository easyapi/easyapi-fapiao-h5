<script setup lang="ts">
import customer from '@/api/customer'

const props = defineProps({
  invoiceForm: {
    type: Object,
  },
  ifNeedEmail: {
    type: Boolean,
  },
  ifNeedMobile: {
    type: Boolean,
  },
})

const state = reactive({
  childForm: {
    mobile: '' as string,
    email: '' as string,
  },
  childAddress: {
    name: '',
    mobile: '',
    address: '',
    phone: '',
    bank: '',
  },
})

/**
 * 获取开票用户信息
 */
function getCustomer() {
  customer.getCustomer({}).then((res) => {
    state.childForm.email = res.content.email ? res.content.email : ''
    state.childForm.mobile = res.content.mobile ? res.content.mobile : ''
  })
}

onMounted(() => {
  state.childForm = props.invoiceForm
  getCustomer()
})
</script>

<template>
  <div>
    <van-cell-group title="接收方式" inset>
      <van-field
        v-if="!props.ifNeedEmail"
        v-model="state.childForm.email"
        label="电子邮箱"
      />
      <van-field
        v-if="props.ifNeedEmail"
        v-model="state.childForm.email"
        label="电子邮箱"
        required
      />
      <van-field
        v-if="!props.ifNeedMobile"
        v-model="state.childForm.mobile"
        label="手机号码"
        maxlength="11"
      />
      <van-field
        v-if="props.ifNeedMobile"
        v-model="state.childForm.mobile"
        label="手机号码"
        maxlength="11"
        required
      />
    </van-cell-group>
  </div>
</template>

<style lang="less" scoped>
.page-part {
  margin: 10px 0 0 20px;
  color: #999;
  font-size: 12px;
}
</style>
