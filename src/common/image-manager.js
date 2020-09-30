import ImageInfo from './image-info'

class ImageManager {
  constructor(){
    this._images = [];
    this._matchCount = 0;
    this._errorCount = 0;
  }
  get images(){return this._images}
  get imageCount(){return this._images.length}
  get matchCount(){return this._matchCount}
  get errorCount(){return this._errorCount}
  get filterImages(){
    return this._images.filter(image => image.isMatch);
  }
  append(url, link){
    let image = new ImageInfo(url);
    if(link){
      image.isLink = true;
      image.link = link;
    }
    this._images.push(image);
    return image;
  }
  async analyze(progressCallback){
    this._errorCount = 0;

    const length = this.images.length;
    for(var index = 0; index < length; index++){
      var image = this.images[index];
      var result = true;
      try{
        await image.analyze();
      //  console.log(`complete (${index+1}/${length})`, image.filename, image.width, image.height);
      }catch(e){
        console.log(`error (${index+1}/${length})`, image.url, e);
        this._errorCount++;
        result = false;
      }finally{
        if(progressCallback){
          // コールバック指定があった場合進捗を返す
          progressCallback(index+1, length, result);
        }
      }
    }
  }
  // 引数のfilterに合わせてisMatchを更新する
  updateFilterCheck(filter){

    this._matchCount = 0;
    if(filter.check){
      this._images.forEach(image => {
        if(image.isValid){
          image.isMatch = image.checkMatch(filter.width, filter.height);
          if(image.isMatch){
            this._matchCount++;
          }
        }else{
          image.isMatch = false;
        }
      });
    }else{
      // 有効である限り無条件ですべてmatchにする
      this._images.forEach(image => {
        if(image.isValid){
          image.isMatch = true
          this._matchCount++;  
        }else{
          image.isMatch = false;
        }
      
      });
    }
  }
}

export default ImageManager;