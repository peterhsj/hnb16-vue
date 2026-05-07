<template>
  <v-dialog
    v-model="show"
    persistent
    width="auto"
  >
    <v-card
      max-width="400"
      min-width="300"
    >
      <v-card-title class="px-6 text-subtitle-1 bg-blue-darken-2">
        {{ props.messageTitle }}
      </v-card-title>
      <v-card-text class="d-flex align-center">
        <span class="mr-4">
          <v-icon
            v-if="props.messageStatus === 'alert'"
            class="my-4"
            color="orange-darken-1"
            icon="mdi-alert-circle-outline"
            size="60"
          />
          <v-icon
            v-else-if="props.messageStatus === 'success'"
            class="my-4"
            color="green-darken-1"
            icon="mdi-check-circle-outline"
            size="60"
          />
        </span>
        <div v-html="props.message" />
      </v-card-text>
      <v-card-actions>
        <v-spacer />

        <v-btn
          class="text-white"
          color="blue-grey-lighten-3"
          variant="flat"
          @click="onClose"
        >
          離開
        </v-btn>

        <v-btn
          v-if="props.isConfirmBtn"
          color="light-blue-darken-2"
          variant="flat"
          @click="promptConfirm"
        >
          確認
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
  import { ref, watch } from 'vue'
  interface Props {
    messageDialog?: boolean
    messageTitle?: string
    message?: string
    messageStatus?: string
    isConfirmBtn?: boolean
  }
  const props = withDefaults(defineProps<Props>(), {
    messageDialog: false,
    messageTitle: '提示',
    message: '',
    messageStatus: '',
    isConfirmBtn: false,
  })

  const show = ref<boolean>(props.messageDialog)
  watch(
    () => props.messageDialog,
    newVal => {
      show.value = newVal
    },
  )
  watch(
    () => show.value,
    newVal => {
      emit('update:messageDialog', newVal)
    },
  )

  const emit = defineEmits<{
    'update:messageDialog': [boolean]
    'prompt-confirm': []
    'on-close': []
  }>()

  function onClose (): void {
    show.value = false
    emit('on-close')
  }

  function promptConfirm (): void {
    emit('prompt-confirm')
    show.value = false
  }
</script>
