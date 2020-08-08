<template>
  <div>
    <p>{{ title }}</p>
    <p v-if="!isFinishAnalyze"> 解析中{{progress.index}} / {{progress.length}} 
      <span v-if="progress.error > 0" class="error">(エラー {{progress.error}})</span>
    </p>
    <p v-else> 有効数 {{imageManager.matchCount}} / {{imageManager.imageCount}} 
      <span v-if="imageManager.errorCount > 0" class="error">(エラー数 {{imageManager.errorCount}})</span>
    </p>

    <img
      v-for="(image, index) in imageManager.images"
      v-bind:key="index"
      v-bind:src="image.url"
      width="10%" height="10%"
    />
  </div>
</template>

<script>
import Config from '../common/config'
import {FilterConfig} from '../common/config'
import ImageManager from '../common/image-manager'

export default {
  data () {
    return {
      config: null,
      title: "",
      imageManager: null,
      isFinishAnalyze: false,
      progress: {
        index: 0,
        length: 0,
        error: 0,
      },
    }
  },
  created: function() {
    this.config = new Config();
    this.imageManager = new ImageManager();

    let param = JSON.parse(localStorage["viewerParam"]);
    this.title = param.title;

// 設定取得
    (async () => {
      await this.config.loadFilter();
      console.log("complete LoadFilter");

      //画像タグ取得 & 解析
      await this.analyzeImage(param);

      // フィルタ設定による情報更新
      this.imageManager.updateFilterCheck(this.config.filter);

      this.isFinishAnalyze = true;
    })();


  },
  methods: {
    async analyzeImage(param){
      let scrapingImages = param.images;
      scrapingImages.forEach((data) => this.imageManager.append(data.url));

      console.log("start analyze images")
      // 画像サイズを解析
      await this.imageManager.analyze((index, length, result) => {
        // 進捗表示を更新
        this.progress.index = index;
        this.progress.length = length;
        this.progress.error += result ? 0 : 1;
      });
      console.log("complete analyze images");


    }
  },
}
</script>

<style lang="scss" scoped>
p {
  font-size: 1.5em;
}
</style>
