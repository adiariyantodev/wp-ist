const { __, _x, _n, _nx } = wp.i18n;
import * as connectMatomo from './matomo-connect-account.min.js';
export function moduleData() {
  return {
    components: {
      'uip-connect-matomo': connectMatomo.moduleData(),
    },
    props: {
      display: String,
      name: String,
      block: Object,
      contextualData: Object,
    },

    data: function () {
      return {
        loading: true,
        rendered: true,
        error: false,
        apiLoaded: false,
        errorMessage: '',
        total: 0,
        comparisonTotal: 0,
        percentChange: 0,
        fetchingQuery: false,
        showMatomoConnection: false,
        requestFromGroupDate: false,
        currentRequest: false,
        matomoPath: '',
        currentData: [],
        strings: {
          lastPeriod: __('last period', 'uipress-pro'),
          selectDataMetric: __("Please select a chart metric in this block's options to show chart data.", 'uipress-pro'),
          changeAccount: __('Switch account', 'uipress-pro'),
          count: __('Count', 'uipress-pro'),
          change: __('Change', 'uipress-pro'),
        },
      };
    },
    inject: ['uipData', 'uipress', 'uiTemplate'],
    watch: {
      'block.settings.block.options.chartDataType': {
        handler(newValue, oldvalue) {
          if (this.currentRequest) {
            let self = this;
            this.loading = true;
            this.processResponse();
            requestAnimationFrame(function () {
              self.loading = false;
            });
          }
        },
      },
      'contextualData.groupDate': {
        handler(newValue, oldValue) {
          this.getAnalytics();
        },
        deep: true,
      },
      'uiTemplate.matomoAnalytics.ready': {
        handler(newValue, oldValue) {
          this.getAnalytics();
        },
        deep: true,
      },
      'uiTemplate.globalSettings.options.analytics.saveAccountToUser': {
        handler(newVal, oldVal) {
          this.refreshAnalytics();
        },
      },
    },
    mounted: function () {
      this.getAnalytics();
    },
    computed: {
      returnTotal() {
        return this.total;
      },
      returnComparisonTotal() {
        return this.comparisonTotal;
      },
      returnChartData() {
        return this.chartData;
      },
      returnName() {
        let chartname = this.uipress.get_block_option(this.block, 'block', 'chartName', true);
        if (!chartname) {
          return '';
        }
        if (this.uipress.isObject(chartname)) {
          if ('string' in chartname) {
            return chartname.string;
          }
        } else {
          return chartname;
        }
      },
      returnChartType() {
        let chartDataType = this.uipress.get_block_option(this.block, 'block', 'chartDataType');
        return chartDataType;
      },
      returnChartStyle() {
        let chartDataType = this.uipress.get_block_option(this.block, 'block', 'chartStyle');
        if ('value' in chartDataType) {
          if (chartDataType.value != '') {
            return chartDataType.value;
          }
        }
        return 'line';
      },
      returnLineColor() {
        let chartDataType = this.uipress.get_block_option(this.block, 'block', 'chartColour');
        if (!this.uipress.isObject(chartDataType)) {
          return chartDataType;
        }
        if ('value' in chartDataType) {
          if (chartDataType.value != '') {
            return chartDataType.value;
          }
        }
        return chartDataType;
      },
      returnCompLineColor() {
        let chartDataType = this.uipress.get_block_option(this.block, 'block', 'chartCompColour');
        if (!this.uipress.isObject(chartDataType)) {
          return chartDataType;
        }
        if ('value' in chartDataType) {
          if (chartDataType.value != '') {
            return chartDataType.value;
          }
        }
        return chartDataType;
      },
      hideChart() {
        let hideChart = this.uipress.get_block_option(this.block, 'block', 'hideChart');
        if (!this.uipress.isObject(hideChart)) {
          return hideChart;
        }
        if ('value' in hideChart) {
          if (hideChart.value != '') {
            return hideChart.value;
          }
        }
        return false;
      },
      chartDimensions() {
        let self = this;
        this.rendered = false;

        let width = this.uipress.checkNestedValue(this.block, ['settings', 'chartCanvas', 'options', 'dimensions', 'value', 'width', 'value']);
        let widthUnits = this.uipress.checkNestedValue(this.block, ['settings', 'chartCanvas', 'options', 'dimensions', 'value', 'width', 'units']);
        let height = this.uipress.checkNestedValue(this.block, ['settings', 'chartCanvas', 'options', 'dimensions', 'value', 'height', 'value']);
        let heightUnits = this.uipress.checkNestedValue(this.block, ['settings', 'chartCanvas', 'options', 'dimensions', 'value', 'height', 'units']);

        requestAnimationFrame(function () {
          self.rendered = true;
        });

        if (!width && !height) return;

        return `width:${width}${widthUnits};height:${height}${heightUnits};`;
      },
      inlineAccountSwitch() {
        let hideChart = this.uipress.get_block_option(this.block, 'block', 'inlineAccountSwitch');
        if (!this.uipress.isObject(hideChart)) {
          return hideChart;
        }
        if ('value' in hideChart) {
          if (hideChart.value != '') {
            return hideChart.value;
          }
        }
        return false;
      },
      returnRange() {
        let range = this.uipress.get_block_option(this.block, 'block', 'dateRange');
        if (range) {
          if (isNaN(range)) {
            return 14;
          }
          if (range > 60) {
            return 60;
          }
          return range;
        } else {
          return 14;
        }
      },
      hasGlobalDate() {
        if (typeof this.contextualData === 'undefined') {
          return false;
        }
        if (!this.uipress.isObject(this.contextualData)) {
          return false;
        }
        if (!('groupDate' in this.contextualData)) {
          return false;
        }
        if (!('start' in this.contextualData.groupDate)) {
          return false;
        }
        if (!('end' in this.contextualData.groupDate)) {
          return false;
        }
        return true;
      },
    },
    methods: {
      getAnalytics() {
        let self = this;
        //Reset Vars
        self.loading = true;
        self.error = false;
        self.errorMessage = '';
        self.showMatomoConnection = false;

        //Api is not ready yet. We will catch with attached watch
        if (!self.uipress.isObject(self.uiTemplate.matomoAnalytics)) {
          self.apiLoaded = false;
          return;
        }
        if (!('ready' in self.uiTemplate.matomoAnalytics)) {
          self.apiLoaded = false;
          return;
        }
        if (!self.uiTemplate.matomoAnalytics.ready) {
          self.apiLoaded = false;
          return;
        }

        self.apiLoaded = true;
        //Dates//
        //Check for global dates
        //Dates//
        let startDate;
        let endDate;
        if (this.hasGlobalDate) {
          startDate = new Date(Date.parse(this.contextualData.groupDate.start));
          endDate = new Date(Date.parse(this.contextualData.groupDate.end));
        } else {
          //Build last two weeks date
          endDate = new Date();
          endDate.setDate(endDate.getDate() - 1);
          startDate = new Date();
          startDate.setDate(startDate.getDate() - self.returnRange);
        }

        //Send request to API
        self.uiTemplate.matomoAnalytics.api('get', startDate, endDate).then((response) => {
          //The API returned an error so set relevant vars and return
          if (response.error) {
            self.loading = false;
            self.error = true;
            self.errorMessage = response.message;
            if (response.type == 'no_account') {
              self.showMatomoConnection = true;
            }
            return;
          }
          //The call was a success, so let's process it
          self.loading = false;
          self.currentRequest = response;
          self.matomoPath = response.matomoPath;

          if (!self.matomoPath.endsWith('/')) {
            self.matomoPath = self.matomoPath + '/';
          }
          self.processResponse(response);
        });

        return;
      },
      processResponse() {
        let self = this;
        let data = this.currentRequest;
        let dataType = self.returnChartType;

        if (!dataType) {
          return;
        }
        let processedData = [];

        for (let [index, dataPoint] of data.reports[dataType].entries()) {
          dataPoint.change = dataPoint.nb_visits * 100;

          let comparisonData = data.reports_comparison[dataType][index];
          if (comparisonData) {
            let compValue = comparisonData.nb_visits;
            let actualValue = dataPoint.nb_visits;
            if (compValue != 0 && actualValue != 0) {
              dataPoint.change = ((actualValue / compValue) * 100).toFixed(2);
            }
          }

          processedData.push(dataPoint);
        }

        self.currentData = processedData;
        ///Update Cache
      },
      removeAnalyticsAccount() {
        let self = this;
        self.uiTemplate.matomoAnalytics.ready = false;
        //Send request to API
        self.uiTemplate.matomoAnalytics.api('removeAccount').then((response) => {
          //The API call was successful

          self.uiTemplate.matomoAnalytics.api('refresh').then((response) => {
            //The API call was successful
            self.uiTemplate.matomoAnalytics.ready = true;
            self.getAnalytics();
          });
        });
      },
      ///
      //Function pulled from https://stackoverflow.com/questions/3733227/javascript-seconds-to-minutes-and-seconds
      //Credit to Jakub
      secondsToTime(e) {
        if (isNaN(e)) {
          return 0;
        }
        const h = Math.floor(e / 3600)
            .toString()
            .padStart(2, '0'),
          m = Math.floor((e % 3600) / 60)
            .toString()
            .padStart(2, '0'),
          s = Math.floor(e % 60)
            .toString()
            .padStart(2, '0');

        if (m == 00) {
          return '0m ' + s + 's';
        } else {
          return m + 'm ' + s + 's';
        }
      },

      refreshAnalytics() {
        let self = this;
        self.uiTemplate.matomoAnalytics.ready = false;
        //Send request to API
        self.uiTemplate.matomoAnalytics.api('refresh').then((response) => {
          //The API call was successful
          if (response) {
            self.uiTemplate.matomoAnalytics.ready = true;
            self.getAnalytics();
          }
        });
      },
      returnFormattedDate(d) {
        if (!d || d == '') {
          return '';
        }
        let month = d.getMonth() + 1;
        let day = d.getDate();
        let year = d.getFullYear();

        if (month < 10) {
          month = '0' + month;
        }
        if (day < 10) {
          day = '0' + day;
        }

        return year + '/' + month + '/' + day;
      },
      returnErrrorMessage() {
        try {
          JSON.parse(this.errorMessage);
        } catch (error) {
          return this.errorMessage;
        }

        if (this.uipress.isObject(JSON.parse(this.errorMessage))) {
          let messs = JSON.parse(this.errorMessage);
          return `
              <h5 style="margin:0">${messs.status}</h5>
              <p style="margin-bottom:0;">${messs.message}</p>
            `;
        }

        return this.errorMessage;
      },
      returnStartDate() {
        let startDate = Object.keys(this.currentRequest.reports.page_views)[0];
        startDate = new Date(startDate);
        let str = startDate.toLocaleDateString();
        return str;
      },

      returnEndDate() {
        let dateLength = Object.keys(this.currentRequest.reports.page_views).length - 1;
        let startDate = Object.keys(this.currentRequest.reports.page_views)[dateLength];
        startDate = new Date(startDate);
        let str = startDate.toLocaleDateString();
        return str;
      },
    },
    template: `
		<div class="uip-flex uip-flex-column uip-text-normal">
          <div class="uip-flex uip-flex-between">
            <div class="uip-text-bold uip-margin-bottom-xxs uip-text-normal uip-chart-title">{{returnName}}</div>
            <drop-down dropPos="left" v-if="!inlineAccountSwitch && !showMatomoConnection">
              <template v-slot:trigger>
                <div class="uip-icon uip-link-muted">more_horiz</div>
              </template>
              <template v-slot:content>
                <div class="uip-flex uip-flex-row uip-gap-xxs uip-flex-center uip-padding-xxxs uip-link-muted" @click="removeAnalyticsAccount()">
                  <div class="uip-icon">sync</div>\
                  <div class="uip-padding-xxs">{{strings.changeAccount}}</div>
                </div>
              </template>
            </drop-down>  
          </div>
          
          <div class="uip-text-s uip-text-muted uip-margin-bottom-s uip-margin-bottom-s uip-dates">{{returnFormattedDate(startDate)}} - {{returnFormattedDate(endDate)}}</div>
          
          <div class="uip-margin-bottom-xxs" v-if="showMatomoConnection"><uip-connect-matomo :success="refreshAnalytics"/></div>
          
          <div v-if="loading" class="uip-padding-m uip-flex uip-flex-center uip-flex-middle uip-min-w-200 uip-w-100p uip-ratio-16-10 uip-border-box"><loading-chart></loading-chart></div>
          
          <div v-else-if="error && errorMessage" class="uip-padding-xs uip-border-round uip-background-orange-wash uip-text-bold uip-margin-bottom-s uip-scale-in-top uip-max-w-100p" v-html="returnErrrorMessage()"></div>
          
          <div v-else-if="!returnChartType" class="uip-padding-xxs uip-border-round uip-background-green-wash uip-text-green uip-text-bold uip-margin-bottom-s uip-scale-in-top uip-max-w-200">{{strings.selectDataMetric}}</div>
          
          <div v-else class="uip-min-w-200">
            <div class="uip-flex uip-flex-column uip-row-gap-xs">
              <div class="uip-max-w-100p uip-overflow-auto uip-scrollbar">
                <table class="uip-min-w-250 uip-w-100p uip-table">
                  <thead>
                    <tr class="">
                      <th class="uip-padding-bottom-xxs"></th>
                      <th class="uip-text-muted uip-text-weight-normal uip-text-right uip-padding-bottom-xxs">{{strings.count}}</th>
                      <th class="uip-text-right uip-text-muted uip-text-weight-normal uip-padding-bottom-xxs">{{strings.change}}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in currentData">
                      <td class="uip-text-bold uip-padding-bottom-xxs uip-flex uip-gap-xs uip-flex-center">
                        <img v-if="item.logo" :src="matomoPath + item.logo" class="uip-h-12 uip-border-rounder">
                        <span>{{item.label}}</span>
                      </td>
                      <td class="uip-text-right uip-padding-bottom-xxs">{{item.nb_visits}}</td>
                      <td class="uip-text-right uip-padding-bottom-xxs">
                        <div class="uip-text-s uip-background-orange-wash uip-border-round uip-padding-xxxs uip-post-type-label uip-flex uip-gap-xxs uip-flex-center uip-text-bold uip-tag-label uip-inline-flex">
                          <span v-if="item.change > 0" class="uip-icon uip-text-green">arrow_upward</span>
                          <span v-if="item.change < 0" class="uip-icon uip-text-danger">arrow_downward</span>
                          <span class="uip-percentage-value">{{item.change}}</span>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div class="uip-flex uip-flex-row uip-flex-between">
                <div class="uip-text-s uip-text-muted uip-chart-label">{{returnStartDate()}}</div>
                <div class="uip-text-s uip-text-muted uip-chart-label">{{returnEndDate()}}</div>
              </div>
            </div>
          </div>
      </div>`,
  };
}
