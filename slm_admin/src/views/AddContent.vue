<template>
    <div>
        <form action="#" width="100%">
            <table border="solid" width="100%">
                <tbody>
                    <tr>
                        <td colspan="2">
                            <h1 style="display: flex; flex-direction: column; align-items: center;">Tạo nội dung
                            </h1>
                        </td>
                    </tr>
                    <tr>
                        <td>Mã Content</td>
                        <td><input type="text" name="" id="code" v-model="code"></td>
                    </tr>
                    <tr>
                        <td>Tên Content</td>
                        <td><input type="text" name="" id="name" v-model="name"></td>
                    </tr>
                    <tr>
                        <td>Mô tả</td>
                        <td><textarea name="description" id="description" v-model="description"></textarea></td>
                    </tr>
                    <tr>
                        <td>Loại content</td>
                        <td>
                            <select name="selectedCategory" id="selectedCategory" v-model="selectedCategory">
                                <option :value="content_category.id" v-for="content_category in content_categories">{{
                                    content_category.name }}({{ content_category.sector }})</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td>Tiêu đề nội dung</td>
                        <td><input type="text" name="title" id="title" v-model="title"></td>
                    </tr>
                    <tr>
                        <td>Hashtag</td>
                        <td><input type="text" name="hashtag" id="hashtag" v-model="hashtag"></td>
                    </tr>
                    <tr>
                        <td>Nội dung chi tiết</td>
                        <td>
                            <Editor v-model="content" :init="editorConfig" api-key="bxb68lg12i11zhb0ei9ubbfw1t388posa12jg0hpmq8570dg"></Editor>
                        </td>
                    </tr>
                    <tr>
                        <td>Thêm Media</td>
                        <td>
                            <div>
                                <input type="text" v-model="newMedia.title" placeholder="Nhập tiêu đề media" /><br>
                                <select v-model="newMedia.kind">
                                    <option value="image">Ảnh</option>
                                    <option value="video">Video</option>
                                </select><br>
                                <input type="text" v-model="newMedia.link"
                                    :placeholder="newMedia.kind === 'image' ? 'Nhập URL ảnh' : 'Nhập URL hoặc ID video YouTube'" />
                                <br>
                                <button type="button" @click="addMedia">Thêm</button>
                            </div>
                            <ul>
                                <li v-for="(media, index) in mediaList" :key="index" style="margin-top: 10px;">
                                    <div>
                                        <strong>{{ media.title }}</strong> ({{ media.kind }})
                                        <button type="button" @click="removeMedia(index)"
                                            style="margin-left: 10px;">Xóa</button>
                                    </div>
                                    <div v-if="media.kind === 'image'" style="margin-top: 5px;">
                                        <img :src="media.link" alt="Image Preview"
                                            style="width: 100px; height: auto;" />
                                    </div>
                                    <div v-else-if="media.kind === 'video'" style="margin-top: 5px;">
                                        <iframe :src="`https://www.youtube.com/embed/${media.link}`" frameborder="0"
                                            allowfullscreen style="width: 200px; height: 150px;"></iframe>
                                    </div>
                                </li>
                            </ul>
                        </td>
                    </tr>
                    <tr>
                        <td>Thêm vật nội dung</td>
                        <td>
                            <button type="button" @click="createContent()">Tạo nội dung</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </form>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import Editor from '@tinymce/tinymce-vue';
// const CONST_HOST = "http://localhost:8080"
const CONST_HOST = "https://id.slmsolar.com"

const content_categories = ref([])
const description = ref('')
const title = ref('')
const name = ref('')
const hashtag = ref('')
const content = ref('')
const code = ref('')
const selectedCategory = ref(0)
const mediaList = ref([]); // Mảng lưu trữ danh sách media
const newMedia = ref({
    title: '',
    kind: 'image', // Mặc định là ảnh
    link: ''
}); // Biến lưu thông tin media mới
// Cấu hình TinyMCE
const editorConfig = {
    height: 500,
    width: 1000,
    menubar: true,
    plugins: 'lists link image table code',
    toolbar: 'undo redo | formatselect | bold italic | alignleft aligncenter alignright | bullist numlist outdent indent | link image table | code',
    branding: false
};
// Hàm thêm media vào danh sách
const addMedia = () => {
    if (newMedia.value.title.trim() !== '' && newMedia.value.link.trim() !== '') {
        // Nếu là video, kiểm tra xem link có phải là ID hợp lệ
        if (newMedia.value.kind === 'video') {
            const youtubeIdRegex = /^[a-zA-Z0-9_-]{11}$/; // Regex kiểm tra ID video YouTube
            if (!youtubeIdRegex.test(newMedia.value.link)) {
                alert('Vui lòng nhập một ID video YouTube hợp lệ (11 ký tự)!');
                return;
            }
        }

        // Thêm media vào danh sách
        mediaList.value.push({ ...newMedia.value });
        newMedia.value = { title: '', kind: 'image', link: '' }; // Reset form
    } else {
        alert('Vui lòng nhập đầy đủ thông tin media!');
    }
};

// Hàm xóa media khỏi danh sách
const removeMedia = (index) => {
    mediaList.value.splice(index, 1);
};

// Hàm lấy dữ liệu từ API
const fetchContentCategories = async () => {
    try {
        const response = await fetch(`${CONST_HOST}/api/content_category`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const data = await response.json();
            content_categories.value = data; // Gán dữ liệu vào biến content_categories
        } else {
            console.error('Failed to fetch content categories');
        }
    } catch (error) {
        console.error('Error fetching content categories:', error);
    }
};

const createContent = async () => {
    const payload = {
        code: code.value,
        name: name.value,
        description: description.value,
        content_category_id: selectedCategory.value,
        title: title.value,
        hashtag: hashtag.value,
        content: content.value,
        media_contents: mediaList.value // Gửi danh sách media
    };

    try {
        const response = await fetch(`${CONST_HOST}/api/content`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            alert('Content đã được thêm thành công!');
        } else {
            console.error('Failed to submit content');
        }
    } catch (error) {
        console.error('Error submitting content:', error);
    }
};


// Gọi hàm fetchContentCategories khi component được mount
onMounted(() => {
    fetchContentCategories();
});

</script>

<style lang="css" scoped>
td {
    white-space: nowrap;
    /* Không cho xuống dòng */
    width: 150px;
    /* Đặt độ rộng tùy chỉnh */
}
</style>