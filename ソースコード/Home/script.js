const storage = localStorage;

// ローカルストレージに "money" が存在しない場合、初期所持金を設定
if (!storage.getItem('money')) {
    storage.setItem('money', 1000000);
}else if (storage.money < 1000){
    alert('所持金がなくなったため、1000000MB補充しました。')
    storage.setItem('money', 1000000);
}


// サイト読み込み後の実行
document.addEventListener('DOMContentLoaded', () => {
    betDisplay();
})


// 所持金、賭け金表示
const betDisplay = () => {
    const br = document.createElement('br');
    document.getElementById('ownMoney').textContent = '所持MB：' + storage.money;
}
