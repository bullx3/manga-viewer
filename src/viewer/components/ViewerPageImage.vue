<template>
  <div v-if="!image.isBlank">
    <img v-bind:src="image.url" v-bind:style="styleObject" />
    <div class="img-info">{{image.width}}x{{image.height}}</div>
  </div>
</template>

<script>
export default {
  props: {
    image: Object,
    rapWidth: Number,
    rapHeight: Number,
  },
  computed: {
    styleObject: function(){
      let scale_horizon = this.rapWidth / this.image.width;
      let scale_vertical = this.rapHeight / this.image.height;
      return scale_horizon < scale_vertical ? {width: this.rapWidth + "px"} : {height: this.rapHeight + "px"};
    },
  }
}
</script>


<style lang="scss" scoped>

.img-info {
  position: absolute;
  z-index: 90;
  bottom: 0px;
  right: 0px;
  color: cornflowerblue;
}

</style>
