<template>
  <div>
    <div v-if="!isFinishAnalyze">
      <FilterIndicator v-bind:progress="progress" />
      <div class="analyzing">解析中</div>
    </div>
    <div v-else>
      <ViewerMain
        v-bind:images="images"
        v-bind:filter-images="filterImages"
        v-bind:title="title"
        v-bind:filter-config="filterConfig"
        v-bind:view-config="viewConfig"
        v-bind:filtering-result="filteringResult"
        v-on:action-change-number-of-page="actionChangeNumberOfPage"
        ref="viewerMain"
      />
    </div>
  </div>
</template>

<script>
import Config from '../common/config'
import ImageManager from '../common/image-manager'
import ViewerMain from './components/ViewerMain.vue'
import FilterIndicator from '../common/components/FilterIndicator'

export default {
  provide: function(){
    return {
      actionChangeViewer: this.actionChangeViewer,
      actionInitializeConfig: this.actionInitializeConfig,
      updateFilterSettingValue: this.updateFilterSettingValue,
      updateViewSettingValue: this.updateViewSettingValue,
      loadConfig: this.loadConfig,
    }
  },
  components: {
    ViewerMain,
    FilterIndicator,
  },
  data: function() {
    return {
      // コントロール系のクラスインスタンス、基本的にバインドはしないようにする
      config: null,   // Instance of Config class
      imageManager: null, // Instance of ImageManager class

      // ↓リアクティブで表示を切り替えれるように意識して更新
      title: "",
      images: [],
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
      filterImages: [],
      filteringResult: {
        matchCount: 0, // フィルタに一致した画像数
        totalCount: 0, // フィルタリングする前の画像数
        errorCount: 0, // 解析失敗した画像数
      },
      isFinishAnalyze: false,
      progress: {
        index: 0,
        length: 0,
        error: 0,
      },
    }
  },
  created: function() {
    console.log("Viewer App created");

    this.config = new Config();
    this.imageManager = new ImageManager();

    let param = JSON.parse(localStorage["viewerParam"]);
    this.title = param.title;

    document.title = `[解析中]${this.title}`;

    (async () => {
      console.log("load Config");
      await this.config.load();
      this.reRenderingSetting();

      //画像タグ取得 & 解析
      await this.analyzeImage(param);
      
      // フィルタ設定による情報更新
      this.imageManager.updateFilterCheck(this.config.filter);

      console.debug(this.imageManager.images);

      this.reRenderingImages();
      this.reRenderingFilteringImages();
      this.reRenderingFilteringResult();

      this.isFinishAnalyze = true;

      document.title = `[Viewer]${this.title}`;
    })();
  },
  methods: {
    analyzeImage: async function(param){
      param.images.forEach((data) => this.imageManager.append(data.url, data.link));

      console.log("start analyze images")
      // 画像サイズを解析
      await this.imageManager.analyze((index, length, result) => {
        // 進捗表示を更新
        this.progress.index = index;
        this.progress.length = length;
        this.progress.error += result ? 0 : 1;
        document.title = `[解析中](${index}/${length}) ${this.title}`;
      });
      console.log("complete analyze images");
    },
    actionChangeNumberOfPage: function(num){
      this.config.view.numberOfPage = num;
      this.config.view.save();
      this.viewConfig = this.config.view.toObject();
    },
    // provivide関数
    actionChangeViewer: function(){
      console.log("viewer App actionChangeViewer");
      // ビュアー表示実行
      // -> 設定は保存(filter,view両方)
      // -> Viewr画面はすべて更新

      // 設定保存
      this.config.save();
      this.reRenderingSetting();

      // ダイアログを消して画面を再構築
      this.$refs.viewerMain.closeMenuDialog();
      this.reRenderingImages();
      this.reRenderingFilteringImages();
      this.reRenderingFilteringResult();
    },
    // provivide関数
    actionInitializeConfig: function(){
      console.log("viewer App actionInitializeConfig");
      this.config.filter.initialize();
      this.config.filter.save();

      this.config.view.initialize();
      this.config.view.save();

      this.reRenderingSetting();

      // フィルタ設定画面を更新
      // フィルタチェックを更新することでリスト表示を更新
      this.imageManager.updateFilterCheck(this.config.filter);

      this.reRenderingImages();
      this.reRenderingFilteringImages();
      this.reRenderingFilteringResult();
    },
    // provivide関数
    updateFilterSettingValue: function(filter){
      // 子 -> 親通知.子コンポーネントからフィルタ設定の値が変更されたことを通知
      console.log("viewer App updateFilterSettingValue");
      this.config.filter = filter;

      // フィルタチェックを更新することでリスト表示を更新
      this.imageManager.updateFilterCheck(this.config.filter);

      this.reRenderingImages();
      // filterImagesは更新しない
      this.reRenderingFilteringResult();
    },
    // provide関数
    updateViewSettingValue: function(view){
      console.debug("viewer App updateViewSettingValue");

      this.config.view = view;
      // this.viewConfigは更新しないことでキャンセルした（ダイアログを閉じた）時に表示を更新しないようにする
    },
    // provide関数
    loadConfig: async function(){
      console.debug("Viewer App loadConfig start");
      await this.config.load();
      this.reRenderingSetting();

      this.imageManager.updateFilterCheck(this.config.filter);
      // フィルタ設定画面を更新
      console.debug("Viewer App loadConfig async end");
    },
    reRenderingSetting: function(){
      this.filterConfig = this.config.filter.toObject();
      this.viewConfig = this.config.view.toObject();
    },
    reRenderingFilteringResult: function(){
      console.log("reRenderingFilteringResult");
      this.filteringResult = {
        matchCount: this.imageManager.matchCount,
        totalCount: this.imageManager.imageCount,
        errorCount: this.imageManager.errorCount,
      }
      console.debug("filteringResult", this.filteringResult);
    },
    reRenderingImages: function(){
      this.images = this.imageManager.images;
    },
    reRenderingFilteringImages: function(){
      this.filterImages = this.imageManager.filterImages;
    }
  },
}
</script>

<style lang="scss" scoped>
.analyzing {
  width: 100%;
  font-size: 3em;
  text-align: center;
  margin-top: 50px;
}
</style>
