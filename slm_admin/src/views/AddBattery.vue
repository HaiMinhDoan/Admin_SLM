<template>
    <div>
        <form action="#" method="get" style="">
            <input type="text" hidden name="template_id" value="2">
            <table border="solid">
                <tbody>
                    <tr>
                        <td colspan="2">
                            <h1 style="display: flex; flex-direction: column; align-items: center;">Tạo pin lưu trữ</h1>
                        </td>
                    </tr>
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
                                v-model="width_mm" v-on:change=""></td>
                    </tr>
                    <tr>
                        <td>Chiều cao(mm)</td>
                        <td><input type="number" name="height_mm" id="height_mm" placeholder="Chiều cao"
                                v-model="height_mm" v-on:change=""></td>
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
                                <button type="button" @click="removeImage(index)">Xóa</button>
                            </div>
                            <button type="button" @click="addImageInput()">Thêm ảnh</button>
                        </td>
                    </tr>
                    <tr>
                        <td>Công suất lưu/đơn vị(KWh)</td>
                        <td><input type="number" name="storage_capacity_kwh" id="storage_capacity_kwh"
                                placeholder="Công suất lưu/đơn vị(KWh)" v-model="storage_capacity_kwh">
                        </td>
                    </tr>
                    <tr>
                        <td>Nâng cấp tối đa(KWh)</td>
                        <td><input type="number" name="max_upgrade_kwh" id="max_upgrade_kwh"
                                placeholder="Nâng cấp tối đa(KWh)" v-model="max_upgrade_kwh">
                        </td>
                    </tr>
                    <tr>
                        <td>Chọn pha</td>
                        <td>
                            <div>
                                <label>
                                    <input type="checkbox" value="1-phase" v-model="phase_type"> 1 pha
                                </label><br>
                                <label>
                                    <input type="checkbox" value="3-phase high voltage" v-model="phase_type"> 3 pha áp
                                    cao
                                </label><br>
                                <label>
                                    <input type="checkbox" value="3-phase low voltage" v-model="phase_type"> 3 pha áp
                                    thấp
                                </label>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>Thương hiệu Pin</td>
                        <td>
                            <input type="text" name="cell_brand" id="cell_brand" placeholder="Xếp hạng biến tần"
                                v-model="cell_brand">
                        </td>
                    </tr>
                    <tr>
                        <td>Phương thức lắp đặt</td>
                        <td>
                            <input type="text" name="installation_method" id="installation_method"
                                placeholder="Phương thức lắp đặt" v-model="installation_method">
                        </td>
                    </tr>
                    <tr>
                        <td>Bảo hành</td>
                        <td><input type="number" name="warranty_years" id="warranty_years" v-model="warranty_years"
                                placeholder="Bảo hành"></td>
                    </tr>
                    <tr>
                        <td>Khởi tạo giá</td>
                        <td><input type="number" name="begin_price" id="begin_price" v-model="begin_price"
                                placeholder="Khời tạo GM"></td>
                    </tr>
                    <tr>
                        <td colspan="2">
                            <button type="button" @click="createMerchandise()">Tạo</button>
                        </td>
                    </tr>
                </tbody>
            </table>

        </form>
    </div>
    <h1>Danh sách vật tư</h1>
    <TableMerchandise />
</template>

<script setup>
import TableMerchandise from '@/components/TableMerchandise.vue'
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
// const CONST_HOST = "http://localhost:8080"
const CONST_HOST = "https://id.slmsolar.com"
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
const phase_type = ref([]); // Khởi tạo phase_type là một mảng
const storage_capacity_kwh = ref(0)
const max_upgrade_kwh = ref(0)
const cell_brand = ref(0)
const installation_method = ref('')
const warranty_years = ref(0)
const begin_price = ref(0)

const addImageInput = () => {
    images.value.push('')
}
const removeImage = (index) => {
    images.value.splice(index, 1); // Xóa ảnh tại vị trí `index`
};

const createMerchandise = async () => {
    const payload = {
        template_code: 'BATTERY_STORAGE',
        brand_id: choseBrand.value,
        code: code.value,
        name: name.value,
        data_sheet_link: data_sheet_link.value,
        unit: unit.value,
        description_in_contract: description_in_contract.value,
        data_json: {
            width_mm: width_mm.value,
            height_mm: height_mm.value,
            thickness_mm: thickness_mm.value,
            storage_capacity_kwh: storage_capacity_kwh.value,
            max_upgrade_kwh: max_upgrade_kwh.value,
            phase_type: phase_type.value,
            cell_brand: cell_brand.value,
            installation_method: installation_method.value,
            warranty_years: warranty_years.value
        },
        images: images.value,
        begin_price: begin_price.value
    }

    try {
        const response = await fetch(`${CONST_HOST}/api/products`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })

        if (!response.ok) {
            throw new Error('Failed to create merchandise')
        }

        const result = await response.json()
        alert('Merchandise created successfully!')
        console.log(result)
    } catch (error) {
        console.error(error)
        alert('Error creating merchandise')
    }
}

const loadBrands = async () => {
    const response = await fetch(CONST_HOST + '/api/brands')
    if (response.ok) {
        const data = await response.json()
        brands.value = data
        choseBrand.value = data[0].id
    } else {
        console.error('Failed to load brands')
    }
}

onMounted(async () => {
    loadBrands()
})

</script>

<style lang="css" scoped>
td {
    white-space: nowrap;
    /* Không cho xuống dòng */
    width: 150px;
    /* Đặt độ rộng tùy chỉnh */
}
</style>