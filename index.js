const fs = require('fs');
const axios = require('axios');
const { SSL_OP_EPHEMERAL_RSA } = require('constants');

blacktag = ['blacklistedtag1', 'blacklistedtag2']

var imgsliced
var imgindex1
var imgindex2
var tagsliced
var tagindex1
var tagindex2
var tagindex3
var tagindex4
const imgsearch1 = `<meta property="og:image" itemprop="image" content="`;
const imgsearch2 = `<script type="text/javascript">
function iCame(c){	var a; try{a=new XMLHttpRequest()}catch(b){try{a=new ActiveXObject("Msxml2.XMLHTTP")}catch(b){try{a=new`;
const tag1 = `//<![CDATA[`;
const tag2 = `id="image" onclick="Note.toggle();"`;
const tag3 = `"`

const download_image = (url, image_path) =>
axios({
  url,
  responseType: 'stream',
}).then(
  response =>
    new Promise((resolve, reject) => {
      response.data
        .pipe(fs.createWriteStream(image_path))
        .on('finish', () => resolve())
        .on('error', e => reject(e));
    }),
);

fs.readFile('current.json', 'utf-8', (err, data) => {
  if (err) {
      throw err;
  }
  var current = JSON.parse(data.toString());
  var image = current.image+1

  var currentjsonin = {"image": image};
  var data = JSON.stringify(currentjsonin);
  fs.writeFile('current.json', data, (err) => {
    if (err) {
        throw err;
    }
    console.log(`JSON data is saved: ${image}`);

    let target = `https://rule34.xxx/index.php?page=post&s=view&id=${image}`
    
    axios.get(target, {
    timeout: 10000,
    headers: {'X-Requested-With': 'XMLHttpRequest'}
    }).then(function (response) {
      console.log(`trying: ${image}`)
      imgindex1 = response.data.indexOf(imgsearch1)
      imgindex2 = response.data.indexOf(imgsearch2)
      imgsliced = response.data.slice(imgindex1+52, imgindex2-11)
      tagindex1 = response.data.indexOf(tag1)
      tagindex2 = response.data.indexOf(tag2)
      tagsliced = response.data.slice(tagindex1+260, tagindex2-107)
      tagindex3 = tagsliced.indexOf(tag3)
      tagsliced = tagsliced.slice(tagindex3+1, 1000)
      tagindex4 = tagsliced.indexOf(tag3)
      tagsliced = tagsliced.slice(1, tagindex4)
      var i = 0
      while (i < blacktag.length) {
        if (tagsliced.includes(blacktag[i])) {
          console.log("FAILED: Tag in blacklist")
          console.log(`TAG: ${tagsliced}`)
          return;
        }
      i++
      }
      if (imgsliced.includes("video")) {console.log("FAILED: Video");return;}
      let currentlydownloading = download_image(`${imgsliced}`, `homework/${image}.png`);
      console.log(`sucess: ${image}`)
      console.log(`TAG: ${tagsliced}`)
      console.log(`URL: ${imgsliced}`)
      console.log(``)
    });
  });
});
