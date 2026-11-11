
'use strict';
const NEW_BANK=DEPRO_PLAN.bank_id, PLAN=DEPRO_PLAN, REVIEW_KEY=PLAN.review_key||'EX4-REVIEW-ALL';
let DATA=StudyLibrary.current;
let E=LearningEngine.makeEngine(DATA),Q=E.questionMap,state=StudyLibrary.state,activeKey=null,view='home',timing=null;
let storageBlocked=!!StudyLibrary.error;
const $=s=>document.querySelector(s),app=$('#app'),own=(o,k)=>Object.prototype.hasOwnProperty.call(o,k);
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const date=v=>v?new Date(v).toLocaleString('ja-JP'):'—',pct=(n,d)=>d?Math.round(n/d*100)+'%':'—';
const letters=xs=>xs.map(i=>String.fromCharCode(65+i)).join('・');
function notice(t){$('#status').textContent=t;}
function save(){if(storageBlocked){notice('元の記録を保護しています。記録画面からバックアップしてください。');return false;}try{if(StudyLibrary.capture(state))window.dispatchEvent(new Event('study-saved'));if($('#status').textContent.startsWith('保存できません：'))notice('');return true;}catch(e){notice('保存できません：'+e.message+'。記録を書き出してください。');return false;}}
function refreshBankList(){}
function switchBank(id){leave();StudyLibrary.select(NEW_BANK);DATA=StudyLibrary.current;E=LearningEngine.makeEngine(DATA);Q=E.questionMap;state=StudyLibrary.state;home();}
if(StudyLibrary.active!==NEW_BANK){StudyLibrary.select(NEW_BANK);DATA=StudyLibrary.current;E=LearningEngine.makeEngine(DATA);Q=E.questionMap;state=StudyLibrary.state;}
function inline(s){return esc(s).replace(/`([^`]+)`/g,'<code>$1</code>').replace(/\[([^\]]+)\]\((https:\/\/[^\s)]+)\)/g,'<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');}
function md(text,q){const seen=new Set();return String(text||'').split(/(```[\s\S]*?```)/g).map(chunk=>{if(chunk.startsWith('```'))return '<pre><code>'+esc(chunk.replace(/^```[^\n]*\n?/, '').replace(/```$/,''))+'</code></pre>';return chunk.split(/(!\[[^\]]*\]\(https:\/\/[^)]+\))/g).map(part=>{const m=part.match(/^!\[([^\]]*)\]\((https:\/\/[^)]+)\)$/);if(m){if(seen.has(m[2]))return '';seen.add(m[2]);const image=q?.images?.find(i=>i.url===m[2]);return image?'<figure><img class="source-image" src="'+esc(image.local)+'" alt="'+esc(image.alt)+'"><figcaption class="small muted">設問のデータ表</figcaption></figure>':'<p>画像は原資料を参照してください。</p>';}return inline(part).replace(/\n/g,'<br>');}).join('');}).join('');}
function button(t,attrs='',primary=false){return '<button '+attrs+' class="'+(primary?'primary':'')+'">'+esc(t)+'</button>';}
function tickTime(){if(!timing)return;const s=state.sessions[timing.key];if(!s){timing=null;return;}const now=Date.now();if(!document.hidden)s.timesMs[timing.id]=(s.timesMs[timing.id]||0)+Math.min(Math.max(0,now-timing.at),5000);timing.at=now;}
function leave(){tickTime();timing=null;activeKey=null;save();}
function navigate(v){leave();view=v;document.querySelectorAll('[data-nav]').forEach(b=>b.classList.toggle('selected',b.dataset.nav===v));({home,study,analytics,history,records,drills:study}[v]||home)();}
function resultAnswer(a,id){return a.review?a.review.events.find(e=>e.questionId===id)?.answer:a.answers[id];}
function score(a,map=Q){const ids=a.ids.filter(id=>map[id]&&!map[id].grading_hold);return {n:ids.length,c:ids.filter(id=>LearningEngine.isCorrect(resultAnswer(a,id),map[id])).length,held:a.ids.length-ids.length,answered:ids.filter(id=>own(a.answers,id)).length};}
function exposure(a){const x={first:{n:0,c:0},repeat:{n:0,c:0},unknown:{n:0,c:0},unshown:{n:0,c:0}};for(const id of a.ids){if(!Q[id]||Q[id].grading_hold)continue;const shown=own(a.shown||{},id)||own(a.answers,id),key=!shown?'unshown':a.exposedBefore?.[id]===false?'first':a.exposedBefore?.[id]===true?'repeat':'unknown';x[key].n++;x[key].c+=LearningEngine.isCorrect(resultAnswer(a,id),Q[id]);}return x;}
function archiveEntries(){return Object.entries(StudyLibrary.snapshot().banks).filter(([id])=>id!==NEW_BANK).map(([id,b])=>{const data=id==='spark'?{...SPARK_QUESTION_BANK,exams:[...SPARK_QUESTION_BANK.exams,...STUDY_BUNDLED_BANKS.filter(x=>x.id===StudyLibrary.LEGACY_M5).flatMap(x=>x.exams),...SPARK_PRIORITY_EXAMS],additional:SPARK_ADDITIONAL_QUESTIONS.questions}:b.data;const engine=LearningEngine.makeEngine(data);return {id,data,engine,state:b.state};});}
function historicDomains(){return {};}

function recommendations(){const old=historicDomains(),st=E.buildStats(state),rows=Object.keys(PLAN.quotas).map(d=>{const qs=E.allQuestions.filter(q=>q.domain===d&&!q.grading_hold),answered=qs.map(q=>st.questions[q.id]).filter(s=>s.answered),n=answered.reduce((a,s)=>a+s.answered,0),w=answered.reduce((a,s)=>a+s.wrong,0),prior=old[d];return {domain:d,value:n?w/n*n/(n+5):prior?((prior.n-prior.c)/prior.n)*Math.min(1,prior.ids.size/10):(['Architecture','Tuning'].includes(d)?.3:.1),source:n?'模試4・自作の解答履歴':prior?'以前の教材の履歴':'初期の学習順'};});return rows.sort((a,b)=>b.value-a.value);}
function currentStats(scope='mock'){
 const stats=E.buildStats(state),allowed=new Set(scope==='all'?PLAN.new_question_ids:PLAN.mock_question_ids);
 return E.allQuestions.filter(q=>allowed.has(q.id)&&!q.grading_hold).map(q=>({q,s:stats.questions[q.id]}));
}
function questionLabel(q){return '模試'+Number(q.id.split('-B')[1].slice(0,3))+' · 問'+q.number;}

function orderedOptions(q,order){return Array.isArray(order)&&order.length===q.options.length?order:q.options.map((_,i)=>i);}
function cleanChoiceLabel(value,index){
 const letter=String.fromCharCode(65+index);
 return String(value).replace(new RegExp('^\\s*'+letter+'[.．)）]\\s*'),'').replace(new RegExp('^(\\s*```[^\\n]*\\n\\s*)'+letter+'[.．)）]\\s*'),'$1');
}
function optionText(q,i){return cleanChoiceLabel(q.options[i],i);}
function questionLanguage(){return state.settings.questionLanguage==='en'?'en':'ja';}
function questionStem(q){return questionLanguage()==='ja'?q.stem_ja:q.stem;}

function optionContent(q,i,position=i){return '<b class="option-letter">'+String.fromCharCode(65+position)+'.</b> '+md(questionLanguage()==='ja'?cleanChoiceLabel(q.options_ja[i],i):optionText(q,i),q);}

function displayLetters(indexes,order){return letters(indexes.map(i=>order.indexOf(i)).filter(i=>i>=0).sort((a,b)=>a-b));}
function selectionMessage(q,selected,answered){return !answered&&E.correctIndexes(q).length>1?selected.length+' / '+E.correctIndexes(q).length+' 選択':'';}
function recordSelection(s,q,values){
 const count=E.correctIndexes(q).length,multi=count>1;
 const selected=[...new Set(values)].filter(i=>Number.isInteger(i)&&i>=0&&i<q.options.length).sort((a,b)=>a-b);
 if(selected.length)s.draftAnswers[q.id]=multi?selected:selected[0];else delete s.draftAnswers[q.id];
 if(selected.length!==count){if(!s.review){delete s.answers[q.id];delete s.answeredAt?.[q.id];}return false;}
 const answer=multi?selected:selected[0];
 tickTime();
 if(s.review){if(!E.commitReviewAnswer(state,activeKey,answer))return false;}
 else{s.answers[q.id]=answer;s.answeredAt??={};s.answeredAt[q.id]=Date.now();delete s.draftAnswers[q.id];}
 return true;
}
function scrollToFeedback(s,q){
 const key=activeKey;
 // Wait for the new view, browser focus handling and reading controls to settle.
 requestAnimationFrame(()=>requestAnimationFrame(()=>{
  if(activeKey!==key||state.sessions[key]!==s||s.ids[s.pos]!==q.id)return;
  const panel=$('#instantFeedback');
  if(!panel?.isConnected||panel.dataset.questionId!==q.id)return;
  panel.focus({preventScroll:true});
  panel.scrollIntoView({block:'start',behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
 }));
}
function questionNavState(s,id){
 if(!own(s.answers,id))return {className:'',label:'未回答'};
 if(!s.immediateFeedback)return {className:'done',label:'回答済み'};
 if(Q[id].grading_hold)return {className:'done',label:'採点保留'};
 return E.isCorrect(s.answers[id],Q[id])?{className:'done nav-correct',label:'正解'}:{className:'done nav-wrong',label:'不正解'};
}
function sessionAccuracy(s){
 const answers=s.review?s.review.events.reduce((out,event)=>{if(!own(out,event.questionId))out[event.questionId]=event.answer;return out;},{}):s.answers;
 const ids=s.ids.filter(id=>own(answers,id)&&Q[id]&&!Q[id].grading_hold);
 return {correct:ids.filter(id=>E.isCorrect(answers[id],Q[id])).length,answered:ids.length};
}
function sessionAccuracyContent(s){
 const label=s.review?'初回正答率':'正答率';
 if(!s.immediateFeedback)return '<b>'+label+'</b><span class="small muted">提出後に表示</span>';
 const result=sessionAccuracy(s);
 return '<b>'+label+' '+pct(result.correct,result.answered)+'</b><span class="small muted">正解 '+result.correct+' / 回答 '+result.answered+'問</span>';
}
function questionGrid(s){
 return s.ids.map((id,i)=>{const status=questionNavState(s,id);return '<button data-pos="'+i+'" class="'+(i===s.pos?'active ':'')+status.className+'" aria-label="'+(i+1)+'問目 '+status.label+'" title="'+status.label+'">'+(i+1)+'</button>';}).join('');
}
function syncQuestionProgress(s){
 $('#answeredCount').textContent='回答済み '+Object.keys(s.answers).length+'/'+s.ids.length+'問';
 $('#sessionAccuracy').innerHTML=sessionAccuracyContent(s);
 app.querySelectorAll('[data-pos]').forEach(b=>{
  const pos=Number(b.dataset.pos),status=questionNavState(s,s.ids[pos]);
  for(const name of ['done','nav-correct','nav-wrong'])b.classList.toggle(name,status.className.split(' ').includes(name));
  b.setAttribute('aria-label',(pos+1)+'問目 '+status.label);b.setAttribute('title',status.label);
 });
}

function bindAnswerSelection(s,q){
 const field=$('#answers'),multi=E.correctIndexes(q).length>1;
 const updateLimit=()=>{const selected=[...field.querySelectorAll('input:checked')];if(multi&&!field.disabled)field.querySelectorAll('input').forEach(input=>input.disabled=!input.checked&&selected.length>=E.correctIndexes(q).length);};
 updateLimit();
 field.onchange=()=>{
  if(state.sessions[activeKey]!==s||s.ids[s.pos]!==q.id||s.review?.pending||(!s.review&&s.immediateFeedback&&own(s.answers,q.id)))return;
  const selected=[...field.querySelectorAll('input:checked')].map(input=>Number(input.value));
  const complete=recordSelection(s,q,selected);save();
  if(complete){renderQuestion();if(s.immediateFeedback)scrollToFeedback(s,q);return;}
  field.querySelectorAll('.option').forEach(label=>label.classList.toggle('chosen',label.querySelector('input').checked));
  updateLimit();$('#selectionState').textContent=selectionMessage(q,selected,false,s.immediateFeedback);$('#selectionState').hidden=!multi;
  if(!s.review)syncQuestionProgress(s);
 };
}
function originalIds(){return PLAN.retained_question_ids||PLAN.source_question_ids||E.allQuestions.filter(q=>q.number).map(q=>q.id);}
function ensureSettings(){state.settings??={};const previous=StudyLibrary.snapshot().banks.spark?.state?.settings||{};if(StudyPlanner.restoreSettings(state.settings,previous))save();}
function reviewStudyPanel(){
 const stats=E.buildStats(state),all=StudyPlanner.reviewAll(E,state,DATA,PLAN,Date.now(),stats),running=state.sessions[REVIEW_KEY];
 return `<section class="card"><h3>対象がなくなるまで復習</h3><p class="small muted">DE Proの339問から、復習期限を迎えた問題と未克服の苦手問題だけを出題します。未見問題は含みません。</p><p>${running?'途中の復習：残り '+running.review.queue.length+'問':'現在の対象 '+all.ids.length+'問 · 期限復習 '+all.counts.due+' / 苦手 '+all.counts.wrong}</p>${button(running?'続きから':'まとめて復習を始める',`data-review-all ${all.ids.length||running?'':'disabled'}`,true)}<p class="small muted">誤答は同じセッションの後ろへ自動で戻ります。正解すると今回の復習を完了します。時間制限はなく、中断・再開できます。</p></section>`;
}

function home(){
 ensureSettings();view='home';
 const qs=currentStats(),seen=qs.filter(x=>x.s.seen).length,done=qs.filter(x=>x.s.answered).length,wrong=qs.filter(x=>x.s.unresolved).length;
 app.innerHTML=`<section class="card"><div class="eyebrow">DE PRO · MOCK EXAMS 1–6</div><h2>339問を、日本語で演習する</h2><p>模試1〜5は各60問、模試6は39問。受け取った全問を収録し、問題文・選択肢の条件を保って日本語訳を付けました。</p><p class="small muted">英語でも出題できます。回答後は原文・日本語訳・要点と、各選択肢の理由を表示します。元の模試の構成を保持しており、各回の分野比率を公式比率にそろえた再編ではありません。</p><div class="metrics"><div><b>339</b><span>収録問題 / 6つの模試</span></div><div><b>${done}</b><span>回答済みの異なる問題</span></div><div><b>${qs.length-seen}</b><span>未表示の問題</span></div><div><b>${wrong}</b><span>未克服の誤答</span></div></div><div class="toolbar">${button('60問ランダム演習','id="randomMock"',true)}${button('対象がなくなるまで復習','data-nav="study"')}${button('全339問を演習','id="startAll"')}</div><p class="small muted">必要な訂正は各問の解説から確認できます。複数選択は指定数をすべて正しく選ぶと正解です。</p></section>${resumePanel()}${reviewStudyPanel()}<h3 class="section-title">模試1〜6</h3><div class="grid form-grid">${PLAN.forms.map(f=>{const h=state.attempts.filter(a=>a.key===f.id),last=h.at(-1),s=last?score(last):null;return `<section class="card"><div class="eyebrow">PRACTICE ${esc(f.letter)}</div><h3>${esc(f.title)}</h3><p>${f.ids.length}問 · ${state.settings.timeLimit===false?'時間制限なし':f.minutes+'分'}</p><p class="small muted">${s?'直近 '+s.c+'/'+s.n+' · '+h.length+'回実施':'未実施'}</p>${button(state.sessions[f.id]?'続きから':'開始する',`data-form="${f.id}"`,true)}</section>`;}).join('')}</div><section class="card settings"><h3>出題の設定</h3><label>出題言語 <select id="questionLanguage"><option value="ja" ${questionLanguage()==='ja'?'selected':''}>日本語</option><option value="en" ${questionLanguage()==='en'?'selected':''}>English</option></select></label><label><input id="timeLimit" type="checkbox" ${state.settings.timeLimit!==false?'checked':''}> 模試の時間制限を使う</label><label><input id="instant" type="checkbox" ${state.settings.immediateFeedback!==false?'checked':''}> 選択後すぐに正解・解説を表示</label><label><input id="shuffleQ" type="checkbox" ${state.settings.shuffleQuestions!==false?'checked':''}> 問題順を毎回シャッフル</label><label><input id="shuffleO" type="checkbox" ${state.settings.shuffleOptions!==false?'checked':''}> 選択肢を毎回シャッフル</label><p class="small muted">時間制限・即時解説・シャッフルは、新しく始める演習に適用します。</p></section>`;
 $('#startAll').onclick=()=>begin({key:PLAN.source_practice_key,title:'DE Pro 全339問',ids:originalIds(),minutes:0,allowHeld:true});
 $('#randomMock').onclick=startRandom;
 for(const [id,key]of [['timeLimit','timeLimit'],['instant','immediateFeedback'],['shuffleQ','shuffleQuestions'],['shuffleO','shuffleOptions']])$('#'+id).onchange=e=>{state.settings[key]=e.target.checked;save();home();};
 $('#questionLanguage').onchange=e=>{state.settings.questionLanguage=e.target.value;save();};
 bindCommon();
}

function resumePanel(){return `<section class="card"><h3>途中の演習</h3>${Object.entries(state.sessions).map(([k,s])=>`<div class="history-row"><span>${esc(s.title)} · ${s.review?'残り'+s.review.queue.length+'問 / 回答'+s.review.events.length+'回':'回答済み'+Object.keys(s.answers).length+'/'+s.ids.length+'問'}${Object.keys(s.draftAnswers||{}).length?' · 選択途中あり':''}</span>${button('続きから',`data-resume="${esc(k)}"`)}${button('一覧から外す',`data-remove="${esc(k)}"`)}</div>`).join('')||'<p class="muted">途中の演習はありません。</p>'}${Object.keys(state.sessionTrash||{}).length?`<details><summary>外した演習を復元</summary>${Object.entries(state.sessionTrash).map(([id,s])=>`<p>${esc(s.title)} ${button('復元',`data-restore="${esc(id)}"`)}</p>`).join('')}</details>`:''}</section>`;}
function bindCommon(){app.querySelectorAll('[data-review-all]').forEach(b=>b.onclick=()=>{const p=StudyPlanner.reviewAll(E,state,DATA,PLAN);begin({key:REVIEW_KEY,title:'対象がなくなるまで復習',ids:p.ids,minutes:0,mode:'review-all',review:true});});app.querySelectorAll('[data-nav]').forEach(b=>b.onclick=()=>navigate(b.dataset.nav));app.querySelectorAll('[data-resume]').forEach(b=>b.onclick=()=>resume(b.dataset.resume));app.querySelectorAll('[data-remove]').forEach(b=>b.onclick=()=>{const k=b.dataset.remove,s=state.sessions[k];state.settings['session-deleted:'+s.id]=true;state.sessionTrash[s.id]=s;delete state.sessions[k];save();home();});app.querySelectorAll('[data-restore]').forEach(b=>b.onclick=()=>{const id=b.dataset.restore,s=state.sessionTrash[id];state.settings['session-deleted:'+id]=false;if(state.sessions[s.key])s.key='restored-'+Date.now();state.sessions[s.key]=s;delete state.sessionTrash[id];save();home();});app.querySelectorAll('[data-form]').forEach(b=>b.onclick=()=>{const f=PLAN.forms.find(f=>f.id===b.dataset.form);begin({key:f.id,title:f.title,ids:f.ids,minutes:f.minutes});});app.querySelectorAll('[data-source-set]').forEach(b=>b.onclick=()=>{const e=DATA.exams.find(e=>e.id===b.dataset.sourceSet);begin({key:e.id,title:e.title,ids:e.questions.map(q=>q.id),minutes:0,allowHeld:true});});app.querySelectorAll('[data-domain]').forEach(b=>b.onclick=()=>begin({key:'domain-'+Date.now(),title:b.dataset.domain+' · DE Pro演習',ids:StudyPlanner.eligible(E,DATA,PLAN).filter(q=>q.domain===b.dataset.domain).map(q=>q.id),minutes:0}));}
function shuffle(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function startRandom(){
 const ids=shuffle(StudyPlanner.eligible(E,DATA,PLAN)).slice(0,60).map(q=>q.id);
 begin({key:'depro-random-'+Date.now(),title:'DE Pro 60問ランダム演習',ids,minutes:120});
}

function begin(c){ensureSettings();let config;try{config=StudyPlanner.sessionConfig(E,DATA,PLAN,state.settings,c);}catch(e){notice(e.message);return;}if(state.sessions[c.key])return resume(c.key);if(!config.ids.length){notice('該当する問題がありません。');return;}leave();E.newSession(state,config);activeKey=c.key;view='question';save();renderQuestion();document.querySelector('.question-card')?.scrollIntoView({block:'start'});}
function resume(k){const existing=state.sessions[k];if(!existing)return;try{StudyPlanner.sessionConfig(E,DATA,PLAN,state.settings,{...existing,allowHeld:true});}catch(e){notice(e.message);return;}leave();const s=state.sessions[k];if(!s.review&&(s.mode==='short'||/^review-|^retry-/.test(s.key)))E.enableReview(state,k);if(state.settings.timeLimit===false)s.deadline=null;activeKey=k;view='question';save();renderQuestion();document.querySelector('.question-card')?.scrollIntoView({block:'start'});clockTick();}
function renderQuestion(){
 const s=state.sessions[activeKey];if(!s)return home();if(s.review)return renderReviewQuestion(s);
 tickTime();timing=null;
 const q=Q[s.ids[s.pos]];E.markShown(state,s,q.id);s.draftAnswers??={};
 if(own(s.draftAnswers,q.id)&&!(s.immediateFeedback&&own(s.answers,q.id))){const draft=s.draftAnswers[q.id];recordSelection(s,q,Array.isArray(draft)?draft:[draft]);}
 const answered=own(s.answers,q.id),locked=answered&&s.immediateFeedback;
 const value=own(s.draftAnswers,q.id)?s.draftAnswers[q.id]:s.answers[q.id];
 const selected=Array.isArray(value)?value:value===undefined?[]:[value],multi=E.correctIndexes(q).length>1,order=orderedOptions(q,s.optionOrders?.[q.id]);
 app.innerHTML=`<div class="main"><section class="card question-card"><div class="eyebrow">${esc(s.title)} · ${s.pos+1}/${s.ids.length} · ${esc(questionLabel(q))}</div><div class="question-meta"><span class="badge">${multi?'複数選択 · '+E.correctIndexes(q).length+'つ選択':'単一選択'}</span><span class="small muted">${esc(q.domain)} · ${esc(q.id)}</span></div><p class="small muted">${esc(PLAN.assumptions)}</p><div class="question source-markdown" lang="${questionLanguage()}">${md(questionStem(q),q)}</div><fieldset id="answers" ${locked?'disabled':''}><legend class="sr-only">解答の選択</legend>${order.map((i,position)=>`<label class="option ${selected.includes(i)?'chosen':''}"><input type="${multi?'checkbox':'radio'}" name="answer" value="${i}" ${selected.includes(i)?'checked':''}><span lang="${questionLanguage()}">${optionContent(q,i,position)}</span></label>`).join('')}</fieldset><p id="selectionState" class="small muted" role="status" ${answered||!multi?'hidden':''}>${selectionMessage(q,selected,answered,s.immediateFeedback)}</p>${locked?feedback(q,s.answers[q.id],order,true):''}<div class="nav question-actions">${button('前へ','id="prev" '+(s.pos===0?'disabled':''))}${button(s.pos===s.ids.length-1?'提出して結果を見る':'次へ','id="next"',true)}</div></section><aside class="card"><b id="clock">${s.deadline?'':'時間制限なし'}</b><p id="answeredCount">回答済み ${Object.keys(s.answers).length}/${s.ids.length}問</p><div id="sessionAccuracy" class="session-accuracy">${sessionAccuracyContent(s)}</div><div class="qgrid">${questionGrid(s)}</div><div class="toolbar">${button('提出して採点','id="submit"',true)}${button('中断してホームへ','id="pauseSession"')}</div><p class="small muted">複数選択は指定数を選ぶと自動保存し、完全一致で正解です。途中の選択も保存します。${s.immediateFeedback?'採点後は回答を変更できません。':'選び直すときは、先に選択を外してください。指定数に足りない回答は未解答として提出します。'}</p></aside></div>`;
 bindAnswerSelection(s,q);
 $('#prev').onclick=()=>move(-1);$('#next').onclick=()=>s.pos===s.ids.length-1?submit(false):move(1);
 $('#submit').onclick=()=>submit(false);$('#pauseSession').onclick=()=>navigate('home');
 app.querySelectorAll('[data-pos]').forEach(b=>b.onclick=()=>{tickTime();s.pos=Number(b.dataset.pos);renderQuestion();document.querySelector('.question-card')?.scrollIntoView({block:'start'});});
 if(!locked)timing={key:activeKey,id:q.id,at:Date.now()};save();clockTick();
}
function renderReviewQuestion(s){
 tickTime();timing=null;
 const r=s.review,q=Q[s.ids[s.pos]];E.markShown(state,s,q.id);s.draftAnswers??={};
 if(!r.pending&&own(s.draftAnswers,q.id)){const draft=s.draftAnswers[q.id];recordSelection(s,q,Array.isArray(draft)?draft:[draft]);}
 const answered=r.pending,value=answered?s.answers[q.id]:s.draftAnswers[q.id],selected=Array.isArray(value)?value:value===undefined?[]:[value];
 const multi=E.correctIndexes(q).length>1,completed=s.ids.length-r.queue.length,tries=r.events.filter(e=>e.questionId===q.id).length+(answered?0:1),order=orderedOptions(q,s.optionOrders?.[q.id]);
 app.innerHTML=`<div class="main"><section class="card question-card"><div class="eyebrow">${esc(s.title)} · ${esc(questionLabel(q))} · ${tries}回目</div><div class="question-meta"><span class="badge">${multi?'複数選択 · '+E.correctIndexes(q).length+'つ選択':'単一選択'}</span><span class="small muted">${esc(q.domain)} · ${esc(q.id)}</span></div><p class="small muted">${esc(PLAN.assumptions)}</p><div class="question source-markdown" lang="${questionLanguage()}">${md(questionStem(q),q)}</div><fieldset id="answers" ${answered?'disabled':''}><legend class="sr-only">解答の選択</legend>${order.map((i,position)=>`<label class="option ${selected.includes(i)?'chosen':''}"><input type="${multi?'checkbox':'radio'}" name="answer" value="${i}" ${selected.includes(i)?'checked':''}><span lang="${questionLanguage()}">${optionContent(q,i,position)}</span></label>`).join('')}</fieldset><p id="selectionState" class="small muted" role="status" ${answered||!multi?'hidden':''}>${selectionMessage(q,selected,answered,s.immediateFeedback)}</p>${answered&&s.immediateFeedback?feedback(q,s.answers[q.id],order,true):''}<div class="nav question-actions">${button('中断してホームへ','id="pauseSession"')}${button(r.queue.length?'次の復習へ':'完了して結果を見る','id="reviewNext" '+(!answered?'disabled':''),true)}</div></section><aside class="card"><b>復習待ち ${r.queue.length}問</b><p>今回の完了 ${completed}/${s.ids.length}問<br>回答 ${r.events.length}回</p><div id="sessionAccuracy" class="session-accuracy">${sessionAccuracyContent(s)}</div><p id="clock">時間制限なし</p><p class="small muted">間違えた問題は最後に戻ります。選択すると回答を保存し、次へ進めます。中断すると、復習待ち・選択途中・回答の経過を保存します。</p><details><summary>復習待ちの問題</summary><p>${r.queue.map(id=>esc(questionLabel(Q[id]))).join(' → ')||'すべて完了しました。'}</p></details></aside></div>`;
 bindAnswerSelection(s,q);
 $('#pauseSession').onclick=()=>navigate('home');
 $('#reviewNext').onclick=()=>{tickTime();if(E.advanceReview(state,activeKey)){save();renderQuestion();document.querySelector('.question-card')?.scrollIntoView({block:'start'});}else submit(false,true);};
 if(!answered)timing={key:activeKey,id:q.id,at:Date.now()};save();clockTick();
}
function move(n){const s=state.sessions[activeKey];tickTime();s.pos+=n;renderQuestion();document.querySelector('.question-card')?.scrollIntoView({block:'start'});}
function feedback(q,answer,rawOrder,instant=false){
 const chosen=Array.isArray(answer)?answer:answer===undefined?[]:[answer],correct=E.correctIndexes(q),order=orderedOptions(q,rawOrder);
 const f=SPARK_FEEDBACK_JA[q.id],stem=f?.stem||q.stem_ja||q.stem,explanation=f?.explanation||q.explanation_ja;
 const refs=[...new Set(q.revision?.sources?.length?q.revision.sources:q.references?.length?q.references:[q.source_url])].filter(u=>/^https:\/\//.test(u));
 return `<section class="explain answer-feedback" data-question-id="${esc(q.id)}" ${instant?'id="instantFeedback" tabindex="-1"':''} aria-label="回答解説"><h3 class="feedback-result ${E.isCorrect(answer,q)?'good':'bad'}">${q.grading_hold?'採点保留':answer===undefined?'未解答':E.isCorrect(answer,q)?'正解':'不正解'} · 正答 ${displayLetters(correct,order)}</h3><p class="small muted">あなたの回答：${chosen.length?displayLetters(chosen,order):'未解答'}</p>${q.grading_hold?'<p class="notice">'+esc(q.grading_hold)+'</p>':''}<h4>問題文</h4><div class="original-stem source-markdown" lang="en">${md(q.stem,q)}</div><h4>問題文の日本語訳</h4><div class="translated-stem" lang="ja">${md(stem,q)}</div><h4>解説</h4><p class="exam-reasoning" lang="ja">${esc(explanation)}</p><div class="option-explanations">${order.map((i,position)=>`<section class="option-explanation ${correct.includes(i)?'is-correct':''}"><h5>${String.fromCharCode(65+position)}. 選択肢 <span class="option-verdict">${correct.includes(i)?'正答':'不正解'}${chosen.includes(i)?' · あなたの選択':''}</span></h5><div class="original-option-text source-markdown" lang="en">${md(optionText(q,i),q)}</div><h6>選択肢の日本語訳</h6><div class="translated-option-text" lang="ja">${md(cleanChoiceLabel(f?.options[i]||q.options_ja?.[i]||optionText(q,i),i),q)}</div><h6>選択肢の解説</h6><p class="option-reason" lang="ja">${esc(f?.reasons[i]||q.distractors_ja?.[i]||'')}</p></section>`).join('')}</div><details class="answer-references"><summary>公式の確認先・原資料</summary><div class="toolbar">${refs.map((u,i)=>'<a href="'+esc(u)+'" target="_blank" rel="noopener noreferrer">公式参照 '+(i+1)+'</a>').join('')}</div>${q.revision&&typeof q.revision==='object'?`<details><summary>問題の訂正履歴</summary><p>${esc(q.revision.reason)}</p><p class="small">訂正前の正解キー（原資料の記号）：${esc(q.revision.original_correct.join('・'))} / 訂正 ${esc(q.revision.id)}</p><div lang="en">${md(q.revision.original_stem,q)}${q.revision.original_options.map(o=>'<p>'+md(o,q)+'</p>').join('')}</div></details>`:''}${q.source_explanation?`<details><summary>原資料の詳細解説（英語・記号は原資料のまま）</summary><div lang="en">${md(q.source_explanation,q)}</div>${q.source_option_explanations?.map((x,i)=>`<details><summary>原資料の選択肢 ${String.fromCharCode(65+i)}</summary>${md(x,q)}</details>`).join('')||''}</details>`:''}<p class="small muted">${esc(q.validation)}</p></details></section>`;
}
function clockTick(){if(!activeKey)return;const s=state.sessions[activeKey];if(!s)return;if(s.deadline){const n=Math.max(0,Math.ceil((s.deadline-Date.now())/1000));if($('#clock'))$('#clock').textContent=Math.floor(n/60)+':'+String(n%60).padStart(2,'0');if(n===0)submit(true);}else if($('#clock'))$('#clock').textContent='時間制限なし';}
setInterval(()=>{tickTime();clockTick();if(activeKey)save();},1000);
document.addEventListener('visibilitychange',()=>{tickTime();if(timing)timing.at=Date.now();save();});
function submit(auto,confirmed=false){const s=state.sessions[activeKey];if(!s)return;if(!auto&&!confirmed){if($('#submitDialog'))return;const k=activeKey,dialog=document.createElement('dialog');dialog.id='submitDialog';dialog.innerHTML=`<h2>提出して採点しますか？</h2><p>未解答 ${s.ids.length-Object.keys(s.answers).length}問。複数選択で指定数に足りない回答は、未解答として採点します。</p><div class="toolbar">${button('戻る','id="cancelSubmit"')}${button('提出を確定','id="confirmSubmit"',true)}</div>`;document.body.append(dialog);$('#cancelSubmit').onclick=()=>dialog.close();$('#confirmSubmit').onclick=()=>{dialog.close();if(activeKey===k)submit(false,true);};dialog.onclose=()=>dialog.remove();dialog.showModal();return;}$('#submitDialog')?.close();tickTime();timing=null;const a=E.finish(state,activeKey,auto);save();activeKey=null;view='result';showResult(a);if(auto)notice('制限時間になったため自動提出しました。');}
function review(a,filter='needs'){
 return a.ids.filter(id=>Q[id]).filter(id=>filter==='all'||filter==='held'?filter==='all'||!!Q[id].grading_hold:!Q[id].grading_hold&&!E.isCorrect(resultAnswer(a,id),Q[id])).map(id=>{
  const q=Q[id],ans=resultAnswer(a,id);
  const events=a.review?'<p class="small">回答の経過：'+a.review.events.filter(e=>e.questionId===id).map((e,i)=>(i+1)+'回目 '+displayLetters(Array.isArray(e.answer)?e.answer:[e.answer],orderedOptions(q,a.optionOrders?.[id]))+'（'+(E.isCorrect(e.answer,q)?'正解':'不正解')+'）').join(' → ')+'</p>':'';
  return `<details class="review"><summary>${esc(questionLabel(q))} · ${a.review?'初回 ':''}${q.grading_hold?'採点保留':ans===undefined?'未解答':E.isCorrect(ans,q)?'正解':'不正解'} · ${esc(q.topic)}</summary>${events}${feedback(q,ans,a.optionOrders?.[id])}</details>`;
 }).join('')||'<p>該当する問題はありません。</p>';
}
function showResult(a){tickTime();timing=null;activeKey=null;view='result';const s=score(a),x=exposure(a);app.innerHTML=`<section class="card"><div class="eyebrow">${date(a.date)}</div><h2>${esc(a.title)}${a.review?' · 復習完了':' · '+s.c+'/'+s.n}</h2><div class="score">${a.review?'初回 '+s.c+'/'+s.n:pct(s.c,s.n)}</div>${a.review?'<p>全'+s.n+'問を正解まで復習しました。回答'+a.review.events.length+'回 / 再出題'+(a.review.events.length-s.n)+'回。最初の誤答も学習分析に残しています。以下は初回回答の成績と解説です。</p>':''}<p>初見 ${x.first.c}/${x.first.n} · 既出 ${x.repeat.c}/${x.repeat.n} · 初見不明 ${x.unknown.c}/${x.unknown.n} · 未表示 ${x.unshown.n}問</p><p class="small muted">採点対象${s.n}問${s.held?' / 保留'+s.held+'問を除外':''}。複数選択は全正解の完全一致。同一問題の反復成績は初見と区別し、合格確率には変換しません。</p><div class="toolbar">${button('今回の誤答を復習','id="retryAttempt"',true)}${button('学習分析','data-nav="analytics"')}</div><label>解説の表示<select id="reviewFilter"><option value="needs">誤答・未解答</option><option value="all">全問</option><option value="held">採点保留</option></select></label><div id="reviews">${review(a)}</div></section>`;$('#reviewFilter').onchange=()=>{$('#reviews').innerHTML=review(a,$('#reviewFilter').value);};$('#retryAttempt').onclick=()=>begin({key:'retry-'+Date.now(),title:'今回の誤答・未解答',ids:a.ids.filter(id=>!Q[id].grading_hold&&!E.isCorrect(resultAnswer(a,id),Q[id])),minutes:0,review:true});bindCommon();}
function study(){
 view='study';ensureSettings();const rows=currentStats();
 app.innerHTML=reviewStudyPanel()+`<section class="card"><h2>DE Proの339問から選ぶ</h2><div class="toolbar">${button('未克服の誤答','id="wrongOnly"',true)}${button('まだ表示していない問題','id="unseenOnly"')}${button('復習期限を迎えた問題','id="dueOnly"')}</div><h3>分野から選ぶ</h3><div class="toolbar">${Object.keys(PLAN.quotas).map(d=>button(d+' · '+rows.filter(x=>x.q.domain===d).length+'問',`data-domain="${esc(d)}"`)).join('')}</div><p class="small muted">分野は学習のための整理です。公式の問題別分類ではありません。</p></section>`;
 for(const [id,test,title]of [['wrongOnly',x=>x.s.unresolved,'未克服の誤答'],['unseenOnly',x=>!x.s.seen,'未表示の問題'],['dueOnly',x=>x.s.dueAt&&x.s.dueAt<=Date.now(),'期限復習']])$('#'+id).onclick=()=>begin({key:'review-'+Date.now(),title:'DE Pro · '+title,ids:rows.filter(test).sort((a,b)=>(b.s.priority||0)-(a.s.priority||0)).map(x=>x.q.id),minutes:0,review:true});
 bindCommon();
}

function analytics(){
 view='analytics';const rows=currentStats('all');
 app.innerHTML=`<section class="card"><h2>DE Proの学習分析</h2><div class="table-wrap"><table><thead><tr><th>分野</th><th>収録数</th><th>正答 / 回答</th><th>回答済みの問題数</th></tr></thead><tbody>${Object.keys(PLAN.quotas).map(d=>{const r=rows.filter(x=>x.q.domain===d),n=r.reduce((a,x)=>a+x.s.answered,0),c=r.reduce((a,x)=>a+x.s.correct,0);return `<tr><td>${esc(d)}</td><td>${r.length}</td><td>${c}/${n} · ${pct(c,n)}</td><td>${r.filter(x=>x.s.answered).length}</td></tr>`;}).join('')}</tbody></table></div><p class="small muted">模試・分野別演習・復習の履歴を共有します。回答回数と、回答した異なる問題数は別です。</p></section>`;
}

function history(){view='history';const old=archiveEntries();app.innerHTML=resumePanel()+`<section class="card"><h2>DE Proの学習履歴</h2>${state.attempts.slice().reverse().map(a=>{const s=score(a);return `<div class="history-row"><span><b>${esc(a.title)}</b><br><small>${date(a.date)}</small></span><span>${a.review?'初回 ':''}${s.c}/${s.n} · ${pct(s.c,s.n)}</span>${button('解説を見る',`data-result="${esc(a.id)}"`)}</div>`;}).join('')||'<p>提出済みの記録はありません。</p>'}</section><section class="card"><h2>以前の学習履歴</h2><p class="small muted">ほかの問題集の成績も保持しています。Sparkの演習は上の問題集リンクから開けます。</p>${old.map(b=>`<details><summary>${esc(b.data.title||b.id)} · 完了${b.state.attempts.length}件 / 途中${Object.keys(b.state.sessions).length}件 / 補強記録${Object.keys(b.state.drills||{}).length}件</summary>${b.state.attempts.slice().reverse().map(a=>`<details class="review"><summary>${date(a.date)} · ${esc(a.title||a.exam)} · ${a.correct}/${a.total}</summary><p>経過時間 ${Math.round(a.elapsedSeconds||0)}秒。問題ID・選択肢番号は当時の記録です。</p><div class="table-wrap"><table><thead><tr><th>問題ID</th><th>回答番号</th><th>時間</th></tr></thead><tbody>${a.ids.map(id=>`<tr><td>${esc(id)}</td><td>${a.answers[id]===undefined?'未解答':letters(Array.isArray(a.answers[id])?a.answers[id]:[a.answers[id]])}</td><td>${a.timesMs?.[id]===undefined?'—':Math.round(a.timesMs[id]/1000)+'秒'}</td></tr>`).join('')}</tbody></table></div></details>`).join('')||'<p>提出記録なし</p>'}${Object.values(b.state.sessions).map(s=>`<p>途中：${esc(s.title)} · 回答${Object.keys(s.answers).length}/${s.ids.length}問（保存済み）</p>`).join('')}</details>`).join('')}</section>`;bindCommon();app.querySelectorAll('[data-result]').forEach(b=>b.onclick=()=>showResult(state.attempts.find(a=>a.id===b.dataset.result)));}
function exportSnapshot(){const snapshot=StudyLibrary.snapshot();snapshot.banks[StudyLibrary.active].state=E.normalizeState(state);return snapshot;}
function download(value,name){const a=document.createElement('a'),url=URL.createObjectURL(new Blob([JSON.stringify(value,null,2)],{type:'application/json'}));a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);}
function records(){
 view='records';app.innerHTML=`<section class="card"><h2>記録の保存・復元</h2>${StudyLibrary.error?'<p class="notice">'+esc(StudyLibrary.error)+'</p>':''}<div class="toolbar">${button('全問題集・履歴を保存','id="exportAll"',true)}${button('DE Pro教材を保存','id="exportBank"')}</div><label class="file-button">バックアップJSONを統合<input type="file" id="importRecords" accept="application/json,.json"></label><p id="importStatus" role="status"></p><p class="small muted">SparkとDE Proの履歴をそれぞれ保持します。Googleログインと自動同期は共通です。</p></section><section class="card"><h3>教材の参照</h3><p>受け取った339問をすべて収録し、元の模試1〜6の区分を保持しています。問題文と選択肢の条件を保って訳し、解説と選択肢ごとの理由を日本語で整理しました。必要な訂正の前の文面と正解は、各問の解説から確認できます。</p><p><a href="${esc(PLAN.official_guide.url)}" target="_blank" rel="noopener noreferrer">公式試験ガイド（英語）</a> · <a href="${esc(PLAN.official_guide.ja_url)}" target="_blank" rel="noopener noreferrer">公式試験ガイド（日本語）</a></p><p class="small muted">日本語ガイドは2026年11月19日までの現行試験と11月20日以降の新試験を区別しています。教材は両版に関連する問題を含み、訳語は公式の日英表記を参考にしています。公式の翻訳教材ではありません。</p></section>`;
 $('#exportAll').onclick=()=>{save();download(exportSnapshot(),'全問題集・学習履歴.json');};
 $('#exportBank').onclick=()=>download(DATA,'DE-Pro-339問-日本語付き.json');
 $('#importRecords').onchange=async e=>{const f=e.target.files[0];if(!f)return;try{if(f.size>20*1024*1024)throw Error('上限20MBです');const raw=JSON.parse(await f.text());let incoming=raw;if(raw.schema!=='study-library-v1'){const found=['local','cloud','import'].map(k=>raw[k]).filter(x=>x?.schema==='study-library-v1');if(found.length)incoming=found.reduce((a,b)=>StudyLibrary.merge(null,a,b).value);else incoming=raw.local||raw;}const local=StudyLibrary.snapshot(),merged=StudyLibrary.merge(null,local,incoming);StudyStorage.setItem('study-sync-backup',JSON.stringify({local,remote:incoming,at:new Date().toISOString()}));StudyLibrary.accept(merged.value);state=StudyLibrary.state;storageBlocked=!!StudyLibrary.error;window.dispatchEvent(new Event('study-saved'));$('#importStatus').textContent='履歴を統合しました。';}catch(err){$('#importStatus').textContent='復元できません：'+err.message;}e.target.value='';};
}

function drills(){study();}
document.querySelectorAll('nav [data-nav]').forEach(b=>b.onclick=()=>navigate(b.dataset.nav));
window.addEventListener('pagehide',()=>{tickTime();save();});
home();if(StudyLibrary.error)notice('保存記録を保護しています。記録画面から元のデータを書き出してください。');
