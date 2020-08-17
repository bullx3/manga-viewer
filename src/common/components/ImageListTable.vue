<template>
  <div>
    <table>
      <thead>
        <tr>
          <th>ファイル名</th>
          <th>幅</th>
          <th>高さ</th>
          <th>リンク</th>
        </tr>
      </thead>
      <tbody>
        <tr 
          v-for="(image, index) in images"
          v-bind:key="index"
          v-bind:class="{ 'no-match-tr' : !image.isMatch}"
        >
          <td v-on:mouseover="mouseover(image)" v-on:mouseleave="mouseleave(image)">
            <div v-if="image.isBlank" class="error">No name</div>
            <div v-else-if="!image.isValid" class="error">{{image.filename}}</div>
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
              <a v-bind:href="image.link"><img src="/images/icon-link_x16.png" /></a>
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

table {
  table-layout: fixed;
  border-collapse: collapse; /* 一重線 */
  width: 100%;

  th {
    background-color: grey;
    border: 1px solid white;
    color: white;

    &:nth-child(1){
      width: 60%;
    }
    &:nth-child(2), &:nth-child(3){
      width: 15%;
    }
    &:nth-child(4){
      width: 10%;
    }

  }


  td{
    font-size: 0.8em;
    border: 1px solid gray;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    padding: 3px 4px;
    
    &:nth-child(2), &:nth-child(3), &:nth-child(4){
      text-align: center;
    }
  }

  img {
    height: 0.8em;
  }
}

.no-match-tr{
  background-color: lightgray;
  color: white;
}

.error {
  color: red;
}
</style>
