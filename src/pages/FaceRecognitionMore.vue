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
const detBox = ref()

const options=['ssdMobilenetv1','tinyFaceDetector','mtcnn'];

// 执行原图样本识别绘制
const fnRunOrg = async ()=> {
  const fullFaceDescriptions = await faceapi
    .detectAllFaces(imgElOrg.value, modelOption.value as any)
    .withFaceLandmarks()
    .withFaceDescriptors();
  if (!fullFaceDescriptions.length) {
    faceMatcher.value = null;
    return;
  }
  // 原图人脸矩阵结果
  faceMatcher.value = await new faceapi.FaceMatcher(fullFaceDescriptions);
  // 显示的图像维度小于=原始尺寸,并与org原图人脸矩阵结果进行匹配绘制
  faceapi.matchDimensions(canvasElOrg.value, imgElOrg.value);
  const resizedResults = faceapi.resizeResults(
    fullFaceDescriptions,
    imgElOrg.value
  );
  resizedResults.forEach(({ detection, descriptor }) => {
    let { label } = faceMatcher.value.findBestMatch(descriptor);
    new faceapi.draw.DrawBox(detection.box, { label }).draw(
      canvasElOrg.value
    );
  });
}

// 执行目标图与原图多样本图识别绘制
const fnRunDet = async (index = 0, src = "/images/cp03.jpg") => {
  if (!faceMatcher.value) return;
  // 节点对象创建
  let img = document.createElement("img");
  img.id = "detImg" + index;
  img.src = src;
  let canvas = document.createElement("canvas");
  canvas.id = "detCanvas" + index;
  let div = document.createElement("div");
  div.className = "det";
  div.appendChild(img);
  div.appendChild(canvas);
  detBox.value.appendChild(div);
  // 识别人脸
  const fullFaceDescriptions = await faceapi
    .detectAllFaces(img, modelOption.value as any)
    .withFaceLandmarks()
    .withFaceDescriptors();
  if (!fullFaceDescriptions.length) return;
  // 显示的图像维度小于=原始尺寸,并与org原图人脸矩阵结果进行匹配绘制
  faceapi.matchDimensions(canvas, img);
  const resizedResults = faceapi.resizeResults(fullFaceDescriptions, img);
  resizedResults.forEach(({ detection, descriptor }) => {
    let label = faceMatcher.value.findBestMatch(descriptor).toString();
    new faceapi.draw.DrawBox(detection.box, { label }).draw(canvas);
  });
}

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
  // 原图人脸识别和人脸匹配
  await fnRunOrg();
  await fnRunDet();
}

onMounted(init);

watch(algorithmType, async () => {
  await init()
  detBox.value.innerHTML = "";
})

watch(fileListOrg, async (fileList)=>{
  if (!fileList.length) return
  faceapi.bufferToImage(fileList[0]).then(async (img) => {
    imgElOrg.value.src = img.src;
    canvasElOrg.value
      .getContext("2d")
      .clearRect(0, 0, canvasElOrg.value.width, canvasElOrg.value.height);
    await fnRunOrg()
    await fnRunDet()
  });
});

watch(fileListDet, (fileList)=>{
  fileList.forEach(async (file, index) => {
    const img = await faceapi.bufferToImage(file);
    await fnRunDet(index, img.src)
  });
});

</script>
<template>
  <div class="face_recognition_more">
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
          :multiple="true"
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
        <img ref="imgElOrg" src="@/assets/images/xxm/xxm03.jpg" />
        <canvas ref="canvasElOrg" />
      </div>
      <hr />
      <div ref="detBox" id="detBox"></div>
    </div>
  </div>
</template>

<style>
.see .org,
.see #detBox .det {
  position: relative;
}
.see .org img,
.see #detBox .det img {
  max-width: 600px;
  max-height: 400px;
}
.see .org canvas,
.see #detBox .det canvas {
  position: absolute;
  top: 0;
  left: 0;
}
</style>
