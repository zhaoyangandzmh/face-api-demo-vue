<script setup lang="ts">
import {Menu} from 'ant-design-vue'
import {routes} from './router'
import {ref,provide,watch, onMounted,reactive,nextTick} from 'vue'
import {useRoute,onBeforeRouteUpdate} from 'vue-router'
import {
  MenuFoldOutlined,
} from '@ant-design/icons-vue';

const openKeys = ref(routes.map((item)=>item.path))
const isLoading = ref<Boolean>(false)
const loadingTip = ref<String>('');

const route = useRoute();
const selectedKeys = ref<string[]>([route.path]);

watch(route,(nVal,oVal)=>{
  selectedKeys.value=[nVal.path];
})

const startLoading = (tip='')=>{
  loadingTip.value = tip
  isLoading.value = true;
}
const stopLoading = ()=>{
  isLoading.value=false;
}

interface Loading {
  startLoading:()=>void
  stopLoading:()=>void
}

const loading:Loading = {startLoading, stopLoading}

provide('loading',loading);

const position = reactive({
  '/media-stream':0,
  '/face-api':0
});

const content = ref();
const savePosition = ()=>{
  const el = content.value.$el;  
  position[route.path] = el.scrollTop;
}
const setPosition = async ()=>{
  await nextTick();
  const el = content.value.$el; 
  el.scrollTop = position[route.path];
}
provide('position',{savePosition,setPosition});
</script>

<template>
    <a-layout class="wrap">
      <a-layout-header class="header">
        人脸识别演示
      </a-layout-header>
      <a-layout>
        <a-layout-sider class="content-height">
          <a-menu 
            style="height:100%"
            mode="inline"
            theme="dark"
            v-model:openKeys="openKeys"
            :selectedKeys="selectedKeys"
          >
            <template 
              v-for="routeInfo in routes"
              :key="routeInfo.path"
            >
              <a-menu-item 
                :key="routeInfo.path"
                v-if="!routeInfo.children"
              >
                <router-link :to="routeInfo.path">
                  {{ routeInfo.meta.navTitle }}
                </router-link>
              </a-menu-item>
              <a-sub-menu 
                v-else 
                :title="routeInfo.meta.navTitle"
                :key="routeInfo.path"
              >
                <a-menu-item 
                  v-for="child in routeInfo.children"
                  :key="child.path"
                >
                  <router-link :to="child.path">
                    {{ child.meta.navTitle }}
                  </router-link>
                </a-menu-item>
              </a-sub-menu>
            </template>
          </a-menu>
        </a-layout-sider>
        <a-layout-content ref="content" class="content content-height">
          <a-card>
            <router-view></router-view>
          </a-card>
        </a-layout-content>
      </a-layout>
      <div class="spin" v-if="isLoading">
        <a-spin size="large" :tip="loadingTip"/>
      </div>
    </a-layout>
</template>
<style scope>
  .wrap{
    position: relative;
  }
  .spin{
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    background-color: rgba(255,255,255,0.8);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .content-height{
    height: calc(100vh - 64px);
    overflow: auto;
  }
  .header{
    background-color: #fff;
    border-bottom:6px solid #67c65a;
    font-size: 24px;
    height: 64px;
    font-weight: bold;
    text-align: center;
  }
  .content{
    box-sizing: border-box;
    padding: 10px;
  }
</style>
