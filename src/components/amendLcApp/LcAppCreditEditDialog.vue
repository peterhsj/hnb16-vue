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

      <v-card-text class="bg-grey-lighten-4 ma-4" style="max-height: 70vh; overflow-y: auto;">
        <LcAppCreditEditForm
          :app-no="props.appNo"
        />
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
          @click="onSave"
        >
          確定
        </v-btn>

        <v-spacer />
      </v-card-actions>
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
