# 天気確認アプリ

|ホーム画面|
|:-:|
|<img src="./public/home.png" alt="Home Screen"/>|

|天気確認画面|
|:-:|
|<img src="./public/weather.png" alt="Weather Screen"/>|

## デプロイ先
https://weather-app-nine-kappa-50.vercel.app/

## 機能一覧
- 機能
  - 現在地から天気確認
  - 行き先から天気確認
- 非機能
  - DB上の古いデータの定期的な削除

## 使用技術
- フロントエンド
  - Next.js
  - TypeScript
  
- バックエンド
  - Prisma
  - PostgreSQL
  - Vercel（デプロイ/ストレージ/Cronジョブ）

- 使用API
  - Open-Metro 天気データ
    - https://open-meteo.com/
  - Google Map API

### DB構成図
```mermaid
erDiagram
    HourlyData {
        String id PK "ID"
        Float latitude "緯度"
        Float longitude "経度"
        String[] time "1週間の時間"
        Float[] temperature_2m "1週間の気温"
        Float[] precipitation_probability "1週間の降水率"
        DateTime created_date "作成日(index)"
    }
```
- HourlyDataデータ例
<img src='./public/data-example.png' alt='example'>
