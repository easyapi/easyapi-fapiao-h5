<template>
  <div>
    <div class="add-con">
      <Header @head-back="goBack()" :headerTitle="headerTitle" v-if="show"></Header>
      <div style="margin-top: 10px;margin-bottom: 35px;">
        <div id="loading">
          <van-loading
            color="#56cbf6"
            v-show="loading"
          />
        </div>
        <div class="no-record-con" v-show="companyList.length ==0 && !loading">
          <van-empty image="search" description="暂无数据"/>
        </div>
        <div
          class="address-con header-d"
          v-for="(item, index) in companyList"
          :key="index"
        >
          <div class="address-top">
            <p>
              <span class="rise-text">{{ item.name }}</span>
              <van-tag plain type="warning" v-if="item.ifDefault">默认</van-tag>
              <span class="edit" @click="gotoEditCompany(item.companyId)">编辑</span>
            </p>
          </div>
          <div class="address-bottom" @click="select(item)">
            <van-cell-group :border="false">
              <van-cell title="公司税号" :value="item.taxNumber" :border="false"/>
              <van-cell title="注册地址" :value="item.address" :border="false"/>
              <van-cell title="注册电话" :value="item.phone" :border="false"/>
              <van-cell title="开户银行" :value="item.bank" :border="false"/>
              <van-cell title="银行账号" :value="item.bankAccount" :border="false"/>
            </van-cell-group>
          </div>
        </div>
      </div>
    </div>
    <div class="bottom_button">
      <van-button type="info" class="button" @click="gotoWechat">同步微信抬头</van-button>
      <van-button type="info" class="button" @click="gotoEditCompany('')">新增抬头</van-button>
    </div>
  </div>
</template>
<script>
  import Header from "../../../components/Header.vue";
  import {defaultCompany, getCompanyList} from "../../../api/company";
  import {Toast} from "vant";

  export default {
    name: "Company",
    components: {
      Header
    },
    data() {
      return {
        loading: true,
        headerTitle: "抬头管理",
        companyList: [],
        from: "make",
        back: false//是否可以后退
      };
    },
    methods: {
      goBack() {
        history.go(-1);
      },
      getCompanyList() {
        getCompanyList({}).then(res => {
          if (res.data.code !== 0) {
            this.loading = false;
            this.companyList = res.data.content;
          } else {
            this.loading = false;
          }
        }).catch(error => {
          Toast(error.response.data.message);
          this.loading = false;
        });
      },
      select(item) {
        //设置为默认抬头
        defaultCompany(item.companyId).then(res => {
          this.$router.back(-1);
        }).catch(error => {
          Toast(error.response.data.message);
        });
      },
      gotoWechat() {
        var _that = this
        wx.getSetting({
          success(res) {

          }
        })
      },
      gotoEditCompany(companyId) {
        this.back = true;
        this.$router.push({
          name: "EditCompany",
          path: "/company/edit",
          params: {id: companyId}
        });
      }
    },
    computed: {
      show() {
        return this.$store.state.ifShowH5NavBar;
      }
    },
    created() {
      this.from = this.$route.params.from;
    },
    activated() {
      this.getCompanyList();
    },
    mounted() {
      this.getCompanyList();
    },
    beforeRouteLeave(to, from, next) {
      if (to.name === "EditCompany" && !this.back) {
        next({name: "Index"});
      } else if (to.name === "Company") {
        next({name: "Index"});
      } else {
        next();
      }
    },
    watch: {}
  };
</script>

<style scoped>
  @import '../company.css';
</style>
