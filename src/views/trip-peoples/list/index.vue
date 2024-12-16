<script setup lang="ts">
import travelers from '@/api/travelers'
import { useStore } from '@/stores'
import { idTypes, vehicleTypes } from '@/utils/business'
import { closeToast, showConfirmDialog, showLoadingToast, showToast } from 'vant'

const store = useStore()
const route = useRoute()

const state = reactive({
  noData: false,
  loading: true,
  noMoreData: false,
  tripPeoplesList: [],
  tripPeoplesData: {},
  tripPeopleName: '',
  pagination: {
    page: 0,
    size: 10,
    totalPages: 0,
  },
  checked: 0,
})

/**
 * 展示出行人列表
 */
function getTravelers() {
  showLoadingToast({
    duration: 0,
    message: '加载中...',
    forbidClick: true,
  })
  const params = {
    traveler: state.tripPeopleName,
    size: state.pagination.size,
    page: state.pagination.page,
  }
  travelers.getTravelers(params).then((res) => {
    state.loading = false
    closeToast()
    if (res.code === 1) {
      state.tripPeoplesList = res.content
      showIdTypeAndVehicle()
    }
    else {
      state.tripPeoplesList = []
      state.pagination.totalPages = 0
      deleteIdTypeAndVehicle()
    }
  })
}

/**
 * 根据名称查询
 */
function tripPeopleNameSearch() {
  state.tripPeoplesList = []
  state.pagination.page = 0
  state.noData = false
  state.noMoreData = false
  state.loading = true
  getTravelers()
}

/**
 * 选择出行人
 * @param item
 */
function select(item) {
  state.tripPeoplesData = item
  state.checked = item.travelerId
  const index = route.query.selectId
  const tripPeoplesData = JSON.parse(localStorage.getItem('tripPeopleData'))
  tripPeoplesData[index] = state.tripPeoplesData
  localStorage.setItem('tripPeopleData', JSON.stringify(tripPeoplesData))
  history.back()
}

function deleteTripPeople(item) {
  showConfirmDialog({
    title: '提示',
    message: '确定删除出行人吗？',
  })
    .then(() => {
      travelers.deleteTravelers(item.travelerId).then((res) => {
        state.loading = false
        closeToast()
        if (res.code === 1) {
          showToast('删除成功')
          getTravelers()
        }
        else {
          showToast(res.message)
        }
      })
    })
}

/**
 * 显示证件类型&交通工具
 */
function showIdTypeAndVehicle() {
  state.tripPeoplesList.forEach((item) => {
    const idType = idTypes.find(type => type.value === item?.idType)
    const vehicleType = vehicleTypes.find(type => type.value === item?.vehicleType)

    item.pickerValueOne = idType ? idType.text : ''
    item.pickerValueTwo = vehicleType ? vehicleType.text : ''
  })
}

function deleteIdTypeAndVehicle() {
  state.tripPeoplesList.forEach((item) => {
    item.pickerValueOne = ''
    item.pickerValueTwo = ''
  })
}

onMounted(() => {
  document.title = '出行人管理'
  getTravelers()
})
</script>

<template>
  <Header v-if="store.ifShowH5NavBar" header-title="出行人员管理" />
  <div :class="store.ifShowH5NavBar ? 'search-top' : 'search'">
    <van-search
      v-model="state.tripPeopleName"
      placeholder="请输入出行人名称"
      @update:model-value="tripPeopleNameSearch"
    />
  </div>
  <div class="search-placeholder" />
  <div class="company">
    <div v-if="!state.loading">
      <div v-if="state.tripPeoplesList.length === 0">
        <van-empty image="search" description="暂无数据" />
      </div>
      <div v-else class="company-list">
        <van-radio-group v-model="state.checked">
          <div
            v-for="(item, index) in state.tripPeoplesList"
            :key="index"
            class="company-list-item"
            @click="select(item)"
          >
            <van-radio
              class="company-list-item_radio"
              :name="item.travelerId"
            />
            <div style="flex: 1">
              <van-swipe-cell>
                <div class="company-list-item_name">
                  <div class="company-list-item_tag">
                    <span class="rise-text">{{ item.traveler }}</span>
                  </div>
                  <div class="company-list-item_taxNumber">
                    {{ item.pickerValueOne }} {{ item.idNumber }}
                  </div>
                  <div class="company-list-item_taxNumber">
                    {{ item.travelDeparturePlace }} - {{ item.travelDestinationPlace }}
                  </div>
                  <div class="company-list-item_taxNumber">
                    {{ item.pickerValueTwo }} / {{ item.level }}
                  </div>
                </div>
                <template #right>
                  <van-button square text="删除" type="danger" class="delete-button" @click="deleteTripPeople(item)" />
                </template>
              </van-swipe-cell>
            </div>
          </div>
        </van-radio-group>
      </div>
    </div>
    <div v-if="state.loading" class="loading">
      <div>加载中......</div>
    </div>
    <div v-if="state.noMoreData" class="no-more-data">
      <div>没有更多数据了</div>
    </div>
  </div>
</template>

<style lang="less">
.company {
  .van-cell__value {
    min-width: 70%;
    text-align: left;

    span {
      display: inline-block;
      word-break: break-all;
    }
  }
}
</style>

<style lang="less" scoped>
.search-top {
  position: fixed;
  top: 46px;
  left: 0;
  right: 0;
  z-index: 99;
}

.search {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 99;
}

.search-placeholder {
  width: 100%;
  height: 54px;
}

.company {
  padding-bottom: 64px;

  .company-list {
    padding: 0 16px;
    .company-list-item {
      border-radius: 5px;
      box-shadow: 0 2px 15px 0 rgba(0, 0, 0, 0.11);
      margin-top: 15px;
      overflow: hidden;
      background: #fff;
      display: flex;
      align-items: center;

        .company-list-item_radio {
          padding-left: 10px;
          margin-right: 20px;
        }

        .company-list-item_name {
          padding: 15px 10px;
          .company-list-item_tag {
            display: flex;
            align-items: center;

            .tag {
              margin-right: 5px;
            }

            .rise-text {
              max-width: 200px;
              display: block;
              overflow: hidden; /*内容超出后隐藏*/
              text-overflow: ellipsis; /* 超出内容显示为省略号*/
              white-space: nowrap; /*文本不进行换行*/
              font-size: 16px;
              font-weight: 550;
            }
          }

          .company-list-item_taxNumber {
            margin-top: 10px;
            color: #999;
            font-size: 12px;
          }
        }
      }
  }
}

.no-more-data {
  text-align: center;
  color: #999;
  line-height: 40px;
}

.loading {
  text-align: center;
  color: #999;
}

:deep(.van-swipe-cell__right) {
  display: flex;
  align-items: center;
}

.delete-button {
  height: 100%;
}
</style>
