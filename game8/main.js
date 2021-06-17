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
const srcs = [["stage.png"], ["mito.png"], ["kaede2.png"], ["box.png"]];
const icon = [
  ["b_kaede.png"],
  ["b_turn.png"],
  ["b_unchi.png"],
  ["b_dush.png"],
  ["b_left.png"],
  ["b_ag.png"],
  ["b_right.png"],
];

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

//変数
let mito = { x: 190, y: 488, s: 0 };
let bar = 0;
let kaede = { x: 200, y: 300, a: 10, xs: 130, ys: -130, s: 200 }; //位置ｘｙ角度スピード

//カエデ移動・反射
function movekae() {
  if (kaede.x >= 373 || kaede.x <= 22) {
    kaede.xs = -kaede.xs;
  } else if (kaede.y >= 500) {
    //TODO カエデポイント
    kaede.x = kaede.y = 200;
  } else if (kaede.y <= 108) {
    kaede.ys = -kaede.ys;
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

//ブロック
let block = [
  [0, 1, 0, 1, 0, 1, 0],
  [1, 0, 1, 0, 1, 0, 1],
  [0, 1, 0, 1, 0, 1, 0],
];
//ブロック衝突
function hit_block() {
  for (let i = 3; i--; ) {
    for (let j = 7; j--; ) {
      if (block[i][j] == 1) {
        if (
          kaede.x >= 30 + 50 * j - 9 &&
          kaede.x <= 30 + 40 + 50 * j + 9 &&
          kaede.y >= 150 + 30 * i - 9 &&
          kaede.y <= 165 + 30 * i + 9
        ) {
          kaede.ys = -kaede.ys;
          block[i][j] = 0;
        } /* else if (
          (30 + 50 * j - kaede.x) ** 2 + (150 - 8 + 30 * i - kaede.y) ** 2 <=
            12 ** 2 ||
          (70 + 50 * j - kaede.x) ** 2 + (150 - 8 + 30 * i - kaede.y) ** 2 <=
            12 ** 2
        ) {
          console.log(0);
          kaede.xs = -kaede.xs;
          block[i][j] = 0;
        }*/
      }
    }
  }
}

//クリック
let point = 0;
const ua = navigator.userAgent.toLowerCase(); //これは何？？
const isSP = /iphone|ipod|ipad|android/.test(ua);
const eventStart = isSP ? "touchstart" : "mousedown";
const eventEnd = isSP ? "touchend" : "mouseup";
const eventLeave = isSP ? "touchmove" : "mouseleave";
canvas[2].addEventListener("touchstart", (e) => {
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
  if (point.x >= 10 && point.x < 90 && point.y >= 515 && point.y < 595) {
    mito.s = -5;
  } else if (
    point.x >= 310 &&
    point.x < 390 &&
    point.y >= 515 &&
    point.y < 595
  ) {
    mito.s = 5;
  }
  console.log(point.x);
  console.log(point.y);
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
  console.log("離れた");
});

//画面の描写全部
function step() {
  window.requestAnimationFrame(step);
  ctx = canvas[flip].getContext("2d");
  ctx.clearRect(0, 0, 400, 800);
  ctx.drawImage(images[0], 10, 90);
  for (let i = 4; i--; ) {
    ctx.drawImage(icons[i], 310 - 100 * i, 5);
  }
  for (let i = 3; i--; ) {
    let ub = [310, 120, 10];
    ctx.drawImage(icons[6 - i], ub[i], 515);
  }
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
  for (let i = 3; i--; ) {
    for (let j = 7; j--; ) {
      if (block[i][j] == 1) {
        ctx.drawImage(images[3], 30 + 50 * j, 150 + 30 * i);
      }
    }
  }
  //
  canvas[1 - flip].style.visibility = "hidden";
  canvas[flip].style.visibility = "visible";
  flip = 1 - flip;
}
step();

//ハイスコア
let totalscore = 0;
function getup() {
  localStorage.setItem("score", 0);
  totalscore = Number(localStorage.getItem("score"));
}
function setup() {
  totalscore = Number(localStorage.getItem("score"));
}
if (!localStorage.getItem("score")) {
  //ストレージなし
  getup();
} else {
  //ストレージあり
  setup();
}

//ツイートボタン
const tweetDivided = document.getElementById("tweet-area");
function tweet() {
  while (tweetDivided.firstChild) {
    tweetDivided.removeChild(tweetDivided.firstChild);
  }
  const anchor = document.createElement("a");
  const hrefValue =
    "https://twitter.com/intent/tweet?button_hashtag=" +
    encodeURIComponent("カエデログ") +
    "&ref_src=twsrc%5Etfw";
  anchor.setAttribute("herf", hrefValue);
  anchor.className = "twitter-hashtag-button";
  anchor.setAttribute(
    "data-text",
    "ケーキの上を" +
      way +
      "センチメートル走り抜けました！　" +
      coment +
      "　#ミトダッシュ"
  );
  anchor.setAttribute("data-size", "large");
  anchor.setAttribute(
    "data-url",
    "https://concourse008.github.io/mitodash/index.html"
  );
  anchor.innerText = "Tweet #カエデログ";
  const script = document.createElement("script");
  script.setAttribute("src", "https://platform.twitter.com/widgets.js");
  tweetDivided.appendChild(script);
  tweetDivided.appendChild(anchor);
}
