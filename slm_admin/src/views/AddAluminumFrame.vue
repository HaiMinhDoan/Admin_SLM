<template>
    <div>
        <form action="#" method="get" style="">
            <input type="text" hidden name="template_id" value="2">
            <table border="solid">
                <tbody>
                    <tr>
                        <td colspan="2">
                            <h1 style="display: flex; flex-direction: column; align-items: center;">Tạo hệ khung nhôm
                            </h1>
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
                        <td>Kiểu lắp đặt</td>
                        <td>
                            <div>
                                <label>
                                    <input type="checkbox" value="Áp mái tôn" v-model="installation_type"> Áp mái tôn
                                </label><br>
                                <label>
                                    <input type="checkbox" value="Mái ngói" v-model="installation_type"> Mái ngói
                                </label><br>
                                <label>
                                    <input type="checkbox" value="Khung sắt" v-model="installation_type"> Khung sắt
                                </label>
                            </div>
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
const installation_type = ref([]); // Khởi tạo installation_type là một mảng
const warranty_years = ref('')
const begin_price = ref(0)
const merchandises = ref([])
// hoàn thiện code 
const route = useRoute();
const loadBrands = async () => {
    try {
        const response = await fetch(`${CONST_HOST}/api/brands`);
        if (response.ok) {
            const data = await response.json();
            brands.value = data;
            if (brands.value.length > 0) {
                choseBrand.value = brands.value[0].id
            }
        } else {
            console.error('Failed to fetch brands:', response.statusText);
        }
    } catch (error) {
        console.error('Error fetching brands:', error);
    }
}

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

const createMerchandise = async () => {
    const payload = {
        template_code: 'ALUMINUM_FRAME',
        supplier_id: null,
        brand_id: choseBrand.value,
        code: code.value,
        name: name.value,
        data_sheet_link: data_sheet_link.value,
        unit: unit.value,
        description_in_contract: description_in_contract.value,
        images: images.value,
        data_json: {
            installation_type: installation_type.value,
            warranty_years: warranty_years.value
        },
        begin_price: begin_price.value,
    };

    try {
        const response = await fetch(`${CONST_HOST}/api/products`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (response.ok) {
            const result = await response.json();
            alert('Tạo thành công!');
            loadMerchandises()
            console.log('Created merchandise:', result);
        } else {
            console.error('Failed to create merchandise:', response.statusText);
            alert('Tạo thất bại!');
        }
    } catch (error) {
        console.error('Error creating merchandise:', error);
        alert('Có lỗi xảy ra!');
    }
};

const addImageInput = () => {
    images.value.push('')
}
const removeImage = (index) => {
    images.value.splice(index, 1); // Xóa ảnh tại vị trí `index`
};
</script>

<style lang="css" scoped>
td {
    white-space: nowrap;
    /* Không cho xuống dòng */
    width: 150px;
    /* Đặt độ rộng tùy chỉnh */
}
</style>