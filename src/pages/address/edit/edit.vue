<template>
  <div class="">
    <Header @head-back="goBack()" :headerTitle="headerTitle" v-if="show"></Header>
    <form action ref="addressForm" :model="addressForm" class="formClass">
      <div class="">
        <div class="address-bottom2" @click="select(item)">
          <van-cell-group border>
            <van-field label="收件人" v-model="addressForm.name" placeholder="请输入收货人姓名" border/>
            <van-field label="联系电话" v-model="addressForm.mobile" placeholder="请输入收货人手机号" border/>
            <van-field label="所在地区" v-model="addressForm.area" placeholder="省市区县、乡镇等）" border readonly
                       @click="showPopup = true"/>
            <van-field label="详细地址" v-model="addressForm.addr" placeholder="街道、楼牌号等" border/>
          </van-cell-group>
        </div>
      </div>
      <div class="page-part address-con defaultBnt">
        <van-cell center title="设置为默认地址">
          <van-switch v-model="addressForm.ifDefault" active-color="#FFC2A8" size="24px"/>
        </van-cell>
      </div>
    </form>
    <van-popup
      v-model="showPopup"
      position="bottom"
      :style="{ height: '50%' }"
    >
      <van-area title="请选择所在地区" :area-list="areaList" :columns-placeholder="['请选择', '请选择', '请选择']"
                @confirm="onAddrConfirm"/>
    </van-popup>
    <div class="bottom">
      <van-button type="info" class="submit" @click="confirm">保存</van-button>
      <van-button
        v-if="this.title === 'edit'"
        class="submit_delete"
        @click="deleteDate"
      >删除
      </van-button>
    </div>
  </div>
</template>
<script>
  import Header from "../../../components/Header.vue";
  import {Dialog} from "vant";
  import {Toast} from "vant";
  import {getAddress, createAddress, updateAddress, deleteAddress} from "../../../api/address";
  import {getAreaList} from "../../../api/area";

  export default {
    name: "EditAddress",
    components: {
      Header
    },
    data() {
      return {
        headerTitle: "",
        addressForm: {},
        id: "",
        title: "",
        name: "",
        showPopup: false,
        areaList: {}
      };
    },

    methods: {
      getAreaList() {
        getAreaList().then()
      },
      goBack() {
        history.go(-1);
      },
      getId() {
        if (!this.$route.params.id) {
          this.toAdd();
        } else {
          this.toEdit();
        }
      },
      // 创建
      toAdd() {
        this.title = "add";
        this.headerTitle = "新增地址";
      },
      toEdit() {
        this.title = "edit";
        this.headerTitle = "修改地址";
        this.id = this.$route.params.id;
        if (this.title === "edit") {
          getAddress(this.id).then(res => {
            this.addressForm = res.data.content;
            this.addressForm.area = this.addressForm.province + this.addressForm.city + this.addressForm.district;
          }).catch(error => {
            Toast(error.response.data.message);
          });
        }
      },
      //删除
      deleteDate() {
        Dialog.confirm({
          title: '提示',
          message: '确定删除?',
          showCancelButton: true
        }).then(action => {
          if (action === "confirm") {
            deleteAddress(this.id).then(res => {
              if (res.data.code === 1) {
                this.$router.go(-1);
              }
            }).catch(error => {
              Toast(error.response.data.message);
            });
          }
        });
      },
      confirm() {
        if (!this.addressForm.name || !this.addressForm.mobile || !this.addressForm.area || !this.addressForm.addr) {
          return Toast("请将信息填写完整！");
        }
        this.$messagebox({
          title: "提示",
          message: "确定提交吗？",
          showCancelButton: true
        }).then(action => {
          if (action === "confirm") {
            this.id = this.$route.params.id;
            if (this.title === "edit") {
              updateAddress(this.id, this.addressForm).then(res => {
                if (res.data.code === 1) {
                  this.$router.go(-1);
                }
              }).catch(error => {
                Toast(error.response.data.message);
              });
            } else {
              createAddress(this.addressForm).then(res => {
                if (res.data.code === 1) {
                  this.$router.go(-1);
                }
              }).catch(error => {
                Toast(error.response.data.message);
              });
            }
          }
        });
      },
      onAddrConfirm(e) {
        this.addressForm.province = e[0].name;
        this.addressForm.city = e[1].name;
        this.addressForm.district = e[2].name;
        this.addressForm.area = this.addressForm.province + this.addressForm.city + this.addressForm.district;
        this.showPopup = false;
      }
    },
    computed: {
      show() {
        return this.$store.state.ifShowH5NavBar;
      }
    },
    created() {
    },
    mounted() {
      this.getId();
      this.getAreaList();
    }
  };
</script>

<style scoped>
  @import '../address.css';
</style>
