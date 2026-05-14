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
        <span class="font-weight-bold">遠期</span>
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
        <v-table class="hnb__table" density="compact">
          <tbody>
            <!-- 第 1 列：敬啟者 / 信用狀號碼 / 通知銀行編號 -->
            <tr>
              <td class="w-50" rowspan="2">
                <p class="font-weight-bold mb-1">敬啟者：</p>

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
                <span class="font-weight-bold">申請人：</span>
                優勢股份有限公司
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
                <span class="text-red font-weight-bold">伍仟萬元整</span>
              </td>
            </tr>

            <!-- 第 4 列：受益人 / 有效期限 -->
            <tr>
              <td class="align-top">
                <span class="font-weight-bold">受益人：</span>
                中鴻鋼鐵股份有限公司
                <br />
                <span class="font-weight-bold">受益人負責人：</span>
                林大華
                <br />
                <span class="font-weight-bold">負責人職稱：</span>
                總經理
                <br />
                <span class="font-weight-bold">地址：</span>
                高雄縣橋頭鄉芋寮村芋寮路317號
              </td>

              <td class="align-top" colspan="2">
                <span class="font-weight-bold">有效期限至：</span>民國114年6月10日
              </td>
            </tr>

            <!-- 第 5 列：匯票條件 / 應檢附單據 -->
            <tr>
              <td colspan="3">
                <p class="font-weight-bold mb-1">
                  本信用狀可由上開受益人在不超過上開金額範圍內，依本狀規定條件簽發匯票承兌/付款：
                </p>

                <p class="font-weight-bold mb-1">一、匯票之條件：</p>

                <ol class="hnb__list--ol ms-10">
                  <li>甲、付款人：華南商業銀行 建成分行</li>
                  <li>乙、付款期限：<span id="lcTypeDate">見票即付。</span></li>
                  <li>丙、金額：須與相關發票上所列開金額一致，或照本信用狀其他指示。</li>
                </ol>

                <p class="font-weight-bold mb-1">二、應檢附之單據如下：</p>

                <ol class="hnb__list--ol ms-10">
                  <li><v-icon icon="mdi mdi-square" size="small" /> 匯票付款申請書乙份。</li>
                  <li><v-icon icon="mdi mdi-square-outline" size="small" /> 匯票承兌申請書乙份。</li>
                  <li><v-icon icon="mdi mdi-square" size="small" /> 統一發票。</li>
                </ol>

                <p class="ms-3 font-weight-bold">上項單據應載明申請人向受益人購買下列貨物：</p>
                <p class="ms-3">鋼品一批</p>
              </td>
            </tr>

            <!-- 第 6 列：特別指示 -->
            <tr>
              <td colspan="3">
                <p class="font-weight-bold mb-1">三、特別指示：</p>
                <p>1.電子押匯特別指示條款</p>

                <ol class="hnb__list--ol">
                  <li>(1) 賣方所提供鋼品之一部或全部，可能產自中國鋼鐵股份有限公司或中龍鋼鐵股份有限公司(下稱中隆公司)，視實際出貨狀況而定，如產自中龍公司，賣方就其鋼品品質，負賣方責任，至如約定價格、各交易條件及優惠措施均不受影響。</li>
                  <li>(2) 匯票及匯票付款申請書使用中鋼格式，由受益人單獨簽章或使用數位憑證有效。</li>
                  <li>(3) 貨物可以分批交貨。</li>
                  <li>(4) 貨物明細以發票為準。</li>
                  <li>(5) 發票金額大於匯票金額及發票內容備註「受託代銷」字樣可以接受。</li>
                  <li>(6) 本信用狀適用eUCP2.0版。</li>
                  <li>(7) 允許受益人以匯票、匯票付款申請書及發票電子檔方式押匯，另「受益人完整提示通知」得附加於匯票付款申請書之最後。</li>
                  <li>(8) 押匯電子文件透過網址: HTTPS://CDSLC.UXCDS.COM/CDSL/提示</li>
                </ol>

                <p class="mb-1">
                  2.最後交貨日期：民國  年  月  日。（未填者自開狀日起三個月視為最後交貨日）
                </p>

                <p class="mb-1">
                  3.遠期信用狀利息：
                  <v-icon icon="mdi mdi-square" size="small" /> 買方負擔
                  <v-icon icon="mdi mdi-square-outline" size="small" /> 賣方負擔
                  （未填者視為由買方負擔）
                </p>
              </td>
            </tr>

            <!-- 第 7 列：保證文字 / 通知銀行記載 -->
            <tr>
              <td rowspan="2">
                <p class="mb-2">
                  上述匯票須載明本信用狀之日期及編號並限於有效期限內向本行辦理提示請求承兌/付款。上述單證經審查結果核與本信用狀規定條款相符時，本行保證上開依規定簽發、提示之匯票必能如約獲得承兌/付款。
                </p>

                <div>
                  <span class="hnb__bankName me-5">華南商業銀行</span>
                  <span class="text-subtitle-1 font-weight-bold">啟</span>
                </div>
              </td>

              <td colspan="2">
                通知銀行記載
              </td>
            </tr>

            <!-- 第 8 列：通知銀行簽章 -->
            <tr>
              <td class="hnb__table--left-border" colspan="2">
                通知銀行之簽章及通知日期
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
                size="small"
                @click="downloadFile"
              >
                下載電子檔
              </v-btn>

              <v-btn
                class="ma-1 hnb__btn--orange"
                prepend-icon="mdi-printer"
                size="small"
                @click="printDoc"
              >
                列印
              </v-btn>
            </v-col>

            <v-col class="text-center my-2" cols="12">
              <span
                class="mx-3 text-decoration-underline text-primary cursor-pointer"
                @click="selectedVersion = 0"
              >
                版本 0
              </span>

              <span class="mx-1 text-grey">|</span>
              <span class="mx-3 font-weight-bold">版本 1 (目前版本)</span>
            </v-col>
          </v-row>

          <!-- 修改通知書號碼卡片 -->
          <v-row justify="center">
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
    lcDialog?: boolean
    lcNo?: string
  }
  const props = withDefaults(defineProps<Props>(), {
    lcDialog: false,
    lcNo: '',
  })

  const show = ref<boolean>(props.lcDialog)
  watch(
    () => props.lcDialog,
    newVal => {
      show.value = newVal
    },
  )
  watch(
    () => show.value,
    newVal => {
      emit('update:lcDialog', newVal)
    },
  )

  const emit = defineEmits<{
    'update:lcDialog': [boolean]
    'on-close': []
  }>()

  const amendmentNos = ref([
    'LC123400215_V01',
    'LC123400215_V02',
  ])

  const selectedVersion = ref(1)

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
</script>
