import { ref } from 'vue'
import * as faceapi from "face-api.js"

export default (loading) => {
  const algorithmType = ref<string>('ssdMobilenetv1');
  const modelOption = ref({});
  const algorithmOptions= ['ssdMobilenetv1','tinyFaceDetector','mtcnn']

  const init = async () => {
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
  return {
    init,
    algorithmType,
    modelOption,
    algorithmOptions
  }
}
