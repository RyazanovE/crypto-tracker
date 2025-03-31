// import this after install `@mdi/font` package
import '@mdi/font/css/materialdesignicons.css';

import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import { VDateInput } from 'vuetify/labs/components';

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    theme: {
      themes: {
        light: {
          colors: {
            primary: '#5C6BC0', // Приглушенный индиго (акцент без агрессии)
            secondary: '#78909C', // Серо-голубой (второстепенные элементы)
            background: '#FAFAFA', // Слегка теплый белый (фон)
            surface: '#FFFFFF', // Чистый белый (карточки)
            error: '#EF5350', // Мягкий красный (убытки)
            success: '#66BB6A', // Травяной зеленый (прибыль)
            warning: '#FFA726', // Апельсиновый (предупреждения)
            'on-background': '#37474F', // Темно-серый (основной текст)
            'on-surface': '#455A64', // Серо-синий (текст на карточках)
            border: '#CFD8DC', // Светло-серый (границы)

            // Кастомные цвета для таблиц
            'table-header': '#ECEFF1', // Фон заголовков таблиц
            'table-row-even': '#FAFAFA', // Четные строки
            'table-row-odd': '#FFFFFF', // Нечетные строки
          },
        },
        dark: {
          colors: {
            primary: '#7986CB',
            background: '#121212',
            surface: '#1E1E1E',
            'on-background': '#E0E0E0',
            'on-surface': '#B0BEC5',
            border: '#424242',
          },
        },
      },
    },
    components: {
      VDateInput,
    },
    blueprint: {
      defaults: {
        global: {
          eager: true,
        },
      },
    },
  });

  app.vueApp.use(vuetify);
});