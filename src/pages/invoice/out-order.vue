<template>
  <div class="associated-con">
    <Header @head-back="goBack()" :headerTitle="headerTitle"></Header>
    <div class="order-con address-con header-d address-bottom" v-for="(item,index) in outOrders" :key="index">
      <van-cell-group :border="false">
        <van-cell title="订单编号：" :value="item.no" :border="false"/>
        <van-cell v-if="item.fields" :title="Object.values(JSON.parse(item.fields))[0]" :value="item.noY" :border="false"/>
        <van-cell title="" :value="item.model" :border="false"/>
        <div>
          <span class="price">￥{{ item.price}}</span>
          <span class="time">小计</span>
        </div>
      </van-cell-group>
    </div>
  </div>
</template>

<script>
  import Header from "../../components/Header.vue";
  import {getOutOrderList} from "../../api/invoice";

  export default {
    name: "OutOrder",
    components: {
      Header
    },
    data() {
      return {
        headerTitle: "关联订单",
        outOrders: []
      };
    },
    methods: {
      goBack() {
        history.go(-1);
      },
      getOutOrderList() {
        getOutOrderList({invoiceId: this.$route.query.id}).then(res => {
          this.outOrders = res.data.content
        }).catch(error => {
          Toast(error.response.data.message);
        });
      }
    },
    mounted() {
      this.getOutOrderList();
    }
  };
</script>

<style scoped>
  @import 'out-order.css';
</style>
