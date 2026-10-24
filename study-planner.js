/* Review selection is confined to the current published mock 4. */
(function(root){
'use strict';
const settingKeys=['timeLimit','immediateFeedback','shuffleQuestions','shuffleOptions'];
function restoreSettings(settings,previous={}){
 let changed=false;
 for(const key of settingKeys)if(typeof settings[key]!=='boolean'){
  settings[key]=typeof previous[key]==='boolean'?previous[key]:true;changed=true;
 }
 return changed;
}
function eligible(engine,data,plan,allowHeld=false){
 if(data.id!==plan.bank_id)throw Error('現在の模試4以外からは出題できません。');
 const allowed=new Set(plan.new_question_ids);
 return engine.allQuestions.filter(q=>allowed.has(q.id)&&(allowHeld||!q.grading_hold));
}
function sessionConfig(engine,data,plan,settings,config){
 const allowed=new Set(eligible(engine,data,plan,config.allowHeld===true).map(q=>q.id));
 if(!Array.isArray(config.ids)||config.ids.some(id=>!allowed.has(id)))throw Error('出題対象外の問題が含まれています。旧問題は出題しません。');
 return {key:config.key,title:config.title,ids:[...new Set(config.ids)],
  minutes:config.review===true||settings.timeLimit===false?0:config.minutes||0,
  review:config.review===true,
  immediateFeedback:settings.immediateFeedback!==false,
  shuffleQuestions:settings.shuffleQuestions!==false,
  shuffleOptions:settings.shuffleOptions!==false,
  mode:config.mode||(settings.immediateFeedback!==false?'practice':'mock')};
}
function create(engine,state,data,plan,minutes,now=Date.now(),stats=engine.buildStats(state,now)){
 if(![5,15,30].includes(minutes))throw Error('学習時間は5・15・30分から選んでください');
 const all=eligible(engine,data,plan);
 const values=all.map(q=>stats.questions[q.id]).filter(s=>s?.answered>0&&Number.isFinite(s.avgSeconds)&&s.avgSeconds>=5).map(s=>s.avgSeconds).sort((a,b)=>a-b);
 const median=values.length?values[Math.floor(values.length/2)]:60;
 const secondsPerQuestion=Math.round(Math.max(30,Math.min(240,median))+60);
 const count=Math.max(1,Math.min(40,Math.floor(minutes*60/secondsPerQuestion)));
 const stat=q=>stats.questions[q.id]||{};
 const priority=(a,b)=>(stat(b).priority||0)-(stat(a).priority||0)||a.id.localeCompare(b.id);
 const pools={due:[],wrong:[],unseen:[],other:[]};
 for(const q of all){const s=stat(q);const key=s.answered>0&&s.dueAt!=null&&s.dueAt<=now?'due':s.unresolved?'wrong':!s.seen?'unseen':'other';pools[key].push(q);}
 for(const pool of Object.values(pools))pool.sort(priority);
 const chosen=[],counts={due:0,wrong:0,unseen:0,other:0};
 function take(kind,n){while(n-->0&&pools[kind].length&&chosen.length<count){chosen.push(pools[kind].shift().id);counts[kind]++;}}
 const newCount=count>=3&&pools.unseen.length?Math.max(1,Math.floor(count*.2)):0;
 take('due',Math.ceil((count-newCount)*.6));take('wrong',count-newCount-chosen.length);take('unseen',newCount);
 for(const kind of ['due','wrong','unseen','other'])take(kind,count-chosen.length);
 return {minutes,ids:chosen,counts,secondsPerQuestion,estimatedSeconds:chosen.length*secondsPerQuestion,hasTimingHistory:values.length>0};
}
function reviewAll(engine,state,data,plan,now=Date.now(),stats=engine.buildStats(state,now)){
 const counts={due:0,wrong:0,unseen:0};
 const selected=eligible(engine,data,plan).filter(q=>{
  const s=stats.questions[q.id]||{};
  const kind=s.answered>0&&s.dueAt!=null&&s.dueAt<=now?'due':s.unresolved?'wrong':!s.seen?'unseen':null;
  if(kind)counts[kind]++;return !!kind;
 }).sort((a,b)=>(stats.questions[b.id]?.priority||0)-(stats.questions[a.id]?.priority||0)||a.id.localeCompare(b.id));
 return {ids:selected.map(q=>q.id),counts};
}
root.StudyPlanner={create,reviewAll,eligible,sessionConfig,restoreSettings};
})(typeof globalThis!=='undefined'?globalThis:this);
