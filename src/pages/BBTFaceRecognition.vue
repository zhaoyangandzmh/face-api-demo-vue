<script setup lang="ts">
import { ref,watch,onMounted,inject } from 'vue'
import UploadButton from '../components/UploadButton.vue'
import * as faceapi from "face-api.js"

const loading:any = inject('loading')

const fileList = ref()
const imgEl=ref();
const canvasEl=ref();
const algorithmType = ref<string>('ssdMobilenetv1');
const modelOption = ref({})
const options=['ssdMobilenetv1','tinyFaceDetector','mtcnn'];

// 预设样本图，支持本地，网络，beas64
const sampleArr = ref([
  {
    name: "欣小萌",
    img: [
      "images/xxm/face/xxm01.png",
      "images/xxm/face/xxm02.png",
      "images/xxm/face/xxm03.png",
      "images/xxm/face/xxm04.png",
    ],
  },
  {
    name: "旭旭宝宝",
    img: [
      "images/xxbb/face/xxbb01.png",
      "images/xxbb/face/xxbb02.png",
      "images/xxbb/face/xxbb03.png",
      "images/xxbb/face/xxbb04.png",
    ],
  },
])

const faceMatcher = ref();

// 生成人脸匹配矩阵数组对象，样本图片同步转码
const faceMatcherFn =async ()=>{
  const labeledFaceDescriptors = await Promise.all(
    sampleArr.value.map(async (item) => {
      // 临时图片转码数据，将图片对象转数据矩阵对象
      let descriptors:any[] = [];
      for (let image of item.img) {
        const imageEl = await faceapi.fetchImage(image);
        descriptors.push(await faceapi.computeFaceDescriptor(imageEl));
      }
      // 返回图片用户和图片转码数组
      return new faceapi.LabeledFaceDescriptors(item.name, descriptors);
    })
  );
  // 人脸匹配矩阵数组对象转码结果
  faceMatcher.value = new faceapi.FaceMatcher(labeledFaceDescriptors);
}

const init = async ()=>{
  //引用模块
  loading.startLoading('模块资源加载中');
  await faceapi.nets[algorithmType.value].loadFromUri("/models");
  await faceapi.loadFaceLandmarkModel("/models");
  await faceapi.loadFaceRecognitionModel("/models");
  loading.stopLoading();
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
  await faceMatcherFn();
}

// 执行遍历识别匹配图片，数值误差越小越精确
const run = async ()=>{
  const results = await faceapi
    .detectAllFaces(imgEl.value, modelOption.value as any)
    .withFaceLandmarks()
    .withFaceDescriptors();
  faceapi.matchDimensions(canvasEl.value, imgEl.value);
  const resizedResults = faceapi.resizeResults(results, imgEl.value);
  resizedResults.forEach(({ detection, descriptor }) => {
    const label = faceMatcher.value.findBestMatch(descriptor).toString();
    new faceapi.draw.DrawBox(detection.box, { label }).draw(canvasEl.value);
  });
}

onMounted(async ()=>{
  await init();
  run()
});

watch(fileList, async (fileList)=>{
  if (!fileList.length) return;
  const img = await faceapi.bufferToImage(fileList[0]);
  imgEl.value.src = img.src;
  canvasEl.value
    .getContext("2d")
    .clearRect(0, 0, canvasEl.value.width, canvasEl.value.height);
  run()
});

watch(algorithmType, async () => {
  await init()
  run()
})
</script>

<template>
  <div class="face_recognition_library">
    <a-list>
      <a-list-item>
        匹配图选择：
        <upload-button 
          v-model:file-list="fileList"
          accept="image/png, image/jpeg"
        />
      </a-list-item>
      <a-list-item>
        选择算法模型
        <a-radio-group :options="options" v-model:value="algorithmType" />
      </a-list-item>
    </a-list>
    <h3>匹配图：</h3>
    <div class="target">
      <img ref="imgEl" src="@/assets/images/xxm/xxm03.jpg" />
      <canvas ref="canvasEl" />
    </div>
    <h3>样本库：</h3>
    <div v-for="(item, i) in sampleArr" :key="i">
      <span style="color: #42b983;" v-text="item.name"></span>
      <div class="pic">
        <img v-for="img in item.img" :key="img" :src="img"/>
      </div>
    </div>
  </div>
</template>

<style scoped>
.target {
  position: relative;
}
.target img {
  max-width: 600px;
  max-height: 400px;
}
.target canvas {
  position: absolute;
  top: 0;
  left: 0;
}
.pic {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
.pic img {
  max-width: 90px;
  max-height: 90px;
  margin: 10px;
}
</style>
