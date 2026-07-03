<template>
  <v-row class="my-4" justify="center" no-gutters>
    <v-col cols="12" md="6" sm="12">
      <div class="d-flex align-center ga-2 mb-2">
        <div class="text-no-wrap text-end w-25">未退還保證金：</div>
        <div>55000.0</div>
      </div>

      <div class="d-flex align-center ga-2 my-3">
        <div class="text-no-wrap text-end w-25">退還保證金：</div>
        <div>55000.0</div>
      </div>

      <div class="d-flex align-start ga-2 mb-2">
        <div class="text-no-wrap text-end w-25 mt-3">退還保證金方式：</div>

        <div class="w-75">
          <v-radio-group
            v-model="form.pricingBenchmark"
            color="cyan-darken-3"
            density="compact"
            hide-details="auto"
          >
            <div class="d-flex align-center text-body-2">
              <v-radio
                color="cyan-darken-3"
                density="compact"
                hide-details
                style="flex: none;"
                value="01"
              />

              <div class="d-flex align-center my-1 w-100">
                <span class="text-no-wrap mx-1">入帳帳號：</span>

                <v-text-field
                  v-model="form.accountNo"
                  bg-color="white"
                  color="teal-darken-2"
                  density="compact"
                  hide-details
                  variant="outlined"
                  @click.stop
                />

                <v-btn
                  class="ms-2 hnb__btn--default"
                  @click="checkAccountName"
                >
                  查詢帳號戶名
                </v-btn>
              </div>
            </div>

            <div class="d-flex align-start text-body-2">
              <v-radio
                class="mt-3"
                color="cyan-darken-3"
                density="compact"
                hide-details
                style="flex: none;"
                value="02"
              />

              <div class="d-flex align-start my-1 w-100">
                <span class="text-no-wrap mx-1 mt-3">轉入科目：</span>

                <div class="d-flex flex-column w-100">
                  <div class="d-flex align-center">
                    <div class="text-no-wrap text-end me-2">轉入會計科目：</div>

                    <v-select
                      v-model="form.transferAccount"
                      bg-color="white"
                      color="teal-darken-2"
                      density="compact"
                      hide-details="auto"
                      item-title="title"
                      item-value="value"
                      :items="[...TRANSFER_ACCOUNT_ITEMS]"
                      variant="outlined"
                    />
                  </div>

                  <div class="d-flex align-center">
                    <div class="text-no-wrap text-end me-2">轉入銷帳序號：</div>

                    <v-text-field
                      v-model="form.transferSerialNumber"
                      bg-color="white"
                      class="my-1"
                      color="teal-darken-2"
                      density="compact"
                      hide-details
                      variant="outlined"
                      @click.stop
                    />
                  </div>

                  <div class="d-flex align-center">
                    <div class="text-no-wrap text-end me-2">轉入科目金額：</div>

                    <v-text-field
                      v-model="form.transferAmount"
                      bg-color="white"
                      class="my-1"
                      color="teal-darken-2"
                      density="compact"
                      hide-details
                      variant="outlined"
                      @click.stop
                    />
                  </div>

                  <div class="d-flex align-center">
                    <div class="text-no-wrap text-end me-2">轉入科目摘要：</div>

                    <v-text-field
                      v-model="form.transferSummary"
                      bg-color="white"
                      class="my-1"
                      color="teal-darken-2"
                      density="compact"
                      hide-details
                      variant="outlined"
                      @click.stop
                    />
                  </div>
                </div>

              </div>
            </div>
          </v-radio-group>
        </div>
      </div>
    </v-col>
  </v-row>
</template>
<script setup lang="ts">
  const TRANSFER_ACCOUNT_ITEMS = [
    { title: '13097-099：其他應收款-雜項', value: 'ta1' },
    { title: '13097-100：其他應收款-雜項', value: 'ta2' },
    { title: '13097-101：其他應收款-雜項', value: 'ta3' },
    { title: '13097-102：其他應收款-雜項', value: 'ta4' },
  ]

  const form = ref({
    pricingBenchmark: '01',
    accountNo: '',
    transferAccount: '',
    transferSerialNumber: '',
    transferAmount: '',
    transferSummary: '',
  })

  // 查詢帳號戶名
  function checkAccountName (): void {
    console.log('查詢帳號戶名', form.value.accountNo)
  }
</script>
