<script setup lang='ts'>
import setting from '@/api/setting'

const state = shallowReactive({
  content: '',
})

function findSetting() {
  setting.findSetting({ fieldKeys: 'invoice-rule' }).then((res) => {
    if (res.code === 1)
      state.content = res.content[0].fieldValue
    else
      state.content = '请管理员设置开票规则'
  })
}

onMounted(() => {
  document.title = '开票规则'
  findSetting()
})
</script>

<template>
  <div class="invoice-rule" v-html="state.content" />
</template>

<style lang='less' scoped>
.invoice-rule {
  padding: 15px 16px;
  line-height: 24px;
}
</style>
