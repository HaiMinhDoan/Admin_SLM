<template>
  <div>
    <form action="#" method="get" style="">
      <input type="text" hidden name="template_id" value="2">
      <table border="solid">
        <tbody>
          <tr>
            <td colspan="2">
              <h1 style="display: flex; flex-direction: column; align-items: center;">Tạo tủ điện</h1>
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
            <td>Đơn vị</td>
            <td><input type="text" name="unit" id="unit" placeholder="Đơn vị" required v-model="unit"></td>
          </tr>
          <tr>
            <td>Mô tả trong hợp đồng</td>
            <td><textarea name="description_in_contract" id="" cols="30" rows="10"
                v-model="description_in_contract"></textarea></td>
          </tr>
          <tr>
            <td>Mô tả trong báo giá</td>
            <td><textarea name="description_in_quotation" id="" cols="30" rows="10"
                v-model="description_in_quotation"></textarea></td>
          </tr>
          <tr>
            <td>Ảnh</td>
            <td>
              <div v-for="(image, index) in images" :key="index" style="margin-bottom: 5px;">
                <input type="text" :name="'image_' + index" :placeholder="'Ảnh ' + (index + 1)" v-model="images[index]">
                <button type="button" @click="removeImage(index)">Xóa</button>
              </div>
              <button type="button" @click="addImageInput()">Thêm ảnh</button>
            </td>
          </tr>
          <tr>
            <td>Công suất áp dụng</td>
            <td>
              Từ:<br><input type="number" min="0" name="from_power_kw" id="from_power_kw" v-model="from_power_kw">kW
              <br>
              Đến:<br><input type="number" min="0" name="to_power_kw" id="to_power_kw" v-model="to_power_kw">kW
              <button type="button" @click="getMaxToPower()">Lấy tối đa</button>
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
const unit = ref('')
const description_in_contract = ref('')
const images = ref([])
const phase_type = ref([]); // Khởi tạo phase_type là một mảng
const from_power_kw = ref(0);
const to_power_kw = ref(0);

function getMaxToPower() {
  to_power_kw.value = 10000000
}

const warranty_years = ref(0)
const begin_price = ref(0)
const merchandises = ref([])
const installation_type = ref('Ongrid')
const description_in_quotation = ref('')

const addImageInput = () => {
  images.value.push('')
}
const removeImage = (index) => {
  images.value.splice(index, 1); // Xóa ảnh tại vị trí `index`
};

const createMerchandise = async () => {
  const payload = {
    template_code: 'SOLAR_PANEL_CABINET',
    brand_id: choseBrand.value,
    code: code.value,
    name: name.value,
    data_sheet_link: '',
    unit: unit.value,
    description_in_contract: description_in_contract.value,
    description_in_quotation: description_in_quotation.value,
    data_json: {
      installation_type: installation_type.value,
      from_power_kw: from_power_kw.value,
      to_power_kw: to_power_kw.value,
      phase_type: phase_type.value,
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
    loadMerchandises()
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

// Hàm tải danh sách merchandises
const loadMerchandises = async () => {
  try {
    const response = await fetch(CONST_HOST + '/api/products');
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
</style>
