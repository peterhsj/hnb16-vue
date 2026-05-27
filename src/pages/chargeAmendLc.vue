<template>
  <div>
    <v-container fluid>
      <div class="hnb16__breadcrumb mb-2">
        <v-breadcrumbs density="compact" :items="breadcrumbs">
          <template #item="{ item }">
            <v-breadcrumbs-item
              :disabled="Boolean(item.disabled)"
              :title="item.title"
              :to="item.title === '申請作業' ? '' : item.to"
              @click="onBreadcrumbClick(item)"
            />
          </template>

          <template #divider>
            <v-icon icon="mdi-chevron-right" size="small" />
          </template>
        </v-breadcrumbs>
      </div>

      <div v-if="isShowList" class="mt-4 mx-4">
        <h1 class="hnb16__title">補收開狀手續費沖正(EC)清冊</h1>

        <v-card class="mt-4" flat>
          <v-data-table
            class="table-sm hnb__table bg-white"
            color="blue-darken-2"
            density="compact"
            :headers="tableHeaders"
            hide-default-footer
            item-value="lcNo"
            :items="listItems"
            :items-per-page="pageOptions.itemsPerPage"
            :loading="isLoading"
            :page="pageOptions.page"
            sort-asc-icon="mdi-sort-ascending"
            sort-desc-icon="mdi-sort-descending"
            sort-icon="mdi-swap-vertical"
            striped="odd"
            @update:items-per-page="pageOptions.itemsPerPage = $event"
          >
            <template #item.draftNo="{ item }">
              <a v-if="item.draftNo" class="hnb__text--link" href="#" @click.prevent="handleDraftView(item.draftNo)">
                {{ item.draftNo }}
              </a>

              <span v-else>N/A</span>
            </template>

            <template #item.lcNo="{ item }">
              <a v-if="item.lcNo" class="hnb__text--link" href="#" @click.prevent="handleLcView(item.lcNo)">
                {{ item.lcNo }}
              </a>

              <span v-else>N/A</span>
            </template>

            <template #item.lcAmount="{ item }">
              ${{ thousandsFormatting(item.lcAmount.toLocaleString()) }}
            </template>

            <template #item.lastAmount="{ item }">
              ${{ thousandsFormatting(item.lastAmount.toLocaleString()) }}
            </template>

            <template #item.issuingAmount="{ item }">
              ${{ thousandsFormatting(item.issuingAmount.toLocaleString()) }}
            </template>

            <template #item.chargeAmount="{ item }">
              ${{ thousandsFormatting(item.chargeAmount.toLocaleString()) }}
            </template>

            <template #item.action="{ item }">
              <v-btn
                class="hnb__btn--default mx-1 my-1"
                size="small"
                variant="flat"
                @click="handlerAmend(item.lcNo)"
              >
                當日更正
              </v-btn>
            </template>
          </v-data-table>

          <TablePagination
            v-model:items-per-page="pageOptions.itemsPerPage"
            v-model:page="pageOptions.page"
            :is-show-current-page-total-amount="true"
            :is-show-total-amount="true"
            :total-amount="totalAmount"
            :total-items="listItems.length"
            :total-page-amount="totalAmount"
            :total-pages="totalPages"
            @update:items-per-page="pageOptions.page = 1"
          />
        </v-card>
      </div>

      <!-- Prompt Dialog -->
      <PromptDialog
        v-model:message-dialog="messageDialog"
        :is-confirm-btn="isConfirmBtn"
        :message="message"
        :message-status="messageStatus"
        :message-title="messageTitle"
        @on-close="messageClose"
        @prompt-confirm="messageConfirm"
      />
    </v-container>
  </div>
</template>

<script setup lang="ts">
  import type { ListItem } from '@/types/chargeAmendLc'
  import type { PageOptions } from '@/types/common'
  import type { DataTableHeader } from 'vuetify'
  import { computed, onMounted, ref, watch } from 'vue'
  import { getDateList } from '@/api/chargeAmendLc'
  import { useApiErrorHandler } from '@/composables/useApiErrorHandler'
  import { thousandsFormatting } from '@/utils/format'

  const { handleApiError } = useApiErrorHandler()
  const isLoading = ref(false)
  const isShowList = ref(true)

  const breadcrumbs = [
    { title: '首頁', href: '/' },
    { title: '申請作業' },
    { title: '當日沖正交易' },
    { title: '補收開狀手續費沖正(EC)', to: '/chargeAmendLc' },
  ]

  const tableHeaders: DataTableHeader[] = [
    { title: '編號', key: 'seqNo', align: 'center', sortable: false, nowrap: true, width: 60 },
    { title: '信用狀號碼', key: 'lcNo', align: 'center', sortable: false, nowrap: true },
    { title: '開狀日期', key: 'issueDate', align: 'center', sortable: false, nowrap: true },
    { title: '開狀金額', key: 'lcAmount', align: 'end', sortable: false, nowrap: true },
    { title: '信用狀餘額', key: 'lastAmount', align: 'end', sortable: false, nowrap: true },
    { title: '匯票號碼', key: 'draftNo', align: 'center', sortable: false, nowrap: true },
    { title: '押匯金額', key: 'issuingAmount', align: 'end', sortable: false, nowrap: true },
    { title: '補收開狀手續費', key: 'chargeAmount', align: 'end', sortable: false, nowrap: true },
    { title: '受益人', key: 'beneficiary', align: 'start', sortable: false, nowrap: true },
    { title: '有效期限', key: 'expiryDate', align: 'center', sortable: false, nowrap: true },
    { title: '狀態', key: 'status', align: 'center', sortable: false, nowrap: true },
    { title: '操作', key: 'action', align: 'center', sortable: false, nowrap: true },
  ]

  // Prompt Message Dialog
  const messageDialog = ref<boolean>(false)
  const messageTitle = ref<string>('')
  const message = ref<string>('')
  const messageStatus = ref<string>('')
  const isConfirmBtn = ref<boolean>(true)
  const processStatus = ref<string>('')

  function onBreadcrumbClick (item: any): void {
    if (item.disabled || !item.to) return
    if (item.title === '註銷信用狀沖正(EC)' && typeof item.to === 'string') {
      console.log('Breadcrumb clicked:', `/#${item.to}`)
      // hash router 下用 location.href 重新導向可強制整頁重整
      // isEdit.value = false
      isShowList.value = true
      // currentView.value = 'search'
      // searchForm.beneType = null
      // searchForm.queryMode = ''
    }
  }

  const pageOptionsInit = ref<PageOptions>({
    page: 1,
    itemsPerPage: 10,
    sortBy: [{ key: 'companyId', order: 'asc' }],
  })
  const pageOptions = ref<PageOptions>({ ...pageOptionsInit.value })
  const listItems = ref<ListItem[]>([]) // 列表資料
  const totalCount = ref<number>(0) // 總筆數
  const totalAmount = ref<number>(0) // 總金額

  const totalPages = computed(() =>
    Math.ceil(totalCount.value / pageOptions.value.itemsPerPage),
  )

  watch(
    () => pageOptions.value,
    newVal => {
      console.log('Page options changed:', newVal)
      fetchTableList()
    },
    { deep: true },
  )

  // 取得列表資料
  async function fetchTableList () {
    const { page, itemsPerPage } = pageOptions.value
    const payload = {
      page,
      itemsPerPage,
    }
    isLoading.value = true
    try {
      const res = await getDateList(payload)
      const { status, data: { data: sorceData, total, amount } } = res
      if (status === 200) {
        listItems.value = sorceData || []
        totalCount.value = total || 0
        totalAmount.value = amount || 0
      }
    } catch (error: any) {
      await handleApiError(error, fetchTableList, {
        messageTitle,
        message,
        messageStatus,
        isConfirmBtn,
        messageDialog,
      })
    } finally {
      isLoading.value = false
    }
  }

  function handleCancelAppView (amendNoticeNo: string): void {
    console.log('View Amend Notice:', amendNoticeNo)
  }

  function handleLcView (lcNo: string): void {
    console.log('View LC:', lcNo)
  }

  function handlerAmend (lcNo: string): void {
    console.log('Edit item:', lcNo)
  }

  onMounted(fetchTableList)

  // 離開 message
  function messageClose (): void {
    messageDialog.value = false
  }

  // 確認 message
  function messageConfirm (): void {
    messageDialog.value = false
  }
</script>
