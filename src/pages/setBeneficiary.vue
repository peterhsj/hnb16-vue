<template>
  <div>
    <v-container fluid>
      <div class="hnb16__breadcrumb mb-2">
        <v-breadcrumbs density="compact" :items="breadcrumbs">
          <template #divider>
            <v-icon icon="mdi-chevron-right" size="small" />
          </template>
        </v-breadcrumbs>
      </div>

      <div v-if="currentView === 'search'">
        <h2 class="mx-4 hnb16__title">查詢受益人資料</h2>

        <v-card class="border-sm mx-4 pa-4 pt-1 bg-grey-lighten-4" variant="outlined">
          <v-form ref="searchFormRef" @submit.prevent="sendSearchForm">
            <div class="py-1">
              <v-radio-group
                v-model="searchForm.importType"
                hide-details="auto"
                inline
              >
                <v-row class="ma-0">
                  <v-col v-for="option in QUERY_MODE_OPTIONS" :key="option.value" class="px-2" cols="auto">
                    <v-radio
                      color="teal-darken-2"
                      density="compact"
                      hide-details
                      :value="option.value"
                    >
                      <template #label>
                        <span class="px-2">{{ option.title }}</span>
                      </template>
                    </v-radio>
                  </v-col>
                </v-row>
              </v-radio-group>
            </div>

            <v-row>
              <v-col class="d-flex justify-end" cols="12">
                <v-btn
                  class="hnb__btn--cancel mx-1"
                  @click="resetForm"
                >
                  重設
                </v-btn>

                <v-btn
                  class="hnb__btn--default mx-1"
                  :disabled="!searchEnabled"
                  type="submit"
                >
                  確定
                </v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-card>
      </div>

      <!-- 受益人資料清冊 -->
      <div v-if="isShowList" class="mt-4 mx-4">
        <h2 class="hnb16__title">
          受益人資料清冊
        </h2>

        <SetBeneficiaryList
          :bene-type="beneType"
          @on-edit="handleEdit"
        />
      </div>
    </v-container>
  </div>
</template>

<script setup lang="ts">
  import type { QueryFormPayload } from '@/types/setBeneficiary'
  import { computed, reactive, ref } from 'vue'
  import { VForm } from 'vuetify/components'
  import {
    createInitialQueryForm,
  } from '@/types/setBeneficiary'
  const breadcrumbs = [
    { title: '首頁', href: '/' },
    { title: '客戶管理作業' },
    { title: '受益人資料', disabled: true },
  ]

  interface QueryModeItem {
    value: string
    title: string
  }

  const QUERY_MODE_OPTIONS: QueryModeItem[] = [
    { value: 'fpc', title: '台塑 e 化集團' },
    { value: 'cds', title: 'CDS 客戶受益人' },
  ]
  const beneType = ref<string>('')

  const currentView = ref('search')
  const isEdit = ref(false)
  const isShowList = ref(false)
  const searchFormRef = ref<InstanceType<typeof VForm>>()
  const searchForm = reactive<QueryFormPayload>(createInitialQueryForm())
  const propsFormData = ref<QueryFormPayload>({ ...searchForm })

  const searchEnabled = computed(() => searchForm.importType !== '')

  function resetForm (): void {
    searchFormRef.value?.reset()
    isShowList.value = false
  }

  function sendSearchForm (): void {
    console.log('送出表單', searchForm)
    beneType.value = searchForm.importType || ''
    isShowList.value = true
  }

  // 編輯押匯申請書
  function handleEdit (payload: { appNo: string }): void {
    console.log('編輯事件觸發，接收到 payload:', payload)
    // draftLcData.value = { appNo: payload.appNo }
    currentView.value = ''
    isShowList.value = false
    isEdit.value = true
  }

  function closeEditForm (): void {
    isEdit.value = false
    isShowList.value = true
    currentView.value = 'search'
    searchFormRef.value?.reset()
  }

  function submitEditForm (): void {
    // 送出編輯表單後的處理邏輯（例如刷新列表、顯示成功訊息等）
    console.log('編輯表單已送出，執行相關處理')
    // 這裡可以根據實際需求來決定是否要關閉編輯表單或是刷新列表等
    closeEditForm()
  }

  function _onBreadcrumbClick (item: any): void {
    if (item.disabled || !item.to) return
    if (typeof item.to === 'string') {
      if (item.title === '首頁') {
        location.href = '/'
      }

      if (item.title === '利率約定(改貸)') {
        isEdit.value = false
        isShowList.value = false
        currentView.value = 'search'
        searchForm.importType = '' // 重置查詢方式，強制使用者重新選擇
      }
    }
  }
</script>
