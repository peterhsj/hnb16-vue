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

        <DraftInfo
          :data="{
            draftNo: props.draftNo,
          }"
          :is-show-deposit="true"
        />

        <div class="my-4 text-center">
          無補收開狀手續費資料！
          <!-- 授信資料調整歷程卡片 -->
          <v-row class="pt-1" justify="center">
            <v-col cols="12" md="4" sm="6">
              <v-card class="mx-auto border-sm bg-white" variant="outlined">
                <v-card-title class="text-center text-red-darken-3 text-subtitle-1 font-weight-bold py-2">
                  授信資料調整歷程
                </v-card-title>

                <v-divider />

                <v-list density="compact">
                  <v-list-item
                    v-for="item in credieHistoryList"
                    :key="item.value"
                    class="text-center"
                    color="teal-darken-1"
                    link
                    :title="item.title"
                    :value="item.value"
                    @click.prevent="handleHistoryView(item.value)"
                  />
                </v-list>
              </v-card>
            </v-col>
          </v-row>
        </div>

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
    'on-show-history-view': [string]
  }>()

  const show = computed({
    get: () => props.isDraftDetailDialog,
    set: (value: boolean) => {
      emits('update:isDraftDetailDialog', value)
    },
  })

  const credieHistoryList = [
    {
      title: '第一版差異',
      value: '123456',
    },
  ]

  // 歷程資料查看
  function handleHistoryView (value: string): void {
    console.log('查看歷程資料', value)
    emits('on-show-history-view', value)
  }

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
