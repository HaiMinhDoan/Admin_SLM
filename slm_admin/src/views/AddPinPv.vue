<template>
    <div>
        <form action="#" method="get" style="">
            <input type="text" hidden name="template_id" value="1">
            <table border="solid">
                <tbody>
                    <tr>
                        <td colspan="6" style="">
                            <h1 style="display: flex; flex-direction: column; align-items: center;">Tạo tấm pin</h1>
                        </td>
                    </tr>
                    <tr>
                        <td>Chọn thương hiệu</td>
                        <td>
                            <select name="brand" id="brand_id" v-model="choseBrand" v-on:change="printBrand()">
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
                        <td>Công suất(Watt)</td>
                        <td><input type="number" name="power_watt" id="power_watt" placeholder="Công suất"
                                v-model="power_watt"></td>
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
                        <td>Diện tích(m2)</td>
                        <td><input type="number" name="area_m2" id="area_m2" placeholder="Diện tích" v-model="area_m2">
                        </td>
                    </tr>
                    <tr>
                        <td>Khối lượng(kg)</td>
                        <td><input type="number" name="weight_kg" id="weight_kg" placeholder="Khối lượng"
                                v-model="weight_kg"></td>
                    </tr>
                    <tr>
                        <td>Công nghệ</td>
                        <td><input type="text" name="technology" id="technology" placeholder="Công nghệ"
                                v-model="technology"></td>
                    </tr>
                    <tr>
                        <td>Bảo hành</td>
                        <td><input type="number" name="warranty_years" id="warranty_years" v-model="warranty_years"
                                placeholder="Bảo hành"></td>
                    </tr>
                    <tr>
                        <td>Khởi tạo giá</td>
                        <td><input type="number" name="begin_price" id="begin_price" v-model="begin_price"
                                placeholder="Khởi tạo giá"></td>
                    </tr>
                    <tr>
                        <td colspan="2">
                            <button class="" type="button" @click="createMerchandise()">Tạo</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </form>
    </div>
    <h1>Danh sách vật tư</h1>
    <TableMerchandise :merchandises="merchandises" />
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
const images = ref([])
const power_watt = ref(0)
const width_mm = ref(0)
const height_mm = ref(0)
const thickness_mm = ref(0)
const area_m2 = ref(0)
const weight_kg = ref(0)
const technology = ref('')
const warranty_years = ref(0)
const begin_price = ref(0)

const merchandises = ref([])

const createMerchandise = async () => {
    const sendingData = {
        template_code: 'PIN_PV',
        brand_id: choseBrand.value,
        supplier_id: null,
        code: code.value,
        name: name.value,
        data_sheet_link: data_sheet_link.value,
        unit: unit.value,
        description_in_contract: description_in_contract.value,
        images: images.value,
        begin_price: begin_price.value,
        data_json: {
            power_watt: power_watt.value,
            width_mm: width_mm.value,
            height_mm: height_mm.value,
            thickness_mm: thickness_mm.value,
            area_m2: area_m2.value,
            weight_kg: weight_kg.value,
            technology: technology.value,
            warranty_years: warranty_years.value,
        }
    }
    console.log(JSON.stringify(sendingData))
    const response = await fetch(CONST_HOST + '/api/products/add', {
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
const calculateArea = () => {
    area_m2.value = (width_mm.value * height_mm.value) / 1000000
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
const addImageInput = () => {
    images.value.push('') // Thêm một chuỗi rỗng vào mảng
}
const removeImage = (index) => {
    images.value.splice(index, 1); // Xóa ảnh tại vị trí `index`
};
// Hàm tải danh sách merchandises
const loadMerchandises = async () => {
    try {
        const response = await fetch(CONST_HOST+'/api/products');
        if (response.ok) {
            const data = await response.json();
            merchandises.value = data; // Cập nhật danh sách merchandises
        } else {
            console.error('Failed to load merchandises');
        }
    } catch (error) {
        console.error('Error loading merchandises:', error);
    }
};

onMounted(async () => {
    loadBrands()
    loadMerchandises()
})
</script>

<style lang="css" scoped>
td {
    white-space: nowrap;
    /* Không cho xuống dòng */
    width: 150px;
    /* Đặt độ rộng tùy chỉnh */
}

.btn {
    /* Nút to hơn và đẹp hơn */
    background-color: #4CAF50;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    text-align: center;
    transition: background-color 0.3s ease;
}

.btn:hover {
    background-color: #45a049;
}
</style>