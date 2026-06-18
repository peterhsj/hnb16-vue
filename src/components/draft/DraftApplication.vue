<template>
  <div>
    <v-card class="hnb__card--bordered bg-white pa-0 pa-4" rounded="0" variant="outlined">
      <p class="py-2 text-h5 text-center">匯票 承兌 付款 申請書</p>
      <p class="text-right">中華民國 115 年 2 月 5 日</p>

      <v-card class="hnb__card--bordered bg-white pa-0" rounded="0">
        <v-row no-gutters>
          <v-col class="py-1 px-3 text-right" cols="2">
            信用狀號碼：
          </v-col>

          <v-col class="py-1 text-blue-darken-2" cols="4">
            E1145160-S028-1055
          </v-col>

          <v-col class="py-1 px-3 text-right" cols="2">
            通知行編號：
          </v-col>

          <v-col class="py-1 text-blue-darken-2" cols="4">
            0060888
          </v-col>

          <v-col class="py-1 px-3 text-right" cols="2">
            信用狀額度：
          </v-col>

          <v-col class="py-1 text-blue-darken-2" cols="4">
            NT$ 17,430,000
          </v-col>

          <v-col class="py-1 px-3 text-right" cols="2">
            有效期限：
          </v-col>

          <v-col class="py-1 text-blue-darken-2" cols="4">
            民國 115 年 2 月 23 日
          </v-col>

          <v-col class="py-1 px-3 text-right" cols="2">
            申請人：
          </v-col>

          <v-col class="py-1 text-blue-darken-2" cols="10">
            泰昌鋼鐵工廠股份有限公司
          </v-col>

          <v-col class="py-1 px-3 text-right" cols="2">
            地　址：
          </v-col>

          <v-col class="py-1 text-blue-darken-2" cols="10">
            臺中市大肚區新興里新興街48號
          </v-col>

          <v-col class="py-1 px-3 text-right" cols="2">
            受益人：
          </v-col>

          <v-col class="py-1 text-blue-darken-2" cols="3">
            東和鋼鐵企業股份有限公司
          </v-col>

          <v-col class="py-1 px-3 text-right" cols="auto">
            地　址：
          </v-col>

          <v-col class="py-1 text-blue-darken-2" cols="5">
            台北市中山區104長安東路一段9號6樓
          </v-col>

        </v-row>
      </v-card>

      <v-card class="hnb__cell--lb hnb__cell--rb" rounded="0">
        <v-row class="align-center" no-gutters>
          <v-col class="pa-2" cols="auto">
            <span class="text-h5">
              匯<br>票
            </span>
          </v-col>

          <v-col class="hnb__cell--lb pa-2">
            <p class="py-1">
              <span>金　額：</span>
              <span class="text-blue-darken-2">新台幣 壹仟柒佰參拾萬零陸仟玖佰參拾貳元整</span>
            </p>

            <p class="py-1">
              <span>付款人：</span>
              <span class="text-blue-darken-2">合作金庫商業銀行長安分行</span>
            </p>

            <p class="py-1">
              <span>到期日：</span>
              <span class="text-blue-darken-2">中華民國 115 年 2 月 5 日</span>
            </p>
          </v-col>

        </v-row>
      </v-card>

      <v-card rounded="0">
        <v-data-table
          class="hnb__table"
          color="grey-lighten-4"
          density="compact"
          :headers="[
            { title: '貨品名稱', value: 'type'},
            { title: '數量 (KG)', value: 'number', align: 'end' },
            { title: '總價', value: 'amount', align: 'end' },
          ]"
          hide-default-footer
          :items="[
            {
              type: '鋼筋一批',
              number: '999,770',
              amount: '17,306,932',
            },
          ]"
        />
      </v-card>

      <div>
        <p class="py-3">
          上開貨品業於民國 114 年 12 月 29 日 交貨，茲由信用狀受益人簽發匯票乙紙，檢附統一發票 4 紙，請 惠予付款，信用狀 及 受益人並聲明上項交易如有不實，致 貴行遭受損失時，願負損害賠償之責任。
        </p>

        <div class="px-2 d-flex justify-end">
          <div>
            <v-img
              cover
              src="@/assets/images/seller.jpg"
              :width="130"
            />
          </div>
        </div>

        <p class="py-1 text-body-2 font-weight-bold">
          此致 華南商業銀行 長安分行
        </p>

        <p class="py-2 text-end">
          <span class="font-weight-bold">信用狀受益人：</span>
          <span>中鴻鋼鐵股份有限公司</span>
        </p>
      </div>
    </v-card>

    <p class="py-4 text-center font-weight-bold">受益人完整提示</p>

    <p>
      受益人僅此通知，本匯票付款申請書內所述信用狀（ 信用狀號碼：
      <span class="text-blue-darken-2">E1145160-S028-1055</span>
      ）項下所有文件，業於本日完整提示，敬請審核。
    </p>

    <div class="px-2 d-flex justify-end">
      <div>
        <v-img
          cover
          src="@/assets/images/seller.jpg"
          :width="130"
        />
      </div>
    </div>

    <p class="py-1 text-body-2 font-weight-bold">
      此致 華南商業銀行 長安分行
    </p>

    <p class="py-2 text-end">
      <span class="font-weight-bold">信用狀受益人：</span>
      <span>中鴻鋼鐵股份有限公司</span>
    </p>

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
