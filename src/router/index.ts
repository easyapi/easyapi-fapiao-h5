import companyEdit from '@/views/company/edit/index.vue'

import companyList from '@/views/company/list/index.vue'
import error from '@/views/error.vue'
// 导入路由组件
import mian from '@/views/index.vue'
import invoiceDetail from '@/views/invoice/detail/index.vue'
import invoiceList from '@/views/invoice/list/index.vue'
import invoiceOutOrder from '@/views/invoice/out-order/index.vue'
import makeCategory from '@/views/make/category/index.vue'
import makeMergeOrder from '@/views/make/merge/merge-order.vue'
import makeProduct from '@/views/make/product/index.vue'
import singleOrderSuccess from '@/views/make/single-order-success.vue'
import makeSingleQuery from '@/views/make/single-query/index.vue'
import makeSingleOrder from '@/views/make/single/index.vue'
import makeSuccess from '@/views/make/success.vue'
import mallOrderJd from '@/views/mall-order/jd.vue'
import mallOrderKuaishou from '@/views/mall-order/kuaishou.vue'
import mallOrderYouZan from '@/views/mall-order/youzan.vue'
import outOrder from '@/views/out-order/index.vue'
import pending from '@/views/pending/index.vue'
import success from '@/views/pending/success.vue'
import rule from '@/views/rule.vue'
import NProgress from 'nprogress'
// https://router.vuejs.org/zh/
import { createRouter, createWebHistory } from 'vue-router'
import 'nprogress/nprogress.css'

NProgress.configure({ showSpinner: true })

// 定义路由，每个路由都需要映射到一个组件
const routes = [
  {
    path: '/',
    name: 'main',
    component: mian,
  },
  {
    path: '/error',
    name: 'error',
    component: error,
  },
  {
    path: '/rule',
    name: 'rule',
    component: rule,
  },
  {
    path: '/invoice/list',
    name: 'invoiceList',
    component: invoiceList,
  },
  {
    path: '/invoice/detail',
    name: 'invoiceDetail',
    component: invoiceDetail,
  },
  {
    path: '/invoice/out-order',
    name: 'invoiceOutOrder',
    component: invoiceOutOrder,
  },
  {
    path: '/company/list',
    name: 'companyList',
    component: companyList,
  },
  {
    path: '/company/edit',
    name: 'companyEdit',
    component: companyEdit,
  },
  {
    path: '/make/product',
    name: 'makeProduct',
    component: makeProduct,
  },
  {
    path: '/make/success',
    name: 'makeSuccess',
    component: makeSuccess,
  },
  {
    path: '/make/single-order-success',
    name: 'singleOrderSuccess',
    component: singleOrderSuccess,
  },
  {
    path: '/make/category',
    name: 'makeCategory',
    component: makeCategory,
  },
  {
    path: '/make/merge-order',
    name: 'makeMergeOrder',
    component: makeMergeOrder,
  },
  {
    path: '/make/single-order',
    name: 'makeSingleOrder',
    component: makeSingleOrder,
  },
  {
    path: '/make/single-query',
    name: 'makeSingleQuery',
    component: makeSingleQuery,
  },
  {
    path: '/out-order',
    name: 'outOrder',
    component: outOrder,
  },
  {
    path: '/mall-order/jd',
    name: 'OrderMakeJd',
    component: mallOrderJd,
  },
  {
    path: '/mall-order/kuaishou',
    name: 'OrderMakeKuaishou',
    component: mallOrderKuaishou,
  },
  {
    path: '/mall-order/youzan',
    name: 'OrderMakeYouZan',
    component: mallOrderYouZan,
  },
  {
    path: '/pending/index',
    name: 'pending',
    component: pending,
  },
  {
    path: '/pending/success',
    name: 'success',
    component: success,
  },
]

// 创建路由实例并传递 `routes` 配置
const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    // 始终滚动到顶部
    return { top: 0 }
  },
})

router.beforeEach((_to, _from, next) => {
  NProgress.start() // start progress bar
  next()
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})

// 导出路由实例，并在 `main.ts` 挂载
export default router
