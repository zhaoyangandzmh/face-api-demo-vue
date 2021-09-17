<script setup lang="ts">
import { ref,reactive, onMounted,inject,watch } from 'vue'
import {onBeforeRouteLeave,useRoute} from 'vue-router'
import Markdown from 'vue3-markdown-it'
import 'github-markdown-css'
import 'highlight.js/styles/atom-one-dark-reasonable.css';
import mediaStreamSource from '@/docs/media-stream.md?raw'
import faceApiSource from '@/docs/face-api.md?raw';

const docMap = {
  '/media-stream':mediaStreamSource,
  '/face-api':faceApiSource
};

const route = useRoute();
const {setPosition,savePosition} = inject('position') as any;
onBeforeRouteLeave(savePosition);
onMounted(()=>{
  setPosition()
});
watch(()=>route.path,setPosition)
</script>

<template>
  <Markdown
    class="markdown-body"
    html
    linkify
    xhtmlOut
    typographer
    :source="docMap[$route.path]" 
  />
</template>

<style scoped>
  :deep(pre){
    border-radius:10px;
    background-color:#282c34;
  }
</style>
