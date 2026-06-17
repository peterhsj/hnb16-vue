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
        <span>補收開狀手續費收據</span>
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
          <v-card class="hnb__card--bordered" flat rounded="0">
            <v-container>
              <v-row class="mt-3" no-gutters>
                <v-col class="hnb__bankName font-weight-bold text-center mb-4" cols="12">
                  華南銀行國內信用狀補收開狀手續費收據
                </v-col>

                <v-col class="my-1" cols="6">
                  <span class="font-weight-bold">分行：</span>
                  <span>120 台北分行</span>
                </v-col>

                <v-col class="my-1" cols="6">
                  <span class="font-weight-bold">日期：</span>
                  <span>民國 114 年 3 月 25 日</span>
                </v-col>

                <v-col class="my-1" cols="6">
                  <span class="font-weight-bold">客戶統編：</span>
                  <span>12458115</span>
                </v-col>

                <v-col class="my-1" cols="6">
                  <span class="font-weight-bold">幣別：</span>
                  <span>新台幣</span>
                </v-col>

                <v-col class="my-1" cols="12">
                  <span class="font-weight-bold">客戶名稱：</span>
                  <span>網際公司</span>
                </v-col>

                <v-col class="my-1" cols="12">
                  <span class="font-weight-bold">客戶地址：</span>
                  <span>高雄縣橋頭鄉芋寮村芋寮路317號</span>
                </v-col>
              </v-row>

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
              >
                <template #item.lcAmount="{ item }">
                  ${{ thousandsFormatting(item.lcAmount.toLocaleString()) }}
                </template>

                <template #item.fee="{ item }">
                  ${{ thousandsFormatting(item.fee.toLocaleString()) }}
                </template>

                <template #body.append>
                  <tr class="font-weight-bold bg-blue-lighten-5">
                    <td class="text-center">
                      合計
                    </td>

                    <td class="text-right" colspan="2">
                      $500
                    </td>
                  </tr>
                </template>
              </v-data-table>

              <v-row class="mt-3" no-gutters>
                <v-col class="text-end my-8" cols="12">
                  分行圓戳章
                </v-col>

                <v-col class="text-end" cols="12">
                  <span class="font-weight-bold">經辦：</span>
                </v-col>
              </v-row>
            </v-container>
          </v-card>
          <!-- 下載 / 列印 / 版本選擇 -->
          <v-container class="" fluid>
            <v-row>
              <v-col class="text-center" cols="12">
                <v-btn
                  class="ma-1 hnb__btn--default"
                  prepend-icon="mdi-cloud-download"
                  @click="downloadFile"
                >
                  下載電子檔
                </v-btn>

                <v-btn
                  class="ma-1 hnb__btn--orange"
                  prepend-icon="mdi-printer"
                  @click="printDoc"
                >
                  列印
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
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
  import { computed, ref } from 'vue'
  import { VForm } from 'vuetify/components'
  import { thousandsFormatting } from '@/utils/format'

  const formRef = ref<InstanceType<typeof VForm>>()

  const isLoading = ref<boolean>(false)
  const tableItems = ref<any[]>([
    { lcNo: 'LC20240225001', lcAmount: 1_000_000, fee: 500 },
  ])

  interface Props {
    isSupplementaryLcFeeReceiptDialog?: boolean
    lcNo?: string
  }
  const props = withDefaults(defineProps<Props>(), {
    isSupplementaryLcFeeReceiptDialog: false,
    lcNo: '',
  })

  const emits = defineEmits<{
    'update:isSupplementaryLcFeeReceiptDialog': [boolean]
    'on-close': []
  }>()

  const show = computed({
    get: () => props.isSupplementaryLcFeeReceiptDialog,
    set: (value: boolean) => {
      emits('update:isSupplementaryLcFeeReceiptDialog', value)
    },
  })

  const tableHeaders: DataTableHeader[] = [
    { title: '信用狀號碼', key: 'lcNo', align: 'center', sortable: false, nowrap: true },
    { title: '信用狀金額', key: 'lcAmount', align: 'end', sortable: false, nowrap: true },
    { title: '手續費', key: 'fee', align: 'end', sortable: false, width: 200, nowrap: true },
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
</script>
