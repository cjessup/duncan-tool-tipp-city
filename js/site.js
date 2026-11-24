(function () {
  document.documentElement.classList.add("js");

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var nodes = document.querySelectorAll(".reveal");

  if (!reduce && "IntersectionObserver" in window) {
    nodes.forEach(function (el, i) {
      el.style.setProperty("--d", (i % 5) * 70 + "ms");
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    nodes.forEach(function (el) { io.observe(el); });
  } else {
    nodes.forEach(function (el) { el.classList.add("in"); });
  }

  document.querySelectorAll("form[data-demo]").forEach(function (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var note = form.querySelector("[data-demo-note]");
      if (note) note.hidden = false;
    });
  });

  var shots = Array.prototype.slice.call(document.querySelectorAll("a.shot"));
  if (!shots.length) return;

  var box = document.createElement("div");
  box.className = "lightbox";
  box.hidden = true;
  box.innerHTML =
    '<div class="lb-dialog" role="dialog" aria-modal="true" aria-label="Photo">' +
    '<button type="button" class="lb-close">Close</button>' +
    '<img alt="" class="lb-img">' +
    '<p class="lb-cap"></p>' +
    '<div class="lb-nav"><button type="button" class="lb-prev">Previous</button>' +
    '<button type="button" class="lb-next">Next</button></div></div>';
  document.body.appendChild(box);

  var img = box.querySelector(".lb-img");
  var cap = box.querySelector(".lb-cap");
  var index = 0;
  var timer = null;

  function paint(i) {
    index = (i + shots.length) % shots.length;
    var link = shots[index];
    var text = link.getAttribute("data-caption") || "";
    var image = link.querySelector("img");
    img.src = link.getAttribute("href");
    img.alt = text || (image ? image.alt : "");
    cap.textContent = text;
  }

  function show(i) {
    if (reduce) {
      paint(i);
      return;
    }
    img.classList.add("is-out");
    window.clearTimeout(timer);
    timer = window.setTimeout(function () {
      paint(i);
      img.classList.remove("is-out");
    }, 180);
  }

  function open(i) {
    box.hidden = false;
    document.body.classList.add("lb-open");
    img.classList.remove("is-out");
    paint(i);
    box.querySelector(".lb-close").focus();
  }

  function close() {
    box.hidden = true;
    document.body.classList.remove("lb-open");
  }

  shots.forEach(function (link, i) {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      open(i);
    });
  });

  box.querySelector(".lb-close").addEventListener("click", close);
  box.querySelector(".lb-prev").addEventListener("click", function () { show(index - 1); });
  box.querySelector(".lb-next").addEventListener("click", function () { show(index + 1); });
  box.addEventListener("click", function (event) {
    if (event.target === box) close();
  });
  document.addEventListener("keydown", function (event) {
    if (box.hidden) return;
    if (event.key === "Escape") close();
    if (event.key === "ArrowRight") show(index + 1);
    if (event.key === "ArrowLeft") show(index - 1);
  });
})();
