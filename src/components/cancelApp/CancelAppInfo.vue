<template>
  <div>
    <!-- 銀行抬頭 -->
    <v-container fluid>
      <v-row align="center" no-gutters>
        <v-col class="hnb__bankName text-center" cols="12">
          華南商業銀行
        </v-col>

        <v-col class="py-1 text-center" cols="12">
          <span class="hnb__bankName">
            信用狀註銷申請書 / 認證單
          </span>
        </v-col>

        <v-col class="py-1 text-center" cols="12">
          中華民國 114 年 5 月 10 日
        </v-col>
      </v-row>
    </v-container>

    <v-table class="table-sm hnb__table bg-white" density="compact">
      <tbody>
        <tr>
          <td>
            <p class="ma-4">茲請　貴行註銷下列信用狀，其未用餘額，受益人已不再利用，嗣後倘因該信用狀之受益人仍有出貨及押匯等情事，以致發生任何糾紛並使 貴行遭受損失時，一經 貴行通知，本公司當即依照前所提及之開發國內不可撤銷信用狀申請書及其他相關約定事項，負責清償，絕不拖延。</p>
            <p class="text-end me-4">單位：新台幣元</p>
            <!-- ================================================================
                表格
            ================================================================ -->
            <v-table class="table-sm hnb__table bg-white ma-4" color="blue-darken-2" density="compact">
              <thead>
                <tr>
                  <th class="text-center">信用狀號碼</th>
                  <th>申請人</th>
                  <th>受益人</th>
                  <th class="text-end">信用狀金額</th>
                  <th class="text-end">未押匯金額</th>
                  <th class="text-center">信用狀到期日</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td class="text-center">008LLCt2</td>
                  <td>林大華</td>
                  <td>網際測試股份有限公司</td>
                  <td class="text-end">NT$ 500,000</td>
                  <td class="text-end">NT$ 200,000</td>
                  <td class="text-center">民國 114 年 05 月 26 日</td>
                </tr>
              </tbody>
            </v-table>

            <div class="d-flex my-5 mx-4">
              <div v-if="props.isShowEdit">
                <p>(一)若註銷「未過期」信用狀，<span class="text-red-darken-3">請務必確認已取得受益人同意書</span>，若未取得逕予註銷，恐遭受益人訴諸法律求償。</p>
                <p>(二)若<span class="text-red-darken-3">「電子信用狀」</span>內容有誤 ( 受益人為<span class="text-red-darken-3">中鋼</span>集團、<span class="text-red-darken-3">台塑</span>集團、<span class="text-red-darken-3">華新麗華</span>、<span class="text-red-darken-3">奇美</span>集團、<span class="text-red-darken-3">東和鋼鐵</span>等 )，請以修狀方式修正，切勿隨意以先註銷再重新開狀之方式辦理。</p>
                <p>(三)若註銷「電子信用狀」後，<span class="text-red-darken-3">無法執行當日更正交易</span>。</p>
              </div>

              <v-spacer />

              <div v-if="infoData.beneType === 'cds'" class="d-inline-flex">
                <span class="px-3 text-center">
                  <v-img src="../../assets/images/cds_01.gif" width="90" />
                  <div class="py-1">MIAGCSqGSI</div>
                </span>
              </div>

              <div v-if="infoData.beneType === 'other'" class="d-inline-flex">
                <span class="px-3 text-center">
                  <v-img src="../../assets/images/cds_03.gif" width="90" />
                  <div class="py-1">MIAGCSqGSI</div>
                </span>
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </v-table>

    <div v-if="props.isShowDeposit" class="d-flex mt-6">
      <!-- 保證金卡片 -->
      <v-row justify="center">
        <v-col cols="12" md="5" sm="12">
          <v-card class="mx-auto border-sm bg-white" elevation="2" variant="outlined">
            <v-card-text>
              <div class="my-2">
                <span class="font-weight-bold">未退還保證金：</span> 55000.0
              </div>

              <div class="my-2">
                <span class="font-weight-bold">退還保證金：</span> 55000.0
              </div>

              <div class="d-flex my-2">
                <span class="font-weight-bold text-no-wrap">退還保證金方式：</span>

                <div>
                  <div class="d-flex">
                    <span class="font-weight-bold">轉入會計科目：</span>
                    13097-099：其他應收款-雜項
                  </div>

                  <div class="d-flex my-2">
                    <span class="font-weight-bold">轉入銷帳序號：</span>
                    --
                  </div>

                  <div class="d-flex my-2">
                    <span class="font-weight-bold">轉入科目金額：</span>
                    55000.0
                  </div>

                  <div class="d-flex my-2">
                    <span class="font-weight-bold">轉入科目摘要：</span>
                    信用狀保證金 網優
                  </div>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { CancelAppData } from '@/types/cancelApp'
  import { reactive, watch } from 'vue'

  interface Props {
    isShowDeposit?: boolean
    isShowEdit?: boolean
    data?: CancelAppData
  }
  const props = withDefaults(defineProps<Props>(), {
    data: () => ({
      appNo: '',
      beneType: 'cds',
      lcAmount: 0,
      fee: 0,
    }),
    isShowDeposit: false,
    isShowEdit: false,
  })

  // 共用表單物件
  const infoData = reactive<CancelAppData>(props.data)

  // ── 監聽 data 以初始化 / 重設表單 ─────────────────────────────────────
  watch(
    () => props.data,
    newData => {
      if (newData.appNo) {
        Object.assign(infoData, { ...newData })
      }
    },
    { immediate: true },
  )
</script>
