'use strict';
const storage = localStorage;

// 定数名
let dealer = [];
let player = [];
let table = [];
const suit = ['spade','clover','dia','heart'];
const trump = [];
const dealerHands = document.getElementById('dealer');
const playerHands = document.getElementById('player');
const tableCards = document.getElementById('table');
const fiveCardDraw = document.getElementById('fiveCardDraw');
const texasHoldem = document.getElementById('texasHoldem');
const gameSelect = document.getElementById('gameSelect');
const bet = document.getElementById('bet');
const fold = document.getElementById('fold');
const raise = document.getElementById('raise');
const change = document.getElementById('change');
const winResult = document.getElementById("win");
const loseResult = document.getElementById("lose");
// 賭け金
let betMoney = 1000;
// 賭け金を一時的に記録
let tempBetMoney = 1000;
// チェンジ選択中の要素番号を記録
const changeSelect = [];
// ファイブカードドローかテキサスホールデムを記録
let gameMode;
// ファイブカードドロー時のベット後のみチェンジを行うための変数
let changeTime = false;
// テキサスホールデム時、レイズが何回目かで表示が違う
let raiseTimes = 0;


// トランプを作成し、シャッフルする関数
const shuffleTrump = () => {
    // トランプを配列に格納、比較の為、1を14として扱う
    for (let i = 0; i < 4; i++){
        for(let j = 2; j < 15; j++){
            trump.push(suit[i] + '-'+ j);
        }
    }

    // 配列Trumpをランダムに並び替える
    for (const [index, num] of trump.entries()) {
        const tempIndex = Math.floor(Math.random() * trump.length); // ランダムな要素番号
        const tempNum = trump[index]; 
        trump[index] = trump[tempIndex];
        trump[tempIndex] = tempNum; 
    }
}


// 引数の相手に引数の数だけカードを配る
const giveCard = (place,numCard) => {
    for(let i = 0; i < numCard; i++){
        place.push(trump[0]);
        trump.shift();
    }

    // テスト用ーーーーー要削除ーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー
    // dealer = ['heart-10', 'clover-4', 'heart-5', 'dia-6', 'heart-7'];
    // player = ['clover-6', 'spade-11', 'clover-14', 'dia-3', 'heart-10'];
    // trump.length = 0;
    // trump.unshift('spade-3');
    // ーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー
}


// ディーラーのカードを表示する
const dealerCardOpen = (numCard) => {
    for (let i = 0; i < numCard; i++){
        document.getElementById(`d${i+1}`).src = `Trump/${dealer[i]}.png`;
    }
}


// ディーラーのカードを裏向きでセットする
const setdealerCard = (numCard) => {
    for (let i = 0; i < numCard; i++){
        let img = document.createElement('img');
        img.id = 'd' + (i + 1);
          img.src = `Trump/999.png`;
        img.height = 110;
        dealerHands.prepend(img);
    }
}


// 場のカードを裏向きでセットする
const settableCard = (numCard) => {
    for (let i = 0; i < numCard; i++){
        let img = document.createElement('img');
        img.id = 't' + (i + 1);
        img.src = `Trump/999.png`;
        img.height = 110;
        tableCards.prepend(img);
    }
}


// プレイヤーのカードを表示する
const playerCardOpen = (numCard) => {
    for (let i = 0; i < numCard; i++){
        let img = document.createElement('img');
        img.id = 'p' + (i + 1);
        img.src = `Trump/${player[i]}.png`;
        img.height = 100;
        playerHands.prepend(img);
        
        // カードにクリックイベントを追加
        img.addEventListener('click', () => {
            if(changeTime == true){
                img.classList.toggle('border-active');

                // 配列changeSelectに選択しているカードのidを格納
                if(changeSelect.indexOf(img.id.replace('p','')) == -1){
                    changeSelect.push(img.id.replace('p',''));
                }else {
                    changeSelect.splice(changeSelect.indexOf(img.id.replace('p','')), 1);
                }
            }
        })
    }
}


// 所持金、賭け金表示
const betDisplay = () => {
    const br = document.createElement('br');
    document.getElementById('ownMoney').textContent = '所持MB：' + storage.money;
    document.getElementById('planBetMoney').textContent = '賭け金：' + betMoney;
}

// ファイブカードドロー選択時のクリックイベント
fiveCardDraw.addEventListener('click', () => {
    gameMode = 'fiveCardDraw';
    fiveCardDrawSet();
})

const fiveCardDrawSet = () => {
      // ボタンの表示、非表示
    document.getElementById("betPrice").style.visibility = "visible";
    document.getElementById("bet").style.display = "block";
    document.getElementById("fold").style.display = "block";
    document.getElementById("gameName").style.display = "block";
    document.getElementById("ownBetMoney").style.display = "block";
    document.getElementById('gameName').textContent = 'ファイブカードドロー';
    betDisplay();
    gameSelect.remove();
    shuffleTrump();
    giveCard(dealer,5);
    giveCard(player,5);
    setdealerCard(5);
    playerCardOpen(5);  
}

// テキサスホールデム選択時のクリックイベント
texasHoldem.addEventListener('click', () => {
    gameMode = 'texasHoldem';
   texasHoldemSet();
})

const texasHoldemSet = () => {
    // ボタンの表示、非表示
    document.getElementById("table").style.display = "block";
    document.getElementById("betPrice").style.visibility = "visible";
    document.getElementById("bet").style.display = "block";
    document.getElementById("fold").style.display = "block";
    document.getElementById("gameName").style.display = "block";
    document.getElementById("ownBetMoney").style.display = "block";
    document.getElementById('gameName').textContent = 'テキサスホールデム';
    betDisplay();
    gameSelect.remove();
    shuffleTrump();
    giveCard(dealer,2);
    giveCard(player,2);
    giveCard(table,5);
    setdealerCard(2);
    settableCard(5)
    playerCardOpen(2);
}


// 賭け金を1000上げるクリックイベント
document.getElementById('upLeft').addEventListener('click', () => {
    // 所持金以下のみ賭け可能
    if(betMoney + 1000 <= storage.money){
        betMoney = betMoney + 1000;
    }
    betDisplay();
})

// 賭け金を10000上げるクリックイベント
document.getElementById('upRight').addEventListener('click', () => {
    // 所持金以下のみ賭け可能
    if(betMoney + 10000 <= storage.money){
        betMoney = betMoney + 10000;
    }
    betDisplay();
})

// 賭け金を1000下げるクリックイベント
document.getElementById('downLeft').addEventListener('click', () => {
    // 最低ベット額、前回のレイズ額未満には設定できない
    if(betMoney - 1000 >= tempBetMoney){
        betMoney = betMoney - 1000;
    }
    betDisplay();
})

// 賭け金を10000下げるクリックイベント
document.getElementById('downRight').addEventListener('click', () => {
    // 最低ベット額、前回のレイズ額未満には設定できない
    if(betMoney - 10000 >= tempBetMoney){
        betMoney = betMoney - 10000;
    }
    betDisplay();
})


// ベットのクリックイベント
bet.addEventListener('click', () => {
    if(gameMode == 'fiveCardDraw'){
        changeTime = true;
        document.getElementById("change").style.display = "block";
        document.getElementById("betPrice").style.visibility = "hidden";
        document.getElementById("fold").style.display = "none";
        document.getElementById("changeMessage").style.display = "block";
    }else{
        document.getElementById("betPrice").style.visibility = "visible";
        document.getElementById("raise").style.display = "block";
        document.getElementById("fold").style.display = "block";
        for (let i = 4; i > 1; i--){
        document.getElementById(`t${i+1}`).src = `Trump/${table[i]}.png`;
        }
    }

    tempBetMoney = betMoney;
    // ベッティングボタンの非表示
    document.getElementById("bet").style.display = "none";
})

// フォールドのクリックイベント
fold.addEventListener('click', () => {
    document.getElementById("betPrice").style.visibility = "hidden";
    document.getElementById("fold").style.display = "none";
    document.getElementById("raise").style.display = "none";

    loseResult.innerHTML = '負け<br>-' + tempBetMoney + 'MB';
    loseResult.style.display = "block";
    storage.money = Number(storage.money) - tempBetMoney;

    betDisplay();
    gameover();
})


// レイズのクリックイベント
raise.addEventListener('click', () => {
    if(gameMode == 'fiveCardDraw'){
        document.getElementById("betPrice").style.visibility = "hidden";
        document.getElementById("fold").style.display = "none";
        document.getElementById("raise").style.display = "none";
        dealerCardOpen(5);
        winDecide();
    }else{
        raiseTimes = raiseTimes + 1;
        // 1～3回のレイズ
        if(raiseTimes == 1){
            document.getElementById(`t2`).src = `Trump/${table[1]}.png`;
        }else if(raiseTimes == 2){
            document.getElementById(`t1`).src = `Trump/${table[0]}.png`;
        }else if(raiseTimes == 3){
            document.getElementById("betPrice").style.visibility = "hidden";
            document.getElementById("fold").style.display = "none";
            document.getElementById("raise").style.display = "none";


            // ここにどのカード5枚で役を作るのか決めて、playerとdealerに一番強い役を入れる
            dealerCardOpen(2);
            player = tehudakettei(player);
            dealer = tehudakettei(dealer);
            winDecide();
        }
    }
    tempBetMoney = betMoney;
})


// チェンジのクリックイベント
change.addEventListener('click', () => {
    if(changeSelect.length !== 0){
        for(let i=0; i<changeSelect.length; i++){
            player.splice(changeSelect[i]-1, 1);
            player.splice(changeSelect[i]-1, 0, trump[0]);
            trump.shift();
            document.getElementById(`p${changeSelect[i]}`).src =  `Trump/${player[changeSelect[i]-1]}.png`;
            document.getElementById(`p${changeSelect[i]}`).className ='';
        }
    }
    // ディーラーのチェンジ前の手確認
    console.log(dealer);
    dealerChange();

    changeTime = false;
    // ボタンの表示、非表示
    document.getElementById("change").style.display = "none";
    document.getElementById("betPrice").style.visibility = "visible";
    document.getElementById("raise").style.display = "block";
    document.getElementById("fold").style.display = "block";
    document.getElementById("changeMessage").style.display = "none";
})


// hanteiから役の強さと役が同じ場合の筋の強さを受け取り、dealerとplayerのどちらが強いのか勝敗決定
const winDecide = () => {
    let [dyaku, dtopNum] = hantei(dealer);
    let [pyaku, ptopNum] = hantei(player);

    if (Number(pyaku) < Number(dyaku)){
        winResult.innerHTML = '勝ち<br>+' + betMoney*2 + 'MB';
        winResult.style.display = "block";
        storage.money = Number(storage.money) + (betMoney*2);
    }else if (Number(pyaku) > Number(dyaku)){
        loseResult.innerHTML = '負け<br>-' + betMoney + 'MB';
        loseResult.style.display = "block";
        storage.money = Number(storage.money) - betMoney;
    }else{
        if (Number(ptopNum) > Number(dtopNum)){
            winResult.innerHTML = '勝ち<br>+' + betMoney*2 + 'MB';
            winResult.style.display = "block";
            storage.money = Number(storage.money) + (betMoney*2);
        }else if (Number(ptopNum) < Number(dtopNum)){
            loseResult.innerHTML = '負け<br>-' + betMoney + 'MB';
            loseResult.style.display = "block";
            storage.money = Number(storage.money) - betMoney;
        }else{
            document.getElementById("draw").innerHTML = '引き分け<br>+' + 0 + 'MB';
            document.getElementById("draw").style.display = "block";
        }
    }


    if (dyaku == 1){
        document.getElementById('dealeryaku').textContent = 'ロイヤルストレートフラッシュ';
    }else if (dyaku == 2){
        document.getElementById('dealeryaku').textContent = 'ストレートフラッシュ';
    }else if (dyaku == 3){
        document.getElementById('dealeryaku').textContent = 'フォーカード';
    }else if (dyaku == 4){
        document.getElementById('dealeryaku').textContent = 'フルハウス';
    }else if (dyaku == 5){
        document.getElementById('dealeryaku').textContent = 'フラッシュ';
    }else if (dyaku == 6){
        document.getElementById('dealeryaku').textContent = 'ストレート';
    }else if (dyaku == 7){
        document.getElementById('dealeryaku').textContent = 'スリーカード';
    }else if (dyaku == 8){
        document.getElementById('dealeryaku').textContent = 'ツーペア';
    }else if (dyaku == 9){
        document.getElementById('dealeryaku').textContent = 'ワンペア';
    }else if (dyaku == 10){
        document.getElementById('dealeryaku').textContent = 'ハイカード';
    }


    if (pyaku == 1){
        document.getElementById('playeryaku').textContent = 'ロイヤルストレートフラッシュ';
    }else if (pyaku == 2){
        document.getElementById('playeryaku').textContent = 'ストレートフラッシュ';
    }else if (pyaku == 3){
        document.getElementById('playeryaku').textContent = 'フォーカード';
    }else if (pyaku == 4){
        document.getElementById('playeryaku').textContent = 'フルハウス';
    }else if (pyaku == 5){
        document.getElementById('playeryaku').textContent = 'フラッシュ';
    }else if (pyaku == 6){
        document.getElementById('playeryaku').textContent = 'ストレート';
    }else if (pyaku == 7){
        document.getElementById('playeryaku').textContent = 'スリーカード';
    }else if (pyaku == 8){
        document.getElementById('playeryaku').textContent = 'ツーペア';
    }else if (pyaku == 9){
        document.getElementById('playeryaku').textContent = 'ワンペア';
    }else if (pyaku == 10){
        document.getElementById('playeryaku').textContent = 'ハイカード';
    }

    document.getElementById('playeryaku').style.display = "block";
    document.getElementById('dealeryaku').style.display = "block";

    betDisplay();
    gameover();
}


// ゲームオーバーの表示を行う関数
const gameover = () => {
    // 所持金が1000以下の時、ゲームオーバー
    if (storage.money < 1000){
        document.getElementById("gameover").style.display = "block";
        document.getElementById("goclose").style.display = "block";
    }else{
        document.getElementById("restart").style.display = "block";
        document.getElementById("gameEndResult").style.display = "block";
    }
}


// 役の判定をする関数
const hantei = (tehuda) => {
    const tehudaSuit = [];
    const tehudaNum = [];
    for(let card of tehuda){
        tehudaSuit.push(card.substr(0,card.indexOf('-')));
        tehudaNum.push(card.substr(card.indexOf('-') + 1));
    }

    let [sameSuit,suitTopNum] = suitCheck(tehudaSuit,tehudaNum);

    const royal = royalCheck(tehudaNum);

    let [continuous,conTopNum] = continuousCheck(tehudaNum);

    let [pair, pairTopNum] = pairCheck(tehudaNum);

    // dealerとplayerで勝敗決定するために数字に当てはめる
    if (sameSuit == true && royal == true){
        return [1, 0];
    }else if (sameSuit == true && continuous == true){
        return [2, conTopNum];
    }else if (pair == 'fourCard'){
        return [3, pairTopNum];
    }else if (pair == 'fullHouse'){
        return [4, pairTopNum];
    }else if (sameSuit == true){
        return [5, suitTopNum];
    }else if (continuous == true){
        return [6, conTopNum];
    }else if (pair == 'threeCard'){
        return [7, pairTopNum];
    }else if (pair == 'twoPair'){
        return [8, pairTopNum];
    }else if (pair == 'onePair'){
        return [9, pairTopNum];
    }else if (pair == 'hightCard'){
        return [10, pairTopNum];
    }
}


// 同じスートかチェック
const suitCheck = (tehudaSuit,tehudaNum) => {
    let suitTopNum;
    let sameSuit = false;
    // スートがすべて同じ場合はsameSuitをtrue
    if (tehudaSuit.every(value => value == tehudaSuit[0])){
        sameSuit = true;
        // 一番強い数字をsuitTopNumに格納
        suitTopNum = Math.max(...tehudaNum);
    }
    return [sameSuit,suitTopNum];
}

// 10～1の各数字かチェック
const royalCheck = (tehudaNum) => {
    // 昇順に並び替える
    const royalNum = [10,11,12,13,14];
    let royal = false;
    const ascTehudaNum = tehudaNum.slice();
    ascTehudaNum.sort((a, b) => a - b);

    // 文字列に変換し、一致するか確認
    if (royalNum.toString() == ascTehudaNum.toString()){
        royal = true;
    }
    return royal
}


// 連数(ストレート)かチェック
const continuousCheck = (tehudaNum) => {
    let continuous;
    let conTopNum;
    const ascTehudaNum = tehudaNum.slice().map(Number);
    ascTehudaNum.sort((a, b) => a - b); 

    // 1を14に変換しているため例外処理追加
    const tempConNum = [2,3,4,5,14];
    if (JSON.stringify(tempConNum) == JSON.stringify(ascTehudaNum)){
        continuous = true;
        // 一番強い数字をsuitTopNumに格納
        conTopNum = ascTehudaNum[ascTehudaNum.length - 1];
        return [continuous,conTopNum];
    }
    // 連続した数字ではなかった場合、戻り値を返して即終了
    for (let i = 0; i < ascTehudaNum.length - 1; i++){
        if (ascTehudaNum[i] !== (ascTehudaNum[i+1] - 1)){
            continuous = false;
            conTopNum = false;
            return [continuous,conTopNum];
        }
    }
    continuous = true;

    // 一番強い数字をsuitTopNumに格納
    conTopNum = ascTehudaNum[ascTehudaNum.length - 1];

    return [continuous,conTopNum];
}


// 同じ数字のペアチェック
const pairCheck = (tehudaNum) => {
    const valueEqual = [];

    // 昇順に並び替える
    const ascTehudaNum = tehudaNum.slice();
    ascTehudaNum.sort((a, b) => a - b);

    // 隣り合う配列要素と同じかどうか
    for (let i = 0; i < 4; i++){
        if (ascTehudaNum[i] == ascTehudaNum[i+1]){
            valueEqual.push('T');
        }else{
            valueEqual.push('F');
        }
    }

    // 役をしらべる
    let pair,pairTopNum;
    if (valueEqual.join('') == 'TTTF' || valueEqual.join('') == 'FTTT') {
        pair = 'fourCard';

    } else if (valueEqual.join('') == 'TTFT' || valueEqual.join('') == 'TFTT') {
        pair = 'fullHouse';

    } else if (valueEqual.join('') == 'TTFF' || valueEqual.join('') == 'FTTF' || valueEqual.join('') == 'FFTT') {
        pair = 'threeCard';

    } else if (valueEqual.join('') == 'TFTF' || valueEqual.join('') == 'TFFT' || valueEqual.join('') == 'FTFT')  {
        pair = 'twoPair';

    } else if (valueEqual.join('') !== 'FFFF') {
        pair = 'onePair';

    } else {
        pair = 'hightCard';
    }
    
    // 各役にあわせた強い数字
    if (valueEqual.join('') == 'TTFT'){
        pairTopNum = ascTehudaNum[0];
    }else if (valueEqual.lastIndexOf('T') !== -1){
        pairTopNum = ascTehudaNum[valueEqual.lastIndexOf('T')]; 
    }else{
        pairTopNum = ascTehudaNum[4];
    }

    return [pair,pairTopNum];
}


// リスタートボタンのクリックイベント
document.getElementById("restart").addEventListener('click', () => {

    document.getElementById("restart").style.display = "none";
    document.getElementById("gameEndResult").style.display = "none";
    document.getElementById("win").style.display = "none";
    document.getElementById("lose").style.display = "none";
    document.getElementById("draw").style.display = "none";
    document.getElementById("dealer").innerHTML = '';
    document.getElementById("player").innerHTML = '';
    document.getElementById("table").innerHTML = '';
    document.getElementById('playeryaku').style.display = "none";
    document.getElementById('dealeryaku').style.display = "none";
    player = [];
    dealer = [];
    table = [];
    trump.length = 0;
    changeSelect.length = 0;
    raiseTimes = 0;
    tempBetMoney = 1000;

    betMoney = 1000;

    if (gameMode == 'texasHoldem'){
        texasHoldemSet();
    }else{
        fiveCardDrawSet();
    }
})


// テーブルと手札のなかから強い役の5枚を選択
const tehudakettei = (place) => {
    let allCard;
    let yaku = 11;
    let topNum = 1;
    let tempPlace = [];

    // テーブルと手札を一つの配列にする
    const empAllCards = place.concat(table);

    for (let i=0; i<7; i++){
        for (let j=i+1; j<7; j++){
            // 配列をコピーする
            allCard = [...empAllCards];
            // 7つから2つを削除し、5枚にする
            allCard.splice(i, 1);
            allCard.splice(j-1, 1);
            // 5枚にしたカードの強さを調べる
            let [tempyaku, temptopNum] = hantei(allCard);
            // tempyakuのほうが強い場合、強い手札を保存
            if(Number(yaku) > Number(tempyaku) || (Number(yaku) == Number(tempyaku) && Number(topNum) < Number(temptopNum))) {
                yaku = tempyaku;
                topNum = temptopNum;
                tempPlace = [...allCard];
            }
        }
    }
    place = tempPlace;
    return place;
}


// ディーラー(CPU)のチェンジ動作
const dealerChange = () => {
    let [yaku,topNum] = hantei(dealer);
    const tehudaSuit = [];
    const tehudaNum = [];
    const valueEqual = [];
    const sameSuit = [];

    // dealer配列内のスートと数字を分解
    for(let card of dealer){
        tehudaSuit.push(card.substr(0,card.indexOf('-')));
        tehudaNum.push(card.substr(card.indexOf('-') + 1));
    }

    const ascTehudaNum = tehudaNum.slice();

    // 昇順に並び替える
    ascTehudaNum.sort((a, b) => a - b);
    const ascTehudaSuit = tehudaSuit.slice();
    ascTehudaSuit.sort();


    // ストレートが狙えるか
    let straightChange = [];
    outerLoop:
    for (let k=4; k < 13; k++){
        let straightCheck = [k-2, k-1, k, k+1, k+2];
        for(let l=0; l<ascTehudaNum.length; l++){
            // ストレートとなる組み合わせの要素の中に昇順要素がなかった場合記録
            if(!straightCheck.includes(Number(ascTehudaNum[l]))){
                straightChange.push(ascTehudaNum[l]);
            }
        }
        if(straightChange.length !== 1){
            straightChange.length = 0;
        }else if(straightChange.length == 1){
            break outerLoop;
        }
    }


    // 同じスートがあるかどうか
    for (let i = 0; i < 4; i++){
        if (ascTehudaSuit[i] == ascTehudaSuit[i+1]){
            valueEqual.push('T');
        }else{
            valueEqual.push('F');
        }
    }
    
    console.log(straightChange);

    // 同じ数字がある時(ワンペア、ツーペア、スリーカード)は同じ数字以外を1枚変更
    if (7 <= yaku && yaku <= 9){
        const uniqueItems = ascTehudaNum.filter(item => ascTehudaNum.indexOf(item) === ascTehudaNum.lastIndexOf(item));
        dealer.splice(tehudaNum.indexOf(uniqueItems[0]), 1);
        dealer.splice(tehudaNum.indexOf(uniqueItems[0]), 0, trump[0]);
        trump.shift();

    // 同じスートが4つある時、残りの一つをチェンジ
    }else if (yaku == 10){
        if((valueEqual.join('') == 'TTTF')){
            dealer.splice(tehudaSuit.indexOf(ascTehudaSuit[4]), 1);
            dealer.splice(tehudaSuit.indexOf(ascTehudaSuit[4]), 0, trump[0]);
            trump.shift();

            console.log('同じスートが4つで後交換');
        }else if(valueEqual.join('') == 'FTTT'){
            dealer.splice(tehudaSuit.indexOf(ascTehudaSuit[0]), 1);
            dealer.splice(tehudaSuit.indexOf(ascTehudaSuit[0]), 0, trump[0]);
            trump.shift();

            console.log('同じスートが4つで前交換');

        // あと一枚でストレートが狙える時
        }else if (straightChange.length == 1){
            dealer.splice(tehudaNum.indexOf(straightChange[0]), 1);
            dealer.splice(tehudaNum.indexOf(straightChange[0]), 0, trump[0]);
            trump.shift();

            console.log('あと一枚でストレート');

        // 弱いカード二枚をチェンジ
        }else{
            dealer.splice(tehudaNum.indexOf(ascTehudaNum[0]), 1);
            dealer.splice(tehudaNum.indexOf(ascTehudaNum[0]), 0, trump[0]);
            trump.shift();

            dealer.splice(tehudaNum.indexOf(ascTehudaNum[1]), 1);
            dealer.splice(tehudaNum.indexOf(ascTehudaNum[1]), 0, trump[0]);
            trump.shift();

            console.log('弱い二枚を交換');
        }
    }
}