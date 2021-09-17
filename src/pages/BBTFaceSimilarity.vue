<script setup lang="ts">
import { ref,watch,onMounted,inject } from 'vue'
import UploadButton from '../components/UploadButton.vue'
import * as faceapi from "face-api.js"

const loading:any = inject('loading')
const fileListOrg = ref([])
const fileListDet = ref([])
const desc = ref()
const distance = ref()

const imgElOrg = ref()
const imgElDet = ref()

const init = async ()=>{
  //引用模块
  loading.startLoading('模块资源加载中');
  await faceapi.loadFaceRecognitionModel("/models");
  loading.stopLoading();
  desc.value = [
    await faceapi.computeFaceDescriptor(imgElOrg.value),
    await faceapi.computeFaceDescriptor(imgElDet.value)
  ];
  distance.value = faceapi
    .euclideanDistance(desc.value[0], desc.value[1])
    .toFixed(2)
}

const run = async (imgEl,index)=>{
  desc.value[index] = await faceapi.computeFaceDescriptor(imgEl);
  distance.value = faceapi
    .euclideanDistance(desc.value[0], desc.value[1])
    .toFixed(2)
}

onMounted(init);

watch(fileListOrg, async (fileList)=>{
  const img = await faceapi.bufferToImage(fileList[0]);
  imgElOrg.value.src = img.src;
  run(imgElOrg.value,0)
});

watch(fileListDet, async (fileList)=>{
  const img = await faceapi.bufferToImage(fileList[0]);
  imgElDet.value.src = img.src;
  run(imgElDet.value,1)
});
</script>

<template>
  <a-list>
    <a-list-item>
      更换图片org：
      <upload-button 
        v-model:file-list="fileListOrg"
        accept="image/png, image/jpeg"
      />
    </a-list-item>
    <a-list-item>
      更换图片det：
      <upload-button 
        v-model:file-list="fileListDet"
        accept="image/png, image/jpeg"
      />
    </a-list-item>
    <a-list-item>
      相似度（越小越精准）：{{distance}}
    </a-list-item>
  </a-list>

  <div class="see">
    <div class="org">
      <img ref="imgElOrg" src="@/assets/images/xxm/xxm02.jpg" />
    </div>
    <div class="det">
      <img ref="imgElDet" src="@/assets/images/xxbb/xxbb02.jpg" />
    </div>
  </div>

</template>

<style scoped>
.see .org,
.see .det {
  position: relative;
  margin-top: 10px;
}
.see .org img,
.see .det img {
  max-width: 600px;
  max-height: 400px;
}
.see .org canvas,
.see .det canvas {
  position: absolute;
  top: 0;
  left: 0;
}
</style>
