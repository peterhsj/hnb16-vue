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

      <!-- 設定客戶資料 -->
      <div class="mt-4 mx-4">
        <div class="d-flex align-center justify-space-between">
          <h2 class="hnb16__title">
            設定客戶資料
          </h2>
        </div>

        <SetCustomerList @update="handleUpdate" />

        <EditCustomerDialog
          v-model:is-edit-dialog-open="isEditDialogOpen"
          :sen-no="selectedSenNo"
          @on-close="editDialogClose"
          @save-customer-data="saveCustomerData"
        />
      </div>
      <!-- 共用 Prompt Dialog -->
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
  import EditCustomerDialog from '@/components/setCustomer/EditCustomerDialog.vue'
  import SetCustomerList from '@/components/setCustomer/SetCustomerList.vue'

  // ── 共用狀態 ──────────────────────────────────────────────────────────────
  const messageDialog = ref<boolean>(false)
  const messageTitle = ref<string>('')
  const message = ref<string>('')
  const messageStatus = ref<string>('')
  const isConfirmBtn = ref<boolean>(false)
  const messageWidth = ref<string>('')

  const isEditDialogOpen = ref(false)
  const selectedSenNo = ref('')

  const breadcrumbs = [
    { title: '首頁', href: '/' },
    { title: '客戶管理作業' },
    { title: '設定客戶資料', disabled: true },
  ]

  function handleUpdate(senNo: string): void {
    selectedSenNo.value = senNo
    isEditDialogOpen.value = true
  }

  function saveCustomerData (): void {
    // 在這裡處理保存客戶資料的邏輯
    // 例如，可以發送 API 請求將資料保存到後端
    console.log('保存客戶資料')
    isEditDialogOpen.value = false
    messageWidth.value = '400px'
    messageTitle.value = '作業訊息'
    message.value = `作業已完成！`
    messageStatus.value = 'success'
    isConfirmBtn.value = false
    messageDialog.value = true
  }

  function editDialogClose (): void {
    isEditDialogOpen.value = false
    selectedSenNo.value = ''
  }

  function messageConfirm (): void {
    messageDialog.value = false
  }

  function messageClose (): void {
    messageDialog.value = false
  }
</script>
