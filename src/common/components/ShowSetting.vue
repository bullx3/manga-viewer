<template>
  <div class="show-options">
    <h4>表示オプション</h4>
    <div class="mb-3">
      <b-form-select
        v-model.number="selectedNumberOfPage"
        :options="optionsNumberOfPage"
      ></b-form-select>
    </div>
    <div>
      <b-form-checkbox-group
        v-model="selected"
        :options="options"
        switches
        autofocus
      ></b-form-checkbox-group>
    </div>
  </div>
</template>


<script>
import {ViewConfig} from "../config"

export default {
  props: {
    viewConfig: Object,
  },
  inject: [
    'updateViewSettingValue',
  ],
  data: function() {
    return {
      selectedNumberOfPage: this.viewConfig.numberOfPage,
      optionsNumberOfPage: [
        {text: "単ページ", value: 1 },
        {text: "２ページ(見開き)", value: 2 },
      ],
      selected: [],
      options: [
        {text: 'タイトル', value: "title"},
        {text: '画像サイズ', value: "size"},
        {text: 'ページ', value: "page"},
        {text: 'リンク', value: "link"},
      ],
    }
  },
  created: function(){
    this.initializeCheckbox();
  },
  methods: {
    initializeCheckbox: function(){
      this.selected = [];
      if(this.viewConfig.isShowTitle){
        this.selected.push("title");
      }
      if(this.viewConfig.isShowImageSize){
        this.selected.push("size");
      }
      if(this.viewConfig.isShowImagePage){
        this.selected.push("page");
      }
      if(this.viewConfig.isShowLink){
        this.selected.push("link");
      }

    },
    notifyViewChanged: function(){
      console.debug("ShowSetting notifyViewChanged");
      let view = new ViewConfig();
      view.numberOfPage = this.selectedNumberOfPage;
      view.isShowTitle = this.findChecked("title");
      view.isShowImageSize = this.findChecked("size");
      view.isShowImagePage = this.findChecked("page");
      view.isShowLink = this.findChecked("link");

      this.updateViewSettingValue(view);
    },
    findChecked: function(value){
      return this.selected.indexOf(value) !== -1;
    }
  },
  watch: {
    selectedNumberOfPage: function(){this.notifyViewChanged()},
    selected: function(){
      this.notifyViewChanged();
    },

    viewConfig: function(){
      console.debug("watch ShowSetting viewConfig");
      this.selectedNumberOfPage = this.viewConfig.numberOfPage;
      this.initializeCheckbox();
    }
  }
}
</script>

<style lang="scss" scoped>


</style>
