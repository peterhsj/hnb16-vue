<template>
  <v-dialog
    v-model="show"
    persistent
    width="1000"
  >
    <v-card
      class="hnb__dialog"
    >
      <v-card-title class="d-flex px-4 font-weight-bold text-red-darken-3">
        <span>信用狀修改申請書</span>
        <v-spacer />

        <v-btn
          density="comfortable"
          icon="mdi-close"
          variant="flat"
          @click="onClose"
        />
      </v-card-title>

      <v-card-text class="bg-grey-lighten-4" style="max-height: 70vh; overflow-y: auto;">
        <AmendLcInfo :ben-type="props.benType" :data="data" />
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
  import { ref, watch } from 'vue'
  interface Props {
    appDialog?: boolean
    appNo?: string
    benType?: string
  }
  const props = withDefaults(defineProps<Props>(), {
    appDialog: false,
    appNo: '',
    benType: '',
  })

  const show = ref<boolean>(props.appDialog)
  watch(
    () => props.appDialog,
    newVal => {
      show.value = newVal
    },
  )
  watch(
    () => show.value,
    newVal => {
      emit('update:appDialog', newVal)
    },
  )

  const emit = defineEmits<{
    'update:appDialog': [boolean]
    'on-close': []
  }>()

  const data = ref({})

  function onClose (): void {
    show.value = false
    emit('on-close')
  }
</script>
