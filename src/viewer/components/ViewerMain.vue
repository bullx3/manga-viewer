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
  },
  data: function() {
    return {
      numberOfPage: 2,
      viewPages: [],
      currentPage: 0,

      pageWidth: window.innerWidth,
      pageHeight: window.innerHeight,
    }
  },
  watch: {
    currentPage: function(){
      this.notifyChangePage();
    }
  },
  created: function(){
    console.log("ViewerMain created");

    let blank = new ImageInfo();
    let len = this.images.length;
    for(var i = 0; i < len; i += this.numberOfPage){
      let pageImages = [];
      for(var j = 0; j < this.numberOfPage; j++){
        if((i + j) < len){
          pageImages.push(this.images[i+j]);
        }else{
          pageImages.push(blank);
        }
      }
      this.viewPages.push({show: false, images: pageImages});
    }
    // 1ページ目のみ表示
    if(this.viewPages.length > 0){
      this.viewPages[0].show = true;
    }

    // 初期値を与える為に親コンポーネントに通知
    this.notifyChangePage();

    console.log(this.viewPages);
    console.log("ViewerMain created end");
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
    onResize: function(){
      // 画面サイズ変更
      console.log("onResize", window.innerWidth, window.innerHeight);
      this.pageWidth = window.innerWidth;
      this.pageHeight = window.innerHeight;
    },
    onKeyDown: function(){
      let keyName = event.key;

      switch(keyName){
        case "ArrowDown":
        case "ArrowLeft":
          if(this.currentPage < this.viewPages.length - 1 ){
            this.viewPages[this.currentPage].show = false;
            this.viewPages[this.currentPage+1].show = true;
            this.currentPage++;
          }
          break;
        case "ArrowUp":
        case "ArrowRight":
          if(this.currentPage > 0){
            this.viewPages[this.currentPage].show = false;
            this.viewPages[this.currentPage-1].show = true;
            this.currentPage--;
          }
          break;
      }
    },
  }
}

</script>

<style lang="scss" scoped>

</style>