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
            台塑押匯補登資料匯入
          </h2>
        </div>

        <div class="text-body-2 text-teal-darken-3" cols="12">
          註：檔案大小不能超過 5 MB
        </div>

        <v-card class="border-sm pa-4 bg-grey-lighten-4" variant="outlined">
          <v-row class="py-5">
            <v-col class="d-flex" cols="12">
              <div class="text-no-wrap hnb__form-label mt-1 me-2 w-20">TXD2SB30 押匯申請異動檔</div>

              <v-file-input
                v-model="TXD2SB30File"
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

                <template #append>
                  <v-btn
                    class="hnb__btn--default mx-1"
                    @click="sendFiles"
                  >
                    確定
                  </v-btn>
                </template>
              </v-file-input>
            </v-col>

            <v-col class="d-flex" cols="12">
              <div class="text-no-wrap hnb__form-label mt-1 me-2 w-20">TXD2SB32 押匯發票異動檔</div>

              <v-file-input
                v-model="TXD2SB32File"
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

                <template #append>
                  <v-btn
                    class="hnb__btn--default mx-1"
                    @click="sendFiles"
                  >
                    確定
                  </v-btn>
                </template>
              </v-file-input>
            </v-col>

            <v-col class="d-flex" cols="12">
              <div class="text-no-wrap hnb__form-label mt-1 me-2 w-20">TXD2SB33 押匯發票明細異動檔</div>

              <v-file-input
                v-model="TXD2SB33File"
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

                <template #append>
                  <v-btn
                    class="hnb__btn--default mx-1"
                    @click="sendFiles"
                  >
                    確定
                  </v-btn>
                </template>
              </v-file-input>
            </v-col>
          </v-row>
        </v-card>
      </div>
    </v-container>
  </div>
</template>

<script setup lang="ts">
  const breadcrumbs = [
    { title: '首頁', href: '/' },
    { title: '申請作業' },
    { title: '台塑押匯補登資料匯入', disabled: true },
  ]

  const TXD2SB30File = ref<File[]>([])
  const TXD2SB32File = ref<File[]>([])
  const TXD2SB33File = ref<File[]>([])

  function sendFiles () {
    if (TXD2SB30File.value.length > 0) {
      console.log('TXD2SB30File:', TXD2SB30File.value)
    }
    if (TXD2SB32File.value.length > 0) {
      console.log('TXD2SB32File:', TXD2SB32File.value[0])
    }
    if (TXD2SB33File.value.length > 0) {
      console.log('TXD2SB33File:', TXD2SB33File.value[0])
    }
  }
</script>
