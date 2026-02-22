import _htmx from "htmx.org";

// 1. 타입을 수동으로 강제 정의합니다. (가장 간단한 우회법)
const htmx = _htmx as unknown as {
  onLoad: (cb: () => void) => void;
  process: (el: Element) => void;
};

// 2. globalThis에 속성 추가 (인덱스 시그니처 에러 방지)
Object.assign(globalThis, { htmx });

// 3. 이제 에러 없이 사용 가능합니다.
htmx.onLoad(() => {
  console.log("HTMX 2.0 Ready!");
});
