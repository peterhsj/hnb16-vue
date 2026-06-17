<template>
  <v-dialog
    v-model="show"
    persistent
    width="1000"
  >
    <v-card
      class="hnb__dialog"
    >
      <v-card-title class="d-flex px-4 font-weight-bold text-red-darken-3">
        <span>信用狀比對結果清冊</span>
        <v-spacer />

        <v-btn
          density="comfortable"
          icon="mdi-close"
          variant="flat"
          @click="onClose"
        />
      </v-card-title>

      <v-form ref="formRef">
        <v-card-text class="bg-grey-lighten-4">
          <v-data-table
            class="table-sm hnb__table bg-white my-3"
            color="blue-darken-2"
            density="compact"
            :headers="tableHeaders"
            hide-default-footer
            item-value="lcNo"
            :items="tableItems"
            :loading="isLoading"
            striped="odd"
          />
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
      </v-form>

    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
  import type { DataTableHeader } from 'vuetify'
  import { computed, onMounted, ref } from 'vue'
  import { VForm } from 'vuetify/components'
  import { thousandsFormatting } from '@/utils/format'

  const formRef = ref<InstanceType<typeof VForm>>()

  const isLoading = ref<boolean>(false)
  interface ListItem {
    compareItem: string
    sellerData: string
    systemData: string
  }
  const tableItems = ref<ListItem[]>([
    { compareItem: '', sellerData: '', systemData: '' },
  ])

  interface Props {
    isLcComparisonResultDialog?: boolean
    lcNo?: string
  }
  const props = withDefaults(defineProps<Props>(), {
    isLcComparisonResultDialog: false,
    lcNo: '',
  })

  const emits = defineEmits<{
    'update:isLcComparisonResultDialog': [boolean]
    'on-close': []
  }>()

  const show = computed({
    get: () => props.isLcComparisonResultDialog,
    set: (value: boolean) => {
      emits('update:isLcComparisonResultDialog', value)
    },
  })

  const tableHeaders: DataTableHeader[] = [
    { title: '比對項目名稱', key: 'compareItem', sortable: false, nowrap: true },
    { title: '賣方下載資料', key: 'sellerData', sortable: false, nowrap: true },
    { title: '系統內的資料', key: 'systemData', sortable: false, nowrap: true },
  ]

  function downloadFile () {
    // 下載電子檔邏輯
    console.log('下載電子檔')
  }

  function printDoc () {
    window.print()
  }

  function onClose (): void {
    show.value = false
    emits('on-close')
  }

  onMounted(() => {
    // 模擬資料加載
    isLoading.value = true
    setTimeout(() => {
      tableItems.value = [
        { compareItem: '信用狀內容', sellerData: '無資料', systemData: '' },
        { compareItem: '項目2', sellerData: '資料2', systemData: '資料B' },
      ]
      isLoading.value = false
    }, 1000)
  })
</script>
