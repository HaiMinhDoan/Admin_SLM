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
                <tr v-for="(item, rowIndex) in merchandises" :key="rowIndex">
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
import { ref, onMounted } from 'vue'

// const CONST_HOST = "http://localhost:8080"
const CONST_HOST = "https://id.slmsolar.com"

const merchandises = ref([])

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

const getAllMerchandises = async () => {
    try {
        const response = await fetch(CONST_HOST + '/api/products', {
            method: 'GET',
        })
        if (response.ok) {
            const data = await response.json()
            merchandises.value = data
            console.log('Data loaded successfully')
        } else {
            console.error('Failed to get merchandises')
        }
    } catch (error) {
        console.error('Error fetching data:', error)
    }
}

onMounted(() => {
    getAllMerchandises()

    // Chờ một chút để DOM được render
    setTimeout(() => {
        initializeResizableTable()
    }, 500)
})

function initializeResizableTable() {
    const table = document.getElementById('excel-like-table')
    if (!table) {
        console.error('Table not found')
        return
    }

    const cols = table.querySelectorAll('th')

    // Thiết lập chiều rộng ban đầu cho các cột
    cols.forEach((col, i) => {
        const width = headers[i]?.width || 100
        col.style.width = `${width}px`
        col.style.minWidth = `${width}px`
    })

    // Thêm sự kiện mousedown cho các resizer
    table.addEventListener('mousedown', function (e) {
        if (e.target.className === 'excel-resizer') {
            const resizer = e.target
            const th = resizer.parentElement

            // Vị trí X ban đầu
            const startX = e.clientX

            // Chiều rộng ban đầu của cột
            const startWidth = th.getBoundingClientRect().width

            // Thêm class khi đang resize
            th.classList.add('resizing')

            // Thêm sự kiện mousemove vào document
            document.addEventListener('mousemove', handleMouseMove)

            // Hàm xử lý mousemove
            function handleMouseMove(e) {
                // Tính toán chiều rộng mới (không nhỏ hơn 50px)
                const width = Math.max(50, startWidth + e.clientX - startX)

                // Áp dụng chiều rộng mới chỉ cho cột này
                th.style.width = `${width}px`
                th.style.minWidth = `${width}px`
            }

            // Xử lý sự kiện mouseup
            function handleMouseUp() {
                th.classList.remove('resizing')
                document.removeEventListener('mousemove', handleMouseMove)
                document.removeEventListener('mouseup', handleMouseUp)
            }

            // Thêm sự kiện mouseup
            document.addEventListener('mouseup', handleMouseUp)
        }
    })
}
</script>

<style>
/* .excel-table-container {
    overflow-x: auto;
    width: 100%;
    margin-bottom: 20px;
} */

/* .excel-table {
    border-collapse: collapse;
    width: max-content;
    min-width: 100%;
    border: 1px solid #ddd;
} */

/* .excel-header {
    position: relative;
    background-color: #f2f2f2;
    text-align: left;
    padding: 8px;
    border: 1px solid #ddd;
    font-weight: bold;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
} */

/* .excel-cell {
    padding: 8px;
    border: 1px solid #ddd;
    max-width: 0;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
} */

/* .cell-content {
    overflow-x: auto;
    white-space: nowrap;
    max-width: 100%;
} */

/* .excel-resizer {
    position: absolute;
    top: 0;
    right: 0;
    width: 5px;
    height: 100%;
    cursor: col-resize;
    z-index: 1;
} */

/* .excel-resizer:hover,
.resizing .excel-resizer {
    background-color: #0077ff;
} */

/* .resizing {
    background-color: #e6f2ff !important;
    user-select: none;
} */

/* Thêm thanh cuộn ngang cho nội dung dài trong ô */
/* .excel-cell:hover {
    overflow: visible;
    z-index: 1;
} */

/* .excel-cell:hover .cell-content {
    background-color: white;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
    position: absolute;
    padding: 8px;
    left: 0;
    max-width: 300px;
} */

.excel-table-container {
    overflow-x: auto;
    width: 100%;
    margin-bottom: 20px;
    border: 1px solid #ccc;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.excel-table {
    border-collapse: collapse;
    width: max-content;
    min-width: 100%;
    font-family: 'Segoe UI', Arial, sans-serif;
    font-size: 14px;
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

/* Improved hover effect for cells with long content */
/* .excel-cell:hover .cell-content {
    overflow: visible;
    position: absolute;
    background-color: #fff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    padding: 6px 8px;
    border: 1px solid #bbb;
    z-index: 10;
    left: 0;
    max-width: 300px;
    white-space: normal;
    word-break: break-word;
} */

/* Add Excel-like grid lines */
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