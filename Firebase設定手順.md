> 2026-09-26更新：公開版は自動同期に対応しました。同じ本人Googleアカウントでログインすると、追加問題集と学習履歴を自動で引き継ぎます。端末を替える前に「同期済み」を確認してください。旧版の「クラウドへ保存／読込」は「今すぐ同期／クラウドから同期」に変更され、どちらも両端末の記録を統合します。保存・読込の手操作は通常不要です。GitHub Pagesの公開URLは https://kazuho0414.github.io/spark-study/ です。今回の更新でFirebase側の再設定は不要です。

# 一人用Googleログイン・クラウド保存

接続先プロジェクトは spark-study-812e6、保存先はFirestore東京リージョンです。Googleログインと kazuho0414.github.io の承認済みドメインを設定しました。公開設定は ownerEmailSha256 で本人メールを照合します。メール本文はFirebase側のルールで照合し、GitHub公開ファイルには含めません。以下は再設定する際の参考手順です。

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

- 同じ本人Googleアカウントでログインすると、問題集・履歴を自動同期します。認証状態は次回アクセス時も復元します。
- 回答後・画面復帰時・表示中30秒ごとに同期し、「同期済み」と表示します。ログイン直後は同期完了を待ってください。
- 通信できない間も端末に保存します。オンライン復帰後に再試行します。ブラウザを閉じる前は同期済み表示を確認してください。
- 「今すぐ同期」は手動再試行用です。「クラウドから同期」も片側を消さずに統合します。
- 同一演習の回答が衝突すると、別端末の途中セッションとして両方を残します。メモ等の同時変更はこの端末を優先し、元の両方の状態は同期前バックアップに残します。
- 「同期前のバックアップを保存」からJSONを取り出せます。「全体バックアップを統合」はそのlocal（端末側）を復元します。remote（クラウド側）を復元したい場合は、そのオブジェクトを別JSONに保存して取り込みます。
- 同じブラウザで学習タブを複数同時に使わないでください。更新後は各端末でページを再読み込みし、旧版ページを閉じてください。
- ログアウトしても端末記録は残ります。クラウド全体は最大約500万UTF-16文字、端末側はブラウザの容量にも依存します。上限・通信失敗時はエラーを表示し、既存データを保持します。
- 定期的に「全問題集・記録をバックアップ」でJSONを保存できます。

Firebaseの利用量はConsoleで確認できます。スマートフォン実機での確認は利用端末から行ってください。

公式資料：
- https://firebase.google.com/docs/auth/web/google-signin
- https://firebase.google.com/docs/hosting/quickstart
- https://firebase.google.com/docs/firestore/security/rules-conditions
- https://firebase.google.com/docs/firestore/manage-data/transactions
