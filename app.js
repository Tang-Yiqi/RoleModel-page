const FigureDescriptions = {
  1: { title: "Student compatibility", caption: "Fig. 1 · Both representation-based and direct-mapping students support output alignment. Only representation-based students provide the hidden states required for representation alignment." },
  2: { title: "The RoleModel framework", caption: "Fig. 2 · Vanilla output alignment, traditional output-and-representation alignment, and RoleModel’s bidirectional synthesis followed by student-aware sample selection." },
  3: { title: "Train the teachers", caption: "Fig. 3 · The forward teacher predicts the future and the backward teacher reconstructs the history. They are trained independently on original pairs, then frozen." },
  4: { title: "Bidirectional rolling synthesis", caption: "Fig. 4 · X-seeded and Y-seeded paths generate additional history–future pairs. Synthetic targets used for forecasting are produced by the forward teacher." },
  5: { title: "Student-aware sample selection", caption: "Fig. 5 · Discrepancy prioritizes teacher targets not yet aligned with the student’s forecasts. Diversity discourages redundant candidates. Selected pairs supervise the student through output alignment." },
  6: { title: "Homogeneous teacher enhancement", caption: "Fig. 6 · Channel clusters guide loss weighting so that same-architecture teachers develop different channel emphases. Their sequence predictions are fused." },
  7: { title: "Heterogeneous teacher enhancement", caption: "Fig. 7 · Independently trained architectures are fused through per-channel weights derived from validation losses, separately for forward and backward directions." },
  8: { title: "The LAMBS architecture", caption: "Fig. 8 · Shared tree aggregation captures channel-dependent context. Each channel adds its own independent residual before the shared prediction head." },
  9: { title: "Backbone parameter comparison", caption: "Fig. 9 · ECL, input length 96. Each colored segment represents an independent model for one horizon. Bar totals sum the four models; they are not single-model deployment sizes." },
  10: { title: "Channel-dependence ablation", caption: "Fig. 10 · MAE, input and forecast lengths 96. After RoleModel distillation, LAMBS with cross-channel modeling is more effective than its w/o CD variant, which retains only the channel-independent residual path in these cases." },
  11: { title: "Dropout ablation", caption: "Fig. 11 · Weather, MAE, input and forecast lengths 96. Moderate dropout can improve standalone training, but degrades the RoleModel-distilled student in this experiment." }
};

const StageDescriptions = [
  { figure: 3, label: "STEP 01 · TEACHER TRAINING", title: "Learn the relationship in both directions.", description: "Train the forward teacher ℱ to map history X to future Y, and the backward teacher ℬ to map Y back to X. Both learn from original training pairs, and both are frozen before synthesis.", equation: '<div><span>Forward</span><span class="math">ℱ : X → Y</span></div><div><span>Backward</span><span class="math">ℬ : Y → X</span></div><p>Original pairs supervise both teachers. Neither teacher is updated during distillation.</p>' },
  { figure: 4, label: "STEP 02 · BIDIRECTIONAL ROLLING SAMPLE SYNTHESIS", title: "A prediction becomes the next teacher’s input.", description: "Start one path from the observed history X, and another from the observed future Y. Alternating the frozen teachers generates new histories and forecasting targets. Retain forward-synthesized samples, so each target is the forward teacher’s prediction for its corresponding history.", equation: '<div><span>X-seeded</span><span class="math">X → ℱ(X) → ℬ(ℱ(X)) → …</span></div><div><span>Y-seeded</span><span class="math">Y → ℬ(Y) → ℱ(ℬ(Y)) → …</span></div><p>The backward teacher expands inputs; the forward teacher supplies forecasting targets. Only training-set pairs seed this process.</p>' },
  { figure: 5, label: "STEP 03 · STUDENT-AWARE SAMPLE SELECTION AND TRAINING", title: "Teacher–student discrepancy and sample diversity.", description: "For each output channel, first select the candidate with the largest teacher–student discrepancy. Then greedily select by the product of ordering-based discrepancy and diversity scores. Re-evaluate diversity after every selection and repeat selection as the student learns. Each candidate retains its complete multivariate input.", equation: '<div><span>Discrepancy</span><span class="math">e<sub>r,c</sub> = ℓ(S<sub>c</sub>(X<sub>r</sub>), y<sub>r,c</sub>)</span></div><div><span>Selection</span><span class="math">q<sub>r,c</sub> = ẽ<sub>r,c</sub> × ν̃<sub>r,c</sub></span></div><p>Diversity measures distance to the nearest selected pair. Ordering-based scores balance the two criteria without an extra selection network or mixing coefficient. The original pair is also a candidate.</p>' }
];

const ModelDescriptions = [
  { name: "LAMBS", year: 2026, detail: "Standalone student · This work", kind: "standalone" },
  { name: "EMAformer", year: 2026, detail: "Teacher", kind: "teacher" },
  { name: "RoleModel-distilled LAMBS", year: 2026, detail: "Teacher: EMAformer (2026)", kind: "distilled" },
  { name: "FreEformer", year: 2025, detail: "Teacher", kind: "teacher" },
  { name: "RoleModel-distilled LAMBS", year: 2026, detail: "Teacher: FreEformer (2025)", kind: "distilled" },
  { name: "KUMA", year: 2026, detail: "Strong forecasting model", kind: "standalone" },
  { name: "CASA", year: 2025, detail: "Strong forecasting model", kind: "standalone" },
  { name: "S-Mamba", year: 2025, detail: "Strong forecasting model", kind: "standalone" },
  { name: "SOFTS", year: 2024, detail: "Strong forecasting model", kind: "standalone" },
  { name: "iTransformer", year: 2024, detail: "Strong forecasting model", kind: "standalone" },
  { name: "PatchTST", year: 2023, detail: "Strong forecasting model", kind: "standalone" }
];

const StudentDescriptions = [
  { name: "SimpleTM", year: 2025 },
  { name: "FilterNet", year: 2024 },
  { name: "TSMixer", year: 2023 },
  { name: "CycleNet-MLP", year: 2024 },
  { name: "CycleNet-Linear", year: 2024 },
  { name: "SparseTSF", year: 2024 },
  { name: "NLinear", year: 2023 },
  { name: "DLinear", year: 2023 }
];

const FrameworkDescriptions = [
  { key: "student", name: "Student-Only" },
  { key: "rolemodel", name: "RoleModel" },
  { key: "timedistill", name: "Traditional (TimeDistill)" },
  { key: "vanilla", name: "Vanilla" }
];

const AblationData = {
  ETTh1: [[0.433, 0.429], [0.455, 0.443], [0.439, 0.433], [0.470, 0.454]],
  ETTh2: [[0.370, 0.393], [0.377, 0.399], [0.379, 0.400], [0.385, 0.406]],
  ETTm1: [[0.379, 0.383], [0.383, 0.385], [0.380, 0.383], [0.383, 0.388]],
  ETTm2: [[0.273, 0.320], [0.283, 0.327], [0.276, 0.321], [0.349, 0.370]],
  Weather: [[0.232, 0.262], [0.234, 0.264], [0.237, 0.265], [0.239, 0.271]],
  Solar: [[0.186, 0.217], [0.191, 0.220], [0.188, 0.218], [0.197, 0.224]],
  ECL: [[0.169, 0.256], [0.177, 0.268], [0.171, 0.258], [0.173, 0.261]]
};

let SelectedMetric = 0;
let DistillationMetric = 0;

function RefreshIcons() {
  if (window.lucide) window.lucide.createIcons();
}

function FormatPaperNames(root = document.body) {
  const nodes = [];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const node = walker.currentNode;
    if (!node.parentElement.closest(".paper-name, script, style, textarea, code") && /\b(?:RoleModel|LAMBS|Lambs)\b/.test(node.textContent)) nodes.push(node);
  }
  nodes.forEach(node => {
    const fragment = document.createDocumentFragment();
    node.textContent.split(/\b(RoleModel|LAMBS|Lambs)\b/g).forEach(text => {
      if (text === "RoleModel" || text === "LAMBS" || text === "Lambs") {
        const span = document.createElement("span");
        span.className = "paper-name";
        span.textContent = text === "RoleModel" ? "RoleModel" : "Lambs";
        span.setAttribute("aria-label", text === "RoleModel" ? "RoleModel" : "LAMBS");
        fragment.appendChild(span);
      } else {
        fragment.appendChild(document.createTextNode(text));
      }
    });
    node.replaceWith(fragment);
  });
}

function SelectStage(index) {
  const stage = StageDescriptions[index];
  document.querySelectorAll("[data-stage]").forEach(button => {
    const selected = Number(button.dataset.stage) === index;
    button.setAttribute("aria-selected", String(selected));
    button.tabIndex = selected ? 0 : -1;
  });
  document.getElementById("StagePanel").setAttribute("aria-labelledby", `StageTab${index}`);
  document.getElementById("StageLabel").textContent = stage.label;
  document.getElementById("StageTitle").textContent = stage.title;
  document.getElementById("StageDescription").textContent = stage.description;
  document.getElementById("StageEquation").innerHTML = stage.equation;
  const StageImage = document.getElementById("StageImage");
  StageImage.src = `assets/figures/figure-${stage.figure}.webp`;
  StageImage.alt = FigureDescriptions[stage.figure].caption;
  const StageFigureButton = document.getElementById("StageFigureButton");
  StageFigureButton.dataset.figure = stage.figure;
  StageFigureButton.setAttribute("aria-label", `Enlarge ${FigureDescriptions[stage.figure].title.toLowerCase()}`);
}

function UpdateResults() {
  const dataset = document.getElementById("DatasetSelect").value;
  const horizon = document.getElementById("HorizonSelect").value;
  const values = BenchmarkData[dataset][horizon];
  const indices = ModelDescriptions.map((model, index) => index).filter(index => index !== 0);
  const MetricName = SelectedMetric === 0 ? "MSE" : "MAE";
  const MaximumValue = Math.max(...indices.map(index => values[index][SelectedMetric]));
  const MinimumValue = Math.min(...indices.map(index => values[index][SelectedMetric]));
  const AxisPadding = Math.max((MaximumValue - MinimumValue) * 0.12, 0.001);
  const AxisMinimum = Math.max(0, Math.floor((MinimumValue - AxisPadding) * 1000) / 1000);
  const AxisMaximum = Math.ceil((MaximumValue + AxisPadding) * 1000) / 1000;
  const AxisRange = AxisMaximum - AxisMinimum;
  const BestValue = MinimumValue;
  const chart = document.getElementById("ResultsChart");
  chart.innerHTML = indices.map(index => {
    const model = ModelDescriptions[index];
    const value = values[index][SelectedMetric];
    const YearLabel = model.kind === "distilled" ? "" : ` <span class="model-year">(${model.year})</span>`;
    return `<div class="bar-row${value === BestValue ? " best" : ""}" data-kind="${model.kind}" data-index="${index}"><div class="bar-label"><strong>${model.name}${YearLabel}</strong><small>${model.detail}</small></div><div class="bar-track"><div class="bar-fill" style="--bar-width:${((value - AxisMinimum) / AxisRange * 100).toFixed(3)}%"></div></div><span class="bar-value">${value.toFixed(3)}</span></div>`;
  }).join("") + `<div class="chart-axis"><span></span><div>${[0, 1, 2, 3, 4].map(index => `<span>${(AxisMinimum + AxisRange * index / 4).toFixed(3)}</span>`).join("")}</div><span></span></div>`;
  chart.dataset.axisMinimum = AxisMinimum;
  chart.dataset.axisMaximum = AxisMaximum;
  document.getElementById("ResultsAxisNote").textContent = `Displayed range: ${AxisMinimum.toFixed(3)}–${AxisMaximum.toFixed(3)} · Truncated axis`;
  chart.setAttribute("aria-label", `Local axis from ${AxisMinimum.toFixed(3)} to ${AxisMaximum.toFixed(3)}, not zero. ${dataset}, ${horizon === "AVG" ? "four-horizon average" : horizon + "-step forecast"}, look-back length 96, ${MetricName}. ` + indices.map(index => `${ModelDescriptions[index].name}${ModelDescriptions[index].kind === "distilled" ? "" : ` (${ModelDescriptions[index].year})`}, ${ModelDescriptions[index].detail}: ${values[index][SelectedMetric].toFixed(3)}`).join("; ") + ". Lower is better.");
  document.getElementById("ResultsSubtitle").textContent = `${dataset} · ${horizon === "AVG" ? "Average over 96 / 192 / 336 / 720" : horizon + "-step forecast"} · Look-back length: 96`;
  document.getElementById("ChartTitle").innerHTML = `${MetricName} comparison <span>↓ Lower is better</span>`;
  FormatPaperNames(chart);
}

function UpdateDistillation() {
  const dataset = document.getElementById("DistillationDataset").value;
  const horizon = document.getElementById("DistillationHorizon").value;
  const scenario = DistillationData[dataset][horizon];
  const MetricName = DistillationMetric === 0 ? "MSE" : "MAE";
  const comparison = document.getElementById("DistillationComparison");
  const changes = FrameworkDescriptions.slice(1).flatMap(framework => scenario[framework.key].map((row, index) => row[DistillationMetric] === null ? null : (row[DistillationMetric] / scenario.student[index][DistillationMetric] - 1) * 100)).filter(value => value !== null);
  const ChangeLimit = Math.max(1, Math.ceil(Math.max(...changes.map(value => Math.abs(value))) * 1.1));
  document.getElementById("DistillationScaleNote").innerHTML = `<span class="change-direction improved">Lower error</span><span>−${ChangeLimit}% ← <strong>0</strong> → +${ChangeLimit}%</span><span class="change-direction degraded">Higher error</span>`;
  comparison.innerHTML = [0, 1].map(group => {
    const indices = group === 0 ? [0, 1, 2, 3] : [4, 5, 6, 7];
    const FamilyName = group === 0 ? "Representation-based students" : "Direct-mapping students";
    const FamilyNote = group === 0 ? "All three distillation frameworks are compatible." : "Output alignment remains available without a separate hidden representation.";
    return `<section class="student-family" aria-label="${FamilyName}"><div class="student-family-heading"><h3>${FamilyName}</h3><p>${FamilyNote}</p></div>${indices.map(index => {
      const student = StudentDescriptions[index];
      const baseline = scenario.student[index][DistillationMetric];
      const values = FrameworkDescriptions.map(framework => scenario[framework.key][index][DistillationMetric]);
      const BestDistilled = Math.min(...values.slice(1).filter(value => value !== null));
      return `<article class="comparison-row"><div class="comparison-student"><h4>${student.name}</h4><span>${student.year}</span></div>${FrameworkDescriptions.map((framework, position) => {
        const value = values[position];
        if (value === null) return `<div class="framework-result unavailable"><span class="framework-mobile-label">${framework.name}</span><span class="not-supported">Not supported</span><small>Separate representation unavailable</small></div>`;
        const change = (value / baseline - 1) * 100;
        const ChangeText = position === 0 ? "Reference" : `${change > 0 ? "+" : ""}${change.toFixed(1)}%`;
        const ChangeClass = position === 0 || Math.abs(change) < 0.00001 ? "neutral" : change < 0 ? "improved" : "degraded";
        const BarWidth = Math.abs(change) / ChangeLimit * 50;
        const BarLeft = change < 0 ? 50 - BarWidth : 50;
        const ChangeBar = position === 0 ? "" : `<div class="framework-track ${ChangeClass}" data-change="${change}" data-limit="${ChangeLimit}" aria-hidden="true"><span style="left:${BarLeft.toFixed(5)}%;width:${BarWidth.toFixed(5)}%"></span><small class="change-zero">0</small></div>`;
        return `<div class="framework-result${framework.key === "rolemodel" ? " framework-rolemodel" : ""}${position > 0 && value === BestDistilled ? " best-framework" : ""}" data-framework="${framework.key}" data-student="${index}" aria-label="${student.name}, ${framework.name}: ${MetricName} ${value.toFixed(3)}, ${position === 0 ? "Student-Only reference" : ChangeText + " from Student-Only"}"><span class="framework-mobile-label">${framework.name}</span><div class="framework-values"><strong>${value.toFixed(3)}</strong><span class="framework-change ${ChangeClass}">${ChangeText}</span></div>${ChangeBar}</div>`;
      }).join("")}</article>`;
    }).join("")}</section>`;
  }).join("");
  document.getElementById("DistillationSubtitle").textContent = `${dataset} · ${horizon === "AVG" ? "Average over 96 / 192 / 336 / 720" : horizon + "-step forecast"} · Look-back length: 96`;
  document.getElementById("DistillationTeacher").textContent = `Teacher: FreEformer (2025) · ${MetricName}: ${scenario.teacher[DistillationMetric].toFixed(3)} · Lower is better`;
  FormatPaperNames(comparison);
}

function UpdateAblation() {
  const dataset = document.getElementById("AblationDataset").value;
  const rows = AblationData[dataset];
  const names = ["Full RoleModel", "w/o Discrepancy", "w/o Diversity", "w/ Backward Samples"];
  document.getElementById("AblationTableBody").innerHTML = rows.map((row, index) => `<tr><th scope="row">${names[index]}</th>${row.map((value, metric) => `<td>${value.toFixed(3)}${index ? `<span class="error-increase">(+${((value / rows[0][metric] - 1) * 100).toFixed(2)}%)</span>` : ""}</td>`).join("")}</tr>`).join("");
  document.querySelector(".ablation-table caption").textContent = `Table V · ${dataset} · EMAformer → LAMBS · four-horizon average`;
  FormatPaperNames(document.querySelector(".ablation-results"));
}

function OpenFigure(number) {
  const figure = FigureDescriptions[number];
  const dialog = document.getElementById("FigureDialog");
  dialog.dataset.figure = number;
  document.getElementById("FigureDialogTitle").textContent = figure.title;
  document.getElementById("FigureDialogCaption").textContent = figure.caption;
  document.getElementById("FigureOriginal").href = `assets/figures/figure-${number}.pdf`;
  const image = document.getElementById("FigureDialogImage");
  image.src = `assets/figures/figure-${number}.webp`;
  image.alt = figure.caption;
  document.body.classList.add("dialog-open");
  FormatPaperNames(dialog);
  dialog.showModal();
}

function CloseFigure() {
  document.getElementById("FigureDialog").close();
}

document.querySelectorAll("[data-stage]").forEach(button => {
  button.addEventListener("click", () => SelectStage(Number(button.dataset.stage)));
  button.addEventListener("keydown", event => {
    const index = Number(button.dataset.stage);
    let NextIndex;
    if (event.key === "ArrowRight") NextIndex = (index + 1) % StageDescriptions.length;
    else if (event.key === "ArrowLeft") NextIndex = (index + StageDescriptions.length - 1) % StageDescriptions.length;
    else if (event.key === "Home") NextIndex = 0;
    else if (event.key === "End") NextIndex = StageDescriptions.length - 1;
    else return;
    event.preventDefault();
    SelectStage(NextIndex);
    document.getElementById(`StageTab${NextIndex}`).focus();
  });
});

document.querySelectorAll("[data-metric]").forEach(button => button.addEventListener("click", () => {
  SelectedMetric = Number(button.dataset.metric);
  document.querySelectorAll("[data-metric]").forEach(item => {
    const selected = item === button;
    item.classList.toggle("active", selected);
    item.setAttribute("aria-pressed", String(selected));
  });
  UpdateResults();
}));

["DatasetSelect", "HorizonSelect"].forEach(id => document.getElementById(id).addEventListener("change", UpdateResults));
document.getElementById("AblationDataset").addEventListener("change", UpdateAblation);

document.querySelectorAll("[data-distillation-metric]").forEach(button => button.addEventListener("click", () => {
  DistillationMetric = Number(button.dataset.distillationMetric);
  document.querySelectorAll("[data-distillation-metric]").forEach(item => {
    const selected = item === button;
    item.classList.toggle("active", selected);
    item.setAttribute("aria-pressed", String(selected));
  });
  UpdateDistillation();
}));
["DistillationDataset", "DistillationHorizon"].forEach(id => document.getElementById(id).addEventListener("change", UpdateDistillation));

document.addEventListener("click", event => {
  const button = event.target.closest("button[data-figure]");
  if (button) OpenFigure(Number(button.dataset.figure));
});
document.getElementById("CloseFigure").addEventListener("click", CloseFigure);
document.getElementById("FigureDialog").addEventListener("click", event => {
  if (event.target !== event.currentTarget) return;
  const bounds = event.currentTarget.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) CloseFigure();
});
document.getElementById("FigureDialog").addEventListener("close", () => document.body.classList.remove("dialog-open"));
document.getElementById("MenuToggle").addEventListener("click", () => {
  const button = document.getElementById("MenuToggle");
  const expanded = button.getAttribute("aria-expanded") === "true";
  button.setAttribute("aria-expanded", String(!expanded));
  button.setAttribute("aria-label", expanded ? "Open navigation" : "Close navigation");
  document.getElementById("MobileNavigation").hidden = expanded;
});
document.querySelectorAll(".mobile-nav a").forEach(link => link.addEventListener("click", () => {
  document.getElementById("MobileNavigation").hidden = true;
  document.getElementById("MenuToggle").setAttribute("aria-expanded", "false");
  document.getElementById("MenuToggle").setAttribute("aria-label", "Open navigation");
}));
document.addEventListener("keydown", event => {
  if (event.key !== "Escape") return;
  document.getElementById("MobileNavigation").hidden = true;
  document.getElementById("MenuToggle").setAttribute("aria-expanded", "false");
});

const SectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    document.querySelectorAll(".desktop-nav a").forEach(link => {
      const active = link.hash === `#${entry.target.id}`;
      link.classList.toggle("active", active);
      if (active) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  });
}, { rootMargin: "-12% 0px -65% 0px", threshold: 0 });
document.querySelectorAll("#overview, #method, #lambs, #results, #compatibility, #findings").forEach(section => SectionObserver.observe(section));

RefreshIcons();
UpdateResults();
UpdateDistillation();
UpdateAblation();
FormatPaperNames();
