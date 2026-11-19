/* kean.js — scroll reveal, hero email field, "What I do" hover preview and the
   contact flow. Ported from the water site (water-port.vercel.app) to plain JS. */
(function () {
  "use strict";

  var ENDPOINT = "https://formsubmit.co/ajax/keanedwards1@gmail.com";
  var PHONE = "415-930-2468";
  var PHONE_HREF = "tel:+14159302468";
  var SMS_HREF = "sms:+14159302468";

  var SERVICES = [
    "Website builds",
    "Website edits",
    "Website maintenance",
    "Website hosting",
    "Google Business Profile and reviews",
    "SEO",
    "AI SEO",
    "Email management",
    "Small jobs",
    "Something else"
  ];
  var BUDGETS = ["Under $2,500", "$2,500 – $5,000", "$5,000 – $10,000", "$10,000 +", "Not sure yet"];

  var ARROW =
    '<svg aria-hidden="true" width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 10h12M11 5l5 5-5 5"></path></svg>';
  var CLOSE =
    '<svg aria-hidden="true" width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 5l10 10M15 5L5 15"></path></svg>';
  var CHECK =
    '<svg aria-hidden="true" width="13" height="13" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 10.5l4 4 8-9"></path></svg>';

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function validEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(v).trim());
  }

  /* ---------- Scroll reveal ---------- */
  function initReveal() {
    document.documentElement.dataset.ready = "true";
    var items = Array.prototype.slice.call(document.querySelectorAll("[data-reveal]"));
    if (!items.length) return;
    if (!("IntersectionObserver" in window)) {
      items.forEach(function (el) {
        el.classList.add("in");
      });
      return;
    }
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px" }
    );
    items.forEach(function (el) {
      io.observe(el);
    });
  }

  /* ---------- "What I do": cursor-following preview ---------- */
  function initServices() {
    var svc = document.querySelector(".svc");
    if (!svc) return;
    var preview = svc.querySelector(".svc-preview");
    if (!preview) return;
    var imgs = preview.querySelectorAll("img");
    svc.addEventListener("mousemove", function (e) {
      var r = svc.getBoundingClientRect();
      preview.style.transform = "translate(" + (e.clientX - r.left + 24) + "px, " + (e.clientY - r.top - 90) + "px)";
    });
    svc.addEventListener("mouseleave", function () {
      preview.classList.remove("on");
    });
    svc.querySelectorAll("li").forEach(function (li, i) {
      li.addEventListener("mouseenter", function () {
        preview.classList.add("on");
        imgs.forEach(function (img, j) {
          img.classList.toggle("on", i === j);
        });
      });
    });
  }

  /* ---------- Weekday logic for the "I'll reply by" line ---------- */
  var DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  function replyBy(now) {
    var parts = now.toLocaleDateString("en-CA", { timeZone: "America/Los_Angeles" }).split("-").map(Number);
    var weekday = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2])).getUTCDay();
    var add = weekday === 5 ? 3 : weekday === 6 ? 2 : 1;
    return add === 1 ? "end of day tomorrow" : "end of day " + DAYS[(weekday + add) % 7];
  }

  /* ---------- Submit ---------- */
  function send(payload) {
    var body = {
      name: payload.name || "",
      email: payload.email,
      phone: payload.phone || "",
      website: payload.website || "",
      business: payload.business || "",
      budget: payload.budget || "",
      need: payload.need || "",
      details: payload.details || "",
      source: payload.source || "site",
      _subject: "New lead from " + (payload.name || payload.email) + " (" + (payload.source || "site") + ")",
      _replyto: payload.email,
      _template: "table",
      _honey: payload.honey || ""
    };
    return fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(body)
    }).then(function (res) {
      return res
        .json()
        .catch(function () {
          return null;
        })
        .then(function (data) {
          if (!res.ok || (data && data.success !== undefined && String(data.success) !== "true")) {
            throw new Error("The form could not be sent");
          }
        });
    });
  }

  /* ---------- Topographic background canvas (from the water site) ---------- */
  function hash(x, y) {
    var n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
    return n - Math.floor(n);
  }
  function smooth(t) {
    return t * t * (3 - 2 * t);
  }
  function vnoise(x, y) {
    var ix = Math.floor(x),
      iy = Math.floor(y),
      fx = x - ix,
      fy = y - iy,
      sx = smooth(fx),
      sy = smooth(fy),
      a = hash(ix, iy),
      b = hash(ix + 1, iy),
      c = hash(ix, iy + 1),
      d = hash(ix + 1, iy + 1);
    return a + (b - a) * sx + (c - a) * sy + (a - b - c + d) * sx * sy;
  }
  function field(x, y, t) {
    return vnoise(x + t, y) * 0.6 + vnoise(x * 2.1 - t * 0.7, y * 2.1 + 3.7) * 0.28 + vnoise(x * 4.3 + 9.1, y * 4.3 - t * 0.4) * 0.12;
  }
  function startTopo(canvas, isMilk) {
    var ctx = canvas.getContext("2d");
    if (!ctx) return function () {};
    var raf = 0;
    var t0 = performance.now();
    var running = true;
    function frame() {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      var w = canvas.clientWidth,
        h = canvas.clientHeight;
      if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      var t = reduceMotion ? 0 : ((performance.now() - t0) / 1000) * 0.025;
      var cols = Math.ceil(w / 10) + 1,
        rows = Math.ceil(h / 10) + 1;
      var g = new Float32Array(cols * rows);
      for (var r = 0; r < rows; r++) for (var c = 0; c < cols; c++) g[r * cols + c] = field((c * 10) / 260, (r * 10) / 260, t);
      var milk = isMilk();
      var rgb = milk ? "78, 93, 114" : "31, 31, 31";
      for (var level = 1; level < 22; level++) {
        var th = level / 22;
        var major = level % 5 === 0;
        ctx.beginPath();
        for (var rr = 0; rr < rows - 1; rr++) {
          for (var cc = 0; cc < cols - 1; cc++) {
            var tl = g[rr * cols + cc],
              tr = g[rr * cols + cc + 1],
              br = g[(rr + 1) * cols + cc + 1],
              bl = g[(rr + 1) * cols + cc];
            var code = (tl > th ? 8 : 0) | (tr > th ? 4 : 0) | (br > th ? 2 : 0) | (bl > th ? 1 : 0);
            if (code === 0 || code === 15) continue;
            var x = cc * 10,
              y = rr * 10;
            var top = [x + (10 * (th - tl)) / (tr - tl), y];
            var right = [x + 10, y + (10 * (th - tr)) / (br - tr)];
            var bottom = [x + (10 * (th - bl)) / (br - bl), y + 10];
            var left = [x, y + (10 * (th - tl)) / (bl - tl)];
            var seg = function (p, q) {
              ctx.moveTo(p[0], p[1]);
              ctx.lineTo(q[0], q[1]);
            };
            switch (code) {
              case 1:
              case 14:
                seg(left, bottom);
                break;
              case 2:
              case 13:
                seg(bottom, right);
                break;
              case 3:
              case 12:
                seg(left, right);
                break;
              case 4:
              case 11:
                seg(top, right);
                break;
              case 6:
              case 9:
                seg(top, bottom);
                break;
              case 7:
              case 8:
                seg(left, top);
                break;
              case 5:
                seg(left, top);
                seg(bottom, right);
                break;
              case 10:
                seg(top, right);
                seg(left, bottom);
                break;
            }
          }
        }
        ctx.strokeStyle = "rgba(" + rgb + ", " + (milk ? 0.22 : major ? 0.1 : 0.06) + ")";
        ctx.lineWidth = milk ? 1.1 : 0.8;
        ctx.stroke();
      }
      if (!reduceMotion && running) raf = requestAnimationFrame(frame);
    }
    frame();
    return function () {
      running = false;
      cancelAnimationFrame(raf);
    };
  }

  /* ---------- Contact flow ---------- */
  var openState = null;

  function openLead(opts) {
    if (openState) return;
    opts = opts || {};
    var opener = document.activeElement;
    var email = opts.email || "";
    var step = validEmail(email) ? 1 : 0;
    var emailPrefilled = step === 1;
    var picked = opts.service ? [opts.service] : [];
    var budget = "";
    var f = { first: "", last: "", business: "", website: "", phone: "", details: "", honey: "" };
    var status = "idle";
    var source = opts.source || "site";

    var scrim = document.createElement("div");
    scrim.className = "lead";
    scrim.setAttribute("role", "presentation");
    var panel = document.createElement("div");
    panel.className = "lead-panel";
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-modal", "true");
    panel.setAttribute("aria-labelledby", "lead-title");
    scrim.appendChild(panel);

    var canvas = document.createElement("canvas");
    canvas.className = "topo";
    canvas.setAttribute("aria-hidden", "true");

    var scrollbar = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = scrollbar + "px";

    function close() {
      document.removeEventListener("keydown", onKey);
      stopTopo();
      scrim.remove();
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
      openState = null;
      if (opener && opener.focus) opener.focus();
    }
    function onKey(e) {
      if (e.key === "Escape") {
        close();
        return;
      }
      if (e.key !== "Tab") return;
      var items = Array.prototype.slice
        .call(panel.querySelectorAll("button, a, input, textarea"))
        .filter(function (el) {
          return !el.disabled && el.offsetParent !== null && el.tabIndex !== -1;
        });
      if (!items.length) return;
      var first = items[0],
        last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
    scrim.addEventListener("pointerdown", function (e) {
      if (e.target === scrim) close();
    });
    document.addEventListener("keydown", onKey);

    function field(name, label, attrs, wide, required) {
      return (
        '<label class="' + (wide ? "wide" : "") + '">' + esc(label) +
        (required ? '<span class="req" aria-hidden="true">*</span>' : "") +
        '<input name="' + name + '" ' + (attrs || "") + ' value="' + esc(f[name] || "") + '"></label>'
      );
    }

    function render() {
      var steps = ["Email", "About you", "Projects"];
      var top =
        '<div class="lead-top">' +
        (step < 3
          ? '<ol class="lead-steps" aria-label="Step ' + (step + 1) + ' of 3">' +
            steps
              .map(function (s, i) {
                return '<li class="' + (i < step ? "done" : i === step ? "now" : "") + '"><span>' + (i < step ? CHECK : i + 1) + "</span>" + s + "</li>";
              })
              .join("") +
            "</ol>"
          : '<p class="lead-steps">Sent</p>') +
        '<button type="button" class="lead-close" aria-label="Close">' + CLOSE + "</button></div>";

      var body = "";
      if (step === 0) {
        body =
          '<form class="lead-body" novalidate>' +
          '<h2 id="lead-title">' + (opts.title ? esc(opts.title) : "I can’t wait to hear from you;<br>get in touch.") + "</h2>" +
          '<p class="lead-sub">' + (opts.sub ? esc(opts.sub) : "There is no time like now! If you’re ready to start a project or have an inquiry, start with your email.") + "</p>" +
          '<label class="sr-only" for="lead-email">Email</label>' +
          '<input id="lead-email" data-autofocus class="lead-big" type="email" autocomplete="email" placeholder="you@yourbusiness.com" value="' + esc(email) + '">' +
          '<p class="lead-error" role="alert"></p>' +
          '<div class="lead-actions"><button type="submit" class="lead-next">Continue' + ARROW + "</button></div></form>";
      } else if (step === 1) {
        body =
          '<form class="lead-body" novalidate>' +
          '<h2 id="lead-title">First, a little about you.</h2>' +
          '<div class="lead-fields">' +
          field("first", "First Name", 'type="text" data-autofocus autocomplete="given-name" required', false, true) +
          field("last", "Last Name", 'type="text" autocomplete="family-name" required', false, true) +
          field("business", "Company Name", 'type="text" autocomplete="organization"', false, false) +
          field("phone", "Phone", 'type="tel" autocomplete="tel" required', false, true) +
          field("website", "Website", 'type="text" inputmode="url" placeholder="yourbusiness.com"', true, false) +
          '<label class="trap" aria-hidden="true">Leave empty<input name="honey" type="text" tabindex="-1" autocomplete="off" value="' + esc(f.honey) + '"></label>' +
          "</div>" +
          '<p class="lead-error" role="alert"></p>' +
          '<div class="lead-actions">' +
          (emailPrefilled ? "" : '<button type="button" class="lead-back">Back</button>') +
          '<button type="submit" class="lead-next">Continue' + ARROW + "</button></div></form>";
      } else if (step === 2) {
        body =
          '<form class="lead-body" novalidate>' +
          '<h2 id="lead-title">Which project(s) are you interested in?</h2>' +
          '<p class="lead-sub">Pick as many as you like.</p>' +
          '<div class="lead-tiles" role="group" aria-label="Services">' +
          SERVICES.map(function (s, i) {
            var on = picked.indexOf(s) > -1;
            return '<button type="button" ' + (i === 0 ? "data-autofocus " : "") + 'aria-pressed="' + on + '" class="' + (on ? "on" : "") + '" data-service="' + esc(s) + '"><span class="lead-tile-num">' + String(i + 1).padStart(2, "0") + "</span><span>" + esc(s) + "</span></button>";
          }).join("") +
          "</div>" +
          '<fieldset class="lead-budget"><legend>Do you have a design budget in mind?<span class="req" aria-hidden="true">*</span></legend><div>' +
          BUDGETS.map(function (b) {
            var on = budget === b;
            return '<button type="button" aria-pressed="' + on + '" class="' + (on ? "on" : "") + '" data-budget="' + esc(b) + '">' + esc(b) + "</button>";
          }).join("") +
          "</div></fieldset>" +
          '<label class="lead-over"><span class="lead-over-title">Now, over to you; tell me more about your company</span>' +
          '<textarea name="details" rows="4" placeholder="What you do, what’s not working, and anything else on your mind.">' + esc(f.details) + "</textarea></label>" +
          '<p class="lead-error" role="alert">' + (status === "failed" ? "That didn’t send. Call or text me at " + PHONE + " instead." : "") + "</p>" +
          '<div class="lead-actions"><button type="button" class="lead-back">Back</button>' +
          '<button type="submit" class="lead-next"' + (status === "sending" ? " disabled" : "") + ">" + (status === "sending" ? "Sending" : "Send to Kean") + ARROW + "</button></div></form>";
      } else {
        body =
          '<div class="lead-body lead-done">' +
          '<img src="/images/avatar.webp" alt="" width="96" height="96">' +
          '<h2 id="lead-title" tabindex="-1" data-autofocus>Thanks' + (f.first.trim() ? ", " + esc(f.first.trim()) : "") + ". It’s on my desk.</h2>" +
          '<p class="lead-sub">I’ll reply to ' + esc(email) + " by " + replyBy(new Date()) + ".</p>" +
          '<p class="lead-alt">In a hurry? <a href="' + PHONE_HREF + '">Call</a> or <a href="' + SMS_HREF + '">text</a> ' + PHONE + ".</p>" +
          '<div class="lead-actions"><button type="button" class="lead-next" data-done>Back to the site</button></div></div>';
      }

      var keepCanvas = canvas.parentNode === panel;
      panel.className = "lead-panel" + (step === 3 ? " milk" : "");
      panel.innerHTML = "";
      panel.appendChild(canvas);
      panel.insertAdjacentHTML("beforeend", top + body);
      if (!keepCanvas && !stopTopo.started) {
        stopTopo.fn = startTopo(canvas, function () {
          return step === 3;
        });
        stopTopo.started = true;
      }
      wire();
      var af = panel.querySelector("[data-autofocus]");
      requestAnimationFrame(function () {
        if (af) af.focus();
      });
    }

    function stopTopo() {
      if (stopTopo.fn) stopTopo.fn();
      stopTopo.fn = null;
    }
    stopTopo.fn = null;
    stopTopo.started = false;

    function setError(msg) {
      var el = panel.querySelector(".lead-error");
      if (el) el.textContent = msg;
    }
    function syncFields() {
      panel.querySelectorAll(".lead-fields input").forEach(function (i) {
        f[i.name] = i.value;
      });
      var d = panel.querySelector('textarea[name="details"]');
      if (d) f.details = d.value;
    }

    function wire() {
      var closeBtn = panel.querySelector(".lead-close");
      if (closeBtn) closeBtn.addEventListener("click", close);
      var done = panel.querySelector("[data-done]");
      if (done) done.addEventListener("click", close);
      var back = panel.querySelector(".lead-back");
      if (back)
        back.addEventListener("click", function () {
          syncFields();
          step -= 1;
          render();
        });
      var form = panel.querySelector("form");
      if (!form) return;

      if (step === 0) {
        form.addEventListener("submit", function (e) {
          e.preventDefault();
          var v = panel.querySelector("#lead-email").value;
          if (!validEmail(v)) {
            setError("That email doesn’t look right yet.");
            return;
          }
          email = v.trim();
          send({ email: email, need: "Started the form", source: source + ":email" }).catch(function () {});
          step = 1;
          render();
        });
      } else if (step === 1) {
        form.addEventListener("submit", function (e) {
          e.preventDefault();
          syncFields();
          if (!f.first.trim()) return setError("What should I call you?");
          if (!f.last.trim()) return setError("And your last name?");
          if (f.phone.replace(/\D/g, "").length < 7) return setError("What’s the best number to reach you?");
          step = 2;
          render();
        });
      } else if (step === 2) {
        panel.querySelectorAll("[data-service]").forEach(function (b) {
          b.addEventListener("click", function () {
            var s = b.getAttribute("data-service");
            var i = picked.indexOf(s);
            if (i > -1) picked.splice(i, 1);
            else picked.push(s);
            b.classList.toggle("on", i === -1);
            b.setAttribute("aria-pressed", i === -1);
          });
        });
        panel.querySelectorAll("[data-budget]").forEach(function (b) {
          b.addEventListener("click", function () {
            budget = b.getAttribute("data-budget");
            panel.querySelectorAll("[data-budget]").forEach(function (o) {
              var on = o === b;
              o.classList.toggle("on", on);
              o.setAttribute("aria-pressed", on);
            });
          });
        });
        form.addEventListener("submit", function (e) {
          e.preventDefault();
          syncFields();
          if (!picked.length) return setError("Pick at least one project, or Something else.");
          if (!budget) return setError("Pick a budget, or Not sure yet.");
          status = "sending";
          setError("");
          var btn = panel.querySelector(".lead-next");
          btn.disabled = true;
          btn.firstChild.textContent = "Sending";
          send({
            name: f.first.trim() + " " + f.last.trim(),
            email: email,
            phone: f.phone,
            website: f.website,
            business: f.business,
            budget: budget,
            need: picked.join(", "),
            details: f.details,
            source: source,
            honey: f.honey
          })
            .then(function () {
              status = "idle";
              step = 3;
              render();
            })
            .catch(function () {
              status = "failed";
              btn.disabled = false;
              btn.firstChild.textContent = "Send to Kean";
              setError("That didn’t send. Call or text me at " + PHONE + " instead.");
            });
        });
      }
    }

    document.body.appendChild(scrim);
    openState = { close: close };
    render();
  }

  /* ---------- Wire up triggers ---------- */
  function initLead() {
    // Hero email field (and any other .email-start form)
    document.querySelectorAll("form.email-start").forEach(function (form) {
      var input = form.querySelector("input");
      var err = form.querySelector(".email-start-error");
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        if (!validEmail(input.value)) {
          if (err) err.textContent = "Enter your email to start.";
          return;
        }
        if (err) err.textContent = "";
        var src = form.getAttribute("data-source") || "home-hero";
        send({ email: input.value.trim(), need: "Started the form", source: src + ":email" }).catch(function () {});
        openLead({ source: src, email: input.value.trim() });
      });
    });

    // Anything that should open the flow: data-lead, or links to the old contact pages
    document.addEventListener("click", function (e) {
      var el = e.target.closest("[data-lead], a[href='/contact'], a[href='/start-your-project']");
      if (!el) return;
      if (el.tagName === "A" && (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0)) return;
      e.preventDefault();
      var ref = el.getAttribute("data-lead-ref");
      openLead({
        source: ref || el.getAttribute("data-source") || "site",
        service: el.getAttribute("data-lead-service") || "",
        title: ref ? "Want a site like " + ref + "?" : "",
        sub: ref ? "Tell me what you like about it. Start with your email." : ""
      });
    });
  }

  /* ---------- Footer clock (Lagunitas time) ---------- */
  function initClock() {
    var el = document.querySelector("[data-pf-time]");
    if (!el) return;
    function tick() {
      el.textContent = new Date().toLocaleTimeString("en-US", { timeZone: "America/Los_Angeles", hour: "numeric", minute: "2-digit" });
    }
    tick();
    setInterval(tick, 30000);
  }

  function boot() {
    initClock();
    initReveal();
    initServices();
    initLead();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
