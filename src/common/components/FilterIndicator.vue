<template>
  <div>
    <p>
      解析中{{progress.index}} / {{progress.length}} 
      <span v-if="progress.error > 0" class="error">(エラー {{progress.error}})</span>
    </p>
    <div class="progress-bar" v-bind:style="{width: percent + '%'}"></div>
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
    }
  }
}
</script>

<style lang="scss" scoped>
.progress-bar {
  width: 0%; /* jsで増やしていく */
  height: 10px;
  margin: 5px;
  background-color: gray;
  border-radius: 0.6rem;
  border: 1px;
}


.error {
  color: red;
}
</style>
