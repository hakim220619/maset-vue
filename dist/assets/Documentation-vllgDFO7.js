import{q as s,a as o,e as t,b as a,o as i}from"./index-DFXP50QB.js";const n={},l={class:"card"};function r(d,e){return i(),o("div",l,e[0]||(e[0]=[t(`<div class="font-semibold text-2xl mb-4" data-v-b1799158>Documentation</div><div class="font-semibold text-xl mb-4" data-v-b1799158>Get Started</div><p class="text-lg mb-4" data-v-b1799158> Avalon is an application template and is based on <a href="https://github.com/vuejs/create-vue" class="font-medium text-primary hover:underline" data-v-b1799158>create-vue</a>, the recommended way to start a Vite-powered Vue projects. </p><p class="text-lg mb-4" data-v-b1799158>To get started, extract the contents of the zip file, cd to the directory and install the dependencies with npm, yarn or pnpm.</p><pre class="app-code" data-v-b1799158><code data-v-b1799158>npm install
npm run dev</code></pre><p class="text-lg mb-4" data-v-b1799158>Navigate to <i class="bg-highlight px-2 py-1 rounded-border not-italic text-base" data-v-b1799158>http://localhost:5173/</i> to view the application in your local environment.</p><div class="font-semibold text-xl mb-4" data-v-b1799158>Structure</div><p class="text-lg mb-4" data-v-b1799158>Avalon consists of a couple folders, demos and layout have been separated so that you can easily remove what is not necessary for your application.</p><ul class="leading-normal list-disc pl-8 text-lg mb-4" data-v-b1799158><li data-v-b1799158><span class="text-primary font-medium" data-v-b1799158>src/layout</span>: Main layout files, needs to be present.</li><li data-v-b1799158><span class="text-primary font-medium" data-v-b1799158>src/views</span>: Demo pages like Dashboard.</li><li data-v-b1799158><span class="text-primary font-medium" data-v-b1799158>public/demo</span>: Publicly accessible assets used in demos</li><li data-v-b1799158><span class="text-primary font-medium" data-v-b1799158>public/layout</span>: Publicly accessible assets used in layout</li><li data-v-b1799158><span class="text-primary font-medium" data-v-b1799158>src/assets/demo</span>: Styles used in demos</li><li data-v-b1799158><span class="text-primary font-medium" data-v-b1799158>src/assets/layout</span>: Styles of the main layout</li></ul><div class="font-semibold text-xl my-4" data-v-b1799158>Layout Composable</div><p class="text-lg mb-4" data-v-b1799158> The <span class="bg-highlight px-2 py-1 rounded-border not-italic text-base" data-v-b1799158>src/layout/composables/layout.js</span> is a composable that manages the layout state changes including dark mode, PrimeVue theme, menu modes and states. Use this composable to change the initial configuration and handle changes reactively. </p><pre class="app-code" data-v-b1799158><code data-v-b1799158>&lt;script setup&gt;
import { useLayout } from &#39;@/layout/composables/layout&#39;;

const { setMenuMode, toggleDarkMode } = useLayout();
    setMenuMode(&#39;slim&#39;);       // change to slim mode
    toggleDarkMode();          // change color scheme
&lt;/script&gt;
</code></pre><div class="font-semibold text-xl mb-4" data-v-b1799158>Menu</div><p class="text-lg mb-4" data-v-b1799158> Main menu is defined at <span class="bg-highlight px-2 py-1 rounded-border not-italic text-base" data-v-b1799158>src/layout/AppMenu.vue</span> file. Update the <i class="bg-highlight px-2 py-1 rounded-border not-italic text-base" data-v-b1799158>model</i> property to define your own menu items. </p><pre class="app-code" data-v-b1799158><code data-v-b1799158>&lt;script setup&gt;
import { ref } from &#39;vue&#39;;

import AppSubMenu from &#39;./AppSubMenu.vue&#39;;

const model = ref([
    {
        label: &#39;Dashboards&#39;,
        icon: &#39;pi pi-home&#39;,
        items: [
            {
                label: &#39;E-Commerce&#39;,
                icon: &#39;pi pi-fw pi-home&#39;,
                to: &#39;/&#39;
            },
            {
                label: &#39;Banking&#39;,
                icon: &#39;pi pi-fw pi-image&#39;,
                to: &#39;/dashboard-banking&#39;
            }
        ]
    },
    //...
</code></pre><div class="font-semibold text-xl mb-4" data-v-b1799158>Breadcrumb</div><p class="text-lg mb-4" data-v-b1799158> Breadcrumb component at the topbar section is dynamic and retrieves the path information from the router using the <span class="text-primary font-medium" data-v-b1799158>meta.breadcrumb</span> property. </p><pre class="app-code" data-v-b1799158><code data-v-b1799158>{
    path: &#39;/uikit/formlayout&#39;,
    name: &#39;formlayout&#39;,
    meta: {
        breadcrumb: [&#39;UI Kit&#39;, &#39;Form Layout&#39;]
    },
    component: () =&gt; import(&#39;@/views/uikit/FormLayout.vue&#39;)
},</code></pre><div class="font-semibold text-xl mb-4" data-v-b1799158>Topbar Theme</div><p data-v-b1799158> Theming of the topbar has 20 options to choose from, still if you&#39;d like to create your own theme then create a file like <span class="text-primary font-medium" data-v-b1799158>_topbar_mytopbar</span> under <span class="text-primary font-medium" data-v-b1799158>src/assets/layout/topbar/themes</span> folder with the content below using your own values. The style class name must begin with <span class="text-primary font-medium" data-v-b1799158>.layout-topbar-</span> prefix. </p><pre class="app-code" data-v-b1799158><code data-v-b1799158>.layout-topbar-mytheme {
    --topbar-bg: #0d6efd;
    --topbar-menu-button-bg: #ffffff;
    --topbar-menu-button-text-color: #0d6efd;
    --topbar-item-text-color: #ffffff;
}
</code></pre><div class="font-semibold text-xl mb-4" data-v-b1799158>Menu Theme</div><p data-v-b1799158> Main menu offers 12 built-in themes and building your own theme is quite trivial. First create a file like <span class="text-primary font-medium" data-v-b1799158>_menu_mymenu</span> under <span class="text-primary font-medium" data-v-b1799158>src/assets/layout/sidebar/themes</span> folder with the content below using your own values. The style class name must begin with <span class="text-primary font-medium" data-v-b1799158>.layout-menu-</span> prefix. </p><pre class="app-code" data-v-b1799158><code data-v-b1799158>.layout-menu-mytheme {
    --menu-bg: #ffffff;
    --root-menuitem-text-color: var(--p-text-color);
    --menuitem-text-color: var(--p-text-muted-color);
    --menuitem-hover-bg: rgba(0, 0, 0, 0.04);
    --active-menuitem-text-color: var(--p-primary-500);
    --active-menuitem-bg: var(--p-primary-50);
    --inline-menu-border-color: var(--p-content-border-color);
}
</code></pre><div class="font-semibold text-xl mb-4" data-v-b1799158>Learn More</div><p class="text-lg mb-4" data-v-b1799158>To learn more about how PrimeVue templates are implemented, visit the Sakai open source repository, Atlantis utilizes a similar structure as Sakai.</p>`,26),a("div",{class:"video-container mb-4"},[a("iframe",{class:"video",width:"560",height:"315",src:"https://www.youtube.com/embed/Ni_Yecfxv_g?si=11QMilH9sf06Xwi5",frameborder:"0",allowfullscreen:""})],-1),t('<div class="font-semibold text-xl mb-4" data-v-b1799158>Tailwind CSS</div><p class="text-lg mb-4" data-v-b1799158>The demo pages are developed using Tailwind CSS along with tailwind-primeui plugin, whereas the core application shell mainly uses custom CSS.</p><div class="font-semibold text-xl mb-4" data-v-b1799158>Variables</div><p class="text-lg mb-4" data-v-b1799158> CSS variables used in the template derive their values from the PrimeVue styled mode presets, use the files under <span class="bg-highlight px-2 py-1 rounded-border not-italic text-base" data-v-b1799158>src/assets/layout/variables</span> to customize according to your requirements. </p>',4)]))}const p=s(n,[["render",r],["__scopeId","data-v-b1799158"]]);export{p as default};
