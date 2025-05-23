<script setup lang="ts">
import orderType from '@/api/order-type'
import setting from '@/api/setting'
import { localStorage } from '@/utils/local-storage'

const route = useRoute()
const router = useRouter()

const state = shallowReactive({
  ifProductMake: false, // 是否支持商品清单开票
  ifMoneyMake: false, // 是否支持金额开票
  ifOrderMake: false, // 是否支持订单开票
  orderTypeList: [], // 订单开票类型列表
  remark: '',
})

/**
 * 初始化
 */
function initialization() {
  localStorage.remove('ifProductMake')
  localStorage.remove('ifMoneyMake')
  localStorage.remove('ifOrderMake')
  if (route.query.accessToken) {
    localStorage.set('accessToken', route.query.accessToken)
  }
  else {
    if (!localStorage.get('accessToken'))
      router.push('/error')
  }
}

function gotoMake() {
  if (state.ifProductMake)
    router.push('/make/product')

  if (state.ifMoneyMake)
    router.push('/make/category')
}

/**
 * 获取订单类型列表
 */
function getOrderTypeList() {
  orderType.getOrderTypeList().then((res) => {
    if (res.code === 1)
      state.orderTypeList = res.content
  })
}

/**
 * 获取发票开票类型
 */
function findSetting() {
  setting.findSetting({
    fieldKeys: 'if_product' + ',' + 'if_money' + ',' + 'if_order' + ',' + 'h5_index_remark',
  }).then((res) => {
    if (res.code === 1) {
      for (const setting of res.content) {
        if (setting.fieldKey === 'if_product') {
          state.ifProductMake = setting.fieldValue === 'true'
          localStorage.set('ifProductMake', state.ifProductMake)
        }
        else if (setting.fieldKey === 'if_money') {
          state.ifMoneyMake = setting.fieldValue === 'true'
          localStorage.set('ifMoneyMake', state.ifMoneyMake)
        }
        else if (setting.fieldKey === 'if_order') {
          state.ifOrderMake = setting.fieldValue === 'true'
          localStorage.set('ifOrderMake', state.ifOrderMake)
        }
        else if (setting.fieldKey === 'h5_index_remark') {
          state.remark = setting.fieldValue
        }
      }
    }
  })
}

onMounted(() => {
  initialization()
  getOrderTypeList()
  setTimeout(() => {
    findSetting()
  }, 50)
})
</script>

<template>
  <div>
    <van-cell-group v-if="state.ifOrderMake === true" title="订单开票" inset>
      <van-cell
        v-for="item in state.orderTypeList" :key="item.orderTypeId" :title="item.name" is-link
        :to="{ path: '/out-order', query: { type: item.name } }" size="large"
      />
    </van-cell-group>
    <van-cell-group title="发票管理" inset>
      <van-cell title="开票记录" is-link to="/invoice/list" />
      <van-cell title="开票规则" is-link to="/rule" />
      <van-cell title="抬头管理" is-link :to="{ path: '/company/list', query: { from: 'index' } }" />
    </van-cell-group>
    <div class="remark">
      <div v-html="state.remark" />
    </div>
    <div v-if="state.ifProductMake || state.ifMoneyMake" class="bottom fixed-bottom-bgColor">
      <van-button type="primary" class="submit" block @click="gotoMake">
        我要开票
      </van-button>
    </div>
  </div>
</template>

<style lang="less" scoped>
.remark {
  padding: 15px 16px;
  color: #666;
  font-size: 12px;
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
