import{f as e}from"./index.5070ea57.js";import{O as t,P as a,o as n,i,N as s,a0 as o,a1 as l,a2 as d,k as c}from"./vendor.51cee63a.js";import{n as r,l as u,m as h,s as m,M as p,T as v,S as f,d as E,q as g}from"./FaceMatcher.9cf7eaf3.js";import{m as w,r as b}from"./resizeResults.7ec8b892.js";import{d as y}from"./drawDetections.4fc2c34e.js";import{d as F}from"./drawFaceExpressions.5723c421.js";import"./fetchImage.05f71b13.js";import"./detectFaces.dcb5ab79.js";const x={name:"WebRTCFaceRecognition",data:()=>({nets:"tinyFaceDetector",options:null,withBoxes:!0,detectFace:"detectSingleFace",detection:"landmark",videoEl:null,canvasEl:null,timeout:0,constraints:{audio:!1,video:{width:{min:320,ideal:1280,max:1920},height:{min:240,ideal:720,max:1080},frameRate:{min:15,ideal:30,max:60},facingMode:"environment"}}}),watch:{nets(e){this.nets=e,this.fnInit()},detection(e){this.detection=e,this.videoEl.pause(),setTimeout((()=>{this.videoEl.play(),setTimeout((()=>this.fnRun()),300)}),300)}},mounted(){this.$nextTick((()=>{this.fnInit()}))},methods:{async fnInit(){switch(await r[this.nets].loadFromUri("/models"),await u("/models"),await h("/models"),await m("/models"),this.nets){case"ssdMobilenetv1":this.options=new f({minConfidence:.5});break;case"tinyFaceDetector":this.options=new v({inputSize:512,scoreThreshold:.5});break;case"mtcnn":this.options=new p({minFaceSize:20,scaleFactor:.709})}this.videoEl=document.getElementById("myVideo"),this.canvasEl=document.getElementById("myCanvas")},async fnRunFaceLandmark(){if(console.log("RunFaceLandmark"),this.videoEl.paused)return clearTimeout(this.timeout);const t=await e[this.detectFace](this.videoEl,this.options).withFaceLandmarks();if(t&&!this.videoEl.paused){const e=w(this.canvasEl,this.videoEl,!0),a=b(t,e);this.withBoxes?y(this.canvasEl,a):E(this.canvasEl,a)}else this.canvasEl.getContext("2d").clearRect(0,0,this.canvasEl.width,this.canvasEl.height);this.timeout=setTimeout((()=>this.fnRunFaceLandmark()),20)},async fnRunFaceExpression(){if(console.log("RunFaceExpression"),this.videoEl.paused)return clearTimeout(this.timeout);const t=await e[this.detectFace](this.videoEl,this.options).withFaceLandmarks().withFaceExpressions();if(t&&!this.videoEl.paused){const e=w(this.canvasEl,this.videoEl,!0),a=b(t,e);this.withBoxes?y(this.canvasEl,a):E(this.canvasEl,a),F(this.canvasEl,a,.05)}else this.canvasEl.getContext("2d").clearRect(0,0,this.canvasEl.width,this.canvasEl.height);this.timeout=setTimeout((()=>this.fnRunFaceExpression()),20)},async fnRunFaceAgeAndGender(){if(console.log("RunFaceAgeAndGender"),this.videoEl.paused)return clearTimeout(this.timeout);const t=await e[this.detectFace](this.videoEl,this.options).withFaceLandmarks().withAgeAndGender();if(t&&!this.videoEl.paused){const e=w(this.canvasEl,this.videoEl,!0),a=b(t,e);if(this.withBoxes?y(this.canvasEl,a):E(this.canvasEl,a),Array.isArray(a))a.forEach((e=>{const{age:t,gender:a,genderProbability:n}=e;new g([`${Math.round(t,0)} years`,`${a} (${Math.round(n)})`],e.detection.box.bottomLeft).draw(this.canvasEl)}));else{const{age:e,gender:t,genderProbability:n}=a;new g([`${Math.round(e,0)} years`,`${t} (${Math.round(n)})`],a.detection.box.bottomLeft).draw(this.canvasEl)}}else this.canvasEl.getContext("2d").clearRect(0,0,this.canvasEl.width,this.canvasEl.height);this.timeout=setTimeout((()=>this.fnRunFaceAgeAndGender()),20)},fnRun(){"landmark"!==this.detection?"expression"!==this.detection?"age_gender"!==this.detection||this.fnRunFaceAgeAndGender():this.fnRunFaceExpression():this.fnRunFaceLandmark()},fnOpen(){"object"!=typeof window.stream&&(clearTimeout(this.timeout),this.timeout=setTimeout((()=>{clearTimeout(this.timeout),navigator.mediaDevices.getUserMedia(this.constraints).then(this.fnSuccess).catch(this.fnError)}),300))},fnSuccess(e){window.stream=e,this.videoEl.srcObject=e,this.videoEl.play()},fnError(e){console.log(e),alert("视频媒体流获取错误"+e)},fnClose(){this.canvasEl.getContext("2d").clearRect(0,0,this.canvasEl.width,this.canvasEl.height),this.videoEl.pause(),clearTimeout(this.timeout),"object"==typeof window.stream&&(window.stream.getTracks().forEach((e=>e.stop())),window.stream="",this.videoEl.srcObject=null)}},beforeUnmount(){this.fnClose()}};t("data-v-0420b66c");const R={class:"webrtc_face_recognition"},k={class:"option"},T=s("label",null,"面板操作：",-1),M=s("span",{style:{"margin-right":"20px"}},"前置后置切换（重新启动摄像头）：",-1),C=c(" 前置 "),U=c(" 后置 "),A=s("span",{style:{"margin-right":"20px"}},"检测识别类型：",-1),V=c(" 轮廓检测 "),j=c(" 表情检测 "),L=c(" 年龄性别检测 "),B=s("label",null,"边框Or面部轮廓：",-1),I=s("label",null,"检测人脸：",-1),O=c(" 可信单 "),S=c(" 模糊多 "),$=s("label",null,"选择算法模型",-1),D=c(" ssdMobilenetv1 "),_=c(" tinyFaceDetector "),G=c(" mtcnn "),z={class:"see"},P=s("canvas",{id:"myCanvas"},null,-1);a(),x.render=function(e,t,a,c,r,u){return n(),i("div",R,[s("div",k,[s("div",null,[T,s("button",{onClick:t[0]||(t[0]=(...e)=>u.fnOpen&&u.fnOpen(...e))},"启动摄像头视频媒体"),s("button",{onClick:t[1]||(t[1]=(...e)=>u.fnClose&&u.fnClose(...e))},"结束摄像头视频媒体")]),s("div",null,[M,s("label",null,[C,o(s("input",{type:"radio","onUpdate:modelValue":t[2]||(t[2]=e=>r.constraints.video.facingMode=e),value:"user"},null,512),[[l,r.constraints.video.facingMode]])]),s("label",null,[U,o(s("input",{type:"radio","onUpdate:modelValue":t[3]||(t[3]=e=>r.constraints.video.facingMode=e),value:"environment"},null,512),[[l,r.constraints.video.facingMode]])])]),s("div",null,[A,s("label",null,[V,o(s("input",{type:"radio","onUpdate:modelValue":t[4]||(t[4]=e=>r.detection=e),value:"landmark"},null,512),[[l,r.detection]])]),s("label",null,[j,o(s("input",{type:"radio","onUpdate:modelValue":t[5]||(t[5]=e=>r.detection=e),value:"expression"},null,512),[[l,r.detection]])]),s("label",null,[L,o(s("input",{type:"radio","onUpdate:modelValue":t[6]||(t[6]=e=>r.detection=e),value:"age_gender"},null,512),[[l,r.detection]])])]),s("div",null,[B,o(s("input",{type:"checkbox","onUpdate:modelValue":t[7]||(t[7]=e=>r.withBoxes=e)},null,512),[[d,r.withBoxes]])]),s("div",null,[I,s("label",null,[O,o(s("input",{type:"radio","onUpdate:modelValue":t[8]||(t[8]=e=>r.detectFace=e),value:"detectSingleFace"},null,512),[[l,r.detectFace]])]),s("label",null,[S,o(s("input",{type:"radio","onUpdate:modelValue":t[9]||(t[9]=e=>r.detectFace=e),value:"detectAllFaces"},null,512),[[l,r.detectFace]])])]),s("div",null,[$,s("label",null,[D,o(s("input",{type:"radio","onUpdate:modelValue":t[10]||(t[10]=e=>r.nets=e),value:"ssdMobilenetv1"},null,512),[[l,r.nets]])]),s("label",null,[_,o(s("input",{type:"radio","onUpdate:modelValue":t[11]||(t[11]=e=>r.nets=e),value:"tinyFaceDetector"},null,512),[[l,r.nets]])]),s("label",null,[G,o(s("input",{type:"radio","onUpdate:modelValue":t[12]||(t[12]=e=>r.nets=e),value:"mtcnn"},null,512),[[l,r.nets]])])])]),s("div",z,[s("video",{id:"myVideo",poster:"https://dummyimage.com/960x540",muted:"",loop:"",playsinline:"",onLoadedmetadata:t[13]||(t[13]=(...e)=>u.fnRun&&u.fnRun(...e))},null,32),P])])},x.__scopeId="data-v-0420b66c";export{x as default};
