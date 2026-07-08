import { ref } from 'vue'

type SnackbarColor = 'success' | 'error' | 'warning' | 'info'

const visible = ref(false)
const message = ref('')
const color = ref<SnackbarColor>('success')
const timeout = ref(3000)

export function useSnackbar() {
  function show (msg: string, type: SnackbarColor = 'success', ms = 3000) {
    message.value = msg
    color.value = type
    timeout.value = ms
    visible.value = true
  }

  function success (msg: string) {
    show(msg, 'success')
  }

  function error (msg: string) {
    show(msg, 'error', 5000)
  }

  function warning (msg: string) {
    show(msg, 'warning')
  }

  function info (msg: string) {
    show(msg, 'info')
  }

  return { visible, message, color, timeout, show, success, error, warning, info }
}
