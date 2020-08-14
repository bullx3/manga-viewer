<template>
  <div>
    <div v-if="!isFinishAnalyze">
      <FilterIndicator v-bind:progress="progress" />
      <div class="analyzing">解析中</div>
    </div>
    <div v-else>
      <ViewerMain
        v-bind:images="imageManager.images"
        v-bind:title="title"
        v-bind:filter-config="filterConfig"
        v-bind:filtering-result="filteringResult"
        v-bind:number-of-page="viewConfig.numberOfPage"
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
      loadConfig: this.loadConfig,
    }
  },
  components: {
    ViewerMain,
    // MenuDialog,
    FilterIndicator,
  },
  data: function() {
    return {
      config: null,   // Instance of Config class
      title: "",
      imageManager: null, // Instance of ImageManager class
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
      },
      filteringResult: {
        images: [],
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
      this.filterConfig = this.config.filter.toObject();
      this.viewConfig = this.config.view.toObject();

      //画像タグ取得 & 解析
      await this.analyzeImage(param);

      console.log(this.config.filter);
      console.log(this.imageManager.images);
      
      // フィルタ設定による情報更新
      this.imageManager.updateFilterCheck(this.config.filter);

      console.log(this.imageManager.images);

      this.reRenderingViewerMain();

      this.isFinishAnalyze = true;

      document.title = `[Viewer]${this.title}`;
    })();
  },
  methods: {
    analyzeImage: async function(param){
      param.images.forEach((data) => this.imageManager.append(data.url));

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
    actionChangeViewer: function(filter){
      console.log("viewer App actionChangeViewer", filter);

      // 設定保存
      if(filter){
        this.config.filter = filter;
      }
      this.config.filter.save();
      this.filterConfig = this.config.filter.toObject();

      // ダイアログを消して画面を再構築
      this.$refs.viewerMain.closeMenuDialog();
      this.reRenderingViewerMain();
    },
    // provivide関数
    actionInitializeConfig: function(){
      console.log("viewer App actionInitializeConfig");
      this.config.filter.initialize();
      this.config.filter.save();
      this.filterConfig = this.config.filter.toObject();

      // フィルタ設定画面を更新
      // フィルタチェックを更新することでリスト表示を更新
      this.imageManager.updateFilterCheck(this.config.filter);
      this.reRenderingViewerMain();
    },
    // provivide関数
    updateFilterSettingValue: function(filter){
      // 子 -> 親通知.子コンポーネントからフィルタ設定の値が変更されたことを通知
      console.log("viewer App updateFilterSettingValue");
      this.config.filter = filter;

      // フィルタチェックを更新することでリスト表示を更新
      this.imageManager.updateFilterCheck(this.config.filter);
    },
    // privide関数
    loadConfig: async function(){
      console.debug("Viewer App loadConfig start");
      await this.config.filter.load();
      this.filterConfig = this.config.filter.toObject();
      this.imageManager.updateFilterCheck(this.config.filter);
      // フィルタ設定画面を更新
      console.debug("Viewer App loadConfig async end");
    },
    reRenderingViewerMain: function(){
      console.log("reRenderingViewerMain");
      this.filteringResult = {
        images: this.imageManager.filterImages,
        matchCount: this.imageManager.matchCount,
        totalCount: this.imageManager.imageCount,
        errorCount: this.imageManager.errorCount,
      }
      console.debug("filteringResult", this.filteringResult);

    },
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
