<template>
  <v-dialog
    v-model="show"
    persistent
    width="600"
  >
    <v-card
      class="hnb__dialog"
    >
      <v-card-title class="d-flex px-4 font-weight-bold text-red-darken-3">
        <span>設定客戶資料</span>
        <v-spacer />

        <v-btn
          density="comfortable"
          icon="mdi-close"
          variant="flat"
          @click="onClose"
        />
      </v-card-title>

      <v-form ref="formRef" @submit.prevent="saveCustomerData">
        <v-card-text class="d-flex align-center bg-grey-lighten-4">
          <v-row class="align-center">
            <v-col class="d-flex align-center ga-4 text-body-1 " cols="12">
              <div class="font-weight-medium text-no-wrap hnb__form-label">公司名稱</div>
              <span>網際股份有限公司</span>
            </v-col>

            <v-col class="d-flex align-center ga-4 text-body-1 " cols="12">
              <div class="font-weight-medium text-no-wrap hnb__form-label">檢附本票</div>

              <v-checkbox
                v-model="form.hasPromissoryNote"
                color="cyan-darken-3"
                density="compact"
                hide-details
              >
                <template #label>
                  <span class="text-body-2">統一發票</span>
                </template>
              </v-checkbox>
            </v-col>

            <v-col class="d-flex align-center ga-4 text-body-1 " cols="12">
              <div class="font-weight-medium text-no-wrap hnb__form-label">本票帳號</div>

              <v-text-field
                v-model="form.accountNo"
                color="teal-darken-2"
                density="compact"
                hide-details
                variant="outlined"
              />
            </v-col>

            <v-col class="d-flex align-center ga-4 text-body-1 " cols="12">
              <div class="font-weight-medium text-no-wrap hnb__form-label">本票印鑑</div>

              <v-file-input
                v-model="form.stampFile"
                accept="image/*"
                clearable
                color="teal-darken-2"
                density="compact"
                hide-details="auto"
                hint="檔案大小不能超過 15 KB"
                persistent-hint
                prepend-icon="mdi-file-image"
                :rules="[v => !v || v.size < 15360 || '檔案大小不能超過 15 KB']"
                show-size
                variant="outlined"
              />
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions>
          <v-spacer />

          <v-btn
            class="hnb__btn--cancel mx-1 my-2"
            @click="onClose"
          >
            取消
          </v-btn>

          <v-btn
            class="hnb__btn--default mx-1 my-2"
            @click="promptConfirm"
          >
            確定
          </v-btn>

          <v-spacer />
        </v-card-actions>
      </v-form>

    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
  import type { FormPayload } from '@/types/setCustomer'
  import { computed, ref } from 'vue'
  import { VForm } from 'vuetify/components'

  const formRef = ref<InstanceType<typeof VForm>>()

  interface Props {
    isEditDialogOpen?: boolean
    senNo?: string
  }
  const props = withDefaults(defineProps<Props>(), {
    isEditDialogOpen: false,
    senNo: '',
  })

  const emits = defineEmits<{
    'update:isEditDialogOpen': [boolean]
    'save-customer-data': []
    'on-close': []
  }>()

  const show = computed({
    get: () => props.isEditDialogOpen,
    set: (value: boolean) => {
      emits('update:isEditDialogOpen', value)
    },
  })

  const form = ref<FormPayload>({
    hasPromissoryNote: false,
    accountNo: '',
    stampFile: null,
  })

  function onClose (): void {
    show.value = false
    emits('on-close')
  }

  function promptConfirm (): void {
    emits('save-customer-data')
    // show.value = false
  }

  function saveCustomerData (): void {
    if (formRef.value?.validate()) {
      // 在這裡處理表單提交邏輯
      console.log('表單資料:', form.value)
    }
  }
</script>
