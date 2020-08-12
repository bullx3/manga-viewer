<template>
  <div v-if="numberOfPage===1" class="view-page">
    <div class="image-wrap-center" v-bind:style="styleObjectImageWrap">
      <ViewerPageImage
        v-bind:page-index="pageImages[0].index"
        v-bind:image-info="pageImages[0].imageInfo"
        v-bind:rap-width="rapWidth"
        v-bind:rap-height="rapHeight"
      />
    </div>
  </div>

  <div v-else-if="numberOfPage===2" class="view-page">
    <div class="image-wrap-left" v-bind:style="styleObjectImageWrap">
      <ViewerPageImage
        v-bind:page-index="pageImages[1].index"
        v-bind:image-info="pageImages[1].imageInfo"
        v-bind:rap-width="rapWidth"
        v-bind:rap-height="rapHeight"
      />
    </div>
    <div class="image-wrap-right" v-bind:style="styleObjectImageWrap">
      <ViewerPageImage
        v-bind:page-index="pageImages[0].index"
        v-bind:image-info="pageImages[0].imageInfo"
        v-bind:rap-width="rapWidth"
        v-bind:rap-height="rapHeight"
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
    numberOfPage: Number,
    pageImages: Array,
    pageWidth: Number,
    pageHeight: Number,
  },
  computed: {
    rapWidth: function(){
      return Math.floor(this.pageWidth / this.numberOfPage);
    },
    rapHeight: function(){
      return this.pageHeight;
    },
    styleObjectImageWrap(){
     return {width: this.rapWidth + 'px', height: this.rapHeight + 'px'}
    },
  },
}
</script>

<style lang="scss" scoped>
.view-page {
  display: table;
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