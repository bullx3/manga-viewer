<template>
  <div v-if="!imageInfo.isBlank" class="img-area">
    <img v-bind:src="imageInfo.url" v-bind:style="styleObject" />
    <div class="img-page">{{pageIndex+1}} p</div>
    <div class="img-info">{{imageInfo.width}} x {{imageInfo.height}}</div>
  </div>
</template>

<script>
export default {
  props: {
    imageInfo: Object,
    pageIndex: Number,
    rapWidth: Number,
    rapHeight: Number,
  },
  computed: {
    styleObject: function(){
      let scale_horizon = this.rapWidth / this.imageInfo.width;
      let scale_vertical = this.rapHeight / this.imageInfo.height;
      return scale_horizon < scale_vertical ? {width: this.rapWidth + "px"} : {height: this.rapHeight + "px"};
    },
  }
}
</script>


<style lang="scss" scoped>

.img-area{
  position: relative;
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

</style>
