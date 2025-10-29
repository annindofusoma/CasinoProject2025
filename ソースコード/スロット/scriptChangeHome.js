const MERSUSHome = document.getElementById("MERSUSHome");
const MISCUPHome = document.getElementById("MISCUPHome");
const MABDOKIHome = document.getElementById("MABDOKIHome");

const storage = localStorage;


//ホームから
MERSUSHome.addEventListener("click", () => {
  window.location.href = "slotMB.html";
})

MISCUPHome.addEventListener("click", () => {
  window.location.href = "slotRandomMB.html";
})

MABDOKIHome.addEventListener("click", () => {
  window.location.href = "slotKakurituMB.html";
})


const betDisplay = () => {
    document.getElementById("ownMoney").textContent = "所持MB：" + storage.money;
}

betDisplay();