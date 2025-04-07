<script setup>
import { RouterView, useRoute } from 'vue-router'
import SideBar from './components/SideBar.vue';
const route = useRoute();
</script>

<template>
  <div class="app-container">
    <!-- Navbar bên trái -->
    <SideBar v-if="route.name !== 'policy-and-privacy'" />

    <!-- Nội dung chính -->
    <div class="main-content">
      <RouterView />
    </div>
  </div>
</template>

<style lang="css">
/* Container chính */
.app-container {
  display: flex;
  height: 100vh;
  /* Chiều cao toàn màn hình */
  margin: 0;
  padding: 0;
}

/* Nội dung chính */
.main-content {
  flex: 1;
  /* Chiếm toàn bộ không gian còn lại */
  padding: 20px;
  /* Khoảng cách bên trong */
}
</style>
