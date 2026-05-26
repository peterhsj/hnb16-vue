<template>
  <v-dialog
    v-model="show"
    persistent
    width="auto"
  >
    <v-card
      class="hnb__dialog"
      max-width="1200"
      min-width="300"
    >
      <v-card-title class="d-flex px-4 font-weight-bold text-red-darken-3">
        <span>開狀申請書</span>
        <v-spacer />

        <v-btn
          density="comfortable"
          icon="mdi-close"
          variant="flat"
          @click="onClose"
        />
      </v-card-title>

      <v-card-text class="bg-grey-lighten-4" style="max-height: 70vh; overflow-y: auto;">
        <!-- 銀行抬頭 -->
        <v-container fluid>
          <v-row align="center">
            <v-col class="py-1 hnb__bankName text-center" cols="12">
              開發國內不可撤銷信用狀申請書
            </v-col>

            <v-col class="py-1" cols="6">
              <span class="my-1 text-h6 hnb__bankName">
                <span class="pe-1">華南商業銀行</span>
                <span class="pe-1">建成分行</span>
                <span>台鑑</span>
              </span>
            </v-col>

            <v-col class="py-1 text-end" cols="6">
              日期：中華民國 114 年 5 月 10 日
            </v-col>
          </v-row>
        </v-container>

        <v-table class="hnb__table hnb__table--layout" density="compact">
          <tbody>
            <tr>
              <td class="w-50" rowspan="2">
                <p>茲請　貴行准照前訂委任開發國內即期信用狀契約之規定依下開條件開發信用狀。</p>
                <p>本信用狀如有未盡事宜適用國際商會所訂現行「信用狀統一慣例與實務」之規定。</p>
              </td>

              <td>
                <p>
                  <span class="font-weight-bold">信用狀號碼：</span>
                  <span>099700049161000861</span>
                </p>

                <p class="mb-0">
                  <span class="font-weight-bold">開證日期：</span>
                </p>
              </td>

              <td>
                <span class="font-weight-bold">通知銀行編號：</span>
                <span>01</span>
              </td>
            </tr>

            <tr>
              <td class="hnb__table--left-border" colspan="2">
                <p>
                  <span class="font-weight-bold">申請人：</span>優勢股份有限公司
                </p>

                <p>
                  <span class="pe-5">
                    <span class="font-weight-bold">聯絡人姓名：</span>林小明
                  </span>

                  <span>
                    <span class="font-weight-bold">聯絡人電話：</span>202-12346789
                  </span>
                </p>
              </td>
            </tr>

            <tr>
              <td class="w-50">
                <span class="font-weight-bold">通知銀行：</span>
                華南商業銀行 建成分行
              </td>

              <td colspan="2">
                <span class="font-weight-bold">金額：</span>
                新台幣
                <span class="text-red font-weight-bold">伍仟萬元整</span>
              </td>
            </tr>

            <tr>
              <td class="w-50">
                <span class="font-weight-bold">受益人：</span>
                中鴻鋼鐵股份有限公司
                <br>
                <span class="font-weight-bold">受益人負責人：</span>
                林大華
                <br>
                <span class="font-weight-bold">負責人職稱：</span>
                總經理
                <br>
                <span class="font-weight-bold">地址：</span>
                高雄縣橋頭鄉芋寮村芋寮路317號
                <br>
                <span class="font-weight-bold">電話：</span>
                07-611-7171
                <br>
                <span class="font-weight-bold">Email：</span>
                a1b2c3d4e5@example.com
              </td>

              <td colspan="2">
                <span class="font-weight-bold">有效期限至：</span>
                民國 114 年 6 月 10 日
              </td>
            </tr>

            <tr>
              <td colspan="3">
                <p class="font-weight-bold my-1">
                  本信用狀可由上開受益人在不超過上開金額範圍內，依本狀規定條件簽發匯票承兌/付款：
                </p>

                <p class="font-weight-bold my-1">一、匯票之條件：</p>

                <ol class="hnb__list--ol ms-10">
                  <li class="mb-2">甲、付款人：華南商業銀行 建成分行</li>
                  <li class="mb-2">乙、付款期限：見票即付。</li>
                  <li class="mb-2">丙、金額：須與相關發票上所列開金額一致，或照本信用狀其他指示。</li>
                </ol>

                <p class="font-weight-bold my-1">二、應檢附之單據如下：</p>

                <ol class="hnb__list--ol ms-10">
                  <li class="mb-2">1. <v-icon icon="mdi mdi-square" size="small" /> 匯票付款申請書乙份。</li>
                  <li class="mb-2">2. <v-icon icon="mdi mdi-square-outline" size="small" /> 匯票承兌申請書乙份。</li>
                  <li class="mb-2">3. <v-icon icon="mdi mdi-square" size="small" /> 統一發票。</li>
                  <li class="mb-2">4. <v-icon icon="mdi mdi-square-outline" size="small" /> 其他： </li>
                </ol>

                <p class="ms-3 font-weight-bold">上項單據應載明申請人向受益人購買下列貨物：</p>
                <p class="ms-3">鋼品一批</p>
              </td>
            </tr>

            <tr>
              <td colspan="3">
                <p class="font-weight-bold mb-2">三、特別指示：</p>
                <p class="font-weight-bold mb-2">1.電子押匯特別指示條款</p>

                <ol class="hnb__list--ol mb-2">
                  <li class="mb-2">(1) 賣方所提供鋼品之一部或全部，可能產自中國鋼鐵股份有限公司或中龍鋼鐵股份有限公司(下稱中龍公司)，視實際出貨狀況而定，如產自中龍公司，賣方就其鋼品品質，負賣方責任，至如約定價格、各交易條件及優惠措施均不受影響。</li>
                  <li class="mb-2">(2) 匯票及匯票付款申請書使用中鋼格式，由受益人單獨簽章或使用數位憑證有效。</li>
                  <li class="mb-2">(3) 貨物可以分批交貨。</li>
                  <li class="mb-2">(4) 貨物明細以發票為準。</li>
                  <li class="mb-2">(5) 發票金額大於匯票金額及發票內容備註「受託代銷」字樣可以接受。</li>
                  <li class="mb-2">(6) 本信用狀適用eUCP2.0版。</li>
                  <li class="mb-2">(7) 允許受益人以匯票、匯票付款申請書及發票電子檔方式押匯，另「受益人完整提示通知」得附加於匯票付款申請書之最後。</li>
                  <li class="mb-2">(8) 押匯電子文件透過網址: HTTPS://CDSLC.UXCDS.COM/CDSLC/提示</li>
                </ol>

                <p class="mb-2">
                  <span class="font-weight-bold">2.最後交貨日期：</span>
                  民國  年  月  日。（未填者自開狀日起三個月視為最後交貨日）
                </p>

                <p class="mb-2">
                  <span class="font-weight-bold">3.遠期信用狀利息：</span>
                  <v-icon icon="mdi mdi-square" size="small" /> 買方負擔
                  <v-icon icon="mdi mdi-square-outline" size="small" /> 賣方負擔
                  （未填者視為由買方負擔）
                </p>
              </td>
            </tr>

            <tr>
              <td colspan="3">
                <p class="mb-2">
                  <span class="font-weight-bold">利率約款：</span>
                  貴行依本申請書開發信用狀所墊付之款項，申請人同意依貴我雙方所訂之利率訂價方式，按月計付利息。
                </p>

                <p class="mb-2">
                  <span class="font-weight-bold">新臺幣短期放款計期方式：</span>
                  按日計息，以每年365天為利息計算基礎，逢閏年時亦同。利率=本金餘額×年利率×1/365×計息天數。
                </p>

                <div class="mb-2">
                  <span class="font-weight-bold">手續費約款：</span>
                  <p class="mb-2">申請人同意貴行目前所訂相關費用之收費標準，且同意貴行得隨時調整，但應於調整前以顯著方式於營業場所或網站上公開揭示，另</p>

                  <ol class="hnb__list--ol">
                    <li class="mb-2">
                      (一) 貴行依本申請書開發「利息及承兌手續費由賣方「利息及承兌手續費由賣方負擔」之遠期信用狀，如於信用狀有效期限屆滿而受益人未向貴行辦理提示請求承兌或申請人申請註銷信用狀時，申請人同意依開狀金額，視信用狀有效期限以三個月為一期(未滿三個月者視為一期)，按年率0.1%補繳開狀手續費。
                    </li>

                    <li class="mb-2">
                      (二) 貴行依本申請書開發「利息由買方負擔」之遠期信用狀，如有下列情形之一者，申請人同意依押匯金額及信用狀有效期限(3個月為一期，未滿3個月者，視為一期)，按年率0.1% 補繳開狀手續費，補繳金額最低為新臺幣1，000元：
                      <br />
                      1.受益人未押匯或押匯後，申請人立即還款而未向貴行借款者。
                      <br />
                      2.申請人提前清償借款，其原開狀手續費加計利息(分批押匯改賃，以第一筆押匯金額計算)合計低於新臺幣1，000元者。
                    </li>
                  </ol>
                </div>

                <div class="d-flex align-center justify-space-between">
                  <span>
                    <span class="font-weight-bold">申請人：</span>
                    優勢股份有限公司　(請蓋原留印鑑)
                  </span>

                  <span class="px-3 text-center">
                    <v-img src="../../assets/images/cds_01.gif" />
                    <div class="py-1">MIAGCSqGSI</div>
                  </span>
                </div>
              </td>
            </tr>
          </tbody>
        </v-table>

        <v-table class="hnb__table hnb__table--vertical mt-4" density="compact">
          <tbody>
            <tr>
              <th class="hnb__tbhd2 w-25 text-end">
                國內信用狀額(限)度
              </th>

              <td class="w-25">
                36,000,000
              </td>

              <th class="hnb__tbhd2 w-25 text-end">
                國內信用狀餘額(含本件)
              </th>

              <td class="w-25">
                37,100,000
              </td>
            </tr>

            <tr>
              <th class="hnb__tbhd text-end">
                國內交易外幣信用狀額(限)度
              </th>

              <td />

              <th class="hnb__tbhd2 text-end">
                國內交易外幣信用狀餘額(含本件)
              </th>

              <td />
            </tr>

            <tr>
              <th class="hnb__tbhd2 text-end">
                擔保條件
              </th>

              <td>
                信保10%
              </td>

              <th class="hnb__tbhd2 text-end">
                額(限)度到期日
              </th>

              <td>
                民國115年12月31日
              </td>
            </tr>

            <tr>
              <th class="hnb__tbhd2 text-end">
                存入保證金比率(%)
              </th>

              <td>
                10.00
              </td>

              <th class="hnb__tbhd2 text-end">
                承兌手續費
              </th>

              <td />
            </tr>

            <tr>
              <th class="hnb__tbhd2 text-end">
                開狀手續費
              </th>

              <td>
                500
              </td>

              <th class="hnb__tbhd2 text-end">
                放款帳號
              </th>

              <td />
            </tr>
          </tbody>
        </v-table>
      </v-card-text>

      <v-card-actions>
        <v-spacer />

        <v-btn
          class="hnb__btn--cancel my-2 mx-1"
          variant="flat"
          @click="onClose"
        >
          離開
        </v-btn>

        <v-spacer />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
  import { ref, watch } from 'vue'
  interface Props {
    appDialog?: boolean
    appNo?: string
  }
  const props = withDefaults(defineProps<Props>(), {
    appDialog: false,
    appNo: '',
  })

  const show = ref<boolean>(props.appDialog)
  watch(
    () => props.appDialog,
    newVal => {
      show.value = newVal
    },
  )
  watch(
    () => show.value,
    newVal => {
      emit('update:appDialog', newVal)
    },
  )

  const emit = defineEmits<{
    'update:appDialog': [boolean]
    'on-close': []
  }>()

  function onClose (): void {
    show.value = false
    emit('on-close')
  }
</script>
