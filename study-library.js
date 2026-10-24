/* Portable, versioned question libraries and loss-preserving three-way synchronization. */
(function(root){
'use strict';
const KEY='study-library-v1', clone=x=>JSON.parse(JSON.stringify(x)), equal=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const plain=x=>x&&typeof x==='object'&&!Array.isArray(x);
const safe=x=>typeof x==='string'&&/^[a-zA-Z0-9][a-zA-Z0-9_.-]{0,79}$/.test(x)&&!['constructor','prototype','__proto__'].includes(x);
function text(x,name,max=30000){if(typeof x!=='string'||!x.trim()||x.length>max)throw Error(name+'を確認してください');return x;}
function validateBank(raw){
 if(!plain(raw)||raw.schema_version!==1||!safe(raw.id)||raw.id==='spark')throw Error('問題集のschema_versionは1、idはspark以外の英数字・ハイフン等にしてください');
 const title=text(raw.title,'問題集名',200), list=raw.exams;
 if(!Array.isArray(list)||!list.length||list.length>100)throw Error('examsに1〜100個の問題グループが必要です');
 const seen=new Set(), examIds=new Set();let total=0;
 const exams=list.map(e=>{
  if(!safe(e.id)||examIds.has(e.id))throw Error('問題グループIDが不正または重複しています');examIds.add(e.id);
  if(!Array.isArray(e.questions)||!e.questions.length)throw Error('空の問題グループは追加できません');
  const minutes=e.minutes??0;if(!Number.isInteger(minutes)||minutes<0||minutes>1440)throw Error('minutesは0〜1440の整数です');
  return {id:e.id,title:text(e.title,'グループ名',200),minutes,questions:e.questions.map(q=>{
   if(++total>5000||!safe(q.id)||seen.has(q.id))throw Error('問題IDの重複・形式・上限5000問を確認してください');seen.add(q.id);
   if(!Array.isArray(q.options)||q.options.length<2||q.options.length>8||!Number.isInteger(q.correct)||q.correct<0||q.correct>=q.options.length)throw Error(q.id+'：選択肢は2〜8個、correctは0始まりの正解番号です');
   const options=q.options.map(v=>text(v,'選択肢'));
   if(q.correct_many!==undefined&&(!Array.isArray(q.correct_many)||q.correct_many.length<2||new Set(q.correct_many).size!==q.correct_many.length||q.correct_many.some(i=>!Number.isInteger(i)||i<0||i>=options.length)))throw Error('複数正解キーが不正です');
   const array=(v,fallback,name)=>{if(v===undefined)return fallback;if(!Array.isArray(v)||v.length!==options.length)throw Error(q.id+'：'+name+'の数が選択肢と一致しません');return v.map(x=>text(x,name));};
   const source=q.source_url||'';if(source&&!/^https:\/\//i.test(source))throw Error('source_urlはhttps://のURLにしてください');
   const stem=text(q.stem,'問題文'),domain=text(q.domain||'一般','分野',100),topic=text(q.topic||domain,'論点',200);
   return {id:q.id,stem,options,correct:q.correct,...(q.correct_many?{correct_many:q.correct_many.slice()}:{}),number:q.number,source_explanation:q.source_explanation||null,source_option_explanations:q.source_option_explanations||null,references:q.references||[],images:q.images||[],source_hash:q.source_hash||null,revision:q.revision||null,grading_hold:q.grading_hold||null,domain,topic,concept:text(q.concept||topic,'論点ID',200),concept_label:topic,
    stem_ja:q.stem_ja===undefined?stem:text(q.stem_ja,'日本語訳'),options_ja:array(q.options_ja,options,'選択肢訳'),
    explanation_ja:text(q.explanation_ja,'解説'),distractors_ja:array(q.distractors_ja,options.map((_,i)=>i===q.correct?'正解です。':'解説を参照してください。'),'選択肢ごとの理由'),source_url:source,validation:typeof q.validation==='string'?q.validation:'追加した教材'};
  })};
 });
 return {schema_version:1,id:raw.id,title,description:typeof raw.description==='string'?raw.description.slice(0,3000):'',exams,variants:[],additional:[],drills:[],generic:true};
}
const LEGACY_M5='spark-mock5-20261017',MIGRATION_BACKUP='study-mock1to5-backup:';
const packaged=[...(root.STUDY_BUNDLED_BANKS||[]),root.EXAM4_BANK].filter(Boolean).map(validateBank),mock5=packaged.find(b=>b.id===LEGACY_M5);
const builtin={...root.SPARK_QUESTION_BANK,exams:[...root.SPARK_QUESTION_BANK.exams,...(mock5?mock5.exams.filter(e=>!root.SPARK_QUESTION_BANK.exams.some(x=>x.id===e.id)).map(e=>({...e,title:'本番形式模試 5'})):[]),...(root.SPARK_PRIORITY_EXAMS||[])],additional:root.SPARK_ADDITIONAL_QUESTIONS.questions};
const bundled=packaged.filter(b=>b.id!==LEGACY_M5);
function needsMigration(raw){return !!(mock5&&raw?.schema==='study-library-v1'&&raw.banks?.[LEGACY_M5]);}
function backupBeforeMigration(raw,source){if(needsMigration(raw)&&!localStorage.getItem(MIGRATION_BACKUP+source))localStorage.setItem(MIGRATION_BACKUP+source,JSON.stringify(raw));}
function migrationBackups(){const out={};for(const source of ['local','cloud','import']){const value=localStorage.getItem(MIGRATION_BACKUP+source);if(value)out[source]=JSON.parse(value);}return out;}
function data(id,entry){return id==='spark'?builtin:validateBank(entry.data);}
function normalize(raw){
 if(raw?.schema==='study-bank-record-v1'){const id=raw.bankId,known=id==='spark'?null:packaged.find(b=>b.id===id);if(id!=='spark'&&!known)throw Error('この問題集の教材がありません：'+id);raw={schema:'study-library-v1',banks:{[id]:{data:known,state:raw.state}}};}
 if(raw?.schema!=='study-library-v1')raw={schema:'study-library-v1',banks:{spark:{data:null,state:raw}}};
 if(!plain(raw.banks)||!Object.keys(raw.banks).length||Object.keys(raw.banks).length>50)throw Error('問題集の保存形式を確認してください（上限50冊）');
 const out={schema:'study-library-v1',banks:{}};
 for(const [id,entry]of Object.entries(raw.banks)){
  if(!safe(id)||!plain(entry))throw Error('問題集の識別子が不正です');
  const bank=data(id,entry);if(id!=='spark'&&bank.id!==id)throw Error('問題集IDが一致しません');
  out.banks[id]={data:id==='spark'?null:bank,state:LearningEngine.makeEngine(bank).normalizeState(entry.state)};
 }
 for(const bank of bundled)if(!out.banks[bank.id])out.banks[bank.id]={data:clone(bank),state:LearningEngine.makeEngine(bank).emptyState()};
 const engine=LearningEngine.makeEngine(builtin);
 if(!out.banks.spark)out.banks.spark={data:null,state:engine.emptyState()};
 if(needsMigration(raw)){
  const legacy=out.banks[LEGACY_M5];
  if(!equal(legacy.data.exams.flatMap(e=>e.questions).map(q=>[q.id,q.correct,q.options.length]),mock5.exams.flatMap(e=>e.questions).map(q=>[q.id,q.correct,q.options.length])))throw Error('模試5の教材内容が常設版と異なります。元の記録は保持しています。');
  out.banks.spark.state=mergeStates(engine,engine.emptyState(),out.banks.spark.state,legacy.state,{count:0});
  delete out.banks[LEGACY_M5];
 }
 return out;
}
let library,error='';
try{const old=localStorage.getItem(KEY),raw=JSON.parse(old||localStorage.getItem('spark-study-v2')||localStorage.getItem('spark-study-v1')||JSON.stringify(LearningEngine.makeEngine(builtin).emptyState()));library=normalize(raw);backupBeforeMigration(raw,'local');}catch(e){error=e.message;library=normalize(LearningEngine.makeEngine(builtin).emptyState());}
let active=localStorage.getItem('study-active-bank')||'spark';
const newDefault=root.EXAM4_BANK.id;
if(!localStorage.getItem('study-exam4-default-20261025')){try{const original=localStorage.getItem(KEY)||localStorage.getItem('spark-study-v2')||localStorage.getItem('spark-study-v1');if(original&&!localStorage.getItem('study-exam4-before-20261025'))localStorage.setItem('study-exam4-before-20261025',original);localStorage.setItem('study-active-bank',newDefault);localStorage.setItem('study-exam4-default-20261025','1');active=newDefault;}catch(e){error='移行前バックアップを保存できません: '+e.message;}}
if(active==='spark')active=newDefault;if(active===LEGACY_M5&&mock5)active='spark';if(!library.banks[active])active='spark';
function persist(next){if(error)throw Error('元の保存記録を保護しています：'+error);const normalized=normalize(next);localStorage.setItem(KEY,JSON.stringify(normalized));library=normalized;}
// Merge values changed on only one device. Concurrent edits prefer this device;
// both complete inputs are retained in the synchronization backup when conflicts occur.
function mergeValue(base,local,remote,conflicts){
 if(equal(local,base))return remote;if(equal(remote,base)||equal(local,remote))return local;
 if(plain(local)&&plain(remote)){
  const out={};for(const k of new Set([...Object.keys(local),...Object.keys(remote)])){
   if(['__proto__','constructor','prototype'].includes(k))throw Error('不正な保存キー');
   const v=mergeValue(base?.[k],local[k],remote[k],conflicts);if(v!==undefined)out[k]=v;
  }return out;
 }
 conflicts.count++;return local===undefined?remote:local;
}
function mergeStates(engine,bs,ls,rs,conflicts){
  const merged=engine.mergeState(ls,rs);
  const bm=Object.fromEntries(bs.attempts.map(a=>[a.id,a])),lm=Object.fromEntries(ls.attempts.map(a=>[a.id,a])),rm=Object.fromEntries(rs.attempts.map(a=>[a.id,a]));
  // Completed attempts are append-only. An older snapshot cannot delete a result.
  merged.attempts=[...new Set([...Object.keys(lm),...Object.keys(rm)])].map(id=>!lm[id]||!rm[id]?clone(lm[id]||rm[id]):mergeValue(bm[id],lm[id],rm[id],conflicts)).sort((a,b)=>Date.parse(a.date)-Date.parse(b.date));
  merged.settings=mergeValue(bs.settings,ls.settings,rs.settings,conflicts);
  for(const k of new Set([...Object.keys(ls.settings),...Object.keys(rs.settings)]))if(k.startsWith('session-deleted:')&&(ls.settings[k]===undefined||rs.settings[k]===undefined))merged.settings[k]=ls.settings[k]??rs.settings[k];
  merged.drills=mergeValue(bs.drills,ls.drills,rs.drills,conflicts);
  merged.sessions={};merged.sessionTrash=mergeValue(bs.sessionTrash||{},ls.sessionTrash||{},rs.sessionTrash||{},conflicts);
  for(const k of new Set([...Object.keys(ls.sessions),...Object.keys(rs.sessions)])){
   let a=ls.sessions[k],z=rs.sessions[k];const old=bs.sessions[k];
   for(const candidate of [a,z])if(candidate&&merged.settings['session-deleted:'+candidate.id]===true){const prior=merged.sessionTrash[candidate.id];if(!prior)merged.sessionTrash[candidate.id]=clone(candidate);else merged.sessionTrash[candidate.id]=mergeValue(old,candidate,prior,conflicts);}
   if(a&&merged.settings['session-deleted:'+a.id]===true)a=undefined;
   if(z&&merged.settings['session-deleted:'+z.id]===true)z=undefined;
   if(!a&&!z)continue;
   // A completed session must not be resurrected by an idle device.
   const finished=s=>s&&merged.attempts.some(t=>(t.key===s.key||t.key==='conflict-'+s.id)&&t.started===s.started);
   if(!a||!z){const s=a||z;if(!finished(s))merged.sessions[k]=clone(s);continue;}
   const reviewClash=(a.review||z.review)&&!equal(a.review,z.review)&&!equal(a.review,old?.review)&&!equal(z.review,old?.review);
   const clashes=reviewClash||Object.keys(a.answers).some(id=>z.answers[id]!==undefined&&!equal(a.answers[id],z.answers[id]));
   if(a.id!==z.id||clashes){
    merged.sessions[k]=clone(a);
    const fork='conflict-'+z.id;
    if(!finished(z)&&!Object.values(merged.sessions).some(s=>s.id===z.id&&equal(s.answers,z.answers)&&equal(s.review,z.review))){merged.sessions[fork]={...clone(z),key:fork,title:z.title+'（別端末の続き）'};conflicts.count++;}
   }else{const s=mergeValue(old,a,z,conflicts);for(const id of Object.keys(s.timesMs))s.timesMs[id]=Math.max(a.timesMs[id]||0,z.timesMs[id]||0);if(!finished(s))merged.sessions[k]=clone(s);}
  }
  return engine.normalizeState(merged);
}
function merge(base,local,remote){
 local=normalize(local);remote=normalize(remote);base=base?normalize(base):{banks:{}};
 const out={schema:'study-library-v1',banks:{}},conflicts={count:0};
 for(const id of new Set([...Object.keys(local.banks),...Object.keys(remote.banks)])){
  const l=local.banks[id],r=remote.banks[id],b=base.banks[id];if(!l||!r){out.banks[id]=clone(l||r);continue;}
  if(!equal(l.data,r.data))throw Error('同じIDの異なる問題集があります：'+id+'。別のIDで追加してください');
  const engine=LearningEngine.makeEngine(data(id,l)),empty=engine.emptyState(),bs=b?.state||empty;
  // Default UI settings are not intentional edits on a fresh device.
  if(!b)empty.settings={reserveM4:id==='spark',shuffleQuestions:true,shuffleOptions:true,immediateFeedback:true};
  out.banks[id]={data:l.data,state:mergeStates(engine,bs,l.state,r.state,conflicts)};
 }
 return {value:normalize(out),conflicts:conflicts.count};
}
root.StudyLibrary={KEY,LEGACY_M5,get error(){return error;},validateBank,normalize,merge,equal,needsMigration,backupBeforeMigration,migrationBackups,
 get active(){return active;},get current(){return data(active,library.banks[active]);},get state(){return clone(library.banks[active].state);},
 snapshot:()=>clone(library),list:()=>Object.entries(library.banks).map(([id,e])=>({id,title:data(id,e).title})),
 capture(s){const normalized=LearningEngine.makeEngine(data(active,library.banks[active])).normalizeState(s);if(equal(normalized,library.banks[active].state))return false;const next=clone(library);next.banks[active].state=normalized;persist(next);return true;},
 accept(next){persist(next);},
 recover(){localStorage.setItem('study-recovery-'+Date.now(),localStorage.getItem(KEY)||localStorage.getItem('spark-study-v2')||localStorage.getItem('spark-study-v1')||'{}');error='';persist(library);},
 select(id){if(id===LEGACY_M5&&mock5)id='spark';if(!library.banks[id])throw Error('問題集がありません');localStorage.setItem('study-active-bank',id);active=id;},
 add(raw){const bank=validateBank(raw);if(bank.id===LEGACY_M5&&mock5)throw Error('模試5はSpark合格演習室の模試1〜5に収録済みです。');if(library.banks[bank.id])throw Error('同じ問題集IDが存在します。既存問題集と別のIDにしてください');const next=clone(library);next.banks[bank.id]={data:bank,state:LearningEngine.makeEngine(bank).emptyState()};persist(next);return bank.id;}
};
})(globalThis);

