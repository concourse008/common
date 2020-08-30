'use strict';
const game0Divided = document.getElementById('game-area0');
const game1Divided = document.getElementById('game-area1');
let talk = '初期';  //表示するイベントを格納
let place = 0;     //現在の場所を記録
let flag = [0, 0, 0, 0, 0, 0, 0];      //初回のみのイベントのフラグをまとめる
let inputok = true; //入力受付中
let me = 0;
let lo = 0;
let count = 0;//文字表示のカウント
let itemlist = false;//アイテム表示
let mitol = false;
let savetime = false;
console.log(flag);
//0紅茶、ティーポット、薪、ケトル、鍋、氷、茶こし、ザル、マグ、周隠器、10ジェット、電気、磁石、クローバー、竿
let itemflag = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
let itemname = ['真空パックの茶葉', 'ティーポット', '薪', 'アルミケトル', 'カギ', 'きれいな氷', '茶こし器', '四葉のクローバー', 'お揃いマグカップ', 'おもちゃの集音機', 'うんちマシーン？', '充電'];
let getitem = [];

let mitokae = {
  x: 160,
  y: 100
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
  ['pic3.png', 205, 333],
  ['pic2.png', 10, 333],
  ['pic1.png', 205, 270],
  ['pic0.png', 10, 270],
  ['message.png', 10, 185],
  ['mitol.png', 160, 90],
  ['mito.png', 160, 90]
];
const srcs2 = [//背景画像一覧
  ['back0.png', 0, -5],
  ['back1.png', 0, -5],
  ['back2.png', 0, -5],
  ['back3.png', 0, -5],
  ['back4.png', 0, -5],
  ['back5.png', 0, -5],
  ['back6.png', 0, -5],
  ['ベース.png', 0, -5],
  ['ベース.png', 0, -5],
  ['item.png', 400, 400],
  ['save.png', 400, 400]
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
let backimages = [];
for (let i in srcs2) {
  backimages[i] = new Image();
  backimages[i].src = srcs2[i][0];
}
let loadedCount2 = 1;
for (let i in backimages) {
  backimages[i].addEventListener('load', function () {
    if (loadedCount2 == backimages.length) {
      for (let j in backimages) {
        ctx.drawImage(backimages[j], srcs2[j][1], srcs2[j][2]);
        window.requestAnimationFrame(step);
      }
    }
    loadedCount2++;
  }, false);
}
//画像読み込み

//画面の描写
let oldbi = 400;
let nowbi = 0;
let oldplace = 0;
function step() {
  window.requestAnimationFrame(step);
  canvas[1 - flip].style.visibility = 'hidden';
  canvas[flip].style.visibility = 'visible';
  flip = 1 - flip;
  ctx = canvas[flip].getContext('2d');
  ctx.clearRect(0, 0, 400, 400);
  ctx.drawImage(backimages[oldplace], oldbi, -5);//場面背景古い
  ctx.drawImage(backimages[place], nowbi, -5);//場面背景新しい
  for (let j = 0; j < images.length - 2; j++) {
    ctx.drawImage(images[j], srcs[j][1], srcs[j][2]);
  }
  if (mitol) {//二人の描写
    ctx.drawImage(images[5], srcs[6][1], srcs[6][2]);
  } else {
    ctx.drawImage(images[6], srcs[6][1], srcs[6][2]);
  }
  //文字の表示
  ctx.font = "14px sans-serif";
  if (talk.who == 0) {
    ctx.fillText('ミト', 60, 205);
  } else if (talk.who == 1) {
    ctx.fillText('カエデ', 60, 205);
  } else {
    ctx.fillText(' ', 60, 205);
  }
  for (let lines = (String(text)).split("\n"), i = 0, l = lines.length; l > i; i++) {
    ctx.font = "18px sans-serif";
    let line = lines[i];
    let addY = 18;
    addY += 18 * 1.26 * i;
    ctx.fillText(line, 50, 215 + addY);
  }
  //選択肢の表示
  if (talk instanceof Branch || talk instanceof Menu) {
    ctx.font = "20px sans-serif";
    ctx.fillText(talk.choice0, 30, 305);
    ctx.fillText(talk.choice1, 230, 305);
    ctx.fillText(talk.choice2, 30, 367);
    ctx.fillText(talk.choice3, 230, 367);
  }
  if (itemlist == true) {//アイテム一覧表示
    ctx.drawImage(backimages[9], 0, 0);
    for (let j = 0; j < getitem.length; j++) {
      ctx.font = "18px sans-serif";
      let addY = 18;
      addY += 18 + 40 * Math.floor(j / 2);
      ctx.fillText(getitem[j], 30 + 190 * (j % 2), 60 + addY);
    }
    if (savetime == true) {
      ctx.drawImage(backimages[10], 0, 10);
    }
  }
}
//画面の描写

//クリック
let point = 0;
canvas[2].addEventListener('click', e => {
  if (inputok) {
    //マウスの座標をカンバス内の座標と合わせる
    const rect = canvas[2].getBoundingClientRect();
    point = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    }
    if (talk instanceof Last) {
      inputok = false;
      lastdo();
    } else if (talk instanceof Branch) {
      inputok = false;
      branchdo();
    } else if (talk instanceof Menu) {
      inputok = false;
      menudo();
    } else if (talk instanceof Check) {
      inputok = false;
      checkdo();
    } else {
      inputok = false;
      if (talk.next0) {
        talk = talk.next0;
      } else {
        talk = lo[place];
        if (talk instanceof Check) {
          checkdo();
        }
      }
      count = 0;//メッセージウィンドウをリセット
      disp();//メッセージ表示
    }
  } else {
    count = 100;
  }
})
//クリック

//テキストのみ
class Text {
  constructor(who, value, next0) {
    this.who = who;
    this.value = value;
    this.next0 = next0;
  }
}
//調べる
class Branch extends Text {
  constructor(who, value, next0, next1, next2, choice0, choice1, choice2) {
    super(who, value, next0);
    this.next1 = next1;
    this.next2 = next2;
    this.choice0 = choice0;
    this.choice1 = choice1;
    this.choice2 = choice2;
    this.choice3 = 'もどる';
  }
}
function branchdo() {
  count = 0;
  if (point.x >= 10 && point.x <= 195 && point.y >= 270 && point.y <= 327) {
    if (talk.next0 == 0) {
      inputok = true;
    } else {
      talk = talk.next0;
      disp();
    }
  } else if (point.x >= 205 && point.x <= 390 && point.y >= 270 && point.y <= 327) {
    if (talk.next1 == 0) {
      inputok = true;
    } else {
      talk = talk.next1;
      disp();
    }
  } else if (point.x >= 10 && point.x <= 195 && point.y >= 333 && point.y <= 390) {
    if (talk.next2 == 0) {
      inputok = true;
    } else {
      talk = talk.next2;
      disp();
    }
  } else if (point.x >= 205 && point.x <= 390 && point.y >= 333 && point.y <= 390) {
    talk = me[place];
    disp();
  } else {
    count = 100;
    disp();
  }

}
//メニュー
class Menu extends Text {
  constructor(who, value) {
    super(who, value);
    this.choice0 = '左に進む';
    this.choice1 = '右に進む';
    this.choice2 = '持ち物・セーブ';
    this.choice3 = 'しらべる';
  }
}
let rightgo = 0;
let leftgo = 0;
function menudo() {
  if (itemlist == true) {
    if (point.x >= 205 && point.x <= 390 && point.y >= 333 && point.y <= 390) {
      save();//セーブ
      inputok = true;
    } else if (point.x >= 10 && point.x <= 195 && point.y >= 333 && point.y <= 390) {
      console.log('modoru');
      savetime = false;
      itemlist = false;
      inputok = true;
      tweetDivided.innerHTML = '';
    } else { inputok = true; }
  } else {
    if (point.x >= 10 && point.x <= 195 && point.y >= 270 && point.y <= 327) {
      if (place == 0) {
        inputok = true;
      } else {
        mitol = true;
        oldplace = place;
        place = place - 1;
        oldbi = 0;
        nowbi = -400;
        ju();
        leftgo = setInterval(left, 1000 / 30);
      }
    } else if (point.x >= 205 && point.x <= 390 && point.y >= 270 && point.y <= 327) {
      if (place == 6) {
        inputok = true;
      } else {
        if (place == 2 && itemflag[0] == 0) {
          count = 0;
          talk = lo2000;
          disp();
        } else {
          mitol = false;
          oldplace = place;
          place = place + 1;
          oldbi = 0;
          nowbi = 400;
          ju();
          rightgo = setInterval(right, 1000 / 30);
        }
      }
    } else if (point.x >= 10 && point.x <= 195 && point.y >= 333 && point.y <= 390) {
      item();
      inputok = true;
    } else if (point.x >= 205 && point.x <= 390 && point.y >= 333 && point.y <= 390) {
      look();
    } else { inputok = true; }
  }
}
function right() {
  oldbi = oldbi - 8;
  nowbi = nowbi - 8;
  if (nowbi == 0) {
    clearInterval(rightgo);
    clearInterval(jumping);
    if (flag[place] == 0) {
      flag[place] = 1;
      talk = fi[place];
      count = 0;
    } else {
      talk = me[place];
    }
    disp();
  }
}
function left() {
  oldbi = oldbi + 8;
  nowbi = nowbi + 8;
  if (nowbi == 0) {
    clearInterval(leftgo);
    clearInterval(jumping);
    if (flag[place] == 0) {
      flag[place] = 1;
      talk = fi[place];
      count = 0;
    } else {
      talk = me[place];
    }
    disp();
  }
}
function look() {
  talk = lo[place];
  if (talk instanceof Check) {
    checkdo();
  }
  count = 0;
  disp();
}
//フラグ処理あり
class Last extends Text {
  constructor(who, value, next0, itemid) {
    super(who, value, next0);
    this.itemid = itemid;
  }
}
function lastdo() {
  itemflag[talk.itemid] = 1;
  talk = talk.next0;
  count = 0;
  disp();
}
//フラグによる分岐あり n番のフラグが１か０かをチェック、それぞれの分岐
class Check extends Text {
  constructor(who, value, checkf) {
    super(who, value);
    this.checkf = checkf;
  }
}
function checkdo() {
  talk = talk.checkf();
  count = 0;
  disp();
}

//所持アイテム
function item() {
  getitem = [];
  for (let i = 0; i < itemflag.length; i++) {//所持アイテムをgetitemにリスト化
    if (itemflag[i] == 1) {
      getitem.push(itemname[i]);
    }
  }
  itemlist = true;
}

console.log(flag);
//セーブ
function save() {
  savetime = true;
  localStorage.item = itemflag;
  localStorage.place = place;
  localStorage.flag = flag;
  tweet();
}
//ロード
function getup() {

  console.log(flag);
  localStorage.setItem('item', itemflag);
  itemflag = (localStorage.getItem('item')).split(',').map(Number);
  localStorage.setItem('place', 0);
  place = Number(localStorage.getItem('place'));
  localStorage.setItem('flag', flag);
  flag = (localStorage.getItem('flag')).split(',').map(Number);
}
function setup() {
  itemflag = (localStorage.getItem('item')).split(',').map(Number);
  place = Number(localStorage.getItem('place'));
  flag = (localStorage.getItem('flag')).split(',').map(Number);
}
function reset() {
  localStorage.removeItem('item');
  localStorage.removeItem('place');
  localStorage.removeItem('flag');
}
if (!localStorage.getItem('item')) {
  //ストレージなし
  getup();
} else {
  //ストレージあり
  setup();
}

//ツイートボタン
const tweetDivided = document.getElementById('tweet-area');
function tweet() {
  while (tweetDivided.firstChild) {
    tweetDivided.removeChild(tweetDivided.firstChild);
  }
  let coment = 0;
  if (place == 0) {
    coment = '道路で一休み。' + '\n' + '「ここの角っこの砂がさらさらやねん」「泥団子作りたくなりますねぇ……」';
  } else if (place == 1) {
    coment = 'OZON入り口で空を見ている。' + '\n' + '「あの雲、うんちに見えへん？」「どちらかと言えばカレーに見えません？」';
  } else if (place == 2) {
    coment = 'シゲルチャペックの前でしりとり中。' + '\n' + '「うんち」「蝶」「うんち」「畜生」「うんち」「地球」';
  } else if (place == 3) {
    coment = 'ゼラニウムの前でおやすみ中。' + '\n' + '「ぐー……すぴぴぴぴぴ……」';
  } else if (place == 4) {
    coment = '好々山小屋の店中でキャンプ気分。' + '\n' + '「マシュマロ焼きたいですねぇ」「焚火おちつくわぁ」';
  } else if (place == 5) {
    coment = 'エイブルトゥーで100均を満喫。' + '\n' + '「あ！いま何かおった！」「あれはたぬきですねぇ…」';
  } else if (place == 6) {
    coment = 'スーパーの中を探検中。' + '\n' + '「天井に大穴あいてますねぇ」「でっかいまどや」';
  }
  const anchor = document.createElement('a');
  const hrefValue = 'https://twitter.com/intent/tweet?button_hashtag=' + encodeURIComponent('ミトとカエデのおいしい紅茶') + '&ref_src=twsrc%5Etfw';
  anchor.setAttribute('herf', hrefValue);
  anchor.className = 'twitter-hashtag-button';
  anchor.setAttribute('data-text', 'ミトとカエデは' + coment + '　#ミトカエお紅茶');
  anchor.setAttribute('data-size', "large");
  anchor.setAttribute('data-url', "https://concourse008.github.io/mitodash/index.html");
  anchor.innerText = 'Tweet #ミトカエお紅茶';
  const script = document.createElement('script');
  script.setAttribute('src', 'https://platform.twitter.com/widgets.js');
  tweetDivided.appendChild(script);
  tweetDivided.appendChild(anchor);
}

//外
const menu0 = new Menu(1, 'たのしみやなぁ……');
const op6 = new Text(1, 'うん、行こ！', menu0);
const op5 = new Text(0, '面白い物があるかもしれません\n行ってみましょうか？', op6);
const op4 = new Text(1, 'オゾン！ なんかええなぁ\nよう燃えそうな感じするわ', op5);
const op3 = new Text(0, '色んなものを売っていたお店です\nあれは『OZONE』ってお店ですよ', op4);
const op2 = new Text(1, 'なんなんそれ？', op3);
const op1 = new Text(0, 'あれは……\nショッピングモールですねぇ', op2);
const op0 = new Text(1, 'ミトちゃん\nあのでっかいのなんやろ？', op1);


const lo0032 = new Text(1, 'そやなぁ');
const lo0031 = new Text(0, 'エルフの森の木じゃ\nないですからねぇ', lo0032);
const lo0030 = new Text(1, 'この木は……\nあんま燃えなさそうやな', lo0031);

const lo0026n = new Text(0, '永久機関ですねぇ……');
const lo0025n = new Text(1, 'これが四葉の\nラッキーパワーや！', lo0026n);
const lo0024n = new Text(0, 'うそぉ！？', lo0025n);
const lo0023n = new Text(2, '四葉のクローバーを\n手に入れた！', lo0024n);
const lo0022n = new Text(1, 'あった！', lo0023n);
const lo0021n = new Text(0, '流石にそう何個も……', lo0022n);
const lo0020n = new Text(1, 'もう一個ないかなぁ', lo0021n);

const lo0026 = new Text(0, 'ラッキーな事が\nありそうですねぇ……');
const lo0025 = new Text(1, 'はい、ミトちゃんあげる', lo0026);
const lo0024 = new Text(0, 'わ、すごい！', lo0025);
const lo0023 = new Last(2, '四葉のクローバーを\n手に入れた！', lo0024, 7);
const lo0022 = new Text(1, 'あ！\nミトちゃん、これ！', lo0023);
const lo0021 = new Text(0, 'あ、クローバーが生えてますねぇ', lo0022);
const lo0020 = new Text(1, 'なんか落ちてへんかなー', lo0021);

const lo0012 = new Text(1, 'この下であまやどりすると\nめっちゃ雨漏りするんよな')
const lo0011 = new Text(0, 'ベンチですねぇ……', lo0012);
const lo0010 = new Text(1, 'あ、ここにも長いやつある', lo0011);

const lo0000 = new Text(1, 'ミトちゃん！ はよオゾンいこ！', menu0);

const look03 = new Branch(2, 'どこを調べよう？', lo0010, lo0020n, lo0030, 'ベンチ', '植え込み', '木');
const look02 = new Branch(2, 'どこを調べよう？', lo0010, lo0020, lo0030, 'ベンチ', '植え込み', '木');
const look01 = new Branch(2, 'どこを調べよう？', lo0000, lo0000, lo0000, 'ベンチ', '植え込み', 'アイテム一覧');
const look0set = function () {
  if (itemflag[0] == 1) {
    if (itemflag[7] == 1) {
      return look03;
    } else {
      return look02;
    }
  } else {
    return look01;
  }
};
const look0 = new Check(2, 'どこを調べよう？', look0set);


//オゾン入り口
const menu1 = new Menu(1, 'でかいけどボロいなぁ');
const fi102 = new Text(0, 'さっそく入ってみましょう', menu1);
const fi101 = new Text(1, '近くに来るとよけいでかいなぁ', fi102);
const look1 = new Branch(2, 'どこを調べよう？', 0, 0, 0, '', '', '');

//紅茶店
const menu2 = new Menu(0, 'ほとんどチリになってますねぇ……');
const fi208 = new Text(0, 'やりますか！\nカエデちゃん、わたくしも手伝います！', menu2);
const fi207 = new Text(1, 'よし！ 待ってて！\n探してみるわ！', fi208);
const fi206 = new Text(0, '飲んでみたいですねぇ……\nでも茶葉が残っているかどうか……', fi207);
const fi205 = new Text(1, 'へぇー………\nミトちゃん飲んでみたい？', fi206);
const fi204 = new Text(0, '美味しくておちつく飲み物です\n飲んだことはないですが……', fi205);
const fi203 = new Text(1, 'こうちゃって？', fi204);
const fi202 = new Text(0, '『シゲルチャペック』……\n紅茶のお店だったようですねぇ……', fi203);
const fi201 = new Text(1, 'なんか変な匂いする！', fi202);

const lo2038 = new Text(1, 'そうやね、冒険や！');
const lo2037 = new Text(0, 'はい、のんびり材料を集めましょう\nここ以外も見て回りたいですし', lo2038);
const lo2036 = new Text(1, 'えっ！？\nそしたらもっとおいしい？', lo2037);
const lo2035 = new Text(0, 'ふふ、紅茶を美味しく飲むコツは\n焦らない事なんですよ', lo2036);
const lo2034 = new Text(1, 'もうのめる？', lo2035);
const lo2032 = new Text(0, 'これはまだ使えそうですねぇ……', lo2034);
const lo2031 = new Last(2, 'ティーポットを見つけた！', lo2032, 1);
const lo2030 = new Text(0, 'よいせのせ、と……', lo2031);
const lo2031n = new Text(0, 'おっとカエデちゃん\n触ると危ないですよ');
const lo2030n = new Text(1, 'てぃーポットのかけらでいっぱいや', lo2031n);

const lo2027 = new Text(0, 'まずは……　　　\n棚のアレをもらいましょうか');
const lo2026 = new Text(1, 'そうなんや、ここにある？', lo2027);
const lo2025 = new Text(0, 'ええ、でも紅茶を美味しく飲むには\n他にもいる物があるんです', lo2026);
const lo2024 = new Text(1, 'それ紅茶なん？\n飲めるん？', lo2025);
const lo2023 = new Text(0, 'あるもんですねぇ……', lo2024);
const lo2022 = new Last(2, '真空保存された紅茶を見つけた！', lo2023, 0);
const lo2021 = new Text(2, '『100年後の火星でも、\n　おいしい紅茶をたのしく』', lo2022);
const lo2020 = new Text(0, 'おや、これは……', lo2021);
const lo2021n = new Text(0, '………');
const lo2020n = new Text(2, '『100年後の火星でも、\n　おいしい紅茶をたのしく』', lo2021n);

const lo2015 = new Text(1, 'もちろんええよ！');
const lo2014 = new Text(0, 'わたくしも眺めたいですねぇ……', lo2015);
const lo2013 = new Text(1, '持って帰って\n棚のとこに飾るんや～', lo2014);
const lo2012 = new Text(0, 'あっ！   \nいいですねぇ……', lo2013);
const lo2011 = new Text(1, '見てミトちゃん！\nこのカンカンかわええ！', lo2012);
const lo2010 = new Text(0, 'どれも中身がチリになってますねぇ……', lo2011);

const lo2000 = new Text(1, 'ミトちゃん！\nはよ紅茶さがそ！', menu2);

const look23 = new Branch(2, 'どこを調べよう？', lo2010, lo2020n, lo2030n, '机', '引き出し', '棚');
const look22 = new Branch(2, 'どこを調べよう？', lo2010, lo2020n, lo2030, '机', '引き出し', '棚');
const look21 = new Branch(2, 'どこを調べよう？', lo2010, lo2020, 0, '机', '引き出し', '');
const look2set = function () {
  if (itemflag[1] == 1) {
    return look23;
  } else if (itemflag[0] == 1) {
    return look22;
  } else {
    return look21;
  }
};
const look2 = new Check(2, 'どこを調べよう？', look2set);

//ファミレス
const menu3 = new Menu(1, 'たべもんあるかな？');

const fi308 = new Text(0, 'なんででしょうねぇ……', menu3);
const fi307 = new Text(1, 'そうなん？おいしそうやのに……\n何で食べられへん料理作ったんやろ？', fi308);
const fi306 = new Text(0, 'それは……食べられないですねぇ\n料理の見本です。サンプルといいます', fi307);
const fi305 = new Text(1, 'ミトちゃん！\nこれ食べれるんちゃう！？', fi306);
const fi304 = new Text(0, 'ご飯を食べにくる所です\n色んな料理があったらしいですよ', fi305);
const fi303 = new Text(1, 'ふぁみれすってなんなん？', fi304);
const fi302 = new Text(0, '『ゼラリウム』……\nここはファミレスだったようですねぇ', fi303);
const fi301 = new Text(1, 'うわ、すごい\n椅子がいっぱいや', fi302);

const lo3035 = new Text(1, 'そうなんや……\nでんきって使いづらいなぁ');
const lo3034 = new Text(0, 'それは電気を使わないですねぇ……', lo3035);
const lo3033 = new Text(1, 'このたいまつは？', lo3034);
const lo3032 = new Text(0, '何か充電する物があれば\nここで充電できるんですが……', lo3033);
const lo3031 = new Text(0, 'これは発電機ですねぇ……', lo3032);
const lo3030 = new Text(1, 'ミトちゃんこれ何？', lo3031);

const lo3035n = new Text(1, 'みたーい！');
const lo3034n = new Text(0, 'はやく使ってみたいですねぇ', lo3035n);
const lo3033n = new Last(2, '機械を充電した！', lo3034n, 11);
const lo3032n = new Text(0, 'なる……はずです……\n……よし、これでOK！', lo3033n);
const lo3031n = new Text(1, 'うんちマシーン動くようになる？', lo3032n);
const lo3030n = new Text(0, 'この発電機……\nこれをこう繋げば……', lo3031n);

const lo3034m = new Text(0, 'あ べ べ べ べ べ べ');
const lo3033m = new Text(0, '…………', lo3034m);
const lo3032m = new Text(1, 'こ　い　つ　ぶ　る　ぶ　る\n　し　て　お　も　ろ　い', lo3033m);
const lo3031m = new Text(0, 'カエデちゃん\n何やってるんですか？', lo3032m);
const lo3030m = new Text(1, 'あ ぶ ぶ ぶ ぶ ぶ ぶ', lo3031m);

const lo3023 = new Text(1, 'うぇー');
const lo3022 = new Text(0, 'その中、たぶんめっちゃ臭いですよ', lo3023);
const lo3021 = new Text(0, 'カエデちゃん\nおいといた方がいいです', lo3022);
const lo3020 = new Text(1, 'これなに？ ドア？', lo3021);

const lo30211n = new Text(0, 'ちべたいですねぇ……');
const lo30210n = new Text(1, 'ちべたーい', lo30211n);
const lo3029n = new Last(2, '綺麗な氷を見つけた！', lo30210n, 5);
const lo3028n = new Text(1, 'やったー！', lo3029n);
const lo3027n = new Text(0, 'やりましたねカエデちゃん！\n綺麗な水、ゲットです！', lo3028n);
const lo3026n = new Text(1, 'ミトちゃん！ これ！\n氷あった！', lo3027n);
const lo3025n = new Text(0, '非常用の発電機が\nまだ動いてたんですねぇ', lo3026n);
const lo3024n = new Text(1, 'つめたっ！ なにこれ！？', lo3025n);
const lo3023n = new Text(0, '……まさか　　　　\nよいせのせ', lo3024n);
const lo3022n = new Text(1, 'ぶーーんって音\nここの奥からする！', lo3023n);
const lo3021n = new Text(0, '集音機ですか？\n何の音でしょう？', lo3022n);
const lo3020n = new Text(1, 'あれ、ミトちゃん\n何か聞こえる', lo3021n);

const lo3020m = new Text(1, 'すずしーい');

const lo3011 = new Text(0, 'なーんにも残ってませんねぇ……',);
const lo3010 = new Text(1, 'からっぽ！', lo3011);

const look34 = new Branch(2, 'どこを調べよう？', lo3010, lo3020m, lo3030m, 'ドリンクバー', '冷蔵庫', '発電機');
const look33 = new Branch(2, 'どこを調べよう？', lo3010, lo3020m, lo3030n, 'ドリンクバー', '冷蔵庫', '発電機');
const look35 = new Branch(2, 'どこを調べよう？', lo3010, lo3020m, lo3030, 'ドリンクバー', '冷蔵庫', '発電機');
const look32 = new Branch(2, 'どこを調べよう？', lo3010, lo3020n, 0, 'ドリンクバー', '冷蔵庫', '');
const look31 = new Branch(2, 'どこを調べよう？', lo3010, lo3020, 0, 'ドリンクバー', '冷蔵庫', '');
const look3set = function () {
  if (itemflag[11] == 1) {//電気取得済み
    return look34
  } else if (itemflag[5] == 1) {//氷取得
    if (itemflag[10] == 1) {//ジェットあり
      return look33
    } else {//ジェットなし
      return look35
    }
  } else if (itemflag[9] == 1) {//集音機あり
    return look32
  } else {//なんにもなし
    return look31
  }
}
const look3 = new Check(2, 'どこを調べよう？', look3set);

//キャンプ用品店 好々山小屋
const menu4 = new Menu(0, 'キャンプしたいですねぇ……');

const fi406 = new Text(0, 'それはいいですねぇ……', menu4);
const fi405 = new Text(1, 'へぇー\nわたしもワイハでキャンプしたいわ', fi406);
const fi404 = new Text(0, '山とか海とか好きな所で\n楽しく過ごす遊びの事ですよ', fi405);
const fi403 = new Text(1, 'きゃんぷ？', fi404);
const fi402 = new Text(0, '『好々山小屋』　　　\nキャンプ用品店のようですねぇ……', fi403);
const fi401 = new Text(1, 'なんやここ\n外みたいや、中やのに', fi402);

const lo4032m = new Text(0, 'カエデちゃんって\nそういうの得意なんですね……');
const lo4031m = new Text(0, 'そっかー、さっきのドカーン！\nもっかいやりたかったわ……', lo4032m);
const lo4030m = new Text(0, '衝撃でうんちマシーンも\n壊れちゃいましたねぇ……', lo4031m);

const lo40322n = new Text(0, 'カエデちゃんは優しいですねぇ……');
const lo40321n = new Text(1, 'やった！さすがミトちゃんや！', lo40322n);
const lo40320n = new Text(0, '衝撃で棚がぶっ壊れて\n落ちてきたみたいですねぇ……', lo40321n);
const lo40319n = new Last(2, 'ケトルを手に入れた！', lo40320n, 3);
const lo40318n = new Text(1, 'うーん…………\nあ！ミトちゃんこれ！', lo40319n);
const lo40317n = new Text(0, 'すみません操縦が難しくて……\n棚に突っ込んじゃいました', lo40318n);
const lo40316n = new Text(1, '目が……まわる……', lo40317n);
const lo40315n = new Text(0, 'カエデちゃん\n大丈夫ですか？', lo40316n);
const lo40314n = new Text(0, '……ゲホゲホ', lo40315n);
const lo40313n = new Text(2, '…………', lo40314n);
const lo40312n = new Text(2, 'ド　ッ　カ　ー　ー　ー　ン　！', lo40313n);
const lo40311n = new Text(0, '反重力粒子充填……　　　\nゴー！', lo40312n);
const lo40310n = new Text(0, 'これは「unti」じゃなくて「anti」\n「anti gravity unit」なんですよ', lo40311n);
const lo4039n = new Text(0, 'カエデちゃん、実はこれ\nうんちマシーンじゃないんです', lo40310n);
const lo4038n = new Text(1, 'ブンブン言っとる！\nうんちマシーン！頑張れ！', lo4039n);
const lo4037n = new Text(0, 'ブレーキ確認、スイッチオン……\n……システムオールグリーン', lo4038n);
const lo4036n = new Text(0, 'まあ見ててください\n……行きますよカエデちゃん', lo4037n);
const lo4035n = new Text(1, '……うんちで？', lo4036n);
const lo4034n = new Text(0, '飛びます', lo4035n);
const lo4033n = new Text(0, 'わたくし…………', lo4034n);
const lo4032n = new Text(1, 'どうすんの？', lo4033n);
const lo4031n = new Text(0, 'うんちマシーンを使えば\n取れるかもしれません', lo4032n);
const lo4030n = new Text(1, 'ミトちゃん、あの上なんかない？', lo4031n);

const lo4033 = new Text(0, '何とかしてあそこまで登れれば\n取れそうですね');
const lo4032 = new Text(1, 'きになるわー', lo4033);
const lo4031 = new Text(0, 'ホントですねぇ……\nなんでしょう？', lo4032);
const lo4030 = new Text(1, 'ミトちゃん、あの上なんかない？', lo4031);

const lo4024n = new Text(1, 'うん！');
const lo4023n = new Text(0, 'また紅茶を飲んだ後で\n取りに来ましょう', lo4024n);
const lo4022n = new Text(1, 'そっかぁ……', lo4023n);
const lo4021n = new Text(0, 'うーん、他の物を\n持てなくなりますからねぇ……', lo4022n);
const lo4020n = new Text(1, 'ミトちゃん\nもう一本持ってくれへん？', lo4021n);

const lo4024 = new Text(0, 'カエデちゃん……\n職人の目をしてますねぇ');
const lo4023 = new Text(1, '重さもこれ……最高や……', lo4024);
const lo4022 = new Last(2, '薪を手に入れた！', lo4023, 2);
const lo4021 = new Text(0, 'いいですねぇ\n何本かお湯の為にもらいましょう', lo4022);
const lo4020 = new Text(1, 'うわ、この木……\nもやすんに最高や', lo4021);

const lo4011 = new Text(0, 'めちゃくちゃ\nテントを気に入ってますねぇ……');
const lo4010 = new Text(1, 'これええわ、これ……\nこれええ………', lo4011);

const look46 = new Branch(2, 'どこを調べよう？', lo4010, lo4020n, lo4030m, 'テント', '薪の束', '崩れた棚');
const look45 = new Branch(2, 'どこを調べよう？', lo4010, lo4020, lo4030m, 'テント', '薪の束', '崩れた棚');
const look44 = new Branch(2, 'どこを調べよう？', lo4010, lo4020n, lo4030n, 'テント', '薪の束', '高い棚');
const look43 = new Branch(2, 'どこを調べよう？', lo4010, lo4020, lo4030n, 'テント', '薪の束', '高い棚');
const look42 = new Branch(2, 'どこを調べよう？', lo4010, lo4020n, lo4030, 'テント', '薪の束', '高い棚');
const look41 = new Branch(2, 'どこを調べよう？', lo4010, lo4020, lo4030, 'テント', '薪の束', '高い棚');
const look4set = function () {
  if (itemflag[2] == 1) {//薪をとってるか
    if (itemflag[3] == 1) {//ケトルをとってるか
      return look46;
    } else if (itemflag[11] == 1) {//ジェットパックがあるか
      return look44;
    } else {
      return look42;
    }
  } else {
    if (itemflag[3] == 1) {//ケトルをとってるか
      return look45;
    } else if (itemflag[11] == 1) {//ジェットパックがあるか
      return look43;
    } else {
      return look41;
    }
  }
};
const look4 = new Check(2, 'どこを調べよう？', look4set);

//１００均 エイブルトゥー
const menu5 = new Menu(1, 'ごちゃごちゃやー');

const fi5011 = new Text(1, 'そうやった……\nしゃーない、また今度持って来よ', menu5);
const fi5010 = new Text(0, 'オセロに使ったあと\n片付けちゃいましたから', fi5011);
const fi509 = new Text(0, 'あー、あれですねぇ……\nおうちに置きっぱですねぇ', fi5010);
const fi508 = new Text(1, 'あれ？\n100円どこやったっけ？', fi509);
const fi507 = new Text(1, 'そうなんや！よーし……', fi508);
const fi506 = new Text(0, 'はい、あれとここの物\n何でも交換できたんです', fi507);
const fi505 = new Text(1, 'ひゃくえん？\nあのわたしの髪の色のやつ？', fi506);
const fi504 = new Text(0, 'ここの物は全部\n100円で売られてたんですよ', fi505);
const fi503 = new Text(1, 'ひゃっきんて何なん？', fi504);
const fi502 = new Text(0, '『エイブルトゥー』\n100均ですねぇ', fi503);
const fi501 = new Text(1, 'ここ\nめちゃくちゃ物だらけや', fi502);

const lo5037 = new Text(1, 'やったー！\nカギあな探そーっと！');
const lo5036 = new Text(0, 'そうですねぇ……\nじゃあカエデちゃんどうぞ', lo5037);
const lo5035 = new Text(1, '一応もってこ！\nお宝あるかも！', lo5036);
const lo5034 = new Text(0, '鍵のかかりそうな所は\n無さそうですが', lo5035);
const lo5033 = new Text(0, 'どこの鍵でしょう\nこのお店には……', lo5034);
const lo5032 = new Last(2, 'カギを見つけた！', lo5033, 4);
const lo5031 = new Text(1, 'なんやろ……カギ？', lo5032);
const lo5030 = new Text(0, 'おや、なんでしょうこれ', lo5031);

const lo5020n = new Text(0, '非電源のおもちゃが\nいっぱいありますねぇ');

const lo5027 = new Text(0, '何でしょう……\n閉じた物の中の音を聞くとか？');
const lo5026 = new Text(1, 'どうやって使ったらいい？', lo5027);
const lo5025 = new Last(2, 'おもちゃの集音機を\n手に入れた！', lo5026, 9);
const lo5024 = new Text(1, 'うん！', lo5025);
const lo5023 = new Text(0, 'これ、まだ動きそうですよ\n持っていきますか？', lo5024);
const lo5022 = new Text(0, 'ああ、集音機のおもちゃですね\nおや、これもしかして……', lo5023);
const lo5021 = new Text(0, '何でしょう、拡声器……？', lo5022);
const lo5020 = new Text(1, 'これおもろい形してない？', lo5021);

const lo5014n = new Text(0, '……でもガラスを触るのは\n危ないからやめときましょう');
const lo5013n = new Text(0, 'きれいかもしれませんねぇ……\n夕焼けで橙色に光って……', lo5014n);
const lo5012n = new Text(1, 'コップの葉っぱよーさん集めて\n庭にかざったらどうやろ？', lo5013n);
const lo5011n = new Text(0, '似てるかも知れませんねぇ', lo5012n);
const lo5010n = new Text(1, '割れたコップのかけらって\n葉っぱみたいちゃう？', lo5011n);

const lo5016 = new Text(0, 'おそろいですねぇ……');
const lo5015 = new Text(1, 'おそろいや！', lo5016);
const lo5014 = new Last(2, 'マグカップを二つ手に入れた！', lo5015, 8);
const lo5013 = new Text(0, '同じやつの……\nこのピンク色のを', lo5014);
const lo5012 = new Text(0, 'あ、いいですねぇ\nじゃあわたくしは……', lo5013);
const lo5011 = new Text(1, 'ミトちゃん！\nこの白いのきれいちゃう！？', lo5012);
const lo5010 = new Text(0, 'いくつか無事なのが\nありますねぇ……', lo5011);

const look58 = new Branch(2, 'どこを調べよう？', lo5010n, lo5020n, 0, '食器棚', 'おもちゃ棚', '');
const look57 = new Branch(2, 'どこを調べよう？', lo5010n, lo5020n, lo5030, '食器棚', 'おもちゃ棚', '鍵');
const look56 = new Branch(2, 'どこを調べよう？', lo5010, lo5020n, 0, '食器棚', 'おもちゃ棚', '');
const look55 = new Branch(2, 'どこを調べよう？', lo5010n, lo5020, 0, '食器棚', 'おもちゃ棚', '');
const look54 = new Branch(2, 'どこを調べよう？', lo5010, lo5020, 0, '食器棚', 'おもちゃ棚', '');
const look53 = new Branch(2, 'どこを調べよう？', lo5010n, lo5020, lo5030, '食器棚', 'おもちゃ棚', '鍵');
const look52 = new Branch(2, 'どこを調べよう？', lo5010, lo5020n, lo5030, '食器棚', 'おもちゃ棚', '鍵');
const look51 = new Branch(2, 'どこを調べよう？', lo5010, lo5020, lo5030, '食器棚', 'おもちゃ棚', '鍵');
const look5set = function () {
  if (itemflag[8] == 1) {
    if (itemflag[9] == 1) {
      if (itemflag[4] == 1) {
        return look58;
      } else {
        return look57;
      }
    } else {
      if (itemflag[4] == 1) {
        return look55;
      } else {
        return look53;
      }
    }
  } else {
    if (itemflag[9] == 1) {
      if (itemflag[4] == 1) {
        return look56;
      } else {
        return look52;
      }
    } else {
      if (itemflag[4] == 1) {
        return look54;
      } else {
        return look51;
      }
    }
  }
};
const look5 = new Check(2, 'どこを調べよう？', look5set);

//スーパーウルトラマーケット
const menu6 = new Menu(0, 'どうやらこのお店が\n行き止まりみたいですねぇ');

const fi604 = new Text(0, 'わくわくですねぇ', menu6);
const fi603 = new Text(1, 'これは見て回るの大変や！', fi604);
const fi602 = new Text(0, '『スーパーマーケット』\nですねぇ', fi603);
const fi601 = new Text(1, 'うわー、ひろいなぁ', fi602);

const lo6030l = new Text(1, 'ほんまに空っぽや……');

const lo60315m = new Text(1, 'そうなんや……');
const lo60314m = new Text(0, 'それは…… あんまり気に\nしなくていいやつです', lo60315m);
const lo60313m = new Text(1, 'なんでで金庫の中に\nそれ一個入ってるん？', lo60314m);
const lo60312m = new Text(0, '……みたいですね', lo60313m);
const lo60311m = new Text(1, '……これだけ？', lo60312m);
const lo60310m = new Text(0, 'やった！ 美味しい紅茶に\n一歩近づきましたよ！', lo60311m);
const lo6039m = new Last(2, 'こし器を手に入れた！', lo60310m, 6);
const lo6038m = new Text(1, 'やった！ 中身は……', lo6039m);
const lo6037m = new Text(0, 'え！？ 開いた！？', lo6038m);
const lo6036m = new Text(2, 'ピンポーン\nカチャ', lo6037m);
const lo6035m = new Text(1, '何これ？押してええ？\nぽちぽちぽちぽち！', lo6036m);
const lo6034m = new Text(0, 'あら、パスワード……？', lo6035m);
const lo6033m = new Text(2, '『パスワードを入力してください』', lo6034m);
const lo6032m = new Text(1, 'よっしゃ！', lo6033m);
const lo6031m = new Text(0, 'さっきの鍵が使えそうですよ', lo6032m);
const lo6030m = new Text(0, '金庫がありますねぇ……', lo6031m);

const lo6039n = new Text(0, '……この状態のオゾンの中を\n探して見つかりますかねぇ……');
const lo6038n = new Text(1, 'ぶー、ぱすわーどどこや！', lo6039n);
const lo6037n = new Text(0, 'はずれみたいですねぇ', lo6038n);
const lo6036n = new Text(2, 'ブブー', lo6037n);
const lo6035n = new Text(1, '何これ？押してええ？\nぽちぽちぽちぽち！', lo6036n);
const lo6034n = new Text(0, 'あら、パスワード……？', lo6035n);
const lo6033n = new Text(2, '『パスワードを入力してください』', lo6034n);
const lo6032n = new Text(1, 'よっしゃ！', lo6033n);
const lo6031n = new Text(0, 'さっきの鍵が使えそうですよ', lo6032n);
const lo6030n = new Text(0, '金庫がありますねぇ……', lo6031n);

const lo6032 = new Text(1, 'でかいなぁ……\nお宝が入ってそうや');
const lo6031 = new Text(0, 'うーん、開けるには\n鍵がいるみたいです', lo6032);
const lo6030 = new Text(0, '金庫がありますねぇ……', lo6031);

const lo6023n = new Text(0, 'うんちぃ…………');
const lo6022n = new Text(1, '……うんちっ', lo6023n);
const lo6021n = new Text(0, '他も一緒だとおもいますよ', lo6022n);
const lo6020n = new Text(1, '動くうんちマシーンも\n探したらあるかなぁ？', lo6021n);

const lo60213 = new Text(0, 'うんち……');
const lo60212 = new Text(1, 'うんち', lo60213);
const lo60211 = new Text(1, 'そっかー\n動かしたかったなぁ……', lo60212);
const lo60210 = new Text(0, '充電が切れてるのかもしれません', lo60211);
const lo6029 = new Text(0, '見た目には壊れてませんが\n……動きませんねぇ', lo60210);
const lo6028 = new Last(2, 'うんちマシーン（？）を\n手に入れた！', lo6029, 10);
const lo6027 = new Text(0, 'どれどれ……', lo6028);
const lo6026 = new Text(1, 'これ動くかなぁ？', lo6027);
const lo6025 = new Text(1, 'で、ここに『うんち』って\n書いてるねん！', lo6026);
const lo6024 = new Text(0, 'これは……何の機械でしょう？\nリュックみたいな形ですねぇ', lo6025);
const lo6023 = new Text(1, 'これ！', lo6024);
const lo6022 = new Text(0, 'えっ！？ ここで！？', lo6023);
const lo6021 = new Text(1, 'ミトちゃん！\nうんち見つけた！', lo6022);
const lo6020 = new Text(0, 'いろんな機械や道具が\nどっさり散らばってますね……', lo6021);

const lo6016 = new Text(1, '……たしかに\n何かダメそうな気がするわ');
const lo6015 = new Text(0, '……は、ならなそうですねぇ', lo6016);
const lo6014 = new Text(0, 'これはザルですよ\nこれをこし器の代わりに……', lo6015);
const lo6013 = new Text(1, 'なにこれ、帽子？', lo6014);
const lo6012 = new Text(0, 'これなんかは大丈夫ですねぇ', lo6013);
const lo6011 = new Text(1, 'わびさび……', lo6012);
const lo6010 = new Text(0, 'どれも錆びまくりですねぇ', lo6011);

const look68 = new Branch(2, 'どこを調べよう？', lo6010, lo6020n, lo6030l, 'キッチン棚', 'ごちゃごちゃ', '金庫');
const look67 = new Branch(2, 'どこを調べよう？', lo6010, lo6020n, lo6030m, 'キッチン棚', 'ごちゃごちゃ', '金庫');
const look66 = new Branch(2, 'どこを調べよう？', lo6010, lo6020n, lo6030n, 'キッチン棚', 'ごちゃごちゃ', '金庫');
const look65 = new Branch(2, 'どこを調べよう？', lo6010, lo6020n, lo6030, 'キッチン棚', 'ごちゃごちゃ', '金庫');
const look64 = new Branch(2, 'どこを調べよう？', lo6010, lo6020, lo6030l, 'キッチン棚', 'ごちゃごちゃ', '金庫');
const look63 = new Branch(2, 'どこを調べよう？', lo6010, lo6020, lo6030m, 'キッチン棚', 'ごちゃごちゃ', '金庫');
const look62 = new Branch(2, 'どこを調べよう？', lo6010, lo6020, lo6030n, 'キッチン棚', 'ごちゃごちゃ', '金庫');
const look61 = new Branch(2, 'どこを調べよう？', lo6010, lo6020, lo6030, 'キッチン棚', 'ごちゃごちゃ', '金庫');
const look6set = function () {
  console.log('look');
  if (itemflag[4] == 1 && itemflag[7] == 1) {
    if (itemflag[6] == 1) {
      if (itemflag[10] == 1) {
        return look68;
      } else {
        return look64;
      }
    } else {
      if (itemflag[10] == 1) {
        return look67;
      } else {
        return look63;
      }
    }
  } else if (itemflag[4] == 1) {
    if (itemflag[10] == 1) {
      return look66;
    } else {
      return look62;
    }
  } else {
    if (itemflag[10] == 1) {
      return look65;
    } else {
      return look61;
    }
  }
};
const look6 = new Check(2, 'どこを調べよう？', look6set);

lo = [look0, look1, look2, look3, look4, look5, look6]//探索イベントまとめ
const fi = [op0, fi101, fi201, fi301, fi401, fi501, fi601]//初移動イベント
me = [menu0, menu1, menu2, menu3, menu4, menu5, menu6]//各待機


//二人がぴょこぴょこする仕組み
let jumpi = 0;
function jump() {
  jumpi = 1 - jumpi;
  srcs[srcs.length - 1][2] = 90 - 2 * jumpi;
}
let jumping = 0;
function ju() {
  jumping = setInterval(jump, 100);
}

//一文字ずつ表示する仕組み
let text = '';
function disp() {
  let i = talk.value.substring(0, count);
  text = i;
  count++;
  let rep = setTimeout("disp()", 70);
  if (count > talk.value.length) {
    clearInterval(rep);
    inputok = true;
  }
}

if (flag[place] == 0) {
  flag[place] = 1;
  talk = fi[place];
  count = 0;
} else {
  talk = me[place];
}
disp();