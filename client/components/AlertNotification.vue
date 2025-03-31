<script setup lang="ts">
interface Props {
  message: string;
  color: string;
}

defineProps<Props>();

const isShown = defineModel<boolean>({required: true});

watch(() => isShown.value, () => {
  if (isShown.value) {
    setTimeout(() => {
      isShown.value = false;
      navigateTo('/login');
    }, 1000);
  }
});
</script>

<template>
  <transition name="slide-fade">
    <v-alert
      v-if="isShown"
      :color
      class="position-fixed notification"
    >
      {{ message }}
    </v-alert>
  </transition>
</template>

<style scoped>
  .notification {
    top: 80px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1000;
    max-width: 300px;
  }

  .slide-fade-enter-active, .slide-fade-leave-active {
    transition: all 0.3s ease-in-out;
  }

  .slide-fade-enter-from {
    transform: translate(-50%, -40px);
    opacity: 0;
  }

  .slide-fade-leave-to {
    transform: translate(-50%, -40px);
    opacity: 0;
  }
</style>