import withNuxt from './.nuxt/eslint.config.mjs';

export default withNuxt({
  rules: {
    // Правила для отступов
    indent: ['error', 2], // Используем 2 пробела для отступов
    'no-multi-spaces': 'error', // Запрещает использование нескольких пробелов
    'no-trailing-spaces': 'error', // Запрещает пробелы в конце строки
    'space-in-parens': ['error', 'never'], // Пробелы в скобках
    'comma-dangle': ['error', 'always-multiline'], // Запятая в конце строки, если элемент в новой строке
    'semi': ['error', 'always'], // Требует точку с запятой в конце строки
  },
});
