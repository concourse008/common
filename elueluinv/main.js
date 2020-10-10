'use strict';
const game0Divided = document.getElementById('game-area0');
const game1Divided = document.getElementById('game-area1');
let op = true;
let result = false;
let point = 0;
let time = 0;
let x = 0;
let y = 0;
let my_y = 190;
let shot_x = 400;
let shot_y = 0;
//残りインベーダー
let inv_all = [];
let no = 5;
for (let i = 0; i < 9; i++) {
  inv_all[i] = [1, 1, 1, 1, 1];
}

//画像読み込み
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
const srcs = [//画像一覧
  ['back.png', 0, 0],
  ['inv.png', 0, 0],
  ['me.png', 0, 0],
  ['shot.png', 0, 0],
  ['e_shot.png', 0, 0]
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
        ctx.drawImage(images[j], srcs[j][1], srcs[j][2]);
      }
    }
    loadedCount++;
  }, false);
}


//クリック
let clickok = true;
let clickpoint = 0;
canvas[2].addEventListener('click', e => {
  //マウスの座標をカンバス内の座標と合わせる
  const rect = canvas[2].getBoundingClientRect();
  clickpoint = {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  }
  if (op) {
    start();
    op = false;
  }
})
canvas[2].addEventListener('mousedown', e => {
  //マウスの座標をカンバス内の座標と合わせる
  const rect = canvas[2].getBoundingClientRect();
  clickpoint = {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  }
  if (clickpoint.x >= 300) {
    my_y = my_y + 3;
  } else if (clickpoint.x <= 100) {
    my_y = my_y - 3;
  }
})

//敵の移動
let count = 0;
let go_right = true;
let inv_speed = [30, 27, 24, 20, 15, 10, 6, 2, 1];
let inv_faze = 0;
let inv_top = 0;
let inv_bot = 0;
function inv() {
  if (count >= inv_speed[inv_faze] && go_right) {
    if (y == 30 + inv_bot * 36) {
      go_right = !go_right;
      x = x - 13;//８回の折り返しで一番下、９でゲームオーバー
    } else {
      y = y + 6;
    }
    count = 0;
  } else if (count >= inv_speed[inv_faze] && !go_right) {
    if (y == 0 - inv_top * 36) {
      go_right = !go_right;
      x = x - 13;
    } else {
      y = y - 6;
    }
    count = 0;
  } else {
    count++;
  }
}
let wipe = 0;
let wipe_arr = [1, 1, 1, 1, 1, 1, 1, 1, 1]
function inv_speedup(id) {//敵の加速
  inv_faze = 0;
  wipe = 0;
  inv_bot = 0;
  inv_top = 0;
  for (let j = 0; j < 5; j++) {
    if (inv_all[id][j] == 0) {
      wipe = wipe + 1;
    }
  }
  if (wipe == 5) {
    wipe_arr[id] = 0;
  }
  console.log(wipe_arr);
  for (let i = 0; wipe_arr[i] == 0; i++) {
    inv_faze = inv_faze + 1;
    inv_top = inv_top + 1;
    console.log('b');
  }
  for (let m = 0; wipe_arr[8 - m] == 0; m++) {
    inv_faze = inv_faze + 1;
    inv_bot = inv_bot + 1;
    console.log('a');
  }
}
//エルエルの移動
const elelspeed = 3;
function elel() {
  if (keyup && my_y >= 33) {
    my_y = my_y - elelspeed;
  }
  if (keydown && my_y <= 338) {
    my_y = my_y + elelspeed;
  }
}
//ショットの移動
const shotspeed = 10;
function shot() {
  if (shot_x >= 400) {
  } else if (shot_x >= 40) {
    shot_x = shot_x + shotspeed;
  }
}
//当たり判定：水→火
function ext() {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 5; j++) {
      if (inv_all[i][j] == 1) {
        if (shot_x + 10 >= x + j * 26 + 237 && shot_x + 10 <= x + j * 26 + 255 && shot_y + 3 >= y + i * 35 + 32 && shot_y + 3 <= y + i * 35 + 59) {
          inv_all[i][j] = 0;
          shot_x = 400;
          inv_speedup(i);
        }
      }
    }
  }
}
//敵からの攻撃
let att_3 = [[400, 0], [400, 0], [400, 0]];
function att() {
  let i = Math.floor(Math.random() * 9);
  if (wipe_arr[i] == 1) {
    if (att_3[0][0] == 400) {
      att_shot(0, i);
    } else if (att_3[1][0] == 400) {
      att_shot(1, i);
    } else if (att_3[2][0] == 400) {
      att_shot(2, i);
    }
  }
  for (let j = 0; j < att_3.length; j++) {
    if (att_3[j][0] <= 0) {
      att_3[j][0] = 400;
    } else if (att_3[j][0] != 400) {
      att_3[j][0] = att_3[j][0] - 3;
    }
  }
}
function att_shot(id, line) {
  for (let i = 0; i < 5; i++) {
    if (inv_all[line][i] == 1) {
      att_3[id][0] = x + i * 26 + 237;
      att_3[id][1] = y + line * 35 + 32;
      break;
    }
  }
}
//敵の攻撃の当たり判定
let gameover = false;
function e_hit() {
  //壁の当たり判定
  //エルエルの当たり判定
  for (let i = 0; i < att_3.length; i++) {
    if (att_3[i][0] >= 50 && att_3[i][0] <= 55 && att_3[i][1] >= my_y && att_3[i][1] <= my_y + 30) {
      att_3[i][0] = 400;
      gameover = true;
    }
  }
}
let inv_moving = 0;
function inv_start() {//繰り返し処理
  function inv_move() {
    inv_moving = setInterval(inv, 1000 / 30);
    inv_moving = setInterval(elel, 1000 / 30);
    inv_moving = setInterval(ext, 1000 / 30);
    inv_moving = setInterval(shot, 1000 / 30);
    inv_moving = setInterval(att, 1000 / 30);
    inv_moving = setInterval(e_hit, 1000 / 30);
  }
  inv_move();
}

//自機移動
let keyup = false;
let keydown = false;
document.addEventListener('keydown', (event) => {
  var keyName = event.key;
  if (keyName == 'w' || keyName == 'a') {
    keyup = true;
  } else if (keyName == 's' || keyName == 'd') {
    keydown = true;
  } else if (keyName == ' ' && shot_x >= 400) {
    shot_x = 40;
    shot_y = my_y + 12;
  }
});
document.addEventListener('keyup', (event) => {
  var keyName = event.key;
  if (keyName == 'w' || keyName == 'a') {
    keyup = false;
  } else if (keyName == 's' || keyName == 'd') {
    keydown = false;
  } else { }
});

//画面の描写
function step() {
  window.requestAnimationFrame(step);
  ctx = canvas[flip].getContext('2d');
  ctx.clearRect(0, 0, 400, 400);//画面初期化
  ctx.drawImage(images[0], 0, 0);//背景表
  for (let i = 0; i < 9; i++) {//インベーダーの表示
    for (let j = 0; j < 5; j++) {
      if (inv_all[i][j] == 1) {
        ctx.drawImage(images[1], x + j * 26 + 237, y + i * 35 + 32);
      }
    }
  }
  ctx.drawImage(images[3], shot_x, shot_y);//水ショット
  ctx.drawImage(images[2], 23, my_y);
  for (let k = 0; k < att_3.length; k++) {
    ctx.drawImage(images[4], att_3[k][0], att_3[k][1]);//敵ショット
  }
  if(gameover){
    ctx.font = "60px sans-serif";
    ctx.fillStyle = ("white");
    ctx.fillText("gane over", 60, 190);
  }
  canvas[1 - flip].style.visibility = 'hidden';
  canvas[flip].style.visibility = 'visible';
  flip = 1 - flip;
}


//開始終了処理
function start() {
  step();
  inv_start();
}
function end() {
  clickok = false;
  result = true;
  tweet();
}
function restart() {
  result = false;
  clickok = true;
  tweetDivided.innerHTML = '';
}

//ツイートボタン
const tweetDivided = document.getElementById('tweet-area');
function tweet() {
  while (tweetDivided.firstChild) {
    tweetDivided.removeChild(tweetDivided.firstChild);
  }
  const anchor = document.createElement('a');
  const hrefValue = 'https://twitter.com/intent/tweet?button_hashtag=' + encodeURIComponent('にせガクブーメラン') + '&ref_src=twsrc%5Etfw';
  anchor.setAttribute('herf', hrefValue);
  anchor.className = 'twitter-hashtag-button';
  anchor.setAttribute('data-text', 'ブーメランを使い、' + point + 'ポイントの風船を撃墜した。悪い心を持つが仲間思いの一面も。髪の毛は銅板でできているらしい。 #にせガクのブーメラン');
  anchor.setAttribute('data-size', "large");
  anchor.setAttribute('data-url', "https://concourse008.github.io/nisegaku/index.html");
  anchor.innerText = 'Tweet #にせガクのブーメラン';
  const script = document.createElement('script');
  script.setAttribute('src', 'https://platform.twitter.com/widgets.js');
  tweetDivided.appendChild(script);
  tweetDivided.appendChild(anchor);
}