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
        <span>現金繳費單</span>
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
          <v-card class="hnb__card--bordered bg-grey-lighten-4 px-5" flat rounded="0">
            <v-container class="py-1">
              <v-row class="mt-3 me-2 align-center" no-gutters>
                <v-col class="hnb__bankName font-weight-bold text-center" cols="9">
                  華南商業銀行現金收入傳票
                </v-col>

                <v-col class="text-end" cols="3">
                  <span>傳票</span>
                  <span class="border-b px-1 mx-2">000001</span>
                  <span>號</span>
                </v-col>

                <v-col class="my-1 text-end" cols="12">
                  <span>貸方</span>
                </v-col>
              </v-row>
            </v-container>

            <div class="d-flex align-end mb-3">
              <v-table
                class="hnb__cell w-100"
                density="compact"
              >
                <tbody>
                  <tr>
                    <td class="hnb__cell--ub w-30 bg-grey-lighten-4">
                      子細目代號<br />(帳號)：00000-00000
                    </td>

                    <td class="hnb__cell--ub w-30 bg-grey-lighten-4 text-center">
                      中華民國 114 年 05 月 25 日
                    </td>

                    <td class="hnb__cell--lb hnb__cell--tb hnb__cell--ub text-center w-20">
                      科目
                    </td>

                    <td class="hnb__cell--border text-center w-20">
                      6001 臨時欠存
                    </td>
                  </tr>

                  <tr>
                    <td class="hnb__cell--lb hnb__cell--ub" colspan="2" rowspan="2">
                      子細目名稱(戶名)：網際公司
                    </td>

                    <td class="hnb__cell--lb hnb__cell--ub text-center">
                      金額
                    </td>

                    <td class="hnb__cell--lb hnb__cell--ub hnb__cell--rb text-center" rowspan="3">
                      圖章
                    </td>
                  </tr>

                  <tr>
                    <td class="hnb__cell--lb hnb__cell--ub text-end">
                      TWD 1,000.00
                    </td>
                  </tr>

                  <tr>
                    <td class="hnb__cell--lu">
                      摘要：<br />
                      XXXXXXXXX
                    </td>

                    <td class="hnb__cell--lb hnb__cell--ub" colspan="2">
                      <div class="my-1">交易序號：0000012</div>
                      <div class="my-1">信用狀號碼：09970004616000861</div>
                      <div class="my-1">信用狀金額：TWD 5,000,000.00</div>
                      <div class="my-1">國內信用狀-開狀手續費</div>
                    </td>
                  </tr>
                </tbody>
              </v-table>

              <div class="text-center" style="width: 25px">
                附單據 1 件
              </div>
            </div>

            <v-table
              class="hnb__table w-100"
              density="compact"
            >
              <tbody>
                <tr>
                  <td class="hnb__cell--ub" rowspan="3" width="25px">
                    認證欄
                  </td>

                  <td class="hnb__cell--ub text-center">交易序號</td>

                  <td class="hnb__cell--ub text-center">交易代碼</td>

                  <td class="hnb__cell--ub text-center">帳號</td>

                  <td class="hnb__cell--ub text-center">存(取)款金額</td>

                  <td class="hnb__cell--ub text-center">放款金額</td>

                  <td class="hnb__cell--ub text-center">核可</td>

                  <td class="hnb__cell--ub text-center">登錄</td>

                  <td class="hnb__cell--ub text-center">對方科目</td>
                </tr>

                <tr>
                  <td class="text-center hnb__cell--ub hnb__cell--lb">000</td>
                  <td class="text-center hnb__cell--ub">200</td>
                  <td class="text-center hnb__cell--ub">0000-0000</td>
                  <td class="text-end hnb__cell--ub">1,000</td>
                  <td class="text-end hnb__cell--ub">1,000</td>
                  <td class="hnb__cell--ub">XXX</td>
                  <td class="hnb__cell--ub">XXX</td>
                  <td class="hnb__cell--ub">XXX</td>
                </tr>

                <tr>
                  <td class="text-center hnb__cell--lb hnb__cell--ub">
                    存(取)款人代號
                  </td>

                  <td class="hnb__cell--ub" colspan="7">
                    12345678
                  </td>
                </tr>
              </tbody>
            </v-table>

            <v-row class="my-4 align-center" no-gutters>
              <v-col cols="3">
                <span class="font-weight-bold">經副襄理</span>
              </v-col>

              <v-col cols="3">
                <span class="font-weight-bold">會計</span>
              </v-col>

              <v-col cols="3">
                <span class="font-weight-bold">認證</span>
              </v-col>

              <v-col cols="3">
                <span class="font-weight-bold">收(付)款<br />或轉帳</span>
              </v-col>
            </v-row>
          </v-card>

          <v-divider class="my-4" />

          <v-card class="hnb__card--bordered bg-grey-lighten-4" flat rounded="0">
            <v-container>
              <v-row class="mt-3" no-gutters>
                <v-col class="hnb__bankName font-weight-bold text-center mb-4" cols="12">
                  國內信用狀手續費收入現金繳費單
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
                      ${{ thousandsFormatting(tableItems.reduce((acc, item) => acc + item.fee, 0).toLocaleString()) }}
                    </td>
                  </tr>
                </template>
              </v-data-table>

              <v-row class="mt-3" no-gutters>
                <v-col cols="6">
                  <span class="font-weight-bold">出納<br />經辦</span>
                </v-col>

                <v-col cols="6">
                  <span class="font-weight-bold">徵審<br />經辦</span>
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
    isCashPaySlipDialog?: boolean
    lcNo?: string
  }
  const props = withDefaults(defineProps<Props>(), {
    isCashPaySlipDialog: false,
    lcNo: '',
  })

  const show = ref<boolean>(props.isCashPaySlipDialog)
  watch(
    () => props.isCashPaySlipDialog,
    newVal => {
      show.value = newVal
    },
  )
  watch(
    () => show.value,
    newVal => {
      emit('update:isCashPaySlipDialog', newVal)
    },
  )

  const tableHeaders: DataTableHeader[] = [
    { title: '信用狀號碼', key: 'lcNo', align: 'center', sortable: false, nowrap: true },
    { title: '信用狀金額', key: 'lcAmount', align: 'end', sortable: false, nowrap: true },
    { title: '手續費', key: 'fee', align: 'end', sortable: false, width: 200, nowrap: true },
  ]

  const emit = defineEmits<{
    'update:isCashPaySlipDialog': [boolean]
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
