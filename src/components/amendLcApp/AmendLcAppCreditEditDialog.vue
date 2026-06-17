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

      <v-card-text class="bg-grey-lighten-4 ma-4" style="max-height: 70vh; overflow-y: auto;">
        <AmendLcAppCreditEditForm
          :amend-app-no="props.amendAppNo"
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
  import { computed } from 'vue'

  interface Props {
    isAmendLcAppCreditEditDialog?: boolean
    amendAppNo?: string
  }
  const props = withDefaults(defineProps<Props>(), {
    isAmendLcAppCreditEditDialog: false,
    amendAppNo: '',
  })

  const show = computed({
    get: () => props.isAmendLcAppCreditEditDialog,
    set: (value: boolean) => {
      emits('update:isAmendLcAppCreditEditDialog', value)
    },
  })

  const emits = defineEmits<{
    'update:isAmendLcAppCreditEditDialog': [boolean]
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
