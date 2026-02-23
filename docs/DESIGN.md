# MOETOKU 設計ドキュメント

## 概要

オフショアメンバーが「絶望度」（1〜10）とコメントを記録・可視化するシステム。
クリーンアーキテクチャ（DDD）と Angular LIFT 原則の学習を兼ねた MVP 実装。

---

## ディレクトリ構成

```
MOETOKU/
├── docker-compose.yml        # PostgreSQL 16-alpine
├── backend/                  # Spring Boot 3.5 + Gradle Kotlin DSL
│   └── src/main/java/com/moetoku/
│       ├── domain/           # ドメイン層（ビジネスロジック・不変条件）
│       ├── application/      # アプリケーション層（ユースケース）
│       ├── infrastructure/   # インフラ層（DB・外部I/O）
│       └── interfaces/       # インターフェース層（REST API）
└── frontend/                 # Angular 21 (standalone components)
    └── src/app/
        ├── models/           # 型定義・定数
        ├── core/services/    # HTTPクライアントラッパー
        └── features/         # 機能単位コンポーネント（LIFT原則）
```

---

## バックエンド設計

### レイヤー構成

```
interfaces/rest        ← HTTP入出力（Controller, ExceptionHandler）
      ↓ uses
application/service    ← ユースケース（EntryApplicationService）
      ↓ uses
domain/                ← ビジネスルール（DespairEntry, Value Objects）
      ↑ implements (DIP)
infrastructure/        ← JPA実装（EntryRepositoryImpl）
```

### ドメイン層

| クラス | 種別 | 責務 |
|--------|------|------|
| `DespairEntry` | Aggregate Root | 絶望度エントリの集約。不変オブジェクト。 |
| `DespairLevel` | Value Object | 1〜10の範囲制約を持つ絶望度。不変条件をコンストラクタで保証。 |
| `EntryId` | Value Object | UUID ラッパー |
| `MemberName` | Value Object | 空白不可・100文字以内の制約 |
| `EntryRepository` | Port (interface) | インフラへの依存を逆転させるポート定義 |

### アプリケーション層

| クラス | 種別 | 責務 |
|--------|------|------|
| `CreateEntryCommand` | Input DTO (record) | バリデーションアノテーション付き入力値 |
| `EntryDto` | Output DTO (record) | `from(DespairEntry)` ファクトリメソッドで変換 |
| `EntryApplicationService` | Service | create / findAll / findByMemberName |

### インフラ層

| クラス | 種別 | 責務 |
|--------|------|------|
| `DespairEntryJpaEntity` | JPA Entity | DBマッピング（Lombokで簡略化） |
| `DespairEntryJpaRepository` | Spring Data JPA | DB操作インターフェース |
| `EntryMapper` | Mapper | Domain ↔ JPA Entity 相互変換 |
| `EntryRepositoryImpl` | Adapter | `EntryRepository` ポートの実装 |

### インターフェース層

| クラス | 種別 | 責務 |
|--------|------|------|
| `Result<T>` | Response Wrapper | `{success, data, error}` で全APIレスポンスを統一 |
| `EntryController` | REST Controller | POST `/api/entries`, GET `/api/entries?memberName=` |
| `GlobalExceptionHandler` | ControllerAdvice | バリデーション・ドメイン例外を `Result.fail()` に変換 |

---

## API 仕様

### POST `/api/entries`

**Request Body:**
```json
{
  "memberName": "田中",
  "level": 8,
  "comment": "最悪のデプロイ"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "uuid...",
    "memberName": "田中",
    "level": 8,
    "comment": "最悪のデプロイ",
    "recordedAt": "2026-02-23T20:00:00+09:00"
  },
  "error": null
}
```

### GET `/api/entries?memberName={name}`

- `memberName` 省略時: 全件取得
- 指定時: 該当メンバーのみ取得

**Response (200 OK):**
```json
{
  "success": true,
  "data": [...],
  "error": null
}
```

---

## DB スキーマ

```sql
CREATE TABLE despair_entries (
    id          UUID         NOT NULL DEFAULT gen_random_uuid(),
    member_name VARCHAR(100) NOT NULL,
    level       SMALLINT     NOT NULL CHECK (level >= 1 AND level <= 10),
    comment     TEXT,
    recorded_at TIMESTAMPTZ  NOT NULL DEFAULT now(),
    CONSTRAINT pk_despair_entries PRIMARY KEY (id)
);
```

Flyway でバージョン管理 (`V1__create_despair_entries_table.sql`)。
`ddl-auto: validate` により起動時にスキーマ整合性を検証。

---

## フロントエンド設計

### Angular 21 Standalone Components

NgModule を使わず、すべて Standalone Components で構成。
ルートベースの Lazy Loading で初期バンドルを軽量化。

### ディレクトリ構造（LIFT 原則）

```
src/app/
├── models/
│   ├── entry.model.ts           # Entry, CreateEntryRequest インターフェース
│   ├── api-result.model.ts      # ApiResult<T> 汎用レスポンス型
│   └── entry-level.constant.ts  # DESPAIR_LEVEL.MIN=1, MAX=10（マジックナンバー禁止）
├── core/services/
│   └── entry.service.ts         # HttpClient ラッパー（providedIn: 'root'）
└── features/
    ├── entry/                   # 絶望度入力フォーム
    │   ├── entry.routes.ts
    │   └── components/entry-form/
    │       ├── entry-form.ts    # ReactiveForm + MatSelect
    │       ├── entry-form.html
    │       └── entry-form.scss
    └── dashboard/               # Chart.js 折れ線グラフ
        ├── dashboard.routes.ts
        └── components/despair-chart/
            ├── despair-chart.ts  # Chart.js line chart + メンバーフィルタ
            ├── despair-chart.html
            └── despair-chart.scss
```

### Chart.js 設定

- タイプ: `line`（折れ線グラフ）
- X軸: 記録日時
- Y軸: 絶望度（1〜10固定）
- メンバー別に色分けしたデータセット
- `spanGaps: true` で欠損値をスキップ

---

## 主要設計判断

| 判断 | 理由 |
|------|------|
| Flyway マイグレーション | `ddl-auto: create` より再現性・安全性が高い |
| Java record for DTO/Command | 不変・簡潔・Java 21 のベストプラクティス |
| `EntryRepository` をドメイン層に | DIP（依存性逆転）でインフラに依存しないドメイン |
| `member_name` を非正規化 | MVP スコープ。別テーブルは Phase 2 |
| Angular Standalone Components | Angular 19+ の標準。NgModule 不要で簡潔 |
| Lazy Loading via routes | LIFT 原則の確立と初期バンドル軽量化 |
| `@CrossOrigin` on Controller | MVP ローカル開発の簡略化（本番は Spring Security CORS Bean） |
| `DESPAIR_LEVEL` 定数 | マジックナンバー禁止規約の遵守 |

---

## 起動手順

```bash
# 1. DB起動
docker-compose up -d
docker exec -it moetoku-db psql -U moetoku -d moetoku -c "\dt"

# 2. バックエンド起動
cd backend && ./gradlew bootRun

# 3. API テスト
curl -X POST http://localhost:8080/api/entries \
  -H "Content-Type: application/json" \
  -d '{"memberName":"田中","level":8,"comment":"最悪のデプロイ"}'

curl http://localhost:8080/api/entries?memberName=田中

# 4. フロントエンド起動
cd frontend && npm start
# → http://localhost:4200/entry    絶望度入力フォーム
# → http://localhost:4200/dashboard グラフ表示
```
