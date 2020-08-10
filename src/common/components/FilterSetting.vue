<template>
  <div>
    <div class="input-filter">
      <p>下記以上のサイズのみ表示する</p>
      <input type="checkbox" v-model="filterCheck">
      <input type="number" v-model="inputWidth" step="100" min="0" max="100000">
      &nbsp;×&nbsp;
      <input type="number" v-model="inputHeight" step="100" min="0" max="100000">
    </div>
    <div class="action">
      <button v-on:click="changeViewer">ビュアー表示</button>
      <button v-on:click="initializeConfig">初期化</button>
    </div>
  </div>
</template>


<script>
import {FilterConfig} from "../config"

export default {
  props: ['filterConfig'],
  inject: [
    'actionChangeViewer',
    'actionInitializeConfig',
    'updateFilterSettingValue',
  ],
  data: function() {
    return {
      filterCheck: this.filterConfig.check,
      inputWidth: this.filterConfig.width,
      inputHeight: this.filterConfig.height,
    }
  },
  methods: {
    changeViewer: function(){
      console.log("FilterSetting changeViewer");
      let filter = new FilterConfig();
      filter.setFilter(this.filterCheck, this.inputWidth, this.inputHeight);

      // injection method exec
      this.actionChangeViewer(filter);
    },
    initializeConfig: function(){
      console.log("FilterSetting  initializeConfig");

      // injection method exec
      this.actionInitializeConfig();
    },
    update: function(){
      console.log("FilterSetting update");
      this.filterCheck = this.filterConfig.check;
      this.inputWidth = this.filterConfig.width;
      this.inputHeight = this.filterConfig.height;
    },
    notifyChanged: function(){
      console.log("FilterSetting NotifyChanged");
      let filter = new FilterConfig();
      filter.setFilter(this.filterCheck, this.inputWidth, this.inputHeight);
      this.updateFilterSettingValue(filter);
    },
  },
  watch: {
    filterCheck: function(){this.notifyChanged()},
    inputWidth: function(){this.notifyChanged()},
    inputHeight: function(){this.notifyChanged()},
  }
}
</script>

<style lang="scss" scoped>

* {
  margin: 0;
  padding: 0;
}
.input-filter {
  margin: 5px 0;

  input[type="number"] {
    display: inline-block;
    max-width: 4em;
  }
}

.action {
  margin: 5px;
  
  button {
    background-color: lightblue;
  }
}
</style>
