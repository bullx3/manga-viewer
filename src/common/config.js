const DEFAULT_FILTER_CHECK = true;
const DEFAULT_FILTER_WIDTH = 200;
const DEFAULT_FILTER_HEIGHT = 200;

class FilterConfig {
  constructor(){
    this.initialize();
  }
  set(filter){
    // Todo: 引数filterはこのクラスであることをチェックする
    this.setFilter(filter.check, filter.width, filter.height);
  }
  setFilter(check, width, height){
    this.check = check;
    this.width = width;
    this.height = height;
  }
  initialize(){
    this.setFilter(DEFAULT_FILTER_CHECK, DEFAULT_FILTER_WIDTH, DEFAULT_FILTER_HEIGHT);
  }
  toObject(){
    return {check: this.check, width: this.width, height: this.height};
  }
  fromObject(obj){
    this.setFilter(obj.check, obj.width, obj.height);
  }
}

export {FilterConfig};

class Config {
  constructor(){
    this.filter = new FilterConfig();
  }

  async saveFilter(filter){
    console.debug("saveFilter start");
    await browser.storage.local.set({filterConfig: filter.toObject()});
    console.debug("saveFilter complete");
  }

  async loadFilter(){
    let loadFilter = await browser.storage.local.get("filterConfig");
    console.debug("load filter",loadFilter);
    if(!loadFilter.filterConfig){
      // 初期状態で設定が保存されていない
      console.log("Don't exist filter setting");
      this.filter.initialize();
      await this.saveFilter(this.filter);
    }else{
      this.filter.fromObject(loadFilter.filterConfig);
    }
  }
}

export default Config;
