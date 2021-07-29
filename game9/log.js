//イベントクラス
class Log {
  constructor(log) {
    this.log = log;
  }
}
class Event extends Log {
  constructor(log, elog, check, goal) {
    super(log);
    this.elog = elog;
    this.check = check;
    this.goal = goal;
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

const nomal_log = [
  new Log("スキップしてすすんだ。\n「ええかんじや！」"),
  new Log("のんびり歩いた。\n「ええ天気やなー」"),
  new Log("ハトを眺めながら歩いた。\n「なに拾ってるんやろ？」"),
  new Log("ちょっと目を閉じて歩いた。\n「こわ！」"),
  new Log("けんけんで進んだ。\n「ぱっ！」"),
  new Log("その辺の花を食べた。\n「まずっ」"),
  new Log("その辺の溝を覗いた。\n「なんかおるかー？」"),
  new Log("ちょっと回転した。\n「とるねーどや！」"),
  new Log("植え込みに入った。\n「ひんやりじめじめ」"),
  new Log("ちょっとジャンプした。\n「らんらん」"),
  new Log("猫の気配を感じた。\n「……おる！」"),
  new Log("良い葉っぱを拾った。\n「これは……レアや！」"),
  new Log("良い枝を拾った。\n「ほどよいわぁ」"),
  new Log("良い石を拾った。\n「これは高く売れる…」"),
  new Log("ダンゴムシを拾った。\n「お前も一緒に行くか？」"),
  new Log("歩道のヒビをよけた。\n「よっほっほ」"),
  new Log("日焼け止めを塗る真似をした。\n「おはだはだいじですわぁ」"),
  new Log("車の真似をした。\n「ぶーんぶーんですわよ」"),
  new Log("大きい犬と会った。\n「においかぐな！」"),
  new Log("小さい犬と会った。\n「なんややんのかぁ！？」"),
  new Log("ちょっと転がった。\n「ぎゃくにつかれるわ……」"),
  new Log("坂道をくだった。\n「らくちんやー」"),
  new Log("坂道を上った。\n「だるー」"),
  new Log("雲を眺めた。\n「あれはうんち、あっちはうんこ」"),
  new Log("大きな石をめくった。\n「わっ、きもっ」"),
  new Log("飲み物を飲んだ。\n「しみるわー」"),
  new Log("トンネルを通った。\n「わっ！！「わっ！「わっ「ゎ……」"),
  new Log("なんかの実を拾った。\n「ぴかぴかや」"),
  new Log("自転車と張り合った。\n「ぜー…はー…ぜー…はー…」")
];

const event1 = [
  new Event("犬のいる家の前を通った！\n「よっ！」","怖い犬に吼えられた…\n「うわわっ」",0,3),
  new Event("アリさんをよけた！\n「おつー」","アリに噛まれた…\n「いたっ！？」",1,3),
  new Event("向かい風を突っ切った！\n「ええ風や」","風で進めなかった…\n「わぷっ」",2,3),
  new Event("青信号が連続した！\n「ラッキー！」","赤信号でちょっと休憩…\n「ぶー」",3,3),
  new Event("近道した！\n「ええ道はっけん！」","道に迷った…\n「あれ、こっち…やっけ？」",4,3),
  new Event("石を蹴りながら進んだ！\n「どりぶるどりぶる」","石で転んだ…\n「ぶえー」",5,3),
  new Event("人ごみをすり抜けた！\n「さっ、ささっ」","人の波にのまれた…\n「ひといすぎや！」",6,3),
  new Event("ギャルに可愛がられた！\n「お菓子くれんの！？」","ギャルがいっぱいで通れない…\n「いきどまりや…」",7,3),
  new Event("石を飛び越えた！\n「ぴょーん！」","石を飛び越えられなかった…\n「ぐ…ぐねった…」",8,3)
]