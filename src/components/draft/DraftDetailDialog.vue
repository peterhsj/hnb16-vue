<template>
  <v-dialog
    v-model="show"
    persistent
    width="900px"
  >
    <v-card
      class="hnb__dialog"
    >
      <v-card-title class="d-flex px-4 font-weight-bold text-red-darken-3">
        <span>匯票資訊</span>
        <v-spacer />

        <v-btn
          density="comfortable"
          icon="mdi-close"
          variant="flat"
          @click="onClose"
        />
      </v-card-title>

      <v-card-text class="bg-grey-lighten-4" style="max-height: 70vh; overflow-y: auto;">
        <DraftDetail
          :draft-no="props.draftNo"
        />

        <!-- <div class="my-4 text-center">
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
        </div> -->
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
  import { computed } from 'vue'

  interface Props {
    isDraftDetailDialog?: boolean
    draftNo?: string
  }
  const props = withDefaults(defineProps<Props>(), {
    isDraftDetailDialog: false,
    draftNo: '',
  })

  const emits = defineEmits<{
    'update:isDraftDetailDialog': [boolean]
    'on-close': []
  }>()

  const show = computed({
    get: () => props.isDraftDetailDialog,
    set: (value: boolean) => {
      emits('update:isDraftDetailDialog', value)
    },
  })

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
