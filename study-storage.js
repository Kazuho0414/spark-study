/* Lossless local record compression. Downloaded backups remain ordinary JSON. */
(function(root){
'use strict';
const FORMAT='study-storage-lz-v1', backend=root.localStorage;
const managed=k=>k==='study-library-v1'||k==='study-sync-backup'||/^study-cloud-base:/.test(k)||/^study-mock1to5-backup:(local|cloud|import)$/.test(k)||/^study-(147|abcd)-before-20261025:(local|cloud|import)$/.test(k)||k==='study-exam4-before-20261025'||/^study-recovery-\d+$/.test(k)||/^spark-study-v[12]$/.test(k);
function checksum(value){let hash=2166136261;for(let i=0;i<value.length;i++){hash^=value.charCodeAt(i);hash=Math.imul(hash,16777619);}return (hash>>>0).toString(16);}
function decode(raw){
 if(raw===null)return null;
 let envelope;try{envelope=JSON.parse(raw);}catch{return raw;}
 if(envelope?.schema!==FORMAT)return raw;
 if(envelope.codec!=='lz-string-utf16'||typeof envelope.data!=='string'||!Number.isSafeInteger(envelope.length)||envelope.length<0)throw Error('圧縮保存記録の形式を確認してください。元の記録は保持しています。');
 const value=root.LZString.decompressFromUTF16(envelope.data);
 if(typeof value!=='string'||value.length!==envelope.length||checksum(value)!==envelope.checksum)throw Error('圧縮保存記録を検証できません。元の記録は保持しています。');
 return value;
}
function encode(value){
 if(value.length<512)return value;
 const data=root.LZString.compressToUTF16(value);
 const envelope=JSON.stringify({schema:FORMAT,codec:'lz-string-utf16',length:value.length,checksum:checksum(value),data});
 if(envelope.length>=value.length)return value;
 if(decode(envelope)!==value)throw Error('保存記録の圧縮検証に失敗しました。元の記録は保持しています。');
 return envelope;
}
function getItem(key){return managed(key)?decode(backend.getItem(key)):backend.getItem(key);}
function setItem(key,value){const text=String(value);backend.setItem(key,managed(key)?encode(text):text);}
// Every replacement is atomic and verified. Attempts, sessions and backups are never deleted.
function compactExisting(){
 const keys=Array.from({length:backend.length},(_,i)=>backend.key(i)).filter(k=>k&&managed(k));
 const result={compacted:0,charactersSaved:0,failed:[]};
 keys.sort((a,b)=>(backend.getItem(b)?.length||0)-(backend.getItem(a)?.length||0));
 for(const key of keys){try{
  const raw=backend.getItem(key);if(raw===null||raw.startsWith('{"schema":"'+FORMAT+'"'))continue;
  const packed=encode(decode(raw));
  if(packed.length<raw.length&&backend.getItem(key)===raw){backend.setItem(key,packed);result.compacted++;result.charactersSaved+=raw.length-packed.length;}
 }catch(e){result.failed.push({key,message:e.message});}}
 return result;
}
root.StudyStorage={getItem,setItem,decode,encode,compactExisting};
root.StudyStorage.migration=compactExisting();
})(globalThis);
