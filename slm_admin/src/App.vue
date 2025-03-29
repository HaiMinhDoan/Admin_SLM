<script setup>
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
</script>

<template style="width: 100%;">

    <div id="app">
        <div style="width: 100%;">
            <nav style="display: flex; justify-content: space-between;">
                <RouterLink to="/add-pin-pv">Add Pin PV</RouterLink>
                <RouterLink to="/add-inverter">Add Inverter</RouterLink>
                <RouterLink to="/combo-create">Create Combo</RouterLink>
            </nav>
        </div><br>
        <div style="width: 100%;">
            <RouterView />
        </div>
    </div>

</template>
