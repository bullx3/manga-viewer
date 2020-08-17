<template>
  <div v-if="!imageInfo.isBlank" class="img-area">
    <img v-bind:src="imageInfo.url" v-bind:style="styleObject" />
    <div v-if="viewConfig.isShowImagePage" class="img-page">{{pageIndex+1}} p</div>
    <div v-if="viewConfig.isShowImageSize" class="img-info">{{imageInfo.width}} x {{imageInfo.height}}</div>
    <div v-if="imageInfo.isLink && viewConfig.isShowLink" class="img-link">
      <a v-bind:href="imageInfo.link"><img src="/images/icon-link_x64.png" /></a>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    imageInfo: Object,
    pageIndex: Number,
    rapWidth: Number,
    rapHeight: Number,
    viewConfig: Object,
  },
  computed: {
    styleObject: function(){
      let scale_horizon = this.rapWidth / this.imageInfo.width;
      let scale_vertical = this.rapHeight / this.imageInfo.height;
      return scale_horizon < scale_vertical
       ? {width: this.rapWidth + "px", "margin-top": Math.floor((this.rapHeight - scale_horizon * this.imageInfo.height) / 2) + "px"}
       : {height: this.rapHeight + "px"};
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
    width:1.5em;
    height:1.5em;
  }
}

</style>
