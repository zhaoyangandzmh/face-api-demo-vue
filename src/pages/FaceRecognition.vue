<script setup lang="ts">
import { ref,watch,onMounted,inject } from 'vue'
import UploadButton from '../components/UploadButton.vue'
import * as faceapi from "face-api.js"

const loading:any = inject('loading')
const fileListOrg = ref([])
const fileListDet = ref([])
const algorithmType = ref<string>('ssdMobilenetv1');
const modelOption = ref({})
const faceMatcher = ref<any>(null)

const imgElOrg = ref()
const canvasElOrg = ref()
const imgElDet = ref()
const canvasElDet = ref()

const options=['ssdMobilenetv1','tinyFaceDetector','mtcnn'];

const init = async ()=>{
  //引用模块
  loading.startLoading('模块资源加载中');
  await faceapi.nets[algorithmType.value].loadFromUri("/models");
  await faceapi.loadFaceLandmarkModel("/models");
  await faceapi.loadFaceRecognitionModel("/models");
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

const run = async (imgSource,canvasSource,el)=>{
  if (!faceMatcher.value && el === "det") return;

  const fullFaceDescriptions = await faceapi
    .detectAllFaces(imgSource, modelOption.value as any)
    .withFaceLandmarks()
    .withFaceDescriptors();

  if (!fullFaceDescriptions.length) {
    faceMatcher.value = null;
    return;
  }
  // 目标原图，转匹配矩阵
  if (el === "org") {
    faceMatcher.value = await new faceapi.FaceMatcher(fullFaceDescriptions);
  }
  // 识别图像绘制
  faceapi.matchDimensions(canvasSource, imgSource);
  const resizedResults = faceapi.resizeResults(
    fullFaceDescriptions,
    imgSource
  );

  resizedResults.forEach(({ detection, descriptor }) => {
    let best = faceMatcher.value.findBestMatch(descriptor);
    let label = el === "org" ? best["label"] : best.toString();
    new faceapi.draw.DrawBox(detection.box, { label }).draw(
      canvasSource
    );
  });
}

onMounted(async () => {
  await init()
  await run(imgElOrg.value, canvasElOrg.value, 'org')
  run(imgElDet.value, canvasElDet.value,'det')
}),

watch(algorithmType, async () => {
  await init()
  await run(imgElOrg.value, canvasElOrg.value, 'org')
  run(imgElDet.value, canvasElDet.value,'det')
})

const drawImg = async (fileList,imgEl,canvasEl)=>{
  if (!fileList.length) return;
  const img = await faceapi.bufferToImage(fileList[0]);
  imgEl.src = img.src;
  canvasEl.getContext("2d")
    .clearRect(0, 0, canvasEl.width, canvasEl.height);
}

watch(fileListOrg, async (fileList)=>{
  await drawImg(fileList,imgElOrg.value,canvasElOrg.value)
  await run(imgElOrg.value, canvasElOrg.value, 'org')
  run(imgElDet.value, canvasElDet.value,'det')
});

watch(fileListDet, async (fileList)=>{
  await drawImg(fileList,imgElDet.value,canvasElDet.value)
  run(imgElDet.value, canvasElDet.value,'det')
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
      选择算法模型
      <a-radio-group :options="options" v-model:value="algorithmType" />
    </a-list-item>
  </a-list>

  <div class="see">
    <div class="org">
      <img ref="imgElOrg" src="@/assets/xxm03.jpg" />
      <canvas ref="canvasElOrg" />
    </div>
    <div class="det">
      <img ref="imgElDet" src="@/assets/cp02.jpg" />
      <canvas ref="canvasElDet" />
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
