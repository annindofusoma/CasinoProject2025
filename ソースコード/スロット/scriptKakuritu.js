
const hidariReels = [
  "チェリー左", "スイカ左", "赤７左", "ベル左", "リプレイ左",
];
const nakaReels = [
  "リプレイ中", "ベル中", "赤７中", "スイカ中", "チェリー中",
];
const migiReels = [
  "チェリー右", "スイカ右", "赤７右", "ベル右", "リプレイ右"
];


const reelHeight = 77.55;
const topStart = 152.35;
const topEnd = 462.55;
const speed = 5;

let hidariReelInterval;
let nakaReelInterval;
let migiReelInterval;

let stop1Requested = false;
let stop2Requested = false;
let stop3Requested = false;

let hidari7;
let naka7;
let migi7;


let targetPositionsHidari = [152.35, 229.9, 307.45, 385, 462.55];
let targetPositionsNaka = [152.35, 229.9, 307.45, 385, 462.55];
let targetPositionsMigi = [152.35, 229.9, 307.45, 385, 462.55];

let randomNum;
let Bonusgame = 0;



// リール位置を記憶する変数
let reelPositions = {
  hidari: {},
  naka: {},
  migi: {}
};

// リール位置を初期化（停止位置からスタート）
function resetReelPositionsFromLast() {
  hidariReels.forEach((id, index) => {
    const el = document.getElementById(id);
    if (el) {
      el.style.top = reelPositions.hidari[id] || (topStart + (index % 5) * reelHeight) + "px";
    }
  });
  nakaReels.forEach((id, index) => {
    const el = document.getElementById(id);
    if (el) {
      el.style.top = reelPositions.naka[id] || (topStart + (index % 5) * reelHeight) + "px";
    }
  });
  migiReels.forEach((id, index) => {
    const el = document.getElementById(id);
    if (el) {
      el.style.top = reelPositions.migi[id] || (topStart + (index % 5) * reelHeight) + "px";
    }
  });
}


function checkResult() {
  if (hidari7 && naka7 && migi7) {
    let money = Number(localStorage.getItem("money")) || 0;
    let betMoney = Number(localStorage.getItem("betMoney")) || 0;
    document.getElementById("当たり").textContent = "当たり！！";
    document.getElementById("当たり").style.color = "red";
    document.getElementById("収支").style.color = "red";
    //７
    if ((hidari7 === "上段" && naka7 === "上段" && migi7 === "上段") || (hidari7 === "中段" && naka7 === "中段" && migi7 === "中段") || (hidari7 === "下段" && naka7 === "下段" && migi7 === "下段") || (hidari7 === "上段" && naka7 === "中段" && migi7 === "下段") || (hidari7 === "下段" && naka7 === "中段" && migi7 === "上段")) {
      document.getElementById("収支").textContent = "+" + betMoney * 7 + " MB";
      storage.money = money + (betMoney * 7)
      document.getElementById("左ハナ当たり").style.zIndex = 4;
      document.getElementById("右ハナ当たり").style.zIndex = 4;
      document.getElementById("当たり").textContent = "ビッグボーナス！！";
      audioBGM.pause();
      audio7.play();
      if (hikariNum === 1 || hikariNum === 2 || hikariNum === 3 || hikariNum === 4 || hikariNum === 5 || hikariNum === 6) {
        audioBonus2.volume = 0.7;
        audioBonus2.play();
      } else {
        audioBonus.volume = 0.7;
        audioBonus.play();
      }
    //チェリー
    } else if ((hidari7 === "下段" && naka7 === "枠下" && migi7 === "下段") || (hidari7 === "枠下" && naka7 === "枠上" && migi7 === "枠下") || (hidari7 === "枠上" && naka7 === "上段" && migi7 === "枠上") || (hidari7 === "下段" && naka7 === "枠上" && migi7 === "枠上") || (hidari7 === "枠上" && naka7 === "枠上" && migi7 === "下段")) {
      document.getElementById("収支").textContent = "+" + betMoney * 3 + " MB";
      storage.money = money + (betMoney * 3)
      audioTyeli.play();
    //スイカ
    } else if ((hidari7 === "中段" && naka7 === "枠上" && migi7 === "中段") || (hidari7 === "下段" && naka7 === "上段" && migi7 === "下段") || (hidari7 === "枠下" && naka7 === "中段" && migi7 === "枠下") || (hidari7 === "中段" && naka7 === "上段" && migi7 === "枠下") || (hidari7 === "枠下" && naka7 === "上段" && migi7 === "中段")) {
      document.getElementById("収支").textContent = "+" + betMoney * 3 + " MB";
      storage.money = money + (betMoney * 3)
      audioSuika.play();
    //ベル
    } else if ((hidari7 === "枠上" && naka7 === "中段" && migi7 === "枠上") || (hidari7 === "上段" && naka7 === "下段" && migi7 === "上段") || (hidari7 === "中段" && naka7 === "枠下" && migi7 === "中段") || (hidari7 === "枠上" && naka7 === "下段" && migi7 === "中段") || (hidari7 === "中段" && naka7 === "下段" && migi7 === "枠上")) {
      document.getElementById("収支").textContent = "+" + betMoney * 2 + " MB";
      storage.money = money + (betMoney * 2)
      audioBeru.play();
    //リプレイ
    } else if ((hidari7 === "枠下" && naka7 === "下段" && migi7 === "枠下") || (hidari7 === "枠上" && naka7 === "枠下" && migi7 === "枠上") || (hidari7 === "上段" && naka7 === "枠上" && migi7 === "上段") || (hidari7 === "枠下" && naka7 === "枠下" && migi7 === "上段") || (hidari7 === "上段" && naka7 === "枠下" && migi7 === "枠下")) {
      document.getElementById("収支").textContent = "+" + betMoney * 1 + " MB";
      storage.money = money + (betMoney * 1)
      audioripu.play();
    //ハズレ
    } else {
      document.getElementById("当たり").textContent = "ハズレ";
      document.getElementById("当たり").style.color = "blue";
      gameover();
    }

    betDisplay();
    if (atariHantei === "当たり" && Bonusgame === 4) {
      clearInterval(intervalHikaru);
      atariHantei = "ハズレ"
      Bonusgame = 0;
      document.getElementById("左ハナ当たり").style.zIndex = "-1";
      document.getElementById("右ハナ当たり").style.zIndex = "-1";
      if (hikariNum === 1 || hikariNum === 2 || hikariNum === 3 || hikariNum === 4 || hikariNum === 5 || hikariNum === 6) {
      audioBonus2.pause();
      audioBonus2.currentTime = 0;
      } else {
      audioBonus.pause();
      audioBonus.currentTime = 0;
      }
      isPlayed = false;
    } else if (atariHantei === "当たり" && Bonusgame === 0) {
      if (hikariNum === 1) {
        clearInterval(intervalBlue);
        intervalHikaru = setInterval(hikaruLoop, 100);
        document.getElementById("左ハナ青").style.zIndex = "-1";
        document.getElementById("右ハナ青").style.zIndex = "-1";
      } else if (hikariNum === 2) {
        clearInterval(intervalHana);
        intervalHikaru = setInterval(hikaruLoop, 100);
        document.getElementById("左花だけ").style.zIndex = "-1";
        document.getElementById("右花だけ").style.zIndex = "-1";
      } else if (hikariNum === 3) {
        clearInterval(intervalHa);
        intervalHikaru = setInterval(hikaruLoop, 100);
        document.getElementById("左葉だけ").style.zIndex = "-1";
        document.getElementById("右葉だけ").style.zIndex = "-1";
      } else if (hikariNum === 4) {
        clearInterval(intervalKahun);
        intervalHikaru = setInterval(hikaruLoop, 100);
        document.getElementById("左花粉").style.zIndex = "-1";
        document.getElementById("右花粉").style.zIndex = "-1";
      } else if (hikariNum === 5) {
        clearInterval(intervalSlow);
        intervalHikaru = setInterval(hikaruLoop, 100);
      } else if (hikariNum === 6) {
        clearInterval(intervalTentou);
        intervalHikaru = setInterval(hikaruLoop, 100);
      }
      document.getElementById("左ハナ").style.zIndex = "5";
      document.getElementById("右ハナ").style.zIndex = "5";
      Bonusgame = Bonusgame + 1;
    } else if (Bonusgame > 0) {
      Bonusgame = Bonusgame + 1;
    }
  }
}

// 左リール
function movehidariReels() {
  hidariReels.forEach((id) => {
    const el = document.getElementById(id);
    if (el) {
      let currentTop = parseFloat(el.style.top);
      currentTop += speed;

      if (currentTop >= topEnd) {
        currentTop = topStart - reelHeight;
      }

      el.style.top = Math.round(currentTop) + "px";

      if (id === "赤７左" && stop1Requested) {
        const roundedTop = Math.round(currentTop * 100) / 100;
        const matchedPosition = targetPositionsHidari.find(pos =>
          Math.abs(roundedTop - pos) < speed
        );

        if (matchedPosition == 152.35) {
          hidari7 = "枠上";
        } else if (matchedPosition == 229.9) {
          hidari7 = "上段";
        } else if (matchedPosition == 307.45) {
          hidari7 = "中段";
        } else if (matchedPosition == 385) {
          hidari7 = "下段";
        } else if (matchedPosition == 462.55) {
          hidari7 = "枠下";
        }

        if (matchedPosition !== undefined) {
          el.style.top = matchedPosition + "px";
          clearInterval(hidariReelInterval);
          stop1Requested = false;
          stop1.disabled = true;
          stop1.style.backgroundColor = "rgb(255, 120, 120)";
          if (stop2.disabled && stop3.disabled) {
            start.disabled = false;
            start.style.backgroundColor = "rgb(255, 80, 55)";
          }
          checkResult();
        }
        reelPositions.hidari["赤７左"] = el.style.top;
      }

      // 停止位置を記録
      const hidariberu = document.getElementById("ベル左");
      const hidariripu = document.getElementById("リプレイ左");
      const hidarityeri = document.getElementById("チェリー左");
      const hidarisuika = document.getElementById("スイカ左");
      if (hidari7 === "枠上") {
        hidariberu.style.top = 229.9 + "px";
        hidariripu.style.top = 307.45 + "px";
        hidarityeri.style.top = 385 + "px";
        hidarisuika.style.top = 462.55 + "px";
      } else if (hidari7 === "上段") {
        hidariberu.style.top = 307.45 + "px";
        hidariripu.style.top = 385 + "px";
        hidarityeri.style.top = 462.55 + "px";
        hidarisuika.style.top = 152.35 + "px";
      } else if (hidari7 === "中段") {
        hidariberu.style.top = 385 + "px";
        hidariripu.style.top = 462.55 + "px";
        hidarityeri.style.top = 152.35 + "px";
        hidarisuika.style.top = 229.9 + "px";
      } else if (hidari7 === "下段") {
        hidariberu.style.top = 462.55 + "px";
        hidariripu.style.top = 152.35 + "px";
        hidarityeri.style.top = 229.9 + "px";
        hidarisuika.style.top = 307.45 + "px";
      } else if (hidari7 === "枠下") {
        hidariberu.style.top = 152.35 + "px";
        hidariripu.style.top = 229.9 + "px";
        hidarityeri.style.top = 307.45 + "px";
        hidarisuika.style.top = 385 + "px";
      }
      reelPositions.hidari["ベル左"] = hidariberu.style.top;
      reelPositions.hidari["リプレイ左"] = hidariripu.style.top;
      reelPositions.hidari["チェリー左"] = hidarityeri.style.top;
      reelPositions.hidari["スイカ左"] = hidarisuika.style.top;
       
    }
  });
}

// 中リール
function movenakaReels() {
  nakaReels.forEach((id) => {
    const el = document.getElementById(id);
    if (el) {
      let currentTop = parseFloat(el.style.top);
      currentTop += speed;

      if (currentTop >= topEnd) {
        currentTop = topStart - reelHeight;
      }

      el.style.top = Math.round(currentTop) + "px";

      if (id === "赤７中" && stop2Requested) {
        const roundedTop = Math.round(currentTop * 100) / 100;
        const matchedPosition = targetPositionsNaka.find(pos =>
          Math.abs(roundedTop - pos) < speed
        );

        if (matchedPosition == 152.35) {
          naka7 = "枠上";
        } else if (matchedPosition == 229.9) {
          naka7 = "上段";
        } else if (matchedPosition == 307.45) {
          naka7 = "中段";
        } else if (matchedPosition == 385) {
          naka7 = "下段";
        } else if (matchedPosition == 462.55) {
          naka7 = "枠下";
        }

        if (matchedPosition !== undefined) {
          el.style.top = matchedPosition + "px";
          clearInterval(nakaReelInterval);
          stop2Requested = false;
          stop2.disabled = true;
          stop2.style.backgroundColor = "rgb(255, 120, 120)";
          if (stop1.disabled && stop3.disabled) {
            start.disabled = false;
            start.style.backgroundColor = "rgb(255, 80, 55)";
          }
          checkResult();
        }
        reelPositions.naka["赤７中"] = el.style.top;
      }
      const nakasuika = document.getElementById("スイカ中");
      const nakatyeri = document.getElementById("チェリー中");
      const nakaripu = document.getElementById("リプレイ中");
      const nakaberu = document.getElementById("ベル中");
      if (naka7 === "枠上") {
        nakasuika.style.top = 229.9 + "px";
        nakatyeri.style.top = 307.45 + "px";
        nakaripu.style.top = 385 + "px";
        nakaberu.style.top = 462.55 + "px";
      } else if (naka7 === "上段") {
        nakasuika.style.top = 307.45 + "px";
        nakatyeri.style.top = 385 + "px";
        nakaripu.style.top = 462.55 + "px";
        nakaberu.style.top = 152.35 + "px";
      } else if (naka7 === "中段") {
        nakasuika.style.top = 385 + "px";
        nakatyeri.style.top = 462.55 + "px";
        nakaripu.style.top = 152.35 + "px";
        nakaberu.style.top = 229.9 + "px";
      } else if (naka7 === "下段") {
        nakasuika.style.top = 462.55 + "px";
        nakatyeri.style.top = 152.35 + "px";
        nakaripu.style.top = 229.9 + "px";
        nakaberu.style.top = 307.45 + "px";
      } else if (naka7 === "枠下") {
        nakasuika.style.top = 152.35 + "px";
        nakatyeri.style.top = 229.9 + "px";
        nakaripu.style.top = 307.45 + "px";
        nakaberu.style.top = 385 + "px";
      }
      reelPositions.naka["スイカ中"] = nakasuika.style.top;
      reelPositions.naka["チェリー中"] = nakatyeri.style.top;
      reelPositions.naka["リプレイ中"] = nakaripu.style.top;
      reelPositions.naka["ベル中"] = nakaberu.style.top;
    }
  });
}

// 右リール
function movemigiReels() {
  migiReels.forEach((id) => {
    const el = document.getElementById(id);
    if (el) {
      let currentTop = parseFloat(el.style.top);
      currentTop += speed;

      if (currentTop >= topEnd) {
        currentTop = topStart - reelHeight;
      }

      el.style.top = Math.round(currentTop) + "px";

      if (id === "赤７右" && stop3Requested) {
        const roundedTop = Math.round(currentTop * 100) / 100;
        const matchedPosition = targetPositionsMigi.find(pos =>
          Math.abs(roundedTop - pos) < speed
        );

        if (matchedPosition == 152.35) {
          migi7 = "枠上";
        } else if (matchedPosition == 229.9) {
          migi7 = "上段";
        } else if (matchedPosition == 307.45) {
          migi7 = "中段";
        } else if (matchedPosition == 385) {
          migi7 = "下段";
        } else if (matchedPosition == 462.55) {
          migi7 = "枠下";
        }

        if (matchedPosition !== undefined) {
          el.style.top = matchedPosition + "px";
          clearInterval(migiReelInterval);
          stop3Requested = false;
          stop3.disabled = true;
          stop3.style.backgroundColor = "rgb(255, 120, 120)";
          if (stop1.disabled && stop2.disabled) {
            start.disabled = false;
            start.style.backgroundColor = "rgb(255, 80, 55)";
          }
          checkResult();
        }
        reelPositions.migi["赤７右"] = el.style.top;
      }
      const migiberu = document.getElementById("ベル右");
      const migiripu = document.getElementById("リプレイ右");
      const migityeri = document.getElementById("チェリー右");
      const migisuika = document.getElementById("スイカ右");
      if (migi7 === "枠上") {
        migiberu.style.top = 229.9 + "px";
        migiripu.style.top = 307.45 + "px";
        migityeri.style.top = 385 + "px";
        migisuika.style.top = 462.55 + "px";
      } else if (migi7 === "上段") {
        migiberu.style.top = 307.45 + "px";
        migiripu.style.top = 385 + "px";
        migityeri.style.top = 462.55 + "px";
        migisuika.style.top = 152.35 + "px";
      } else if (migi7 === "中段") {
        migiberu.style.top = 385 + "px";
        migiripu.style.top = 462.55 + "px";
        migityeri.style.top = 152.35 + "px";
        migisuika.style.top = 229.9 + "px";
      } else if (migi7 === "下段") {
        migiberu.style.top = 462.55 + "px";
        migiripu.style.top = 152.35 + "px";
        migityeri.style.top = 229.9 + "px";
        migisuika.style.top = 307.45 + "px";
      } else if (migi7 === "枠下") {
        migiberu.style.top = 152.35 + "px";
        migiripu.style.top = 229.9 + "px";
        migityeri.style.top = 307.45 + "px";
        migisuika.style.top = 385 + "px";
      }
      reelPositions.migi["ベル右"] = migiberu.style.top;
      reelPositions.migi["リプレイ右"] = migiripu.style.top;
      reelPositions.migi["チェリー右"] = migityeri.style.top;
      reelPositions.migi["スイカ右"] = migisuika.style.top;
    }
  });
}

const start = document.getElementById('start');
const stop1 = document.getElementById("stop1");
const stop2 = document.getElementById("stop2");
const stop3 = document.getElementById("stop3");

let atariHantei;
let hikariNum
let intervalHikaru;
let intervalKahun;
let intervalBlue;
let intervalHana;
let intervalHa;
let intervalTentou;
let intervalSlow;
let Hana = false;
let Hana2 = false;
let sisaHikari = false;
let atarime1 = false;
let atarime2 = false;
let atarime3 = false;
let atarime4 = false;


function hikaruLoop() {
  if (Hana) {
    document.getElementById("左ハナ当たり").style.zIndex = "-1";
    document.getElementById("右ハナ当たり").style.zIndex = "6";
  } else {
    document.getElementById("左ハナ当たり").style.zIndex = "6";
    document.getElementById("右ハナ当たり").style.zIndex = "-1";
  }
  Hana = !Hana;
}


const audioShitapaneru = new Audio("下パネル消灯.mp3");
const audioHana = new Audio("ハナ当たり.mp3");
const audioBonus = new Audio("ボーナス音楽.mp3");
const audioBonus2 = new Audio("ボーナス音楽２.mp3");
const audioTyeli = new Audio("チェリー.mp3");
const audioSuika = new Audio("スイカ.mp3");
const audioripu = new Audio("リプレイ.mp3");
const audioBeru = new Audio("ベル.mp3");
const audio7 = new Audio("７揃い.mp3");
const audioSisa = new Audio("シーサーの目.mp3");
const audioStart = new Audio("スタート.mp3");
const audioStop = new Audio("ストップ.mp3");
const audioSetumei = new Audio("説明.mp3");
const audioSetumeiClose = new Audio("説明閉じる.mp3");

const audioBGM = new Audio("MABDOKI.mp3");
audioBGM.loop = true;
let isPlayed = false;

// STARTボタン
start.addEventListener("click", () => {
  if (!isPlayed) {
    audioStart.play();
    audioBGM.volume = 0.5;
    audioBGM.play();
    isPlayed = true;
  }
  audioStart.volume = 0.8;
  audioStart.play();
  hidari7 = "";
  naka7 = "";
  migi7 = "";
  randomNum = Math.floor(Math.random() * 40) + 1;

  if (atarime1 === true) {
    randomNum = 121;
    atarime1 = false;
  } else if (atarime2 === true) {
    randomNum = 122;
    atarime2 = false;
  } else if (atarime3 === true) {
    randomNum = 123;
    atarime3 = false;
  } else if (atarime4 === true) {
    randomNum = 124;
    atarime4 = false;
  } else if (Bonusgame > 0) {
    randomNum = 17;
  }

  if (randomNum === 121 || randomNum === 122) {
    document.getElementById("下パネル消灯用").style.zIndex = 1;
  } else if (sisaHikari === true) {
    document.getElementById("シーサー光").style.zIndex = "4";
    document.getElementById("シーサー光2").style.zIndex = "4";
    sisaHikari = false;
  }

  // 赤７上段揃い
  if (randomNum === 1) {
    atariHantei = "当たり";
    targetPositionsHidari = [229.9];
    targetPositionsNaka = [229.9];
    targetPositionsMigi = [229.9];
  // 赤７中段揃い
  } else if (randomNum === 2) {
    atariHantei = "当たり";
    targetPositionsHidari = [307.45];
    targetPositionsNaka = [307.45];
    targetPositionsMigi = [307.45];
  // 赤７下段揃い
  } else if (randomNum === 3 || randomNum === 53) {
    atariHantei = "当たり";
    targetPositionsHidari = [385];
    targetPositionsNaka = [385];
    targetPositionsMigi = [385];
  // スイカ右下がりテンパイ当たり目
  } else if (randomNum === 4 || randomNum === 54) {
    atarime1 = true;
    if (Math.random() < 0.75) {
      document.getElementById("下パネル消灯用").style.zIndex = "3";
      audioShitapaneru.play();
    }
    targetPositionsHidari = [307.45];
    targetPositionsNaka = [229.9];
    targetPositionsMigi = [385];
  // スイカ右上がりテンパイ当たり目
  } else if (randomNum === 5 || randomNum === 55) {
    atarime2 = true;
    if (Math.random() < 0.75) {
      document.getElementById("下パネル消灯用").style.zIndex = "3";
      audioShitapaneru.play();
    }
    targetPositionsHidari = [462.55];
    targetPositionsNaka = [229.9];
    targetPositionsMigi = [462.55];
  // チェリー右下がりテンパイ当たり目
  } else if (randomNum === 94) {
    atarime3 = true;
    sisaHikari = true;
    document.getElementById("シーサー光").style.zIndex = "6";
    document.getElementById("シーサー光2").style.zIndex = "6";
    audioSisa.play();
    targetPositionsHidari = [385];
    targetPositionsNaka = [152.35];
    targetPositionsMigi = [385];
  // チェリー中段テンパイ当たり目
  } else if (randomNum === 92) {
    atarime4 = true;
    sisaHikari = true;
    document.getElementById("シーサー光").style.zIndex = "6";
    document.getElementById("シーサー光2").style.zIndex = "6";
    audioSisa.play();
    targetPositionsHidari = [462.55];
    targetPositionsNaka = [152.35];
    targetPositionsMigi = [307.45];
  // チェリー上段揃い
  } else if (randomNum === 6) {
    targetPositionsHidari = [385];
    targetPositionsNaka = [462.55];
    targetPositionsMigi = [385];
  // チェリー中段揃い
  } else if (randomNum === 7) {
    sisaHikari = true;
    document.getElementById("シーサー光").style.zIndex = "6";
    document.getElementById("シーサー光2").style.zIndex = "6";
    audioSisa.play();
    targetPositionsHidari = [462.55];
    targetPositionsNaka = [152.35];
    targetPositionsMigi = [462.55];
  // チェリー下段揃い
  } else if (randomNum === 8) {
    targetPositionsHidari = [152.35];
    targetPositionsNaka = [229.9];
    targetPositionsMigi = [152.35];
  //チェリー右下がり揃い
  } else if (randomNum === 9) {
    sisaHikari = true;
    document.getElementById("シーサー光").style.zIndex = "6";
    document.getElementById("シーサー光2").style.zIndex = "6";
    audioSisa.play();
    targetPositionsHidari = [385];
    targetPositionsNaka = [152.35];
    targetPositionsMigi = [152.35];
  // チェリー右上がり揃い
  } else if (randomNum === 10) {
    targetPositionsHidari = [152.35];
    targetPositionsNaka = [152.35];
    targetPositionsMigi = [385];
  // スイカ上段揃い
  } else if (randomNum === 11) {
    targetPositionsHidari = [307.45];
    targetPositionsNaka = [152.35];
    targetPositionsMigi = [307.45];
  // スイカ中段揃い
  } else if (randomNum === 12) {
    targetPositionsHidari = [385];
    targetPositionsNaka = [229.9];
    targetPositionsMigi = [385];
  // スイカ下段揃い
  } else if (randomNum === 13) {
    targetPositionsHidari = [462.55];
    targetPositionsNaka = [307.45];
    targetPositionsMigi = [462.55];
  // スイカ右下がり揃い
  } else if (randomNum === 14) {
    targetPositionsHidari = [307.45];
    targetPositionsNaka = [229.9];
    targetPositionsMigi = [462.55];
  // スイカ右上がり揃い
  } else if (randomNum === 15) {
    targetPositionsHidari = [462.55];
    targetPositionsNaka = [229.9];
    targetPositionsMigi = [307.45];
  // ベル上段揃い
  } else if (randomNum === 16) {
    targetPositionsHidari = [152.35];
    targetPositionsNaka = [307.45];
    targetPositionsMigi = [152.35];
  // ベル中段揃い
  } else if (randomNum === 17) {
    targetPositionsHidari = [229.9];
    targetPositionsNaka = [385];
    targetPositionsMigi = [229.9];
  // ベル下段揃い
  } else if (randomNum === 18) {
    targetPositionsHidari = [307.45];
    targetPositionsNaka = [462.55];
    targetPositionsMigi = [307.45];
  // ベル右下がり揃い
  } else if (randomNum === 19) {
    targetPositionsHidari = [152.35];
    targetPositionsNaka = [385];
    targetPositionsMigi = [307.45];
  // ベル右上がり揃い
  } else if (randomNum === 20) {
    targetPositionsHidari = [307.45];
    targetPositionsNaka = [385];
    targetPositionsMigi = [152.35];
  // リプレイ上段揃い
  } else if (randomNum === 21 || randomNum === 56) {
    targetPositionsHidari = [462.55];
    targetPositionsNaka = [385];
    targetPositionsMigi = [462.55];
  // リプレイ中段揃い
  } else if (randomNum === 22 || randomNum === 57) {
    targetPositionsHidari = [152.35];
    targetPositionsNaka = [462.55];
    targetPositionsMigi = [152.35];
  // リプレイ下段揃い
  } else if (randomNum === 23 || randomNum === 58) {
    targetPositionsHidari = [229.9];
    targetPositionsNaka = [152.35];
    targetPositionsMigi = [229.9];
  // リプレイ右下がり揃い
  } else if (randomNum === 24 || randomNum === 59) {
    targetPositionsHidari = [462.55];
    targetPositionsNaka = [462.55];
    targetPositionsMigi = [229.9];
  // リプレイ右上がり揃い
  } else if (randomNum === 25 || randomNum === 60) {
    targetPositionsHidari = [229.9];
    targetPositionsNaka = [462.55];
    targetPositionsMigi = [462.55];
  // 赤７上段テンパイハズレ
  } else if (randomNum === 26 || randomNum === 61 || randomNum === 86) {
    targetPositionsHidari = [229.9];
    targetPositionsNaka = [229.9];
    targetPositionsMigi = [152.35, 307.45, 385, 462.55];
  // 赤７中段テンパイハズレ
  } else if (randomNum === 27 || randomNum === 62 || randomNum === 87) {
    targetPositionsHidari = [307.45];
    targetPositionsNaka = [307.45];
    targetPositionsMigi = [152.35, 229.9, 385, 462.55];
  // 赤７下段テンパイハズレ
  } else if (randomNum === 28 || randomNum === 63 || randomNum === 88) {
    targetPositionsHidari = [385];
    targetPositionsNaka = [385];
    targetPositionsMigi = [152.35, 229.9, 307.45, 462.55];
  // 赤７右下がりテンパイハズレ
  } else if (randomNum === 29 || randomNum === 64 || randomNum === 89) {
    targetPositionsHidari = [229.9];
    targetPositionsNaka = [307.45];
    targetPositionsMigi = [152.35, 229.9, 307.45, 462.55];
  // 赤７右上がりテンパイハズレ
  } else if (randomNum === 30 || randomNum === 65 || randomNum === 90) {
    targetPositionsHidari = [385];
    targetPositionsNaka = [307.45];
    targetPositionsMigi = [152.35, 307.45, 385, 462.55];
  // チェリー上段テンパイハズレ
  } else if (randomNum === 31 || randomNum === 66 || randomNum === 91) {
    targetPositionsHidari = [385];
    targetPositionsNaka = [462.55];
    targetPositionsMigi = [152.35, 229.9, 307.45, 462.55];
  // チェリー中段テンパイハズレ
  } else if (randomNum === 32 || randomNum === 67 || randomNum === 52) {
    targetPositionsHidari = [462.55];
    targetPositionsNaka = [152.35];
    targetPositionsMigi = [152.35, 229.9, 385];
  // チェリー下段テンパイハズレ
  } else if (randomNum === 33 || randomNum === 68 || randomNum === 93) {
    targetPositionsHidari = [152.35];
    targetPositionsNaka = [229.9];
    targetPositionsMigi = [229.9, 307.45, 385, 462.55];
  //チェリー右下がりテンパイハズレ
  } else if (randomNum === 34 || randomNum === 69 || randomNum === 51) {
    targetPositionsHidari = [385];
    targetPositionsNaka = [152.35];
    targetPositionsMigi = [229.9, 307.45, 462.55];
  // チェリー右上がりテンパイハズレ
  } else if (randomNum === 35 || randomNum === 70 || randomNum === 95) {
    targetPositionsHidari = [152.35];
    targetPositionsNaka = [152.35];
    targetPositionsMigi = [152.35, 229.9, 307.45, 462.55];
  // スイカ上段テンパイハズレ
  } else if (randomNum === 36 || randomNum === 71 || randomNum === 96) {
    targetPositionsHidari = [307.45];
    targetPositionsNaka = [152.35];
    targetPositionsMigi = [152.35, 229.9, 385, 462.55];
  // スイカ中段テンパイハズレ
  } else if (randomNum === 37 || randomNum === 72 || randomNum === 97) {
    targetPositionsHidari = [385];
    targetPositionsNaka = [229.9];
    targetPositionsMigi = [152.35, 229.9, 307.45, 462.55];
  // スイカ下段テンパイハズレ
  } else if (randomNum === 38 || randomNum === 73 || randomNum === 98) {
    targetPositionsHidari = [462.55];
    targetPositionsNaka = [307.45];
    targetPositionsMigi = [152.35, 229.9, 307.45, 385];
  // スイカ右下がりテンパイハズレ
  } else if (randomNum === 39 || randomNum === 74 || randomNum === 99) {
    targetPositionsHidari = [307.45];
    targetPositionsNaka = [229.9];
    targetPositionsMigi = [152.35, 229.9, 307.45];
  // スイカ右上がりテンパイハズレ
  } else if (randomNum === 40 || randomNum === 75 || randomNum === 100) {
    targetPositionsHidari = [462.55];
    targetPositionsNaka = [229.9];
    targetPositionsMigi = [152.35, 229.9, 385];
  // ベル上段テンパイハズレ
  } else if (randomNum === 41 || randomNum === 76 || randomNum === 101 || randomNum === 120) {
    targetPositionsHidari = [152.35];
    targetPositionsNaka = [307.45];
    targetPositionsMigi = [229.9, 307.45, 385, 462.55];
  // ベル中段テンパイハズレ
  } else if (randomNum === 42 || randomNum === 77 || randomNum === 102 || randomNum === 119) {
    targetPositionsHidari = [229.9];
    targetPositionsNaka = [385];
    targetPositionsMigi = [152.35, 307.45, 385, 462.55];
  // ベル下段テンパイハズレ
  } else if (randomNum === 43 || randomNum === 78 || randomNum === 103 || randomNum === 118) {
    targetPositionsHidari = [307.45];
    targetPositionsNaka = [462.55];
    targetPositionsMigi = [152.35, 229.9, 385, 462.55];
  // ベル右下がりテンパイハズレ
  } else if (randomNum === 44 || randomNum === 79 || randomNum === 104 || randomNum === 117) {
    targetPositionsHidari = [152.35];
    targetPositionsNaka = [385];
    targetPositionsMigi = [152.35, 229.9, 385, 462.55];
  // ベル右上がりテンパイハズレ
  } else if (randomNum === 45 || randomNum === 80 || randomNum === 105 || randomNum === 116) {
    targetPositionsHidari = [307.45];
    targetPositionsNaka = [385];
    targetPositionsMigi = [229.9, 307.45, 385, 462.55];
  // リプレイ上段テンパイハズレ
  } else if (randomNum === 46 || randomNum === 81 || randomNum === 106 || randomNum === 115) {
    targetPositionsHidari = [462.55];
    targetPositionsNaka = [385];
    targetPositionsMigi = [152.35, 229.9, 307.45, 385];
  // リプレイ中段テンパイハズレ
  } else if (randomNum === 47 || randomNum === 82 || randomNum === 107 || randomNum === 114) {
    targetPositionsHidari = [152.35];
    targetPositionsNaka = [462.55];
    targetPositionsMigi = [229.9, 307.45, 385, 462.55];
  // リプレイ下段テンパイハズレ
  } else if (randomNum === 48 || randomNum === 83 || randomNum === 108 || randomNum === 113) {
    targetPositionsHidari = [229.9];
    targetPositionsNaka = [152.35];
    targetPositionsMigi = [152.35, 307.45, 385, 462.55];
  // リプレイ右下がりテンパイハズレ
  } else if (randomNum === 49 || randomNum === 84 || randomNum === 109 || randomNum === 112) {
    targetPositionsHidari = [462.55];
    targetPositionsNaka = [462.55];
    targetPositionsMigi = [152.35, 307.45, 385, 462.55];
  // リプレイ右上がりテンパイハズレ
  } else if (randomNum === 50 || randomNum === 85 || randomNum === 110 || randomNum === 111) {
    targetPositionsHidari = [229.9];
    targetPositionsNaka = [462.55];
    targetPositionsMigi = [152.35, 229.9, 307.45, 385];
  // 赤７右下がり揃い
  } else if (randomNum === 121) {
    atariHantei = "当たり";
    targetPositionsHidari = [229.9];
    targetPositionsNaka = [307.45];
    targetPositionsMigi = [385];
  // 赤７右上がり揃い
  } else if (randomNum === 122) {
    atariHantei = "当たり";
    targetPositionsHidari = [385];
    targetPositionsNaka = [307.45];
    targetPositionsMigi = [229.9];
  } else if (randomNum === 123) {
    atariHantei = "当たり";
    targetPositionsHidari = [229.9];
    targetPositionsNaka = [229.9];
    targetPositionsMigi = [229.9];
  } else if (randomNum === 124) {
    atariHantei = "当たり";
    targetPositionsHidari = [307.45];
    targetPositionsNaka = [307.45];
    targetPositionsMigi = [307.45];
  }

  if (atariHantei === "当たり" && Bonusgame === 0) {
    audioHana.play();
    hikariNum = Math.floor(Math.random() * 20) + 1
    if (hikariNum === 1) {
      intervalBlue = setInterval(() => {
      if (Hana2) {
        document.getElementById("左ハナ青").style.zIndex = "-1";
        document.getElementById("右ハナ青").style.zIndex = "8";
      } else {
        document.getElementById("左ハナ青").style.zIndex = "8";
        document.getElementById("右ハナ青").style.zIndex = "-1";
      }
      Hana2 = !Hana2;
      }, 100);
    } else if (hikariNum === 2) {
      intervalHana = setInterval(() => {
      if (Hana2) {
        document.getElementById("左花だけ").style.zIndex = "-1";
        document.getElementById("右花だけ").style.zIndex = "8";
      } else {
        document.getElementById("左花だけ").style.zIndex = "8";
        document.getElementById("右花だけ").style.zIndex = "-1";
      }
      Hana2 = !Hana2;
      }, 100);
    } else if (hikariNum === 3) {
      intervalHa = setInterval(() => {
      if (Hana2) {
        document.getElementById("左葉だけ").style.zIndex = "-1";
        document.getElementById("右葉だけ").style.zIndex = "8";
      } else {
        document.getElementById("左葉だけ").style.zIndex = "8";
        document.getElementById("右葉だけ").style.zIndex = "-1";
      }
      Hana2 = !Hana2;
      }, 100);
    } else if (hikariNum === 4) {
      intervalKahun = setInterval(() => {
      if (Hana2) {
        document.getElementById("左花粉").style.zIndex = "-1";
        document.getElementById("右花粉").style.zIndex = "8";
      } else {
        document.getElementById("左花粉").style.zIndex = "8";
        document.getElementById("右花粉").style.zIndex = "-1";
      }
      Hana2 = !Hana2;
      }, 100);
    } else if (hikariNum === 5) {
      intervalSlow = setInterval(() => {
      if (Hana2) {
        document.getElementById("左ハナ当たり").style.zIndex = "-1";
        document.getElementById("右ハナ当たり").style.zIndex = "8";
      } else {
        document.getElementById("左ハナ当たり").style.zIndex = "8";
        document.getElementById("右ハナ当たり").style.zIndex = "-1";
      }
      Hana2 = !Hana2;
      }, 600);
    } else if (hikariNum === 6) {
      document.getElementById("左ハナ当たり").style.zIndex = "8";
      document.getElementById("右ハナ当たり").style.zIndex = "8";
    } else {
      intervalHikaru = setInterval(hikaruLoop, 100);
    }
  }


  let money = Number(localStorage.getItem("money")) || 0;
  let betMoney = Number(localStorage.getItem("betMoney")) || 0;
  if ((betMoney === 1000 && money < 1000) || (betMoney === 5000 && money < 5000) || (betMoney === 10000 && money < 10000) || (betMoney === 100000 && money < 100000) || (betMoney === 1000000 && money < 1000000)) {
    window.alert("所持MBが少ないため賭けることができません。");
  } else {
    storage.money = money - betMoney;
    betDisplay();
    resetReelPositionsFromLast(); // ← 停止位置からスタート
    hidariReelInterval = setInterval(movehidariReels, 1);
    nakaReelInterval = setInterval(movenakaReels, 1);
    migiReelInterval = setInterval(movemigiReels, 1);
    start.disabled = true;
    stop1.disabled = false;
    stop2.disabled = false;
    stop3.disabled = false;
    start.style.backgroundColor = "rgb(170, 170, 170)";
    stop1.style.backgroundColor = "rgb(170, 185, 255)";
    stop2.style.backgroundColor = "rgb(170, 185, 255)";
    stop3.style.backgroundColor = "rgb(170, 185, 255)";

    document.getElementById("当たり").textContent = "";
    document.getElementById("収支").textContent = "";
  }
});

// STOPボタン
stop1.disabled = true;
stop2.disabled = true;
stop3.disabled = true;

stop1.addEventListener("click", () => {
  audioStop.volume = 0.8;
  audioStop.play();
  stop1Requested = true;
});
stop2.addEventListener("click", () => {
  audioStop.volume = 0.8;
  audioStop.play();
  stop2Requested = true;
});
stop3.addEventListener("click", () => {
  audioStop.volume = 0.8;
  audioStop.play();
  stop3Requested = true;
});


//レート変更
const rateChange = document.getElementById("レート変更");
rateChange.addEventListener("click", () => {
  window.location.href = "slotKakurituMB.html";
});


//台変更
const slotChange = document.getElementById("台変更");
slotChange.addEventListener("click", () => {
  window.location.href = "slotChange.html"
});


//ゲーム終了
const gameEnd = document.getElementById("ゲーム終了");
gameEnd.addEventListener("click", () => {
  window.location.href = "../Home/index.html"
})

//説明
const slotExplain = document.getElementById("オキドキ遊び方");
slotExplain.addEventListener("click", () => {
  audioSetumei.play();
  document.getElementById("オキドキ説明画像").style.display = "block"
  nextExplain.style.display = "block";
  closeExplain.style.display = "block";
})

//次へ
const nextExplain = document.getElementById("オキドキ説明次へ");
nextExplain.addEventListener("click", () => {
  audioSetumeiClose.play();
  document.getElementById("オキドキ説明画像").style.display = "none";
  document.getElementById("オキドキ説明画像２").style.display = "block";
  nextExplain.style.display = "none";
  backExplain.style.display = "block";
})

//前へ
const backExplain = document.getElementById("オキドキ説明前へ");
backExplain.addEventListener("click", () => {
  audioSetumeiClose.play();
  document.getElementById("オキドキ説明画像２").style.display = "none";
  document.getElementById("オキドキ説明画像").style.display = "block";
  backExplain.style.display = "none";
  nextExplain.style.display = "block";
})

//閉じる
const closeExplain = document.getElementById("オキドキ説明閉じる");
closeExplain.addEventListener("click", () => {
  audioSetumeiClose.play();
  document.getElementById("オキドキ説明画像").style.display = "none";
  document.getElementById("オキドキ説明画像２").style.display = "none";
  nextExplain.style.display = "none";
  backExplain.style.display = "none";
  closeExplain.style.display = "none";
})


const storage = localStorage;
 
// 初期所持金
// storage.money = 1000000;
 
 
// 所持金、賭け金表示関数
const betDisplay = () => {
    document.getElementById("ownMoney").textContent = "所持MB：" + storage.money;
    document.getElementById("planBetMoney").textContent = "レート：" + storage.betMoney + " MB";
}

betDisplay();


// ゲームオーバーの表示を行う関数
const gameover = () => {
    // 所持金が1000以下の時、ゲームオーバー
    if (storage.money < 1000){
        document.getElementById("gameover").style.display = "block";
        document.getElementById("goclose").style.display = "block";
        start.disabled = true;
    }
}