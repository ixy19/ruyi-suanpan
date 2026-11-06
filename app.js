let articles = [];

document.addEventListener("DOMContentLoaded", () => {
  // 初始化語言切換功能
  initLangToggle();
  
  // 載入雲端或本地的 articles.json 文章資料
  loadArticles();
  
  // 初始化財務問答表單互動
  initQAForm();
  
  // 初始化遊戲中心互動
  initGameCenter();
});

// 載入文章資料
function loadArticles() {
  const grid = document.getElementById('articleGrid');
  if (!grid) return;

  fetch('articles.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('網路回應不正常');
      }
      return response.json();
    })
    .then(data => {
      articles = data;
      renderArticles(articles);
      setupFilters();
      updateLibraryStatus(`已成功載入 ${articles.length} 份專業知識與理財文章。`);
    })
    .catch(error => {
      console.error('載入文章失敗：', error);
      grid.innerHTML = '<div class="error">目前無法載入文章目錄，請確認 articles.json 是否已正確放置於專案根目錄。</div>';
      updateLibraryStatus('文章載入發生異常。');
    });
}

// 渲染文章列表
function renderArticles(list) {
  const grid = document.getElementById('articleGrid');
  const countDiv = document.getElementById('resultCount');
  if (!grid) return;

  if (list.length === 0) {
    grid.innerHTML = '<div class="no-results">沒有找到符合條件的文章。</div>';
    if (countDiv) countDiv.textContent = '找到 0 篇文章';
    return;
  }

  grid.innerHTML = list.map(art => `
    <article class="article-card">
      <span class="tag">${getCategoryName(art.category)}</span>
      <h3>${escapeHtml(art.title)}</h3>
      <p>${escapeHtml(art.excerpt || '')}</p>
      <div class="card-foot">
        <span>閱讀時間約 3 分鐘</span>
        <a href="#" onclick="alert('詳細文章閱讀頁面建置中，您可以直接參考完整知識庫內容！'); return false;">閱讀內文 →</a>
      </div>
    </article>
  `).join('');

  if (countDiv) {
    countDiv.textContent = `顯示 ${list.length} 篇文章（共 ${articles.length} 篇）`;
  }
}

// 分類名稱轉換
function getCategoryName(cat) {
  const map = {
    'retirement': '退休理財規劃',
    'education': '教育基金與子女規劃',
    'business-tax': '生意與稅務規劃',
    'legacy': '遺產傳承與資產保護',
    'market': '市場觀察與財經知識',
    'resources': '課程與其他素材'
    // 增加中文對應，讓直接寫中文分類名稱也能完美顯示與篩選
    '市場觀察與財經知識': '市場觀察與財經知識',
    '退休理財規劃': '退休理財規劃',
    '教育基金與子女規劃': '教育基金與子女規劃',
    '生意與稅務規劃': '生意與稅務規劃',
    '遺產傳承與資產保護': '遺產傳承與資產保護',
    '課程與其他素材': '課程與其他素材'
  };
  return map[cat] || '財經知識庫';
}

// 設定搜尋與分類篩選
function setupFilters() {
  const searchInput = document.getElementById('searchInput');
  const categoryFilter = document.getElementById('categoryFilter');

  const filterHandler = () => {
    const keyword = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const category = categoryFilter ? categoryFilter.value : '';

    const filtered = articles.filter(art => {
      const matchCat = !category || art.category === category;
      const matchKey = !keyword || 
        art.title.toLowerCase().includes(keyword) || 
        (art.excerpt && art.excerpt.toLowerCase().includes(keyword)) ||
        (art.content && art.content.toLowerCase().includes(keyword));
      return matchCat && matchKey;
    });

    renderArticles(filtered);
  };

  if (searchInput) searchInput.addEventListener('input', filterHandler);
  if (categoryFilter) categoryFilter.addEventListener('change', filterHandler);
}

// 更新庫狀態提示
function updateLibraryStatus(text) {
  const statusEl = document.querySelector('.library-status');
  if (statusEl) {
    statusEl.innerHTML = `<span class="status-dot"></span> ${text}`;
  }
}

// 簡單的 HTML 轉義防護
function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// 問答表單互動
function initQAForm() {
  const form = document.getElementById('qaForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const qText = document.getElementById('qaQuestion').value;
    const cat = document.getElementById('qaCategory').value;
    const msg = document.getElementById('qaMessage');
    
    if (msg) {
      msg.textContent = `成功送出！分類：[${cat}] 您的提問已記錄於本機端測試介面。`;
      msg.style.color = '#10b981';
    }
    form.reset();
  });
}

// 遊戲中心玩法說明與互動
function initGameCenter() {
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

  document.querySelectorAll(".open-rule-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const gameKey = btn.dataset.target;
      const game = gameRules[gameKey];
      if(!game) return;

      if(ruleTitle) ruleTitle.textContent = game.title;
      if(ruleText) ruleText.textContent = game.desc;
      currentGameUrl = game.url;
      
      if(playGameLink) {
        if(gameKey === "challenge") {
          playGameLink.textContent = "👇 直接在下方開始挑戰題";
        } else {
          playGameLink.textContent = "🚀 準備好了，馬上進入遊戲！";
        }
      }

      if(ruleContainer) {
        ruleContainer.classList.remove("hidden");
        ruleContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  });

  document.getElementById("closeRuleBtn")?.addEventListener("click", () => {
    ruleContainer?.classList.add("hidden");
  });

  playGameLink?.addEventListener("click", (e) => {
    e.preventDefault();
    if(currentGameUrl && currentGameUrl !== "#") {
      window.open(currentGameUrl, "_blank");
    } else {
      const area = document.getElementById("gameArea");
      area?.classList.remove("hidden");
      area?.scrollIntoView({ behavior: 'smooth' });
    }
  });
}

// 雙語切換基礎框架
function initLangToggle() {
  const toggleBtn = document.getElementById("langToggle");
  if (!toggleBtn) return;

  let currentLang = 'zh';
  toggleBtn.addEventListener("click", () => {
    currentLang = currentLang === 'zh' ? 'en' : 'zh';
    toggleBtn.textContent = currentLang === 'zh' ? 'EN' : '繁中';
    
    // 切換導覽列屬性
    document.querySelectorAll("[data-zh]").forEach(el => {
      el.textContent = el.getAttribute(`data-${currentLang}`) || el.textContent;
    });
  });
}
