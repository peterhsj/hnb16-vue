<template>
  <v-dialog
    v-model="show"
    persistent
    width="auto"
  >
    <v-card
      class="hnb__dialog"
    >
      <v-card-title class="d-flex px-4 font-weight-bold text-red-darken-3">
        <span>作業訊息</span>
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
              <v-data-table
                class="table-sm hnb__table bg-white my-3"
                color="blue-darken-2"
                density="compact"
                :headers="tableHeaders"
                hide-default-footer
                item-value="lcNo"
                :items="tableItems"
                :loading="isLoading"
                striped="odd"
              />
            </v-container>
          </v-card>
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
  import { ref, watch } from 'vue'
  import { VForm } from 'vuetify/components'
  const formRef = ref<InstanceType<typeof VForm>>()

  const isLoading = ref<boolean>(false)
  const tableItems = ref<any[]>([
    { lcNo: '099700017161000861-A-01', applicant: '網際測試股份有限公司A', beneficiary: '網際測試股份有限公司', reviewAction: '核准', executionResult: '審核完成' },
  ])

  interface Props {
    isReviewCancelApprove?: boolean
    cancelAppNo?: string
  }
  const props = withDefaults(defineProps<Props>(), {
    isReviewCancelApprove: false,
    cancelAppNo: '',
  })

  const show = ref<boolean>(props.isReviewCancelApprove)
  watch(
    () => props.isReviewCancelApprove,
    newVal => {
      show.value = newVal
    },
  )
  watch(
    () => show.value,
    newVal => {
      emit('update:isReviewCancelApprove', newVal)
    },
  )

  const tableHeaders: DataTableHeader[] = [
    { title: '信用狀號碼', key: 'lcNo', align: 'center', sortable: false, nowrap: true },
    { title: '申請人', key: 'applicant', align: 'start', sortable: false, nowrap: true },
    { title: '受益人', key: 'beneficiary', align: 'start', sortable: false, nowrap: true },
    { title: '審核動作', key: 'reviewAction', align: 'center', sortable: false, nowrap: true },
    { title: '執行結果', key: 'executionResult', align: 'center', sortable: false, nowrap: true },
  ]

  const emit = defineEmits<{
    'update:isReviewCancelApprove': [boolean]
    'on-close': []
  }>()

  function onClose (): void {
    show.value = false
    emit('on-close')
  }
</script>
