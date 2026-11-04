// 5個遊戲的玩法說明與實際檔案路徑對應
const gameRules = {
 island: {
  title: "台美財富探索島 (Financial Exploration Island)",
  desc: "這是我們的旗艦互動遊戲！您將在 3D 浮島地圖上進行探索，透過情境模擬來學習台美兩地的退休規劃、稅務策略與資產配置。",
  url: "Games/ .html"
 },
 adventure: {
  title: "Insurance Adventure 2.0",
  desc: "人生中充滿各種未知與風險。在這款冒險遊戲中，您將面臨不同的生活突發狀況，學習如何透過正確的保險工具與風險規劃，守護自己與家人的財務安全。",
  url: "Games/Insurance Adventure 2.0.html"
 },
 simulator: {
  title: "Risk Score & Claim Simulator",
  desc: "想知道風險評分與保險理賠是如何計算的嗎？本模擬器讓您親自動手調整參數，觀察不同風險情境下的理賠與資產變化，提升風險意識。",
  url: "Games/5  Risk Score & Claim Simulator.html"
 },
 indiana: {
  title: "Indiana Wealth & Insurance",
  desc: "專為印第安納州及跨境家庭設計的理財情境模擬。結合在地生活成本、稅賦與保險結構，幫助您做出最適合在地發展的財務決策。",
  url: "Games/Indiana Wealth & Insurance.html"
 },
 challenge: {
  title: "財務觀念挑戰賽 (Classic Q&A)",
  desc: "透過初級、進階到專家級的三階段情境問答，檢驗您對台美理財、529 教育基金與信託規劃的熟悉程度。答對還能獲得詳盡的觀念解析！",
  url: "#games"
 }
};

const ruleContainer = document.getElementById("gameRuleContainer");
const ruleTitle = document.getElementById("ruleTitle");
const ruleText = document.getElementById("ruleText");
const playGameLink = document.getElementById("playGameLink");

let currentGameUrl = "#";

// 點擊「查看玩法並開始」按鈕
document.querySelectorAll(".open-rule-btn").forEach(btn => {
 btn.addEventListener("click", (e) => {
  e.preventDefault();
  const gameKey = btn.dataset.target;
  const game = gameRules[gameKey];
  if(!game) return;

  ruleTitle.textContent = game.title;
  ruleText.textContent = game.desc;
  currentGameUrl = game.url; // 記錄要開啟的遊戲網址
  
  if(gameKey === "challenge") {
    playGameLink.textContent = "👇 直接在下方開始挑戰題";
  } else {
    playGameLink.textContent = "🚀 準備好了，馬上進入遊戲！";
  }

  ruleContainer.classList.remove("hidden");
  ruleContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
 });
});

// 點擊關閉玩法面板
document.getElementById("closeRuleBtn")?.addEventListener("click", () => {
 ruleContainer.classList.add("hidden");
});

// 點擊「準備好了，馬上進入遊戲！」按鈕時強制開新視窗
playGameLink.addEventListener("click", (e) => {
 e.preventDefault();
 if(currentGameUrl && currentGameUrl !== "#") {
   window.open(currentGameUrl, "_blank");
 } else {
   const area=document.getElementById("gameArea");
   area.classList.remove("hidden");
   area.scrollIntoView({ behavior: 'smooth' });
 }
});

// 保留原有的挑戰賽測驗邏輯
const quizzes={
 beginner:{q:"建立緊急預備金時，較常見的起點建議是？",opts:["先準備數個月的必要生活費","把所有現金投入單一股票","完全不需要現金預備"],a:0,why:"緊急預備金可協助家庭應付突發支出；實際金額需依收入穩定度、家庭責任與保險保障調整。"},
 intermediate:{q:"美國 529 教育儲蓄計畫的主要用途是什麼？",opts:["專為退休收入設計","協助為合格教育支出儲蓄","保證投資本金不會波動"],a:1,why:"529 計畫主要用於合格教育支出；投資選項、州稅優惠與提款規則需依計畫及所在地確認。"},
 advanced:{q:"台美跨境家庭在規劃海外金融資產前，最適合先做哪件事？",opts:["只看產品預期報酬","先確認稅務身分、申報義務與資產所在地規則","假設台灣與美國規則完全相同"],a:1,why:"跨境家庭可能同時涉及不同國家的稅務與申報規則，應先盤點身分與資產，再向合格跨境稅務專業人士確認。"}
};

document.querySelector('[data-game="challenge"] .open-rule-btn')?.addEventListener("click", () => {
 const area=document.getElementById("gameArea");
 area.classList.remove("hidden");
 area.innerHTML=`<strong>CLASSIC 挑戰題預覽</strong><p>${quizzes.beginner.q}</p>`+quizzes.beginner.opts.map((o,i)=>`<button class="game-option" data-answer="${i}">${o}</button>`).join("")+`<div id="feedback"></div>`;
 area.querySelectorAll(".game-option").forEach(b=>b.addEventListener("click",()=>{const ok=Number(b.dataset.answer)===quizzes.beginner.a;area.querySelector("#feedback").innerHTML=`<p class="game-feedback">${ok?"答對了！":"再想一想！"} ${quizzes.beginner.why}</p>`;}));
});
