<template>
  <div class="toast toast-top">
    <div
      v-for="notification in useNotifications.notificationList"
      :v-if="!notification.dismissed"
      :key="notification.id"
      class="alert"
      :class="notification.isError ? 'alert-error' : 'alert-info'"
      @click="useNotifications.dismissNotification(notification.id)"
    >
      <span>{{ notification.message }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useNotificationStore } from '@/store/config/toast'

const useNotifications = useNotificationStore()
</script>
