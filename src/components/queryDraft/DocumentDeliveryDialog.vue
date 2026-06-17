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
        <span>單據遞送單</span>
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
              <v-row no-gutters>
                <v-col cols="12">
                  <p><span class="font-weight-bold">列印日期：</span>中華民國114年08月25日</p>
                  <p><span class="font-weight-bold">押匯日期：</span>中華民國114年05月25日</p>
                </v-col>
              </v-row>

              <v-table
                class="mt-2 hnb__table hnb__table--vertical w-100"
                density="compact"
              >
                <tbody>
                  <tr>
                    <th class="hnb__tbhd text-end w-25">
                      開狀行
                    </th>

                    <td>
                      華南銀行台北分行
                    </td>
                  </tr>

                  <tr>
                    <th class="hnb__tbhd text-end w-25">
                      開狀申請人
                    </th>

                    <td>
                      網際公司
                    </td>
                  </tr>

                  <tr>
                    <th class="hnb__tbhd text-end w-25">
                      信用狀受益人
                    </th>

                    <td>
                      甲乙公司
                    </td>
                  </tr>

                  <tr>
                    <th class="hnb__tbhd text-end w-25">
                      信用狀號碼
                    </th>

                    <td>
                      123456789
                    </td>
                  </tr>

                  <tr>
                    <th class="hnb__tbhd text-end w-25">
                      信用狀金額
                    </th>

                    <td>
                      新台幣 貳仟萬元整
                    </td>
                  </tr>

                  <tr>
                    <th class="hnb__tbhd text-end w-25">
                      匯票號碼
                    </th>

                    <td>
                      4B0609606
                    </td>
                  </tr>

                  <tr>
                    <th class="hnb__tbhd text-end w-25">
                      押匯/承兌金額
                    </th>

                    <td>
                      新台幣 壹仟萬元整
                    </td>
                  </tr>

                  <tr>
                    <th class="hnb__tbhd text-end w-25">
                      承兌手續費(賣方負擔)
                    </th>

                    <td>
                      新台幣 貳仟萬元整
                    </td>
                  </tr>

                  <tr>
                    <th class="hnb__tbhd text-end w-25">
                      檢附單據
                    </th>

                    <td>
                      <v-checkbox
                        v-model="form.draft"
                        color="cyan-darken-3"
                        density="compact"
                        hide-details
                      >
                        <template #label>
                          <span class="text-body-2">匯票</span>
                        </template>
                      </v-checkbox>

                      <v-checkbox
                        v-model="form.paymentApp"
                        color="cyan-darken-3"
                        density="compact"
                        hide-details
                      >
                        <template #label>
                          <span class="text-body-2">承兌/付款申請書</span>
                        </template>
                      </v-checkbox>

                      <v-checkbox
                        v-model="form.invoice"
                        color="cyan-darken-3"
                        density="compact"
                        hide-details
                      >
                        <template #label>
                          <div class="d-flex align-center text-body-2">
                            <span>統一發票計</span>

                            <v-text-field
                              v-model="form.invoiceCount"
                              class="mx-2"
                              color="teal-darken-2"
                              density="compact"
                              hide-details
                              style="flex: none; width: 50px;"
                              variant="outlined"
                              @click.stop
                            />

                            <span>張</span>
                          </div>
                        </template>
                      </v-checkbox>

                      <v-checkbox
                        v-model="form.invoiceCopy"
                        color="cyan-darken-3"
                        density="compact"
                        hide-details
                      >
                        <template #label>
                          <div class="d-flex align-center text-body-2">
                            <span>統一發票影本計</span>

                            <v-text-field
                              v-model="form.invoiceCopyCount"
                              class="mx-2"
                              color="teal-darken-2"
                              density="compact"
                              hide-details
                              style="flex: none; width: 50px;"
                              variant="outlined"
                              @click.stop
                            />

                            <span>張</span>
                          </div>
                        </template>
                      </v-checkbox>

                      <v-checkbox
                        v-model="form.eInvoice"
                        color="cyan-darken-3"
                        density="compact"
                        hide-details
                      >
                        <template #label>
                          <div class="d-flex align-center text-body-2">
                            <span>電子發票證明聯計</span>

                            <v-text-field
                              v-model="form.eInvoiceCount"
                              class="mx-2"
                              color="teal-darken-2"
                              density="compact"
                              hide-details
                              style="flex: none; width: 50px;"
                              variant="outlined"
                              @click.stop
                            />

                            <span>張</span>
                          </div>
                        </template>
                      </v-checkbox>

                      <v-checkbox
                        v-model="form.invoice1"
                        color="cyan-darken-3"
                        density="compact"
                        hide-details
                      >
                        <template #label>
                          <div class="d-flex align-center text-body-2">
                            <span>發票計</span>

                            <v-text-field
                              v-model="form.invoice1Count"
                              class="mx-2"
                              color="teal-darken-2"
                              density="compact"
                              hide-details
                              style="flex: none; width: 50px;"
                              variant="outlined"
                              @click.stop
                            />

                            <span>張</span>
                          </div>
                        </template>
                      </v-checkbox>

                      <div class="mt-2 d-flex align-center text-body-2">
                        <span class="font-weight-bold">其他：</span>

                        <v-text-field
                          v-model="form.otherDocs"
                          class="mx-2"
                          color="teal-darken-2"
                          density="compact"
                          hide-details
                          variant="outlined"
                          @click.stop
                        />
                      </div>

                    </td>
                  </tr>
                </tbody>
              </v-table>

              <v-row class="mt-3" no-gutters>
                <v-col class="text-end my-8" cols="12">
                  押匯行圓戳章
                </v-col>

                <v-col class="text-end" cols="12">
                  <span class="hnb__bankName text-h6">高雄分行</span>
                </v-col>
              </v-row>
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
  import type { DataTableHeader } from 'vuetify'
  import { computed, ref } from 'vue'
  import { VForm } from 'vuetify/components'
  import { thousandsFormatting } from '@/utils/format'

  const formRef = ref<InstanceType<typeof VForm>>()

  const isLoading = ref<boolean>(false)
  const tableItems = ref<any[]>([
    { lcNo: 'LC20240225001', lcAmount: 1_000_000, fee: 500 },
  ])

  interface Props {
    isDocumentDeliveryDialog?: boolean
    lcNo?: string
  }
  const props = withDefaults(defineProps<Props>(), {
    isDocumentDeliveryDialog: false,
    lcNo: '',
  })

  const emits = defineEmits<{
    'update:isDocumentDeliveryDialog': [boolean]
    'on-close': []
  }>()

  const show = computed({
    get: () => props.isDocumentDeliveryDialog,
    set: (value: boolean) => {
      emits('update:isDocumentDeliveryDialog', value)
    },
  })

  const form = ref({
    draft: '',
    paymentApp: 0,
    invoice: 0,
    invoiceCount: 0,
    invoiceCopy: 0,
    invoiceCopyCount: 0,
    eInvoice: 0,
    eInvoiceCount: 0,
    invoice1: 0,
    invoice1Count: 0,
    otherDocs: '',
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
