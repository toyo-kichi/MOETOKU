# MOETOKU (MVP)

## 開発コマンド
- **インフラ**: `docker-compose up -d`
- **バックエンド**: `./mvnw spring-boot:run`
- **フロントエンド**: `npm start`
- **テスト**: `npm test` / `./mvnw test`

## 設計思想 (アーキテクチャ)
- **全体**: クリーンアーキテクチャを意識した疎結合な構成。
- **Backend**: Spring Boot (Java 21) / DDD（ドメイン駆動設計）パッケージ構成。
- **Frontend**: Angular (Latest) / LIFT原則に基づいた機能単位（Features）分割。
- **DB**: PostgreSQL (Docker)

## コーディング規約 / 制約
- 型定義を徹底し、マジックナンバーは使わない。
- APIレスポンスは共通のResult型でラップする。
- グラフ表示には Chart.js を使用する。

## 現在の進捗
- [ ] プロジェクト初期構造の作成 (Scaffolding)
- [ ] Docker Compose 環境構築