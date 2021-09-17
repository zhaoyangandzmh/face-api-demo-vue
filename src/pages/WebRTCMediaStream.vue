<script setup lang="ts">
import { ref,reactive ,onBeforeUnmount } from 'vue'

const options = [
  {label:'前置',value:'user'},
  {label:'后置',value:'environment'}
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
const device = ref();
let streamBox:any = null;
const videoEl = ref();

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

const fnOpen = ()=>{
  // 有视频流就不在开新的
  if (streamBox) return;
  clearTimeout(device.value);
  device.value = setTimeout(() => {
    clearTimeout(device.value);
    // 主要步骤
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then(fnSuccess)
      .catch(fnError);
  }, 500);
}

const fnClose = ()=>{
  videoEl.value.pause();
  if (streamBox) {    
    videoEl.value.srcObject = null;
    streamBox?.getTracks().forEach((track) => track.stop());
    streamBox = null;
  }
}

onBeforeUnmount(fnClose)

</script>

<template>
  <a-list>
    <a-list-item>
      <div>
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
  </a-list>
  <hr />
  <div class="videoWrap">
    <video
      ref="videoEl"
      poster="https://dummyimage.com/960x540"
      muted
      loop
      playsinline
    ></video>
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
.videoWrap{
  overflow: auto;
}
</style>
