(function () {
  function $(i) {
    return document.getElementById(i);
  }
  var cv = $("c"),
    x = cv.getContext("2d"),
    W,
    H,
    SC,
    VW,
    DPR = Math.min(2, window.devicePixelRatio || 1);
  function rsz() {
    W = innerWidth;
    H = innerHeight;
    cv.width = W * DPR;
    cv.height = H * DPR;
    SC = H / 720;
    VW = W / SC;
  }
  addEventListener("resize", rsz);
  rsz();
  var S = "menu",
    G,
    B,
    P = [],
    AM = [],
    sol,
    hz,
    en,
    rg,
    sp,
    pw,
    mv,
    fl,
    goal,
    N,
    Lw,
    lvN = 1,
    cam = 0,
    keys = {},
    AC = null,
    muted = false,
    PI2 = 6.2832,
    TL = 40;
  var save = { u: 1, s: {} };
  try {
    var sv = JSON.parse(localStorage.getItem("bouncereborn") || "null");
    if (sv && sv.u) save = sv;
  } catch (e) {}
  function persist() {
    try {
      localStorage.setItem("bouncereborn", JSON.stringify(save));
    } catch (e) {}
  }

  function ac() {
    if (!AC) {
      try {
        AC = new (window.AudioContext || window.webkitAudioContext)();
      } catch (e) {}
    }
    if (AC && AC.state === "suspended") AC.resume();
  }
  function beep(f, d, t, v, f2) {
    if (!AC || muted) return;
    var n = AC.currentTime,
      o = AC.createOscillator(),
      g = AC.createGain();
    o.type = t || "square";
    o.frequency.setValueAtTime(f, n);
    if (f2) o.frequency.exponentialRampToValueAtTime(f2, n + d);
    g.gain.setValueAtTime(v || 0.05, n);
    g.gain.exponentialRampToValueAtTime(0.001, n + d);
    o.connect(g);
    g.connect(AC.destination);
    o.start(n);
    o.stop(n + d + 0.02);
  }

  var TH = [
    {
      n: "Sunny Meadow",
      s: ["#5db8ff", "#e6f7ff"],
      h: ["#8fd18a", "#62bb6c"],
      gt: "#58c25a",
      gd: "#8a5a34",
      pl: "#b6e07a",
      en: "#ff7a59",
      f: "#3aa0ff",
      g: 1800,
      a: "cloud",
      scene: "meadow",
      tip: "A gentle start.",
    },
    {
      n: "Dune Sea",
      s: ["#ff9f5a", "#ffe9bf"],
      h: ["#f0b46a", "#d99a52"],
      gt: "#e8c26b",
      gd: "#b9853f",
      pl: "#f3d58a",
      en: "#7a4bd1",
      f: "#d98f3a",
      g: 1800,
      wind: 1,
      a: "dust",
      scene: "redland",
      tip: "Desert winds push you around.",
    },
    {
      n: "Frost Peaks",
      s: ["#7fa9f5", "#eaf6ff"],
      h: ["#c8dcff", "#9bbbf0"],
      gt: "#f2fbff",
      gd: "#7aa0cf",
      pl: "#bfe3ff",
      en: "#2f6fd8",
      f: "#6fc3ff",
      g: 1800,
      ice: 1,
      a: "snow",
      scene: "moon",
      tip: "The ice is slippery!",
    },
    {
      n: "Crystal Cave",
      s: ["#0e0826", "#2a1a52"],
      h: ["#2b1d5c", "#3a2878"],
      gt: "#8a6cff",
      gd: "#2a1d4f",
      pl: "#9b86ff",
      en: "#ff4fa3",
      f: "#3b1d7a",
      g: 1800,
      dark: 1,
      a: "spark",
      scene: "dungeon",
      tip: "It is dark. Follow the glow.",
    },
    {
      n: "Magma Core",
      s: ["#2a0606", "#8a2a0a"],
      h: ["#4a130a", "#6a2410"],
      gt: "#6a5a5a",
      gd: "#2b1d1d",
      pl: "#9a7a6a",
      en: "#ffd23f",
      f: "#ff5a1a",
      g: 1800,
      lava: 1,
      a: "ember",
      scene: "redland",
      tip: "Do not touch the lava.",
    },
    {
      n: "Cloud Kingdom",
      s: ["#3d97ff", "#d6f0ff"],
      h: ["#ffffff", "#e6f3ff"],
      gt: "#ffffff",
      gd: "#bcd7f5",
      pl: "#ffffff",
      en: "#ff6fa8",
      f: "#9fd0ff",
      g: 1050,
      a: "cloud",
      scene: "cloud",
      tip: "Low gravity. Float!",
    },
  ];
  var MAX_LEVEL = 30;
  function makeTheme(n, s, h, colors, en, scene, block, a, tip, flags) {
    var t = {
      n: n,
      s: s,
      h: h,
      gt: colors[0],
      gd: colors[1],
      pl: colors[2],
      f: colors[3],
      en: en,
      g: 1800,
      scene: scene,
      block: block,
      a: a,
      tip: tip,
    };
    if (flags)
      Object.keys(flags).forEach(function (key) {
        t[key] = flags[key];
      });
    return t;
  }
  TH = TH.concat([
    makeTheme(
      "Wildwood Canopy",
      ["#87c9ee", "#d9f3d7"],
      ["#78ad72", "#39684a"],
      ["#69a95b", "#654c32", "#a9c978", "#4b8a64"],
      "#ff8b67",
      "forest",
      "wood",
      "firefly",
      "Vines and roots crowd the path.",
    ),
    makeTheme(
      "Sunken Keep",
      ["#123441", "#286b72"],
      ["#31565a", "#172e39"],
      ["#47716a", "#263642", "#668b7d", "#153944"],
      "#e8906e",
      "dungeon",
      "stone",
      "spark",
      "Mind the gaps between old stones.",
      { dark: 1 },
    ),
    makeTheme(
      "Scarlet Ridge",
      ["#ee9879", "#f7d1a3"],
      ["#c96955", "#744449"],
      ["#b94b3e", "#59342f", "#d07853", "#542f4c"],
      "#f5d166",
      "redland",
      "stone",
      "ember",
      "The brittle ridge narrows ahead.",
    ),
    makeTheme(
      "Verdant Depths",
      ["#285f69", "#a4c99c"],
      ["#376b54", "#183c37"],
      ["#3d7950", "#3b3028", "#72a667", "#173d48"],
      "#d98fff",
      "forest",
      "wood",
      "firefly",
      "Stay alert beneath the canopy.",
      { dark: 1 },
    ),
    makeTheme(
      "Azure Ruins",
      ["#3c9ac4", "#b9dbe0"],
      ["#578b91", "#31515e"],
      ["#477d78", "#41454a", "#8ba69a", "#306176"],
      "#ffcb68",
      "city",
      "ruin",
      "bird",
      "Broken towers hide narrow landings.",
    ),
    makeTheme(
      "Golden Borough",
      ["#e6a76c", "#f6dfaa"],
      ["#c9a16d", "#79604b"],
      ["#a97b52", "#59463a", "#c79a62", "#916044"],
      "#64c6b7",
      "ruins",
      "ruin",
      "dust",
      "Old rooftops crumble underfoot.",
    ),
    makeTheme(
      "Moonlit Glacier",
      ["#061738", "#367ba8"],
      ["#16345d", "#0b1c38"],
      ["#527f9d", "#24344a", "#9ac8de", "#0a344f"],
      "#8de8ff",
      "moon",
      "ice",
      "snow",
      "Keep your footing beneath the moon.",
      { ice: 1 },
    ),
    makeTheme(
      "Whispering Woods",
      ["#4c956c", "#c5e1a5"],
      ["#477b4c", "#254a35"],
      ["#447849", "#503724", "#ad7941", "#244937"],
      "#ee9a71",
      "forest",
      "wood",
      "firefly",
      "Wooden planks span the forest gaps.",
    ),
    makeTheme(
      "Hollow Bastion",
      ["#172c47", "#607886"],
      ["#40515e", "#202a36"],
      ["#59656a", "#32343b", "#858477", "#273d52"],
      "#d682c1",
      "dungeon",
      "stone",
      "spark",
      "The old bastion is full of traps.",
      { dark: 1 },
    ),
    makeTheme(
      "Crimson Expanse",
      ["#8b3342", "#e59671"],
      ["#b94f45", "#593040"],
      ["#a7473d", "#493139", "#d07855", "#582d3c"],
      "#ffda69",
      "redland",
      "stone",
      "ember",
      "Long jumps cross the scorched earth.",
      { lava: 1 },
    ),
    makeTheme(
      "Firefly Grove",
      ["#123a43", "#47856c"],
      ["#27634b", "#123a37"],
      ["#326d4a", "#40352a", "#739353", "#144850"],
      "#f3a268",
      "forest",
      "wood",
      "firefly",
      "Follow the lights through the dark.",
      { dark: 1 },
    ),
    makeTheme(
      "Drowned Skyline",
      ["#326b88", "#9cc6c6"],
      ["#526f75", "#263e51"],
      ["#456b69", "#39434a", "#84938a", "#24465a"],
      "#ffb76a",
      "city",
      "ruin",
      "rain",
      "The flooded streets are far below.",
    ),
    makeTheme(
      "Sunlit Citadel",
      ["#77b9d1", "#f8dfa3"],
      ["#a9b77d", "#6a5942"],
      ["#829457", "#65513b", "#c5a36a", "#578296"],
      "#d66c4e",
      "ruins",
      "ruin",
      "bird",
      "Leap between the broken towers.",
    ),
    makeTheme(
      "Dustfall Town",
      ["#c87555", "#f2c084"],
      ["#a77b5d", "#5c4540"],
      ["#89634b", "#483936", "#bb8659", "#764536"],
      "#f4d367",
      "ruins",
      "ruin",
      "dust",
      "Loose bricks and shifting sands.",
      { wind: 1 },
    ),
    makeTheme(
      "Ashen Catacombs",
      ["#251b30", "#604455"],
      ["#50404a", "#29252d"],
      ["#625052", "#322c31", "#8e7770", "#352a3e"],
      "#ff965e",
      "dungeon",
      "stone",
      "ember",
      "Ash dims the path through the halls.",
      { dark: 1 },
    ),
    makeTheme(
      "Stormwatch Peaks",
      ["#334e79", "#a8bac2"],
      ["#647c88", "#303d50"],
      ["#6e8689", "#424449", "#a1aaa0", "#3a526a"],
      "#ffcf74",
      "moon",
      "ice",
      "rain",
      "Cross the peaks as the storm builds.",
      { wind: 1 },
    ),
    makeTheme(
      "Frostfall Ruins",
      ["#547b9e", "#d3e8ec"],
      ["#8eaab0", "#485663"],
      ["#9ab6b8", "#4b5155", "#c6d9d4", "#526d83"],
      "#7bdaee",
      "ruins",
      "ice",
      "snow",
      "Ice coats every broken stone.",
      { ice: 1 },
    ),
    makeTheme(
      "Cinderworks",
      ["#321820", "#a94835"],
      ["#7d463b", "#3a2828"],
      ["#87483a", "#38282a", "#bd7250", "#4d2931"],
      "#ffd35c",
      "redland",
      "stone",
      "ember",
      "Hot vents make every landing risky.",
      { lava: 1 },
    ),
    makeTheme(
      "Thornwood",
      ["#315349", "#9ab57a"],
      ["#486348", "#293b32"],
      ["#486448", "#46352a", "#987247", "#273d3e"],
      "#e69c6d",
      "forest",
      "wood",
      "firefly",
      "Thorns guard the narrow wooden bridges.",
      { dark: 1 },
    ),
    makeTheme(
      "Neon Necropolis",
      ["#172849", "#5d4c83"],
      ["#435078", "#24283e"],
      ["#525b78", "#32303e", "#8a7f9d", "#342c63"],
      "#ff79bb",
      "city",
      "ruin",
      "spark",
      "Cracked rooftops glow in the night.",
      { dark: 1 },
    ),
    makeTheme(
      "Sunken Palace",
      ["#16404c", "#6a9c91"],
      ["#54746b", "#263d41"],
      ["#658074", "#3d4140", "#a5a58b", "#234b54"],
      "#ffbd6f",
      "dungeon",
      "stone",
      "rain",
      "The palace floor has nearly vanished.",
    ),
    makeTheme(
      "Obsidian Fields",
      ["#311c36", "#9b514d"],
      ["#6d414b", "#302735"],
      ["#70434a", "#302a30", "#a36355", "#39283c"],
      "#f3d169",
      "redland",
      "stone",
      "ember",
      "Black rock and fire leave little room.",
      { lava: 1 },
    ),
    makeTheme(
      "Last Light Citadel",
      ["#8b7896", "#f0c18c"],
      ["#9d876f", "#554b4d"],
      ["#86715d", "#4a4140", "#b38c68", "#5d4d69"],
      "#f3e080",
      "ruins",
      "ruin",
      "dust",
      "One final climb through the ruins.",
      { wind: 1 },
    ),
    makeTheme(
      "Eclipse Crown",
      ["#090e27", "#372a55"],
      ["#302c50", "#171b32"],
      ["#4c466a", "#252632", "#81749b", "#171c3a"],
      "#ff6d9c",
      "moon",
      "ice",
      "spark",
      "The last path waits in the eclipse.",
      { dark: 1 },
    ),
  ]);
  function th() {
    return TH[lvN - 1];
  }

  function rng(s) {
    return function () {
      s |= 0;
      s = (s + 0x6d2b79f5) | 0;
      var t = Math.imul(s ^ (s >>> 15), 1 | s);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function gen(n) {
    var difficulty = (n - 1) / (MAX_LEVEL - 1);
    var r = rng(n * 7919 + 13),
      T = TL,
      gy = 560,
      xx = 0,
      len = Math.min(300, 62 + n * 8) * T,
      since = 0,
      t = TH[n - 1];
    sol = [];
    hz = [];
    en = [];
    rg = [];
    sp = [];
    pw = [];
    mv = [];
    fl = [];
    function ring(px, py) {
      rg.push({ x: px, y: py, c: 0 });
    }
    sol.push({ x: 0, y: gy, w: 10 * T, h: 500 });
    ring(5 * T, gy - 40);
    ring(7 * T, gy - 70);
    xx = 10 * T;
    while (xx < len) {
      if (r() < 0.24 + difficulty * 0.12) {
        var gw = Math.floor((2 + r() * (1.3 + difficulty * 0.55)) * T);
        if (gw >= 3 * T || t.lava || r() < 0.35)
          mv.push({
            x: xx + gw / 2 - 50,
            y: gy - 30,
            w: 100,
            h: 16,
            ox: xx + gw / 2 - 50,
            amp: Math.max(18, gw / 2 - 62),
            sp: 1.3 + r(),
            ph: r() * 6,
            dx: 0,
            dy: 0,
            mv: 1,
          });
        ring(xx + gw / 2, gy - 95);
        xx += gw;
      }
      if (r() < 0.32 + difficulty * 0.18)
        gy = Math.max(
          400,
          Math.min(
            600,
            gy + (r() < 0.5 ? -1 : 1) * (1 + Math.floor(r() * 2)) * T,
          ),
        );
      var w = Math.floor(4 + r() * (6 - difficulty * 2)) * T,
        sx = xx,
        nr = 2 + Math.floor(r() * 3);
      sol.push({ x: sx, y: gy, w: w, h: 500 });
      for (var k = 0; k < nr; k++)
        ring(sx + (w * (k + 1)) / (nr + 1), gy - 34 - (k % 2) * 30);
      if (r() < 0.2 + difficulty * 0.42 && w >= 5 * T)
        hz.push({
          x: sx + 2 * T + Math.floor(r() * Math.max(1, w - 4 * T - 80)),
          y: gy - 24,
          w: T * (r() < 0.5 ? 1 : 2),
          h: 24,
        });
      if (r() < 0.18 + difficulty * 0.36 && w >= 6 * T)
        en.push({
          x: sx + w / 2,
          y: gy - 14,
          r: 14,
          a: sx + T,
          b: sx + w - T,
          d: 1,
          sp: 50 + n * 3 + r() * 20,
        });
      if (r() < 0.3 + difficulty * 0.15) {
        var pwd = (3 + Math.floor(r() * 2)) * T,
          ppx = sx + (w - pwd) / 2;
        sol.push({ x: ppx, y: gy - 95, w: pwd, h: 18 });
        ring(ppx + pwd * 0.3, gy - 132);
        ring(ppx + pwd * 0.7, gy - 132);
      } else if (r() < 0.3 && w >= 7 * T) {
        sp.push({ x: sx + 1.5 * T, y: gy - 12, w: 40, h: 12, t: 0 });
        sol.push({ x: sx + 4 * T, y: gy - 235, w: 3 * T, h: 18 });
        ring(sx + 4.7 * T, gy - 272);
        ring(sx + 6.3 * T, gy - 272);
      }
      if (r() < 0.16 - difficulty * 0.08)
        pw.push({ x: sx + w / 2, y: gy - 70, t: r() < 0.5 ? "s" : "j" });
      if (since > (35 - difficulty * 8) * T) {
        fl.push({ x: sx + T, y: gy, on: 0 });
        since = 0;
      }
      since += w;
      xx += w;
    }
    sol.push({ x: xx, y: gy, w: 9 * T, h: 500 });
    goal = { x: xx + 5 * T, y: gy - 90, w: 60, h: 90, open: 0 };
    rg = rg.filter(function (q) {
      return (
        !hz.some(function (h) {
          return q.x > h.x - 34 && q.x < h.x + h.w + 34 && q.y > h.y - 90;
        }) &&
        !en.some(function (e) {
          return (
            q.x > e.a - 20 && q.x < e.b + 20 && q.y > e.y - 62 && q.y < e.y + 20
          );
        })
      );
    });
    N = rg.length;
    Lw = xx + 9 * T;
    AM = [];
    for (var i = 0; i < (t.a === "cloud" ? 8 : 40); i++)
      AM.push({
        x: Math.random() * 1100,
        y: Math.random() * 720,
        z:
          t.a === "cloud"
            ? 0.15 + Math.random() * 0.3
            : 0.5 + Math.random() * 0.6,
        v:
          t.a === "ember"
            ? -30 - Math.random() * 40
            : t.a === "snow"
              ? 25 + Math.random() * 30
              : t.a === "dust"
                ? 4
                : 8,
        vx: t.a === "dust" ? 60 + Math.random() * 50 : t.a === "snow" ? -10 : 0,
        s:
          t.a === "cloud" ? 40 + Math.random() * 40 : 1.5 + Math.random() * 2.5,
      });
  }

  function newBall(px, py) {
    return {
      x: px,
      y: py,
      vx: 0,
      vy: 0,
      r: 16,
      gr: false,
      coy: 0,
      jb: 0,
      dj: 0,
      sq: 0,
      rot: 0,
    };
  }
  function show(id) {
    ["stm", "lvm", "psm", "wnm", "ovm"].forEach(function (m) {
      $(m).classList.toggle("hid", m !== id);
    });
  }
  function hud(on) {
    ["ctl", "js", "tj"].forEach(function (i) {
      if (!on) $(i).classList.add("hid");
    });
  }
  function start(n, fresh) {
    ac();
    var sc = G && !fresh ? G.score : 0,
      lv = G && !fresh ? G.lives : 3;
    lvN = n;
    gen(n);
    G = {
      t: 0,
      mt: 0,
      score: sc,
      lives: lv,
      rings: 0,
      cp: { x: 100, y: 480 },
      inv: 0,
      sh: 0,
      pj: 0,
      intro: 2.4,
      msg: 0,
      deaths: 0,
    };
    B = newBall(100, 480);
    P = [];
    cam = 0;
    S = "play";
    show(null);
    $("ctl").classList.remove("hid");
    if (matchMedia("(pointer:coarse)").matches)
      ["js", "tj"].forEach(function (i) {
        $(i).classList.remove("hid");
      });
    keys.ax = 0;
  }
  function menu() {
    S = "menu";
    hud(false);
    lvN = 1;
    gen(1);
    G = {
      t: 0,
      mt: 0,
      score: 0,
      lives: 3,
      rings: 0,
      cp: { x: 100, y: 480 },
      inv: 0,
      sh: 0,
      pj: 0,
      intro: 0,
      msg: 0,
    };
    B = newBall(100, 480);
    P = [];
    show("stm");
  }
  function pause() {
    if (S === "play") {
      S = "pause";
      show("psm");
    } else if (S === "pause") {
      S = "play";
      show(null);
    }
  }
  function buildLevels() {
    var h = "";
    for (var i = 1; i <= MAX_LEVEL; i++) {
      var s = save.s[i] || 0,
        st = "";
      for (var j = 0; j < 3; j++) st += j < s ? "★" : "☆";
      h +=
        '<button class="lv" data-n="' +
        i +
        '"' +
        (i > save.u ? " disabled" : "") +
        "><b>" +
        i +
        "</b><small>" +
        TH[i - 1].n +
        "</small><em>" +
        st +
        "</em></button>";
    }
    $("lvs").innerHTML = h;
  }
  $("lvs").addEventListener("click", function (e) {
    var b = e.target.closest(".lv");
    if (b && !b.disabled) start(+b.dataset.n, true);
  });
  $("play").onclick = function () {
    start(Math.min(save.u, MAX_LEVEL), true);
  };
  $("levels").onclick = function () {
    buildLevels();
    show("lvm");
  };
  $("back").onclick = function () {
    show("stm");
  };
  $("rs").onclick = pause;
  $("pb").onclick = pause;
  $("mn").onclick = menu;
  $("mn2").onclick = menu;
  $("mb").onclick = function () {
    muted = !muted;
    $("mb").textContent = muted ? "✕" : "♪";
  };
  $("nx").onclick = function () {
    if (lvN < MAX_LEVEL) start(lvN + 1, false);
  };
  $("rp").onclick = function () {
    start(lvN, true);
  };
  $("rt").onclick = function () {
    start(lvN, true);
  };

  function burst(px, py, n, c) {
    for (var i = 0; i < n && P.length < 300; i++) {
      var a = Math.random() * PI2,
        s = 60 + Math.random() * 220;
      P.push({
        x: px,
        y: py,
        vx: Math.cos(a) * s,
        vy: Math.sin(a) * s - 60,
        l: 0.4 + Math.random() * 0.4,
        c: c,
        s: 2 + Math.random() * 3,
      });
    }
  }
  function lose() {
    if (G.inv > 0 || S !== "play") return;
    if (G.sh > 0) {
      G.sh = 0;
      G.inv = 1;
      beep(300, 0.2, "triangle", 0.08, 150);
      burst(B.x, B.y, 14, "#9fd0ff");
      return;
    }
    G.lives--;
    G.deaths++;
    burst(B.x, B.y, 24, "#ff4d4d");
    beep(260, 0.4, "sawtooth", 0.08, 50);
    if (G.lives <= 0) {
      S = "over";
      hud(false);
      $("os").textContent =
        "Score " + G.score + ". Level " + lvN + " is waiting for another try.";
      show("ovm");
      return;
    }
    B = newBall(G.cp.x, G.cp.y - 40);
    G.inv = 1.6;
  }
  function win() {
    S = "win";
    hud(false);
    var par = Lw / TL / 3.2,
      st = 1 + (G.deaths === 0 ? 1 : 0) + (G.t < par ? 1 : 0),
      bonus = Math.max(0, Math.floor((par * 1.5 - G.t) * 10)) + st * 100;
    G.score += bonus;
    G.lives = Math.min(5, G.lives + 1);
    save.u = Math.min(MAX_LEVEL, Math.max(save.u, lvN + 1));
    save.s[lvN] = Math.max(save.s[lvN] || 0, st);
    persist();
    var s = "";
    for (var j = 0; j < 3; j++) s += j < st ? "★" : "☆";
    $("st").textContent = s;
    $("wt").textContent = th().n + " cleared!";
    $("ws").textContent =
      "Time " +
      Math.floor(G.t) +
      "s · Bonus +" +
      bonus +
      " · Score " +
      G.score +
      " · Extra life earned";
    $("nx").classList.toggle("hid", lvN >= MAX_LEVEL);
    show("wnm");
    [523, 659, 784, 1046].forEach(function (f, i) {
      setTimeout(function () {
        beep(f, 0.2, "triangle", 0.07);
      }, i * 110);
    });
  }

  function col(r) {
    if (r.x > B.x + 140 || r.x + r.w < B.x - 140) return;
    var cx = Math.max(r.x, Math.min(B.x, r.x + r.w)),
      cy = Math.max(r.y, Math.min(B.y, r.y + r.h)),
      dx = B.x - cx,
      dy = B.y - cy,
      d = Math.hypot(dx, dy);
    if (d >= B.r) return;
    var nx, ny;
    if (d > 0.001) {
      nx = dx / d;
      ny = dy / d;
      B.x += nx * (B.r - d);
      B.y += ny * (B.r - d);
    } else {
      nx = 0;
      ny = -1;
      B.y = r.y - B.r;
    }
    var vn = B.vx * nx + B.vy * ny;
    if (vn < 0) {
      var e = -vn < 150 ? 0 : ny < -0.7 ? 0.4 : 0.25;
      B.vx -= (1 + e) * vn * nx;
      B.vy -= (1 + e) * vn * ny;
      if (-vn > 260) {
        B.sq = Math.min(0.35, -vn / 2400);
        burst(B.x, B.y + B.r, 5, "#ffffff");
        beep(140 + -vn / 10, 0.07, "sine", 0.05);
      }
    }
    if (ny < -0.7) {
      B.gr = true;
      B.coy = 0.1;
      B.dj = 0;
      if (r.mv) {
        B.x += r.dx;
        B.y += r.dy;
      }
    }
  }
  function phys(dt) {
    var t = th(),
      ax = keys.ax || (keys.r ? 1 : 0) - (keys.l ? 1 : 0),
      acc = t.ice ? 520 : 2300,
      cap = keys.ax ? 275 * Math.max(0.5, Math.abs(keys.ax)) : 275;
    G.mt += dt;
    mv.forEach(function (p) {
      var o = p.x;
      p.x = p.ox + Math.sin(G.mt * p.sp + p.ph) * p.amp;
      p.dx = p.x - o;
    });
    if (ax) B.vx += ax * acc * dt;
    else if (B.gr) {
      var f = (t.ice ? 110 : 1500) * dt;
      B.vx = Math.abs(B.vx) <= f ? 0 : B.vx - Math.sign(B.vx) * f;
    } else B.vx *= 1 - dt * 0.4;
    B.vx = Math.max(-cap, Math.min(cap, B.vx));
    if (t.wind) B.vx += Math.sin(G.mt * 0.6) * 150 * dt;
    B.vy = Math.min(1300, B.vy + t.g * dt);
    B.coy -= dt;
    B.jb -= dt;
    if (B.jb > 0) {
      if (B.coy > 0) {
        B.vy = -640;
        B.coy = 0;
        B.jb = 0;
        B.dj = 0;
        beep(380, 0.12, "square", 0.05, 760);
      } else if (G.pj > 0 && !B.dj) {
        B.vy = -600;
        B.dj = 1;
        B.jb = 0;
        burst(B.x, B.y + B.r, 8, "#ffffff");
        beep(520, 0.12, "square", 0.05, 900);
      }
    }
    B.x += B.vx * dt;
    B.y += B.vy * dt;
    B.gr = false;
    B.rot += (B.vx * dt) / B.r;
    B.sq *= 1 - dt * 9;
    if (B.x < B.r) {
      B.x = B.r;
      B.vx = Math.max(0, B.vx);
    }
    sol.forEach(col);
    mv.forEach(col);
  }
  function near(o, rad) {
    return Math.hypot(B.x - o.x, B.y - o.y) < rad;
  }
  function hitRect(h) {
    var cx = Math.max(h.x, Math.min(B.x, h.x + h.w)),
      cy = Math.max(h.y, Math.min(B.y, h.y + h.h));
    return Math.hypot(B.x - cx, B.y - cy) < B.r * 0.82;
  }
  function logic(dt) {
    G.t += dt;
    if (G.inv > 0) G.inv -= dt;
    if (G.sh > 0) G.sh -= dt;
    if (G.pj > 0) G.pj -= dt;
    if (G.intro > 0) G.intro -= dt;
    if (G.msg > 0) G.msg -= dt;
    rg.forEach(function (q) {
      if (!q.c && near(q, B.r + 13)) {
        q.c = 1;
        G.rings++;
        G.score += 50;
        burst(q.x, q.y, 8, "#ffd23f");
        beep(1200, 0.1, "sine", 0.07, 1800);
      }
    });
    hz.forEach(function (h) {
      if (hitRect(h)) lose();
    });
    en.forEach(function (e) {
      if (e.dead) return;
      e.x += e.d * e.sp * dt;
      if (e.x < e.a || e.x > e.b) e.d *= -1;
      if (near(e, e.r + B.r * 0.9)) {
        if (B.vy > 60 && B.y < e.y - 4) {
          e.dead = 1;
          B.vy = -520;
          G.score += 100;
          burst(e.x, e.y, 12, th().en);
          beep(500, 0.12, "square", 0.07, 200);
        } else lose();
      }
    });
    sp.forEach(function (s) {
      if (s.t > 0) s.t -= dt;
      if (B.vy >= 0 && hitRect(s) && B.y < s.y) {
        B.vy = -1050;
        B.coy = 0;
        s.t = 0.25;
        B.sq = 0.3;
        beep(300, 0.3, "sine", 0.09, 1300);
      }
    });
    pw.forEach(function (p) {
      if (!p.c && near(p, B.r + 16)) {
        p.c = 1;
        if (p.t === "s") G.sh = 12;
        else G.pj = 12;
        beep(700, 0.15, "triangle", 0.08, 1400);
      }
    });
    fl.forEach(function (f) {
      if (!f.on && B.x > f.x) {
        f.on = 1;
        G.cp = { x: f.x, y: f.y };
        beep(660, 0.15, "triangle", 0.07);
      }
    });
    goal.open = G.rings >= N;
    if (near({ x: goal.x + 30, y: goal.y + 45 }, 60)) {
      if (goal.open) win();
      else G.msg = 1.5;
    }
    if (S === "play" && B.y > 760) lose();
    P.forEach(function (q) {
      q.x += q.vx * dt;
      q.y += q.vy * dt;
      q.vy += 500 * dt;
      q.l -= dt;
    });
    P = P.filter(function (q) {
      return q.l > 0;
    });
    var cameraOffset = matchMedia("(orientation: landscape)").matches
      ? 0.28
      : 0.38;
    var tg = Math.max(0, Math.min(Lw - VW, B.x - VW * cameraOffset));
    cam += (tg - cam) * Math.min(1, dt * 6);
  }

  function rr(px, py, w, h, r) {
    x.beginPath();
    x.moveTo(px + r, py);
    x.arcTo(px + w, py, px + w, py + h, r);
    x.arcTo(px + w, py + h, px, py + h, r);
    x.arcTo(px, py + h, px, py, r);
    x.arcTo(px, py, px + w, py, r);
    x.closePath();
  }
  function drawRidge(color, base, height, parallax) {
    x.fillStyle = color;
    x.beginPath();
    x.moveTo(0, 720);
    for (var sx = 0; sx <= VW + 24; sx += 24) {
      var wx = sx + cam * parallax,
        shape =
          Math.abs(Math.sin(wx * 0.004)) * 0.68 +
          Math.abs(Math.sin(wx * 0.011)) * 0.32;
      x.lineTo(sx, base - shape * height);
    }
    x.lineTo(VW, 720);
    x.fill();
  }
  function drawPines(color, base, parallax, spacing) {
    var offset = (cam * parallax) % spacing;
    x.fillStyle = color;
    for (var i = -1; i < VW / spacing + 2; i++) {
      var px = i * spacing - offset,
        height = 62 + (Math.abs(i * 37) % 46);
      x.fillRect(px - 3, base - height * 0.24, 6, height * 0.24);
      for (var tier = 0; tier < 3; tier++) {
        var top = base - height + tier * height * 0.25,
          half = height * (0.25 - tier * 0.04);
        x.beginPath();
        x.moveTo(px, top);
        x.lineTo(px - half, top + height * 0.42);
        x.lineTo(px + half, top + height * 0.42);
        x.closePath();
        x.fill();
      }
    }
  }
  function drawEnvironment(t) {
    if (t.scene === "moon") {
      for (var i = 0; i < 54; i++) {
        var sx = (((i * 149 - cam * 0.035) % (VW + 40)) + VW + 40) % (VW + 40);
        x.fillStyle = i % 4 === 0 ? "#d9f6ff" : "rgba(220,240,255,.55)";
        x.beginPath();
        x.arc(sx, 24 + ((i * 71) % 290), i % 4 === 0 ? 2 : 1, 0, PI2);
        x.fill();
      }
      var mx = VW * 0.78,
        moon = x.createRadialGradient(mx - 12, 118, 4, mx, 130, 58);
      moon.addColorStop(0, "#ffffff");
      moon.addColorStop(0.65, "#b7edff");
      moon.addColorStop(1, "rgba(85,177,229,.08)");
      x.fillStyle = moon;
      x.beginPath();
      x.arc(mx, 130, 58, 0, PI2);
      x.fill();
      drawRidge("#17395f", 520, 200, 0.12);
      drawRidge("#102b4d", 545, 150, 0.24);
      drawPines("#0a2341", 545, 0.3, 74);
      var lake = x.createLinearGradient(0, 535, 0, 675);
      lake.addColorStop(0, "#28658a");
      lake.addColorStop(1, "#102a49");
      x.fillStyle = lake;
      x.fillRect(0, 535, VW, 150);
      x.fillStyle = "rgba(181,231,255,.42)";
      for (i = 0; i < 12; i++) {
        var lineX = (((i * 97 - cam * 0.16) % (VW + 60)) + VW + 60) % (VW + 60);
        x.fillRect(lineX, 556 + i * 8, 24 + (i % 4) * 12, 2);
      }
      return;
    }
    if (t.scene === "forest") {
      drawRidge("#264f48", 480, 120, 0.1);
      drawRidge("#193e38", 535, 100, 0.22);
      drawPines("#183a35", 570, 0.3, 106);
      for (var tree = -1; tree < VW / 190 + 2; tree++) {
        var tx = tree * 190 - ((cam * 0.12) % 190),
          th = 145 + (Math.abs(tree * 43) % 90);
        x.fillStyle = "#392f2c";
        x.fillRect(tx, 540 - th * 0.35, 18, th * 0.6);
        x.fillStyle = t.h[0];
        for (var leaf = 0; leaf < 5; leaf++) {
          x.beginPath();
          x.arc(
            tx + 9 + (leaf % 2 ? 28 : -28),
            540 - th * 0.48 + leaf * 20,
            34,
            0,
            PI2,
          );
          x.fill();
        }
      }
      return;
    }
    if (t.scene === "dungeon") {
      x.fillStyle = "rgba(8,15,28,.32)";
      x.fillRect(0, 210, VW, 510);
      for (var row = 0; row < 8; row++) {
        var y = 230 + row * 62,
          offset = row % 2 ? 48 : 0;
        for (var col = -1; col < VW / 96 + 2; col++) {
          var bx = col * 96 + offset - ((cam * 0.08) % 96);
          x.fillStyle = row % 2 ? "rgba(106,137,145,.13)" : "rgba(5,14,28,.18)";
          rr(bx + 2, y + 2, 91, 56, 5);
          x.fill();
          x.strokeStyle = "rgba(177,220,218,.12)";
          x.lineWidth = 2;
          x.stroke();
        }
      }
      x.strokeStyle = "rgba(130,190,195,.25)";
      x.lineWidth = 3;
      for (var chain = 0; chain < 5; chain++) {
        var cx =
          (((chain * 177 - cam * 0.12) % (VW + 80)) + VW + 80) % (VW + 80);
        x.beginPath();
        x.moveTo(cx, 215);
        x.lineTo(cx, 290 + (chain % 3) * 24);
        x.stroke();
      }
      return;
    }
    if (t.scene === "city") {
      for (var building = -1; building < VW / 104 + 2; building++) {
        var bx = building * 104 - ((cam * 0.16) % 104),
          bh = 105 + (Math.abs(building * 53) % 150);
        x.fillStyle = "#172a48";
        x.fillRect(bx, 535 - bh, 86, bh);
        x.fillStyle = "rgba(174,209,211,.25)";
        for (var windowY = 0; windowY < bh - 22; windowY += 30)
          for (var windowX = 0; windowX < 3; windowX++)
            x.fillRect(bx + 12 + windowX * 23, 550 - bh + windowY, 8, 12);
        x.fillStyle = "#263655";
        x.fillRect(bx + 27, 510 - bh, 32, 25);
      }
      drawRidge("rgba(15,35,57,.76)", 585, 42, 0.3);
      return;
    }
    if (t.scene === "ruins") {
      drawRidge("rgba(72,81,75,.36)", 500, 90, 0.12);
      for (var pillar = -1; pillar < VW / 146 + 2; pillar++) {
        var px = pillar * 146 - ((cam * 0.2) % 146),
          top = 300 + (Math.abs(pillar * 61) % 115);
        x.fillStyle = "rgba(78,75,68,.76)";
        x.fillRect(px + 22, top, 24, 230);
        x.fillRect(px + 12, top - 8, 44, 13);
        x.fillRect(px + 15, 520, 38, 12);
        if (pillar % 2 === 0) {
          x.fillRect(px + 38, top + 8, 88, 18);
          x.fillRect(px + 108, top + 8, 18, 110);
        }
      }
      return;
    }
    if (t.scene === "redland") {
      x.fillStyle = "rgba(255,211,145,.72)";
      x.beginPath();
      x.arc(VW * 0.76, 165, 42, 0, PI2);
      x.fill();
      drawRidge(t.h[0], 510, 155, 0.12);
      drawRidge(t.h[1], 590, 105, 0.24);
      return;
    }
    [
      [0.2, 430, t.h[0], 60],
      [0.45, 500, t.h[1], 45],
    ].forEach(function (l) {
      x.fillStyle = l[2];
      x.beginPath();
      x.moveTo(0, 720);
      for (var sx = 0; sx <= VW + 20; sx += 20) {
        var wx = sx + cam * l[0];
        x.lineTo(
          sx,
          l[1] -
            Math.sin(wx * 0.006) * l[3] -
            Math.sin(wx * 0.017) * l[3] * 0.3,
        );
      }
      x.lineTo(VW, 720);
      x.fill();
    });
  }
  function drawPlatform(s, t) {
    if (t.block === "wood") {
      x.fillStyle = "#50351f";
      rr(s.x, s.y, s.w, s.h, 5);
      x.fill();
      x.fillStyle = "#a87342";
      x.fillRect(s.x + 2, s.y + 2, s.w - 4, Math.max(3, s.h * 0.42));
      x.strokeStyle = "#573922";
      x.lineWidth = 2;
      for (var seam = s.x + 56; seam < s.x + s.w; seam += 56) {
        x.beginPath();
        x.moveTo(seam, s.y + 2);
        x.lineTo(seam, s.y + s.h - 2);
        x.stroke();
      }
      x.fillStyle = "rgba(255,220,156,.45)";
      x.fillRect(s.x + 5, s.y + 2, Math.max(0, s.w - 10), 2);
      return;
    }
    x.fillStyle = t.pl;
    rr(s.x, s.y, s.w, s.h, 8);
    x.fill();
    x.fillStyle = "rgba(0,0,0,.18)";
    x.fillRect(s.x + 6, s.y + s.h - 6, s.w - 12, 4);
    if (t.block === "ruin" || t.block === "stone") {
      x.strokeStyle = "rgba(35,35,38,.45)";
      x.lineWidth = 2;
      x.beginPath();
      for (var seam = s.x + 52; seam < s.x + s.w; seam += 52) {
        x.moveTo(seam, s.y + 2);
        x.lineTo(seam, s.y + s.h - 2);
      }
      x.stroke();
      x.fillStyle = "rgba(255,255,255,.18)";
      x.fillRect(s.x + 6, s.y + 2, Math.max(0, s.w - 12), 2);
    }
  }
  function draw() {
    var t = th(),
      vis0 = cam - 80,
      vis1 = cam + VW + 80;
    x.setTransform(DPR * SC, 0, 0, DPR * SC, 0, 0);
    var g = x.createLinearGradient(0, 0, 0, 720);
    g.addColorStop(0, t.s[0]);
    g.addColorStop(1, t.s[1]);
    x.fillStyle = g;
    x.fillRect(0, 0, VW, 720);
    AM.forEach(function (a) {
      var px =
          ((((a.x - cam * a.z + (a.vx || 0) * G.t) % 1100) + 1100) % 1100) - 50,
        py = ((((a.y + G.t * a.v) % 780) + 780) % 780) - 30;
      if (t.a === "cloud") {
        x.fillStyle = "rgba(255,255,255,.75)";
        x.beginPath();
        x.arc(px, py * 0.5, a.s * 0.7, 0, PI2);
        x.arc(px + a.s * 0.7, py * 0.5 + 6, a.s * 0.55, 0, PI2);
        x.arc(px - a.s * 0.7, py * 0.5 + 8, a.s * 0.5, 0, PI2);
        x.fill();
      } else {
        x.fillStyle =
          t.a === "ember"
            ? "rgba(255,170,60,.85)"
            : t.a === "spark"
              ? "rgba(190,160,255,.8)"
              : t.a === "dust"
                ? "rgba(255,240,200,.5)"
                : "rgba(255,255,255,.85)";
        x.beginPath();
        x.arc(px, py, a.s, 0, PI2);
        x.fill();
      }
    });
    drawEnvironment(t);
    x.save();
    x.translate(-cam, 0);
    x.fillStyle = t.f;
    x.fillRect(cam, 700 + Math.sin(G.t * 2) * 3, VW, 40);
    sol.forEach(function (s) {
      if (s.x > vis1 || s.x + s.w < vis0) return;
      if (s.h > 100) {
        x.fillStyle = t.gd;
        x.fillRect(s.x, s.y, s.w, 720 - s.y);
        x.fillStyle = t.gt;
        rr(s.x, s.y - 4, s.w, 16, 6);
        x.fill();
      } else {
        drawPlatform(s, t);
      }
    });
    mv.forEach(function (s) {
      drawPlatform(s, t);
    });
    hz.forEach(function (h) {
      if (h.x > vis1 || h.x + h.w < vis0) return;
      x.fillStyle = t.lava ? "#ff5a1a" : "#dfe6f2";
      x.beginPath();
      for (var sx = h.x; sx < h.x + h.w; sx += 20) {
        x.moveTo(sx, h.y + h.h);
        x.lineTo(sx + 10, h.y);
        x.lineTo(sx + 20, h.y + h.h);
      }
      x.fill();
    });
    sp.forEach(function (s) {
      var k = s.t > 0 ? 0.5 : 1;
      x.fillStyle = "#ff4d4d";
      rr(s.x, s.y + s.h * (1 - k), s.w, s.h * k, 4);
      x.fill();
      x.fillStyle = "#fff";
      x.fillRect(s.x + 4, s.y + s.h * (1 - k), s.w - 8, 3);
    });
    fl.forEach(function (f) {
      x.fillStyle = "#ddd";
      x.fillRect(f.x, f.y - 50, 4, 50);
      x.fillStyle = f.on ? "#4cd964" : "#ff4d4d";
      x.beginPath();
      x.moveTo(f.x + 4, f.y - 50);
      x.lineTo(f.x + 30, f.y - 40);
      x.lineTo(f.x + 4, f.y - 30);
      x.fill();
    });
    x.save();
    x.translate(goal.x + 30, goal.y + 45);
    x.shadowColor = goal.open ? "#4dffd2" : "#888";
    x.shadowBlur = goal.open ? 24 : 0;
    x.strokeStyle = goal.open ? "#4dffd2" : "#777";
    x.lineWidth = 7;
    x.beginPath();
    x.ellipse(0, 0, 28, 46, 0, 0, PI2);
    x.stroke();
    if (goal.open) {
      x.fillStyle = "rgba(77,255,210,.35)";
      x.fill();
    }
    x.restore();
    en.forEach(function (e) {
      if (e.dead || e.x > vis1 || e.x < vis0) return;
      var b = Math.sin(G.t * 8 + e.a) * 2;
      x.fillStyle = t.en;
      x.beginPath();
      x.ellipse(e.x, e.y + b, e.r + b, e.r - b, 0, 0, PI2);
      x.fill();
      x.fillStyle = "#fff";
      x.beginPath();
      x.arc(e.x - 5, e.y - 3, 4, 0, PI2);
      x.arc(e.x + 5, e.y - 3, 4, 0, PI2);
      x.fill();
      x.fillStyle = "#222";
      x.beginPath();
      x.arc(e.x - 5 + e.d * 1.5, e.y - 3, 2, 0, PI2);
      x.arc(e.x + 5 + e.d * 1.5, e.y - 3, 2, 0, PI2);
      x.fill();
    });
    pw.forEach(function (p) {
      if (p.c) return;
      var by = Math.sin(G.t * 4) * 4;
      x.fillStyle =
        p.t === "s" ? "rgba(120,200,255,.9)" : "rgba(255,230,120,.95)";
      x.beginPath();
      x.arc(p.x, p.y + by, 14, 0, PI2);
      x.fill();
      x.fillStyle = "#123";
      x.font = "700 16px Fredoka,sans-serif";
      x.textAlign = "center";
      x.fillText(p.t === "s" ? "S" : "2x", p.x, p.y + 5 + by);
    });
    function rings() {
      rg.forEach(function (q) {
        if (q.c || q.x > vis1 || q.x < vis0) return;
        var w = Math.abs(Math.cos(G.t * 3 + q.x * 0.01)) * 11 + 2;
        x.strokeStyle = "#ffd23f";
        x.lineWidth = 4;
        x.beginPath();
        x.ellipse(q.x, q.y, w, 13, 0, 0, PI2);
        x.stroke();
      });
    }
    rings();
    P.forEach(function (q) {
      x.globalAlpha = Math.min(1, q.l * 2.5);
      x.fillStyle = q.c;
      x.fillRect(q.x - q.s / 2, q.y - q.s / 2, q.s, q.s);
    });
    x.globalAlpha = 1;
    if (S !== "menu" && !(G.inv > 0 && Math.floor(G.t * 14) % 2)) {
      x.fillStyle = "rgba(0,0,0,.18)";
      x.beginPath();
      x.ellipse(B.x, Math.min(B.y + B.r + 40, 715), B.r * 0.8, 5, 0, 0, PI2);
      x.fill();
      x.save();
      x.translate(B.x, B.y + B.r);
      x.scale(1 + B.sq, 1 - B.sq + Math.min(Math.abs(B.vy) / 6000, 0.15));
      x.translate(0, -B.r);
      if (G.sh > 0) {
        x.strokeStyle = "rgba(130,210,255,.9)";
        x.lineWidth = 3;
        x.beginPath();
        x.arc(0, 0, B.r + 7, 0, PI2);
        x.stroke();
      }
      x.rotate(B.rot);
      var bg = x.createRadialGradient(-5, -6, 2, 0, 0, B.r);
      bg.addColorStop(0, "#ff9a8a");
      bg.addColorStop(0.55, "#ff3b3b");
      bg.addColorStop(1, "#a01616");
      x.fillStyle = bg;
      x.beginPath();
      x.arc(0, 0, B.r, 0, PI2);
      x.fill();
      x.strokeStyle = "rgba(255,255,255,.55)";
      x.lineWidth = 3;
      x.beginPath();
      x.arc(0, 0, B.r - 5, 0.3, 1.5);
      x.stroke();
      x.restore();
    }
    x.restore();
    if (t.dark && S !== "menu") {
      var dg = x.createRadialGradient(B.x - cam, B.y, 30, B.x - cam, B.y, 250);
      dg.addColorStop(0, "rgba(3,4,16,0)");
      dg.addColorStop(1, "rgba(3,4,16,.96)");
      x.fillStyle = dg;
      x.fillRect(0, 0, VW, 720);
      x.save();
      x.translate(-cam, 0);
      x.globalCompositeOperation = "lighter";
      rings();
      x.restore();
    }
    if (S === "menu") return;
    x.font = "700 28px Fredoka,sans-serif";
    x.textAlign = "left";
    x.fillStyle = "#fff";
    x.shadowColor = "rgba(0,0,0,.5)";
    x.shadowBlur = 6;
    x.fillText("♥".repeat(G.lives), 20, 44);
    x.font = "700 22px Fredoka,sans-serif";
    x.fillText("◯ " + G.rings + " / " + N, 20, 76);
    x.textAlign = "center";
    x.fillText("Score " + G.score, VW / 2, 40);
    x.font = "500 18px Fredoka,sans-serif";
    x.fillText("Level " + lvN + " · " + Math.floor(G.t) + "s", VW / 2, 66);
    if (G.pj > 0 || G.sh > 0) {
      x.textAlign = "left";
      x.fillText(
        (G.sh > 0 ? "Shield " + Math.ceil(G.sh) + "s  " : "") +
          (G.pj > 0 ? "Double jump " + Math.ceil(G.pj) + "s" : ""),
        20,
        104,
      );
    }
    x.shadowBlur = 0;
    if (G.msg > 0) {
      x.textAlign = "center";
      x.font = "700 26px Fredoka,sans-serif";
      x.fillStyle = "#ffd23f";
      x.fillText("Collect all the rings to open the portal!", VW / 2, 150);
    }
    if (G.intro > 0) {
      x.globalAlpha = Math.min(1, G.intro);
      x.textAlign = "center";
      x.fillStyle = "#fff";
      x.shadowColor = "rgba(0,0,0,.6)";
      x.shadowBlur = 12;
      x.font = "700 56px Fredoka,sans-serif";
      x.fillText("Level " + lvN + ": " + t.n, VW / 2, 300);
      x.font = "500 24px Fredoka,sans-serif";
      x.fillText(t.tip, VW / 2, 340);
      x.globalAlpha = 1;
      x.shadowBlur = 0;
    }
  }

  var last = performance.now();
  function loop(n) {
    var dt = Math.min(0.033, (n - last) / 1000);
    last = n;
    if (S === "play") {
      for (var i = 0; i < 3; i++) phys(dt / 3);
      logic(dt);
    } else if (S === "menu") {
      G.t += dt;
      cam = (cam + 40 * dt) % Math.max(1, Lw - VW);
    }
    draw();
    requestAnimationFrame(loop);
  }
  menu();
  requestAnimationFrame(loop);

  function setK(k, v) {
    if (k === "a" || k === "ArrowLeft") keys.l = v;
    if (k === "d" || k === "ArrowRight") keys.r = v;
  }
  addEventListener("keydown", function (e) {
    var k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    setK(k, 1);
    if (k === " " || k === "w" || k === "ArrowUp") {
      if (S === "play" && !e.repeat) B.jb = 0.12;
      e.preventDefault();
    }
    if (k === "p" || k === "Escape") pause();
    if (k.indexOf("Arrow") === 0) e.preventDefault();
  });
  addEventListener("keyup", function (e) {
    var k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    setK(k, 0);
    if (
      (k === " " || k === "w" || k === "ArrowUp") &&
      S === "play" &&
      B.vy < -220
    )
      B.vy *= 0.5;
  });
  function hold(id, on, off) {
    var b = $(id);
    b.addEventListener("pointerdown", function (e) {
      e.preventDefault();
      ac();
      on();
    });
    ["pointerup", "pointercancel", "pointerleave"].forEach(function (ev) {
      b.addEventListener(ev, off);
    });
  }
  var js = $("js"),
    jk = $("jk"),
    jid = null;
  function jmove(e) {
    var r = js.getBoundingClientRect(),
      dx = e.clientX - (r.left + r.width / 2),
      dy = e.clientY - (r.top + r.height / 2),
      d = Math.hypot(dx, dy),
      m = 48,
      k = d > m ? m / d : 1;
    jk.style.transition = "none";
    jk.style.transform = "translate(" + dx * k + "px," + dy * k + "px)";
    var a = (dx * k) / m;
    keys.ax = Math.abs(a) < 0.18 ? 0 : a;
  }
  function jend(e) {
    if (jid !== e.pointerId) return;
    jid = null;
    keys.ax = 0;
    jk.style.transition = "";
    jk.style.transform = "";
  }
  js.addEventListener("pointerdown", function (e) {
    e.preventDefault();
    ac();
    jid = e.pointerId;
    js.setPointerCapture(e.pointerId);
    jmove(e);
  });
  js.addEventListener("pointermove", function (e) {
    if (jid === e.pointerId) jmove(e);
  });
  js.addEventListener("pointerup", jend);
  js.addEventListener("pointercancel", jend);
  hold(
    "tj",
    function () {
      $("tj").classList.add("press");
      if (S === "play") B.jb = 0.12;
    },
    function () {
      $("tj").classList.remove("press");
      if (S === "play" && B.vy < -220) B.vy *= 0.5;
    },
  );
  document.addEventListener("visibilitychange", function () {
    if (document.hidden && S === "play") pause();
  });
})();

(function () {
  if ("serviceWorker" in navigator) {
    addEventListener("load", function () {
      navigator.serviceWorker.register("sw.js").catch(function () {});
    });
  }
  var dp = null,
    b = document.getElementById("inst");
  addEventListener("beforeinstallprompt", function (e) {
    e.preventDefault();
    dp = e;
    b.classList.remove("hid");
  });
  b.addEventListener("click", function () {
    if (!dp) return;
    dp.prompt();
    dp.userChoice.then(function () {
      dp = null;
      b.classList.add("hid");
    });
  });
  addEventListener("appinstalled", function () {
    b.classList.add("hid");
  });
})();
