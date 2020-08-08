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
  toJson(){
    return JSON.stringify({check: this.check, width: this.width, height: this.height});
  }
  fromJson(json){
    let obj = JSON.parse(json);
    this.setFilter(obj.check, obj.width, obj.height);
  }
}

export {FilterConfig};

class Config {
  constructor(){
    this.filter = new FilterConfig();
  }

  async saveFilter(filter){
    return new Promise((resolve, reject) => {
      this.filter.set(filter);
      setTimeout(()=>{
        localStorage["fiterConfig"] = filter.toJson();
        resolve();
      },10);
    });
  }

  async loadFilter(){
    return new Promise((resolve, reject) => {
      setTimeout(()=>{
        let loadConfig = localStorage["fiterConfig"];
        console.log("loadFilter:" + loadConfig);
        if(loadConfig == null){
          this.filter.initialize();
          // ストレージ更新
          this.saveFilter(this.filter);
        }else{
          this.filter.fromJson(loadConfig);
        }
        resolve();
      },10);
    });

  }
}

export default Config;
