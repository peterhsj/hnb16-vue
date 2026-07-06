<template>
  <div>
    <v-container fluid>
      <div class="hnb16__breadcrumb mb-2">
        <v-breadcrumbs density="compact" :items="breadcrumbs">
          <template #item="{ item }">
            <v-breadcrumbs-item
              :disabled="Boolean(item.disabled)"
              :title="item.title"
              :to="item.title === '申請作業' ? '' : item.to"
              @click="onBreadcrumbClick(item)"
            />
          </template>

          <template #divider>
            <v-icon icon="mdi-chevron-right" size="small" />
          </template>
        </v-breadcrumbs>
      </div>

      <div v-if="isShowBeneList" class="mt-4 mx-4">
        <h1 class="hnb16__title">押匯申請-受益人清冊</h1>

        <ReviewBeneList @on-show-list="handleShowList" />
      </div>

      <div v-if="isShowList" class="mt-4 mx-4">
        <h1 class="hnb16__title">押匯申請待審核清冊</h1>

        <ReviewDraftAppList :form-data="searchForm" @on-draft-review="draftReview" />
      </div>

      <div v-if="isShowApp" class="mt-4 mx-4">
        <h1 class="hnb16__title">審核匯票資料</h1>

        <ReviewDraft
          v-if="userInfo.roleName === 'BH'"
          @on-cancel="handleCancel"
          @on-submit="handleSubmit"
        />

        <v-card
          v-if="userInfo.roleName === 'BS'"
          class="border-sm mx-4 pa-4 bg-grey-lighten-4"
          variant="outlined"
        >
          <v-card-text class="bg-grey-lighten-4 pa-3">
            <DraftDetail
              :draft-no="selectedDraftNo"
            />

            <DraftInfo
              :data="{
                draftNo: selectedDraftNo,
              }"
              :is-show-deposit="true"
            />

            <div class="mt-4 text-center mx-auto">
              <div class="d-inline-flex align-center justify-center">
                <v-radio-group
                  v-model="reviewForm.reviewStatus"
                  color="cyan-darken-3"
                  density="compact"
                  hide-details="auto"
                  inline
                >
                  <v-radio value="approve">
                    <template #label>
                      <span class="text-body-2">核准</span>
                    </template>
                  </v-radio>

                  <v-radio class="ms-4" value="reject">
                    <template #label>
                      <span class="text-body-2">拒絕 / 拒絕原因：</span>

                      <v-select
                        v-model="reviewForm.rejectReason"
                        clearable
                        color="teal-darken-2"
                        density="compact"
                        :disabled="reviewForm.reviewStatus !== 'reject'"
                        hide-details="auto"
                        item-title="title"
                        item-value="value"
                        :items="[...REJECT_REASON_ITEMS]"
                        placeholder="請選擇"
                        variant="outlined"
                        width="200px"
                      />
                    </template>
                  </v-radio>
                </v-radio-group>
              </div>
            </div>

            <!-- ===== 共用底部按鈕列 ===== -->
            <div class="d-flex flex-wrap justify-center align-center ga-2 mt-6">
              <v-btn class="hnb__btn--cancel mx-1" @click="confirmCancel">
                取消
              </v-btn>

              <v-btn
                class="hnb__btn--default mx-1"
                :disabled="reviewForm.reviewStatus === '' || (reviewForm.reviewStatus === 'reject' && reviewForm.rejectReason === '')"
                @click="handlerReview"
              >
                確定
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </div>

      <!-- Prompt Dialog -->
      <PromptDialog
        v-model:message-dialog="messageDialog"
        :dialog-width="messageWidth"
        :is-confirm-btn="isConfirmBtn"
        :message="message"
        :message-status="messageStatus"
        :message-title="messageTitle"
        @on-close="messageClose"
        @prompt-confirm="messageConfirm"
      />
    </v-container>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { useUserStore } from '@/stores/user'

  const userStore = useUserStore()
  const userInfo = computed(() => userStore.userInfo)

  const isShowBeneList = ref(true)
  const isShowList = ref(false)
  const isShowApp = ref(false)
  const breadcrumbs = [
    { title: '首頁', to: '/' },
    { title: '編審作業' },
    { title: '押匯申請', to: '/reviewDraftApp' },
  ]

  const REJECT_REASON_ITEMS = [
    { title: '拒絕原因 1', value: 'r1' },
    { title: '拒絕原因 2', value: 'r2' },
    { title: '拒絕原因 3', value: 'r3' },
    { title: '拒絕原因 4', value: 'r4' },
  ]

  // Prompt Message Dialog
  const messageDialog = ref<boolean>(false)
  const messageWidth = ref<string>('auto')
  const messageTitle = ref<string>('')
  const message = ref<string>('')
  const messageStatus = ref<string>('')
  const isConfirmBtn = ref<boolean>(false)
  const processStatus = ref<string>('')

  const searchForm = ref({
    beneficiaryId: '',
  })

  const selectedDraftNo = ref<string>('')
  const reviewForm = ref({
    reviewStatus: '',
    rejectReason: null,
  })

  function handleShowList (beneficiaryId: string): void {
    searchForm.value.beneficiaryId = beneficiaryId
    console.log('Search Form:', searchForm.value)
    nextTick()
    isShowBeneList.value = false
    isShowList.value = true
  }

  function draftReview (draftNo: string): void {
    selectedDraftNo.value = draftNo
    console.log('View Draft No:', selectedDraftNo.value)
    isShowList.value = false
    isShowApp.value = true
  }

  function handleCancel (): void {
    isShowList.value = true
    isShowApp.value = false
  }

  function handleSubmit (): void {
    isShowList.value = true
    isShowApp.value = false
  }

  // ── 共用函式 ──────────────────────────────────────────────────────────────
  function confirmCancel (): void {
    messageTitle.value = '訊息通知'
    message.value = '離開不會儲存此筆資料，<br />您確認要離開嗎？'
    messageStatus.value = 'alert'
    processStatus.value = 'cancel'
    isConfirmBtn.value = true
    messageDialog.value = true
  }

  // 主管送出審核
  function handlerReview (): void {
    console.log('Submit payload:', reviewForm.value)
    try {
      if (reviewForm.value.reviewStatus === 'approve') {
        messageTitle.value = '作業訊息'
        message.value = `<p><span class="font-weight-bold">匯票號碼：</span> <span class="text-blue-grey-darken-4">H97000001</span></p>
          <p><span class="font-weight-bold">審核動作：</span> <span class="text-blue-grey-darken-4">核准</span></p>
          <p><span class="font-weight-bold">審核結果：</span> <span class="text-blue-grey-darken-4">審核完成</span></p>`
        messageStatus.value = 'success'
        messageWidth.value = '600px'
        isConfirmBtn.value = false
        messageDialog.value = true
        processStatus.value = 'success'
      } else if (reviewForm.value.reviewStatus === 'reject') {
        messageTitle.value = '作業訊息'
        message.value = `<p><span class="font-weight-bold">匯票號碼：</span> <span class="text-blue-grey-darken-4">H97000001</span></p>
          <p><span class="font-weight-bold">審核動作：</span> <span class="text-blue-grey-darken-4">退回經辦：王建明退回測試</span></p>
          <p><span class="font-weight-bold">審核結果：</span> <span class="text-blue-grey-darken-4">審核未完成</span></p>`
        messageStatus.value = 'error'
        messageWidth.value = '600px'
        isConfirmBtn.value = false
        messageDialog.value = true
        processStatus.value = 'reject'
      }
    } catch (error) {
      console.error('Error emitting submit event:', error)
    }
  }

  // 離開 message
  function messageClose (): void {
    if (processStatus.value === 'cancel') handleCancel()
    if (reviewForm.value.reviewStatus) {
      isShowList.value = true
      isShowApp.value = false
    }
    messageDialog.value = false
  }

  // 確認 message
  function messageConfirm (): void {
    messageDialog.value = false
  }

  function onBreadcrumbClick (item: any): void {
    if (item.disabled || !item.to) return

    if (typeof item.to === 'string') {
      if (item.title === '首頁') {
        location.href = '/'
      }

      if (item.title === '押匯申請') {
        isShowBeneList.value = true
        isShowList.value = false
        isShowApp.value = false
      }
    }
  }
</script>
