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
          <td v-if="image.isBlank" class="error">No name</td>
          <td v-else-if="!image.isValid" class="error">{{image.filename}}</td>
          <td v-else >{{image.filename}}</td>
          <td v-if="image.isValid">{{image.width}}</td>
          <td v-else class="error"> - </td>
          <td v-if="image.isValid">{{image.height}}</td>
          <td v-else class="error"> - </td>
          <td v-if="image.isLink">
            <a v-bind:href="image.link"><img src="/images/icon-link_x16.png" /></a>
          </td>
          <td v-else> - </td>
        </tr>
      </tbody>
    </table>

  </div>
</template>

<script>
export default {
  props: {
    images: Array,  // Array of ImageInfo
  },
  methods: {
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
    padding: 1px 4px;
    
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
