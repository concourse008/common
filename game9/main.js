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
const srcs = [["title.png"], ["home.png"], ["log.png"], ["way.png"], ["1.png"]];
const button = [["menu.png"],["go.png"]];
const icon = [["nomal_k.png"],["good_k.png"],["bad_k.png"]];
const stage = [["stage1.png"]];

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
let stages = [];
for (let i in stage){
  stages[i] = new Image();
  stages[i].src = stage[i][0];
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
let stage_select = false;
let stage_start = false;
let scrol = [0,0];

//おつかい先
const way1 = new Way("コンビニ", 200, 10, 3);
const way_all = [way1];
let way_clear = [0];

//ログ内容
const n1 = new Log("スキップしてすすんだ。\n「ええかんじや！」");

const e1 = new Event("石を飛び越えた。\n「ぴょーん！」", "石につまづいて転んだ。\n「ぶえっ」", 0);

//処理系
let time = 0;
let life = 3;
function plus_log() {//ログ
  let new_log = 0;
  let eve = Math.floor(Math.random()*3+1);
  //ログ追加
  if(eve == 1){
    new_log = e1;
  }else{
    new_log = n1;
  }  //イベントかログか判定
  if(new_log.elog){//イベントの場合
  //イベントなら成功失敗判定
  let dice = Math.floor(Math.random()*6+1);
  if (stats[new_log.check]+dice >= 4){
    last_log.unshift([new_log.log,time,1]);
  }else{
    last_log.unshift([new_log.elog,time,2]);
    life = life - 1;
  }
  }else{//ノーマルの場合
    last_log.unshift([new_log.log,time,0]);
  }
  time = time+eve;
  if(life == 0){
    last_log.unshift(["へこたれてしまった！\n「あかんわー……」",time,2]);
    clearInterval(gogo);
    stage_start = false;
    life = 3;
  }
  if(time == 51){
    last_log.unshift(["目的地に到着！！\n「やったー！」",time,1]);
    clearInterval(gogo);
    stage_start = false;
    life = 3;
  }
  if(scrol[1] != 0){
    scrol[1] = scrol[1] -150;
  }
}
let gogo = 0;


//クリック

let point = 0;
const ua = navigator.userAgent.toLowerCase(); //これは何？？
const isSP = /iphone|ipod|ipad|android/.test(ua);
const eventStart = isSP ? "touchstart" : "mousedown";
const eventEnd = isSP ? "touchend" : "mouseup" ;
const eventLeave = isSP ? "touchmove" : "mousemove";
canvas[2].addEventListener(eventStart, (e) => {
  //マウスの座標をカンバス内の座標と合わせる
  const rect = canvas[2].getBoundingClientRect();
  point = {
    x: (e.clientX - rect.left) * rate,
    y: (e.clientY - rect.top) * rate,
  };
  if (!point.x) {
    var touchObject = e.changedTouches[0];
    point = {
      x: (touchObject.pageX - rect.left)*rate,
      y: (touchObject.pageY - rect.top)*rate,
    };
  }
  if (point.y >= 1193) {
    //ページ間の移動
    if (point.x <= 250) {
      seen = 0;
    } else if (point.x <= 500) {
      seen = 1;
    } else if (point.x <= 750) {
      seen = 2;
      scrol[1] = 0;
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
    if(point.y >= 300 && point.y<480 && !stage_start){
      stage_select = true;
    }
    //TODO 行き先確定ボタン
    if(point.x >= 540 && point.x < 720 && point.y >= 950 && point.y < 1185 && stage_select){
      seen = 2;
      stage_start = true;
      stage_select = false;
      last_log = [];
      time = 0;
      gogo = setInterval(plus_log,10000/4);
    }
  } else if (seen == 2) {
    //進行中・ログ
    //TODO ログスクロール
    scrol[0] = point.y;
    scrol_on = true;
  } else if (seen == 3) {
    //アドバイス
    //TODO アドバイス入力
    //TODO アドバイス確定
    //TODO アドバイス効果確認 どのステータスが上がるか教えてもらえる
  }
  //console.log(Math.floor(point.x),Math.floor(point.y));
});
//スクロール
let scrol_on = false;
canvas[2].addEventListener(eventLeave,(e) => {
    //マウスの座標をカンバス内の座標と合わせる
    const rect = canvas[2].getBoundingClientRect();
    point = {
      x: (e.clientX - rect.left) * rate,
      y: (e.clientY - rect.top) * rate,
    };
    if (!point.x) {
      var touchObject = e.changedTouches[0];
      point = {
        x: (touchObject.pageX - rect.left)*rate,
        y: (touchObject.pageY - rect.top)*rate,
      };
    }
     if(seen == 2 && scrol_on ){
      //スクロール量計算
      let ss = 0;
      if(last_log.length < 7){
        ss = scrol[1];
      }else{
        ss = last_log.length * 150 - 900 + scrol[1];
      }
      if(scrol[1] >= 30 && point.y - scrol[0] > 0){

      }else if(scrol[1]>20 && point.y - scrol[0] > 0){
        scrol[1] = scrol[1] + (point.y - scrol[0]) / 10;
      }else if(scrol[1]>10 && point.y - scrol[0] > 0){
        scrol[1] = scrol[1] + (point.y - scrol[0]) / 5;
      }else if(scrol[1]>0 && point.y - scrol[0] > 0){
        scrol[1] = scrol[1] + (point.y - scrol[0]) / 2;
      }else if(ss <= -30 && point.y - scrol[0] < 0){

      }else if(ss <= -20 && point.y - scrol[0] < 0){
        scrol[1] = scrol[1] + (point.y - scrol[0]) / 10;
      }else if(ss <= -10 && point.y - scrol[0] < 0){
        scrol[1] = scrol[1] + (point.y - scrol[0]) / 5;
      }else if(ss < 0 && point.y - scrol[0] < 0){
        scrol[1] = scrol[1] + (point.y - scrol[0]) / 2;
      }else{
        scrol[1] = scrol[1] + point.y - scrol[0];
      }
      scrol[0] = point.y;
    }
})
canvas[2].addEventListener(eventEnd,(e)=>{
  scrol_on = false;
  if(scrol[1] > 0){
    scrol[1] = 0;
  }else if(last_log.length < 7 && scrol[1] <= 0){
    scrol[1] = 0;
  }else if(last_log.length >= 7 && -scrol[1] > last_log.length * 150 - 900){
    scrol[1] = last_log.length*(-150) + 900;
  }
})

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
    c.drawImage(buttons[0], 0, 1230);
  } else if (seen == 1) {
    //行先選択
    c.drawImage(images[2], 0, 0);
    c.drawImage(stages[0],0,300);
    c.fillText("目標：ピヨチキ（コンビニ）", 280, 350);
    c.fillText("難度：★☆☆☆☆", 280, 400);
    c.fillText("距離：200メートル", 280, 450);
    if(stage_select){
      c.drawImage(buttons[1],540,950);
    }
    c.drawImage(images[3],0,0);
    c.drawImage(buttons[0], 0, 1230);
  } else if (seen == 2) {
    //進行中
    c.drawImage(images[2], 0, 0);
    for (let i = last_log.length; i--;) {
      let n = i*150;
      let t = time - last_log[i][1];
      c.fillText(t+"分前", 620, 340 + n + scrol[1]);
      for (let lines = (String(last_log[i][0])).split("\n"), j = 0, l = lines.length; l > j; j++) {
        let line = lines[j];
        let addY = 40 *j;
        c.fillText(line, 180, 370 + n + addY + scrol[1]);
      }
      c.drawImage(icons[last_log[i][2]], 30, 300 + n + scrol[1]);
    }
    c.drawImage(images[3],0,0);
    c.drawImage(buttons[0], 0, 1230);
    c.drawImage(images[4], 100 + last_log.length * 23, 170);
  } else if (seen == 3) {
    //アドバイス
  c.drawImage(buttons[0], 0, 1230);
  }
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
