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
        <span class="font-weight-bold">
          {{ props.beneType === 'cds' || props.beneType === 'fpc' ? '即期' : '遠期' }}
        </span>

        <span>信用狀明細</span>
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
            <v-col class="text-center hnb__bankName py-1" cols="12">
              <span class="pe-2">華南商業銀行</span>
              <span class="font-weight-bold">建成分行</span>
            </v-col>

            <v-col class="text-center py-1" cols="12">
              地址：台北市中正區南海路100號
            </v-col>

            <v-col class="py-1" cols="6">
              <span class=" hnb__bankName">不可撤銷信用狀</span>
            </v-col>

            <v-col class="text-right py-1" cols="6">
              日期：中華民國 114 年 5 月 10 日
            </v-col>
          </v-row>
        </v-container>

        <!-- 主要內容表格 -->
        <v-table class="hnb__table hnb__table--vertical" density="compact">
          <tbody>
            <!-- 第 1 列：敬啟者 / 信用狀號碼 / 通知銀行編號 -->
            <tr>
              <td class="w-50" rowspan="2">
                <p class="font-weight-bold my-1">敬啟者：</p>

                <p>
                  本行茲循右列申請人之請求開發本信用狀，本信用狀規定如有未盡事宜適用國際商會所訂現行「信用狀統一慣例與實務」之規定。
                </p>
              </td>

              <td class="align-top">
                <span class="font-weight-bold">信用狀號碼：</span>
                <span>099700049161000861</span>
              </td>

              <td class="align-top">
                <span class="font-weight-bold">通知銀行編號：</span>
                <span>01</span>
              </td>
            </tr>

            <!-- 第 2 列：申請人 (colspan=2) -->
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

            <!-- 第 3 列：通知銀行 / 金額 -->
            <tr>
              <td>
                <span class="font-weight-bold">通知銀行：</span>
                華南商業銀行 建成分行
              </td>

              <td colspan="2">
                <span class="font-weight-bold">金額：</span>
                新台幣
                <span class="text-red-darken-3 font-weight-bold">伍仟萬元整</span>
              </td>
            </tr>

            <!-- 第 4 列：受益人 / 有效期限 -->
            <tr>
              <td class="align-top">
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

                <template v-if="props.beneType === 'fpc'">
                  <span class="font-weight-bold">受益人事業部：</span>
                  1 塑膠部
                  <br>
                  <span class="font-weight-bold">客戶編號：</span>
                  HSTKS
                  <br>
                </template>

                <span class="font-weight-bold">Email：</span>
                a1b2c3d4e5@example.com
              </td>

              <td class="align-top" colspan="2">
                <span class="font-weight-bold">有效期限至：</span>
                民國 114 年 6 月 10 日
              </td>
            </tr>

            <!-- 第 5 列：匯票條件 / 應檢附單據 -->
            <tr>
              <td colspan="3">
                <p class="font-weight-bold my-1">
                  本信用狀可由上開受益人在不超過上開金額範圍內，依本狀規定條件簽發匯票承兌/付款：
                </p>

                <p class="font-weight-bold my-1">一、匯票之條件：</p>

                <ol class="hnb__list--ol ms-10">
                  <li class="mb-2">甲、付款人：華南商業銀行 建成分行</li>

                  <li v-if="props.beneType === 'cds' || props.beneType === 'fpc'" class="mb-2">
                    乙、付款期限：見票即付。
                  </li>

                  <li v-else class="mb-2 d-flex">
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
                  <li class="mb-2">2. <v-icon icon="mdi mdi-square-outline" size="small" /> 匯票承兌申請書乙份。</li>
                  <li class="mb-2">3. <v-icon icon="mdi mdi-square" size="small" /> 統一發票。</li>
                  <li class="mb-2">4. <v-icon icon="mdi mdi-square-outline" size="small" /> 其他： </li>
                </ol>

                <p class="ms-3 font-weight-bold">上項單據應載明申請人向受益人購買下列貨物：</p>
                <p class="ms-3">鋼品一批</p>
              </td>
            </tr>

            <!-- 第 6 列：特別指示 -->
            <tr>
              <td v-if="props.beneType === 'cds'" colspan="3">
                <p class="font-weight-bold mb-2">三、特別指示：</p>
                <p class="font-weight-bold mb-2">1.電子押匯特別指示條款</p>

                <ol class="hnb__list--ol">
                  <li class="mb-2">(1) 賣方所提供鋼品之一部或全部，可能產自中國鋼鐵股份有限公司或中龍鋼鐵股份有限公司(下稱中隆公司)，視實際出貨狀況而定，如產自中龍公司，賣方就其鋼品品質，負賣方責任，至如約定價格、各交易條件及優惠措施均不受影響。</li>
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

              <td v-if="props.beneType === 'fpc'" colspan="3">
                <p class="font-weight-bold my-1">三、特別指示：</p>
                <p class="font-weight-bold my-1">電子押匯特別指示條款</p>

                <p class="mb-1">1. 匯票及匯票付款申請書使用受益人所訂格式，由受益人單獨簽章或使用數位憑證有效。</p>
                <p class="mb-1">2. 貨物可以分批交貨。</p>

                <div class="d-flex flex-wrap align-center ga-2 my-2">
                  <span>3. 最後交貨日期：{{ form.lastDeliveryDate || '-' }}</span>

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
                    <v-icon :icon="form.usanceInterestBuyer ? 'mdi mdi-square' : 'mdi mdi-square-outline'" size="small" /> 買方負擔
                  </span>
                </div>

                <div class="my-2">
                  <div class="mb-1">
                    11. 其他：
                  </div>

                  {{ form.otherSpecialTerms || '' }}
                </div>

                <div class="d-flex flex-wrap align-center ga-2 my-2">
                  <span>12. 限定押匯日期：自</span>

                  {{ form.draftStartDate || '-' }}

                  <span>起始可押匯。<span class="text-caption"> ( 未填寫者視為未限定押匯日期 )</span></span>
                </div>

                <div class="d-flex flex-wrap align-center ga-2 my-2">
                  <span>13. 發票起始開立日期：</span>

                  {{ form.invoiceStartDate || '-' }}

                  <span class="text-caption">( 以統一發票日起算匯票到其日期者，請填寫此項，未填寫者視為未限制發票開立日期 )。</span>
                </div>
              </td>

              <!-- 其他受益人類型的特別指示 -->
              <td v-if="props.beneType === 'other'" colspan="3">
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

            <!-- 第 7 列：保證文字 / 通知銀行記載 -->
            <tr>
              <td rowspan="2">
                <p class="mb-2">
                  上述匯票須載明本信用狀之日期及編號並限於有效期限內向本行辦理提示請求承兌/付款。上述單證經審查結果核與本信用狀規定條款相符時，本行保證上開依規定簽發、提示之匯票必能如約獲得承兌/付款。
                </p>

                <div class="d-flex align-center justify-space-between">
                  <div>
                    <span class="hnb__bankName me-5">華南商業銀行</span>
                    <span class="text-subtitle-1">啟</span>
                  </div>

                  <div v-if="props.beneType === 'cds'" class="px-3 d-flex flex-column align-center">
                    <v-img src="../../assets/images/cds_01.gif" width="90" />
                    <div class="py-1">MIAGCSqGSI</div>
                  </div>

                  <div v-if="props.beneType === 'other'" class="px-3 d-flex flex-column align-center">
                    <v-img src="../../assets/images/cds_03.gif" width="90" />
                    <div class="py-1">MIAGCSqGSI</div>
                  </div>
                </div>
              </td>

              <td colspan="2">
                通知銀行記載
              </td>
            </tr>

            <!-- 第 8 列：通知銀行簽章 -->
            <tr>
              <td class="hnb__table--left-border" colspan="2">
                <div>
                  通知銀行之簽章及通知日期
                </div>
              </td>
            </tr>
          </tbody>
        </v-table>

        <!-- 下載 / 列印 / 版本選擇 -->
        <v-container class="mt-3" fluid>
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

            <v-col v-if="props.isShowVersion" class="text-center my-2" cols="12">
              <span
                class="mx-3 text-decoration-underline text-primary cursor-pointer"
                @click.prevent="handleLcView('1')"
              >
                版本 0
              </span>

              <span class="mx-1 text-grey">|</span>
              <span class="mx-3 font-weight-bold">版本 1 (目前版本)</span>
            </v-col>
          </v-row>

          <!-- 修改通知書號碼卡片 -->
          <v-row v-if="props.isShowNotice" justify="center">
            <v-col cols="12" md="4" sm="6">
              <v-card class="mx-auto border-sm bg-white" variant="outlined">
                <v-card-title class="text-center text-red-darken-3 text-subtitle-1 font-weight-bold py-2">
                  修改通知書號碼
                </v-card-title>

                <v-divider />

                <v-list density="compact">
                  <v-list-item
                    v-for="item in amendmentNos"
                    :key="item"
                    class="text-center"
                    color="teal-darken-1"
                    link
                    :title="item"
                    :value="item"
                    @click.prevent="handleNoticeView(item)"
                  />
                </v-list>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-spacer />

        <v-btn
          class="hnb__btn--cancel my-2"
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
  import { computed, ref } from 'vue'
  interface Props {
    lcDialog?: boolean
    lcNo?: string
    beneType?: string
    isShowVersion?: boolean
    isShowNotice?: boolean
  }
  const props = withDefaults(defineProps<Props>(), {
    lcDialog: false,
    lcNo: '',
    beneType: '',
    isShowNotice: false,
    isShowVersion: false,
  })

  const emits = defineEmits<{
    'update:lcDialog': [boolean]
    'on-close': []
    'open-lc-detail': [lcNo: string]
    'open-notice-detail': [noticeNo: string]
  }>()

  const show = computed({
    get: () => props.lcDialog,
    set: (value: boolean) => {
      emits('update:lcDialog', value)
    },
  })

  const amendmentNos = ref([
    'LC123400215_V01',
    'LC123400215_V02',
  ])

  const form = ref({
    paymentMain: 'sight',
    fixedExpiryBasis: 'draft_invoice',
    fixedDaysWithin: '',
    useNamedDueDate: false,
    namedDueDate: '',
    lastDeliveryDate: '',
    usanceInterestBuyer: false,
    otherSpecialTerms: '',
    draftStartDate: '',
    invoiceStartDate: '',
    draftFormat: 'bank',
    partialShipment: 'allowed',
    discountInterest: 'buyer',
    feeBearer: 'buyer',
    stampSingleParty: 'allowed',
  })

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

  // 查看信用狀
  function handleLcView (value: string): void {
    emits('open-lc-detail', value)
  }

  // 查看修改通知書
  function handleNoticeView (value: string): void {
    emits('open-notice-detail', value)
  }
</script>
