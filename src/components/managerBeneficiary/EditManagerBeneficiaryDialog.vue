<template>
  <v-dialog
    v-model="show"
    persistent
    width="900"
  >
    <v-card
      class="hnb__dialog"
    >
      <v-card-title class="d-flex px-4 font-weight-bold text-red-darken-3">
        <span>{{ props.editType === 'new' ? '新增' : '編輯' }}受益人資料</span>
        <v-spacer />

        <v-btn
          density="comfortable"
          icon="mdi-close"
          variant="flat"
          @click="onClose"
        />
      </v-card-title>

      <v-form ref="formRef" @submit.prevent="saveData">
        <v-card-text class="d-flex align-center bg-grey-lighten-4">
          <v-row class="align-center pb-4">
            <v-col class="text-body-2 text-red-darken-3" cols="12">
              * 為必填欄位
            </v-col>

            <v-col class="d-flex align-center ga-4 text-body-1 pb-0" cols="12">
              <div class="font-weight-medium text-no-wrap hnb__form-label">* 公司統編</div>

              <v-text-field
                v-model="form.compId"
                color="teal-darken-2"
                density="compact"
                hide-details="auto"
                required
                :rules="[v => !!v || '公司統編為必填']"
                variant="outlined"
              />
            </v-col>

            <v-col class="d-flex align-center ga-4 text-body-1 pb-0" cols="12">
              <div class="font-weight-medium text-no-wrap hnb__form-label">* 公司名稱</div>

              <v-text-field
                v-model="form.compName"
                color="teal-darken-2"
                density="compact"
                hide-details="auto"
                required
                :rules="[v => !!v || '公司名稱為必填']"
                variant="outlined"
              />
            </v-col>

            <v-col class="d-flex align-center ga-4 text-body-1 pb-0" cols="12">
              <div class="font-weight-medium text-no-wrap hnb__form-label">* 負責人姓名</div>

              <v-text-field
                v-model="form.managerName"
                color="teal-darken-2"
                density="compact"
                hide-details="auto"
                required
                :rules="[v => !!v || '負責人姓名為必填']"
                variant="outlined"
              />
            </v-col>

            <v-col class="d-flex align-center ga-4 text-body-1 pb-0" cols="12">
              <div class="font-weight-medium text-no-wrap hnb__form-label">* 負責人職稱</div>

              <v-text-field
                v-model="form.managerTitle"
                color="teal-darken-2"
                density="compact"
                hide-details="auto"
                required
                :rules="[v => !!v || '負責人職稱為必填']"
                variant="outlined"
              />
            </v-col>

            <v-col class="d-flex align-center ga-4 text-body-1 pb-0" cols="12">
              <div class="font-weight-medium text-no-wrap hnb__form-label">* 登記地址</div>

              <v-text-field
                v-model="form.address"
                color="teal-darken-2"
                density="compact"
                hide-details="auto"
                required
                :rules="[v => !!v || '登記地址為必填']"
                variant="outlined"
              />
            </v-col>

            <v-col class="d-flex align-center ga-4 text-body-1 pb-0" cols="12">
              <div class="font-weight-medium text-no-wrap hnb__form-label">聯絡電話</div>

              <v-text-field
                v-model="form.phone"
                color="teal-darken-2"
                density="compact"
                hide-details="auto"
                variant="outlined"
              />
            </v-col>

            <v-col class="d-flex align-center ga-4 text-body-1 pb-0" cols="12">
              <div class="font-weight-medium text-no-wrap hnb__form-label">電子信箱</div>

              <v-text-field
                v-model="form.email"
                color="teal-darken-2"
                density="compact"
                hide-details
                variant="outlined"
              />
            </v-col>

            <v-col v-if="props.beneType === 'fpc'" class="d-flex align-start ga-4 text-body-1" cols="12">
              <div class="font-weight-medium text-no-wrap hnb__form-label mt-3">* 受益人事業部</div>

              <div class="d-flex align-start w-100">
                <div class="d-flex flex-wrap w-100">
                  <div
                    v-for="(item, index) in beneficiaryDptList"
                    :key="index"
                    class="d-flex align-center ga-2 w-100"
                  >
                    <v-text-field
                      v-model="item.DpId"
                      color="teal-darken-2"
                      density="compact"
                      hide-details
                      variant="outlined"
                    >
                      <template #prepend>
                        代碼
                      </template>
                    </v-text-field>

                    <v-text-field
                      v-model="item.DpName"
                      color="teal-darken-2"
                      density="compact"
                      hide-details
                      variant="outlined"
                    >
                      <template #prepend>
                        名稱
                      </template>
                    </v-text-field>

                    <v-btn
                      class="hnb__btn--red mx-1 my-2"
                      prepend-icon="mdi-delete"
                      @click="deleteItems(index)"
                    >
                      刪除
                    </v-btn>
                  </div>
                </div>

                <div class="d-flex align-center ga-2">
                  <v-btn
                    class="hnb__btn--orange mx-1 my-2"
                    prepend-icon="mdi-plus"
                    @click="addItems()"
                  >
                    新增
                  </v-btn>
                </div>
              </div>
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions>
          <v-spacer />

          <v-btn
            class="hnb__btn--cancel mx-1 my-2"
            @click="onClose"
          >
            取消
          </v-btn>

          <v-btn
            class="hnb__btn--default mx-1 my-2"
            type="submit"
          >
            確定
          </v-btn>

          <v-spacer />
        </v-card-actions>
      </v-form>

    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
  import type { EditFormPayload, ListItem } from '@/types/managerBeneficiary'
  import { computed, ref, watch } from 'vue'
  import { VForm } from 'vuetify/components'

  const formRef = ref<InstanceType<typeof VForm>>()

  interface Props {
    isEditDialogOpen?: boolean
    editType?: string
    dataItem?: ListItem
    beneType?: string | null
  }
  const props = withDefaults(defineProps<Props>(), {
    isEditDialogOpen: false,
    editType: 'new',
    dataItem: () => ({
      serNo: 0,
      compId: '',
      compName: '',
      managerName: '',
      managerTitle: '',
      address: '',
      phone: '',
      email: '',
      beneficiaryDepartment: '',
      confirmStatus: false,
    }),
    beneType: '',
  })

  const emits = defineEmits<{
    'update:isEditDialogOpen': [boolean]
    'on-save': []
    'on-close': []
  }>()

  const show = computed({
    get: () => props.isEditDialogOpen,
    set: (value: boolean) => {
      emits('update:isEditDialogOpen', value)
    },
  })

  const form = ref<EditFormPayload>(props.dataItem ?? {
    serNo: 0,
    compId: '',
    compName: '',
    managerName: '',
    managerTitle: '',
    address: '',
    phone: '',
    email: '',
    beneficiaryDepartment: '',
    confirmStatus: false,
  })

  watch(
    () => props.isEditDialogOpen,
    isOpen => {
      if (isOpen) {
        form.value = { ...props.dataItem }
      }
    },
  )

  watch (
    () => props.dataItem,
    newValue => {
      form.value = { ...newValue }
    },
    { immediate: true, deep: true },
  )

  interface BeneficiaryDpt {
    DpId: string
    DpName: string
  }
  const beneficiaryDptList = ref<BeneficiaryDpt[]>([
    { DpId: '', DpName: '' },
  ])

  // 新增受益人事業部
  function addItems (): void {
    beneficiaryDptList.value.push({ DpId: '', DpName: '' })
  }

  // 刪除受益人事業部
  function deleteItems (index: number): void {
    if (beneficiaryDptList.value.length > 1) {
      beneficiaryDptList.value.splice(index, 1)
    }
  }

  function onClose (): void {
    show.value = false
    emits('on-close')
  }

  function saveData (): void {
    if (formRef.value?.validate()) {
      // 在這裡處理表單提交邏輯
      console.log('表單資料:', form.value)
    }
    emits('on-save')
  }
</script>
