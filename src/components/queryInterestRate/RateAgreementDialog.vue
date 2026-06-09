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
        <span>國內信用狀利率約定書</span>
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
          <v-table
            class="hnb__table hnb__table--vertical w-100"
            density="compact"
            striped="odd"
          >
            <tbody>
              <tr>
                <td>
                  <div class="hnb__line--indent">
                    1. 國內信用狀利率約定書，其中依本信用狀所墊付之本次押匯金額 1,000,000 元， 本公司申請借款 新台幣 壹仟萬元整，並同意按下列定價之指標其中之一，按月計付利息。
                  </div>
                </td>
              </tr>

              <tr>
                <td>
                  2.改貸之利率約定：
                  <div class="hnb__line--indent my-2">
                    <v-icon :icon="rateType === '01' ? 'mdi mdi-circle' : 'mdi mdi-circle-outline'" size="small" />
                    按貴行之基準利率加碼年率 - % 計息，嗣後貴行基準利率每 3 個月 調整時隨同調整，加碼幅度不變。
                  </div>

                  <div class="hnb__line--indent my-2">
                    <v-icon :icon="rateType === '02' ? 'mdi mdi-circle' : 'mdi mdi-circle-outline'" size="small" />
                    固定利率，按年率 - % 計息。
                  </div>

                  <div class="hnb__line--indent my-2">
                    <v-icon :icon="rateType === '03' ? 'mdi mdi-circle' : 'mdi mdi-circle-outline'" size="small" />
                    按貴行之 初級市場利率 100 天期 均價利率 加碼 - % 計息，嗣後以貸放日後每滿 3 個月 之相對日為利率變動調整日，自調整日起隨同調整，加減碼幅度不變。
                  </div>

                  <div class="hnb__line--indent my-2">
                    <v-icon :icon="rateType === '04' ? 'mdi mdi-circle' : 'mdi mdi-circle-outline'" size="small" />
                    其他：無
                  </div>
                </td>
              </tr>

              <tr>
                <td>
                  3.信用狀主要內容：
                  <v-table class="mt-2 hnb__table hnb__table--vertical w-100" density="compact">
                    <tbody>
                      <tr>
                        <th class="hnb__tbhd2 text-end w-30">
                          開狀行
                        </th>

                        <td>
                          華南銀行南門分行
                        </td>
                      </tr>

                      <tr>
                        <th class="hnb__tbhd2 text-end">
                          開狀日期
                        </th>

                        <td>
                          民國 114 年 07 月 01 日
                        </td>
                      </tr>

                      <tr>
                        <th class="hnb__tbhd2 text-end">
                          開狀申請人
                        </th>

                        <td>
                          鼎力金屬工業股份有限公司
                        </td>
                      </tr>

                      <tr>
                        <th class="hnb__tbhd2 text-end">
                          信用狀受益人
                        </th>

                        <td>
                          乙股份有限公司
                        </td>
                      </tr>

                      <tr>
                        <th class="hnb__tbhd2 text-end">
                          信用狀號碼
                        </th>

                        <td>
                          132654
                        </td>
                      </tr>

                      <tr>
                        <th class="hnb__tbhd2 text-end">
                          信用狀金額
                        </th>

                        <td>
                          新台幣 壹仟萬元整
                        </td>
                      </tr>

                      <tr>
                        <th class="hnb__tbhd2 text-end">
                          本次押匯日期
                        </th>

                        <td>
                          民國 114 年 07 月 01 日
                        </td>
                      </tr>

                      <tr>
                        <th class="hnb__tbhd2 text-end">
                          本次押匯金額
                        </th>

                        <td>
                          新台幣 壹仟萬元整
                        </td>
                      </tr>

                      <tr>
                        <th class="hnb__tbhd2 text-end">
                          利率改貸確認日期
                        </th>

                        <td>
                          N/A
                        </td>
                      </tr>
                    </tbody>
                  </v-table>
                </td>
              </tr>
            </tbody>
          </v-table>
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

          <!-- <v-btn
            class="hnb__btn--default mx-1 my-2"
            @click="promptConfirm"
          >
            確定
          </v-btn> -->

          <v-spacer />
        </v-card-actions>
      </v-form>

    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
  import { ref, watch } from 'vue'
  import { VForm } from 'vuetify/components'

  const formRef = ref<InstanceType<typeof VForm>>()

  interface Props {
    rateAgreementDialog?: boolean
    lcNo?: string
  }
  const props = withDefaults(defineProps<Props>(), {
    rateAgreementDialog: false,
    lcNo: '',
  })

  const show = ref<boolean>(props.rateAgreementDialog)
  watch(
    () => props.rateAgreementDialog,
    newVal => {
      show.value = newVal
    },
  )
  watch(
    () => show.value,
    newVal => {
      emit('update:rateAgreementDialog', newVal)
    },
  )

  const rateType = ref<string>('01')

  const emit = defineEmits<{
    'update:rateAgreementDialog': [boolean]
    'on-close': []
  }>()

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
