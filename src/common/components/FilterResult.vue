<template>
  <p>
    有効数 {{filteringResult.matchCount}} / {{filteringResult.totalCount}} 
    <span v-if="filteringResult.errorCount > 0" class="error">
      (エラー{{filteringResult.errorCount}})
    </span>
  </p>
</template>

<script>
export default {
  props: {
    filteringResult: Object,
  }
}
</script>

<style lang="scss" scoped>
.error {
  color: red;
}
</style>
