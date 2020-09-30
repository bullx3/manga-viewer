<template>
  <div>
    <table class="table table-custom table-bordered">
      <thead class="thead-light">
        <tr>
          <th>ファイル名</th>
          <th>幅</th>
          <th>高</th>
          <th>Link</th>
        </tr>
      </thead>
      <tbody>
        <tr 
          v-for="(image, index) in images"
          :key="index"
          :class="{ 'no-match-tr' : !image.isMatch}"
        >
          <td @mouseover="mouseover(image)" @mouseleave="mouseleave(image)">
            <div v-if="image.isBlank" class="text-danger">No name</div>
            <div v-else-if="!image.isValid" class="text-danger">{{image.filename}}</div>
            <div v-else>{{image.filename}}</div>
          </td>
          <td>
            <div v-if="image.isValid">{{image.width}}</div>
            <div v-else class="error"> - </div>
          </td>
          <td>
            <div v-if="image.isValid">{{image.height}}</div>
            <div v-else class="error"> - </div>
          </td>
          <td>
            <div v-if="image.isLink">
              <a :href="image.link"><img src="/images/icon-link_x16.png" /></a>
            </div>
            <div v-else> - </div>
          </td>
        </tr>
      </tbody>
    </table>

  </div>
</template>

<script>

export default {
  inject: [
    'updateThumbnailImage',
  ],
  props: {
    images: Array,  // Array of ImageInfo
  },
  methods: {
    mouseover: function(image){
      console.debug("mouseover");
      this.updateThumbnailImage(image.url);
    },
    mouseleave: function(image){
      console.debug("mouseleave");
      this.updateThumbnailImage(null);
    }
  }
}
</script>

<style lang="scss" scoped>

.table-custom {
  table-layout: fixed;
  border-collapse: collapse; /* 一重線 */
  width: 100%;

  th {
    text-align: center;
    &:nth-child(1){
      width: 55%;
    }
    &:nth-child(2), &:nth-child(3){
      width: 15%;
    }
    &:nth-child(4){
      width: 15%;
    }
  }

  td{
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    padding: 3px 4px;
    
    &:nth-child(2), &:nth-child(3), &:nth-child(4){
      text-align: center;
    }
  }
}

.no-match-tr{
  background-color: lightgray;
  color: white;
}

</style>
