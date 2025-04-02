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
                        <td style="color: black;">
                            <div class="editor-container editor-container_document-editor editor-container_include-word-count"
                                ref="editorContainerElement">
                                <div class="editor-container__menu-bar" ref="editorMenuBarElement"></div>
                                <div class="editor-container__toolbar" ref="editorToolbarElement"></div>
                                <div class="editor-container__editor-wrapper">
                                    <div class="editor-container__editor">
                                        <div ref="editorElement">
                                            <ckeditor v-if="editor && config" :modelValue="config.initialData"
                                                :editor="editor" :config="config" @ready="onReady" v-model="content"/>
                                        </div>
                                    </div>
                                </div>
                                <div class="editor_container__word-count" ref="editorWordCountElement"></div>
                            </div>
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
                        <td>Thêm nội dung</td>
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
import { ref, onMounted, useTemplateRef,computed } from 'vue'
import { useRoute } from 'vue-router'
import { Ckeditor } from '@ckeditor/ckeditor5-vue';
import '../assets/style.css';
// const CONST_HOST = "http://localhost:8080"
const CONST_HOST = "https://id.slmsolar.com"

import {
	DecoupledEditor,
	Alignment,
	AutoLink,
	Autosave,
	BalloonToolbar,
	Bold,
	Code,
	Essentials,
	FontBackgroundColor,
	FontColor,
	FontFamily,
	FontSize,
	Heading,
	HorizontalLine,
	ImageEditing,
	ImageUtils,
	Indent,
	IndentBlock,
	Italic,
	Link,
	Paragraph,
	RemoveFormat,
	Strikethrough,
	Subscript,
	Superscript,
	Table,
	TableCaption,
	TableCellProperties,
	TableColumnResize,
	TableProperties,
	TableToolbar,
	TextPartLanguage,
	Title,
	Underline,
	WordCount
} from 'ckeditor5';

import translations from 'ckeditor5/translations/vi.js';

import 'ckeditor5/ckeditor5.css';

const LICENSE_KEY =
	'eyJhbGciOiJFUzI1NiJ9.eyJleHAiOjE3NDQ4NDc5OTksImp0aSI6IjRkNWRlZmY3LTc4OWMtNDNlNC1hZTBmLWMzYjk4NjgwYTM5YyIsInVzYWdlRW5kcG9pbnQiOiJodHRwczovL3Byb3h5LWV2ZW50LmNrZWRpdG9yLmNvbSIsImRpc3RyaWJ1dGlvbkNoYW5uZWwiOlsiY2xvdWQiLCJkcnVwYWwiLCJzaCJdLCJ3aGl0ZUxhYmVsIjp0cnVlLCJsaWNlbnNlVHlwZSI6InRyaWFsIiwiZmVhdHVyZXMiOlsiKiJdLCJ2YyI6IjAyMWVhOGUxIn0.Q6Igx3cWrL7tETWI-rEwu2eWYTj7OOcKf8PZhn0PqPEkJDtzGGD71ReRvx21-Dm2F0C0qr-c2TrhHhblYQbPCA';

const editorToolbar = useTemplateRef('editorToolbarElement');
const editorMenuBar = useTemplateRef('editorMenuBarElement');
const editorWordCount = useTemplateRef('editorWordCountElement');
const isLayoutReady = ref(false);

// function printContent(){
//     console.log(content.value);
    
// }
const editor = DecoupledEditor;

const config = computed(() => {
	if (!isLayoutReady.value) {
		return null;
	}

	return {
		toolbar: {
			items: [
				'textPartLanguage',
				'|',
				'heading',
				'|',
				'fontSize',
				'fontFamily',
				'fontColor',
				'fontBackgroundColor',
				'|',
				'bold',
				'italic',
				'underline',
				'strikethrough',
				'subscript',
				'superscript',
				'code',
				'removeFormat',
				'|',
				'horizontalLine',
				'link',
				'insertTable',
				'|',
				'alignment',
				'|',
				'outdent',
				'indent'
			],
			shouldNotGroupWhenFull: false
		},
		plugins: [
			Alignment,
			AutoLink,
			Autosave,
			BalloonToolbar,
			Bold,
			Code,
			Essentials,
			FontBackgroundColor,
			FontColor,
			FontFamily,
			FontSize,
			Heading,
			HorizontalLine,
			ImageEditing,
			ImageUtils,
			Indent,
			IndentBlock,
			Italic,
			Link,
			Paragraph,
			RemoveFormat,
			Strikethrough,
			Subscript,
			Superscript,
			Table,
			TableCaption,
			TableCellProperties,
			TableColumnResize,
			TableProperties,
			TableToolbar,
			TextPartLanguage,
			Title,
			Underline,
			WordCount
		],
		balloonToolbar: ['bold', 'italic', '|', 'link'],
		fontFamily: {
			supportAllValues: true
		},
		fontSize: {
			options: [10, 12, 14, 'default', 18, 20, 22],
			supportAllValues: true
		},
		heading: {
			options: [
				{
					model: 'paragraph',
					title: 'Paragraph',
					class: 'ck-heading_paragraph'
				},
				{
					model: 'heading1',
					view: 'h1',
					title: 'Heading 1',
					class: 'ck-heading_heading1'
				},
				{
					model: 'heading2',
					view: 'h2',
					title: 'Heading 2',
					class: 'ck-heading_heading2'
				},
				{
					model: 'heading3',
					view: 'h3',
					title: 'Heading 3',
					class: 'ck-heading_heading3'
				},
				{
					model: 'heading4',
					view: 'h4',
					title: 'Heading 4',
					class: 'ck-heading_heading4'
				},
				{
					model: 'heading5',
					view: 'h5',
					title: 'Heading 5',
					class: 'ck-heading_heading5'
				},
				{
					model: 'heading6',
					view: 'h6',
					title: 'Heading 6',
					class: 'ck-heading_heading6'
				}
			]
		},
		initialData:
			'',
		language: 'vi',
		licenseKey: LICENSE_KEY,
		link: {
			addTargetToExternalLinks: true,
			defaultProtocol: 'https://',
			decorators: {
				toggleDownloadable: {
					mode: 'manual',
					label: 'Downloadable',
					attributes: {
						download: 'file'
					}
				}
			}
		},
		menuBar: {
			isVisible: true
		},
		placeholder: 'Type or paste your content here!',
		table: {
			contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells', 'tableProperties', 'tableCellProperties']
		},
		translations: [translations]
	};
});

onMounted(() => {
	isLayoutReady.value = true;
});

function onReady(editor) {
	[...editorWordCount.value.children].forEach(child => child.remove());
	[...editorToolbar.value.children].forEach(child => child.remove());
	[...editorMenuBar.value.children].forEach(child => child.remove());

	const wordCount = editor.plugins.get('WordCount');
	editorWordCount.value.appendChild(wordCount.wordCountContainer);
	editorToolbar.value.appendChild(editor.ui.view.toolbar.element);
	editorMenuBar.value.appendChild(editor.ui.view.menuBarView.element);
}


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