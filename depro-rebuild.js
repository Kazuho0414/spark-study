/* Stable question IDs and lossless session projection for the DE Pro rebuild. */
(function(root){
'use strict';
const VERSION='dedup236-20261123',BACKUP_KEY='study-depro-before-20261123';
const copy=x=>JSON.parse(JSON.stringify(x));
const own=(o,k)=>Object.prototype.hasOwnProperty.call(o,k);
const mapFields=['optionOrders','answers','draftAnswers','answeredAt','englishViewed','englishReading','confidence','flags','timesMs','notes','shown','exposedBefore','choicesRevealed','causes'];
function hash(text){let v=2166136261;for(let i=0;i<text.length;i++){v^=text.charCodeAt(i);v=Math.imul(v,16777619);}return (v>>>0).toString(36);}
function shuffled(items,seed){return items.slice().sort((a,b)=>parseInt(hash(seed+'|'+a),36)-parseInt(hash(seed+'|'+b),36)||String(a).localeCompare(String(b)));}
function isArchive(state,s){return state.settings['depro-archive:'+s.id]===VERSION;}
function migrate(engine,input,plan){
 if(!plan.rebuild_version)return {state:input,changed:false};
 const allowed=new Set(plan.new_question_ids),forms=plan.forms;
 const candidates=Object.entries(input.sessions).filter(([,s])=>s.ids.some(id=>!allowed.has(id)));
 if(!candidates.length)return {state:input,changed:false};
 const state=copy(input);
 for(const [key,old]of candidates){
  // An exact, read-only copy is kept before changing the active session. Multiple
  // device forks with the same session ID each receive their own archive key.
  let archived=copy(old);
  if(state.sessionTrash[old.id]&&JSON.stringify(state.sessionTrash[old.id])!==JSON.stringify(old))archived.id=old.id+'-archive-'+hash(JSON.stringify(old));
  state.sessionTrash[archived.id]=archived;
  state.settings['session-deleted:'+archived.id]=true;
  state.settings['depro-archive:'+archived.id]=VERSION;
  state.settings['session-deleted:'+old.id]=true;
  delete state.sessions[key];
  const kept=old.ids.filter(id=>allowed.has(id));
  if(!kept.length)continue;
  const sourceForm=(plan.original_forms||[]).some(f=>f.id===key);
  const form=sourceForm&&!old.review?forms.find(f=>kept.every(id=>f.ids.includes(id))):null;
  const added=form?form.ids.filter(id=>!kept.includes(id)):[];
  const ids=form?[...kept,...(state.settings.shuffleQuestions===false?added:shuffled(added,old.id))]:kept;
  let nextKey=form?.id||key;
  if(state.sessions[nextKey])nextKey='continued-'+hash(old.id+'|'+key+'|'+JSON.stringify(old.answers));
  const next=copy(old);
  next.id=old.id+'-'+VERSION+'-'+hash(key);
  next.key=nextKey;
  next.title=form?form.title:old.title+'（重複を除外）';
  next.ids=ids;
  for(const field of mapFields){
   if(old[field]===undefined)continue;
   next[field]=Object.fromEntries(Object.entries(old[field]).filter(([id])=>ids.includes(id)));
  }
  for(const id of ids){
   if(!next.optionOrders[id]){const order=engine.questionMap[id].options.map((_,i)=>i);next.optionOrders[id]=state.settings.shuffleOptions===false?order:shuffled(order,old.id+'|'+id);}
   if(!own(next.exposedBefore,id))next.exposedBefore[id]=!!input.exposures[id];
  }
  if(old.review){
   next.review={queue:old.review.queue.filter(id=>allowed.has(id)),
                pending:old.review.pending&&allowed.has(old.ids[old.pos]),
                events:old.review.events.filter(e=>allowed.has(e.questionId))};
   if(!next.review.queue.length&&!next.review.pending)continue;
  }
  const current=old.ids[old.pos];
  next.pos=ids.includes(current)?ids.indexOf(current):Math.max(0,ids.findIndex(id=>!own(next.answers,id)));
  state.sessions[nextKey]=next;
 }
 return {state:engine.normalizeState(state),changed:true};
}
function backup(storage,bankId,state){
 if(storage.getItem(BACKUP_KEY))return;
 const text=JSON.stringify({schema:'study-bank-record-v1',bankId,state});
 storage.setItem(BACKUP_KEY,storage.encode?storage.encode(text):text);
}
function prepareLibrary(engine,library,plan,storage){
 const entry=library.banks[plan.bank_id];
 if(!entry)return library;
 const result=migrate(engine,entry.state,plan);
 if(!result.changed)return library;
 backup(storage,plan.bank_id,entry.state);
 return {...library,banks:{...library.banks,[plan.bank_id]:{...entry,state:result.state}}};
}
root.DeproRebuild={VERSION,BACKUP_KEY,migrate,backup,prepareLibrary,isArchive};
})(typeof globalThis!=='undefined'?globalThis:this);
