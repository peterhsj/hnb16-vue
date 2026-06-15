<template>
  <v-dialog
    v-model="show"
    persistent
    width="1100"
  >
    <v-card
      class="hnb__dialog"
    >
      <v-card-title class="d-flex px-4 font-weight-bold text-red-darken-3">
        <span>修改申請書-授信資料</span>
        <v-spacer />

        <v-btn
          density="comfortable"
          icon="mdi-close"
          variant="flat"
          @click="onClose"
        />
      </v-card-title>

      <AmendLcAppCreditEditForm
        :app-no="props.amendAppNo"
        :is-show-preview="props.isShowPreview"
        @on-close="handleClose"
        @on-save="handleSave"
      />

    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
  import { ref, watch } from 'vue'

  interface Props {
    isAmendLcAppCreditEditDialog?: boolean
    amendAppNo?: string
    isShowPreview?: boolean
  }
  const props = withDefaults(defineProps<Props>(), {
    isAmendLcAppCreditEditDialog: false,
    amendAppNo: '',
    isShowPreview: false,
  })

  const show = ref<boolean>(props.isAmendLcAppCreditEditDialog)
  watch(
    () => props.isAmendLcAppCreditEditDialog,
    newVal => {
      show.value = newVal
    },
  )
  watch(
    () => show.value,
    newVal => {
      emits('update:isAmendLcAppCreditEditDialog', newVal)
    },
  )

  const emits = defineEmits<{
    'update:isAmendLcAppCreditEditDialog': [boolean]
    'on-close': []
    'on-save': []
  }>()

  function handleClose (): void {
    onClose()
  }

  function handleSave (): void {
    onSave()
  }

  function onClose (): void {
    show.value = false
    emits('on-close')
  }

  function onSave (): void {
    console.log('儲存')
    // TODO: 儲存邏輯

    emits('on-save')
    show.value = false
  }
</script>
