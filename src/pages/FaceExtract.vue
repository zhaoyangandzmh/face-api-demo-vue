<script setup lang="ts">
import { ref,watch,onMounted,inject } from 'vue'
import UploadButton from '../components/UploadButton.vue'
import * as faceapi from "face-api.js"

const loading:any = inject('loading')
const fileList = ref([])
const algorithmType = ref<string>('ssdMobilenetv1');
const modelOption = ref({})
const faceImagesList = ref<string[]>([])

const imgEl = ref()

const options=['ssdMobilenetv1','tinyFaceDetector','mtcnn'];

const init = async () =>{
  //引用模块
  loading.startLoading('模块资源加载中');
  await faceapi.nets[algorithmType.value].loadFromUri("/models");
  loading.stopLoading()
  // 根据模型参数识别调整结果
  switch (algorithmType.value) {
    case "ssdMobilenetv1":
      modelOption.value = new faceapi.SsdMobilenetv1Options({
        minConfidence: 0.5, // 0.1 ~ 0.9
      });
      break;
    case "tinyFaceDetector":
      modelOption.value = new faceapi.TinyFaceDetectorOptions({
        inputSize: 512, // 160 224 320 416 512 608
        scoreThreshold: 0.5, // 0.1 ~ 0.9
      });
      break;
    case "mtcnn":
      modelOption.value = new faceapi.MtcnnOptions({
        minFaceSize: 20, // 1 - 50
        scaleFactor: 0.709, // 0.1 ~ 0.9
      });
      break;
  }
}

const run = async ()=>{
  const detections = await faceapi.detectAllFaces(imgEl.value, modelOption.value as any);
  const faceImages = await faceapi.extractFaces(imgEl.value, detections);
  faceImagesList.value = faceImages.map((canvas)=>canvas.toDataURL()) 
}

onMounted(async () => {
  await init()
  run()
}),

watch(algorithmType, async () => {
  await init()
  run()
})

watch(fileList, async (fileList)=>{
  if (!fileList.length) return;
  const img = await faceapi.bufferToImage(fileList[0]);
  imgEl.value.src = img.src;
  run()
});

</script>

<template>
  <a-list>
    <a-list-item>
      更换图片：
      <upload-button 
        v-model:file-list="fileList"
        accept="image/png, image/jpeg"
      />
    </a-list-item>
    <a-list-item>
      选择算法模型：
      <a-radio-group :options="options" v-model:value="algorithmType" />
    </a-list-item>
  </a-list>

  <div class="see">
    <img ref="imgEl" src="@/assets/shl.jpeg" />
  </div>
  <p class="text">截取出的人脸图像：</p>
  <img
    class="img"
    v-for="(faceData,index) in faceImagesList" 
    :key="index"
    :src="faceData" 
  >

</template>

<style scoped>
.see {
  position: relative;
  margin-top: 10px;
}
.see img {
  max-width: 600px;
  max-height: 400px;
}
.text{
  margin-top:20px;
  margin-bottom:20px;
}
.img{
  margin-right: 10px;
}
</style>
