<template>
    <div>
        <router-link :to="link" class="nav-link" exact-active-class="active">
            <slot></slot>
        </router-link>
        <div class="nav-underline"></div>
    </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>

</style>