/*
 * このスクリプトはメインページ側で実行される。ログもメインページで出力されるのに注意
 */


console.log("start scraping.js");

console.log(this);
var titleElements = this.document.getElementsByTagName("title");
var title = titleElements[0].innerText;
console.log(title);

var images = [];
var imageElements = document.images;

for(var i = 0; i < imageElements.length; i++){
  var parent =imageElements[i].parentNode;
  var aTag = null;
  if(parent.tagName === "A"){
    if(parent.href){
      aTag = parent.href;
    }
  }
  images.push({url: imageElements[i].src, link: aTag});
}

console.debug(images);

result = {"title": title, "images": images};
result;
