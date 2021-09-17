<script setup lang="ts">
import { ref,watch,onMounted,inject } from 'vue'
import UploadButton from '../components/UploadButton.vue'
import * as faceapi from "face-api.js"

const loading:any = inject('loading')

const fileList = ref()

// 预设样本图，支持本地，网络，beas64
const sampleArr = ref([
  {
    name: "欣小萌",
    img: [
      "images/xxm/xxm01.jpg",
      "images/xxm/xxm02.jpg",
      "images/xxm/xxm03.jpg",
      "images/xxm/xxm04.jpg",
    ],
  },
  {
    name: "旭旭宝宝",
    img: [
      "images/xxbb/xxbb01.jpg",
      "images/xxbb/xxbb02.jpg",
      "images/xxbb/xxbb03.jpg",
      "images/xxbb/xxbb04.jpg",
    ],
  },
  {
    name: "张杰",
    img: ["https://dwz.cn/ZggSBEtL", "https://dwz.cn/U7nR0no0"],
  }
])

// 匹配图，支持本地，网络，beas64
const detArr = ref([
  "images/xxbb/xxbb01.jpg",
  "images/xxm/xxm02.jpg",
  "images/xxbb/xxbb02.jpg",
  "images/xxm/xxm03.jpg",
  "images/xxbb/xxbb04.jpg",
  "https://dwz.cn/U7nR0no0",
])

const resultArr = ref<any[]>([]);
const faceMatcher = ref();

const init = async ()=>{
  //引用模块
  loading.startLoading('模块资源加载中');
  await faceapi.loadFaceRecognitionModel("/models");
  loading.stopLoading();
  // 生成人脸匹配矩阵数组对象，样本图片同步转码
  const labeledFaceDescriptors = await Promise.all(
    sampleArr.value.map(async (item) => {
      // 临时图片转码数据，将图片对象转数据矩阵对象
      let descriptors:any = [];
      for (let image of item.img) {
        const imageEl = await faceapi.fetchImage(image);
        descriptors.push(await faceapi.computeFaceDescriptor(imageEl));
      }
      // 返回图片名字和图片转码数组
      return new faceapi.LabeledFaceDescriptors(item.name, descriptors);
    })
  );
  // 人脸匹配矩阵数组对象转码结果
  faceMatcher.value = new faceapi.FaceMatcher(labeledFaceDescriptors);
}

// 执行遍历识别匹配图片，数值误差越小越精确
const run = async ()=>{
  detArr.value.forEach(async (img) => {
    let ts = Date.now();
    // 将图片对象转数据矩阵对象，进行匹配
    const inputEl = await faceapi.fetchImage(img);
    const inputDescriptor = await faceapi.computeFaceDescriptor(inputEl);
    const bestMatch = await faceMatcher.value.findBestMatch(inputDescriptor);
    // 结果
    resultArr.value.push({
      target: img,
      result: bestMatch.toString(),
      time: Date.now() - ts + "ms",
      fps: Math.round(1000 / (Date.now() - ts)),
    });
  });
}

onMounted(async ()=>{
  await init();
  run()
});

watch(fileList, async (fileList)=>{
  if (!fileList.length) return;
  detArr.value = [];
  resultArr.value = [];
  // 将文件显示为图像并识别
  fileList.forEach(async (file) => {
    let ts = Date.now();
    let img = await faceapi.bufferToImage(file);
    const inputDescriptor = await faceapi.computeFaceDescriptor(img);
    const bestMatch = await faceMatcher.value.findBestMatch(inputDescriptor);
    // 结果
    detArr.value.push(img.src);
    resultArr.value.push({
      target: file.name,
      result: bestMatch.toString(),
      time: Date.now() - ts + "ms",
      fps: Math.round(1000 / (Date.now() - ts)),
    });
  });
});
</script>

<template>
  <div class="bbt_face_similarity_more">
    <div style="width: 60%;">
      <div>
        <label>匹配图多选择：</label>
        <upload-button
          :multiple="true"
          v-model:file-list="fileList"
          accept="image/png, image/jpeg"
        />
      </div>
      <h3>匹配图：</h3>
      <div class="pic">
        <img v-for="(det, k) in detArr" :key="k" :src="det" />
      </div>
      <h3>样本库：</h3>
      <div v-for="(item, i) in sampleArr" :key="i">
        <span style="color: #42b983;" v-text="item.name"></span>
        <div class="pic">
          <img v-for="img in item.img" :key="img" :src="img" :alt="item.name" />
        </div>
      </div>
    </div>
    <div style="width: 40%;">
      <h3>识别结果（误差值越小越准确）：</h3>
      <div v-for="(res, j) in resultArr" :key="j" class="result">
        <img :src="detArr[j]" />
        <div class="info">
          <span>对比：{{ res.target }}</span>
          <span>结果：{{ res.result }}</span>
          <span>时间：{{ res.time }}</span>
          <span>FPS：{{ res.fps }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bbt_face_similarity_more {
  display: flex;
  flex-direction: row;
}
.pic {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
img {
  max-width: 90px;
  max-height: 90px;
  margin: 10px;
}
.result {
  display: flex;
  flex-direction: row;
}
.result .info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  width: 200px;
}
</style>
