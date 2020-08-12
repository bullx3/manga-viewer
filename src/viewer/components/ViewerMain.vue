<template>
  <div>
    <ViewerPage
      v-for="(viewPage, index) in viewPages"
      v-bind:key="index"
      v-bind:number-of-page="numberOfPage"
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

export default {
  components: {
    ViewerPage,
  },
  props: {
    images: Array,
    numberOfPage: Number,
  },
  data: function() {
    return {
      viewPages: [],
      currentImagePage: 0,
      pageWidth: window.innerWidth,
      pageHeight: window.innerHeight,
      beforeBlank: 0,
    }
  },
  computed: {
    currentPage: function() {
      return Math.floor((this.currentImagePage + this.beforeBlank) / this.numberOfPage);
    }
  },
  watch: {
    currentImagePage: function(){
      console.debug("watch currentImagePage", this.currentImagePage, this.currentPage);
      this.notifyChangePage();
    },
    images: function(){
      console.debug("watch images");
      this.rebuildViewPages();
    }
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
    notifyChangePage: function(){
      // 親コンポーネントに通知
      this.$emit("action-change-page", {current: this.currentImagePage, total: this.images.length});
    },
    notifyChangeNumberOfPage: function(num){
      this.$emit("action-change-number-of-page", num);
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

      switch(keyName){
        case "ArrowLeft":
          // 1ページ進む
          if(this.currentPage < this.viewPages.length - 1 ){
            this.viewPages[this.currentPage].show = false;
            this.viewPages[this.currentPage+1].show = true;
            this.currentImagePage += this.numberOfPage;
          }
          break;
        case "ArrowRight":
          // 1ページ戻る
          if(this.currentPage > 0){
            this.viewPages[this.currentPage].show = false;
            this.viewPages[this.currentPage-1].show = true;
            this.currentImagePage -= this.numberOfPage;
          }
          break
        case "ArrowDown":
          // 一枚進む
          console.debug("before",this.currentImagePage, this.images.length);
          if(this.currentImagePage < this.images.length - 1){
            if(this.beforeBlank < this.numberOfPage - 1){
              this.beforeBlank++;
            }else{
              this.beforeBlank = 0;
            }
            console.debug("beforeBlank:", this.beforeBlank);
            this.viewPages = this.createViewPagesWithBeforeBlank(this.images, this.numberOfPage, this.beforeBlank);
            this.currentImagePage++;
            console.debug("currentPage", this.currentPage);
            this.viewPages[this.currentPage].show = true;
          }
          console.debug("after",this.currentImagePage, this.images.length);
          break;
        case "ArrowUp":
          // 一枚戻る
          console.debug("before", this.currentImagePage, this.images.length);
          if(this.currentImagePage > 0){
            if(this.beforeBlank > 0){
              this.beforeBlank--;
            }else{
              this.beforeBlank = this.numberOfPage - 1;
            }
            console.debug("beforeBlank:", this.beforeBlank);
            this.viewPages = this.createViewPagesWithBeforeBlank(this.images, this.numberOfPage, this.beforeBlank);
            this.currentImagePage--;
            console.debug("currentPage", this.currentPage);
            this.viewPages[this.currentPage].show = true;
          }
          console.debug("after", this.currentImagePage, this.images.length);
          break;
        case "1":
          if(this.numberOfPage !== 1){
            this.changeNumberOfPage(1);
          }
          break;
        case "2":
          if(this.numberOfPage !== 2){
            this.changeNumberOfPage(2);
          }
          break;
        case "n":
          let newNum = this.numberOfPage === 1 ? 2 : 1; // 現在は1か2だけなのでトグル扱い
          this.changeNumberOfPage(newNum);
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
              pageImages.push({index: index , imageInfo: tempImages[index]});
            }
          }else{
            // after blank
            pageImages.push({index: null , imageInfo: blank});
          }
        }
        pages.push({show: false, pageImages: pageImages});
      }
      console.debug(pages);
      return pages;
    },
    changeNumberOfPage: function(newNum){
      
      console.log("changeNumberOfPage", newNum);

      this.notifyChangeNumberOfPage(newNum);
      this.viewPages = this.createViewPagesWithBeforeBlank(this.images, newNum, 0);

      // プロパティ numberOfPageが更新されてからの判定が必要となる為、次の描画処理で実行
      this.$nextTick(function(){
        console.debug("changeNumberOfPage -> nextTick", this.numberOfPage, this.currentPage);
        if(this.viewPages.length > 0){
          this.viewPages[this.currentPage].show = true;
        }
        this.notifyChangePage();
});

    },
    rebuildViewPages: function(){
      console.log("ViewerMain rebuildViewPages");
      // viewPagesを更新することで最新の情報で再描画を行う
      this.currentImagePage = 0;
      this.viewPages = this.createViewPagesWithBeforeBlank(this.images, this.numberOfPage, 0);
      if(this.viewPages.length > 0){
        this.viewPages[this.currentPage].show = true;
      }
      this.notifyChangePage();
    },
  }
}

</script>

<style lang="scss" scoped>

</style>