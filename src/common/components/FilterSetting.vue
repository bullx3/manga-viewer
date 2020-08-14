<template>
  <div>
    <div class="show-options">
      <h3>表示オプション</h3>
      <div>
        1ページの画像数
        <select v-model.number="selectedNumberOfPage">
          <option value="1">１</option>
          <option value="2">２ (見開き)</option>
        </select>
      </div>
      <div>
        <ul>
          <li>
            <input type="checkbox" v-model="checkShowTitle" id="show-title">
            <label for="show-title">タイトル</label>
          </li>
          <li>
            <input type="checkbox" v-model="checkShowImageSize" id="show-size">
            <label for="show-size">画像サイズ</label>
          </li>
          <li>
            <input type="checkbox" v-model="checkShowImagePage" id="show-page">
            <label for="show-page">ページ</label>
          </li>
          <li>
            <input type="checkbox" v-model="checkShowLink" id="show-link">
            <label for="show-link">リンク</label>
          </li>
        </ul>
      </div>
    </div>
    <hr>
    <div class="input-filter">
      <h3>フィルタリング</h3>
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
import {ViewConfig} from "../config"

export default {
  props: {
    filterConfig: Object,
    viewConfig: Object,
  },
  inject: [
    'actionChangeViewer',
    'actionInitializeConfig',
    'updateFilterSettingValue',
    'updateViewSettingValue',
  ],
  data: function() {
    return {
      filterCheck: this.filterConfig.check,
      inputWidth: this.filterConfig.width,
      inputHeight: this.filterConfig.height,
      selectedNumberOfPage: this.viewConfig.numberOfPage,
      checkShowTitle: this.viewConfig.isShowTitle,
      checkShowImageSize: this.viewConfig.isShowImageSize,
      checkShowImagePage: this.viewConfig.isShowImagePage,
      checkShowLink: this.viewConfig.isShowLink,
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
    notifyFilterChanged: function(){
      console.debug("FilterSetting NotifyChanged", this.filterCheck, this.inputWidth, this.inputHeight);
      let filter = new FilterConfig();
      filter.setFilter(this.filterCheck, this.inputWidth, this.inputHeight);
      this.updateFilterSettingValue(filter);
    },
    notifyViewChanged: function(){
      console.debug("FilterSetting notifyViewChanged");
      let view = new ViewConfig();
      view.numberOfPage = this.selectedNumberOfPage;
      view.isShowTitle = this.checkShowTitle;
      view.isShowImageSize = this.checkShowImageSize;
      view.isShowImagePage = this.checkShowImagePage;
      view.isShowLink = this.checkShowLink;

      this.updateViewSettingValue(view);
    }
  },
  watch: {
    filterCheck: function(){this.notifyFilterChanged()},
    inputWidth: function(){this.notifyFilterChanged()},
    inputHeight: function(){this.notifyFilterChanged()},

    selectedNumberOfPage: function(){this.notifyViewChanged()},
    checkShowTitle: function(){this.notifyViewChanged()},
    checkShowImageSize: function(){this.notifyViewChanged()},
    checkShowImagePage: function(){this.notifyViewChanged()},
    checkShowLink: function(){this.notifyViewChanged()},

    filterConfig: function(){
      console.debug("watch FilterSetting filterConfig");
      this.filterCheck = this.filterConfig.check;
      this.inputWidth = this.filterConfig.width;
      this.inputHeight = this.filterConfig.height;
    },
    viewConfig: function(){
      console.debug("watch FilterSetting viewConfig");
      this.selectedNumberOfPage = this.viewConfig.numberOfPage;
      this.checkShowTitle = this.viewConfig.isShowTitle;
      this.checkShowImageSize = this.viewConfig.isShowImageSize;
      this.checkShowImagePage = this.viewConfig.isShowImagePage;
      this.checkShowLink = this.viewConfig.isShowLink;
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

.show-options {
  > div {
    margin: 4px 0 4px 0;
  }
  select {
    height: 1.5em;
  }
  li{
    display: inline-block;
  }

}
</style>
