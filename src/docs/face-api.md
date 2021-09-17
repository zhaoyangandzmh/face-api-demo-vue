# face-api介绍

Face-api.js 是一个 JavaScript API，是基于 tensorflow.js 核心 API 的人脸检测和人脸识别的浏览器实现。它实现了一系列的卷积神经网络（CNN），针对网络和移动设备进行了优化。

> 官网：https://justadudewhohacks.github.io/face-api.js/docs/index.html

# 人脸识别模块介绍

## SSD Mobilenet V1

对于面部检测，该项目实现了基于MobileNetV1的SSD（单次多盒检测器）。神经网络将计算图像中每个面部的位置，并将返回边界框以及每个面部的概率。该面部检测器旨在获得检测面部边界框而不是低推理时间的高精度。

> 量化模型的大小约为5.4 MB（ssd_mobilenetv1_model）

## Tiny Face Detector

Tiny Face Detector 是一种非常高性能的实时人脸检测器，与 SSD Mobilenet V1 人脸检测器相比，它速度更快、体积更小、资源消耗更少，但它在检测小的人脸时的表现稍差。 该模型非常适合移动和网络，因此它应该是您在移动设备和资源有限的客户端上的首选面部检测器。 

> 量化模型的大小只有 190 KB (tiny_face_detector_model)。

## MTCNN

MTCNN（多任务级联卷积神经网络）代表了 SSD Mobilenet v1 和 Tiny Yolo v2 的替代人脸检测器，它提供了更多的配置空间。 通过调整输入参数，MTCNN 应该能够检测范围广泛的人脸边界框大小。 MTCNN 是一个 3 级级联 CNN，它同时返回 5 个面部标志点以及每个面部的边界框和分数。 

> 模型大小仅为 2MB。

## 68 Point Face Landmark Detection Models

这个包实现了一个非常轻量、快速但准确的 68 点人脸标志检测器，而小模型只有 80kb (face_landmark_68_tiny_model)。 两种模型都采用深度可分离卷积和密集连接块的思想。 这些模型已经在大约 35k 人脸图像的数据集上进行了训练，该数据集标有 68 个面部标志点。

> 模型大小350kb(face_landmark_68_model)。

## Face Recognition Model

对于人脸识别，实现了类似 ResNet-34 的架构，以从任何给定的人脸图像计算人脸描述符（具有 128 个值的特征向量），用于描述人脸的特征。 该模型不仅限于用于训练的人脸集，这意味着您可以将其用于任何人的人脸识别。 您可以通过比较它们的人脸描述符来确定两个任意人脸的相似性。

> 量化模型的大小约为 6.2 MB (face_recognition_model)

## Face Expression Recognition Model

人脸表情识别模型轻量级、快速并提供合理的准确性。它采用深度可分离卷积和密集连接块。 它已经接受了来自公开可用数据集的各种图像以及从网络上抓取的图像的训练。 请注意，戴眼镜可能会降低预测结果的准确性。

> 该模型大小约为 310kb

# face-api.js for Nodejs

```javascript
npm i face-api.js canvas @tensorflow/tfjs-node
```

```javascript
//不是必须的，可以通过编译和绑定到本机 Tensorflow C++ 库来大大加快速度
import '@tensorflow/tfjs-node';
import * as canvas from 'canvas';
import * as faceapi from 'face-api.js';
const { Canvas, Image, ImageData } = canvas
faceapi.env.monkeyPatch({ Canvas, Image, ImageData })
```

# 用法

## 加载模型

```javascript
// 写法一
await faceapi.loadSsdMobilenetv1Model('/models')
// await faceapi.loadTinyFaceDetectorModel('/models')
// await faceapi.loadMtcnnModel('/models')
// await faceapi.loadFaceLandmarkModel('/models')
// await faceapi.loadFaceLandmarkTinyModel('/models')
// await faceapi.loadFaceRecognitionModel('/models')
// await faceapi.loadFaceExpressionModel('/models')

// 写法二
await faceapi.nets.ssdMobilenetv1.loadFromUri('/models')
```

## 检测人脸

```javascript
// 检测图片中所有的人脸
const detections = await faceapi.detectAllFaces(input,options)
// 检测图像中置信度最高的人脸
const detection = await faceapi.detectSingleFace(input,options)
```

> input可以是 HTML img、video 或 canvas 元素或该元素的 id。

> options 不传默认为 SSD Mobilenet V1 Face Detector

### options应与加载的模块对应

```javascript
new faceapi.SsdMobilenetv1Options({
  // 最小置信阈值
  // default: 0.5
  minConfidence?: number,
  // 返回的最大面数
  // default: 100
  maxResults?: number
})
new faceapi.TinyFaceDetectorOptions({
  // 处理图像的大小，越小越快，
  // 但在检测较小的人脸时不太精确，必须是可整除的乘以32，常见的尺寸有128、160、224、320、416、512、608，
  // 对于通过网络摄像头进行面部跟踪，我建议使用较小的尺寸，
  // 例如 128、160，用于检测较小的人脸使用较大的尺寸，例如 512, 608
  // default: 416
  inputSize?: number,
  // 最小置信阈值
  // default: 0.5
  minConfidence?: number
})
new faceapi.MtcnnOptions({
  //检测最小人脸尺寸 default: 20
  minFaceSize?: number
  // 用于过滤边界的分数阈值 default: [0.6, 0.7, 0.7]
  scoreThresholds?: number[]
  // 用于计算图像缩放步长的比例因子 default: 0.709
  scaleFactor?: number
  // 输入图像的最大缩放比例
  maxNumScales?: number
  // 缩放步长
  scaleSteps?: number[]
})
```

## 实用的工具方法

1.提取图像（指定位置）

```javascript
const regionsToExtract = [
  new faceapi.Rect(0, 0, 100, 100)
]
const canvases = await faceapi.extractFaces(input, regionsToExtract)
```

2.欧几里得距离

```javascript
// 用于计算两个人脸描述符之间的欧几里德距离
// 结果越小相似度越高
const dist = faceapi.euclideanDistance([0, 0], [0, 10]) 
```

3.从 `URL` 获取和显示图像

```javascript
const image = await faceapi.fetchImage('/images/example.png')
console.log(image instanceof HTMLImageElement) // true
```

4.创建图像选择器

```javascript
<img id="myImg" src="">
<input id="myFileUpload" type="file" onchange="uploadImage()" accept=".jpg, .jpeg, .png">
async function uploadImage() {
  const imgFile = document.getElementById('myFileUpload').files[0]
  // 从 Blob 创建 HTMLImageElement
  const img = await faceapi.bufferToImage(imgFile)
  document.getElementById('myImg').src = img.src
}
```

5.从`img`或`video`元素创建`canvas`

```javascript
<img id="myImg" src="images/example.png" />
<video id="myVideo" src="media/example.mp4" />
const canvas1 = faceapi.createCanvasFromMedia(document.getElementById('myImg'))
const canvas2 = faceapi.createCanvasFromMedia(document.getElementById('myVideo'))
```

6.绘制自定义文本的框

```javascript
const boxesWithText = [
  new faceapi.BoxWithText(new faceapi.Rect(x, y, width, height), text)),
  new faceapi.BoxWithText(new faceapi.Rect(0, 0, 50, 50), 'some text'))
]

const canvas = document.getElementById('overlay')
faceapi.drawDetection(canvas, boxesWithText)
```

## 实用类

```javascript
//检测到的人脸框
export interface IBox {
  x: number
  y: number
  width: number
  height: number
}
export interface IFaceDetection {
  score: number
  box: Box
}
export type WithFaceDetection<TSource> TSource & {
  detection: FaceDetection
}

// 检测到的人脸标记
export interface IFaceLandmarks {
  positions: Point[]
  shift: Point
}
export type WithFaceLandmarks<TSource> TSource & {
  unshiftedLandmarks: FaceLandmarks
  landmarks: FaceLandmarks
  alignedRect: FaceDetection
}

// 检测到的人脸描述符
export type WithFaceDescriptor<TSource> TSource & {
  descriptor: Float32Array
}

// 检测到的表情结果
export type FaceExpression = 'neutral' | 'happy' | 'sad' | 'angry' | 'fearful' | 'disgusted' | 'surprised'
export type FaceExpressionPrediction = {
  expression: FaceExpression,
  probability: number
}
export type WithFaceExpressions<TSource> TSource & {
  expressions: FaceExpressionPrediction[]
}

```

## 进行检测

```javascript
const results = await faceapi.detectSingleFace(input)
  .withFaceLandmarks() // 获得人脸标记
  .withFaceDescriptors() // 计算人脸描述符
  .withFaceExpressions() // 检测人脸表情
  .withAgeAndGender() // 检测年龄性别
```

## 通过匹配描述符进行人脸识别

1.我们用参考数据初始化 `FaceMatcher`

```javascript
const results = await faceapi
  .detectAllFaces(referenceImage)
  .withFaceLandmarks()
  .withFaceDescriptors()
//没检测到人脸
if (!results.length) return
//创建具有自动分配标签的 FaceMatcher 
const faceMatcher = new faceapi.FaceMatcher(results)
```

2.对比图片得到结果

```javascript
const results = await faceapi
  .detectAllFaces(queryImage)
  .withFaceLandmarks()
  .withFaceDescriptors()

results.forEach(fd => {
  const bestMatch = faceMatcher.findBestMatch(fd.descriptor)
  console.log(bestMatch.toString())
})
```

3.创建自己的标签

```javascript
const labeledDescriptors = [
  new faceapi.LabeledFaceDescriptors(
    'obama',
    [descriptorObama1, descriptorObama2]
  ),
  new faceapi.LabeledFaceDescriptors(
    'trump',
    [descriptorTrump]
  )
]

const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors)
```

## 展示检测结果

```javascript
// 调整检测到的框的大小，以防您显示的图像与原始图像的大小不同
const toSize = { width: input.width, height: input.height }
const resizedResults = faceapi.resizeResults(results, toSize);
// 设置展示的canvas和输入大小保持相同
faceapi.matchDimensions(canvas, input); 
// 展示矩形框
faceapi.drawDetection(canvas, resizedResults, { withScore: true })
// 展示人脸标记
faceapi.drawFaceLandmarks(canvas, resizedResults, { drawLines: true })
// 展示表情
faceapi.drawFaceExpressions(canvas, resizedResults)
// 展示年龄和性别
resizedResults.forEach((result) => {
  const { age, gender, genderProbability } = result;
  new faceapi.draw.DrawTextField(
    [
      `${Math.round(age)} years`,
      `${gender} (${Math.round(genderProbability)})`,
    ],
    result.detection.box.bottomLeft
  ).draw(canvas);
})
```
> toSize也可以是一个dom元素，会自动取宽和高

> FaceExpression = 'neutral' | 'happy' | 'sad' | 'angry' | 'fearful' | 'disgusted' | 'surprised'

## BBT人脸识别

```javascript
//加载BBT人脸识别模块
await faceapi.loadFaceRecognitionModel("/models");
const descOrg = await faceapi.computeFaceDescriptor(orgImgEl)
const descDet = await faceapi.computeFaceDescriptor(detImgEl)
// 结果越小越相似（一般小于0.6就认为是同一个人）
const result = faceapi.euclideanDistance(descOrg, descDet)
```












