///IMPORT TRANSLATIONS
const { __, _x, _n, _nx } = wp.i18n;
export const Variables = {
  //Primary
  '--uip-border-width': {
    label: __('Border Width', 'uipress-pro'),
    name: '--uip-border-width',
    type: 'units',
    value: '',
    darkValue: '',
  },
  '--uip-border-radius': {
    label: __('Border Radius', 'uipress-pro'),
    name: '--uip-border-radius',
    type: 'units',
    value: '',
    darkValue: '',
  },
  '--uip-border-color': {
    label: __('Border Colour', 'uipress-pro'),
    name: '--uip-border-color',
    type: 'color',
    value: '',
    darkValue: '',
  },
  //Margin
  '--uip-margin-xxs': {
    label: __('Margin xxs', 'uipress-pro'),
    name: '--uip-margin-xxs',
    type: 'units',
    value: '',
    darkValue: '',
  },
  '--uip-margin-xs': {
    label: __('Margin xs', 'uipress-pro'),
    name: '--uip-margin-xs',
    type: 'units',
    value: '',
    darkValue: '',
  },
  '--uip-margin-s': {
    label: __('Margin s', 'uipress-pro'),
    name: '--uip-margin-s',
    type: 'units',
    value: '',
    darkValue: '',
  },
  '--uip-margin-m': {
    label: __('Margin m', 'uipress-pro'),
    name: '--uip-margin-m',
    type: 'units',
    value: '',
    darkValue: '',
  },
  '--uip-margin-l': {
    label: __('Margin l', 'uipress-pro'),
    name: '--uip-margin-l',
    type: 'units',
    value: '',
    darkValue: '',
  },
  //Padding
  '--uip-padding-xxs': {
    label: __('Padding xxs', 'uipress-pro'),
    name: '--uip-padding-xxs',
    type: 'units',
    value: '',
    darkValue: '',
  },
  '--uip-padding-xs': {
    label: __('Padding xs', 'uipress-pro'),
    name: '--uip-padding-xs',
    type: 'units',
    value: '',
    darkValue: '',
  },
  '--uip-padding-s': {
    label: __('Padding s', 'uipress-pro'),
    name: '--uip-padding-s',
    type: 'units',
    value: '',
    darkValue: '',
  },
  '--uip-padding-m': {
    label: __('Padding m', 'uipress-pro'),
    name: '--uip-padding-m',
    type: 'units',
    value: '',
    darkValue: '',
  },
  '--uip-padding-l': {
    label: __('Padding l', 'uipress-pro'),
    name: '--uip-padding-l',
    type: 'units',
    value: '',
    darkValue: '',
  },
  '--uip-body-font-family': {
    label: __('Font family', 'uipress-pro'),
    name: '--uip-body-font-family',
    type: 'font',
    value: '',
    darkValue: '',
  },
};

(function () {
  wp.hooks.addFilter('uipress.app.variables.register', 'uipress', (current) => ({ ...current, ...Variables }));
})();
