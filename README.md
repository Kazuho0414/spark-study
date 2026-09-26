# Spark 合格演習室

独自作成のSpark認定試験対策教材。模試180問・類題24問・補強42問。

## GitHub Pages

このフォルダーの**中身**をリポジトリのルートへアップロードします。
Settings → Pages → Deploy from a branch → main / (root) → Save。
公開後のURLは `https://ユーザー名.github.io/リポジトリ名/` です。
ZIPファイル自体をアップロードしてもサイトにはなりません。

## Googleログインと保存

接続先は Firebase spark-study-812e6 です。端末内へ自動保存し、クラウドは保存・読込ボタンで操作します。
GoogleログインとFirestoreの本人専用ルールを設定して利用します。以下は再設定する場合の手順です。

1. `firebase-config.js` の公開設定を入力します。現在は本人メールのSHA-256ハッシュで照合する設定です。
2. Firebase AuthenticationでGoogleを有効にします。
3. Authentication → Settings → Authorized domains に `ユーザー名.github.io` を追加します。
   `https://`・リポジトリ名・末尾の `/` は入れません。
4. `authDomain` はFirebaseから取得した `プロジェクトID.firebaseapp.com` 等を維持します。
   GitHub Pagesのドメインに書き換えないでください。
5. ローカルの `outputs/new-bank/firestore.rules` に本人メールを設定し、Firestoreのルール画面で公開します。
6. 設定済みファイルを再アップロードし、公開サイトでログイン・保存・別端末の読込を確認します。

クラウドはボタンによる保存・読込です。端末を替える前に保存し、次の端末で読込します。
ログアウトしても端末の記録は残ります。
教材・問題データは公開されます。本人限定なのはFirestoreに保存する学習記録です。
ブラウザの学習記録JSON・元のCSV・秘密鍵をこのリポジトリへ追加する必要はありません。

## 以前の学習記録を引き継ぐ

ローカルHTMLと公開URLのブラウザ保存は別です。
旧ページの「記録」でJSONを書き出し、公開ページの「記録」で読み込んでください。
スマートフォンにも移す場合は、PCの公開ページからクラウドへ保存します。

## 教材を更新する

問題の更新は元の作業フォルダーで行い、`prepare_github_pages.py` を再実行して
この公開用フォルダーを作り直します。公開先を同じURLに保つと端末内の記録を引き継げます。
同じGitHub Pagesドメインに複数の演習室を設置すると、ブラウザ保存キーが共通になります。
この演習室は1サイトとして使ってください。

公式手順：
- https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
- https://firebase.google.com/docs/auth/web/google-signin
