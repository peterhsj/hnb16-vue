<template>
  <v-dialog
    v-model="show"
    persistent
    width="auto"
  >
    <v-card
      class="hnb__dialog"
    >
      <v-card-title class="d-flex px-4 font-weight-bold text-red-darken-3">
        <span>押匯申請-授信資料</span>
        <v-spacer />

        <v-btn
          density="comfortable"
          icon="mdi-close"
          variant="flat"
          @click="onClose"
        />
      </v-card-title>

      <v-card-text class="bg-grey-lighten-4" style="max-height: 70vh; overflow-y: auto;">
        <div>
          <DraftInfo
            :data="{
              draftNo: props.creditNo,
            }"
            :is-show-deposit="true"
          />

          <div class="my-4 text-center">
            <v-btn
              class="hnb__btn--default mx-1"
              prepend-icon="mdi-download"
              @click="handleDownload"
            >
              下載電子檔
            </v-btn>

            <v-btn
              class="hnb__btn--orange mx-1"
              prepend-icon="mdi-printer"
              @click="handlePrint"
            >
              列印
            </v-btn>
          </div>
        </div>
      </v-card-text>

      <v-card-actions>
        <v-spacer />

        <v-btn
          class="hnb__btn--cancel mx-1 my-2"
          @click="onClose"
        >
          關閉
        </v-btn>

        <v-spacer />
      </v-card-actions>

    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
  import { ref, watch } from 'vue'

  interface Props {
    isShowCreditDialog?: boolean
    creditNo?: string
  }
  const props = withDefaults(defineProps<Props>(), {
    isShowCreditDialog: false,
    creditNo: '',
  })

  const show = ref<boolean>(props.isShowCreditDialog)
  watch(
    () => props.isShowCreditDialog,
    newVal => {
      show.value = newVal
    },
  )
  watch(
    () => show.value,
    newVal => {
      emits('update:isShowCreditDialog', newVal)
    },
  )

  const emits = defineEmits<{
    'update:isShowCreditDialog': [boolean]
    'on-close': []
  }>()

  function onClose (): void {
    show.value = false
    emits('on-close')
  }

  function handlePrint (): void {
    window.print()
  }

  function handleDownload (): void {
    console.log('下載電子檔')
  }
</script>
