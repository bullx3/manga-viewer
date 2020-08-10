<template>
  <div style="width: 250px;">
    <p>{{title}}</p>
    <hr>
    <FilterSetting
      v-bind:filter-config="config.filter"
      ref="filterComponent"
    />
    <hr>
    <FilterIndicator v-if="!isFinishAnalyze" v-bind:progress="progress" />
    <FilterResult v-else v-bind:image-manager="imageManager" />
    <ImageListTable v-bind:images="imageManager.images" />
  </div>
</template>

<script>
import Config from '../common/config'
import {FilterConfig} from '../common/config'
import ImageManager from '../common/image-manager'
import FilterSetting from '../common/components/FilterSetting.vue'
import FilterIndicator from '../common/components/FilterIndicator.vue'
import FilterResult from '../common/components/FilterResult.vue'
import ImageListTable from '../common/components/ImageListTable.vue'

export default {
  components: {
    FilterSetting,
    FilterResult,
    FilterIndicator,
    ImageListTable,
  },
  provide: function(){
    return {
      actionChangeViewer: this.actionChangeViewer,
      actionInitializeConfig: this.actionInitializeConfig,
      updateFilterSettingValue: this.updateFilterSettingValue,
    }
  },
  data: function() {
    return {
      config: null,
      imageManager: null,
      isFinishAnalyze: false,
      progress: {
        index: 0,
        length: 0,
        error: 0,
      },
      title: "",
    }
  },
  // コンポーネントの生成後に実行(dataはリアクティブ状態)
  created: function(){
    this.config = new Config();
    this.imageManager = new ImageManager();

    // 設定取得
    (async () => {
      await this.config.loadFilter();
      console.log("complete LoadFilter");
      this.updateFilterComponent();
      //画像タグ取得 & 解析
      await this.scrapingAndAnalyzeImage();

      // フィルタ設定による情報更新
      this.imageManager.updateFilterCheck(this.config.filter);

      this.isFinishAnalyze = true;

    })();
  },
  methods: {
    async scrapingAndAnalyzeImage(){
      console.log("start scraping");
      // メインページから画像タグデータを取得(非同期)
      let result = await browser.tabs.executeScript(null, {file: "/scraping.js"})
      let param = result[0];
      console.log(param);

      this.title = param.title;

      // ImageManagerに画像情報を追加
      param.images.forEach((data) => this.imageManager.append(data.url));

      console.log("start analyze images")
      // 画像サイズを解析
      await this.imageManager.analyze((index, length, result) => {
        // 進捗表示を更新
        this.progress.index = index;
        this.progress.length = length;
        this.progress.error += result ? 0 : 1;
      });
      console.log("complete analyze images");
    },
    actionChangeViewer: function(filter){
      console.log("popup App actionChangeViewer");
      console.log(filter);
      this.config.saveFilter(filter);

      // viewerに遷移
      (async () => {
        let obj = {};
        let result = await browser.tabs.executeScript(null, {file: "/scraping.js"})
        localStorage["viewerParam"] = JSON.stringify(result[0]);
        await browser.tabs.update({"url": "/viewer/viewer.html"})
        console.log("finish to viewer.html");
      })();
    },
    actionInitializeConfig: function(){
      console.log("popup App actionInitializeConfig");
      let filter = new FilterConfig();
      filter.initialize();
      this.config.saveFilter(filter);

      // 子コンポーネントの表示内容を更新
      this.updateFilterComponent();

      // フィルタチェックを更新することでリスト表示を更新
      this.imageManager.updateFilterCheck(this.config.filter);
    },
    updateFilterSettingValue: function(filter){
      // 子 -> 親通知.子コンポーネントからフィルタ設定の値が変更されたことを通知
      console.log("popup App updateFilterSettingValue");
      this.config.filter.set(filter);

      // フィルタチェックを更新することでリスト表示を更新
      this.imageManager.updateFilterCheck(this.config.filter);

    },
    updateFilterComponent: function(){
      // 親 -> 子通知. 子コンポーネントのメソッドを実行して内容を更新
      this.$refs.filterComponent.update();
    },
  },
}
</script>

<style lang="scss" scoped>
.error {
  color: red;
}
</style>
