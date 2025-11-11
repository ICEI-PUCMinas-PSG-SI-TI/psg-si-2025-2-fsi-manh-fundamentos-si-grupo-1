<template>
  <div class="toast toast-top z-20">
    <div
      v-for="notification in useNotifications.notificationList"
      :v-if="!notification.dismissed"
      :key="notification.id"
      class="flex flex-col alert justify-items-center items-start"
      :class="notification.isError ? 'alert-error' : 'alert-info'"
      @click="useNotifications.dismissNotification(notification.id)"
    >
      <strong v-if="notification.title">{{ notification.title }}</strong>
      <span>{{ notification.message }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useNotificationStore } from '@/store/config/toast'

const useNotifications = useNotificationStore()
</script>
