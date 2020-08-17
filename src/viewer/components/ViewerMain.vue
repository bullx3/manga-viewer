<template>
  <div>
    <div class="viewer-menu">
      <ul>
        <li>
          <p>
            {{filteringResult.matchCount === 0 ? 0 : currentImagePage+1}} / {{filteringResult.matchCount}} p
            ({{filteringResult.totalCount}}
            <span v-if="filteringResult.errorCount > 0" class="error">(エラー {{filteringResult.errorCount}})</span>)
          </p>
        </li>
        <li v-if="viewConfig.isShowTitle"><p>{{ title }}</p></li>
        <li><button v-on:click="openMenuDialog">Menu</button></li>
      </ul>
    </div>
    <MenuDialog
      v-if="isMenuDialogShow"
      v-bind:filter-config="filterConfig"
      v-bind:view-config="viewConfig"
      v-bind:images="images"
      v-bind:filtering-result="filteringResult"
      v-on:close-dialog="closeMenuDialog"
    />
    <ViewerPage
      v-for="(viewPage, index) in viewPages"
      v-bind:key="index"
      v-bind:view-config="viewConfig"
      v-bind:page-images="viewPage.pageImages"
      v-bind:page-width="pageWidth"
      v-bind:page-height="pageHeight"
      v-show="viewPage.show"
    />
  </div>
</template>

<script>
import ImageInfo from '../../common/image-info'
import ViewerPage from './ViewerPage.vue'
import MenuDialog from './MenuDialog.vue'

export default {
  components: {
    ViewerPage,
    MenuDialog,
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
      pageWidth: window.innerWidth,
      pageHeight: window.innerHeight,
      beforeBlank: 0,
      isMenuDialogShow: false,
    }
  },
  computed: {
    currentPage: function() {
      return Math.floor((this.currentImagePage + this.beforeBlank) / this.viewConfig.numberOfPage);
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
    },
    closeMenuDialog: function(){
      console.log("Viewer App closeMenuDialog");
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
      console.debug("currentImagePage", this.currentImagePage, "currentPage", this.currentPage, "beforeBlank", this.beforeBlank);
      if(this.isMenuDialogShow){
        // ダイアログ表示中はメニューを閉じるキーのみうけつける
        switch(keyName){
          case "m":
          case "Escape":
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
            this.viewPages[this.currentPage+1].show = true;
            this.currentImagePage += this.viewConfig.numberOfPage;
            if(this.currentImagePage > this.filterImages.length - 1){
              this.currentImagePage = this.filterImages.length - 1;
            }
          }
          break;
        case "ArrowRight":
          // 1ページ戻る
          if(this.currentPage > 0){
            this.viewPages[this.currentPage].show = false;
            this.viewPages[this.currentPage-1].show = true;
            this.currentImagePage -= this.viewConfig.numberOfPage;
            if(this.currentImagePage < 0){
              this.beforeBlank = 0;
              this.viewPages = this.createViewPagesWithBeforeBlank(this.filterImages, this.viewConfig.numberOfPage, 0);
              this.currentImagePage = 0;
              this.viewPages[0].show = true;
            }
          }
          break
        case "ArrowDown":
          // 一枚進む
          console.debug("before",this.currentImagePage, this.filterImages.length);
          if(this.currentImagePage < this.filterImages.length - 1){
            if(this.beforeBlank < this.viewConfig.numberOfPage - 1){
              this.beforeBlank++;
            }else{
              this.beforeBlank = 0;
            }
            console.debug("beforeBlank:", this.beforeBlank);
            this.viewPages = this.createViewPagesWithBeforeBlank(this.filterImages, this.viewConfig.numberOfPage, this.beforeBlank);
            this.currentImagePage++;
            console.debug("currentPage", this.currentPage);
            this.viewPages[this.currentPage].show = true;
          }
          console.debug("after",this.currentImagePage, this.filterImages.length);
          break;
        case "ArrowUp":
          // 一枚戻る
          console.debug("before", this.currentImagePage, this.filterImages.length);
          if(this.currentImagePage > 0){
            if(this.beforeBlank > 0){
              this.beforeBlank--;
            }else{
              this.beforeBlank = this.viewConfig.numberOfPage - 1;
            }
            console.debug("beforeBlank:", this.beforeBlank);
            this.viewPages = this.createViewPagesWithBeforeBlank(this.filterImages, this.viewConfig.numberOfPage, this.beforeBlank);
            this.currentImagePage--;
            console.debug("currentPage", this.currentPage);
            this.viewPages[this.currentPage].show = true;
          }
          console.debug("after", this.currentImagePage, this.filterImages.length);
          break;
        case "1":
          if(this.viewConfig.numberOfPage !== 1){
            this.changeNumberOfPage(1);
          }
          break;
        case "2":
          if(this.viewConfignumberOfPage !== 2){
            this.changeNumberOfPage(2);
          }
          break;
        case "n":
          let newNum = this.viewConfig.numberOfPage === 1 ? 2 : 1; // 現在は1か2だけなのでトグル扱い
          this.changeNumberOfPage(newNum);
          break;
        case 'm':
          this.openMenuDialog();
          break;
      }
    },
    createViewPagesWithBeforeBlank: function(images, numberOfPage, beforeBlankCount){
      let pages = [];
      let blank = new ImageInfo();
      let blanks = new Array(beforeBlankCount).fill(blank);
      let tempImages = blanks.concat(images);

      let len = tempImages.length;
      for(var i = 0; i < len; i += numberOfPage){
        let pageImages = [];
        for(var j = 0; j < numberOfPage; j++){
          if((i + j) < len){
            let index = i + j - beforeBlankCount;
            if(index < 0 ){
              // before blank
              pageImages.push({index: null , imageInfo: blank});
            }else{
              pageImages.push({index: index , imageInfo: tempImages[i+j]});
            }
          }else{
            // after blank
            pageImages.push({index: null , imageInfo: blank});
          }
        }
        pages.push({show: false, pageImages: pageImages});
      }
      console.debug(pages);
      // pages.forEach((page) => {
      //   page.pageImages.forEach((pageImage) => {
      //     console.debug("pageImage", "index", pageImage.index, pageImage.imageInfo.isBlank, pageImage.imageInfo.filename);
      //   });
      // });
      return pages;
    },
    changeNumberOfPage: function(newNum){
      
      console.log("changeNumberOfPage", newNum);

      this.notifyChangeNumberOfPage(newNum);
      // 現在のページを維持する為にここでviewPageの更新を行う
      this.viewPages = this.createViewPagesWithBeforeBlank(this.filterImages, newNum, 0);

      // プロパティ numberOfPageが更新されてからの判定が必要となる為、次の描画処理で実行
      this.$nextTick(function(){
        console.debug("changeNumberOfPage -> nextTick", this.viewConfig.numberOfPage, this.currentPage);
        if(this.viewPages.length > 0){
          this.viewPages[this.currentPage].show = true;
        }
      });
    },
    rebuildViewPages: function(){
      console.log("ViewerMain rebuildViewPages");
      // viewPagesを更新することで最新の情報で再描画を行う
      this.currentImagePage = 0;
      this.viewPages = this.createViewPagesWithBeforeBlank(this.filterImages, this.viewConfig.numberOfPage, 0);
      if(this.viewPages.length > 0){
        this.viewPages[this.currentPage].show = true;
      }
    },
  }
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