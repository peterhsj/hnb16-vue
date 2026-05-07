<template>
  <div>
    <!-- 隱私權及安全宣告 -->
    <v-dialog
      v-model="show"
      max-width="920"
      min-width="400"
      persistent
      scrollable
    >
      <v-card>
        <v-card-title class="px-6 py-3 bg-blue-darken-1">
          隱私權及安全宣告
        </v-card-title>
        <v-divider />
        <v-card-text class="overflow-y-auto" height="600">
          <p class="pl-5 py-2 text-blue-grey-darken-2">感謝您蒞臨
            <span class="text-subtitle-1 text-brown-darken-1">網際優勢 IFSLC 金融服務中心</span>
            ( 以下簡稱本網站 )！
          </p>
          <p class="pl-5 py-2 text-blue-grey-darken-2">
            我們遵守《個人資料保護法》及其相關法規命令，並理解、重視本網站的訪問者和使用者之隱私，以及所提供資訊的保密及安全問題。<br>
            為了讓您能夠安心的使用本網站的各項服務與資訊，特此向您說明本網站的隱私權保護政策，以保障您的權益，請您詳閱下列內容：</p>
          <h3 class="text-h6 text-cyan-darken-3">一、隱私權保護政策的適用範圍</h3>
          <p class="pl-5 py-2 text-blue-grey-darken-2">
            隱私權保護政策內容，包括本．網站如何處理在您使用網站服務時收集到的個人識別資料。<br>
            本隱私權保護政策不適用於本網站以外的相關連結網站，也不適用於非本網站所委託或參與管理的人員。
          </p>
          <h3 class="text-h6 text-cyan-darken-3">二、個人資料蒐集之目的及類別</h3>
          <p class="pl-5 py-2 text-blue-grey-darken-2">
            若您是本網站的訪客，則您毋須提供任何個人資料即得以瀏覽本網站；<br>
            若您需要使用本網站之服務時，為了確保得以持續提供服務，並為您規劃所需之服務，則將會向您蒐集個人資料。</p>
          <h3 class="text-h6 text-cyan-darken-3">三、個人資料的蒐集、處理及利用方式</h3>
          <ul class="pl-10 py-2 text-blue-grey-darken-2">
            <li>當您造訪本網站或使用本網站所提供之功能服務時，我們將視該服務功能性質，請您提供必要的個人資料，並在該特定目的範圍內處理及利用您的個人資料；非經您同意，本網站不會將個人資料用於其他用途。</li>
            <li>本網站在您使用服務信箱、問卷調查等互動性功能時，會保留您所提供的姓名、電子郵件地址、聯絡方式及使用時間等。</li>
            <li>於一般瀏覽時，伺服器會自行記錄相關行徑，包括您使用連線設備的IP位址、使用時間、使用的瀏覽器、瀏覽及點選資料紀錄等，做為我們增進網站服務的參考依據，此紀錄僅供作內部應用流量分析，絕不對外公布，不會和特定個人相聯繫，亦不會針對特定紀錄進行個別分析。</li>
            <li>為提供精確的服務，我們會將收集的問卷調查、內容進行全體性之統計與分析，分析結果之統計數據或說明文字呈現，除供內部研究外，我們會視需要公布統計數據及說明文字，但不涉及特定個人之資料。</li>
          </ul>

          <h3 class="text-h6 text-cyan-darken-3">四、資料之保護</h3>
          <ul class="pl-10 py-2 text-blue-grey-darken-2">
            <li>我們盡力以合理之技術、程序、相關的各項資訊安全設備及必要的安全防護措施，加以保護網站及您的個人資料，只由經過授權的人員才能接觸您的個人資料，相關處理人員皆簽有保密合約，如有違反保密義務者，將會受到相關的法律處分。</li>
            <li>如因業務需要有必要委託其他單位提供服務時，本網站亦會嚴格要求其具有適當安全維護措施、遵守保密義務，我們會採取必要檢查程序以確定其將確實遵守。</li>
          </ul>
          <h3 class="text-h6 text-cyan-darken-3">五、網站對外的相關連結</h3>
          <p class="pl-5 py-2 text-blue-grey-darken-2">
            本網站之隱私權聲明及其所包含之告知事項，僅適用於本網站。本網站的網頁提供其他網站的網路連結，您也可經由本網站所提供的連結，點選進入其他網站。但該等連結網站不一定適用本網站的隱私權保護政策，您必須參閱該等連結網站中的隱私權保護政策。
          </p>
          <h3 class="text-h6 text-cyan-darken-3">六、與第三人共用個人資料之政策 </h3>
          <p class="pl-5 py-2 text-blue-grey-darken-2">本網站絕不會提供、交換、出租或出售任何您的個人資料給其他個人、團體、私人企業或公務機關，但有法律依據或合約義務者，不在此限。</p>
          <p class="pl-5 py-2 text-blue-grey-darken-2">前項但書之情形包括但不限於：</p>
          <ul class="pl-10 py-2 text-blue-grey-darken-2">
            <li>經由您同意。</li>
            <li>法律明文規定。</li>
            <li>為免除您生命、身體、自由或財產上之危險。</li>
            <li>與公務機關或學術研究機構合作，基於公共利益為統計或學術研究而有必要，且資料經過提供者處理或蒐集者依其揭露方式無從識別特定之當事人。</li>
            <li>當您在網站的行為，違反服務條款或可能損害或妨礙網站與其他使用者權益或導致任何人遭受損害時，經網站管理單位研析揭露您的個人資料是為了辨識、聯絡或採取法律行動所必要者。</li>
            <li>有利於您的權益。</li>
            <li>本網站委託廠商協助蒐集、處理或利用您的個人資料時，將對委外廠商或個人善盡監督管理之責。</li>
          </ul>
          <h3 class="text-h6 text-cyan-darken-3">七、當事人之權利</h3>
          <p class="pl-5 py-2 text-blue-grey-darken-2">本網站所蒐集個人資料之當事人，您可依個人資料保護法得行使以下權利：</p>
          <ul class="pl-10 py-2 text-blue-grey-darken-2">
            <li>查詢或請求閱覽。</li>
            <li>請求製給複製本。</li>
            <li>請求補充或更正。</li>
            <li>請求停止蒐集、處理及利用。</li>
            <li>請求刪除。</li>
          </ul>
          <p class="pl-5 py-2 text-blue-grey-darken-2">但因本網站所執行職務或業務者所必須填寫者，則不在此限。</p>
          <h3 class="text-h6 text-cyan-darken-3">八、Cookie之使用</h3>
          <p class="pl-5 py-2 text-blue-grey-darken-2">
            為了提供您最佳的服務，本網站會在您的電腦中放置並取用我們的 Cookie 或類似技術，您不願接受 Cookie 的寫入，您可在您使用的瀏覽器功能項中設定隱私權等級為高，或經由瀏覽器的取消、限制此項功能，即可拒絕 Cookie 的寫入，但可能會導至網站某些功能無法正常執行。
          </p>
          <h3 class="text-h6 text-cyan-darken-3">九、隱私權保護政策之修正</h3>
          <p class="pl-5 py-2 text-blue-grey-darken-2">
            本網站隱私權保護政策將因應需求隨時進行修正，修正後的條款將刊登於網站上，不另行個別通知，<br>
            您可以隨時在本網站上詳閱修訂後的隱私權聲明及相關告知事項。您如果對於本網站之隱私權聲明，<br>
            或於個人資料有關之相關事項有任何疑問，可以利用電子郵件 ifs_service@uxb2b.com 與我們聯絡。</p>
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
    privacyDialog?: boolean
  }
  const props = withDefaults(defineProps<Props>(), {
    privacyDialog: false,
  })

  const show = ref<boolean>(props.privacyDialog)
  watch(
    () => props.privacyDialog,
    newValue => {
      show.value = newValue
    })
  watch(
    () => show.value,
    newValue => {
      emits('update:privacyDialog', newValue)
    })

  const emits = defineEmits<{
    'update:privacyDialog': [boolean]
    'on-close': []
  }>()

  function onClose (): void {
    show.value = false
    emits('on-close')
  }
</script>
