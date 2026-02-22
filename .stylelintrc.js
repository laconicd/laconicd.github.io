export default {
  extends: [
    "stylelint-config-standard",
    "stylelint-config-recess-order", // Google/Recess 방식의 속성 정렬 규칙
  ],
  rules: {
    // 객체지향적 유지보수를 위해 속성 그룹 간 적절한 여백 설정
    "order/order": ["custom-properties", "declarations"],
    "declaration-empty-line-before": "never",
  },
};
