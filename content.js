(function () {
  if (window !== window.top) return;

  const STATE_FILE_NAMES = {
    happy: "avatar-happy.png",
    mildlyStressed: "avatar-mildly-stressed.png",
    stressed: "avatar-stressed.png",
  };

  function getState(tabCount, activeTabIndex) {
    if (tabCount == null && activeTabIndex == null) return "happy";
    const count = Number(tabCount);
    const index = Number(activeTabIndex);
    if (count <= 3 && index <= 2) return "happy";
    if (count >= 4 && count <= 6) return "mildlyStressed";
    return "stressed";
  }

  function getAvatarSrc(state) {
    const filename = STATE_FILE_NAMES[state];
    return chrome.runtime.getURL("assets/" + filename);
  }

  function injectFloatStyle() {
    if (document.getElementById("browser-twin-float-style")) return;
    const style = document.createElement("style");
    style.id = "browser-twin-float-style";
    style.textContent =
      "@keyframes twin-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}" +
      "#browser-twin-root{animation:twin-float 2.5s ease-in-out infinite}";
    (document.head || document.documentElement).appendChild(style);
  }

  function ensureRoot() {
    let root = document.getElementById("browser-twin-root");
    if (root) return root;
    injectFloatStyle();
    root = document.createElement("div");
    root.id = "browser-twin-root";
    root.style.cssText =
      "position:fixed;bottom:16px;right:16px;z-index:2147483647;" +
      "pointer-events:none;width:200px;height:200px;";
    const img = document.createElement("img");
    img.alt = "Browser twin";
    img.style.cssText = "width:100%;height:100%;display:block;transform:scaleX(-1);";
    img.setAttribute("data-state", "happy");
    root.appendChild(img);
    if (document.body) {
      document.body.appendChild(root);
    } else {
      document.documentElement.addEventListener("DOMContentLoaded", () => document.body.appendChild(root));
    }
    return root;
  }

  function updatePet(state) {
    const root = ensureRoot();
    const img = root.querySelector("img");
    if (!img) return;
    img.setAttribute("data-state", state);
    img.src = getAvatarSrc(state);
  }

  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.tabCount !== undefined || msg.activeTabIndex !== undefined) {
      const state = getState(msg.tabCount, msg.activeTabIndex);
      updatePet(state);
    }
  });

  // Default: show happy until we receive tab data
  updatePet("happy");

  // Ask background for current tab state (in case we loaded after a tab change)
  chrome.runtime.sendMessage({ type: "getTabState" }).catch(() => {});
})();
