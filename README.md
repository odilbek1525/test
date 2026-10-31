# Портфолио

Адаптивное портфолио на React и Vite со сменой языка (русский/английский) и светлой/тёмной темы. На главной странице размещены проекты, контакты, навыки и информация о разработчике. Для каждого проекта доступны рабочее демо и ссылка на исходный код в GitHub-репозитории.

## Проекты

- [Витрина товаров — демо](https://odilbek1525.github.io/test/catalog) · [исходный код](https://github.com/odilbek1525/test/tree/main/src/pages)
- [Feng Shui — демо](https://odilbek1525.github.io/test/projects/feng-shui/index.html) · [исходный код](https://github.com/odilbek1525/test/tree/main/public/projects/feng-shui)
- [PERFUME LINE — демо](https://odilbek1525.github.io/test/projects/perfume-line/index.html) · [исходный код](https://github.com/odilbek1525/test/tree/main/public/projects/perfume-line)

Каталог загружает товары из [DummyJSON Products API](https://dummyjson.com/products), показывает по 12 товаров на странице и поддерживает поиск, фильтрацию, сортировку по названию, цене и количеству, а также подробные страницы с галереей изображений. Цена в каталоге учитывает скидку из API. При недоступности API используется локальный резервный каталог.

## Запуск

```sh
npm install
npm run dev
```

## Проверки и публикация

```sh
npm run lint
npm run build
npm run deploy
```

Для GitHub Pages используется репозиторий `odilbek1525/test` и ветка `gh-pages`. Сборка также генерирует `404.html`, чтобы прямые ссылки и перезагрузка страниц каталога продолжали работать.
