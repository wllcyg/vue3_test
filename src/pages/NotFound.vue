<template>
  <v-container fluid class="not-found-container fill-height">
    <v-row justify="center" align="center">
      <v-col cols="12" sm="10" md="8" lg="6" xl="4">
        <v-card class="pa-6 text-center not-found-card" elevation="5">
          <v-card-text>
            <v-img
              :src="NoteFoundImage"
              alt="404 Illustration"
              max-height="300"
              contain
              class="mb-6"
            ></v-img>

            <h1 class="text-h4 font-weight-bold mb-3">哎呀！页面未找到</h1>

            <p class="text-body-1 mb-6 text-medium-emphasis">
              看起来您要寻找的页面已经迷路了，或者可能不存在。
              <v-icon small>mdi-compass-off-outline</v-icon>
            </p>

            <v-btn
              color="primary"
              x-large
              rounded
              class="mb-4 elevation-3"
              :to="{ path: '/home' }"
            >
              <v-icon left>mdi-home</v-icon>
              返回首页
            </v-btn>

            <div class="mt-8 text-caption text-medium-emphasis">
              <v-icon x-small class="mr-1">mdi-clock-outline</v-icon>
              您将在 <span class="font-weight-bold">{{ countdown }}</span> 秒后自动跳转到首页
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import NoteFoundImage from '@/assets/404.svg'
const countdown = ref(10)
const timer = ref(null)

onMounted(() => {
  timer.value = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer.value)
      window.location.href = '/home'
    }
  }, 1000)
})

onBeforeUnmount(() => {
  clearInterval(timer.value)
})


</script>

<style scoped>
.not-found-container {
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
  min-height: 100vh;
}

.not-found-card {
  border-radius: 16px;
  overflow: hidden;
  position: relative;
}

.not-found-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(90deg, var(--v-primary-base), var(--v-secondary-base), var(--v-error-base));
}

.error-code {
  font-size: 5rem;
  font-weight: 900;
  letter-spacing: -2px;
  text-shadow: 3px 3px 0 rgba(0, 0, 0, 0.1);
}

@media (max-width: 600px) {
  .error-code {
    font-size: 4rem;
  }
}

@keyframes floating {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-15px); }
  100% { transform: translateY(0px); }
}

.v-img {
  animation: floating 3s ease-in-out infinite;
}
</style>
