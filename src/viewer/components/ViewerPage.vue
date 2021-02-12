<template>
  <div v-if="pageImages.length===1" class="view-page">
    <div class="image-wrap-center" :style="styleObjectImageWrap(1)">
      <ViewerPageImage
        :page-index="pageImages[0].index"
        :image-info="pageImages[0].imageInfo"
        :wrap-width="wrapWidth(1)"
        :wrap-height="wrapHeight"
        :view-config="viewConfig"
      />
    </div>
  </div>
  <div v-else-if="pageImages.length===2" class="view-page">
    <div class="image-wrap-left" :style="styleObjectImageWrap(2)">
      <ViewerPageImage
        :page-index="pageImages[1].index"
        :image-info="pageImages[1].imageInfo"
        :wrap-width="wrapWidth(2)"
        :wrap-height="wrapHeight"
        :view-config="viewConfig"
      />
    </div>
    <div class="image-wrap-right" :style="styleObjectImageWrap(2)">
      <ViewerPageImage
        :page-index="pageImages[0].index"
        :image-info="pageImages[0].imageInfo"
        :wrap-width="wrapWidth(2)"
        :wrap-height="wrapHeight"
        :view-config="viewConfig"
      />
    </div>
  </div>
</template>

<script>
import ViewerPageImage from './ViewerPageImage.vue'

export default {
  components: {
    ViewerPageImage,
  },
  props: {
    viewConfig: Object,
    pageImages: Array,
    pageWidth: Number,
    pageHeight: Number,
  },
  computed: {
    wrapHeight: function(){
      return this.pageHeight;
    },
  },
  methods: {
    wrapWidth: function(numberOfPage){
      return Math.floor(this.pageWidth / numberOfPage);
    },
    styleObjectImageWrap(numberOfPage){
     return {width: this.wrapWidth(numberOfPage) + 'px', height: this.wrapHeight + 'px'}
    },
  }
}
</script>

<style lang="scss" scoped>
.view-page {
  display: table;
  background-color: #f5f5f5;
}

.image-wrap{
  display: table-cell;
  vertical-align: middle;
  position: relative;
}

.image-wrap-center{
  @extend .image-wrap;
  text-align: center;
}

.image-wrap-left{
  @extend .image-wrap;
  text-align: right;
}

.image-wrap-right{
  @extend .image-wrap;
  text-align: left;
}

</style>