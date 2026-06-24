<template>
  <v-dialog
    v-model="show"
    persistent
    width="700"
  >
    <v-card
      class="hnb__dialog"
    >
      <v-card-title class="d-flex px-4 font-weight-bold text-red-darken-3">
        <span>{{ props.editType === 'new' ? '新增' : '編輯' }}分行資料</span>
        <v-spacer />

        <v-btn
          density="comfortable"
          icon="mdi-close"
          variant="flat"
          @click="onClose"
        />
      </v-card-title>

      <v-form ref="formRef" @submit.prevent="saveData">
        <v-card-text class="d-flex align-center bg-grey-lighten-4">
          <v-row class="align-center">

            <v-col class="d-flex align-center ga-4 text-body-1 " cols="12">
              <div class="font-weight-medium text-no-wrap hnb__form-label">分行名稱</div>

              <v-text-field
                v-model="form.branchName"
                color="teal-darken-2"
                density="compact"
                hide-details
                variant="outlined"
              />
            </v-col>

            <v-col class="d-flex align-center ga-4 text-body-1 " cols="12">
              <div class="font-weight-medium text-no-wrap hnb__form-label">分行代碼</div>

              <v-text-field
                v-model="form.branchCode"
                color="teal-darken-2"
                density="compact"
                hide-details
                variant="outlined"
              />
            </v-col>

            <v-col class="d-flex align-center ga-4 text-body-1 " cols="12">
              <div class="font-weight-medium text-no-wrap hnb__form-label">分行地址</div>

              <v-text-field
                v-model="form.address"
                color="teal-darken-2"
                density="compact"
                hide-details
                variant="outlined"
              />
            </v-col>

            <v-col class="d-flex align-center ga-4 text-body-1 " cols="12">
              <div class="font-weight-medium text-no-wrap hnb__form-label">電話</div>

              <v-text-field
                v-model="form.phone"
                color="teal-darken-2"
                density="compact"
                hide-details
                variant="outlined"
              />
            </v-col>

            <v-col class="d-flex align-center ga-4 text-body-1 " cols="12">
              <div class="font-weight-medium text-no-wrap hnb__form-label">聯絡人</div>

              <v-text-field
                v-model="form.contactPerson"
                color="teal-darken-2"
                density="compact"
                hide-details
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
            type="submit"
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
  import type { FormPayload, ListItem } from '@/types/managerBranch'
  import { computed, ref } from 'vue'
  import { VForm } from 'vuetify/components'

  const formRef = ref<InstanceType<typeof VForm>>()

  interface Props {
    isEditDialogOpen?: boolean
    editType?: string
    dataItem?: ListItem
  }
  const props = withDefaults(defineProps<Props>(), {
    isEditDialogOpen: false,
    editType: 'new',
    dataItem: () => ({
      branchId: '',
      branchName: '',
      branchCode: '008',
      address: '',
      phone: '',
      contactPerson: '',
    }),
  })

  const emits = defineEmits<{
    'update:isEditDialogOpen': [boolean]
    'on-save': []
    'on-close': []
  }>()

  const show = computed({
    get: () => props.isEditDialogOpen,
    set: (value: boolean) => {
      emits('update:isEditDialogOpen', value)
    },
  })

  const form = ref<FormPayload>({
    branchId: '',
    branchName: '',
    branchCode: '008',
    address: '',
    phone: '',
    contactPerson: '',
  })

  function onClose (): void {
    show.value = false
    emits('on-close')
  }

  function saveData (): void {
    if (formRef.value?.validate()) {
      // 在這裡處理表單提交邏輯
      console.log('表單資料:', form.value)
    }
    emits('on-save')
  }
</script>
