/* Japanese study feedback. Stable question IDs; option arrays use canonical order. */
const SPARK_FEEDBACK_JA = {
  "PASTED-SPARK-20261024-001": {
    "stem": "複数のDataFrame変換とアクションを実行するアプリで、SparkSessionの管理による無駄を減らしたい。最適な管理方法はどれか。",
    "options": [
      "各アクション後に停止して再作成する",
      "SparkSessionを使わずSparkContextだけに頼る",
      "変換のたびに新しいSparkSessionを作る",
      "1つのSparkSessionをアプリ全体で再利用する"
    ],
    "explanation": "セッションは処理の入口です。通常はアプリ内で再利用し、変換やアクションのたびに作り直しません。試験では「再利用」と「処理のたびに再作成」を区別します。",
    "reasons": [
      "再作成の手間が増え、処理途中の管理も複雑になります。",
      "DataFrameやSQLの共通の入口はSparkSessionです。",
      "変換の定義ごとにセッションを分ける必要はありません。",
      "アプリ内の一連の処理で同じ入口を再利用する方法です。"
    ]
  },
  "PASTED-SPARK-20261024-002": {
    "stem": "num_dfには0〜4のnum列があり、cubefunc(val)はvalの3乗を返す。このPython関数をSpark SQLのUDFとして登録し、num_dfへ適用するコードはどれか。",
    "options": [
      "IntegerTypeでcubeudfをSQL登録し、selectExprで呼ぶ",
      "udf(cubefunc)を作り、selectのColumn式で呼ぶ",
      "DoubleTypeでSQL登録し、selectExprで呼ぶ",
      "Python変数cubeudfを作るだけでselectExprから呼ぶ"
    ],
    "explanation": "SQLの文字列式から関数名で呼ぶにはspark.udf.registerが必要です。この関数は整数を返すため、戻り値の宣言もIntegerTypeに合わせます。",
    "reasons": [
      "SQL名の登録と、整数の戻り値型の両方を満たします。",
      "DataFrameのUDF呼出しですが、SQL名を登録していません。",
      "Pythonの整数を返す関数とDoubleTypeの宣言が一致しません。",
      "Python変数に代入しただけではSQLの関数名になりません。"
    ]
  },
  "PASTED-SPARK-20261024-003": {
    "stem": "events_parquetのパスにあるParquetデータのスキーマを確認するコードはどれか。",
    "options": [
      "パスをテーブル名としてSQLで読みprintSchemaする",
      "parquet.の後にパスをバッククォートで囲んで読みprintSchemaする",
      "パスをテーブル名として読みshowする",
      "Parquetのパスを直接SQLで読みshowする"
    ],
    "explanation": "ファイルをSQLで直接参照する構文は「形式.`パス`」です。列名・型を確認するならprintSchema、データ行を見るならshowを使います。",
    "reasons": [
      "通常のテーブル参照となり、Parquetのパスを直接指定する構文ではありません。",
      "ファイル形式・パスの指定とスキーマ表示が両方正しいコードです。",
      "ファイル指定が不適切で、showもスキーマ表示ではありません。",
      "読込み方は正しくても、showはデータ行を表示します。"
    ]
  },
  "PASTED-SPARK-20261024-004": {
    "stem": "DataFrameをSQLから参照したい。ビューの有効範囲を現在のSparkSessionに限定し、同名ビューがすでにあっても置き換えたい。使うメソッドはどれか。",
    "options": [
      "createTempViewで作成する",
      "registerTempTableで登録する",
      "createGlobalTempViewで作成する",
      "createOrReplaceTempViewで作成する"
    ],
    "explanation": "「現在のセッションだけ」はTempView、「同名があれば置換」はOrReplaceが目印です。ただし一時ビューの有効範囲は、機密データのアクセス権設定そのものではありません。",
    "reasons": [
      "同名のビューがすでにあると、置換せずエラーになります。",
      "古いAPIであり、指定された現行の作成・置換APIを選ぶ問題には適しません。",
      "global一時ビューはSparkアプリ内の別セッションからも参照できます。",
      "セッション限定の一時ビューを作成し、同名なら置き換えます。"
    ]
  },
  "PASTED-SPARK-20261024-005": {
    "stem": "提示コードはdf1とbroadcast(df2)を結合し、続いてその結果とbroadcast(df3)を結合する。両方の結合キーはidである。実行結果はどうなるか。",
    "options": [
      "1クエリでbroadcast joinを複数使えないため失敗する",
      "2回目はdf1.idを使う必要があるため失敗する",
      "正常に実行され、df2・df3を使う2回のbroadcast joinになる",
      "broadcastは結合前に別々に実行しないとエラーになる"
    ],
    "explanation": "broadcast joinは複数つなげられます。最初の結果にはdf2の列参照も含まれるため、提示された2回目の結合条件を使えます。",
    "reasons": [
      "broadcast joinを1回に制限するルールはありません。",
      "この例ではdf2.idも最初の結合結果に含まれ、条件に使えます。",
      "それぞれの小さい側にbroadcastのヒントを付けています。",
      "joinの引数内でbroadcast(df)を使う書き方が有効です。"
    ]
  },
  "PASTED-SPARK-20261024-006": {
    "stem": "テキストを読み込み、不正行をfilterで除外し、特定列でgroupByした結果をテーブルへ書き込む。Sparkの実行方法を最も適切に説明するものはどれか。",
    "options": [
      "最初に全データをメモリへ載せ、filter・groupByを実行する",
      "filterをアクション、groupByを変換として実行する",
      "filterとgroupByを1つの同種の変換として扱う",
      "filterはnarrow変換、groupBy集約はshuffleを伴うwide変換になる"
    ],
    "explanation": "filterは各パーティション内で処理できます。groupBy集約では同じキーの行を集めるため通常shuffleが必要です。計算は遅延され、書込みなどのアクションで実行します。",
    "reasons": [
      "全データを最初にメモリへ載せる必要はありません。",
      "filterはアクションではなく変換です。",
      "遅延評価の説明だけでは、narrowとwideの違いを説明できません。",
      "行の絞込みとキー集約で、データ移動の有無が異なります。"
    ]
  },
  "PASTED-SPARK-20261024-007": {
    "stem": "EC企業が1日2TBの取引を処理し、不正検知や商品推薦に使いたい。従来のRDBではデータ量と処理速度に対応できない。最も直接役立つSparkの特徴はどれか。",
    "options": [
      "小規模データを効率よく処理できること",
      "構造化データへSQLを実行できること",
      "メモリを活用した計算と並列処理を組み合わせられること",
      "機械学習ライブラリが組み込まれていること"
    ],
    "explanation": "この問題の中心は、大量のデータを短時間で処理する能力です。Sparkは複数マシンの並列性とメモリの活用で対応します。全データが必ずメモリに収まるという意味ではありません。",
    "reasons": [
      "課題は小規模データではなく、日次2TBの処理です。",
      "SQLの有無だけでは、処理量と速度の課題を説明しきれません。",
      "データ量と計算負荷を分散できる点が要件に直結します。",
      "推薦には役立ちますが、大量データ処理の基盤となる特徴を問う問題です。"
    ]
  },
  "PASTED-SPARK-20261024-008": {
    "stem": "テーブルを保存するときにデータをpartitioningする主な利点は何か。",
    "options": [
      "使っていないパーティションを自動削除する",
      "保存データを圧縮する",
      "条件に合うパーティションだけ読み、読込み量を減らす",
      "すべてのデータを一度にメモリへ読み込むことを保証する"
    ],
    "explanation": "保存時のpartitioningは、パーティション列への絞込みで不要な場所を読み飛ばすために使います。この仕組みがpartition pruningです。",
    "reasons": [
      "partitioning自体は不要データを自動削除しません。",
      "圧縮方式の設定と、ディレクトリを分けるpartitioningは別です。",
      "必要な範囲だけを読むことでI/Oを減らせます。",
      "全件をメモリに載せる保証はなく、むしろ不要な読込みを避けます。"
    ]
  },
  "PASTED-SPARK-20261024-009": {
    "stem": "Spark Connectへの移行を検討している。採用を妨げる要件はどれか。",
    "options": [
      "アプリのコードを対話的にデバッグできること",
      "アプリや依存ライブラリを他アプリ・driverから分離できること",
      "RDD APIを含む全既存コードを、変更せずそのまま移行できること",
      "アプリとSpark driverを別々に更新できること"
    ],
    "explanation": "Spark Connectはクライアントとサーバーを分離しますが、従来の全APIをそのまま使える仕組みではありません。RDDやSparkContextへの直接依存は移行時の確認ポイントです。",
    "reasons": [
      "クライアント側の開発・デバッグはConnectの利点です。",
      "クライアント環境の分離はConnectの設計に合います。",
      "RDD APIなどは非対応のため、無変更で全コードを移せる要件は満たせません。",
      "クライアントとサーバーの分離は更新の独立性に役立ちます。"
    ]
  },
  "PASTED-SPARK-20261024-010": {
    "stem": "Sparkで割り当てられたタスクを実際に実行するコンポーネントはどれか。",
    "options": [
      "CPUコア",
      "driverノード",
      "workerノード",
      "executor"
    ],
    "explanation": "役割は「driverが調整、executorが実行」です。workerはexecutorを置くマシン、CPUコアは同時実行能力であり、タスクを実行するSparkのプロセス名はexecutorです。",
    "reasons": [
      "計算資源ですが、Sparkの実行プロセスの名称ではありません。",
      "driverは実行計画やスケジューリングを担当します。",
      "workerはexecutorが動くホストです。",
      "タスクを実行し、データを保持するプロセスです。"
    ]
  },
  "PASTED-SPARK-20261024-011": {
    "stem": "au_dfにだけ1列多く、他の列名と型はnz_dfと一致する。au_df.union(nz_df)は列数の不一致で失敗した。行を縦に追加し、不足列を補って結合するにはどう変えるか。",
    "options": [
      "unionByName(..., allowMissingColumns=False)",
      "unionAll(...)",
      "unionByName(..., allowMissingColumns=True)",
      "full_outer joinを使う"
    ],
    "explanation": "unionByNameは列名で対応させます。allowMissingColumns=Trueを加えると、片側にない列をNULLで補い、列数が違っても行を追加できます。",
    "reasons": [
      "不足列を許可しないため、今回の不一致を解消できません。",
      "unionと同様、列数を一致させる必要があります。",
      "列名を合わせ、不足列をNULLで補う指定です。",
      "joinはキーで横に結合する操作で、行を縦に追加するunionとは異なります。"
    ]
  },
  "PASTED-SPARK-20261024-012": {
    "stem": "ネットワークのheartbeat応答が遅く、正常なexecutorがlostと判断される。資源不足の警告は解消済みで、正常応答が現在のtimeoutより遅れることも確認済み。どの対応が適切か。",
    "options": [
      "executorメモリを増やす",
      "spark.network.timeoutを診断済みの遅延に合わせる",
      "executorの台数を増やす",
      "パーティションを小さくする"
    ],
    "explanation": "原因がネットワーク・heartbeatの遅延と分かっているので、その待ち時間の設定を調整します。network.timeoutは、長いタスクの実行時間を一律に制限する設定ではありません。",
    "reasons": [
      "今回確認された原因はメモリ不足ではありません。",
      "正常なexecutorを早過ぎるtimeoutで切り離すことを防ぎます。",
      "正常なexecutorをlostと誤認する根本原因は残ります。",
      "パーティションのサイズ変更はheartbeat待機時間の直接の修正ではありません。"
    ]
  },
  "PASTED-SPARK-20261024-013": {
    "stem": "employees_dfにsalaryの10%であるtax列を追加し、不要なage列を削除したい。正しいコードはどれか。",
    "options": [
      "salary×10をwithColumnで追加し、dropFieldでageを削除する",
      "salary×0.1をwithColumnで追加し、dropでageを削除する",
      "lit(0.1)×salaryを追加し、dropFieldでageを削除する",
      "salary×10を追加し、dropでageを削除する"
    ],
    "explanation": "10%は0.1倍です。列の追加・置換はwithColumn、DataFrameの列削除はdropを使います。計算式と削除APIを両方確認してください。",
    "reasons": [
      "10倍になっており、DataFrameのdropFieldも不適切です。",
      "計算が10%で、列削除のメソッドも正しい組合せです。",
      "計算式は正しいですが、列削除はdropを使います。",
      "dropは正しくても、税額の計算が100倍大きくなります。"
    ]
  },
  "PASTED-SPARK-20261024-014": {
    "stem": "UTCで取り込んだrawのtransaction_datetime列を、America/New_Yorkの時刻表現へ変換してレポートに使いたい。どのコードを使うか。",
    "options": [
      "from_utc_timestampで列とAmerica/New_Yorkを指定する",
      "date_formatの書式としてAmerica/New_Yorkを指定する",
      "to_utc_timestampでAmerica/New_Yorkを指定する",
      "from_utc_timestampに列だけを渡す"
    ],
    "explanation": "方向がポイントです。UTCから指定地域へはfrom_utc_timestamp、指定地域からUTCへはto_utc_timestampを使います。表示書式の変更とタイムゾーン変換も区別します。",
    "reasons": [
      "UTCを起点として指定したタイムゾーンへ変換します。",
      "date_formatは日時の書式を整える関数で、地域名を渡して時差を変換するものではありません。",
      "指定地域からUTCへ向かう、逆方向の変換です。",
      "変換先のタイムゾーン引数が不足しています。"
    ]
  },
  "PASTED-SPARK-20261024-015": {
    "stem": "1台のメモリに収まらない大規模データを、通常の単一マシンPythonではなくSparkで処理する。Sparkが提供する利点を2つ選べ。",
    "options": [
      "処理を自動管理するためコードを書く必要がなくなる",
      "ノード障害から回復する耐障害性がある",
      "ディスクだけで計算し、メモリを使わない",
      "計算を複数マシンへ分散し、水平拡張できる",
      "専用ハードウェアが必須で、汎用マシンを使えない"
    ],
    "explanation": "大規模データへの対応力は「複数マシンへの分散」と「障害時の再計算」です。Sparkを使うだけでコードやデータ設計が不要になるわけではありません。",
    "reasons": [
      "処理内容を定義するコードや設定は引き続き必要です。",
      "失われた計算結果を再計算するなどの回復機構があります。",
      "Sparkはメモリもディスクも活用します。",
      "1台の限界を超えて計算資源を増やせます。",
      "汎用ハードウェアのクラスターでも動作します。"
    ]
  },
  "PASTED-SPARK-20261024-016": {
    "stem": "SparkのDAGは、実行の階層をどのように表すか。",
    "options": [
      "stageやtaskを使わず、独立した複数jobだけを表す",
      "jobを依存するstageに分け、stageを並列taskに分ける",
      "taskをjobとし、その中に複数applicationを含める",
      "stageやjobを考えず、最後のtaskだけを表す"
    ],
    "explanation": "実行の基本階層はapplication → job → stage → taskです。shuffleなどがstageの境界となり、各stageではパーティションごとのtaskを実行します。",
    "reasons": [
      "jobの内部もstage・taskに分解されます。",
      "依存関係と、stage内の並列実行の両方を説明しています。",
      "階層の大小関係が逆です。",
      "最終taskだけでは、実行の依存関係を表せません。"
    ]
  },
  "PASTED-SPARK-20261024-017": {
    "stem": "20億行・10パーティションのdfから、user_idの近似ユニーク数とtransaction_amountの平均を、1つの集約処理で求めたい。適切なコードはどれか。",
    "options": [
      "同じaggでapprox_count_distinctとavgを使う",
      "同じaggでcountDistinctとavgを使う",
      "SQLのCOUNT(DISTINCT ...)とAVGを使う",
      "distinct().count()と平均の集約を別々に実行する"
    ],
    "explanation": "要件は「近似」と「1つの集約」です。approx_count_distinctとavgを同じaggへ渡します。列の別名にapproxと書くだけでは、厳密集計が近似にはなりません。",
    "reasons": [
      "近似関数と平均関数を、同じ集約にまとめています。",
      "countDistinctは厳密なユニーク数で、近似という要件と異なります。",
      "COUNT(DISTINCT ...)も厳密集計です。",
      "近似ではなく、計算も別々の処理になっています。"
    ]
  },
  "PASTED-SPARK-20261024-018": {
    "stem": "df_epoch_timeのepoch_time列は、1970年1月1日UTCからの秒数を持つ。そこから月を取り出し、month列を追加するにはどのコードを使うか。",
    "options": [
      "from_unixtime後の文字列の4文字目から2文字を取る",
      "from_unixtimeで日時にし、monthで月を取る",
      "epoch_timeへ直接monthを適用する",
      "epoch_timeの6文字目から2文字を取る"
    ],
    "explanation": "まずUNIX秒を日時として解釈し、それから月を抽出します。文字の位置で取り出す方法よりも、日時専用の関数を使うことが判断の要点です。",
    "reasons": [
      "標準の日時文字列で、この文字位置は月を指しません。",
      "UNIX秒から日時への変換と、月の抽出を順に行います。",
      "UNIX秒の数値を、日時として変換せず渡しています。",
      "秒数の桁位置と月の値には対応関係がありません。"
    ]
  },
  "PASTED-SPARK-20261024-019": {
    "stem": "Parquetファイルにはname列とaddress列があり、どちらもString型で保存されている。spark.read.parquetで読み込んだDataFrameのスキーマはどうなるか。",
    "options": [
      "nameとaddressが、どちらもString型になる",
      "c0というString列だけになる",
      "NameとAddressという大文字始まりのString列になる",
      "c0とc2というString列になる"
    ],
    "explanation": "Parquetは列名と型をファイルに保存する形式です。読込み時にはそのスキーマが使われるため、元のname・addressがString型で復元されます。",
    "reasons": [
      "保存済みの列名と型がそのまま読み取られます。",
      "列を1つにまとめたり、自動でc0へ改名したりしません。",
      "読込みによって列名の先頭を大文字には変えません。",
      "ヘッダーなしCSVのような自動列名にはなりません。"
    ]
  },
  "PASTED-SPARK-20261024-020": {
    "stem": "本番Sparkアプリで、資源消費を減らすためにHistory Serverの停止を検討している。主に何が影響を受けるか。",
    "options": [
      "長時間jobのdriverログが蓄積されなくなる",
      "ログの負荷が減ってjobが速くなる",
      "完了済みアプリの実行情報を画面で確認しにくくなる",
      "ログサイズが減ってexecutorの実行性能が上がる"
    ],
    "explanation": "History Serverはevent logを読み、終了したアプリの実行情報を表示します。停止で失うのはその閲覧手段であり、保存済みevent logそのものが自動削除されるわけではありません。",
    "reasons": [
      "driverログの生成や蓄積を止める機能ではありません。",
      "実行中のjobを直接高速化する仕組みではありません。",
      "過去の実行を調査・デバッグするための画面が使えなくなります。",
      "History Serverの停止でexecutorのログが小さくなるわけではありません。"
    ]
  },
  "PASTED-SPARK-20261024-021": {
    "stem": "数百万行のsales_dataを地域別に売上合計したい。読みやすさと保守性のためSpark SQLを使うには、どの手順が適切か。",
    "options": [
      "DataFrameのgroupByとaggを直接使う",
      "CSVへ出して別のRDBでSQLを実行する",
      "一時ビューとして登録してからSpark SQLで集約する",
      "pandasへ変換し、SQL風の操作で集約する"
    ],
    "explanation": "DataFrameをSQLのFROM句から参照するには、一時ビュー名を付けます。データを外部DBやdriverのpandasへ移す必要はありません。",
    "reasons": [
      "計算は可能ですが、SQLを使うという要件を満たしません。",
      "不要な書出しと外部DBへの移動が発生します。",
      "ビュー名でDataFrameを参照し、SQLのGROUP BYを使えます。",
      "全件をdriverへ集める負荷があり、Spark SQLでもありません。"
    ]
  },
  "PASTED-SPARK-20261024-022": {
    "stem": "Structured StreamingでファイルソースをAvailableNowで処理する。1回のmicro-batchへ入れる量を制御する入力ソースのoptionはどれか。",
    "options": [
      "maxExecutorsPerTrigger",
      "maxCoresPerTrigger",
      "maxBytesPerTrigger",
      "maxFilesPerTrigger"
    ],
    "explanation": "ファイルソースではmaxFilesPerTriggerで、1回に取り込む新規ファイル数を制限します。AvailableNowでも複数バッチに分割して処理できます。",
    "reasons": [
      "ファイル数を制御する標準optionではありません。",
      "CPUコア数で入力ファイル量を制限するoptionではありません。",
      "Spark 3.5のこのファイルソースで使う指定ではありません。",
      "トリガー当たりのファイル数を制限する指定です。"
    ]
  },
  "PASTED-SPARK-20261024-023": {
    "stem": "異なる2つのDataFrameをcreateOrReplaceTempViewで、同じmyViewという名前に順番に登録するとどうなるか。",
    "options": [
      "同名のまま両方を同時に参照できる",
      "2つが自動的にマージされる",
      "同名ビューの重複エラーになる",
      "後から登録したDataFrameで既存ビューが置き換わる"
    ],
    "explanation": "OrReplaceは「存在していたら置き換える」です。データのunionやjoinではなく、ビュー名が指すDataFrameの定義を更新します。",
    "reasons": [
      "1つのビュー名が同時に2つの定義を持つことはありません。",
      "行や列を自動結合する操作ではありません。",
      "置換を許すAPIなので、同名という理由では失敗しません。",
      "新しいDataFrameがmyViewの参照先になります。"
    ]
  },
  "PASTED-SPARK-20261024-024": {
    "stem": "path/to/dataに保存済みのデータを、source_dataの内容で上書きしたい。パスへの上書きを正しく表すSpark SQLはどれか。",
    "options": [
      "INSERTの直後にパスを指定する",
      "INSERT OVERWRITE DIRECTORYにパスと形式を指定する",
      "INSERT OVERWRITEの後にDIRECTORYなしでパスを指定する",
      "OVERWRITEだけでSQLを始める"
    ],
    "explanation": "保存先がテーブル名ではなくディレクトリなので、INSERT OVERWRITE DIRECTORYを使います。OVERWRITEだけでなく、文全体の構文を確認する問題です。",
    "reasons": [
      "INSERTの直後にこの形でファイルパスは指定できません。",
      "ディレクトリへ指定形式で結果を書き、既存内容を置き換えます。",
      "ディレクトリへの書出しを表すDIRECTORYが不足しています。",
      "独立したOVERWRITE文という構文ではありません。"
    ]
  },
  "PASTED-SPARK-20261024-025": {
    "stem": "1台のメモリに収まらない大規模な構造化データに、複雑な集約や変換を行いたい。この用途に合うSparkのコンポーネントを2つ選べ。",
    "options": [
      "Structured Streaming",
      "Spark SQL",
      "DataFrames",
      "GraphX",
      "MLlib"
    ],
    "explanation": "構造化データのSQL処理はSpark SQL、列・行を扱う高水準APIはDataFrameです。データ量が大きくても、通常の構造化データ処理の入口は変わりません。",
    "reasons": [
      "継続到着するデータの処理用で、今回の要件にstreamingはありません。",
      "構造化データをSQLで集約・変換できます。",
      "列を持つ分散データを高水準APIで操作できます。",
      "グラフ処理向けのライブラリです。",
      "機械学習用で、通常の構造化データ集約そのものの選択肢ではありません。"
    ]
  },
  "PASTED-SPARK-20261024-026": {
    "stem": "以前より遅くなったjobを調べると、AQEがsort-merge joinをbroadcast joinへ変換しなくなり、shuffleが増えていた。最も考えやすい原因はどれか。",
    "options": [
      "小さい側のテーブルがbroadcast変換の閾値を超えた",
      "ANALYZE TABLEから時間がたち統計が古くなった",
      "Spark更新でAQEが無効になった",
      "結合キーの偏りが大きくなった"
    ],
    "explanation": "broadcastへ変えられるかは、小さい側の実行時サイズと閾値が重要です。データの増加で条件を超えると、AQEを有効にしたままでも変換しなくなります。",
    "reasons": [
      "broadcastに収まるという判断条件が失われたことを直接説明します。",
      "計画時の統計には影響しますが、AQEの実行時サイズ判定の説明としては弱い選択肢です。",
      "更新しただけで必ずAQEが無効になるとはいえません。",
      "偏りは性能に影響しますが、変換停止のサイズ条件とは別です。"
    ]
  },
  "PASTED-SPARK-20261024-027": {
    "stem": "不規則に届くストリームからorder_idで重複を除きたい。同じ注文の重複データが到着するイベント時刻の最大差は分かっている。遅延データを扱い、状態のメモリ使用も抑えるにはどうするか。",
    "options": [
      "最大時刻差より大きい遅延幅のwatermarkを設定し、order_idでdropDuplicatesWithinWatermarkする",
      "timestamp列でdropDuplicatesし最新の時刻を残す",
      "遅延到着があるstreamでは重複排除できない",
      "watermarkなしでorder_idのdropDuplicatesを使う"
    ],
    "explanation": "イベント時刻のwatermarkと業務キーを組み合わせ、重複を追跡する期間を制御します。重複排除は「最新行を必ず残す」操作ではありません。",
    "reasons": [
      "時刻差に十分な余裕を持たせ、watermark内で同じorder_idを重複排除できます。",
      "timestampの一致は注文IDの一致とは異なり、最新行を選ぶ保証もありません。",
      "watermarkなどを使って遅延と重複に対応できます。",
      "キーを追跡する状態が増え続けるおそれがあり、メモリを抑える条件に合いません。"
    ]
  },
  "PASTED-SPARK-20261024-028": {
    "stem": "employee.csvのID・Name・Salaryを、それぞれInteger・String・Float型として明示的に読み込みたい。正しいコードを2つ選べ。",
    "options": [
      "StructTypeのリスト構文を崩し、schemaを渡さずcsvを読む",
      "inferSchemaで型を自動推論する",
      "DDL文字列「ID INT, Name STRING, Salary FLOAT」をcsvのschemaに渡す",
      "3つのStructFieldを持つStructTypeをcsvのschemaに渡す"
    ],
    "explanation": "schemaはStructTypeでもDDL形式の文字列でも指定できます。「文字列は常に不可」ではありません。明示指定とinferSchemaによる推論を区別します。",
    "reasons": [
      "StructTypeの組立てが不正で、読込みにもschemaを渡していません。",
      "型を推論する方法であり、要求する3つの型の明示指定ではありません。",
      "指定された列名・型をDDL文字列で明示しています。",
      "同じスキーマをStructTypeで明示しています。"
    ]
  },
  "PASTED-SPARK-20261024-029": {
    "stem": "my_dfを偶数でfilterし、そのDataFrameをprintすると、行ではなくDataFrame[number: bigint]と表示された。なぜか。",
    "options": [
      "filterで即座に計算して該当行を返したため",
      "変換は遅延評価され、定義時には行の計算をしないため",
      "変換のたびに自動でactionが実行されるため",
      "filterがactionで、直ちに結果を返すため"
    ],
    "explanation": "filterは新しいDataFrameの計画を作ります。print(DataFrame)は行データの取得ではありません。行を見るにはshowやcollectなどのactionを使います。",
    "reasons": [
      "filterを定義しただけでは、結果行を取り出しません。",
      "表示されたのはDataFrameの表現で、フィルター結果の行ではありません。",
      "変換のたびにactionが自動追加されるわけではありません。",
      "filterはactionではなく変換です。"
    ]
  },
  "PASTED-SPARK-20261024-030": {
    "stem": "変換の実行をactionまで遅らせ、実行前に計画全体を最適化できるSparkの特徴はどれか。",
    "options": [
      "即時実行",
      "Catalystによる最適化を伴う遅延評価",
      "変換の事前キャッシュ",
      "変換の並列実行"
    ],
    "explanation": "遅延評価で処理をすぐ実行せず計画として蓄え、Catalystがその計画を最適化します。遅延は「処理が遅い」という意味ではありません。",
    "reasons": [
      "変換を直ちに実行する説明なので逆です。",
      "実行のタイミングと計画最適化の両方を表しています。",
      "明示的なcacheと遅延評価は別の仕組みです。",
      "並列実行は速度に関係しますが、actionまで実行を遅らせる理由ではありません。"
    ]
  },
  "PASTED-SPARK-20261024-031": {
    "stem": "Sparkのclient modeを正しく説明するものを2つ選べ。",
    "options": [
      "クライアントがworkerへ直接taskを送る",
      "driverがclientマシンで動き、ネットワーク遅延の影響を受け得る",
      "driverがcluster manager上で動く",
      "driverがアプリ送信元で動き、デバッグしやすいが資源の制約を受け得る"
    ],
    "explanation": "client/clusterの区別は、driverがどこで動くかです。client modeでは送信元のプロセス側でdriverが動くため、そのマシンの資源と通信条件が重要になります。",
    "reasons": [
      "executorへのtask送信はdriverの役割で、clientがdriverを飛ばす方式ではありません。",
      "driverが送信元側にあるため、クラスターとの通信が影響することがあります。",
      "client modeのdriver配置を取り違えています。",
      "配置場所と、その利点・制約を正しく説明しています。"
    ]
  },
  "PASTED-SPARK-20261024-032": {
    "stem": "dfのsalary列にあるNULLをすべて0へ置き換えるコードはどれか。",
    "options": [
      "df.fillna(\"salary\", 0)",
      "df.replaceNulls(\"salary\", 0)",
      "df.dropna(subset=[\"salary\"])",
      "df.fillna({\"salary\": 0})"
    ],
    "explanation": "fillnaへ辞書を渡すと、列名と置換値を対応付けられます。NULLを置換する操作と、NULLを持つ行を削除する操作を区別します。",
    "reasons": [
      "fillnaの引数の役割と順序が合っていません。",
      "この名前の標準DataFrameメソッドはありません。",
      "NULLを0にせず、その行自体を削除します。",
      "salary列だけを指定してNULLを0へ置き換えます。"
    ]
  },
  "PASTED-SPARK-20261024-033": {
    "stem": "約5万行・20MBの単一CSVから日次売上を集計し、レポートを作る。最も適切な方法はどれか。",
    "options": [
      "Spark Streamingのリアルタイム処理を構築する",
      "ローカルPythonとpandasで分析する",
      "分散Sparkクラスターを構築する",
      "HDFSとMapReduceを構築する"
    ],
    "explanation": "1台で十分扱える小規模なバッチ処理です。分散処理の起動や運用の費用より、ローカルpandasの単純さが有利な場面です。",
    "reasons": [
      "リアルタイム到着の要件がなく、構成が過剰です。",
      "この規模なら通常は1台で扱え、手順も簡潔です。",
      "処理は可能ですが、クラスターの準備や実行の負担が大きくなります。",
      "このデータ量に対して運用が複雑になります。"
    ]
  },
  "PASTED-SPARK-20261024-034": {
    "stem": "読込み→filter→大きなDataFrameとのjoin→groupBy/agg→書込み、という処理の実行階層について正しい説明を2つ選べ。",
    "options": [
      "groupBy/aggのshuffleでstageが増えることがある",
      "アプリ全体が必ず書込みで起動する1つのjobになる",
      "DataFrameの最適化ですべてのshuffleがなくなる",
      "joinでshuffleが発生しstageが分かれることがある",
      "filterもjoinもnarrowなので必ず同じstageになる"
    ],
    "explanation": "キーごとにデータを集めるjoinや集約は、shuffleとstage境界を生む可能性があります。最適化やAQEもあるため、アプリ全体のjob数を一律に決め付けないことが大切です。",
    "reasons": [
      "集約のための再分散がstage境界になり得ます。",
      "1つのactionが見えても、アプリ全体のjob数を常に1とは保証できません。",
      "必要な再分散まで、すべて除去できるわけではありません。",
      "特に大きい側同士のjoinでは再分散が必要になり得ます。",
      "joinは常にnarrowという前提が誤りです。"
    ]
  },
  "PASTED-SPARK-20261024-035": {
    "stem": "DataFrameのパーティションを100へ減らすとき、coalesceとrepartitionはどう違うか。",
    "options": [
      "coalesceは既存をまとめ、repartitionは全体をshuffleする",
      "どちらも均等になるよう全体をshuffleする",
      "どちらも分割を変更せず、同じ量のメモリを使う",
      "coalesceが全体をshuffleし、repartitionは少ない移動で減らす"
    ],
    "explanation": "coalesceはshuffleを避けて減らせますが、偏りが残ることがあります。repartitionはshuffleで再分配するため、その費用と分散の改善を引き換えにします。",
    "reasons": [
      "移動を抑えて減らす操作と、再分散する操作の違いを説明しています。",
      "coalesceは通常、全体のshuffleを行いません。",
      "どちらもパーティション数を変える操作です。",
      "2つの役割が逆になっています。"
    ]
  },
  "PASTED-SPARK-20261024-036": {
    "stem": "spot_priceが110.50以上の行をfilterしcountしている。Spark 3.5で追加された組込み関数を使って同じ件数を求めるにはどうするか。",
    "options": [
      "条件を満たすかの列をwithColumnで追加する",
      "agg内のcount_ifにspot_price >= min_priceを渡す",
      "spot_priceの最小値・最大値を集約する",
      "列のcountを出してからmin_priceという文字列と比較する"
    ],
    "explanation": "count_ifは条件がTRUEの行を数えます。元の比較演算子「>=」も維持し、条件付き件数を1つの集約で表せる点を押さえます。",
    "reasons": [
      "判定列を作るだけで集約しておらず、比較も>へ変わっています。",
      "条件を満たす行数という元の処理を直接表します。",
      "欲しいのは価格の範囲ではなく条件付きの件数です。",
      "非NULL数を数えた後の比較で、行ごとの条件判定になっていません。"
    ]
  },
  "PASTED-SPARK-20261024-037": {
    "stem": "1000パーティションのdfを100へ減らしたい。パーティション間の全体shuffleを避けるメソッドはどれか。",
    "options": [
      "repartition(100)",
      "limit(100)",
      "head(100)",
      "coalesce(100)"
    ],
    "explanation": "パーティション数を減らし、再分散を避けるならcoalesceです。limitやheadの数値は、パーティション数ではなく取得する行数を表します。",
    "reasons": [
      "数は変わりますが、shuffleを伴います。",
      "行数を制限する変換です。",
      "行をdriverへ取得する操作です。",
      "既存パーティションをまとめ、数を減らします。"
    ]
  },
  "PASTED-SPARK-20261024-038": {
    "stem": "Adaptive Query Execution（AQE）の主な利点はどれか。",
    "options": [
      "実行前だけ最適化し、実行中は変えない",
      "実行時の統計で計画を調整し、偏りやjoin戦略を改善する",
      "taskは並列化するが実行時指標で戦略を変えない",
      "taskをノードに配るが実行計画は変えない"
    ],
    "explanation": "AQEの要点は「実行中に分かった情報を使う」ことです。実際のデータサイズなどを基に、join戦略やshuffle後の処理を調整できます。",
    "reasons": [
      "実行中にも調整する点がAQEの特徴です。",
      "実行時の状態に合わせて計画を改善する説明です。",
      "並列化だけでなく、実行時の計画変更も行います。",
      "単なるスケジューリングの説明にとどまっています。"
    ]
  },
  "PASTED-SPARK-20261024-039": {
    "stem": "dfからusers_vwという一時ビューを作った。セッション終了前に何をしておけば、新しいセッションで一時ビューを再作成せず、そのデータをSQLで参照できるか。",
    "options": [
      "一時ビューをそのまま直接queryする",
      "データを永続テーブルとして保存する",
      "同じ一時ビューを作り直してqueryする",
      "一時ビューの定義だけを保存して後からqueryする"
    ],
    "explanation": "一時ビューは作成元セッションの寿命に結び付きます。セッションを越えてデータを参照するには、終了前に永続テーブルなどへ保存しておきます。",
    "reasons": [
      "セッション終了後は、その一時ビューを直接参照できません。",
      "新しいセッションからもSQLで参照できる永続化です。",
      "今回は一時ビューを再作成しないことが条件です。",
      "定義を保存するだけでは、永続テーブルとして参照可能にはなりません。"
    ]
  },
  "PASTED-SPARK-20261024-040": {
    "stem": "saveAsTableの保存先をデフォルトwarehouseではなく/some/pathに指定したい。有効なコードを2つ選べ。",
    "options": [
      "writeを関数として呼びpathを渡す",
      "saveAsTableを実行した後でoptionを付ける",
      "writerのoption(\"path\", ...)を設定してからsaveAsTableする",
      "saveAsTableのpathキーワード引数で指定する"
    ],
    "explanation": "writer optionは保存を実行する前に指定します。saveAsTableは追加optionをキーワード引数でも受け取れるため、path指定には2通りの書き方があります。",
    "reasons": [
      "writeはwriterを取得するプロパティで、この呼出し方は不適切です。",
      "保存後では設定できず、戻り値にoptionも呼べません。",
      "保存前にwriterへpathを設定する有効な方法です。",
      "保存時の追加optionとしてpathを渡せます。"
    ]
  },
  "PASTED-SPARK-20261024-041": {
    "stem": "利用者プロフィールのいずれか1列でもNULLなら、その行を学習用データから除きたい。どのコードを使うか。",
    "options": [
      "na.drop(thresh=0)",
      "na.drop(how=\"all\")",
      "na.drop(how=\"any\")",
      "na.drop(how=\"all\", thresh=None)"
    ],
    "explanation": "anyは「どれか1つでも欠損」、allは「全部が欠損」です。今回は列を限定せず、1か所でもNULLのある行を削除します。",
    "reasons": [
      "必要な非欠損値を0個にすると、欠損行を除く条件になりません。",
      "全列が欠損の行だけを削除するため不十分です。",
      "どれかの列にNULLがあれば、その行を削除します。",
      "thresh=Noneではhow=\"all\"の条件が使われます。"
    ]
  },
  "PASTED-SPARK-20261024-042": {
    "stem": "Structured Streamingで、新着データを5秒間隔のmicro-batchで処理したい。開始間隔を指定するコードはどれか。",
    "options": [
      "trigger(continuous=\"5 seconds\")",
      "引数なしのtrigger()",
      "trigger(processingTime=\"5 seconds\")",
      "trigger(processingTime=5000)"
    ],
    "explanation": "micro-batchの起動間隔にはprocessingTimeを使い、Pythonでは期間の文字列を渡します。処理が5秒以上かかった場合まで、必ず5秒ごとに重複起動するわけではありません。",
    "reasons": [
      "continuousは別の実行方式で、値はmicro-batchの起動間隔ではありません。",
      "有効なtrigger指定がなく、5秒間隔を設定できません。",
      "期間文字列でmicro-batchの間隔を指定しています。",
      "このPython APIではprocessingTimeに整数を渡せません。"
    ]
  },
  "PASTED-SPARK-20261024-043": {
    "stem": "dates_dfのtimestamp列から日付部分を取り出し、新しいdate列をDateTypeにしたい。正しいコードはどれか。",
    "options": [
      "unix_timestampでUNIX秒を取る",
      "to_dateで日付へ変換する",
      "date_formatでyyyy-MM-ddの文字列を作る",
      "from_unixtimeで日時文字列を作る"
    ],
    "explanation": "見た目が日付でも、文字列とDateTypeは別です。to_dateは日付型を返し、date_formatは書式化した文字列を返します。",
    "reasons": [
      "結果は秒数の数値で、日付型ではありません。",
      "日付部分をDateTypeとして作ります。",
      "日付に見えても結果はStringTypeです。",
      "UNIX秒からの変換用で、今回のDateType生成に適しません。"
    ]
  },
  "PASTED-SPARK-20261024-044": {
    "stem": "2億行の取引DataFrameと、3000行の商品DataFrameを結合する。性能改善に適した方法はどれか。",
    "options": [
      "大きい取引DataFrameをbroadcastする",
      "両方をソートしてsort-merge joinする",
      "両方を分散させshuffle hash joinする",
      "小さい商品DataFrameをbroadcastする"
    ],
    "explanation": "十分小さい表を各executorへ配ると、大きい表を結合のために動かすshuffleを避けられます。broadcastする側がメモリに収まるかも確認します。",
    "reasons": [
      "非常に大きい側の複製は、通信量とメモリ負荷を増やします。",
      "可能な方式ですが、小さい表を配れる条件では余分なshuffleやsortが生じます。",
      "両側を再分散するより、小さい側の複製が適しています。",
      "小さい表を配り、大きい表をその場で結合できます。"
    ]
  },
  "PASTED-SPARK-20261024-045": {
    "stem": "Sparkのjob・stage・taskの正しい包含関係はどれか。",
    "options": [
      "jobはstageに分かれ、stageはtaskに分かれる",
      "jobはtaskを持ち、taskはstageを持つ",
      "stageはjobを持ち、jobはtaskを持つ",
      "stageはtaskを持ち、taskはjobを持つ"
    ],
    "explanation": "大きい単位からjob → stage → taskの順です。stage内では、処理対象のパーティションに対するtaskが並列に動きます。",
    "reasons": [
      "実行単位の大小関係が正しい説明です。",
      "taskはstageより小さい単位です。",
      "stageがjobを含むという関係は逆です。",
      "taskがjobを含むことはありません。"
    ]
  },
  "PASTED-SPARK-20261024-046": {
    "stem": "テストをlocal modeで実行するとき、手元の計算資源を活用するにはどうするか。",
    "options": [
      "localをやめてcluster modeにする",
      "利用可能なCPUコアに応じてlocal thread数を増やす",
      "dynamicAllocationを有効にする",
      "executor.memoryを非常に大きくする"
    ],
    "explanation": "local modeでは、local[n]やlocal[*]で使うthread数を指定できます。実際に使えるコア数に応じた並列度にすることが要点です。",
    "reasons": [
      "local modeでのテストという条件を変えています。",
      "ローカルの並列実行能力を直接調整できます。",
      "分散executorの増減用で、local thread数の調整ではありません。",
      "メモリを大きくしても、CPUで並列実行する数は増えません。"
    ]
  },
  "PASTED-SPARK-20261024-047": {
    "stem": "各executorで同時実行できるtask数に直接関係するSpark設定はどれか。",
    "options": [
      "spark.executor.cores",
      "spark.task.maxFailures",
      "spark.driver.cores",
      "spark.executor.memory"
    ],
    "explanation": "executorに割り当てるCPUコア数が基本の同時実行能力です。通常は1taskにつき1コアですが、厳密にはspark.task.cpusの要求数も影響します。",
    "reasons": [
      "executorのCPUコア数を指定する設定です。",
      "taskが失敗できる回数の設定です。",
      "driver側のCPU資源で、executorのtask数ではありません。",
      "メモリ量の設定で、CPUの同時実行枠ではありません。"
    ]
  },
  "PASTED-SPARK-20261024-048": {
    "stem": "_metadata.file_pathが使えるDatabricks Runtimeで、各テキストファイルの全文とパスを1行にしたい。現在のspark.read.textでは1行ずつに分かれる。何を変えるか。",
    "options": [
      "textにwholetext=Trueを指定する",
      "lineSepに改行を指定する",
      "wholetext=Falseを指定する",
      "lineSepにカンマを指定する"
    ],
    "explanation": "wholetext=Trueにすると、1ファイルの全文が1つの文字列になります。区切り文字の変更と、ファイル全体を1レコードにする指定は別です。",
    "reasons": [
      "1ファイルを1行として読み込む指定です。",
      "改行単位での読込みを続けるため、全文が1行にはなりません。",
      "通常の行単位の読込みのままです。",
      "カンマで区切るだけで、1ファイル1行を保証しません。"
    ]
  },
  "PASTED-SPARK-20261024-049": {
    "stem": "Pandas API on Sparkでデータを変換する主な利点はどれか。",
    "options": [
      "Python専用なので学習が不要になる",
      "即時評価で毎回すぐに計算する",
      "1ノードのメモリ内だけで動く",
      "pandasに似たAPIを使いながらクラスターへ計算を分散できる"
    ],
    "explanation": "pandasに慣れた操作で、Sparkの分散処理を利用できる点が中心です。すべての操作が必ず速くなるわけではなく、shuffleやdriverへの収集には注意が必要です。",
    "reasons": [
      "Python向けであることだけでは、分散処理の利点を説明できません。",
      "Sparkの計算計画を使い、多くの処理は遅延評価されます。",
      "通常のローカルpandasとは異なり、分散実行できます。",
      "pandasの操作感と、Sparkによる分散実行を組み合わせます。"
    ]
  },
  "PASTED-SPARK-20261024-050": {
    "stem": "大量データを扱い、高水準SQL APIとbatch・streaming両方を使いたい。要件に特に合うSparkの利点を2つ選べ。",
    "options": [
      "Spark自体が必ずserverlessで、クラスター管理が不要",
      "Webフロントエンド開発フレームワークとの統合",
      "分散機械学習の訓練機能がある",
      "Spark SQLでSQLクエリを実行できる",
      "DataFrameやDatasetなど構造化データ用の成熟したAPIがある"
    ],
    "explanation": "SQLと構造化データのAPIが、今回の処理要件に直結します。Sparkを使うことと、特定サービスのserverless構成を使うことは同じではありません。",
    "reasons": [
      "Apache Sparkそのものが常にserverlessであるわけではありません。",
      "今回の要件はフロントエンド開発ではありません。",
      "機械学習機能はありますが、提示された要件の中心ではありません。",
      "SQLによる問合せという要件に対応します。",
      "大規模データの変換や集約を高水準APIで記述できます。"
    ]
  },
  "PASTED-SPARK-20261024-051": {
    "stem": "小さ過ぎるtaskが大量に発生し、パーティション過多で遅くなっている。全体shuffleなしでパーティション数を減らすにはどうするか。",
    "options": [
      "distinctで似たパーティションをまとめる",
      "coalesceに小さいパーティション数を指定する",
      "sortByで並べ替える",
      "repartitionに小さいパーティション数を指定する"
    ],
    "explanation": "目的は行の重複除去ではなく、実行単位を減らすことです。coalesceは既存パーティションをまとめ、shuffleの費用を抑えて数を減らせます。",
    "reasons": [
      "distinctは行の重複を除く処理で、目的と異なります。",
      "パーティションを減らす操作と、shuffle回避の両方に合います。",
      "並べ替えはこのパーティション数削減の指定ではありません。",
      "数は減りますが、全体shuffleを行います。"
    ]
  },
  "PASTED-SPARK-20261024-052": {
    "stem": "小さいdf1と大きいdf2を、df2.join(broadcast(df1), on=\"id\")で結合する。broadcastの目的は何か。",
    "options": [
      "結合前にidを絞り込む",
      "両方のパーティションサイズを大きくする",
      "小さい表を各executorへ配り、shuffleを減らす",
      "idの完全一致だけを保証する"
    ],
    "explanation": "broadcastは結合条件ではなく、結合の実行方式に関するヒントです。小さい側の複製を各executorに置き、大きい側の再分散を抑えます。",
    "reasons": [
      "idのfilter条件を追加する操作ではありません。",
      "両方のパーティションサイズを一律に増やす指定ではありません。",
      "小さい側を複製して結合する狙いを説明しています。",
      "一致条件はon=\"id\"で決まり、broadcastが決めるものではありません。"
    ]
  },
  "PASTED-SPARK-20261024-053": {
    "stem": "IoTの元イベントはevent_ts・sensor_id・metric_valueで識別できる。取込み時に付くingest_tsやsource_file_pathが違っても、同じ元イベントを重複として除きたい。どのコードが適切か。",
    "options": [
      "ingest_ts・sensor_id・metric_value・source_file_pathでdropDuplicatesする",
      "全列でdropDuplicatesする",
      "元イベント3列でgroupByするだけ",
      "event_ts・sensor_id・metric_valueをsubsetにしてdropDuplicatesする"
    ],
    "explanation": "重複の定義を元イベントの3列へ限定します。取込み時刻やファイルパスまで比較すると、同じイベントの別取込みを重複と判断できません。",
    "reasons": [
      "取込みごとに変わる列が含まれ、元イベントが同じでも別物になります。",
      "追加されたメタデータまで一致しないと削除されません。",
      "GroupedDataを作るだけで、重複排除済みDataFrameにはなりません。",
      "業務上の同一性を判断する列だけで重複を除きます。"
    ]
  },
  "PASTED-SPARK-20261024-054": {
    "stem": "DataFrameをJSON形式で既存パスへ上書きする有効なコードを2つ選べ。",
    "options": [
      "write.mode(\"overwrite\").json(path)",
      "write.overwrite.json(path)",
      "write.json(path, overwrite=True)",
      "write.format(\"json\").save(path, mode=\"overwrite\")"
    ],
    "explanation": "書込みモードはmode(\"overwrite\")、またはsaveのmode引数で指定できます。overwriteというwriterプロパティや、jsonのoverwrite=Trueではありません。",
    "reasons": [
      "モードを設定してからJSON出力する有効な構文です。",
      "writerにoverwriteというこの形のプロパティはありません。",
      "jsonメソッドの上書き指定はmodeで行います。",
      "形式とsaveのmode引数を使う有効な構文です。"
    ]
  },
  "PASTED-SPARK-20261024-055": {
    "stem": "color・fruit・v1・v2列を持つdfを、partitionBy(\"color\", \"fruit\").parquet(path)で保存する。どのように保存されるか。",
    "options": [
      "全行が単一Parquetファイルになる",
      "partition列にNULLがあると必ず失敗する",
      "既存Parquetファイルの中へ新しいpartitionを追加する",
      "colorとfruitの値の組合せごとにディレクトリができる"
    ],
    "explanation": "保存時のpartitionByは、列値に応じてディレクトリを分けます。ディレクトリごとにファイルが必ず1個になるという意味ではありません。",
    "reasons": [
      "実行パーティションなどにより複数のpartファイルになります。",
      "NULLのpartition値があるだけで必ず失敗するわけではありません。",
      "既存ファイルの内部にpartitionを追加する方式ではありません。",
      "列値の組合せに対応したディレクトリ構造ができます。"
    ]
  },
  "PASTED-SPARK-20261024-056": {
    "stem": "event_timeに10分のwatermarkを設定し、15分windowでcountする。遅延到着データについて何が保証されるか。",
    "options": [
      "15分windowに入るなら、watermarkを超えたデータも必ず含む",
      "閾値を超えたデータはすべて必ず除外する",
      "遅れたデータは次のwindowへ移す",
      "観測した最新event_timeから10分以内の遅れなら処理する"
    ],
    "explanation": "watermarkの保証は一方向です。許容遅延内のデータは落としませんが、それより古いデータは処理される場合も捨てられる場合もあります。window長と遅延許容幅も別です。",
    "reasons": [
      "windowに入ることだけでは、古いデータを処理する保証にはなりません。",
      "許容幅を超えたものを常に必ず捨てる、とは保証していません。",
      "イベントの時刻を変えて別windowへ移す仕組みではありません。",
      "10分という許容幅内の遅延データについての保証です。"
    ]
  },
  "PASTED-SPARK-20261024-057": {
    "stem": "Spark 3.5.6の標準catalogで、未作成のusersを既存/data/input.jsonの外部表として登録したい。入力は1行1JSONで、レコードごとのfieldは異なるが型は互換。schemaを推論し、不要なschema統合optionを付けないSQLを2つ選べ。",
    "options": [
      "USING jsonとOPTIONS(path ...)で表を作る",
      "USING jsonとLOCATIONで表を作る",
      "EXTERNAL表にmergeSchema=trueを付ける",
      "EXTERNAL表にschemaMerge=trueを付ける"
    ],
    "explanation": "JSONは入力を調べてfieldを含むschemaを推論できます。外部の既存パスはOPTIONS(path ...)でもLOCATIONでも指定でき、JSONのためにmergeSchemaを付ける必要はありません。",
    "reasons": [
      "外部パスを参照し、JSONのschema推論を使える指定です。",
      "同じ外部パスをLOCATIONで指定する方法です。",
      "mergeSchemaを追加しないという設問の条件に合いません。",
      "schemaMergeはJSON推論用の標準optionではなく、条件に合いません。"
    ]
  },
  "PASTED-SPARK-20261024-058": {
    "stem": "明示schemaでCSVを読み、filter・select・groupBy集約でreduced_dfを作った後、count、showの順に呼ぶ。変換パイプラインを最初に実行するのはどの段階か。",
    "options": [
      "filterを定義したとき",
      "countを呼んだとき",
      "groupByを定義したとき",
      "showを呼んだとき"
    ],
    "explanation": "DataFrame変換は計画を作り、最初のactionで実行します。このコードではcountがshowより先にあります。問題はDataFrame構築後のパイプライン実行時点を問っています。",
    "reasons": [
      "filterは変換で、定義だけでは計算を実行しません。",
      "最初に呼ばれるactionなので、ここでパイプラインが動きます。",
      "groupByの定義も遅延されます。",
      "showもactionですが、countの方が先です。"
    ]
  },
  "PASTED-SPARK-20261024-059": {
    "stem": "customerDFのemail列を、usernameとdomainへ分けたい。通常の「利用者名@ドメイン」の入力に対して有効なコードを2つ選べ。",
    "options": [
      "固定文字数のsubstrで前後を取る",
      "@でsplitし、getItem(0)とgetItem(1)を取る",
      "substring_indexで@の前と後を取る",
      "両列とも@を削除した文字列にする"
    ],
    "explanation": "長さではなく、@という区切り位置を使います。splitでできる配列は0始まりで、substring_indexは正のcountで前側、負のcountで後側を取り出せます。",
    "reasons": [
      "利用者名とドメインの長さは一定とは限りません。",
      "区切り前後を配列の要素として取り出す方法です。",
      "区切りの前と後を文字列のまま取り出す方法です。",
      "@を消すだけでは、前後の文字列を分離できません。"
    ]
  },
  "PASTED-SPARK-20261024-060": {
    "stem": "dfをParquet形式で保存し、country列でディレクトリ分割し、保存先の既存データを上書きしたい。正しいコードはどれか。",
    "options": [
      "mode(\"overwrite\")・partitionBy(\"country\")・parquetを指定する",
      "appendモードとpartitionByを使う",
      "overwriteでParquet保存するがpartitionByを付けない",
      "partitionByでParquet保存するがoverwriteを付けない"
    ],
    "explanation": "形式・保存モード・partition列の3条件を確認します。どれか1つが欠けても、指定された保存方法にはなりません。",
    "reasons": [
      "3つの条件すべてを満たします。",
      "appendは追加であり、既存データの上書きではありません。",
      "上書きと形式は正しくても、countryによる分割がありません。",
      "既存パスを上書きする指定がありません。"
    ]
  },
  "PASTED-SPARK-20261024-061": {
    "stem": "構造化データの処理、SQLクエリ、機械学習を組み合わせる場合、適したSparkの機能の組み合わせはどれですか。",
    "options": [
      "DataFrame・Structured Streaming・GraphX",
      "Spark SQL・pandas API・Structured Streaming",
      "Spark Streaming・GraphX・pandas API",
      "DataFrame・Spark SQL・MLlib"
    ],
    "explanation": "表形式のデータはDataFrame、SQLによる分析はSpark SQL、機械学習はMLlibが担当します。要件と各コンポーネントの役割を対応させます。",
    "reasons": [
      "GraphXはグラフ処理用で、機械学習ライブラリの代わりにはなりません。",
      "ストリーミングとpandas APIだけでは、指定された機械学習の役割を満たしません。",
      "グラフ処理やストリーミングが中心の組み合わせです。",
      "3つの要件に対応する機能がそろっています。"
    ]
  },
  "PASTED-SPARK-20261024-062": {
    "stem": "KafkaのfeedトピックをStructured Streamingで読みます。接続先は設定済みです。空欄に入れる設定はどれですか。",
    "options": [
      "subscribeオプションにfeedを指定する",
      "subscribe.topicオプションにfeedを指定する",
      "kafka.topicオプションにfeedを指定する",
      "topicオプションにfeedを指定する"
    ],
    "explanation": "Kafkaソースでトピック名を購読する設定はsubscribeです。接続先を指定するkafka.bootstrap.serversと、購読対象の指定を区別します。",
    "reasons": [
      "Kafkaの読み取りで使用する正しい購読設定です。",
      "この名前の購読オプションはありません。",
      "Kafkaソースのトピック購読に使うキーではありません。",
      "topicは主にKafkaへの書き込み先を指定するときの設定です。"
    ]
  },
  "PASTED-SPARK-20261024-063": {
    "stem": "大きなJSONデータを、事前に定義したスキーマで読み込む最適な方法はどれですか。",
    "options": [
      "読み込み後にprintSchemaし、DataFrame全体をcastする",
      "inferSchemaをtrueにして型を推論する",
      "JSONを読み込んだ後、各列をwithColumnで型変換する",
      "StructTypeでスキーマを定義し、read.schema(...).json(...)で読む"
    ],
    "explanation": "型が決まっている場合は読み取り時にスキーマを渡します。型推論のための追加走査を避け、列の型も明示できます。",
    "reasons": [
      "printSchemaは表示用で、DataFrame全体をcastするAPIもありません。",
      "型を推論する方法であり、事前定義したスキーマを渡していません。",
      "読み込み後の型変換で、読み取り時のスキーマ指定とは異なります。",
      "StructTypeをschemaに渡すと、指定した型で読み込めます。"
    ]
  },
  "PASTED-SPARK-20261024-064": {
    "stem": "transaction_id、account_number、amount、timestampを持つ取引データから、全列が同じ重複行だけを除去する方法はどれですか。",
    "options": [
      "引数なしのdropDuplicates()",
      "transaction_idで集約し、他の列はfirstで取得する",
      "transaction_idがnullでない行に絞る",
      "transaction_amountだけを指定してdropDuplicatesする"
    ],
    "explanation": "全列一致の重複を除くならdropDuplicates()を引数なしで使います。キーを指定すると、その列だけが同じ別の取引までまとめる可能性があります。",
    "reasons": [
      "全列を比較し、同一の行を1行にまとめます。",
      "同じIDでも他の列が異なる取引をまとめてしまいます。",
      "nullの除外であり、重複の除去ではありません。",
      "指定した列だけで判定します。また、設問の列名とも一致しません。"
    ]
  },
  "PASTED-SPARK-20261024-065": {
    "stem": "値に3.14159を掛けるPython UDFを作ります。浮動小数点の結果を正しく返せる定義を2つ選んでください。",
    "options": [
      "Sparkの戻り値をIntegerType、Python関数をint→intとして定義する",
      "Sparkの戻り値をDoubleType、Python関数をfloat→floatとして定義する",
      "Sparkの戻り値をDoubleType、Python関数をint→intとして定義する",
      "Sparkの戻り値をIntegerType、Python関数をfloat→floatとして定義する"
    ],
    "explanation": "計算結果はPythonのfloatなので、Spark側の戻り値もDoubleTypeにします。Pythonの型注釈は実行時の強制変換ではないため、注釈がintでも実際の戻り値がfloatならDoubleTypeと整合します。",
    "reasons": [
      "IntegerTypeと実際の浮動小数点の戻り値が一致しません。",
      "実際の戻り値とDoubleTypeが対応します。",
      "intという型注釈だけで戻り値が整数に変わるわけではありません。",
      "型注釈がfloatでも、Spark側のIntegerTypeとの不一致は解消されません。"
    ]
  },
  "PASTED-SPARK-20261024-066": {
    "stem": "同じ実行コンテキストでSparkSession.builderのgetOrCreate()を呼ぶと、既存のSparkSessionはどう扱われますか。",
    "options": [
      "既存セッションを破棄して作り直す",
      "appNameごとに必ず別のセッションを作る",
      "利用可能な既存セッションがあれば返す",
      "呼び出すたびに新しいセッションを作る"
    ],
    "explanation": "getOrCreateは、既存の利用可能なセッションを取得し、なければ作成します。appNameを指定しても、それだけで別セッションが保証されるわけではありません。",
    "reasons": [
      "既存セッションを自動で破棄する処理ではありません。",
      "appNameはセッションを一意に分離するキーではありません。",
      "メソッド名のgetの部分に対応する動作です。",
      "既存セッションを再利用できるため、毎回新規にはなりません。"
    ]
  },
  "PASTED-SPARK-20261024-067": {
    "stem": "Sparkアプリケーションをclusterデプロイモードで実行する特徴として、最も適切なものはどれですか。",
    "options": [
      "リソースマネージャーによる資源割り当てだけがclusterモードで可能になる",
      "ドライバーが全タスクをローカルで実行する",
      "ドライバーが送信元クライアント上で動く",
      "ドライバーがクラスター内のノード上で動く"
    ],
    "explanation": "clientとclusterの違いは、主にドライバーの実行場所です。clusterモードではドライバーもクラスター側に配置されます。",
    "reasons": [
      "資源管理はclientモードでも行われるため、モードの決め手ではありません。",
      "分散タスクを実行するのはエグゼキューターです。",
      "これはclientモードの特徴です。",
      "clusterモードの定義に合っています。"
    ]
  },
  "PASTED-SPARK-20261024-068": {
    "stem": "実行中のSparkアプリケーションで、エグゼキューターのログを調べる適切な方法はどれですか。",
    "options": [
      "マスターノードの/tmpだけを確認する",
      "spark-submit --verboseで全エグゼキューターログを表示する",
      "Spark UIの関連ステージやエグゼキューターからログリンクを確認する",
      "Spark SQL CLIからエグゼキューターログを取得する"
    ],
    "explanation": "Spark UIからタスクの失敗とエグゼキューターをたどり、stdoutやstderrなどを確認します。実際のリンクの提供方法は、クラスターのログ設定によります。",
    "reasons": [
      "エグゼキューターログが必ずマスターの/tmpに集まるわけではありません。",
      "verboseは送信時の詳細表示で、全エグゼキューターログを集約しません。",
      "実行状況とログを関連付けて調査できます。",
      "SQLを実行するCLIであり、ログ収集の専用機能ではありません。"
    ]
  },
  "PASTED-SPARK-20261024-069": {
    "stem": "128GBのAと1GBのBを等価結合します。Bはドライバーと各エグゼキューターのメモリに収まり、ブロードキャストの制約も満たします。最も適切な戦略と主な利点はどれですか。",
    "options": [
      "Bをブロードキャストし、Bのシャッフルを避ける",
      "Bをブロードキャストし、大きいAのシャッフルを避ける",
      "Aをブロードキャストし、Bのシャッフルを避ける",
      "Aのほうが小さいためAをブロードキャストする"
    ],
    "explanation": "小さいBを各エグゼキューターへ配布すれば、大きいAを結合キーで再分配する負担を避けられます。ブロードキャストも通信を伴うため、通信がゼロになるという意味ではありません。",
    "reasons": [
      "小さい側だけに注目しており、大きいAの再分配を避けるという主要な利点を表していません。",
      "設問のメモリ条件のもとで、最も大きな通信コストを抑える説明です。",
      "大きいAの複製はメモリと転送量の面で不利です。",
      "サイズの大小が逆です。"
    ]
  },
  "PASTED-SPARK-20261024-070": {
    "stem": "最初の処理でシャッフルが起こり、その後の処理では通常シャッフルしない組み合わせはどれですか。",
    "options": [
      "user_idでgroupByして購入額を合計し、その合計が100超の行をfilterする",
      "割引額をwithColumnで追加し、その列をselectする",
      "購入日をwithColumnで追加し、未定義の合計額で絞る",
      "groupByで集約した後にrepartition(10)する"
    ],
    "explanation": "キー別の集約には同じキーのデータを集めるシャッフルが必要です。その結果に対するfilterは、各パーティション内で行えます。",
    "reasons": [
      "集約で再分配し、その後の絞り込みは局所的に実行できます。",
      "どちらも通常はシャッフルを必要としません。",
      "条件の列が定義されておらず、目的の有効な処理になりません。",
      "repartitionによって、集約後も再びシャッフルします。"
    ]
  },
  "PASTED-SPARK-20261024-071": {
    "stem": "センサーのストリームを、重ならない5分単位のイベント時刻ウィンドウで集計し、センサーごとの平均を継続計算する方法はどれですか。",
    "options": [
      "分析関数のWindow.rangeBetween(-300,0)を使う",
      "センサーと個々のタイムスタンプでgroupByする",
      "センサーだけでgroupByする",
      "withWatermarkを設定し、センサーとwindow(timestamp,'5 minutes')でgroupByして平均を求める"
    ],
    "explanation": "時刻を一定幅に区切る集計には、groupByのキーにwindowを使います。watermarkは遅延データと状態の保持に関する設定で、5分の集計幅そのものはwindowで指定します。",
    "reasons": [
      "分析関数の行範囲と、ストリーミングの時間ウィンドウは別の仕組みです。",
      "同じ時刻の行しかまとまらず、5分単位になりません。",
      "時間による区切りがありません。",
      "センサー別・5分ごとの集計を表します。"
    ]
  },
  "PASTED-SPARK-20261024-072": {
    "stem": "Spark Connectの対応機能について、正しい説明はどれですか。",
    "options": [
      "DataStreamReader、DataStreamWriter、StreamingQueryを使うStructured Streamingに対応する",
      "DataFrame、Functions、Column、SparkContextのすべてに対応する",
      "PySparkからしか利用できない",
      "認証が標準で一式組み込まれている"
    ],
    "explanation": "Spark ConnectはDataFrameベースのリモート実行を提供し、Structured Streamingにも対応します。SparkContextやRDDを直接操作する従来の低水準APIとは分けて覚えます。",
    "reasons": [
      "対象となるストリーミングAPIはConnectで利用できます。",
      "SparkContextを直接扱うAPIは対応対象ではありません。",
      "クライアントはPySparkだけに限定されません。",
      "認証は配置先の基盤などと組み合わせて構成します。"
    ]
  },
  "PASTED-SPARK-20261024-073": {
    "stem": "数百万行あるデータをブロードキャスト側に指定した場合、起こり得る問題はどれですか。",
    "options": [
      "各エグゼキューターのメモリに収まらず失敗する",
      "行数と同じだけCPUコアが必要になる",
      "データをシリアライズできず必ず停止する",
      "ドライバーのCPUコア数だけを理由に必ず失敗する"
    ],
    "explanation": "ブロードキャスト側は各エグゼキューターに複製されるため、実データのサイズとメモリ使用量が重要です。行数だけで可否は決まりません。",
    "reasons": [
      "複製したデータがメモリを圧迫する可能性があります。",
      "必要なコア数が行数に比例するという仕様はありません。",
      "行数が多いことだけでシリアライズ不能にはなりません。",
      "CPUコア数だけで失敗が確定するわけではありません。"
    ]
  },
  "PASTED-SPARK-20261024-074": {
    "stem": "Spark Connectの基本的な役割を正しく説明するものはどれですか。",
    "options": [
      "どの言語からでも無条件に実行できる仕組み",
      "RESTだけで任意のクラスターを操作する仕組み",
      "クライアントとサーバーを分離し、リモートでSpark処理を実行する仕組み",
      "主にデータを取り込むための機能"
    ],
    "explanation": "Spark Connectではクライアントが処理計画を送り、サーバー側のSparkが実行します。通信にはgRPCを用い、クライアントとSparkの実行環境を分離します。",
    "reasons": [
      "対応クライアントやプロトコルの実装が必要です。",
      "一般的なREST APIという説明は正確ではありません。",
      "クライアントと実行側の分離が中心となる設計です。",
      "取り込み専用ではなく、DataFrame処理などを実行できます。"
    ]
  },
  "PASTED-SPARK-20261024-075": {
    "stem": "CSVに bambi,hello と alladin,20 の2行があります。nameをStringType、ageをIntegerTypeと明示して、既定のPERMISSIVEモードで読むとどうなりますか。",
    "options": [
      "bambiの行からageフィールド自体がなくなり、alladinのageは20になる",
      "alladinの行だけが残る",
      "bambiのageはnull、alladinのageは20になる",
      "読み込みがエラーで終了する"
    ],
    "explanation": "PERMISSIVEでは、整数に変換できないhelloはage列のnullになります。スキーマは共通なので、行ごとにage列そのものが消えるわけではありません。",
    "reasons": [
      "列はスキーマどおり存在し、変換できない値がnullになります。",
      "不正な行を落とすDROPMALFORMEDとは異なります。",
      "型変換できる20は整数、変換できないhelloはnullです。",
      "不正な値で即座に失敗するのはFAILFASTです。"
    ]
  },
  "PASTED-SPARK-20261024-076": {
    "stem": "approx_percentileで25・50・75パーセンタイルを求めています。accuracy=1000では速度は十分ですが精度が足りません。適切な変更はどれですか。",
    "options": [
      "最初のパーセンタイル値を小さくする",
      "accuracyを下げてメモリを減らし、精度も上げる",
      "最後のパーセンタイル値を大きくする",
      "accuracyを上げ、より多くのメモリを使って精度を高める"
    ],
    "explanation": "求める分位点と近似精度は別の指定です。accuracyを大きくすると相対誤差の上限は小さくなりますが、メモリの使用量が増えます。",
    "reasons": [
      "求める位置が変わるだけで、近似精度は改善しません。",
      "accuracyを下げると一般に精度は下がります。",
      "別の分位点を計算することになり、精度の改善ではありません。",
      "精度とメモリ使用量の適切なトレードオフです。"
    ]
  },
  "PASTED-SPARK-20261024-077": {
    "stem": "Kafkaのデータを低遅延で継続処理し、exactly-onceを保ちたいとします。チェックポイントと対応する出力先は構成済みです。適切なトリガーはどれですか。",
    "options": [
      "processingTime='1 second'",
      "continuous=True",
      "continuous='1 second'",
      "availableNow=True"
    ],
    "explanation": "Structured Streamingのマイクロバッチ処理は、対応するソース・シンクとチェックポイントの条件のもとでexactly-onceを実現します。continuous処理の保証はat-least-onceです。",
    "reasons": [
      "1秒間隔のマイクロバッチで継続処理します。",
      "continuousには時間間隔を文字列で指定します。",
      "低遅延でもat-least-onceのため、要件の保証と一致しません。",
      "利用可能なデータを処理したら終了し、継続監視にはなりません。"
    ]
  },
  "PASTED-SPARK-20261024-078": {
    "stem": "DataFrameをfinanceという新しい管理テーブルとして保存します。同名のテーブルがあれば既存データを変更せずエラーにしたい場合、どれを使いますか。",
    "options": [
      "ErrorIfExistsモードでsaveAsTable('finance')",
      "OverwriteモードでsaveAsTable('finance')",
      "Ignoreモードでsaveする",
      "ErrorIfExistsモードでsave('finance')"
    ],
    "explanation": "テーブル名として登録するにはsaveAsTableを使います。同名テーブルがあるときに失敗させる指定はerrorまたはerrorifexistsです。",
    "reasons": [
      "テーブル登録と既存時のエラーという両方の条件を満たします。",
      "既存テーブルを上書きしてしまいます。",
      "存在してもエラーにせず、saveは通常パスへの保存です。",
      "financeをパスとして扱う保存であり、管理テーブルの作成ではありません。"
    ]
  },
  "PASTED-SPARK-20261024-079": {
    "stem": "Spark 3.0以降のAdaptive Query Executionを有効にしたときの機能として、適切なものはどれですか。",
    "options": [
      "実行時の統計に基づいて結合戦略を変更する",
      "カタログの統計を自動で永続化する",
      "単一ステージのすべての処理を無条件に高速化する",
      "Deltaファイルを物理的に最適化する"
    ],
    "explanation": "AQEは実行中に得た統計を使って物理計画を調整します。代表例は結合方式の変更、シャッフルパーティションの結合、偏りのある結合への対処です。",
    "reasons": [
      "実行中のサイズ情報に応じた結合戦略の変更はAQEの機能です。",
      "メタストア統計の更新とは別の機能です。",
      "どんな処理も必ず速くなるという保証はありません。",
      "ファイルの最適化はAQEによるクエリ計画の調整とは異なります。"
    ]
  },
  "PASTED-SPARK-20261024-080": {
    "stem": "Structured Streamingの結果をParquet形式の指定パスへ書きます。writeStreamの空欄に入る正しい設定はどれですか。",
    "options": [
      "format('parquet')とoption('location',出力先)",
      "format('format','parquet')とoption('destination',出力先)",
      "format('format','parquet')とoption('location',出力先)",
      "format('parquet')とoption('path',出力先)"
    ],
    "explanation": "ファイルシンクの形式はformat('parquet')、出力先はpathで指定します。checkpointLocationは復旧用の保存先で、出力データのpathとは役割が異なります。",
    "reasons": [
      "出力先を指定するキーはlocationではなくpathです。",
      "formatの引数と出力先オプションがどちらも誤りです。",
      "formatは形式名を1つ渡し、出力先はpathに指定します。",
      "Parquetファイルシンクの正しい形式と出力先の指定です。"
    ]
  },
  "PASTED-SPARK-20261024-081": {
    "stem": "10GBと8MBのCSV由来DataFrameを等価結合します。小さい側の推定サイズは8MB、autoBroadcastJoinThresholdは10MBです。想定される結合はどれですか。",
    "options": [
      "AQEが無効なので必ずシャッフル結合になる",
      "小さい側が閾値未満なのでブロードキャスト結合が候補になる",
      "サイズの差が大きすぎるためシャッフル結合になる",
      "ヒントがないため必ずシャッフル結合になる"
    ],
    "explanation": "自動ブロードキャストの閾値と推定サイズを比較します。対応する結合条件なら、小さい側が閾値以下であることによりヒントなしでもブロードキャストが選ばれ得ます。",
    "reasons": [
      "通常の自動ブロードキャストはAQEが無効でも利用できます。",
      "8MBは10MBより小さく、自動選択の条件を満たします。",
      "サイズ差が大きいことは小さい側を配布する利点になります。",
      "閾値に基づく自動選択にはヒントが必須ではありません。"
    ]
  },
  "PASTED-SPARK-20261024-082": {
    "stem": "record_datetime列と、構造体の配列record列があります。配列の各要素を行に展開し、sensor_id・status・healthを個別の列にする方法はどれですか。",
    "options": [
      "recordをexplodeした後、元の最上位にsensor_idなどがあるものとしてselectする",
      "recordをcolで参照し、そのまま内部フィールドを取り出す",
      "recordをexplodeし、生成した構造体列のsensor_id・status・healthをselectする",
      "recordをexplodeした後、構造体全体を1列のままselectする"
    ],
    "explanation": "配列を行へ展開するexplodeと、構造体からフィールドを取り出す操作を組み合わせます。フィールドは展開後の構造体列を経由して参照します。",
    "reasons": [
      "内部フィールドが自動で最上位列になるわけではありません。",
      "配列の要素を行に展開していません。",
      "配列の展開と構造体の列分解の両方を行います。",
      "行には展開しますが、要求された個別の列には分解していません。"
    ]
  },
  "PASTED-SPARK-20261024-083": {
    "stem": "稼働中のローカルSpark Connectサーバーへ、アプリケーションのコードを変えずに接続する方法を2つ選んでください。",
    "options": [
      "起動引数の--remoteにhttps://localhostを指定する",
      "起動引数の--remoteにsc://localhostを指定する",
      "環境変数SPARK_REMOTEにsc://localhostを設定する",
      "コード内でSparkSession.builder.remote(...)を追加する",
      "サーバーのバインドポートだけを設定する"
    ],
    "explanation": "Connectの接続先はsc://形式です。コードを変更しない条件では、起動引数--remoteまたは環境変数SPARK_REMOTEで接続先を指定します。",
    "reasons": [
      "Connectの接続URLとして求められる形式ではありません。",
      "実行時の引数で接続先を指定できます。",
      "環境変数で接続先を指定できます。",
      "有効な接続方法ですが、コードを変更しないという条件に反します。",
      "サーバーの待受設定だけではクライアントの接続先を指定できません。"
    ]
  },
  "PASTED-SPARK-20261024-084": {
    "stem": "clientモードのドライバーがメモリ不足です。クライアントの増強はできませんが、クラスターには十分な資源があります。適切な対策はどれですか。",
    "options": [
      "エグゼキューターの数だけを増やす",
      "同じクライアントのメモリを増やす",
      "clusterモードへ切り替え、ドライバーをクラスター側で動かす",
      "localモードへ切り替える"
    ],
    "explanation": "ドライバーの問題はエグゼキューターを増やすだけでは解消しません。clusterモードなら、資源のあるクラスター側にドライバーを配置できます。",
    "reasons": [
      "エグゼキューターの増加はドライバー自身のメモリを増やしません。",
      "クライアントを増強できないという条件に反します。",
      "利用可能なクラスター資源をドライバーに割り当てられます。",
      "制約のあるクライアント上に処理を集めるため、目的に合いません。"
    ]
  },
  "PASTED-SPARK-20261024-085": {
    "stem": "従業員DataFrameからtenureが5以上の行を抽出し、その結果を画面に表示するコードはどれですか。",
    "options": [
      "filterで条件を指定し、show()を呼ぶ",
      "whereで条件を指定するだけ",
      "DataFrameに適用せずfilterへ列の条件だけを渡す",
      "filterで条件を指定し、collect()を呼ぶ"
    ],
    "explanation": "filterとwhereは条件に合うDataFrameを作る変換です。表として画面に表示するには、アクションのshowを呼びます。",
    "reasons": [
      "条件の抽出と表示を両方行います。",
      "変換を定義するだけで、表示を実行していません。",
      "設問のDataFrameを処理する正しい呼び方になっていません。",
      "collectはRowのリストをドライバーへ返す操作で、showによる表の表示とは異なります。"
    ]
  },
  "PASTED-SPARK-20261024-086": {
    "stem": "同じevent_idの重複イベントは、タイムスタンプの差が最大30分です。31分のwatermarkを指定してdropDuplicatesWithinWatermark(['event_id'])を使う説明として、正しいものはどれですか。",
    "options": [
      "この重複除去APIは対応していない",
      "31分が最大差30分より長いため、watermarkの保証範囲で重複を除去できる",
      "すべての過去データについて永久に重複を除去できる",
      "watermarkは秒単位しか指定できない"
    ],
    "explanation": "dropDuplicatesWithinWatermarkでは、重複イベント間の時刻差より長い遅延閾値を選びます。状態は無期限に保持されないため、全期間に対する重複排除とは区別します。",
    "reasons": [
      "Spark 3.5で利用できるAPIです。",
      "設問の最大差をカバーする閾値になっています。",
      "watermarkを越えたデータまで無期限に保証するものではありません。",
      "minutesなどの時間間隔を指定できます。"
    ]
  },
  "PASTED-SPARK-20261024-087": {
    "stem": "文字列の長さを求めるPython UDFについて、有効な定義・登録方法はどれですか。",
    "options": [
      "withcolumn内でspark.udf(...)を直接呼ぶ",
      "length(col(...))からalias(...)を減算する",
      "spark.udf.register('computeLength', lambda s: len(s))で登録する",
      "withcolumnへ、引数の列に適用していないUDFをそのまま渡す"
    ],
    "explanation": "spark.udf.registerはPython関数をSQLから呼べるUDFとして登録します。登録しただけではDataFrameに列は追加されません。実用では戻り値をIntegerTypeで明示すると意図が伝わります。",
    "reasons": [
      "メソッド名はwithColumnであり、spark.udfはこの呼び方をしません。",
      "別名は.alias(...)で付けます。またlengthは組み込み関数です。",
      "UDFの登録として有効なコードです。",
      "withColumnの大文字小文字と、UDFを列へ適用する手順が誤っています。"
    ]
  },
  "PASTED-SPARK-20261024-088": {
    "stem": "次のDataFrame操作のうち、一般にシャッフルを伴うものはどれですか。",
    "options": [
      "groupByして集約する",
      "filterで行を絞る",
      "withColumnで列を追加する",
      "selectで列を選ぶ"
    ],
    "explanation": "キー別の集約では、別のパーティションにある同じキーのデータを集める必要があります。filterや通常の列計算は、各パーティション内で処理できます。",
    "reasons": [
      "同じキーをまとめるため、通常はシャッフルが発生します。",
      "各行の条件判定であり、通常は再分配しません。",
      "通常の列式の追加だけなら再分配は不要です。",
      "通常の列選択だけではシャッフルしません。"
    ]
  },
  "PASTED-SPARK-20261024-089": {
    "stem": "数値の処理時間が入ったRDDがあります。全体の最大値を計算し、ドライバーへ返す適切な方法はどれですか。",
    "options": [
      "RDD.reduceでmaxを適用する",
      "アキュムレーターで最大値を自動収集する",
      "最大値をブロードキャスト変数として共有する",
      "Spark UIにRDD全体の最大値を自動計算させる"
    ],
    "explanation": "reduceは各パーティションの結果を結合して、1つの値を返すアクションです。maxは結合順序に依存せず使えるため、RDD全体の最大値を求められます。",
    "reasons": [
      "分散して最大値を集約し、結果をドライバーへ返せます。",
      "一般的な加算用アキュムレーターが自動で最大値を計算するわけではありません。",
      "ブロードキャストは値の配布用で、集計を行いません。",
      "UIは任意のRDDの内容を集約する代わりにはなりません。"
    ]
  },
  "PASTED-SPARK-20261024-090": {
    "stem": "互換性のある異なるスキーマを持つ複数のParquetファイルを読み、すべての列を含めたい場合、適切な方法はどれですか。",
    "options": [
      "read.option('mergeSchema','true').parquet(...)",
      "mergeAllColumns()を呼ぶ",
      "schema('merge')を指定する",
      "既定設定で読めば必ず全列が統合される"
    ],
    "explanation": "Parquetのスキーマ統合はmergeSchemaで有効にします。すべての列を含む共通スキーマを作れますが、追加のスキーマ確認コストがかかります。",
    "reasons": [
      "複数ファイルの互換性のあるスキーマを統合します。",
      "この名前のDataFrameReader APIはありません。",
      "schemaには実際のスキーマを渡し、mergeは統合命令になりません。",
      "既定ではすべてのファイルのスキーマ統合は保証されません。"
    ]
  },
  "PASTED-SPARK-20261024-091": {
    "stem": "Arrow関連の設定がまだ指定されていないとします。pandasとPySparkのDataFrame間の変換をApache Arrowで最適化できる設定を2つ選んでください。",
    "options": [
      "spark.pandas.arrow.enabledをtrueにする",
      "spark.sql.execution.arrow.pyspark.enabledをtrueにする",
      "spark.sql.execution.arrow.enabledをtrueにする",
      "spark.sql.arrow.pandas.enabledをtrueにする"
    ],
    "explanation": "現在推奨される設定はarrow.pyspark.enabledです。これが未指定なら、旧設定arrow.enabledもフォールバックとして作用するため、この設問では両方が正解です。",
    "reasons": [
      "この名前の有効化設定ではありません。",
      "PySparkのArrow最適化を直接有効にする推奨設定です。",
      "旧設定ですが、新設定が未指定という前提では有効です。",
      "設定キーの並びが誤っています。"
    ]
  },
  "PASTED-SPARK-20261024-092": {
    "stem": "1TBのデータを、16コア×10ノードのクラスターで処理しています。タスク数がコア数より大幅に少なく、入力パーティションが大きく、一部でディスクへの退避も見られます。データ量を基に、実測で調整するための初期パーティション数を見積もる方法はどれですか。",
    "options": [
      "総CPUコア数と同じ数に固定する",
      "どのジョブでも200に固定する",
      "ノード数と同じ10にする",
      "データ量を128MBなどの目安のパーティションサイズで割る"
    ],
    "explanation": "まずデータ量÷目標サイズで数を見積もり、タスク時間・spill・並列度を実測して調整します。128MBやコア数だけで最適値が決まるわけではありません。",
    "reasons": [
      "コア数は並列度の参考ですが、パーティションの大きさを考慮していません。",
      "データ量や処理内容が変わるため、固定値が常に最適とは限りません。",
      "ノードごとに1タスク相当では、多くのコアを活用できません。",
      "データ量に基づく初期見積もりになり、実測調整の出発点になります。"
    ]
  },
  "PASTED-SPARK-20261024-093": {
    "stem": "AQEが有効で、結合はshuffled hash joinを利用可能です。シャッフル後の全パーティションがmaxShuffledHashJoinLocalMapThreshold未満で、この閾値はadvisoryPartitionSizeInBytes以上です。AQEが選ぶ結合方式はどれですか。",
    "options": [
      "直積結合",
      "シャッフルハッシュ結合",
      "ブロードキャストネストループ結合",
      "ソートマージ結合"
    ],
    "explanation": "各シャッフルパーティションが局所的なハッシュ表に収まる条件を満たすと、AQEはshuffled hash joinを優先できます。総データサイズと、各パーティションのサイズを区別します。",
    "reasons": [
      "直積を必要とする条件ではありません。",
      "指定された閾値と適用条件に対応する結合方式です。",
      "小さいテーブル全体を配布する方式への変更条件ではありません。",
      "この条件では、ソートの負担を避けるシャッフルハッシュ結合が選ばれます。"
    ]
  },
  "PASTED-SPARK-20261024-094": {
    "stem": "大きなpandas API on SparkのDataFrameを通常のpandas DataFrameへ変換するとき、考慮すべきリスクはどれですか。",
    "options": [
      "データが自動的にワーカーノードへ分散する",
      "1000行を超えると必ず失敗する",
      "変換中に一部のレコードが自動で失われる",
      "全データがドライバーのメモリに集まり、メモリ不足になり得る"
    ],
    "explanation": "通常のpandasは単一マシンのメモリ上で扱います。to_pandasは分散データをドライバーへ集めるため、行数よりも結果全体のメモリサイズに注意します。",
    "reasons": [
      "通常のpandasへ戻すと、分散処理ではなくなります。",
      "1000行という固定の上限はありません。",
      "正常な変換でレコードを意図的に間引く仕様はありません。",
      "ドライバーに全データを保持する必要があることがリスクです。"
    ]
  },
  "PASTED-SPARK-20261024-095": {
    "stem": "大きなデータをSQLで処理していますが、各ステージのタスクが少なく、十分な資源があるのにエグゼキューターが遊んでいます。改善策として適切なものはどれですか。",
    "options": [
      "spark.sql.shuffle.partitionsを増やす",
      "spark.sql.shuffle.partitionsを減らす",
      "処理するデータ量そのものを増やす",
      "動的リソース割り当てだけを有効にする"
    ],
    "explanation": "シャッフル後のパーティションが少ないと、並列に動けるタスクも少なくなります。shuffle.partitionsの増加を検討し、AQEによるパーティション結合後の数も確認します。",
    "reasons": [
      "シャッフル後の並列度を増やすための設定です。",
      "タスク数がさらに減り、利用率の改善につながりにくくなります。",
      "必要のないデータを増やしても、適切な性能対策にはなりません。",
      "エグゼキューターを増減しても、少ないタスク自体は増えません。"
    ]
  },
  "PASTED-SPARK-20261024-096": {
    "stem": "ワーカーが10台、各16コア・64GB RAMです。各ノードに4個のエグゼキューターを配置し、それぞれ4コアを割り当てると、アプリケーションに割り当てられるCPUコア数の合計はいくつですか。",
    "options": [
      "160コア",
      "64コア",
      "80コア",
      "40コア"
    ],
    "explanation": "10ノード×各4エグゼキューター×各4コア=160コアです。割り当て可能なコア数と、実際に常時稼働するタスク数は別です。",
    "reasons": [
      "10×4×4の計算に一致します。",
      "RAMの64GBとコア数を取り違えています。",
      "指定されたエグゼキューター数とコア数の積になっていません。",
      "これはエグゼキューターの総数で、各4コアをまだ掛けていません。"
    ]
  },
  "PASTED-SPARK-20261024-097": {
    "stem": "JSONイベントを継続処理するStructured Streamingで、障害時に進捗情報を使って復旧できるようにしたいとします。チェックポイントを正しく設定するコードはどれですか。",
    "options": [
      "writeStreamにcheckpointオプションを設定する",
      "writeStreamにcheckpointLocationオプションを設定する",
      "completeモードだけを指定し、保存先を設定しない",
      "appendモードだけを指定し、保存先を設定しない"
    ],
    "explanation": "復旧用の進捗や状態を保存するキーはcheckpointLocationです。出力モードの指定だけでは、永続的なチェックポイントの代わりにはなりません。",
    "reasons": [
      "正しいオプション名はcheckpointLocationです。",
      "ストリーミングクエリの復旧情報を指定先へ保存します。",
      "completeは出力の方式で、復旧情報の保存先ではありません。",
      "appendも出力方式です。なおconsole出力自体のexactly-onceは保証されません。"
    ]
  },
  "PASTED-SPARK-20261024-098": {
    "stem": "Spark SQLのdate_sub(start, days)でdaysに負数を渡すと、どうなりますか。",
    "options": [
      "開始日がそのまま返る",
      "不正な引数としてエラーになる",
      "負数の絶対値に相当する日数だけ開始日から先に進む",
      "負数の絶対値に相当する日数だけ開始日から前に戻る"
    ],
    "explanation": "date_subは開始日からdaysを引きます。たとえばdate_sub(日付,-3)は「マイナス3日を引く」ため、3日後の日付になります。",
    "reasons": [
      "負数も計算に使われるため、元のままではありません。",
      "負の整数も指定できます。",
      "負数の減算が加算になるので、日付が進みます。",
      "正の日数を渡した場合の動きです。"
    ]
  },
  "PASTED-SPARK-20261024-099": {
    "stem": "毎日Parquetテーブルを上書きします。出力は1パーティションにし、その中をmarket_time順にする必要があります。適切なコードはどれですか。後でテーブルを読む結果の順序は、別途ORDER BYで保証するものとします。",
    "options": [
      "sortしてからoverwriteで保存する",
      "orderByしてからoverwriteで保存する",
      "coalesce(1)してからsortし、overwriteで保存する",
      "sortWithinPartitionsしてからoverwriteで保存する"
    ],
    "explanation": "この設問には「1パーティションで出力」という条件があります。coalesce(1)でまとめてからsortします。保存時の並び順が、後のSELECTの結果順まで保証するわけではありません。",
    "reasons": [
      "並べ替えはしますが、出力が1パーティションとは限りません。",
      "orderByはsortと同じ並べ替えで、単一出力の条件が足りません。",
      "単一パーティション化・並べ替え・上書きを満たします。",
      "各パーティション内の並べ替えで、単一出力にはしません。"
    ]
  },
  "PASTED-SPARK-20261024-100": {
    "stem": "df1はemployee_idとname、df2はemp_idとdepartmentを持ちます。df1.join(df2, df1.employee_id == df2.emp_id, how='inner')はどう動きますか。",
    "options": [
      "結合する列名が異なるため失敗する",
      "on='employee_id'を明示していないため失敗する",
      "スキーマが異なるDataFrame同士なので失敗する",
      "列同士の比較条件を明示しているため、正常に内部結合する"
    ],
    "explanation": "列名が違っていても、Column式で左右の列を比較すれば結合できます。共通の列名を文字列で指定する書き方だけがjoinの方法ではありません。",
    "reasons": [
      "列名の一致は、このように条件式を書く結合では必須ではありません。",
      "onには列名だけでなく結合条件のColumn式も渡せます。",
      "結合するDataFrame全体のスキーマが同じである必要はありません。",
      "左右の列を明示した、有効な等価内部結合です。"
    ]
  },
  "PASTED-SPARK-20261024-101": {
    "stem": "name・age・salary列を持つdfを、ageは昇順、同じage内ではsalaryは降順に並べるコードはどれですか。",
    "options": [
      "age.asc()とsalary.asc()でorderByする",
      "ageとsalaryをascending=[True,True]でsortする",
      "ageとsalaryをascending=[False,True]でsortする",
      "ageとsalaryをascending=[True,False]でorderByする"
    ],
    "explanation": "ascendingのリストは、指定した列の順番に対応します。ageはTrueで昇順、salaryはFalseで降順です。",
    "reasons": [
      "salaryも昇順になってしまいます。",
      "両方とも昇順です。",
      "ageが降順、salaryが昇順で、要件と逆です。",
      "列ごとの昇順・降順が要件と一致します。"
    ]
  },
  "PASTED-SPARK-20261024-102": {
    "stem": "spark.sparkContext.setLogLevel(...)に指定できる有効なログレベルだけを並べた組み合わせはどれですか。",
    "options": [
      "ALL・DEBUG・FAIL・INFO",
      "ERROR・WARN・TRACE・OFF",
      "WARN・NONE・ERROR・FATAL",
      "FATAL・NONE・INFO・DEBUG"
    ],
    "explanation": "ERROR・WARN・TRACE・OFFはすべて有効です。似ている英単語でも、FAILやNONEはsetLogLevelで使うレベル名ではありません。",
    "reasons": [
      "FAILが有効なレベル名ではありません。",
      "すべて有効な設定値です。",
      "NONEが有効なレベル名ではありません。",
      "NONEが含まれるため、この組み合わせは不正です。"
    ]
  },
  "PASTED-SPARK-20261024-103": {
    "stem": "DataFrameに複数の変換を定義し、最後にcollect()を呼ぶSparkスクリプトがあります。実行の階層として適切な説明はどれですか。",
    "options": [
      "スクリプトが複数アプリケーションに分割され、それぞれジョブ・ステージ・タスクになる",
      "スクリプト全体が必ず1ジョブになる",
      "collectが計算を要求し、ジョブはシャッフル境界でステージに分かれ、各パーティションをタスクが処理する",
      "変換やアクション1個につき必ずタスク1個が作られる"
    ],
    "explanation": "覚える順番はアプリケーション→ジョブ→ステージ→タスクです。アクションが計算を要求し、ステージ内では複数パーティションをタスクで並列処理します。",
    "reasons": [
      "1つのスクリプトが自動で複数アプリケーションになるわけではありません。",
      "スクリプトには複数のアクションがあり得るため、全体が必ず1ジョブとは限りません。",
      "ジョブ・ステージ・タスクの関係を正しく表しています。",
      "タスク数は変換の数ではなく、主にステージで処理するパーティション数に対応します。"
    ]
  },
  "PASTED-SPARK-20261024-104": {
    "stem": "user_idごとのグループ全体とキーを、pandas DataFrameを扱う独自Python関数へ渡し、指定スキーマのDataFrameを返したい場合、どの方法が適切ですか。",
    "options": [
      "groupBy(...).applyInPandasでキーとグループのpandas DataFrameを関数へ渡す",
      "mapInPandasで各バッチ内だけをgroupByする",
      "Sparkの組み込みmeanを通常のaggで呼ぶ",
      "列のSeriesを受け取って平均のスカラーを返すpandas UDFをaggで使う"
    ],
    "explanation": "グループ全体をpandas DataFrameとして独自関数へ渡すのはapplyInPandasです。mapInPandasのバッチ単位処理や、Seriesを受け取る集約UDFとは入力と戻り値が異なります。",
    "reasons": [
      "キーとグループ全体を受け取り、指定スキーマの結果を返せます。",
      "同じキーが複数バッチに分かれると、グループ全体を処理できません。",
      "平均は求められますが、独自関数へグループのDataFrameを渡す要件とは異なります。",
      "入力はSeries、結果はスカラーの集約で、グループのDataFrameを返す方式ではありません。"
    ]
  },
  "PASTED-SPARK-20261024-105": {
    "stem": "10パーティションあるdfにdf.coalesce(20)を適用すると、結果のパーティション数はいくつですか。",
    "options": [
      "10",
      "エグゼキューター数と同じ",
      "1",
      "20"
    ],
    "explanation": "coalesceは、シャッフルせずに既存パーティションをまとめる操作であり、数を増やせません。増やす場合はrepartitionを使います。",
    "reasons": [
      "指定値が現在より大きいため、元の10のままです。",
      "エグゼキューター数へ自動的に合わせる操作ではありません。",
      "coalesce(1)を指定した場合とは異なります。",
      "coalesceでは10から20へ増やせません。"
    ]
  },
  "PASTED-SPARK-20261024-106": {
    "stem": "DataFrameにfilter・select・groupBy・coalesceを使います。通常、集約時にシャッフルを伴うのはどれですか。",
    "options": [
      "groupBy",
      "filter",
      "select",
      "coalesce"
    ],
    "explanation": "groupByによる集約では、同じキーの行を同じ処理先へ集めます。ネットワーク越しの再分配が必要になる代表的な操作です。",
    "reasons": [
      "キーごとの集約で通常シャッフルが起こります。",
      "各パーティション内で条件を判定できます。",
      "通常の列選択だけなら再分配は不要です。",
      "coalesceは既存パーティションをまとめ、通常はシャッフルしません。"
    ]
  },
  "PASTED-SPARK-20261024-107": {
    "stem": "df_userから個人情報列first_name・last_name・email・birthdateを取り除き、新しいdf_user_non_piiを作るコードはどれですか。",
    "options": [
      "dropに4つの列名をそれぞれ文字列で渡す",
      "dropでfirst_nameだけを文字列にし、残りは未定義の変数として渡す",
      "DataFrameのdropfieldsに4つの列名を渡す",
      "dropfieldsに4つの列名を連結した1つの文字列を渡す"
    ],
    "explanation": "最上位の列を削除するDataFrameのAPIはdropです。列名をそれぞれ文字列で指定すると、元のDataFrameを変更せず、対象列のない新しいDataFrameが返ります。",
    "reasons": [
      "4つの列を正しく除外します。",
      "残りの名前が列名文字列ではなく、Python変数として評価されます。",
      "DataFrameの最上位列を除くAPI名はdropです。",
      "API名が誤りで、列名も1つの文字列に連結されています。"
    ]
  },
  "PASTED-SPARK-20261024-108": {
    "stem": "Spark DataFrameのcache()とpersist()の違いはどれですか。",
    "options": [
      "どちらもcacheの呼び出しで任意のストレージレベルを指定できる",
      "persistの既定はDISK_ONLYなので必ずcacheより速い",
      "persistが既定レベルを使い、cacheが任意のレベルを指定できる",
      "cacheは既定のMEMORY_AND_DISK_DESERを使い、persistは別のレベルも指定できる"
    ],
    "explanation": "DataFrame.cache()は既定の保存レベルを使う簡単な指定です。persist(StorageLevel...)は保存レベルを選べます。RDDのcacheの既定値と混同しないようにします。",
    "reasons": [
      "cacheはストレージレベルを引数に取るAPIではありません。",
      "persistの既定はDISK_ONLYではなく、常に高速とも限りません。",
      "レベルを指定できるAPIが逆です。",
      "DataFrameの既定値とpersistの使い分けが正しい説明です。"
    ]
  },
  "PASTED-SPARK-20261024-109": {
    "stem": "SparkドライバーのログにGC overhead limit exceededが繰り返し出て、メモリ不足で失敗します。提示された対策のうち適切なものはどれですか。",
    "options": [
      "DataFrameをrepartitionするだけで対処する",
      "ガベージコレクションを無効にする",
      "ドライバーに割り当てるメモリを増やす",
      "大きなDataFrameをさらにメモリへキャッシュする"
    ],
    "explanation": "どのプロセスでメモリ不足かを見ます。この設問はドライバーなので、ドライバーメモリの増量が候補です。実務ではcollectなどで集めるデータ量も減らせないか確認します。",
    "reasons": [
      "分散側の分割変更だけでドライバーのヒープ不足が解消するとは限りません。",
      "GCを無効にしてメモリ不足を解消するという対策ではありません。",
      "不足しているプロセスにメモリを割り当てる対策です。",
      "キャッシュを増やすだけでは、ドライバーのメモリ不足の解決になりません。"
    ]
  },
  "PASTED-SPARK-20261024-110": {
    "stem": "/file/test_data.orcからcol1とcol2だけを使い、不要な列の読み取りを抑えたい場合、有効なコードを2つ選んでください。",
    "options": [
      "col1='value'で行を絞り、col2だけselectする",
      "read.format('orc')の直後、load前にselectする",
      "read.orc(...)でDataFrameを作り、col1とcol2をselectする",
      "read.format('orc').load(...)でDataFrameを作り、col1とcol2をselectする"
    ],
    "explanation": "read.orcとformat('orc').loadは、どちらもDataFrameを返します。その後のselectにより、最適化で不要な列の読み取りを省く列プルーニングが可能です。",
    "reasons": [
      "必要なcol1を結果から除き、指定のない行条件も加えています。",
      "selectはDataFrameのAPIで、読み込み前のReaderには使えません。",
      "短縮形の読み込みAPIを使う有効な方法です。",
      "formatとloadを組み合わせた、同じく有効な方法です。"
    ]
  },
  "PASTED-SPARK-20261024-111": {
    "stem": "DataFrameの変換を定義しても、すぐに処理が始まりません。この動作を説明する特徴を2つ選んでください。",
    "options": [
      "変換を実行するには手作業でエンジンを起動する必要がある",
      "アクションが変換パイプラインの実行を要求する",
      "変換は依存関係を作るため即座に実行される",
      "変換のたびに計画最適化が終わるまで処理を遅らせる",
      "変換は遅延評価される"
    ],
    "explanation": "変換では処理の計画を組み立て、結果が必要になるアクションで計算を実行します。『遅いから始まらない』のではなく、遅延評価という実行モデルです。",
    "reasons": [
      "通常のアクションを呼べばよく、手動でコンパイル・起動する手順は不要です。",
      "showやcollectなどが、必要な計算を要求します。",
      "依存関係は記録しますが、各変換の全データ処理を即実行はしません。",
      "実行が始まらない本質的な理由を正しく表していません。",
      "アクションまで処理を遅らせる性質を表します。"
    ]
  },
  "PASTED-SPARK-20261024-112": {
    "stem": "Structured Streamingを障害や計画停止の後に、以前の進捗を使って再開できるようにする方法はどれですか。",
    "options": [
      "readStreamにcheckpointLocationを設定する",
      "SparkSessionにrecoveryLocationを設定する",
      "writeStreamにrecoveryLocationを設定する",
      "writeStreamにcheckpointLocationを設定する"
    ],
    "explanation": "ストリーミングクエリの出力側でcheckpointLocationを指定します。再開時も同じ適切なチェックポイントを使うことで、オフセットや状態の復旧に利用できます。",
    "reasons": [
      "クエリのチェックポイントを指定する場所はwriteStreamです。",
      "この用途の設定キーはrecoveryLocationではありません。",
      "設定場所は出力側ですが、キー名が誤っています。",
      "クエリの復旧情報を保存する正しい設定です。"
    ]
  },
  "PASTED-SPARK-20261024-113": {
    "stem": "storesDFのmanagerName列を大文字へ変換し、同じ列名で置き換える有効なコードを2つ選んでください。変数として定義済みなのはstoresDFだけで、必要な関数は利用できるものとします。",
    "options": [
      "upper(managerName)をwithColumnへ渡す",
      "toupper(col('managerName'))を渡す",
      "upper(col('managerName'))を渡す",
      "col('managerName').upper()を渡す",
      "upper('managerName')を渡す"
    ],
    "explanation": "upperはColumn式と列名文字列のどちらも受け付けます。文字列を渡したときは、文字列そのものを大文字にするのではなく、指定名の列に関数を適用します。",
    "reasons": [
      "引用符がなく、未定義のPython変数を参照します。",
      "Sparkの関数名はtoupperではなくupperです。",
      "Column式を渡す有効な書き方です。",
      "upperはColumnのメソッドとしては呼びません。",
      "列名文字列を渡す有効な書き方です。"
    ]
  },
  "PASTED-SPARK-20261024-114": {
    "stem": "Python関数assessPerformanceからUDFを作り、storesDFのcustomerSatisfaction列に適用します。戻り値型は明示せず、既定のStringTypeを使う場合の空欄の組み合わせはどれですか。",
    "options": [
      "udfに関数とIntegerType()を渡し、作ったUDFを対象列へ適用する",
      "udfに関数だけを渡し、作ったUDFをcol('customerSatisfaction')へ適用する",
      "spark.register.udfを使い、元の関数を対象列へ適用する",
      "spark.register.udfに関数とIntegerType()を渡す",
      "spark.register.udfに関数を渡し、作ったUDFを列名へ適用する"
    ],
    "explanation": "udf(関数)でUDFを作り、その戻り値を列へ適用します。戻り値型を省略した場合はStringTypeです。IntegerTypeを明示する選択肢は設問の条件に合いません。",
    "reasons": [
      "整数型を明示しているため、既定の文字列型を使う条件に反します。",
      "UDFの作成と列への適用が正しく、型の省略条件も満たします。",
      "spark.register.udfという呼び方は正しくありません。",
      "登録APIの呼び方が誤りで、型も明示しています。",
      "登録APIの呼び方が誤っています。"
    ]
  },
  "PASTED-SPARK-20261024-115": {
    "stem": "DataFrameをMEMORY_AND_DISKレベルで永続化しましたが、全体はメモリに収まりません。想定される動作はどれですか。",
    "options": [
      "全データをメモリとディスクへ二重保存し、入らなければ全体をディスクだけに置く",
      "必ず半分ずつメモリとディスクに置く",
      "メモリに収まる分を保持し、残りのパーティションをディスクに置く",
      "利用頻度の高い行だけをメモリへ自動分類する"
    ],
    "explanation": "MEMORY_AND_DISKは、メモリに保持できないパーティションをディスクへ保存します。行ごとの利用頻度で自動分類する仕組みではありません。",
    "reasons": [
      "必ず二重保存したり、全体をディスクへ移したりする意味ではありません。",
      "均等な比率に分ける保証はありません。",
      "メモリに入らない分もディスクに保持し、再利用できます。",
      "保存の単位と判断が、この説明とは異なります。"
    ]
  },
  "PASTED-SPARK-20261024-116": {
    "stem": "storesDFをfilePathへJSON形式で保存し、既存データがあれば上書きするコードはどれですか。",
    "options": [
      "writeを関数として呼び、source='json'を渡す",
      "write.mode('overwrite').json(filePath)を使う",
      "write.mode('overwrite').path(filePath)を使う",
      "write.option('json','overwrite').path(filePath)を使う"
    ],
    "explanation": "writeでWriterを取得し、modeで既存時の動作、jsonで出力形式とパスを指定します。APIの役割を順にたどると選べます。",
    "reasons": [
      "DataFrame.writeはこのように引数を渡して呼ぶ関数ではありません。",
      "形式・上書きモード・保存先が正しく指定されています。",
      "DataFrameWriterにこの用途のpathメソッドはありません。",
      "形式と保存モードの指定方法が誤りです。"
    ]
  },
  "PASTED-SPARK-20261024-117": {
    "stem": "storesDFを左側にし、storeId列でemployeesDFと左外部結合するコードはどれですか。",
    "options": [
      "join(employeesDF,'left',col('storeId'))",
      "join(employeesDF,'storeId')",
      "join(employeesDF,'storeId','left')",
      "merge(employeesDF,'left',col('storeId'))",
      "join(employeesDF,'left',storesDF.storeId == employeesDF.storeId)"
    ],
    "explanation": "joinの基本形はjoin(相手, 条件または列名, 結合の種類)です。leftを指定すると、右側に一致がなくても左側の行を残します。",
    "reasons": [
      "結合条件と結合の種類の位置が逆です。",
      "結合の種類を省略すると既定はinnerです。",
      "共通キーとleftを正しい位置に指定しています。",
      "PySpark DataFrameのこの用途のAPIはjoinです。",
      "第2引数がキー、第3引数が結合種類という順番になっていません。"
    ]
  },
  "PASTED-SPARK-20261024-118": {
    "stem": "storesDFはStringTypeの列を1つだけ持ち、filePathはまだ存在しません。テキストファイルとして保存するコードはどれですか。",
    "options": [
      "storesDF.write(filePath)",
      "storesDF.write.path(filePath)",
      "storesDF.write().text(filePath)",
      "storesDF.write.text(filePath)",
      "storesDF.write.option('text').path(filePath)"
    ],
    "explanation": "writeはプロパティでWriterを取得し、text(path)でテキスト形式に保存します。テキスト出力には、文字列型の列が1つという条件が必要です。",
    "reasons": [
      "write自体を関数として呼ぶ書き方ではありません。",
      "この用途のpathメソッドはありません。",
      "writeの後の括弧が不要です。",
      "設問の単一文字列列という条件で有効です。",
      "optionにはキーと値が必要で、形式と保存先の指定も誤っています。"
    ]
  },
  "PASTED-SPARK-20261024-119": {
    "stem": "事前定義済みのスキーマ変数schemaでCSVを読みたいのに、spark.read.schema('schema').csv(filePath)と書きました。誤りはどれですか。",
    "options": [
      "文字列'schema'はスキーマ変数ではなく、この例では有効なDDLでもない。変数schemaを渡す必要がある",
      "DataFrameReaderにはcsvメソッドがない",
      "spark.readの直後に括弧が必要",
      "sparkにはreadがなく、DataFrameに置き換える必要がある",
      "schemaにはColumnを渡す必要がある"
    ],
    "explanation": "schemaと'schema'は別物です。前者は変数の値、後者は文字列です。ただしschema API自体はStructTypeだけでなく、有効なDDL文字列も受け付けます。",
    "reasons": [
      "変数と文字列の違いを正しく指摘しています。",
      "csvはDataFrameReaderの有効な読み込みメソッドです。",
      "spark.readはプロパティでReaderを取得します。",
      "SparkSessionにはreadプロパティがあります。",
      "受け付けるのはStructTypeやDDL文字列で、Columnではありません。"
    ]
  },
  "PASTED-SPARK-20261024-120": {
    "stem": "別の分散クラスターを使わず、単一マシンでドライバーとタスクを動かす実行モードはどれですか。",
    "options": [
      "Standardモード",
      "Clusterモード",
      "Localモード",
      "どの選択肢でもエグゼキューターは単一ワーカーに限定される",
      "Clientモード"
    ],
    "explanation": "localモードでは、1台のマシン内でSparkを実行します。clientとclusterは主にドライバーの配置の違いで、単一マシン実行を意味しません。",
    "reasons": [
      "この分類の正式な実行モード名ではありません。",
      "ドライバーをクラスター側へ配置するモードです。",
      "単一マシンでの実行という条件に一致します。",
      "分散クラスターでは複数ワーカーを使用できます。",
      "ドライバーがクライアント上で動くという意味で、タスクは分散実行できます。"
    ]
  },
  "PASTED-SPARK-20261024-121": {
    "stem": "sqft列を昇順に並べ、nullを先頭へ置く有効なコードを2つ選んでください。",
    "options": [
      "col('sqft').asc_nulls_last()でorderByする",
      "asc_nulls_first(col('sqft'))でorderByする",
      "col('sqft').asc().nulls_first()でorderByする",
      "col('sqft').asc_nulls_first()でorderByする",
      "col('sqft').nulls_first()でorderByする"
    ],
    "explanation": "asc_nulls_firstには関数版とColumnメソッド版があります。昇順・降順と、nullを先頭・末尾のどちらに置くかをまとめて指定します。",
    "reasons": [
      "nullを末尾にするため、要件と逆です。",
      "関数版の有効な書き方です。",
      "asc()にnulls_first()をつなげるAPIではありません。",
      "Columnメソッド版の有効な書き方です。",
      "nulls_first単独というColumnメソッドはありません。"
    ]
  },
  "PASTED-SPARK-20261024-122": {
    "stem": "Spark DataFrameの指定列の欠損値を埋める、同等な2つのAPIを両方挙げた選択肢はどれですか。",
    "options": [
      "DataFrame.na.fill()だけ",
      "DataFrame.nafill()だけ",
      "DataFrame.fillna()だけ",
      "DataFrame.na.fill()とDataFrame.nafill()",
      "DataFrame.na.fill()とDataFrame.fillna()"
    ],
    "explanation": "fillnaとna.fillは同じ用途の別名です。単に有効なAPIを1つ選ぶのではなく、『同等な2つを両方挙げる』という設問の条件を読み取ります。",
    "reasons": [
      "有効ですが、2つを両方挙げてはいません。",
      "nafillというAPI名はありません。",
      "有効ですが、もう一方の別名が含まれていません。",
      "nafillが誤りです。",
      "両方とも有効で、同じ欠損値補完を行います。"
    ]
  },
  "PASTED-SPARK-20261024-123": {
    "stem": "全列が同じ重複行を取り除き、各行が一意になる新しいDataFrameを返すコードはどれですか。",
    "options": [
      "storesDF.getDistinct()",
      "storesDF.duplicates.drop()",
      "storesDF.removeDuplicates()",
      "storesDF.distinct()",
      "storesDF.duplicates()"
    ],
    "explanation": "distinct()は全列を比較して同一行を1行にまとめます。特定のキーだけで重複を判定したい場合はdropDuplicatesにキーを指定します。",
    "reasons": [
      "この名前のAPIはありません。",
      "duplicatesという属性からdropする構文ではありません。",
      "正しい類似API名はdropDuplicatesです。",
      "全列一致の重複を除く有効なAPIです。",
      "この名前のAPIはありません。"
    ]
  },
  "PASTED-SPARK-20261024-124": {
    "stem": "小さいstoresDFと、はるかに大きいemployeesDFをstoreIdで結合します。効率的なブロードキャスト結合を指定するコードはどれですか。",
    "options": [
      "大きいemployeesDFをbroadcastしてstoresDFへ結合する",
      "結合した結果全体をbroadcastで包む",
      "逆順で結合した結果全体をbroadcastで包む",
      "小さいstoresDFをbroadcastしてemployeesDFへ結合する",
      "storesDF.broadcastJoin(...)を使う"
    ],
    "explanation": "ブロードキャストするのは十分小さい入力側です。各エグゼキューターへ配布して、大きい側を結合キーでシャッフルする負担を抑えます。",
    "reasons": [
      "大きい側を複製するため、メモリや転送量の面で不利です。",
      "結合の入力にヒントを付ける必要があり、結果を包んでも意図の指定になりません。",
      "同様に、入力側ではなく結果にヒントを付けています。",
      "小さい側を明示的に配布する正しい指定です。",
      "この名前のDataFrameメソッドはありません。"
    ]
  },
  "PASTED-SPARK-20261024-125": {
    "stem": "Spark DataFrameの全行をドライバーへ返す操作はどれですか。",
    "options": [
      "count()",
      "head()",
      "collect()",
      "show()",
      "take()"
    ],
    "explanation": "全行をRowのリストとして返すのはcollect()です。大きい結果を集めるとドライバーのメモリ不足につながるため、必要な行数ならtakeなどを使い分けます。",
    "reasons": [
      "返すのは行数です。",
      "既定では先頭の1行など、指定した範囲を返します。",
      "全行をドライバーへ取得します。",
      "行を表示する操作で、全行のリストを返しません。",
      "取得する件数の指定が必要で、全行取得のAPIではありません。"
    ]
  },
  "PASTED-SPARK-20261024-126": {
    "stem": "storesDFとemployeesDFをstoreIdとemployeeIdの両方で内部結合したい場合、その結果を正しく返せないコードはどれですか。",
    "options": [
      "onに[col('storeId'),col('employeeId')]を渡す",
      "左右それぞれの列を比較する2つの等価条件をリストで渡す",
      "onに['storeId','employeeId']を渡す",
      "別名s・eを付け、各キーの等価条件をリストで渡す",
      "列名リストと'inner'を渡す"
    ],
    "explanation": "列名の文字列リストなら共通キーの結合になります。一方、Column式を渡す場合は、左右の列を比較する真偽値の条件式が必要です。",
    "reasons": [
      "列参照だけで比較条件になっておらず、同名列も曖昧になります。",
      "両方のキーを比較する有効な結合条件です。",
      "同名の2列を共通キーにする有効な指定です。",
      "別名で左右を区別した有効な条件です。",
      "既定でもinnerですが、明示しても有効です。"
    ]
  },
  "PASTED-SPARK-20261024-127": {
    "stem": "複数ノードのclusterモードで、ドライバー専用ノードと、エグゼキューターを置く別のワーカーノードがあるとします。この前提に反する説明はどれですか。",
    "options": [
      "ドライバーは専用ノードで動き、そのノードにはエグゼキューターがない",
      "エグゼキューターはワーカー内で処理する",
      "構成によりノード数とエグゼキューター数は一致しないことがある",
      "この設問のクラスターには複数ノードがある",
      "ドライバーとすべてのエグゼキューターが単一ノードにある"
    ],
    "explanation": "一般論だけでなく、設問が置いた構成の前提で判断します。ここではドライバー専用ノードと別ワーカーがあるため、すべてが同じ1台という説明が誤りです。",
    "reasons": [
      "設問で明示した構成と一致します。",
      "ワーカー上でタスクを実行する役割と合っています。",
      "1ノードに複数配置するなど、必ず1対1になるわけではありません。",
      "複数ノードと明記された、この設問の前提に合います。",
      "専用ドライバーノードと別ワーカーという前提に反します。"
    ]
  },
  "PASTED-SPARK-20261024-128": {
    "stem": "storesDFにnumberOfManagers列を追加し、全行へ整数の1を入れます。空欄を正しく埋める組み合わせはどれですか。",
    "options": [
      "withColumn・'numberOfManagers'・lit・整数1",
      "withColumn・'numberOfManagers'・IntegerType・整数1",
      "newColumn・変数numberOfManagers・IntegerType・整数1",
      "withColumn・'numberOfManagers'・col・整数1",
      "withColumn・'numberOfManagers'・lit・文字列'1'"
    ],
    "explanation": "定数をColumn式にするにはlitを使います。lit(1)は整数、lit('1')は文字列なので、値が似ていても型の条件で区別します。",
    "reasons": [
      "withColumn('numberOfManagers',lit(1))となり、要件を満たします。",
      "IntegerTypeは型の定義で、定数の列式を作りません。",
      "newColumnというAPIではなく、列名も文字列にする必要があります。",
      "colは既存列を参照する関数で、定数を作りません。",
      "作成される値が文字列となり、整数の条件に合いません。"
    ]
  },
  "PASTED-SPARK-20261024-129": {
    "stem": "Spark DataFrameを並べ替える有効な別名APIを、両方挙げた選択肢はどれですか。",
    "options": [
      "sort()とorderBy()",
      "orderBy()だけ",
      "sort()だけ",
      "sort()とorderby()",
      "orderby()だけ"
    ],
    "explanation": "sortとorderByは同等の並べ替えAPIです。Pythonでは大文字小文字を区別するため、orderByのBを小文字にしたorderbyは別の有効な名前にはなりません。",
    "reasons": [
      "有効な2つの別名がそろっています。",
      "有効ですが、両方を挙げる条件を満たしません。",
      "有効ですが、もう一方が含まれていません。",
      "orderbyの大文字小文字が誤りです。",
      "正しいAPI名はorderByです。"
    ]
  },
  "PASTED-SPARK-20261024-130": {
    "stem": "Apache Sparkの遅延評価の利点として最も適切なものはどれですか。",
    "options": [
      "実行前に一連の変換を把握でき、処理計画を最適化できる",
      "プログラム中の処理を任意に省くので複雑さが減る",
      "小さいタスクを必ず分散しないので高速になる",
      "コンパイルが終わるまで待つだけで失敗しにくくなる",
      "ドライバーとワーカーの通信が増えるので高速になる"
    ],
    "explanation": "遅延評価により、アクション前に必要な変換の流れを把握できます。DataFrameではフィルターの移動や不要列の除去など、全体を見た最適化につながります。",
    "reasons": [
      "遅延評価の主要な利点を説明しています。",
      "必要な処理を任意に省くという意味ではありません。",
      "タスクの大きさだけで実行場所が決まる仕組みではありません。",
      "遅延評価が失敗を防ぐことを保証する説明ではありません。",
      "通信量の増加が高速化の本質ではありません。"
    ]
  },
  "PASTED-SPARK-20261024-131": {
    "stem": "division列をアルファベット昇順に並べたDataFrameを返さないコードはどれですか。",
    "options": [
      "sort(asc('division'))",
      "orderBy(['division'],ascending=[1])",
      "orderBy(col('division').desc())",
      "orderBy('division')",
      "sort('division')"
    ],
    "explanation": "この問題は『返さないもの』を選びます。sortとorderByの既定は昇順ですが、descを付けると降順になり、要求と逆になります。",
    "reasons": [
      "ascを指定しているので昇順です。",
      "1はTrueとして扱われ、この指定は昇順です。",
      "descが降順を指定するため、昇順の要件を満たしません。",
      "既定の昇順になります。",
      "sortも既定では昇順です。"
    ]
  },
  "PASTED-SPARK-20261024-132": {
    "stem": "8パーティションのstoresDFを、シャッフルなしで4パーティションに減らすコードの空欄はどれですか。",
    "options": [
      "storesDF.coalesce()として引数を省略する",
      "storesDF.coalesce(4)",
      "storesDF.coalesce(4,'storeId')",
      "storesDF.coalesce('storeId')"
    ],
    "explanation": "coalesceに減らしたいパーティション数を渡します。キーを指定して再分配するrepartitionとは異なり、coalesceは数を減らすために使います。",
    "reasons": [
      "パーティション数の引数が必要です。",
      "8から4へ、通常シャッフルせずにまとめます。",
      "coalesceはこのように列名を追加指定しません。",
      "必要なのは列名ではなく整数のパーティション数です。"
    ]
  },
  "PASTED-SPARK-20261024-133": {
    "stem": "Apache Sparkのタスクを最も適切に説明するものはどれですか。",
    "options": [
      "エグゼキューター上で実行される、スケジューリングの最小作業単位",
      "同じエグゼキューター内にある複数スロットの集まり",
      "シャッフルなしで実行できる最小の作業単位",
      "実行階層の最上位",
      "データのブロックと変換の組み合わせを指すもの"
    ],
    "explanation": "タスクはスケジューリングされる最小単位で、あるステージの1パーティションに対する処理を担当します。ステージやジョブとの大小関係を押さえます。",
    "reasons": [
      "タスクの位置付けを最も直接的に定義しています。",
      "スロットはタスクを実行する容量で、タスクの集合の定義ではありません。",
      "シャッフルがないことは主にステージの境界に関する説明です。",
      "最上位ではなく、実行単位として最小です。",
      "データのブロックという表現だけでは、パーティションに対する最小実行単位の定義が不明確です。"
    ]
  },
  "PASTED-SPARK-20261024-134": {
    "stem": "SparkのGC負荷を減らす一般的な推奨として、最も根拠が乏しいものはどれですか。",
    "options": [
      "GCがボトルネックならG1GCの利用を検討する",
      "DataFrameなどの構造化APIをできるだけ使う",
      "変換を減らし、アクションを増やす",
      "GC頻度を調べ、オブジェクト生成とヒープ設定を実測で調整する",
      "実測したGCの動きに基づき、若い世代と古い世代の配分を調整する"
    ],
    "explanation": "アクションを増やすこと自体に、GCを減らす一般的な効果はありません。むしろ再計算やドライバーへの転送が増えることもあります。原因を測定して、オブジェクト数やメモリ設定を調整します。",
    "reasons": [
      "状況に応じて評価するGC対策の候補です。",
      "構造化APIは効率的な内部表現を利用でき、メモリ圧力の軽減に役立ちます。",
      "アクションの数とGC削減を直接結び付ける根拠がありません。",
      "測定結果に基づく対策として妥当です。",
      "利用するGC方式の特性も踏まえて、実測で検討する対策です。"
    ]
  },
  "PASTED-SPARK-20261024-135": {
    "stem": "classic PySparkで、クラスター内に分割して保持する分散コレクションであり、DataFrameの.rddプロパティから得られるものはどれですか。",
    "options": [
      "Deltaテーブル",
      "RDD",
      "Pythonのmultiprocessing",
      "Pythonのmultithreading",
      "ベクトル"
    ],
    "explanation": "classic PySparkのDataFrame.rddは、各行をRowとして扱うRDDを返します。Pythonのマルチプロセス機能そのものを指すのではありません。",
    "reasons": [
      "テーブルの保存形式・管理の仕組みであり、.rddの戻り値ではありません。",
      "分散した不変コレクションで、ここではRowのRDDです。",
      "Pythonのプロセス並列化APIであり、Sparkの分散コレクションではありません。",
      "スレッド並列化の仕組みで、.rddの戻り値ではありません。",
      "機械学習などで使う値の表現であり、対象の分散コレクション名ではありません。"
    ]
  },
  "PASTED-SPARK-20261024-136": {
    "stem": "storesDFのsqft列の平均を求め、結果の列名をsqftMeanとする新しいDataFrameを返すコードを2つ選んでください。",
    "options": [
      "withColumnへ列名を付けず、mean(...).alias(...)だけを渡す",
      "aggへcol('sqft').mean().alias(...)を渡す",
      "aggへmean('sqft').alias('sqftMean')を渡す",
      "aggへmean(col('sqft')).alias('sqftMean')を渡す",
      "withColumn('sqftMean',mean(col('sqft')))を使う"
    ],
    "explanation": "全体の平均はaggで集約します。meanは列名文字列とColumn式の両方を受け付け、aliasで結果の列名を指定できます。",
    "reasons": [
      "withColumnには列名と式が必要で、全体集約の書き方にもなっていません。",
      "meanはColumnのメソッドとしてではなく、関数として呼びます。",
      "列名文字列を使う有効な集約です。",
      "Column式を使う有効な集約です。",
      "通常の列追加だけで全体平均を集約する書き方ではありません。"
    ]
  },
  "PASTED-SPARK-20261024-137": {
    "stem": "storesDF.join(employeesDF,'storeId')で外部結合を行いたいとします。このコードで不足している指定はどれですか。",
    "options": [
      "howの既定はinnerなので、outerを明示する必要がある",
      "storeIdを必ずcolで包む必要がある",
      "必ず左右の列の等価条件を書く必要がある",
      "storeIdを必ずリストにする必要がある",
      "joinは存在しないのでmergeに変更する必要がある"
    ],
    "explanation": "joinは結合種類を省略すると内部結合です。一致しない左右の行も残す外部結合にするには、how='outer'などを明示します。",
    "reasons": [
      "不足している結合種類の指定を正しく指摘しています。",
      "共通キーは列名文字列で指定できます。",
      "列名を使う書き方も有効なので、条件式への変更は必須ではありません。",
      "1列なら文字列のままで有効です。",
      "DataFrame.joinは有効なAPIです。"
    ]
  },
  "PASTED-SPARK-20261024-138": {
    "stem": "storesDFのopenDateは1970年1月1日からの経過秒を表す整数です。年の何日目かを表すdayOfYear列を追加するには、掲載されたコードのどの行をつなげますか。",
    "options": [
      "3行目でDateに変換し、6行目のget_dayofyearを使う",
      "2行目で整数へ直接dayofyearを使う",
      "3行目でDateに変換し、5行目でdayofyearを使う",
      "1行目でTimestampに変換し、6行目のget_dayofyearを使う",
      "1行目でTimestampに変換し、4行目でdayofyearを使う"
    ],
    "explanation": "epoch秒はまずTimestampに変換し、その列からdayofyearを取得します。整数をDateへ直接変換することや、存在しないget_dayofyearとの取り違えに注意します。",
    "reasons": [
      "整数のDateへの直接変換と関数名が不適切です。",
      "epoch秒の整数をそのまま日付関数へ渡していませんか。先に時刻へ変換します。",
      "整数からDateへの直接変換が適切ではありません。",
      "作成していない列を参照し、関数名も誤っています。",
      "Timestamp化してから、その列にdayofyearを適用します。"
    ]
  },
  "PASTED-SPARK-20261024-139": {
    "stem": "storesDFのopenDateはUNIX epoch秒の整数です。この列から数値の月を取り出すmonth列を追加する正しいコードはどれですか。",
    "options": [
      "整数のopenDateへgetMonthを直接適用する",
      "openDateをTimestampに変換し、その列へmonthを適用する",
      "整数のopenDateへmonthを直接適用する",
      "整数の文字列表現の4文字目から2文字を抜き出す",
      "openDateをDateへ直接castし、その列へmonthを適用する"
    ],
    "explanation": "epoch秒をTimestampへ変換してからmonth関数を使います。秒数の数字の並びは年月日の文字列ではないため、部分文字列で月は取り出せません。",
    "reasons": [
      "正しい関数名はmonthで、入力も時刻へ変換する必要があります。",
      "経過秒を時刻として解釈してから月を取得します。",
      "整数をそのまま渡しても、意図したepoch秒の変換になりません。",
      "epoch秒の桁位置に月が入っているわけではありません。",
      "整数からDateへの直接castではなく、Timestampへの変換を挟みます。"
    ]
  },
  "PASTED-SPARK-20261024-140": {
    "stem": "掲載のコードは、SparkSessionを作成し、DataFrameへ定数列を追加してAge>35の行を表示します。このアプリケーションでドライバーが担う主な役割はどれですか。",
    "options": [
      "実行計画とタスクを調整し、ワーカーへ処理を割り当てる",
      "監視用UIを提供することだけ",
      "全DataFrameを保持し、すべての計算をローカル実行する",
      "ワーカーの計算後に最終出力を保存することだけ"
    ],
    "explanation": "ドライバーはアプリケーションの制御役です。showなどのアクションを受けて実行を調整し、エグゼキューターへタスクを割り当てます。",
    "reasons": [
      "計画・スケジューリング・実行調整という中心的な役割です。",
      "UIも提供しますが、それだけが役割ではありません。",
      "分散計算のデータ処理は主にエグゼキューターが行います。",
      "すべての出力をドライバーへ保存するとは限りません。"
    ]
  },
  "PASTED-SPARK-20261024-141": {
    "stem": "図のデータを継続的に受け取るStructured Streamingのstreaming_dfがあります。対応している変換はどれですか。",
    "options": [
      "NameのcountDistinctをselectする",
      "IdでgroupByしてcountする",
      "timestampで全体を並べ、limit(4)する",
      "条件でfilterした後、show()を直接呼ぶ"
    ],
    "explanation": "ストリーミングでもキー別のcountなどの集約は可能です。実際の実行にはwriteStreamを使い、集約に合う出力モードを選びます。通常のバッチ用アクションを直接使うことはできません。",
    "reasons": [
      "ストリーミングの厳密なdistinct集約には制約があります。",
      "サポートされるキー別の集約です。",
      "無限に届くストリームの一般的な全体ソートとlimitは、この形では対応しません。",
      "filterは使えても、streaming DataFrameへ直接showは呼べません。"
    ]
  },
  "PASTED-SPARK-20261024-142": {
    "stem": "翻訳モデルを毎回ロードするSeries→Seriesのpandas UDFが遅くなっています。ロード回数を減らす適切な変更はどれですか。",
    "options": [
      "通常の行単位Python UDFに変える",
      "Series→Scalarの集約UDFに変える",
      "同じ処理本体をそのままmapInPandasで呼ぶ",
      "Iterator[Series]→Iterator[Series]のpandas UDFに変える"
    ],
    "explanation": "Iterator型なら、複数バッチを処理する反復の前にモデルを初期化し、各Seriesで再利用できます。型だけでなく、関数本体もiteratorを処理する形に変更します。",
    "reasons": [
      "行単位に変えるだけではモデルの初期化コストを減らせません。",
      "行ごとの翻訳を集約値へ変えるため、処理の意味が変わります。",
      "初期化位置を変えずにAPIだけ置き換えても、再利用は実現しません。",
      "反復処理の外側で初期化し、複数バッチで使い回せます。"
    ]
  },
  "PASTED-SPARK-20261024-143": {
    "stem": "購入履歴purch_dfを顧客マスターcust_dfと内部結合すると、マスターにない顧客の購入行が消えました。購入履歴の行を残すための変更はどれですか。",
    "options": [
      "purch_dfを左側にしてleft結合する",
      "表の順を逆にするだけで、結合種類は省略する",
      "等価条件の左右を逆にするだけ",
      "purch_dfを左側にしてright_outer結合する"
    ],
    "explanation": "残したいのは購入履歴側の全行なので、purch_dfを左側にしたleft結合を使います。マスターに一致しない行では、マスター側の列がnullになります。",
    "reasons": [
      "購入履歴の不一致行も残せます。",
      "既定のinnerのままなので、不一致行は残りません。",
      "等価条件を逆にしても、innerの結果は変わりません。",
      "右側の顧客マスターを残す指定で、購入履歴の全行保持にはなりません。"
    ]
  },
  "PASTED-SPARK-20261024-144": {
    "stem": "小さい地域テーブルから、regionをキー、region_idを値とするPython辞書を作ります。region_idが小さい3件だけを含めるコードはどれですか。",
    "options": [
      "region・region_idの順にselectし、ID昇順でtake(3)してdictへ渡す",
      "region_id・regionの順にselectし、ID昇順でtake(3)してdictへ渡す",
      "region_id・regionの順にselectし、並べずlimit(3).collectする",
      "region・region_idの順にselectし、ID降順でtake(3)してdictへ渡す"
    ],
    "explanation": "dictへ渡す2要素の順番はキー→値です。regionを先にし、region_idの昇順で3行を取得すれば、IDが0・1・2の地域が辞書になります。",
    "reasons": [
      "キーの向きと、最小3件という条件の両方を満たします。",
      "辞書がregion_id→regionとなり、向きが逆です。",
      "辞書の向きが逆で、最小3件である保証もありません。",
      "最大の3件を取るため、要求と逆です。"
    ]
  },
  "PASTED-SPARK-20261024-145": {
    "stem": "devices.jsonを読み、devicesという一時ビューを登録しました。SQLでnameとplatformを選び、names.parquetというパスへParquet保存します。X・Y・Zは何ですか。",
    "options": [
      "devices_df・write・save",
      "devices・save・write",
      "devices・write・saveAsTable",
      "devices・write・save"
    ],
    "explanation": "SQLのFROMにはPython変数名ではなく、登録したビュー名devicesを使います。結果はDataFrameなので、write.saveでパスへ保存します。",
    "reasons": [
      "SQLから参照する名前は登録したdevicesです。",
      "Writer取得のwriteと、保存するsaveの順番が逆です。",
      "saveAsTableはテーブル名として登録するAPIで、パス保存の要件に合いません。",
      "ビュー名・Writer・パスへの保存という順番が正しい指定です。"
    ]
  },
  "PASTED-SPARK-20261024-146": {
    "stem": "pyspark.pandas.DataFrameのpsdfを、通常のpyspark.sql.DataFrameへ変換するメソッドはどれですか。",
    "options": [
      "psdf.to_spark()",
      "psdf.to_pyspark()",
      "psdf.to_pandas()",
      "psdf.to_dataframe()"
    ],
    "explanation": "pandas API on Sparkから通常のSpark DataFrameへの変換はto_sparkです。to_pandasはローカルのpandasへ集める別の操作です。",
    "reasons": [
      "指定したSpark DataFrame型へ変換します。",
      "この名前の変換メソッドではありません。",
      "通常のpandas DataFrameになり、型の要件と異なります。",
      "対象のAPI名ではありません。"
    ]
  },
  "PASTED-SPARK-20261024-147": {
    "stem": "掲載のdf1とdf2を、idとnameの両方が一致する行だけで内部結合します。joinのXへ入れる条件はどれですか。",
    "options": [
      "id同士の等価条件とname同士の等価条件を&で結ぶ",
      "id同士の等価条件だけ",
      "共通キーに['id','dept']を指定する",
      "共通キーに['id']だけを指定する"
    ],
    "explanation": "複数のColumn条件をANDで結ぶには、それぞれを括弧で囲んで&を使います。idだけなら、名前が異なる行まで一致してしまいます。",
    "reasons": [
      "2つの一致条件を両方要求できます。",
      "同じidで名前が異なる行も結合されます。",
      "deptは両方の共通列ではなく、要求されたnameでもありません。",
      "nameの一致条件が抜けています。"
    ]
  },
  "PASTED-SPARK-20261024-148": {
    "stem": "event_tsからevent_year・event_monthを作り、Parquetテーブルへ保存します。利用者は主に年・月の列を直接filterします。現在のbucketByをどう変えると、不要なディレクトリの読み取りを省けますか。",
    "options": [
      "event_yearだけのpartitionByに変える",
      "event_yearとevent_month両方のpartitionByに変える",
      "バケット数だけを減らす",
      "bucketByの後へevent_monthのsortByを加える"
    ],
    "explanation": "年・月をパーティション列として保存し、その列を条件にするとパーティションプルーニングを使えます。bucketByのハッシュ分割と、partitionByのディレクトリ分割を区別します。",
    "reasons": [
      "年の絞り込みには役立ちますが、月のディレクトリ分割がありません。",
      "両方の絞り込み条件で不要なパーティションを省けます。",
      "バケット数の変更だけでは、年・月ごとのディレクトリになりません。",
      "バケット内の並び替えであり、年・月のパーティション分割ではありません。"
    ]
  },
  "PASTED-SPARK-20261024-149": {
    "stem": "Parquetファイルが/path/events/data/2024/01/01など、年/月/日の階層に届きます。year=2024のようなHive形式ではありません。配下の全ファイルを読み込む適切な指定はどれですか。",
    "options": [
      "inferSchema=trueで基点ディレクトリを読む",
      "recursiveFileLookup=trueで基点ディレクトリを読む",
      "基点直下の*だけを指定して読む",
      "追加設定なしで基点を読む"
    ],
    "explanation": "任意の深い階層を再帰的に探索するにはrecursiveFileLookupを使います。year=...形式のパーティション推論とは別で、この指定ではパーティション推論も無効になります。",
    "reasons": [
      "Parquetはスキーマを持ち、この設定で再帰探索が有効になるわけではありません。",
      "下位ディレクトリのファイルを再帰的に読み取ります。",
      "*自体は任意の深さを再帰探索する指定ではありません。",
      "この非Hive形式の階層を確実に全探索する明示指定がありません。"
    ]
  },
  "PASTED-SPARK-20261024-150": {
    "stem": "文字列をSHAKE-256へ変換する通常UDFを、Series→Seriesのpandas UDFへ変更します。本体は各要素をハッシュ化し、同じ長さのSeriesを返す形に直しました。正しい型シグネチャはどれですか。",
    "options": [
      "pd.Seriesを受け取りstrを返す",
      "Iterator[pd.Series]を受け取りIterator[pd.Series]を返す",
      "strを受け取りstrを返す",
      "pd.Seriesを受け取りpd.Seriesを返す"
    ],
    "explanation": "Series→Seriesでは、入力も出力もpandas Seriesです。関数名やデコレーターだけでなく、スカラーのencodeではなく各要素を処理する本体も必要です。",
    "reasons": [
      "出力が単一の文字列となり、同じ長さのSeriesという条件に合いません。",
      "有効な別方式ですが、設問が指定したSeries→Seriesではありません。",
      "元のスカラーUDFの形で、pandas UDFの指定方式に合いません。",
      "入力・出力ともSeriesで、各行に対応する値を返せます。"
    ]
  },
  "PASTED-SPARK-20261024-151": {
    "stem": "ストリーミング集約結果aggDfをconsoleへ出します。毎回のトリガーで集約結果テーブル全体を出力するoutputModeはどれですか。",
    "options": [
      "complete",
      "append",
      "replace",
      "aggregate"
    ],
    "explanation": "completeは、各トリガーで結果テーブル全体を出力します。appendは新しく確定した行、updateは更新された行という違いがあります。",
    "reasons": [
      "集約結果の全体を毎回出すモードです。",
      "既存の集約結果全体を毎回出力する意味ではありません。",
      "Structured Streamingの有効な出力モード名ではありません。",
      "集約操作の名称であり、出力モード名ではありません。"
    ]
  },
  "PASTED-SPARK-20261024-152": {
    "stem": "図のDataFrameからNameとcountを取り出し、countの大きい行から順番に並べます。正しいコードはどれですか。",
    "options": [
      "count・Nameの順にorderByし、ascending=Falseにする",
      "countでorderByし、昇降順を省略する",
      "Name・countの順にsortし、昇降順を省略する",
      "Nameだけでsortする"
    ],
    "explanation": "最優先のキーはcountで、降順を指定します。複数キーは左から優先されるため、Nameを先にすると件数の大小より名前が優先されます。",
    "reasons": [
      "countが主キーの降順になり、Nameは同件数のときの第2キーになります。",
      "既定の昇順となり、小さい件数が先です。",
      "Nameが最優先になり、countも昇順です。",
      "件数による並び替えをしていません。"
    ]
  },
  "PASTED-SPARK-20261024-153": {
    "stem": "図のDataFrameのName列から重複を除き、アルファベット昇順のPythonリストとして返すコードはどれですか。",
    "options": [
      "Nameをselectして昇順に並べるだけ",
      "Nameをselect・distinct・昇順・collectし、各RowからNameを取り出す",
      "Nameをselectしてdistinctするだけ",
      "Nameをdistinctし、降順に並べる"
    ],
    "explanation": "必要な操作は、対象列の選択→重複除去→昇順→ドライバーへ取得→Rowから値を取り出す、の順です。DataFrameを返すだけではPythonリストになりません。",
    "reasons": [
      "重複が残り、戻り値もDataFrameです。",
      "一意性・並び順・Pythonリストという3条件を満たします。",
      "並び順が保証されず、Pythonリストでもありません。",
      "並びが逆で、戻り値もDataFrameのままです。"
    ]
  },
  "PASTED-SPARK-20261024-154": {
    "stem": "JDBC経由でPostgreSQLを読むアプリケーションが、多すぎる接続を開いています。numPartitions=25などが設定されている掲載コードで、同時接続を減らす変更はどれですか。",
    "options": [
      "numPartitionsを25から8へ減らす",
      "upperBoundを10000から100000へ増やす",
      "spark.sql.shuffle.partitionsを8へ減らす",
      "partitionColumnをインデックスのある別列へ変える"
    ],
    "explanation": "JDBCのnumPartitionsは、並列に使うデータベース接続数の上限に関係します。SQLのshuffle.partitionsは、その後のシャッフルの分割数であり、接続数の直接の制限ではありません。",
    "reasons": [
      "JDBC読み取りの並列度と接続数の上限を下げます。",
      "分割の幅が変わりますが、接続数の上限を下げません。",
      "シャッフルの設定であり、JDBC接続数の直接の指定ではありません。",
      "読み取り効率に影響し得ますが、接続数の上限は変えません。"
    ]
  },
  "PASTED-SPARK-20261024-155": {
    "stem": "CSVをテーブルとして読みましたが、区切りの縦棒|を含む行全体が先頭列に入り、他の列がnullになります。先頭行には列名もあります。OPTIONSへ追加する適切な指定はどれですか。",
    "options": [
      "quote='|'",
      "inferSchema='true'",
      "header='true'とsep='|'",
      "header='true'だけ"
    ],
    "explanation": "区切り文字はsep、先頭行を列名として扱う設定はheaderです。型の推論や引用符の変更では、縦棒区切りの読み誤りは直りません。",
    "reasons": [
      "quoteは引用符の指定で、列の区切りを指定するものではありません。",
      "型推論では区切り文字の問題は解消しません。",
      "列の分割とヘッダー行の扱いを両方修正します。",
      "先頭行は除けますが、縦棒での列分割は直りません。"
    ]
  },
  "AUTHORED-SPARK-20261025-ARC-001": {
    "stem": "永続化したRDDの一部のパーティションが、エグゼキューターの障害で失われました。ドライバーと十分な他のエグゼキューターは正常で、元入力も参照可能、変換はすべて決定的です。後のアクションで失った部分が必要になったとき、通常どう復旧しますか。",
    "options": [
      "アプリケーション内の全RDDの全パーティションを必ず最初から計算し直す",
      "失ったレコードをnullに置き換える",
      "失った部分を依存関係から再計算し、残っているキャッシュは再利用する",
      "永続化で障害復旧が無効になるため、再開不能になる"
    ],
    "explanation": "失われたパーティションは、元入力と変換の依存関係（lineage）から再計算できます。残ったキャッシュまで全て捨てる必要はありません。キャッシュは計算結果の再利用であり、依存関係を消す操作ではありません。",
    "reasons": [
      "障害で全アプリケーションの全パーティションを無条件に再計算する規則ではない。",
      "cache喪失をレコードのNULL置換で埋めない。",
      "lineageと元入力が利用可能なら失われたパーティションを再構築する。",
      "persistenceしてもlineageによる障害回復が可能。"
    ]
  },
  "AUTHORED-SPARK-20261025-ARC-002": {
    "stem": "リモートクラスターのRDD.foreachで、ドライバーのPythonリストseenを参照する関数を実行し、各タスクがIDをappendしました。成功終了してもドライバーのリストが空なのはなぜですか。",
    "options": [
      "foreachは変換なので、まだタスクが実行されていない",
      "リストが1000要素未満のときだけ変更が戻る",
      "タスクは直列化された状態のコピーを変更し、ドライバーの元リストを変更しない",
      "Pythonリストの変更にはブロードキャスト結合の有効化が必要"
    ],
    "explanation": "タスクへ送られる関数と変数は、ドライバーとは別プロセスのコピーです。エグゼキューター内でリストを書き換えても、ドライバーの元リストへ変更は戻りません。",
    "reasons": [
      "foreachはactionであり、成功終了までにタスクは実行される。",
      "listの要素数で変更がドライバーへ反映される仕組みはない。",
      "ドライバーとエグゼキューターは別プロセスのためコピーの変更は戻らない。",
      "broadcast joinはPython closureの可変状態共有を有効化しない。"
    ]
  },
  "AUTHORED-SPARK-20261025-ARC-003": {
    "stem": "Scalaの型付きDataset[Order]を使う処理をPythonへ移し、Spark SQLによる構造化データ処理の最適化は維持したいとします。Spark 3.5.6の言語APIに合う移行案はどれですか。",
    "options": [
      "PythonではDataFrameを使う。型付きDataset APIはScalaとJava向けである",
      "Pythonの型注釈で同じ型付きDataset操作をコンパイラーに強制する",
      "PythonにDataFrame APIがないため、すべてRDDへ置き換える",
      "Scalaのencoderをimportし、DataFrame.as(Order)で同じ型付きDatasetを作る"
    ],
    "explanation": "型付きDataset APIがあるのはScalaとJavaです。Pythonではスキーマ付きDataFrameを使えば、Spark SQLの最適化を利用できます。型注釈だけで未提供のDataset APIは追加されません。",
    "reasons": [
      "Python DataFrameとScala/Javaのtyped Datasetという言語API境界を区別する。",
      "Python型注釈を付けても未提供のtyped Dataset APIや静的compiler検査が追加されない。",
      "PySparkにはDataFrame APIがあるため全処理をRDDへ戻す必要はない。",
      "ScalaのencoderやDataFrame.asをPythonへimportして同じtyped Dataset APIを利用することはできない。"
    ]
  },
  "AUTHORED-SPARK-20261025-ARC-004": {
    "stem": "複数ステージから同じ読み取り専用Python辞書を参照します。辞書は各ワーカープロセスのメモリに十分収まります。タスクのクロージャへ毎回辞書全体を含めるより効率よく配布する方法はどれですか。",
    "options": [
      "アキュムレーターへ辞書を入れ、各タスクから累積値を読む",
      "SparkContextのbroadcast変数を作り、タスク内でvalueを読む",
      "Python辞書へDataFrame用のbroadcast結合ヒントを直接付ける",
      "辞書のキーごとに別のSparkSessionを作る"
    ],
    "explanation": "読み取り専用のPython辞書はSparkContext.broadcastで配布し、タスク内で.valueを参照します。Pythonの値を配るbroadcast変数と、DataFrameの結合ヒントは別のAPIです。",
    "reasons": [
      "accumulatorの値を読めるのはドライバーでありlookup共有用ではない。",
      "Pythonの値をbroadcast変数として配布する。",
      "DataFrame join hintはPython辞書をbroadcast変数に変換しない。",
      "sessionをkeyごとに作ってもlookup配布の効率化にならない。"
    ]
  },
  "AUTHORED-SPARK-20261025-ARC-005": {
    "stem": "lookup_bcを使ったアクション後に、lookup_bc.unpersist(blocking=True)を呼びました。destroyは呼ばず、ドライバーのbroadcastオブジェクトも残しています。後のアクションで再びvalueを使うとどうなりますか。",
    "options": [
      "すべてのエグゼキューターから書き込める共有変数になる",
      "unpersistが永久に無効化するため必ず失敗する",
      "値が空の辞書へ変わる",
      "エグゼキューターのキャッシュは削除されるが、必要時には再配布される"
    ],
    "explanation": "unpersistはエグゼキューター上のコピーを削除しますが、broadcastオブジェクト自体を永久に無効化しません。後で必要になれば再転送されます。永久に破棄するdestroyと区別します。",
    "reasons": [
      "read-writeの共有状態に変わることはない。",
      "永久無効化の説明はunpersistではない。",
      "unpersistは論理的なbroadcast valueを書き換えない。",
      "削除後の利用時にはエグゼキューターへ再送される。"
    ]
  },
  "AUTHORED-SPARK-20261025-ARC-006": {
    "stem": "数値アキュムレーターで不正行を数えると同時に、各タスクが現在の全体合計を読み、閾値で停止する仕組みを考えています。アキュムレーターの仕様として正しいものはどれですか。",
    "options": [
      "タスクは加算し、ドライバーが値を読む。タスクが共有の現在値を読む同期カウンターではない",
      "タスクから読むと自動でシャッフルし、全タスクが同期する",
      "値を更新できるのはクラスターマネージャーだけ",
      "すべてのタスクが同じ同期された値を読み書きできる"
    ],
    "explanation": "アキュムレーターはタスクから加算し、ドライバーで結果を読む仕組みです。全タスクが同じ現在値を同期して読む共有カウンターではないため、タスク全体の停止判定には使えません。",
    "reasons": [
      "加算の集約とドライバー側の読取りを分ける。",
      "タスク内読取りをshuffle同期へ自動変換しない。",
      "ワーカー タスクから加算できる。",
      "タスクで共通の現在値を同期読取りする契約ではない。"
    ]
  },
  "AUTHORED-SPARK-20261025-ARC-007": {
    "stem": "同じYARNクラスターで2つの独立したSparkアプリケーションが資源を要求しています。各ドライバーは自分のタスクをスケジュールできます。アプリケーション間でクラスター資源を割り当てるのは何ですか。",
    "options": [
      "YARNなどのクラスターマネージャー",
      "空きヒープが最大のエグゼキューター",
      "先に送信したアプリケーションのDataFrameReader",
      "どちらかのCatalystオプティマイザー"
    ],
    "explanation": "アプリケーション間の資源割り当てはYARNなどのクラスターマネージャーが担当します。各アプリ内のタスク割り当てはドライバー、SQL計画の最適化はCatalystという役割の違いを押さえます。",
    "reasons": [
      "YARN等のクラスターマネージャーが資源を配分する。",
      "エグゼキューターが他アプリケーションへ資源を割り当てる構成ではない。",
      "readerは外部データの読取りAPIでありcluster 資源を割り当てない。",
      "CatalystはSQL plan最適化を担いcluster全体の資源配分をしない。"
    ]
  },
  "AUTHORED-SPARK-20261025-ARC-008": {
    "stem": "AがDataFrameをキャッシュした同じワーカーマシンで、別SparkContextのアプリケーションBが同じパスを読みます。外部キャッシュサービスはありません。BはAのキャッシュをそのまま共有できますか。",
    "options": [
      "できない。そもそも1クラスターでは1アプリケーションしか動かせない",
      "できる。キャッシュは全SparkContextへ自動公開される",
      "DataFrameの変数名が同じならできる",
      "できない。別のエグゼキュ―タープロセスを使い、アプリケーション間共有には外部の仕組みが必要"
    ],
    "explanation": "Sparkアプリケーションごとにエグゼキュータープロセスが分かれます。通常のキャッシュは同じマシンや入力パスというだけでは共有されず、別アプリとの共有には外部の仕組みが必要です。",
    "reasons": [
      "複数アプリケーションの実行自体は可能。",
      "通常のDataFrame cacheが全SparkContextに公開されるわけではない。",
      "Python変数名は別アプリケーション間のcache共有keyではない。",
      "cacheの隔離はアプリケーションのプロセス境界に従う。"
    ]
  },
  "AUTHORED-SPARK-20261025-ARC-009": {
    "stem": "ノートPCからclientモードで送信し、クラスターマネージャーへは接続できました。しかしファイアウォールでエグゼキューターからドライバーへの接続が遮断され、タスクが正常に動きません。不足している要件はどれですか。",
    "options": [
      "全エグゼキューターを同じノートPCで動かすこと",
      "ドライバーが各エグゼキューターのローカルディスクを直接読めること",
      "実行中、エグゼキューターからドライバーのアドレスと待受ポートへ到達できること",
      "SQL warehouseをノートPCのローカルフォルダーにすること"
    ],
    "explanation": "clientモードでも、エグゼキューターからドライバーへ接続できる必要があります。送信元からクラスターマネージャーへ届くことと、実行中の通信要件は別です。",
    "reasons": [
      "client modeでもエグゼキューターはremote cluster上で実行できる。",
      "ドライバーがエグゼキューター local diskを直接mountする要件ではない。",
      "ドライバーはワーカー側からnetwork上で到達可能でなければならない。",
      "warehouse pathの配置ではドライバー接続拒否を解決しない。"
    ]
  },
  "AUTHORED-SPARK-20261025-ARC-010": {
    "stem": "clientモードでドライバーJVMが1GBで起動しました。プログラム内でspark.driver.memory=4gにしても既存のヒープは増えません。次回の起動時に4GBへ設定する正しい方法はどれですか。",
    "options": [
      "設定前に入力をcacheする",
      "SparkSession.confのshuffle.partitionsを4gにする",
      "JVM起動前にspark-submitへ--driver-memory 4gを渡す",
      "最初のアクション後にexecutor.memoryを4gにする"
    ],
    "explanation": "clientモードでPythonの本体が動く時点では、ドライバーJVMは起動済みです。ヒープの大きさは、起動前にspark-submit --driver-memory 4gなどで指定します。",
    "reasons": [
      "cacheは既存JVMの最大heapを拡張しない。",
      "shuffle パーティション数はメモリ量の設定ではない。",
      "ドライバー起動時のheap量をcommand lineから渡す。",
      "エグゼキューター メモリはドライバー heapとは別の設定。"
    ]
  },
  "AUTHORED-SPARK-20261025-ARC-011": {
    "stem": "task.maxFailuresは、defaultsファイルで2、spark-submitで3に設定されています。SparkContext作成前に、渡すSparkConfで明示的に5へ設定しました。他の変更はありません。どの値が優先されますか。",
    "options": [
      "コマンドラインが常に優先されるため3",
      "渡したSparkConfの明示設定が最優先なので5",
      "合計して10",
      "最初に読み込むファイルの2"
    ],
    "explanation": "この実行時設定では、明示したSparkConf、送信時の引数、defaultsファイルの順で優先されます。SparkContext作成前のSparkConfで5にしたため、最終値は5です。",
    "reasons": [
      "command lineより明示SparkConfの値が優先される。",
      "SparkConf、submit flag、defaultsの順に優先される。",
      "同じpropertyの値を加算しない。",
      "最初に読み込んだ値が最優先になる規則ではない。"
    ]
  },
  "AUTHORED-SPARK-20261025-ARC-012": {
    "stem": "動的割り当てが有効で、必要なシャッフル保持の仕組みも構成済みです。未実行タスクが継続してたまり、後のフェーズではキャッシュのないエグゼキューターがタイムアウトを超えて遊休になりました。どのような動作が想定されますか。",
    "options": [
      "DataFrameの行を増やしてコアを埋める",
      "エグゼキューター数を固定し、Pythonスレッド数だけ変える",
      "ステージ終了ごとにドライバーを別エグゼキューターへ移す",
      "滞留タスクに応じてエグゼキューターを追加要求し、後で解放可能な遊休分を返す"
    ],
    "explanation": "動的割り当ては、未実行タスクの滞留に応じてエグゼキューターを要求し、条件を満たす遊休分を解放します。データの行数やPythonスレッド数を変える機能ではありません。",
    "reasons": [
      "入力の行数を変える機能ではない。",
      "固定エグゼキューター数の説明はdynamic allocationの目的と逆。",
      "ドライバーの移動機能ではない。",
      "アプリケーションが占有するエグゼキューター 資源を負荷に合わせて伸縮する。"
    ]
  },
  "AUTHORED-SPARK-20261025-ARC-013": {
    "stem": "外部シャッフルサービスを使う動的割り当てで、シャッフル出力を書いたエグゼキューターが削除されました。他のタスクはまだそのファイルを必要とします。このサービスの主な役割はどれですか。",
    "options": [
      "全Pythonオブジェクトをアプリケーション終了後も永久に保持する",
      "エグゼキューターのプロセスと独立して、そのシャッフルファイルを提供する",
      "ドライバーに代わって後続の全タスクをスケジュールする",
      "終了前に全レコードをメタストアへコピーする"
    ],
    "explanation": "外部シャッフルサービスは、エグゼキューターと独立してシャッフルファイルを提供します。エグゼキューターの削除後にも、後続のタスクが必要な出力を読めるようにします。",
    "reasons": [
      "全てのPython objectやアプリケーション終了後cacheを永久保持するものではない。",
      "エグゼキューター削除後もshuffle fileをserveできる構成にする。",
      "タスク schedulingはドライバーの役割。",
      "metastoreへ全レコードを保存する方式ではない。"
    ]
  },
  "AUTHORED-SPARK-20261025-ARC-014": {
    "stem": "ステージ内で1つのタスクだけが遅く、投機実行の設定条件をすべて満たしています。失敗は報告されていません。Sparkが行える対処はどれですか。",
    "options": [
      "完了した全タスクを再実行する",
      "ドライバーを遅いエグゼキューターへ移す",
      "遅いタスクの入力をnullに変えて完了扱いにする",
      "別の空きエグゼキューターで、遅いタスクの別試行を開始する"
    ],
    "explanation": "投機実行は、条件を満たす遅いタスクの別試行を開始して、遅延の影響を減らします。失敗報告がなくても動作し、完了済みの全タスクを再実行するものではありません。",
    "reasons": [
      "完了済み全タスクの再実行はspeculationの動作ではない。",
      "ドライバー移動の機能ではない。",
      "入力のデータ内容をNULLへ変えて完了扱いにしない。",
      "条件を満たす遅いタスクのコピーを別attemptとして起動できる。"
    ]
  },
  "AUTHORED-SPARK-20261025-ARC-015": {
    "stem": "spark.task.maxFailures=3のバッチ処理で、同じタスクが成功を挟まず3回連続して失敗しました。通常カウントされる失敗で、他のポリシーはありません。この設定の意味はどれですか。",
    "options": [
      "ドライバーが生きている限り無限に再試行する",
      "そのタスクの連続失敗が上限3回に達し、ジョブを断念する",
      "全タスクの失敗数を合計し、3の倍数かを調べる",
      "初回の後に3回再試行できるので、必ず4回目を開始する"
    ],
    "explanation": "spark.task.maxFailuresは、同じタスクの連続失敗回数の上限です。3なら初回を含む3回で上限となり、初回後に許される再試行は2回です。",
    "reasons": [
      "有限の失敗上限が設定されている。",
      "対象タスクが3回連続失敗すると上限となる。",
      "別々のタスクの失敗合計をこの設定で判定しない。",
      "設定値は初回を除くretry数ではない。"
    ]
  },
  "AUTHORED-SPARK-20261025-ARC-016": {
    "stem": "同じSparkContextへ別スレッドから長いバッチと短い対話処理のアクションを送ります。既定のFIFOでは長いジョブが枠を占有します。同時ジョブにアプリケーションの資源を分けたい場合のモードはどれですか。",
    "options": [
      "task.maxFailuresを1にする",
      "短いジョブを長いジョブのステージへ変える",
      "アクションをやめ、変換だけを定義する",
      "SparkContext内でFAIRスケジューリングを使う"
    ],
    "explanation": "同じSparkContext内のジョブへ資源を分けるにはFAIRスケジューラーを使います。クラスター全体で別アプリケーションへ資源を割り当てる役割とは区別します。",
    "reasons": [
      "タスク failure retry上限はjob間の公平配分と無関係。",
      "別のjobを任意に別jobのstageへ組み込む設定ではない。",
      "actionをなくすと計算結果を要求できない。",
      "FAIRは同一アプリケーション内の並行jobへの資源分配を行う。"
    ]
  },
  "AUTHORED-SPARK-20261025-ARC-017": {
    "stem": "1台のワーカーマシン上に、同じアプリケーションのエグゼキュータープロセスが2つあります。両方に十分なCPUとメモリが割り当てられています。正しい判断はどれですか。",
    "options": [
      "有効な構成であり得る。ワーカーはマシン、エグゼキューターはそこで動くプロセスである",
      "2つのヒープは必ず1つの共有JVMヒープへ統合される",
      "2つのプロセスIDはどちらもドライバーである",
      "複数配置できないので、必ずlocalモードである"
    ],
    "explanation": "ワーカーは処理を動かすマシン、エグゼキューターはアプリケーション用のプロセスです。資源と設定が許せば、同じワーカーに複数のエグゼキューターを配置できます。",
    "reasons": [
      "nodeとプロセスを区別する。",
      "独立JVM プロセスのheapが自動的に一つになるわけではない。",
      "エグゼキューター IDがドライバー プロセス IDを表すわけではない。",
      "複数エグゼキューターが同じワーカーにあることはlocal modeの証拠ではない。"
    ]
  },
  "AUTHORED-SPARK-20261025-ARC-018": {
    "stem": "同じSparkContextを1時間維持し、複数の独立したアクションを実行します。動的割り当ては無効で障害もありません。アクションが終わるたびに別アプリケーションと新しいエグゼキューターが必要ですか。",
    "options": [
      "不要。同じアプリケーションとエグゼキューターで複数アクションのタスクを実行できる",
      "不要。後の全アクションはクラスターマネージャー内で実行する",
      "必要。アクションごとに別SparkContextが必要",
      "必要。エグゼキューターは1タスクが終わるたびに必ず破棄される"
    ],
    "explanation": "アクションが終わっても、アプリケーション全体が終わるとは限りません。同じSparkContextとエグゼキューターを使い、複数アクションのタスクを処理できます。",
    "reasons": [
      "条件を満たす限り同じエグゼキューターを複数actionで使える。",
      "クラスターマネージャー内でデータ計算全体を実行する構成ではない。",
      "actionごとにSparkContextを作成する要件はない。",
      "エグゼキューターはtask1個ごとの使い捨てプロセスではない。"
    ]
  },
  "AUTHORED-SPARK-20261025-ARC-019": {
    "stem": "リモート分散実行でrdd.foreach(print)は成功しましたが、レコードがドライバーのコンソールに出ません。ワーカーの出力はこのコンソールへ集約されないとします。直接の理由はどれですか。",
    "options": [
      "関数はエグゼキューターのタスクで実行され、出力もそちらのstdoutへ出る",
      "複数パーティションではドライバーのstdoutが無効になる",
      "キャッシュされているとforeachは全関数呼び出しを省く",
      "printがSQLへ変換され、メタストアに保存される"
    ],
    "explanation": "foreach内のprintは、実行先のエグゼキューターの標準出力へ出ます。ドライバーの画面に出ないことだけで、タスクが実行されていないとは判断できません。",
    "reasons": [
      "ドライバーとエグゼキューターで標準出力の場所が異なる。",
      "パーティション数によってドライバー stdoutを無効にする規則ではない。",
      "cacheの有無でforeachの関数呼出しを省略する規則ではない。",
      "printをSQLへ変換してmetastoreへ保存しない。"
    ]
  },
  "AUTHORED-SPARK-20261025-ARC-020": {
    "stem": "タスク内で使う独自の純Pythonパッケージpricing_rulesが、送信元にしかありません。pricing_rules.zipをアプリケーションと一緒に配布するspark-submitオプションはどれですか。",
    "options": [
      "--executor-coresへzipを渡す",
      "--py-filesへzipを渡す",
      "--driver-memoryへzipを渡す",
      "--nameへzipを渡す"
    ],
    "explanation": "純Pythonの.py・.zip・.eggは、--py-filesでアプリケーションと一緒に配布できます。送信元にインストール済みでも、リモートの実行環境へ自動で導入されるとは限りません。",
    "reasons": [
      "executor-coresはCPU数を指定する。",
      "Python code archiveをエグゼキューターへ配布する指定。",
      "driver-memoryはheap量を指定する。",
      "nameはアプリケーション表示名でありcodeを配布しない。"
    ]
  },
  "AUTHORED-SPARK-20261025-ARC-021": {
    "stem": "同じSparkContextを使いつつ、一時ビューとSQL設定を分けた2つのセッションが必要です。second=spark.newSession()で作るsecondの説明はどれですか。",
    "options": [
      "元のセッションを停止し、ドライバーをエグゼキューターへ移す",
      "一時ビューとSQL設定の変更をすべて元セッションと共有する",
      "完全に別のSparkContextとクラスター割り当てを持つ",
      "SQL設定・一時ビュー・UDF登録は分離し、SparkContextとテーブルキャッシュは共有する"
    ],
    "explanation": "newSessionはSQL設定・一時ビュー・UDF登録を分離し、SparkContextとテーブルキャッシュは共有します。新しい独立アプリケーションを作る操作ではありません。",
    "reasons": [
      "元sessionの停止やドライバー移転を行わない。",
      "temporary view等は分離するため全て共有するわけではない。",
      "newSessionは別SparkContextを作らない。",
      "sessionのSQL状態を分離し実行基盤を共有する。"
    ]
  },
  "AUTHORED-SPARK-20261025-SQL-001": {
    "stem": "customers.idは非nullですが、blocked.idにはnullがあります。id NOT IN (SELECT id FROM blocked)が予想外に0行を返しました。NOT INを使い続け、ブロックされていない全顧客を残す修正はどれですか。",
    "options": [
      "右側のnullをCOALESCEで対象顧客自身のIDへ変える",
      "副問い合わせでblocked.id IS NOT NULLの行だけを比較する",
      "nullを除いた集合へのINに変える",
      "元の条件へOR id IS NULLを加える"
    ],
    "explanation": "NOT INの比較集合にnullがあると、不一致の値でも判定がUNKNOWNになり、WHEREを通りません。左IDが非nullという前提なので、右の副問い合わせからnullを除けば意図どおり比較できます。",
    "reasons": [
      "右側NULLを各顧客自身のidに置き換えると、その顧客を除外してしまう。",
      "非NULLのブロック済みidだけを比較集合にする。",
      "ブロック済み顧客を選ぶ逆の条件。",
      "左側idは非NULLなのでORは救済にならず、右側NULLも残る。"
    ]
  },
  "AUTHORED-SPARK-20261025-SQL-002": {
    "stem": "ordersから、完了済み注文だけの合計額が50000を超える地域を、地域ごとに1行返します。未完了分を合計へ含めない正しいSQLはどれですか。",
    "options": [
      "WHEREで完了済みに絞り、地域別SUMを計算し、HAVINGで合計50000超を判定する",
      "WHEREでSUMを判定し、HAVINGで完了状態を判定する",
      "WHEREで完了かつ個々のamountが50000超の行だけを残して集計する",
      "地域と状態で集計し、状態を絞らず合計50000超を返す"
    ],
    "explanation": "WHEREで完了済みの明細を絞り、GROUP BYで地域別に合計し、HAVINGで合計額を判定します。個々の注文が50000超である必要はありません。",
    "reasons": [
      "行の状態条件と集約後の合計条件が正しい段階にある。",
      "WHEREに集約関数は置けない。statusもregionごとの集約結果の単一値として定義されていない。",
      "明細金額を先に除外し、合計が条件を満たす小額明細の集合を失う。",
      "pendingも集計対象になり、regionとstatusごとに複数行を返す。"
    ]
  },
  "AUTHORED-SPARK-20261025-SQL-003": {
    "stem": "口座内の(day,amount)が(1,10)・(1,20)・(2,5)です。day順のRANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROWでSUM(amount)を計算すると、それぞれの行の値はどうなりますか。",
    "options": [
      "10・30・35",
      "10・20・5",
      "30・30・35",
      "35・35・35"
    ],
    "explanation": "RANGEのCURRENT ROWは、並べ替え値が同じ行も含みます。day=1の両行は10+20=30、day=2はそこへ5を加えて35です。行単位で範囲を指定するROWSと区別します。",
    "reasons": [
      "最初の行だけ10にするのは、同順位の扱いが異なるROWSの累積を想定した値。",
      "windowの集約を行わず元の金額を返している。",
      "day=1のpeer全体を含め、その後day=2まで含める。",
      "UNBOUNDED FOLLOWINGは指定されていない。day=1にはday=2を含めない。"
    ]
  },
  "AUTHORED-SPARK-20261025-SQL-004": {
    "stem": "部署内の異なる給与水準の上位2段階に属する全従業員を残します。同額者は全員残し、2人を超えても構いません。非nullのsalaryに対し、外側でlevel_no<=2と絞るための式はどれですか。",
    "options": [
      "部署別・給与降順のROW_NUMBER",
      "部署別・給与降順のNTILE(2)",
      "部署別・給与降順のDENSE_RANK",
      "部署別・給与降順のRANK"
    ],
    "explanation": "DENSE_RANKは同額を同順位にし、次の給与水準へ欠番なしで進みます。そのため、上位2つの異なる給与水準に属する同額者を全員残せます。",
    "reasons": [
      "必ず各行に別番号を振るため同額者の一部を落とす。",
      "行を2つのバケットに分ける機能であり、異なる給与水準の上位2つを表さない。",
      "同額と欠番なしの両要件を満たす。",
      "同額が複数あると次順位に欠番が生じ、2番目の給与水準が順位3以上になることがある。"
    ]
  },
  "AUTHORED-SPARK-20261025-SQL-005": {
    "stem": "account内でseqは一意、全列は非nullです。全行へ、その口座のseq最大行のbalanceを付けます。LAST_VALUEが現在行で止まらず口座全体を見る式はどれですか。",
    "options": [
      "口座別で、現在行だけをフレームにする",
      "口座別に分けず、先頭から末尾までをフレームにする",
      "口座別で、先頭から現在行までをフレームにする",
      "口座別・seq順で、先頭から末尾までをフレームにする"
    ],
    "explanation": "LAST_VALUEで口座の最後の行を見るには、集計範囲をUNBOUNDED FOLLOWINGまで広げます。求めるのはseq最大行のbalanceであり、balance自体の最大値ではありません。",
    "reasons": [
      "現在行1行だけを見る。",
      "accountによる分割がなく、別accountを含む全体の終端を参照する。",
      "集計範囲の末尾が現在行なので、その行のbalanceが返る。",
      "accountごとの全行をseq順で評価し、最後の値を全行へ付ける。"
    ]
  },
  "AUTHORED-SPARK-20261025-SQL-006": {
    "stem": "sensor内のseq=1・2・3に対するreadingは8・null・12です。LAG(reading,1,-1)をseq順で使い、既定のRESPECT NULLSとすると、返る値はどれですか。",
    "options": [
      "-1・8・null",
      "-1・8・8",
      "-1・8・-1",
      "null・8・null"
    ],
    "explanation": "LAGの第3引数-1は、参照先の行が存在しないときの値です。3行目には前の行があり、そのreadingがnullなので、既定ではnullを返します。",
    "reasons": [
      "前行なし、8、既存前行のNULLの順。",
      "IGNORE NULLSを指定していないため、8まで遡らない。",
      "既存の前行のNULLをdefaultで置き換える動作ではない。",
      "最初の行には明示defaultの-1が使われる。"
    ]
  },
  "AUTHORED-SPARK-20261025-SQL-007": {
    "stem": "ショップごとに全注文数と、支払済み注文だけの合計額を出します。未払い注文も件数には含めます。各ショップには支払済み注文が1件以上あります。適切なSQLはどれですか。",
    "options": [
      "WHEREでpaidに絞ってからCOUNTとSUMを計算する",
      "COUNT(status='paid')で全件数を数え、SUMは全行を足す",
      "COUNT(*)で全件を数え、SUMだけFILTER(WHERE status='paid')を使う",
      "全行を集計し、HAVINGでstatus='paid'を指定する"
    ],
    "explanation": "集約のFILTERは、その集約だけの入力を絞ります。COUNT(*)は全注文を数え、SUMだけpaidを対象にできます。WHEREで絞ると、全注文数まで減ってしまいます。",
    "reasons": [
      "WHEREで未払い注文を除くためall_nもpaidのみになる。",
      "COUNT(boolean)はTRUEだけでなくFALSEも非NULLなら数え、SUMは全statusを合算する。",
      "全行のCOUNTとpaidのみのSUMを同時に計算する。",
      "statusはグループ BY項目でも集約でもなく、このHAVINGではショップ単位の条件を定義できない。"
    ]
  },
  "AUTHORED-SPARK-20261025-SQL-008": {
    "stem": "入力(customer_id,channel)は(1,'web')・(1,'web')・(1,null)・(2,'app')・(null,'app')です。2引数のCOUNT(DISTINCT customer_id,channel)は何を返しますか。structを1引数にしたCOUNTではありません。",
    "options": [
      "3",
      "4",
      "5",
      "2"
    ],
    "explanation": "複数引数のCOUNT(DISTINCT ...)は、全引数が非nullの一意な組み合わせを数えます。対象は(1,web)と(2,app)の2つです。structを1引数にする場合とは条件が異なります。",
    "reasons": [
      "NULLを含む2組のどちらか一方だけを誤って数えた値。",
      "NULLを含む一意な組も数えた値。",
      "重複とNULLのいずれも除外していない。",
      "全引数が非NULLである一意な組は2つ。"
    ]
  },
  "AUTHORED-SPARK-20261025-SQL-009": {
    "stem": "regionには実データのnullがあります。ROLLUP(region)で、実nullのグループと総計行のregionがどちらもnullになりました。総計だけを'ALL'にし、実nullは保つ式はどれですか。",
    "options": [
      "GROUPING(region)=1のときだけ'ALL'にする",
      "COALESCE(region,'ALL')を使う",
      "region IS NULLならすべて'ALL'にする",
      "GROUPING(region)=0のとき'ALL'にする"
    ],
    "explanation": "GROUPING(region)=1は、集計のためにregionが省略された行を示します。実データのnullをまとめたグループは0なので、総計のnullだけを区別できます。",
    "reasons": [
      "集計によって省略された総計行だけをALLにする。",
      "実データのNULLもALLへ変えるので区別できない。",
      "NULLである理由を区別せず、どちらの行もALLにする。",
      "条件が逆であり、詳細グループをALLにしてしまう。"
    ]
  },
  "AUTHORED-SPARK-20261025-SQL-010": {
    "stem": "同じスキーマの2つの監査データを結合します。各入力内でも入力間でも、同じ行の出現回数をすべて保持する必要があります。適切なSQL演算はどれですか。",
    "options": [
      "UNION",
      "UNION ALL",
      "UNION ALLした結果全体にDISTINCT",
      "INTERSECT ALL"
    ],
    "explanation": "UNION ALLは両入力の全ての出現を保持します。UNIONは既定で重複を除くため、同一イベントが何回現れたかという監査情報を失います。",
    "reasons": [
      "UNIONは同一行を重複排除する。",
      "両extract内とextract間の重複出現をすべて保持する。",
      "外側のDISTINCTで出現回数を失う。",
      "両方にある行だけを残し、入力の単純連結にならない。"
    ]
  },
  "AUTHORED-SPARK-20261025-SQL-011": {
    "stem": "左入力はx・x・x・y、右入力はx・xです。右の1出現ごとに左の同じ1出現を相殺するEXCEPT ALLを使うと、何が残りますか。",
    "options": [
      "xが3行とyが1行",
      "xが1行とyが1行",
      "yだけ",
      "xが2行とyが1行"
    ],
    "explanation": "EXCEPT ALLは出現回数を差し引きます。xは3−2=1行、yは右にないため1行残ります。EXCEPT DISTINCTのように、右にあるxを全て除くわけではありません。",
    "reasons": [
      "右入力を差し引いていない。",
      "xが1出現とyが1出現残る。",
      "EXCEPT DISTINCTのように、右にあるxをすべて除いた結果。",
      "右のxを1出現しか差し引いていない。"
    ]
  },
  "AUTHORED-SPARK-20261025-SQL-012": {
    "stem": "null可能なキーで結合します。両方nullなら一致、片方だけnullなら不一致とします。重複キーの通常の結合件数は許容し、代替値への置換はしません。適切なON条件はどれですか。",
    "options": [
      "片方のkey IS NULLをORで結ぶ",
      "通常の=で比較する",
      "null安全な等価演算子<=>で比較する",
      "両方のnullをCOALESCEで0へ置き換えて=で比較する"
    ],
    "explanation": "<=>はnull安全な等価比較です。両方nullならtrue、片方だけnullならfalseになります。0などへの置換は、本物の0とnullを誤って一致させる恐れがあります。",
    "reasons": [
      "片方だけNULLでもTRUEとなり、非NULLキーと一致させてしまう。",
      "通常の=はNULL同士でもUNKNOWNなので一致しない。",
      "NULL同士だけを等値として扱う。",
      "実際の0とNULLを同じ値に変えてしまい、要求に反する一致が発生する。"
    ]
  },
  "AUTHORED-SPARK-20261025-SQL-013": {
    "stem": "全顧客を表示し、支払済み請求があれば金額を併記します。未払い請求しかない顧客も、金額nullで残す必要があります。適切なクエリはどれですか。複数の支払済み請求による複数行は許容します。",
    "options": [
      "INNER JOINのONにpaid条件を入れる",
      "LEFT JOIN後のWHEREでpaidまたは右のcustomer_idがnullの行だけ残す",
      "LEFT JOINのONにキーとpaid条件を両方入れる",
      "LEFT JOIN後のWHEREでpaidの行だけ残す"
    ],
    "explanation": "paid条件をLEFT JOINのONへ含めると、支払済み請求がない顧客もnull補完で残せます。結合後のWHEREでpaidに絞ると、未払い請求しかない顧客が消えます。",
    "reasons": [
      "INNER JOINなのでpaid一致のないcustomerを保持しない。",
      "未払いだけあるcustomerは実際に右行と一致済みなのでNULL補完行が作られず、WHEREで全行を落とす。",
      "paidに一致しなくてもcustomerをNULL補完で残す。",
      "未一致行のstatusもNULLなのでWHEREを通らず、customerを失う。"
    ]
  },
  "AUTHORED-SPARK-20261025-SQL-014": {
    "stem": "CSVの明示スキーマはid INT,name STRINGですが、ヘッダーがname,idの順に逆転しました。header=true、caseSensitive=trueです。位置で黙って読み込まず、不一致として拒否する設定はどれですか。",
    "options": [
      "enforceSchema=true",
      "inferSchema=true",
      "header=false",
      "enforceSchema=false"
    ],
    "explanation": "header=trueでenforceSchema=falseにすると、ヘッダーと明示スキーマの名前を位置ごとに検証します。違えば失敗し、名前に合わせて列順を自動修正するわけではありません。",
    "reasons": [
      "明示スキーマを位置で強制適用し、header名を無視する。",
      "スキーマは明示済みであり、スキーマ推論を有効化することが位置検証の指定にはならない。",
      "headerをデータ行として扱い、列位置の検証を行わない。",
      "明示スキーマとheaderの位置・名前を検証する。"
    ]
  },
  "AUTHORED-SPARK-20261025-SQL-015": {
    "stem": "WITH recent AS (...) SELECT COUNT(*) FROM recentは成功しますが、別のspark.sqlでSELECT * FROM recentを実行すると、テーブルやビューがないため失敗します。同じセッションが開いたままでも失敗する理由はどれですか。",
    "options": [
      "CTE名はそのSQL文の中だけで有効で、セッションのビューとしては登録されない",
      "最初のクエリでcollectすれば永続テーブルになる",
      "CTEは常にglobal_tempへ保存されるので、その接頭辞が必要",
      "セッションを再起動して初めてCTEが利用できる"
    ],
    "explanation": "WITHで定義したCTEは、そのSQL文の中だけで有効です。セッションが開いたままでも、一時ビューとしてカタログに登録されたことにはなりません。",
    "reasons": [
      "別のSQL文から同じCTE名は直接参照できない。",
      "actionの実行はCTEを永続tableへ登録しない。",
      "CTEはglobal temporary viewではない。",
      "sessionの再起動でCTEの範囲は拡張されない。"
    ]
  },
  "AUTHORED-SPARK-20261025-SQL-016": {
    "stem": "キャッシュ済みのParquetテーブルanalytics.shipmentsのファイルを、外部処理が同じ場所で置き換えました。スキーマ変更やパーティション追加はありません。定義を残し、古いキャッシュとメタデータを無効化するSQLはどれですか。",
    "options": [
      "REFRESH TABLEで更新を要求する",
      "ANALYZE TABLEで統計だけを計算する",
      "DESCRIBE TABLEで定義を表示する",
      "DROP TABLEでテーブルを削除する"
    ],
    "explanation": "REFRESH TABLEは、対象の古いキャッシュデータとメタデータを無効化し、次に必要になったときに再構築させます。テーブル定義の削除や、サイズ統計の計算とは別の操作です。",
    "reasons": [
      "table定義を保持し、staleなcacheを無効化する。",
      "optimizer用の統計を収集する命令であり、cached dataとmetadataの無効化を直接指示するものではない。",
      "metadataを表示するだけで、refreshを要求しない。",
      "table定義を保持する条件に反する。"
    ]
  },
  "AUTHORED-SPARK-20261025-SQL-017": {
    "stem": "カタログ登録済みのanalytics.clicksについて、列だけでなく保存先とproviderも調べます。全データ走査や変更をせず、既存のカタログ情報を確認するコマンドはどれですか。",
    "options": [
      "REFRESH TABLE",
      "DESCRIBE TABLE EXTENDED",
      "SHOW TABLES IN analytics",
      "SELECT * FROM analytics.clicks LIMIT 0"
    ],
    "explanation": "DESCRIBE TABLE EXTENDEDでは、列情報に加え、providerや保存先などの詳細を確認できます。既存テーブルの情報を調べるだけなので、全行の読み取りや定義の変更は不要です。",
    "reasons": [
      "cacheの無効化を行う命令であり、詳細metadataの表示ではない。",
      "columnsと詳細metadataを同時に確認する。",
      "tableの一覧であり、個々のstorage locationやproviderを返さない。",
      "結果のスキーマは得られるが、tableのproviderやlocationを表示しない。"
    ]
  },
  "AUTHORED-SPARK-20261025-SQL-018": {
    "stem": "reportingにsales_daily・sales_monthly・archive_2025・usersがあり、一時ビューはありません。salesまたはarchiveで始まるテーブル名を、データを読まず一覧化する正しいSHOW TABLESの構文はどれですか。",
    "options": [
      "DESCRIBE TABLE reporting.sales*",
      "SHOW TABLESへ通常のWHEREとLIKE 'sales%'を付ける",
      "SHOW TABLES IN reporting LIKE 'sales%|archive%'",
      "SHOW TABLES IN reporting LIKE 'sales*|archive*'"
    ],
    "explanation": "SHOW TABLESのLIKEでは、任意長の一致に*、候補の区切りに|を使います。通常のSQL述語LIKEの%と混同せず、sales*|archive*と指定します。",
    "reasons": [
      "DESCRIBEは単一tableの説明であり、このwildcardによる一覧を取得する構文ではない。",
      "SHOW TABLES文にこのWHERE句は追加できない。",
      "SHOW TABLESのpatternで%はSQL LIKEのワイルドカードとして働かない。",
      "*と|を使うSHOW TABLESの構文に合う。"
    ]
  },
  "AUTHORED-SPARK-20261025-SQL-019": {
    "stem": "ヘッダー付きCSVで、引用符内のコメントに改行があり、1レコードが複数の物理行へまたがります。区切り・引用符・スキーマは正しいとします。レコード分断に対応するReaderオプションはどれですか。",
    "options": [
      "wholetext=true",
      "lineSep=','",
      "inferSchema=true",
      "multiLine=true"
    ],
    "explanation": "CSVのmultiLine=trueは、引用符内の改行を含めて1レコードとして解析します。テキスト全体を1つの値にするwholetextとは違い、CSVの列構造を保ちます。",
    "reasons": [
      "wholetextはtext sourceでfile全体を1値に読む用途であり、CSV レコード解析の指定ではない。",
      "commaは列区切りであり、行区切りにするとレコードを正しく分割できない。",
      "型推論の有効化ではレコード境界の扱いを変更しない。",
      "複数の物理行にまたがるCSV レコードを扱える。"
    ]
  },
  "AUTHORED-SPARK-20261025-SQL-020": {
    "stem": "Spark 3.5.6の組み込みセッションカタログで、LOCATION '/shared/orders'の既存Parquetをraw.ordersとして登録しました。EXTERNALであることも確認済みです。PURGEや独自削除処理なしでDROP TABLEするとどうなりますか。",
    "options": [
      "登録は残り、ファイルが削除される",
      "登録は削除されるが、/shared/ordersのファイルは残る",
      "登録もファイルも削除される",
      "外部テーブルはDROPできないため失敗する"
    ],
    "explanation": "この外部テーブルのDROPでは、カタログ登録だけが削除され、外部のParquetファイルは残ります。管理テーブルや独自の削除処理まで同じと一般化せず、EXTERNALという前提で判断します。",
    "reasons": [
      "DROPはtableのcatalog entryを除く。metadataを残してfileだけを消す操作ではない。",
      "table定義だけが除かれ、外部locationのParquet fileは残る。",
      "EXTERNAL tableでは実データを所有するmanaged tableと異なり、通常のDROPで外部fileは削除しない。",
      "EXTERNAL tableもDROPできる。違いは外部locationのfileを保持すること。"
    ]
  },
  "AUTHORED-SPARK-20261025-SQL-021": {
    "stem": "JDBCで、paidだけを読むqueryとpartitionColumn='order_id'を同時に設定して拒否されました。URL・認証・分割数・上下限は設定済みです。ソース側での絞り込みと分割読み取りを両立する修正はどれですか。",
    "options": [
      "queryを残し、dbtableも追加する",
      "queryを残し、partitionColumnをp.order_idへ変えるだけ",
      "queryをやめ、別名p付きの副問い合わせをdbtableへ入れ、partitionColumn=p.order_idにする",
      "partitionColumnと上下限を削除し、queryだけで読む"
    ],
    "explanation": "JDBCのqueryとpartitionColumnは同時指定できません。別名付き副問い合わせをdbtableへ入れれば、DB側での絞り込みを保ち、取得する列で分割して読めます。",
    "reasons": [
      "queryとdbtableの同時指定も禁止されている。",
      "列名の修飾だけではqueryとpartitionColumnの併用禁止を解決しない。",
      "query optionを使わずdbtable subqueryへ移す。",
      "query単独は有効だが、要求されたpartitioned readingを維持しない。"
    ]
  },
  "AUTHORED-SPARK-20261025-SQL-022": {
    "stem": "JDBCの同時接続数は適切ですが、1回に取得する行が少なく往復通信が多い状態です。DBとエグゼキューターは大きな取得バッチを扱えます。並列接続を増やさず、1回の取得行数を制御する設定はどれですか。",
    "options": [
      "spark.sql.shuffle.partitions",
      "numPartitions",
      "fetchsize",
      "batchsize"
    ],
    "explanation": "fetchsizeは、JDBC読み取りで1回に取得する行数です。numPartitionsは並列度と接続数、batchsizeは書き込み時の挿入バッチなので、目的が異なります。",
    "reasons": [
      "Spark内のshuffle パーティション数であり、JDBC ドライバーのfetch行数ではない。",
      "接続の並列度を変えるので、接続数維持の要求と異なる。",
      "対応するJDBC ドライバーで読取バッチの行数を調整する。",
      "JDBC writeで1回に挿入する行数の設定。readのfetchには効かない。"
    ]
  },
  "AUTHORED-SPARK-20261025-SQL-023": {
    "stem": "/warehouse/clicks/day=2026-10-01のParquetにはuser_idとevent_typeだけがあり、dayはディレクトリ名にあります。この日のパスだけを読みつつday列を検出したいとき、再帰探索なしで使う設定はどれですか。",
    "options": [
      "mergeSchema=true",
      "basePath='/warehouse/clicks'",
      "recursiveFileLookup=true",
      "inferSchema=true"
    ],
    "explanation": "basePathでテーブルの基点を指定すると、その下のday=...もパーティション列として検出できます。入力パスは当日のままなので、他の日まで読む必要はありません。",
    "reasons": [
      "file内スキーマの統合であり、入力pathの上位にあるパーティション directoryの認識範囲を指定しない。",
      "パーティション discoveryを開始するrootを指定する。",
      "recursiveFileLookupはパーティション inferenceを無効にするため目的と逆。",
      "Parquetのパーティション discoveryのbaseを指定するoptionではない。"
    ]
  },
  "AUTHORED-SPARK-20261025-SQL-024": {
    "stem": "非nullの文字列codeから、文字どおりのA_で始まる値を選びます。その後は空でも任意の文字列でもよく、_を任意の1文字として扱ってはいけません。適切なSQL条件はどれですか。",
    "options": [
      "code LIKE 'A_%'",
      "code LIKE 'A$_%' ESCAPE '$'",
      "code LIKE 'A$__%' ESCAPE '$'",
      "code = 'A_%'"
    ],
    "explanation": "LIKEの_は任意の1文字です。ESCAPE '$'を指定して$_と書けば、文字どおりのアンダースコアになります。末尾の%は0文字以上なので、A_だけの値も含みます。",
    "reasons": [
      "_が任意の1文字になるためABなども一致する。",
      "$_でリテラルの_、最後の%で任意長の接尾辞を表す。",
      "リテラルの_の後にもう1文字を要求するため、A_だけの値を取りこぼす。",
      "等価比較では%はワイルドカードにならず、文字列A_%そのものだけを選ぶ。"
    ]
  },
  "AUTHORED-SPARK-20261025-SQL-025": {
    "stem": "CASE WHEN score IS NULL THEN 'missing' WHEN score>=80 THEN 'high' WHEN score>=50 THEN 'pass' ELSE 'low' ENDを使います。scoreがnull・90・60・40のとき、結果の順番はどれですか。",
    "options": [
      "missing・pass・pass・low",
      "low・high・pass・low",
      "missing・high・pass・low",
      "null・high・pass・low"
    ],
    "explanation": "CASEは上から順に判定し、最初にtrueの分岐を返します。nullはmissing、90はhigh、60はpass、40はELSEのlowになります。",
    "reasons": [
      "90は最初の該当条件score >= 80でhighになる。後のpassで上書きされない。",
      "NULLを検出する最初のWHENが成立するためlowにはならない。",
      "NULLの明示処理と最初に成立した分岐を反映している。",
      "IS NULLがTRUEになるため、SQL NULLのままにはならない。"
    ]
  },
  "AUTHORED-SPARK-20261025-SQL-026": {
    "stem": "ANSIモード有効のSpark 3.5.6で、raw_idには整数文字列と'bad'などが混在します。他の処理のANSI設定は保ち、有効な値をINT、不正な値をnullへ変える式はどれですか。",
    "options": [
      "CAST(raw_id AS INT)",
      "COALESCE(CAST(raw_id AS INT),0)",
      "CAST(raw_id AS STRING)",
      "TRY_CAST(raw_id AS INT)"
    ],
    "explanation": "TRY_CASTは、有効な値を変換し、不正な入力や変換時のオーバーフローをnullにします。ANSIモードを全体で無効にせず、この変換だけを許容的にできます。",
    "reasons": [
      "ANSI有効時にbadのINT変換で例外が発生する。",
      "内側のCASTが先に失敗する。さらに要件は0ではなくNULL。",
      "文字列のままで、要求されたINTへの変換にならない。",
      "局所的に失敗をNULLへ変換し、ANSI設定を維持する。"
    ]
  },
  "AUTHORED-SPARK-20261025-DF-001": {
    "stem": "leftは(a=1,b=10)、rightは(b=20,a=2)で、列の型は同じですが順番が異なります。p=left.union(right)、q=left.unionByName(right)としたとき、right由来の行を(a,b)の順で読むと、それぞれどうなりますか。",
    "options": [
      "両方とも列順が異なるため失敗する",
      "pは(20,2)、qは(2,20)",
      "pは(2,20)、qは(20,2)",
      "両方とも(2,20)"
    ],
    "explanation": "unionは列の位置、unionByNameは列名で対応させます。右の値は(b=20,a=2)なので、(a,b)で読むとunionは(20,2)、unionByNameは(2,20)です。",
    "reasons": [
      "列数と互換型が揃っているため、単に順序が異なるだけでは両方の失敗にはならない。",
      "unionは位置、unionByNameは名前を使う。",
      "位置と名前の対応が逆。",
      "unionは列名を見て自動並べ替えしない。"
    ]
  },
  "AUTHORED-SPARK-20261025-DF-002": {
    "stem": "注文101のitemsは[7,8]、102は空配列、103はnullです。掲載コードでexplode_outerを適用すると、結果はどうなりますか。",
    "options": [
      "空配列とnull配列を同時に扱えず失敗する",
      "2行。102と103は削除される",
      "3行。102は削除され、103はitem=nullになる",
      "4行。101が2行、102と103が各1行でitem=nullになる"
    ],
    "explanation": "explode_outerは、空配列もnull配列も、値がnullの1行として残します。101から2行、102と103から各1行で、合計4行になります。",
    "reasons": [
      "明示スキーマによりARRAY<INT>のNULL値も扱える。",
      "通常のexplodeに近い挙動であり、outer指定による親行保持を無視している。",
      "空配列もouterでは残る。",
      "空/NULL配列を両方保持する。"
    ]
  },
  "AUTHORED-SPARK-20261025-DF-003": {
    "stem": "labels=['red','blue','green']に対し、element_at(labels,1)をfirst、element_at(labels,-1)をlastとして選択します。(first,last)はどれですか。",
    "options": [
      "負の添字を指定できないため失敗する",
      "('red',null)",
      "('blue','green')",
      "('red','green')"
    ],
    "explanation": "element_atの配列添字は1始まりで、負数は末尾から数えます。1はred、-1はgreenです。0始まりの添字を使う別APIと区別します。",
    "reasons": [
      "負の添字は正式にサポートされる。",
      "-1は有効な添字でNULLにならない。",
      "1を0始まりの添字として解釈している。",
      "1が先頭、-1が末尾。"
    ]
  },
  "AUTHORED-SPARK-20261025-DF-004": {
    "stem": "flagsは{'active':0,'archived':1}というmapです。element_atで'active'と'missing'を取り出した(a,b)はどうなりますか。",
    "options": [
      "(0,null)",
      "(null,null)",
      "存在しないキーのため失敗する",
      "(0,0)"
    ],
    "explanation": "mapのelement_atは、存在するキーの値を返し、存在しないキーならnullを返します。格納されている0は有効な値であり、欠損ではありません。",
    "reasons": [
      "存在する0と欠落によるNULLを区別する。",
      "activeには0が明示的に格納されている。",
      "mapの未登録キー取得はNULLを返す。",
      "欠落キーは0で自動補完されない。"
    ]
  },
  "AUTHORED-SPARK-20261025-DF-005": {
    "stem": "values=[10,null,30]の各要素へ、組み込み高階関数transformで2を加えます。行数と欠損値の位置を保つ掲載コードの出力はどれですか。",
    "options": [
      "12と32を持つ2行",
      "[12,2,32]を持つ1行",
      "[12,null,32]を持つ1行",
      "[12,32]を持つ1行"
    ],
    "explanation": "transformは配列内の各要素へ式を適用し、配列のまま返します。null+2はnullなので、行数も要素数も欠損位置も保たれます。",
    "reasons": [
      "transformは行展開を行わない。",
      "NULLを0とする処理は指定されていない。",
      "配列長とNULL位置を維持する。",
      "NULL要素を削除するfilterは指定されていない。"
    ]
  },
  "AUTHORED-SPARK-20261025-DF-006": {
    "stem": "非nullの構造体shipping={city:'Tokyo',postal_code:'OLD'}に、withField('postal_code',lit('104-0001'))を適用してshippingを置き換えます。結果はどれですか。",
    "options": [
      "{city:null,postal_code:'104-0001'}になる",
      "最上位にpostal_code列が増え、shippingは変わらない",
      "{city:'Tokyo',postal_code:'104-0001'}になる",
      "shippingが文字列'104-0001'になり、cityは消える"
    ],
    "explanation": "withFieldは構造体内の指定フィールドを追加・置換し、他のフィールドを残します。更新した構造体でshippingを置き換えるため、cityはTokyoのままです。",
    "reasons": [
      "cityをNULLへ変える式は存在しない。",
      "代入先はトップレベルのpostal_codeではなくshipping。",
      "postal_codeだけ置換しcityは保持。",
      "withFieldの戻り値は更新されたstructで、単なる文字列ではない。"
    ]
  },
  "AUTHORED-SPARK-20261025-DF-007": {
    "stem": "left(id,amount)とright(id,category)を内部結合します。列を後から削除しない場合、join(right,'id')とjoin(right,left.id==right.id)の結果で、idという名前の列はいくつずつですか。",
    "options": [
      "どちらも1つ",
      "列名指定は2つ、条件式指定は1つ",
      "列名指定は1つ、条件式指定は2つ",
      "どちらも2つ"
    ],
    "explanation": "共通の列名を文字列で指定する結合では、キーのidは1列にまとまります。左右のColumnを比較する条件式では両方のidが残るため、後で参照するときは区別が必要です。",
    "reasons": [
      "式joinでは明示的なprojectionなしにkey列を1本化しない。",
      "列名joinと式joinのスキーマ規則が逆。",
      "列名joinは1つ、式joinは両側の2つ。",
      "列名指定joinは共通keyを1列に統合する。"
    ]
  },
  "AUTHORED-SPARK-20261025-DF-008": {
    "stem": "sourceは(1,'a')・(1,'b')・(2,'c')、referenceはID=1が2行です。source.join(reference,'id','left_semi')の結果は、行順を除きどれですか。",
    "options": [
      "(1,'a')と(1,'b')の2行。列はidとtag",
      "元の3行すべて。列はidとtag",
      "(1,'a')だけの1行。列はidとtag",
      "(1,'a')と(1,'b')が各2回、計4行。列はidとtag"
    ],
    "explanation": "left_semiは右側に一致が存在する左行だけを返し、右側の列は追加しません。右側が重複していても左行を増殖させず、左の2行はそれぞれ残ります。",
    "reasons": [
      "一致がある左側2行を各1回保持する。",
      "id=2は右側に一致がなく削除される。",
      "左側行をid単位でdropDuplicatesする操作ではない。",
      "通常inner joinの多対多増殖に近い結果でsemiとは異なる。"
    ]
  },
  "AUTHORED-SPARK-20261025-DF-009": {
    "stem": "amount DOUBLEの空DataFrameで、グループキーを指定せず、agg(count('*'),sum('amount'))を実行します。nullの置換もしません。結果はどれですか。",
    "options": [
      "1行で、件数0・合計null",
      "1行で、件数null・合計null",
      "入力が空なので0行",
      "1行で、件数0・合計0.0"
    ],
    "explanation": "キーなしの全体集約は、空入力でも1行を返します。COUNT(*)は0ですが、SUMはnullです。業務表示で合計0が必要なら、別途nullを補完します。",
    "reasons": [
      "行数0と集計対象なしのNULLは異なる。",
      "COUNT(*)は空集合でNULLではなく0。",
      "全体集約は空入力でも1行の結果を返す。",
      "SUMの空集合結果は自動的に0にはならない。"
    ]
  },
  "AUTHORED-SPARK-20261025-DF-010": {
    "stem": "codes=[4,5,6]、labels=['x']にarrays_zipを適用します。各構造体を(codes,labels)と表すと、結果の配列はどれですか。",
    "options": [
      "長さが異なるので全体がnull",
      "[(4,'x')]",
      "[(4,'x'),(5,'x'),(6,'x')]",
      "[(4,'x'),(5,null),(6,null)]"
    ],
    "explanation": "arrays_zipは同じ位置の要素を構造体へまとめます。短い側の不足分をnullで埋めるため、codesの全3要素が維持されます。",
    "reasons": [
      "長さが違うこと自体は全体NULLの条件ではない。",
      "Pythonの通常zipの最短長停止と混同している。",
      "最後のラベル値でforward fillしない。",
      "最大長に揃え不足分をNULLで補う。"
    ]
  },
  "AUTHORED-SPARK-20261025-DF-011": {
    "stem": "preferredの0は有効な価格です。coalesce(preferred,backup,lit(-1))を、入力(id,preferred,backup)=(1,null,80)・(2,0,90)・(3,null,null)へ適用すると、ID順のpriceはどれですか。",
    "options": [
      "80・90・0",
      "null・0・null",
      "80・90・-1",
      "80・0・-1"
    ],
    "explanation": "関数のcoalesceは左から最初の非nullを返します。0も非nullなので有効です。全てnullなら最後の定数-1を返します。パーティション数を減らすDataFrame.coalesceとは別のAPIです。",
    "reasons": [
      "0の扱いも、全NULL時のliteral -1も誤り。",
      "backupとliteralのfallbackを無視している。",
      "0はNULLでないため90に置換しない。",
      "最初の非NULL値を順番に採用する。"
    ]
  },
  "AUTHORED-SPARK-20261025-DF-012": {
    "stem": "eventsの各account_idにつき最新event_tsの完全な1行を残します。同時刻ならevent_id最大を選びます。キーと並び替え列は非null、口座内のevent_idは一意です。適切な式はどれですか。",
    "options": [
      "口座別・event_ts降順・event_id降順のrow_numberで1位を残す",
      "口座別にmax(event_ts)だけを集計する",
      "account_idでdropDuplicatesする",
      "口座別・event_ts昇順・event_id昇順のrow_numberで1位を残す"
    ],
    "explanation": "口座別に、時刻降順・ID降順でrow_numberを付け、1位を残します。並び順が一意に決まるため、最新行のpayloadも確実に維持できます。dropDuplicatesでは残す行を指定できません。",
    "reasons": [
      "降順の全順序に対するrow_number=1が要件を満たす。",
      "最大時刻だけを返し、対応する完全な元rowとevent IDによるtie-breakを満たさない。",
      "dropDuplicatesは最新行や同時刻tie-breakを保証しない。",
      "昇順なので最古行を選ぶ。"
    ]
  },
  "AUTHORED-SPARK-20261025-DF-013": {
    "stem": "DoubleTypeのreadingには通常の数値・NaN・SQLのnullがあります。NaNのときだけtrueとし、通常の数値やnullではtrueにしない式はどれですか。",
    "options": [
      "reading.isNull()",
      "reading.isNotNull()",
      "F.isnan('reading')",
      "~F.isnan('reading')"
    ],
    "explanation": "NaNの判定にはisnanを使います。SQLのnullを判定するisNullとは別です。数値の異常と欠損を同じ条件で扱わないようにします。",
    "reasons": [
      "isNullはSQL NULLを判定しNaNのflagではない。",
      "isNotNullは通常の数値もtrueにする。",
      "isnanがNaNのみをtrueにする。",
      "否定なのでNaN以外がtrueになる。"
    ]
  },
  "AUTHORED-SPARK-20261025-DF-014": {
    "stem": "phoneは'+44 (20) 1234-AB56'のような文字列です。UDFを使わず、ASCII数字を元の順で全部残し、英字を含むそれ以外の文字をすべて除く式はどれですか。",
    "options": [
      "translateで+・空白・括弧・ハイフンだけを除く",
      "trimで前後の空白を除く",
      "regexp_extractで最初の[0-9]+だけを取る",
      "regexp_replaceで[^0-9]を空文字にする"
    ],
    "explanation": "regexp_replaceで数字以外を全て空文字へ変えます。regexp_extractは最初の一致部分を取るため、離れた場所の数字を全て連結する要件には合いません。",
    "reasons": [
      "列挙した記号だけを除去し、任意の英字等が残る。",
      "前後の空白処理では内部の記号や英字を除去できない。",
      "最初の連続数字だけを抽出し後続数字を失う。",
      "全ての非ASCII数字文字を除去し数字の順序を保つ。"
    ]
  },
  "AUTHORED-SPARK-20261025-DF-015": {
    "stem": "文字列列site・zone・rackをハイフン1つで連結し、nullの値とその区切りは省きます。EU・null・R7ならEU-R7とする、UDFなしの式はどれですか。",
    "options": [
      "concat_ws('-',site,zone,rack)",
      "zoneのnullを空文字に置換してからconcat_wsで連結する",
      "区切りなしのconcat_wsで連結する",
      "concatで値とハイフンを順に並べる"
    ],
    "explanation": "concat_wsはnullを飛ばし、残りの値の間だけに区切りを置きます。nullを先に空文字へ変えると、その空欄の区切りが残ってEU--R7になるため注意します。",
    "reasons": [
      "NULL fieldを省略してEU-R7を作る。",
      "NULLを空文字に変えるとEU--R7となり余分なseparatorが残る。",
      "separatorが空文字のためEUとR7の間にhyphenがない。",
      "concatはNULLを含むとこの要件のNULL省略連結にならない。"
    ]
  },
  "AUTHORED-SPARK-20261025-DF-016": {
    "stem": "非nullの数値列priceとstockについて、price>=100かつstock>0の行だけを残します。Pythonの真偽値ではなくColumn条件を作る正しい式はどれですか。",
    "options": [
      "比較条件をPythonのorで結ぶ",
      "比較条件を|で結ぶ",
      "price>100とstock>=0を&で結ぶ",
      "price>=100とstock>0をそれぞれ括弧で囲み、&で結ぶ"
    ],
    "explanation": "Column条件のANDは、比較式をそれぞれ括弧で囲み&で結びます。Pythonのand/orでは、ColumnをPythonの真偽値として評価しようとするため使えません。",
    "reasons": [
      "PythonのorはColumn predicateの演算子ではない。",
      "|はORとなり片方だけを満たす行も残す。",
      "price=100を除外しstock=0を残すため境界が異なる。",
      "両比較を&で結び境界条件も要件通り。"
    ]
  },
  "AUTHORED-SPARK-20261025-DF-017": {
    "stem": "raw_timeは'25/10/2026 14:05:09'形式の有効な文字列です。UTCのまま、日付と時刻を保つTimestampTypeへ変換する正しい式はどれですか。",
    "options": [
      "date_format(raw_time,'dd/MM/yyyy HH:mm:ss')",
      "to_date(raw_time,'dd/MM/yyyy')",
      "to_timestamp(raw_time,'MM/dd/yyyy HH:mm:ss')",
      "to_timestamp(raw_time,'dd/MM/yyyy HH:mm:ss')"
    ],
    "explanation": "入力と同じ形式をto_timestampへ渡します。ddは日、MMは月、HHは24時間、mmは分です。date_formatは文字列の整形、to_dateは日付型なので、戻り値型も確認します。",
    "reasons": [
      "date_formatはTimestampTypeへparseするAPIではない。",
      "DateTypeとなり時刻を保持しない。",
      "月と日のpatternが逆で25を月として解釈しようとする。",
      "日/月/年と時分秒が入力書式に一致する。"
    ]
  },
  "AUTHORED-SPARK-20261025-DF-018": {
    "stem": "array<array<int>>型のchunksが[[7,8],null,[9]]です。nullは整数要素ではなく、欠けた内側の配列です。事前にnullを除去・置換せずflattenすると、結果はどれですか。",
    "options": [
      "[7,8,9]",
      "[7,8,null,9]",
      "null",
      "[[7,8],[9]]"
    ],
    "explanation": "flattenは入れ子配列を1段平らにしますが、内側の配列自体がnullだと結果全体もnullです。整数要素としてnullが入っているケースとは異なります。",
    "reasons": [
      "NULL subarrayを自動で空配列として無視しない。",
      "NULL subarrayを単一NULL要素へ自動変換する動作ではない。",
      "NULL subarrayを含むためflatten結果はNULL。",
      "NULLを除去して入れ子を残す関数ではない。"
    ]
  },
  "AUTHORED-SPARK-20261025-DF-019": {
    "stem": "salesにはstore・channel・amountがあります。店舗ごとに1行で、webとshopを別列にして金額を合計します。既知のピボット値も明示する正しい式はどれですか。",
    "options": [
      "channelでgroupByし、storeをweb・shopの値でpivotする",
      "storeでgroupByし、channelを['web','shop']でpivotしてamountを合計する",
      "storeとchannelでgroupByして合計する",
      "存在する前提でweb・shop列をselectして集計する"
    ],
    "explanation": "groupByで店舗ごとの行を作り、pivotでchannelの値を列へ変え、金額を合計します。web・shopという既知の値を明示することで、必要な列も指定できます。",
    "reasons": [
      "グループ列とpivot列を逆にしておりstoreごとの結果にならない。",
      "channelの既知値を列へ変換してstore単位で集計する。",
      "store×channelの行を作りweb/shopを別列にしない。",
      "元DataFrameにwebとshopという列はなくselectできない。"
    ]
  },
  "AUTHORED-SPARK-20261025-DF-020": {
    "stem": "event_idとJSON文字列のpayloadを持つDataFrameがあります。payloadは{\"sku\":\"P8\",\"qty\":3}です。event_idを残し、sku STRING・qty INTの解析済み構造体列parsedを追加する式はどれですか。",
    "options": [
      "payloadをSTRUCTへ直接castする",
      "to_jsonでpayloadを処理する",
      "spark.read.jsonへ文字列'payload'をパスとして渡す",
      "withColumnでfrom_json(payload,'sku STRING, qty INT')を使う"
    ],
    "explanation": "既存の文字列列をスキーマ付きJSON構造へ解析するのはfrom_jsonです。read.jsonはファイル読み取り、to_jsonは構造体などを文字列へ変える逆方向の操作です。",
    "reasons": [
      "StringTypeのJSONをstructへparseするにはcastではなくfrom_jsonを使う。",
      "to_jsonはstruct等からJSON文字列を作る逆向きの関数。",
      "payloadというpathを読もうとし元DataFrameのevent_idを保持する列変換ではない。",
      "payloadを指定スキーマのstructへparseし元の列も保持する。"
    ]
  },
  "AUTHORED-SPARK-20261025-DF-021": {
    "stem": "非nullの文字列配列preferredとavailableには重複があり得ます。両方にある値だけを重複なしの配列にする式はどれですか。結果の順序は問いません。",
    "options": [
      "array_except",
      "concat",
      "array_union",
      "array_intersect"
    ],
    "explanation": "array_intersectは両配列にある要素だけを、重複なしで返します。array_unionは和集合、array_exceptは差集合なので、求める集合を読み分けます。",
    "reasons": [
      "exceptはpreferredからavailableの要素を除く差集合。",
      "concatは配列をつなぎ重複も残す。",
      "unionはどちらかに存在する全要素を返し共通部分に限定しない。",
      "共通部分を重複なしで返す。"
    ]
  },
  "AUTHORED-SPARK-20261025-TUN-001": {
    "stem": "collect時に結果がdriver.maxResultSizeを超えて失敗しました。詳細行は分散ストレージへ保存でき、ドライバーには小さい集計結果だけあれば十分です。上限の保護も維持する対策はどれですか。",
    "options": [
      "詳細は分散Writerで保存し、小さい集計結果だけcollectする",
      "executor.memoryだけを増やし、全行collectは変えない",
      "全結果をcacheしてから全詳細行をcollectする",
      "maxResultSizeを0にして、全詳細行をcollectし続ける"
    ],
    "explanation": "maxResultSizeはドライバーへ返す結果サイズの保護です。無制限にしてもメモリに収まるとは限りません。詳細は分散保存し、必要な小さい集計だけを取得します。",
    "reasons": [
      "ドライバーに必要な結果量を要件に合わせて小さくする。",
      "エグゼキューター heapを増やしてもドライバーへ返る合計結果サイズは減らない。",
      "cacheはドライバーへ収集する行数・結果サイズの上限を減らさない。",
      "guardを無効にするうえ、ドライバー容量の条件を解決しない。"
    ]
  },
  "AUTHORED-SPARK-20261025-TUN-002": {
    "stem": "YARNのエグゼキューターが、JVMヒープには余裕があるのにコンテナーの物理メモリ超過で停止します。余分な使用量の主因はPythonワーカーで、executor.pyspark.memoryは未設定です。JVM外メモリの許容量を直接増やす設定はどれですか。",
    "options": [
      "spark.driver.memory",
      "spark.sql.autoBroadcastJoinThreshold",
      "spark.executor.memoryOverhead",
      "spark.sql.shuffle.partitions"
    ],
    "explanation": "spark.executor.memoryOverheadは、JVMヒープ外も含む追加メモリの枠です。pyspark.memory未設定ならPythonワーカーもこの枠を使うため、ヒープ不足とコンテナー全体の不足を区別します。",
    "reasons": [
      "ドライバーのheapであり、エグゼキューター containerのPython ワーカー枠を増やさない。",
      "joinのbroadcast判断サイズでありcontainer メモリ allowanceの設定ではない。",
      "条件にあるPython ワーカー等の非JVM消費を含む追加枠を調整する。",
      "shuffleのparallelism設定であり、非JVM枠そのものではない。"
    ]
  },
  "AUTHORED-SPARK-20261025-TUN-003": {
    "stem": "成功したソートステージで、UIのshuffle spillはmemory=600MB、disk=90MBです。出力検証も成功しました。差分510MBがレコード消失を意味するという主張への正しい説明はどれですか。",
    "options": [
      "メモリ側は展開した表現、ディスク側は直列化した表現なので、サイズ差だけで欠損とは言えない",
      "小さいディスク値は重複行を削除した証拠",
      "memoryはドライバーのヒープ、diskは全ディスク容量",
      "spillがあれば、成功表示でもステージは必ず失敗している"
    ],
    "explanation": "memory側のspillはメモリ上に展開した表現、disk側は直列化した表現のサイズです。同じバイト表現ではないため、差を消失したデータ量とは解釈できません。",
    "reasons": [
      "表現の異なるsizeの差だけで欠落を推定しない。",
      "sortは重複を自動削除せず、このsize差は重複削除の証拠にもならない。",
      "ドライバー heapとディスク総容量の測定値ではない。",
      "spill自体はディスクへ退避する仕組みであり、タスク失敗と同義ではない。"
    ]
  },
  "AUTHORED-SPARK-20261025-TUN-004": {
    "stem": "SQLの列指向キャッシュを維持したいのですが、1つのキャッシュバッチを構築するときにエグゼキューターがメモリ不足になります。データとクラスター規模を変えず、1バッチの行数を直接減らす設定はどれですか。",
    "options": [
      "files.maxRecordsPerFileを増やす",
      "inMemoryColumnarStorage.batchSizeを減らす",
      "autoBroadcastJoinThresholdを増やす",
      "inMemoryColumnarStorage.batchSizeを増やす"
    ],
    "explanation": "inMemoryColumnarStorage.batchSizeは、列指向キャッシュの1バッチに入れる行数を制御します。小さくすると構築時のメモリ負担を抑えられますが、圧縮率などとの兼ね合いもあります。",
    "reasons": [
      "出力fileの行数上限でありin-memory cacheに効かない。",
      "1つのcolumnar cache バッチへまとめる行数を減らす。",
      "broadcast join判断でありcache バッチの行数ではない。",
      "1 バッチの行数を増やすため、求める変更と逆。"
    ]
  },
  "AUTHORED-SPARK-20261025-TUN-005": {
    "stem": "下流システムは1データファイルが500000行を超えると拒否します。Parquetの出力パーティション数やバイト数の厳密な指定は不要です。単一パーティション化せず、1ファイルの行数を直接制限する設定はどれですか。",
    "options": [
      "files.maxPartitionBytes=500000",
      "files.openCostInBytes=500000",
      "files.maxRecordsPerFile=500000",
      "shuffle.partitions=500000"
    ],
    "explanation": "maxRecordsPerFileは1出力ファイルの最大行数です。同じタスクが複数ファイルを書くこともあり、ファイル数やバイト数を厳密に決める設定ではありません。",
    "reasons": [
      "file読取時にパーティションへまとめるbyte数であり、出力レコード数の指定ではない。",
      "file読取時のopen cost見積りであり、出力fileのレコード上限ではない。",
      "要求されたレコード数を直接上限指定する。",
      "shuffle パーティション数であり各fileのレコード数を上限保証しない。"
    ]
  },
  "AUTHORED-SPARK-20261025-TUN-006": {
    "stem": "V1のパーティション付きParquetを/reportsへ書き直します。replacement_dfには対象日の完全な置換データがあり、それ以外の日は維持します。Hive SerDeやDeltaではありません。新しい行があるパーティションだけ置換する設定はどれですか。",
    "options": [
      "overwriteとpartitionOverwriteMode='dynamic'を使う",
      "overwriteとpartitionOverwriteMode='static'を使う",
      "appendで追加する",
      "ignoreで既存先を無視する"
    ],
    "explanation": "dynamicのパーティション上書きは、新しいデータが入るパーティションだけを置換します。入力がその日の完全な置換データという前提が重要で、appendのような単純追加とは異なります。",
    "reasons": [
      "入力にあるdayの既存パーティションを置き換え、それ以外を残す。",
      "path全体のstatic overwriteは未入力日のパーティション保持を満たさない。",
      "既存対象日のデータを残して追加するため、置換にならず重複し得る。",
      "既存pathがあるためwriteを行わず、対象日を更新できない。"
    ]
  },
  "AUTHORED-SPARK-20261025-TUN-007": {
    "stem": "Hiveメタストアのテーブルサイズ統計が古く、結合の推定が不適切です。全行の値を走査せず、サイズのバイト数を再収集するSQLはどれですか。",
    "options": [
      "REFRESH TABLE",
      "DESCRIBE TABLE EXTENDED",
      "ANALYZE TABLE ... COMPUTE STATISTICS NOSCAN",
      "ANALYZE TABLE ... COMPUTE STATISTICS FOR ALL COLUMNS"
    ],
    "explanation": "COMPUTE STATISTICS NOSCANは、全行の値を走査せず、テーブルのバイト数を収集します。統計を作り直すANALYZEと、既存情報を表示するDESCRIBEを区別します。",
    "reasons": [
      "data/metadata cacheのrefreshであり、この命令自体がtable size統計を収集する指定ではない。",
      "既存metadataを表示するが、統計を再収集しない。",
      "行値を全scanせずbyte size統計を収集する。",
      "column statistics収集はrow値のscanが必要で、NOSCAN要件を満たさない。"
    ]
  },
  "AUTHORED-SPARK-20261025-TUN-008": {
    "stem": "偏った書き込み結果にREBALANCEヒントを付けましたが、AQEが無効のため効きません。極端に小さい・大きい出力パーティションを減らす、このベストエフォートのヒントを使うために必要な変更はどれですか。",
    "options": [
      "AQEは無効のままshuffle.partitionsを1にする",
      "spark.sql.adaptive.enabledを有効にする",
      "出力全体のBROADCASTへ変更する",
      "列指向キャッシュの圧縮を無効にする"
    ],
    "explanation": "REBALANCEヒントはAQEが無効だと無視されます。AQEを有効にすると、偏りの分割などで出力パーティションを調整しますが、正確なファイル数を保証するものではありません。",
    "reasons": [
      "1 パーティションへ集約しても、AQE無効時のhint無視は変わらない。",
      "REBALANCEが考慮されるための前提条件を満たす。",
      "broadcastはjoin strategyのhintであり、query結果のwrite パーティション平準化ではない。",
      "columnar cache圧縮の設定であり、REBALANCEの有効条件と無関係。"
    ]
  },
  "AUTHORED-SPARK-20261025-STR-001": {
    "stem": "2つの入力ストリームのwatermarkが12:20と12:05です。既定の複数watermarkポリシーと、新規クエリでmaxへ変える場合の違いはどれですか。",
    "options": [
      "既定は12:20で、maxは12:05になり遅い入力を守る",
      "既定は12:05で、maxなら12:20へ進むが遅い入力のデータを落とすリスクがある",
      "どちらも常に最速入力の12:20だけを使う",
      "どちらも全体のwatermarkを決めない"
    ],
    "explanation": "既定はminなので、遅い入力の12:05が全体のwatermarkです。maxなら12:20へ進められますが、遅い入力のデータを遅延扱いで捨てるリスクが高まります。",
    "reasons": [
      "既定minとmaxの方向が逆。",
      "minは12:05、maxでは12:20に進み得て遅い入力に影響する。",
      "既定minは遅い入力のwatermarkを使う。",
      "複数入力からglobal watermarkを選ぶpolicyが存在する。"
    ]
  },
  "AUTHORED-SPARK-20261025-STR-002": {
    "stem": "foreachBatchで外部DBへ追記します。同じチェックポイントからの再開で、同じバッチが再度コールバックされる可能性があります。DBはトランザクション対応です。同じバッチの二重確定を防ぐ実装はどれですか。",
    "options": [
      "batchIdを永続的な重複判定キーにし、出力と処理済み印を同じトランザクションで確定する",
      "appendモードだけで全外部コールバックのexactly-onceを保証する",
      "呼び出すたびに乱数IDを作り、別バッチとして扱う",
      "処理済みIDを、再起動で消えるPython setだけへ保存する"
    ],
    "explanation": "foreachBatchは既定ではat-least-onceです。同じbatchIdの再実行を永続的に識別し、出力と処理済み印を原子的に確定することで、二重出力を防ぎます。",
    "reasons": [
      "永続batchIdと原子的な外部commitで再実行を冪等化する。",
      "appendは出力modeでありcallbackの外部副作用を重複排除しない。",
      "再試行を新規処理とみなすため重複を防げない。",
      "ドライバー再起動後に処理済情報が失われる。"
    ]
  },
  "AUTHORED-SPARK-20261025-STR-003": {
    "stem": "集約なしのeventsはconsoleへのappend出力が可能です。writer=events.writeStream.format('console')を作っただけで、クエリは未開始です。開始してからメインプログラムを終了待ちにする手順はどれですか。",
    "options": [
      "query=writer.start()の後、query.awaitTermination()",
      "writerをqueryとしてstopしてから待つ",
      "writer.awaitTermination()の後にstartする",
      "events.collect()を呼んでからstartする"
    ],
    "explanation": "Writerは出力設定を表すだけです。startで実行を開始してStreamingQueryを受け取り、そのquery.awaitTerminationで終了を待ちます。",
    "reasons": [
      "先にstartして得られたqueryで待機する。",
      "writerをqueryへ代入してもqueryは起動せずstop/awaitTerminationも適用先が違う。",
      "awaitTerminationは設定用writerの起動前待機APIではない。",
      "streaming DataFrameへ通常collectをかけるのは有効なquery起動手順ではない。"
    ]
  },
  "AUTHORED-SPARK-20261025-STR-004": {
    "stem": "購入ストリームeventsと静的な商品productsを、events.join(products,'product_id','left_outer')で結合します。商品未登録の購入も残し、購入のない静的商品は不要です。正しい説明はどれですか。",
    "options": [
      "不一致購入の出力にはproducts側のwatermarkが必須",
      "未購入商品も出力するのでfull outerと同じ",
      "対応する非状態保持のstream-static結合であり、不一致の購入は商品列nullで残る",
      "ストリームを含む外部結合は両入力がstreamでなければ非対応"
    ],
    "explanation": "ストリームを左、静的DataFrameを右にしたleft outerは対応しています。このstream-static結合自体は状態を保持せず、一致しない購入は商品列nullで出ます。",
    "reasons": [
      "static DataFrameにstream watermarkを設定して待つ必要はない。",
      "left outerは一致しない右側static行だけを出すことはない。",
      "対応する非stateful lookupで左側stream行を保持する。",
      "stream-staticのleft outerは明示的に対応する。"
    ]
  },
  "AUTHORED-SPARK-20261025-STR-005": {
    "stem": "impressionsストリームをclicksへ左外部結合します。同じ広告IDで、表示時刻から1時間以内のクリックだけが対象です。時刻と処理は進み続けます。今後一致し得ない表示をクリック列nullで出すために必要な設計はどれですか。",
    "options": [
      "IDの等価条件だけにし、メモリを増やす",
      "watermarkなしで、両入力を時刻順に並べる",
      "適切なwatermarkと、1時間のイベント時刻範囲を結合条件へ加える",
      "時間条件なしでcompleteモードにする"
    ],
    "explanation": "時刻範囲で『今後一致し得るクリック』を限定し、watermarkで待てる範囲を判断します。IDだけの条件やメモリ増量では、未一致を確定できません。null行の出力はバッチとwatermarkの進行に依存します。",
    "reasons": [
      "メモリを増やしても将来一致しないと確定する時間条件がない。",
      "sortはevent-timeの遅延上限やstateの有効期限を定義しない。",
      "watermarkと時間範囲で将来の一致可能性を制限する。",
      "出力 modeだけでは外部結合の未一致確定に必要な時間情報を与えない。"
    ]
  },
  "AUTHORED-SPARK-20261025-STR-006": {
    "stem": "既知の列order_id INT・amount DOUBLEを持つCSVディレクトリを監視します。streaming.schemaInferenceは既定のfalseのままで、推論を有効にせず一定のスキーマを渡すReaderはどれですか。",
    "options": [
      "readStream.schema(...)に列定義を渡し、header=trueでcsvを読む",
      "スキーマなしでheader=trueだけを指定する",
      "セッション設定を変えず、inferSchema=trueだけ指定する",
      "スキーマなしでmaxFilesPerTrigger=1だけを追加する"
    ],
    "explanation": "ファイルのストリーム読み取りでは、既定で明示スキーマが必要です。headerは列名、maxFilesPerTriggerは入力ファイル数なので、列の型の指定にはなりません。",
    "reasons": [
      "既知のスキーマを明示してstream readerに与える。",
      "headerは型スキーマを提供しない。",
      "streaming.schemaInference=falseのまま明示スキーマなしで読む解決にならない。",
      "maxFilesPerTriggerはバッチ当たりfile数制限で型定義ではない。"
    ]
  },
  "AUTHORED-SPARK-20261025-STR-007": {
    "stem": "状態付き集約をshuffle.partitions=24と永続チェックポイントで動かしていました。停止後、同じ状態と進捗を保って48へ変えて再開する案への適切な対応はどれですか。",
    "options": [
      "appendモードなら以前の状態分割は無関係になる",
      "既存状態と互換の分割数を維持し、同じチェックポイントで48へ変えない",
      "offsetログだけを削除して新しい分割数を推論させる",
      "復旧が状態を自動再分割するので無条件に48へ変える"
    ],
    "explanation": "既存の状態はキーのハッシュで分割されています。同じチェックポイントから状態を保って再開する場合、shuffle.partitionsを24から48へ変更できません。互換のある分割数を維持します。",
    "reasons": [
      "出力mode変更はstateの物理パーティション配置の互換制約を取り除かない。",
      "既存stateのパーティション構成を維持する。",
      "checkpoint内部の一部だけを削るのは整合性ある移行手順ではない。",
      "既存stateの自動再パーティションが無条件に保証されるわけではない。"
    ]
  },
  "AUTHORED-SPARK-20261025-STR-008": {
    "stem": "起動時点で利用可能な全ファイルを、maxFilesPerTriggerに応じて複数マイクロバッチで処理し、終了したいとします。対応ソースで使うトリガーはどれですか。",
    "options": [
      "processingTime='10 seconds'",
      "availableNow=True",
      "continuous='1 second'",
      "トリガーを省略して待ち続ける"
    ],
    "explanation": "AvailableNowは、開始時点で利用可能なデータを処理して自動終了します。maxFilesPerTriggerに従い、複数のマイクロバッチへ分けて処理することもできます。",
    "reasons": [
      "定期的に処理し続けるため、対象を処理しただけでは自動終了しない。",
      "起動時に利用可能なデータを複数バッチで処理して終了する。",
      "continuous処理のcheckpoint間隔を指定するもので、この有限ファイル処理の要件に合わない。",
      "デフォルトのmicro-batchは新着データを待って継続する。"
    ]
  },
  "AUTHORED-SPARK-20261025-STR-009": {
    "stem": "1回以上のマイクロバッチが完了したPySparkのStreamingQueryで、停止や終了待ちをせず、最新完了トリガーの入力行数と処理速度をPython辞書で得るプロパティはどれですか。",
    "options": [
      "query.lastProgress",
      "query.isActive",
      "query.awaitTermination",
      "query.exception"
    ],
    "explanation": "query.lastProgressは、直近の進捗情報を辞書で返します。numInputRowsやprocessedRowsPerSecondなどを含みます。更新前はNoneもあり得ますが、ここではバッチ完了済みです。",
    "reasons": [
      "直近のトリガーの入力件数や処理速度などの進捗指標を参照できる。",
      "実行中かどうかの真偽値で、バッチの進捗辞書ではない。",
      "終了を待つメソッドであり、要件の進捗辞書を返すプロパティではない。",
      "エラーによる終了時の例外を確認するもので、通常の処理指標ではない。"
    ]
  },
  "AUTHORED-SPARK-20261025-STR-010": {
    "stem": "Kafkaクエリを停止し、同じ有効なチェックポイントで再開します。startingOffsetsをlatestからearliestへ変えました。元データは保持され、新パーティションもありません。どこから読みますか。",
    "options": [
      "startingOffsetsが常に優先され、最古から読む",
      "最新のoffsetから読み、未処理分を飛ばす",
      "既存チェックポイントに記録されたoffsetから再開する",
      "毎バッチすべてoffset=0から読む"
    ],
    "explanation": "startingOffsetsは新しいクエリの開始位置です。同じチェックポイントから再開するときは、保存済みoffsetが使われ、設定変更だけで最初からの読み直しにはなりません。",
    "reasons": [
      "startingOffsetsは既存checkpointの再開位置を上書きしない。",
      "再開時に未処理データを飛ばしてlatestに移動する仕様ではない。",
      "既存checkpointの進捗が再開位置を決める。",
      "各micro-batchで先頭に戻ることはない。"
    ]
  },
  "AUTHORED-SPARK-20261025-STR-011": {
    "stem": "JSONファイルのストリームで、上流が監視ディレクトリ内のファイルへ直接書き続けるため、未完成ファイルを発見する恐れがあります。推奨される到着方法はどれですか。",
    "options": [
      "同じファイルへ永久に追記し続ける",
      "処理済みファイルを同じ名前で繰り返し上書きする",
      "maxFilesPerTrigger=1で未完成ファイルを完成扱いにする",
      "監視外で完成させ、対応するストレージ機構で一意名の新ファイルとして原子的に公開する"
    ],
    "explanation": "ファイルを監視先の外で完成させてから、原子的に到着させます。発見時点で内容を完成させることが要点です。具体的な配置方法は、ストレージが対応する仕組みに合わせます。",
    "reasons": [
      "書込み途中を読んだり、追記分を新規ファイルとして取り込めなかったりするため適切ではない。",
      "処理済みの同じファイルを変更して再取込みさせる方式には依存できない。",
      "1バッチのファイル数を制限するだけで、ファイルの書込み完了を保証しない。",
      "完成した新規ファイルをatomicに公開する。"
    ]
  },
  "AUTHORED-SPARK-20261025-CON-001": {
    "stem": "Spark Connectクライアントで数TBのリモートテーブルから2列を選び、日付で絞ってlimit(10).collect()します。クライアントがサーバーへ送るものはどれですか。",
    "options": [
      "全テーブルを一度ダウンロードし、絞ったコピーを送る",
      "エグゼキューター用の機械語バイナリーをパーティションごとに送る",
      "Python変数名だけを送り、サーバーがクライアントのメモリを直接読む",
      "DataFrame操作を未解決の論理計画として送り、サーバーが解決・実行する"
    ],
    "explanation": "ConnectクライアントはDataFrame操作を未解決の論理計画として送り、サーバーが解決・最適化・実行します。大きいテーブルを先にクライアントへ集める方式ではありません。",
    "reasons": [
      "remote table全件を先にclientへdownloadする要件はない。",
      "物理実行計画やエグゼキューター機械語をclientが配布する設計ではない。",
      "別プロセス/別hostのPython変数を共有メモリのようには読み出さない。",
      "未解決論理計画をserverへ送り解決・実行する。"
    ]
  },
  "AUTHORED-SPARK-20261025-CON-002": {
    "stem": "Spark Connectで処理済みの結果行を受信する際の、標準の転送方法とデータ表現はどれですか。クエリの送信時ではなく、結果の受信時を問います。",
    "options": [
      "エグゼキューターのJVMオブジェクトへの直接参照",
      "gRPC経由で届く、Apache Arrow形式の行バッチ",
      "送信時と同じ未解決の論理計画",
      "必ず単一CSVへ書き、共有ファイルシステム経由で読む"
    ],
    "explanation": "要求を送るときは論理計画、結果を受け取るときはArrow形式のバッチです。どちらもgRPCを使いますが、送受信する内容の役割を区別します。",
    "reasons": [
      "clientはエグゼキューターと同一JVMのobject参照を共有しない。",
      "gRPCとArrow row batchesが結果転送に使われる。",
      "未解決論理計画は要求の表現で、計算結果行そのものではない。",
      "共有filesystem上の単一CSVを必須とする設計ではない。"
    ]
  },
  "AUTHORED-SPARK-20261025-CON-003": {
    "stem": "別プロセスのConnectクライアントを使う2チームが、ローカルの帳票整形だけに異なるPythonライブラリ版を使います。UDFやタスク内では使いません。一方のローカル処理はメモリも多く使います。分離の利点はどれですか。",
    "options": [
      "両ライブラリをドライバーへ同じ版で導入しなければならない",
      "クライアントのメモリ割り当てがエグゼキューターへ自動移動する",
      "各チームに専用クラスターが自動作成される",
      "クライアントの依存関係とローカルメモリ使用を別プロセスに隔離でき、帳票ライブラリをドライバーへ置かずに済む"
    ],
    "explanation": "クライアントだけで使うライブラリやローカルのメモリは、ドライバーから別プロセスへ分離できます。UDFとしてサーバー側で使う依存関係は、別途実行先への配布が必要です。",
    "reasons": [
      "clientだけで使うlibraryをドライバーと同版へ強制する必要はない。",
      "local Python処理が自動的にエグゼキューターへoffloadされるわけではない。",
      "プロセス分離が専用clusterの自動割当を意味するわけではない。",
      "client-only依存とlocal プロセスの資源を分離できる。"
    ]
  },
  "AUTHORED-SPARK-20261025-CON-004": {
    "stem": "既存PySparkアプリをSpark Connectへ移します。あまり使わないDataFrameメソッドが1つあり、従来APIで使えるだけではConnect対応と断定できません。置換や移行テストの前に行う確認はどれですか。",
    "options": [
      "すべてpandasへ委譲されるので、pandasの対応だけ見る",
      "対象リリースのAPIリファレンスで、そのメソッドのConnect対応表記を確認する",
      "クライアントにJavaがあるかだけを見る",
      "クラス名が同じなので全メソッド対応とみなす"
    ],
    "explanation": "対象リリースの個別メソッドに、Supports Spark Connectなどの対応表記があるか確認します。従来PySparkや同名クラスにあることだけでは、対応を保証できません。",
    "reasons": [
      "Spark Connectは全操作をpandasへ委譲する実装ではない。",
      "対象version・対象methodの明示対応を確認する。",
      "client Java有無ではremote method対応を判断できない。",
      "DataFrameの大部分の対応は、すべてのmethod対応の保証ではない。"
    ]
  },
  "AUTHORED-SPARK-20261025-CON-005": {
    "stem": "既存のConnectクライアントを保ったままサーバーを更新し、アプリケーションの同時更新を減らしたいとします。互換性の確認は行います。この利点に必要な条件はどれですか。",
    "options": [
      "gRPCなら将来のRPCも無条件に使える",
      "既存クライアントが使うサーバーRPC定義の後方互換性が保たれる",
      "すべてのアプリケーションをクライアントのPython内で実行する",
      "全クライアントとサーバーが同じ仮想環境を共有する"
    ],
    "explanation": "クライアントとサーバーを独立に更新しやすい設計でも、既存クライアントが使うRPCの後方互換性は必要です。gRPCだから全バージョンが無条件に互換となるわけではありません。",
    "reasons": [
      "gRPCはすべてのversion組合せの互換を自動保証しない。",
      "既存clientが利用するRPC定義の互換維持が条件。",
      "実行をclient プロセスへ移すことはserver独立更新の条件ではない。",
      "別プロセス環境を共有virtualenvへ統一する必要はない。"
    ]
  },
  "AUTHORED-SPARK-20261025-CON-006": {
    "stem": "クライアントでremote('sc://localhost:15002')を設定しましたが、ポートに待受プロセスがなく接続拒否になります。接続先を指定すればサーバーも起動すると思っていました。まず必要な対応はどれですか。",
    "options": [
      "同じSPARK_REMOTEを設定すれば自動起動する",
      "サーバーは停止したままhttps://へ変える",
      "対応するSpark配布物とConnectパッケージでサーバーを起動し、その待受先へ接続する",
      "remoteセッションを繰り返し作れば待受が始まる"
    ],
    "explanation": "remoteやSPARK_REMOTEは接続先の指定で、サーバー起動ではありません。対応するSparkとConnectパッケージを使ってサーバーを起動し、待受先へ接続します。",
    "reasons": [
      "SPARK_REMOTEも宛先設定でありserver起動命令ではない。",
      "接続URIのschemeを書き換えてもserver プロセスは発生しない。",
      "listenするserver プロセスを先に用意する。",
      "remote sessionを増やすことはserver プロセス起動の代替にならない。"
    ]
  },
  "AUTHORED-SPARK-20261025-CON-007": {
    "stem": "Connectクライアントにはpricing_rulesがありますが、UDF内でimportするとリモートPythonワーカーでModuleNotFoundErrorになります。接続と組み込み処理は正常です。適切な対応はどれですか。",
    "options": [
      "クライアントの仮想環境だけへ再インストールする",
      "対応する依存関係の配布手段で、実行先のPythonワーカーでも使えるようにする",
      "新しいサーバーを起動せず、接続先だけlocalhostへ変える",
      "クライアントのdriver-memoryだけを増やす"
    ],
    "explanation": "クライアントでimportできても、UDFを動かすリモートPythonワーカーに同じパッケージがあるとは限りません。エラーが出た実行先で使えるよう、依存関係を配布します。",
    "reasons": [
      "依存不足が起きたのはremote ワーカーであり、クライアントだけの再インストールでは解決しない。",
      "実際にUDFを実行するremote ワーカーのPython環境へ依存関係を届ける。",
      "接続先を変えても必要なpackageが配布されるわけではなく、接続失敗にもなり得る。",
      "メモリ量ではなくPython環境にpackageが見つからない問題。"
    ]
  },
  "AUTHORED-SPARK-20261025-PAN-001": {
    "stem": "スカラーpandas UDFで値を2倍にし、null行も含めて1入力に1出力を保ちます。掲載のs.dropna()*2は、[1.0,null,3.0]の入力で長さが変わります。依存ライブラリは正常です。正しい修正はどれですか。",
    "options": [
      "戻り値型を省略して短いSeriesを許容させる",
      "s*2を返し、元の長さと欠損位置を保つ",
      "スカラーpandas UDFは任意行数を返せるので変更不要",
      "合計の2倍だけを1要素Seriesで返し、Sparkに全行への配布を任せる"
    ],
    "explanation": "スカラーのSeries→Series UDFは、入力と同じ長さのSeriesを返す必要があります。dropnaは行数を減らすため不適切です。s*2なら欠損位置も長さも保てます。",
    "reasons": [
      "戻り型宣言を消してもscalar UDFの長さ要件は変わらない。",
      "行数とNULL位置を保持して要素ごとの計算を行う。",
      "scalar UDFは任意行数のmapInPandasとは契約が違う。",
      "集約1値を返す関数ではなく、Sparkが自動broadcastして長さ補正する保証はない。"
    ]
  },
  "AUTHORED-SPARK-20261025-PAN-002": {
    "stem": "customer_idでapplyInPandasする処理で、1顧客だけ数百万行あり、そのグループでPythonワーカーがメモリ不足です。arrow.maxRecordsPerBatchを下げても解消しません。Spark 3.5.6での正しい説明はどれですか。",
    "options": [
      "applyInPandasは常に入力全体をドライバーへ集める",
      "グループ全体が関数用にメモリへ入り、maxRecordsPerBatchはそのグループの行数を制限しない",
      "設定により各グループが必ず独立した小さい呼び出しへ分割される",
      "1行ずつ処理するので、影響するのは1行の大きさだけ"
    ],
    "explanation": "applyInPandasはグループ全体を1つのpandas DataFrameとして関数へ渡します。maxRecordsPerBatchではその巨大グループを分割できないため、偏りとグループ単位のメモリ量を見直します。",
    "reasons": [
      "全入力をドライバーへ集める処理ではなく、問題はワーカー内グループの大きさ。",
      "関数の入力単位はグループ全体でバッチ設定とは別。",
      "その設定は巨大グループの自動分割を保証しない。",
      "関数へ1行ずつ渡すAPIではない。"
    ]
  },
  "AUTHORED-SPARK-20261025-PAN-003": {
    "stem": "arrow.pyspark.enabledを無効にしました。必要なpandasとPyArrowは導入済みで、有効なスカラーpandas UDFも定義しています。この設定で通常の行単位Python UDFに変わる、という理解は正しいですか。",
    "options": [
      "設定はtoPandas/createDataFrameの変換最適化に関するもので、明示したpandas UDFを通常UDFへ変えない",
      "すべてのpandas UDFから宣言した戻り値型が消える",
      "依存関係が正常でもすべてのpandas UDFが必ず失敗する",
      "falseなら全pandas UDFが自動で通常Python UDFになる"
    ],
    "explanation": "arrow.pyspark.enabledは主にtoPandasやcreateDataFrameの変換最適化の設定です。明示したpandas UDFの種類を、通常の行単位UDFへ変えるスイッチではありません。",
    "reasons": [
      "変換最適化設定と明示定義したPandas UDFの契約を区別する。",
      "Spark return typeを消す設定ではない。",
      "その設定だけを理由にPandas UDF全件が失敗するわけではない。",
      "falseによってpandas_udfが通常udfへ書き換わるわけではない。"
    ]
  },
  "AUTHORED-SPARK-20261025-PAN-004": {
    "stem": "pandas API on Sparkのpsdfに変換が積み重なり、論理計画が巨大化して計画作成が遅くなりました。永続的なチェックポイント先は設定済みで、中間結果の実体化も可能です。全データをローカルpandasへ集めず、過去の計画を切る操作はどれですか。",
    "options": [
      "psdf.to_pandas()",
      "psdf.head(5)",
      "psdf=psdf.spark.checkpoint()",
      "psdf.spark.explain()"
    ],
    "explanation": "psdf.spark.checkpoint()は中間結果を保存し、それ以前の複雑な計画を切り離します。戻り値を後続処理に使えばよく、全データをローカルpandasへ集める必要はありません。",
    "reasons": [
      "全体をローカルpandasへ収集するため、分散処理を維持する要件に合わない。",
      "先頭の一部を見るもので、全データの中間結果をcheckpointする方法ではない。",
      "設定済みcheckpoint先へ結果を保存し、計画を切断したDataFrameを使う。",
      "計画を表示して調査できるが、計画自体を切断しない。"
    ]
  }
};
