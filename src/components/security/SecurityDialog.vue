<template>
  <div>
    <!-- 資訊安全政策宣告 -->
    <v-dialog
      v-model="show"
      max-width="920"
      min-width="400"
      persistent
      scrollable
    >
      <v-card>
        <v-card-title class="px-6 py-3 bg-blue-darken-1">
          資訊安全政策宣告
        </v-card-title>

        <v-divider />

        <v-card-text class="overflow-y-auto" height="600">
          <p class="py-2 text-blue-grey-darken-2">
            感謝您蒞臨
            <span class="text-subtitle-1 text-brown-darken-1">網際優勢</span>
            ( 以下簡稱本公司 )！
          </p>

          <h3 class="text-h6 text-cyan-darken-3">一、目的</h3>

          <p class="pl-5 py-2 text-blue-grey-darken-2">
            本公司為確保資訊資料、系統、設備及網路通訊安全，有效降低因人為疏失、蓄意或天然災害等導致之資訊資產遭竊、不當使用、洩漏、竄改或毀損等風險，並建立資訊安全管理系統，特訂定資訊安全政策(以下簡稱本政策)，以確保資訊之機密性、完整性與可用性。
          </p>

          <ul class="pl-10 py-2 text-blue-grey-darken-2">
            <li>機密性：確保只有經授權的人才能存取資訊。</li>
            <li>完整性：確保使用之資訊正確無誤、未遭竄改。</li>
            <li>可用性：確保經授權的使用者在需要時可以存取資訊及相關資訊資產。</li>
          </ul>

          <h3 class="text-h6 text-cyan-darken-3">二、依據</h3>

          <p class="pl-5 py-2 text-blue-grey-darken-2">ISO/IEC 27001:2013 <br>
            (Information technology - Security techniques - Information security management systems - Requirements)。</p>

          <h3 class="text-h6 text-cyan-darken-3">三、內容</h3>

          <ul class="pl-10 py-2 text-blue-grey-darken-2">
            <li>建立組織資訊安全管理委員會，負責推動資訊安全工作。</li>
            <li>各項資訊安全管理規定必須遵守政府相關法規</li>
            <li>如：刑法、國家機密保護法、專利法、商標法、著作權法、營業秘密法、個人資料保護法等）之規定。</li>
            <li>評估人員之任免、職務之分派，對離職、休職、停職或調職之人員，應建立控管及人力備援制度；</li>
            <li>另定期辦理資訊安全教育訓練及宣導，提升人員資訊安全認知及水準。 </li>
            <li>建立資訊資產的保管制度，有效分配、運用及管理資訊資源。 </li>
            <li>評估資訊資產之安全等級，並賦予相關人員適當存取權限 。 </li>
            <li>電腦系統之新增或變更作業建立控管制度並完整記錄，以備查核。 </li>
            <li>建立資訊緊急處理機制與災後重建計畫，並定期操演、測試紀錄。 </li>
            <li>訂定資訊安全稽核制度，各項資訊作業安全進行定期或不定期之稽核作業，且嚴禁刪除及修改各項稽核紀錄檔案。 </li>
            <li>本公司所有人員負有維持資訊安全之責任，且應遵守相關之資訊安全管理規範。 </li>
            <li>資訊安全管理系統文件應有明確之管理規範。</li>
          </ul>

          <h3 class="text-h6 text-cyan-darken-3">四、修訂與公告</h3>

          <ul class="pl-10 py-2 text-blue-grey-darken-2">
            <li>本政策每年應至少評估一次，以反映政府、客戶、供應商等內外部議題及本公司業務之最新狀況，確保安全實務作業之可用性及有效性。</li>
            <li>本政策由「資訊安全管理委員會」審查後頒布實施，修正時亦同。</li>
          </ul>
        </v-card-text>

        <v-divider />

        <v-card-actions class="py-4 px-6">
          <v-spacer />

          <v-btn
            class="text-white"
            color="blue-grey-lighten-3"
            variant="flat"
            @click="onClose"
          >
            離開
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue'
  interface Props {
    securityDialog?: boolean
  }
  const props = withDefaults(defineProps<Props>(), {
    securityDialog: false,
  })

  const show = ref<boolean>(props.securityDialog)
  watch(
    () => props.securityDialog,
    newValue => {
      show.value = newValue
    })
  watch(
    () => show.value,
    newValue => {
      emits('update:securityDialog', newValue)
    })

  const emits = defineEmits<{
    'update:securityDialog': [boolean]
    'on-close': []
  }>()

  function onClose (): void {
    show.value = false
    emits('on-close')
  }
</script>
