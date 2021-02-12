<template>
  <div>
    <div class="viewer-menu">
      <ul>
        <li>
          <FilterResult :filtering-result="filteringResult" />
        </li>
        <li v-if="filteringResult.matchCount !== 0">
          <b-progress :max="filteringResult.matchCount">
            <b-progress-bar variant="primary" :value="currentImagePage+1" show-value></b-progress-bar>
            <b-progress-bar variant="dark" :value="filteringResult.matchCount - currentImagePage - 1"></b-progress-bar>
          </b-progress>
        </li>
        <li v-if="viewConfig.isShowTitle"><div>{{ title }}</div></li>
        <li><b-button @click="openMenuDialog">Menu</b-button></li>
      </ul>
    </div>
    <b-modal id="modal-menu-dialog" title="Menu" size="xl" hide-footer @hidden="menuDialogHidden">
      <MenuDialog
        :filter-config="filterConfig"
        :view-config="viewConfig"
        :images="images"
        :filtering-result="filteringResult"
      />
    </b-modal>
    <ViewerPage
      v-for="(viewPage, index) in viewPages"
      :key="index"
      :view-config="viewConfig"
      :page-images="viewPage.pageImages"
      :page-width="pageWidth"
      :page-height="pageHeight"
      v-show="viewPage.show"
    />
  </div>
</template>

<script>
import ImageInfo from '../../common/image-info'
import ViewerPage from './ViewerPage.vue'
import MenuDialog from './MenuDialog.vue'
import FilterResult from'../../common/components/FilterResult.vue'

export default {
  components: {
    ViewerPage,
    MenuDialog,
    FilterResult,
  },
  inject:[
    "loadConfig",
  ],
  props: {
    images: Array,  // フィルタリングされていない(判定はされている)ImageManagerの配列
    filterImages: Array,
    viewConfig: Object,
    title: String,
    filterConfig: Object,
    filteringResult: Object,
  },
  data: function() {
    return {
      viewPages: [],
      currentImagePage: 0,
      currentPage: 0,
      pageWidth: window.innerWidth,
      pageHeight: window.innerHeight,
      isMenuDialogShow: false,
    }
  },
  watch: {
    filterImages: function(){
      console.debug("watch filterImages");
      this.rebuildViewPages();
    },
  },
  created: function(){
    console.log("ViewerMain created");
    this.rebuildViewPages();
  },
  mounted: function(){
    console.log("ViewerMain mounted");
    window.addEventListener('resize', this.onResize);
    window.addEventListener('keydown', this.onKeyDown);

  },
  beforeDestroy: function(){
    console.log("beforeDestroy");
    /* mountedで追加したリスナーはここで破棄する必要がある */
    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('keydown', this.onKeyDown);
  },
  methods: {
    notifyChangeNumberOfPage: function(num){
      this.$emit("action-change-number-of-page", num);
    },
    openMenuDialog: function(){
      console.log("Viewer App openMenuDialog");
      // load自体は非同期なのでダイアログオープン前にオープンしていまうがload完了後に再描画が行われるようにする
      this.loadConfig();
      this.isMenuDialogShow = true;
      this.$bvModal.show("modal-menu-dialog");
    },
    closeMenuDialog: function(){
      console.log("Viewer App closeMenuDialog");
      this.$bvModal.hide("modal-menu-dialog");
      this.isMenuDialogShow = false;
    },
    menuDialogHidden: function(){
      console.log("Viewer App menuDialogHidden");
      this.isMenuDialogShow = false;
    },
    onResize: function(){
      // 画面サイズ変更
      console.log("onResize", window.innerWidth, window.innerHeight);
      this.pageWidth = window.innerWidth;
      this.pageHeight = window.innerHeight;
    },
    onKeyDown: function(){
      let keyName = event.key;
      console.debug("ViewrMain onKeyDown", keyName);
      console.debug("currentImagePage", this.currentImagePage, "currentPage", this.currentPage);
      if(this.isMenuDialogShow){
        // ダイアログ表示中はメニューを閉じるキーのみうけつける
        switch(keyName){
          case "m":
            this.closeMenuDialog();
            break;
        }
        return;
      }

      switch(keyName){
        case "ArrowLeft":
          // 1ページ進む
          if(this.currentPage < this.viewPages.length - 1 ){
            this.viewPages[this.currentPage].show = false;
            this.currentImagePage += this.viewPages[this.currentPage].pageImages.length;
            this.currentPage++;
            this.viewPages[this.currentPage].show = true;
          }
          break;
        case "ArrowRight":
          // 1ページ戻る
          if(this.currentPage > 0){
            this.viewPages[this.currentPage].show = false;
            this.currentPage--;
            this.viewPages[this.currentPage].show = true;
            this.currentImagePage -= this.viewPages[this.currentPage].pageImages.length; // 戻った先が複数ページがあった場合に先頭ページに合わせる。
          }
          break
        case "ArrowDown":
          // 一枚進む
          if(this.currentImagePage < this.filterImages.length - 1){
            this.currentImagePage++;
            this.createViewPagesAndSetCurrentPage();
          }
          break;
        case "ArrowUp":
          // 一枚戻る
          if(this.currentImagePage > 0){
            this.currentImagePage--;
            this.createViewPagesAndSetCurrentPage();
          }
          break;
        case "0":
        case "1":
        case "2":
          const KeyToNum = {"0": 0, "1": 1, "2": 2};
          let num = KeyToNum[keyName];
          if(this.viewConfig.numberOfPage !== num){
            this.changeNumberOfPage(num);
          }
          break;
        case "n":
          const CurrentToNew = {0: 1, 1: 2, 2:0};
          this.changeNumberOfPage(CurrentToNew[this.viewConfig.numberOfPage]);
          break;
        case 'm':
          this.openMenuDialog();
          break;
      }
    },
    createViewPagesAndSetCurrentPage: function(){
      let pages = [];
      let currentPage = 0;
      if(this.viewConfig.numberOfPage === 0){
        [pages, currentPage] = this.createViewPagesWithCurrentImagePageForAutoMode(this.filterImages, this.currentImagePage);
      }else{
        [pages, currentPage] = this.createViewPagesWithCurrentImagePage(this.filterImages, this.currentImagePage, this.viewConfig.numberOfPage);
      }

      this.currentPage = currentPage;
      if(pages.length > 0){
        pages[this.currentPage].show = true;
      }

      this.viewPages = pages;
    },
    // 
    createViewPagesWithCurrentImagePageForAutoMode: function(images, currentImagePage){

      console.debug("createViewPagesWithCurrentImagePageForAutoMode start")
      let blank = new ImageInfo();

      let afterPages = []; // currentImagePage以降のページ
      let beforePages = []; // currentImagePageの前ページ

      // 現在の画像より後ページ作成
      for(var i = currentImagePage; i < images.length; i++){
        let pageImages = [];
        if(images[i].width < images[i].height){
          // 一枚目が縦長画像
          pageImages.push({index: i , imageInfo: images[i]});
          let next = i + 1;
          if(next < images.length){
            if(images[next].width < images[next].height){
              // 次の画像が縦長画像
              pageImages.push({index: next , imageInfo: images[next]});
              i++;
            }else{
              // 次が横長画像の場合はblank画像を入れておく
              pageImages.push({index: null , imageInfo: blank});
            }
          }else if(next === images.length){
            // 最終ページの場合
            pageImages.push({index: null , imageInfo: blank});
          }
        }else{
          // 横長 or 正方形(単ページ)
          pageImages.push({index: i , imageInfo: images[i]});
        }

        afterPages.push({show: false, pageImages: pageImages});
      }

      // 現在の画像より前ページ作成
      for(var j = currentImagePage - 1; j >= 0; j--){
        let pageImages = [];
        if(images[j].width < images[j].height){
          pageImages.push({index: j , imageInfo: images[j]});
          let before = j - 1;
          if(before >= 0){
            if(images[before].width < images[before].height){
              // 次の画像が縦長画像
              pageImages.unshift({index: before , imageInfo: images[before]});
              j--;
            }else{
              // 縦長の前が横長だった場合
              pageImages.unshift({index: null , imageInfo: blank});
            }
            // 横画像の場合は次のページになる
          }else{
            // 状況的に1p戻った状態で最初のページに画像が一枚だった場合
              pageImages.unshift({index: null , imageInfo: blank});
          }
        }else{
          // 横長 or 正方形(単ページ)
          pageImages.push({index: j , imageInfo: images[j]});
        }

        beforePages.unshift({show: false, pageImages: pageImages});
      }

      let pages = beforePages.concat(afterPages);

      console.debug("createViewPagesWithCurrentImagePageForAutoMode end")
      console.debug(pages);
      return [pages, beforePages.length];

    },
    createViewPagesWithCurrentImagePage: function(images, currentImagePage, numberOfPage){

      console.debug("createViewPagesWithCurrentImagePage start")
      let blank = new ImageInfo();

      let afterPages = []; // currentImagePage以降のページ
      let beforePages = []; // currentImagePageの前ページ

      // 現在の画像より後ページ作成
      for(var i = currentImagePage; i < images.length; i += numberOfPage){
        let pageImages = [];
        for(var j = 0; j < numberOfPage; j++){
          let index = i + j;
          if(index < images.length){
            pageImages.push({index: index , imageInfo: images[index]});
          }else{
            // after blank
            pageImages.push({index: null , imageInfo: blank});
          }
        }
        afterPages.push({show: false, pageImages: pageImages});
      }

      // 現在の画像より前ページ作成
      for(var i = currentImagePage - 1; i >= 0; i -= numberOfPage){
        let pageImages = [];
        for(var j = 0; j < numberOfPage; j++){
          let before = i - j;
          if(before >= 0){
            pageImages.unshift({index: before , imageInfo: images[before]});
          }else{
            // ページによりブランクができてしまう
            pageImages.unshift({index: null , imageInfo: blank});
          }
        }

        beforePages.unshift({show: false, pageImages: pageImages});
      }

      let pages = beforePages.concat(afterPages);

      console.debug("createViewPagesWithCurrentImagePage end")
      console.debug(pages);
      return [pages, beforePages.length];

    },
    changeNumberOfPage: function(newNum){
      
      console.log("changeNumberOfPage", newNum);

      this.notifyChangeNumberOfPage(newNum);


      // プロパティ numberOfPageが更新されてからの判定が必要となる為、次の描画処理で実行
      this.$nextTick(function(){
        console.debug("changeNumberOfPage -> nextTick", this.viewConfig.numberOfPage, this.currentPage);
        this.createViewPagesAndSetCurrentPage();
      });
    },
    rebuildViewPages: function(){
      console.log("ViewerMain rebuildViewPages");
      // viewPagesを更新することで最新の情報で再描画を行う
      this.currentImagePage = 0;
      this.createViewPagesAndSetCurrentPage();
    },
  }
}

</script>

<style lang="scss" scoped>
.viewer-menu {
  width:200px;
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