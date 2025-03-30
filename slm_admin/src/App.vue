<script setup>
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
</script>

<template>

    <div id="app">
        <div>
            <nav style="display: flex; justify-content: space-between; flex-direction: column;">
                <RouterLink class="side_nav" to="/add-pin-pv">Thêm tấm pin PV</RouterLink>
                <RouterLink class="side_nav" to="/add-inverter">Thêm biến tần</RouterLink>
                <RouterLink class="side_nav" to="/add-battery">Thêm pin lưu trữ</RouterLink>
                <RouterLink class="side_nav" to="/add-aluminum-frame">Thêm hệ khung nhôm</RouterLink>
                <RouterLink class="side_nav" to="/combo-create">Tạo Combo</RouterLink>
            </nav>
        </div>
        <div style="width: 100%;">
            <RouterView />
        </div>
    </div>

</template>
<style lang="css">
.side_nav {
    white-space: nowrap;
    /* Không cho xuống dòng */
    width: 150px;
    /* Đặt độ rộng tùy chỉnh */
}
</style>
