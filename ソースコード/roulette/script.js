// 初期所持金の設定
const storage = localStorage;
if (!storage.getItem('money')) {
  storage.setItem('money', '1000000');
}

let betMoney = 1000;           // 単位ベット金額（増減可能）
let placedBets = {};           // 賭けた内容の管理
let lastPlacedBets = {};

// 所持金の取得・設定関数
function getMoney() {
  return Number(storage.getItem('money'));
}
function setMoney(amount) {
  storage.setItem('money', String(amount));
}

// ページ読み込み後の処理
document.addEventListener('DOMContentLoaded', () => {
  const okBtn = document.getElementById('ok');
  const roulette = document.getElementById('roulette');
  const ball = document.getElementById('ball');
  const startBtn = document.getElementById('start');
  const planBetMoneySpan = document.getElementById('planBetMoney');
  const winningNumberDisplay = document.getElementById('winningNumberDisplay');
  const rouletteSize = roulette.offsetWidth;
  const centerX = rouletteSize / 2;
  const centerY = rouletteSize / 2;


  const ruleBtn = document.getElementById('rule');
  const closeBtn = document.getElementById('close');
  const img = document.getElementById('rouletterule');
  const overlay = document.getElementById('overlay');

  //遊び方
  ruleBtn.addEventListener('click', () => {
    img.style.display = 'block';
    closeBtn.style.display = 'inline-block';
    ruleBtn.style.display = 'none';
    overlay.style.display = 'block';
  });
  closeBtn.addEventListener('click', closeImage);

  overlay.addEventListener('click', closeImage);

  function closeImage() {
    img.style.display = 'none';
    closeBtn.style.display = 'none';
    ruleBtn.style.display = 'inline-block';
    overlay.style.display = 'none';
  }


  let ballX, ballY, ballStartAngle, radius;

  // ベット金額表示の更新
  function betDisplay() {
    const ownMoneySpan = document.getElementById('ownMoney');
    ownMoneySpan.textContent = `所持金:${getMoney().toLocaleString()}MB`;

    const totalBet = Object.values(placedBets).reduce((sum, val) => sum + val, 0);
    planBetMoneySpan.textContent = `合計賭け金:${totalBet.toLocaleString()}MB`;

    const betUnitDisplay = document.getElementById('betUnitDisplay');
    if (betUnitDisplay) {
      betUnitDisplay.textContent = `現在の賭け金${betMoney.toLocaleString()}MB`;
    }
  }
  // ベット金額調整ボタンの設定
  document.getElementById('upLeft').addEventListener('click', () => {
    if (betMoney + 1000 <= getMoney()) betMoney += 1000;
    betDisplay();
    updateBetSummary();
  });
  document.getElementById('upRight').addEventListener('click', () => {
    if (betMoney + 10000 <= getMoney()) betMoney += 10000;
    betDisplay();
    updateBetSummary();
  });
  document.getElementById('downLeft').addEventListener('click', () => {
    if (betMoney - 1000 >= 1000) betMoney -= 1000;
    betDisplay();
    updateBetSummary();
  });
  document.getElementById('downRight').addEventListener('click', () => {
    if (betMoney - 10000 >= 1000) betMoney -= 10000;
    betDisplay();
    updateBetSummary();
  });

  //追加
  document.getElementById('superHigh').addEventListener('click', () => {
    if (betMoney + 100000 <= getMoney()) betMoney += 100000;
    betDisplay();
    updateBetSummary();
  });
  document.getElementById('superLow').addEventListener('click', () => {
    if (betMoney - 100000 >= 1000) betMoney -= 100000;
    betDisplay();
    updateBetSummary();
  });
  document.getElementById('allIn').addEventListener('click', () => {
    const money = getMoney();
    if (money >= 1000) {
      betMoney = money;
      betDisplay();
      updateBetSummary();
    }
  });

  // ボールの初期角度と半径を計算する初期化関数
  function initBallPosition() {
    ballX = ball.offsetLeft + ball.offsetWidth / 2;
    ballY = ball.offsetTop + ball.offsetHeight / 2;
    ballStartAngle = Math.atan2(ballY - centerY, ballX - centerX);
    radius = Math.sqrt((ballX - centerX) ** 2 + (ballY - centerY) ** 2);
  };
  initBallPosition();

  // ルーレット番号と角度
  const numbers = [
    0, 32, 15, 19, 4, 21, 2, 25, 17, 34,
    6, 27, 13, 36, 11, 30, 8, 23, 10, 5,
    24, 16, 33, 1, 20, 14, 31, 9, 22, 18,
    29, 7, 28, 12, 35, 3, 26
  ];

  const segmentAngle = 360 / numbers.length;
  const ROTATION_DURATION = 8000;
  let targetAngle = 0;

  // イージング関数（減速用）
  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  // 座標回転関数
  function rotatePoint(x, y, cx, cy, angleDeg) {
    const angleRad = angleDeg * Math.PI / 180;
    const dx = x - cx;
    const dy = y - cy;
    return {
      x: cx + dx * Math.cos(angleRad) - dy * Math.sin(angleRad),
      y: cy + dx * Math.sin(angleRad) + dy * Math.cos(angleRad)
    };
  }

  // 各数字の座標を計算してキャッシュ
  const numberPositions = {};
  const imageCenterX = 305;
  const imageCenterY = 305;
  const radiusPx = 211.24;
  numbers.forEach((num, i) => {
    const angleDeg = i * segmentAngle;
    const angleRad = angleDeg * Math.PI / 180;
    const x = imageCenterX + radiusPx * Math.cos(angleRad - Math.PI / 2);
    const y = imageCenterY + radiusPx * Math.sin(angleRad - Math.PI / 2);
    numberPositions[num] = { x, y };
  });

  let animationId = null;
  let startTime = null;

  function animate(timestamp) {
    if (!startTime) startTime = timestamp;
    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / ROTATION_DURATION, 1);
    const easedProgress = easeOutCubic(progress);
    const currentAngle = easedProgress * targetAngle;

    roulette.style.transform = `rotate(${currentAngle}deg)`;

    // ボールは反対方向に3倍速で回転させる
    const ballAngleRad = ballStartAngle - (currentAngle * Math.PI / 180) * 3;
    const ballPosX = centerX + radius * Math.cos(ballAngleRad);
    const ballPosY = centerY + radius * Math.sin(ballAngleRad);

    ball.style.left = `${ballPosX - ball.offsetWidth / 2}px`;
    ball.style.top = `${ballPosY - ball.offsetHeight / 2}px`;

    if (progress < 1) {
      animationId = requestAnimationFrame(animate);
    } else {
      animationId = null;
      startTime = null;
      const rouletteAngle = currentAngle % 360;
      showResultByRotatedPositions(rouletteAngle);
      startBtn.disabled = false;
    }
  };

  // ルーレット開始
  /*function startRotation() {
    if (animationId) return;

    const resultIndex = Math.floor(Math.random() * numbers.length);
    const rotations = 5;
    targetAngle = rotations * 360 + (resultIndex * segmentAngle);

    winningNumberDisplay.style.display = 'none';
    startBtn.disabled = true;
    animationId = requestAnimationFrame(animate);
  }*/

  let currentWinNumber = null; // グローバルで保持

  function startRotation() {
    if (animationId) return;

    const resultIndex = Math.floor(Math.random() * numbers.length);
    const rotations = 5;
    targetAngle = rotations * 360 + (resultIndex * segmentAngle);

    currentWinNumber = numbers[resultIndex]; // 当たり番号を固定
    console.log("今回の当たり番号:", currentWinNumber);

    winningNumberDisplay.style.display = 'none';
    startBtn.disabled = true;

    checkWinAndAnimateKaneki(currentWinNumber);

    animationId = requestAnimationFrame(animate);
  }

  // 別関数にしてもOK
  function checkWinAndAnimateKaneki(winNumber) {
    const selectedBets = Object.keys(placedBets);
    let isWin = false;

    for (const betKey of selectedBets) {
      if (betKey.startsWith('No')) {
        const betContent = betKey.replace(/^No/, '');
        let betNumbers = [];

        if (betContent.includes('~')) {
          const [start, end] = betContent.split('~').map(Number);
          for (let i = start; i <= end; i++) betNumbers.push(i);
        } else {
          betNumbers = betContent.split('and').map(Number);
        }

        if (betNumbers.includes(winNumber)) {
          isWin = true;
          break;
        }
      } else {
        switch (betKey) {
          case 'Red':
            if ([1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36].includes(winNumber)) isWin = true;
            break;
          case 'Black':
            if ([2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35].includes(winNumber)) isWin = true;
            break;
          case 'Even':
            if (winNumber !== 0 && winNumber % 2 === 0) isWin = true;
            break;
          case 'Odd':
            if (winNumber % 2 === 1) isWin = true;
            break;
          // 他の条件ベットも同様
        }
        if (isWin) break;
      }
    }

    console.log("当たり判定:", isWin);

    // if (isWin && Math.random() < 0.9) {
    //   const kaneki = document.getElementById('kaneki');
    //   kaneki.classList.add('active');
    //   setTimeout(() => kaneki.classList.remove('active'), 4000);
    // }
  }




  /*
  ルーレットの盤面は中心を基準に、上方向（12時）を0度として角度設定 
  各数字と玉の位置は、中心からの距離（半径）と角度を三角関数（cos, sin）でだす  
  スタート時にランダムで当たり番号を選び、その番号に対応する角度まで盤面を回転させる
  */

  // ルーレットが止まった時の盤面の角度で当たり番号を特定
  function showResultByRotatedPositions(rouletteAngle) {
    const ballCenterX = ball.offsetLeft + ball.offsetWidth / 2;
    const ballCenterY = ball.offsetTop + ball.offsetHeight / 2;

    let minDistance = Infinity;
    let closestNumber = null;

    //盤面の番号と計算上の座標を回転させて同期
    for (const [num, pos] of Object.entries(numberPositions)) {
      const rotated = rotatePoint(pos.x, pos.y, imageCenterX, imageCenterY, rouletteAngle);
      const dx = ballCenterX - rotated.x;
      const dy = ballCenterY - rotated.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < minDistance) {
        minDistance = distance;
        closestNumber = num;
      }
    }

    // 勝敗表示用関数
    // 表示内容をセット
    winningNumberDisplay.textContent = closestNumber;
    winningNumberDisplay.style.display = 'block';

    // 6秒後に非表示
    setTimeout(() => {
      winningNumberDisplay.style.display = 'none';
    }, 8000);

    const winNumber = Number(closestNumber);
    let currentMoney = getMoney();
    let totalPayout = 0;

    for (const [betKey, betAmount] of Object.entries(placedBets)) {
      const payoutMultiplier = odds[betKey];
      if (!payoutMultiplier) continue;

      let isWin = false;

      if (betKey.startsWith('No')) {
        const betContent = betKey.replace(/^No/, '');

        let betNumbers = [];

        if (betContent.includes('~')) {
          // 範囲指定
          const [start, end] = betContent.split('~').map(n => Number(n));
          for (let i = start; i <= end; i++) {
            betNumbers.push(i);
          }
        } else {
          // 通常のand区切り
          betNumbers = betContent.split('and').map(n => Number(n));
        }

        isWin = betNumbers.includes(winNumber);
      } else {
        // その他の条件ベット（Red, Black, Even, Oddなど）
        switch (betKey) {
          case 'Red':
            isWin = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36].includes(winNumber);
            break;
          case 'Black':
            isWin = [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35].includes(winNumber);
            break;
          case 'Even':
            isWin = winNumber !== 0 && winNumber % 2 === 0;
            break;
          case 'Odd':
            isWin = winNumber % 2 === 1;
            break;
          case 'Mae1To18':
            isWin = winNumber >= 1 && winNumber <= 18;
            break;
          case 'Usiro19To36':
            isWin = winNumber >= 19 && winNumber <= 36;
            break;
          case 'Hidari1st12':
            isWin = winNumber >= 1 && winNumber <= 12;
            break;
          case 'Naka2nd12':
            isWin = winNumber >= 13 && winNumber <= 24;
            break;
          case 'Migi3rd12':
            isWin = winNumber >= 25 && winNumber <= 36;
            break;
          case 'Ue2To1':
            isWin = [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36].includes(winNumber);
            break;
          case 'Naka2To1':
            isWin = [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35].includes(winNumber);
            break;
          case 'Sita2To1':
            isWin = [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34].includes(winNumber);
            break;
        }
      }

      if (isWin) {
        totalPayout += betAmount * payoutMultiplier;
      }
    }

    // 賭け金合計を差し引き、払い戻しを加える
    const updatedMoney = currentMoney + totalPayout;
    setMoney(updatedMoney);
    gameover();

    // ベットのリセットと表示更新
    placedBets = {};
    updateBetSummary();
    betDisplay();

    // 結果を画面に表示
    const resultBox = document.getElementById('winningResultBox');
    resultBox.style.display = 'block';
    resultBox.textContent = '';

    clearCoins();

    setTimeout(() => {
      const winGif = document.getElementById('winGif');
      if (totalPayout > 0) {
        resultBox.textContent = `🎉 +${totalPayout.toLocaleString()} MB`;
        resultBox.style.color = 'green';
        /*const chance = Math.random();
        if (chance < 0.1) {
          const kaneki = document.getElementById('kaneki');
          kaneki.classList.add('active');*/
        //winGif.style.display = 'block';
        //winGif.src = winGif.src;
        winningNumberDisplay.classList.add('rainbow');

        // setTimeout(() => {
        //   winGif.style.display = 'none';
        // }, 4000);
        //}
      } else {
        resultBox.textContent = `はずれ`;
        resultBox.style.color = 'red';
        winningNumberDisplay.classList.remove('rainbow');
      }
    }, 1);
    setTimeout(() => {
      resultBox.style.display = 'none';
    }, 8000);

  }

  // スタートボタンにイベント登録
  startBtn.addEventListener('click', startRotation);

  // 賭けボタンの選択切替（toggle）
  const betButtons = document.querySelectorAll(
    'button[id^="No"], ' +
    'button[id="Red"], button[id="Black"], button[id="Odd"], button[id="Even"], ' +
    'button[id="Ue2To1"], button[id="Naka2To1"], button[id="Sita2To1"], ' +
    'button[id="Hidari1st12"], button[id="Naka2nd12"], button[id="Migi3rd12"], ' +
    'button[id="Mae1To18"], button[id="Usiro19To36"]');
  betButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      betButtons.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
    });
  });

  // ベット確定ボタン
  okBtn.addEventListener('click', () => {
    const selected = Array.from(document.querySelectorAll('.selected'));
    let currentMoney = getMoney();
    let tempPlacedBets = { ...placedBets };

    for (const btn of selected) {
      const id = btn.id;
      const existingBet = tempPlacedBets[id] || 0;

      // 今回追加する賭け金だけで判定
      if (currentMoney >= betMoney) {
        tempPlacedBets[id] = existingBet + betMoney;
        currentMoney -= betMoney; // 今回追加分だけ引く
        placeCoin(btn);
      } else {
        alert(`"${id}" に賭けるには所持金が不足しています`);
        continue; // 賭けられない場合はスキップ
      }
    }

    placedBets = tempPlacedBets;
    setMoney(currentMoney); // 残金を更新
    lastPlacedBets = { ...placedBets };
    updateBetSummary();
    betDisplay();
  });

  function placeCoin(button) {
    const board = document.getElementById('rouletteBoard');
    if (!board.contains(button)) return;

    const rect = button.getBoundingClientRect();
    const boardRect = board.getBoundingClientRect();

    const coin = document.createElement('div');
    coin.classList.add('coin');

    // ボタンの位置を #rouletteBoard基準に変換
    coin.style.left = (rect.left - boardRect.left + rect.width / 2) + 'px';
    coin.style.top = (rect.top - boardRect.top + rect.height / 2 - 35) + 'px';

    board.appendChild(coin);

    coin.animate([
      { top: (rect.top - boardRect.top - 100) + 'px' },
      { top: (rect.top - boardRect.top - 35) + 'px' }
    ], {
      duration: 500,
      easing: 'ease-out'
    });
  }

  function clearCoins() {
    const coins = document.querySelectorAll('#rouletteBoard .coin');
    coins.forEach(coin => coin.remove());
  }


  // ベットリセットボタン
  document.getElementById('reset').addEventListener('click', () => {
    let currentMoney = getMoney();
    const totalBet = Object.values(placedBets).reduce((sum, val) => sum + val, 0);
    setMoney(currentMoney + totalBet);
    placedBets = {};
    document.querySelectorAll('.selected').forEach(btn => btn.classList.remove('selected'));
    updateBetSummary();
    betDisplay();
    clearCoins();
  });

  // ベット概要表示の更新
  function updateBetSummary() {
    const totalBet = Object.values(placedBets).reduce((sum, val) => sum + val, 0);
    const betDetailsDiv = document.getElementById('betDetails');
    betDetailsDiv.innerHTML = '';

    let displayBets = {};
    let isPrevious = false;

    if (totalBet === 0 && Object.keys(lastPlacedBets).length > 0) {
      displayBets = lastPlacedBets;
      isPrevious = true;
    } else if (totalBet > 0) {
      displayBets = placedBets;
    } else {
      betDetailsDiv.textContent = 'place your bets';
      document.getElementById('planBetMoney').textContent = '合計賭け金: 0 MB';
      return;
    }

    // 合計賭け金の表示更新
    const displayTotal = Object.values(displayBets).reduce((sum, val) => sum + val, 0);
    document.getElementById('planBetMoney').textContent = `合計賭け金: ${displayTotal.toLocaleString()} MB`;

    // 前回の賭け履歴ラベル表示
    if (isPrevious) {
      const label = document.createElement('div');
      label.className = 'previous-label';
      label.textContent = '(前回の賭け履歴)';
      betDetailsDiv.appendChild(label);
    }

    const displayNames = {
      'No0': '0',
      'No1': '1',
      'No2': '2',
      'No3': '3',
      'No4': '4',
      'No5': '5',
      'No6': '6',
      'No7': '7',
      'No8': '8',
      'No9': '9',
      'No10': '10',
      'No11': '11',
      'No12': '12',
      'No13': '13',
      'No14': '14',
      'No15': '15',
      'No16': '16',
      'No17': '17',
      'No18': '18',
      'No19': '19',
      'No20': '20',
      'No21': '21',
      'No22': '22',
      'No23': '23',
      'No24': '24',
      'No25': '25',
      'No26': '26',
      'No27': '27',
      'No28': '28',
      'No29': '29',
      'No30': '30',
      'No31': '31',
      'No32': '32',
      'No33': '33',
      'No34': '34',
      'No35': '35',
      'No36': '36',
      'Ue2To1': '上段2To1', 'Naka2To1': '中段2To1', 'Sita2To1': '下段2To1',
      'Hidari1st12': '1st 12', 'Naka2nd12': '2nd 12', 'Migi3rd12': '3rd 12',
      'Mae1To18': '1To18', 'Usiro19To36': '19To36',
      'No3and6': '3と6', 'No6and9': '6と9', 'No9and12': '9と12', 'No12and15': '12と15',
      'No15and18': '15と18', 'No18and21': '18と21', 'No21and24': '21と24', 'No24and27': '24と27',
      'No27and30': '27と30', 'No30and33': '30と33', 'No33and36': '33と36', 'No2and5': '2と5',
      'No5and8': '5と8', 'No8and11': '8と11', 'No11and14': '11と14', 'No14and17': '14と17',
      'No17and20': '17と20', 'No20and23': '20と23', 'No23and26': '23と26', 'No26and29': '26と29',
      'No29and32': '29と32', 'No32and35': '32と35', 'No1and4': '1と4', 'No4and7': '4と7',
      'No7and10': '7と10', 'No10and13': '10と13', 'No13and16': '13と16', 'No16and19': '16と19',
      'No19and22': '19と22', 'No22and25': '22と25', 'No25and28': '25と28', 'No28and31': '28と31',
      'No31and34': '31と34', 'No0and3': '0と3', 'No0and2': '0と2', 'No0and1': '0と1',
      'No3and2': '3と2', 'No6and5': '6と5', 'No9and8': '9と8', 'No12and11': '12と11',
      'No15and14': '15と14', 'No18and17': '18と17', 'No21and20': '21と20', 'No24and23': '24と23',
      'No27and26': '27と26', 'No30and29': '30と29', 'No33and32': '33と32', 'No36and35': '36と35',
      'No2and1': '2と1', 'No5and4': '5と4', 'No8and7': '8と7', 'No11and10': '11と10',
      'No14and13': '14と13', 'No17and16': '17と16', 'No20and19': '20と19', 'No23and22': '23と22',
      'No26and25': '26と25', 'No29and28': '29と28', 'No32and31': '32と31', 'No35and34': '35と34',
      'No3and2and1': '3と2と1', 'No6and5and4': '6と5と4', 'No9and8and7': '9と8と7',
      'No12and11and10': '12と11と10', 'No15and14and13': '15と14と13', 'No18and17and16': '18と17と16',
      'No21and20and19': '21と20と19', 'No24and23and22': '24と23と22', 'No27and26and25': '27と26と25',
      'No30and29and28': '30と29と28', 'No33and32and31': '33と32と31', 'No36and35and34': '36と35と34',
      'No3and6and5and2': '3と6と5と2', 'No6and9and8and5': '6と9と8と5', 'No9and12and11and8': '9と12と11と8',
      'No12and15and14and11': '12と15と14と11', 'No15and18and17and14': '15と18と17と14',
      'No18and21and20and17': '18と21と20と17', 'No21and24and23and20': '21と24と23と20',
      'No24and27and26and23': '24と27と26と23', 'No27and30and29and26': '27と30と29と26',
      'No30and33and32and29': '30と33と32と29', 'No33and36and35and32': '33と36と35と32',
      'No2and5and4and1': '2と5と4と1', 'No5and8and7and4': '5と8と7と4', 'No8and11and10and7': '8と11と10と7',
      'No11and14and13and10': '11と14と13と10', 'No14and17and16and13': '14と17と16と13',
      'No17and20and19and16': '17と20と19と16', 'No20and23and22and19': '20と23と22と19',
      'No23and26and25and22': '23と26と25と22', 'No26and29and28and25': '26と29と28と25',
      'No29and32and31and28': '29と32と31と28', 'No32and35and34and31': '32と35と34と31',
      'No1~6': '1~6',
      'No4~9': '4~9',
      'No7~12': '7~12',
      'No10~15': '10~15',
      'No13~18': '13~18',
      'No16~21': '16~21',
      'No19~24': '19~24',
      'No22~27': '22~27',
      'No25~30': '25~30',
      'No28~33': '28~33',
      'No31~36': '31~36',
      'Red': 'RED', 'Black': 'BLACK', 'Even': 'EVEN', 'Odd': 'ODD'
    };

    function removeBet(betKey) {
      if (!placedBets[betKey]) return;

      // 賭け金を返金
      let currentMoney = getMoney();
      currentMoney += placedBets[betKey];
      setMoney(currentMoney);

      // データから削除
      delete placedBets[betKey];

      // コイン削除（対応ボタン位置のコインを削除）
      const board = document.getElementById('rouletteBoard');
      const button = document.getElementById(betKey);
      if (button && board) {
        const rect = button.getBoundingClientRect();
        const boardRect = board.getBoundingClientRect();
        const targetLeft = Math.round(rect.left - boardRect.left + rect.width / 2);
        const targetTop = Math.round(rect.top - boardRect.top + rect.height / 2 - 35);

        document.querySelectorAll('#rouletteBoard .coin').forEach(coin => {
          const coinLeft = Math.round(parseFloat(coin.style.left));
          const coinTop = Math.round(parseFloat(coin.style.top));
          if (Math.abs(coinLeft - targetLeft) < 5 && Math.abs(coinTop - targetTop) < 5) {
            coin.remove();
          }
        });
      }

      // 表示更新
      updateBetSummary();
      betDisplay();
    }



    // 賭け詳細リスト表示
    const ul = document.createElement('ul');
    for (const [betKey, amount] of Object.entries(displayBets)) {
      const li = document.createElement('li');
      const displayName = displayNames[betKey] || betKey;
      const payoutMultiplier = odds[betKey] || 1;
      const textSpan = document.createElement('span');
      textSpan.textContent = `${displayName} に ${amount.toLocaleString()} MB 賭けています(倍率:${payoutMultiplier}倍)`;

      const removeBtn = document.createElement('button');
      removeBtn.textContent = '✖';
      removeBtn.classList.add('remove-bet');
      removeBtn.addEventListener('click', () => removeBet(betKey));

      li.appendChild(textSpan);
      li.appendChild(removeBtn);
      ul.appendChild(li);
    }
    betDetailsDiv.appendChild(ul);
  }


  // 初期表示のベット概要更新
  updateBetSummary();
  betDisplay();
});

// ENDボタン（任意の処理）
document.getElementById('end').addEventListener('click', () => {
  window.location.href = '../Home/index.html';
});
// ゲームオーバーの表示を行う関数
const gameover = () => {
  // 所持金が1000以下の時、ゲームオーバー
  let currentMoney = getMoney();
  if (currentMoney < 1000) {
    document.getElementById("gameover").style.display = "block";
    document.getElementById("goclose").style.display = "block";
  }
};

// オッズ設定
const odds = {};

// 36倍: 0～36の単一番号
for (let i = 0; i <= 36; i++) {
  odds[`No${i}`] = 36;
}

// 3倍: 3つの2To1と3つの12枠
['Ue2To1', 'Naka2To1', 'Sita2To1', 'Hidari1st12', 'Naka2nd12', 'Migi3rd12'].forEach(key => {
  odds[key] = 3;
});

// 2倍: その他の基本賭け
['Mae1To18', 'Usiro19To36', 'Even', 'Odd', 'Red', 'Black'].forEach(key => {
  odds[key] = 2;
});

// 18倍: 縦2つセットの配列
const eighteenMultiples = [
  'No3and6', 'No6and9', 'No9and12', 'No12and15', 'No15and18',
  'No18and21', 'No21and24', 'No24and27', 'No27and30', 'No30and33',
  'No33and36', 'No2and5', 'No5and8', 'No8and11', 'No11and14',
  'No14and17', 'No17and20', 'No20and23', 'No23and26', 'No26and29',
  'No29and32', 'No32and35', 'No1and4', 'No4and7', 'No7and10',
  'No10and13', 'No13and16', 'No16and19', 'No19and22', 'No22and25',
  'No25and28', 'No28and31', 'No31and34', 'No0and3', 'No0and2',
  'No0and1', 'No3and2', 'No6and5', 'No9and8', 'No12and11',
  'No15and14', 'No18and17', 'No21and20', 'No24and23', 'No27and26',
  'No30and29', 'No33and32', 'No36and35', 'No2and1', 'No5and4',
  'No8and7', 'No11and10', 'No14and13', 'No17and16', 'No20and19',
  'No23and22', 'No26and25', 'No29and28', 'No32and31', 'No35and34'
];
eighteenMultiples.forEach(key => odds[key] = 18);

// 12倍: 三つセット
[
  'No3and2and1', 'No6and5and4', 'No9and8and7', 'No12and11and10',
  'No15and14and13', 'No18and17and16', 'No21and20and19', 'No24and23and22',
  'No27and26and25', 'No30and29and28', 'No33and32and31', 'No36and35and34'
].forEach(key => odds[key] = 12);

// 9倍: 四つセット (上段・中段)
[
  'No3and6and5and2', 'No6and9and8and5', 'No9and12and11and8',
  'No12and15and14and11', 'No15and18and17and14', 'No18and21and20and17',
  'No21and24and23and20', 'No24and27and26and23', 'No27and30and29and26',
  'No30and33and32and29', 'No33and36and35and32', 'No2and5and4and1',
  'No5and8and7and4', 'No8and11and10and7', 'No11and14and13and10',
  'No14and17and16and13', 'No17and20and19and16', 'No20and23and22and19',
  'No23and26and25and22', 'No26and29and28and25', 'No29and32and31and28',
  'No32and35and34and31'
].forEach(key => odds[key] = 9);

// 6倍: 下段四つ角セット
[
  'No1~6', 'No4~9', 'No7~12', 'No10~15', 'No13~18', 'No16~21',
  'No19~24', 'No22~27', 'No25~30', 'No28~33', 'No31~36'
].forEach(key => odds[key] = 6);

