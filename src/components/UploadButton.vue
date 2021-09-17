<script setup lang="ts">
import { ref,useAttrs } from 'vue'
import { UploadOutlined } from '@ant-design/icons-vue'

interface FileItem {
  uid: string;
  name?: string;
  status?: string;
  response?: string;
  url?: string;
  preview?: string;
  originFileObj?: any;
  file: string | Blob;
}

interface FileInfo {
  file: FileItem;
  fileList: FileItem[];
}

interface Props {
  accept?: string
  fileList?: FileItem[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:file-list', fileList: FileItem[]): void
}>()

const attrs = useAttrs();

const handleChange = (info: FileInfo)=>{
  emit('update:file-list',info.fileList.map((file)=>file.originFileObj))
}

const beforeUpload=()=>false

</script>

<template>
  <a-upload 
    v-model:file-list="fileList"
    :before-upload="beforeUpload"
    v-bind="attrs"
    :accept="accept"
    @change="handleChange"
  >
    <a-button>
      <upload-outlined></upload-outlined>
      点击上传
    </a-button>
  </a-upload>
</template>
