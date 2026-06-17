<template>
  <v-dialog
    v-model="show"
    persistent
    width="800"
  >
    <v-card
      class="hnb__dialog"
    >
      <v-card-title class="d-flex px-4 font-weight-bold text-red-darken-3">
        <span>授信資料調整</span>
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
          <v-table class="hnb__table w-100" density="compact">
            <thead>
              <tr>
                <th class="hnb__tbhd2 text-center w-25">
                  第 1 版 ( 調整前 )
                </th>

                <th class="hnb__tbhd2 text-center w-25">
                  第 2 版 ( 調整後 )
                </th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>
                  <div>放款戶號：12345678</div>
                  <div>開狀手續費：500</div>
                </td>

                <td class="text-end">
                  <div>放款戶號：87654321</div>
                  <div>開狀手續費：600</div>
                </td>
              </tr>
            </tbody>
          </v-table>

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
    isHistoryDialogOpen?: boolean
    creditNo?: string
  }
  const props = withDefaults(defineProps<Props>(), {
    isHistoryDialogOpen: false,
    creditNo: '',
  })

  const emits = defineEmits<{
    'update:isHistoryDialogOpen': [boolean]
    'on-close': []
    'on-show-history-view': [string]
  }>()

  const show = computed({
    get: () => props.isHistoryDialogOpen,
    set: (value: boolean) => {
      emits('update:isHistoryDialogOpen', value)
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
