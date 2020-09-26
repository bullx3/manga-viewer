<template>
  <b-container>
    <b-row>
      <b-col sm="6">
        <ShowSetting
          :view-config="viewConfig"
        ></ShowSetting>
        <hr>
        <FilterSetting
          :filter-config="filterConfig"
          ref="filterSetting"
        />
        <hr>
        <FilterResult :filtering-result="filteringResult"/>
        <div class="mb-2"></div>
        <ImageListTable :images="images" />
      </b-col>
      <b-col sm="6">
        <ThumbnailList :images="filterImages"></ThumbnailList>
      </b-col>
    </b-row>
    <FloatThumbnail :image-url="thumnailUrl"/>
  </b-container>
</template>

<script>
import FilterSetting from '../../common/components/FilterSetting.vue';
import ShowSetting from '../../common/components/ShowSetting.vue';
import FilterResult from '../../common/components/FilterResult.vue';
import ImageListTable from '../../common/components/ImageListTable.vue';
import FloatThumbnail from '../../common/components/FLoatThumbnail.vue';
import ThumbnailList from '../../common/components/ThumbnailList.vue';

export default {
  components: {
    FilterSetting,
    ShowSetting,
    FilterResult,
    ImageListTable,
    FloatThumbnail,
    ThumbnailList,
  },
  provide: function(){
    return {
      updateThumbnailImage: this.updateThumbnailImage,
    }
  },
  props: {
    images: Array,
    filteringResult: Object,
    filterConfig: Object,
    viewConfig: Object,
  },
  data: function(){
    return{
      thumnailUrl: null,
    }
  },
  computed: {
    filterImages: function(){
      return this.images.filter(image => image.isMatch);
    },
  },
  methods: {
    updateFilterSetting: function(){
      this.$refs.filterSetting.update();
    },
    updateThumbnailImage: function(url) {
      console.debug("updateThumbnailImage", url);
      this.thumnailUrl = url;
    },
  }
}
</script>


<style lang="scss" scoped>


</style>
