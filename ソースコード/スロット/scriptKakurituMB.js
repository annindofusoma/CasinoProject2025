
const M1000 = document.getElementById("M1000");
const M5000 = document.getElementById("M5000");
const M10000 = document.getElementById("M10000");
const M100000 = document.getElementById("M100000");
const M1000000 = document.getElementById("M1000000");

const storage = localStorage;

//掛け金
M1000.addEventListener("click", () => {
  window.location.href = "slotKakuritu.html";
  storage.betMoney = 1000;
})

M5000.addEventListener("click", () => {
  window.location.href = "slotKakuritu.html";
  storage.betMoney = 5000;
})

M10000.addEventListener("click", () => {
  window.location.href = "slotKakuritu.html";
  storage.betMoney = 10000;
})

M100000.addEventListener("click", () => {
    window.location.href = "slotKakuritu.html";
    storage.betMoney = 100000;
})

M1000000.addEventListener("click", () => {
    window.location.href = "slotKakuritu.html";
    storage.betMoney = 1000000;
})


const MBDisplay = () => {
    document.getElementById('ownMoney').textContent = '所持MB：' + storage.money;
};

MBDisplay();