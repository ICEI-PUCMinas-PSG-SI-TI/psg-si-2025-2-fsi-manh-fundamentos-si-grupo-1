import { defineStore } from 'pinia'

export type Notification = {
  id: number
  title?: string
  message: string
  timeout: NodeJS.Timeout
  dismissed: boolean
  isError: boolean
}

let id = 0

export const useNotificationStore = defineStore('toast', {
  state: () => ({
    notificationList: [] as Notification[],
  }),
  actions: {
    dismissNotification(_id: number) {
      for (let i = 0; i < this.notificationList.length; i++) {
        if (this.notificationList[i].id === _id) this.notificationList.splice(i, 1)
      }
    },
    addNotification(
      message: string,
      opts?: {
        isError?: true
        time?: number
        title?: string
      },
    ) {
      const _id = id
      this.notificationList.push({
        id: _id,
        title: opts?.title,
        message,
        timeout: setTimeout(() => {
          this.dismissNotification(_id)
        }, opts?.time || 5000),
        dismissed: false,
        isError: opts?.isError || false,
      })
      id++
    },
  },
})
