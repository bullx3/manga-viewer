<template>
  <b-container>
    <b-row>
      <b-col cols="6">
        <div class="mt-3 font-weight-bold">{{title}}</div>
        <hr>
        <ShowSetting v-if="isFinishLoadingShowSetting"
          :view-config="viewConfig"
        />
        <hr>
        <FilterSetting v-if="isFinishLoadingFilterSetting"
          :filter-config="filterConfig"
        />
        <div v-else class="text-center">
          <b-spinner v-if="!isFinishLoadingFilterSetting"></b-spinner>
        </div>
        <hr>
        <FilterIndicator v-if="!isFinishAnalyze" :progress="progress" />
        <FilterResult v-else :filtering-result="filteringResult" />
        <div class="mb-2"></div>
        <ImageListTable :images="imageManager.images" />
        <FloatThumbnail :image-url="thumnailUrl" />
      </b-col>
      <b-col cols="6">
        <ThumbnailList :images="imageManager.filterImages"></ThumbnailList>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import Config from '../common/config'
import ImageManager from '../common/image-manager'
import FilterSetting from '../common/components/FilterSetting.vue'
import ShowSetting from '../common/components/ShowSetting.vue'
import FilterIndicator from '../common/components/FilterIndicator.vue'
import FilterResult from '../common/components/FilterResult.vue'
import ImageListTable from '../common/components/ImageListTable.vue'
import FloatThumbnail from '../common/components/FLoatThumbnail.vue'
import ThumbnailList from '../common/components/ThumbnailList.vue'

export default {
  components: {
    FilterSetting,
    ShowSetting,
    FilterResult,
    FilterIndicator,
    ImageListTable,
    FloatThumbnail,
    ThumbnailList,
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
      // コントロール系のクラスインスタンス、基本的にバインドはしないようにする
      config: null,
      imageManager: null,

      // ↓リアクティブで表示を切り替えれるように意識して更新
      isFinishAnalyze: false,
      isFinishLoadingFilterSetting: false,
      isFinishLoadingShowSetting: false,
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

      // 設定表示更新
      this.reRenderingSetting();
      this.isFinishLoadingShowSetting = true;
      this.isFinishLoadingFilterSetting = true;

//画像タグ取得 & 解析
      await this.scrapingAndAnalyzeImage();

      // フィルタ設定による情報更新
      this.imageManager.updateFilterCheck(this.config.filter);

      // 画像リスト更新
      this.reRenderingFilteringResult();

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

      // viewerに遷移
      (async () => {
        await this.config.save();
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
      this.reRenderingSetting();
      
      // フィルタチェックを更新することでリスト表示を更新
      this.imageManager.updateFilterCheck(this.config.filter);

      this.reRenderingFilteringResult();
    },
    updateFilterSettingValue: function(filter){
      // 子 -> 親通知.子コンポーネントからフィルタ設定の値が変更されたことを通知
      console.log("popup App updateFilterSettingValue");
      this.config.filter = filter;

      // フィルタチェックを更新することでリスト表示を更新
      this.imageManager.updateFilterCheck(this.config.filter);
      this.reRenderingFilteringResult();
    },
    updateViewSettingValue: function(view){
      this.config.view = view;
      
    },
    reRenderingSetting: function(){
      this.filterConfig = this.config.filter.toObject();
      this.viewConfig = this.config.view.toObject();
    },
    reRenderingFilteringResult: function() {
      this.filteringResult = {
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

hr {
 margin: 0.5rem 0;
}

</style>
