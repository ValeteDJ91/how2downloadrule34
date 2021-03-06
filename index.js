const fs = require('fs');
const axios = require('axios');

// options

// put blacklisted tag in here
blacktag = ['blacklistedtag1', 'blacklistedtag2']
// 1 log all the tag for each image 0 log nothing
var taglog = 0
// 1 log image s url 0 log nothing
var urllog = 0

var front = `https://rule34.xxx/index.php?page=post&s=list&tags=all`
const frontsearch1 = `</iframe>
<br /><br />
<div>
<span id=`
const frontsearch2 = ` class="thumb"><a id="`
const imgsearch1 = `<meta property="og:image" itemprop="image" content="`;
const imgsearch2 = `/>
<div id="content">
<div id="post-view">
<div class="sidebar">`;
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

fs.readFile('variables.json', 'utf-8', (err, data) => {
  if (err) { throw err; }
  var variables = JSON.parse(data.toString());
  var image = variables.image
  
  axios.get(front, {
  timeout: 10000,
  headers: {'X-Requested-With': 'XMLHttpRequest'}
  }).then(function (response) {
    frontindex1 = response.data.indexOf(frontsearch1)
    frontindex2 = response.data.indexOf(frontsearch2)
    maxsliced = response.data.slice(frontindex1+40, frontindex2-1)

    if (maxsliced-2 < image) {
      console.log(`FAILED: downloaded all the images (${image}/${maxsliced})`);console.error(`FAILED: downloaded all the images (${image}/${maxsliced})`)
      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 30*1000);
      return;
    }
  });

  let target = `https://rule34.xxx/index.php?page=post&s=view&id=${image}`
  
  axios.get(target, {
  timeout: 10000,
  headers: {'X-Requested-With': 'XMLHttpRequest'}
  }).then(function (response) {
    console.log(`trying: ${image}`);console.error(`trying: ${image}`)
    var imgindex1 = response.data.indexOf(imgsearch1)
    var imgindex2 = response.data.indexOf(imgsearch2)
    var imgsliced = response.data.slice(imgindex1+52, imgindex2-9)
    var tagindex1 = response.data.indexOf(tag1)
    var tagindex2 = response.data.indexOf(tag2)
    var tagsliced = response.data.slice(tagindex1+260, tagindex2-107)
    var tagindex3 = tagsliced.indexOf(tag3)
    var tagsliced = tagsliced.slice(tagindex3+1, 1000)
    var tagindex4 = tagsliced.indexOf(tag3)
    var tagsliced = tagsliced.slice(1, tagindex4)
    var i = 0
    while (i <= blacktag.length) {
      if (tagsliced.includes(blacktag[i])) {
        console.log("FAILED: Tag in blacklist");console.error("FAILED: Tag in blacklist")
        if (taglog == 1) { console.log(`TAG: ${tagsliced}`);console.error(`TAG: ${tagsliced}`) }
        if (urllog == 1) { console.log(`URL: ${imgsliced}`);console.error(`URL: ${imgsliced}`) }
        console.log(``);console.error(``)
        var currentjsonin2 = { 
          "image": image+1,
          "success": variables.success, 
          "failed": variables.failed+1
        };
        var data3 = JSON.stringify(currentjsonin2);
        fs.writeFileSync('variables.json', data3, 'utf-8');
        return;
      }
    i++
    }
    if (imgsliced.includes("video")) {
      console.log("FAILED: Video");console.error("FAILED: Video")
      console.log(``);console.error(``)
      var currentjsonin2 = { 
        "image": image+1,
        "success": variables.success, 
        "failed": variables.failed+1
      };
      var data3 = JSON.stringify(currentjsonin2);
      fs.writeFileSync('variables.json', data3, 'utf-8');
      return;
    }
    let currentlydownloading = download_image(`${imgsliced}`, `homework/${image}.png`);
    console.log(`sucess: ${image}`);console.error(`sucess: ${image}`)
    if (taglog == 1) { console.log(`TAG: ${tagsliced}`);console.error(`TAG: ${tagsliced}`) }
    if (urllog == 1) { console.log(`URL: ${imgsliced}`);console.error(`URL: ${imgsliced}`) }
    var currentjsonin1 = { 
      "image": image+1,
      "success": variables.success+1, 
      "failed": variables.failed
    };
    var data2 = JSON.stringify(currentjsonin1);
    fs.writeFileSync('variables.json', data2, 'utf-8');
    console.log(``);console.error(``)
  });
});
