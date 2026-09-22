const headerUrl = new URL(
  "../HTML/header.html",
  document.currentScript.src
);

document.addEventListener("DOMContentLoaded", function () {
  fetch(headerUrl)
    .then(function (response) {
      if (!response.ok) {
        throw new Error("header.htmlが見つかりません");
      }

      return response.text();
    })
    .then(function (data) {
      const header = document.getElementById("header");
      if (!header) return;

      const template = document.createElement("template");
      template.innerHTML = data;

      // header.htmlの場所を基準にリンク・画像・動画を解決する
      template.content.querySelectorAll("[href], [src]")
        .forEach(function (element) {
          ["href", "src"].forEach(function (attribute) {
            const value = element.getAttribute(attribute);

            if (value) {
              element.setAttribute(
                attribute,
                new URL(value, headerUrl).href
              );
            }
          });
        });

      header.replaceChildren(template.content);
      
      // ホームの場合だけ「is-home」を付ける
const homeUrl = new URL("../index.html", headerUrl);
const pagePath = window.location.pathname.replace(
  /\/$/,
  "/index.html"
);

header.querySelector(".site-header").classList.toggle(
  "is-home",
  pagePath === homeUrl.pathname
);

      // メニューの開閉
const menu = header.querySelector("#site-menu");
const openButton = header.querySelector(".menu-open");
const closeButton = header.querySelector(".menu-close");

openButton.addEventListener("click", function () {
  menu.showModal();
  openButton.setAttribute("aria-expanded", "true");
  document.documentElement.classList.add("menu-is-open");
});

closeButton.addEventListener("click", function () {
  menu.close();
});

menu.addEventListener("close", function () {
  openButton.setAttribute("aria-expanded", "false");
  document.documentElement.classList.remove("menu-is-open");
  openButton.focus();
});

      const video = header.querySelector(".header-video");

if (video) {
  // Safari向けに、動画のプロパティにも明示する
  video.defaultMuted = true;
  video.muted = true;
  video.playsInline = true;

  const startVideo = function () {
    video.play().catch(function (error) {
      console.error(
        "ヘッダー動画の再生に失敗:",
        error.name,
        error.message
      );
    });
  };

  video.addEventListener("loadeddata", startVideo, { once: true });

  // 挿入後の動画ソースを読み込み直す
  video.load();
  startVideo();
}

      const currentPath = window.location.pathname.replace(
        /\/$/,
        "/index.html"
      );

      header.querySelectorAll("nav a").forEach(function (link) {
        if (new URL(link.href).pathname === currentPath) {
          link.setAttribute("aria-current", "page");
        }
      });
    })
    .catch(function (error) {
      console.error("ヘッダーの読み込みに失敗しました:", error);
    });
});