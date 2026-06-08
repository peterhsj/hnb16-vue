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
        <span>修改申請書-授信資料</span>
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
          <v-table class="hnb__table hnb__table--vertical w-100" density="compact">
            <tbody>
              <tr>
                <th class="hnb__tbhd2 text-end w-25" rowspan="4">
                  定價指標
                </th>

                <td colspan="3">
                  <div class="hnb__line--indent">
                    <v-icon :icon="data.pricingBenchmark === '01' ? 'mdi mdi-circle' : 'mdi mdi-circle-outline'" size="small" />
                    按貴行之基準利率加碼年率 0.0100000 % 計息 ( 目前合計為年率 4.0300000 % ) 計息，嗣後貴行基準利率每 1 個月調整時隨同調整，加碼幅度不變。
                  </div>
                </td>
              </tr>

              <tr>
                <td colspan="3">
                  <div class="hnb__line--indent">
                    <v-icon :icon="data.pricingBenchmark === '02' ? 'mdi mdi-circle' : 'mdi mdi-circle-outline'" size="small" />
                    固定利率，按年率 - % 計息。
                  </div>
                </td>
              </tr>

              <tr>
                <td colspan="3">
                  <div class="hnb__line--indent">
                    <v-icon :icon="data.pricingBenchmark === '03' ? 'mdi mdi-circle' : 'mdi mdi-circle-outline'" size="small" />
                    按貴行之貨幣市場 -- 天期均價利率 - 碼 - % ( 目前合計為年率 - % ) 計息，嗣後以貸放日後每滿 - 個月之相對日為利率變動調整日，自調整日起隨同調整，加減碼幅度不變。
                  </div>
                </td>
              </tr>

              <tr>
                <td colspan="3">
                  <div class="hnb__line--indent">
                    <v-icon :icon="data.pricingBenchmark === '04' ? 'mdi mdi-circle' : 'mdi mdi-circle-outline'" size="small" />
                    其他：
                  </div>
                </td>
              </tr>

              <tr>
                <th class="hnb__tbhd2 text-end w-25">
                  放款戶號
                </th>

                <td>
                  12356789
                </td>

                <th class="hnb__tbhd2 text-end w-25">
                  信用狀增加金額
                </th>

                <td class="text-end">
                  1,000,000
                </td>
              </tr>

              <tr>
                <th class="hnb__tbhd2 text-end">
                  開狀放款核號
                </th>

                <td>
                  12313213
                </td>

                <th class="hnb__tbhd2 text-end">
                  承兌放款核號
                </th>

                <td>
                  1234567890
                </td>
              </tr>

              <tr>
                <th class="hnb__tbhd2 text-end">
                  國內信用狀額(限)度
                </th>

                <td class="text-end">
                  1,000,000
                </td>

                <th class="hnb__tbhd2 text-end">
                  額(限)度到期日
                </th>

                <td>
                  2025/12/10
                </td>
              </tr>

              <tr>
                <th class="hnb__tbhd2 text-end">
                  國內信用狀餘額(含本件)
                </th>

                <td class="text-end">
                  500,000
                </td>

                <th class="hnb__tbhd2 text-end">
                  貸放經理人ID
                </th>

                <td>
                  12345687
                </td>
              </tr>

              <tr>
                <th class="hnb__tbhd2 text-end">
                  徵審主管 ID-A
                </th>

                <td>
                  G101057626
                </td>

                <th class="hnb__tbhd2 text-end">
                  徵審主管 ID-B
                </th>

                <td>
                  -
                </td>
              </tr>

              <tr>
                <th class="hnb__tbhd2 text-end">
                  改狀手續費
                </th>

                <td>
                  <span>500</span>
                  <br />
                  <span class="font-weight-bold">是否扣印花稅：</span>是
                </td>

                <th class="hnb__tbhd2 text-end">
                  承兌手續費
                </th>

                <td>
                  <span>500</span>
                  <br />
                  <span class="font-weight-bold">是否扣印花稅：</span>是
                </td>
              </tr>

              <tr>
                <th class="hnb__tbhd2 text-end">
                  存入保證金比率(%)
                </th>

                <td class="text-end">
                  10
                </td>

                <th class="hnb__tbhd2 text-end">
                  保證金
                </th>

                <td>
                  -
                </td>
              </tr>

              <tr>
                <th class="hnb__tbhd2 text-end">
                  收款方式
                </th>

                <td colspan="3">
                  <div class="my-2">
                    <span class="mx-1">
                      <v-icon :icon="data.isAuth ? 'mdi mdi-circle' : 'mdi mdi-circle-outline'" size="small" />
                      有授權扣帳 ( 限鍵入 960 者 )
                    </span>

                    <span class="mx-1">
                      <v-icon :icon="!data.isAuth ? 'mdi mdi-circle' : 'mdi mdi-circle-outline'" size="small" />
                      無授權扣帳
                    </span>
                  </div>

                  <v-table class="hnb__table hnb__table--vertical w-100" density="compact">
                    <tbody>
                      <tr>
                        <th class="hnb__tbhd2 text-end w-10">
                          現金：
                        </th>

                        <td class="text-end">
                          10,000
                        </td>
                      </tr>

                      <tr>
                        <th class="hnb__tbhd2 text-end w-25" rowspan="2">
                          支存轉帳：
                        </th>

                        <td>
                          <div>
                            <span class="font-weight-bold">支票存款帳號 1：</span> 789465213798
                          </div>

                          <div>
                            <span class="font-weight-bold">支票號碼 1：</span> 132456987
                          </div>

                          <div class="d-flex justify-space-between">
                            <span class="font-weight-bold">金額 1：</span>
                            <span>2,000</span>
                          </div>
                        </td>
                      </tr>

                      <tr>
                        <td>
                          <div>
                            <span class="font-weight-bold">支票存款帳號 2：</span> 789465213798
                          </div>

                          <div>
                            <span class="font-weight-bold">支票號碼 2：</span> 132456987
                          </div>

                          <div class="d-flex justify-space-between">
                            <span class="font-weight-bold">金額 2：</span>
                            <span>2,000</span>
                          </div>
                        </td>
                      </tr>

                      <tr>
                        <th class="hnb__tbhd2 text-end w-25">
                          活存轉帳：
                        </th>

                        <td>
                          <div>
                            <span class="font-weight-bold">活期存款帳號：</span> 789465213798
                          </div>

                          <div class="d-flex justify-space-between">
                            <span class="font-weight-bold">第 1 張取款條金額：</span>
                            <span>2,000</span>
                          </div>

                          <div class="d-flex justify-space-between">
                            <span class="font-weight-bold">第 2 張取款條金額：</span>
                            <span>2,000</span>
                          </div>
                        </td>
                      </tr>

                      <tr>
                        <th class="hnb__tbhd2 text-end w-25">
                          轉出科目：
                        </th>

                        <td>
                          <div>
                            <span class="font-weight-bold">轉出會計科目：</span> ---
                          </div>

                          <div>
                            <span class="font-weight-bold">轉出銷帳序號：</span> ---
                          </div>

                          <div class="d-flex justify-space-between">
                            <span class="font-weight-bold">轉出科目金額：</span>
                            <span>---</span>
                          </div>

                          <div>
                            <span class="font-weight-bold">轉出科目摘要：</span> ---
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </v-table>

                  <div class="d-flex justify-space-between mt-2">
                    <span>現金與轉帳收款金額合計：</span>

                    <span class="font-weight-bold mx-1">
                      3,000
                    </span>
                  </div>
                </td>
              </tr>

              <tr>
                <th class="hnb__tbhd2 text-end">
                  擔保條件
                </th>

                <td colspan="3">
                  XXXXXXX
                </td>
              </tr>

              <tr>
                <th class="hnb__tbhd2 text-end">
                  放款狀號
                </th>

                <td colspan="3">
                  123456789012
                </td>
              </tr>

              <tr>
                <th class="hnb__tbhd2 text-end">
                  風險條件
                </th>

                <td colspan="3">
                  <div class="d-flex">
                    <div class="w-50">
                      <span class="font-weight-bold">風險類別一：</span> B1 應收信用狀款-存款或存單
                    </div>

                    <div>
                      <span class="font-weight-bold">風險類別一百分比 %：</span> 100
                    </div>
                  </div>

                  <div class="d-flex">
                    <div class="w-50">
                      <span class="font-weight-bold">風險類別二 %：</span> --
                    </div>

                    <div>
                      <span class="font-weight-bold">風險類別二百分比 %：</span> --
                    </div>
                  </div>

                  <div class="d-flex">
                    <div class="w-50">
                      <span class="font-weight-bold">風險類別三 %：</span> --
                    </div>

                    <div>
                      <span class="font-weight-bold">風險類別三百分比 %：</span> --
                    </div>
                  </div>

                  <div class="d-flex">
                    <div class="w-50">
                      <span class="font-weight-bold">風險類別四 %：</span> --
                    </div>

                    <div>
                      <span class="font-weight-bold">風險類別四百分比 %：</span> --
                    </div>
                  </div>
                </td>
              </tr>

              <tr>
                <th class="hnb__tbhd2 text-end">
                  防制洗錢及打擊資恐作業
                </th>

                <td colspan="3">
                  <div class="hnb__line--indent">
                    <v-icon :icon="data.cleanChecked ? 'mdi mdi-square' : 'mdi mdi-square-outline'" size="small" />
                    已確實於 AML 系統辦理線上姓名檢核並填製「新臺幣國內信用狀業務防制洗錢及打擊資恐作業檢核表」。
                  </div>
                </td>
              </tr>
            </tbody>
          </v-table>

          <div class="my-4 text-center">
            <v-btn
              class="hnb__btn--default mx-1"
              prepend-icon="mdi-download"
              size="small"
              variant="flat"
              @click="handleDownload"
            >
              下載電子檔
            </v-btn>

            <v-btn
              class="hnb__btn--orange mx-1"
              prepend-icon="mdi-printer"
              size="small"
              variant="flat"
              @click="handlePrint"
            >
              列印
            </v-btn>
          </div>

          <div v-if="isShowHistory" class="my-4 text-center">
            <span class="text-body-2">( 目前版本：版本 2 )</span>
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
    isLcAppCreditDialogOpen?: boolean
    amendNoticeNo?: string
    isShowHistory?: boolean
  }
  const props = withDefaults(defineProps<Props>(), {
    isLcAppCreditDialogOpen: false,
    amendNoticeNo: '',
    isShowHistory: false,
  })

  const show = ref<boolean>(props.isLcAppCreditDialogOpen)
  watch(
    () => props.isLcAppCreditDialogOpen,
    newVal => {
      show.value = newVal
    },
  )
  watch(
    () => show.value,
    newVal => {
      emits('update:isLcAppCreditDialogOpen', newVal)
    },
  )

  const emits = defineEmits<{
    'update:isLcAppCreditDialogOpen': [boolean]
    'on-close': []
    'on-show-history-view': [string]
  }>()

  const data = {
    pricingBenchmark: '01', // 定價指標
    isAuth: true, // 是否有授權扣帳
    cleanChecked: true, // 是否已確實洗錢防制檢核
  }

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
