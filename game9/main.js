"use strict";
$(document).ready(function(){
  if(window.innerWidth >= window.innerHeight){
    $('#bace').css({'height':'100vh','width':'57vh'});
  }else{
    $('#bace').css({'height':'176vw','width':'100vw'});
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
const srcs = [
  ["title.png"],
  ["home.png"],
  ["log.png"]
];
const button = [
  ["button1.png"]
]

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

//変数宣言
let seen = -1;//-1タイトル画面。0ステータス画面。1行先選択。2進行中。3アドバイス
let stats = [1,1,1,1,1,1,1,1,1,1];

//クリックでジャンプする
let point = 0;
let rate = 0;
canvas[2].addEventListener("click", (e) => {
  //マウスの座標をカンバスないの座標と合わせる
  const rect = canvas[2].getBoundingClientRect();
  rate = 750 / window.innerWidth;
  point = {
    x: (e.clientX - rect.left)*rate,
    y: (e.clientY - rect.top)*rate,
  };
  if(seen==-1){
    seen = 0;
  }else if(seen=0){

  }
});

//画面の描写全部
function step() {
  ctx.font = "40px 'ＭＳ Pゴシック'";
  window.requestAnimationFrame(step);
  ctx = canvas[flip].getContext("2d");
  ctx.clearRect(0, 0, 750, 1275);
  if(seen==-1){//タイトル
    ctx.drawImage(images[0],0,0);
  }else if(seen==0){//ステータス
    ctx.drawImage(images[1],0,0);
  }else if(seen==1){//行先選択

  }else if(seen==2){//進行中

  }else if(seen==3){//アドバイス

  }
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
