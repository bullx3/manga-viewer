<template>
  <div>
    <ViewerPage
      v-for="(viewPage, index) in viewPages"
      v-bind:key="index"
      v-bind:number-of-page="numberOfPage"
      v-bind:images="viewPage.images"
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
      currentPage: 0,
      pageWidth: window.innerWidth,
      pageHeight: window.innerHeight,
      beforeBlank: 0,
    }
  },
  watch: {
    currentPage: function(){
      console.log("watch currentPage", this.currentPage);
      this.notifyChangePage();
    },
    images: function(){
      console.log("watch images");
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
      this.$emit("action-change-page", {current: this.currentPage, total: this.viewPages.length});
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

      if(  (keyName === "ArrowLeft")
        || (keyName === "ArrowDown" && this.numberOfPage === 1)){
        // 1ページ進む
        if(this.currentPage < this.viewPages.length - 1 ){
          this.viewPages[this.currentPage].show = false;
          this.viewPages[this.currentPage+1].show = true;
          this.currentPage++;
        }
      }else if((keyName === "ArrowRight")
            || (keyName === "ArrowUp" && this.numberOfPage === 1)){
        if(this.currentPage > 0){
          // 1ページ戻る
          this.viewPages[this.currentPage].show = false;
          this.viewPages[this.currentPage-1].show = true;
          this.currentPage--;
        }
      }else if(keyName === "ArrowDown"){
        // 一枚進む
        console.log("key ArrowDown");

        if((this.currentPage * 2 + 1) < this.images.length){

          if(this.beforeBlank === 0){
            this.viewPages = this.createViewPagesBeforeBlank(this.images, this.numberOfPage);

            this.beforeBlank++;
            if(this.currentPage < this.viewPages.length - 1){
              this.currentPage++;
            }
          }else{
            this.viewPages = this.createViewPages(this.images, this.numberOfPage);
            this.beforeBlank = 0;
          }

          if(this.viewPages.length > 0){
            this.viewPages[this.currentPage].show = true;
          }
        }
      }else if(keyName === "ArrowUp"){
        // 一枚戻る
        console.log("key ArrowUp");
        if(this.beforeBlank === 0){
          if(this.currentPage > 0){
            this.viewPages = this.createViewPagesBeforeBlank(this.images, this.numberOfPage);
            this.beforeBlank++;
          }
        }else{
          this.viewPages = this.createViewPages(this.images, this.numberOfPage);
          this.beforeBlank = 0;
          if(this.currentPage > 0){ // ユースケース上この判定がfalseになることはない
            this.currentPage--;
          }
        }

        if(this.viewPages.length > 0){
          this.viewPages[this.currentPage].show = true;
        }

      }else if(keyName === 'n'){
        let currentNum = this.numberOfPage;
        let newNum = currentNum === 1 ? 2 : 1; // 現在は1か2だけなのでトグル扱い

        // 再構築
        this.changeNumberOfPage(currentNum, newNum);

        // 親に変更通知
        this.notifyChangeNumberOfPage(newNum);
        this.notifyChangePage();
      }
    },
    createViewPages: function(images, numberOfPage){

      let pages = [];
      let blank = new ImageInfo();
      let len = images.length;
      for(var i = 0; i < len; i += numberOfPage){
        let pageImages = [];
        for(var j = 0; j < numberOfPage; j++){
          if((i + j) < len){
            pageImages.push(images[i+j]);
          }else{
            pageImages.push(blank);
          }
        }
        pages.push({show: false, images: pageImages});
      }
      console.log(pages);
      return pages;
    },
    createViewPagesBeforeBlank(images, numberOfPage){
      let pages = [];
      let blank = new ImageInfo();
      let tempImages = [blank].concat(images);
      let len = tempImages.length;
      for(var i = 0; i < len; i += numberOfPage){
        let pageImages = [];
        for(var j = 0; j < numberOfPage; j++){
          if((i + j) < len){
            pageImages.push(tempImages[i+j]);
          }else{
            pageImages.push(blank);
          }
        }
        pages.push({show: false, images: pageImages});
      }
      console.log(pages);
      return pages;
    },
    changeNumberOfPage: function(currentNum, newNum){
      
      console.log(`changeNumberOfPage(${currentNum}->${newNum})`)

      if(currentNum < newNum){
        this.currentPage = Math.floor(this.currentPage * currentNum / newNum);
      }else{
        this.currentPage = this.currentPage * (currentNum / newNum);
      }

      this.viewPages = this.createViewPages(this.images, newNum);
      if(this.viewPages.length > 0){
        this.viewPages[this.currentPage].show = true;
      }
    },
    rebuildViewPages: function(){
      console.log("ViewerMain rebuildViewPages");
      // viewPagesを更新することで最新の情報で再描画を行う
      this.currentPage = 0;
      this.viewPages = this.createViewPages(this.images, this.numberOfPage);
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