import{_ as e,y as t,b as r,z as a}from"./FaceMatcher.9cf7eaf3.js";function s(s){return e(this,void 0,void 0,(function(){var e,n;return t(this,(function(t){switch(t.label){case 0:return[4,a(s)];case 1:return[4,(e=t.sent()).blob()];case 2:if(!(n=t.sent()).type.startsWith("image/"))throw new Error("fetchImage - expected blob type to be of type image/*, instead have: "+n.type+", for url: "+e.url);return[2,r(n)]}}))}))}export{s as f};