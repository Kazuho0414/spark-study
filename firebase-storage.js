/* Firebase adapter. Loaded only after explicit login on an HTTP(S) page. */
(function(root){
  'use strict';
  const SDK='https://www.gstatic.com/firebasejs/12.19.0/';
  root.SparkFirebase = {async connect(config,onUser){
    const [app,authLib,dbLib]=await Promise.all([
      import(SDK+'firebase-app.js'),import(SDK+'firebase-auth.js'),import(SDK+'firebase-firestore.js')
    ]);
    const instance=app.initializeApp(config.firebase),auth=authLib.getAuth(instance),db=dbLib.getFirestore(instance);
    const owner=config.ownerEmail?.trim().toLowerCase();
    async function allowed(user){
      if(!user?.emailVerified||!user.email)return false;
      const email=user.email.toLowerCase();
      if(config.ownerEmailSha256){
        const bytes=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(email));
        return Array.from(new Uint8Array(bytes),x=>x.toString(16).padStart(2,'0')).join('')===config.ownerEmailSha256;
      }
      return email===owner;
    }
    async function check(){
      const user=auth.currentUser;
      if(!await allowed(user)||auth.currentUser!==user)throw Error('本人のGoogleアカウントでログインしてください。');
      return user;
    }
    authLib.onAuthStateChanged(auth,async user=>{
      if(user&&!await allowed(user)){
        await authLib.signOut(auth);onUser(null,'設定された本人以外のアカウントは利用できません。');return;
      }
      if(auth.currentUser===user)onUser(user);
    });
    async function refs(){const user=await check();return {uid:user.uid,meta:dbLib.doc(db,'studyUsers',user.uid,'snapshots','current'),chunk:i=>dbLib.doc(db,'studyUsers',user.uid,'chunks',String(i))};}
    return {
      async login(){const provider=new authLib.GoogleAuthProvider();provider.setCustomParameters({prompt:'select_account'});await authLib.signInWithPopup(auth,provider);await check();},
      logout:()=>authLib.signOut(auth),
      async read(){
        const r=await refs();
        return dbLib.runTransaction(db,async tx=>{
          const meta=await tx.get(r.meta);if(!meta.exists())return {revision:0,text:null};
          const m=meta.data();
          if(m.schema!==1||!Number.isSafeInteger(m.count)||m.count<1||m.count>100)throw Error('クラウドの保存形式を確認してください。');
          const chunks=await Promise.all(Array.from({length:m.count},(_,i)=>tx.get(r.chunk(i))));
          if(chunks.some(x=>!x.exists()||x.data().revision!==m.revision||typeof x.data().text!=='string'))throw Error('クラウド記録が不完全です。');
          if((await check()).uid!==r.uid)throw Error('ログイン状態が変わりました。');
          return {revision:m.revision,text:chunks.map(x=>x.data().text).join('')};
        });
      },
      async write(text,expectedRevision){
        const r=await refs(),chunks=[];
        // 50,000 UTF-16 characters stay comfortably below Firestore's document limit.
        for(let i=0;i<text.length;){let end=Math.min(i+50000,text.length);const c=text.charCodeAt(end-1);if(end<text.length&&c>=0xD800&&c<=0xDBFF)end--;chunks.push(text.slice(i,end));i=end;}
        if(!chunks.length||chunks.length>100)throw Error('クラウド保存の上限（500万文字）です。記録を書き出してください。');
        return dbLib.runTransaction(db,async tx=>{
          const snapshot=await tx.get(r.meta),revision=snapshot.exists()?snapshot.data().revision:0;
          if(revision!==expectedRevision){const error=Error('別の端末の更新があります。再同期します。');error.code='study/conflict';throw error;}
          if((await check()).uid!==r.uid)throw Error('ログイン状態が変わりました。');
          const next=revision+1;
          chunks.forEach((text,i)=>tx.set(r.chunk(i),{revision:next,text}));
          tx.set(r.meta,{schema:1,revision:next,count:chunks.length,updatedAt:dbLib.serverTimestamp()});
          return next;
        });
      }
    };
  }};
})(globalThis);
