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

            <v-col class="py-1 text-center" cols="12">
              中華民國 114 年 5 月 10 日
            </v-col>
          </v-row>
        </v-container>

        <v-table class="hnb__table hnb__table--layout" density="compact">
          <tbody>
            <tr>
              <td class="w-50" rowspan="2">
                <p>茲請　貴行准照前訂委任開發國內即期信用狀契約之規定依下開條件開發信用狀。</p>
                <p>本信用狀規定如有未盡事宜適用國際商會所訂現行「信用狀統一慣例與實務(含eUCP)」之規定</p>
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
                <span class="font-weight-bold">通知銀行：</span>華南商業銀行 建成分行
              </td>

              <td colspan="2">
                <span class="font-weight-bold">金額：</span>
                新台幣
                <span class="hnb__text--red">伍仟萬元整</span>
              </td>
            </tr>

            <tr>
              <td class="w-50">
                <span class="font-weight-bold">受益人：</span>中鴻鋼鐵股份有限公司<br>
                <span class="font-weight-bold">統一編號：</span>75708007<br>
                <span class="font-weight-bold">負責人：</span><span class="pe-5">李志村</span> ( 職稱 ) 總經理<br>
                <span class="font-weight-bold">地址：</span>高雄縣橋頭鄉芋寮村芋寮路317號<br>
                <span class="font-weight-bold">電話：</span>07-611-7171<br>
                <span class="font-weight-bold">Email：</span>a1b2c3d4e5@example.com
              </td>

              <td colspan="2">
                <span class="font-weight-bold">有效期限至：</span>民國 114 年 6 月 10 日
              </td>
            </tr>

            <tr>
              <td colspan="3">
                <p class="font-weight-bold my-1">本信用狀可由上開受益人在不超過上開金額範圍內，依本狀規定條件簽發匯票承兌/付款：</p>
                <p class="font-weight-bold my-1">一、匯票之條件：</p>

                <ol class="hnb__list--ol ms-10">
                  <li class="mb-2">甲、付款人：華南商業銀行 建成分行</li>

                  <li class="mb-2 d-flex">
                    <div>乙、付款期限：</div>

                    <div style="text-indent: 0;">
                      <div>
                        <v-icon :icon="form.paymentMain === 'sight' ? 'mdi mdi-circle' : 'mdi mdi-circle-outline'" size="small" />
                        見票即付。
                      </div>

                      <div>
                        <p class="mb-1">
                          <v-icon :icon="form.paymentMain === 'fixed' ? 'mdi mdi-circle' : 'mdi mdi-circle-outline'" size="small" />
                          以「定日付款」方式填寫到期日，其到期日為：
                        </p>

                        <p class="ms-5 mb-1">
                          <span><v-icon :icon="form.fixedExpiryBasis === 'draft_invoice' ? 'mdi mdi-circle' : 'mdi mdi-circle-outline'" size="small" /> 匯票發票日</span>
                          <span class="ms-3"><v-icon :icon="form.fixedExpiryBasis === 'unified_invoice' ? 'mdi mdi-circle' : 'mdi mdi-circle-outline'" size="small" /> ( 統一 ) 發票日</span>
                          <span class="ms-3">起算 {{ form.fixedDaysWithin || '-' }} 天內。</span>
                        </p>

                        <p class="ms-5">
                          <v-icon :icon="form.useNamedDueDate ? 'mdi mdi-circle' : 'mdi mdi-circle-outline'" size="small" />
                          指定期日為
                          {{ form.namedDueDate || '-' }}
                        </p>
                      </div>
                    </div>
                  </li>

                  <li class="mb-2">丙、金額：須與相關發票上所列開金額一致，或照本信用狀其他指示。</li>
                </ol>

                <p class="font-weight-bold my-1">二、應檢附之單據如下：</p>

                <ol class="hnb__list--ol ms-10">
                  <li class="mb-2">1. <v-icon icon="mdi mdi-square" size="small" /> 匯票付款申請書乙份。</li>
                  <li class="mb-2">2. <v-icon icon="mdi mdi-square" size="small" /> 匯票承兌申請書乙份。</li>
                  <li class="mb-2">3. <v-icon icon="mdi mdi-square" size="small" /> {{ form.invoiceKind === 'invoice' ? '發票' : form.invoiceKind === 'unified' ? '統一發票' : '' }}。</li>
                  <li class="mb-2">4. <v-icon icon="mdi mdi-square-outline" size="small" /> 其他： XXXXXXXXX</li>
                </ol>

                <p class="ms-3 font-weight-bold">上項單據應載明申請人向受益人購買下列貨物：</p>
                <p class="ms-3">鋼品一批</p>
              </td>
            </tr>

            <tr>
              <td colspan="3">
                <p class="font-weight-bold my-1">三、特別指示：</p>
                <p class="font-weight-bold my-1">電子押匯特別指示條款</p>

                <ol class="hnb__line--ol ms-4">
                  <li class="mb-2">
                    <span>匯票承兌/付款申請書使用 </span>

                    <span class="mx-1"><v-icon :icon="form.draftFormat === 'bank' ? 'mdi mdi-circle' : 'mdi mdi-circle-outline'" size="small" /> 貴行</span>
                    <span class="mx-1"><v-icon :icon="form.draftFormat === 'beneficiary' ? 'mdi mdi-circle' : 'mdi mdi-circle-outline'" size="small" /> 受益人</span>

                    <span> 所訂格式，申請書上信用狀申請人所蓋印鑑應與原留印鑑相符。</span>
                  </li>

                  <li class="mb-2">
                    <span>分批交貨：</span>

                    <span class="mx-1"><v-icon :icon="form.partialShipment === 'allowed' ? 'mdi mdi-circle' : 'mdi mdi-circle-outline'" size="small" /> 可以</span>
                    <span class="mx-1"><v-icon :icon="form.partialShipment === 'not_allowed' ? 'mdi mdi-circle' : 'mdi mdi-circle-outline'" size="small" /> 不可以</span>

                    <span>（未填者視為得分批交貨）。</span>
                  </li>

                  <li class="mb-2">
                    <span class="mx-1"><v-icon :icon="form.discountInterest === 'buyer' ? 'mdi mdi-circle' : 'mdi mdi-circle-outline'" size="small" /> 匯票墊款利息由買方負擔</span>
                    <span class="mx-1"><v-icon :icon="form.discountInterest === 'seller' ? 'mdi mdi-circle' : 'mdi mdi-circle-outline'" size="small" /> 匯票貼現利息由賣方負擔</span>

                    <span>（未填者視為由買方負擔）。</span>
                  </li>

                  <li class="mb-2">
                    <span>最後交貨日期：</span>

                    民國 114 年 5 月 10 日

                    <span>（未填者自開狀日起三個月視為最後交貨日，惟不得超過信用狀有效期限）。</span>
                  </li>

                  <li class="mb-2">
                    <span>限定押匯日期：自</span>

                    民國 114 年 5 月 10 日

                    <span>起始可押匯。</span>
                  </li>

                  <li class="mb-2">
                    <span>承兌手續費由</span>
                    <span class="mx-1"><v-icon :icon="form.feeBearer === 'buyer' ? 'mdi mdi-circle' : 'mdi mdi-circle-outline'" size="small" /> 買方</span>
                    <span class="mx-1"><v-icon :icon="form.feeBearer === 'seller' ? 'mdi mdi-circle' : 'mdi mdi-circle-outline'" size="small" /> 賣方</span>

                    <span>負擔（未填者視為由買方負擔）。</span>
                  </li>

                  <li class="mb-2">
                    <span>受益人押匯時，匯票承兌/付款申請書</span>
                    <span class="mx-1"><v-icon :icon="form.stampSingleParty === 'allowed' ? 'mdi mdi-circle' : 'mdi mdi-circle-outline'" size="small" /> 可以</span>
                    <span class="mx-1"><v-icon :icon="form.stampSingleParty === 'not_allowed' ? 'mdi mdi-circle' : 'mdi mdi-circle-outline'" size="small" /> 不可以</span>

                    <span>僅由受益人單方蓋章。</span>
                  </li>

                  <li class="mb-2">
                    押匯文件透過通知銀行之櫃台提示。
                  </li>

                  <li class="mb-2">
                    <div class="mb-1">
                      其他：
                    </div>

                    <span class="font-weight-bold" v-html="form.otherSpecialTerms"></span>
                  </li>
                </ol>
              </td>
            </tr>

            <tr>
              <td colspan="3">
                <p class="mb-2">
                  <span class="font-weight-bold">利率條款：</span>
                  貴行依本申請書開發信用狀所墊付之款項，申請人同意依貴我雙方所訂之利率訂價方式，按月計付利息。
                </p>

                <p class="mb-2">
                  <span class="font-weight-bold">新臺幣短期放款計期方式：</span>
                  按日計息，以每年365天為利息計算基礎，逢閏年時亦同。利率=本金餘額×年利率×1/365×計息天數。
                </p>

                <div class="mb-2">
                  <span class="font-weight-bold mb-2">手續費約款：</span>
                  <p class="mb-2">申請人同意貴行目前所訂相關費用之收費標準，且同意貴行得隨時調整，但應於調整前以顯著方式於營業場所或網站上公開揭示，另</p>

                  <ol class="hnb__list--ol">
                    <li class="mb-2">
                      (一)貴行依本申請書開發「利息及承兌手續費由賣方「利息及承兌手續費由賣方負擔」之遠期信用狀，如於信用狀有效期限屆滿而受益人未向貴行辦理提示請求承兌或申請人申請註銷信用狀時，申請人同意依開狀金額，視信用狀有效期限以三個月為一期(未滿三個月者視為一期)，按年率0.1%補繳開狀手續費。
                    </li>

                    <li class="mb-2">
                      (二)貴行依本申請書開發「利息由買方負擔」之遠期信用狀，如有下列情形之一者，申請人同意依押匯金額及信用狀有效期限(3個月為一期，未滿3個月者，視為一期)，按年率0.1%
                      補繳開狀手續費，補繳金額最低為新臺幣1，000元：
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
                    <v-img src="../../assets/images/cds_03.gif" />
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
              <th class="text-end w-25 text-end">
                國內信用狀額(限)度
              </th>

              <td class="w-25">
                36,000,000
              </td>

              <th class="text-end w-25 text-end">
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

              <th class="text-end text-end">
                國內交易外幣信用狀餘額(含本件)
              </th>

              <td />
            </tr>

            <tr>
              <th class="text-end text-end">
                擔保條件
              </th>

              <td>
                信保10%
              </td>

              <th class="text-end text-end">
                額(限)度到期日
              </th>

              <td>
                民國115年12月31日
              </td>
            </tr>

            <tr>
              <th class="text-end text-end">
                存入保證金比率(%)
              </th>

              <td>
                10.00
              </td>

              <th class="text-end text-end">
                承兌手續費
              </th>

              <td />
            </tr>

            <tr>
              <th class="text-end text-end">
                開狀手續費
              </th>

              <td>
                500
              </td>

              <th class="text-end text-end">
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
          class="hnb__btn--cancel"
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

  const form = ref({
    paymentMain: 'sight',
    paymentExpBasis: 'draft',
    paymentExpOtherText: '',
    payDaysAfter: '',
    invoiceKind: 'invoice',
    otherDocumentsDetail: '',
    productPurchaseNote: '',
    draftFormat: 'bank',
    partialShipment: 'allowed',
    discountInterest: 'buyer',
    lastDeliveryDate: '',
    draftLimitStartDate: '',
    feeBearer: 'buyer',
    stampSingleParty: 'allowed',
    otherSpecialTerms: '',
    fixedExpiryBasis: '',
    fixedDaysWithin: '',
    useNamedDueDate: false,
    namedDueDate: '',

  })

  function onClose (): void {
    show.value = false
    emit('on-close')
  }
</script>
