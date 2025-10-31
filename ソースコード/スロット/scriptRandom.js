
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
const speed = 2;

let hidariReelInterval;
let nakaReelInterval;
let migiReelInterval;

let stop1Requested = false;
let stop2Requested = false;
let stop3Requested = false;

let hidari7;
let naka7;
let migi7;

const targetPositions = [152.35, 229.9, 307.45, 385, 462.55];

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
    //画像1
    if ((imageNo === "画像1.png") && (hidari7 === "中段" && naka7 === "中段" && migi7 === "中段")) {
      document.getElementById("収支").textContent = "+" + betMoney * 3 + " MB";
      storage.money = money + (betMoney * 3)
    //画像2
    } else if ((imageNo === "画像2.png") && (hidari7 === "上段" && naka7 === "上段" && migi7 === "上段")) {
      document.getElementById("収支").textContent = "+" + betMoney * 3 + " MB";
      storage.money = money + (betMoney * 3)
    //画像3
    } else if ((imageNo === "画像3.png") && (hidari7 === "下段" && naka7 === "中段" && migi7 === "上段")) {
      document.getElementById("収支").textContent = "+" + betMoney * 3 + " MB";
      storage.money = money + (betMoney * 3)
    //画像4
    } else if ((imageNo === "画像4.png") && (hidari7 === "下段" && naka7 === "下段" && migi7 === "下段")) {
      document.getElementById("収支").textContent = "+" + betMoney * 1 + " MB";
      storage.money = money + (betMoney * 1)
    //画像5
    } else if ((imageNo === "画像5.png") && (hidari7 === "上段" && naka7 === "中段" && migi7 === "下段")) {
      document.getElementById("収支").textContent = "+" + betMoney * 1 + " MB";
      storage.money = money + (betMoney * 1)
    //画像6
    } else if ((imageNo === "画像6.png") && (hidari7 === "下段" && naka7 === "枠下" && migi7 === "下段")) {
      document.getElementById("収支").textContent = "+" + betMoney * 10 + " MB";
      storage.money = money + (betMoney * 10)
    //画像7
    } else if ((imageNo === "画像7.png") && (hidari7 === "枠下" && naka7 === "枠上" && migi7 === "枠下")) {
      document.getElementById("収支").textContent = "+" + betMoney * 1 + " MB";
      storage.money = money + (betMoney * 1)
    //画像8
    } else if ((imageNo === "画像8.png") && (hidari7 === "枠上" && naka7 === "枠上" && migi7 === "下段")) {
      document.getElementById("収支").textContent = "+" + betMoney * 3 + " MB";
      storage.money = money + (betMoney * 3)
    //画像9
    } else if ((imageNo === "画像9.png") && (hidari7 === "下段" && naka7 === "枠上" && migi7 === "枠上")) {
      document.getElementById("収支").textContent = "+" + betMoney * 3 + " MB";
      storage.money = money + (betMoney * 3)
    //画像10
    } else if ((imageNo === "画像10.png") && (hidari7 === "中段" && naka7 === "上段" && migi7 === "下段")) {
      document.getElementById("収支").textContent = "+" + betMoney * 3 + " MB";
      storage.money = money + (betMoney * 3)
    //画像11
    } else if ((imageNo === "画像11.png") && (hidari7 === "下段" && naka7 === "上段" && migi7 === "下段")) {
      document.getElementById("収支").textContent = "+" + betMoney * 3 + " MB";
      storage.money = money + (betMoney * 3)
    //画像12
    } else if ((imageNo === "画像12.png") && (hidari7 === "枠上" && naka7 === "下段" && migi7 === "枠上")) {
      document.getElementById("収支").textContent = "+" + betMoney * 10 + " MB";
      storage.money = money + (betMoney * 10)
    //画像13
    } else if ((imageNo === "画像13.png") && (hidari7 === "枠下" && naka7 === "上段" && migi7 === "枠下")) {
      document.getElementById("収支").textContent = "+" + betMoney * 10 + " MB";
      storage.money = money + (betMoney * 10)
    //画像14
    } else if ((imageNo === "画像14.png") && (hidari7 === "枠下" && naka7 === "枠下" && migi7 === "上段")) {
      document.getElementById("収支").textContent = "+" + betMoney * 1 + " MB";
      storage.money = money + (betMoney * 1)
    //画像15
    } else if ((imageNo === "画像15.png") && (hidari7 === "上段" && naka7 === "枠下" && migi7 === "枠上")) {
      document.getElementById("収支").textContent = "+" + betMoney * 10 + " MB";
      storage.money = money + (betMoney * 10)
    //画像16
    } else if ((imageNo === "画像16.png") && (hidari7 === "上段" && naka7 === "下段" && migi7 === "枠上")) {
      document.getElementById("収支").textContent = "+" + betMoney * 3 + " MB";
      storage.money = money + (betMoney * 3)
    //画像17
    } else if ((imageNo === "画像17.png") && (hidari7 === "枠下" && naka7 === "枠上" && migi7 === "中段")) {
      document.getElementById("収支").textContent = "+" + betMoney * 3 + " MB";
      storage.money = money + (betMoney * 3)
    //画像18
    } else if ((imageNo === "画像18.png") && ((hidari7 === "上段" && naka7 === "上段" && migi7 === "上段") || (hidari7 === "中段" && naka7 === "中段" && migi7 === "中段") || (hidari7 === "下段" && naka7 === "下段" && migi7 === "下段") || (hidari7 === "上段" && naka7 === "中段" && migi7 === "下段") || (hidari7 === "下段" && naka7 === "中段" && migi7 === "上段"))) {
      document.getElementById("収支").textContent = "+" + betMoney * 1 + " MB";
      storage.money = money + (betMoney * 1)
    //画像19
    } else if ((imageNo === "画像19.png") && ((hidari7 === "下段" && naka7 === "枠下" && migi7 === "下段") || (hidari7 === "枠下" && naka7 === "枠上" && migi7 === "枠下") || (hidari7 === "枠上" && naka7 === "上段" && migi7 === "枠上") || (hidari7 === "下段" && naka7 === "枠上" && migi7 === "枠上") || (hidari7 === "枠上" && naka7 === "枠上" && migi7 === "下段"))) {
      document.getElementById("収支").textContent = "+" + betMoney * 1 + " MB";
      storage.money = money + (betMoney * 1)
    //画像20
    } else if ((imageNo === "画像20.png") && ((hidari7 === "中段" && naka7 === "枠上" && migi7 === "中段") || (hidari7 === "下段" && naka7 === "上段" && migi7 === "下段") || (hidari7 === "枠下" && naka7 === "中段" && migi7 === "枠下") || (hidari7 === "中段" && naka7 === "上段" && migi7 === "枠下") || (hidari7 === "枠下" && naka7 === "上段" && migi7 === "中段"))) {
      document.getElementById("収支").textContent = "+" + betMoney * 1 + " MB";
      storage.money = money + (betMoney * 1)
    //画像21
    } else if ((imageNo === "画像21.png") && ((hidari7 === "枠上" && naka7 === "中段" && migi7 === "枠上") || (hidari7 === "上段" && naka7 === "下段" && migi7 === "上段") || (hidari7 === "中段" && naka7 === "枠下" && migi7 === "中段") || (hidari7 === "枠上" && naka7 === "下段" && migi7 === "中段") || (hidari7 === "中段" && naka7 === "下段" && migi7 === "枠上"))) {
      document.getElementById("収支").textContent = "+" + betMoney * 1 + " MB";
      storage.money = money + (betMoney * 1)
    //画像22
    } else if ((imageNo === "画像22.png") && ((hidari7 === "枠下" && naka7 === "下段" && migi7 === "枠下") || (hidari7 === "枠上" && naka7 === "枠下" && migi7 === "枠上") || (hidari7 === "上段" && naka7 === "枠上" && migi7 === "上段") || (hidari7 === "枠下" && naka7 === "枠下" && migi7 === "上段") || (hidari7 === "上段" && naka7 === "枠下" && migi7 === "枠下"))) {
      document.getElementById("収支").textContent = "+" + betMoney * 1 + " MB";
      storage.money = money + (betMoney * 1)
    //画像23
    } else if ((imageNo === "画像23.png") && (hidari7 === "中段" && naka7 === "下段" && migi7 === "中段")) {
      document.getElementById("収支").textContent = "+" + betMoney * 1 + " MB";
      storage.money = money + (betMoney * 1)
    //画像24
    } else if ((imageNo === "画像24.png") && (hidari7 === "上段" && naka7 === "中段" && migi7 === "上段")) {
      document.getElementById("収支").textContent = "+" + betMoney * 1 + " MB";
      storage.money = money + (betMoney * 1)
    //画像25
    } else if ((imageNo === "画像25.png") && (hidari7 === "中段" && naka7 === "上段" && migi7 === "中段")) {
      document.getElementById("収支").textContent = "+" + betMoney * 1 + " MB";
      storage.money = money + (betMoney * 1)
    //画像26
    } else if ((imageNo === "画像26.png") && (hidari7 === "枠下" && naka7 === "枠下" && migi7 === "枠下")) {
      document.getElementById("収支").textContent = "+" + betMoney * 1 + " MB";
      storage.money = money + (betMoney * 1)
    //画像27
    } else if ((imageNo === "画像27.png") && (hidari7 === "枠上" && naka7 === "枠上" && migi7 === "枠下")) {
      document.getElementById("収支").textContent = "+" + betMoney * 1 + " MB";
      storage.money = money + (betMoney * 1)
    //画像28
    } else if ((imageNo === "画像28.png") && (hidari7 === "下段" && naka7 === "枠下" && migi7 === "枠下")) {
      document.getElementById("収支").textContent = "+" + betMoney * 1 + " MB";
      storage.money = money + (betMoney * 1)
    //画像29
    } else if ((imageNo === "画像29.png") && (hidari7 === "中段" && naka7 === "中段" && migi7 === "枠下")) {
      document.getElementById("収支").textContent = "+" + betMoney * 1 + " MB";
      storage.money = money + (betMoney * 1)
    //画像30
    } else if ((imageNo === "画像30.png") && (hidari7 === "枠上" && naka7 === "枠下" && migi7 === "中段")) {
      document.getElementById("収支").textContent = "+" + betMoney * 1 + " MB";
      storage.money = money + (betMoney * 1)
    //ハズレ
    } else {
      document.getElementById("当たり").textContent = "ハズレ";
      document.getElementById("当たり").style.color = "blue";
      gameover();
    }
    if (document.getElementById("当たり").textContent === "ハズレ") {
      const audioHazure = new Audio("外れ.mp3");
      audioHazure.play();
    } else {
      const audioAtari = new Audio("当たり.mp3");
      audioAtari.play();
    }
    betDisplay();
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
        const matchedPosition = targetPositions.find(pos =>
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
        const matchedPosition = targetPositions.find(pos =>
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
        const matchedPosition = targetPositions.find(pos =>
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


const audioBGM = new Audio("MISCUP.mp3");
audioBGM.loop = true;
let isPlayed = false;

const audioStart = new Audio("スタート.mp3");
const audioStop = new Audio("ストップ.mp3");

// STARTボタン
start.addEventListener("click", () => {
  if (!isPlayed) {
    audioStart.play();
    audioBGM.volume = 0.5;
    audioBGM.play();
    isPlayed = true;
  }
  hidari7 = "";
  naka7 = "";
  migi7 = "";
  let money = Number(localStorage.getItem("money")) || 0;
  let betMoney = Number(localStorage.getItem("betMoney")) || 0;
  if ((betMoney === 1000 && money < 1000) || (betMoney === 5000 && money < 5000) || (betMoney === 10000 && money < 10000) || (betMoney === 100000 && money < 100000) || (betMoney === 1000000 && money < 1000000)) {
    window.alert("所持MBが少ないため賭けることができません。");
  } else {
    storage.money = money - betMoney;
    betDisplay();
    document.querySelector("#説明").style.display = "none";
    showRandomImage();
    resetReelPositionsFromLast();
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
  audioStop.volume = 0.7;
  audioStop.play();
  stop1Requested = true;
});
stop2.addEventListener("click", () => {
  audioStop.volume = 0.7;
  audioStop.play();
  stop2Requested = true;
});
stop3.addEventListener("click", () => {
  audioStop.volume = 0.7;
  audioStop.play();
  stop3Requested = true;
});


//レート変更
const rateChange = document.getElementById("レート変更");
rateChange.addEventListener("click", () => {
  window.location.href = "slotRandomMB.html";
  document.getElementById("#説明").style.display = "block";
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


const audioSetumei = new Audio("説明.mp3");
const audioSetumeiClose = new Audio("説明閉じる.mp3");

//説明
const slotExplain = document.getElementById("ランダム遊び方");
slotExplain.addEventListener("click", () => {
  audioSetumei.play();
  document.getElementById("ランダム説明").style.display = "block"
  closeExplain.style.display = "block";
})

//閉じる
const closeExplain = document.getElementById("ランダム説明閉じる");
closeExplain.addEventListener("click", () => {
  audioSetumeiClose.play();
  document.getElementById("ランダム説明").style.display = "none";
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


let imageNo = "";

function showRandomImage() {
  const randomNum = Math.floor(Math.random() * 30) + 1;
  // const randomNum = 30; // テスト用コード（画像決定）

  switch (randomNum) {
    case 1:
      imageNo = "画像1.png";
      break;
    case 2:
      imageNo = "画像2.png";
      break;
    case 3:
      imageNo = "画像3.png";
      break;
    case 4:
      imageNo = "画像4.png";
      break;
    case 5:
      imageNo = "画像5.png";
      break;
    case 6:
      imageNo = "画像6.png";
      break;
    case 7:
      imageNo = "画像7.png";
      break;
    case 8:
      imageNo = "画像8.png";
      break;
    case 9:
      imageNo = "画像9.png";
      break;
    case 10:
      imageNo = "画像10.png";
      break;
    case 11:
      imageNo = "画像11.png";
      break;
    case 12:
      imageNo = "画像12.png";
      break;
    case 13:
      imageNo = "画像13.png";
      break;
    case 14:
      imageNo = "画像14.png";
      break;
    case 15:
      imageNo = "画像15.png";
      break;
    case 16:
      imageNo = "画像16.png";
      break;
    case 17:
      imageNo = "画像17.png";
      break;
    case 18:
      imageNo = "画像18.png";
      break;
    case 19:
      imageNo = "画像19.png";
      break;
    case 20:
      imageNo = "画像20.png";
      break;
    case 21:
      imageNo = "画像21.png";
      break;
    case 22:
      imageNo = "画像22.png";
      break;
    case 23:
      imageNo = "画像23.png";
      break;
    case 24:
      imageNo = "画像24.png";
      break;
    case 25:
      imageNo = "画像25.png";
      break;
    case 26:
      imageNo = "画像26.png";
      break;
    case 27:
      imageNo = "画像27.png";
      break;
    case 28:
      imageNo = "画像28.png";
      break;
    case 29:
      imageNo = "画像29.png";
      break;
    case 30:
      imageNo = "画像30.png";
      break;
    default:
      break;
  }



  document.getElementById("カットイン").innerHTML =`<img src="${imageNo}" style="height:180px; width:448px">`;

}


// ゲームオーバーの表示を行う関数
const gameover = () => {
    // 所持金が1000以下の時、ゲームオーバー
    if (storage.money < 1000){
        document.getElementById("gameover").style.display = "block";
        document.getElementById("goclose").style.display = "block";
        start.disabled = true;
    }
}