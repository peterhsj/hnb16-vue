<template>
  <div>
    <v-container fluid>
      <div class="hnb16__breadcrumb mb-2">
        <v-breadcrumbs density="compact" :items="breadcrumbs">
          <template #divider>
            <v-icon icon="mdi-chevron-right" size="small" />
          </template>
        </v-breadcrumbs>
      </div>

      <div class="mt-4 mx-4">
        <div class="d-flex align-center justify-space-between">
          <h2 class="hnb16__title">
            台塑受益人事業部建檔匯入
          </h2>
        </div>

        <div class="text-body-2 text-teal-darken-3" cols="12">
          註：檔案大小不能超過 5 MB
        </div>

        <v-card class="border-sm pa-4 bg-grey-lighten-4" variant="outlined">
          <v-row class="py-5">
            <v-col class="d-flex" cols="12">
              <div class="text-no-wrap hnb__form-label mt-1 me-3 w-10">匯入檔案範本</div>

              <div>
                <p>
                  <a class="hnb__text--link" href="#">每一列代表台塑集團受益人資料</a>
                </p>

                <p>
                  <a class="hnb__text--link" href="#">每一列代表台塑集團事業部代號及名稱對照</a>
                </p>

                <p class="text-body-2 my-2">
                  請依據檔案中各欄位名稱填入相對應內容，若匯入資料已存在系統，系統會以編輯方式修改原存在資料，範本檔案為 Excel 格式，請另外存成 Xml 檔匯入
                </p>
              </div>
            </v-col>

            <v-col class="d-flex" cols="12">
              <div class="text-no-wrap hnb__form-label me-3 w-10">匯入資料類型</div>

              <v-radio-group
                v-model="form.importType"
                color="cyan-darken-3"
                density="compact"
                hide-details="auto"
                inline
              >
                <v-radio
                  class="me-4"
                  color="cyan-darken-3"
                  density="compact"
                  hide-details
                  style="flex: none;"
                  value="01"
                >
                  <template #label>
                    匯入台塑集團受益人資料
                  </template>
                </v-radio>

                <v-radio
                  color="cyan-darken-3"
                  density="compact"
                  hide-details
                  style="flex: none;"
                  value="02"
                >
                  <template #label>
                    匯入台塑集團事業部代號及名稱對照
                  </template>
                </v-radio>
              </v-radio-group>
            </v-col>

            <v-col class="d-flex" cols="12">
              <div class="text-no-wrap hnb__form-label mt-1 me-3 w-10">資料傳送</div>

              <v-file-input
                v-model="form.dataFile"
                accept=".xml, application/xml, text/xml"
                class="mx-1"
                clearable
                color="teal-darken-2"
                density="compact"
                hide-details="auto"
                prepend-icon="mdi-file"
                :rules="[v => !v || v.length === 0 || v[0].size < 5242880 || '檔案大小不能超過 5 MB']"
                show-size
                variant="outlined"
              >
                <template #append-inner>
                  <span class="text-no-wrap px-2">檔案格式：xml</span>
                </template>
              </v-file-input>
            </v-col>
          </v-row>

          <v-row>
            <v-col class="d-flex justify-end" cols="12">
              <v-btn
                class="hnb__btn--cancel mx-1"
                @click="resetForm"
              >
                重設
              </v-btn>

              <v-btn
                class="hnb__btn--default mx-1"
                :disabled="!searchEnabled"
                @click="sendFiles"
              >
                確定
              </v-btn>
            </v-col>
          </v-row>
        </v-card>
      </div>
    </v-container>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'

  const form = ref({
    importType: null,
    dataFile: null,
  })

  const breadcrumbs = [
    { title: '首頁', href: '/' },
    { title: '客戶管理作業' },
    { title: '台塑受益人事業部建檔匯入', disabled: true },
  ]

  function resetForm () {
    form.value.importType = null
    form.value.dataFile = null
  }

  const searchEnabled = computed(() => !!form.value.importType && !!form.value.dataFile)
  function sendFiles () {
    // Implement the logic to send files here
  }
</script>
