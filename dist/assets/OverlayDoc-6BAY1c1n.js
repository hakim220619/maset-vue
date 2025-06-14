import{H as te,I as ie,C as U,al as oe,j as A,o as f,w as c,d as o,a5 as ne,a3 as d,A as O,p as H,a as j,a2 as z,F as re,b as n,a4 as I,n as se,t as F,m as K,ax as ae,K as le,s as $,ao as ce,ay as C,Y as P,P as ue,Q as pe,V as de,az as T,a8 as me,a9 as fe,Z as E,r as p,y as ve,aA as be,g as ge,aB as he,i as ye,T as Le}from"./index-DFXP50QB.js";import{O as we}from"./index-CkuicprJ.js";import{s as ke}from"./index-C-brlt9u.js";import{s as Ce}from"./index-5Vn3-IUo.js";import{s as je}from"./index-ncoWpiFM.js";import{s as xe}from"./index-ChJlCLim.js";import{s as ze}from"./index-DXiaQiTG.js";import{P as Pe}from"./ProductService-BtITuo-x.js";import"./index--WDr8mG8.js";import"./index-CLogvPCt.js";import"./index-roaz_8V-.js";import"./index-U6P4KpTO.js";import"./index-CuCRGwpW.js";import"./index-Cc_4RCZY.js";import"./index-DJSFsPlq.js";import"./index-BWbuHNqP.js";import"./index-CpB5OSn8.js";import"./index-DU-57Oi5.js";import"./index-LzOOx1rF.js";import"./index-mS_5aoLA.js";import"./index-BfnYsLk0.js";var Se=te`
    .p-confirmpopup {
        position: absolute;
        margin-top: dt('confirmpopup.gutter');
        top: 0;
        left: 0;
        background: dt('confirmpopup.background');
        color: dt('confirmpopup.color');
        border: 1px solid dt('confirmpopup.border.color');
        border-radius: dt('confirmpopup.border.radius');
        box-shadow: dt('confirmpopup.shadow');
    }

    .p-confirmpopup-content {
        display: flex;
        align-items: center;
        padding: dt('confirmpopup.content.padding');
        gap: dt('confirmpopup.content.gap');
    }

    .p-confirmpopup-icon {
        font-size: dt('confirmpopup.icon.size');
        width: dt('confirmpopup.icon.size');
        height: dt('confirmpopup.icon.size');
        color: dt('confirmpopup.icon.color');
    }

    .p-confirmpopup-footer {
        display: flex;
        justify-content: flex-end;
        gap: dt('confirmpopup.footer.gap');
        padding: dt('confirmpopup.footer.padding');
    }

    .p-confirmpopup-footer button {
        width: auto;
    }

    .p-confirmpopup-footer button:last-child {
        margin: 0;
    }

    .p-confirmpopup-flipped {
        margin-block-start: calc(dt('confirmpopup.gutter') * -1);
        margin-block-end: dt('confirmpopup.gutter');
    }

    .p-confirmpopup-enter-from {
        opacity: 0;
        transform: scaleY(0.8);
    }

    .p-confirmpopup-leave-to {
        opacity: 0;
    }

    .p-confirmpopup-enter-active {
        transition:
            transform 0.12s cubic-bezier(0, 0, 0.2, 1),
            opacity 0.12s cubic-bezier(0, 0, 0.2, 1);
    }

    .p-confirmpopup-leave-active {
        transition: opacity 0.1s linear;
    }

    .p-confirmpopup:after,
    .p-confirmpopup:before {
        bottom: 100%;
        left: calc(dt('confirmpopup.arrow.offset') + dt('confirmpopup.arrow.left'));
        content: ' ';
        height: 0;
        width: 0;
        position: absolute;
        pointer-events: none;
    }

    .p-confirmpopup:after {
        border-width: calc(dt('confirmpopup.gutter') - 2px);
        margin-left: calc(-1 * (dt('confirmpopup.gutter') - 2px));
        border-style: solid;
        border-color: transparent;
        border-bottom-color: dt('confirmpopup.background');
    }

    .p-confirmpopup:before {
        border-width: dt('confirmpopup.gutter');
        margin-left: calc(-1 * dt('confirmpopup.gutter'));
        border-style: solid;
        border-color: transparent;
        border-bottom-color: dt('confirmpopup.border.color');
    }

    .p-confirmpopup-flipped:after,
    .p-confirmpopup-flipped:before {
        bottom: auto;
        top: 100%;
    }

    .p-confirmpopup-flipped:after {
        border-bottom-color: transparent;
        border-top-color: dt('confirmpopup.background');
    }

    .p-confirmpopup-flipped:before {
        border-bottom-color: transparent;
        border-top-color: dt('confirmpopup.border.color');
    }
`,qe={root:"p-confirmpopup p-component",content:"p-confirmpopup-content",icon:"p-confirmpopup-icon",message:"p-confirmpopup-message",footer:"p-confirmpopup-footer",pcRejectButton:"p-confirmpopup-reject-button",pcAcceptButton:"p-confirmpopup-accept-button"},Ae=ie.extend({name:"confirmpopup",style:Se,classes:qe}),Ee={name:"BaseConfirmPopup",extends:ce,props:{group:String},style:Ae,provide:function(){return{$pcConfirmPopup:this,$parentInstance:this}}},N={name:"ConfirmPopup",extends:Ee,inheritAttrs:!1,data:function(){return{visible:!1,confirmation:null,autoFocusAccept:null,autoFocusReject:null,target:null}},target:null,outsideClickListener:null,scrollHandler:null,resizeListener:null,container:null,confirmListener:null,closeListener:null,mounted:function(){var e=this;this.confirmListener=function(a){a&&a.group===e.group&&(e.confirmation=a,e.target=a.target,e.confirmation.onShow&&e.confirmation.onShow(),e.visible=!0)},this.closeListener=function(){e.visible=!1,e.confirmation=null},C.on("confirm",this.confirmListener),C.on("close",this.closeListener)},beforeUnmount:function(){C.off("confirm",this.confirmListener),C.off("close",this.closeListener),this.unbindOutsideClickListener(),this.scrollHandler&&(this.scrollHandler.destroy(),this.scrollHandler=null),this.unbindResizeListener(),this.container&&(E.clear(this.container),this.container=null),this.target=null,this.confirmation=null},methods:{accept:function(){this.confirmation.accept&&this.confirmation.accept(),this.visible=!1},reject:function(){this.confirmation.reject&&this.confirmation.reject(),this.visible=!1},onHide:function(){this.confirmation.onHide&&this.confirmation.onHide(),this.visible=!1},onAcceptKeydown:function(e){(e.code==="Space"||e.code==="Enter"||e.code==="NumpadEnter")&&(this.accept(),P(this.target),e.preventDefault())},onRejectKeydown:function(e){(e.code==="Space"||e.code==="Enter"||e.code==="NumpadEnter")&&(this.reject(),P(this.target),e.preventDefault())},onEnter:function(e){this.autoFocusAccept=this.confirmation.defaultFocus===void 0||this.confirmation.defaultFocus==="accept",this.autoFocusReject=this.confirmation.defaultFocus==="reject",this.target=this.target||document.activeElement,this.bindOutsideClickListener(),this.bindScrollListener(),this.bindResizeListener(),E.set("overlay",e,this.$primevue.config.zIndex.overlay)},onAfterEnter:function(){this.focus()},onLeave:function(){this.autoFocusAccept=null,this.autoFocusReject=null,P(this.target),this.target=null,this.unbindOutsideClickListener(),this.unbindScrollListener(),this.unbindResizeListener()},onAfterLeave:function(e){E.clear(e)},alignOverlay:function(){de(this.container,this.target,!1);var e=T(this.container),a=T(this.target),v=0;e.left<a.left&&(v=a.left-e.left),this.container.style.setProperty(me("confirmpopup.arrow.left").name,"".concat(v,"px")),e.top<a.top&&(this.container.setAttribute("data-p-confirmpopup-flipped","true"),!this.isUnstyled&&fe(this.container,"p-confirmpopup-flipped"))},bindOutsideClickListener:function(){var e=this;this.outsideClickListener||(this.outsideClickListener=function(a){e.visible&&e.container&&!e.container.contains(a.target)&&!e.isTargetClicked(a)?(e.confirmation.onHide&&e.confirmation.onHide(),e.visible=!1):e.alignOverlay()},document.addEventListener("click",this.outsideClickListener))},unbindOutsideClickListener:function(){this.outsideClickListener&&(document.removeEventListener("click",this.outsideClickListener),this.outsideClickListener=null)},bindScrollListener:function(){var e=this;this.scrollHandler||(this.scrollHandler=new pe(this.target,function(){e.visible&&(e.visible=!1)})),this.scrollHandler.bindScrollListener()},unbindScrollListener:function(){this.scrollHandler&&this.scrollHandler.unbindScrollListener()},bindResizeListener:function(){var e=this;this.resizeListener||(this.resizeListener=function(){e.visible&&!ue()&&(e.visible=!1)},window.addEventListener("resize",this.resizeListener))},unbindResizeListener:function(){this.resizeListener&&(window.removeEventListener("resize",this.resizeListener),this.resizeListener=null)},focus:function(){var e=this.container.querySelector("[autofocus]");e&&e.focus({preventScroll:!0})},isTargetClicked:function(e){return this.target&&(this.target===e.target||this.target.contains(e.target))},containerRef:function(e){this.container=e},onOverlayClick:function(e){we.emit("overlay-click",{originalEvent:e,target:this.target})},onOverlayKeydown:function(e){e.code==="Escape"&&(C.emit("close",this.closeListener),P(this.target))}},computed:{message:function(){return this.confirmation?this.confirmation.message:null},acceptLabel:function(){if(this.confirmation){var e,a=this.confirmation;return a.acceptLabel||((e=a.acceptProps)===null||e===void 0?void 0:e.label)||this.$primevue.config.locale.accept}return this.$primevue.config.locale.accept},rejectLabel:function(){if(this.confirmation){var e,a=this.confirmation;return a.rejectLabel||((e=a.rejectProps)===null||e===void 0?void 0:e.label)||this.$primevue.config.locale.reject}return this.$primevue.config.locale.reject},acceptIcon:function(){var e;return this.confirmation?this.confirmation.acceptIcon:(e=this.confirmation)!==null&&e!==void 0&&e.acceptProps?this.confirmation.acceptProps.icon:null},rejectIcon:function(){var e;return this.confirmation?this.confirmation.rejectIcon:(e=this.confirmation)!==null&&e!==void 0&&e.rejectProps?this.confirmation.rejectProps.icon:null}},components:{Button:$,Portal:le},directives:{focustrap:ae}},Oe=["aria-modal"];function Re(t,e,a,v,l,r){var g=U("Button"),L=U("Portal"),x=oe("focustrap");return f(),A(L,null,{default:c(function(){return[o(ne,d({name:"p-confirmpopup",onEnter:r.onEnter,onAfterEnter:r.onAfterEnter,onLeave:r.onLeave,onAfterLeave:r.onAfterLeave},t.ptm("transition")),{default:c(function(){var h,w,y;return[l.visible?O((f(),j("div",d({key:0,ref:r.containerRef,role:"alertdialog",class:t.cx("root"),"aria-modal":l.visible,onClick:e[2]||(e[2]=function(){return r.onOverlayClick&&r.onOverlayClick.apply(r,arguments)}),onKeydown:e[3]||(e[3]=function(){return r.onOverlayKeydown&&r.onOverlayKeydown.apply(r,arguments)})},t.ptmi("root")),[t.$slots.container?z(t.$slots,"container",{key:0,message:l.confirmation,acceptCallback:r.accept,rejectCallback:r.reject}):(f(),j(re,{key:1},[t.$slots.message?(f(),A(I(t.$slots.message),{key:1,message:l.confirmation},null,8,["message"])):(f(),j("div",d({key:0,class:t.cx("content")},t.ptm("content")),[z(t.$slots,"icon",{},function(){return[t.$slots.icon?(f(),A(I(t.$slots.icon),{key:0,class:se(t.cx("icon"))},null,8,["class"])):l.confirmation.icon?(f(),j("span",d({key:1,class:[l.confirmation.icon,t.cx("icon")]},t.ptm("icon")),null,16)):H("",!0)]}),n("span",d({class:t.cx("message")},t.ptm("message")),F(l.confirmation.message),17)],16)),n("div",d({class:t.cx("footer")},t.ptm("footer")),[o(g,d({class:[t.cx("pcRejectButton"),l.confirmation.rejectClass],autofocus:l.autoFocusReject,unstyled:t.unstyled,size:((h=l.confirmation.rejectProps)===null||h===void 0?void 0:h.size)||"small",text:((w=l.confirmation.rejectProps)===null||w===void 0?void 0:w.text)||!1,onClick:e[0]||(e[0]=function(b){return r.reject()}),onKeydown:r.onRejectKeydown},l.confirmation.rejectProps,{label:r.rejectLabel,pt:t.ptm("pcRejectButton")}),K({_:2},[r.rejectIcon||t.$slots.rejecticon?{name:"icon",fn:c(function(b){return[z(t.$slots,"rejecticon",{},function(){return[n("span",d({class:[r.rejectIcon,b.class]},t.ptm("pcRejectButton").icon,{"data-pc-section":"rejectbuttonicon"}),null,16)]})]}),key:"0"}:void 0]),1040,["class","autofocus","unstyled","size","text","onKeydown","label","pt"]),o(g,d({class:[t.cx("pcAcceptButton"),l.confirmation.acceptClass],autofocus:l.autoFocusAccept,unstyled:t.unstyled,size:((y=l.confirmation.acceptProps)===null||y===void 0?void 0:y.size)||"small",onClick:e[1]||(e[1]=function(b){return r.accept()}),onKeydown:r.onAcceptKeydown},l.confirmation.acceptProps,{label:r.acceptLabel,pt:t.ptm("pcAcceptButton")}),K({_:2},[r.acceptIcon||t.$slots.accepticon?{name:"icon",fn:c(function(b){return[z(t.$slots,"accepticon",{},function(){return[n("span",d({class:[r.acceptIcon,b.class]},t.ptm("pcAcceptButton").icon,{"data-pc-section":"acceptbuttonicon"}),null,16)]})]}),key:"0"}:void 0]),1040,["class","autofocus","unstyled","size","onKeydown","label","pt"])],16)],64))],16,Oe)),[[x]]):H("",!0)]}),_:3},16,["onEnter","onAfterEnter","onLeave","onAfterLeave"])]}),_:3})}N.render=Re;const De={class:"flex flex-col md:flex-row gap-8"},Be={class:"md:w-1/2"},Ue={class:"card"},He={class:"card"},Ie={class:"flex flex-wrap gap-2"},Ke=["src","alt"],Te={class:"card"},Fe={class:"inline-flex gap-4"},$e={class:"md:w-1/2"},Ne={class:"card"},Ye={class:"card"},Ve={class:"card"},mt={__name:"OverlayDoc",setup(t){const e=p(!1),a=p(!1),v=p(!1),l=p(!1),r=p(!1),g=p(!1),L=p(!1),x=p(null),h=p(null),w=p(null),y=p(null),b=p(null),S=ve(),Y=be();ge(()=>{Pe.getProductsSmall().then(m=>x.value=m)});function V(){e.value=!0}function M(){e.value=!1}function Z(){a.value=!0}function R(){a.value=!1}function Q(m){y.value.toggle(m)}function G(m){w.value.hide(),S.add({severity:"info",summary:"Product Selected",detail:m.data.name,life:3e3})}function J(m){Y.require({target:m.target,message:"Are you sure you want to proceed?",icon:"pi pi-exclamation-triangle",rejectProps:{label:"Cancel",severity:"secondary",outlined:!0},acceptProps:{label:"Save"},accept:()=>{S.add({severity:"info",summary:"Confirmed",detail:"You have accepted",life:3e3})},reject:()=>{S.add({severity:"info",summary:"Rejected",detail:"You have rejected",life:3e3})}})}return(m,i)=>{const u=$,D=ze,q=xe,W=je,X=Ce,_=ke,k=he,ee=N,B=Le;return f(),j("div",De,[n("div",Be,[n("div",Ue,[i[15]||(i[15]=n("div",{class:"font-semibold text-xl mb-4"},"Dialog",-1)),o(D,{header:"Dialog",visible:e.value,"onUpdate:visible":i[0]||(i[0]=s=>e.value=s),breakpoints:{"960px":"75vw"},style:{width:"30vw"},modal:!0},{footer:c(()=>[o(u,{label:"Save",onClick:M})]),default:c(()=>[i[14]||(i[14]=n("p",{class:"leading-normal m-0"}," Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. ",-1))]),_:1},8,["visible"]),o(u,{label:"Show",style:{width:"auto"},onClick:V})]),n("div",He,[i[16]||(i[16]=n("div",{class:"font-semibold text-xl mb-4"},"Popover",-1)),n("div",Ie,[o(u,{type:"button",label:"Show",onClick:Q}),o(X,{ref_key:"op2",ref:y,id:"overlay_panel",style:{width:"450px"}},{default:c(()=>[o(W,{selection:h.value,"onUpdate:selection":i[1]||(i[1]=s=>h.value=s),value:x.value,selectionMode:"single",paginator:!0,rows:5,onRowSelect:G},{default:c(()=>[o(q,{field:"name",header:"Name",sortable:"",style:{"min-width":"12rem"}}),o(q,{header:"Image"},{body:c(s=>[n("img",{src:`https://primefaces.org/cdn/primevue/images/product/${s.data.image}`,alt:s.data.image,class:"w-16 shadow-sm"},null,8,Ke)]),_:1}),o(q,{field:"price",header:"Price",sortable:"",style:{"min-width":"8rem"}},{body:c(s=>[ye(" $ "+F(s.data.price),1)]),_:1})]),_:1},8,["selection","value"])]),_:1},512)])]),n("div",Te,[i[17]||(i[17]=n("div",{class:"font-semibold text-xl mb-4"},"Tooltip",-1)),n("div",Fe,[O(o(_,{type:"text",placeholder:"Username"},null,512),[[B,"Your username"]]),O(o(u,{type:"button",label:"Save"},null,512),[[B,"Click to proceed"]])])])]),n("div",$e,[n("div",Ne,[i[23]||(i[23]=n("div",{class:"font-semibold text-xl mb-4"},"Drawer",-1)),o(k,{visible:v.value,"onUpdate:visible":i[2]||(i[2]=s=>v.value=s),header:"Drawer"},{default:c(()=>i[18]||(i[18]=[n("p",null," Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. ",-1)])),_:1},8,["visible"]),o(k,{visible:l.value,"onUpdate:visible":i[3]||(i[3]=s=>l.value=s),header:"Drawer",position:"right"},{default:c(()=>i[19]||(i[19]=[n("p",null," Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. ",-1)])),_:1},8,["visible"]),o(k,{visible:r.value,"onUpdate:visible":i[4]||(i[4]=s=>r.value=s),header:"Drawer",position:"top"},{default:c(()=>i[20]||(i[20]=[n("p",null," Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. ",-1)])),_:1},8,["visible"]),o(k,{visible:g.value,"onUpdate:visible":i[5]||(i[5]=s=>g.value=s),header:"Drawer",position:"bottom"},{default:c(()=>i[21]||(i[21]=[n("p",null," Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. ",-1)])),_:1},8,["visible"]),o(k,{visible:L.value,"onUpdate:visible":i[6]||(i[6]=s=>L.value=s),header:"Drawer",position:"full"},{default:c(()=>i[22]||(i[22]=[n("p",null," Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. ",-1)])),_:1},8,["visible"]),o(u,{icon:"pi pi-arrow-right",onClick:i[7]||(i[7]=s=>v.value=!0),style:{"margin-right":"0.25em"}}),o(u,{icon:"pi pi-arrow-left",onClick:i[8]||(i[8]=s=>l.value=!0),style:{"margin-right":"0.25em"}}),o(u,{icon:"pi pi-arrow-down",onClick:i[9]||(i[9]=s=>r.value=!0),style:{"margin-right":"0.25em"}}),o(u,{icon:"pi pi-arrow-up",onClick:i[10]||(i[10]=s=>g.value=!0),style:{"margin-right":"0.25em"}}),o(u,{icon:"pi pi-external-link",onClick:i[11]||(i[11]=s=>L.value=!0)})]),n("div",Ye,[i[24]||(i[24]=n("div",{class:"font-semibold text-xl mb-4"},"ConfirmPopup",-1)),o(ee),o(u,{ref_key:"popup",ref:b,onClick:i[12]||(i[12]=s=>J(s)),icon:"pi pi-check",label:"Confirm",class:"mr-2"},null,512)]),n("div",Ve,[i[26]||(i[26]=n("div",{class:"font-semibold text-xl mb-4"},"ConfirmDialog",-1)),o(u,{label:"Delete",icon:"pi pi-trash",severity:"danger",style:{width:"auto"},onClick:Z}),o(D,{header:"Confirmation",visible:a.value,"onUpdate:visible":i[13]||(i[13]=s=>a.value=s),style:{width:"350px"},modal:!0},{footer:c(()=>[o(u,{label:"No",icon:"pi pi-times",onClick:R,text:"",severity:"secondary"}),o(u,{label:"Yes",icon:"pi pi-check",onClick:R,severity:"danger",outlined:"",autofocus:""})]),default:c(()=>[i[25]||(i[25]=n("div",{class:"flex items-center justify-center"},[n("i",{class:"pi pi-exclamation-triangle mr-4",style:{"font-size":"2rem"}}),n("span",null,"Are you sure you want to proceed?")],-1))]),_:1},8,["visible"])])])])}}};export{mt as default};
