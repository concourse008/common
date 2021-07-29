"use strict";
let rate = 0;
$(document).ready(function () {
  if (window.innerWidth * 16 >= window.innerHeight * 9) {
    $("#bace").css({ height: "100vh", width: "57vh" });
    rate = 1320 / window.innerHeight;
    $("#input-area").css({ height: "50vh", width: "28.5vh" });
  } else {
    $("#bace").css({ height: "176vw", width: "100vw" });
    rate = 750 / window.innerWidth;
    $("#input-area").css({ height: "88vw", width: "50vw" });
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
  ["log.png"],
  ["way.png"],
  ["1.png"],
  ["advice.png"],
];
const button = [["menu.png"], ["go.png"], ["advice_b.png"], ["mito.png"],["fukidasi.png"]];
const icon = [["nomal_k.png"], ["good_k.png"], ["bad_k.png"]];
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
for (let i in stage) {
  stages[i] = new Image();
  stages[i].src = stage[i][0];
}



//変数宣言
let seen = -1; //-1タイトル画面。0ステータス画面。1行先選択。2進行中。3アドバイス
let ad_seen = 0; //０通常。１アドバイス後。２相談
let stats = [0, 0, 0, 0, 0, 0, 0, 0, 0];
let stats_cap = [0,1,4,7,11,17,23,32,46,67];
let stats_name = [
  "勇気",
  "優しさ",
  "元気",
  "幸運",
  "賢さ",
  "パワー",
  "素早さ",
  "可愛さ",
  "ジャンプ力",
];
let last_log = [];
let stage_select = false;
let stage_start = false;
let scrol = [0, 0];

//おつかい先
const way1 = new Way("コンビニ", 200, 10, 3);
const way_all = [way1];
let way_clear = [0];

//ログ内容
const n1 = new Log("スキップしてすすんだ。\n「ええかんじや！」");

const e1 = new Event(
  "石を飛び越えた。\n「ぴょーん！」",
  "石につまづいて転んだ。\n「ぶえっ」",
  0
);

//処理系
let time = 0;
let life = 3;
function plus_log() {
  //ログ
  let new_log = 0;
  let eve = Math.floor(Math.random() * 3 + 2);
  //ログ追加
  if (eve == 4) {
    new_log = event1[Math.floor(Math.random() * event1.length)];
  } else {
    new_log = nomal_log[Math.floor(Math.random() * nomal_log.length)];
  } //イベントかログか判定
  if (new_log.elog) {
    //イベントの場合
    //イベントなら成功失敗判定
    let dice = Math.floor(Math.random() * 6 + 1);
    if (stats[new_log.check] + dice >= 4) {
      last_log.unshift([new_log.log, time, 1]);
    } else {
      last_log.unshift([new_log.elog, time, 2]);
      life = life - 1;
    }
  } else {
    //ノーマルの場合
    last_log.unshift([new_log.log, time, 0]);
  }
  time = time + eve;
  if (life == 0) {
    last_log.unshift(["へこたれてしまった！\n「あかんわー……」", time, 2]);
    clearInterval(gogo);
    stage_start = false;
    life = 3;
  } else if (time >= 51) {
    last_log.unshift(["目的地に到着！！\n「やったー！」", time, 1]);
    clearInterval(gogo);
    stage_start = false;
    life = 3;
  }
  if (scrol[1] != 0) {
    scrol[1] = scrol[1] - 150;
  }
}
let gogo = 0;

//アドバイス入力フォーム
let advice = 0;
let advice_point = 0;
let advice_arr = [];
function post(e) {
  let keep = [advice_arr, advice_point, advice];
  let arr = [1, 1, 1, 2, 2, 2, 3];
  advice_arr = [];
  advice_point = 0;
  advice = 0;
  advice = window.prompt("アドバイスを入力", "");
  if (advice != "" && advice != null) {
    //アドバイス成立
    for (let i = 0; i < advice.length; ++i) {
      advice_point = advice_point + advice.charCodeAt(i);
    }
    advice_arr.push(advice_point % 9);
    advice_arr.push(arr[advice_point % 7]);
    advice_arr.push(Math.floor(advice_point / 10) % 9);
    advice_arr.push(arr[Math.floor(advice_point / 10) % 7]);
    advice_arr.push(Math.floor(advice_point / 100) % 9);
    advice_arr.push(arr[Math.floor(advice_point / 100) % 7]);
    console.log(advice_point);
    console.log(advice_arr);
    if(e == 0){
      ad_seen = 1;
      stats[advice_arr[0]] = stats[advice_arr[0]] + advice_arr[1];
      stats[advice_arr[2]] = stats[advice_arr[2]] + advice_arr[3];
      stats[advice_arr[4]] = stats[advice_arr[4]] + advice_arr[5];
    }else if(e == 1){
      ad_seen = 2;
    }
  } else {
    advice_arr = keep[0];
    advice_point = keep[1];
    advice = keep[2];
  }
}

//クリック
let point = 0;
const ua = navigator.userAgent.toLowerCase(); //これは何？？
const isSP = /iphone|ipod|ipad|android/.test(ua);
const eventStart = isSP ? "touchstart" : "mousedown";
const eventEnd = isSP ? "touchend" : "mouseup";
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
      x: (touchObject.pageX - rect.left) * rate,
      y: (touchObject.pageY - rect.top) * rate,
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
    if (point.x >= 500 && point.x < 720 && point.y >= 950 && point.y < 1200) {
      seen = 3;
    }
  } else if (seen == 1) {
    //行先選択
    //TODO 行き先リストスクロール
    //TODO 行き先選択
    if (point.y >= 300 && point.y < 480 && !stage_start) {
      stage_select = true;
    }
    //TODO 行き先確定ボタン
    if (
      point.x >= 540 &&
      point.x < 720 &&
      point.y >= 950 &&
      point.y < 1185 &&
      stage_select
    ) {
      seen = 2;
      stage_start = true;
      stage_select = false;
      last_log = [];
      time = 0;
      gogo = setInterval(plus_log, 10000 / 4);
    }
  } else if (seen == 2) {
    //進行中・ログ
    //TODO ログスクロール
    scrol[0] = point.y;
    scrol_on = true;
  } else if (seen == 3) {
    //アドバイス
    //TODO アドバイス入力
    if(point.x >= 90 && point.x < 660 && point.y >= 620 && point.y < 770){
      post(0);
    }else if(point.x >= 520 && point.x < 735 && point.y >= 800 && point.y < 1000){
      post(1);
    }
  }
  //console.log(Math.floor(point.x),Math.floor(point.y));
});
//スクロール
let scrol_on = false;
canvas[2].addEventListener(eventLeave, (e) => {
  //マウスの座標をカンバス内の座標と合わせる
  const rect = canvas[2].getBoundingClientRect();
  point = {
    x: (e.clientX - rect.left) * rate,
    y: (e.clientY - rect.top) * rate,
  };
  if (!point.x) {
    var touchObject = e.changedTouches[0];
    point = {
      x: (touchObject.pageX - rect.left) * rate,
      y: (touchObject.pageY - rect.top) * rate,
    };
  }
  if (seen == 2 && scrol_on) {
    //スクロール量計算
    let ss = 0;
    if (last_log.length < 7) {
      ss = scrol[1];
    } else {
      ss = last_log.length * 150 - 900 + scrol[1];
    }
    if (scrol[1] >= 30 && point.y - scrol[0] > 0) {
    } else if (scrol[1] > 20 && point.y - scrol[0] > 0) {
      scrol[1] = scrol[1] + (point.y - scrol[0]) / 10;
    } else if (scrol[1] > 10 && point.y - scrol[0] > 0) {
      scrol[1] = scrol[1] + (point.y - scrol[0]) / 5;
    } else if (scrol[1] > 0 && point.y - scrol[0] > 0) {
      scrol[1] = scrol[1] + (point.y - scrol[0]) / 2;
    } else if (ss <= -30 && point.y - scrol[0] < 0) {
    } else if (ss <= -20 && point.y - scrol[0] < 0) {
      scrol[1] = scrol[1] + (point.y - scrol[0]) / 10;
    } else if (ss <= -10 && point.y - scrol[0] < 0) {
      scrol[1] = scrol[1] + (point.y - scrol[0]) / 5;
    } else if (ss < 0 && point.y - scrol[0] < 0) {
      scrol[1] = scrol[1] + (point.y - scrol[0]) / 2;
    } else {
      scrol[1] = scrol[1] + point.y - scrol[0];
    }
    scrol[0] = point.y;
  }
});
canvas[2].addEventListener(eventEnd, (e) => {
  scrol_on = false;
  if (scrol[1] > 0) {
    scrol[1] = 0;
  } else if (last_log.length < 7 && scrol[1] <= 0) {
    scrol[1] = 0;
  } else if (last_log.length >= 7 && -scrol[1] > last_log.length * 150 - 900) {
    scrol[1] = last_log.length * -150 + 900;
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
    for (let i in stats) {
      let lv = 0;
      let exp = 0;
      c.fillText(
        stats_name[i],
        40 + (i % 2) * 350,
        570 - (((i % 2) - i) / 2) * 140
      );
      for(let j in stats){
        if(stats[i] < stats_cap[j]){
          exp = stats[i] - stats_cap[j-1];
          c.fillText(
            "レベル：" + j + " (" + exp + "/" + stats_cap[j] + ")",
            40 + (i % 2) * 350,
            610 - (((i % 2) - i) / 2) * 140
          );
          break;
        }
      }
    }
    c.drawImage(buttons[0], 0, 1230);
  } else if (seen == 1) {
    //行先選択
    c.drawImage(images[2], 0, 0);
    c.drawImage(stages[0], 0, 300);
    c.fillText("目標：ピヨチキ（コンビニ）", 280, 350);
    c.fillText("難度：★☆☆☆☆", 280, 400);
    c.fillText("距離：200メートル", 280, 450);
    if (stage_select) {
      c.drawImage(buttons[1], 540, 950);
    }
    c.drawImage(images[3], 0, 0);
    c.drawImage(buttons[0], 0, 1230);
  } else if (seen == 2) {
    //進行中
    c.drawImage(images[2], 0, 0);
    for (let i = last_log.length; i--; ) {
      let n = i * 150;
      let t = time - last_log[i][1];
      c.fillText(t + "分前", 620, 340 + n + scrol[1]);
      for (
        let lines = String(last_log[i][0]).split("\n"), j = 0, l = lines.length;
        l > j;
        j++
      ) {
        let line = lines[j];
        let addY = 40 * j;
        c.fillText(line, 180, 370 + n + addY + scrol[1]);
      }
      c.drawImage(icons[last_log[i][2]], 30, 300 + n + scrol[1]);
    }
    c.drawImage(images[3], 0, 0);
    c.drawImage(buttons[0], 0, 1230);
    c.drawImage(images[4], 100 + time * 11, 170);
  } else if (seen == 3) {
    //アドバイス
    c.drawImage(images[5], 0, 0);
    c.drawImage(buttons[4],20,800);//アドバイスボタン
    if (ad_seen == 1) {
      for (let i = 3; i--; ) {
        c.fillText("「" + advice + "」", 60, 880);
        c.fillText("というアドバイスで", 60, 930);
        c.fillText(
          stats_name[advice_arr[2 * i]] +
            "が" +
            advice_arr[2 * i + 1] +
            "ポイント",
          60,
          980 + i * 50
        );
      }
      c.fillText("成長しましたねぇ……", 60, 1130);
    }else if(ad_seen == 0){
      c.fillText("現在のボーナスは", 60, 880);
      c.fillText("「成長量２倍」です！", 60, 930);
      c.fillText("ワタクシに相談すれば", 60, 1030);
      c.fillText("アドバイスの効果を", 60, 1080);
      c.fillText("なんとなく調べられますよ！", 60, 1130);
    }else{
      let a = advice_arr[1]+advice_arr[3]+advice_arr[5];
      c.fillText("「" + advice + "」", 60, 880);
      c.fillText("というアドバイスをすると", 60, 930);
      c.fillText(stats_name[advice_arr[0]]+"と"+stats_name[advice_arr[2]]+"と",60,980);
      c.fillText(stats_name[advice_arr[4]]+"が",60,1030);
      c.fillText("合計"+a+"ポイント",60,1080);
      c.fillText("成長しそうですねぇ…",60,1130);
    }
    c.drawImage(buttons[2],90,620);//アドバイスボタン
    c.drawImage(buttons[3], 520, 800);//相談ボタン
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
