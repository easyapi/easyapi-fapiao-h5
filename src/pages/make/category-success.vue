<template>
  <div class="success">
    <van-icon name="checked" color="#19be6b" size="120"/>
    <div class="success-button">
      <van-button type="default" plain block round @click="gotoIndex">返回首页</van-button>
      <van-divider hairline/>
      <van-button type="default" plain block round @click="gotoInvoiceList">开票记录</van-button>
    </div>
  </div>
</template>

<script>
  export default {
    name: "MakeCategorySuccess",
    methods: {
      gotoInvoiceList() {
        this.$router.replace(`/invoice/`);
      },
      gotoIndex() {
        this.$router.replace("/");
      }
    }
  };
</script>

<style scoped>
  @import 'success.css';
</style>
