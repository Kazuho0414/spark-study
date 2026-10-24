/* Spark learning engine. All answers use canonical indexes; display order is separate.
 * Scheduling and priority are learning heuristics, not a prediction of passing. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.LearningEngine = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  function correctIndexes(q){return Array.isArray(q.correct_many)?q.correct_many:[q.correct];}
  function isCorrect(answer,q){if(answer===undefined)return false;const selected=Array.isArray(answer)?answer:[answer],expected=correctIndexes(q);return selected.length===expected.length&&new Set(selected).size===selected.length&&selected.every(i=>expected.includes(i));}
  const DAY = 86400000, SPACED = 20 * 3600000;
  const DOMAINS = [
    {key:'Architecture',label:'Architecture',weight:.20,quota:9},
    {key:'Spark SQL',label:'Spark SQL',weight:.20,quota:9},
    {key:'DataFrame',label:'DataFrame',weight:.30,quota:14},
    {key:'Tuning',label:'Tuning',weight:.10,quota:4},
    {key:'Structured Streaming',label:'Structured Streaming',weight:.10,quota:5},
    {key:'Spark Connect',label:'Spark Connect',weight:.05,quota:2},
    {key:'Pandas API',label:'Pandas API',weight:.05,quota:2}
  ];
  const CAUSES = [
    {key:'knowledge',label:'知識不足'}, {key:'api',label:'APIの混同'},
    {key:'reading',label:'コード・条件の読み違い'}, {key:'english',label:'英語の条件見落とし'},
    {key:'boundary',label:'NULL・境界条件'}, {key:'time',label:'時間不足'},
    {key:'careless',label:'操作・確認ミス'}, {key:'unknown',label:'未分類'}
  ];
  const CONFIDENCE = ['high','medium','low','unknown'];
  const BAD_KEYS = new Set(['__proto__','prototype','constructor']);
  const copy = x => JSON.parse(JSON.stringify(x));
  const own = (o,k) => Object.prototype.hasOwnProperty.call(o,k);
  const finite = x => typeof x === 'number' && Number.isFinite(x);
  const fail = message => {throw new Error('学習記録が不正です: '+message);};
  const plain = x => !!x && typeof x === 'object' && !Array.isArray(x) && (Object.getPrototypeOf(x) === Object.prototype || Object.getPrototypeOf(x) === null);
  function obj(x,label) {if(!plain(x))fail(label+'はオブジェクトが必要です');return x;}
  function safeKey(k) {if(typeof k!=='string'||!k||k.length>300||BAD_KEYS.has(k))fail('不正な識別子');return k;}
  function number(x,label,min=0,max=Number.MAX_SAFE_INTEGER) {if(!finite(x)||x<min||x>max)fail(label+'の値');return x;}
  function dateMs(x,label) {const n=typeof x==='string'?Date.parse(x):NaN;if(!finite(n))fail(label+'の日付');return n;}
  function shuffle(items) {const a=items.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
  function stableHash(s) {let n=2166136261;for(let i=0;i<s.length;i++){n^=s.charCodeAt(i);n=Math.imul(n,16777619);}return (n>>>0).toString(36);}
  let serial=0;
  function uid(prefix,now) {return prefix+'-'+now.toString(36)+'-'+(++serial).toString(36)+'-'+Math.random().toString(36).slice(2,10);}
  function makeEngine(DATA) {
    const domains=DATA.generic?[]:DOMAINS;
    const questionMap={}, examMap={};
    const allQuestions=[];
    for(const e of DATA.exams||[]) {
      safeKey(e.id); if(own(examMap,e.id))fail('教材の模試IDが重複しています');
      examMap[e.id]=e;
      for(const q of e.questions||[])addQuestion(q);
    }
    for(const q of DATA.variants||[])addQuestion(q);
    for(const q of DATA.additional||[])addQuestion(q);
    function addQuestion(q) {
      safeKey(q.id);if(own(questionMap,q.id))fail('教材の問題IDが重複しています: '+q.id);
      if(!Array.isArray(q.options)||q.options.length<2||!Number.isInteger(q.correct)||q.correct<0||q.correct>=q.options.length||!correctIndexes(q).length||new Set(correctIndexes(q)).size!==correctIndexes(q).length||correctIndexes(q).some(i=>!Number.isInteger(i)||i<0||i>=q.options.length))fail('教材の選択肢が不正です: '+q.id);
      questionMap[q.id]=q;allQuestions.push(q);
    }
    const drillIds=new Set((DATA.drills||[]).map(d=>d.id));
    const emptyState=()=>({version:2,attempts:[],sessions:{},sessionTrash:{},drills:{},exposures:{},settings:{}});
    function ids(raw,label) {
      if(!Array.isArray(raw)||!raw.length||raw.length>allQuestions.length)fail(label+'の問題一覧');
      const a=raw.map(id=>{safeKey(id);if(!own(questionMap,id))fail('この教材にない問題: '+id);return id;});
      if(new Set(a).size!==a.length)fail(label+'の問題が重複しています');return a;
    }
    function map(raw,allowed,label,check) {
      const out={},source=raw===undefined?{}:raw;obj(source,label);const allowedSet=new Set(allowed);
      for(const [id,value] of Object.entries(source)) {safeKey(id);if(!allowedSet.has(id))fail(label+'に範囲外の問題があります');out[id]=check(value,id);}
      return out;
    }
    function answerMap(raw,a) {return map(raw,a,'回答',(v,id)=>{const multi=correctIndexes(questionMap[id]).length>1;if(multi){if(!Array.isArray(v)||!v.length||new Set(v).size!==v.length||v.some(i=>!Number.isInteger(i)||i<0||i>=questionMap[id].options.length))fail('複数選択の番号: '+id);return v.slice().sort((a,b)=>a-b);}if(!Number.isInteger(v)||v<0||v>=questionMap[id].options.length)fail('選択肢の番号: '+id);return v;});}
    function boolMap(raw,a,label,nullable=false) {return map(raw,a,label,v=>{if(typeof v!=='boolean'&&!(nullable&&v===null))fail(label+'の値');return v;});}
    function cleanOrders(raw,a) {
      obj(raw,'選択肢順');const out={};
      for(const id of a) {
        const n=questionMap[id].options.length,o=raw[id];
        if(!Array.isArray(o)||o.length!==n||new Set(o).size!==n||o.some(x=>!Number.isInteger(x)||x<0||x>=n))fail('選択肢順: '+id);
        out[id]=o.slice();
      }
      for(const id of Object.keys(raw))if(!a.includes(id))fail('選択肢順に範囲外の問題');
      return out;
    }
    function cleanCommon(raw,a) {
      if(raw.immediateFeedback!==undefined&&typeof raw.immediateFeedback!=='boolean')fail('即時解説の設定');
      return {
        ...(raw.immediateFeedback===undefined?{}:{immediateFeedback:raw.immediateFeedback}),
        ids:a,optionOrders:cleanOrders(raw.optionOrders,a),answers:answerMap(raw.answers,a),draftAnswers:answerMap(raw.draftAnswers,a),
        ...(raw.answeredAt===undefined?{}:{answeredAt:map(raw.answeredAt,a,'回答日時',v=>number(v,'回答日時'))}),
        ...(raw.englishViewed===undefined?{}:{englishViewed:boolMap(raw.englishViewed,a,'英語補助閲覧')}),
        ...(raw.englishReading===undefined?{}:{englishReading:map(raw.englishReading,a,'英文読み取り',v=>{if(!['unknown','clear','difficult'].includes(v))fail('英文読み取りの値');return v;})}),
        confidence:map(raw.confidence,a,'自信度',v=>{if(!CONFIDENCE.includes(v))fail('自信度の値');return v;}),
        flags:boolMap(raw.flags,a,'要復習'),
        timesMs:map(raw.timesMs,a,'回答時間',v=>number(v,'回答時間',0,365*DAY)),
        notes:map(raw.notes,a,'メモ',v=>{if(typeof v!=='string'||v.length>20000)fail('メモの形式');return v;}),
        shown:map(raw.shown,a,'表示記録',v=>{if(v===true)return v;return number(v,'表示日時');}),
        exposedBefore:boolMap(raw.exposedBefore,a,'初見記録',true),
        choicesRevealed:boolMap(raw.choicesRevealed,a,'選択肢表示'),
        causes:map(raw.causes,a,'誤答原因',v=>{if(!CAUSES.some(c=>c.key===v))fail('誤答原因');return v;})
      };
    }
    function cleanSettings(raw) {
      const source=raw===undefined?{}:raw;obj(source,'設定');const out={};
      for(const [k,v] of Object.entries(source)) {
        safeKey(k);
        if(k.startsWith('flag:')&&(!own(questionMap,k.slice(5))||typeof v!=='boolean'))fail('要復習マークの設定');
        if(typeof v==='boolean'||(finite(v)&&Math.abs(v)<1e12)||(typeof v==='string'&&v.length<=1000))out[k]=v;
        else fail('設定の形式');
      }
      return out;
    }
    function cleanDrills(raw) {
      const source=raw===undefined?{}:raw;obj(source,'補強演習');const out={};
      for(const [k,v] of Object.entries(source)) {safeKey(k);if(!drillIds.has(k))fail('この教材にない補強演習: '+k);if(typeof v!=='boolean')fail('補強演習の記録');out[k]=v;}
      return out;
    }
    function normalizeState(input) {
      obj(input,'学習記録');
      if(input.version!==undefined&&input.version!==1&&input.version!==2)fail('未対応バージョン');
      if(!Array.isArray(input.attempts)||input.attempts.length>100000)fail('受験履歴');
      obj(input.sessions,'途中の解答');
      if(input.version!==2)return migrateLegacy(input);
      const result=emptyState(), seenAttemptIds=new Set();
      for(const raw of input.attempts) {
        obj(raw,'受験履歴');safeKey(raw.id);if(seenAttemptIds.has(raw.id))fail('受験IDの重複');seenAttemptIds.add(raw.id);
        const a=ids(raw.ids,'受験履歴'),common=cleanCommon(raw,a),date=dateMs(raw.date,'受験');
        if(typeof raw.auto!=='boolean')fail('自動提出の値');
        const correct=a.filter(id=>isCorrect(common.answers[id],questionMap[id])).length;
        if(raw.correct!==undefined&&raw.correct!==correct)fail('正答数が回答と一致しません');
        if(raw.total!==undefined&&raw.total!==a.length)fail('総問題数が一致しません');
        const r={...common,id:raw.id,key:typeof raw.key==='string'?safeKey(raw.key):raw.id,exam:typeof raw.exam==='string'?safeKey(raw.exam):undefined,
          mode:typeof raw.mode==='string'?raw.mode.slice(0,100):'exam',title:typeof raw.title==='string'?raw.title.slice(0,500):'演習',
          date:new Date(date).toISOString(),correct,total:a.length,auto:raw.auto,elapsedSeconds:number(raw.elapsedSeconds,'経過時間',0,365*86400),
          recallFirst:raw.recallFirst===true,legacy:raw.legacy===true};
        if(raw.started!==undefined)r.started=number(raw.started,'開始日時');
        result.attempts.push(r);
      }
      for(const [key,raw] of Object.entries(input.sessions)) {
        safeKey(key);obj(raw,'途中の解答');const a=ids(raw.ids,'途中の解答'),common=cleanCommon(raw,a);
        if(!Number.isInteger(raw.pos)||raw.pos<0||raw.pos>=a.length)fail('表示位置');
        const started=number(raw.started,'開始日時'),deadline=raw.deadline===null?null:number(raw.deadline,'終了予定時刻');
        if(deadline!==null&&deadline<started)fail('制限時間');
        safeKey(raw.id);if(raw.key!==key)fail('途中の解答キーが一致しません');
        result.sessions[key]={...common,id:raw.id,key,mode:typeof raw.mode==='string'?raw.mode.slice(0,100):'exam',title:typeof raw.title==='string'?raw.title.slice(0,500):'演習',
          pos:raw.pos,started,deadline,recallFirst:raw.recallFirst===true};
      }
      obj(input.exposures,'表示履歴');
      for(const [id,raw] of Object.entries(input.exposures)) {
        if(!own(questionMap,id))fail('表示履歴の問題');obj(raw,'表示履歴');
        const firstAt=number(raw.firstAt,'初回表示'),lastAt=number(raw.lastAt,'最終表示');
        if(lastAt<firstAt||!Number.isInteger(raw.count)||raw.count<1||raw.count>1e9)fail('表示履歴の値');
        result.exposures[id]={firstAt,lastAt,count:raw.count};
      }
      result.drills=cleanDrills(input.drills);result.settings=cleanSettings(input.settings);
      if(input.sessionTrash!==undefined){obj(input.sessionTrash,'削除した演習');for(const [id,raw] of Object.entries(input.sessionTrash)){safeKey(id);if(raw.id!==id)fail('削除した演習ID');const checked=normalizeState({...emptyState(),sessions:{[raw.key]:raw}}).sessions[raw.key];if(result.settings['session-deleted:'+id]===true)result.sessionTrash[id]=checked;}}
      for(const [key,s] of Object.entries(result.sessions)){if(result.settings['session-deleted:'+s.id]===true){result.sessionTrash[s.id]=s;delete result.sessions[key];}}
      return result;
    }
    function migrateLegacy(input) {
      const result=emptyState(),known=new Set(),signatures={};
      for(const raw of input.attempts.slice().sort((x,y)=>Date.parse(x&&x.date)-Date.parse(y&&y.date))) {
        obj(raw,'旧受験履歴');const e=examMap[raw.exam];if(!e)fail('旧履歴の模試ID');
        const a=e.questions.map(q=>q.id),answers=answerMap(raw.answers,a),flags=boolMap(raw.flags,a,'要復習');
        const at=dateMs(raw.date,'旧受験');if(typeof raw.auto!=='boolean')fail('旧履歴の自動提出');
        const canonicalAnswers={};for(const id of a)if(own(answers,id))canonicalAnswers[id]=answers[id];
        const signature=stableHash(JSON.stringify({exam:raw.exam,date:new Date(at).toISOString(),answers:canonicalAnswers}));
        const occurrence=signatures[signature]=(signatures[signature]||0)+1;
        const r={id:'legacy-'+signature+'-'+occurrence,key:e.id,exam:e.id,mode:'exam',title:e.title,ids:a,optionOrders:{},answers,flags,
          confidence:{},timesMs:{},notes:{},shown:{},exposedBefore:{},choicesRevealed:{},causes:{},legacy:true,recallFirst:false,
          date:new Date(at).toISOString(),correct:a.filter(id=>isCorrect(answers[id],questionMap[id])).length,total:a.length,
          auto:raw.auto,elapsedSeconds:number(raw.elapsedSeconds,'旧経過時間',0,365*86400)};
        if(raw.correct!==undefined&&raw.correct!==r.correct)fail('旧正答数が回答と一致しません');
        for(const id of a) {
          r.optionOrders[id]=questionMap[id].options.map((_,i)=>i);
          r.exposedBefore[id]=known.has(id)?true:null;
          if(own(answers,id)) {r.shown[id]=true;known.add(id);const old=result.exposures[id];result.exposures[id]={firstAt:old?Math.min(old.firstAt,at):at,lastAt:old?Math.max(old.lastAt,at):at,count:(old?old.count:0)+1};}
        }
        result.attempts.push(r);
      }
      for(const [key,raw] of Object.entries(input.sessions)) {
        safeKey(key);obj(raw,'旧途中解答');const e=examMap[key];if(!e)fail('旧途中解答の模試ID');
        const a=e.questions.map(q=>q.id),started=number(raw.started,'旧開始時刻'),deadline=number(raw.deadline,'旧制限時間');
        if(deadline<started||!Number.isInteger(raw.pos)||raw.pos<0||raw.pos>=a.length)fail('旧途中解答の位置・時間');
        const s={id:'legacy-session-'+key+'-'+started,key,mode:'exam',title:e.title,ids:a,optionOrders:{},answers:answerMap(raw.answers,a),flags:boolMap(raw.flags,a,'要復習'),
          confidence:{},timesMs:{},notes:{},shown:{},exposedBefore:{},choicesRevealed:{},causes:{},pos:raw.pos,started,deadline,recallFirst:false};
        for(const id of a) {
          s.optionOrders[id]=questionMap[id].options.map((_,i)=>i);s.exposedBefore[id]=known.has(id)?true:null;
          if(own(s.answers,id)||id===a[raw.pos]) {s.shown[id]=true;const old=result.exposures[id];if(!old)result.exposures[id]={firstAt:started,lastAt:started,count:1};}
        }
        result.sessions[key]=s;
      }
      result.drills=cleanDrills(input.drills||{});
      return result;
    }
    function newSession(state,config,now=Date.now()) {
      const a=ids(config.ids,'新規演習'),key=safeKey(config.key),minutes=config.minutes===undefined?0:number(config.minutes,'制限時間',0,1440);
      if(own(state.sessions,key))throw new Error('同じキーの途中の演習があります。再開または削除してから開始してください。');
      const s={id:uid('session',now),key,mode:config.mode||'exam',title:config.title||'演習',ids:config.shuffleQuestions===false?a:shuffle(a),
        optionOrders:{},answers:{},draftAnswers:{},confidence:{},flags:{},timesMs:{},notes:{},shown:{},exposedBefore:{},choicesRevealed:{},causes:{},
        pos:0,started:now,deadline:minutes?now+minutes*60000:null,recallFirst:config.recallFirst===true,immediateFeedback:config.immediateFeedback!==false};
      const priorStats=buildStats(state,now);
      for(const id of s.ids){const o=questionMap[id].options.map((_,i)=>i);s.optionOrders[id]=config.shuffleOptions===false?o:shuffle(o);s.exposedBefore[id]=!!state.exposures[id];s.flags[id]=priorStats.questions[id].flagged;}
      state.sessions[key]=s;return s;
    }
    function markShown(state,s,id,now=Date.now()) {
      if(!s.ids.includes(id))throw new Error('演習にない問題です');
      if(own(s.shown,id))return;
      const previous=state.exposures[id];
      // v1 never recorded skipped views. An explicit null preserves that unknown
      // history when continuing a migrated session; v2 booleans refresh on view.
      if(s.exposedBefore[id]!==null)s.exposedBefore[id]=!!previous;
      s.shown[id]=now;
      state.exposures[id]={firstAt:previous?Math.min(previous.firstAt,now):now,lastAt:previous?Math.max(previous.lastAt,now):now,count:(previous?previous.count:0)+1};
    }
    function markReviewed(state,id,now=Date.now()) {
      if(!own(questionMap,id))throw new Error('教材にない問題です');
      number(now,'表示日時');
      const previous=state.exposures[id];
      state.exposures[id]={firstAt:previous?Math.min(previous.firstAt,now):now,lastAt:previous?Math.max(previous.lastAt,now):now,count:(previous?previous.count:0)+1};
      return state.exposures[id];
    }
    function finish(state,key,auto=false,now=Date.now()) {
      const s=state.sessions[key];if(!s)throw new Error('途中の演習がありません');
      const common=cleanCommon(s,s.ids),a={...copy(common),id:uid('attempt',now),key:s.key,exam:own(examMap,s.key)?s.key:undefined,mode:s.mode,title:s.title,
        started:s.started,date:new Date(now).toISOString(),correct:s.ids.filter(id=>isCorrect(s.answers[id],questionMap[id])).length,total:s.ids.length,
        auto:!!auto,elapsedSeconds:Math.max(0,Math.round((Math.min(now,s.deadline||now)-s.started)/1000)),recallFirst:s.recallFirst===true,legacy:false};
      state.attempts.push(a);delete state.sessions[key];return a;
    }
    // Project persisted session answers into statistics; submitting moves the same
    // answers to attempts, so they are never counted twice.
    function learningRecords(state) {
      const completed=new Set(state.attempts.map(a=>a.key+'|'+a.started));
      const records=state.attempts.slice();
      for(const s of Object.values(state.sessions)) {
        if(completed.has(s.key+'|'+s.started))continue;
        const answered=s.ids.filter(id=>own(s.answers,id));
        if(answered.length)records.push({...s,ids:answered,total:answered.length,
          correct:answered.filter(id=>isCorrect(s.answers[id],questionMap[id])).length,
          date:new Date(Math.max(s.started,...answered.map(id=>s.answeredAt?.[id]||s.started))).toISOString(),partial:true});
      }
      return records;
    }
    function inferCause(q,index) {
      if(Array.isArray(index))return {cause:'unknown',tag:'複数選択の不一致',explanation:'選択漏れ・選び過ぎを含みます。本人のメモで確認してください。'};
      const tag=Array.isArray(q.misconception_tags)?q.misconception_tags[index]||'':'';
      const explanation=Array.isArray(q.distractors_ja)?q.distractors_ja[index]||'':'';
      const t=(tag+' '+explanation).toLowerCase();let cause='knowledge';
      if(/null|境界|同順位|同率|重複|空文字|空配列|tie|boundary/.test(t))cause='boundary';
      else if(/api|引数|メソッド|関数|プロパティ|構文|syntax|return|返り値|型/.test(t))cause='api';
      else if(/条件|行数|順序|列順|読み|解釈|ordering/.test(t))cause='reading';
      if(Array.isArray(q.suggested_causes)&&CAUSES.some(c=>c.key===q.suggested_causes[index]))cause=q.suggested_causes[index];
      return {cause,tag:tag||'未分類の誤解候補',explanation};
    }
    function buildStats(state,now=Date.now()) {
      const questions={},conf=CONFIDENCE.map(key=>({key,label:({high:'自信あり',medium:'やや自信あり',low:'勘・自信なし',unknown:'未記録'})[key],answered:0,correct:0,wrong:0,rate:null}));
      const causes=CAUSES.map(c=>({...c,count:0}));
      for(const q of allQuestions)questions[q.id]={id:q.id,domain:q.domain,concept:q.concept||q.topic||q.id,concept_label:q.concept_label||q.topic||q.id,
        attempts:0,answered:0,wrong:0,unanswered:0,correct:0,streak:0,delayedCorrect:0,highConfidenceWrong:0,guessCorrect:0,lastAt:null,lastAnsweredAt:null,
        dueAt:null,intervalDays:0,mastery:'unseen',avgSeconds:null,firstCorrect:0,firstTotal:0,repeatCorrect:0,repeatTotal:0,exposureUnknownTotal:0,exposureUnknownCorrect:0,
        priority:0,reasons:[],latestCorrect:null,unresolved:false,flagged:false,seen:!!state.exposures[q.id],inferredCauses:[],_timed:0,_ms:0,_step:-1,_spaced:0,_lastSpaced:null,_lastWrong:null,_low:false};
      const sorted=learningRecords(state).flatMap(a=>a.ids.map(id=>({...a,ids:[id],date:new Date(a.answeredAt?.[id]||Date.parse(a.date)).toISOString()}))).map((a,i)=>({a,i})).sort((x,y)=>Date.parse(x.a.date)-Date.parse(y.a.date)||x.i-y.i).map(x=>x.a);
      for(const a of sorted) {
        const at=Date.parse(a.date);
        for(const id of a.ids) {
          const q=questionMap[id],s=questions[id];if(!s)continue;
          const answered=own(a.answers,id),right=answered&&isCorrect(a.answers[id],q),c=a.confidence[id]||'unknown',shown=own(a.shown,id)||answered;
          s.attempts++;s.lastAt=at;if(own(a.flags,id))s.flagged=!!a.flags[id];s.seen=s.seen||shown;
          if(shown) {const exp=a.exposedBefore[id];if(exp===false){s.firstTotal++;if(right)s.firstCorrect++;}else if(exp===true){s.repeatTotal++;if(right)s.repeatCorrect++;}else {s.exposureUnknownTotal++;if(right)s.exposureUnknownCorrect++;}}
          if(!answered){s.unanswered++;continue;}
          s.answered++;s.lastAnsweredAt=at;s.latestCorrect=right;s._low=c==='low';
          const ct=conf.find(x=>x.key===c);ct.answered++;if(right){s.correct++;s.streak++;ct.correct++;if(c==='low')s.guessCorrect++;}else{ct.wrong++;s.wrong++;s.streak=0;s.unresolved=true;s._lastWrong=at;if(c==='high')s.highConfidenceWrong++;}
          if(own(a.timesMs,id)&&a.timesMs[id]>0){s._timed++;s._ms+=a.timesMs[id];}
          if(!right) {
            const candidate=inferCause(q,a.answers[id]),existing=s.inferredCauses.find(x=>x.cause===candidate.cause&&x.tag===candidate.tag&&x.explanation===candidate.explanation);
            if(existing)existing.count++;else s.inferredCauses.push({...candidate,count:1});
          }
          if(a.causes&&own(a.causes,id)&&!right)causes.find(x=>x.key===a.causes[id]).count++;
          if(!right||c==='low') {
            s._step=0;s._spaced=0;s._lastSpaced=at;s.intervalDays=1;s.dueAt=at+DAY;
          } else if(s._lastSpaced===null) {
            s._step=0;s._spaced=1;s._lastSpaced=at;s.intervalDays=1;s.dueAt=at+DAY;
          } else if(at-s._lastSpaced>=SPACED) {
            s._step=Math.min(4,s._step+1);s._spaced++;s.delayedCorrect++;s._lastSpaced=at;s.intervalDays=[1,3,7,14,30][s._step];s.dueAt=at+s.intervalDays*DAY;
            if(s._lastWrong===null||at-s._lastWrong>=SPACED)s.unresolved=false;
          }
        }
      }
      const totals={attempts:state.attempts.length,questionAttempts:0,answered:0,correct:0,wrong:0,unanswered:0,rate:null,firstCorrect:0,firstTotal:0,repeatCorrect:0,repeatTotal:0,
        exposureUnknownTotal:0,exposureUnknownCorrect:0,seen:0,mastered:0,due:0,highConfidenceWrong:0,guessCorrect:0,avgSeconds:null};
      const domainRows=new Map(),conceptRows=new Map();
      function getRow(m,key,label,domain) {if(!m.has(key))m.set(key,{key,label,domain,count:0,attempts:0,answered:0,correct:0,wrong:0,unanswered:0,rate:null,firstCorrect:0,firstTotal:0,repeatCorrect:0,repeatTotal:0,
        exposureUnknownTotal:0,exposureUnknownCorrect:0,mastered:0,due:0,avgSeconds:null,_ms:0,_timed:0});return m.get(key);}
      for(const d of domains)getRow(domainRows,d.key,d.label);
      let totalMs=0,totalTimed=0;
      for(const s of Object.values(questions)) {
        if(own(state.settings,'flag:'+s.id))s.flagged=state.settings['flag:'+s.id];
        s.avgSeconds=s._timed?s._ms/s._timed/1000:null;
        s.mastery=s.answered===0?(s.seen?'seen':'unseen'):s.unresolved||s._low?'relearning':s._spaced>=3?'mastered':'learning';
        const due=s.dueAt!==null&&s.dueAt<=now,d=domains.find(x=>x.key===s.domain),overdue=due?Math.min(20,Math.floor((now-s.dueAt)/DAY)):0;
        s.reasons=[];let p=0;
        if(s.unresolved){p+=100;s.reasons.push('誤答が未解消');}
        if(s.highConfidenceWrong&&s.unresolved){p+=35;s.reasons.push('自信ありの誤答');}
        if(due){p+=40+overdue;s.reasons.push('復習期限');}
        if(s.flagged){p+=20;s.reasons.push('要復習マーク');}
        if(s._low){p+=25;s.reasons.push('自信なし');}
        if(s.unanswered&&s.answered===0){p+=20;s.reasons.push('未解答');}
        if(!s.seen){p+=15;s.reasons.push('未見');}
        if(s.mastery==='mastered'&&!due)p=Math.max(0,p-20);
        s.priority=Math.round(p*(1+(d?d.weight:.1)));
        for(const row of [getRow(domainRows,s.domain,s.domain),getRow(conceptRows,s.concept,s.concept_label,s.domain)]) {
          row.count++;for(const k of ['attempts','answered','correct','wrong','unanswered','firstCorrect','firstTotal','repeatCorrect','repeatTotal','exposureUnknownTotal','exposureUnknownCorrect'])row[k]+=s[k];
          if(s.mastery==='mastered')row.mastered++;if(due)row.due++;row._ms+=s._ms;row._timed+=s._timed;
        }
        totals.questionAttempts+=s.attempts;
        for(const k of ['answered','correct','wrong','unanswered','firstCorrect','firstTotal','repeatCorrect','repeatTotal','exposureUnknownTotal','exposureUnknownCorrect','highConfidenceWrong','guessCorrect'])totals[k]+=s[k];
        if(s.seen)totals.seen++;if(s.mastery==='mastered')totals.mastered++;if(due)totals.due++;
        totalMs+=s._ms;totalTimed+=s._timed;
        for(const k of Object.keys(s))if(k.startsWith('_'))delete s[k];
      }
      for(const r of [...domainRows.values(),...conceptRows.values()]){r.rate=r.answered?r.correct/r.answered:null;r.avgSeconds=r._timed?r._ms/r._timed/1000:null;delete r._ms;delete r._timed;}
      for(const c of conf)c.rate=c.answered?c.correct/c.answered:null;
      totals.rate=totals.answered?totals.correct/totals.answered:null;totals.avgSeconds=totalTimed?totalMs/totalTimed/1000:null;
      return {questions,domains:[...domainRows.values()],concepts:[...conceptRows.values()].sort((a,b)=>b.wrong-a.wrong||b.attempts-a.attempts||a.label.localeCompare(b.label)),confidence:conf,causes,totals};
    }
    function selectQuestions(state,config={},now=Date.now()) {
      const kind=config.kind||'priority',count=config.count===undefined?20:Math.max(0,Math.floor(config.count));
      if(!finite(count)||count>1000000)throw new Error('問題数が不正です');
      const stats=buildStats(state,now);let pool=allQuestions.filter(q=>(!config.domain||q.domain===config.domain)&&(!config.concept||(q.concept||q.topic||q.id)===config.concept));
      if(kind==='similar') {
        const source=questionMap[config.sourceId];if(!source)return [];
        const concept=source.concept||source.topic||source.id;pool=pool.filter(q=>q.id!==source.id&&(q.concept||q.topic||q.id)===concept);
        pool=shuffle(pool).sort((a,b)=>Number(stats.questions[a.id].seen)-Number(stats.questions[b.id].seen)||stats.questions[a.id].attempts-stats.questions[b.id].attempts);
      } else if(kind==='wrong')pool=pool.filter(q=>stats.questions[q.id].wrong>0&&stats.questions[q.id].unresolved);
      else if(kind==='due')pool=pool.filter(q=>stats.questions[q.id].answered>0&&stats.questions[q.id].dueAt!==null&&stats.questions[q.id].dueAt<=now);
      else if(kind==='flagged')pool=pool.filter(q=>stats.questions[q.id].flagged);
      else if(kind==='random') {
        // Official proportions; variants are training-only and stay outside random mocks.
        pool=pool.filter(q=>(DATA.exams||[]).filter(e=>!e.priority).some(e=>e.questions.some(x=>x.id===q.id)));
        if(config.reserveM4) {
          const unreserved=pool.filter(q=>!q.id.startsWith('M4-'));
          if(unreserved.length>=count)pool=unreserved;
        }
        if(count===45&&!config.domain&&!config.concept) {
          let result=[];for(const d of domains)result.push(...shuffle(pool.filter(q=>q.domain===d.key)).slice(0,d.quota));
          const used=new Set(result.map(q=>q.id));result.push(...shuffle(pool.filter(q=>!used.has(q.id))).slice(0,Math.max(0,count-result.length)));
          return shuffle(result).slice(0,count).map(q=>q.id);
        }
        return shuffle(pool).slice(0,count).map(q=>q.id);
      } else if(kind!=='priority')throw new Error('未対応の出題モード');
      if(kind!=='similar')pool=shuffle(pool).sort((a,b)=>stats.questions[b.id].priority-stats.questions[a.id].priority);
      return pool.slice(0,count).map(q=>q.id);
    }
    function mergeState(current,incoming) {
      const a=normalizeState(current),b=normalizeState(incoming),result=copy(a),known=new Set(a.attempts.map(x=>x.id));
      for(const attempt of b.attempts)if(!known.has(attempt.id)){result.attempts.push(copy(attempt));known.add(attempt.id);}
      result.attempts.sort((x,y)=>Date.parse(x.date)-Date.parse(y.date));
      for(const [key,s] of Object.entries(b.sessions))if(!own(result.sessions,key))result.sessions[key]=copy(s);
      for(const [id,e] of Object.entries(b.exposures)) {
        const old=result.exposures[id];result.exposures[id]=old?{firstAt:Math.min(old.firstAt,e.firstAt),lastAt:Math.max(old.lastAt,e.lastAt),count:Math.max(old.count,e.count)}:copy(e);
      }
      for(const [id,value] of Object.entries(b.drills))if(!own(result.drills,id))result.drills[id]=value;
      result.settings={...b.settings,...result.settings};result.sessionTrash={...b.sessionTrash,...result.sessionTrash};return normalizeState(result);
    }
    return {isCorrect,correctIndexes,emptyState,normalizeState,newSession,markShown,markReviewed,finish,learningRecords,buildStats,selectQuestions,mergeState,allQuestions,questionMap,DOMAINS:domains,CAUSES};
  }
  return {isCorrect,correctIndexes,makeEngine,DOMAINS,CAUSES};
});
