<script setup lang="ts">
import { 
  ref,
  reactive ,
  onBeforeUnmount, 
  inject, 
  onMounted,
  watch
} from 'vue';
import * as faceapi from "face-api.js"
import useAlgorithm from '../composables/useAlgorithm';

const loading:any = inject('loading')

const {
  init,
  algorithmType,
  modelOption,
  algorithmOptions
} = useAlgorithm(loading);

const options = [
  {label:'前置',value:'user'},
  {label:'后置',value:'environment'}
];

const detectOptions = [
  {label:'可信单',value:'detectSingleFace'},
  {label:'模糊多',value:'detectAllFaces'}
];

const constraints = reactive({
  audio: false,
  video: {
    // ideal（应用最理想的）
    width: {min: 320,ideal: 960,max: 1920},
    height: {min: 240,ideal: 540, max: 1080},
    // frameRate受限带宽传输时，低帧率可能更适宜
    frameRate: {min: 15,ideal: 30,max: 60,},
    facingMode: "user",
  }
})

const detectFace = ref<string>('detectSingleFace');
const device = ref();
let streamBox:any = null;

//el
const videoEl = ref();
const canvasEl = ref();

// 成功启动视频媒体流
const fnSuccess = (stream)=> {  
  streamBox = stream;
  videoEl.value.srcObject = stream;
  videoEl.value.play();
}

// 失败启动视频媒体流
const fnError = (error)=> {
  alert("视频媒体流获取错误" + error);
}

// 启动摄像头视频媒体
const fnOpen = ()=>{
  if (streamBox) return;
  clearTimeout(device.value);
  device.value = setTimeout(() => {
    clearTimeout(device.value);
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then(fnSuccess)
      .catch(fnError);
  }, 500);
}

const fnClose = ()=>{
  canvasEl.value
    .getContext("2d")
    .clearRect(0, 0, canvasEl.value.width, canvasEl.value.height);
  videoEl.value.pause();
  clearTimeout(device.value);
  if (streamBox) {    
    videoEl.value.srcObject = null;
    streamBox?.getTracks().forEach((track) => track.stop());
    streamBox = null;
  }
}

const fnRun = async ()=>{
  const result = await faceapi[detectFace.value](videoEl.value, modelOption.value);
  if (result && !videoEl.value.paused) {
    const dims = faceapi.matchDimensions(canvasEl.value, videoEl.value, true);
    const resizeResults = faceapi.resizeResults(result, dims);
    faceapi.draw.drawDetections(canvasEl.value, resizeResults);
  } else {
    canvasEl.value
      .getContext("2d")
      .clearRect(0, 0, canvasEl.value.width, canvasEl.value.height);
  }
  requestAnimationFrame(fnRun);
}

watch(algorithmType, () => {
  init()
})

onMounted(init)

onBeforeUnmount(fnClose)

</script>

<template>
  <a-list>

    <a-list-item>
      <div>
        <label>面板操作：</label>
        <button @click="fnOpen">启动摄像头视频媒体</button>
        <button @click="fnClose">结束摄像头视频媒体</button>
      </div>
    </a-list-item>

    <a-list-item>
      前置后置切换（重新启动摄像头）：
      <a-radio-group 
        :options="options" 
        v-model:value="constraints.video.facingMode" 
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
      <a-radio-group :options="algorithmOptions" v-model:value="algorithmType" />
    </a-list-item>
  </a-list>
  <hr />
  <div class="videoWrap">
    <video
      ref="videoEl"
      poster="https://dummyimage.com/960x540"
      muted
      loop
      playsinline
      @loadedmetadata="fnRun"
    ></video>
    <canvas ref="canvasEl" />
  </div>
</template>

<style scoped>
button {
  height: 30px;
  border: 2px #42b983 solid;
  border-radius: 4px;
  background: #42b983;
  color: white;
  margin-right: 10px;
}

.videoWrap {
  position: relative;
  overflow: auto;
}
.videoWrap canvas {
  position: absolute;
  top: 0;
  left: 0;
}
</style>
