"use strict";
let rate = 0;
$(document).ready(function () {
  if (window.innerWidth * 16 >= window.innerHeight * 9) {
    $("#bace").css({ height: "100vh", width: "57vh" });
    rate = 1320 / window.innerHeight;
  } else {
    $("#bace").css({ height: "176vw", width: "100vw" });
    rate = 750 / window.innerWidth;
  }
});
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
const srcs = [["title.png"], ["home.png"], ["log.png"]];
const button = [["menu.png"]];
const icon = [["2.jpg"]];

let images = [];
for (let i in srcs) {
  images[i] = new Image();
  images[i].src = srcs[i][0];
}
let buttons = [];
for (let i in button) {
  buttons[i] = new Image();
  buttons[i].src = button[i][0];
}
let icons = [];
for (let i in icon) {
  icons[i] = new Image();
  icons[i].src = icon[i][0];
}

//イベントクラス
class Log {
  constructor(log) {
    this.log = log;
  }
}
class Event extends Log {
  constructor(log, elog, check) {
    super(log);
    this.elog = elog;
    this.check = check;
  }
}
class Way {
  constructor(name, far, step, dif) {
    this.name = name;
    this.far = far;
    this.step = step;
    this.dif = dif;
  }
}

//変数宣言
let seen = -1; //-1タイトル画面。0ステータス画面。1行先選択。2進行中。3アドバイス
let stats = [1, 1, 1, 1, 1, 1, 1, 1, 1];
let last_log = [];

//おつかい先
const way1 = new Way("コンビニ", 200, 10, 3);
const way_all = [way1];
let way_clear = [0];

//ログ内容
const n1 = new Log("スキップしてすすんだ。");

const e1 = new Event("石を飛び越えた。", "石につまづいて転んだ。", 0);

//処理系
let time = 0;
function plus_log() {
  //ログ追加
  //イベントかログか判定
  //イベントなら成功失敗判定
  //ログをlast_logに追加
  last_log.unshift([n1, time]);
  time = time+3;
  console.log(last_log);
}

//クリック
let point = 0;
canvas[2].addEventListener("click", (e) => {
  //マウスの座標をカンバス内の座標と合わせる
  const rect = canvas[2].getBoundingClientRect();
  point = {
    x: (e.clientX - rect.left) * rate,
    y: (e.clientY - rect.top) * rate,
  };
  if (point.y >= 1193) {
    //ページ間の移動
    if (point.x <= 250) {
      seen = 0;
    } else if (point.x <= 500) {
      seen = 1;
    } else if (point.x <= 750) {
      seen = 2;
    }
  }

  if (seen == -1) {
    //タイトル
    seen = 0;
    //TODO ゲーム一覧へのリンク
  } else if (seen == 0) {
    //ステータス画面
    //TODO アドバイス画面への移動
  } else if (seen == 1) {
    //行先選択
    //TODO 行き先リストスクロール
    //TODO 行き先選択
    //TODO 行き先確定ボタン
  } else if (seen == 2) {
    plus_log();//仮
    //進行中・ログ
    //TODO ログスクロール
  } else if (seen == 3) {
    //アドバイス
    //TODO アドバイス入力
    //TODO アドバイス確定
    //TODO アドバイス効果確認 どのステータスが上がるか教えてもらえる
  }
});

//画面の描写全部
const m_canvas = document.createElement("canvas");
m_canvas.width = 750;
m_canvas.height = 1320;
const c = m_canvas.getContext("2d");
function step() {
  c.font = "30px 'ＭＳ Pゴシック'";
  window.requestAnimationFrame(step);
  ctx = canvas[flip].getContext("2d");
  ctx.clearRect(0, 0, 750, 1320);
  c.clearRect(0, 0, 750, 1320);
  if (seen == -1) {
    //タイトル
    c.drawImage(images[0], 0, 0);
  } else if (seen == 0) {
    //ステータス
    c.drawImage(images[1], 0, 0);
  } else if (seen == 1) {
    //行先選択
    c.drawImage(images[2], 0, 0);
  } else if (seen == 2) {
    //進行中
    c.drawImage(images[2], 0, 0);
    for (let i = last_log.length; i--;) {
      let n = i*150;
      let t = time - last_log[i][1];
      c.fillText(t+"分前", 180, 330+n);
      c.fillText(last_log[i][0].log, 180, 380+n);
      c.fillText("「ええかんじや！」", 180, 420+n);
      c.drawImage(icons[0], 30, 300+n, 130, 130);
    }
  } else if (seen == 3) {
    //アドバイス
  }
  c.drawImage(buttons[0], 0, 1230);
  ctx.drawImage(m_canvas, 0, 0);
  canvas[1 - flip].style.visibility = "hidden";
  canvas[flip].style.visibility = "visible";
  flip = 1 - flip;
}
step();

//リスタート処理
function restart() {
  tweetDivided.innerHTML = "";
  PostDivided.innerHTML = "";
}

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
