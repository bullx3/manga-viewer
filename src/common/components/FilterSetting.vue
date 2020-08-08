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
      <button v-on:click="changeViewer">変換</button>
      <button v-on:click="initializeConfig">初期化</button>
    </div>
  </div>
</template>


<script>
import {FilterConfig} from "../config"

export default {
  props: ['filterConfig'],
  data () {
    console.log("FillterSetting access data");
    return {
      filterCheck: this.filterConfig.check,
      inputWidth: this.filterConfig.width,
      inputHeight: this.filterConfig.height,
    }
  },
  methods: {
    changeViewer: function(){
      console.log("changeViewer");
      let filter = new FilterConfig();
      filter.setFilter(this.filterCheck, this.inputWidth, this.inputHeight);
      this.$emit("action-change", filter);
    },
    initializeConfig: function(){
      console.log("initializeConfig");
      this.$emit("action-initialize");
    },
    update(){
      console.log("FilterSetting update()");
      this.filterCheck = this.filterConfig.check;
      this.inputWidth = this.filterConfig.width;
      this.inputHeight = this.filterConfig.height;
    },
    notifyChanged(){
      console.log("NotifyChanged");
      let filter = new FilterConfig();
      filter.setFilter(this.filterCheck, this.inputWidth, this.inputHeight);
      this.$emit("update-filter-setting-value", filter);
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
