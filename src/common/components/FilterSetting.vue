<template>
  <div>
    <div class="mb-3">
      <h4>フィルタリング</h4>
      <div class="mb-2">
        <b-form-checkbox v-model="filterCheck">
          画像サイズでフィルタリング(c)
        </b-form-checkbox>
      </div>
      <div class="mb-2">
        <transition name="test">
        <div class="d-inline-block w-30 input-transition">
          <b-input-group prepend="幅" size="sm">
            <b-form-input
              v-model.number="inputWidth"
              size="sm"
              type="number" step="100" min="0" max="100000"
              :disabled="inputDisabled"
              id="input-width"
            ></b-form-input>
          </b-input-group>
        </div>
        </transition>
        &nbsp;×&nbsp;
        <div class="d-inline-block w-30 input-transition">
          <b-input-group prepend="高" size="sm">
            <b-input
              v-model.number="inputHeight"
              size="sm"
              type="number" step="100" min="0" max="100000"
              :disabled="inputDisabled"
              id="input-height"
            ></b-input>
          </b-input-group>
        </div>
      </div>
      <div class="mb-3">
        <b-button variant="success" @click="changeViewer">ビュアー表示(o)</b-button>
        <b-button variant="secondary" @click="initializeConfig">初期化</b-button>
      </div>
    </div>
  </div>
</template>


<script>
import {FilterConfig} from "../config"
import gsap from "gsap";

export default {
  props: {
    filterConfig: Object,
  },
  inject: [
    'actionChangeViewer',
    'actionInitializeConfig',
    'updateFilterSettingValue',
  ],
  data: function() {
    return {
      filterCheck: this.filterConfig.check,
      inputWidth: this.filterConfig.width,
      inputHeight: this.filterConfig.height,
    }
  },
  computed: {
    inputDisabled: function(){
      return !this.filterCheck;
    },
  },
  mounted: function(){
    console.log("ViewerMain mounted");
    window.addEventListener('keydown', this.onKeyDown);
  },
  beforeDestroy: function(){
    console.log("beforeDestroy");
    /* mountedで追加したリスナーはここで破棄する必要がある */
    window.removeEventListener('keydown', this.onKeyDown);
  },
  methods: {
    onKeyDown: function(){
      let keyName = event.key;
      switch(keyName){
        case "o":
          this.actionChangeViewer();
          break;
        case "c":
          // フィルタチェック有無を切り替える
          this.filterCheck = !this.filterCheck;
          break;
        case "ArrowUp":
          // width/heightとも100づつアップする(フォーカスがあたってる状態だと二重に上がってしまうがとりあえず仕様とする)
          if(event.shiftKey){
            this.inputWidth += 100;
            this.inputHeight += 100;
          }
          break;
        case "ArrowDown":
          if(event.shiftKey){
            this.inputWidth -= 100;
            if(this.inputWidth < 0){
              this.inputWidth = 0;
            }
            this.inputHeight -= 100;
            if(this.inputHeight < 0){
              this.inputHeight = 0;
            }
          }
          break;
        default:
          break;
      }
    },
    changeViewer: function(){
      console.debug("FilterSetting changeViewer", this.filterCheck, this.inputWidth, this.inputHeight);

      // injection method exec
      this.actionChangeViewer();
    },
    initializeConfig: function(){
      console.log("FilterSetting  initializeConfig");

      // injection method exec
      this.actionInitializeConfig();
    },
    update: function(){
      console.log("FilterSetting update");
      this.filterCheck = this.filterConfig.check;
      this.inputWidth = this.filterConfig.width;
      this.inputHeight = this.filterConfig.height;
    },
    notifyFilterChanged: function(){
      console.debug("FilterSetting NotifyChanged", this.filterCheck, this.inputWidth, this.inputHeight);
      let filter = new FilterConfig();
      filter.setFilter(this.filterCheck, this.inputWidth, this.inputHeight);
      this.updateFilterSettingValue(filter);
    },
    animateChangeValue(target){
      gsap.fromTo(target, 
        {color: '#000000'},
        {color: '#ff6347', fontWeight: 'bold', duration:1}
      );
    }
  },
  watch: {
    filterCheck: function(){this.notifyFilterChanged()},
    inputWidth: function(){
      this.animateChangeValue('#input-width');
      this.notifyFilterChanged();
    },
    inputHeight: function(){
      this.animateChangeValue('#input-height');
      this.notifyFilterChanged();
    },
    filterConfig: function(){
      console.debug("watch FilterSetting filterConfig");
      this.filterCheck = this.filterConfig.check;
      this.inputWidth = this.filterConfig.width;
      this.inputHeight = this.filterConfig.height;
    },
  }
}
</script>

<style lang="scss" scoped>

@import '../../common.scss';

.input-transition{
  @extend .my-ripple-out;
}

.input-transition:hover:before, .input-transition:focus:before, .input-transition:active:before {
  animation-name: my-ripple-out;
}

</style>