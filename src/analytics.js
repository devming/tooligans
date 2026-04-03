// Google Analytics 4 helper
// gtag is loaded globally via index.html

function gtag() {
  if (window.gtag) {
    window.gtag(...arguments);
  }
}

// SPA 페이지 전환 추적
export function trackPageView(path, title) {
  gtag('event', 'page_view', {
    page_path: path,
    page_title: title,
  });
}

// 도구 사용 이벤트
export function trackToolUse(toolName, action, detail) {
  gtag('event', 'tool_use', {
    tool_name: toolName,     // json, base64, url, jwt, timestamp
    tool_action: action,     // prettier, minify, encode, decode, convert, etc.
    tool_detail: detail,     // optional extra info
  });
}

// 복사/붙여넣기
export function trackCopy(toolName) {
  gtag('event', 'copy_output', { tool_name: toolName });
}

export function trackPaste(toolName) {
  gtag('event', 'paste_input', { tool_name: toolName });
}

// 언어 변경
export function trackLangChange(lang) {
  gtag('event', 'language_change', { language: lang });
}
