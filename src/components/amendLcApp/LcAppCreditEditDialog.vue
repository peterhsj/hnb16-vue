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
        <span>開狀申請書-授信資料</span>
        <v-spacer />

        <v-btn
          density="comfortable"
          icon="mdi-close"
          variant="flat"
          @click="onClose"
        />
      </v-card-title>

      <LcAppCreditEditForm
        :app-no="props.appNo"
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
    isLcAppCreditEditDialog?: boolean
    isShowPreview?: boolean
    appNo?: string
  }
  const props = withDefaults(defineProps<Props>(), {
    isLcAppCreditEditDialog: false,
    isShowPreview: false,
    appNo: '',
  })

  const show = ref<boolean>(props.isLcAppCreditEditDialog)
  watch(
    () => props.isLcAppCreditEditDialog,
    newVal => {
      show.value = newVal
    },
  )
  watch(
    () => show.value,
    newVal => {
      emits('update:isLcAppCreditEditDialog', newVal)
    },
  )

  const emits = defineEmits<{
    'update:isLcAppCreditEditDialog': [boolean]
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
