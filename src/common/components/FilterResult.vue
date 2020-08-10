<template>
  <p>
    有効数 {{imageManager.matchCount}} / {{imageManager.imageCount}} 
    <span v-if="imageManager.errorCount > 0" class="error">
      (エラー{{imageManager.errorCount}})
    </span>
  </p>
</template>

<script>
export default {
  props: {
    imageManager: Object,
  }
}
</script>

<style lang="scss" scoped>
.error {
  color: red;
}
</style>
