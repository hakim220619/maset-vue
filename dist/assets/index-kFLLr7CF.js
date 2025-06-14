import{H as t,I as s,a as l,o as n,b as r,a2 as o,a3 as a,ao as d}from"./index-DFXP50QB.js";var p=t`
    .p-toolbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
        padding: dt('toolbar.padding');
        background: dt('toolbar.background');
        border: 1px solid dt('toolbar.border.color');
        color: dt('toolbar.color');
        border-radius: dt('toolbar.border.radius');
        gap: dt('toolbar.gap');
    }

    .p-toolbar-start,
    .p-toolbar-center,
    .p-toolbar-end {
        display: flex;
        align-items: center;
    }
`,b={root:"p-toolbar p-component",start:"p-toolbar-start",center:"p-toolbar-center",end:"p-toolbar-end"},i=s.extend({name:"toolbar",style:p,classes:b}),c={name:"BaseToolbar",extends:d,props:{ariaLabelledby:{type:String,default:null}},style:i,provide:function(){return{$pcToolbar:this,$parentInstance:this}}},m={name:"Toolbar",extends:c,inheritAttrs:!1},y=["aria-labelledby"];function u(e,v,$,g,f,h){return n(),l("div",a({class:e.cx("root"),role:"toolbar","aria-labelledby":e.ariaLabelledby},e.ptmi("root")),[r("div",a({class:e.cx("start")},e.ptm("start")),[o(e.$slots,"start")],16),r("div",a({class:e.cx("center")},e.ptm("center")),[o(e.$slots,"center")],16),r("div",a({class:e.cx("end")},e.ptm("end")),[o(e.$slots,"end")],16)],16,y)}m.render=u;export{m as s};
