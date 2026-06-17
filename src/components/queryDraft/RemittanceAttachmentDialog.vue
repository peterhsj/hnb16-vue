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
        <span>押匯交易憑證 / 轉帳收入傳票</span>
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
                <v-col class="hnb__bankName font-weight-bold text-center" cols="12">
                  台北分行國內信用狀押匯交易憑證(跨行匯款專用) <br />
                  (匯款申請書之附件)
                </v-col>

                <v-col class="text-center mt-3 mb-2" cols="12">
                  <span>114 年 5 月 10 日</span>
                </v-col>
              </v-row>
            </v-container>

            <v-table
              class="hnb__table hnb__table--vertical w-100"
              density="compact"
            >
              <tbody>
                <tr>
                  <th class="hnb__tbhd w-30">
                    信用狀號碼
                  </th>

                  <td>
                    940105P036
                  </td>
                </tr>

                <tr>
                  <th class="hnb__tbhd w-30">
                    開狀申請人
                  </th>

                  <td>
                    網際公司
                  </td>
                </tr>

                <tr>
                  <th class="hnb__tbhd w-30">
                    信用狀受益人
                  </th>

                  <td>
                    甲乙公司
                  </td>
                </tr>

                <tr>
                  <th class="hnb__tbhd w-30">
                    押匯金額
                  </th>

                  <td>
                    新台幣 壹仟萬元整
                  </td>
                </tr>

                <tr>
                  <th class="hnb__tbhd w-30">
                    銷帳序號
                  </th>

                  <td>
                    4B0609606
                  </td>
                </tr>

                <tr>
                  <th class="hnb__tbhd w-30">
                    交易科目(借方)
                  </th>

                  <td>
                    000999
                  </td>
                </tr>

                <tr>
                  <th class="hnb__tbhd w-30">
                    對方科目(貸方)
                  </th>

                  <td>
                    匯出匯款
                  </td>
                </tr>
              </tbody>
            </v-table>

            <v-row class="my-4 align-center" no-gutters>
              <v-col cols="12">
                <p>請注意下列事項：</p>

                <ol class="hnb__ol ms-5">
                  <li>匯款申請書(代收入傳票)之匯款人，必須與信用狀受益人名稱相符。</li>
                  <li>押匯手續費為內扣者，本憑證之匯款金額 = 押匯金額 - 押匯手續費。</li>

                  <li>(1) 匯款手續費及其他應付帳款採外加者，匯款申請書(代收入傳票)之「匯出匯款」金額等於本憑證之「匯款金額」。<br />
                    (2) 匯款手續費及其他應付帳款採內扣者，匯款申請書(代收入傳票)之「合計」金額等於本憑證之「匯款金額」。
                  </li>
                </ol>
              </v-col>

              <v-col class="text-end my-4" cols="12">
                <span>(轉帳章)</span>
              </v-col>

              <v-col cols="6">
                <span class="font-weight-bold">授信主管：</span>
              </v-col>

              <v-col cols="6">
                <span class="font-weight-bold">經辦：</span>
              </v-col>
            </v-row>
          </v-card>

          <v-divider class="my-4" />

          <v-card class="hnb__card--bordered" flat rounded="0">
            <v-container>
              <v-row class="mt-3" no-gutters>
                <v-col class="hnb__bankName font-weight-bold" cols="7">
                  華南商業銀行轉帳收入傳票
                </v-col>

                <v-col class="text-end" cols="5">
                  <span>傳票</span>
                  <span class="border-b px-1 mx-2">000001</span>
                  <span>號</span>
                </v-col>

                <v-col class="text-end" cols="12">
                  <span class="me-5">中華民國 114 年 05 月 25 日</span>
                  <span class="me-5">科目： 0000</span>
                  <span class="hnb__bankName text-subtitle-1 font-weight-bold">貸方 轉</span>
                </v-col>
              </v-row>

              <v-table
                class="hnb__cell my-2 w-100"
                density="compact"
              >
                <tbody>
                  <tr>
                    <td class="hnb__cell--ub w-70">
                      子細目代號(帳號)：00000-00000
                    </td>

                    <td class="hnb__cell--border text-center w-30">
                      金額
                    </td>
                  </tr>

                  <tr>
                    <td class="hnb__cell--lb hnb__cell--ub">
                      子細目名稱(戶名)：過渡科目(510301)
                    </td>

                    <td class="hnb__cell--lb hnb__cell--ub hnb__cell--rb text-end">
                      TWD 1,000.00
                    </td>
                  </tr>

                  <tr>
                    <td class="hnb__cell--lu py-2">
                      摘要：<br />
                      國內信用狀號碼：09970004616000861
                    </td>

                    <td class="hnb__cell--lb hnb__cell--ub hnb__cell--rb text-center">
                      戳記
                    </td>
                  </tr>
                </tbody>
              </v-table>
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
  import { computed, onMounted, ref } from 'vue'
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
    isRemittanceAttachmentDialog?: boolean
    lcNo?: string
  }
  const props = withDefaults(defineProps<Props>(), {
    isRemittanceAttachmentDialog: false,
    lcNo: '',
  })

  const emits = defineEmits<{
    'update:isRemittanceAttachmentDialog': [boolean]
    'on-close': []
  }>()

  const show = computed({
    get: () => props.isRemittanceAttachmentDialog,
    set: (value: boolean) => {
      emits('update:isRemittanceAttachmentDialog', value)
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
