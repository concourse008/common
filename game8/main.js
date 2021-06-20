"use strict";
//選択肢などデータ読み込み
const gamedata = document.createElement("script");
gamedata.src = "gamedata.js";
//var canvas = document.getElementById('maincanvas');
const canvas = {
  0: document.getElementById("canvas1"),
  1: document.getElementById("canvas2"),
  2: document.getElementById("canvas0"),
};
let flip = 0;
canvas[1 - flip].style.visibility = "hidden";
canvas[flip].style.visibility = "visible";
canvas[2].style.visibility = "visible";
flip = 1 - flip;
let ctx = canvas[flip].getContext("2d");
const ctx0 = canvas[2].getContext("2d");
const srcs = [["stage.png"], ["mito.png"], ["kaede2.png"], ["box.png"], ["bace.png"],["title.png"],["req.png"]];
const icon = [
  ["b_kaede.png"],
  ["b_unchi.png"],
  ["b_dush.png"],
  ["b_turn.png"],
  ["b_left.png"],
  ["b_ag.png"],
  ["b_right.png"],
];
const skill = [["unchi.png"], ["bigkaede.png"],["unchi_hit.png"],["mito_point.png"],["kaede_point.png"],
["round1.png"],["round2.png"],["round3.png"],["round4.png"],["gameset.png"]];

let images = [];
for (let i in srcs) {
  images[i] = new Image();
  images[i].src = srcs[i][0];
}
let icons = [];
for (let i in icon) {
  icons[i] = new Image();
  icons[i].src = icon[i][0];
}
let skills = [];
for (let i in skill) {
  skills[i] = new Image();
  skills[i].src = skill[i][0];
}

//変数
let block = [//ブロック
  [0, 1, 0, 1, 0, 1, 0],
  [1, 0, 1, 0, 1, 0, 1],
  [0, 1, 0, 1, 0, 1, 0],
];
let seen = 0;
let game_point = [0,0];//ミト・カエデ
let mito = { x: 190, y: 488, s: 0 };
let bar = 0; //反射インターバル0.03秒
let kaede = { x: 200, y: 470, a: 10, xs: 0, ys: 0, s: 0 }; //位置ｘｙ角度スピード
let kaede_skill = [10, 10, 3, 10, 10]; //反転・加速・うんち・メカクシ・アンチ
let kaede_skill_ok = [3, 6, 3, 8, 9];
let gamestop = 0;
let win = 0;
function reset(){//リセット
  kaede = { x: 210, y: 470, a: 10, xs: 130, ys: -130, s: 200 };
  kaede_skill = [10, 10, 3, 10, 10];
  mito.x = 190;
  block = [//ブロック
    [0, 1, 0, 1, 0, 1, 0],
    [1, 0, 1, 0, 1, 0, 1],
    [0, 1, 0, 1, 0, 1, 0],
  ];
  win = 0;
}
function skill_count_up() {
  for (let k = 5; k--;) {
    kaede_skill[k]++;
  }
}
//ラウンド演出
let round_dir = -420;
function round_count(){
  if(game_point[0] == 2 || game_point[1] == 2){//カエデ勝利
    if(win == 0){
    seen = 0;
    win = 1;
    tweet();
    }
  }else if(round_dir > 0){
    round_dir = round_dir - 7;
  }else if(round_dir > -20){
    round_dir = round_dir - 0.2;
  }else if(round_dir > -400){
    round_dir = round_dir - 7;
  }else if(round_dir <= -400 && round_dir != -420){
    gamestop = 0;
    round_dir = -420;
  }
}
//ミトポイント
let mito_get_point = -420;
function mito_point(){
  if(mito_get_point > 0){
    mito_get_point = mito_get_point - 7;
  }else if(mito_get_point > -20){
    mito_get_point = mito_get_point - 0.2;
  }else if(mito_get_point > -400){
    mito_get_point = mito_get_point - 7;
    if(mito_get_point <= -220 && mito_get_point >= -230){
      bigkaede = -300;
    }
  }else if(mito_get_point <= -400 && mito_get_point != -420){
    reset();
    game_point[0] = game_point[0]+1;
    mito_get_point = -420;
    round_dir = 400;
  }
}
//カエデポイント
let kaede_get_point = -420;
function kaede_point(){
  if(kaede_get_point > 0){
    kaede_get_point = kaede_get_point - 7;
  }else if(kaede_get_point > -20){
    kaede_get_point = kaede_get_point - 0.2;
  }else if(kaede_get_point > -400){
    kaede_get_point = kaede_get_point - 7;
    if(kaede_get_point <= -220 && kaede_get_point >= -230){
      bigkaede = -300;
    }
  }else if(kaede_get_point <= -400 && kaede_get_point != -420){
    reset();
    game_point[1] = game_point[1]+1;
    kaede_get_point = -420;
    round_dir = 400;
  }
}
//カエデ移動・反射
function movekae() {
  if (kaede.x >= 373 || kaede.x <= 22) {
    kaede.xs = -kaede.xs;
    skill_count_up();
  } else if (kaede.y >= 500 && gamestop == 0) {
    //TODO カエデポイント
    kaede_get_point = 400;
    gamestop = 1;
  } else if (kaede.y <= 108) {
    kaede.ys = -kaede.ys;
    skill_count_up();
  } else if (kaede.y >= 485 && bar == 0) {
    if (kaede.x >= mito.x + 7 && kaede.x <= mito.x + 33) {
      kaede.ys = -kaede.ys;
      if (mito.s > 0) {
        kaede.ys = kaede.ys - 50;
        kaede.xs = kaede.xs + 50;
      } else if (mito.s < 0) {
        kaede.ys = kaede.ys + 50;
        kaede.xs = kaede.xs - 50;
      }
    } else if (kaede.x >= mito.x - 20 && kaede.x < mito.x + 7) {
      kaede.xs = -130;
      kaede.ys = -130;
    } else if (kaede.x <= mito.x + 60 && kaede.x > mito.x + 33) {
      kaede.xs = 130;
      kaede.ys = -130;
    }
    bar = 10;
  } else if (bar != 0) {
    bar = bar - 1;
  }
  let v_size = Math.sqrt(kaede.xs ** 2 + kaede.ys ** 2);
  kaede.xs = (kaede.xs / v_size) * kaede.s;
  kaede.ys = (kaede.ys / v_size) * kaede.s;
  kaede.x = kaede.x + kaede.xs / 60;
  kaede.y = kaede.y + kaede.ys / 60;
  kaede.a = (Math.atan2(kaede.ys, kaede.xs) * 180) / Math.PI + 90;
  if (
    (mito.x >= 340 && mito.s <= 0) ||
    (mito.x <= 20 && mito.s >= 0) ||
    (mito.x < 340 && mito.x > 20)
  ) {
    mito.x = mito.x + mito.s;
  }
}
//カエデ加速・減速
let kaede_speed = [0, 0];//減速・加速
function kaede_speed_check() {
  if (kaede_speed[0] > 0 && kaede_speed[1] > 0) {
    kaede.s = 200;
    kaede_speed[0]--;
    kaede_speed[1]--;
  } else if (kaede_speed[0] > 0) {
    kaede.s = 100;
    kaede_speed[0]--;
  } else if (kaede_speed[1] > 0) {
    kaede.s = 400;
    kaede_speed[1]--;
  } else {
    kaede.s = 200;
  }
  if(gamestop == 1){
    kaede.s = 10;
  }
}
//ブロック衝突
function hit_block() {
  for (let i = 3; i--;) {
    for (let j = 7; j--;) {
      if (block[i][j] == 1) {
        if (
          kaede.x >= 30 + 50 * j - 9 &&
          kaede.x <= 30 + 40 + 50 * j + 9 &&
          kaede.y >= 150 + 30 * i - 9 &&
          kaede.y <= 165 + 30 * i + 9
        ) {
          kaede.ys = -kaede.ys;
          block[i][j] = 0;
          skill_count_up();
        }
      }
    }
  }
}
//ブロック残ってるか
function block_end(){
  let sum = block[0].reduce(function(a,b){
    return a+b;
  });
  let sum2 = block[1].reduce(function(a,b){
    return a+b;
  });
  let sum3 = block[2].reduce(function(a,b){
    return a+b;
  });
  if(sum + sum2 + sum3 + gamestop == 0){//ミト勝利
    mito_get_point = 400;
    kaede.s = 0;
    gamestop = 1;
  }
}
//ミト・うんち衝突
let unchi = [[0, 510],[0,510],[0,510]]; //X座標、Y座標
let unchi_hiting = 0;
function unchi_move() {
  for(let i = 3; i--;){
  if (unchi[i][1] < 510) {
    unchi[i][1] = unchi[i][1] + 2;
  }
}
}
function unchi_hit() {
  for(let i = 3; i--;){
  if (
    unchi[i][1] > 450 &&
    unchi[i][1] <= 490 &&
    mito.x >= unchi[i][0] - 40 &&
    mito.x < unchi[i][0] + 40
  ) {
    unchi_hiting = 120;
    unchi[i][1] = 510;
  }
  if (unchi_hiting > 0) {
    mito.s = 0;
    unchi_hiting--;
  }
}
}
//メカクシかえで
let bigkaede = 510;
function mekakusi() {
  if (bigkaede < 510) {
    bigkaede = bigkaede + 10;
  }
}

//クリック
let point = 0;
const ua = navigator.userAgent.toLowerCase(); //これは何？？
const isSP = /iphone|ipod|ipad|android/.test(ua);
const eventStart = isSP ? "touchstart" : "mousedown";
const eventEnd = isSP ? "touchend" : "mouseup";
const eventLeave = isSP ? "touchmove" : "mouseleave";
canvas[2].addEventListener(eventStart, (e) => {
  //マウスの座標をカンバスないの座標と合わせる
  const rect = canvas[2].getBoundingClientRect();
  point = {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top,
  };
  if (!point.x) {
    var touchObject = e.changedTouches[0];
    point = {
      x: touchObject.pageX - rect.left,
      y: touchObject.pageY - rect.top,
    };
  }
  //ゲームの状況による
  if (seen == 0) {
    //スタート画面
    if(point.x >= 100 && point.x < 290 && point.y >= 255 && point.y < 320){
      seen = 2;
      reset();
      round_dir = 400;
      gamestop = 1;
      game_point = [0,0];
      tweetDivided.innerHTML = '';
    }else if(point.x >= 100 && point.x < 290 && point.y >= 330 && point.y < 390){
      seen = 1;
      tweetDivided.innerHTML = '';
    }
  } else if (seen == 1) {
    //あそびかた画面
    seen = 0;
    tweet();
  } else if (seen == 2) {
    //対戦中
    //左右ミト移動
    if (point.x >= 10 && point.x < 90 && point.y >= 515 && point.y < 595) {
      mito.s = -5;
    } else if (point.x >= 310 && point.x < 390 && point.y >= 515 && point.y < 595
    ) {
      mito.s = 5;
    }
    //アンチグラビティーガード
    if (point.x >= 110 && point.x < 270 && point.y >= 515 && point.y < 595 && kaede_skill[4] >= 10) {
      kaede_skill[4] = 0;
      kaede.xs = -kaede.xs;
      kaede.ys = -kaede.ys;
    }
    //反転
    if (point.x >= 10 && point.x < 90 && point.y >= 5 && point.y < 85 && kaede_skill[0] >= 3) {
      kaede_skill[0] = 0;
      bar = 0;
      kaede.xs = -kaede.xs;
      kaede.ys = -kaede.ys;
    }
    //加速
    if (point.x >= 110 && point.x < 190 && point.y >= 5 && point.y < 85) {
      if (kaede_skill[1] >= 6 && kaede.s != 400) {
        kaede_skill[1] = 0;
        kaede_speed[1] = 30;
      }
    }
    //うんち
    if (point.x >= 210 && point.x < 290 && point.y >= 5 && point.y < 85) {
      for(let i = 3; i--;){
      if (kaede_skill[2] >= 3 && unchi[i][1] >= 510) {
        kaede_skill[2] = kaede_skill[2] - 3; //カウントリセット
        unchi[i][0] = kaede.x;
        unchi[i][1] = kaede.y;
        break;
      }}
    }
    //メカクシ
    if (point.x >= 310 && point.x < 390 && point.y >= 5 && point.y < 85) {
      if (kaede_skill[3] >= 8 && bigkaede >= 510) {
        kaede_skill[3] = 0;
        bigkaede = -300;
      }
    }
  }
});
canvas[2].addEventListener(eventEnd, (e) => {
  //マウスの座標をカンバス内の座標と合わせる
  const rect = canvas[2].getBoundingClientRect();
  point = {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top,
  };
  if (!point.x) {
    var touchObject = e.changedTouches[0];
    point = {
      x: touchObject.pageX - rect.left,
      y: touchObject.pageY - rect.top,
    };
  }
  //ゲームの状況による
  if (point.x >= 10 && point.x <= 90 && point.y >= 515 && point.y <= 595) {
    mito.s = 0;
  } else if (
    point.x >= 310 &&
    point.x <= 390 &&
    point.y >= 515 &&
    point.y <= 595
  ) {
    mito.s = 0;
  }
});
//キーボード操作
document.body.addEventListener('keydown',
    event => {
        if (event.key === 'a') {
          mito.s = -5;
        }
        if (event.key === 'd') {
          mito.s = 5;
        }
        if (event.key === 'w') {
          kaede_skill[4] = 0;
          kaede.xs = -kaede.xs;
          kaede.ys = -kaede.ys;
        }
        if (event.key === 'j') {
          kaede_skill[0] = 0;
          bar = 0;
          kaede.xs = -kaede.xs;
          kaede.ys = -kaede.ys;
        }
        if (event.key === 'i') {
          if (kaede_skill[1] >= 6 && kaede.s != 400) {
            kaede_skill[1] = 0;
            kaede_speed[1] = 30;
          }
        }
        if (event.key === 'k') {
          for(let i = 3; i--;){
          if (kaede_skill[2] >= 3 && unchi[i][1] >= 510) {
            kaede_skill[2] = kaede_skill[2] - 3; //カウントリセット
            unchi[i][0] = kaede.x;
            unchi[i][1] = kaede.y;
          }}
        }
        if (event.key === 'l') {
          if (kaede_skill[3] >= 8 && bigkaede >= 510) {
            kaede_skill[3] = 0;
            bigkaede = -300;
          }
        }
    });

    document.body.addEventListener('keyup',
    event => {
        if (event.key === 'a') {
          mito.s = 0;
        }
        if (event.key === 'd') {
          mito.s = 0;
        }
    });

//画面の描写全部
function step() {
  window.requestAnimationFrame(step);
  ctx = canvas[flip].getContext("2d");
  ctx.clearRect(0, 0, 400, 800);
  ctx.drawImage(images[0], 10, 90);
  //ゲームセット判定
  block_end();
  //スキル判定・表示
  unchi_move();
  unchi_hit();
  mekakusi();
  for(let i =3; i--;){
  ctx.drawImage(skills[0], unchi[i][0], unchi[i][1]);
  }
  kaede_speed_check();
  //ミト表示
  ctx.drawImage(images[1], mito.x, mito.y);
  //カエデ表示
  hit_block();
  movekae();
  ctx.save();
  ctx.translate(kaede.x, kaede.y);
  ctx.rotate((kaede.a / 180) * Math.PI);
  ctx.drawImage(images[2], -12, -12);
  ctx.restore();
  //ブロック表示
  for (let i = 3; i--;) {
    for (let j = 7; j--;) {
      if (block[i][j] == 1) {
        ctx.drawImage(images[3], 30 + 50 * j, 150 + 30 * i);
      }
    }
  }
  //うんちヒット
  if(unchi_hiting > 0){
    ctx.drawImage(skills[2],mito.x,mito.y);
  }
  //メカクシもみじ
  ctx.drawImage(skills[1], 10, bigkaede);
  //アイコン類
  for (let i = 4; i--;) {
    ctx.drawImage(icons[i], 310 - 100 * i, 5);
  }
  for (let i = 3; i--;) {
    let ub = [310, 120, 10];
    ctx.drawImage(icons[6 - i], ub[i], 515);
  }
  //スキルカウント
  ctx.save();
  ctx.font = "80px 'Impact'";
  ctx.lineWidth = "4";
  ctx.lineJoin = "miter";
  ctx.miterLimit = "5"
  for (let i = 4; i--;) {
    if (kaede_skill[i] >= kaede_skill_ok[i]) {
    } else {
      ctx.fillText(kaede_skill_ok[i] - kaede_skill[i], 30 + 100 * i, 77);
    }
  }
  if (kaede_skill[4] >= kaede_skill_ok[4]) {
  } else {
    ctx.fillText(kaede_skill_ok[4] - kaede_skill[4], 180, 585);
  }
  ctx.restore();
  //フタ
  ctx.drawImage(images[4], 0, 0);
  //ポイント
  mito_point();
  ctx.drawImage(skills[3],mito_get_point,280);
  kaede_point();
  ctx.drawImage(skills[4],kaede_get_point,280);
  round_count();
  ctx.drawImage(skills[game_point[0]+game_point[1]+5],round_dir,280);
  //タイトル
  if(seen==0){
    if(game_point[0] == 2 || game_point[1] == 2){
      ctx.drawImage(skills[9],0,0);
    }else{
      ctx.drawImage(images[5],0,0);
    }
  }else if(seen ==1){
    ctx.drawImage(images[6],0,0);
  }
  //
  canvas[1 - flip].style.visibility = "hidden";
  canvas[flip].style.visibility = "visible";
  flip = 1 - flip;
}
step();

//ツイートボタン
const tweetDivided = document.getElementById("tweet-area");
function tweet() {
  while (tweetDivided.firstChild) {
    tweetDivided.removeChild(tweetDivided.firstChild);
  }
  const anchor = document.createElement("a");
  const hrefValue =
    "https://twitter.com/intent/tweet?button_hashtag=" +
    encodeURIComponent("ミトカエブロック") +
    "&ref_src=twsrc%5Etfw";
  anchor.setAttribute("herf", hrefValue);
  anchor.className = "twitter-hashtag-button";
  anchor.setAttribute('data-text', '今度のミトとカエデはブロック崩しで勝負や！　#ミトカエブロック');
  anchor.setAttribute("data-size", "large");
  anchor.setAttribute(
    "data-url",
    "https://concourse008.github.io/common/game8/"
  );
  anchor.innerText = "Tweet #ミトカエブロック";
  const script = document.createElement("script");
  script.setAttribute("src", "https://platform.twitter.com/widgets.js");
  tweetDivided.appendChild(script);
  tweetDivided.appendChild(anchor);
}
tweet();