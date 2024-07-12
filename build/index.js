(()=>{"use strict";const e=window.React,t=window.wp.i18n,n=(window.wp.blocks,window.wp.data),{useEffect:l,useState:r}=wp.element,{CheckboxControl:c,ExternalLink:o,Flex:a,FlexItem:i,TextControl:s}=wp.components;function d(){const[d,k]=r([]),m=(0,n.useSelect)((e=>e("core/block-editor").getBlocks()));l((()=>{u()}),[]);const u=()=>{const e=m?m.flatMap((e=>{const t=e.clientId,n=e.originalContent||"",l=(new DOMParser).parseFromString(n,"text/html");return Array.from(l.querySelectorAll("a")).map(((e,n)=>({id:`${t}/${n}`,href:e.href,innerText:e.innerText,blockId:t,targetBlank:e.attributes.target?e.attributes.target.value:""})))})):[];k(e)},h=(e,t)=>{const n=[...d],l=n.find((t=>t.id===e));l&&(t.href&&(l.href=t.href),void 0!==t.blank&&(l.targetBlank=t.blank?"_blank":void 0),k(n),p(l))},p=e=>{const t=(0,n.select)("core/block-editor").getBlock(e.blockId);if(t){const l=t.attributes.content||"",r=(new DOMParser).parseFromString(l,"text/html");r.querySelectorAll("a").forEach(((t,n)=>{n===parseInt(e.id.split("/")[1])&&(t.setAttribute("href",e.href),t.setAttribute("target",e.targetBlank))}));const c=r.body.innerHTML;(0,n.dispatch)("core/block-editor").updateBlockAttributes(e.blockId,{content:c}),(0,n.dispatch)("core/block-editor").flashBlock(e.blockId)}};return(0,e.createElement)("div",null,(0,e.createElement)("h3",null,(0,t.__)("Outbound Links","simple-link-checker")),d.map((n=>(0,e.createElement)("div",{key:n.id},(0,e.createElement)(o,{href:n.href},n.innerText),(0,e.createElement)(a,{gap:"3",justify:"flex-start"},(0,e.createElement)(i,null,(0,e.createElement)(s,{value:n.href,onChange:e=>h(n.id,{href:e})})),(0,e.createElement)(i,null,(0,e.createElement)(c,{label:(0,t.__)("Target _blank","simple-link-checker"),checked:"_blank"===n.targetBlank,onChange:e=>h(n.id,{blank:e})})))))))}const{render:k}=wp.element;window.addEventListener("load",(function(){console.log(document.getElementById("simple-link-checker-app")),k((0,e.createElement)(d,null),document.getElementById("simple-link-checker-app"))}),!1)})();