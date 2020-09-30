<template>
  <div>
    <div class="bar" :style="{width: percent + '%'}">
      {{progress.index}} / {{progress.length}}
      <span v-if="progress.error > 0" class="text-danger">(エラー {{progress.error}})</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    progress: Object,
  },
  computed: {
    percent: function(){
      return Math.floor((this.progress.index / this.progress.length) * 100);
    },
  }
}
</script>

<style lang="scss" scoped>
.bar {
  width: 0%; /* jsで増やしていく */
  height: 1.0rem;
  text-align: left;
  vertical-align: middle;
  padding-left: 0.5rem;
  color: white;
  background-color: gray;
  border-radius: 0.2rem;
  border: 1px;
}
</style>
