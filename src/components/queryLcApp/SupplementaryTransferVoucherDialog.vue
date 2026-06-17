<template>
  <v-dialog
    v-model="show"
    persistent
    width="800"
  >
    <v-card
      class="hnb__dialog"
    >
      <v-card-title class="d-flex px-4 font-weight-bold text-red-darken-3">
        <span>補收轉帳支出傳票</span>
        <v-spacer />

        <v-btn
          density="comfortable"
          icon="mdi-close"
          variant="flat"
          @click="onClose"
        />
      </v-card-title>

      <v-form ref="formRef">
        <v-card-text class="bg-grey-lighten-4">
          <v-card class="hnb__card--bordered" flat rounded="0">
            <v-container>
              <v-row class="mt-3" no-gutters>
                <v-col class="hnb__bankName font-weight-bold" cols="7">
                  華南商業銀行轉帳支出傳票
                </v-col>

                <v-col class="text-end" cols="5">
                  <span>傳票</span>
                  <span class="border-b px-1 mx-2">000001</span>
                  <span>號</span>
                </v-col>

                <v-col class="text-end" cols="12">
                  <span class="me-5">中華民國 114 年 05 月 25 日</span>
                  <span class="me-5">科目： 0000</span>
                  <span class="hnb__bankName text-subtitle-1 font-weight-bold">借方 轉</span>
                </v-col>
              </v-row>

              <v-table
                class="hnb__cell my-2 w-100"
                density="compact"
              >
                <tbody>
                  <tr>
                    <td class="hnb__cell--ub w-70">
                      子細目代號(帳號)：00000-00000
                    </td>

                    <td class="hnb__cell--border text-center w-30">
                      金額
                    </td>
                  </tr>

                  <tr>
                    <td class="hnb__cell--lb hnb__cell--ub">
                      子細目名稱(戶名)：過渡科目(510301)
                    </td>

                    <td class="hnb__cell--lb hnb__cell--ub hnb__cell--rb text-end">
                      TWD 1,000.00
                    </td>
                  </tr>

                  <tr>
                    <td class="hnb__cell--lu py-2">
                      摘要：<br />
                      國內信用狀號碼：09970004616000861
                    </td>

                    <td class="hnb__cell--lb hnb__cell--ub hnb__cell--rb text-center">
                      戳記
                    </td>
                  </tr>
                </tbody>
              </v-table>
            </v-container>
          </v-card>
          <!-- 下載 / 列印 / 版本選擇 -->
          <v-container class="" fluid>
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
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer />

          <v-btn
            class="hnb__btn--cancel mx-1 my-2"
            @click="onClose"
          >
            關閉
          </v-btn>

          <v-spacer />
        </v-card-actions>
      </v-form>

    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { VForm } from 'vuetify/components'

  const formRef = ref<InstanceType<typeof VForm>>()

  interface Props {
    isSupplementaryTransferVoucherDialog?: boolean
    lcNo?: string
  }
  const props = withDefaults(defineProps<Props>(), {
    isSupplementaryTransferVoucherDialog: false,
    lcNo: '',
  })

  const emits = defineEmits<{
    'update:isSupplementaryTransferVoucherDialog': [boolean]
    'on-close': []
  }>()

  const show = computed({
    get: () => props.isSupplementaryTransferVoucherDialog,
    set: (value: boolean) => {
      emits('update:isSupplementaryTransferVoucherDialog', value)
    },
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
</script>
