document.addEventListener("DOMContentLoaded", function () {
  fetch("./header.html")
    .then(function (response) {
      if (!response.ok) {
        throw new Error("header.htmlが見つかりません");
      }

      return response.text();
    })
    .then(function (data) {
      const header = document.getElementById("header");
      header.innerHTML = data;

      // フォルダーのURLで開いた場合もホームとして扱う
      const currentPath = window.location.pathname.replace(
        /\/$/,
        "/index.html"
      );

      header.querySelectorAll("nav a").forEach(function (link) {
        const linkPath = new URL(
          link.href,
          window.location.href
        ).pathname;

        if (linkPath === currentPath) {
          link.setAttribute("aria-current", "page");
        }
      });
    })
    .catch(function (error) {
      console.error("ヘッダーの読み込みに失敗しました:", error);
    });
});