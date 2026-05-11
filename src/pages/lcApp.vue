<template>
  <div>
    <!-- 開狀申請書 -->
    <v-container fluid>
      <div class="hnb16__breadcrumb mb-2">
        <v-breadcrumbs density="compact" :items="breadcrumbs">
          <template #divider>
            <v-icon icon="mdi-chevron-right" size="small" />
          </template>
        </v-breadcrumbs>
      </div>

      <div>
        <h2 class="mx-4 hnb16__title">選擇開狀申請書填寫方式</h2>

        <v-card class="border-sm mx-4 pa-4 bg-grey-lighten-4" variant="outlined">
          <v-form ref="formRef">
            <v-row align="center">
              <v-col cols="auto">
                <div class="text-body-2 font-weight-medium">受益人類別</div>
              </v-col>

              <v-col cols="12" md="3" sm="5">
                <v-select
                  v-model="form.beneficiaryType"
                  bg-color="white"
                  color="teal-darken-2"
                  density="compact"
                  hide-details
                  item-title="title"
                  item-value="value"
                  :items="beneficiaryTypeOptions"
                  placeholder="請選擇受益人類別"
                  variant="outlined"
                />
              </v-col>

              <template v-if="form.beneficiaryType === '1'">
                <v-col cols="auto">
                  <div class="text-body-2 font-weight-medium">受益人</div>
                </v-col>

                <v-col cols="12" md="3" sm="5">
                  <v-select
                    v-model="form.beneficiary"
                    bg-color="white"
                    color="teal-darken-2"
                    density="compact"
                    hide-details
                    item-title="title"
                    item-value="value"
                    :items="beneListByType"
                    placeholder="請選擇受益人"
                    variant="outlined"
                  />
                </v-col>
              </template>

              <template v-if="form.beneficiaryType !== null">
                <v-col cols="auto">
                  <div class="text-body-2 font-weight-medium">填寫方式</div>
                </v-col>

                <v-col cols="12" md="3" sm="5">
                  <v-select
                    v-model="form.inputType"
                    bg-color="white"
                    color="teal-darken-2"
                    density="compact"
                    hide-details
                    item-title="title"
                    item-value="value"
                    :items="inputTypeOptions"
                    placeholder="請選擇填寫方式"
                    variant="outlined"
                  />
                </v-col>
              </template>
            </v-row>
          </v-form>
        </v-card>
      </div>
    </v-container>
  </div>
</template>

<script setup lang="ts">
  const breadcrumbs = [
    { title: '首頁', href: '/' },
    { title: '申請作業' },
    { title: '開狀申請書', disabled: true },
  ]

  const formRef = ref()

  interface Form {
    beneficiaryType: string | null
    beneficiary: string | null
    inputType: string | null
  }
  const form = reactive<Form>({
    beneficiaryType: null,
    beneficiary: null,
    inputType: null,
  })

  const beneficiaryTypeOptions = [
    { title: 'CDS 客戶 (中鋼、中鴻、中鋁、華新麗華、東和鋼鐵)', value: '1' },
    { title: '台塑 e 化平台客戶 (台塑集團、奇美集團)', value: '2' },
    { title: '其他客戶', value: '3' },
  ]

  const beneListByType = [
    { title: '30414175 中國鋼鐵股份有限公司', value: '30414175' },
    { title: '07838854 中鴻鋼鐵股份有限公司', value: '07838854' },
    { title: '96971313 中鋼鋁業股份有限公司', value: '96971313' },
    { title: '75460005 唐榮鐵工廠股份有限公司', value: '75460005' },
  ]

  const inputTypeOptions = [
    { title: '手動填寫', value: 'manual' },
    { title: '自動填寫', value: 'auto' },
  ]

  watch(() => form.beneficiaryType, () => {
    form.beneficiary = null
    form.inputType = null
  })

  watch(() => form.beneficiary, () => {
    form.inputType = null
  })
</script>
