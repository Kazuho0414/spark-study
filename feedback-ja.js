/* Japanese study feedback. Stable question IDs; option arrays use canonical order. */
const SPARK_FEEDBACK_JA = {
  "PASTED-SPARK-20261024-001": {
    "stem": "開発者が、複数のDataFrame変換とアクションを実行するSparkアプリケーションを作成しています。アプリケーションの実行中にSparkSessionを効率よく管理し、最適なパフォーマンスを確保したいと考えています。\n\nこのSparkアプリケーション内でSparkSessionを管理する最適な方法はどれですか。",
    "options": [
      "各アクションを実行するたびにSparkSessionを停止し、新しいSparkSessionを開始する。",
      "SparkSessionを使用せず、SparkContextだけに依存する。",
      "変換を実行する前に、毎回新しいSparkSessionを生成する。",
      "SparkSessionを1つ作成し、アプリケーション全体を通して再利用する。"
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
    "stem": "データエンジニアが、次のように定義されたnum_dfというDataFrameを扱っています。\n\n```\nnum_df = spark.range(5).toDF(\"num\")\n```\n\nさらに、次のPython UDFを定義しています。\n\n```\ndef cubefunc(val):\n \n    return val ** 3\n```\n\nこの関数をSpark SQLのUDFとして正しく登録し、DataFrame num_dfへ適用するコードはどれですか。",
    "options": [
      "spark.udf.register(\"cubeudf\", cubefunc, IntegerType())\nnum_df.selectExpr(\"cubeudf(num)\")",
      "cubeudf = udf(cubefunc)\nnum_df.select(cubeudf(col(\"num\")))",
      "spark.udf.register(\"cubeudf\", cubefunc, DoubleType())\nnum_df.selectExpr(\"cubeudf(num)\")",
      "cubeudf = udf(cubefunc)\nnum_df.selectExpr(\"cubeudf(num)\")"
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
    "stem": "events_parquetという場所に保存されたParquetデータセットのスキーマを表示するには、どのコードを使用しますか。",
    "options": [
      "spark.sql(\"SELECT * FROM \" + events_parquet).printSchema()",
      "spark.sql(\"SELECT * FROM parquet.`\" + events_parquet + \"`\").printSchema()",
      "spark.sql(\"SELECT * FROM \" + events_parquet).show()",
      "spark.sql(\"SELECT * FROM parquet.`\" + events_parquet + \"`\").show()"
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
    "stem": "データサイエンティストがApache Sparkで大きなデータセットを扱い、DataFrameに対してSQLクエリを実行したいと考えています。データセットには機密情報が含まれるため、アクセス可能な範囲は現在のSparkセッションだけに限定する必要があります。\n\nDataFrameからSQL構文で問い合わせ可能なビューを作成し、以前に作成された同名ビューとの競合も避けるには、どのメソッドを使用しますか。",
    "options": [
      "df.createTempView(\"my_view\")",
      "df.registerTempTable(\"my_view\")",
      "df.createGlobalTempView(\"my_view\")",
      "df.createOrReplaceTempView(\"my_view\")"
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
    "stem": "データエンジニアが、複数のDataFrameを結合するSparkジョブを開発しています。複数の結合を行う次のコードを考えてください。\n\n```\ndata1 = [Row(id=1, value=\"A\")]\ndf1 = spark.createDataFrame(data1)\n \ndata2 = [Row(id=1, description=\"Desc1\")]\ndf2 = spark.createDataFrame(data2)\n \ndata3 = [Row(id=1, details=\"Details1\")]\ndf3 = spark.createDataFrame(data3)\n \njoined_df = df1.join(broadcast(df2), df1.id == df2.id, \"inner\") \\\n .join(broadcast(df3), df2.id == df3.id, \"inner\")\n```\n\nこのコードを実行すると、どのような結果になりますか。",
    "options": [
      "Sparkでは1つのクエリでブロードキャスト結合を1回しか使用できないため、コードは失敗する。",
      "2回目の結合条件df2.id == df3.idが誤っており、df1.id == df3.idにする必要があるため、コードは失敗する。",
      "コードは正常に実行され、最初にdf1とdf2を結合し、次にその結果とdf3を結合する、2回のブロードキャスト結合を行う。",
      "broadcast関数の使い方が不適切なためエラーになる。結合前にdf2とdf3をそれぞれ別にブロードキャストする必要がある。"
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
    "stem": "データエンジニアが、大きなテキストファイルを読み、不正なレコードを除外し、特定の列を基準にグループ化するSparkジョブを実行しています。結果をテーブルへ書き込んだ後、性能を改善するためにSparkがどのようにジョブを実行したか分析したいと考えています。\n\nSparkがこれらの操作を処理する流れを最も適切に説明するものはどれですか。",
    "options": [
      "Sparkは最初にテキストファイル全体をメモリへ読み込み、次にフィルターを適用し、最後に指定列でグループ化する。",
      "Sparkはテキストファイルを読み、フィルターをアクションとして実行した後、グループ化を変換として実行する。",
      "Sparkはテキストファイルを遅延的に読み、フィルターとグループ化を1つの変換として扱い、アクションが呼ばれたときに初めて一連の処理を実行する。",
      "Sparkはテキストファイルを遅延的に読み、フィルターを狭い依存関係の変換（narrow transformation）として適用し、次に指定列でのグループ化を、シャッフルを伴う広い依存関係の変換（wide transformation）として実行する。"
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
    "stem": "大手EC企業のデータサイエンティストが、毎日2TBの顧客取引データを処理・分析する必要があります。組織は、リアルタイムの不正検知と、顧客ごとに個別化した商品推薦を実現する予定です。現在は従来のリレーショナルデータベースで処理していますが、増え続けるデータ量と処理速度の要件に対応できなくなっています。\n\nこの状況の課題を最も効果的に解決するApache Sparkの機能はどれですか。",
    "options": [
      "小規模なデータセットを効率よく処理できること。",
      "構造化データセットに対するSQLクエリをサポートすること。",
      "インメモリ計算と並列処理の機能を組み合わせられること。",
      "機械学習ライブラリが組み込まれていること。"
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
    "stem": "テーブルを保存または永続化するとき、データをパーティション分割する主な利点は何ですか。",
    "options": [
      "使用されていないパーティションを自動削除して、ストレージ効率を改善する。",
      "保存するデータを圧縮して、ディスク使用量を減らす。",
      "クエリが特定のパーティション内の必要なデータ部分だけを読み取れるようにし、処理性能を改善する。",
      "全データを一度にメモリへ読み込むことを保証して、クエリの実行を速くする。"
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
    "stem": "アプリケーションアーキテクトが、組織内で現在使っているSparkアプリケーションを刷新するため、Spark Connectの採用を検討しています。\n\n次の要件のうち、Spark Connectの採用を妨げるものはどれですか。",
    "options": [
      "デバッグのしやすさ：アプリケーションコード内で直接、対話的にデバッグできること。",
      "安定性：アプリケーションコードとその依存関係を、他のアプリケーションやSparkドライバーから分離できること。",
      "Spark APIへの完全対応：RDD APIを含む既存のコードを、いっさい変更せずSpark Connectへ移行できること。",
      "更新のしやすさ：Sparkドライバーとは独立してSparkアプリケーションを更新できること。"
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
    "stem": "Apache Sparkのアーキテクチャで、タスクが割り当てられた後、そのタスクを実行する責任を持つコンポーネントはどれですか。",
    "options": [
      "CPUコア",
      "ドライバーノード",
      "ワーカーノード",
      "エグゼキューター"
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
    "stem": "データエンジニアが、あるテーブルの全行を別のテーブルへ追加する必要があります。しかし、最初のテーブルの1列が、2つ目のテーブルには存在しません。現在の実装を実行すると、次のエラーが発生します。\n\nAnalysisException: [NUM_COLUMNS_MISMATCH] UNIONは、列数が同じ入力に対してしか実行できません。\n\n現在の実装：\n\n`anz_df = au_df.union(nz_df)`\n\nau_dfにはnz_dfにない列が1つ余分にありますが、それ以外の列名とデータ型は一致しています。\n\nDataFrame同士を正常に結合するために、どのように変更しますか。",
    "options": [
      "anz_df = au_df.unionByName(nz_df, allowMissingColumns=False)",
      "anz_df = au_df.unionAll(nz_df)",
      "anz_df = au_df.unionByName(nz_df, allowMissingColumns=True)",
      "anz_df = au_df.join(nz_df, how='full_outer')"
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
    "stem": "データエンジニアが、定期バッチ処理中に十分活用されていないSparkクラスターを分析しています。ログを確認すると、ネットワークのハートビートがタイムアウトした後、エグゼキューターが失われたものと判断されています。資源に関する警告は既に解消されており、正常なエグゼキューターの応答が現在のネットワークタイムアウトを超えて届くことも確認されています。\n\nこのクラスター利用率の問題に対処するため、どの対応を行いますか。",
    "options": [
      "Sparkの設定で、エグゼキューターに割り当てるメモリを増やす。",
      "正常なエグゼキューターが失われたと判断される前に、診断済みのネットワーク／ハートビートの遅延を許容できるよう、spark.network.timeoutを調整する。",
      "エグゼキューターのインスタンス数を増やし、同時に処理できるタスクを増やす。",
      "データパーティションを小さくして、タスクのスケジューリング効率を上げる。"
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
    "stem": "データアナリストがemployees_dfというDataFrameを扱っています。salaryの10%として計算するtaxという新しい列を作り、不要になったage列を削除する必要があります。\n\ntax列を正しく追加し、age列をDataFrameから削除するコードはどれですか。",
    "options": [
      "employees_df = employees_df.withColumn(\"tax\", employees_df.salary * 10).dropField(\"age\")",
      "employees_df = employees_df.withColumn(\"tax\", employees_df.salary * 0.1).drop(\"age\")",
      "employees_df = employees_df.withColumn(\"tax\", lit(0.1) * col(\"salary\")).dropField(\"age\")",
      "employees_df = employees_df.withColumn(\"tax\", employees_df.salary * 10).drop(\"age\")"
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
    "stem": "データエンジニアリングチームが、取引システムからデータを抽出するパイプラインを作成しました。取引システムのタイムスタンプはUTCで保存されているため、rawというDataFrameにもUTCのまま取り込んでいます。正確なレポートを作成するため、transaction_datetimeをAmerica/New_Yorkタイムゾーンへ変換する必要があります。\n\ntransaction_datetimeの変換には、どのコードを使用しますか。",
    "options": [
      "raw.withColumn( \"transaction_datetime\", from_utc_timestamp (col (\"transaction_datetime\"), \"America/New_York\"), )",
      "raw.withColumn( \"transaction_datetime\", date_format (col (\"transaction_datetime\"), \"America/New_York\") )",
      "raw.withColumn( \"transaction_datetime\", to_utc_timestamp (col (\"transaction_datetime\"), \"America/New_York\"), )",
      "raw.withColumn( \"transaction_datetime\", from_utc_timestamp (col (\"transaction_datetime\")), )"
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
    "stem": "データサイエンティストが、1台のマシンのメモリに収まらない非常に大きなデータセットを分析しています。通常のPythonスクリプトなど、従来の単一マシン向けのプログラミング手法の代わりに、Apache Sparkの利用を検討しています。\n\nこの状況で、一般的な単一マシンのプログラミング手法に対し、Apache Sparkが提供する利点を2つ選んでください。",
    "options": [
      "全てのデータ処理操作を自動管理するため、コードを書く必要がなくなる。",
      "耐障害性が組み込まれており、計算中にノードが故障しても自動で復旧できる。",
      "ディスクストレージだけからデータを処理し、メモリへの依存を最小限にする。",
      "計算を複数マシンのクラスターへ分散し、水平方向に拡張できる。",
      "動作には特殊なハードウェアが必要で、一般的なハードウェアのクラスターでは実行できない。"
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
    "stem": "Apache Sparkで、有向非巡回グラフ（DAG）は実行の階層をどのように表しますか。",
    "options": [
      "複数ジョブの実行を表し、各ジョブはステージもタスクも持たず、独立して動作する。",
      "1つのジョブを依存関係のあるステージの流れとして表し、各ステージを複数の並列タスクへ分割する。",
      "Sparkのタスクを個別のジョブとして表し、各ジョブは複数のアプリケーションから構成される。",
      "ステージやジョブは考慮せず、実行の最後のタスクだけを表す。"
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
    "stem": "データエンジニアが、10個のSparkパーティションに分かれた20億件のレコードを持つデータセットを処理しています。user_id列に基づく一意なユーザー数の近似値と、transaction_amountの平均を求める必要があります。シャッフル操作を最小限にし、性能を改善するため、両方を1回の集約で計算しなければなりません。\n\n最適なパフォーマンスを保ちながら、この計算を正しく行うSparkコードはどれですか。",
    "options": [
      "```\nfrom pyspark.sql.functions import approx_count_distinct, avg\n \ndf.agg(\n    approx_count_distinct(\"user_id\").alias(\"approx_count_distinct\"),\n    avg(\"transaction_amount\").alias(\"average_transaction\")\n).show()\n```",
      "```\nfrom pyspark.sql.functions import countDistinct, avg\n \ndf.agg(\n    countDistinct(\"user_id\").alias(\"approx_count_distinct\"),\n    avg(\"transaction_amount\").alias(\"average_transaction\")\n).show()\n```",
      "```\ndf.createOrReplaceTempView(\"transactions\")\n \nspark.sql(\"\"\"\nSELECT\nCOUNT(DISTINCT user_id) AS approx_count_distinct,\nAVG(transaction_amount) AS average_transaction\nFROM transactions\n\"\"\").show()\n```",
      "```\nfrom pyspark.sql.functions import col\n \napprox_count = df.select(\"user_id\").distinct().count()\naverage_transaction = df.select(\"transaction_amount\").groupBy().avg().collect()[0][0]\n \nprint(approx_count, average_transaction)\n```"
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
    "stem": "開発者が、epoch_time列を持つdf_epoch_timeというDataFrameを確認しています。この列にはUNIX epochタイムスタンプ、すなわち1970年1月1日00:00:00 UTCからの経過秒数が格納されています。このタイムスタンプから月を取り出し、monthという新しい列として追加する必要があります。\n\nこの要件を正しく満たすコードはどれですか。",
    "options": [
      "df_epoch_time = df_epoch_time.withColumn(\"month\", from_unixtime(\"epoch_time\").substr(4,2))",
      "df_epoch_time = df_epoch_time.withColumn(\"month\", month(from_unixtime(\"epoch_time\")))",
      "df_epoch_time = df_epoch_time.withColumn(\"month\", month(\"epoch_time\"))",
      "df_epoch_time = df_epoch_time.withColumn(\"month\", col(\"epoch_time\").substr(6,2))"
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
    "stem": "Parquetファイルにはnameとaddressという2つの列があり、どちらも文字列型で保存されています。\n\n次のコードで作成されるDataFrameのスキーマはどれですか。\n\n```\ndf = spark.read.parquet(\"path/to/file\")\n```\n\n",
    "options": [
      "name: String, address: String",
      "c0: String",
      "Name: String, Address: String",
      "c0: String, c2: String"
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
    "stem": "ある組織が本番環境でSparkアプリケーションを運用しており、資源の消費を減らすためにSpark History Serverを無効にすることを検討しています。\n\n本番環境でSpark History Serverを無効にすると、どのような影響がありますか。",
    "options": [
      "長時間動くジョブで、ドライバーログが蓄積されなくなる。",
      "ログ記録の負担が減り、ジョブの実行速度が上がる。",
      "過去のジョブのログを参照できなくなり、完了したジョブをデバッグする能力が制限される。",
      "ログサイズが小さくなるため、エグゼキューターの性能が改善する。"
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
    "stem": "データエンジニアが、数百万件のレコードを含むsales_dataというPySpark DataFrameを扱っています。地域ごとに売上金額の合計を求める必要があり、処理を読みやすく保守しやすくするためSpark SQLを使いたいと考えています。\n\nこの処理を実現するために行う手順はどれですか。",
    "options": [
      "PySparkのgroupByとaggメソッドを使い、DataFrameへ直接集約処理を書く。",
      "DataFrameをCSVへ出力し、リレーショナルデータベースに読み込んで、そこでSQLクエリを実行する。",
      "createOrReplaceTempViewでsales_dataを一時ビューとして登録し、Spark SQLで集約を実行する。",
      "sales_dataをpandas DataFrameへ変換し、pandasでSQLに似た操作を使ってグループ化する。"
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
    "stem": "データエンジニアが、Spark Structured StreamingでファイルソースをAvailable-nowのマイクロバッチとして読み取る際、各マイクロバッチの大きさを制御したいと考えています。\n\nバッチの大きさを制御するために使用する入力ソースのオプションはどれですか。",
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
    "stem": "createOrReplaceTempViewを使い、異なる2つのDataFrameをmyViewという同じビュー名で登録すると、どうなりますか。",
    "options": [
      "両方のDataFrameを、同じビュー名で同時に参照できるようになる。",
      "2つのDataFrameがmyViewという1つのビューへ結合される。",
      "myViewという同名ビューが既に存在することを示す例外が発生する。",
      "同じビュー名で新たに登録したDataFrameにより、既存のビューが置き換えられる。"
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
    "stem": "データエンジニアが、path/to/dataという場所に保存されている既存の実データを上書きする必要があります。\n\n指定したパスのデータを上書きするコードはどれですか。",
    "options": [
      "INSERT 'path/to/data' USING parquet OPTIONS (col1 1, col2 2, col3 'test')\nSELECT * FROM source_data;",
      "INSERT OVERWRITE DIRECTORY 'path/to/data' USING parquet OPTIONS (col1 1, col2 2, col3 'test')\nSELECT * FROM source_data;",
      "INSERT OVERWRITE 'path/to/data' USING parquet OPTIONS (col1 1, col2 2, col3 'test')\nSELECT * FROM source_data;",
      "OVERWRITE 'path/to/data' USING parquet OPTIONS (col1 1, col2 2, col3 'test')\nSELECT * FROM source_data;"
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
    "stem": "開発者が、単一マシンのメモリに収まらない大規模な構造化データを扱う必要があります。このデータセットに対し、複雑な集約や変換を含むクエリも実行しなければなりません。\n\nこの状況で必要な機能を提供するApache Sparkのモジュールまたはコンポーネントを2つ選んでください。",
    "options": [
      "Structured Streaming",
      "Spark SQL",
      "DataFrame",
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
    "stem": "データエンジニアが、最近になって通常より遅くなった定期実行のSparkアプリケーションを調査しています。クエリ計画を確認すると、Adaptive Query Execution（AQE）がソートマージ結合をブロードキャスト結合へ変換しなくなっており、そのためSparkジョブで追加のシャッフルが発生しています。\n\nこの動作の変化として最も考えられる原因はどれですか。",
    "options": [
      "小さい側のテーブルのサイズが増え、AQEがブロードキャスト結合へ変換できる設定上の閾値を超えた。",
      "ANALYZE TABLEを実行してから長期間が経ち、テーブルの統計が古くなった。",
      "Sparkのバージョン更新によってAQEが無効になった。",
      "2つのテーブルの結合キーの分布が、時間とともにますます偏るようになった。"
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
    "stem": "データエンジニアが、不規則な間隔でレコードが届くストリーミングデータを処理しています。order_idに基づいて重複レコードを除く必要があり、同じ注文の重複データは、イベント時刻の差が既知の一定範囲内で到着します。遅れて届くデータも効率よく扱い、メモリの過大な使用を抑える必要があります。\n\nこの重複除去には、どの方法を使用しますか。",
    "options": [
      "重複データ同士のイベント時刻の最大差より長い遅延しきい値で`withWatermark()`を適用し、その後`dropDuplicatesWithinWatermark([\"order_id\"])`を使う。",
      "タイムスタンプ列にdropDuplicates()を使い、最も新しいタイムスタンプに基づいて重複を除く。",
      "遅れて到着するデータを考慮する必要があるストリーミングでは、重複除去はサポートされていない。",
      "watermarkを設定せず、order_idにdropDuplicates()を使って重複を除く。"
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
    "stem": "開発者がID・Name・Salary列を含むemployee.csvを持っています。このファイルをDataFrameへ読み込み、各列がそれぞれInteger・String・Float型として解釈されるよう、スキーマを明示的に定義する必要があります。\n\nこの要件を正しく満たすコードはどれですか。",
    "options": [
      "```\nschema = StructType([\n    StructField(\"ID\", IntegerType(), True),\n    StructField(\"Name\", StringType(), True)],\n    StructField(\"Salary\", FloatType(), True)\n)\n \ndf = spark.read.option(\"header\", \"true\") \\\n    .csv(\"employee.csv\")\n```",
      "```\ndf = spark.read.option(\"inferSchema\", \"true\") \\\n    .csv(\"employee.csv\")\n```",
      "```\ndf = spark.read.option(\"header\", \"true\") \\\n    .csv(\"employee.csv\", schema=\"ID INT, Name STRING, Salary FLOAT\")\n```",
      "```\nschema = StructType([\n    StructField(\"ID\", IntegerType(), True),\n    StructField(\"Name\", StringType(), True),\n    StructField(\"Salary\", FloatType(), True)\n])\n \ndf = spark.read.option(\"header\", \"true\") \\\n    .csv(\"employee.csv\", schema=schema)\n```"
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
    "stem": "次のコードを考えてください。\n\n```\ndiv_by_2 = my_df.filter(\"number % 2 = 0\")\nprint(div_by_2)\n```\n\nこのコードの出力は次のとおりです。\n\n```\nDataFrame[number: bigint]\n```\n\nApache Sparkの実行モデルの観点から、この出力を最も適切に説明するものはどれですか。",
    "options": [
      "filter変換はすぐに計算を開始し、条件に一致する行だけを返す。",
      "Sparkの変換は全て遅延評価であり、その場ですぐに結果を計算しない。",
      "Sparkでは変換を行うたび、その結果がアクションで自動処理される。",
      "Sparkのfilterはアクションであり、my_dfの絞り込みをすぐに実行し、その結果をdiv_by_2として返す。"
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
    "stem": "Apache Sparkの実行モデルのうち、変換の実行を遅らせ、アクションが呼ばれる前に実行計画を最適化できるようにする機能はどれですか。",
    "options": [
      "即時実行",
      "Catalystオプティマイザーと組み合わせた遅延評価",
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
    "stem": "Apache Sparkのclientモードを特徴づけるものはどれですか。",
    "options": [
      "clientモードではタスクをクライアントからワーカーノードへ直接送り、通信の負担を減らして性能を改善する。",
      "clientモードではドライバーがクライアントマシン上で動き、ネットワーク通信のため遅延が大きくなる可能性がある。",
      "clientモードではドライバーがクラスターマネージャー上で動き、複数マシンの資源を利用できる。",
      "clientモードではドライバーがアプリケーションを送信したマシン上で動くため、デバッグしやすい一方、利用できる資源が限られる可能性がある。"
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
    "stem": "DataFrame dfのsalary列にはnullが含まれています。\n\nこの列の全てのnullを0へ置き換えるコマンドはどれですか。",
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
    "stem": "EC企業のデータアナリストが、約50,000件、合計約20MBの日次売上データを処理する必要があります。データは1つのCSVファイルに保存されており、集約を行って概要レポートを作成します。\n\nこの状況に最も適した方法はどれですか。",
    "options": [
      "Spark Streamingを使うリアルタイムのストリーミングパイプラインを構築し、到着するデータを処理する。",
      "pandasライブラリを使うローカルのPythonスクリプトで、CSVを読み込み分析する。",
      "分散クラスターにApache Sparkを構築し、データを並列処理する。",
      "HDFSとMapReduceを含むHadoop環境を構成し、分散処理を行う。"
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
    "stem": "データエンジニアが、次の順に処理するSparkアプリケーションを調整しています。\n\n- 分散ストレージからDataFrameへデータを読む。\n- filter変換で不要なレコードを除く。\n- 別の大きなDataFrameと結合する。\n- groupByとaggでデータを集約する。\n- 最終結果をストレージへ書く。\n\nSparkがこのアプリケーションの実行階層を構築する方法について、正しい説明を2つ選んでください。",
    "options": [
      "groupByとaggはシャッフルを起こすことがあり、実行計画に追加のステージが作られる可能性がある。",
      "アプリケーション全体は、書き込みアクションで開始される1つのジョブとして実行される。",
      "DataFrame APIの自動最適化により、全てのシャッフル操作が除去される。",
      "結合はシャッフルを起こすことがあり、その結果、実行計画に新しいステージができる。",
      "filterとjoinは両方ともnarrow変換なので、同じステージで実行される。"
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
    "stem": "性能を改善するため、開発者がDataFrameのパーティション数を100へ減らそうとしています。この処理にcoalesce()とrepartition()のどちらを使うか、判断する必要があります。\n\nこの2つの関数は、それぞれどのように動作しますか。",
    "options": [
      "coalesce()は既存のパーティションをまとめ、シャッフルを最小限に抑えて数を減らす。一方、repartition()はデータ全体をシャッフルする。",
      "どちらのメソッドも、クラスター全体へデータを均等にシャッフルする。",
      "どちらのメソッドも、現在のパーティション分割を維持し、同じ量のメモリを必要とする。",
      "coalesce()はデータ全体をシャッフルし、repartition()はシャッフルを最小限に抑えてパーティションを減らす。"
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
    "stem": "開発者が、Spark 3.5.0で追加された組み込み関数を活用するため、古いSparkコードの書き換えを考えています。\n\n既存のDataFrameコードは次のとおりです。\n\n```\nimport pyspark.sql.functions as F\n \nmin_price = 110.50\n \nresult_df = prices_df \\\n    .filter(F.col(\"spot_price\") >= F.lit(min_price)) \\\n    .agg(F.count(\"*\"))\n```\n\n新しい組み込み機能を使って同じ処理へ書き換えるには、どのコードを使用しますか。",
    "options": [
      "```\nresult_df = prices_df \\\n    .withColumn(\"valid_price\",\n        F.when(F.col(\"spot_price\") > F.lit(min_price), 1).otherwise(0)\n    )\n```",
      "```\nresult_df = prices_df \\\n    .agg(F.count_if(F.col(\"spot_price\") >= F.lit(min_price)))\n```",
      "```\nresult_df = prices_df \\\n    .agg(F.min(\"spot_price\"), F.max(\"spot_price\"))\n```",
      "```\nresult_df = prices_df \\\n    .agg(F.count(\"spot_price\").alias(\"spot_price\")) \\\n    .filter(F.col(\"spot_price\") > F.lit(\"min_price\"))\n```"
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
    "stem": "データエンジニアが、1000パーティションの大きなSpark DataFrame dfを作成し、100パーティションに減らす必要があります。\n\nパーティション間でデータを再シャッフルせずに、パーティション数を減らせる方法はどれですか。",
    "options": [
      "new_df = df.repartition(100)",
      "new_df = df.limit(100)",
      "new_df = df.head(100)",
      "new_df = df.coalesce(100)"
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
    "stem": "Apache SparkでAdaptive Query Execution（AQE）を使う主な利点は何ですか。",
    "options": [
      "実行前にSparkがクエリ計画を最適化できるが、実行中には調整しない。",
      "実行中にクエリ計画を動的に調整し、データの偏りへの対処、結合戦略の最適化、クエリ全体の性能改善を行える。",
      "タスクを並列化してクエリ実行を改善するが、データの偏りなど実行時の指標に応じて戦略を変えない。",
      "クラスターのノード間へタスクを自動配分するが、実行中のクエリ計画は変更しない。"
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
    "stem": "データエンジニアが、次のコードでusers_vwというビューを作成しました。\n\n```\ndf.createOrReplaceTempView(\"users_vw\")\n```\n\n一時ビューを再作成せず、新しいセッションでもSQLからデータを参照できるようにするには、現在のセッションを終了する前にどの方法を取りますか。",
    "options": [
      "Sparkを使ってusers_vwビューへ直接問い合わせる。",
      "users_vwのデータをテーブルとして永続化する。",
      "users_vwビューを再作成し、Sparkから問い合わせる。",
      "users_vwの定義を保存し、後からSparkで問い合わせる。"
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
    "stem": "データエンジニアが、ファイルベースのデータソースを特定の保存先へ永続化する必要があります。しかし、テーブルとして保存すると、既定のwarehouseディレクトリへ自動的に保存されてしまいます。\n\n既定のwarehouseパスではなく、独自の保存先へデータを書き込むコードはどれですか。",
    "options": [
      "users.write(path=\"/some/path\").saveAsTable(\"default_table\")",
      "users.write.saveAsTable(\"default_table\").option(\"path\", \"/some/path\")",
      "users.write.option(\"path\", \"/some/path\").saveAsTable(\"default_table\")",
      "users.write.saveAsTable(\"default_table\", path=\"/some/path\")"
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
    "stem": "データサイエンティストが、機械学習モデルの特徴量を作るためにユーザープロフィールを分析しています。探索的分析の中で、複数フィールドにnullを含むレコードがあり、モデリングに信頼して使えないことが分かりました。\n\nプロフィールテーブルのスキーマは次のとおりです。\n\n```\nuser_id STRING\nusername STRING\nfull_name STRING\ndate_of_birth DATE\nprimary_email STRING\ncreated_ts TIMESTAMP\nupdated_ts TIMESTAMP\nlast_login_ts TIMESTAMP\n```\n\n後続処理の前に、どれか1列でもnullを含むレコードは全て削除することにしました。\n\nこの要件を満たすSparkコードはどれですか。",
    "options": [
      "filtered_df = users_raw_df.na.drop(thresh=0)",
      "filtered_df = users_raw_df.na.drop(how='all')",
      "filtered_df = users_raw_df.na.drop(how='any')",
      "filtered_df = users_raw_df.na.drop(how='all', thresh=None)"
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
    "stem": "データエンジニアが、Apache Spark Structured Streamingでリアルタイム分析パイプラインを作成しています。到着するデータを、5秒という一定間隔で実行するマイクロバッチとして処理したいと考えています。トリガーで、各マイクロバッチの実行を開始するタイミングを制御する必要があります。\n\nこの要件を満たすコードはどれですか。",
    "options": [
      "```\nquery = df.writeStream \\\n    .outputMode(\"append\") \\\n    .trigger(continuous=\"5 seconds\") \\\n    .start()\n```",
      "```\nquery = df.writeStream \\\n    .outputMode(\"append\") \\\n    .trigger() \\\n    .start()\n```",
      "```\nquery = df.writeStream \\\n    .outputMode(\"append\") \\\n    .trigger(processingTime=\"5 seconds\") \\\n    .start()\n```",
      "```\nquery = df.writeStream \\\n    .outputMode(\"append\") \\\n    .trigger(processingTime=5000) \\\n    .start()\n```"
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
    "stem": "データアナリストがdates_dfというDataFrameを扱っています。既存のtimestamp列からdateという新しい列を作成する必要があり、新しい列はSparkのDateTypeでなければなりません。\n\nタイムスタンプから日付部分を取り出すには、どのコードを使用しますか。",
    "options": [
      "dates_df.withColumn(\"date\", f.unix_timestamp(\"timestamp\")).show()",
      "dates_df.withColumn(\"date\", f.to_date(\"timestamp\")).show()",
      "dates_df.withColumn(\"date\", f.date_format(\"timestamp\", \"yyyy-MM-dd\")).show()",
      "dates_df.withColumn(\"date\", f.from_unixtime(\"timestamp\")).show()"
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
    "stem": "データサイエンティストが、Databricks上のApache Sparkで大規模なデータ分析を行っています。2億行の顧客取引DataFrameと、3000行の商品情報を持つはるかに小さいDataFrameを結合する処理が必要です。\n\n結合の性能を改善するための最適な方法はどれですか。",
    "options": [
      "大きい側のDataFrameを配布して、ブロードキャスト結合を行う。",
      "結合前に両方のDataFrameを並べ替えて、ソートマージ結合を行う。",
      "両方のDataFrameをクラスター全体へ均等に分配して、シャッフルハッシュ結合を行う。",
      "小さい側のDataFrameを配布して、ブロードキャスト結合を行う。"
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
    "stem": "Apache Sparkの実行時における、ジョブ・ステージ・タスクの正しい関係はどれですか。",
    "options": [
      "1つのジョブは複数のステージから成り、各ステージは複数のタスクから成る。",
      "1つのジョブは複数のタスクを含み、各タスクは複数のステージを含む。",
      "1つのステージは複数のジョブから成り、各ジョブは複数のタスクを含む。",
      "1つのステージは複数のタスクを含み、各タスクは複数のジョブを含む。"
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
    "stem": "テスト中にSparkジョブをlocalモードで実行するとき、資源を最適に活用する方法はどれですか。",
    "options": [
      "localモードではなくclusterモードで実行するよう、アプリケーションを設定する。",
      "利用可能なCPUコア数に応じて、ローカルのスレッド数を増やす。",
      "spark.dynamicAllocation.enabledを有効にして、資源を動的に増減させる。",
      "spark.executor.memoryを非常に大きな値へ設定する。"
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
    "stem": "各エグゼキューターで同時に実行できるタスクの数を決めるSparkの設定はどれですか。",
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
    "stem": "非表示フィールド_metadata.file_pathに対応するDatabricks Runtimeを使用しているとします。\n\nデータサイエンティストが、複数のプレーンテキストファイルを含むディレクトリを取り込み、結果のDataFrameの各行へ、1ファイルの全文とそのファイルのフルパスを格納する必要があります。\n\n次の初期コードでファイルは読めますが、ファイルごとではなく、テキストの行ごとにDataFrameの行が作られます。\n\n```\nraw_txt_path = '/datasets/raw_txt/*'\n \ncorpus = spark.read.text(raw_txt_path) \\\n    .select(\"*\", \"_metadata.file_path\")\n```\n\n各行へ個々のテキスト行ではなくファイル全体の内容を入れるには、どの変更を行いますか。",
    "options": [
      "text()へwholetext=Trueを追加する。",
      "`text()`関数に`lineSep=\"\\n\"`オプションを追加する。",
      "text()へwholetext=Falseを追加する。",
      "`text()`関数に`lineSep=\",\"`オプションを追加する。"
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
    "stem": "データ変換にpandas API on Sparkを使う主な利点は何ですか。",
    "options": [
      "Pythonでしか利用できないため、開発者の習得の負担が減る。",
      "即時評価で計算をすぐに実行するため、使いやすい。",
      "単一ノードだけで実行し、メモリ上のDataFrameに依存するため、コスト効率がよい。",
      "pandas APIの豊富な機能を提供しながら、クラスター全体で利用可能な全コアを活用し、クエリを高速に実行できる。"
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
    "stem": "データエンジニアリングチームが、ビッグデータ処理に使う技術構成を比較しています。大規模データセットを処理し、SQLによる問い合わせの高水準APIを提供し、バッチとストリーミングの両方の処理を効率よくサポートする基盤が必要です。\n\nこの要件を最もよく満たすApache Sparkの利点を2つ選んでください。",
    "options": [
      "サーバーレスの仕組みで動くため、クラスターを管理する必要がない。",
      "フロントエンドアプリケーションを作るためのWeb開発フレームワークと容易に連携する。",
      "分散した機械学習モデルの学習機能が標準で組み込まれている。",
      "Spark SQLを通じ、SQLによる問い合わせを標準でサポートする。",
      "構造化データの処理と操作のため、DataFrameやDatasetなどの成熟したAPIを提供する。"
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
    "stem": "データエンジニアは、DataFrameのパーティションが多すぎるため小さなタスクが大量に発生し、Sparkアプリケーションの実行が遅くなっていることに気付きました。\n\n完全なシャッフルを発生させずにパーティション数を減らし、性能を改善するにはどうすればよいですか？",
    "options": [
      "`distinct()`変換を適用し、似たパーティションを結合する。",
      "`coalesce()`変換を使用し、現在より少ないパーティション数を指定する。",
      "`sortBy()`変換を使用してデータを再編成する。",
      "`repartition()`変換を使用し、現在より少ないパーティション数を指定する。"
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
    "stem": "エンジニアはdf1とdf2という2つのDataFrameを扱っています。df1は小さく、df2は大きいDataFrameです。結合処理の性能を改善するため、次のブロードキャスト結合を使用します。\n\n```\nfrom pyspark.sql.functions import broadcast\n \nresult = df2.join(broadcast(df1), on='id', how='inner')\n```\n\nこの状況で`broadcast()`を使用する目的は何ですか？",
    "options": [
      "結合処理を実行する前に`id`の値をフィルタリングする。",
      "`df1`と`df2`の両方のパーティションサイズを増やす。",
      "小さいDataFrameをすべてのExecutorノードに複製し、シャッフル処理を減らす。",
      "`id`の値が完全に一致する場合にのみ結合が行われるようにする。"
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
    "stem": "データエンジニアは、IoTセンサーデータを取り込んで生成されたParquetテーブルに重複レコードがあることを発見しました。\n\nテーブルのスキーマは次のとおりです。\n\n```\nevent_ts TIMESTAMP\nsensor_id STRING\nmetric_value LONG\ningest_ts TIMESTAMP\nsource_file_path STRING\n```\n\n各IoTセンサーイベントには、もともとevent_ts、sensor_id、metric_valueが含まれています。取り込み時にingest_tsとsource_file_pathが追加されます。分析の結果、実際のイベントのフィールド値は同じであるにもかかわらず、取り込み処理が重複レコードを作成していることが分かりました。\n\n元のイベントのフィールドに基づいて重複を正しく削除するには、どのコードを使用すべきですか？",
    "options": [
      "dedup_df = iot_bronze_df.dropDuplicates([\"ingest_ts\", \"sensor_id\", \"metric_value\", \"source_file_path\"])",
      "dedup_df = iot_bronze_df.dropDuplicates()",
      "dedup_df = iot_bronze_df.groupBy([\"event_ts\", \"sensor_id\", \"metric_value\"])",
      "dedup_df = iot_bronze_df.dropDuplicates([\"event_ts\", \"sensor_id\", \"metric_value\"])"
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
    "stem": "DataFrameを書き込む際、既存のJSONファイルを上書きするには、どのコマンドを使用すべきですか？",
    "options": [
      "df.write.mode(\"overwrite\").json(\"path/to/file\")",
      "df.write.overwrite.json(\"path/to/file\")",
      "df.write.json(\"path/to/file\", overwrite=True)",
      "df.write.format(\"json\").save(\"path/to/file\", mode=\"overwrite\")"
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
    "stem": "開発者はcolor、fruit、v1、v2という列を持つDataFrameを扱っています。開発者は次のコードでDataFrameを書き込みます。\n\n```\ndf.write.partitionBy(\"color\", \"fruit\").parquet(\"/path/to/output\")\n```\n\nこのコードを実行すると、どのような結果になりますか？",
    "options": [
      "すべてのデータが1つのParquetファイルに書き込まれる。",
      "パーティション列のいずれかにnull値があると、処理が失敗する。",
      "既存のParquetファイルに新しいパーティションが自動的に追記される。",
      "colorとfruitの値の一意な組み合わせごとに、別々のディレクトリが作成される。"
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
    "stem": "データエンジニアはApache Spark Structured Streamingでストリーミングパイプラインを構築し、遅れて到着するイベントを処理するためにウォーターマークを適用しています。使用しているコードは次のとおりです。\n\n```\ninputStream\n.withWatermark(\"event_time\", \"10 minutes\")\n.groupBy(window(\"event_time\", \"15 minutes\"))\n.count()\n```\n\nこのウォーターマークが提供する保証を正しく説明しているのはどれですか？",
    "options": [
      "ウォーターマークのしきい値（10分）を超えて遅れて到着したレコードでも、15分のウィンドウ内に入っていれば自動的に集計に含まれる。",
      "ウォーターマークのしきい値より10分を超えて遅れて到着するデータは、すべて無視され、集計から除外される。",
      "最新のウォーターマークより10分を超えて遅れて到着するデータも処理されるが、次のウィンドウに割り当てられる。",
      "最新の`event_time`からの遅れが10分以内のレコードは、処理され、ウィンドウ集計に含まれることが保証される。"
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
    "stem": "データエンジニアはSpark SQLを使用しており、/data/input.jsonに保存された大きなJSONファイルを扱っています。この改行区切りのJSONファイルには、フィールドの構成が異なるものの、フィールドの型には互換性があるレコードが含まれています。まずDataFrameに読み込むことなく、このファイルを直接クエリできる外部テーブルをSpark SQLで作成したいと考えています。\n\n次の要件を満たす必要があります。\n\n- /data/input.jsonからデータを読み取る、usersという名前の外部テーブルを作成する。\n- Sparkにスキーマを自動推論させる。\n- スキーマが異なるレコードを統合して扱う。\n\nSpark 3.5.6の組み込みセッションカタログを使用し、usersはまだ存在しないものとします。不要なスキーマ統合用オプションを追加せず、通常のJSONスキーマ推論によってこのタスクを実現する文はどれですか？（2つ選択）",
    "options": [
      "```\nCREATE TABLE users USING json\nOPTIONS (path '/data/input.json')\n```",
      "```\nCREATE TABLE users USING json\nLOCATION '/data/input.json'\n```",
      "```\nCREATE EXTERNAL TABLE users USING json\nOPTIONS (path '/data/input.json', mergeSchema 'true')\n```",
      "```\nCREATE EXTERNAL TABLE users USING json\nOPTIONS (path '/data/input.json', schemaMerge 'true')\n```"
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
    "stem": "データサイエンティストはApache Sparkで大規模なデータセットを分析しており、次のコードを作成しました。\n\n```\ndf = spark.read.schema(\"error_column STRING, timestamp STRING\").option(\"header\", True).csv(\"large_dataset.csv\")\n \nfiltered_df = df.filter(col(\"error_column\").contains(\"error\"))\n \nmapped_df = filtered_df.select(\n    split(col(\"timestamp\"), \" \").getItem(0).alias(\"date\"),\n    lit(1).alias(\"count\")\n)\n \nreduced_df = mapped_df.groupBy(\"date\").sum(\"count\")\n \nreduced_df.count()\nreduced_df.show()\n```\n\nDataFrameが構築された後、reduced_dfを生成する変換パイプラインを最初に実行するのは、選択肢のどのステップですか？",
    "options": [
      "`filter`変換が適用されるとき。",
      "`count`アクションが実行されるとき。",
      "`groupBy`変換が適用されるとき。",
      "`show`アクションが実行されるとき。"
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
    "stem": "データサイエンティストは、顧客情報を格納したcustomerDFというSpark DataFrameを扱っています。email列には顧客のメールアドレスが含まれています。この列をusernameとdomainという2つの新しい列に分割する必要があります。\n\nemail列をusernameとdomainに正しく分割するコードはどれですか？",
    "options": [
      "```\ncustomerDF.select(\n    col(\"email\").substr(0, 5).alias(\"username\"),\n    col(\"email\").substr(-5).alias(\"domain\")\n)\n```",
      "```\ncustomerDF.withColumn(\"username\", split(col(\"email\"), \"@\").getItem(0)) \\\n          .withColumn(\"domain\", split(col(\"email\"), \"@\").getItem(1))\n```",
      "```\ncustomerDF.withColumn(\"username\", substring_index(col(\"email\"), \"@\", 1)) \\\n          .withColumn(\"domain\", substring_index(col(\"email\"), \"@\", -1))\n```",
      "```\ncustomerDF.select(\n    regexp_replace(col(\"email\"), \"@\", \"\").alias(\"username\"),\n    regexp_replace(col(\"email\"), \"@\", \"\").alias(\"domain\")\n)\n```"
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
    "stem": "データエンジニアは、DataFrame `df`をParquetファイルに書き込み、出力をcountry列でパーティション分割し、出力先に既存のデータがあれば上書きする必要があります。\n\nApache Sparkでこれを実現するには、どのコードを使用すべきですか？",
    "options": [
      "```\ndf.write.mode(\"overwrite\").partitionBy(\"country\").parquet(\"/data/output\")\n```",
      "```\ndf.write.mode(\"append\").partitionBy(\"country\").parquet(\"/data/output\")\n```",
      "```\ndf.write.mode(\"overwrite\").parquet(\"/data/output\")\n```",
      "```\ndf.write.partitionBy(\"country\").parquet(\"/data/output\")\n```"
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
    "stem": "データサイエンティストは、大量の構造化データの処理、SQLベースのクエリの実行、機械学習アルゴリズムの適用を含むプロジェクトに取り組んでいます。このワークフローにApache Sparkを使用する予定です。\n\nこれらの要件を最もよく満たすApache Sparkモジュールの組み合わせはどれですか？",
    "options": [
      "Spark DataFrames, Structured Streaming, and GraphX",
      "Spark SQL, Pandas API on Spark, and Structured Streaming",
      "Spark Streaming, GraphX, and Pandas API on Spark",
      "Spark DataFrames, Spark SQL, and MLlib"
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
    "stem": "データエンジニアは、`feed`という名前のKafkaトピックからメッセージを読み取るStreaming DataFrameを作成する必要があります。\n\n使用するコードは次のとおりです。\n\n```\n1. spark\n2. .readStream\n3. .format(\"kafka\")\n4. .option(\"kafka.bootstrap.servers\", \"host1:port1,host2:port2\")\n5. ._____________\n6. .load()\n```\n\nこのKafkaトピックを購読するには、5行目にどのコード片を追加すべきですか？",
    "options": [
      ".option(\"subscribe\", \"feed\")",
      ".option(\"subscribe.topic\", \"feed\")",
      ".option(\"kafka.topic\", \"feed\")",
      ".option(\"topic\", \"feed\")"
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
    "stem": "データエンジニアは、分散ファイルシステムに保存された注文情報を含む大規模なJSONデータセットを扱っています。分析のために、このデータセットをSpark DataFrameに読み込む必要があります。スキーマを明示的に定義し、効率よくデータを読み込みたいと考えています。\n\n事前定義したスキーマを使用してJSONデータをSpark DataFrameに効率よく読み込むには、どの方法を使用すべきですか？",
    "options": [
      "`spark.read.json()`で読み込み、`DataFrame.printSchema()`で推論されたスキーマを確認した後、`DataFrame.cast()`で列のデータ型を調整する。",
      "`spark.read.json()`を使用し、`inferSchema`オプションを`true`に設定する。",
      "`spark.read.format(\"json\").load()`で読み込んだ後、`DataFrame.withColumn()`を適用し、各列を必要なデータ型にキャストする。",
      "`StructType`でスキーマを定義し、`spark.read.schema(predefinedSchema).json()`でデータを読み込む。"
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
    "stem": "金融サービス会社のデータサイエンティストは、数百万件の取引レコードを含むSpark DataFrameを扱っています。列はtransaction_id、account_number、transaction_amount、timestampです。データ元のシステムの問題により、すべてのフィールドの値が同一の取引が複数回記録されています。正確な財務報告を行うため、重複行を削除する必要があります。\n\nすべての列に基づいてレコードの重複を削除するには、どのPySparkの方法を使用すべきですか？",
    "options": [
      "```\ndf = df.dropDuplicates()\n```",
      "```\ndf = df.groupBy(\"transaction_id\").agg(\n    F.first(\"account_number\"),\n    F.first(\"transaction_amount\"),\n    F.first(\"timestamp\")\n)\n```",
      "```\ndf = df.filter(F.col(\"transaction_id\").isNotNull())\n```",
      "```\ndf = df.dropDuplicates([\"transaction_amount\"])\n```"
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
    "stem": "次のコード片を実行するとエラーになります。\n\n```\n@F.udf(T.IntegerType())\ndef simple_udf(t: str) -> str:\n    return answer * 3.14159\n```\n\nUDFを正しく定義するには、代わりにどのコードを使用すべきですか？",
    "options": [
      "```\n@F.udf(T.IntegerType())\ndef simple_udf(t: int) -> int:\n    return t * 3.14159\n```",
      "```\n@F.udf(T.DoubleType())\ndef simple_udf(t: float) -> float:\n    return t * 3.14159\n```",
      "```\n@F.udf(T.DoubleType())\ndef simple_udf(t: int) -> int:\n    return t * 3.14159\n```",
      "```\n@F.udf(T.IntegerType())\ndef simple_udf(t: float) -> float:\n    return t * 3.14159\n```"
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
    "stem": "開発者は、次のコードでSparkSessionを初期化します。\n\n```\nspark = SparkSession.builder \\\n    .appName(\"Analytics Application\") \\\n    .getOrCreate()\n```\n\nこのコードで作成されるSparkSessionの動作を正しく説明しているのはどれですか？",
    "options": [
      "`getOrCreate()`メソッドは、既存のSparkSessionを明示的に破棄してから、新しいものを作成する。",
      "SparkSessionは`appName`ごとに一意であり、同じ名前で`getOrCreate()`を呼び出すと、以前作成されたSparkSessionが返される。",
      "SparkSessionがすでに存在する場合、このコードは新しいセッションを作成せず、既存のセッションを返す。",
      "`getOrCreate()`メソッドを呼び出すたびに、新しいSparkSessionが作成される。"
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
    "stem": "Sparkエンジニアは、Sparkジョブを実行するための適切なデプロイモードを選択する必要があります。\n\nApache Sparkでクラスターモードを使用する主な利点は何ですか？",
    "options": [
      "クラスターモードでは、クラスター内のリソースマネージャーによってリソースが割り当てられ、大規模ワークロードの性能と拡張性が向上する。",
      "クラスターモードでは、DriverがWorkerノードにタスクを分散せず、すべてのタスクをローカルで実行する。",
      "クラスターモードではDriverがクライアントマシン上で動作するため、アプリケーションが大規模データセットを効率よく処理する能力が制限される可能性がある。",
      "クラスターモードではDriverプログラムがWorkerノードの1つで動作し、アプリケーションがクラスターの分散リソースを十分に利用できる。"
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
    "stem": "エンジニアは、Sparkジョブの実行時間が大幅に増加したことに気付きました。原因を調べるため、Executorが生成したログを確認することにしました。\n\nSparkアプリケーションの性能問題を調査するには、どのようにExecutorログを取得すべきですか？",
    "options": [
      "Sparkのマスターノード上でExecutorログを探す。通常は/tmpディレクトリにある。",
      "`spark-submit`コマンドに`--verbose`フラグを付けてジョブを実行し、Executorログをコンソールに出力する。",
      "Spark UIを開き、該当ステージに移動し、StagesタブからExecutorログを表示する。",
      "spark-sql CLIツールでSparkジョブを実行してログを取得する。"
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
    "stem": "データエンジニアは、次の2つのDataFrameを使用するSparkアプリケーションを扱っています。\n\n- DataFrame A：過去1年間の詳細な取引レコードを含み、サイズは128 GB。\n- DataFrame B：ユーザーのルックアップテーブルを含み、サイズは1 GB。\n\n性能を最適化するため、ブロードキャスト結合を使用する予定です。DriverとすべてのExecutorにはDataFrame Bを保持する十分なメモリがあり、ブロードキャストのサイズ制限も満たしているものとします。\n\nどちらのDataFrameをブロードキャストするかを決める際、どの方針を採用すべきですか？",
    "options": [
      "DataFrame Bの方が小さく、ブロードキャストされるDataFrame自体のシャッフルを避けられるため、Bをブロードキャストする。",
      "DataFrame Bの方が小さく、結合中のDataFrame Aのシャッフルを避けられるため、Bをブロードキャストする。",
      "DataFrame Aの方が大きく、DataFrame Bのシャッフルを避けられるため、Aをブロードキャストする。",
      "DataFrame Aの方が小さく、ブロードキャストされるDataFrame自体のシャッフルを避けられるため、Aをブロードキャストする。"
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
    "stem": "データサイエンティストは、PySparkを使用してApache Sparkで大規模データセットを扱っています。DataFrame dfには、user_id、product_id、purchase_amountという列があります。一連の操作を適用するにあたり、最初にシャッフルが発生し、その後にシャッフル不要の変換を行う操作の組み合わせを検討しています。\n\nこのパターンに当てはまる操作の並びはどれですか？",
    "options": [
      "df.groupBy(\"user_id\").agg(sum(\"purchase_amount\").alias(\"total_purchase\")).filter(col(\"total_purchase\") > 100)",
      "df.withColumn(\"discount\", df.purchase_amount * 0.1).select(\"discount\")",
      "df.withColumn(\"purchase_date\", current_date()).where(\"total_purchase > 50\")",
      "df.groupBy(\"user_id\").agg(sum(\"purchase_amount\").alias(\"total_purchase\")).repartition(10)"
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
    "stem": "データエンジニアは、sensor_id、temperature、timestampという列を持ち、毎秒センサー測定値を受け取るストリーミングDataFrameを処理しています。ストリームを継続的に処理しながら、重なりのない固定長5分のイベント時刻ウィンドウごとに、各センサーの平均温度を計算する必要があります。\n\nこの要件を正しく満たすコードはどれですか？",
    "options": [
      "```\ndf.withColumn(\"avg_temp\",\n    avg(\"temperature\").over(\n        Window.partitionBy(\"sensor_id\")\n        .orderBy(\"timestamp\")\n        .rangeBetween(-300, 0)\n    )\n)\n```",
      "```\ndf.groupBy(\"sensor_id\", \"timestamp\") \\\n  .agg(avg(\"temperature\").alias(\"avg_temp\"))\n```",
      "```\ndf.groupBy(\"sensor_id\").avg(\"temperature\")\n```",
      "```\ndf.withWatermark(\"timestamp\", \"5 minutes\") \\\n  .groupBy(\"sensor_id\", window(\"timestamp\", \"5 minutes\")) \\\n  .agg(avg(\"temperature\").alias(\"avg_temp\"))\n```"
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
    "stem": "Spark Connectの機能について、正しい説明はどれですか？",
    "options": [
      "ストリーミングAPIの`DataStreamReader`、`DataStreamWriter`、`StreamingQuery`をサポートする。",
      "PySpark APIの`DataFrame`、`Functions`、`Column`、`SparkContext`をサポートする。",
      "PySparkで書かれたアプリケーションのみをサポートする。",
      "追加設定なしで利用できる組み込みの認証機能を提供する。"
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
    "stem": "データエンジニアは、ルックアップのため、数百万行を含む小さい側のDataFrameの行をブロードキャスト結合ですべてのExecutorに配布します。\n\nこの方法では、どのような結果になる可能性がありますか？",
    "options": [
      "ブロードキャストされたDataFrameを保持するためのメモリが各Executorで不足すると、ジョブが失敗する可能性がある。",
      "ブロードキャストされたデータセットを処理するCPUコアがExecutorに十分なければ、ジョブが失敗する可能性がある。",
      "Sparkはこれほど大きなブロードキャスト変数を配布またはシリアライズできないため、ジョブは無期限に停止したままになる。",
      "大きなDataFrameをシリアライズするCPUコアがDriverに十分ないため、ジョブが失敗する可能性がある。"
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
    "stem": "Spark Connectを使ってSparkクラスターとリモートでやり取りするアプリケーションを設計する際、Spark Connectのどの特徴を考慮すべきですか？",
    "options": [
      "任意のプログラミング言語を使ってSparkアプリケーションをリモート実行する仕組みを提供する。",
      "REST APIを通じて、任意のリモートクラスターとやり取りできる。",
      "クライアント・サーバー構成を通じてSparkジョブをリモート実行できる。",
      "主に、外部データソースからSparkにデータを取り込むために設計されている。"
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
    "stem": "CSVファイルに次のレコードが含まれています。\n\n```\nbambi, hello\nalladin, 20\n```\n\n次のコードを考えます。\n\n```\nfrom pyspark.sql.types import *\nschema = StructType([StructField(\"name\", StringType()), StructField(\"age\", IntegerType())])\nspark.read.schema(schema).csv(path).collect()\n```\n\nこのコードを実行すると、何が返されますか？",
    "options": [
      "[Row(name='bambi'), Row(name='alladin', age=20)]",
      "[Row(name='alladin', age=20)]",
      "[Row(name='bambi', age=None), Row(name='alladin', age=20)]",
      "CSVデータが定義されたスキーマに一致しないため、コードはエラーで失敗する。"
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
    "stem": "データエンジニアは、特徴量エンジニアリングのジョブが時間とともに遅くなっているという問題に対応しています。データサイエンスチームと相談し、精度を多少犠牲にして性能を改善するため、Sparkの`percentile()`関数を`approx_percentile()`に置き換えることに合意しました。\n\n更新後のコードは次のとおりです。\n\n```\nfeatures_df = raw_df \\\n.select(\n    F.approx_percentile(\n        \"price\",\n        percentage=[0.25, 0.5, 0.75],\n        accuracy=1000\n    ).alias(\"price_perc\")\n)\n```\n\nこの変更で実行時間は大幅に改善しましたが、返されるパーセンタイル値が実際の値から大きくずれすぎていることにデータサイエンティストが気付きました。\n\nこの問題を解決するには、データエンジニアは何を変更すべきですか？",
    "options": [
      "`percentage`パラメーターの最初の値を小さくし、パーセンタイル範囲の精度を上げる。",
      "`accuracy`パラメーターの値を小さくし、メモリ使用量を減らしながら精度を改善する。",
      "`percentage`パラメーターの最後の値を大きくし、パーセンタイル範囲の精度を上げる。",
      "`accuracy`パラメーターの値を大きくし、メモリをより多く使う代わりに、算出されるパーセンタイルの精度を改善する。"
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
    "stem": "データエンジニアは、Kafkaトピックからデータを読み込むStructured Streamingパイプラインを構築しています。非常に低いレイテンシで動作させながら、Exactly-Onceの処理保証も維持したいと考えています。\n\nチェックポイントと、Exactly-Onceの復旧をサポートする出力先が設定済みであるものとします。`writeStream`の設定では、どのトリガーモードを使用すべきですか？",
    "options": [
      ".trigger(processingTime='1 second')",
      ".trigger(continuous=True)",
      ".trigger(continuous='1 second')",
      ".trigger(availableNow=True)"
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
    "stem": "データエンジニアは、財務データを含む新しい管理テーブルを作成するSparkジョブを書く必要があります。テーブルがすでに存在する場合、既存データを一切変更せず、ジョブを直ちに失敗させなければなりません。\n\nどの保存モードとメソッドを使用すべきですか？",
    "options": [
      "`saveAsTable`を`ErrorIfExists`モードで使用する。",
      "`saveAsTable`を`Overwrite`モードで使用する。",
      "`save`を`Ignore`モードで使用する。",
      "`save`を`ErrorIfExists`モードで使用する。"
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
    "stem": "データエンジニアはSparkアプリケーションをSpark 3.0からSpark 3.5に更新し、いくつかの定期実行ジョブが速くなったことに気付きました。さらに調べると、Adaptive Query Execution（AQE）が有効になっていることが分かりました。\n\nSparkアプリケーションの性能を改善するため、AQEが自動的に実行する操作はどれですか？",
    "options": [
      "クエリの実行中に結合戦略を動的に切り替える。",
      "永続的なテーブル統計を収集し、後で使えるようメタストアに保存する。",
      "単一ステージのSparkジョブの実行性能を改善する。",
      "ディスク上に保存されたDeltaファイルの物理配置を最適化する。"
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
    "stem": "データエンジニアは、Streaming DataFrameをParquetファイルに書き込む必要があります。\n\nコードのひな型は次のとおりです。\n\n```\ndf\n.writeStream\n// -- insert code here --\n.option(\"checkpointLocation\", \"path/to/checkpoint/dir\")\n.start()\n```\n\nストリーミング出力をParquetファイルとして正しく書き込むには、どのコード片を挿入すべきですか？",
    "options": [
      ".format(\"parquet\")\n.option(\"location\", \"path/to/destination/dir\")",
      ".format(\"format\", \"parquet\")\n.option(\"destination\", \"path/to/destination/dir\")",
      ".format(\"format\", \"parquet\")\n.option(\"location\", \"path/to/destination/dir\")",
      ".format(\"parquet\")\n.option(\"path\", \"path/to/destination/dir\")"
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
    "stem": "データエンジニアは、df1とdf2という2つのDataFrameを結合するため、次のコードを書きます。\n\n```\ndf1 = spark.read.option(\"header\", True).csv(\"sales_data.csv\")\ndf2 = spark.read.option(\"header\", True).csv(\"product_data.csv\")\nresult = df1.join(df2, df1.product_id == df2.product_id)\n```\n\ndf1は電子商取引の売上データを含み、サイズは約10 GBです。df2は商品参照データを含み、サイズは約8 MBです。\n\nSparkがdf2のサイズを8 MBと推定し、この結合はブロードキャストが可能な等価結合で、spark.sql.autoBroadcastJoinThresholdは10 MBであるものとします。この状況でApache Sparkが採用する可能性が最も高い結合戦略はどれですか？",
    "options": [
      "Adaptive Query Execution（AQE）が有効でなく、Sparkが静的な実行計画に依存するため、シャッフル結合が使用される。",
      "df2がデフォルトのブロードキャストしきい値より小さいため、ブロードキャスト結合が使用される。",
      "df1とdf2のサイズの差が大きすぎて効率的にブロードキャスト結合できないため、シャッフル結合が選ばれる。",
      "ブロードキャストヒントを明示的に指定していないため、シャッフル結合が行われる。"
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
    "stem": "データアナリストは`sensor_df`を扱っています。このDataFrameには、タイムスタンプ列の`record_datetime`と、配列列の`record`という2つの列があります。\n\n`record`配列の各要素を別々の行に展開し、さらに各配列要素の中のフィールドを個別の列として選択したDataFrameを返すコードはどれですか？",
    "options": [
      "```\nexploded_df = sensor_df.withColumn(\"record_exploded\", explode(\"record\"))\n \nexploded_df = exploded_df.select(\n    \"record_datetime\",\n    \"sensor_id\",\n    \"status\",\n    \"health\"\n)\n```",
      "```\nexploded_df = sensor_df.withColumn(\"record_exploded\", col(\"record\"))\n \nexploded_df = exploded_df.select(\n    \"record_datetime\",\n    \"record_exploded.sensor_id\",\n    \"record_exploded.status\",\n    \"record_exploded.health\"\n)\n```",
      "```\nexploded_df = sensor_df.withColumn(\"record_exploded\", explode(\"record\"))\n \nexploded_df = exploded_df.select(\n    \"record_datetime\",\n    \"record_exploded.sensor_id\",\n    \"record_exploded.status\",\n    \"record_exploded.health\"\n)\n```",
      "```\nexploded_df = sensor_df.withColumn(\"record_exploded\", explode(\"record\"))\n \nexploded_df = exploded_df.select(\n    \"record_datetime\",\n    \"record_exploded\"\n)\n```"
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
    "stem": "開発者は、既存のSparkアプリケーションでSpark Connectを試したいと考えています。既存のアプリケーションコードを一切変更せず、すでに動作しているローカルのSpark Connectサーバーに接続することを希望しています。\n\nこの状況でローカルのSpark Connectサーバーに接続できる方法はどれですか？（2つ選択）",
    "options": [
      "`--remote \"https://localhost\"`オプションを付けて`pyspark`シェルを起動する。",
      "`--remote \"sc://localhost\"`オプションを付けて`pyspark`シェルを起動する。",
      "`pyspark`シェルを起動する前に、環境変数`SPARK_REMOTE=\"sc://localhost\"`を設定する。",
      "`SparkSession.builder`の設定に`.remote(\"sc://localhost\")`を追加して、アプリケーションコードを変更する。",
      "アプリケーションコード内で、Spark設定プロパティ`spark.connect.grpc.binding.port`を`15002`に設定する。"
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
    "stem": "クライアントモードで動作するSparkアプリケーションで、Driverプロセスがリソース不足に制約され、性能問題が発生しています。\n\nクライアントマシンは増強できませんが、クラスターノードにはDriverに十分なリソースがあります。解決する最もよい方法はどれですか？",
    "options": [
      "クラスターのExecutorインスタンス数を増やす。",
      "クライアントマシンのDriverメモリを増やす。",
      "デプロイモードをクラスターモードに切り替える。",
      "デプロイモードをローカルモードに切り替える。"
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
    "stem": "データアナリストはemployees_dfというDataFrameを扱っており、勤続5年以上の従業員を表彰するため、該当する従業員を取得したいと考えています。\n\nこの条件を満たす従業員にDataFrameを正しく絞り込み、表示するコードはどれですか？",
    "options": [
      "employees_df.filter(employees_df.tenure >= 5).show()",
      "employees_df.where(employees_df.tenure >= 5)",
      "filter(employees_df.tenure >= 5)",
      "employees_df.filter(employees_df.tenure >= 5).collect()"
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
    "stem": "データエンジニアは、上流のストリーミングソースがイベントテーブルに重複レコードを頻繁に送っていることに気付きました。本番データを確認した結果、重複レコード間の`event_timestamp`列の時刻差は最大30分であることが分かりました。\n\nevent_idがイベントを識別するものとし、次のコードを追加します。\n\n```\nevents.withWatermark(\"event_timestamp\", \"31 minutes\").dropDuplicatesWithinWatermark([\"event_id\"])\n```\n\nこの変更の結果はどうなりますか？",
    "options": [
      "この状況では、このメソッドで重複を削除できない。",
      "設定したウォーターマークの範囲内でevent_idの重複を削除する。31分の遅延設定は、時刻差の最大値である30分を上回っている。",
      "到着時刻にかかわらず、すべての重複レコードを削除する。",
      "ウォーターマークは秒単位で指定しなければならないため、コードはエラーになる。"
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
    "stem": "Spark DataFrame内の文字列の長さを計算するUDFの実装はどれですか？",
    "options": [
      "`productsDF.withcolumn(\"nameLength\", spark.udf(\"len\", StringType()))`",
      "`productsDF.select(length(col(\"productName\"))-alias(\"nameLength\"))`",
      "`spark.udf.register(\"computeLength\", lambda s: len(s))`",
      "`productsDF.withcolumn(\"nameLength\", udf(lambda s: len(s), StringType()))`"
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
    "stem": "Sparkアプリケーションの開発者は、大規模な分散データセットに複数の変換を行うジョブの性能を評価しています。どの操作がデータのシャッフルを発生させ、Sparkの実行計画に新しいステージ境界を作るのかを調べたいと考えています。\n\nシャッフルを発生させ、新しいステージを生じさせる操作はどれですか？",
    "options": [
      "DataFrame.groupBy().agg()",
      "DataFrame.filter()",
      "DataFrame.withColumn()",
      "DataFrame.select()"
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
    "stem": "Spark開発者は、クラスター全体のタスク実行性能を監視するアプリケーションを構築しています。要件の1つは、すでに記録されているタスク処理時間の全体での最大値を計算し、Driverでさらに分析することです。数値の処理時間はすでにRDDに格納されています。稼働中のSpark UIのメトリクスの収集は、この問題の対象外です。\n\nこれを実現するには、どの方法を使用すべきですか？",
    "options": [
      "`reduce()`などのRDDアクションを使って処理時間の最大値を計算する。",
      "アキュムレーターを使用して最大時間を取得し、Driverに報告する。",
      "変数をブロードキャストし、Workerが処理時間の最大値を共有できるようにする。",
      "処理時間の最大値を自動収集するようにSpark UIを設定する。"
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
    "stem": "Sparkアプリケーションは、同じディレクトリ内の複数のParquetファイルを読み込む必要があります。各ファイルのスキーマは異なりますが、互換性があります。データエンジニアは、すべてのファイルに存在する列を漏れなく含むDataFrameを作成したいと考えています。\n\nすべての列を結果のDataFrameに統合しながらParquetファイルを読み込むには、Apache Sparkでどのコードを使用すべきですか？",
    "options": [
      "df = spark.read.option(\"mergeSchema\", \"true\").parquet(\"/data/parquet_files\")",
      "df = spark.read.parquet(\"/data/parquet_files\").mergeAllColumns()",
      "df = spark.read.schema(\"merge\").parquet(\"/data/parquet_files\")",
      "df = spark.read.format(\"parquet\").load(\"/data/parquet_files\")"
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
    "stem": "Arrowに関する設定はまだ何も行われていないものとします。Apache Arrowを使ってPandas DataFrameとPySpark DataFrameの相互変換を最適化するには、どのSpark設定を有効にできますか？",
    "options": [
      "spark.conf.set(\"spark.pandas.arrow.enabled\", \"true\")",
      "spark.conf.set(\"spark.sql.execution.arrow.pyspark.enabled\", \"true\")",
      "spark.conf.set(\"spark.sql.execution.arrow.enabled\", \"true\")",
      "spark.conf.set(\"spark.sql.arrow.pandas.enabled\", \"true\")"
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
    "stem": "データエンジニアは、S3やADLSなどの分散ストレージシステムに保存された1 TBのデータを処理するSparkジョブを実行しています。Sparkクラスターは10ノードで構成され、各ノードには16個のCPUコアがあります。Spark UIを確認すると、次のことが分かりました。\n\n- Executorsページでは、Active Tasksの数が利用可能なコアの総数より大幅に少ない。\n- Stagesページでは、少数のタスクがそれぞれ大きな入力パーティションを読み込み、一部のタスクでディスクへのスピルが発生している。\n- Jobsページでは、タスク総数が利用可能なCPU数より大幅に少ない。\n\n固定数やCPU数だけで決めた値が常に最適だと仮定せず、データ量に基づく初期パーティション数を見積もり、測定と調整を始める方法はどれですか？",
    "options": [
      "並列処理を最大限に行うため、パーティション数をクラスター全体のCPU数と同じに設定する。",
      "異なるジョブ間で一貫性を保つため、200などの固定のパーティション数を設定する。",
      "ノード間で均等にデータを分配するため、パーティション数をクラスターノード数と同じに設定する。",
      "データセットのサイズ（1 TB）を128 MBなどの適切なパーティションサイズで割り、パーティション数を決める。"
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
    "stem": "開発者は、データセット内のシャッフル後のすべてのパーティションが、`spark.sql.adaptive.maxShuffledHashJoinLocalMapThreshold`に設定したしきい値より小さいことを確認しました。\n\nAQEが有効で、この結合にはシャッフルハッシュ結合を適用でき、上記しきい値はspark.sql.adaptive.advisoryPartitionSizeInBytes以上であるものとします。この状況でAdaptive Query Execution（AQE）は、どの結合戦略を選択しますか？",
    "options": [
      "直積結合。",
      "シャッフルハッシュ結合。",
      "ブロードキャストネステッドループ結合。",
      "ソートマージ結合。"
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
    "stem": "大きなPandas API on SparkのDataFrameをPandas DataFrameに戻す際、どのリスクを考慮すべきですか？",
    "options": [
      "変換によってデータセットが自動的にWorkerノードへ分散される。",
      "変換後のPandas DataFrameが1000行を超えると処理が失敗する。",
      "変換中に一部のレコードが失われる可能性がある。",
      "すべてのデータがDriverのメモリに集められるため、大きなデータセットではメモリ不足になる可能性がある。"
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
    "stem": "開発者は、SQLクエリで大規模データセットを処理するSparkアプリケーションを構築しています。クラスターには十分なリソースがありますが、実行時間の大部分でExecutorがアイドル状態になっています。ログを見ると各ステージのタスク数が少なく、クラスターの利用率が低くなっています。\n\nクラスターの利用率を改善するには、何をすべきですか？",
    "options": [
      "`spark.sql.shuffle.partitions`の値を増やす。",
      "`spark.sql.shuffle.partitions`の値を減らす。",
      "より多くのパーティションが作られるよう、データセットのサイズを大きくする。",
      "動的リソース割り当てを有効にし、クラスターリソースを自動的に増減させる。"
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
    "stem": "データエンジニアは、次のリソースを持つSparkクラスターでバッチ処理ジョブを実行します。\n\n- Workerノード：10台\n- 各WorkerノードのCPUコア：16個\n- 各ノードのRAM：64 GB\n\n各ノードで4個のExecutorを実行し、各Executorが4個のCPUコアを使用するようにアプリケーションを設定します。\n\nこのアプリケーションが使用するCPUコアの総数はいくつですか？",
    "options": [
      "160",
      "64",
      "80",
      "40"
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
    "stem": "データエンジニアは、継続的に流れてくるJSONイベントをリアルタイムで処理するApache Spark Structured Streamingアプリケーションを開発しています。障害が起きても、最後に正常に処理されたレコードからストリーム処理を再開できるよう、耐障害性を持たせたいと考えています。この動作を実現するため、チェックポイントを設定する予定です。\n\nストリーミングクエリのチェックポイントを正しく有効にするコードはどれですか？",
    "options": [
      "query = streaming_df.writeStream\n.format(\"console\")\n.option(\"checkpoint\", \"/path/to/checkpoint\")\n.outputMode(\"append\")\n.start()",
      "query = streaming_df.writeStream\n.format(\"console\")\n.outputMode(\"append\")\n.option(\"checkpointLocation\", \"/path/to/checkpoint\")\n.start()",
      "query = streaming_df.writeStream\n.format(\"console\")\n.outputMode(\"complete\")\n.start()",
      "query = streaming_df.writeStream\n.format(\"console\")\n.outputMode(\"append\")\n.start()"
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
    "stem": "Spark SQL関数`date_sub(start, days)`の`days`引数に負の値を渡すと、どうなりますか？",
    "options": [
      "元の開始日が変更されずに返される。",
      "パラメーター値が無効であることを示すエラーが発生する。",
      "指定した日数分が開始日に加算される。",
      "指定した日数分が開始日から減算される。"
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
    "stem": "データエンジニアは、最新のデータセットで毎日上書きするParquetテーブルを生成する必要があります。下流システムには、出力パーティションを1つにし、その行を`market_time`順に並べて書き込むという厳密な要件があります。後でテーブルをクエリする際、結果の順序を保証するには引き続きORDER BYが必要です。\n\nテーブルを毎日上書きしながら、レコードを`market_time`順に並べてParquetテーブルに書き込むコードはどれですか？",
    "options": [
      "final_df\n.sort(\"market_time\")\n.write\n.format(\"parquet\")\n.mode(\"overwrite\")\n.saveAsTable(\"output.market_events\")",
      "final_df\n.orderBy(\"market_time\")\n.write\n.format(\"parquet\")\n.mode(\"overwrite\")\n.saveAsTable(\"output.market_events\")",
      "final_df\n.coalesce(1)\n.sort(\"market_time\")\n.write\n.format(\"parquet\")\n.mode(\"overwrite\")\n.saveAsTable(\"output.market_events\")",
      "final_df\n.sortWithinPartitions(\"market_time\")\n.write\n.format(\"parquet\")\n.mode(\"overwrite\")\n.saveAsTable(\"output.market_events\")"
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
    "stem": "エンジニアは、df1とdf2という2つのDataFrameを、それぞれemployee_id列とemp_id列を使って結合する必要があります。\n\n```\n• df1 schema: employee_id INT, name STRING\n• df2 schema: emp_id INT, department STRING\n```\n\n次のコードで結合を行います。\n\n`result = df1.join(df2, df1.employee_id == df2.emp_id, how=\"inner\")`\n\nこのコードはどのように動作しますか？",
    "options": [
      "employee_idとemp_idという列名は自動では一致しないため、コードは失敗する。",
      "結合では`on='employee_id'`を明示的に指定しなければならないため、コードは失敗する。",
      "PySparkでは異なるスキーマのDataFrame同士を結合できないため、コードは失敗する。",
      "結合条件でdf1のemployee_idとdf2のemp_idを明示的に比較しているため、コードは正常に実行される。"
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
    "stem": "DataFrame dfにはname、age、salaryという列があります。開発者はageを昇順、salaryを降順としてDataFrameを並べ替える必要があります。\n\nこの要件を満たすコードはどれですか？",
    "options": [
      "df.orderBy(col(\"age\").asc(), col(\"salary\").asc()).show()",
      "df.sort(\"age\", \"salary\", ascending=[True, True]).show()",
      "df.sort(\"age\", \"salary\", ascending=[False, True]).show()",
      "df.orderBy(\"age\", \"salary\", ascending=[True, False]).show()"
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
    "stem": "次のSparkコードを考えます。\n\n`spark.sparkContext.setLogLevel(\"<log_level>\")`\n\nSpark Driverのログレベルに指定できる有効な値の組み合わせはどれですか？",
    "options": [
      "ALL, DEBUG, FAIL, INFO",
      "ERROR, WARN, TRACE, OFF",
      "WARN, NONE, ERROR, FATAL",
      "FATAL, NONE, INFO, DEBUG"
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
    "stem": "データサイエンティストは大規模なデータセットを扱っており、DataFrameに複数の変換とアクションを行うPySparkスクリプトを書きました。スクリプトの最後ではcollect()アクションを実行して結果をDriverに取得します。\n\nスクリプトの実行時、Apache Sparkはこれらの操作をどのような実行階層で処理しますか？",
    "options": [
      "スクリプトは最初に複数のアプリケーションに分割され、各アプリケーションがジョブ、ステージ、最後にタスクへと分割される。",
      "スクリプト全体が1つのジョブとして実行され、そのジョブは複数のステージに分割される。各ステージは、データのパーティションに応じてさらにタスクに分割される。",
      "collect()アクションがジョブを起動し、そのジョブはシャッフル境界でステージに分割される。各ステージは、個々のデータパーティションを処理するタスクにさらに分割される。",
      "Sparkは変換とアクションごとに1つのタスクを作成し、依存関係に基づいて、それらのタスクをステージとジョブにまとめる。"
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
    "stem": "開発者は、Webアプリケーションに由来し、すでにSpark DataFrame dfに読み込まれているユーザー行動データを分析しています。Apache Spark 3.5のすべてのWorkerでgroupBy処理を並列実行したいと考えています。\n\n各ユーザーの完全なグループを、そのキーとともに、pandas DataFrameを処理する独自のPython関数へ渡し、指定されたスキーマのDataFrameを返す方法はどれですか？",
    "options": [
      "applyInPandas APIを使用する：\n\n```\nimport pandas as pd\n \ndef mean_func(key, pdf):\n    return pd.DataFrame([(key + (pdf['value'].mean(),))])\n \ndf.groupby('user_id').applyInPandas(mean_func, schema=\"user_id long, value double\").show()\n```",
      "mapInPandas APIを使用する：\n\n```\ndef mean_func(pdf_iter):\n    for pdf in pdf_iter:\n        yield pdf.groupby('user_id').agg({'value': 'mean'}).reset_index()\n \ndf.mapInPandas(mean_func, schema=\"user_id long, value double\").show()\n```",
      "標準のSpark UDF（ユーザー定義関数）を使用する：\n\n```\nfrom pyspark.sql.functions import mean\ndf.groupBy('user_id').agg(mean('value')).show()\n```",
      "Pandas UDFを定義する：\n\n```\nfrom pyspark.sql.functions import pandas_udf\n \n@pandas_udf(\"double\")\ndef mean_func(value: pd.Series) -> float:\n    return value.mean()\n \ndf.groupby(\"user_id\").agg(mean_func(df['value'])).show()\n```"
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
    "stem": "現在10個のパーティションを持つDataFrame dfについて、次のコードを考えます。\n\n`result = df.coalesce(20)`\n\nこの文を実行した後、結果のDataFrameのパーティション数はいくつになりますか？",
    "options": [
      "10",
      "クラスターのExecutor数と同じになる。",
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
    "stem": "データアナリストは財務データを分析するSparkアプリケーションを開発し、DataFrameにfilter、select、groupBy、coalesceという変換を行います。\n\nこれらのうち、実行時にシャッフルを発生させる操作はどれですか？",
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
    "stem": "電子商取引会社のデータサイエンティストは、df_userというDataFrameに格納された加入者情報を扱っています。以降の処理を進める前に、個人識別情報（PII）ではない列だけを含む、df_user_non_piiという別のDataFrameを作成したいと考えています。\n\ndf_user内のPII列はfirst_name、last_name、email、birthdateです。\n\nこれらの列を取り除いたdf_user_non_piiを作成するには、どのコードを使用すべきですか？",
    "options": [
      "df_user_non_pii = df_user.drop(\"first_name\", \"last_name\", \"email\", \"birthdate\")",
      "df_user_non_pii = df_user.drop(\"first_name\", last_name, email, birthdate)",
      "df_user_non_pii = df_user.dropfields(\"first_name\", \"last_name\", \"email\", \"birthdate\")",
      "df_user_non_pii = df_user.dropfields(\"first_name, last_name, email, birthdate\")"
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
    "stem": "Spark DataFrameで使用するdf.cache()とdf.persist()の違いは何ですか？",
    "options": [
      "`cache()`と`persist()`は、どちらもデフォルトのストレージレベル（MEMORY_AND_DISK_DESER）を設定するために使用できる。",
      "どちらも同じ操作を行う。ただし、`persist()`のデフォルトのストレージレベルはDISK_ONLYなので、より高い性能が得られる。",
      "`persist()`はデフォルトのストレージレベル（MEMORY_AND_DISK_DESER）でDataFrameを永続化し、`cache()`では永続化に使用するストレージレベルを指定できる。",
      "`cache()`はデフォルトのストレージレベル（MEMORY_AND_DISK_DESER）でDataFrameを永続化し、`persist()`では永続化に使用するストレージレベルを指定できる。"
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
    "stem": "Sparkエンジニアは、実行中にメモリ不足エラーで繰り返し失敗するSparkアプリケーションを調査しています。Spark Driverのログを確認すると、「GC overhead limit exceeded」というメッセージが複数見つかりました。\n\nこの問題に対処するため、何をすべきですか？",
    "options": [
      "DataFrameを再パーティション分割し、データ処理のロジックを改善する。",
      "Sparkの設定を変更し、ガベージコレクションを無効にする。",
      "Spark Driverに割り当てるメモリ量を増やす。",
      "大きなDataFrameをキャッシュし、メモリ内に保持する。"
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
    "stem": "エンジニアは/file/test_data.orcに保存された大きなORCファイルを扱っています。処理中のメモリ使用量を最小限にするため、特定の列（例えばcol1とcol2）だけを読み取りたいと考えています。\n\nORCファイルを読み込む際、必要な列を正しく選択するコードはどれですか？",
    "options": [
      "spark.read.orc(\"/file/test_data.orc\").filter(\"col1 = 'value'\").select(\"col2\")",
      "spark.read.format(\"orc\").select(\"col1\", \"col2\").load(\"/file/test_data.orc\")",
      "spark.read.orc(\"/file/test_data.orc\").select(\"col1\", \"col2\")",
      "spark.read.format(\"orc\").load(\"/file/test_data.orc\").select(\"col1\", \"col2\")"
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
    "stem": "データエンジニアは、DataFrameに複数の変換を行うSparkアプリケーションを確認していますが、変換を定義してもジョブが直ちには実行されないことに気付きました。\n\nこの動作を説明するApache Sparkの実行モデルの特徴はどれですか？（2つ選択）",
    "options": [
      "Sparkエンジンが変換の実行を開始するには、手動の操作が必要である。",
      "変換パイプラインの実行を引き起こすのはアクションだけである。",
      "変換は、リネージグラフを構築するために直ちに実行される。",
      "Sparkエンジンが変換中に実行計画を最適化するため、実行が遅れる。",
      "変換は遅延評価される。"
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
    "stem": "データエンジニアはStructured Streamingパイプラインを開発しています。障害や計画停止から復旧する際、以前停止した時点から処理を継続できるようにしたいと考えています。\n\nApache Sparkで、この動作をどのように実装できますか？",
    "options": [
      "`readStream`でcheckpointLocationオプションを設定する。",
      "SparkSessionの初期化時にrecoveryLocationオプションを設定する。",
      "`writeStream`でrecoveryLocationオプションを設定する。",
      "`writeStream`でcheckpointLocationオプションを設定する。"
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
    "stem": "DataFrame storesDFの既存のmanagerName列を大文字に変換し、その結果をmanagerName列に格納した新しいDataFrameを返すコードはどれですか？ 定義済みの変数はstoresDFだけであるものとします。",
    "options": [
      "storesDF.withColumn(\"managerName\", upper(managerName))",
      "storesDF.withColumn(\"managerName\", toupper(col(\"managerName\")))",
      "storesDF.withColumn(\"managerName\", upper(col(\"managerName\")))",
      "storesDF.withColumn(\"managerName\", col(\"managerName\").upper())",
      "storesDF.withColumn(\"managerName\", upper(\"managerName\"))"
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
    "stem": "次のコードは、Python関数`assessPerformance()`から`assessPerformanceUDF`というPython UDFを作成し、DataFrame `storesDF`の`customerSatisfaction`列に適用することを目的としています。\n\n戻り値の型を明示的には指定せず、UDFのデフォルトの戻り値の型（StringType）を使用して、番号付きの空欄を埋めてください。\n\nコード：\n\n```\nassessPerformanceUDF = _1_(_2_)\nstoresDF.withColumn(\"result\", _3_(_4_))\n```\n\n",
    "options": [
      "udf\n\nassessPerformance, IntegerType()\n\nassessPerformanceUDF\n\ncol(\"customerSatisfaction\")",
      "udf\n\nassessPerformance\n\nassessPerformanceUDF\n\ncol(\"customerSatisfaction\")",
      "spark.register.udf\n\nassessPerformanceUDF\n\nassessPerformance\n\ncol(\"customerSatisfaction\")",
      "spark.register.udf\n\nassessPerformance, IntegerType()\n\nassessPerformanceUDF\n\ncol(\"customerSatisfaction\")",
      "spark.register.udf\n\nassessPerformance\n\nassessPerformanceUDF\n\n\"customerSatisfaction\""
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
    "stem": "Spark DataFrame dfはMEMORY_AND_DISKストレージレベルでキャッシュされていますが、データセット全体はメモリに収まりません。\n\nDataFrameのキャッシュ中にメモリが不足すると、Sparkはどのように動作しますか？",
    "options": [
      "SparkはDataFrameの複製をメモリとディスクの両方に保存する。メモリに収まらない場合は、DataFrame全体をディスクだけに保存し、そこからアクセスする。",
      "ストレージ使用量のバランスを保つため、SparkはDataFrameをメモリとディスクに均等に分ける。",
      "Sparkは可能な限りDataFrameをメモリに保存し、残りのパーティションをディスクに退避する。多少の性能上の負担を伴いながら、処理は継続する。",
      "性能のバランスを取るため、Sparkはアクセス頻度の高い行をメモリに、低い行をディスクに保存する。"
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
    "stem": "DataFrame storesDFをJSON形式でfilePathに書き込み、その場所に既存データがあれば上書きするコードはどれですか？",
    "options": [
      "storesDF.write(filePath, mode=\"overwrite\", source=\"json\")",
      "storesDF.write.mode(\"overwrite\").json(filePath)",
      "storesDF.write.mode(\"overwrite\").path(filePath)",
      "storesDF.write.option(\"json\", \"overwrite\").path(filePath)"
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
    "stem": "storeId列を使ってstoresDFとemployeesDFを左結合した、新しいDataFrameを返すコードはどれですか？",
    "options": [
      "storesDF.join(employeesDF, \"left\", col(\"storeId\"))",
      "storesDF.join(employeesDF, \"storeId\")",
      "storesDF.join(employeesDF, \"storeId\", \"left\")",
      "storesDF.merge(employeesDF, \"left\", col(\"storeId\"))",
      "storesDF.join(employeesDF, \"left\", storesDF.storeId == employeesDF.storeId)"
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
    "stem": "storesDFにはStringTypeの列がちょうど1つだけあり、filePathはまだ存在しないものとします。\n\nDataFrame storesDFをテキストファイルとしてfilePathに書き込むコードはどれですか？",
    "options": [
      "storesDF.write(filePath)",
      "storesDF.write.path(filePath)",
      "storesDF.write().text(filePath)",
      "storesDF.write.text(filePath)",
      "storesDF.write.option(\"text\").path(filePath)"
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
    "stem": "次のコードには誤りがあります。このコードは、事前定義されたスキーマschemaを使って、filePathのCSVファイルをDataFrameに読み込むことを目的としています。\n\nコード：\n\n```\nspark.read.schema(\"schema\").csv(filePath)\n```\n\nこのコードの誤りは何ですか？",
    "options": [
      "ここで文字列リテラル\"schema\"は、事前定義したスキーマ変数でも有効なDDLスキーマでもない。変数を`schema`として渡す必要がある。なお、有効なDDL形式の文字列も使用できる。",
      "`DataFrameReader`は`csv()`メソッドをサポートしていないため、`load()`に置き換える必要がある。",
      "`DataFrameReader`オブジェクトを返すには、`spark.read`の後に括弧を付けなければならない。",
      "`spark`には`read`プロパティがないため、`spark`を`DataFrame`に置き換える必要がある。",
      "`read`の`schema()`メソッドは文字列ではなく列を受け取るため、引数は`col(\"schema\")`にする必要がある。"
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
    "stem": "別の分散クラスターを使わず、1台のマシン上でDriverとタスクをローカルに実行するSparkの実行・デプロイモードはどれですか？",
    "options": [
      "スタンダードモード。",
      "クラスターモード。",
      "ローカルモード。",
      "どの選択肢でも、Executorは1台のWorkerノード上で実行する必要がある。",
      "クライアントモード。"
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
    "stem": "sqft列を基準に昇順で並べ替え、欠損値（null）が先頭に来るようにしたDataFrameを返すコードはどれですか？",
    "options": [
      "storesDF.orderBy(col(\"sqft\").asc_nulls_last())",
      "storesDF.orderBy(asc_nulls_first(col(\"sqft\")))",
      "storesDF.orderBy(col(\"sqft\").asc().nulls_first())",
      "storesDF.orderBy(col(\"sqft\").asc_nulls_first())",
      "storesDF.orderBy(col(\"sqft\").nulls_first())"
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
    "stem": "Spark DataFrameの指定した列の欠損値を、指定した値で置き換えるために使用できる、同等の2つの操作を両方とも挙げている選択肢はどれですか？",
    "options": [
      "DataFrame.na.fill()",
      "DataFrame.nafill()",
      "DataFrame.fillna()",
      "DataFrame.na.fill() と DataFrame.nafill()",
      "DataFrame.na.fill() と DataFrame.fillna()"
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
    "stem": "すべての行が一意になるDataFrameを返すコードはどれですか？",
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
    "stem": "DataFrame storesDFと、それよりもはるかに大きいDataFrame employeesDFを、storeIdを結合キーとして効率よくブロードキャスト結合するコードはどれですか？",
    "options": [
      "storesDF.join(broadcast(employeesDF), \"storeId\")",
      "broadcast(storesDF.join(employeesDF, \"storeId\"))",
      "broadcast(employeesDF.join(storesDF, \"storeId\"))",
      "employeesDF.join(broadcast(storesDF), \"storeId\")",
      "storesDF.broadcastJoin(employeesDF, \"storeId\")"
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
    "stem": "Spark DataFrameのすべての行を返すために使用できる操作はどれですか？",
    "options": [
      "DataFrame.count()",
      "DataFrame.head()",
      "DataFrame.collect()",
      "DataFrame.show()",
      "DataFrame.take()"
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
    "stem": "storeId列とemployeeId列を使ったstoresDFとemployeesDFの内部結合の結果を、新しいDataFrameとして返すことができないコードはどれですか？",
    "options": [
      "storesDF.join(employeesDF, [col(\"storeId\"), col(\"employeeId\")])",
      "storesDF.join(employeesDF, [storesDF.storeId == employeesDF.storeId, storesDF.employeeId == employeesDF.employeeId])",
      "storesDF.join(employeesDF, [\"storeId\", \"employeeId\"])",
      "storesDF.alias(\"s\").join(employeesDF.alias(\"e\"), [col(\"s.storeId\") == col(\"e.storeId\"), col(\"s.employeeId\") == col(\"e.employeeId\")])",
      "storesDF.join(employeesDF, [\"storeId\", \"employeeId\"], \"inner\")"
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
    "stem": "専用のDriverノードと、Executorを配置する別のWorkerノードを持つ、複数ノードのSparkクラスターモードでのデプロイを想定します。この前提のもとで、クラスターノードに関する誤った説明はどれですか？",
    "options": [
      "Spark Driverは専用のノードで動作し、そのノードにはExecutorを配置しない。",
      "各Executorは、Workerノード内で処理エンジンとして動作する。",
      "設定によっては、Executor数がノード数より多いことも、ノード数がExecutor数より多いこともある。",
      "クラスター内には常に複数のノードがある。",
      "Spark DriverとExecutorの両方を含むノードが1つだけ存在する。"
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
    "stem": "次のコードは、`storesDF`から、numberOfManagers列に整数の定数1を設定した新しいDataFrameを返すことを目的としています。\n\n番号付きの空欄を埋めて、コードを正しく完成させてください。\n\nコード：\n\n```\nstoresDF._1_(_2_, _3_(_4_))\n```\n\n",
    "options": [
      "withColumn\n\n\"numberOfManagers\"\n\nlit\n\n1",
      "withColumn\n\n\"numberOfManagers\"\n\nIntegerType\n\n1",
      "newColumn\n\nnumberOfManagers\n\nIntegerType\n\n1",
      "withColumn\n\n\"numberOfManagers\"\n\ncol\n\n1",
      "1. withColumn\n\n2. \"numberOfManagers\"\n\n3. lit\n\n4. \"1\""
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
    "stem": "Spark DataFrameの行を並べ替えるために使用できる、同じ働きをする2つの有効なメソッド名を両方とも挙げている選択肢はどれですか？",
    "options": [
      "sort() と orderBy()",
      "orderBy()",
      "sort()",
      "sort() と orderby()",
      "orderby()"
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
    "stem": "Apache Sparkにおける遅延評価の利点はどれですか？",
    "options": [
      "実行開始前にすべての変換が分かっているため、Sparkジョブをより適切に最適化できる。",
      "プログラム内のすべての操作を実行するわけではないため、Sparkジョブが単純になる。",
      "クラスターのオーバーヘッドを避けるために小さなタスクを分散せず、Sparkジョブが速くなる。",
      "コンパイルが完了するまで実行を開始しないため、Sparkジョブが失敗しにくくなる。",
      "Spark DriverとWorkerノード間の通信が増えるため、Sparkジョブが速くなる。"
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
    "stem": "division列を基準にアルファベット順に並べたDataFrameを返すことができないコードはどれですか？",
    "options": [
      "storesDF.sort(asc(\"division\"))",
      "storesDF.orderBy([\"division\"], ascending=[1])",
      "storesDF.orderBy(col(\"division\").desc())",
      "storesDF.orderBy(\"division\")",
      "storesDF.sort(\"division\")"
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
    "stem": "次のコードは、現在8個のパーティションを持つDataFrame `storesDF`から、シャッフルを発生させずに4個のパーティションを持つ新しいDataFrameを返すことを目的としています。\n\n空欄を埋めてコードを正しく完成させてください。\n\nコード：\n\n```\n_1_._2_(_3_)\n```\n\n",
    "options": [
      "1. storesDF\n\n2. coalesce\n\n3. `Nothing",
      "1. storesDF\n\n2. coalesce\n\n3. 4",
      "1. storesDF\n\n2. coalesce\n\n3.  4, \"storeId\"",
      "1. storesDF\n\n2. coalesce\n\n3. \"storeId\""
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
    "stem": "Apache Sparkのタスクを最も適切に説明しているのはどれですか？",
    "options": [
      "1つのExecutorで実行できる最小の処理単位。",
      "同じExecutor内にあるスロットの集合。",
      "シャッフルを必要とせずに実行できる最小の処理単位。",
      "Sparkの実行階層における最上位の実行単位。",
      "1つのExecutorで実行される、データブロックと一連の変換の組み合わせ。"
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
    "stem": "Apache Sparkのガベージコレクション（GC）の負担を減らすための一般的な方法として、最も妥当性が低い推奨事項はどれですか？",
    "options": [
      "ガベージコレクションがボトルネックになった場合、G1GCを使用して性能を改善する。",
      "メモリへの負担を減らすため、構造化API（DataFrame/Dataset）をできるだけ使用する。",
      "変換を減らし、アクションを増やす。",
      "GCの頻度を確認し、測定結果に基づいてオブジェクトの割り当てやヒープ設定を調整する。",
      "測定されたGCの動作に基づき、若い世代・古い世代へのメモリ割り当てを調整する。"
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
    "stem": "従来型のPySparkで、クラスター全体にパーティション分割された分散コレクションであり、DataFrameの.rddプロパティにアクセスすると返される抽象化はどれですか？",
    "options": [
      "Deltaテーブル。",
      "RDD。",
      "マルチプロセッシング。",
      "マルチスレッディング。",
      "ベクトル。"
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
    "stem": "DataFrame `storesDF`の`sqft`列の平均を計算し、その結果をsqftMeanという名前の列に格納した新しいDataFrameを返すコードはどれですか？",
    "options": [
      "storesDF.withColumn(mean(col(\"sqft\")).alias(\"sqftMean\"))",
      "storesDF.agg(col(\"sqft\").mean().alias(\"sqftMean\"))",
      "storesDF.agg(mean(\"sqft\").alias(\"sqftMean\"))",
      "storesDF.agg(mean(col(\"sqft\")).alias(\"sqftMean\"))",
      "storesDF.withColumn(\"sqftMean\", mean(col(\"sqft\")))"
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
    "stem": "次のコードには誤りがあります。このコードは、storeId列を使ってstoresDFとemployeesDFを外部結合した、新しいDataFrameを返すことを目的としています。\n\nコード：\n\n```\nstoresDF.join(employeesDF, \"storeId\")\n```\n\n誤りを特定してください。",
    "options": [
      "howパラメーターのデフォルト値は`\"inner\"`なので、`\"outer\"`を指定する引数を追加する必要がある。",
      "結合キーstoreIdをcol()関数で囲む必要がある。",
      "結合キーを`storesDF.storeId == employeesDF.storeId`のような明示的な条件として記述する必要がある。",
      "結合キーstoreIdを`[\"storeId\"]`のようにリストに入れる必要がある。",
      "DataFrame.join()メソッドは存在しないので、代わりにDataFrame.merge()を使用する必要がある。"
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
    "stem": "開発者は、DataFrame storesDFのopenDate列から、その年の何日目かを表す数値を求め、新しいdayOfYear列を含むDataFrameを作成したいと考えています。\n\nopenDateは、UNIXエポックタイムスタンプ（1970年1月1日午前0時からの経過秒数）を表す整数として格納されている点に注意してください。\n\nstoresDFのサンプルを次に示します。\n\nstoreId | openDate\n0 | 1100746394\n1 | 1474410343\n2 | 1116610009\n3 | 1180035265\n4 | 1408024997\n... | ...\n\nコードの各行（行番号を除き、選んだ行を1つの式としてメソッドチェーンでつなげてください）：\n\n```\n1. storesDF.withColumn(\"openTimestamp\", col(\"openDate\").cast(\"Timestamp\")) \\\n2. storesDF.withColumn(\"dayOfYear\", dayofyear(col(\"openDate\")))\n3. storesDF.withColumn(\"openDateFormat\", col(\"openDate\").cast(\"Date\")) \\\n4. .withColumn(\"dayOfYear\", dayofyear(col(\"openTimestamp\")))\n5. .withColumn(\"dayOfYear\", dayofyear(col(\"openDateFormat\")))\n6. .withColumn(\"dayOfYear\", get_dayofyear(col(\"openDateFormat\")))\n```\n\ndayOfYear列を正しく作成するには、どの順序でコードの行を実行すべきですか？",
    "options": [
      "3, 6",
      "2",
      "3, 5",
      "1, 6",
      "1, 4"
    ],
    "explanation": "epoch秒はまずTimestampに変換し、その列からdayofyearを取得します。整数をDateへ直接変換することや、存在しないget_dayofyearとの取り違えに注意します。 1行目と4行目は、行番号を除いてメソッドチェーンとしてつなぎます。4行目の先頭のドットは、1行目が返したDataFrameに対してwithColumnを呼び出すことを表します。",
    "reasons": [
      "整数のDateへの直接変換と関数名が不適切です。",
      "epoch秒の整数をそのまま日付関数へ渡していませんか。先に時刻へ変換します。",
      "整数からDateへの直接変換が適切ではありません。",
      "作成していない列を参照し、関数名も誤っています。",
      "Timestamp化してから、その列にdayofyearを適用します。"
    ]
  },
  "PASTED-SPARK-20261024-139": {
    "stem": "開発者は、DataFrame storesDFの`openDate`列から月の数値を取り出し、新しいmonth列を含むDataFrameを作成したいと考えています。\n\nopenDate列は、UNIXエポックタイムスタンプ、つまり1970年1月1日からの経過秒数を表す整数として格納されている点に注意してください。\n\nstoresDFのサンプルを次に示します。\n\nstoreId | openDate\n0 | 1100746394\n1 | 1474410343\n2 | 1116610009\n3 | 1180035265\n4 | 1408024997\n... | ...\n\nopenDateから求めたmonth列を含むDataFrameを正しく作成するコードはどれですか？",
    "options": [
      "storesDF.withColumn(\"month\", getMonth(col(\"openDate\")))",
      "(storesDF.withColumn(\"openTimestamp\", col(\"openDate\").cast(\"Timestamp\"))\n.withColumn(\"month\", month(col(\"openTimestamp\"))))",
      "storesDF.withColumn(\"month\", month(col(\"openDate\")))",
      "storesDF.withColumn(\"month\", substr(col(\"openDate\"), 4, 2))",
      "(storesDF.withColumn(\"openDateFormat\", col(\"openDate\").cast(\"Date\"))\n.withColumn(\"month\", month(col(\"openDateFormat\"))))"
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
    "stem": "`my_spark_app.py`の次のコードを考えます。\n\n```\nfrom pyspark.sql import SparkSession\nfrom pyspark.sql.functions import lit\nspark = SparkSession.builder.appName(\"CoreComponentsExample\").getOrCreate()\ndata = [(\"Alice\", 34), (\"Bob\", 36), (\"Cathy\", 31)]\ncolumns = [\"Name\", \"Age\"]\n \ndf = spark.createDataFrame(data, columns).withColumn(\"Status\", lit(\"Pass\"))\ndf_filtered = df.filter(df.Age > 35)\ndf_filtered.show()\n \nspark.stop()\n```\n\nこのアプリケーションにおけるSpark Driverノードの主な役割は何ですか？",
    "options": [
      "アクションをタスクに変換してWorkerノードに配布し、実行を調整する。",
      "Sparkアプリケーションの監視に使うユーザーインターフェースだけを提供する。",
      "DataFrameのデータを保存し、すべての計算をローカルで実行する。",
      "Workerノードが計算を終えた後、最終出力を保存する。"
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
    "stem": "データエンジニアは、次のストリーミングデータを継続的に受け取る、streaming_dfというStructured Streaming DataFrameを扱っています。\n\n![画像](https://img-c.udemycdn.com/redactor/raw/practice_test_question/2026-03-11_09-55-16-f6a9a6fea888b7c8117b90c8c8e0b523.png)\n\n![画像](https://img-c.udemycdn.com/redactor/raw/practice_test_question/2026-03-11_09-55-16-f6a9a6fea888b7c8117b90c8c8e0b523.png)\n\nストリーミングDataFrame streaming_dfでサポートされる操作はどれですか？",
    "options": [
      "streaming_df.select(countDistinct(\"Name\"))",
      "streaming_df.groupby(\"Id\").count()",
      "streaming_df.orderBy(\"timestamp\").limit(4)",
      "streaming_df.filter(col(\"count\") < 30).show()"
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
    "stem": "MLOpsエンジニアは、言語モデルを使って英語の文章をスペイン語に翻訳するPandas UDFを実装しています。しかし現在の実装では、UDFを呼び出すたびに翻訳モデルを読み込むため、パイプラインの性能が大幅に低下しています。\n\n現在のコードは次のとおりです。\n\n```\ndef in_spanish_inner(df: pd.Series) -> pd.Series:\n    model = get_translation_model(target_lang='es')\n    return df.apply(model)\nin_spanish = sf.pandas_udf(in_spanish_inner, StringType())\n```\n\n言語モデルの読み込み回数を減らすには、何を変更すべきですか？",
    "options": [
      "Pandas UDFを標準のPySpark UDFに変換する。",
      "Pandas UDFをSeries → Series形式からSeries → Scalar形式に変更する。",
      "mapInPandas()関数呼び出しを使って`in_spanish_inner()`のロジックを実行する。",
      "Pandas UDFをSeries → Series形式からIterator[Series] → Iterator[Series]形式に変更する。"
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
    "stem": "開発者は、次のコードで`sales.purchases_fct`と`sales.customer_dim`という2つのテーブルを結合する必要があります。\n\n```\nimport pyspark.sql.functions as F\npurch_df = spark.table(\"sales.purchases_fct\")\ncust_df = spark.table(\"sales.customer_dim\").dropDuplicates([\"cust_id\"])\nfact_df = purch_df.join(cust_df, F.col(\"customer_id\") == F.col(\"cust_id\"))\n```\n\n結果を確認すると、`purchases_fct`には存在していても、`customer_dim`に存在しない顧客が、結合結果から欠落していることに気付きました。\n\nこれらの`purchases_fct`側の顧客レコードを最終データセットに残すには、どのように変更すべきですか？",
    "options": [
      "`fact_df = purch_df.join(cust_df, F.col(\"customer_id\") == F.col(\"cust_id\"), \"left\")`",
      "`fact_df = cust_df.join(purch_df, F.col(\"customer_id\") == F.col(\"cust_id\"))`",
      "`fact_df = purch_df.join(cust_df, F.col(\"cust_id\") == F.col(\"customer_id\"))`",
      "`fact_df = purch_df.join(cust_df, F.col(\"customer_id\") == F.col(\"cust_id\"), \"right_outer\")`"
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
    "stem": "開発者は、次のデータを含む小さなParquetテーブルからPythonの辞書を作成する必要があります。\n\n```\nregion_id | region\n----------+-----------\n1         | AMERICA\n3         | EUROPE\n0         | AFRICA\n4         | MIDDLE EAST\n2         | ASIA\n```\n\n辞書はregion → region_idの対応とし、`region_id`が最も小さい3件だけを含める必要があります。\n\nこれらの要件を正しく満たすコードはどれですか？",
    "options": [
      "```\nregions = dict(\n    regions_df\n        .select('region', 'region_id')\n        .sort('region_id')\n        .take(3)\n)\n```",
      "```\nregions = dict(\n    regions_df\n        .select('region_id', 'region')\n        .sort('region_id')\n        .take(3)\n)\n```",
      "```\nregions = dict(\n    regions_df\n        .select('region_id', 'region')\n        .limit(3)\n        .collect()\n)\n```",
      "```\nregions = dict(\n    regions_df\n        .select('region', 'region_id')\n        .sort(desc('region_id'))\n        .take(3)\n)\n```"
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
    "stem": "開発者は、devices.jsonファイルのname列とplatform列を含むデータをParquet形式で書き込む必要があります。次のコードが書かれていますが、X、Y、Zという3つの空欄があります。\n\n```\ndevices_df = spark.read.json(\"devices.json\")\ndevices_df.createOrReplaceTempView(\"devices\")\n \nspark.sql(\"SELECT name, platform FROM X\").Y.Z(\"names.parquet\", format=\"parquet\")\n```\n\nクエリ結果をParquetファイルとして正しく書き込むには、X、Y、Zをそれぞれ何に置き換えるべきですか？",
    "options": [
      "devices_df, write, save",
      "devices, save, write",
      "devices, write, saveAsTable",
      "devices, write, save"
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
    "stem": "次のコードを考えます。\n\n```\nimport pyspark.pandas as ps\npsdf = ps.DataFrame({'col': [1, 2], 'col2': [3, 4]})\n```\n\nPandas API on SparkのDataFrame（`pyspark.pandas.DataFrame`）を標準のPySpark DataFrame（`pyspark.sql.DataFrame`）に変換するには、どのメソッドを使用すべきですか？",
    "options": [
      "`psdf.to_spark()`",
      "`psdf.to_pyspark()`",
      "`psdf.to_pandas()`",
      "`psdf.to_dataframe()`"
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
    "stem": "次の2つのDataFrame df1とdf2を考えます。\n\n```\ndf1 = spark.createDataFrame([(1, 'Alice', 1000), (2, 'Bob', 1500)], ['id', 'name', 'salary'])\n \ndf2 = spark.createDataFrame([(1, 'Alice', 'HR'), (2, 'Charlie', 'Engineering')], \n                            ['id', 'name', 'dept'])\n \n# Perform the join\njoined_df = df1.join(df2, X)\n```\n\n2つのDataFrame間で`id`と`name`の両方が一致する内部結合を行うには、Xをどの式に置き換えるべきですか？",
    "options": [
      "`(df1.id == df2.id) & (df1.name == df2.name)`",
      "`(df1.id == df2.id)`",
      "`['id', 'dept']`",
      "`['id']`"
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
    "stem": "開発者は、複雑なSparkの変換パイプラインの結果を、`events.live_latest`というParquetテーブルに保存する必要があります。下流の利用者は通常、TIMESTAMP型の`event_ts`列から取り出したevent_yearとevent_monthをSpark SQLで直接フィルタリングして、このテーブルをクエリします。\n\n現在は次の実装を使用しています。\n\n```\nimport pyspark.sql.functions as F\n \nfinal_df \\\n  .withColumn(\"event_year\", F.year(\"event_ts\")) \\\n  .withColumn(\"event_month\", F.month(\"event_ts\")) \\\n  .write \\\n  .bucketBy(42, [\"event_year\", \"event_month\"]) \\\n  .format(\"parquet\") \\\n  .saveAsTable(\"events.live_latest\")\n```\n\nしかし下流の利用者から、年と月で絞り込むクエリの性能が低いという報告がありました。\n\n`event_ts`の年と月の両方で絞り込むクエリをより効率よく実行するには、どの変更を適用すべきですか？",
    "options": [
      "`.bucketBy()`を`.partitionBy(\"event_year\")`に置き換える。",
      "`.bucketBy()`を`.partitionBy([\"event_year\", \"event_month\"])`に置き換える。",
      "`.bucketBy(42, ...)`の値を小さくして、バケット数を減らす。",
      "`.bucketBy()`の後に`.sortBy(\"event_month\")`を追加する。"
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
    "stem": "データエンジニアは、上流チームから毎晩届く複数のParquetファイルの取り込みパイプラインを作成する必要があります。ファイルのディレクトリ構成の基点となるパスは次のとおりです。\n\n/path/events/data\n\n日ごとのデータは、year/month/dayの形式に従うサブディレクトリに格納されています。\n\nディレクトリ構成の例：\n\n/path/events/data/2024/01/01\n/path/events/data/2024/01/02\n/path/events/data/2024/01/03\n/path/events/data/2023/01/01\n/path/events/data/2023/01/02\n/path/events/data/2023/01/03\n\nこのディレクトリ階層内のすべてのデータを正しく読み込むコードはどれですか？",
    "options": [
      "df = spark.read.option(\"inferSchema\", \"true\").parquet(\"/path/events/data/\")",
      "df = spark.read.option(\"recursiveFileLookup\", \"true\").parquet(\"/path/events/data/\")",
      "df = spark.read.parquet(\"/path/events/data/*\")",
      "df = spark.read.parquet(\"/path/events/data/\")"
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
    "stem": "Spark開発者は、SHAKE-256ハッシュを計算する既存のPySpark UDFの性能を最適化したいと考えています。このハッシュ機能はSpark SQLの組み込み関数ライブラリにはありません。\n\n現在のUDF実装は次のとおりです。\n\n```\nimport hashlib\nimport pyspark.sql.functions as sf\nfrom pyspark.sql.types import StringType\n \ndef shake_256(raw: str) -> str:\n    return hashlib.shake_256(raw.encode()).hexdigest(20)\n \nshake_256_udf = sf.udf(shake_256, StringType())\n```\n\n性能を改善するため、開発者は次の定義でPandas UDFに変換しようとしました。\n\n```\nshake_256_udf = sf.pandas_udf(shake_256, StringType())\n```\n\nしかしSparkで次のエラーが発生しました。\n\nUNSUPPORTED_SIGNATURE: Unsupported signature: (raw: str) -> str\n\n関数本体を、pandas Seriesの各要素のハッシュを計算し、同じ長さのSeriesを返すように書き換えた後、Series → Series形式のPandas UDFにはどのシグネチャを使用すべきですか？",
    "options": [
      "```\ndef shake_256(df: pd.Series) -> str\n```",
      "```\ndef shake_256(df: Iterator[pd.Series]) -> Iterator[pd.Series]\n```",
      "```\ndef shake_256(raw: str) -> str\n```",
      "```\ndef shake_256(df: pd.Series) -> pd.Series\n```"
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
    "stem": "次のコードで、`aggDf`はストリーミングDataFrameに対する集計処理の結果を表しています。\n\n```\naggDf\n  .writeStream \\\n  .outputMode(\"________\") \\\n  .format(\"console\") \\\n  .start()\n```\n\nトリガーが実行されるたびに集計結果のテーブル全体をコンソールに書き込むには、どの出力モードを指定すべきですか？",
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
    "stem": "データエンジニアは、次のDataFrame `df`を分析しています。\n\n![画像](https://img-c.udemycdn.com/redactor/raw/practice_test_question/2026-03-12_09-50-34-2c964a84fb12b4a9b914e8cf4bbefe8a.png)\n\n![画像](https://img-c.udemycdn.com/redactor/raw/practice_test_question/2026-03-12_09-50-34-2c964a84fb12b4a9b914e8cf4bbefe8a.png)\n\n`count`の値が最も大きい行を先頭にし、次に大きい行が続くように、行を並べ替える必要があります。\n\nName列とcount列を使用して、この順序に正しく並べ替えるコードはどれですか？",
    "options": [
      "`df.select(\"Name\", \"count\").orderBy(\"count\", \"Name\", ascending=False)`",
      "`df.select(\"Name\", \"count\").orderBy(\"count\")`",
      "`df.select(\"Name\", \"count\").sort(\"Name\", \"count\")`",
      "`df.select(\"Name\", \"count\").sort(\"Name\")`"
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
    "stem": "データエンジニアは、次のSpark DataFrameを分析しています。\n\n![画像](https://img-c.udemycdn.com/redactor/raw/practice_test_question/2026-03-12_07-53-18-f3d8ee122167985c66bdb9bd846df2ca.png)\n\n![画像](https://img-c.udemycdn.com/redactor/raw/practice_test_question/2026-03-12_07-53-18-f3d8ee122167985c66bdb9bd846df2ca.png)\n\nName列から重複のない値を取り出し、アルファベット順に並べたリストとして返す必要があります。\n\nこれを正しく実現するコードはどれですか？",
    "options": [
      "df.select(\"Name\").orderBy(df[\"Name\"].asc())",
      "[row[\"Name\"] for row in df.select(\"Name\").distinct().orderBy(\"Name\").collect()]",
      "df.select(\"Name\").distinct()",
      "df.select(\"Name\").distinct().orderBy(df[\"Name\"].desc())"
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
    "stem": "データベース管理チームから、SparkアプリケーションがPostgreSQLデータベースへの接続を多く作りすぎていると報告がありました。エンジニアがSparkジョブを確認すると、JDBCでデータを読み込むために次のコードが使用されていました。\n\n```\nSET spark.sql.shuffle.partitions=1007;\n \nCREATE TEMPORARY VIEW sales_fct\nUSING org.apache.spark.sql.jdbc\nOPTIONS (\n  url \"jdbc:postgresql://pgdb1:5432/dw\",\n  dbtable \"dw.sales_fct\",\n  user \"sparkrep01\",\n  password \"G7xPg9vL2M\",\n  numPartitions \"25\",\n  partitionColumn \"sales_id\",\n  lowerBound \"1\",\n  upperBound \"10000\"\n)\n```\n\nSparkアプリケーションが開くデータベース接続数を減らすには、どの変更を行えばよいですか？",
    "options": [
      "numPartitionsの値を25から8に減らす。",
      "upperBoundの値を10,000から100,000に増やし、パーティションの分割幅を広げる。",
      "spark.sql.shuffle.partitionsを100から8に減らす。",
      "partitionColumnを`sales_id`から、利用可能なインデックスを持つ別のPostgreSQL列に変更する。"
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
    "stem": "開発者は、CSVファイルのデータがDataFrameに正しく読み込まれないSparkアプリケーションを調査しています。\n\nCSVファイルは次のSpark SQL文で読み込まれました。\n\n```\nCREATE TABLE default.air_ref\n(\n  iata STRING,\n  iso_country STRING,\n  city STRING,\n  lat DOUBLE,\n  long DOUBLE\n)\nUSING CSV\nOPTIONS ('path' = '/landing/air_ref_20241001.csv')\n```\n\nしかし、次のクエリを実行すると、\n\n```\nSELECT * FROM default.air_ref\n```\n\n例えば次のように、正しく解析されていない結果が表示されます。\n\n```\n+-------------------------+------------+------+-----+------+\n| iata                    | iso_country| city | lat | long |\n+-------------------------+------------+------+-----+------+\n| iata | iso_country | ...| NULL       | NULL | NULL| NULL |\n| SYD | AU | Sydney | -33 | ...        | NULL | NULL| NULL |\n+-------------------------+------------+------+-----+------+\n```\n\nこれは、複数の値が1つの列に読み込まれ、残りの列がNULLになっていることを示しています。\n\nCSVファイルを正しく解析するには、`CREATE TABLE`文のOPTIONS句にどのパラメーターを追加すべきですか？",
    "options": [
      "`quote = '|'`",
      "`inferSchema = 'true'`",
      "`header = 'true', sep = '|'`",
      "`header = 'true'`"
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
    "stem": "バッチアプリケーションで、永続化したRDDの実体化が完了しています。1つのExecutorが故障し、複数のパーティションについて唯一のキャッシュコピーが失われました。Driverと十分な数のExecutorは正常です。元の入力には引き続きアクセスでき、すべての変換は決定的です。後続のアクションで失われたパーティションが必要になったとき、Sparkは通常どのように対応すべきですか？",
    "options": [
      "アプリケーション内のすべてのRDDの全パーティションを、最初から再計算する。",
      "故障したExecutorに保存されていた各レコードの代わりにNULLを返す。",
      "失われたパーティションをリネージから再計算し、可能な場合は残っているキャッシュ済みパーティションを再利用する。",
      "永続化によって障害復旧が無効になるため、永久に停止する。"
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
    "stem": "PySparkアプリケーションがリモートクラスターで動作しています。Driver側のseenというPythonリストを、RDDのforeachアクションに渡す関数のクロージャに含めています。各タスクはこのリストに識別子を追加します。foreachは正常終了しましたが、Driverのリストは空のままです。正しい説明はどれですか？",
    "options": [
      "foreachは変換なので、タスクはまだ実行されていない。",
      "リストの要素数が1,000未満の場合だけ、Sparkは変更を元のリストに反映する。",
      "Executorのタスクは、Driverプロセス内の元のリストではなく、シリアライズされたクロージャ状態のコピーを変更する。",
      "Pythonリストを変更するには、Driverでブロードキャスト結合を有効にする必要がある。"
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
    "stem": "チームは、エンコーダーを使って業務オブジェクトをDataset[Order]として表すScalaのパイプラインを移植しています。置き換え後のアプリケーションはPythonで記述し、Spark SQLによる構造化データ処理の最適化を維持する必要があります。Apache Spark 3.5.6の公開された言語APIに合う移行計画はどれですか？",
    "options": [
      "レコードをPySpark DataFrameで表す。強い型付けを持つDataset APIはScalaとJavaで提供されており、Pythonでは提供されていない。",
      "Dataset[Order]にPythonの型ヒントを追加し、Pythonコンパイラーに同じ型付きDataset操作を強制させる。",
      "SparkにはPythonのDataFrame APIがないため、すべての構造化処理をRDDに置き換える。",
      "ScalaのエンコーダーをPythonにインポートし、DataFrame.as(Order)を呼び出して同じ型付きDataset APIを取得する。"
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
    "stem": "PySparkアプリケーションの複数のステージで、同じPython辞書をルックアップに使います。辞書は各Workerプロセスのメモリに余裕を持って収まり、アプリケーションの実行中は読み取り専用である必要があります。エンジニアは、タスクのクロージャに辞書全体を繰り返し含める代わりに、効率よく配布したいと考えています。適切な方法はどれですか？",
    "options": [
      "辞書をアキュムレーターに入れ、各タスクから集計された値を読み取る。",
      "SparkContextのブロードキャスト変数を作成し、タスク関数内でそのvalueを読み取る。",
      "Python辞書にDataFrameのブロードキャスト結合ヒントを直接使用する。",
      "辞書のキーごとに別のSparkSessionを作成する。"
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
    "stem": "Driverはlookup_bcというブロードキャスト変数を作成し、アクションで使用した後、lookup_bc.unpersist(blocking=True)を呼び出します。destroyは呼ばず、ブロードキャストオブジェクトも保持します。後続のアクションで再びlookup_bc.valueを使用すると、どのような動作が期待されますか？",
    "options": [
      "値は、すべてのExecutorが書き込める共有変数になる。",
      "unpersistはブロードキャストオブジェクトを永久に無効化するため、後続のアクションは必ず失敗する。",
      "unpersistによってブロードキャスト値が空の辞書に変わる。",
      "Executor上のキャッシュコピーが削除され、必要になればブロードキャストを再送できる。"
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
    "stem": "エンジニアは、バッチアクション中に不正な行を数えるため、数値アキュムレーターを使用しています。さらに、各Executorのタスクがアキュムレーターの現在の合計を読み、全体のしきい値に達したら停止する仕組みも作りたいと考えています。アキュムレーターの仕様を正しく説明しているのはどれですか？",
    "options": [
      "タスクは更新を加算でき、Driverが集計値を読む。タスクが読み取れる共有の全体しきい値としては使えない。",
      "タスク内でアキュムレーターを読むと、すべてのタスクを同期するシャッフルが自動的に発生する。",
      "アキュムレーターを更新できるのはクラスターマネージャーだけである。",
      "すべてのタスクが、全体で同期された同じアキュムレーター値を読み書きできる。"
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
    "stem": "2つの独立したSparkアプリケーションが、同じYARNクラスターにExecutorのリソースを要求しています。それぞれのアプリケーションには、自分のタスクをスケジュールできるDriverがすでに存在します。これらのアプリケーション間でクラスターリソースを割り当てる責任を持つコンポーネントはどれですか？",
    "options": [
      "YARNなどのクラスターマネージャー。",
      "現在ヒープメモリの空きが最も多いExecutor。",
      "先に投入されたアプリケーションのDataFrameReader。",
      "いずれかのアプリケーションのCatalystオプティマイザー。"
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
    "stem": "アプリケーションAがクラスター上で大きなDataFrameをキャッシュします。アプリケーションBは同じWorkerマシン上で別のSparkContextを使って起動し、同じソースパスを読み込みます。外部キャッシュサービスは設定されていません。パスとWorkerマシンが同じという理由だけで、BはAのExecutorのキャッシュを直接再利用できますか？",
    "options": [
      "できない。1つのクラスターでは同時に1つのSparkアプリケーションしか動かせないため。",
      "できる。DataFrameのキャッシュは、Worker上のすべてのSparkContextに対して自動的に共有される。",
      "できる。ただし、両方のアプリケーションが同じDataFrame変数名を使用している場合に限る。",
      "できない。アプリケーションごとにExecutorプロセスは別であり、アプリケーション間でデータを共有するには外部の仕組みが必要になる。"
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
    "stem": "開発者はノートPCからクライアントモードのアプリケーションを投入します。ノートPCはクラスターマネージャーに接続できますが、ファイアウォールによって、すべてのExecutorからDriverへの接続が遮断されています。Executorの割り当てには成功しても、タスクは正常に実行できません。不足している要件はどれですか？",
    "options": [
      "すべてのExecutorがDriverと同じノートPCで動作しなければならない。",
      "Driverが、各Executorのローカルディスクをすべて直接読み取れなければならない。",
      "アプリケーションの実行中を通して、ExecutorからDriverのアドレスと待ち受けポートに接続できなければならない。",
      "SQLのウェアハウスディレクトリが、ノートPC上のローカルフォルダーでなければならない。"
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
    "stem": "クライアントモードのPySparkアプリケーションを、DriverのJVMヒープ1 GBで起動します。エンジニアは実行中のPythonプログラム内でspark.driver.memoryを4gに設定し、既存のDriverヒープが増えることを期待しています。次回の実行でDriverヒープを4 GBに正しく設定する変更はどれですか？",
    "options": [
      "プロパティを設定する前に、入力DataFrameでcacheを呼ぶ。",
      "SparkSession.confでspark.sql.shuffle.partitionsを4gに設定する。",
      "DriverのJVMが起動する前に、spark-submitに--driver-memory 4gを渡す。",
      "最初のアクションの後でspark.executor.memoryを4gに設定する。"
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
    "stem": "アプリケーションの設定ファイルspark-defaults.confではspark.task.maxFailuresが2です。spark-submitコマンドでは同じプロパティを3に設定しています。プログラムはSparkContextを作成する前に、SparkContextに渡すSparkConfで、このプロパティを明示的に5に設定します。名前が変更されたキーや、後からの設定変更はありません。どの値が優先されますか？",
    "options": [
      "3。コマンドラインの設定は常にアプリケーションコードより優先されるため。",
      "5。渡されたSparkConfで明示的に設定した値が最も優先されるため。",
      "3つの値を加算した10になる。",
      "2。設定ファイルが最初に読み込まれるため。"
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
    "stem": "共有クラスターで、動的割り当てを有効にしたアプリケーションが動作しています。必要なシャッフルデータ保持の仕組みも設定済みです。あるフェーズでは未実行タスクが継続的にたまっています。その後のフェーズでは、キャッシュを持たない複数のExecutorが、設定したタイムアウトを超えてアイドル状態になっています。動的割り当ては、どのような動作を提供するためのものですか？",
    "options": [
      "すべてのコアが使用中になるまで、各DataFrameの行数を増やす。",
      "初期のExecutor数を固定したまま、Pythonのスレッド数だけを変える。",
      "ステージが終了するたびに、DriverをExecutor間で移動させる。",
      "未実行タスクの蓄積に応じてExecutorを追加要求し、後で解放条件を満たすアイドル状態のExecutorを解放する。"
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
    "stem": "アプリケーションは、外部シャッフルサービスと動的割り当てを使用しています。あるExecutorがシャッフルのmap出力ファイルを書き終え、そのファイルが他のタスクでまだ必要になる可能性がある時点で削除されました。この状況での外部シャッフルサービスの、構成上の主な目的は何ですか？",
    "options": [
      "アプリケーション終了後も、キャッシュされたすべてのPythonオブジェクトを永久に利用可能にする。",
      "そのExecutorのプロセスとは独立して、Executorが作成したシャッフルファイルの提供を続けられるようにする。",
      "Driverを置き換え、すべての後続タスクをスケジュールする。",
      "Executorが終了する前に、すべての出力レコードをメタストアにコピーする。"
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
    "stem": "あるステージでは大半のタスクが完了していますが、1つだけ他のタスクより大幅に遅れています。投機実行が有効で、その遅いタスクは設定された投機実行の条件をすべて満たしています。タスクの失敗は報告されていません。Sparkが行える対処はどれですか？",
    "options": [
      "アプリケーション内の完了済みタスクをすべて再実行する。",
      "Driverプロセスを遅いExecutorに移動する。",
      "遅いタスクの入力レコードをNULLに変更してステージを完了する。",
      "別の利用可能なExecutor上で、遅いタスクの別の実行試行を開始する。"
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
    "stem": "バッチアプリケーションでspark.task.maxFailuresを3に設定しています。ある1つのタスクが、途中で成功することなく、3回連続で失敗しました。いずれも通常カウントされるタスクの失敗であり、他の再試行ポリシーによる上書きはありません。この設定は何を意味しますか？",
    "options": [
      "Driverが動作している限り、そのタスクを無期限に再試行する。",
      "3回連続の失敗で、そのタスクに設定した失敗回数の上限に達し、Sparkはジョブを断念する。",
      "すべてのタスクの失敗回数を合計し、その合計が3で割り切れるかどうかだけを確認する。",
      "初回の実行後に3回の再試行を許可するため、必ず4回目の実行が開始される。"
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
    "stem": "あるサービスは、同じSparkContextに対し、別々のスレッドから、時間のかかるバッチアクションと短い対話的なアクションを投入します。デフォルトのFIFOスケジューラーでは、長いジョブが利用可能な実行枠をすべて占有し、短いジョブが待たされることがあります。並行するジョブにアプリケーションのリソースを分けたいと考えています。この要件に対応するスケジューリングモードはどれですか？",
    "options": [
      "spark.task.maxFailuresを1にする。",
      "すべての短いジョブを、長いジョブ内の別ステージに変更する。",
      "アクションをすべて無効にし、変換だけを実行する。",
      "SparkContext内でFAIRスケジューリングを使用する。"
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
    "stem": "エンジニアは、1台のWorkerマシン上で2つのExecutorプロセスの識別子を確認しました。どちらも同じアプリケーションに属し、クラスターマネージャーは両方に十分なCPUとメモリを割り当てています。妥当な結論はどれですか？",
    "options": [
      "これは有効な構成になり得る。WorkerはExecutorプロセスを配置できるマシンであり、ExecutorとWorkerノードは同じものではない。",
      "Sparkは2つのExecutorのヒープを、1つの共有JVMヒープに統合しなければならない。",
      "両方のプロセス識別子が、必ずDriverを指している。",
      "Workerには複数のExecutorを配置できないため、このアプリケーションは必ずローカルモードである。"
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
    "stem": "長時間動作するアプリケーションが、1つのSparkContextを維持し、1時間にわたって複数の独立したアクションを投入します。動的割り当ては無効で、Executorの故障も発生していません。アクションが終わるたびに、新しいアプリケーションと新しいExecutor一式を作成する必要がありますか？",
    "options": [
      "不要。同じアプリケーションとExecutorプロセスで、SparkContextが動作している間、複数のアクションのタスクを実行できる。",
      "不要。それ以降のすべてのアクションは、クラスターマネージャーのプロセス内だけで実行される。",
      "必要。アクションごとに異なるSparkContextが必要である。",
      "必要。Executorは1つのタスクのためだけに存在し、その終了後には必ず破棄される。"
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
    "stem": "開発者は、リモートで分散実行するPySparkアプリケーションで、レコードを確認するためにrdd.foreach(print)を使います。アクションは成功しましたが、レコードはDriverのコンソールに表示されません。Workerの出力が、そのコンソールへ自動集約されないものとします。最も直接的な理由はどれですか？",
    "options": [
      "関数はExecutorのタスク内で実行されるため、出力先はDriverの標準出力ではなく、Executor側の標準出力になる。",
      "パーティションが複数あると、Driverの標準出力が無効になる。",
      "データがキャッシュされていると、foreachはすべての関数呼び出しを黙って破棄する。",
      "print関数はSQLクエリに変換され、その結果がメタストアに格納される。"
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
    "stem": "PySparkアプリケーションは、タスク関数内でpricing_rulesという独自の純Pythonパッケージをインポートします。このパッケージは投入元のマシンにはインストールされていますが、どのExecutorにもありません。エンジニアはパッケージを含むpricing_rules.zipを持っており、アプリケーションとともに配布したいと考えています。適切なspark-submitオプションはどれですか？",
    "options": [
      "--executor-cores pricing_rules.zip",
      "--py-files pricing_rules.zip",
      "--driver-memory pricing_rules.zip",
      "--name pricing_rules.zip"
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
    "stem": "サーバーは、同じSparkContextを使いながら、一時ビューとセッションのSQL設定を分離した2つのSpark SQLセッションを必要としています。second = spark.newSession()を呼び出しました。secondを正しく説明しているのはどれですか？",
    "options": [
      "sparkを永久に停止し、そのDriverプロセスをExecutorに移動する。",
      "すべての一時ビューとSQL設定の変更をsparkと共有する。",
      "新しい独立したSparkContextと、完全に別のクラスターリソース割り当てを持つ。",
      "SQL設定、一時ビュー、UDFの登録状態は別々だが、SparkContextとテーブルキャッシュは共有する。"
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
    "stem": "レポート作成ジョブは、ブロックされていない顧客を抽出します。customers.idはすべて非NULLですが、blocked.idにはNULLが含まれる場合があります。現在の条件はid NOT IN (SELECT id FROM blocked)であり、想定に反して1行も返されません。NOT INを使い、ブロックされていないすべての顧客を残す必要があります。Spark SQLでの正しい置き換えはどれですか？",
    "options": [
      "id NOT IN (SELECT COALESCE(id, customers.id) FROM blocked)",
      "id NOT IN (SELECT id FROM blocked WHERE id IS NOT NULL)",
      "id IN (SELECT id FROM blocked WHERE id IS NOT NULL)",
      "id NOT IN (SELECT id FROM blocked) OR id IS NULL"
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
    "stem": "ordersテーブルにはregion、status、amountがあります。アナリストは、完了した注文のamount合計が50000を超える地域について、地域ごとに1行を取得する必要があります。保留中の注文は合計に含めてはいけません。Spark SQLで、両方のフィルターを適切な段階で適用するクエリはどれですか？",
    "options": [
      "SELECT region, SUM(amount) AS total FROM orders WHERE status = 'complete' GROUP BY region HAVING SUM(amount) > 50000",
      "SELECT region, SUM(amount) AS total FROM orders WHERE SUM(amount) > 50000 GROUP BY region HAVING status = 'complete'",
      "SELECT region, SUM(amount) AS total FROM orders WHERE status = 'complete' AND amount > 50000 GROUP BY region",
      "SELECT region, SUM(amount) AS total FROM orders GROUP BY region, status HAVING SUM(amount) > 50000"
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
    "stem": "バッチクエリでSUM(amount) OVER (PARTITION BY account ORDER BY day RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)を使い、累計を計算します。あるaccountの行は、(day=1, amount=10)、(day=1, amount=20)、(day=2, amount=5)です。すべての値は非NULLです。この3行に付く合計値は、それぞれどれですか？",
    "options": [
      "10, 30, 35",
      "10, 20, 5",
      "30, 30, 35",
      "35, 35, 35"
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
    "stem": "給与レポートでは、部署ごとに、重複を除いた給与水準の上位2段階に該当する従業員をすべて残す必要があります。同額の従業員を残すため、部署によっては2人を超える結果になります。給与はすべて非NULLです。外側のクエリでlevel_no <= 2に絞り込む前に、サブクエリでlevel_noを計算する式はどれですか？",
    "options": [
      "ROW_NUMBER() OVER (PARTITION BY department ORDER BY salary DESC)",
      "NTILE(2) OVER (PARTITION BY department ORDER BY salary DESC)",
      "DENSE_RANK() OVER (PARTITION BY department ORDER BY salary DESC)",
      "RANK() OVER (PARTITION BY department ORDER BY salary DESC)"
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
    "stem": "台帳にはaccount、seq、balanceがあります。各account内でseqは一意で、すべての列は非NULLです。各出力行に、そのaccount内でseqが最大の行のbalanceを付ける必要があります。LAST_VALUEが現在行で止まらずaccount全体を調べることを保証するウィンドウ式はどれですか？",
    "options": [
      "LAST_VALUE(balance) OVER (PARTITION BY account ORDER BY seq ROWS BETWEEN CURRENT ROW AND CURRENT ROW)",
      "LAST_VALUE(balance) OVER (ORDER BY seq ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING)",
      "LAST_VALUE(balance) OVER (PARTITION BY account ORDER BY seq ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)",
      "LAST_VALUE(balance) OVER (PARTITION BY account ORDER BY seq ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING)"
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
    "stem": "センサーレポートでLAG(reading, 1, -1) OVER (PARTITION BY sensor ORDER BY seq)を使用します。あるsensorには一意なseq値1、2、3があり、readingはそれぞれ8、NULL、12です。デフォルトのRESPECT NULLSの動作を使用します。この式はseq順にどの値を返しますか？",
    "options": [
      "-1, 8, NULL",
      "-1, 8, 8",
      "-1, 8, -1",
      "NULL, 8, NULL"
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
    "stem": "ダッシュボードには、shopごとに1行、全注文の件数、支払済み注文だけのamountの合計が必要です。ordersテーブルには未払い注文も含まれる場合があります。未払い注文を全体件数には残し、支払済み金額の合計からだけ除外するクエリはどれですか？ 各shopには少なくとも1件の支払済み注文があるものとします。",
    "options": [
      "SELECT shop, COUNT(*) AS all_n, SUM(amount) AS paid_total FROM orders WHERE status = 'paid' GROUP BY shop",
      "SELECT shop, COUNT(status = 'paid') AS all_n, SUM(amount) AS paid_total FROM orders GROUP BY shop",
      "SELECT shop, COUNT(*) AS all_n, SUM(amount) FILTER (WHERE status = 'paid') AS paid_total FROM orders GROUP BY shop",
      "SELECT shop, COUNT(*) AS all_n, SUM(amount) AS paid_total FROM orders GROUP BY shop HAVING status = 'paid'"
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
    "stem": "アナリストはSELECT COUNT(DISTINCT customer_id, channel) AS n FROM touchpointsを実行します。入力の組は(1,'web')、(1,'web')、(1,NULL)、(2,'app')、(NULL,'app')です。Apache Spark 3.5.6では、いくつが返されますか？ この問題は2引数のCOUNT式を対象とし、structに対するCOUNTではありません。",
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
    "stem": "salesテーブルのregionには、実際のデータとしてNULLが含まれています。レポートでGROUP BY ROLLUP(region)を使用すると、実際のNULL地域のグループと、regionが同じくNULLとなる総計行の両方が生成されます。実際のNULLは維持し、総計だけを'ALL'と表示する必要があります。SELECT句のregionをどの式に置き換えるべきですか？",
    "options": [
      "CASE WHEN GROUPING(region) = 1 THEN 'ALL' ELSE region END",
      "COALESCE(region, 'ALL')",
      "CASE WHEN region IS NULL THEN 'ALL' ELSE region END",
      "CASE WHEN GROUPING(region) = 0 THEN 'ALL' ELSE region END"
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
    "stem": "2つの監査用抽出データのスキーマは同一です。同じ行が各抽出データ内に繰り返し現れることも、両方の抽出データに存在することもあります。繰り返し発生したイベントを調査しているため、結合後の監査データでは出現回数をすべて維持する必要があります。列の調整は不要です。重複した出現を削除せず、この要件を満たすSpark SQLの操作はどれですか？",
    "options": [
      "SELECT * FROM audit_a UNION SELECT * FROM audit_b",
      "SELECT * FROM audit_a UNION ALL SELECT * FROM audit_b",
      "SELECT DISTINCT * FROM (SELECT * FROM audit_a UNION ALL SELECT * FROM audit_b) t",
      "SELECT * FROM audit_a INTERSECT ALL SELECT * FROM audit_b"
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
    "stem": "在庫の照合に多重集合（bag）の考え方を使います。右側の入力の各出現は、左側の等しい値の出現を1つ相殺します。1列の左入力にはx、x、x、yがあり、右入力にはx、xがあります。Spark SQLでSELECT item FROM left_input EXCEPT ALL SELECT item FROM right_inputを実行した後、どの行が残りますか？",
    "options": [
      "xが3行、yが1行。",
      "xが1行、yが1行。",
      "yだけ。",
      "xが2行、yが1行。"
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
    "stem": "照合処理で、NULLになり得るkeyを使いincomingとreferenceを結合します。業務ルールでは2つのNULLキーを等しいと見なしますが、NULLキーを非NULLキーに一致させてはいけません。キーの重複は許可され、通常の結合による行の増加も許容されます。NULLを特別な代替値に置き換えず、この等価ルールを正確に実装するSpark SQLのON条件はどれですか？",
    "options": [
      "incoming.key IS NULL OR reference.key IS NULL",
      "incoming.key = reference.key",
      "incoming.key <=> reference.key",
      "COALESCE(incoming.key, 0) = COALESCE(reference.key, 0)"
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
    "stem": "レポートには、すべての顧客と、その顧客の支払済み請求書の金額を表示する必要があります。支払済み請求書がない顧客は、未払い請求書があっても、請求金額をNULLとして残さなければなりません。これらの顧客を維持するSpark SQLクエリはどれですか？ invoices.customer_idはcustomers.idを参照し、支払済み請求書が複数あれば複数行になってよいものとします。",
    "options": [
      "SELECT c.id, i.amount FROM customers c INNER JOIN invoices i ON c.id = i.customer_id AND i.status = 'paid'",
      "SELECT c.id, i.amount FROM customers c LEFT JOIN invoices i ON c.id = i.customer_id WHERE i.status = 'paid' OR i.customer_id IS NULL",
      "SELECT c.id, i.amount FROM customers c LEFT JOIN invoices i ON c.id = i.customer_id AND i.status = 'paid'",
      "SELECT c.id, i.amount FROM customers c LEFT JOIN invoices i ON c.id = i.customer_id WHERE i.status = 'paid'"
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
    "stem": "CSVのスキーマをid INT, name STRINGと明示的に定義しています。供給元はカンマ区切りを維持したまま、誤ってヘッダーをname,idの順に逆転させました。パイプラインではheader=true、spark.sql.caseSensitive=trueを使用します。位置だけでスキーマを黙って適用するのではなく、列位置の不一致を拒否する必要があります。Spark 3.5.6で設定すべきCSVオプションはどれですか？",
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
    "stem": "ノートブックでspark.sql(\"WITH recent AS (SELECT * FROM events WHERE event_date = DATE '2026-10-01') SELECT COUNT(*) FROM recent\")を実行すると成功します。しかし別のspark.sql呼び出しでSELECT * FROM recentを実行すると、recentというテーブルもビューも存在しないため失敗します。SparkSessionは開いたままです。この動作を正しく説明しているのはどれですか？",
    "options": [
      "CTE名の有効範囲はそのSQL文内であり、セッションのビューとしては登録されない。",
      "最初のクエリでcollect()を実行すれば、CTEが永続テーブルになる。",
      "すべてのCTEはglobal_tempデータベースに格納されるため、その接頭辞が必要である。",
      "SparkSessionを停止して再起動した後でのみ、CTEを利用できる。"
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
    "stem": "analytics.shipmentsというParquetテーブルがSparkにキャッシュされています。外部プロセスが、スキーマの変更やカタログへのパーティション追加をせず、既存の同じテーブル保存先でファイルを置き換えました。テーブル定義は維持しながら、その後のクエリが古いキャッシュデータとメタデータを無効化する必要があります。この更新を直接要求するSpark SQL文はどれですか？",
    "options": [
      "REFRESH TABLE analytics.shipments",
      "ANALYZE TABLE analytics.shipments COMPUTE STATISTICS",
      "DESCRIBE TABLE analytics.shipments",
      "DROP TABLE analytics.shipments"
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
    "stem": "エンジニアは、カタログに登録されたデータソーステーブルanalytics.clicksを引き継ぎました。取り込みジョブを変更する前に、列に加え、保存先とプロバイダーを確認する必要があります。テーブル全行の走査やデータ変更をせず、既存のカタログオブジェクトを調べるコマンドでなければなりません。使用すべき文はどれですか？",
    "options": [
      "REFRESH TABLE analytics.clicks",
      "DESCRIBE TABLE EXTENDED analytics.clicks",
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
    "stem": "reportingというデータベースには、永続テーブルsales_daily、sales_monthly、archive_2025、usersがあります。一時ビューはありません。エンジニアはデータをクエリせず、salesまたはarchiveで始まるテーブル名をカタログから一覧取得したいと考えています。SHOW TABLESの照合構文を正しく使うSpark SQLコマンドはどれですか？",
    "options": [
      "DESCRIBE TABLE reporting.sales*",
      "SHOW TABLES IN reporting WHERE tableName LIKE 'sales%' OR tableName LIKE 'archive%'",
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
    "stem": "供給元から、ヘッダーを持ち、テキストフィールドが正しく引用符で囲まれたカンマ区切りファイルが届きます。引用符で囲まれた1つのコメントに改行が含まれる場合があるため、1つの論理レコードが物理的に2行にまたがることがあります。区切り文字、引用符文字、スキーマはすでに正しく設定されています。ファイル全体を1つのテキスト値として扱うことなく、分割されたレコードに対応するCSV読み込みオプションはどれですか？",
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
    "stem": "Apache Spark 3.5.6の組み込みセッションカタログで、エンジニアはCREATE TABLE raw.orders USING PARQUET LOCATION '/shared/orders'を実行し、既存のParquetファイルを登録します。カタログのメタデータで、テーブル種別はEXTERNALと確認されています。その後、PURGEも独自の削除フックも使わず、DROP TABLE raw.ordersを実行します。カタログの登録とParquetファイルはどうなりますか？",
    "options": [
      "カタログの登録は残るが、Parquetファイルは削除される。",
      "カタログの登録は削除されるが、Parquetファイルは/shared/ordersに残る。",
      "カタログの登録とParquetファイルの両方が削除される。",
      "外部テーブルは削除できないため、DROP TABLEは失敗する。"
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
    "stem": "PostgreSQLのJDBC読み込みでは、URL、認証情報、numPartitions、lowerBound、upperBoundがすでに設定されています。さらに、queryをSELECT order_id, amount FROM source_orders WHERE status = 'paid'、partitionColumnをorder_idに設定すると、Sparkはこの組み合わせを拒否します。データ元でのフィルタリングとパーティション分割した読み込みの両方を維持する必要があります。Spark 3.5.6でサポートされる変更はどれですか？",
    "options": [
      "queryを残し、dbtable='source_orders'を追加する。partitionColumn='order_id'も維持する。",
      "queryを残し、dbtableのサブクエリを追加せず、partitionColumnだけを'p.order_id'に置き換える。",
      "queryを削除し、dbtableを(SELECT order_id, amount FROM source_orders WHERE status = 'paid') p、partitionColumnをp.order_idに設定する。",
      "partitionColumn、lowerBound、upperBoundを削除し、queryだけを残す。"
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
    "stem": "JDBC読み込みは、すでに許容範囲内の固定数のデータベース接続を使用しています。監視の結果、JDBCドライバーが1回に数行しか取得しておらず、ネットワークの往復が多く発生していることが分かりました。データベースとExecutorは、より大きな結果のバッチを処理できます。並列接続数を増やさず、1回の取得行数を増やしたいと考えています。この動作を直接制御するSpark JDBCの読み込みオプションはどれですか？",
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
    "stem": "/warehouse/clicks/day=2026-10-01内のParquetファイルには、user_idとevent_typeしか含まれていません。dayの値はディレクトリ名だけに表現されています。エンジニアはその日のディレクトリだけを読み込みますが、dayも検出されたパーティション列として必要です。再帰的なファイル検索は無効です。入力パスをそのディレクトリに限定しながら、パーティション列を維持する読み込みオプションはどれですか？",
    "options": [
      "option('mergeSchema', 'true')",
      "option('basePath', '/warehouse/clicks')",
      "option('recursiveFileLookup', 'true')",
      "option('inferSchema', 'true')"
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
    "stem": "商品テーブルには、非NULLのSTRING列codeがあります。アナリストは、文字そのものとしてのA_で始まり、その後に任意の接尾部が続くコードを選択する必要があります。接尾部が空でも対象です。アンダースコアを任意の1文字に一致させてはいけません。この要件を満たすSpark SQLの条件はどれですか？",
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
    "stem": "レポートでは、NULLになり得るINT型のscoreを、次のSpark SQL式で分類します。CASE WHEN score IS NULL THEN 'missing' WHEN score >= 80 THEN 'high' WHEN score >= 50 THEN 'pass' ELSE 'low' END。scoreがそれぞれNULL、90、60、40の場合、どのラベルが返されますか？",
    "options": [
      "missing, pass, pass, low",
      "low, high, pass, low",
      "missing, high, pass, low",
      "NULL, high, pass, low"
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
    "stem": "Spark 3.5.6のセッションでspark.sql.ansi.enabled=trueに設定されています。STRING列raw_idには、有効な整数の文字列と、'bad'のような不正な値が含まれています。他のすべての操作ではANSIモードを有効のまま維持し、有効な値はINTに変換し、不正な値はNULLとして返す必要があります。使用すべきSQL式はどれですか？",
    "options": [
      "CAST(raw_id AS INT)",
      "COALESCE(CAST(raw_id AS INT), 0)",
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
    "stem": "開発者は、列名と整数型は同じですが、列の順番が異なる2つのDataFrameを受け取りました。Spark 3.5.6で次のコードを実行します。\n\n```python\nleft = spark.createDataFrame([(1, 10)], \"a INT, b INT\")\nright = spark.createDataFrame([(20, 2)], \"b INT, a INT\")\np = left.union(right)\nq = left.unionByName(right)\n```\n\n行の順序は無視し、どちらの結果も列(a, b)として解釈した場合、rightから追加される行は、pとqでそれぞれどうなりますか？",
    "options": [
      "列の順序が異なるため、どちらの操作も失敗する。",
      "p: (20, 2); q: (2, 20)",
      "p: (2, 20); q: (20, 2)",
      "p: (2, 20); q: (2, 20)"
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
    "stem": "バッチDataFrameには、注文ごとに1行があります。品目IDを持たない注文もありますが、下流の監査では、それらの注文をitemがNULLの行として残す必要があります。入力と変換は次のとおりです。\n\n```python\ndf = spark.createDataFrame(\n    [(101, [7, 8]), (102, []), (103, None)],\n    \"order_id INT, items ARRAY<INT>\"\n)\nresult = df.select(\"order_id\", F.explode_outer(\"items\").alias(\"item\"))\n```\n\nFをpyspark.sql.functionsとすると、resultの説明として正しいものはどれですか？",
    "options": [
      "空配列とNULL配列を同時には処理できないため、変換は失敗する。",
      "2行。注文102と103は削除される。",
      "3行。注文102は削除されるが、注文103はitemがNULLの行になる。",
      "4行。注文101は2行になり、注文102と103はそれぞれitemがNULLの行になる。"
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
    "stem": "アプリケーションは、空でない配列から、行へ展開することなく最初と最後のラベルを取り出す必要があります。開発者は次のコードを書きます。\n\n```python\ndf = spark.createDataFrame([([\"red\", \"blue\", \"green\"],)], \"labels ARRAY<STRING>\")\nresult = df.select(\n    F.element_at(\"labels\", 1).alias(\"first\"),\n    F.element_at(\"labels\", -1).alias(\"last\")\n)\n```\n\nSpark 3.5.6を使用し、Fはpyspark.sql.functionsとします。1行だけの出力の(first, last)には、どの値が入りますか？",
    "options": [
      "element_atは負の配列インデックスを許可しないため、クエリは失敗する。",
      "(\"red\", NULL)",
      "(\"blue\", \"green\")",
      "(\"red\", \"green\")"
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
    "stem": "DataFrameでは、ステータスコードをmap列に保存しています。開発者は、保存されている0と、キーが存在しない場合を区別する必要があります。mapに含まれるのは、次に示す2つの要素だけです。\n\n```python\ndf = spark.createDataFrame(\n    [({\"active\": 0, \"archived\": 1},)],\n    \"flags MAP<STRING, INT>\"\n)\nresult = df.select(\n    F.element_at(\"flags\", F.lit(\"active\")).alias(\"a\"),\n    F.element_at(\"flags\", F.lit(\"missing\")).alias(\"b\")\n)\n```\n\nSpark 3.5.6で、出力行(a, b)の値はどうなりますか？",
    "options": [
      "(0, NULL)",
      "(NULL, NULL)",
      "2つ目のキーが存在しないため、クエリは失敗する。",
      "(0, 0)"
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
    "stem": "開発者は、入力1行につき出力1行を維持し、欠損した測定値の位置も維持しながら、配列内の各測定値に2を加える必要があります。組み込みの高階関数を使用します。\n\n```python\ndf = spark.createDataFrame([([10, None, 30],)], \"values ARRAY<INT>\")\nresult = df.select(F.transform(\"values\", lambda x: x + F.lit(2)).alias(\"adjusted\"))\n```\n\nFはpyspark.sql.functionsであり、Python UDFは使用していません。どの出力が生成されますか？",
    "options": [
      "スカラー値12と32を含む2行。",
      "[12, 2, 32]を含む1行。",
      "[12, NULL, 32]を含む1行。",
      "[12, 32]を含む1行。"
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
    "stem": "orders DataFrameには、cityとpostal_codeというフィールドを持つstruct列shippingがあります。入力のstructはすべて非NULLです。各行の既存のcityを維持し、郵便番号だけを修正する必要があります。開発者は次のコードを実行します。\n\n```python\nresult = orders.withColumn(\n    \"shipping\",\n    F.col(\"shipping\").withField(\"postal_code\", F.lit(\"104-0001\"))\n)\n```\n\n入力のshippingが{city: \"Tokyo\", postal_code: \"OLD\"}の場合、Spark 3.5.6での正しい出力構造はどれですか？",
    "options": [
      "shippingは{city: NULL, postal_code: \"104-0001\"}になる。",
      "最上位にpostal_code列が追加され、shippingは変更されない。",
      "shippingは{city: \"Tokyo\", postal_code: \"104-0001\"}になる。",
      "shippingは文字列\"104-0001\"になり、cityは削除される。"
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
    "stem": "2つのDataFrameのスキーマはleft(id INT, amount INT)とright(id INT, category STRING)です。どちらにも、一致する非NULLのIDが含まれています。開発者は次の内部結合を比較します。\n\n```python\nby_name = left.join(right, \"id\", \"inner\")\nby_expr = left.join(right, left.id == right.id, \"inner\")\n```\n\nこの後に列の選択や削除は行いません。Spark 3.5.6で、by_nameとby_exprには、idという名前の列がそれぞれ何個含まれますか？",
    "options": [
      "どちらも1個。",
      "by_nameは2個、by_exprは1個。",
      "by_nameは1個、by_exprは2個。",
      "どちらも2個。"
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
    "stem": "開発者は、参照DataFrameにIDが存在する入力元の行をすべて残す必要があります。参照側の列を追加したり、参照側の重複によって行を増やしたりしてはいけません。\n\n```python\nsource = spark.createDataFrame([(1, \"a\"), (1, \"b\"), (2, \"c\")], \"id INT, tag STRING\")\nreference = spark.createDataFrame([(1,), (1,)], \"id INT\")\nresult = source.join(reference, \"id\", \"left_semi\")\n```\n\n行の順序を無視すると、Spark 3.5.6でresultにはどの行と列が含まれますか？",
    "options": [
      "2行：(1, \"a\")、(1, \"b\")。列はidとtag。",
      "3行：(1, \"a\")、(1, \"b\")、(2, \"c\")。列はidとtag。",
      "1行：(1, \"a\")。列はidとtag。",
      "4行：(1, \"a\")が2回、(1, \"b\")が2回。列はidとtag。"
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
    "stem": "日次の取り込みジョブでは、レコードが1件も届かない場合があります。それでもレポート用コードは1行の集計結果を出力する必要があります。開発者は、欠損した合計値の表示方法を決める前に、結果の値を知りたいと考えています。\n\n```python\nempty = spark.createDataFrame([], \"amount DOUBLE\")\nsummary = empty.agg(\n    F.count(\"*\").alias(\"row_count\"),\n    F.sum(\"amount\").alias(\"total\")\n)\n```\n\ngroupByのキーや、NULLを置き換える関数は使用しません。Spark 3.5.6でsummaryには何が含まれますか？",
    "options": [
      "(row_count=0, total=NULL)の1行。",
      "(row_count=NULL, total=NULL)の1行。",
      "入力が空なので、0行。",
      "(row_count=0, total=0.0)の1行。"
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
    "stem": "データ元は、位置で対応するコードとラベルを別々の配列に保存しています。ラベルの配列の方が短い場合もありますが、すべてのコードについて、統合後の配列内での位置を維持する必要があります。開発者は次のコードを実行します。\n\n```python\ndf = spark.createDataFrame([([4, 5, 6], [\"x\"],)], \"codes ARRAY<INT>, labels ARRAY<STRING>\")\nresult = df.select(F.arrays_zip(\"codes\", \"labels\").alias(\"pairs\"))\n```\n\n結果の各structを(codes, labels)と表したとき、Spark 3.5.6のpairsにはどの値が入りますか？",
    "options": [
      "入力配列の長さが異なるためNULL。",
      "[(4, \"x\")]",
      "[(4, \"x\"), (5, \"x\"), (6, \"x\")]",
      "[(4, \"x\"), (5, NULL), (6, NULL)]"
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
    "stem": "価格のDataFrameには、整数列preferredとbackupがあります。preferredの価格0は有効な値であり、欠損として扱ってはいけません。次の計算を行います。\n\n```python\nresult = df.select(\n    \"id\",\n    F.coalesce(\"preferred\", \"backup\", F.lit(-1)).alias(\"price\")\n)\n```\n\n入力行を(id, preferred, backup)と表すと、(1, NULL, 80)、(2, 0, 90)、(3, NULL, NULL)です。ID順に並べた場合、priceの値はどの順になりますか？",
    "options": [
      "80, 90, 0",
      "NULL, 0, NULL",
      "80, 90, -1",
      "80, 0, -1"
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
    "stem": "バッチDataFrame eventsには、account_id、event_ts、event_id、payloadがあります。キーと並べ替えに使う値はすべて非NULLで、各account内でevent_idは一意です。結果には、accountごとに完全な行をちょうど1行含める必要があります。event_tsが最新の行を選び、同じ時刻ならevent_idが最大の行を選びます。FとWindowはインポート済みとします。この要件を満たす式はどれですか？",
    "options": [
      "events.withColumn(\"rn\", F.row_number().over(Window.partitionBy(\"account_id\").orderBy(F.col(\"event_ts\").desc(), F.col(\"event_id\").desc()))).filter(\"rn = 1\").drop(\"rn\")",
      "events.groupBy(\"account_id\").agg(F.max(\"event_ts\"))",
      "events.dropDuplicates([\"account_id\"])",
      "events.withColumn(\"rn\", F.row_number().over(Window.partitionBy(\"account_id\").orderBy(F.col(\"event_ts\").asc(), F.col(\"event_id\").asc()))).filter(\"rn = 1\").drop(\"rn\")"
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
    "stem": "品質チェックで、通常の数値、IEEE NaN、SQL NULLが入り得るDoubleType列readingを調べます。NaNの場合だけtrueとなるBooleanフラグが必要です。通常の数値やSQL NULLをNaNとして判定してはいけません。pyspark.sql.functionsはFとしてインポート済みとします。どの式を選択すべきですか？",
    "options": [
      "F.col(\"reading\").isNull()",
      "F.col(\"reading\").isNotNull()",
      "F.isnan(\"reading\")",
      "~F.isnan(\"reading\")"
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
    "stem": "StringType列phoneには、\"+44 (20) 1234-AB56\"のような値が含まれています。下流システムは、すべてのASCII数字を元の順序で残し、英字を含むそれ以外の文字をすべて削除することを要求しています。UDFは使用できません。pyspark.sql.functionsはFとしてインポート済みとします。このような任意の文字列に対して要件を満たす式はどれですか？",
    "options": [
      "F.translate(\"phone\", \"+ ()-\", \"\")",
      "F.trim(\"phone\")",
      "F.regexp_extract(\"phone\", \"[0-9]+\", 0)",
      "F.regexp_replace(\"phone\", \"[^0-9]\", \"\")"
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
    "stem": "DataFrameには、StringType列site、zone、rackの3つがあります。非NULLの値を1つのハイフンで結び、NULLのフィールドとその区切りを省いたラベルが必要です。例えばsite=\"EU\"、zone=NULL、rack=\"R7\"なら、\"EU-R7\"にしなければなりません。Fはインポート済みとします。Python UDFを使わずに、この動作を実装する式はどれですか？",
    "options": [
      "F.concat_ws(\"-\", \"site\", \"zone\", \"rack\")",
      "F.concat_ws(\"-\", \"site\", F.coalesce(\"zone\", F.lit(\"\")), \"rack\")",
      "F.concat_ws(\"\", \"site\", \"zone\", \"rack\")",
      "F.concat(\"site\", F.lit(\"-\"), \"zone\", F.lit(\"-\"), \"rack\")"
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
    "stem": "バッチDataFrame inventoryには、非NULLの数値列priceとstockがあります。priceが100以上、かつstockが0より大きい行を残す必要があります。PythonのBooleanを評価するのではなく、PySparkのColumn条件式を作成しなければなりません。Fはインポート済みとします。両方の条件を正しく適用する式はどれですか？",
    "options": [
      "inventory.filter((F.col(\"price\") >= 100) or (F.col(\"stock\") > 0))",
      "inventory.filter((F.col(\"price\") >= 100) | (F.col(\"stock\") > 0))",
      "inventory.filter((F.col(\"price\") > 100) & (F.col(\"stock\") >= 0))",
      "inventory.filter((F.col(\"price\") >= 100) & (F.col(\"stock\") > 0))"
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
    "stem": "StringType列raw_timeには、\"25/10/2026 14:05:09\"という形式に厳密に従う有効なタイムスタンプが含まれています。結果は日付と時刻の両方を維持したTimestampType列にする必要があります。セッションはUTCを使用し、タイムゾーンの変換は不要です。pyspark.sql.functionsはFとしてインポート済みとします。正しい入力形式を指定する式はどれですか？",
    "options": [
      "F.date_format(\"raw_time\", \"dd/MM/yyyy HH:mm:ss\")",
      "F.to_date(\"raw_time\", \"dd/MM/yyyy\")",
      "F.to_timestamp(\"raw_time\", \"MM/dd/yyyy HH:mm:ss\")",
      "F.to_timestamp(\"raw_time\", \"dd/MM/yyyy HH:mm:ss\")"
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
    "stem": "DataFrameには、array<array<int>>型のchunks列があります。ある行のchunksは[[7, 8], NULL, [9]]です。このNULLは整数要素ではなく、欠損した部分配列を表します。NULLの部分配列をあらかじめ置換・削除せず、F.flatten(\"chunks\")を評価します。この行では、どの値が生成されますか？",
    "options": [
      "[7, 8, 9]",
      "[7, 8, NULL, 9]",
      "NULL",
      "[[7, 8], [9]]"
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
    "stem": "売上のDataFrameにはstore、channel、amountがあります。必要なchannelは\"web\"と\"shop\"だけです。結果はstoreごとに1行とし、金額合計を含むweb列とshop列を別々に持つ必要があります。また、既知のピボット値を明示的に指定したいと考えています。必要な結果を作る式はどれですか？",
    "options": [
      "sales.groupBy(\"channel\").pivot(\"store\", [\"web\", \"shop\"]).sum(\"amount\")",
      "sales.groupBy(\"store\").pivot(\"channel\", [\"web\", \"shop\"]).sum(\"amount\")",
      "sales.groupBy(\"store\", \"channel\").sum(\"amount\")",
      "sales.select(\"store\", \"web\", \"shop\").groupBy(\"store\").sum()"
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
    "stem": "DataFrame eventsにはevent_id列とStringTypeのpayload列があります。payloadの値の例は{\"sku\":\"P8\",\"qty\":3}です。event_idを維持し、skuをSTRING、qtyをINTとして解析したstruct列を追加する必要があります。入力はすでにDataFrameであり、JSONファイルのパスではありません。Fはインポート済みとします。適切な式はどれですか？",
    "options": [
      "events.withColumn(\"parsed\", F.col(\"payload\").cast(\"STRUCT<sku:STRING,qty:INT>\"))",
      "events.withColumn(\"parsed\", F.to_json(\"payload\"))",
      "spark.read.schema(\"sku STRING, qty INT\").json(\"payload\")",
      "events.withColumn(\"parsed\", F.from_json(\"payload\", \"sku STRING, qty INT\"))"
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
    "stem": "推薦データのDataFrameには、非NULLのarray<string>列preferredとavailableがあります。各配列には重複した値が含まれる場合があります。両方の配列に存在する値だけを、重複を取り除いて含む新しい配列が必要です。結果の配列の順序は問いません。pyspark.sql.functionsはFとしてインポート済みとします。この要件を満たす式はどれですか？",
    "options": [
      "F.array_except(\"preferred\", \"available\")",
      "F.concat(\"preferred\", \"available\")",
      "F.array_union(\"preferred\", \"available\")",
      "F.array_intersect(\"preferred\", \"available\")"
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
    "stem": "バッチジョブがcollect()の実行中に、シリアライズされたタスク結果がspark.driver.maxResultSizeを超えたというメッセージで中断しました。詳細な結果はDriverに収まらないほど大きいですが、アプリケーションがローカルに必要とするのは小さな集計結果だけで、詳細行は分散ストレージに保存してよいものとします。結果サイズの保護設定を維持しながら、この要件を最もよく満たす変更はどれですか？",
    "options": [
      "分散処理するDataFrameライターで詳細行を書き込み、小さな集計結果だけをcollectする。",
      "spark.executor.memoryを増やし、collect()はそのままにする。",
      "すべての詳細行をcollectする前に、結果全体をキャッシュする。",
      "spark.driver.maxResultSizeを0に設定し、すべての詳細行を引き続きcollectする。"
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
    "stem": "PySparkアプリケーションがYARNコンテナーで動作しています。JVMヒープの使用量は上限を十分下回っているのに、コンテナーの物理メモリ上限を超えたため、Executorが強制終了されます。ログでは、追加のメモリの大部分をPython Workerプロセスが使用しています。spark.executor.pyspark.memoryは未設定です。このJVM外のメモリをカバーするコンテナーの許容量を、最も直接的に増やす設定はどれですか？",
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
    "stem": "完了したソートのステージについて、Spark UIにはshuffle spill (memory)が600 MB、shuffle spill (disk)が90 MBと表示されています。すべてのタスクは成功し、出力の検証にも合格しています。エンジニアは、この差が510 MBのレコードの消失を示すと主張しています。これらの指標の正しい解釈はどれですか？",
    "options": [
      "これらはデシリアライズされたメモリ内のデータ量と、シリアライズされたディスク上のデータ量を表すため、サイズの差だけではレコード消失の証拠にならない。",
      "ディスク側の値が小さいことは、ソート中にSparkが重複レコードを削除した証拠である。",
      "メモリ側はDriverのヒープを測り、ディスク側は全Executorのローカルディスク容量を測っている。",
      "タスクのステータスが成功でも、ディスクへのスピルはソートのステージが失敗したことを意味する。"
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
    "stem": "DataFrameを繰り返し再利用するため、チームはSQLの列指向キャッシュを維持したいと考えています。Executorが、メモリ内の1つの列指向キャッシュバッチを構築中にメモリ不足になります。論理的なデータとクラスターの規模は変えられません。各キャッシュバッチにまとめる行数を直接減らす設定変更はどれですか？",
    "options": [
      "spark.sql.files.maxRecordsPerFileを増やす。",
      "spark.sql.inMemoryColumnarStorage.batchSizeを減らす。",
      "spark.sql.autoBroadcastJoinThresholdを増やす。",
      "spark.sql.inMemoryColumnarStorage.batchSizeを増やす。"
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
    "stem": "下流の読み込みシステムは、500000件を超えるレコードを含む出力データファイルを拒否します。Sparkのバッチ処理は、比較的均等な多数のパーティションからParquetを書き込みますが、一部のパーティションのレコード数はこの制限を超えています。正確なファイル数やバイトサイズの指定は不要です。全データを1つのパーティションに集めることなく、出力ファイルごとのレコード数を直接制限する設定はどれですか？",
    "options": [
      "spark.sql.files.maxPartitionBytes=500000",
      "spark.sql.files.openCostInBytes=500000",
      "spark.sql.files.maxRecordsPerFile=500000",
      "spark.sql.shuffle.partitions=500000"
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
    "stem": "Spark 3.5.6のバッチ処理で、/reportsのパーティション分割されたParquetデータソースを書き直します。replacement_dfには対象日の完全な置き換えデータが入っており、そのDataFrameに含まれる日以外の既存のdayパーティションは変更せずに残す必要があります。対象はV1のファイルデータソースであり、Hive SerDeテーブルやDeltaテーブルではありません。新しい行を受け取るパーティションだけを置き換えるライター設定はどれですか？",
    "options": [
      "replacement_df.write.mode('overwrite').option('partitionOverwriteMode', 'dynamic').partitionBy('day').parquet('/reports')",
      "replacement_df.write.mode('overwrite').option('partitionOverwriteMode', 'static').partitionBy('day').parquet('/reports')",
      "replacement_df.write.mode('append').partitionBy('day').parquet('/reports')",
      "replacement_df.write.mode('ignore').partitionBy('day').parquet('/reports')"
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
    "stem": "Hiveメタストアのテーブルで、データ更新後もカタログのサイズ統計が古いままです。オプティマイザーは結合計画時に現実的でないサイズを見積もります。結合戦略を強制する前に、すべての行の値を走査せず、テーブルのバイトサイズを再計算したいと考えています。Spark SQLで、この統計を直接収集するコマンドはどれですか？",
    "options": [
      "REFRESH TABLE warehouse.dimension",
      "DESCRIBE TABLE EXTENDED warehouse.dimension",
      "ANALYZE TABLE warehouse.dimension COMPUTE STATISTICS NOSCAN",
      "ANALYZE TABLE warehouse.dimension COMPUTE STATISTICS FOR ALL COLUMNS"
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
    "stem": "SQLの書き込み処理に、偏りの大きいクエリ結果が渡されます。エンジニアは、正確なファイル数は要求せず、極端に小さい出力パーティションや大きい出力パーティションを避けるためにREBALANCEヒントを追加します。しかしspark.sql.adaptive.enabledがfalseなので、ヒントに効果がありません。Spark 3.5.6がこのベストエフォートのヒントを考慮するために必要な変更はどれですか？",
    "options": [
      "AQEを無効のまま、spark.sql.shuffle.partitionsを1にする。",
      "そのクエリでspark.sql.adaptive.enabledを有効にする。",
      "出力全体に対し、REBALANCEをBROADCASTに置き換える。",
      "spark.sql.inMemoryColumnarStorage.compressedを無効にする。"
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
    "stem": "クエリは、それぞれイベント時刻のウォーターマークを持つ2つのストリーミング入力を結合します。ある時点で、入力ごとに計算されたウォーターマークは、一方が12:20、もう一方が12:05です。クエリはSparkの複数ウォーターマークに対するデフォルトのポリシーを使用しています。チームは、新しくデプロイするクエリでポリシーをmaxに変えることを検討しています。2つのポリシーの比較として正しい説明はどれですか？",
    "options": [
      "デフォルトの全体ウォーターマークは12:20であり、maxにすると12:05となって、遅い入力が保護される。",
      "デフォルトの全体ウォーターマークは12:05であり、maxにすると12:20まで進められるが、遅い入力のデータを破棄するリスクがある。",
      "最も速い入力だけが全体ウォーターマークに影響するため、どちらのポリシーでも常に12:20になる。",
      "どちらのポリシーも個別のウォーターマークを永久に維持し、全体ウォーターマークを求めることはない。"
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
    "stem": "1つのマイクロバッチクエリが、foreachBatchを使って外部データベースに結果を追記します。障害後に同じチェックポイントから再開すると、同じバッチがコールバックに再び渡される場合があります。データベースはトランザクションをサポートします。同じバッチの出力を重複してコミットしないようにする必要があります。この要件に対応する実装はどれですか？",
    "options": [
      "渡されたbatchIdを永続的な重複排除キーにし、出力とバッチ処理済みの印を、まとめて原子的にコミットする。",
      "outputMode(\"append\")を使用する。この設定だけで外部コールバックはすべてExactly-Onceになる。",
      "コールバックの呼び出しごとにランダムな新しい識別子を生成し、それぞれを新しいバッチとして扱う。",
      "処理済みのバッチIDを、Driverの再起動時に消去されるローカルなPythonのsetだけに保存する。"
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
    "stem": "コマンドラインのPySparkプログラムで、集計を行わず状態も持たないeventsというストリーミングDataFrameを定義します。このDataFrameはコンソールへのappend出力をサポートしています。行の書き込みを開始し、クエリの実行中はメインプログラムを待機させる必要があります。現時点ではwriter = events.writeStream.format(\"console\")を作成しただけで、クエリはまだ開始していません。実行を開始し、その後に終了を待つための正しい次のステップはどれですか？",
    "options": [
      "query = writer.start(); query.awaitTermination()",
      "query = writer; query.stop(); query.awaitTermination()",
      "writer.awaitTermination(); writer.start()",
      "events.collect(); writer.start()"
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
    "stem": "ストリーミングDataFrame eventsには新しい購入が含まれ、静的なDataFrame productsには商品説明が含まれます。静的DataFrameに商品IDが存在しない購入も含め、すべての購入を出力する必要があります。購入のない静的な商品を出力する必要はありません。Spark 3.5.6 Structured Streamingでのevents.join(products, \"product_id\", \"left_outer\")について、正しい説明はどれですか？",
    "options": [
      "一致しない購入を出力する前に、productsにウォーターマークを設定する必要がある。",
      "一致しない静的商品と一致しない購入の両方を出力するため、完全外部結合と同じになる。",
      "サポートされている状態を持たないストリーム・静的データの結合であり、events側の不一致行も、商品フィールドをNULLとして維持する。",
      "ストリームを含む外部結合では両側がストリーミングでなければならないため、サポートされない。"
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
    "stem": "広告のクエリは、表示イベントのストリームをクリックのストリームへ、広告IDだけを使って左外部結合しています。クリックを一致させるのは、そのイベント時刻が表示時刻から1時間後までの範囲内にある場合だけです。入力のイベント時刻とマイクロバッチの実行は継続して進んでいます。該当するクリックがもう到着し得ない場合、最終的にクリック側のフィールドをNULLとした表示イベントをSparkから出力したいと考えています。必要なイベント時刻の情報を提供する設計はどれですか？",
    "options": [
      "広告IDだけの等価結合を適用し、Executorメモリを増やす。",
      "ウォーターマークを使わず、等価結合の前に各ストリームをタイムスタンプで並べ替える。",
      "適切なイベント時刻のウォーターマークを追加し、結合条件に1時間のイベント時刻の範囲を含める。",
      "時間の制約を何も追加せず、outputMode(\"complete\")を使う。"
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
    "stem": "開発者は、バッチリーダーではCSVディレクトリを正常に読み込めますが、今度はspark.readStreamでそのディレクトリを監視したいと考えています。入力の列はorder_id INT、amount DOUBLEと分かっています。セッションではspark.sql.streaming.schemaInference=falseというデフォルト設定を維持します。ストリーミングのスキーマ推論を有効にせず、一貫したスキーマを指定する適切なリーダーはどれですか？",
    "options": [
      "spark.readStream.schema(\"order_id INT, amount DOUBLE\").option(\"header\", True).csv(path)",
      "spark.readStream.option(\"header\", True).csv(path)",
      "spark.readStream.option(\"inferSchema\", True).csv(path)を使い、スキーマの指定もセッション設定の変更も行わない。",
      "spark.readStream.option(\"header\", True).option(\"maxFilesPerTrigger\", 1).csv(path)"
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
    "stem": "状態を持つ集計が、spark.sql.shuffle.partitions=24と永続チェックポイントを使って正常に動作していました。チームはクエリを停止し、設定を48に変えて、同じチェックポイントから再起動する案を考えています。状態と処理済みのソースの進捗は維持する必要があります。Spark 3.5.6の文書化された制約によると、適切な対応はどれですか？",
    "options": [
      "outputModeをappendに変更する。これによって以前の状態のパーティション分割は関係なくなる。",
      "状態のパーティション数を既存チェックポイントと互換性のあるまま維持し、この状態付きクエリの再開時には設定を48へ変更しない。",
      "オフセットログのファイルだけを削除して残りのチェックポイントファイルを残し、新しい状態パーティション数をSparkに推論させる。",
      "チェックポイントからの復旧は制限なく既存の状態を自動的に再パーティション分割するため、48に変更する。"
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
    "stem": "定期実行するファイルストリーミングジョブでは、実行開始時に利用可能なすべてのファイルを処理してから、自動的に終了する必要があります。maxFilesPerTriggerが設定されているため、処理は複数のマイクロバッチに分かれる場合があります。ファイルソースはAvailableNowをサポートしています。この要件に最も適したwriteStreamのトリガーはどれですか？",
    "options": [
      ".trigger(processingTime='10 seconds')",
      ".trigger(availableNow=True)",
      ".trigger(continuous='1 second')",
      "トリガーを省略し、追加のファイルを無期限に待つようにする。"
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
    "stem": "queryという実行中のPySpark StreamingQueryが、少なくとも1つのマイクロバッチを完了しています。ストリームを停止せず、終了を待つこともなく、最後に完了したトリガーの入力行数と処理レートをPythonの辞書として取得したいと考えています。これらの進捗指標を提供するプロパティはどれですか？",
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
    "stem": "KafkaのStructured Streamingクエリには、有効な既存チェックポイントがあり、ソースのオフセットが保持されています。一部のレコードを処理した後、クエリを停止しました。同じ論理クエリを同じチェックポイントで再開しますが、startingOffsetsを'latest'から'earliest'へ変更します。Kafkaのデータは期限切れになっておらず、新しいパーティションも追加されていません。再開したクエリはどこから読み込みますか？",
    "options": [
      "startingOffsetsは常にチェックポイントより優先されるため、Kafkaに残っている最も古いレコードから。",
      "Kafkaの最新オフセットから読み込み、未処理レコードをすべて飛ばす。",
      "既存のチェックポイントに記録されたオフセットから。",
      "マイクロバッチごとにオフセット0から。"
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
    "stem": "本番のStructured Streamingクエリが、明示的なスキーマを使い、入力ディレクトリからJSONファイルを読み込みます。現在、上流システムはそのディレクトリ内のファイルに直接書き込んでいるため、Sparkが書き込み途中のファイルを検出する可能性があります。未完成のファイルをSparkが読まないようにする必要があります。ファイルソースで推奨される受け渡し方法はどれですか？",
    "options": [
      "入力ディレクトリ内の1つのファイルに、永久に追記し続ける。",
      "すでに処理済みのファイルを、同じ名前で繰り返し上書きする。",
      "maxFilesPerTriggerを1に減らす。これによって書き込み途中のファイルが完成する。",
      "各新規ファイルを監視対象ディレクトリの外で完全に書き終えてから、その操作をサポートするストレージの仕組みを使い、一意な名前で監視対象へ原子的に配置する。"
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
    "stem": "アナリストは、ノートPC上のSpark Connectクライアントを使い、数テラバイトのリモートテーブルを読み込みます。クライアントで、2列を選択して日付で絞り込むDataFrameの式を構築し、limit(10).collect()で小さな結果を取得します。クライアントからSpark Connectサーバーに送られる要求について、正しい説明はどれですか？",
    "options": [
      "クライアントは、まずリモートテーブル全体をダウンロードし、絞り込んだコピーをアップロードする。",
      "クライアントは、クエリをExecutorの機械語へ直接コンパイルし、パーティションごとに1つのバイナリーを送る。",
      "クライアントはPythonの変数名だけを送り、DriverがノートPCのプロセスメモリを読んで内容を取得する。",
      "クライアントはDataFrameの操作を未解決の論理計画として符号化し、サーバーがその計画を解決して実行する。"
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
    "stem": "開発者は、PythonのSpark ConnectクライアントとリモートのSparkサーバー間のネットワーク通信を調べています。サーバーはDataFrameクエリの実行を完了し、クライアントが結果行を受信しています。調べたいのは、クエリの送信時の表現ではなく、標準の転送方式と結果の表現です。Spark 3.5.6のSpark Connectについて、正しい説明はどれですか？",
    "options": [
      "結果は、クライアントプロセス内でExecutorのJVMオブジェクトを直接参照する形で共有される。",
      "結果はApache Arrowで符号化された行のバッチとして、gRPCを通じてストリーミング転送される。",
      "結果は、クエリ送信時と同じ未解決の論理計画として返される。",
      "結果は必ず1つのCSVファイルに書き込まれ、クライアントは共有ファイルシステムを通じて読む必要がある。"
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
    "stem": "2つのチームが、別々のSpark Connectクライアントプロセスから同じSparkサービスに接続します。クライアント側でのレポート整形にだけ使用するPythonライブラリについて、異なるバージョンが必要です。このライブラリはUDFやExecutorのタスクからは呼ばれません。また、一方のクライアントはローカルでメモリを多く使うレポート整形を行います。この状況で、クライアントとサーバーの分離から得られる利点はどれですか？",
    "options": [
      "両方の整形用ライブラリを、完全に同じバージョンでSpark DriverのPython環境にインストールしなければならない。",
      "クライアント側で確保したメモリは、自動的にSpark Executorのストレージメモリへ移される。",
      "各チームに、独立したExecutorリソースを持つ専用のSparkクラスターが自動的に与えられる。",
      "整形用ライブラリをDriverプロセスに入れずに、クライアントの依存関係とローカルのメモリ使用をチームごとに別プロセスへ分離できる。"
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
    "stem": "チームは、既存のPySpark DataFrameアプリケーションをSpark Connectへ移行する予定です。大半の変換はサポートされていますが、アプリケーションはあまり一般的でないDataFrameメソッドを1つ使用しています。従来の同一プロセス型のPySpark APIで使えるからといって、対象リリースのSpark Connectでも使えるとは仮定できません。代替手段を選んだり、移行テストを実行したりする前に、最初に行う最も確かな確認はどれですか？",
    "options": [
      "Spark Connectはすべてのメソッドをpandasに委譲するため、pandasでサポートされているかだけを確認する。",
      "対象リリースのAPIリファレンスを参照し、そのメソッドにSpark Connectのサポートが明示されているか確認する。",
      "クライアントマシンにJavaがインストールされているかだけを確認する。",
      "クラス名が同じなので、すべてのDataFrameメソッドがサポートされると仮定する。"
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
    "stem": "プラットフォームチームはSpark Connectサーバーを更新したいと考えていますが、デプロイ済みの複数のアプリケーションでは既存のクライアントリリースを使い続けます。クライアントとサーバーの分離により、アプリケーションの同時更新を減らせると期待していますが、展開前に互換性を確認します。Spark Connectの構成が持つ互換性の利点を得るために不可欠な条件はどれですか？",
    "options": [
      "gRPCがバージョンの制約をすべて取り除くため、クライアントはサーバーの対応を確認せず、将来のどんなRPCでも使用できる。",
      "既存のクライアントが使用するサーバー側のRPC定義で、後方互換性が維持されている必要がある。",
      "サーバーはすべてのアプリケーションをクライアントのPythonプロセス内で実行する必要がある。",
      "すべてのクライアントとサーバーで、1つのPython仮想環境を共有する必要がある。"
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
    "stem": "開発者はSpark Connectのクライアントパッケージをインストールし、SparkSession.builder.remote(\"sc://localhost:15002\")を設定しました。ローカルネットワークは正常ですが、ポート15002で待ち受けるプロセスがないため、接続が拒否されます。開発者は、リモートアドレスを設定すればSpark Connectサーバーも起動すると考えていました。最初に何をすべきですか？",
    "options": [
      "SPARK_REMOTEに同じアドレスを設定する。この環境変数がサーバーを自動起動する。",
      "すべてのサーバープロセスを停止したまま、sc://をhttps://に置き換える。",
      "対応するSparkの配布物とConnectパッケージを使ってSpark Connectサーバープロセスを起動し、その待ち受けアドレスにクライアントを接続する。",
      "どれかがポートで待ち受けるようになるまで、リモートのSparkSessionオブジェクトを追加作成する。"
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
    "stem": "Spark Connectクライアントでは、pricing_rulesという独自のPythonパッケージをインポートできます。あるPython UDFは関数本体内でこのパッケージをインポートしますが、クエリを実行すると、リモートのPython WorkerでModuleNotFoundErrorが発生します。クライアントの接続には成功しており、組み込み操作だけなら動作します。この失敗に対処する方法はどれですか？",
    "options": [
      "クライアントの仮想環境だけに、パッケージを再インストールする。",
      "サポートされている依存関係の配置方法を使い、UDFを実行するリモートのPython Workerでパッケージを利用可能にする。",
      "別のサーバーを起動せず、Spark Connectサーバーのアドレスをlocalhostに置き換える。",
      "クライアントのdriver-memory設定だけを増やす。WorkerでのPythonのインポートはそのメモリを使用するため。"
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
    "stem": "スカラーPandas UDFで、測定値がNULLの行も含め、入力1行につき1つの結果を維持しながら、各測定値を2倍にする必要があります。開発者は次のコードを書きます。\n\n```python\n@F.pandas_udf(\"double\")\ndef twice(s: pd.Series) -> pd.Series:\n    return s.dropna() * 2\n```\n\n入力のArrowバッチには[1.0, NULL, 3.0]が含まれています。PandasとPyArrowは正しくインストールされています。必要な行数を維持し、スカラーUDFの仕様を満たす変更はどれですか？",
    "options": [
      "Sparkが短い出力Seriesを受け入れるよう、戻り値の型を削除する。",
      "s * 2を返し、入力Seriesの長さと欠損値の位置を維持する。",
      "スカラーPandas UDFは任意の行数を返せるため、dropna()を残す。",
      "pd.Series([s.sum() * 2])を返す。Sparkが1つのスカラー結果をすべての入力行に自動的に配る。"
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
    "stem": "ジョブは、顧客ごとの独自計算のためにdf.groupBy(\"customer_id\").applyInPandas(...)を使用しています。大半の顧客は数行ですが、ある1人の顧客には数百万行あります。その顧客のグループを処理する際、Python Workerでジョブが失敗します。spark.sql.execution.arrow.maxRecordsPerBatchを小さくしても解決しません。Spark 3.5.6で、関係するメモリ上の処理単位を最もよく説明しているのはどれですか？",
    "options": [
      "applyInPandasは、常に入力DataFrame全体をDriverに集める。",
      "関数のためにグループ全体がメモリに読み込まれ、maxRecordsPerBatchはそのグループ内の行数を制限しない。",
      "この設定により、各グループは必ず小さな独立した関数呼び出しに分割されるので、失敗はグループサイズと無関係である。",
      "各グループは1行ずつ処理されるため、Workerのメモリに影響するのは1行のサイズだけである。"
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
    "stem": "開発者は、Spark DataFrameからローカルのpandas DataFrameへの変換を調べるため、spark.sql.execution.arrow.pyspark.enabledを無効にしました。同じアプリケーションには有効なスカラーPandas UDFが定義されており、必要なノードには互換性のあるpandasとPyArrowがインストールされています。開発者は、この設定によってPandas UDFも、1行ずつ処理する標準のPython UDFに変わると結論付けました。正しい説明はどれですか？",
    "options": [
      "この設定はtoPandas/createDataFrameの変換でのArrow最適化を制御するものであり、明示的に定義したPandas UDFを通常のPython UDFに変えるものではない。",
      "この設定は、すべてのPandas UDFから宣言済みのSparkの戻り値の型を削除する。",
      "依存関係が正しくインストールされていても、この変換の最適化を無効にすると、すべてのPandas UDF呼び出しが必ず失敗する。",
      "この設定がfalseになるたびに、すべてのPandas UDFは自動的に標準のPython UDFになる。"
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
    "stem": "pandas API on SparkのDataFrame psdfでは、多数の変換によって論理計画が非常に大きくなり、計画の作成に時間がかかるようになっています。永続的なSparkチェックポイントのディレクトリはすでに設定されており、中間結果を実体化する余裕があります。データセット全体をローカルのpandasメモリに集めず、以前の計画を切り詰めたpandas-on-Spark DataFrameを返す操作はどれですか？",
    "options": [
      "psdf.to_pandas()",
      "psdf.head(5)",
      "psdf = psdf.spark.checkpoint()",
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
