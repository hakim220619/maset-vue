import { computed, reactive, ref, watch } from 'vue';

const layoutConfigFromStorage = JSON.parse(localStorage.getItem('layout-config')) || {};

const layoutConfig = reactive({
    preset: layoutConfigFromStorage.preset || 'Aura',
    primary: layoutConfigFromStorage.primary || 'indigo',
    surface: layoutConfigFromStorage.surface || null,
    darkTheme: layoutConfigFromStorage.darkTheme || false,
    menuMode: layoutConfigFromStorage.menuMode || 'horizontal',
    menuTheme: layoutConfigFromStorage.menuTheme || 'light',
    topbarTheme: layoutConfigFromStorage.topbarTheme || 'light',
    menuProfilePosition: layoutConfigFromStorage.menuProfilePosition || 'end'
});

const layoutState = reactive({
    staticMenuDesktopInactive: false,
    overlayMenuActive: false,
    configSidebarVisible: false,
    staticMenuMobileActive: false,
    menuHoverActive: false,
    rightMenuActive: false,
    sidebarActive: false,
    anchored: false,
    activeMenuItem: null,
    overlaySubmenuActive: false,
    menuProfileActive: false
});

const outsideClickListener = ref(null);

export function useLayout() {

    const updateConfig = (key, value) => {
        layoutConfig[key] = value;
        localStorage.setItem('layout-config', JSON.stringify(layoutConfig));
    };

    const setPrimary = (value) => {
        layoutConfig.primary = value;
        updateConfig('primary', value);

    };

    const setSurface = (value) => {
        layoutConfig.surface = value;
        updateConfig('surface', value);

    };

    const setPreset = (value) => {
        layoutConfig.preset = value;
        updateConfig('preset', value);
    };
    const setMenuTheme = (value) => {
        layoutConfig.menuTheme = value;
        updateConfig('menuTheme', value);
    };


    const setMenuMode = (mode) => {

        layoutConfig.menuMode = mode;
        updateConfig('menuMode', mode);
        if (mode === 'static') {
            layoutState.staticMenuDesktopInactive = false;
        }
    };

    const showConfigSidebar = () => {
        layoutState.configSidebarVisible = true;

    };

    const showSidebar = () => {
        layoutState.rightMenuActive = true;
    };

    const setTopbarTheme = (value) => {
        layoutConfig.topbarTheme = value;
        updateConfig('topbarTheme', value);
    };

    const setProfilePosition = (value) => {
        layoutConfig.menuProfilePosition = value;
        updateConfig('menuProfilePosition', value);
    };

    const onMenuProfileToggle = () => {
        layoutState.menuProfileActive = !layoutState.menuProfileActive;
    };

    const toggleDarkMode = () => {
        if (!document.startViewTransition) {
            executeDarkModeToggle();

            return;
        }

        document.startViewTransition(() => executeDarkModeToggle(event));
    };

    const executeDarkModeToggle = () => {
        layoutConfig.darkTheme = !layoutConfig.darkTheme;

        updateConfig('darkTheme', !layoutConfig.darkTheme);

        document.documentElement.classList.toggle('app-dark');
    };

    const setActiveMenuItem = (item) => {
        layoutState.activeMenuItem = item.value || item;
    };

    const setMenuStates = (value) => {
        layoutState.overlaySubmenuActive = value;
        layoutState.menuHoverActive = value;
    };

    const setStaticMenuMobile = () => {
        layoutState.staticMenuMobileActive = !layoutState.staticMenuMobileActive;
    };

    const watchSidebarActive = () => {
        watch(isSidebarActive, (newVal) => {
            if (newVal) {
                bindOutsideClickListener();
            } else {
                unbindOutsideClickListener();
            }
        });
    };

    const onMenuToggle = () => {
        if (layoutConfig.menuMode === 'overlay') {
            layoutState.overlayMenuActive = !layoutState.overlayMenuActive;
        }

        if (window.innerWidth > 991) {
            layoutState.staticMenuDesktopInactive = !layoutState.staticMenuDesktopInactive;
        } else {
            layoutState.staticMenuMobileActive = !layoutState.staticMenuMobileActive;
        }
    };

    const onProfileSidebarToggle = () => {
        layoutState.rightMenuActive = !layoutState.rightMenuActive;
    };

    const onConfigSidebarToggle = () => {
        if (isSidebarActive.value) {
            resetMenu();
            unbindOutsideClickListener();
        }

        layoutState.configSidebarVisible = !layoutState.configSidebarVisible;
    };

    const onSidebarToggle = (value) => {
        layoutState.sidebarActive = value;
    };

    const onAnchorToggle = () => {
        layoutState.anchored = !layoutState.anchored;
    };

    const bindOutsideClickListener = () => {
        if (!outsideClickListener.value) {
            outsideClickListener.value = (event) => {
                if (isOutsideClicked(event)) {
                    resetMenu();
                }
            };
            document.addEventListener('click', outsideClickListener.value);
        }
    };

    const unbindOutsideClickListener = () => {
        if (outsideClickListener.value) {
            document.removeEventListener('click', outsideClickListener.value);
            outsideClickListener.value = null;
        }
    };

    const isOutsideClicked = (event) => {
        const sidebarEl = document.querySelector('.layout-sidebar');
        const topbarButtonEl = document.querySelector('.layout-menu-button');

        return !(sidebarEl?.isSameNode(event.target) || sidebarEl?.contains(event.target) || topbarButtonEl?.isSameNode(event.target) || topbarButtonEl?.contains(event.target));
    };

    const resetMenu = () => {
        layoutState.overlayMenuActive = false;
        layoutState.overlaySubmenuActive = false;
        layoutState.staticMenuMobileActive = false;
        layoutState.menuHoverActive = false;
        layoutState.configSidebarVisible = false;
    };

    const isSidebarActive = computed(() => layoutState.overlayMenuActive || layoutState.staticMenuMobileActive || layoutState.overlaySubmenuActive);

    const isDesktop = computed(() => window.innerWidth > 991);

    const isSlim = computed(() => layoutConfig.menuMode === 'slim');
    const isSlimPlus = computed(() => layoutConfig.menuMode === 'slim-plus');
    const isHorizontal = computed(() => layoutConfig.menuMode === 'horizontal');

    const isDarkTheme = computed(() => layoutConfig.darkTheme);
    const getPrimary = computed(() => layoutConfig.primary);
    const getSurface = computed(() => layoutConfig.surface);

    return {
        layoutConfig,
        layoutState,
        getPrimary,
        getSurface,
        isDarkTheme,
        setPrimary,
        setSurface,
        setPreset,
        setMenuTheme,
        setMenuMode,
        setTopbarTheme,
        setProfilePosition,
        onMenuProfileToggle,
        toggleDarkMode,
        onMenuToggle,
        onProfileSidebarToggle,
        setMenuStates,
        setStaticMenuMobile,
        watchSidebarActive,
        isSidebarActive,
        setActiveMenuItem,
        onConfigSidebarToggle,
        onSidebarToggle,
        onAnchorToggle,
        isSlim,
        isSlimPlus,
        isHorizontal,
        isDesktop,
        showConfigSidebar,
        showSidebar,
        unbindOutsideClickListener
    };
}
