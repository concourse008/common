'use strict';
const game0Divided = document.getElementById('game-area0');
const game1Divided = document.getElementById('game-area1');
//canvas準備
const canvas = {
  0: document.getElementById("canvas1"),
  1: document.getElementById("canvas2"),
  2: document.getElementById("canvas0")//入力用
};
let flip = 0;
canvas[1 - flip].style.visibility = 'hidden';
canvas[flip].style.visibility = 'visible';
canvas[2].style.visibility = 'visible';
flip = 1 - flip;
let ctx = canvas[flip].getContext('2d');
const ctx0 = canvas[2].getContext('2d');
//画像読み込み
const srcs = [//画像一覧
  ['0.png', 300, 300],
  ['1.png', 300, 300],
  ['2.png', 300, 300],
  ['fire.png', 300, 300]
];
let images = [];
for (let i in srcs) {
  images[i] = new Image();
  images[i].src = srcs[i][0];
}
let loadedCount = 1;
for (let i in images) {
  images[i].addEventListener('load', function () {
    if (loadedCount == images.length) {
      for (let j in images) {
        ctx0.drawImage(images[j], srcs[j][1], srcs[j][2]);
      }
    }
    loadedCount++;
  }, false);
}

let mitox = 300;//ミトの位置
let mitoy = 300;
let kaedex = 0;//カエデの位置
let kaedey = 0;
let fire = [[325, 288], [325, 288], [325, 288], [325, 288]]
let nowmove = 0;//今回のクリックにどれだけ移動しているか
//画面の描写
function step() {
  window.requestAnimationFrame(step);
  canvas[1 - flip].style.visibility = 'hidden';
  canvas[flip].style.visibility = 'visible';
  flip = 1 - flip;
  ctx = canvas[flip].getContext('2d');
  ctx.clearRect(0, 0, 600, 600);
  ctx0.clearRect(0, 0, 600, 600);
  ctx.drawImage(images[2], -150 - kaedex, -150 - kaedey);
  if (mitoy - kaedey < 262) {
    ctx.drawImage(images[0], mitox - kaedex, mitoy - kaedey);
    ctx.drawImage(images[1], 288, 288);
  } else {
    ctx.drawImage(images[1], 288, 288);
    ctx.drawImage(images[0], mitox - kaedex, mitoy - kaedey);
  }
  for (let i = 0; i < fire.length; i++) {
    ctx.drawImage(images[3], fire[i][0], fire[i][1]);
  }

  //スコア表示
  /*
  ctx.lineWidth = 0.5;
  ctx.fillStyle = "#900";
  ctx.font = "bold 24px sans-serif";
  ctx.fillText(`point: ${point}`, 250, 395);
  ctx.strokeStyle = "#fff";
  ctx.strokeText(`point: ${point}`, 250, 395);
  */
}
step();

let mitospeed = 1.7;
let kaedespeed = 1.7;
function mito() {
  if (keyw) {
    mitoy = mitoy - mitospeed;
  }
  if (keya) {
    mitox = mitox - mitospeed;
  }
  if (keys) {
    mitoy = mitoy + mitospeed;
  }
  if (keyd) {
    mitox = mitox + mitospeed;
  }
}
function kaede() {/*マウスの方向に進む
  if(2*mousepoint.x+mousepoint.y < 900 && -2*mousepoint.x+mousepoint.y < -300){
    console.log('1');
    kaedey = kaedey - kaedespeed;
  }else if(2*mousepoint.x+mousepoint.y >= 900 && mousepoint.x+2*mousepoint.y < 900){
    console.log('2');
    kaedex = kaedex + kaedespeed;
    kaedey = kaedey - kaedespeed;
  }else if(mousepoint.x+2*mousepoint.y >= 900 && -1*mousepoint.x+2*mousepoint.y < 300){
    console.log('3');
    kaedex = kaedex + kaedespeed;
  }else if(-1*mousepoint.x+2*mousepoint.y >= 300 && -2*mousepoint.x+mousepoint.y < -300){
    console.log('5');
    kaedex = kaedex + kaedespeed;
    kaedey = kaedey + kaedespeed;
  }else if(2*mousepoint.x+mousepoint.y >= 900 && -2*mousepoint.x+mousepoint.y >= -300){
    console.log('6');
    kaedey = kaedey + kaedespeed;
  }else if(mousepoint.x+2*mousepoint.y >= 900 && 2*mousepoint.x+mousepoint.y<900){
    console.log('8');
    kaedex = kaedex - kaedespeed;
    kaedey = kaedey + kaedespeed;
  }else if(-1*mousepoint.x+2*mousepoint.y >= 300 && mousepoint.x+2*mousepoint.y < 900){
    console.log('9');
    kaedex = kaedex - kaedespeed;
  }else if(-2*mousepoint.x+mousepoint.y >= -300 && -1*mousepoint.x+2*mousepoint.y < 300){
    console.log('11');
    kaedex = kaedex - kaedespeed;
    kaedey = kaedey - kaedespeed;
  }*/
  //クリックした点に進む（画面を動かす）
  if (nowmove != Math.abs(mousepoint.x - 300) && Math.abs(300 - mousepoint.y) < Math.abs(300 - mousepoint.x)) {
    var ratio = (300 - mousepoint.y) / (300 - mousepoint.x);
    kaedex = (Math.abs(mousepoint.x - 300) / (mousepoint.x - 300)) * kaedespeed + kaedex;
    if (300 - mousepoint.x >= 0) {
      kaedey = kaedey - ratio;
    } else {
      kaedey = kaedey + ratio;
    }
    nowmove++;
  } else if (nowmove != Math.abs(mousepoint.y - 300) && Math.abs(300 - mousepoint.y) >= Math.abs(300 - mousepoint.x)) {
    var ratio = (300 - mousepoint.x) / (300 - mousepoint.y);
    kaedey = (Math.abs(mousepoint.y - 300) / (mousepoint.y - 300)) * kaedespeed + kaedey;
    if (300 - mousepoint.y >= 0) {
      kaedex = kaedex - ratio;
    } else {
      kaedex = kaedex + ratio;
    }
    nowmove++;
  }
}

let firestarter = 0;
let firestart_kaede = {};
firestart_kaede['x'] =  [0, 0, 0, 0];
firestart_kaede['y'] =  [0, 0, 0, 0];
function firego() {//炎を撃つ
  for (let i = 0; i < fire.length; i++) {
    if (fire[i][0] > 325) {
      fire[i][0] = fire[i][0] + firestart_kaede.x[i] - kaedex + 3;
      firestart_kaede.x[i] = kaedex;
      fire[i][1] = fire[i][1] + firestart_kaede.y[i] - kaedey;
      firestart_kaede.y[i] = kaedey;
      if (fire[i][0] >= 600) {
        fire[i][0] = 325;
        fire[i][1] = 288;
      }
    }
  }
}
function firestart() {
  function firemove() {
    firestarter = setInterval(firego, 1000 / 60);
  }
  firemove();
}
firestart();

let keyw = false;
let keya = false;
let keys = false;
let keyd = false;
let mmoveing = 0;
function mitomove() {
  function mitomoveing() {
    mmoveing = setInterval(mito, 1000 / 60);
    mmoveing = setInterval(kaede, 1000 / 60);
  }
  mitomoveing();
}
mitomove();
document.addEventListener('keydown', (event) => {
  var keyName = event.key;
  if (keyName == 'w' || keyName == 'W') {
    keyw = true;
  } else if (keyName == 'a' || keyName == 'A') {
    keya = true;
  } else if (keyName == 's' || keyName == 'S') {
    keys = true;
  } else if (keyName == 'd' || keyName == 'D') {
    keyd = true;
  } else if (keyName == 'Shift') {
    for (let i = 0; i < fire.length; i++) {
      if (fire[i][0] == 325) {
        firestart_kaede.x[i] = kaedex;
        firestart_kaede.y[i] = kaedey;
        fire[i][0] = 326;
        i = fire.length;
      }
    }
    console.log(firestart_kaede);
  }
});
document.addEventListener('keyup', (event) => {
  var keyName = event.key;
  if (keyName == 'w' || keyName == 'W') {
    keyw = false;
  } else if (keyName == 'a' || keyName == 'A') {
    keya = false;
  } else if (keyName == 's' || keyName == 'S') {
    keys = false;
  } else if (keyName == 'd' || keyName == 'D') {
    keyd = false;
  } else if (keyName == 'Shift') {
    console.log(keyName);
  } else { }
});

//マウス
let clickok = true;
let mousepoint = {
  x: 300, y: 300
}
canvas[2].addEventListener('click', e => {
  //マウスの座標をカンバス内の座標と合わせる
  const rect = canvas[2].getBoundingClientRect();
  mousepoint = {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  }
  console.log(mousepoint);
  nowmove = 0;
})
