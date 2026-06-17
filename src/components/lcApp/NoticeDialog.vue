<template>
  <v-dialog
    v-model="show"
    persistent
    width="auto"
  >
    <v-card
      class="hnb__dialog"
      max-width="1200"
      min-width="300"
    >
      <v-card-title class="d-flex px-4 font-weight-bold text-red-darken-3">
        <span>信用狀修改通知書明細</span>
        <v-spacer />

        <v-btn
          density="comfortable"
          icon="mdi-close"
          variant="flat"
          @click="onClose"
        />
      </v-card-title>

      <v-card-text class="bg-grey-lighten-4" style="max-height: 70vh; overflow-y: auto;">

        <!-- 銀行抬頭 -->
        <v-container fluid>
          <v-row align="center">
            <v-col class="py-1 text-center" cols="12">
              <span class="my-1 hnb__bankName">
                <span class="pe-1">國內信用狀修改通知書</span>
              </span>
            </v-col>

            <v-col class="py-1 hnb__bankName text-center" cols="12">
              網際商業銀行 南門分行
            </v-col>
          </v-row>
        </v-container>
        <!-- 主要內容表格 -->
        <v-table class="hnb__table" density="compact">
          <tbody>
            <tr>
              <td colspan="2">
                <v-row align="center" no-gutters>
                  <v-col class="py-1" cols="6">
                    <span class="font-weight-bold">修改編號：</span>第 1 次
                  </v-col>

                  <v-col class="py-1" cols="6">
                    <span class="font-weight-bold">修改日期：</span>民國 114 年 3 月 25 日
                  </v-col>

                  <v-col class="py-1" cols="6">
                    <span class="font-weight-bold">信用狀號碼：</span>099700049161000861
                  </v-col>

                  <v-col class="py-1" cols="6">
                    <span class="font-weight-bold">金額：</span>新台幣陸仟萬元整
                  </v-col>

                  <v-col class="py-1" cols="6">
                    <span class="font-weight-bold">通知銀行：</span>華南商業銀行 台北分行
                  </v-col>

                  <v-col class="py-1" cols="6">
                    <span class="font-weight-bold">通知銀行編號：</span>01
                  </v-col>

                  <v-col class="py-1" cols="6">
                    <span class="font-weight-bold">受益人：</span>中鴻鋼鐵股份有限公司
                  </v-col>

                  <v-col class="py-1" cols="6">
                    <span class="font-weight-bold">有效期限至：</span>至民國 114 年 3 月 31 日
                  </v-col>

                  <v-col class="py-1" cols="6">
                    <span class="font-weight-bold">地址：</span>高雄縣橋頭鄉芋寮村芋寮路317號
                  </v-col>

                  <v-col class="py-1" cols="6">
                    <span class="font-weight-bold">信用狀申請人：</span>優勢股份有限公司
                  </v-col>

                  <v-col class="mt-3 mb-0" cols="6">
                    <span class="text-subtitle-1">修改事項：</span>
                  </v-col>
                </v-row>
              </td>
            </tr>

            <!-- 第 2 列：欄位標頭 -->
            <tr>
              <td class="text-center">
                <span class="text-subtitle-1">原規定情形</span>
              </td>

              <td class="text-center">
                <span class="text-subtitle-1">修改情形</span>
              </td>
            </tr>

            <!-- 第 3 列：比較內容 -->
            <tr>
              <!-- 原規定情形 -->
              <td class="align-top">
                <p class="mb-2">
                  <span class="font-weight-bold">有效期限：</span><br>
                  114/04/30
                </p>

                <p class="mb-2">
                  <span class="font-weight-bold">發票日後定日付款：</span><br>
                  以「定日付款」方式填寫到期日，其到期日為自匯票發票日起算20天。
                </p>

                <p class="mb-0">
                  <span class="font-weight-bold">發票日後定日付款：</span><br>
                  114/04/30
                </p>
              </td>
              <!-- 修改情形 -->
              <td class="align-top">
                <p class="mb-2">
                  <span class="font-weight-bold">有效期限：</span><br>
                  114/05/31
                </p>

                <p class="mb-2">
                  <span class="font-weight-bold">發票日後定日付款：</span><br>
                  以「定日付款」方式填寫到期日，其到期日為自匯票發票日起算21天。
                </p>

                <p class="mb-0">
                  <span class="font-weight-bold">發票日後定日付款：</span><br>
                  114/05/30
                </p>
              </td>
            </tr>

            <!-- 第 4 列：異議說明 (全寬) -->
            <tr>
              <td class="notice-row" colspan="2">
                ＊如有異議，請於收到本通知書後10日內，向本行(或通知行)書面表示之。
              </td>
            </tr>

            <!-- 第 5 列：簽章欄 (全寬) -->
            <tr>
              <td class="py-4" colspan="2">
                <span class="hnb__bankName me-3">華南銀行</span>
                <span class="text-body-2 text-grey">（有權簽章人員簽章）</span>
              </td>
            </tr>

          </tbody>
        </v-table>

        <!-- 下載 / 列印 / 版本選擇 -->
        <v-container class="mt-3" fluid>
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

            <!-- <v-col v-if="props.isShowVersion" class="text-center my-2" cols="12">
              <span
                class="mx-3 text-decoration-underline text-primary cursor-pointer"
                @click.prevent="handleLcView('1')"
              >
                版本 0
              </span>

              <span class="mx-1 text-grey">|</span>
              <span class="mx-3 font-weight-bold">版本 1 (目前版本)</span>
            </v-col> -->
          </v-row>

          <!-- 信用狀號碼卡片 -->
          <v-row v-if="props.isShowLc" justify="center">
            <v-col cols="12" md="4" sm="6">
              <v-card class="mx-auto border-sm bg-white" variant="outlined">
                <v-card-title class="text-center text-red-darken-3 text-subtitle-1 font-weight-bold py-2">
                  信用狀號碼
                </v-card-title>

                <v-divider />

                <v-list density="compact">
                  <v-list-item
                    v-for="item in lcNos"
                    :key="item"
                    class="text-center"
                    color="teal-darken-1"
                    link
                    :title="item"
                    :value="item"
                    @click.prevent="handleLcView(item)"
                  />
                </v-list>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-spacer />

        <v-btn
          class="hnb__btn--cancel my-2 mx-1"
          variant="flat"
          @click="onClose"
        >
          離開
        </v-btn>

        <v-spacer />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
  import { computed, ref } from 'vue'
  interface Props {
    noticeDialog?: boolean
    noticeNo?: string
    isShowLc?: boolean
  }
  const props = withDefaults(defineProps<Props>(), {
    noticeDialog: false,
    noticeNo: '',
    isShowLc: false,
  })

  const emits = defineEmits<{
    'update:noticeDialog': [boolean]
    'on-close': []
    'open-lc-detail': [noticeNo: string]
  }>()

  const show = computed({
    get: () => props.noticeDialog,
    set: (value: boolean) => {
      emits('update:noticeDialog', value)
    },
  })

  const lcNos = ref([
    'CDS123400215_V01',
    'CDS123400215_V02',
  ])

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

  // 查看信用狀
  function handleLcView (value: string): void {
    emits('open-lc-detail', value)
  }
</script>
