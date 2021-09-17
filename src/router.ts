import {createRouter, createWebHistory} from 'vue-router'

export const routes = [
  { 
    path: '/', 
    meta:{
      navTitle:'Docs'
    },
    redirect:'/media-stream',
    children:[
      {
        path: '/media-stream', 
        name:"MediaStream",
        meta:{
          navTitle:'WebRTC媒体流'
        },
        component: () => import('./pages/Docs.vue')
      },
      {
        path: '/face-api', 
        name:"FaceApi",
        meta:{
          navTitle:'face-api介绍'
        },
        component: () => import('./pages/Docs.vue')
      }
    ],
    component: () => import('./pages/Index.vue') 
  },
  { 
    path: '/face-land-mark', 
    meta:{
      navTitle:'人脸标志检测'
    },
    component: () => import('./pages/FaceLandMark.vue') 
  },
  { 
    path: '/face-expression', 
    meta:{
      navTitle:'人脸表情识别'
    },
    component: () => import('./pages/FaceExpression.vue')
  },
  { 
    path: '/face-age-sex', 
    meta:{
      navTitle:'人脸年龄性别识别'
    },
    component: () => import('./pages/FaceAgeSex.vue') 
  },
  { 
    path: '/face-extract', 
    meta:{
      navTitle:'人脸提取'
    },
    component: () => import('./pages/FaceExtract.vue') 
  },
  { 
    path: '/face-recognition', 
    meta:{
      navTitle:'人脸识别'
    },
    component: () => import('./pages/FaceRecognition.vue')  
  },
  { 
    path: '/face-recognition-more', 
    meta:{
      navTitle:'人脸识别多图'
    },
    component: () => import('./pages/FaceRecognitionMore.vue')  
  }, 
  {
    path: "/bbt-face-similarity",
    meta:{
      navTitle:'BBT图片相似度'
    },
    component: () => import('./pages/BBTFaceSimilarity.vue')
  },
  {
    path: "/bbt-face-similarity-more",
    meta:{
      navTitle:"BBT图片相似度多查找"
    },
    component: () => import('./pages/BBTFaceSimilarityMore.vue')
  },
  {
    path: "/bbt-face-recognition",
    meta:{
      navTitle:"BBT人脸识别"
    },
    component: () => import('./pages/BBTFaceRecognition.vue')
  },
  {
    path: "/video-face-detector",
    meta:{
      navTitle:"Video人脸跟踪"
    },
    component: () => import('./pages/VideoFaceDetector.vue')
  },
  {
    path: "/video-face-recognition",
    meta:{
      navTitle:"Video人脸识别"
    },
    component: () => import('./pages/VideoFaceRecognition.vue')
  },
  {
    path: "/web-rtc-face-detector",
    meta:{
      navTitle:"WebRTC人脸跟踪"
    },
    component: () => import('./pages/WebRTCFaceDetector.vue')
  },
  {
    path: "/web-rtc-face-recognition",
    meta:{
      navTitle:"WebRTC人脸识别"
    },
    component: () => import('./pages/WebRTCFaceRecognition.vue')
  },
  {
    path: "/web-rtc-media-stream",
    meta:{
      navTitle:"WebRTC媒体流基础"
    },
    component: () => import('./pages/WebRTCMediaStream.vue')
  }
]

export default createRouter({
  history: createWebHistory(),
  routes
})
