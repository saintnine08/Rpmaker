const STORAGE_KEY = "rp-character-archive-v1";
const WORKSPACE_PATH_SEGMENT = "workspace";
const WORKSPACE_KEY_PREFIX = `${STORAGE_KEY}-workspace-`;
const FONT_DB_NAME = "rp-character-archive-font-db";
const FONT_STORE_NAME = "fonts";
const FONT_RECORD_KEY = "active";
const CUSTOM_FONT_NAME = "RpCustomFont";
const DEFAULT_SITE_FONT = 'Gungsuh, "궁서", Batang, "Times New Roman", serif';
const DEFAULT_ACCENT_FONT = '"Times New Roman", Batang, serif';
const DEFAULT_THEME = "oath";
const DEFAULT_IMAGE_WIDTH = 330;
const MIN_IMAGE_WIDTH = 150;
const MAX_IMAGE_WIDTH = 820;
const DEFAULT_IMAGE_HEIGHT = 360;
const MIN_IMAGE_HEIGHT = 120;
const MAX_IMAGE_HEIGHT = 1400;
const IMAGE_WIDTH_STEP = 48;
const IMAGE_HEIGHT_STEP = 48;
const THEME_IDS = new Set(["oath", "ember", "forest", "moon", "royal"]);
const EXPORT_STATE_SCRIPT_ID = "exportedSiteData";
const LOCKED_SITE_CONFIG_SCRIPT_ID = "lockedSiteConfig";
const APP_STYLE_SOURCE_SCRIPT_ID = "appStyleSource";
const APP_SCRIPT_SOURCE_SCRIPT_ID = "appScriptSource";
const DEFAULT_PORTRAIT_SOURCE_SCRIPT_ID = "defaultPortraitData";

const tabMeta = {
  intro: {
    title: "캐릭터 소개",
    kicker: "CHARACTER INTRODUCTION",
  },
  skills: {
    title: "스킬 설명",
    kicker: "ARCANE SKILLS",
  },
  history: {
    title: "과거사",
    kicker: "PAST CHRONICLE",
  },
  sheet: {
    title: "캐릭터 시트",
    kicker: "CHARACTER SHEET",
  },
};

const defaultPages = {
  intro: `
    <h2>캐릭터 소개</h2>
    <figure class="story-image" data-align="center" title="클릭해서 이미지 교체">
      <img src="assets/default-portrait.png" alt="캐릭터 초상" />
      <figcaption>초상 기록</figcaption>
    </figure>
    <p><strong>이름:</strong> 무명의 방랑자</p>
    <p><strong>이명:</strong> 검은 서약을 짊어진 자</p>
    <p><strong>외형:</strong> 촛불 아래 은빛으로 번지는 머리카락, 낡은 벨벳 망토, 오래된 인장이 박힌 장신구.</p>
    <p><strong>성격:</strong> 낮은 목소리와 신중한 침묵, 약속을 가볍게 여기지 않는 완고함.</p>
    <hr />
    <p>그의 행적은 왕국의 변방에서 시작되었고, 아직 누구에게도 끝을 허락하지 않았다.</p>
  `,
  skills: `
    <h2>스킬 설명</h2>
    <h3>주요 능력</h3>
    <p><strong>스킬명:</strong> 흑성의 맹약</p>
    <p><strong>효과:</strong> 그림자에 새긴 계약을 불러내어 적의 움직임을 한순간 묶는다.</p>
    <p><strong>제약:</strong> 맹약의 문장을 직접 바라본 대상에게만 발동하며, 사용 후 손등의 낙인이 잠시 타오른다.</p>
    <blockquote>별빛이 닿지 않는 곳에서, 맹세는 더 깊게 새겨진다.</blockquote>
    <h3>보조 능력</h3>
    <ul>
      <li>오래된 문장과 봉인의 흔적을 읽는다.</li>
      <li>귀족식 예법과 암시장 은어에 모두 익숙하다.</li>
    </ul>
  `,
  history: `
    <h2>과거사</h2>
    <p><strong>출신:</strong> 북부 변경의 쇠락한 장원, 사라진 가문의 마지막 기록.</p>
    <p><strong>전환점:</strong> 계승식의 밤, 봉인된 지하 예배당에서 이름 없는 계약을 맺었다.</p>
    <p><strong>상처:</strong> 가족의 문장을 지키지 못했다는 죄책감과 끝내 묻지 못한 진실.</p>
    <hr />
    <p>그날 이후 그는 자신의 이름을 밝히지 않았고, 오직 검은 인장이 찍힌 편지만을 남겼다.</p>
  `,
  sheet: `
    <h2>캐릭터 시트</h2>
    <p><strong>나이:</strong> 미정</p>
    <p><strong>종족:</strong> 미정</p>
    <p><strong>성향:</strong> 미정</p>
    <p><strong>소속:</strong> 미정</p>
    <p><strong>스탯:</strong> 힘 / 민첩 / 지식 / 정신 / 매력</p>
    <h3>관계</h3>
    <ul>
      <li><strong>동료:</strong> 북부 원정대의 서기관</li>
      <li><strong>적대자:</strong> 사라진 가문의 문장을 노리는 수집가</li>
      <li><strong>중요 인물:</strong> 지하 예배당의 열쇠를 가진 노사제</li>
    </ul>
  `,
};

const defaultState = {
  title: "검은 서약의 기록",
  currentTab: "intro",
  theme: DEFAULT_THEME,
  pages: defaultPages,
};

const editor = document.querySelector("#editor");
const archiveTitle = document.querySelector("#archiveTitle");
const tabButtons = document.querySelectorAll(".tab-button");
const tabKicker = document.querySelector("#tabKicker");
const currentTabTitle = document.querySelector("#currentTabTitle");
const saveStatus = document.querySelector("#saveStatus");
const settingsBtn = document.querySelector("#settingsBtn");
const settingsPanel = document.querySelector("#settingsPanel");
const paletteOptions = document.querySelectorAll(".palette-option");
const workspacePanel = document.querySelector("#workspacePanel");
const workspaceStatus = document.querySelector("#workspaceStatus");
const workspaceCreateBtn = document.querySelector("#workspaceCreateBtn");
const workspaceCopyBtn = document.querySelector("#workspaceCopyBtn");
const workspaceBaseBtn = document.querySelector("#workspaceBaseBtn");
const fontBtn = document.querySelector("#fontBtn");
const fontResetBtn = document.querySelector("#fontResetBtn");
const fontInput = document.querySelector("#fontInput");
const unlockEditBtn = document.querySelector("#unlockEditBtn");
const imageBtn = document.querySelector("#imageBtn");
const deleteImageBtn = document.querySelector("#deleteImageBtn");
const shrinkImageBtn = document.querySelector("#shrinkImageBtn");
const growImageBtn = document.querySelector("#growImageBtn");
const shortenImageBtn = document.querySelector("#shortenImageBtn");
const heightenImageBtn = document.querySelector("#heightenImageBtn");
const resetImageSizeBtn = document.querySelector("#resetImageSizeBtn");
const imageInput = document.querySelector("#imageInput");
const importInput = document.querySelector("#importInput");
const exportBtn = document.querySelector("#exportBtn");
const exportSiteBtn = document.querySelector("#exportSiteBtn");
const importBtn = document.querySelector("#importBtn");
const resetBtn = document.querySelector("#resetBtn");

const embeddedExportState = readJsonScript(EXPORT_STATE_SCRIPT_ID);
const lockedSiteConfig = readJsonScript(LOCKED_SITE_CONFIG_SCRIPT_ID) || {};
const isStandaloneSite = Boolean(embeddedExportState);
const activeWorkspaceId = isStandaloneSite ? "" : getWorkspaceIdFromLocation();
const activeStorageKey =
  isStandaloneSite && typeof lockedSiteConfig.storageKey === "string" && lockedSiteConfig.storageKey
    ? lockedSiteConfig.storageKey
    : activeWorkspaceId
      ? `${WORKSPACE_KEY_PREFIX}${activeWorkspaceId}`
    : STORAGE_KEY;

let state = loadState();
let activeTab = tabMeta[state.currentTab] ? state.currentTab : "intro";
let savedRange = null;
let saveTimer = 0;
let imageInputMode = "insert";
let imageReplaceTarget = null;
let customFontUrl = null;
let resizeState = null;
let isEditUnlocked = !isStandaloneSite;

archiveTitle.textContent = state.title;
applyTheme(state.theme);
applyEditLockState();
updateWorkspaceControls();
renderTab(activeTab);
applyStoredFont();

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const nextTab = button.dataset.tab;
    if (!tabMeta[nextTab] || nextTab === activeTab) {
      return;
    }

    persistNow();
    renderTab(nextTab);
    scheduleSave();
  });
});

document.querySelectorAll("[data-command]").forEach((button) => {
  button.addEventListener("click", () => {
    runCommand(button.dataset.command);
  });
});

document.querySelector('[data-action="heading"]').addEventListener("click", () => {
  runCommand("formatBlock", "h2");
});

document.querySelector('[data-action="quote"]').addEventListener("click", () => {
  runCommand("formatBlock", "blockquote");
});

document.querySelector('[data-action="divider"]').addEventListener("click", () => {
  insertHtml("<hr><p><br></p>");
});

editor.addEventListener("input", scheduleSave);
archiveTitle.addEventListener("input", scheduleSave);
editor.addEventListener("keyup", saveSelection);
editor.addEventListener("mouseup", saveSelection);
editor.addEventListener("focus", saveSelection);
editor.addEventListener("click", (event) => {
  if (!isEditUnlocked) {
    setSelectedImage(null);
    return;
  }

  const imageAction = closestElement(event.target, "[data-image-action]");

  if (imageAction && editor.contains(imageAction)) {
    event.preventDefault();
    const figure = closestElement(imageAction, ".story-image");
    setSelectedImage(figure);

    if (imageAction.dataset.imageAction === "replace") {
      openImagePicker("replace", figure);
    }

    if (imageAction.dataset.imageAction === "delete") {
      deleteImage(figure);
    }

    if (imageAction.dataset.imageAction === "align-left") {
      setImageAlignment(figure, "left");
    }

    if (imageAction.dataset.imageAction === "align-center") {
      setImageAlignment(figure, "center");
    }

    if (imageAction.dataset.imageAction === "align-right") {
      setImageAlignment(figure, "right");
    }

    return;
  }

  const resizeHandle = closestElement(event.target, "[data-image-resize-handle]");

  if (resizeHandle && editor.contains(resizeHandle)) {
    event.preventDefault();
    setSelectedImage(closestElement(resizeHandle, ".story-image"));
    return;
  }

  const image = closestElement(event.target, ".story-image img");

  if (image && editor.contains(image)) {
    event.preventDefault();
    setSelectedImage(image.closest(".story-image"));
    return;
  }

  setSelectedImage(null);
});

editor.addEventListener("pointerdown", (event) => {
  if (!isEditUnlocked) {
    return;
  }

  const resizeHandle = closestElement(event.target, "[data-image-resize-handle]");

  if (!resizeHandle || !editor.contains(resizeHandle)) {
    return;
  }

  const figure = closestElement(resizeHandle, ".story-image");

  if (!figure) {
    return;
  }

  event.preventDefault();
  setSelectedImage(figure);

  resizeState = {
    figure,
    image: figure.querySelector("img"),
    axis: resizeHandle.dataset.imageResizeHandle,
    startX: event.clientX,
    startY: event.clientY,
    startWidth: Math.round(figure.getBoundingClientRect().width),
    startHeight: Math.round(figure.querySelector("img")?.getBoundingClientRect().height || DEFAULT_IMAGE_HEIGHT),
  };

  resizeHandle.setPointerCapture?.(event.pointerId);
  document.body.classList.add("is-resizing-image");
  document.body.dataset.resizeAxis = resizeState.axis;
  saveStatus.textContent = "크기 조절 중";
});

editor.addEventListener("dblclick", (event) => {
  if (!isEditUnlocked) {
    return;
  }

  const image = closestElement(event.target, ".story-image img");

  if (image && editor.contains(image)) {
    event.preventDefault();
    openImagePicker("replace", image.closest(".story-image"));
  }
});

document.addEventListener("pointermove", (event) => {
  if (!isEditUnlocked || !resizeState || !editor.contains(resizeState.figure)) {
    return;
  }

  const pointerDeltaX = event.clientX - resizeState.startX;
  const pointerDeltaY = event.clientY - resizeState.startY;

  if (resizeState.axis === "width" || resizeState.axis === "both") {
    setImageWidth(resizeState.figure, resizeState.startWidth - pointerDeltaX, {
      preserveHeight: resizeState.axis === "width",
    });
  }

  if (resizeState.axis === "height" || resizeState.axis === "both") {
    setImageHeight(resizeState.figure, resizeState.startHeight + pointerDeltaY);
  }
});

document.addEventListener("pointerup", () => {
  if (!resizeState) {
    return;
  }

  resizeState = null;
  document.body.classList.remove("is-resizing-image");
  delete document.body.dataset.resizeAxis;
  scheduleSave();
});

editor.addEventListener("keydown", (event) => {
  if (!isEditUnlocked) {
    return;
  }

  const canDeleteSelectedImage = imageReplaceTarget && editor.contains(imageReplaceTarget);

  if (!canDeleteSelectedImage || (event.key !== "Delete" && event.key !== "Backspace")) {
    return;
  }

  const selection = window.getSelection();
  const hasRangeSelection = selection && !selection.isCollapsed;

  if (hasRangeSelection) {
    return;
  }

  event.preventDefault();
  deleteImage(imageReplaceTarget);
});

editor.addEventListener("dragover", (event) => event.preventDefault());
editor.addEventListener("drop", (event) => {
  if (!isEditUnlocked) {
    return;
  }

  const imageFiles = [...event.dataTransfer.files].filter((file) => file.type.startsWith("image/"));

  if (!imageFiles.length) {
    return;
  }

  event.preventDefault();
  const targetFigure = closestElement(event.target, ".story-image");

  if (targetFigure && editor.contains(targetFigure) && imageFiles.length === 1) {
    replaceImage(targetFigure, imageFiles[0]);
  } else {
    insertImages(imageFiles);
  }
});

editor.addEventListener("paste", (event) => {
  if (!isEditUnlocked) {
    return;
  }

  const imageFiles = [...event.clipboardData.items]
    .filter((item) => item.kind === "file" && item.type.startsWith("image/"))
    .map((item) => item.getAsFile())
    .filter(Boolean);

  if (!imageFiles.length) {
    return;
  }

  event.preventDefault();
  insertImages(imageFiles);
});

document.addEventListener("selectionchange", () => {
  const selection = window.getSelection();

  if (selection.rangeCount && editor.contains(selection.anchorNode)) {
    saveSelection();
  }
});

settingsBtn.addEventListener("click", () => {
  const isOpen = !settingsPanel.hidden;
  settingsPanel.hidden = isOpen;
  settingsBtn.setAttribute("aria-expanded", String(!isOpen));
});

unlockEditBtn.addEventListener("click", unlockEditing);

paletteOptions.forEach((button) => {
  button.addEventListener("click", () => {
    applyTheme(button.dataset.theme);
    scheduleSave();
  });
});

workspaceCreateBtn?.addEventListener("click", () => {
  persistNow();
  const workspaceId = createWorkspaceSlug();
  localStorage.setItem(`${WORKSPACE_KEY_PREFIX}${workspaceId}`, JSON.stringify(state));
  window.location.href = buildWorkspaceUrl(workspaceId);
});

workspaceCopyBtn?.addEventListener("click", async () => {
  const url = getShareableCurrentUrl();

  try {
    await copyTextToClipboard(url);
    showNotice("현재 주소를 복사했습니다.");
  } catch (error) {
    window.prompt("주소를 직접 복사하세요.", url);
  }
});

workspaceBaseBtn?.addEventListener("click", () => {
  persistNow();
  window.location.href = buildBaseUrl();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !settingsPanel.hidden) {
    settingsPanel.hidden = true;
    settingsBtn.setAttribute("aria-expanded", "false");
  }
});

imageBtn.addEventListener("click", () => {
  saveSelection();
  openImagePicker(imageReplaceTarget && editor.contains(imageReplaceTarget) ? "replace" : "insert", imageReplaceTarget);
});

deleteImageBtn.addEventListener("click", () => {
  if (imageReplaceTarget && editor.contains(imageReplaceTarget)) {
    deleteImage(imageReplaceTarget);
  }
});

shrinkImageBtn.addEventListener("click", () => {
  resizeSelectedImageWidth(-IMAGE_WIDTH_STEP);
});

growImageBtn.addEventListener("click", () => {
  resizeSelectedImageWidth(IMAGE_WIDTH_STEP);
});

shortenImageBtn.addEventListener("click", () => {
  resizeSelectedImageHeight(-IMAGE_HEIGHT_STEP);
});

heightenImageBtn.addEventListener("click", () => {
  resizeSelectedImageHeight(IMAGE_HEIGHT_STEP);
});

resetImageSizeBtn.addEventListener("click", () => {
  if (!imageReplaceTarget || !editor.contains(imageReplaceTarget)) {
    return;
  }

  imageReplaceTarget.style.removeProperty("width");
  imageReplaceTarget.querySelector("img")?.style.removeProperty("height");
  setSelectedImage(imageReplaceTarget);
  scheduleSave();
});

imageInput.addEventListener("change", () => {
  const files = [...imageInput.files].filter((file) => file.type.startsWith("image/"));

  if (imageInputMode === "replace" && imageReplaceTarget && files[0]) {
    replaceImage(imageReplaceTarget, files[0]);
  } else {
    insertImages(files);
  }

  imageInput.value = "";
});

fontBtn.addEventListener("click", () => {
  fontInput.click();
});

fontResetBtn.addEventListener("click", async () => {
  await deleteStoredFont();
  clearCustomFont();
  saveStatus.textContent = "기본 글꼴";
});

fontInput.addEventListener("change", async () => {
  const [file] = fontInput.files;

  if (!file) {
    return;
  }

  if (!isSupportedFontFile(file)) {
    window.alert("ttf, otf, woff, woff2 폰트 파일만 적용할 수 있습니다.");
    fontInput.value = "";
    return;
  }

  try {
    await saveFontRecord(file);
    await applyFontRecord({ name: file.name, blob: file });
    saveStatus.textContent = "폰트 적용됨";
  } catch (error) {
    window.alert("폰트 저장에 실패했습니다. 파일 크기나 브라우저 저장 공간을 확인하세요.");
  } finally {
    fontInput.value = "";
  }
});

exportBtn.addEventListener("click", () => {
  persistNow();

  const payload = {
    version: 1,
    exportedAt: new Date().toISOString(),
    title: state.title,
    currentTab: activeTab,
    theme: state.theme,
    pages: state.pages,
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${safeFileName(state.title)}.json`;
  link.click();
  URL.revokeObjectURL(link.href);
});

exportSiteBtn.addEventListener("click", exportStandaloneSite);

importBtn.addEventListener("click", () => importInput.click());

importInput.addEventListener("change", async () => {
  const [file] = importInput.files;

  if (!file) {
    return;
  }

  try {
    const imported = JSON.parse(await file.text());
    state = normalizeState(imported);
    activeTab = tabMeta[state.currentTab] ? state.currentTab : "intro";
    archiveTitle.textContent = state.title;
    applyTheme(state.theme);
    renderTab(activeTab);
    persistNow();
  } catch (error) {
    window.alert("불러오기에 실패했습니다. JSON 파일 형식을 확인하세요.");
  } finally {
    importInput.value = "";
  }
});

resetBtn.addEventListener("click", () => {
  const confirmed = window.confirm("현재 브라우저에 저장된 기록을 초기화할까요?");

  if (!confirmed) {
    return;
  }

  state = structuredClone(defaultState);
  activeTab = "intro";
  archiveTitle.textContent = state.title;
  applyTheme(state.theme);
  renderTab(activeTab);
  persistNow();
});

window.addEventListener("beforeunload", persistNow);

async function exportStandaloneSite() {
  persistNow();

  const password = await requestStandalonePassword();

  if (password === null) {
    return;
  }

  saveStatus.textContent = "완성 사이트 생성 중";

  try {
    const exportId = createExportId();
    const passwordSalt = createExportId();
    const passwordHash = await hashPassword(password, passwordSalt);
    const standaloneState = normalizeState({
      title: state.title,
      currentTab: activeTab,
      theme: state.theme,
      pages: await embedPageAssets(state.pages),
    });
    const [cssText, rawScriptText, fontStyle, defaultPortraitDataUrl] = await Promise.all([
      fetchAssetText("styles.css"),
      fetchAssetText("script.js"),
      buildStandaloneFontStyle(),
      resolveDefaultPortraitDataUrl(),
    ]);
    const scriptText = defaultPortraitDataUrl
      ? rawScriptText.replaceAll("assets/default-portrait.png", defaultPortraitDataUrl)
      : rawScriptText;
    const lockConfig = {
      version: 1,
      exportedAt: new Date().toISOString(),
      passwordSalt,
      passwordHash,
      storageKey: `${STORAGE_KEY}-standalone-${exportId}`,
    };
    const html = buildStandaloneHtml({
      standaloneState,
      lockConfig,
      cssText,
      scriptText,
      fontStyle,
    });

    downloadBlob(html, `${safeFileName(state.title)}-site.html`, "text/html");
    saveStatus.textContent = "완성 사이트 내보냄";
  } catch (error) {
    console.error(error);
    showNotice(`완성 사이트 내보내기에 실패했습니다. ${getExportErrorMessage(error)}`);
    saveStatus.textContent = "저장됨";
  }
}

function requestStandalonePassword() {
  return requestPasswordDialog({
    title: "완성 사이트 내보내기",
    message: "편집 잠금에 사용할 비밀번호를 정하세요. 정적 HTML이라 강력한 보안이 아니라 편집 잠금용입니다.",
    confirmLabel: "내보내기",
    requireConfirmation: true,
  });
}

async function unlockEditing() {
  if (!isStandaloneSite) {
    return;
  }

  const password = await requestPasswordDialog({
    title: "편집 잠금 해제",
    message: "완성 사이트를 편집하려면 비밀번호를 입력하세요.",
    confirmLabel: "해제",
    requireConfirmation: false,
  });

  if (password === null) {
    return;
  }

  const passwordHash = await hashPassword(password, lockedSiteConfig.passwordSalt || "");

  if (passwordHash !== lockedSiteConfig.passwordHash) {
    showNotice("비밀번호가 맞지 않습니다.");
    return;
  }

  isEditUnlocked = true;
  applyEditLockState();
  enhanceImages();
  setSelectedImage(null);
  saveStatus.textContent = "편집 가능";
}

function requestPasswordDialog({ title, message, confirmLabel, requireConfirmation }) {
  return new Promise((resolve) => {
    document.querySelector(".password-modal-backdrop")?.remove();

    const backdrop = document.createElement("div");
    backdrop.className = "password-modal-backdrop";
    backdrop.innerHTML = `
      <section class="password-modal" role="dialog" aria-modal="true" aria-labelledby="passwordModalTitle">
        <form class="password-modal-form">
          <p class="settings-kicker">LOCKED SITE</p>
          <h2 id="passwordModalTitle" class="password-modal-title"></h2>
          <p class="password-modal-message"></p>
          <label class="password-field">
            <span>비밀번호</span>
            <input class="password-input" type="password" autocomplete="new-password" required />
          </label>
          <label class="password-field password-confirm-field">
            <span>비밀번호 확인</span>
            <input class="password-confirm-input" type="password" autocomplete="new-password" />
          </label>
          <p class="password-error" aria-live="polite"></p>
          <div class="password-modal-actions">
            <button class="tool-button password-cancel" type="button">취소</button>
            <button class="tool-button password-submit" type="submit"></button>
          </div>
        </form>
      </section>
    `;

    const form = backdrop.querySelector(".password-modal-form");
    const titleElement = backdrop.querySelector(".password-modal-title");
    const messageElement = backdrop.querySelector(".password-modal-message");
    const input = backdrop.querySelector(".password-input");
    const confirmField = backdrop.querySelector(".password-confirm-field");
    const confirmInput = backdrop.querySelector(".password-confirm-input");
    const errorElement = backdrop.querySelector(".password-error");
    const submitButton = backdrop.querySelector(".password-submit");
    const cancelButton = backdrop.querySelector(".password-cancel");

    titleElement.textContent = title;
    messageElement.textContent = message;
    submitButton.textContent = confirmLabel;
    confirmField.hidden = !requireConfirmation;
    confirmInput.required = requireConfirmation;

    const close = (value) => {
      document.removeEventListener("keydown", handleEscape);
      backdrop.remove();
      resolve(value);
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        close(null);
      }
    };

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      if (input.value.length < 4) {
        errorElement.textContent = "비밀번호는 4자 이상으로 정하세요.";
        input.focus();
        return;
      }

      if (requireConfirmation && input.value !== confirmInput.value) {
        errorElement.textContent = "비밀번호가 서로 다릅니다.";
        confirmInput.focus();
        return;
      }

      close(input.value);
    });

    cancelButton.addEventListener("click", () => close(null));
    backdrop.addEventListener("click", (event) => {
      if (event.target === backdrop) {
        close(null);
      }
    });
    document.addEventListener("keydown", handleEscape);
    document.body.append(backdrop);
    input.focus();
  });
}

function showNotice(message) {
  const existingNotice = document.querySelector(".password-notice");

  if (existingNotice) {
    existingNotice.remove();
  }

  const notice = document.createElement("div");
  notice.className = "password-notice";
  notice.textContent = message;
  document.body.append(notice);
  window.setTimeout(() => notice.remove(), 2600);
}

function applyEditLockState() {
  document.body.classList.toggle("is-exported-site", isStandaloneSite);
  document.body.classList.toggle("is-edit-unlocked", isStandaloneSite && isEditUnlocked);
  archiveTitle.contentEditable = String(isEditUnlocked);
  editor.contentEditable = String(isEditUnlocked);
  unlockEditBtn.hidden = !isStandaloneSite || isEditUnlocked;

  if (!isEditUnlocked) {
    settingsPanel.hidden = true;
    settingsBtn.setAttribute("aria-expanded", "false");
  }

  updateWorkspaceControls();
}

function buildStandaloneHtml({ standaloneState, lockConfig, cssText, scriptText, fontStyle }) {
  const bodyClone = document.body.cloneNode(true);
  bodyClone.classList.add("is-exported-site");
  bodyClone.classList.remove("is-edit-unlocked", "is-resizing-image");
  delete bodyClone.dataset.resizeAxis;

  bodyClone.querySelectorAll(".image-controls").forEach((controls) => controls.remove());
  bodyClone.querySelectorAll(".image-resize-handle").forEach((handle) => handle.remove());
  bodyClone.querySelectorAll(".story-image.is-selected").forEach((figure) => figure.classList.remove("is-selected"));

  const clonedTitle = bodyClone.querySelector("#archiveTitle");
  const clonedEditor = bodyClone.querySelector("#editor");
  const clonedSettingsPanel = bodyClone.querySelector("#settingsPanel");
  const clonedSettingsBtn = bodyClone.querySelector("#settingsBtn");
  const clonedUnlockButton = bodyClone.querySelector("#unlockEditBtn");
  const clonedSaveStatus = bodyClone.querySelector("#saveStatus");
  const clonedTabKicker = bodyClone.querySelector("#tabKicker");
  const clonedTabTitle = bodyClone.querySelector("#currentTabTitle");

  if (clonedTitle) {
    clonedTitle.textContent = standaloneState.title;
    clonedTitle.contentEditable = "false";
  }

  if (clonedEditor) {
    clonedEditor.innerHTML = standaloneState.pages[standaloneState.currentTab] || "";
    clonedEditor.contentEditable = "false";
  }

  if (clonedSettingsPanel) {
    clonedSettingsPanel.hidden = true;
  }

  if (clonedSettingsBtn) {
    clonedSettingsBtn.setAttribute("aria-expanded", "false");
  }

  if (clonedUnlockButton) {
    clonedUnlockButton.hidden = false;
  }

  if (clonedSaveStatus) {
    clonedSaveStatus.textContent = "읽기 전용";
  }

  if (clonedTabKicker) {
    clonedTabKicker.textContent = tabMeta[standaloneState.currentTab].kicker;
  }

  if (clonedTabTitle) {
    clonedTabTitle.textContent = tabMeta[standaloneState.currentTab].title;
  }

  bodyClone.querySelectorAll(".tab-button").forEach((button) => {
    const isActive = button.dataset.tab === standaloneState.currentTab;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-selected", String(isActive));
  });

  return `<!doctype html>
<html lang="ko" data-theme="${escapeAttribute(standaloneState.theme)}">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="${escapeAttribute(`${standaloneState.title} RP 캐릭터 기록서`)}" />
    <title>${escapeHtml(standaloneState.title)}</title>
    <link rel="icon" href="data:," />
    <style>${escapeStyleText(cssText)}</style>
    ${fontStyle}
    <script id="${EXPORT_STATE_SCRIPT_ID}" type="application/json">${escapeJsonForScript(
      JSON.stringify(standaloneState),
    )}</script>
    <script id="${LOCKED_SITE_CONFIG_SCRIPT_ID}" type="application/json">${escapeJsonForScript(
      JSON.stringify(lockConfig),
    )}</script>
  </head>
  <body class="${escapeAttribute(bodyClone.className)}">
${bodyClone.innerHTML}
    <script data-app-script>${escapeScriptText(scriptText)}</script>
  </body>
</html>
`;
}

async function embedPageAssets(pages) {
  const cache = new Map();
  const entries = await Promise.all(
    Object.entries(pages).map(async ([key, html]) => [key, await embedPageHtmlAssets(html, cache)]),
  );

  return Object.fromEntries(entries);
}

async function embedPageHtmlAssets(html, cache) {
  const template = document.createElement("template");
  template.innerHTML = html;

  for (const image of template.content.querySelectorAll("img[src]")) {
    const src = image.getAttribute("src");

    if (!src || src.startsWith("data:") || /^https?:\/\//i.test(src)) {
      continue;
    }

    image.setAttribute("src", await fetchAssetAsDataUrl(src, cache));
  }

  return template.innerHTML;
}

async function fetchAssetText(path) {
  try {
    const response = await fetch(new URL(path, document.baseURI));

    if (response.ok) {
      return response.text();
    }
  } catch (error) {
    // Standalone exports do not have external CSS/JS files.
  }

  if (path === "styles.css") {
    const styleText = readTextScript(APP_STYLE_SOURCE_SCRIPT_ID) || getInlineStyleText() || getLoadedStyleSheetsText();

    if (styleText) {
      return styleText;
    }
  }

  if (path === "script.js") {
    const scriptText =
      readTextScript(APP_SCRIPT_SOURCE_SCRIPT_ID) ||
      document.querySelector("script[data-app-script]")?.textContent ||
      "";

    if (scriptText) {
      return scriptText;
    }
  }

  throw new Error(`Could not load ${path}`);
}

function getExportErrorMessage(error) {
  const message = error instanceof Error ? error.message : String(error || "");

  if (!message) {
    return "원인을 확인할 수 없습니다.";
  }

  if (message.includes("Could not load")) {
    return message.replace("Could not load", "내보내기용 파일을 읽을 수 없습니다:");
  }

  return message;
}

function getInlineStyleText() {
  return [...document.querySelectorAll("style")]
    .filter((style) => style.id !== "standaloneFontFace")
    .map((style) => style.textContent || "")
    .join("\n");
}

function getLoadedStyleSheetsText() {
  return [...document.styleSheets]
    .map((sheet) => {
      try {
        return [...sheet.cssRules].map((rule) => rule.cssText).join("\n");
      } catch (error) {
        return "";
      }
    })
    .filter(Boolean)
    .join("\n");
}

async function fetchAssetAsDataUrl(path, cache) {
  if (path.startsWith("data:")) {
    return path;
  }

  const url = new URL(path, document.baseURI).href;

  if (cache.has(url)) {
    return cache.get(url);
  }

  let response;

  try {
    response = await fetch(url);
  } catch (error) {
    const fallback = getDefaultPortraitFallback(path);

    if (fallback) {
      cache.set(url, fallback);
      return fallback;
    }

    throw error;
  }

  if (!response.ok) {
    const fallback = getDefaultPortraitFallback(path);

    if (fallback) {
      cache.set(url, fallback);
      return fallback;
    }

    throw new Error(`Could not load ${path}`);
  }

  const dataUrl = await readAsDataUrl(await response.blob());
  cache.set(url, dataUrl);
  return dataUrl;
}

async function resolveDefaultPortraitDataUrl() {
  const embeddedSource = getFirstImageSource(defaultPages.intro);

  if (embeddedSource?.startsWith("data:")) {
    return embeddedSource;
  }

  const storedSource = readTextScript(DEFAULT_PORTRAIT_SOURCE_SCRIPT_ID);

  if (storedSource?.startsWith("data:")) {
    return storedSource;
  }

  try {
    return await fetchAssetAsDataUrl("assets/default-portrait.png", new Map());
  } catch (error) {
    return "";
  }
}

function getFirstImageSource(html) {
  const template = document.createElement("template");
  template.innerHTML = html;
  return template.content.querySelector("img")?.getAttribute("src") || "";
}

function getDefaultPortraitFallback(path) {
  if (!/default-portrait\.png$/i.test(path)) {
    return "";
  }

  const source = readTextScript(DEFAULT_PORTRAIT_SOURCE_SCRIPT_ID);
  return source?.startsWith("data:") ? source : "";
}

function readTextScript(id) {
  return document.getElementById(id)?.textContent?.trim() || "";
}

async function buildStandaloneFontStyle() {
  try {
    const record = await getStoredFontRecord();

    if (!record?.blob) {
      return "";
    }

    const dataUrl = await readAsDataUrl(record.blob);
    const format = getFontFormat(record.name);
    const formatHint = format ? ` format("${format}")` : "";

    return `<style id="standaloneFontFace">
      @font-face {
        font-family: "${CUSTOM_FONT_NAME}";
        src: url("${dataUrl}")${formatHint};
        font-display: swap;
      }

      :root {
        --site-font: "${CUSTOM_FONT_NAME}", ${DEFAULT_SITE_FONT};
        --accent-font: "${CUSTOM_FONT_NAME}", ${DEFAULT_SITE_FONT};
      }
    </style>`;
  } catch (error) {
    return "";
  }
}

function readJsonScript(id) {
  try {
    const script = document.getElementById(id);
    return script?.textContent ? JSON.parse(script.textContent) : null;
  } catch (error) {
    return null;
  }
}

async function hashPassword(password, salt) {
  const value = `${salt}:${password}`;

  if (window.crypto?.subtle && window.TextEncoder) {
    const bytes = new TextEncoder().encode(value);
    const digest = await window.crypto.subtle.digest("SHA-256", bytes);
    return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
  }

  return fallbackHash(value);
}

function fallbackHash(value) {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return (hash >>> 0).toString(16).padStart(8, "0");
}

function createExportId() {
  if (window.crypto?.randomUUID) {
    return window.crypto.randomUUID();
  }

  if (window.crypto?.getRandomValues) {
    const bytes = new Uint8Array(16);
    window.crypto.getRandomValues(bytes);
    return [...bytes].map((byte) => byte.toString(16).padStart(2, "0")).join("");
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function downloadBlob(content, fileName, type) {
  const blob = new Blob([content], { type });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(link.href);
}

function escapeHtml(value) {
  return value.replace(/[&<>]/g, (character) => {
    const replacements = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
    };

    return replacements[character];
  });
}

function escapeJsonForScript(value) {
  return value.replace(/</g, "\\u003c").replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
}

function escapeStyleText(value) {
  return value.replace(/<\/style/gi, "<\\/style");
}

function escapeScriptText(value) {
  return value.replace(/<\/script/gi, "<\\/script");
}

function getWorkspaceIdFromLocation() {
  const queryWorkspace = sanitizeWorkspaceId(new URLSearchParams(window.location.search).get("workspace"));

  if (queryWorkspace) {
    return queryWorkspace;
  }

  const segments = window.location.pathname.split("/").filter(Boolean);
  const workspaceIndex = segments.indexOf(WORKSPACE_PATH_SEGMENT);

  if (workspaceIndex === -1) {
    return "";
  }

  return sanitizeWorkspaceId(decodeURIComponent(segments[workspaceIndex + 1] || ""));
}

function sanitizeWorkspaceId(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "")
    .slice(0, 48);
}

function createWorkspaceSlug() {
  return `rp-${createExportId().replace(/[^a-z0-9]/gi, "").slice(0, 14).toLowerCase()}`;
}

function buildWorkspaceUrl(workspaceId) {
  const url = new URL(window.location.href);
  const safeWorkspaceId = sanitizeWorkspaceId(workspaceId) || createWorkspaceSlug();

  url.hash = "";

  if (url.protocol === "file:") {
    url.searchParams.set("workspace", safeWorkspaceId);
    return url.href;
  }

  const basePath = getBasePathFromUrl(url);
  url.pathname = `${basePath}${WORKSPACE_PATH_SEGMENT}/${encodeURIComponent(safeWorkspaceId)}`;
  url.search = "";
  return url.href;
}

function buildBaseUrl() {
  const url = new URL(window.location.href);
  url.hash = "";
  url.searchParams.delete("workspace");

  if (url.protocol !== "file:") {
    url.pathname = getBasePathFromUrl(url);
    url.search = "";
  }

  return url.href;
}

function getBasePathFromUrl(url) {
  const segments = url.pathname.split("/");
  const workspaceIndex = segments.indexOf(WORKSPACE_PATH_SEGMENT);

  if (workspaceIndex === -1) {
    const pathname = url.pathname.endsWith("/") ? url.pathname : url.pathname.replace(/\/[^/]*$/, "/");
    return pathname || "/";
  }

  const basePath = segments.slice(0, workspaceIndex).join("/") || "/";
  return basePath.endsWith("/") ? basePath : `${basePath}/`;
}

function getShareableCurrentUrl() {
  return activeWorkspaceId ? buildWorkspaceUrl(activeWorkspaceId) : buildBaseUrl();
}

async function copyTextToClipboard(text) {
  if (navigator.clipboard?.writeText && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  document.body.append(textarea);
  textarea.select();
  const copied = document.execCommand("copy");
  textarea.remove();

  if (!copied) {
    throw new Error("Clipboard copy failed");
  }
}

function updateWorkspaceControls() {
  if (!workspacePanel) {
    return;
  }

  workspacePanel.hidden = isStandaloneSite;

  if (workspaceStatus) {
    workspaceStatus.textContent = activeWorkspaceId
      ? `현재 개인 주소: ${activeWorkspaceId}`
      : "현재 기본 주소를 사용 중입니다.";
  }

  if (workspaceBaseBtn) {
    workspaceBaseBtn.disabled = !activeWorkspaceId && !new URLSearchParams(window.location.search).has("workspace");
  }
}

function loadState() {
  try {
    const rawState = localStorage.getItem(activeStorageKey);

    if (rawState) {
      return normalizeState(JSON.parse(rawState));
    }

    return isStandaloneSite ? normalizeState(embeddedExportState) : structuredClone(defaultState);
  } catch (error) {
    return isStandaloneSite ? normalizeState(embeddedExportState) : structuredClone(defaultState);
  }
}

function normalizeState(candidate) {
  const pages = { ...defaultPages };

  if (candidate && typeof candidate.pages === "object") {
    Object.keys(defaultPages).forEach((key) => {
      if (typeof candidate.pages[key] === "string") {
        pages[key] = candidate.pages[key];
      }
    });
  }

  return {
    title: typeof candidate?.title === "string" && candidate.title.trim() ? candidate.title.trim() : defaultState.title,
    currentTab: tabMeta[candidate?.currentTab] ? candidate.currentTab : "intro",
    theme: THEME_IDS.has(candidate?.theme) ? candidate.theme : DEFAULT_THEME,
    pages,
  };
}

function applyTheme(themeName = DEFAULT_THEME) {
  const nextTheme = THEME_IDS.has(themeName) ? themeName : DEFAULT_THEME;
  state.theme = nextTheme;
  document.documentElement.dataset.theme = nextTheme;

  paletteOptions.forEach((button) => {
    const isActive = button.dataset.theme === nextTheme;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

function renderTab(tabName) {
  activeTab = tabName;
  state.currentTab = tabName;
  editor.innerHTML = state.pages[tabName] || "";
  enhanceImages();
  setSelectedImage(null);
  tabKicker.textContent = tabMeta[tabName].kicker;
  currentTabTitle.textContent = tabMeta[tabName].title;

  tabButtons.forEach((button) => {
    const isActive = button.dataset.tab === tabName;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-selected", String(isActive));
  });

  if (isEditUnlocked) {
    placeCaretAtEnd();
  }
}

function runCommand(command, value = null) {
  if (!isEditUnlocked) {
    return;
  }

  editor.focus();
  restoreSelection();
  document.execCommand(command, false, value);
  saveSelection();
  scheduleSave();
}

function insertHtml(html) {
  if (!isEditUnlocked) {
    return;
  }

  editor.focus();
  restoreSelection();
  document.execCommand("insertHTML", false, html);
  enhanceImages();
  saveSelection();
  scheduleSave();
}

function enhanceImages() {
  editor.querySelectorAll(".story-image").forEach((figure) => {
    figure.querySelectorAll(".image-controls").forEach((controls) => controls.remove());
    figure.querySelectorAll(".image-resize-handle").forEach((handle) => handle.remove());
    figure.dataset.align = figure.dataset.align || "center";

    if (!isEditUnlocked) {
      figure.removeAttribute("title");
      return;
    }

    figure.title = "클릭해서 이미지 교체";

    const controls = document.createElement("div");
    controls.className = "image-controls";
    controls.contentEditable = "false";
    controls.innerHTML = `
      <button class="image-action" type="button" data-image-action="align-left" title="왼쪽 정렬" aria-label="왼쪽 정렬">←</button>
      <button class="image-action" type="button" data-image-action="align-center" title="가운데 정렬" aria-label="가운데 정렬">≡</button>
      <button class="image-action" type="button" data-image-action="align-right" title="오른쪽 정렬" aria-label="오른쪽 정렬">→</button>
      <button class="image-action replace" type="button" data-image-action="replace" title="이미지 교체" aria-label="이미지 교체">↥</button>
      <button class="image-action delete" type="button" data-image-action="delete" title="이미지 삭제" aria-label="이미지 삭제">×</button>
    `;
    figure.append(controls);

    const resizeHandles = [
      {
        axis: "width",
        className: "width",
        title: "드래그해서 이미지 가로 크기 조절",
        label: "이미지 가로 크기 조절",
        text: "↔",
      },
      {
        axis: "height",
        className: "height",
        title: "드래그해서 이미지 세로 크기 조절",
        label: "이미지 세로 크기 조절",
        text: "↕",
      },
      {
        axis: "both",
        className: "both",
        title: "드래그해서 이미지 가로와 세로 크기 조절",
        label: "이미지 가로와 세로 크기 조절",
        text: "⤡",
      },
    ];

    resizeHandles.forEach((handleConfig) => {
      const resizeHandle = document.createElement("button");
      resizeHandle.className = `image-resize-handle ${handleConfig.className}`;
      resizeHandle.type = "button";
      resizeHandle.contentEditable = "false";
      resizeHandle.dataset.imageResizeHandle = handleConfig.axis;
      resizeHandle.title = handleConfig.title;
      resizeHandle.setAttribute("aria-label", handleConfig.label);
      resizeHandle.textContent = handleConfig.text;
      figure.append(resizeHandle);
    });
  });
}

function openImagePicker(mode, targetFigure = null) {
  if (!isEditUnlocked) {
    return;
  }

  imageInputMode = mode;
  setSelectedImage(mode === "replace" ? targetFigure : null);
  imageInput.multiple = mode !== "replace";
  imageInput.click();
}

function setSelectedImage(figure) {
  if (!isEditUnlocked) {
    figure = null;
  }

  editor.querySelectorAll(".story-image.is-selected").forEach((selectedFigure) => {
    selectedFigure.classList.remove("is-selected");
  });

  imageReplaceTarget = figure && editor.contains(figure) ? figure : null;
  deleteImageBtn.disabled = !imageReplaceTarget;
  shrinkImageBtn.disabled = !imageReplaceTarget;
  growImageBtn.disabled = !imageReplaceTarget;
  shortenImageBtn.disabled = !imageReplaceTarget;
  heightenImageBtn.disabled = !imageReplaceTarget;
  resetImageSizeBtn.disabled = !imageReplaceTarget;
  imageBtn.title = imageReplaceTarget ? "선택 이미지 교체" : "이미지 삽입";
  imageBtn.setAttribute("aria-label", imageReplaceTarget ? "선택 이미지 교체" : "이미지 삽입");

  if (imageReplaceTarget) {
    imageReplaceTarget.classList.add("is-selected");
  }
}

function setImageAlignment(figure, alignment) {
  if (!isEditUnlocked) {
    return;
  }

  if (!figure || !editor.contains(figure)) {
    return;
  }

  figure.dataset.align = alignment;
  setSelectedImage(figure);
  scheduleSave();
}

async function replaceImage(figure, file) {
  if (!isEditUnlocked) {
    return;
  }

  const image = figure?.querySelector("img");

  if (!image || !file.type.startsWith("image/")) {
    return;
  }

  image.src = await readAsDataUrl(file);
  image.alt = file.name || "교체 이미지";
  setSelectedImage(figure);
  scheduleSave();
}

function resizeSelectedImageWidth(delta) {
  if (!isEditUnlocked) {
    return;
  }

  if (!imageReplaceTarget || !editor.contains(imageReplaceTarget)) {
    return;
  }

  const currentWidth = Math.round(imageReplaceTarget.getBoundingClientRect().width) || DEFAULT_IMAGE_WIDTH;
  setImageWidth(imageReplaceTarget, currentWidth + delta);
  setSelectedImage(imageReplaceTarget);
  scheduleSave();
}

function resizeSelectedImageHeight(delta) {
  if (!isEditUnlocked) {
    return;
  }

  if (!imageReplaceTarget || !editor.contains(imageReplaceTarget)) {
    return;
  }

  const image = imageReplaceTarget.querySelector("img");
  const currentHeight = Math.round(image?.getBoundingClientRect().height || DEFAULT_IMAGE_HEIGHT);
  setImageHeight(imageReplaceTarget, currentHeight + delta);
  setSelectedImage(imageReplaceTarget);
  scheduleSave();
}

function setImageWidth(figure, width, options = {}) {
  if (!isEditUnlocked) {
    return;
  }

  if (!figure || !editor.contains(figure)) {
    return;
  }

  const image = figure.querySelector("img");
  const preserveHeight = options.preserveHeight ?? true;

  if (preserveHeight && image) {
    image.style.height = `${Math.round(image.getBoundingClientRect().height)}px`;
  }

  const { min, max } = getImageResizeBounds();
  const nextWidth = Math.round(Math.min(max, Math.max(min, width)));
  figure.style.width = `${nextWidth}px`;
}

function setImageHeight(figure, height) {
  if (!isEditUnlocked) {
    return;
  }

  const image = figure?.querySelector("img");

  if (!image || !editor.contains(figure)) {
    return;
  }

  const { min, max } = getImageHeightBounds();
  const nextHeight = Math.round(Math.min(max, Math.max(min, height)));
  image.style.height = `${nextHeight}px`;
}

function getImageResizeBounds() {
  const editorWidth = Math.floor(editor.getBoundingClientRect().width);
  const maxWidth = Math.max(MIN_IMAGE_WIDTH, Math.min(MAX_IMAGE_WIDTH, editorWidth - 24));

  return {
    min: Math.min(MIN_IMAGE_WIDTH, maxWidth),
    max: maxWidth,
  };
}

function getImageHeightBounds() {
  return {
    min: MIN_IMAGE_HEIGHT,
    max: MAX_IMAGE_HEIGHT,
  };
}

function deleteImage(figure) {
  if (!isEditUnlocked) {
    return;
  }

  if (!figure || !editor.contains(figure)) {
    return;
  }

  const caretTarget = document.createElement("p");
  caretTarget.innerHTML = "<br>";
  figure.replaceWith(caretTarget);
  setSelectedImage(null);
  placeCaretInside(caretTarget);
  scheduleSave();
}

async function insertImages(files) {
  if (!isEditUnlocked) {
    return;
  }

  if (!files.length) {
    return;
  }

  editor.focus();
  restoreSelection();

  for (const file of files) {
    const dataUrl = await readAsDataUrl(file);
    const figure = `
      <figure class="story-image" data-align="center" title="클릭해서 이미지 교체">
        <img src="${dataUrl}" alt="${escapeAttribute(file.name || "삽입 이미지")}" />
        <figcaption>이미지 설명</figcaption>
      </figure>
      <p><br></p>
    `;
    insertHtml(figure);
  }
}

function closestElement(target, selector) {
  return target instanceof Element ? target.closest(selector) : null;
}

function readAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(reader.result));
    reader.addEventListener("error", reject);
    reader.readAsDataURL(file);
  });
}

function scheduleSave() {
  saveStatus.textContent = "저장 중";
  window.clearTimeout(saveTimer);
  saveTimer = window.setTimeout(persistNow, 260);
}

function persistNow() {
  window.clearTimeout(saveTimer);
  state.title = archiveTitle.textContent.trim() || defaultState.title;
  state.currentTab = activeTab;
  state.theme = THEME_IDS.has(state.theme) ? state.theme : DEFAULT_THEME;
  state.pages[activeTab] = getCleanEditorHtml();
  localStorage.setItem(activeStorageKey, JSON.stringify(state));
  saveStatus.textContent = "저장됨";
}

function getCleanEditorHtml() {
  const clone = editor.cloneNode(true);
  clone.querySelectorAll(".image-controls").forEach((controls) => controls.remove());
  clone.querySelectorAll(".image-resize-handle").forEach((handle) => handle.remove());
  clone.querySelectorAll(".story-image.is-selected").forEach((figure) => figure.classList.remove("is-selected"));
  return clone.innerHTML;
}

function saveSelection() {
  const selection = window.getSelection();

  if (!selection.rangeCount || !editor.contains(selection.anchorNode)) {
    return;
  }

  savedRange = selection.getRangeAt(0).cloneRange();
}

function restoreSelection() {
  if (!savedRange || !editor.contains(savedRange.commonAncestorContainer)) {
    placeCaretAtEnd();
    return;
  }

  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(savedRange);
}

function placeCaretAtEnd() {
  editor.focus();

  const range = document.createRange();
  range.selectNodeContents(editor);
  range.collapse(false);

  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
  saveSelection();
}

function placeCaretInside(element) {
  editor.focus();

  const range = document.createRange();
  range.selectNodeContents(element);
  range.collapse(false);

  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
  saveSelection();
}

function escapeAttribute(value) {
  return value.replace(/[&<>"']/g, (character) => {
    const replacements = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return replacements[character];
  });
}

function safeFileName(value) {
  return (value || "rp-character-archive")
    .trim()
    .replace(/[\\/:*?"<>|]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 48) || "rp-character-archive";
}

async function applyStoredFont() {
  try {
    const record = await getStoredFontRecord();

    if (record?.blob) {
      await applyFontRecord(record);
    }
  } catch (error) {
    clearCustomFont();
  }
}

async function applyFontRecord(record) {
  if (customFontUrl) {
    URL.revokeObjectURL(customFontUrl);
  }

  customFontUrl = URL.createObjectURL(record.blob);

  let style = document.querySelector("#customFontFace");

  if (!style) {
    style = document.createElement("style");
    style.id = "customFontFace";
    document.head.append(style);
  }

  const format = getFontFormat(record.name);
  const formatHint = format ? ` format("${format}")` : "";
  style.textContent = `
    @font-face {
      font-family: "${CUSTOM_FONT_NAME}";
      src: url("${customFontUrl}")${formatHint};
      font-display: swap;
    }
  `;

  document.documentElement.style.setProperty("--site-font", `"${CUSTOM_FONT_NAME}", ${DEFAULT_SITE_FONT}`);
  document.documentElement.style.setProperty("--accent-font", `"${CUSTOM_FONT_NAME}", ${DEFAULT_SITE_FONT}`);
  fontBtn.title = `폰트 변경: ${record.name}`;
  fontResetBtn.disabled = false;
}

function clearCustomFont() {
  if (customFontUrl) {
    URL.revokeObjectURL(customFontUrl);
    customFontUrl = null;
  }

  document.querySelector("#customFontFace")?.remove();
  document.documentElement.style.setProperty("--site-font", DEFAULT_SITE_FONT);
  document.documentElement.style.setProperty("--accent-font", DEFAULT_ACCENT_FONT);
  fontBtn.title = "폰트 파일 적용";
  fontResetBtn.disabled = true;
}

function isSupportedFontFile(file) {
  return /\.(ttf|otf|woff|woff2)$/i.test(file.name);
}

function getFontFormat(fileName) {
  const extension = fileName.split(".").pop()?.toLowerCase();
  const formats = {
    ttf: "truetype",
    otf: "opentype",
    woff: "woff",
    woff2: "woff2",
  };

  return formats[extension] || "";
}

async function saveFontRecord(file) {
  const db = await openFontDb();

  try {
    await runFontTransaction(db, "readwrite", (store) =>
      store.put(
        {
          key: FONT_RECORD_KEY,
          name: file.name,
          type: file.type || "font/unknown",
          updatedAt: new Date().toISOString(),
          blob: file,
        },
        FONT_RECORD_KEY,
      ),
    );
  } finally {
    db.close();
  }
}

async function getStoredFontRecord() {
  const db = await openFontDb();

  try {
    return await runFontTransaction(db, "readonly", (store) => store.get(FONT_RECORD_KEY));
  } finally {
    db.close();
  }
}

async function deleteStoredFont() {
  const db = await openFontDb();

  try {
    await runFontTransaction(db, "readwrite", (store) => store.delete(FONT_RECORD_KEY));
  } finally {
    db.close();
  }
}

function openFontDb() {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      reject(new Error("IndexedDB is not available."));
      return;
    }

    const request = indexedDB.open(FONT_DB_NAME, 1);

    request.addEventListener("upgradeneeded", () => {
      request.result.createObjectStore(FONT_STORE_NAME);
    });
    request.addEventListener("success", () => resolve(request.result));
    request.addEventListener("error", () => reject(request.error));
  });
}

function runFontTransaction(db, mode, operation) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(FONT_STORE_NAME, mode);
    let result;

    try {
      const request = operation(transaction.objectStore(FONT_STORE_NAME));
      request.addEventListener("success", () => {
        result = request.result;
      });
      request.addEventListener("error", () => reject(request.error));
    } catch (error) {
      reject(error);
      return;
    }

    transaction.addEventListener("complete", () => resolve(result));
    transaction.addEventListener("error", () => reject(transaction.error));
    transaction.addEventListener("abort", () => reject(transaction.error));
  });
}
