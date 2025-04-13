# ToDoApp

## docker 操作
初回起動時または、docker関連ファイルの変更時<br />
docker compose up --build -d<br />
でコンテナイメージの作成および、コンテナの起動

コンテナの停止および削除<br />
docker compose down<br />

コンテナの停止<br />
docker compose stop<br />

通常のコンテナの起動<br />
docker compose start

## 開発時の操作
1. 上記の docker 操作を参考に コンテナを起動する
2. npm run dev をターミナルで実行し、port番号3000 に接続する