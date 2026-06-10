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
        <span>保證金收款證明</span>
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
                  國內信用狀存入金證實書
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
                  <span class="font-weight-bold">客戶代號：</span>
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
                      ${{ thousandsFormatting(tableItems.reduce((acc, item) => acc + item.fee, 0).toLocaleString()) }}
                    </td>
                  </tr>
                </template>
              </v-data-table>

              <v-row class="mt-3" no-gutters>
                <v-col class="text-center my-4" cols="12">
                  茲證明貴公司曾存入本行上項款項，此款係備作兌付上述信用狀下匯票之用，特此證明。
                  ※客戶欲退還保證金者，必須持本證明單向往來營業單位辦理。
                </v-col>

                <v-col class="text-end my-8" cols="12">
                  分行圓戳章
                </v-col>

                <v-col cols="6">
                  <span class="font-weight-bold">主管：</span>
                </v-col>

                <v-col cols="6">
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
  import { onMounted, ref, watch } from 'vue'
  import { VForm } from 'vuetify/components'
  import { thousandsFormatting } from '@/utils/format'

  const formRef = ref<InstanceType<typeof VForm>>()

  const isLoading = ref<boolean>(false)
  interface ListItem {
    lcNo: string
    lcAmount: number
    fee: number
  }
  const tableItems = ref<ListItem[]>([
    { lcNo: 'LC20240225001', lcAmount: 1_000_000, fee: 500 },
  ])

  interface Props {
    isDepositReceiptDialog?: boolean
    lcNo?: string
  }
  const props = withDefaults(defineProps<Props>(), {
    isDepositReceiptDialog: false,
    lcNo: '',
  })

  const show = ref<boolean>(props.isDepositReceiptDialog)
  watch(
    () => props.isDepositReceiptDialog,
    newVal => {
      show.value = newVal
    },
  )
  watch(
    () => show.value,
    newVal => {
      emit('update:isDepositReceiptDialog', newVal)
    },
  )

  const tableHeaders: DataTableHeader[] = [
    { title: '信用狀號碼', key: 'lcNo', align: 'center', sortable: false, nowrap: true },
    { title: '信用狀金額', key: 'lcAmount', align: 'end', sortable: false, nowrap: true },
    { title: '存入保證金', key: 'fee', align: 'end', sortable: false, width: 200, nowrap: true },
  ]

  const emit = defineEmits<{
    'update:isDepositReceiptDialog': [boolean]
    'on-close': []
  }>()

  function downloadFile () {
    // 下載電子檔邏輯
    console.log('下載電子檔')
  }

  function printDoc () {
    window.print()
  }

  function onClose (): void {
    show.value = false
    emit('on-close')
  }

  onMounted(() => {
    // 模擬資料加載
    isLoading.value = true
    setTimeout(() => {
      tableItems.value = [
        { lcNo: 'LC20240225001', lcAmount: 1_000_000, fee: 500 },
        { lcNo: 'LC20240225002', lcAmount: 2_000_000, fee: 1000 },
      ]
      isLoading.value = false
    }, 1000)
  })
</script>
