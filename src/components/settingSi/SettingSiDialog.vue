<template>
  <v-dialog
    v-model="show"
    persistent
    width="800"
  >
    <v-card
      class="hnb__dialog"
    >
      <v-card-title class="d-flex px-4 font-weight-bold text-red-darken-3">
        <span>編輯客戶特別指示條款</span>
        <v-spacer />

        <v-btn
          density="comfortable"
          icon="mdi-close"
          variant="flat"
          @click="onClose"
        />
      </v-card-title>

      <v-form ref="formRef">
        <v-card-text class="bg-grey-lighten-4">
          AA
        </v-card-text>

        <v-card-actions>
          <v-spacer />

          <v-btn
            class="hnb__btn--cancel mx-1 my-2"
            @click="onClose"
          >
            關閉
          </v-btn>

          <v-spacer />
        </v-card-actions>
      </v-form>

    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { VForm } from 'vuetify/components'

  const formRef = ref<InstanceType<typeof VForm>>()

  interface Props {
    isSettingSiDialog?: boolean
    data?: string
  }
  const props = withDefaults(defineProps<Props>(), {
    isSettingSiDialog: false,
    data: '',
  })

  const emits = defineEmits<{
    'update:isSettingSiDialog': [boolean]
    'on-close': []
  }>()

  const show = computed({
    get: () => props.isSettingSiDialog,
    set: (value: boolean) => {
      emits('update:isSettingSiDialog', value)
    },
  })

  function onClose (): void {
    show.value = false
    emits('on-close')
  }
</script>
