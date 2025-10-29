
const MERSUS = document.getElementById("MERSUS");
const MISCUP = document.getElementById("MISCUP");
const MABDOKI = document.getElementById("MABDOKI")

const storage = localStorage;


//台から
MERSUS.addEventListener("click", () => {
  window.location.href = "slot.html";
})

MISCUP.addEventListener("click", () => {
  window.location.href = "slotRandom.html";
})

MABDOKI.addEventListener("click", () => {
  window.location.href = "slotKakuritu.html";
})


const betDisplay = () => {
    document.getElementById("ownMoney").textContent = "所持MB：" + storage.money;
    document.getElementById("planBetMoney").textContent = "レート：" + storage.betMoney + " MB";
}

betDisplay();