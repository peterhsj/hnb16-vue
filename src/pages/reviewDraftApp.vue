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

      <!-- Prompt Dialog -->
      <PromptDialog
        v-model:message-dialog="messageDialog"
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
  import { ref } from 'vue'

  const isShowBeneList = ref(true)
  const isShowList = ref(false)

  const breadcrumbs = [
    { title: '首頁', to: '/' },
    { title: '編審作業' },
    { title: '押匯申請', to: '/reviewDraftApp' },
  ]

  // Prompt Message Dialog
  const messageDialog = ref<boolean>(false)
  const messageTitle = ref<string>('')
  const message = ref<string>('')
  const messageStatus = ref<string>('')
  const isConfirmBtn = ref<boolean>(false)
  const _processStatus = ref<string>('')

  const searchForm = ref({
    beneficiaryId: '',
  })

  function handleShowList (beneficiaryId: string): void {
    searchForm.value.beneficiaryId = beneficiaryId
    console.log('Search Form:', searchForm.value)
    nextTick()
    isShowBeneList.value = false
    isShowList.value = true
  }

  function draftReview (draftNo: string): void {
    console.log('View Draft No:', draftNo)
  }

  // 離開 message
  function messageClose (): void {
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
      }
    }
  }
</script>
