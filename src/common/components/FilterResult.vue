<template>
  <div>
    <b-progress :max="filteringResult.totalCount" show-value>
      <b-progress-bar variant="success" :value="filteringResult.matchCount"></b-progress-bar>
      <b-progress-bar variant="secondary" :value="excludedCount"></b-progress-bar>
      <b-progress-bar variant="danger" :value="filteringResult.errorCount"></b-progress-bar>
    </b-progress>
  </div>
</template>

<script>
export default {
  props: {
    filteringResult: Object,
  },
  computed: {
    excludedCount: function(){
      return this.filteringResult.totalCount - this.filteringResult.matchCount - this.filteringResult.errorCount;
    },
  }
}
</script>
