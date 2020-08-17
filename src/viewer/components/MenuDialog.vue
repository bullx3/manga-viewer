<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <h3>Menu</h3>
          <button class="btn-close-dialog" v-on:click="$emit('close-dialog')">x</button>
          <FilterSetting
            v-bind:filter-config="filterConfig"
            v-bind:view-config="viewConfig"
            ref="filterSetting"
          />
          <hr>
          <FilterResult v-bind:filtering-result="filteringResult" />
          <ImageListTable v-bind:images="images" />
        </div>
        <FloatThumbnail v-bind:image-url="thumnailUrl" />
      </div>
    </div>
  </transition>
</template>

<script>
import FilterSetting from '../../common/components/FilterSetting.vue';
import FilterResult from '../../common/components/FilterResult.vue';
import ImageListTable from '../../common/components/ImageListTable.vue';
import FloatThumbnail from '../../common/components/FLoatThumbnail.vue';

export default {
  components: {
    FilterSetting,
    FilterResult,
    ImageListTable,
    FloatThumbnail,
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

* {
  margin: 0px;
  padding: 3px;
}

.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  max-height: 70%;
  position: absolute;
  z-index: 200;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 0px;

  border: 0;
  border-radius: 0.6rem;
  box-shadow: 0 0 1em black;
  width: 50%;
  background-color: white;

  overflow-y: auto;

  h3 {
    margin: 0;
    padding: 1em;
    padding-left: 8px;
    vertical-align: middle;
    /* height: 3em; */
    padding-bottom: 0.6em;
    border-top-left-radius: 0.6rem;
    border-top-right-radius: 0.6rem;
    background-color: lightblue;
  }

  div{
    margin: 3px;
    padding: 3px
  }

  .btn-close-dialog {
    padding: 0.3em;
    line-height: 0.6;
    position: absolute;
    top: 5px;
    right: 5px;
  }
}

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}

</style>
