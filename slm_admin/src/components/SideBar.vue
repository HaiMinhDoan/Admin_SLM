<template>
    <nav class="side-navbar">
        <RouterLink class="side-nav-link" to="/add-pin-pv">Thêm tấm pin PV</RouterLink>
        <RouterLink class="side-nav-link" to="/add-inverter">Thêm biến tần</RouterLink>
        <RouterLink class="side-nav-link" to="/add-battery">Thêm pin lưu trữ</RouterLink>
        <RouterLink class="side-nav-link" to="/add-aluminum-frame">Thêm hệ khung nhôm</RouterLink>
        <RouterLink class="side-nav-link" to="/add-cabinet">Thêm tủ điện</RouterLink>
        <RouterLink class="side-nav-link" to="/add-grounding-system">Thêm hệ tiếp địa</RouterLink>
        <RouterLink class="side-nav-link" to="/combo-create">Tạo Combo</RouterLink>
        <RouterLink class="side-nav-link" to="/contract-create">Tạo Hợp đồng mới</RouterLink>
        <RouterLink class="side-nav-link" to="/contract-create-old">Tạo Hợp đồng cũ</RouterLink>
        <RouterLink class="side-nav-link" to="/add-content">Tạo nội dung</RouterLink>
    </nav>
</template>

<script setup>

</script>

<style lang="css" scoped>
/* Navbar bên trái */
.side-navbar {
    width: 200px;
    /* Độ rộng của navbar */
    background-color: #f4f4f4;
    /* Màu nền */
    padding: 20px 10px;
    /* Khoảng cách bên trong */
    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
    /* Đổ bóng */
    display: flex;
    flex-direction: column;
    /* Sắp xếp các link theo cột */
    gap: 10px;
    /* Khoảng cách giữa các link */
}

/* Link trong navbar */
.side-nav-link {
    text-decoration: none;
    /* Bỏ gạch chân */
    color: #333;
    /* Màu chữ */
    padding: 10px 15px;
    /* Khoảng cách bên trong */
    border-radius: 5px;
    /* Bo góc */
    transition: background-color 0.3s ease;
    /* Hiệu ứng hover */
}

.side-nav-link:hover {
    background-color: #ddd;
    /* Màu nền khi hover */
}
</style>