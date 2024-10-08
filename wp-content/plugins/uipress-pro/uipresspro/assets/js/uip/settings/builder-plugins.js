///IMPORT TRANSLATIONS
const { __, _x, _n, _nx } = wp.i18n;
const pluginVersion = import.meta.url.split('?ver=')[1];

//Group options
const Plugins = [
  {
    label: 'UiPress Pro',
    component: 'uipProPlugin',
    path: `${uipProPath}assets/js/uip/plugins/pro-plugin.min.js?ver=${pluginVersion}`,
    loadInApp: true,
  },
  {
    label: 'Advanced Menu Editor',
    component: 'advanced-menu-editor',
    path: `${uipProPath}assets/js/uip/plugins/uip-advanced-menu-editor.min.js?ver=${pluginVersion}`,
  },
  {
    label: 'Keyboard shortcuts',
    component: 'keyboard-shortcut',
    path: `${uipProPath}assets/js/uip/plugins/keyboard-shortcut.min.js?ver=${pluginVersion}`,
  },
  {
    label: 'Search post type select',
    component: 'search-post-type-select',
    path: `${uipProPath}assets/js/uip/plugins/search-post-type-select.min.js?ver=${pluginVersion}`,
  },
  {
    label: 'Create icons lists',
    component: 'list-item-creator',
    path: `${uipProPath}assets/js/uip/plugins/list-creator.min.js?ver=${pluginVersion}`,
  },
  {
    label: 'UIP chart options',
    component: 'uip-chart-options',
    path: `${uipProPath}assets/js/uip/plugins/chart-options.min.js?ver=${pluginVersion}`,
  },
  {
    label: 'UIP remote database',
    component: 'uip-activity-database',
    path: `${uipProPath}assets/js/uip/plugins/activity-database.min.js?ver=${pluginVersion}`,
  },
  {
    label: 'Static menu',
    component: 'static-menu',
    path: `${uipProPath}assets/js/uip/plugins/static-menu.min.js?ver=${pluginVersion}`,
  },
];

(function () {
  wp.hooks.addFilter('uipress.app.plugins.register', 'uipress', (currentBlocks) => [...currentBlocks, ...Plugins]);
})();
