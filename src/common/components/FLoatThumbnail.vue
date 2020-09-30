<template>
  <div v-if="imageUrl" class="float">
    <div class="img-wrapper">
      <b-img :src="imageUrl" ></b-img>
    </div>
  </div>
</template>


<script>
export default {
  props: {
    imageUrl: String,
  },
}
</script>

<style lang="scss" scoped>
.float {
  position: fixed;
  z-index: 100;
  top: 50px;
  right: 50px;
  width: 50%;
  height: 50%;
  background-color: grey;

  .img-wrapper {
    position: relative;
    width: 100%;
    height: 100%;

    img {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      height: auto;
      width: auto;
      max-width: 100%;
      max-height: 100%;
      margin: auto;
    }
  }
}


</style>