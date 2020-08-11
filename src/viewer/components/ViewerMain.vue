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
    }
  },
  watch: {
    currentPage: function(){
      console.log("watch currentPage");
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

      switch(keyName){
        case "ArrowLeft":
          if(this.currentPage < this.viewPages.length - 1 ){
            this.viewPages[this.currentPage].show = false;
            this.viewPages[this.currentPage+1].show = true;
            this.currentPage++;
          }
          break;
        case "ArrowRight":
          if(this.currentPage > 0){
            this.viewPages[this.currentPage].show = false;
            this.viewPages[this.currentPage-1].show = true;
            this.currentPage--;
          }
          break;
        case "ArrowDown":
          // 1枚だけ進む
          break;
        case "ArrowUp":
          // 1枚だけ戻る
          break;
        case "n":
          let currentNum = this.numberOfPage;
          let newNum = currentNum === 1 ? 2 : 1; // 現在は1か2だけなのでトグル扱い

          // 再構築
          this.changeNumberOfPage(currentNum, newNum);

          // 親に変更通知
          this.notifyChangeNumberOfPage(newNum);
          this.notifyChangePage();
          break;
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