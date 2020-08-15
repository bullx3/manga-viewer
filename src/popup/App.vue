<template>
  <div style="width: 300px;">
    <p>{{title}}</p>
    <hr>
    <FilterSetting
      v-bind:filter-config="filterConfig"
      v-bind:view-config="viewConfig"
    />
    <hr>
    <FilterIndicator v-if="!isFinishAnalyze" v-bind:progress="progress" />
    <FilterResult v-else v-bind:filtering-result="filteringResult" />
    <ImageListTable v-bind:images="imageManager.images" />
    <FloatThumbnail v-bind:image-url="thumnailUrl" />
  </div>
</template>

<script>
import Config from '../common/config'
import ImageManager from '../common/image-manager'
import FilterSetting from '../common/components/FilterSetting.vue'
import FilterIndicator from '../common/components/FilterIndicator.vue'
import FilterResult from '../common/components/FilterResult.vue'
import ImageListTable from '../common/components/ImageListTable.vue'
import FloatThumbnail from '../common/components/FLoatThumbnail.vue'

export default {
  components: {
    FilterSetting,
    FilterResult,
    FilterIndicator,
    ImageListTable,
    FloatThumbnail,
  },
  provide: function(){
    return {
      actionChangeViewer: this.actionChangeViewer,
      actionInitializeConfig: this.actionInitializeConfig,
      updateFilterSettingValue: this.updateFilterSettingValue,
      updateViewSettingValue: this.updateViewSettingValue,
      updateThumbnailImage: this.updateThumbnailImage,
    }
  },
  data: function() {
    return {
      config: null,
      imageManager: null,
      isFinishAnalyze: false,
      filterConfig: { // リアクティブによる更新により入力画面が更新される
        check: true,
        width: 0,
        height: 0,
      },
      viewConfig: {
        numberOfPage: 2,
        isShowTitle: true,
        isShowImageSize: true,
        isShowImagePage: true,
        isShowLink: true,
      },
      filteringResult: {
        images: [],
        matchCount: 0, // フィルタに一致した画像数
        totalCount: 0, // フィルタリングする前の画像数
        errorCount: 0, // 解析失敗した画像数
      },
      progress: {
        index: 0,
        length: 0,
        error: 0,
      },
      title: "",
      thumnailUrl: null,
    }
  },
  // コンポーネントの生成後に実行(dataはリアクティブ状態)
  created: function(){
    this.config = new Config();
    this.imageManager = new ImageManager();

    // 設定取得
    (async () => {
      await this.config.load();

      //画像タグ取得 & 解析
      await this.scrapingAndAnalyzeImage();

      this.updateFilterSetting();

      // フィルタ設定による情報更新
      this.imageManager.updateFilterCheck(this.config.filter);

      // 画像リスト更新
      this.updateImageList();

      this.isFinishAnalyze = true;

    })();
  },
  methods: {
    scrapingAndAnalyzeImage: async function(){
      console.log("start scraping");
      // メインページから画像タグデータを取得(非同期)
      let result = await browser.tabs.executeScript(null, {file: "/scraping.js"})
      let param = result[0];
      console.log(param);

      this.title = param.title;

      // ImageManagerに画像情報を追加
      param.images.forEach((data) => this.imageManager.append(data.url, data.link));

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
    actionChangeViewer: function(){
      console.log("popup App actionChangeViewer");
      this.config.filter.save();
      this.config.view.save();

      // viewerに遷移
      (async () => {
        let result = await browser.tabs.executeScript(null, {file: "/scraping.js"})
        localStorage["viewerParam"] = JSON.stringify(result[0]);
        await browser.tabs.update({"url": "/viewer/viewer.html"})
        console.log("finish to viewer.html");
      })();
    },
    actionInitializeConfig: function(){
      console.log("popup App actionInitializeConfig");
      this.config.filter.initialize();
      this.config.filter.save();

      this.config.view.initialize();
      this.config.view.save();

      // 子コンポーネントの表示内容を更新
      this.updateFilterSetting();
      
      // フィルタチェックを更新することでリスト表示を更新
      this.imageManager.updateFilterCheck(this.config.filter);

      this.updateImageList();
    },
    updateFilterSettingValue: function(filter){
      // 子 -> 親通知.子コンポーネントからフィルタ設定の値が変更されたことを通知
      console.log("popup App updateFilterSettingValue");
      this.config.filter = filter;

      // フィルタチェックを更新することでリスト表示を更新
      this.imageManager.updateFilterCheck(this.config.filter);
    },
    updateViewSettingValue: function(view){
      this.config.view = view;
      
    },
    updateFilterSetting: function(){
      this.filterConfig = this.config.filter.toObject();
      this.viewConfig = this.config.view.toObject();
    },
    updateImageList: function() {
      this.filteringResult = {
        images: this.imageManager.filterImages,
        matchCount: this.imageManager.matchCount,
        totalCount: this.imageManager.imageCount,
        errorCount: this.imageManager.errorCount,
      }
    },
    updateThumbnailImage: function(url) {
      console.debug("updateThumbnailImage", url);
      this.thumnailUrl = url;
    },
  },
}
</script>

<style lang="scss" scoped>
.error {
  color: red;
}
</style>
