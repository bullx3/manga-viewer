<template>
  <div>
    <FilterIndicator v-if="!isFinishAnalyze" v-bind:progress="progress" />
    <div v-else>
      <div class="viewer-menu">
        <ul>
          <li>
            <p>
              {{totalPage === 0 ? 0 : currentPage+1}} / {{totalPage}} p
              ({{imageManager.imageCount}}枚中{{imageManager.matchCount}}枚有効
              <span v-if="imageManager.errorCount > 0" class="error">(エラー {{imageManager.errorCount}})</span>)
            </p>
          </li>
          <li><p>{{ title }}</p></li>
          <li><button v-on:click="openMenuDialog">Menu</button></li>
        </ul>
      </div>
      <ViewerMain
        v-bind:images="filterImages"
        v-bind:number-of-page="numberOfPage"
        v-on:action-change-page="actionChangePage"
        v-on:action-change-number-of-page="actionChangeNumberOfPage"
      />
      <MenuDialog
        v-if="isMenuDialogShow"
        v-bind:config="config"
        v-bind:image-manager="imageManager"
        v-on:close-dialog="closeMenuDialog"
        ref="menuDialog"
      />
    </div>
  </div>
</template>

<script>
import Config from '../common/config'
import ImageManager from '../common/image-manager'
import {FilterConfig} from '../common/config'
import ViewerMain from './components/ViewerMain.vue'
import MenuDialog from './components/MenuDialog.vue'
import FilterIndicator from '../common/components/FilterIndicator'

export default {
  provide: function(){
    return {
      actionChangeViewer: this.actionChangeViewer,
      actionInitializeConfig: this.actionInitializeConfig,
      updateFilterSettingValue: this.updateFilterSettingValue,
    }
  },
  components: {
    ViewerMain,
    MenuDialog,
    FilterIndicator,
  },
  data: function() {
    return {
      config: null,
      numberOfPage: 2,
      title: "",
      imageManager: null,
      filterImages: [],
      isFinishAnalyze: false,
      progress: {
        index: 0,
        length: 0,
        error: 0,
      },
      currentPage: 0,
      totalPage: 0,
      isMenuDialogShow: false,
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
      await this.config.loadFilter();
      console.log("complete LoadFilter");

      //画像タグ取得 & 解析
      await this.analyzeImage(param);

      // フィルタ設定による情報更新
      this.imageManager.updateFilterCheck(this.config.filter);

      this.filterImages = this.imageManager.filterImages;

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
    actionChangePage: function(page){
      this.currentPage = page.current;
      this.totalPage = page.total;
    },
    actionChangeNumberOfPage: function(num){
      this.numberOfPage = num;
    },
    openMenuDialog: function(){
      console.log("Viewer App openMenuDialog");
      this.isMenuDialogShow = true;
    },
    closeMenuDialog: function(){
      console.log("Viewer App closeMenuDialog");
      this.isMenuDialogShow = false;
    },
    // provivide関数
    actionChangeViewer: function(filter){
      console.log("viewer App actionChangeViewer");
      console.log(filter);

      // 設定保存
      this.config.saveFilter(filter);

      // ダイアログを消して画面を再構築
      this.closeMenuDialog();
      this.reRenderingViewerMain();
    },
    actionInitializeConfig: function(){
      console.log("viewer App actionInitializeConfig");
      let filter = new FilterConfig();
      filter.initialize();
      this.config.saveFilter(filter);
      // フィルタ設定画面を更新
      this.$refs.menuDialog.updateFilterSetting();
      // フィルタチェックを更新することでリスト表示を更新
      this.imageManager.updateFilterCheck(this.config.filter);
    },
    updateFilterSettingValue: function(filter){
      // 子 -> 親通知.子コンポーネントからフィルタ設定の値が変更されたことを通知
      console.log("viewer App updateFilterSettingValue");
      this.config.filter.set(filter);

      // フィルタチェックを更新することでリスト表示を更新
      this.imageManager.updateFilterCheck(this.config.filter);
    },
    reRenderingViewerMain: function(){
      console.log("reRenderingViewerMain");
      this.filterImages = this.imageManager.filterImages;
      console.log(this.filterImages);

    },
  },
}
</script>

<style lang="scss" scoped>

.viewer-menu {
  position: absolute;
  z-index: 200;
  top: 0;
  left: 0;
  margin: 2px 5px;
  padding: 2px 5px;
  opacity: 0.5;
  color: cornflowerblue;
}

.error {
  color: red;
}

</style>
