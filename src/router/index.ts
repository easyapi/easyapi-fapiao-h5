// https://router.vuejs.org/zh/
import { createRouter, createWebHistory } from 'vue-router';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
NProgress.configure({ showSpinner: true });

// 导入路由组件
import mian from '@/views/index.vue';
import error from '@/views/error.vue';
import rule from '@/views/rule.vue';
import invoiceRecord from '@/views/invoice/record/index.vue';
import invoiceDetail from '@/views/invoice/detail/index.vue';
// import mock from '@/views/mock/index.vue';
// import charts from '@/views/charts/index.vue';

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
    path: '/invoice/record',
    name: 'invoiceRecord',
    component: invoiceRecord,
  },
  {
    path: '/invoice/detail',
    name: 'invoiceDetail',
    component: invoiceDetail,
  },
  // {
  //   path: '/mock',
  //   name: 'mock',
  //   component: mock,
  // },
  // {
  //   path: '/charts',
  //   name: 'charts',
  //   component: charts,
  // },
];

// 创建路由实例并传递 `routes` 配置
const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    // 始终滚动到顶部
    return { top: 0 };
  },
});

router.beforeEach((_to, _from, next) => {
  NProgress.start(); // start progress bar
  next();
});

router.afterEach(() => {
  NProgress.done(); // finish progress bar
});

// 导出路由实例，并在 `main.ts` 挂载
export default router;
