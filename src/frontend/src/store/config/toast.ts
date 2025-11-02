import { defineStore } from 'pinia'

export type Notification = {
  id: number
  message: string
  timeout: number
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
    addNotification(message: string, isError: boolean = false, time: number = 5000) {
      const _id = id
      this.notificationList.push({
        id: _id,
        message,
        timeout: setTimeout(() => {
          this.dismissNotification(_id)
        }, time),
        dismissed: false,
        isError,
      })
      id++
    },
  },
})
