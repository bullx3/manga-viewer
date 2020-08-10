class ImageInfo{
  constructor(url){
    this.url = url;
    if(url){
      this.isBlank = false;
      this.filename = this.getFilename(url);
    }else{
      this.isBlank = true;
      this.filename = "";
    }
    this.width = 0;
    this.height = 0;
    this.isMatch = true; // フィルタ値に対してマッチしているか?
    this.isValid = true; // 画像の有効性(解析できた場合はtrue)
  }

  getFilename(url) {
    try{
      let parser = new URL(url);
      return parser.pathname.split('/').pop();
    } catch(e) {
      console.log(e);
      return null;
    }
  }

  async analyze(){
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        this.width = img.naturalWidth;
        this.height = img.naturalHeight;
        resolve();
      }
      img.onerror = (e) => {
        this.isValid = false;
        reject(e);
      };
      img.src = this.url;
    });
  }

  checkMatch(width, height){
    return (this.width >= width && this.height >= height) ? true : false;
  }

}

export default ImageInfo;
