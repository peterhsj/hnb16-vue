import { ref } from 'vue'

interface MessageOptions {
  text: string
  color?: 'success' | 'error' | 'warning' | 'info'
  timeout?: number
}

const visible = ref(false)
const message = ref('')
const color = ref<string>('info')
const timeout = ref(3000)

export function useMessage () {
  const show = (options: MessageOptions | string) => {
    if (typeof options === 'string') {
      message.value = options
      color.value = 'info'
      timeout.value = 3000
    } else {
      message.value = options.text
      color.value = options.color || 'info'
      timeout.value = options.timeout || 3000
    }
    visible.value = true
  }

  const success = (text: string, opts?: Omit<MessageOptions, 'text' | 'color'>) => {
    show({ text, color: 'success', ...opts })
  }

  const error = (text: string, opts?: Omit<MessageOptions, 'text' | 'color'>) => {
    show({ text, color: 'error', ...opts })
  }

  const warning = (text: string, opts?: Omit<MessageOptions, 'text' | 'color'>) => {
    show({ text, color: 'warning', ...opts })
  }

  const info = (text: string, opts?: Omit<MessageOptions, 'text' | 'color'>) => {
    show({ text, color: 'info', ...opts })
  }

  return {
    visible,
    message,
    color,
    timeout,
    show,
    success,
    error,
    warning,
    info,
  }
}
