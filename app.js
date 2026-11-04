// 載入 Supabase SDK 用於前台讀取
const SUPABASE_URL = "https://nnzknvhyfyfvwcvzsehg.supabase.co";
const SUPABASE_KEY = "sb_publishable_8YUNF2yAUi_jH5oLYeTxjQ_XfKA1Ezh";
const supabaseClient = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY) : null;

const categoryNames={retirement:"退休理財規劃",education:"教育基金與子女規劃","business-tax":"生意與稅務規劃",legacy:"遺產傳承與資產保護",market:"市場觀察與財經知識",resources:"課程與其他素材"};
let articleData=[];

async function initLibrary(){
 const grid=document.getElementById("articleGrid"); if(!grid)return;
 try{
  if(supabaseClient){
    // 優先從 Supabase 雲端資料庫讀取文章
    const { data, error } = await supabaseClient.from('articles').select('*').order('id', { ascending: false });
    if(!error && data && data.length > 0){
      articleData = data;
      renderArticles();
      return;
    }
  }
  // 備份機制：若雲端無資料則讀取原本的 static articles.json
  const r=await fetch("articles.json");
  articleData=await r.json();
  renderArticles();
 }
 catch(e){
  grid.innerHTML="<p>文章目錄載入失敗，請重新整理頁面。</p>";
 }
}

function renderArticles(){
 const q=(document.getElementById("searchInput")?.value||"").trim().toLowerCase();
 const c=document.getElementById("categoryFilter")?.value||"";
 const list=articleData.filter(a=>(!c||a.category===c)&&(!q||(a.title+" "+a.excerpt+" "+a.source).toLowerCase().includes(q)));
 const grid=document.getElementById("articleGrid");
 grid.innerHTML=list.map(a=>`<div class="article-card"><span class="tag">${categoryNames[a.category]||"知識素材"} · ${a.kind||"文章"}</span><h3>${escapeHTML(a.title)}</h3><p>${escapeHTML(a.excerpt||"原始文件已匯入，等待內容審閱。")}</p><div class="card-foot"><span>${a.paragraphs||10} 段 · 雲端同步</span><a href="articles/${encodeURIComponent(a.slug||'post')}.html">閱讀原稿 →</a></div></div>`).join("")||"<p>找不到符合條件的文章。</p>";
 document.getElementById("resultCount").textContent=`顯示 ${list.length} / ${articleData.length} 份文件`;
}

function escapeHTML(s){return String(s||"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}

document.getElementById("searchInput")?.addEventListener("input",renderArticles);
document.getElementById("categoryFilter")?.addEventListener("change",renderArticles);
initLibrary();

const langToggle=document.getElementById("langToggle");
let lang="zh";
const translations={en:{topics:"Topics",library:"Knowledge Library",qa:"Financial Q&A",games:"Financial Games",about:"About the Founder",hero:"Financial knowledge for a more confident life.",intro:"Helping Taiwan–U.S. families and business owners understand retirement, education, tax planning, and legacy topics.",explore:"Explore Topics",challenge:"Play a Challenge",contact:"Get in touch."}};
langToggle?.addEventListener("click",()=>{
 lang=lang==="zh"?"en":"zh";langToggle.textContent=lang==="zh"?"EN":"中文";
 document.querySelectorAll("[data-zh][data-en]").forEach(el=>el.textContent=lang==="zh"?el.dataset.zh:el.dataset.en);
 if(lang==="en"){
  document.querySelector(".hero h1").innerHTML=translations.en.hero;
  document.querySelector(".hero-copy>p").textContent=translations.en.intro;
  document.querySelector(".hero-actions .primary").textContent=translations.en.explore;
  document.querySelector(".hero-actions .secondary").textContent=translations.en.challenge;
  document.querySelector("#contact h2").textContent=translations.en.contact;
 }else{location.reload();}
});

const qaForm=document.getElementById("qaForm");
function loadQA(){const list=document.getElementById("qaList");if(!list)return;const items=JSON.parse(localStorage.getItem("ruyiDemoQA")||"[]");list.innerHTML=items.map(x=>`<div class="qa-item"><small>${escapeHTML(x.category)} · ${x.anonymous?"匿名":"訪客"} · 本機示範</small>${escapeHTML(x.question)}</div>`).join("");}
qaForm?.addEventListener("submit",e=>{e.preventDefault();const question=document.getElementById("qaQuestion").value.trim();if(!question)return;const items=JSON.parse(localStorage.getItem("ruyiDemoQA")||"[]");items.unshift({question,category:document.getElementById("qaCategory").value,anonymous:document.getElementById("qaAnonymous").checked});localStorage.setItem("ruyiDemoQA",JSON.stringify(items.slice(0,20)));document.getElementById("qaQuestion").value="";document.getElementById("qaMessage").textContent="已儲存在這台裝置的瀏覽器示範資料中，尚未送到網站管理者。";loadQA();});
loadQA();

const quizzes={
 beginner:{q:"建立緊急預備金時，較常見的起點建議是？",opts:["先準備數個月的必要生活費","把所有現金投入單一股票","完全不需要現金預備"],a:0,why:"緊急預備金可協助家庭應付突發支出；實際金額需依收入穩定度、家庭責任與保險保障調整。"},
 intermediate:{q:"美國 529 教育儲蓄計畫的主要用途是什麼？",opts:["專為退休收入設計","協助為合格教育支出儲蓄","保證投資本金不會波動"],a:1,why:"529 計畫主要用於合格教育支出；投資選項、州稅優惠與提款規則需依計畫及所在地確認。"},
 advanced:{q:"台美跨境家庭在規劃海外金融資產前，最適合先做哪件事？",opts:["只看產品預期報酬","先確認稅務身分、申報義務與資產所在地規則","假設台灣與美國規則完全相同"],a:1,why:"跨境家庭可能同時涉及不同國家的稅務與申報規則，應先盤點身分與資產，再向合格跨境稅務專業人士確認。"}
};
document.querySelectorAll(".game-btn").forEach(btn=>btn.addEventListener("click",()=>{
 const level=btn.dataset.level,q=quizzes[level],area=document.getElementById("gameArea");
 area.innerHTML=`<strong>${level.toUpperCase()} 挑戰題</strong><p>${q.q}</p>`+q.opts.map((o,i)=>`<button class="game-option" data-answer="${i}">${o}</button>`).join("")+`<div id="feedback"></div>`;
 area.querySelectorAll(".game-option").forEach(b=>b.addEventListener("click",()=>{const ok=Number(b.dataset.answer)===q.a;area.querySelector("#feedback").innerHTML=`<p class="game-feedback">${ok?"答對了！":"再想一想！"} ${q.why}</p>`;}));
}));
