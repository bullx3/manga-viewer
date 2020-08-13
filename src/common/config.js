class baseConfig{
  constructor(){
    this.initialize();
  }
  typeCheck(val, typeName){
    if(typeof(val) === typeName){
      return true
    }else{
      throw new TypeError(`"set type error.' argument is ${typeof(val)} `);
    }

  }
  throwTypeError(name, val){throw new TypeError(`"set type error property.'${name}' is ${typeof(val)} `);}
  throwAbstractError(){throw new Error("need override method");}
  name(){
    this.throwAbstractError()
  }
  initialize(){
    this.throwAbstractError()
  }
  toObject(){
    this.throwAbstractError()
  }
  fromObject(obj){
    this.throwAbstractError()
  }

  async save(){
    console.debug(`start save ${this.name()}`);
    let obj = {};
    obj[this.name()] = this.toObject();
    await browser.storage.local.set(obj);
    console.debug(`complete save ${this.name()}`,this);
  }
  async load(){
    console.debug(`start load ${this.name()}`);
    let obj = await browser.storage.local.get(this.name());
    console.log(obj);
    if(!obj[this.name()]){
      console.log(`Don't exist ${this.name()} setting`);
      this.initialize();
      await this.save();
    }else{
      this.fromObject(obj[this.name()]);
    }
    console.debug(`complete load ${this.name()}`, this);
  }
}

class FilterConfig extends baseConfig{
  constructor(){
    super();
  }
  get check(){return this._check}
  set check(val){
    if(this.typeCheck(val, 'boolean')){
      this._check = val
    }
  }
  get width(){return this._width}
  set width(val){
    if(this.typeCheck(val, 'number')){
      this._width = val
    }
  }
  get height(){return this._height}
  set height(val){
    if(this.typeCheck(val, 'number')){
      this._height = val
    }
  }

  name(){
    return "filterConfig";
  }
  setFilter(check, width, height){
    this.check = check;
    this.width = parseInt(width);
    this.height = parseInt(height);
  }
  initialize(){
    this._check = true;
    this._width = 200;
    this._height = 200;
  }
  toObject(){
    return {check: this.check, width: this.width, height: this.height};
  }
  fromObject(obj){
    this.setFilter(obj.check, obj.width, obj.height);
  }
}

export {FilterConfig};

class ViewConfig extends baseConfig {

  constructor(){
    super();
  }
  get numberOfPage(){return this._numberOfPage}
  set numberOfPage(val){
    if(this.typeCheck(val, 'number')){
      this._numberOfPage = val
    }
  }
  get isShowTitle(){return this._isShowTitle}
  set isShowTitle(val){
    if(this.typeCheck(val, 'boolean')){
      this._isShowTitle = val
    }
  }
  get isShowImageSize(){return this._isShowImageSize}
  set isShowImageSize(val){
    if(this.typeCheck(val, 'boolean')){
      this._isShowImageSize = val
    }
  }
  get isShowImagePage(){return this._isShowImagePage}
  set isShowImagePage(val){
    if(this.typeCheck(val, 'boolean')){
      this._isShowImagePage = val
    }
  }
  name(){
    return "viewConfig";
  }
  initialize(){
    this.numberOfPage = 2;
    this.isShowTitle = true;
    this.isShowImageSize = true;
    this.isShowImagePage = true;
  }
  toObject(){
    return {
      numberOfPage: this.numberOfPage,
      isShowTitle: this.isShowTitle,
      isShowImageSize: this.isShowImageSize,
      isShowImagePage: this.isShowImagePage,
    };
  }
  fromObject(obj){
    this.numberOfPage = obj.numberOfPage;
    this.isShowTitle = obj.isShowTitle;
    this.isShowImageSize = obj.isShowImageSize;
    this.isShowImagePage = obj.isShowImagePage;
  }
}
export {ViewConfig}


class Config {
  constructor(){
    this.filter = new FilterConfig();
    this.view = new ViewConfig();
  }

  async load(){
    this.filter.load();
    this.view.load();
  }

  async save(){
    this.filter.save();
    this.view.save();
  }
}

export default Config;
