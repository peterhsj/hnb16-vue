import type { PageQuery } from '@/types'
import { ref } from 'vue'

export function usePagedList<T> (fetchFn: (query: PageQuery) => Promise<{ data: T[], total: number }>) {
  const data = ref<T[]>([]) as { value: T[] }
  const total = ref(0)
  const loading = ref(false)
  const query = ref<PageQuery>({
    pageIndex: 1,
    pageSize: 20,
  })

  async function loadData () {
    loading.value = true
    try {
      const result = await fetchFn(query.value)
      data.value = result.data
      total.value = result.total
    } finally {
      loading.value = false
    }
  }

  function handlePageChange (page: number) {
    query.value.pageIndex = page
    loadData()
  }

  function handleSizeChange (size: number) {
    query.value.pageSize = size
    query.value.pageIndex = 1
    loadData()
  }

  return { data, total, loading, query, loadData, handlePageChange, handleSizeChange }
}
