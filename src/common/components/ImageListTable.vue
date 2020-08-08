<template>
  <div>
    <table>
      <thead>
        <tr>
          <th>ファイル名</th>
          <th>幅</th>
          <th>高さ</th>
        </tr>
      </thead>
      <tbody>
        <tr 
          v-for="(image, index) in images"
          v-bind:key="index"
          v-bind:class="{ 'no-match-tr' : !image.isMatch}"
        >
          <td v-if="image.filename !== null">{{image.filename}}</td>
          <td v-else class="error">Error!!</td>
          <td v-if="image.isValid">{{image.width}}</td>
          <td v-else class="error"> - </td>
          <td v-if="image.isValid">{{image.height}}</td>
          <td v-else class="error"> - </td>
        </tr>
      </tbody>
    </table>

  </div>
</template>

<script>
export default {
  props: {
    images: Array,
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
      width: 20%;
    }

  }


  td{
    font-size: 0.8em;
    border: 1px solid gray;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;

    &:nth-child(2), &:nth-child(3){
      text-align: center;
    }
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
