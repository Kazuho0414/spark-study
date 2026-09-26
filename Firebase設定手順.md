# 一人用Googleログイン・クラウド保存

現在はFirebase未設定です。従来通り端末内で学習できます。クラウドの実接続には、以下の初回設定が必要です。

## 1. Firebaseを作る

1. https://console.firebase.google.com/ に本人のGoogleアカウントで入り、プロジェクトを作成します。Google Analyticsはこの教材には不要です。
2. プロジェクト設定でWebアプリ（`</>`）を追加します。表示されるfirebaseConfigから `apiKey`・`authDomain`・`projectId`・`appId` を `firebase-config.js` に転記します。
3. `ownerEmail` に利用するGoogleアカウントのメールアドレスを入力します。
4. Authentication → Sign-in methodでGoogleを有効にし、サポートメールを指定します。
5. Firestore Databaseを作成します。セキュリティルールは本番モードから始めます。
6. `firestore.rules` 内の `REPLACE_WITH_YOUR_GOOGLE_EMAIL` を本人のメールアドレスに置換し、Firestoreの「ルール」タブに全文を貼って公開します。大文字・小文字を含め実際のメールアドレスに合わせてください。

公開設定のapiKeyはクライアント用設定です。サービスアカウント秘密鍵を置く必要はありません。本人以外のデータアクセスはFirestoreルールで拒否します。フロント画面のメール確認だけに依存しません。

## 2. スマートフォン用URLを作る

Firebase Hostingを利用する場合は、PCにNode.jsとFirebase CLIを用意し、Firebaseにログインします。

```powershell
npm install -g firebase-tools
firebase login
```

この作業フォルダーの `prepare_firebase_hosting.py` を実行すると、公開対象だけを入れた `outputs/firebase-site/public` と設定ファイルができます。Firebase設定とルールを編集した後に実行してください。

```powershell
python prepare_firebase_hosting.py
cd outputs/firebase-site
firebase use --add
firebase deploy --only hosting,firestore:rules
```

`firebase use --add` で作成したプロジェクトを選択します。デプロイするとインターネットに公開されます。ここまでの処理は自動実行していません。

Authentication → Settings → Authorized domainsに公開先ドメインが登録されていることを確認します。ローカルで認証を試す場合はlocalhostも追加します。HTMLをダブルクリックする `file://` ではGoogleログインはできません。スマホでは公開されたHTTPSのURLを開き、ポップアップを許可して本人アカウントでログインしてください。

**認証で保護するのはクラウドの学習記録です。教材ページ・問題データ自体は公開URLから閲覧できます。** 教材自体を非公開にしたい場合は、別途サイト全体のアクセス制限が必要です。

## 3. 普段の使い方

- 「ログイン・クラウド保存」を開いてGoogleでログインします。
- 初回は元のPCで「クラウドへ保存」。次にスマホでログインして「クラウドから読込」を押します。
- 学習中は端末内に自動保存します。端末を替える前に「クラウドへ保存」、次の端末で「クラウドから読込」を押します。クラウドへの自動同期ではありません。
- 保存内容：回答履歴、途中のセッションと選択肢順、自信度、誤答原因、メモ、復習フラグ、実習進捗、設定。復習予定や分析は履歴から再計算します。
- 読込前に、端末の記録をJSONで書き出し、ブラウザ内にも直前1件のバックアップを残します。ダウンロードが抑止された場合は「読込前のバックアップを保存」を使って取り出せます。
- 競合が出たときはクラウドを読み込み、必要なら書き出したJSONを「記録」で統合してから再度保存します。同一セッション・同一履歴の編集差分は自動統合されません。元のJSONを残して内容を確認してください。
- 同じブラウザで学習タブを複数同時に使わないでください。PCとスマホの教材・追加問題ファイルは同じ版に揃えてください。
- 通信失敗・ログアウトでも端末記録は残ります。ログアウトは端末記録の削除ではありません。
- クラウド保存は最大500万UTF-16文字（境界処理によりわずかに小さくなる場合あり）。超えた場合はエラー表示し、既存クラウド記録を保持します。履歴は定期的にJSONでも保存してください。

実接続後は、本人の保存→別端末の読込、ログアウト時のアクセス拒否、他アカウントの拒否を確認してください。Firebaseの利用量はConsoleで確認できます。

公式資料：
- https://firebase.google.com/docs/auth/web/google-signin
- https://firebase.google.com/docs/hosting/quickstart
- https://firebase.google.com/docs/firestore/security/rules-conditions
- https://firebase.google.com/docs/firestore/manage-data/transactions
