import type { PageOptions } from '@/types/common'
import type { LcAppDetailDto } from '@/types/lcApp'
import type { VForm } from 'vuetify/components'
import { isAfter, isBefore } from 'date-fns'
import { computed, ref } from 'vue'
import { apiRequest } from '@/services/api-service'

type SearchMode = 'lcNo' | 'appNo' | 'advanced'

interface Rules {
  dateStartRule: ((v: string) => boolean | string)[]
  dateEndRule: ((v: string) => boolean | string)[]
}

// interface LcAppItem {
//   no: number // 編號
//   appNo: string // 開狀申請書號碼
//   lcNo: string // 信用狀號碼
//   applyDate: string // 申請日期
//   applicantName: string // 申請人
//   applicantTaxId: string // 統編
//   amount: number // 金額
//   currency: string // 幣別
//   notifyBank: string // 通知銀行
//   beneficiaryName: string // 受益人
//   expiry: string // 有效期限
//   status: string // 修改申請
//   hasAmendApp: boolean // 押匯申請
//   hasDraftList: boolean // 利率約定
//   hasInterestRate: boolean // 註銷申請
//   hasCancelApp: boolean // 修改通知書
//   hasAmendNotice: boolean // 狀態
// }

export interface ListItem {
  no: number // 編號
  appNo: string // 開狀申請書號碼
  lcNo: string // 信用狀號碼
  lcType: string // 信用狀別
  applicantName: string // 申請人
  notifyBank: string // 通知銀行
  applyDate: string // 申請日期
  issueDate: string // 開狀日期
  amount: number // 金額
  beneficiaryName: string // 受益人
  hasAmendNotice: boolean // 狀態
  pendingApprover: string // 待審核人員
  lcFeeReceipt: boolean // 開狀手續費收據
  depositReceipt: boolean // 保證金收款證明
  cashPaySlip: boolean // 現金繳費單
  acceptanceFeeReceipt: boolean // 承兌手續費收據
  transferVoucher: boolean // 轉帳支出傳票
  eBankFeeReceipt: boolean // 電子帳簿開狀手續費收據
}

export function useQueryLcApp () {
  const searchMode = ref<SearchMode>('lcNo')
  const searchFormRef = ref<InstanceType<typeof VForm>>()
  const loading = ref(false)
  const showResult = ref(false)

  // 搜尋條件
  const lcNo = ref('')
  const appNo = ref('')
  const appTaxId = ref('')
  const beneTaxId = ref('')
  const bank = ref('')
  const statusList = ref<string[]>([])
  const lcTypeList = ref<string[]>([])
  const dateStart = ref('')
  const dateEnd = ref('')
  const rules: Rules = {
    dateStartRule: [v => {
      if (!v || !dateEnd.value) {
        return true
      }
      const start = new Date(v)
      const end = new Date(dateEnd.value)
      if (!start || !end) {
        return true
      }
      return !isAfter(start, end) || '起始日期不能晚於結束日期'
    }],
    dateEndRule: [v => {
      if (!v || !dateStart.value) {
        return true
      }
      const end = new Date(v)
      const start = new Date(dateStart.value)
      if (!start || !end) {
        return true
      }
      return !isBefore(end, start) || '結束日期不能早於起始日期'
    }],
  }

  // 分頁資料
  const tableItems = ref<ListItem[]>([])
  const pageOptionsInit = ref<PageOptions>({
    page: 1,
    itemsPerPage: 10,
    sortBy: [{ key: 'no', order: 'asc' }],
  })
  const pageOptions = ref<PageOptions>({ ...pageOptionsInit.value })
  const totalCount = ref<number>(0) // 總筆數
  const totalAmount = ref<number>(0) // 總金額
  const totalPages = computed(() => Math.ceil(totalCount.value / pageOptions.value.itemsPerPage) || 1) // 總頁數
  const gotoPage = ref<number | null>(null)

  watch(
    () => searchMode.value,
    newType => {
      searchFormRef.value?.reset()
      searchMode.value = newType
    },
  )

  async function searchHandler () {
    loading.value = true
    try {
      const { page, itemsPerPage } = pageOptions.value
      let body: Record<string, unknown> = { pageIndex: page, pageSize: itemsPerPage }

      if (searchMode.value === 'lcNo') {
        body = {
          ...body,
          lcNo: lcNo.value,
        }
      } else if (searchMode.value === 'appNo') {
        body = {
          ...body,
          appNo: appNo.value,
        }
      } else {
        body = {
          ...body,
          appTaxId: appTaxId.value,
          beneTaxId: beneTaxId.value,
          bank: bank.value,
          statusList: statusList.value,
          lcTypeList: lcTypeList.value,
          dateStart: dateStart.value,
          dateEnd: dateEnd.value,
        }
      }
      const res = await apiRequest<ListItem[]>('/query/lc-app', { method: 'POST', data: body })
      if (res.success) {
        tableItems.value = res.data ?? []
        totalCount.value = res.total ?? 0
        totalAmount.value = res.totalAmount ?? 0
        showResult.value = true
      } else {
        console.error('[useQueryLcApp/searchHandler]', res.message, res.errors)
      }
    } finally {
      loading.value = false
    }
  }

  function resetHandler () {
    searchFormRef.value?.reset()
    showResult.value = false
    tableItems.value = []
    totalCount.value = 0
    totalAmount.value = 0
    pageOptions.value.page = 1
    pageOptions.value.itemsPerPage = 10
  }

  async function handlePageChange (page: number) {
    pageOptions.value.page = page
    console.log('handlePageChange', pageOptions.value)
    await searchHandler()
  }

  async function handleItemsPerPageChange (size: number) {
    pageOptions.value.itemsPerPage = size
    pageOptions.value.page = 1 // 切換每頁筆數要回第一頁
    await searchHandler()
  }

  async function goToPage () {
    if (!gotoPage.value) {
      return
    }
    const page = Math.max(1, Math.min(gotoPage.value, totalPages.value))
    pageOptions.value.page = page
    gotoPage.value = null
    await searchHandler()
  }

  // 開狀申請書 明細對話框
  const showDetail = ref(false)
  const detailLoading = ref(false)
  const selectedDetail = ref<LcAppDetailDto | null>(null)

  async function openDetail (appNo: string) {
    showDetail.value = true
    detailLoading.value = true
    selectedDetail.value = null
    try {
      const res = await apiRequest<LcAppDetailDto>(`/query/lc-app/${encodeURIComponent(appNo)}`)
      if (res.success) {
        selectedDetail.value = res.data ?? null
      } else {
        console.error('[useQueryLcApp/openDetail]', res.message, res.errors)
      }
    } finally {
      detailLoading.value = false
    }
  }

  return {
    searchMode,
    searchFormRef,
    loading,
    showResult,
    lcNo,
    appNo,
    appTaxId,
    beneTaxId,
    bank,
    statusList,
    lcTypeList,
    dateStart,
    dateEnd,
    rules,
    tableItems,
    totalCount,
    totalAmount,
    pageOptions,
    gotoPage,
    totalPages,
    searchHandler,
    resetHandler,
    handleItemsPerPageChange,
    handlePageChange,
    goToPage,
    showDetail,
    detailLoading,
    selectedDetail,
    openDetail,
  }
}
