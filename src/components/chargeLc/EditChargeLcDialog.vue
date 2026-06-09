<template>
  <v-dialog
    v-model="show"
    persistent
    width="600"
  >
    <v-card
      class="hnb__dialog"
    >
      <v-card-title class="d-flex px-4 font-weight-bold text-red-darken-3">
        <span>設定客戶資料</span>
        <v-spacer />

        <v-btn
          density="comfortable"
          icon="mdi-close"
          variant="flat"
          @click="onClose"
        />
      </v-card-title>

      <v-form ref="formRef" @submit.prevent="saveCustomerData">
        <v-card-text class="d-flex align-center bg-grey-lighten-4">
          <v-table class="hnb__table hnb__table--vertical w-100" density="compact">
            <tbody>
              <tr>
                <th class="hnb__tbhd2 text-end w-40">
                  匯票號碼
                </th>

                <td>
                  4B0609606
                </td>
              </tr>

              <tr>
                <th class="hnb__tbhd2 text-end">
                  受益人名稱
                </th>

                <td>
                  大華股份有限公司
                </td>
              </tr>

              <tr>
                <th class="hnb__tbhd2 text-end">
                  申請人名稱
                </th>

                <td>
                  鼎力金屬工業股份有限公司
                </td>
              </tr>

              <tr>
                <th class="hnb__tbhd2 text-end">
                  信用狀號碼
                </th>

                <td>
                  401039
                </td>
              </tr>

              <tr>
                <th class="hnb__tbhd2 text-end">
                  信用狀金額
                </th>

                <td class="text-end">
                  NT$ 22,125.00
                </td>
              </tr>

              <tr>
                <th class="hnb__tbhd2 text-end">
                  信用狀餘額
                </th>

                <td class="text-end">
                  NT$ 2,125.00
                </td>
              </tr>

              <tr>
                <th class="hnb__tbhd2 text-end">
                  信用狀有效期限
                </th>

                <td>
                  115/10/10
                </td>
              </tr>

              <tr>
                <th class="hnb__tbhd2 text-end">
                  補收開狀手續費
                </th>

                <td>
                  <v-text-field
                    v-model="form.additionalChargeAmount"
                    color="teal-darken-2"
                    density="compact"
                    hide-details
                    variant="outlined"
                  />
                </td>
              </tr>

              <tr>
                <th class="hnb__tbhd2 text-end">
                  補收開狀手續費付款方式
                </th>

                <td>
                  <v-select
                    v-model="form.additionalChargePaymentMethod"
                    clearable
                    color="teal-darken-2"
                    density="compact"
                    hide-details="auto"
                    item-title="title"
                    item-value="value"
                    :items="[...CHARGE_PAYMENT_METHOD_OPTIONS]"
                    placeholder="請選擇"
                    variant="outlined"
                  />
                </td>
              </tr>

              <tr>
                <th class="hnb__tbhd2 text-end">
                  是否扣印花稅
                </th>

                <td>
                  <v-checkbox
                    v-model="form.isStampTaxDeducted"
                    color="cyan-darken-3"
                    density="compact"
                    hide-details
                  >
                    <template #label>
                      <span class="text-body-2">扣印花稅</span>
                    </template>
                  </v-checkbox>
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-card-text>

        <v-card-actions>
          <v-spacer />

          <v-btn
            class="hnb__btn--cancel mx-1 my-2"
            @click="onClose"
          >
            取消
          </v-btn>

          <v-btn
            class="hnb__btn--default mx-1 my-2"
            @click="promptConfirm"
          >
            確定
          </v-btn>

          <v-spacer />
        </v-card-actions>
      </v-form>

    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
  import type { FormPayload } from '@/types/chargeLc'
  import { ref, watch } from 'vue'
  import { VForm } from 'vuetify/components'
  import { CHARGE_PAYMENT_METHOD_OPTIONS } from '@/types/chargeLc'

  const formRef = ref<InstanceType<typeof VForm>>()

  interface Props {
    isEditDialogOpen?: boolean
    lcNo?: string
  }
  const props = withDefaults(defineProps<Props>(), {
    isEditDialogOpen: false,
    lcNo: '',
  })

  const show = ref<boolean>(props.isEditDialogOpen)
  watch(
    () => props.isEditDialogOpen,
    newVal => {
      show.value = newVal
    },
  )
  watch(
    () => show.value,
    newVal => {
      emit('update:isEditDialogOpen', newVal)
    },
  )

  const emit = defineEmits<{
    'update:isEditDialogOpen': [boolean]
    'save-customer-data': []
    'on-close': []
  }>()

  const form = ref<FormPayload>({
    lcNo: '',
    additionalChargeAmount: null,
    additionalChargePaymentMethod: '',
    isStampTaxDeducted: false,
  })

  function onClose (): void {
    show.value = false
    emit('on-close')
  }

  function promptConfirm (): void {
    emit('save-customer-data')
    // show.value = false
  }

  function saveCustomerData (): void {
    if (formRef.value?.validate()) {
      // 在這裡處理表單提交邏輯
      console.log('表單資料:', form.value)
    }
  }
</script>
