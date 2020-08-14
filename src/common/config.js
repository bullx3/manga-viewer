class baseConfig{
  constructor(){
    this.initialize();

    // getter/setter作成
    let props = this.props();
    for(let i = 0; i < props.length; i++){
      let prop = props[i];
      Object.defineProperty(this, prop.name, {
        get: function() {
          return this['_' + prop.name];
        },
        set: function(val){
          if(this.typeCheck(val, prop.name, prop.type)){
            this['_' + prop.name] = val;
          }
        }
      });  
    }
  }
  typeCheck(val, name, typeName){
    if(typeof(val) === typeName){
      return true
    }else{
      throw new TypeError(`"set type error.' ${name} is ${typeof(val)} `);
    }
  }
  throwTypeError(name, val){throw new TypeError(`"set type error property.'${name}' is ${typeof(val)} `);}
  throwAbstractError(){throw new Error("need override method");}
  name(){
    this.throwAbstractError()
  }
  props(){
    this.throwAbstractError()
  }
  initialize(){
    let props = this.props();
    for(let i = 0; i < props.length; i++){
      let prop = props[i];
      this['_' + prop.name] = prop.init;
    }
  }
  toObject(){
    let obj = {};
    let props = this.props();
    for(let i = 0; i < props.length; i++){
      let prop = props[i];
      obj[prop.name] = this[prop.name];
    }
    return obj;
  }
  fromObject(obj){
    let props = this.props();
    for(let i = 0; i < props.length; i++){
      let prop = props[i];
      if(!obj[prop.name] === undefined){
        throw new Error(`Error ${this.name}.fromObject. '${props.name}' is not find `);
      }
      this[prop.name] = obj[prop.name];
    }
  }
  // true ならOK
  validateLoad(obj){
    let result = true;
    let props = this.props();
    for(let i = 0; i < props.length; i++){
      let prop = props[i];
      if(!obj[prop.name] === undefined){
        console.error(`Error validation. ${prop.name} is undefined`);
        result = false;
      }
    }
    return result;
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
    let configObj = obj[this.name()];
    if(!configObj || !this.validateLoad(configObj)){
      console.log(`Don't exist ${this.name()} setting or upgrade setting`);
      this.initialize();
      await this.save();
    }else{
      this.fromObject(configObj);
    }
    console.debug(`complete load ${configObj}`, this);
  }
}

class FilterConfig extends baseConfig{
  constructor(){
    super();
  }

  name(){
    return "filterConfig";
  }
  props(){
    return [
      {name: "check", type: "boolean", init: true},
      {name: "width", type: "number", init: 200},
      {name: "height", type: "number", init: 200},
    ];
  }
  setFilter(check, width, height){
    this.check = check;
    this.width = parseInt(width);
    this.height = parseInt(height);
  }
}

export {FilterConfig};

class ViewConfig extends baseConfig {

  constructor(){
    super();
  }
  name(){
    return "viewConfig";
  }
  props(){
    return [
      {name: "numberOfPage", type: "number", init: 2},
      {name: "isShowTitle", type: "boolean", init: true},
      {name: "isShowImageSize", type: "boolean", init: true},
      {name: "isShowImagePage", type: "boolean", init: true},
      {name: "isShowLink", type: "boolean", init: true},
    ];
  }
}
export {ViewConfig}


class Config {
  constructor(){
    this.filter = new FilterConfig();
    this.view = new ViewConfig();
  }

  async load(){
    await this.filter.load();
    await this.view.load();
  }

  async save(){
    await this.filter.save();
    await this.view.save();
  }
}

export default Config;
