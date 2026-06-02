<template>
  <div>
    <!-- 查詢押匯提示 -->
    <v-container fluid>
      <div class="hnb16__breadcrumb mb-2">
        <v-breadcrumbs density="compact" :items="breadcrumbs">
          <template #divider>
            <v-icon icon="mdi-chevron-right" size="small" />
          </template>
        </v-breadcrumbs>
      </div>

      <div v-if="currentView === 'search'">
        <h2 class="mx-4 hnb16__title">查詢押匯提示</h2>

        <v-card class="border-sm mx-4 pa-4 pt-1 bg-grey-lighten-4" variant="outlined">
          <v-form ref="searchFormRef" @submit.prevent="sendSearchForm">
            <div class="py-1">
              <v-row class="ma-0">
                <v-col class="d-flex align-center ga-4" cols="12" lg="4" md="6">
                  <div class="text-body-1 font-weight-medium text-no-wrap hnb__form-label">受益人</div>

                  <v-select
                    v-model="searchForm.beneficiary"
                    bg-color="white"
                    clearable
                    color="teal-darken-2"
                    density="compact"
                    hide-details="auto"
                    item-title="title"
                    item-value="value"
                    :items="[...BENEFICIARY_ITEMS]"
                    placeholder="請選擇"
                    variant="outlined"
                  />
                </v-col>
              </v-row>
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
                  :disabled="!searchForm.beneficiary"
                  type="submit"
                >
                  確定
                </v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-card>
      </div>

      <!-- 押匯提示明細 -->
      <div v-if="isShowList" class="mt-4 mx-4">
        <div class="d-flex align-center justify-space-between">
          <h2 class="hnb16__title">
            押匯提示明細
          </h2>

          <div>
            <v-btn
              class="hnb__btn--default mx-1"
              prepend-icon="mdi-download"
              size="small"
              variant="flat"
              @click="handleDownload"
            >
              下載電子檔
            </v-btn>

            <v-btn
              class="hnb__btn--orange mx-1"
              prepend-icon="mdi-printer"
              size="small"
              variant="flat"
              @click="handlePrint"
            >
              列印
            </v-btn>
          </div>
        </div>

        <PromptDraftList :form-data="(propsFormData as any)" @on-edit="handleEdit" />
      </div>
    </v-container>
  </div>
</template>

<script setup lang="ts">
  import type { QueryFormPayload } from '@/types/promptDraft'
  import { reactive, ref } from 'vue'
  import { VForm } from 'vuetify/components'
  import PromptDraftList from '@/components/promptDraft/PromptDraftList.vue'
  import {
    BENEFICIARY_ITEMS,
    createInitialQueryForm,
  } from '@/types/promptDraft'

  const breadcrumbs = [
    { title: '首頁', href: '/' },
    { title: '電子押匯提示作業' },
    { title: '押匯提示', disabled: true },
  ]

  const currentView = ref('search')
  const isEdit = ref(false)
  const isShowList = ref(false)
  const searchFormRef = ref<InstanceType<typeof VForm>>()
  const searchForm = reactive<QueryFormPayload>(createInitialQueryForm())
  const propsFormData = ref<QueryFormPayload>({ ...searchForm })

  function resetForm (): void {
    searchFormRef.value?.reset()
    isShowList.value = false
  }

  function sendSearchForm (): void {
    console.log('送出表單', searchForm)
    isShowList.value = true
    propsFormData.value = { ...searchForm }
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

  function _submitEditForm (): void {
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
        searchForm.beneficiary = '' // 重置受益人，強制使用者重新選擇
      }
    }
  }

  function handlePrint (): void {
    window.print()
  }

  function handleDownload (): void {
    console.log('下載電子檔')
  }
</script>
