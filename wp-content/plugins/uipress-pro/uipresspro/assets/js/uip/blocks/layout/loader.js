const { __, _x, _n, _nx } = wp.i18n;
const Modal = {
  name: __('Modal', 'uipress-pro'),
  moduleName: 'uip-block-modal',
  description: __('Outputs a modal block with customisable content', 'uipress-pro'),
  category: __('Layout', 'uipress-pro'),
  group: 'layout',
  premium: true,
  path: uipProPath + 'assets/js/uip/blocks/layout/modal.min.js',
  icon: 'open_in_new',
  settings: {},
  content: [],
  optionsEnabled: [
    //Block options group
    {
      name: 'block',
      label: __('Block options', 'uipress-pro'),
      icon: 'check_box_outline_blank',
      options: [
        {
          option: 'title',
          uniqueKey: 'buttonText',
          componentName: 'uip-dynamic-input',
          label: __('Trigger text', 'uipress-pro'),
          value: {
            string: __('Press me', 'uipress-pro'),
            dynamic: false,
            dynamicKey: '',
            dynamicPos: 'left',
          },
        },
        { option: 'iconSelect', componentName: 'icon-select', label: __('Icon', 'uipress-pro') },
        {
          option: 'iconPosition',
          label: __('Icon position', 'uipress-pro'),
          componentName: 'choice-select',
          args: {
            options: {
              left: {
                value: 'left',
                label: __('Left', 'uipress-lite'),
              },
              right: {
                value: 'right',
                label: __('Right', 'uipress-lite'),
              },
            },
          },
        },
        {
          option: 'choiceSelect',
          componentName: 'choice-select',
          uniqueKey: 'closeOnPageChange',
          args: {
            options: {
              false: {
                value: false,
                label: __('Disabled', 'uipress-lite'),
              },
              true: {
                value: true,
                label: __('Enabled', 'uipress-lite'),
              },
            },
          },
          label: __('Close on page change', 'uipress-lite'),
        },
        { option: 'keyboardShortcut', componentName: 'keyboard-shortcut', label: __('Keyboard shortcut', 'uipress-lite') },
      ],
    },
    {
      name: 'style',
      label: __('Style', 'uipress-lite'),
      icon: 'palette',
      styleType: 'style',
    },
    //Container options group
    {
      name: 'trigger',
      label: __('Trigger style', 'uipress-pro'),
      icon: 'palette',
      styleType: 'style',
      class: '.uip-panel-trigger',
    },
    //Container options group
    {
      name: 'hover',
      label: __('Trigger hover styles', 'uipress-pro'),
      icon: 'ads_click',
      styleType: 'style',
      class: '.uip-panel-trigger:hover',
    },
    //Container options group
    {
      name: 'active',
      label: __('Trigger active styles', 'uipress-pro'),
      icon: 'ads_click',
      styleType: 'style',
      class: '.uip-panel-trigger:active',
    },
    {
      name: 'modalBody',
      label: __('Modal body', 'uipress-pro'),
      icon: 'padding',
      styleType: 'style',
      class: '.uip-modal-body',
    },
  ],
};

(function () {
  const blocks = [Modal];
  wp.hooks.addFilter('uipress.blocks.register', 'uipress', (currentBlocks) => [...currentBlocks, ...blocks]);
})();
