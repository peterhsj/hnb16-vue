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
        <span>匯票資料</span>
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
              <v-table
                class="table-sm hnb__table hnb__table--vertical bg-white my-3"
                color="blue-darken-2"
                density="compact"
                striped="odd"
              >
                <tbody>
                  <tr>
                    <th class="text-center">
                      匯票號碼：
                    </th>

                    <td>
                      1264000001
                    </td>
                  </tr>

                  <tr>
                    <th class="text-center">
                      匯票金額：
                    </th>

                    <td class="text-end">
                      {{ thousandsFormatting(amount.toLocaleString()) }}
                    </td>
                  </tr>

                  <tr>
                    <th class="text-center">
                      押匯日期：
                    </th>

                    <td>
                      2025/11/10
                    </td>
                  </tr>

                  <tr>
                    <th class="text-center">
                      信用狀號碼：
                    </th>

                    <td>
                      112108006120090015
                    </td>
                  </tr>

                  <tr>
                    <th class="text-center">
                      受益人：
                    </th>

                    <td>
                      68387705 網際O業
                    </td>
                  </tr>

                  <tr>
                    <th class="text-center">
                      匯款匯費：
                    </th>

                    <td>
                      <v-text-field
                        v-model="fee"
                        color="teal-darken-2"
                        density="compact"
                        hide-details
                        variant="outlined"
                      />
                    </td>
                  </tr>
                </tbody>
              </v-table>
            </v-container>
          </v-card>
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
            :disabled="!fee"
            @click="onSave"
          >
            確定
          </v-btn>

          <v-spacer />
        </v-card-actions>
      </v-form>
    </v-card>

    <!-- Prompt Dialog -->
    <PromptDialog
      v-model:message-dialog="messageDialog"
      :dialog-width="messageWidth"
      :is-confirm-btn="isConfirmBtn"
      :message="message"
      :message-status="messageStatus"
      :message-title="messageTitle"
      @on-close="messageClose"
      @prompt-confirm="messageConfirm"
    />
  </v-dialog>
</template>
<script setup lang="ts">
  import { ref, watch } from 'vue'
  import { VForm } from 'vuetify/components'
  import { thousandsFormatting } from '@/utils/format'

  const formRef = ref<InstanceType<typeof VForm>>()
  const amount = ref<number>(1000)
  const fee = ref<number>(500)

  // Prompt Message Dialog
  const messageDialog = ref<boolean>(false)
  const messageTitle = ref<string>('')
  const message = ref<string>('')
  const messageStatus = ref<string>('')
  const messageWidth = ref<string>('auto')
  const isConfirmBtn = ref<boolean>(false)

  interface Props {
    isSentTrfStatusDialog?: boolean
    lcNo?: string
  }
  const props = withDefaults(defineProps<Props>(), {
    isSentTrfStatusDialog: false,
    lcNo: '',
  })

  const show = ref<boolean>(props.isSentTrfStatusDialog)
  watch(
    () => props.isSentTrfStatusDialog,
    newVal => {
      show.value = newVal
    },
  )
  watch(
    () => show.value,
    newVal => {
      emits('update:isSentTrfStatusDialog', newVal)
    },
  )

  const emits = defineEmits<{
    'update:isSentTrfStatusDialog': [boolean]
    'on-close': []
    'on-save': [number]
  }>()

  function onSave () {
    emits('on-save', fee.value)
    show.value = false
  }

  function onClose (): void {
    show.value = false
    emits('on-close')
  }

  // 離開 message
  function messageClose (): void {
    messageDialog.value = false
  }

  // 確認 message
  function messageConfirm (): void {
    messageDialog.value = false
  }
</script>
