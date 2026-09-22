(() => {
  const timelines = document.querySelectorAll(
    ".report-page .report-timeline"
  );

  const groups = [];

  // 各記事の日付に対応するポイントを作成
  timelines.forEach((timeline) => {
    const points = [];

    timeline.querySelectorAll(".report-date").forEach((date) => {
      const point = document.createElement("span");

      point.className = "report-point";
      point.setAttribute("aria-hidden", "true");
      point.hidden = true;

      timeline.appendChild(point);

      points.push({
        date: date.querySelector("time") || date,
        point
      });
    });

    groups.push({ timeline, points });
  });

  // 日付の高さと、縦線の中心にポイントを合わせる
  function updatePoints() {
    groups.forEach(({ timeline, points }) => {
      const timelineRect = timeline.getBoundingClientRect();
      const lineStyle = getComputedStyle(timeline, "::before");

      const lineCenter =
        parseFloat(lineStyle.left) +
        parseFloat(lineStyle.width) / 2;

      points.forEach(({ date, point }) => {
        const dateRect = date.getBoundingClientRect();

        if (!dateRect.height || !Number.isFinite(lineCenter)) {
          point.hidden = true;
          return;
        }

        const top =
          dateRect.top -
          timelineRect.top -
          timeline.clientTop +
          timeline.scrollTop +
          dateRect.height / 2;

        point.style.left = `${lineCenter}px`;
        point.style.top = `${top}px`;
        point.hidden = false;
      });
    });
  }

  // 複数の更新要求を1回にまとめる
  let scheduled = false;

  function scheduleUpdate() {
    if (scheduled) return;

    scheduled = true;

    requestAnimationFrame(() => {
      scheduled = false;
      updatePoints();
    });
  }

  // 画面幅や記事の高さが変わったら位置を調整
  const observer = new ResizeObserver(scheduleUpdate);

  groups.forEach(({ timeline, points }) => {
    observer.observe(timeline);

    timeline.querySelectorAll("article").forEach((article) => {
      observer.observe(article);
    });

    points.forEach(({ date }) => observer.observe(date));
  });

  window.addEventListener("resize", scheduleUpdate);
  window.addEventListener("load", scheduleUpdate);
  document.fonts.ready.then(scheduleUpdate);

  scheduleUpdate();
})();