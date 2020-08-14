<template>
  <div>
    <div class="input-filter">
      <p>下記以上のサイズのみ表示する</p>
      <input type="checkbox" v-model="filterCheck">
      <input type="number" v-model.number="inputWidth" step="100" min="0" max="100000">
      &nbsp;×&nbsp;
      <input type="number" v-model.number="inputHeight" step="100" min="0" max="100000">
    </div>
    <div class="action">
      <button v-on:click="changeViewer">ビュアー表示(o)</button>
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
  mounted: function(){
    console.log("ViewerMain mounted");
    window.addEventListener('keydown', this.onKeyDown);
  },
  beforeDestroy: function(){
    console.log("beforeDestroy");
    /* mountedで追加したリスナーはここで破棄する必要がある */
    window.removeEventListener('keydown', this.onKeyDown);
  },
  methods: {
    onKeyDown: function(){
      let keyName = event.key;
      switch(keyName){
        case "o":
          this.actionChangeViewer();
          break;
        case "c":
          // フィルタチェック有無を切り替える
          this.filterCheck = !this.filterCheck;
          break;
        case "ArrowUp":
          // width/heightとも100づつアップする(フォーカスがあたってる状態だと二重に上がってしまうがとりあえず仕様とする)
          this.inputWidth += 100;
          this.inputHeight += 100;
          break;
        case "ArrowDown":
          this.inputWidth -= 100;
          if(this.inputWidth < 0){
            this.inputWidth = 0;
          }
          this.inputHeight -= 100;
          if(this.inputHeight < 0){
            this.inputHeight = 0;
          }
          break;
        default:
          break;
      }
    },
    changeViewer: function(){
      console.debug("FilterSetting changeViewer", this.filterCheck, this.inputWidth, this.inputHeight);

      // injection method exec
      this.actionChangeViewer();
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
      console.debug("FilterSetting NotifyChanged", this.filterCheck, this.inputWidth, this.inputHeight);
      let filter = new FilterConfig();
      filter.setFilter(this.filterCheck, this.inputWidth, this.inputHeight);
      this.updateFilterSettingValue(filter);
    },
  },
  watch: {
    filterCheck: function(){this.notifyChanged()},
    inputWidth: function(){this.notifyChanged()},
    inputHeight: function(){this.notifyChanged()},
    filterConfig: function(){
      this.filterCheck = this.filterConfig.check;
      this.inputWidth = this.filterConfig.width;
      this.inputHeight = this.filterConfig.height;
    }
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
