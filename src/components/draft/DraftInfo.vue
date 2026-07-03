<template>
  <div>
    <v-table v-if="isShowTable" class="table-sm hnb__table-v bg-white" density="compact">
      <tbody>
        <tr>
          <th class="text-end text-no-wrap" scope="row" style="width: 150px;">
            信用狀號碼：
          </th>

          <td class="lc-td">
            099700024161000861
          </td>

          <th class="text-end text-no-wrap" scope="row" style="width: 150px;">
            受益人名稱：
          </th>

          <td class="lc-td">
            網際公司
          </td>
        </tr>

        <tr>
          <th class="text-end text-no-wrap" scope="row" style="width: 150px;">
            押匯/承兌金額：
          </th>

          <td class="lc-td text-end">
            NT$ 50,000,000
          </td>

          <th class="text-end text-no-wrap" scope="row" style="width: 150px;">
            押匯/承兌日期：
          </th>

          <td class="lc-td">
            2025/11/10
          </td>
        </tr>

        <tr>
          <th class="text-end text-no-wrap" scope="row" style="width: 150px;">
            匯票到期日：
          </th>

          <td class="lc-td">
            2025/11/10
          </td>

          <th class="text-end text-no-wrap" scope="row" style="width: 150px;">
            匯票發票日：
          </th>

          <td class="lc-td" colspan="3">
            2025/04/05
          </td>
        </tr>
      </tbody>
    </v-table>

    <div v-if="props.isShowDeposit" class="my-6">
      <!-- 押匯方式：卡片 -->
      <!-- <v-row justify="center">
        <v-col cols="12" md="6"> -->
      <v-card class="mx-auto border-md bg-white" style="max-width: 800px;" variant="outlined">
        <v-card-text class="px-7">
          <h6 class="hnb16__title text-h6">押匯方式：</h6>

          <div class="my-2">
            <v-icon :icon="draftData.draftType === '01' ? 'mdi mdi-circle' : 'mdi mdi-circle-outline'" size="small" />
            押匯
          </div>

          <div class="my-2 ms-5">
            <div class="font-weight-bold">撥款方式：</div>

            <div class="my-2">
              <v-icon :icon="draftData.billType === '01' ? 'mdi mdi-circle' : 'mdi mdi-circle-outline'" size="small" />
              本行-轉入帳號：---
            </div>

            <div class="my-2">
              <v-icon :icon="draftData.billType === '02' ? 'mdi mdi-circle' : 'mdi mdi-circle-outline'" size="small" />
              跨行-付款內容詳受益人匯出匯款申請書
            </div>

            <div class="my-2 d-flex">
              <v-icon :icon="draftData.billType === '03' ? 'mdi mdi-circle' : 'mdi mdi-circle-outline'" size="small" />

              <div class="ms-1 d-flex ">
                <span class="font-weight-bold">轉入科目：</span>

                <div>
                  <span>轉入會計科目：13097-099：其他應收款-雜項</span>

                  <div class="my-2">
                    轉入銷帳序號：---
                  </div>

                  <div class="my-2">
                    轉入科目金額：---
                  </div>

                  <div class="my-2">
                    轉入科目摘要：---
                  </div>
                </div>

              </div>
            </div>

            <div class="my-2">
              <span class="font-weight-bold">押匯手續費：</span>300.0<span class="ms-6 font-weight-bold">是否扣印花稅：</span> 是
            </div>

            <div class="my-2">
              <span class="font-weight-bold">押匯放款核號：</span>1141161000

              <span>
                <v-btn class="hnb__btn--default ms-5" size="small" variant="flat" @click="handleCheckData">
                  檢查押匯核號
                </v-btn>
              </span>
            </div>

            <div class="my-2">
              <span class="font-weight-bold">貸放經理人 ID：</span>G101057626
            </div>

            <div class="my-2">
              <span class="font-weight-bold">徵審主管 ID-A： </span>G101057626
            </div>

            <div class="my-2">
              <span class="font-weight-bold">徵審主管 ID-B： </span>---
            </div>

            <div class="my-2 d-flex">
              <span class="font-weight-bold text-no-wrap">風險條件：</span>

              <v-row no-gutters>
                <v-col class="d-flex" cols="12" md="6">
                  <span class="text-no-wrap">風險類別一：</span>
                  <span>B1 應收信用狀款-存款或存單</span>
                </v-col>

                <v-col class="d-flex" cols="12" md="6">
                  <span class="text-no-wrap">風險類別一百分比 %：</span>
                  <span>100</span>
                </v-col>

                <v-col class="d-flex" cols="12" md="6">
                  <span class="text-no-wrap">風險類別二：</span>
                  <span>---</span>
                </v-col>

                <v-col class="d-flex" cols="12" md="6">
                  <span class="text-no-wrap">風險類別二百分比 %：</span>
                  <span>---</span>
                </v-col>

                <v-col class="d-flex" cols="12" md="6">
                  <span class="text-no-wrap">風險類別三：</span>
                  <span>---</span>
                </v-col>

                <v-col class="d-flex" cols="12" md="6">
                  <span class="text-no-wrap">風險類別三百分比 %：</span>
                  <span>---</span>
                </v-col>

                <v-col class="d-flex" cols="12" md="6">
                  <span class="text-no-wrap">風險類別四：</span>
                  <span>---</span>
                </v-col>

                <v-col class="d-flex" cols="12" md="6">
                  <span class="text-no-wrap">風險類別四百分比 %：</span>
                  <span>---</span>
                </v-col>
              </v-row>
            </div>
          </div>

          <v-divider class="my-4" variant="dashed" />

          <div class="hnb__line--indent ma-1">
            <v-icon :icon="draftData.draftType === '02' ? 'mdi mdi-circle' : 'mdi mdi-circle-outline'" size="small" />
            承兌
          </div>

          <div class="my-2 ms-5">
            <div class="my-2">
              <span class="font-weight-bold">承兌手續費：</span>300.0<span class="ms-6 font-weight-bold">是否扣印花稅：</span> 是
            </div>

            <div class="my-2">
              <span class="font-weight-bold">承兌放款核號：</span>1141161000
            </div>

            <div class="my-2">
              <span class="font-weight-bold">貸放經理人 ID：</span>G101057626
            </div>

            <div class="my-2">
              <span class="font-weight-bold">徵審主管 ID-A： </span>G101057626
            </div>

            <div class="my-2">
              <span class="font-weight-bold">徵審主管 ID-B： </span>---
            </div>

            <div class="my-2">
              <span class="font-weight-bold">押匯手續費：</span>300.0<span class="ms-6 font-weight-bold">是否扣印花稅：</span> 是
            </div>

            <div class="my-2 d-flex">
              <span class="font-weight-bold text-no-wrap">風險條件：</span>

              <v-row no-gutters>
                <v-col class="d-flex" cols="12" md="6">
                  <span class="text-no-wrap">風險類別一：</span>
                  <span>B1 應收信用狀款-存款或存單</span>
                </v-col>

                <v-col class="d-flex" cols="12" md="6">
                  <span class="text-no-wrap">風險類別一百分比 %：</span>
                  <span>100</span>
                </v-col>

                <v-col class="d-flex" cols="12" md="6">
                  <span class="text-no-wrap">風險類別二：</span>
                  <span>---</span>
                </v-col>

                <v-col class="d-flex" cols="12" md="6">
                  <span class="text-no-wrap">風險類別二百分比 %：</span>
                  <span>---</span>
                </v-col>

                <v-col class="d-flex" cols="12" md="6">
                  <span class="text-no-wrap">風險類別三：</span>
                  <span>---</span>
                </v-col>

                <v-col class="d-flex" cols="12" md="6">
                  <span class="text-no-wrap">風險類別三百分比 %：</span>
                  <span>---</span>
                </v-col>

                <v-col class="d-flex" cols="12" md="6">
                  <span class="text-no-wrap">風險類別四：</span>
                  <span>---</span>
                </v-col>

                <v-col class="d-flex" cols="12" md="6">
                  <span class="text-no-wrap">風險類別四百分比 %：</span>
                  <span>---</span>
                </v-col>
              </v-row>
            </div>
          </div>

          <v-divider
            class="my-4"
            color="teal-darken-2"
            :thickness="2"
          />

          <h6 class="hnb16__title text-h6">費用付款方式：</h6>

          <div class="hnb__line--indent ma-1">
            <v-icon :icon="draftData.paymentType === '01' ? 'mdi mdi-circle' : 'mdi mdi-circle-outline'" size="small" />
            現金
          </div>

          <div class="my-2">
            <v-icon :icon="draftData.paymentType === '02' ? 'mdi mdi-circle' : 'mdi mdi-circle-outline'" size="small" />
            <span>支存帳號：--</span>
            <span class="ms-6">支票號碼：--</span>
          </div>

          <div class="my-2">
            <v-icon :icon="draftData.paymentType === '03' ? 'mdi mdi-circle' : 'mdi mdi-circle-outline'" size="small" />
            活存帳號：--
          </div>

          <div class="my-2">
            <v-icon :icon="draftData.paymentType === '03' ? 'mdi mdi-circle' : 'mdi mdi-circle-outline'" size="small" />
            內扣
          </div>

          <div class="my-2 d-flex">
            <v-icon :icon="draftData.paymentType === '05' ? 'mdi mdi-circle' : 'mdi mdi-circle-outline'" size="small" />

            <div class="ms-1 d-flex ">
              <span class="font-weight-bold">轉出科目：</span>

              <div>
                <span>轉出會計科目：---</span>

                <div class="my-2">
                  轉出銷帳序號：---
                </div>

                <div class="my-2">
                  轉出科目金額：---
                </div>

                <div class="my-2">
                  轉出科目摘要：---
                </div>
              </div>

            </div>
          </div>

          <v-divider
            class="my-4"
            color="teal-darken-2"
            :thickness="2"
          />

          <h6 class="hnb16__title text-h6">押匯手續費優惠：</h6>

          <div class="hnb__line--indent ma-1">
            <v-icon :icon="draftData.feeDiscount ? 'mdi mdi-circle' : 'mdi mdi-circle-outline'" size="small" />
            押匯手續費優惠
          </div>

        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { reactive, watch } from 'vue'

  interface Props {
    data: any
    isShowDeposit?: boolean
    isShowTable?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    isShowDeposit: false,
    isShowTable: false,
  })

  const infoData = reactive({
    draftNo: '',
  })

  const draftData = ref({
    draftType: '01', // 押匯/承兌類型
    billType: '01', // 撥款方式
    paymentType: '01', // 費用付款方式
    feeDiscount: false, // 押匯手續費優惠
  })

  function handleCheckData (): void {
    alert('檢查押匯核號')
  }

  watch(
    () => props.data,
    newData => {
      if (newData.draftNo) {
        Object.assign(infoData, newData)
      }
    },
    { immediate: true },
  )
</script>
