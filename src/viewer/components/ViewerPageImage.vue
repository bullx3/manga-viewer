<template>
  <div v-if="!imageInfo.isBlank" class="img-area">
    <img :src="imageInfo.url" :style="styleObject" />
    <div v-if="viewConfig.isShowImagePage" class="img-page">{{pageIndex+1}} p</div>
    <div v-if="viewConfig.isShowImageSize" class="img-info">{{imageInfo.width}} x {{imageInfo.height}}</div>
    <div v-if="imageInfo.isLink && viewConfig.isShowLink" class="img-link">
      <a :href="imageInfo.link"><img src="/images/icon-link_x64.png" /></a>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    imageInfo: Object,
    pageIndex: Number,
    wrapWidth: Number,
    wrapHeight: Number,
    viewConfig: Object,
  },
  computed: {
    styleObject: function(){
      let scaleHorizon = this.wrapWidth / this.imageInfo.width;
      let scaleVertical = this.wrapHeight / this.imageInfo.height;
      return scaleHorizon < scaleVertical
       ? {width: this.wrapWidth + "px", "margin-top": Math.floor((this.wrapHeight - scaleHorizon * this.imageInfo.height) / 2) + "px"}
       : {height: this.wrapHeight + "px"};
    },
  }
}
</script>


<style lang="scss" scoped>

.img-area{
  position: relative;
  width: 100%;
  height: 100%;
}

.img-page {
  position: absolute;
  z-index: 90;
  top: 5px;
  right: 5px;
  opacity: 0.5;
  color: cornflowerblue;
}

.img-info {
  position: absolute;
  z-index: 90;
  bottom: 5px;
  right: 5px;
  opacity: 0.5;
  color: cornflowerblue;
}

.img-link {
  position: absolute;
  z-index: 90;
  bottom: 5px;
  left: 5px;
  opacity: 0.5;
  color: cornflowerblue;

  img {
    width:1.5rem;
    height:1.5rem;
  }
}

</style>
