<template>
    <div>
        <form action="#" method="get" style="">
            <input type="text" hidden name="template_id" value="2">
            <table border="1" cellspacing="0" cellpadding="0" class="table table-bordered table-striped table-hover">
                <tbody>
                    <tr>
                        <td>Chọn thương hiệu</td>
                        <td>
                            <select name="brand" id="brand_id" v-model="choseBrand">
                                <option v-for="brand in brands" :value="brand.id">{{ brand.name }}</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td>Mã</td>
                        <td><input type="text" name="code" id="code" placeholder="Mã" required v-model="code"></td>
                    </tr>
                    <tr>
                        <td>Tên</td>
                        <td><input type="text" name="name" id="name" placeholder="Tên" required v-model="name"></td>
                    </tr>
                    <tr>
                        <td>Link data sheet</td>
                        <td>
                            <input type="text" name="data_sheet_link" id="data_sheet_link" placeholder="Data sheet link"
                                required v-model="data_sheet_link">
                        </td>
                    </tr>
                    <tr>
                        <td>Chiều ngang(mm)</td>
                        <td><input type="number" name="width_mm" id="width_mm" placeholder="Chiều ngang"
                                v-model="width_mm" v-on:change="calculateArea()"></td>
                    </tr>
                    <tr>
                        <td>Chiều cao(mm)</td>
                        <td><input type="number" name="height_mm" id="height_mm" placeholder="Chiều cao"
                                v-model="height_mm" v-on:change="calculateArea()"></td>
                    </tr>
                    <tr>
                        <td>Độ dày(mm)</td>
                        <td><input type="number" name="thickness_mm" id="thickness_mm" placeholder="Độ dày"
                                v-model="thickness_mm"></td>
                    </tr>
                    <tr>
                        <td>Đơn vị</td>
                        <td><input type="text" name="unit" id="unit" placeholder="Đơn vị" required v-model="unit"></td>
                    </tr>
                    <tr>
                        <td>Mô tả trong hợp đồng</td>
                        <td><textarea name="description_in_contract" id="" cols="30" rows="10"
                                v-model="description_in_contract"></textarea></td>
                    </tr>
                    <tr>
                        <td>Ảnh</td>
                        <td>
                            <div v-for="(image, index) in images" :key="index" style="margin-bottom: 5px;">
                                <input type="text" :name="'image_' + index" :placeholder="'Ảnh ' + (index + 1)"
                                    v-model="images[index]">
                            </div>
                            <button type="button" @click="addImageInput()">Thêm ảnh</button>
                        </td>
                    </tr>
                    <tr>
                        <td>Công suất AC(KW)</td>
                        <td><input type="number" name="ac_power_kw" id="ac_power_kw" placeholder="Công suất AC"
                                v-model="ac_power_kw"></td>
                    </tr>
                    <tr>
                        <td>Công suất max DC(KW)</td>
                        <td><input type="number" name="dc_max_power_kw" id="dc_max_power_kw"
                                placeholder="Công suất max DC" v-model="dc_max_power_kw">
                        </td>
                    </tr>
                    <tr>
                        <td>Chọn hệ lắp đặt</td>
                        <td>
                            <select name="installation_type" id="installation_type" v-model="installation_type">
                                <option value="Ongrid">Ongrid</option>
                                <option value="Hybrid">Hybrid</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td>Chọn pha</td>
                        <td>
                            <select name="phase_type" id="phase_type" v-model="phase_type">
                                <option value="1-phase">1 pha</option>
                                <option value="3-phase high voltage">3 pha tần cao</option>
                                <option value="3-phase low voltage">3 pha tần thấp</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td>Xếp hạng biến tần</td>
                        <td>
                            <input type="text" name="inverter_rating" id="inverter_rating"
                                placeholder="Xếp hạng biến tần" v-model="inverter_rating">
                        </td>
                    </tr>
                    <tr>
                        <td>Khởi tạo GM</td>
                        <td><input type="number" name="begin_margin" id="begin_margin" v-model="begin_margin"
                                placeholder="Khời tạo GM"></td>
                    </tr>
                </tbody>
            </table>
            <button type="button" @click="createMerchandise()">Tạo</button>
        </form>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'   
const brands = ref([])
const choseBrand = ref(0)
const code = ref('')
const name = ref('')
const data_sheet_link = ref('')
const unit = ref('')
const description_in_contract = ref('')
const width_mm = ref(0)
const height_mm = ref(0)
const thickness_mm = ref(0)
const images = ref([])
const ac_power_kw = ref(0)
const dc_max_power_kw = ref(0)
const installation_type = ref('Ongrid')
const phase_type = ref('1-phase')
const inverter_rating = ref('')
const begin_margin = ref(0)
const createMerchandise = async () => {
    const sendingData = {
        template_id: 2,
        brand_id: choseBrand.value,
        code: code.value,
        name: name.value,
        data_sheet_link: data_sheet_link.value,
        width_mm: width_mm.value,
        height_mm: height_mm.value,
        thickness_mm: thickness_mm.value,
        unit: unit.value,
        description_in_contract: description_in_contract.value,
        images: images.value,
        begin_margin: begin_margin.value,
        data_json: {
            ac_power_kw: ac_power_kw.value,
            dc_max_power_kw: dc_max_power_kw.value,
            installation_type: installation_type.value,
            phase_type: phase_type.value,
            inverter_rating: inverter_rating.value
        }
    }
    console.log(JSON.stringify(sendingData))
    const response = await fetch('http://localhost:8080/api/products/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(sendingData)
    })
    if (response.ok) {
        const data = await response.json()
        console.log(data)
    } else {
        console.error('Failed to create merchandise')
    }
}
const loadBrands = async () => {
    const response = await fetch('http://localhost:8080/api/brands')
    if (response.ok) {
        const data = await response.json()
        brands.value = data
        choseBrand.value = data[0].id
    } else {
        console.error('Failed to load brands')
    }
}
const addImageInput = () => {
    images.value.push('') // Thêm một chuỗi rỗng vào mảng
}
onMounted(() => {
    loadBrands()
})
</script>

<style lang="scss" scoped></style>