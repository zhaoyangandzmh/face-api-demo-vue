import{_ as a}from"./UploadButton.vue_vue&type=script&setup=true&lang.5a821b96.js";import{u as s,w as e,L as t,v as l,b as n}from"./FaceMatcher.9cf7eaf3.js";import{f as i}from"./fetchImage.05f71b13.js";import{d as m,I as u,r as x,K as g,w as o,i as p,N as c,h as r,F as b,j as d,O as v,P as w,o as f,t as h}from"./vendor.23c62718.js";v("data-v-5aa7d08b");const j={class:"bbt_face_similarity_more"},y={style:{width:"60%"}},_=c("label",null,"匹配图多选择：",-1),D=c("h3",null,"匹配图：",-1),M={class:"pic"},k=["src"],B=c("h3",null,"样本库：",-1),L=["textContent"],S={class:"pic"},U=["src","alt"],z={style:{width:"40%"}},E=c("h3",null,"识别结果（误差值越小越准确）：",-1),F=["src"],I={class:"info"};w();var P=m({setup(m){const v=u("loading"),w=x(),P=x([{name:"欣小萌",img:["images/xxm/xxm01.jpg","images/xxm/xxm02.jpg","images/xxm/xxm03.jpg","images/xxm/xxm04.jpg"]},{name:"旭旭宝宝",img:["images/xxbb/xxbb01.jpg","images/xxbb/xxbb02.jpg","images/xxbb/xxbb03.jpg","images/xxbb/xxbb04.jpg"]},{name:"张杰",img:["https://dwz.cn/ZggSBEtL","https://dwz.cn/U7nR0no0"]}]),C=x(["images/xxbb/xxbb01.jpg","images/xxm/xxm02.jpg","images/xxbb/xxbb02.jpg","images/xxm/xxm03.jpg","images/xxbb/xxbb04.jpg","https://dwz.cn/U7nR0no0"]),R=x([]),K=x();return g((async()=>{await(async()=>{v.startLoading("模块资源加载中"),await s("/models"),v.stopLoading();const a=await Promise.all(P.value.map((async a=>{let s=[];for(let t of a.img){const a=await i(t);s.push(await e(a))}return new t(a.name,s)})));K.value=new l(a)})(),(async()=>{C.value.forEach((async a=>{let s=Date.now();const t=await i(a),l=await e(t),n=await K.value.findBestMatch(l);R.value.push({target:a,result:n.toString(),time:Date.now()-s+"ms",fps:Math.round(1e3/(Date.now()-s))})}))})()})),o(w,(async a=>{a.length&&(C.value=[],R.value=[],a.forEach((async a=>{let s=Date.now(),t=await n(a);const l=await e(t),i=await K.value.findBestMatch(l);C.value.push(t.src),R.value.push({target:a.name,result:i.toString(),time:Date.now()-s+"ms",fps:Math.round(1e3/(Date.now()-s))})})))})),(s,e)=>(f(),p("div",j,[c("div",y,[c("div",null,[_,r(a,{multiple:!0,"file-list":w.value,"onUpdate:file-list":e[0]||(e[0]=a=>w.value=a),accept:"image/png, image/jpeg"},null,8,["file-list"])]),D,c("div",M,[(f(!0),p(b,null,d(C.value,((a,s)=>(f(),p("img",{key:s,src:a},null,8,k)))),128))]),B,(f(!0),p(b,null,d(P.value,((a,s)=>(f(),p("div",{key:s},[c("span",{style:{color:"#42b983"},textContent:h(a.name)},null,8,L),c("div",S,[(f(!0),p(b,null,d(a.img,(s=>(f(),p("img",{key:s,src:s,alt:a.name},null,8,U)))),128))])])))),128))]),c("div",z,[E,(f(!0),p(b,null,d(R.value,((a,s)=>(f(),p("div",{key:s,class:"result"},[c("img",{src:C.value[s]},null,8,F),c("div",I,[c("span",null,"对比："+h(a.target),1),c("span",null,"结果："+h(a.result),1),c("span",null,"时间："+h(a.time),1),c("span",null,"FPS："+h(a.fps),1)])])))),128))])]))}});P.__scopeId="data-v-5aa7d08b";export{P as default};
