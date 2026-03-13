# PMAS — Clinical Planning System

**Планирование и анализ лицевой хирургии на базе AI**

> Веб-приложение для клинического анализа лица, планирования пластических операций и документирования результатов. Работает в браузере — без установки.

---

## Возможности

### 2D Анализ
- AI-распознавание ориентиров лица (TensorFlow.js + MediaPipe FaceMesh)
- Средняя линия, горизонталь глаз, три трети лица
- Калибровка, измерения H/L, расчёт AB
- Векторы перемещения, наклон, углы, зоны
- Готовые клинические пресеты (кантинг, ось носа, фейслифтинг и др.)
- Авторасчёт асимметрии R vs L
- До/После — сохранение и сравнение состояний

### 3D Модель
- Просмотр 3D-моделей головы (Lee Perry-Smith, Face Cap)
- Загрузка собственных `.glb` / `.gltf` файлов
- 6 инструментов: точка, расстояние, вектор, угол, наклон, измерение
- Режимы отображения: wireframe, нормали, 3 варианта освещения
- Калибровка масштаба

### Экспорт
- **PDF** — полный отчёт с визуализацией (2D и 3D)
- **DOCX** — структурированный документ для медкарты

---

## Запуск

### GitHub Pages (онлайн)
https://foggies-studio.github.io/PMAS/

### Локально
- **macOS** — двойной клик на `start.command`
- **Windows** — двойной клик на `start.bat`

> Требуется Python 3 и современный браузер (Chrome, Edge, Firefox).

---

## Технологии

| Компонент | Технология |
|-----------|-----------|
| UI | HTML / CSS / JS |
| AI-детекция | TensorFlow.js + MediaPipe FaceMesh |
| 3D | Three.js + CSS2DRenderer |
| Экспорт PDF | html2canvas + jsPDF |
| Экспорт DOCX | docx.js + FileSaver.js |
| Хранение | localStorage |

---

## Структура

```
PMAS/
├── index.html              # главная страница (2D + 3D + О проекте)
├── start.command            # запуск (macOS)
├── start.bat                # запуск (Windows)
├── assets/
│   ├── css/style.css
│   ├── js/app.js            # 3D логика
│   ├── js/01-11*.js         # 2D модули
│   └── img/                 # фото авторов
├── models/
│   ├── LeePerrySmith.glb
│   └── facecap.glb
└── test_face.jpg            # тестовое фото
```

---

## Авторы

**НИУ МЭИ** — Группа ИЭ-41-25

- Меркулов А.А.
- Любаев Д.О.

---

## Лицензия

MIT

**3D-модели:**
- `LeePerrySmith.glb` — [CC-BY 3.0](https://creativecommons.org/licenses/by/3.0/) (Infinite-Realities)
- `facecap.glb` — [MIT](https://github.com/mrdoob/three.js/blob/dev/LICENSE) (Three.js)
