<template>
    <div class="excel-table-container">
        <table id="excel-like-table" class="excel-table">
            <thead>
                <tr>
                    <th v-for="(header, index) in headers" :key="index" class="excel-header">
                        {{ header.label }}
                        <div class="excel-resizer"></div>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, rowIndex) in localMerchandises" :key="rowIndex">
                    <td class="excel-cell">{{ item.id }}</td>
                    <td class="excel-cell">{{ item.template?.name || '' }}</td>
                    <td class="excel-cell">{{ item.brand?.name || '' }}</td>
                    <td class="excel-cell">{{ item.supplier?.name || '' }}</td>
                    <td class="excel-cell">{{ item.code }}</td>
                    <td class="excel-cell">{{ item.name }}</td>
                    <td class="excel-cell">
                        <a class="" target="_blank" :href="item.data_sheet_link">{{ item.data_sheet_link }}</a>
                    </td>
                    <td class="excel-cell">{{ item.unit }}</td>
                    <td class="excel-cell">{{ item.description_in_contract }}</td>
                    <td class="excel-cell">
                        <div class="cell-content">{{ item.data_json }}</div>
                    </td>
                    <td class="excel-cell">{{ item.created_at }}</td>
                    <td class="excel-cell">{{ item.active }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
// const CONST_HOST = "http://localhost:8080"
const CONST_HOST = "https://id.slmsolar.com"
const props = defineProps({
    merchandises: {
        type: Array,
        required: false,
        default: () => []
    }
});
// Biến nội bộ để lưu danh sách merchandises
const localMerchandises = ref([]);

const headers = [
    { label: 'ID', width: 80 },
    { label: 'Nhóm vật tư', width: 150 },
    { label: 'Thương hiệu', width: 150 },
    { label: 'Nhà cung cấp', width: 150 },
    { label: 'Mã sản phẩm', width: 150 },
    { label: 'Tên sản phẩm', width: 200 },
    { label: 'Link thông tin', width: 200 },
    { label: 'Đơn vị', width: 100 },
    { label: 'Mô tả trong hợp đồng', width: 250 },
    { label: 'Thông tin tuỳ biến', width: 200 },
    { label: 'Thời gian tạo', width: 150 },
    { label: 'Active', width: 100 }
]

const loadMerchandises = async () => {
    try {
        const response = await fetch(`${CONST_HOST}/api/products`, {
            method: 'GET'
        });
        if (response.ok) {
            const data = await response.json();
            localMerchandises.value = data; // Lưu dữ liệu vào biến nội bộ
            console.log('Merchandises loaded successfully:', data);
        } else {
            console.error('Failed to load merchandises');
        }
    } catch (error) {
        console.error('Error loading merchandises:', error);
    }
};
// Theo dõi prop `merchandises` để cập nhật danh sách
watch(
    () => props.merchandises,
    (newMerchandises) => {
        if (newMerchandises.length > 0) {
            localMerchandises.value = newMerchandises; // Nếu có dữ liệu từ prop, sử dụng nó
        } else {
            loadMerchandises(); // Nếu không có, tự động tải từ API
        }
    },
    { immediate: true } // Gọi ngay khi component được mount
);

onMounted(() => {
    if (props.merchandises.length === 0) {
        loadMerchandises();
    }

    // Chờ một chút để DOM được render
    setTimeout(() => {
        initializeResizableTable()
    }, 500)
})

function initializeResizableTable() {
    const table = document.getElementById('excel-like-table');
    if (!table) {
        console.error('Table not found');
        return;
    }

    const cols = table.querySelectorAll('th');

    // Thiết lập chiều rộng ban đầu cho các cột
    cols.forEach((col, i) => {
        const width = headers[i]?.width || 100;
        col.style.width = `${width}px`;
        col.style.minWidth = `${width}px`;
    });

    // Thêm sự kiện mousedown cho các resizer
    table.addEventListener('mousedown', function (e) {
        if (e.target.className === 'excel-resizer') {
            const resizer = e.target;
            const th = resizer.parentElement;
            
            // Vị trí X ban đầu
            const startX = e.clientX;
            
            // Chiều rộng ban đầu của cột
            const startWidth = th.getBoundingClientRect().width;
            
            // Thêm class khi đang resize
            th.classList.add('resizing');
            
            // Thêm sự kiện mousemove vào document
            document.addEventListener('mousemove', handleMouseMove);
            
            function handleMouseMove(e) {
                // Tính toán sự thay đổi vị trí chuột
                const deltaX = e.clientX - startX;
                
                // Tính chiều rộng mới với giới hạn tối thiểu 50px
                const newWidth = Math.max(50, startWidth + deltaX);
                
                // Áp dụng chiều rộng mới chỉ cho cột đang được resize
                th.style.width = `${newWidth}px`;
                th.style.minWidth = `${newWidth}px`;
            }
            
            // Xử lý sự kiện mouseup
            function handleMouseUp() {
                th.classList.remove('resizing');
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            }
            
            // Thêm sự kiện mouseup
            document.addEventListener('mouseup', handleMouseUp);
        }
    });
}
</script>

<style>
.excel-table-container {
    overflow-x: auto;
    /* Cuộn ngang nếu nội dung quá rộng */
    overflow-y: auto;
    /* Cuộn dọc nếu nội dung quá cao */
    max-height: 600px;
    /* Giới hạn chiều cao của bảng (có thể tùy chỉnh) */
    width: 100%;
    max-width: 100%;
    /* Chiếm toàn bộ chiều rộng */
    margin-bottom: 20px;
    border: 1px solid #ccc;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    position: relative;
    /* Đảm bảo header cố định hoạt động đúng */
}

.excel-table {
    border-collapse: collapse;
    width: 100%;
    /* Đảm bảo bảng chiếm toàn bộ chiều rộng container */
    font-family: 'Segoe UI', Arial, sans-serif;
    font-size: 14px;
    table-layout: fixed;
}

thead {
    position: sticky;
    /* Giữ cố định header khi cuộn */
    top: 0;
    /* Cố định header ở đầu container */
    z-index: 2;
    /* Đảm bảo header nằm trên các nội dung khác */
    background-color: #378a21;
    /* Màu nền của header */
    color: white;
    /* Màu chữ của header */
}

.excel-header {
    position: sticky;
    top: 0;
    background-color: #378a21;
    color: white;
    text-align: left;
    padding: 8px;
    border: 1px solid #bbb;
    font-weight: bold;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    height: 32px;
    box-sizing: border-box;
    /* min-width: 50px;
    max-width: 300px; */
}

.excel-header:hover {
    background-color: #d9d9d9;
    color: #333;
}

.excel-cell {
    padding: 6px 8px;
    border: 1px solid #ddd;
    max-width: 0;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    background-color: #fff;
    height: 28px;
    color: #333;
    box-sizing: border-box;
}

tr:nth-child(even) .excel-cell {
    background-color: #f9f9f9;
}

tr:hover .excel-cell {
    background-color: #f0f5fc;
}

.cell-content {
    overflow-x: hidden;
    white-space: nowrap;
    max-width: 100%;
    text-overflow: ellipsis;
}

.excel-resizer {
    position: absolute;
    top: 0;
    right: 0;
    width: 5px;
    height: 100%;
    cursor: col-resize;
    z-index: 1;
}

.excel-resizer:hover,
.resizing .excel-resizer {
    background-color: #0078d7;
}

.resizing {
    background-color: #e6f2ff !important;
    user-select: none;
}

.excel-table-container::-webkit-scrollbar {
    width: 8px;
    /* Độ rộng của scrollbar */
    height: 8px;
    /* Độ cao của scrollbar ngang */
}

.excel-table thead {
    border-bottom: 2px solid #a9a9a9;
}

/* Add freezing header */
thead {
    position: sticky;
    top: 0;
    z-index: 2;
}

/* Add scrollbar styling */
.excel-table-container::-webkit-scrollbar {
    height: 10px;
    width: 10px;
    background: #f1f1f1;
}

.excel-table-container::-webkit-scrollbar-track {
    background: #f1f1f1;
}

.excel-table-container::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 5px;
}

.excel-table-container::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
}

/* Add Excel-like selected state */
.excel-cell.selected {
    background-color: #e0ecff !important;
    border: 1px solid #0078d7;
}
</style>