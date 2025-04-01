<template>
    <div>
        <form action="#">
            <table border="solid">
                <tbody>
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
                        <td><input type="text" name="" id="name" v-model="description"></td>
                    </tr>
                    <tr>
                        <td>Loại content</td>
                        <td>
                            <select name="content_category_id" id="content_category_id">
                                <option value=""></option>
                            </select>
                        </td>
                    </tr>
                    <tr></tr>
                    <tr></tr>
                    <tr></tr>
                    <tr></tr>
                    <tr></tr>
                </tbody>
            </table>
        </form>
    </div>
</template>

<script setup>

</script>

<style lang="scss" scoped></style>