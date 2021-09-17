<script setup lang="ts">
import { ref,watch,onMounted,inject,onUnmounted } from 'vue'
import UploadButton from '../components/UploadButton.vue'
import * as faceapi from "face-api.js"

const loading:any = inject('loading')

const fileList = ref();
const detectFace = ref<string>('detectSingleFace');
const algorithmType = ref<string>('tinyFaceDetector');
const modelOption = ref({})
const options=['ssdMobilenetv1','tinyFaceDetector','mtcnn'];
const timeout = ref();

const detectOptions = [
  {label:'可信单',value:'detectSingleFace'},
  {label:'模糊多',value:'detectAllFaces'}
];
const videoEl=ref();
const canvasEl=ref();

// 节点对象执行递归识别绘制
const run = async ()=>{
  if (videoEl.value?.paused) return clearTimeout(timeout.value);
  const result = await faceapi[detectFace.value](videoEl.value, modelOption.value as any);
  if (result && !videoEl.value?.paused) {
    const dims = faceapi.matchDimensions(canvasEl.value, videoEl.value, true);
    const resizeResults = faceapi.resizeResults(result, dims);
    faceapi.draw.drawDetections(canvasEl.value, resizeResults);
  } else {
    canvasEl.value
      .getContext("2d")
      .clearRect(0, 0, canvasEl.value.width, canvasEl.value.height);
  }
  timeout.value = setTimeout(() => run(),20);
}

const fnPaused = ()=>{
  if (videoEl.value?.paused) {
    videoEl.value.play();
    setTimeout(() => run(), 300);
  } else {
    videoEl.value.pause();
  }
}

const init = async ()=>{
  //引用模块
  loading.startLoading('模块资源加载中');
  await faceapi.nets[algorithmType.value].loadFromUri("/models");
  await faceapi.loadFaceLandmarkModel("/models");
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
}

onMounted(init);
onUnmounted(()=>{
  videoEl.value?.pause();
  clearTimeout(timeout.value)
})

watch(fileList, async (fileList)=>{
  if (!fileList.length) return;
  videoEl.value.pause();
  setTimeout(() => {
    canvasEl.value
      .getContext("2d")
      .clearRect(0, 0, canvasEl.value.width, canvasEl.value.height);
    videoEl.value.src = URL.createObjectURL(fileList[0]);
  }, 300);
});

watch(algorithmType, init)
</script>
<template>
  <div class="video_face_detector">
    <a-list>
      <a-list-item>
        视频控制：
        <button @click="fnPaused">暂停Or播放</button>
      </a-list-item>
      <a-list-item>
        更换视频：
        <upload-button 
          v-model:file-list="fileList"
          accept="video/mp4, video/ogg, video/webm"
        />
      </a-list-item>
      <a-list-item>
        检测人脸：
        <a-radio-group 
          :options="detectOptions" 
          v-model:value="detectFace" 
        />
      </a-list-item>
      <a-list-item>
        选择算法模型
        <a-radio-group :options="options" v-model:value="algorithmType" />
      </a-list-item>
    </a-list>
    <!-- 视频 -->
    <div class="see">
      <video ref="videoEl" src="@/assets/videos/test.mp4" muted playsinline></video>
      <canvas ref="canvasEl" />
    </div>
  </div>
</template>

<style scoped>
button {
  height: 30px;
  border: 2px #42b983 solid;
  border-radius: 4px;
  background: #42b983;
  color: white;
  margin: 10px;
}
.see {
  position: relative;
}
.see img {
  max-width: 400px;
  max-height: 400px;
}
.see canvas {
  position: absolute;
  top: 0;
  left: 0;
}
</style>
