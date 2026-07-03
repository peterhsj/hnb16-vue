<template>
  <v-row no-gutters>
    <v-col cols="12">
      <div class="my-2">
        <span class="font-weight-bold">未退還保證金：</span> 55000.0
      </div>

      <div class="my-2">
        <span class="font-weight-bold">退還保證金：</span> 55000.0
      </div>

      <div class="d-flex my-2">
        <div class="font-weight-bold text-no-wrap">退還保證金方式：</div>

        <div>
          <div>
            <v-icon :icon="data.pricingBenchmark === '01' ? 'mdi mdi-circle' : 'mdi mdi-circle-outline'" size="small" />
            入帳帳號：
          </div>

          <div class="d-flex my-2">
            <div>
              <v-icon :icon="data.pricingBenchmark === '02' ? 'mdi mdi-circle' : 'mdi mdi-circle-outline'" size="small" />
              轉入科目：
            </div>

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
        </div>
      </div>
    </v-col>
  </v-row>
</template>
<script setup lang="ts">
  const data = {
    pricingBenchmark: '01', // 01=入帳帳號, 02=轉入科目
  }
</script>
