<template>
  <div>
    <div
      class="d-inline-block m-2"
      v-for="(image, index) in images"
      :key="index"
      @click="expandingImage(image)"
    >
      <b-img :src="image.url" width="70" height="70" thumbnail></b-img>
    </div>
    <b-modal
      id="expand-image"
      class="w-100 h-auto"
      size="xl"
      hide-footer
      hide-header
    >
      <b-img
        :src="expandedImageUrl"
        class="w-100 h-100"
        @click="$bvModal.hide('expand-image')"
      ></b-img>
    </b-modal>
  </div>
</template>

<script>
export default {
  props: {
    images: Array,
  },
  data: function(){
    return{
      expandedImageUrl: null,
    };
  },
  methods: {
    expandingImage(image){
      this.expandedImageUrl = image.url;
      this.$bvModal.show("expand-image");
    }
  },
}
</script>


<style lang="scss" scoped>

</style>
