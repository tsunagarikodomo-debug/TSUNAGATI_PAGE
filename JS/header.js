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