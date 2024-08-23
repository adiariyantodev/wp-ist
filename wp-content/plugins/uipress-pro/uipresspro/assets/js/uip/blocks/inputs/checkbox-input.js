const { __, _x, _n, _nx } = wp.i18n;
export default {
  props: {
    display: String,
    name: String,
    block: Object,
  },
  data() {
    return {
      formData: {},
      loading: true,
      availableOptions: [],
      arrayString: '',
      populated: this.returnPopulated,
      strings: {
        placeholder: __('Input placeholder...', 'uipress-lite'),
      },
    };
  },
  mounted() {
    document.addEventListener('uipress/app/forms/change', this.handleFormChange);
  },
  beforeUnmount() {
    document.removeEventListener('uipress/app/forms/change', this.handleFormChange);
  },
  computed: {
    /**
     * Returns placeholder for input
     *
     * @since 3.2.13
     */
    returnPlaceHolder() {
      const item = this.get_block_option(this.block, 'block', 'inputPlaceHolder', true);
      if (!item) return '';

      if (!this.isObject(item)) return item;
      if (item.string) return item.string;
      return '';
    },

    /**
     * Returns label for input
     *
     * @since 3.2.13
     */
    returnLabel() {
      const item = this.get_block_option(this.block, 'block', 'inputLabel', true);
      if (!item) return '';

      if (!this.isObject(item)) return item;
      if (item.string) return item.string;
      return '';
    },

    /**
     * Returns whether the input field is required
     *
     * @since 3.2.13
     */
    returnRequired() {
      let required = this.get_block_option(this.block, 'block', 'inputRequired');
      return this.isObject(required) ? required.value : required;
    },

    /**
     * Returns the name of the input
     *
     * @since 3.2.13
     */
    returnName() {
      return this.get_block_option(this.block, 'block', 'inputName');
    },

    /**
     * Returns options
     *
     * @since 3.2.0
     */
    returnOptions() {
      let options = this.get_block_option(this.block, 'block', 'selectOptions');
      this.availableOptions = options.options;
      return this.availableOptions;
    },

    /**
     * Returns populated value
     *
     * @since 3.2.13
     */
    returnPopulated() {
      // If input name exists in pre populate then return it
      if (this.returnName in this.formData) {
        return this.formData[this.returnName];
      }
    },
  },
  methods: {
    /**
     * Handles date change events
     *
     * @param {object} evt - date change event
     * @since 3.2.0
     */
    handleFormChange(evt) {
      if (!evt.detail.IDS) return;
      if (!Array.isArray(evt.detail.IDS)) return;
      if (!evt.detail.IDS.includes(this.block.uid)) return;

      this.formData = evt.detail.formData;
    },

    /**
     * Format change
     *
     * @param {object} item
     * @since 3.2.0
     */
    formatChange(item) {
      let parsed;
      try {
        parsed = JSON.parse(this.arrayString);
      } catch (error) {
        parsed = [];
      }

      if (!Array.isArray(parsed)) {
        parsed = [];
      }
      if (parsed.includes(item.name)) {
        let index = parsed.indexOf(item.name);
        parsed.splice(index, 1);
      } else {
        parsed.push(item.name);
      }

      this.arrayString = JSON.stringify(parsed);
    },

    /**
     * Returns whether an item is checked
     *
     * @param {object} item
     * @since 3.2.0
     */
    ifChecked(item) {
      let parsed;
      try {
        parsed = JSON.parse(this.arrayString);
      } catch (error) {
        parsed = [];
      }

      if (!Array.isArray(parsed)) {
        parsed = [];
      }
      if (parsed.includes(item.name)) {
        return true;
      } else {
        return false;
      }
    },
  },
  template: `
		<div class="uip-flex uip-flex-column">
            <span class="uip-input-label uip-text-muted uip-margin-bottom-xxs">{{returnLabel}}</span>
		    <input v-model="arrayString" type="text" :name="returnName" :value-holder="returnPopulated" :required="returnRequired" style="opacity:0;max-height:0;min-height:0;overflow:hidden;">
		  	  <div class="uip-flex uip-flex-column uip-row-gap-xxs">
		  		  <template v-for="(item,index) in returnOptions">
			  		  <label class="uip-flex uip-flex-row uip-gap-xxs uip-flex-center">
					    <input class="uip-checkbox" type="checkbox" @change="formatChange(item)" :checked="ifChecked(item)" :key="index">
					    <div>{{item.label}}</div>
					  </label>
				  </template>
			  </div>
		</div>`,
};
