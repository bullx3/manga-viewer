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
  images.push({url: imageElements[i].src});
}

result = {"title": title, "images": images};
result;
