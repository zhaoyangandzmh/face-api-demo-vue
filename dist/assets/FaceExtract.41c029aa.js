import{d as a,I as e,r as s,K as t,w as l,i as n,h as c,g as i,N as o,F as r,j as u,z as d,O as v,P as m,o as p,k as f,Q as g,V as b}from"./vendor.51cee63a.js";/* empty css              *//* empty css              */import{_ as w}from"./shl.75cfabae.js";import{_ as j}from"./UploadButton.vue_vue&type=script&setup=true&lang.d580cfdf.js";import{n as y,M as F,T as _,S as h,t as M,b as U}from"./FaceMatcher.9cf7eaf3.js";import{d as k}from"./detectFaces.dcb5ab79.js";v("data-v-35fd3bd5");const x=f(" 更换图片： "),z=f(" 选择算法模型： "),D={class:"see"},L=o("p",{class:"text"},"截取出的人脸图像：",-1),S=["src"];m();var I=a({setup(a){const v=e("loading"),m=s([]),f=s("ssdMobilenetv1"),I=s({}),T=s([]),B=s(),C=["ssdMobilenetv1","tinyFaceDetector","mtcnn"],K=async()=>{switch(v.startLoading("模块资源加载中"),await y[f.value].loadFromUri("/models"),v.stopLoading(),f.value){case"ssdMobilenetv1":I.value=new h({minConfidence:.5});break;case"tinyFaceDetector":I.value=new _({inputSize:512,scoreThreshold:.5});break;case"mtcnn":I.value=new F({minFaceSize:20,scaleFactor:.709})}},N=async()=>{const a=await k(B.value,I.value),e=await M(B.value,a);T.value=e.map((a=>a.toDataURL()))};return t((async()=>{await K(),N()})),l(f,(async()=>{await K(),N()})),l(m,(async a=>{if(!a.length)return;const e=await U(a[0]);B.value.src=e.src,N()})),(a,e)=>{const s=g,t=b,l=d;return p(),n(r,null,[c(l,null,{default:i((()=>[c(s,null,{default:i((()=>[x,c(j,{"file-list":m.value,"onUpdate:file-list":e[0]||(e[0]=a=>m.value=a),accept:"image/png, image/jpeg"},null,8,["file-list"])])),_:1}),c(s,null,{default:i((()=>[z,c(t,{options:C,value:f.value,"onUpdate:value":e[1]||(e[1]=a=>f.value=a)},null,8,["value"])])),_:1})])),_:1}),o("div",D,[o("img",{ref:B,src:w},null,512)]),L,(p(!0),n(r,null,u(T.value,((a,e)=>(p(),n("img",{class:"img",key:e,src:a},null,8,S)))),128))],64)}}});I.__scopeId="data-v-35fd3bd5";export{I as default};
