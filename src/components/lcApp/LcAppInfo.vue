<template>
  <div>
    <!-- 銀行抬頭 -->
    <v-container fluid>
      <v-row align="center">
        <v-col class="py-1 hnb__bankName text-center" cols="12">
          開發國內不可撤銷信用狀申請書
        </v-col>

        <v-col class="py-1" cols="6">
          <span class="my-1 text-h6 hnb__bankName">
            <span class="pe-1">{{ detail.bankName }}</span>
            <span class="pe-1">{{ detail.branchName }}</span>
            <span>台鑑</span>
          </span>
        </v-col>

        <v-col class="py-1 text-end" cols="6">
          日期：{{ toRocDate(detail.date) }}
        </v-col>
      </v-row>
    </v-container>

    <v-table class="hnb__table hnb__table--layout" density="compact">
      <tbody>
        <tr>
          <td class="w-50" rowspan="2">
            <p>茲請　貴行准照前訂委任開發國內即期信用狀契約之規定依下開條件開發信用狀。</p>

            <p v-if="props.beneType === 'cds' || props.beneType === 'fpc'">
              本信用狀如有未盡事宜適用國際商會所訂現行「信用狀統一慣例與實務」之規定。
            </p>

            <p v-if="props.beneType === 'other'">
              本信用狀規定如有未盡事宜適用國際商會所訂現行「信用狀統一慣例與實務(含eUCP)」之規定。
            </p>
          </td>

          <td>
            <p>
              <span class="font-weight-bold">信用狀號碼：</span>
              <span>{{ detail.lcNo }}</span>
            </p>

            <p class="mb-0">
              <span class="font-weight-bold">開證日期：</span>
              <span>{{ detail.issueDate }}</span>
            </p>
          </td>

          <td>
            <span class="font-weight-bold">通知銀行編號：</span>
            <span>{{ detail.notifyBankNo }}</span>
          </td>
        </tr>

        <tr>
          <td class="hnb__table--left-border" colspan="2">
            <p>
              <span class="font-weight-bold">申請人：</span>
              {{ detail.applicantName }}
            </p>

            <p>
              <span class="pe-5">
                <span class="font-weight-bold">聯絡人姓名：</span>
                {{ detail.contactName }}
              </span>

              <span>
                <span class="font-weight-bold">聯絡人電話：</span>
                {{ detail.contactPhone }}
              </span>
            </p>
          </td>
        </tr>

        <tr>
          <td class="w-50">
            <span class="font-weight-bold">通知銀行：</span>
            {{ detail.notifyBank }}
          </td>

          <td colspan="2">
            <span class="font-weight-bold">金額：</span>
            {{ detail.currency }}
            <span class="text-red-darken-3 font-weight-bold">
              {{ detail.amountText }}
            </span>
          </td>
        </tr>

        <tr>
          <td class="w-50">
            <!-- 共用 -->
            <span class="font-weight-bold">受益人：</span>
            {{ detail.beneficiaryName }}
            <br>
            <span class="font-weight-bold">統一編號：</span>
            {{ detail.beneficiaryTaxId }}
            <br>
            <span class="font-weight-bold">受益人負責人：</span>
            {{ detail.beneficiaryRepresentative }}
            <br>
            <span class="font-weight-bold">負責人職稱：</span>
            {{ detail.beneficiaryTitle }}
            <br>
            <span class="font-weight-bold">地址：</span>
            {{ detail.beneficiaryAddress }}
            <br>
            <span class="font-weight-bold">電話：</span>
            {{ detail.beneficiaryPhone }}
            <br>
            <span class="font-weight-bold">Email：</span>
            {{ detail.beneficiaryEmail }}

            <!-- FPC -->
            <template v-if="props.beneType === 'fpc'">
              <span class="font-weight-bold">受益人事業部：</span>
              {{ detail.beneficiaryDept }}
              <br>
              <span class="font-weight-bold">客戶編號：</span>
              {{ detail.beneficiaryCustomerNo }}
            </template>
          </td>

          <td colspan="2">
            <span class="font-weight-bold">有效期限至：</span>
            {{ toRocDate(detail.expiry) }}
          </td>
        </tr>

        <tr>
          <td colspan="3">
            <p class="font-weight-bold my-1">
              本信用狀可由上開受益人在不超過上開金額範圍內，依本狀規定條件簽發匯票承兌/付款：
            </p>

            <p class="font-weight-bold my-1">一、匯票之條件：</p>

            <ol class="hnb__list--ol ms-10">
              <li class="mb-2">甲、付款人：{{ detail.payerBank }}</li>
              <li v-if="props.beneType === 'cds' || props.beneType === 'fpc'" class="mb-2">乙、付款期限：{{ detail.paymentTerm }}。</li>

              <li v-if="props.beneType === 'other'" class="mb-2 d-flex">
                <div>乙、付款期限：</div>

                <div style="text-indent: 0;">
                  <div>
                    <v-icon :icon="data.paymentMain === 'sight' ? 'mdi mdi-circle' : 'mdi mdi-circle-outline'" size="small" />
                    見票即付。
                  </div>

                  <div>
                    <p class="mb-1">
                      <v-icon :icon="data.paymentMain === 'fixed' ? 'mdi mdi-circle' : 'mdi mdi-circle-outline'" size="small" />
                      以「定日付款」方式填寫到期日，其到期日為：
                    </p>

                    <p class="ms-5 mb-1">
                      <span><v-icon :icon="data.fixedExpiryBasis === 'draft_invoice' ? 'mdi mdi-circle' : 'mdi mdi-circle-outline'" size="small" /> 匯票發票日</span>
                      <span class="ms-3"><v-icon :icon="data.fixedExpiryBasis === 'unified_invoice' ? 'mdi mdi-circle' : 'mdi mdi-circle-outline'" size="small" /> ( 統一 ) 發票日</span>
                      <span class="ms-3">起算 {{ data.fixedDaysWithin || '-' }} 天內。</span>
                    </p>

                    <p class="ms-5">
                      <v-icon :icon="data.useNamedDueDate ? 'mdi mdi-circle' : 'mdi mdi-circle-outline'" size="small" />
                      指定期日為
                      {{ data.namedDueDate || '-' }}
                    </p>
                  </div>
                </div>
              </li>

              <li class="mb-2">丙、金額：須與相關發票上所列開金額一致，或照本信用狀其他指示。</li>
            </ol>

            <p class="font-weight-bold my-1">二、應檢附之單據如下：</p>

            <ol class="hnb__list--ol ms-10">
              <li v-for="(doc, idx) in detail.documents" :key="idx" class="mb-1">
                <v-icon size="small">{{ doc.checked ? 'mdi mdi-square' : 'mdi mdi-square-outline' }}</v-icon>
                {{ doc.text }}
              </li>
              <!-- <li class="mb-2">1. <v-icon icon="mdi mdi-square" size="small" /> 匯票付款申請書乙份。</li>
              <li class="mb-2">2. <v-icon icon="mdi mdi-square-outline" size="small" /> 匯票承兌申請書乙份。</li>
              <li v-if="props.beneType === 'cds'" class="mb-2">3. <v-icon icon="mdi mdi-square" size="small" /> 統一發票。</li>
              <li v-if="props.beneType === 'fpc' || props.beneType === 'other'" class="mb-2">3. <v-icon icon="mdi mdi-square" size="small" /> {{ data.invoiceKind === 'invoice' ? '發票' : data.invoiceKind === 'unified' ? '統一發票' : '' }}。</li>
              <li class="mb-2">4. <v-icon icon="mdi mdi-square-outline" size="small" /> 其他： </li> -->
            </ol>

            <p class="ms-4 font-weight-bold">上項單據應載明申請人向受益人購買下列貨物：</p>
            <p class="ms-4">{{ detail.goodsDescription }}</p>
          </td>
        </tr>

        <tr>
          <td colspan="3">
            <p class="font-weight-bold mb-2">三、特別指示：</p>

            <p class="ms-4">{{ detail.specialInstructionTitle }}</p>

            <ol class="hnb__list--ol mb-2">
              <li v-for="(inst, idx) in detail.specialInstructions" :key="idx" class="mb-1">
                {{ inst }}
              </li>
            </ol>

            <!-- <p class="font-weight-bold mb-2">1.電子押匯特別指示條款</p> -->

            <!-- CDS 特別指示 -->
            <!-- <template v-if="props.beneType === 'cds'">
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
            </template> -->

            <!-- FPC 特別指示 -->
            <!-- <template v-if="props.beneType === 'fpc'">
              <p class="mb-1">1. 匯票及匯票付款申請書使用受益人所訂格式，由受益人單獨簽章或使用數位憑證有效。</p>
              <p class="mb-1">2. 貨物可以分批交貨。</p>

              <div class="d-flex flex-wrap align-center ga-2 my-2">
                <span>3. 最後交貨日期：{{ data.lastDeliveryDate || '-' }}</span>

                <span class="text-caption">( 未填者自開狀日起三個月視為最後交貨日，惟不得超過信用狀有效日期 )。</span>
              </div>

              <p class="mb-1">4. 發票日期早於開狀日期可以接受。</p>
              <p class="mb-1">5. 發票金額大於開狀金額或匯票金額可以接受。</p>
              <p class="mb-1">6. 以受益人所屬分公司或分廠名義開立之發票押匯可以接受。</p>
              <p class="mb-1">7. 本信狀適用 eUCP2.0 版。</p>
              <p class="mb-1">8. 允許受益人以匯票、匯票付款申請書及發票電子檔方式押匯。</p>
              <p class="mb-1">9. 押匯電子文件透過網址: HTTPS://ecrm.fpg.com.tw 提示。</p>

              <div class="d-flex align-center ga-2 my-2">
                <span>
                  10. 遠期信用狀利息：
                  <v-icon :icon="data.usanceInterestBuyer ? 'mdi mdi-square' : 'mdi mdi-square-outline'" size="small" /> 買方負擔
                </span>
              </div>

              <div class="my-2">
                <div class="mb-1">
                  11. 其他：
                </div>

                {{ data.otherSpecialTerms || '' }}
              </div>

              <div class="d-flex flex-wrap align-center ga-2 my-2">
                <span>12. 限定押匯日期：自</span>

                {{ data.draftStartDate || '-' }}

                <span>起始可押匯。<span class="text-caption"> ( 未填寫者視為未限定押匯日期 )</span></span>
              </div>

              <div class="d-flex flex-wrap align-center ga-2 my-2">
                <span>13. 發票起始開立日期：</span>

                {{ data.invoiceStartDate || '-' }}

                <span class="text-caption">( 以統一發票日起算匯票到其日期者，請填寫此項，未填寫者視為未限制發票開立日期 )。</span>
              </div>
            </template> -->

            <!-- 其他受益人特別指示 -->
            <!-- <template v-if="props.beneType === 'other'">
              <ol class="hnb__line--ol ms-4">
                <li class="mb-2">
                  <span>匯票承兌/付款申請書使用 </span>

                  <span class="mx-1"><v-icon :icon="data.draftFormat === 'bank' ? 'mdi mdi-circle' : 'mdi mdi-circle-outline'" size="small" /> 貴行</span>
                  <span class="mx-1"><v-icon :icon="data.draftFormat === 'beneficiary' ? 'mdi mdi-circle' : 'mdi mdi-circle-outline'" size="small" /> 受益人</span>

                  <span> 所訂格式，申請書上信用狀申請人所蓋印鑑應與原留印鑑相符。</span>
                </li>

                <li class="mb-2">
                  <span>分批交貨：</span>

                  <span class="mx-1"><v-icon :icon="data.partialShipment === 'allowed' ? 'mdi mdi-circle' : 'mdi mdi-circle-outline'" size="small" /> 可以</span>
                  <span class="mx-1"><v-icon :icon="data.partialShipment === 'not_allowed' ? 'mdi mdi-circle' : 'mdi mdi-circle-outline'" size="small" /> 不可以</span>

                  <span>（未填者視為得分批交貨）。</span>
                </li>

                <li class="mb-2">
                  <span class="mx-1"><v-icon :icon="data.discountInterest === 'buyer' ? 'mdi mdi-circle' : 'mdi mdi-circle-outline'" size="small" /> 匯票墊款利息由買方負擔</span>
                  <span class="mx-1"><v-icon :icon="data.discountInterest === 'seller' ? 'mdi mdi-circle' : 'mdi mdi-circle-outline'" size="small" /> 匯票貼現利息由賣方負擔</span>

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
                  <span class="mx-1"><v-icon :icon="data.feeBearer === 'buyer' ? 'mdi mdi-circle' : 'mdi mdi-circle-outline'" size="small" /> 買方</span>
                  <span class="mx-1"><v-icon :icon="data.feeBearer === 'seller' ? 'mdi mdi-circle' : 'mdi mdi-circle-outline'" size="small" /> 賣方</span>

                  <span>負擔（未填者視為由買方負擔）。</span>
                </li>

                <li class="mb-2">
                  <span>受益人押匯時，匯票承兌/付款申請書</span>
                  <span class="mx-1"><v-icon :icon="data.stampSingleParty === 'allowed' ? 'mdi mdi-circle' : 'mdi mdi-circle-outline'" size="small" /> 可以</span>
                  <span class="mx-1"><v-icon :icon="data.stampSingleParty === 'not_allowed' ? 'mdi mdi-circle' : 'mdi mdi-circle-outline'" size="small" /> 不可以</span>

                  <span>僅由受益人單方蓋章。</span>
                </li>

                <li class="mb-2">
                  押匯文件透過通知銀行之櫃台提示。
                </li>

                <li class="mb-2">
                  <div class="mb-1">
                    其他：
                  </div>

                  <span class="font-weight-bold" v-html="data.otherSpecialTerms" />
                </li>
              </ol>
            </template> -->
          </td>
        </tr>

        <!-- 利率條款 / 計期方式 / 手續費 / 申請人印鑑 -->
        <tr>
          <td colspan="3">
            <p class="mb-2">
              <span class="font-weight-bold">利率約款：</span>
              {{ detail.rateTerm }}
            </p>

            <!-- rateRule 在 CDS 狀態下不顯示 -->
            <template v-if="props.beneType === 'fpc'">
              <ol class="hnb__list--ol">
                <li>
                  <v-icon icon="mdi mdi-square" size="small" />
                  基準利率 加碼年率 %計付利息，如貴行利率調整時亦隨同調整。
                </li>

                <li>
                  <v-icon icon="mdi mdi-square-outline" size="small" />
                  年率 % 固定計息
                </li>
              </ol>
            </template>

            <p class="mb-2">
              <span class="font-weight-bold">新臺幣短期放款計期方式：</span>
              {{ detail.calculationMethod }}
            </p>

            <div class="mb-2">
              <span class="font-weight-bold">手續費約款：</span>
              {{ detail.feeTerm }}
              <!-- <p class="mb-2">申請人同意貴行目前所訂相關費用之收費標準，且同意貴行得隨時調整，但應於調整前以顯著方式於營業場所或網站上公開揭示，另</p>

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
              </ol> -->
            </div>

            <div class="d-flex align-center justify-space-between">
              <span>
                <span class="font-weight-bold">申請人：</span>
                {{ detail.applicantStampLabel }}　(請蓋原留印鑑)
              </span>

              <template v-if="props.beneType === 'cds'">
                <span class="px-3 text-center">
                  <v-img :src="detail.qrImageUrl" />
                  <div class="py-1">{{ detail.qrText }}</div>
                </span>
              </template>

              <template v-if="props.beneType === 'other'">
                <span class="px-3 text-center">
                  <v-img :src="detail.qrImageUrl" />
                  <div class="py-1">{{ detail.qrText }}</div>
                </span>
              </template>
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
            {{ detail.creditSummary.creditLine }}
          </td>

          <th class="hnb__tbhd2 w-30 text-end">
            國內信用狀餘額(含本件)
          </th>

          <td class="w-20">
            {{ detail.creditSummary.creditBalance }}
          </td>
        </tr>

        <tr>
          <th class="hnb__tbhd text-end">
            國內交易外幣信用狀額(限)度
          </th>

          <td>
            {{ detail.creditSummary.fxCreditLine }}
          </td>

          <th class="hnb__tbhd2 text-end">
            國內交易外幣信用狀餘額(含本件)
          </th>

          <td>
            {{ detail.creditSummary.fxCreditBalance }}
          </td>
        </tr>

        <tr>
          <th class="hnb__tbhd2 text-end">
            擔保條件
          </th>

          <td>
            {{ detail.creditSummary.collateralCondition }}
          </td>

          <th class="hnb__tbhd2 text-end">
            額(限)度到期日
          </th>

          <td>
            {{ toRocDate(detail.creditSummary.creditLineExpiryDate) }}
          </td>
        </tr>

        <tr>
          <th class="hnb__tbhd2 text-end">
            存入保證金比率(%)
          </th>

          <td>
            {{ detail.creditSummary.depositRatio }}
          </td>

          <th class="hnb__tbhd2 text-end">
            承兌手續費
          </th>

          <td>
            {{ detail.creditSummary.acceptanceFee }}
          </td>
        </tr>

        <tr>
          <th class="hnb__tbhd2 text-end">
            開狀手續費
          </th>

          <td>
            {{ detail.creditSummary.openingFee }}
          </td>

          <th class="hnb__tbhd2 text-end">
            放款帳號
          </th>

          <td>
            {{ detail.creditSummary.loanAccountNo }}
          </td>
        </tr>
      </tbody>
    </v-table>
  </div>
</template>
<script setup lang="ts">
  import { ref } from 'vue'
  import { toRocDate } from '@/utils/format'
  interface Props {
    beneType?: string
    data?: any
  }
  const props = withDefaults(defineProps<Props>(), {
    beneType: 'cds',
    data: {},
  })

  const detail = ref(props.data)
</script>
