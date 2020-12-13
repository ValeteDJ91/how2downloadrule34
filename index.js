const fs = require('fs');
const axios = require('axios');
const { SSL_OP_EPHEMERAL_RSA } = require('constants');

var imgsliced
var imgindex1
var imgindex2
const imgsearch1 = `<a href="#" onclick="toggleEditForm(); return false;">Edit</a>`;
const imgsearch2 = `style="font-weight: bold;">Original image</a>`;

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
      imgindex1 = response.data.indexOf(imgsearch1)
      imgindex2 = response.data.indexOf(imgsearch2)
      imgsliced = response.data.slice(imgindex1+204, imgindex2-89)
      if (imgsliced.length > 100||imgsliced.length < 5) {
        console.log("Failed")
        return;
      }
      let currentlydownloading = download_image(`${imgsliced}`, `homework/${image}.png`);
      console.log(`sucess: ${image}`)
      console.log(imgsliced)
    });
  });
});
