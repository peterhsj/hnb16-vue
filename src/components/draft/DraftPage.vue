<template>
  <div>
    <v-card class="hnb__card--bordered bg-white pa-0" rounded="0" variant="outlined">
      <v-row class="align-center" no-gutters>
        <v-col class="pa-2 d-flex flex-column justify-center text-h5 hnb__bankName" cols="auto">
          <span class="pb-5">
            匯
          </span>

          <span class="pt-5">
            票
          </span>
        </v-col>

        <v-col class="hnb__cell--lb hnb__cell--rb py-2">
          <div class="px-4 pb-2 hnb__cell--ub">
            <p class="py-1 d-flex align-center justify-space-between">
              <span>E000000001 號</span>
              <span>銀行代號 0060888</span>
              <span class="bg-amber-lighten-5 px-5 py-2">17,306,932</span>
            </p>

            <p class="py-1">一、憑票請於中華民國 115年2月5日 支付 中鴻鋼鐵股份有限公司 或其指定人
            </p>

            <p class="py-2 text-subtitle-1">
              <span class="ms-7">新台幣</span>
              <span class="bg-amber-lighten-5 text-red-darken-3 px-5 py-2">壹仟柒佰參拾萬零陸仟玖佰參拾貳元整</span>
            </p>

            <p class="py-1">
              二、付款處所 華南商業銀行 長安分行
            </p>

            <p class="py-1">
              三、本匯票係依據 華南商業銀行 長安分行
            </p>

            <p class="ms-7">
              中華民國 114年12月22日 第 E1145160-S028-1055 號國內信用狀開立
            </p>

            <p class="py-1">四、本匯票免除作成拒絕證書</p>

            <p class="py-1 text-body-2 font-weight-bold d-flex align-end justify-space-between">
              <span>此致 華南商業銀行 長安分行</span>
              <span>驗付</span>

              <span>
                <v-img src="@/assets/images/buyer_test.jpg" width="120" />
              </span>
            </p>

            <p class="py-1 text-end">
              中華民國 115年2月5日 發票人：中鴻鋼鐵股份有限公司
            </p>
          </div>

          <div class="px-4 pt-2">
            <p class="py-1">茲經承兌准屆期照付</p>

            <p class="py-2 text-subtitle-1">
              <span class="ms-7">新台幣</span>
              <span class="bg-amber-lighten-5 text-red-darken-3 px-5 py-2">壹仟柒佰參拾萬零陸仟玖佰參拾貳元整</span>
            </p>

            <div class="d-flex">
              <p class="py-1 w-50">承兌日期 中華民國   年   月   日</p>
              <p class="py-1 w-50">承兌人住址</p>
            </div>
          </div>
        </v-col>

        <v-col class="pa-2 d-flex flex-column align-center" cols="auto">
          <div class="py-4 px-2">
            經副襄理
          </div>

          <div class="py-4 px-2">
            會 計
          </div>

          <div class="py-4 px-2">
            營 業
          </div>

          <div class="py-4 px-2">
            記 帳
          </div>

          <div class="py-4 px-2">
            核 章
          </div>
        </v-col>
      </v-row>
    </v-card>

    <p class="py-2 text-center">請由上至下順序在背書欄背書人處背書，並註明背書之年、月、日，如記載背書人時，應在背書人處書明。</p>

    <v-card class="hnb__card--bordered bg-white pa-0" rounded="0" variant="outlined">
      <v-row class="flex-column" no-gutters>
        <v-col class="hnb__cell--ub d-flex py-3 px-3">
          <v-row class="ifslc__draft--back-height" no-gutters>
            <v-col cols="2">
              票面金額請付
            </v-col>

            <v-col class="py-5 px-2 d-flex flex-column align-center" cols="auto">
              <span class="pt-3 text-no-wrap">
                背書人
              </span>

              <span class="pt-5 text-no-wrap">
                地　址
              </span>
            </v-col>

            <v-col>
              <div class="pb-1 text-no-wrap">或其指定人並免除作成拒絕證書</div>

              <div class="px-2 d-flex justify-end">
                <div>
                  <v-img
                    cover
                    src="@/assets/images/seller.jpg"
                    :width="130"
                  />
                </div>
              </div>
            </v-col>

            <v-col class="d-flex align-end justify-center" cols="4">
              中華民國　年　月　日
            </v-col>
          </v-row>
        </v-col>

        <v-col class="hnb__cell--ub d-flex py-3 px-3">
          <v-row class="ifslc__draft--back-height" no-gutters>
            <v-col cols="2">
              票面金額請付
            </v-col>

            <v-col class="py-5 px-2 d-flex flex-column align-center" cols="auto">
              <span class="pt-3 text-no-wrap">
                背書人
              </span>

              <span class="pt-5 text-no-wrap">
                地　址
              </span>
            </v-col>

            <v-col>
              <div class="pb-1 text-no-wrap">或其指定人並免除作成拒絕證書</div>

              <div class="px-2 d-flex justify-end">
                <!-- <div>
                  <v-img
                    cover
                    src="@/assets/images/seller.jpg"
                    :width="130"
                  />
                </div> -->
              </div>
            </v-col>

            <v-col class="d-flex align-end justify-center" cols="4">
              中華民國　年　月　日
            </v-col>
          </v-row>
        </v-col>

        <v-col class="hnb__cell--ub d-flex py-3 px-3">
          <v-row class="ifslc__draft--back-height" no-gutters>
            <v-col cols="2">
              票面金額請付
            </v-col>

            <v-col class="py-5 px-2 d-flex flex-column align-center" cols="auto">
              <span class="pt-3 text-no-wrap">
                背書人
              </span>

              <span class="pt-5 text-no-wrap">
                地　址
              </span>
            </v-col>

            <v-col>
              <div class="pb-1 text-no-wrap">或其指定人並免除作成拒絕證書</div>

              <div class="px-2 d-flex justify-end">
                <!-- <div>
                  <v-img
                    cover
                    src="@/assets/images/seller.jpg"
                    :width="130"
                  />
                </div> -->
              </div>
            </v-col>

            <v-col class="d-flex align-end justify-center" cols="4">
              中華民國　年　月　日
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-card>

    <div class="my-4 text-center">
      <v-btn
        class="hnb__btn--default mx-1"
        prepend-icon="mdi-download"
        @click="handleDownload"
      >
        下載電子檔
      </v-btn>

      <v-btn
        class="hnb__btn--orange mx-1"
        prepend-icon="mdi-printer"
        @click="handlePrint"
      >
        列印
      </v-btn>
    </div>
  </div>
</template>
<script lang="ts" setup>
  function handleDownload (): void {
    console.log('handleDownload')
  }

  function handlePrint (): void {
    window.print()
  }
</script>
