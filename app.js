/* Đăng Dũng Life — ứng dụng cá nhân. © 2026 Đăng Dũng. Bảo lưu mọi quyền.
   Không sao chép, phân phối hay sửa đổi khi chưa được phép. */
(()=>{
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const K={pw:'nk_pw',salt:'nk_salt',data:'nk_data',set:'nk_set'};
const MOODS=['😄','🙂','😐','😔','😡'];
const DOW=['T2','T3','T4','T5','T6','T7','CN'];
const DOWL=['Chủ nhật','Thứ hai','Thứ ba','Thứ tư','Thứ năm','Thứ sáu','Thứ bảy'];
const get=(k,d)=>{try{const v=localStorage.getItem(k);return v==null?d:JSON.parse(v)}catch{return d}};
const put=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const pad=n=>String(n).padStart(2,'0');
const key=d=>`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
const parse=k=>{const [y,m,d]=k.split('-').map(Number);return new Date(y,m-1,d)};
const today=()=>key(new Date());
const addDays=(k,n)=>{const d=parse(k);d.setDate(d.getDate()+n);return key(d)};
const diffDays=(a,b)=>Math.round((parse(b)-parse(a))/864e5);
const fmtDM=k=>`${+k.slice(8,10)}/${+k.slice(5,7)}`;
const fmtDMY=k=>`${+k.slice(8,10)}/${+k.slice(5,7)}/${k.slice(0,4)}`;
const range=(a,b)=>Array.from({length:b-a+1},(_,i)=>[String(a+i),String(a+i)]);
const toast=m=>{const t=$('#toast');if(t.classList.contains('upd'))return;t.textContent=m;t.classList.add('on');clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove('on'),2000)};
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,7);
const fmtN=n=>Math.round(+n||0).toLocaleString('vi-VN');
const fmt=n=>fmtN(n)+'đ';
const fmtS=n=>{n=+n||0;const a=Math.abs(n);return a>=1e9?(n/1e9).toFixed(a%1e9?1:0).replace('.',',')+' tỷ':a>=1e6?(n/1e6).toFixed(a%1e6?1:0).replace('.',',')+' tr':a>=1e3?Math.round(n/1e3)+'k':String(Math.round(n))};
function parseMoney(t){
  const s=String(t||'').toLowerCase().replace(/\s|đ|vnd/g,'');if(!s)return 0;
  const m=s.match(/^([\d.,]+)(k|ng|nghìn|tr|triệu|m|ty|tỷ)?$/);if(!m)return 0;
  if(m[2]){const u={k:1e3,ng:1e3,'nghìn':1e3,tr:1e6,'triệu':1e6,m:1e6,ty:1e9,'tỷ':1e9}[m[2]];return Math.round(parseFloat(m[1].replace(',','.'))*u)||0}
  return +m[1].replace(/[.,]/g,'')||0}
const lunarOf=k=>solar2lunar(+k.slice(8,10),+k.slice(5,7),+k.slice(0,4));
const lunarTxt=k=>{const l=lunarOf(k);return `${l.d}/${l.m}${l.leap?' nhuận':''} ${canChiYear(l.y)}`};

/* ---------- các mục trong app ---------- */
const MOD={
  home:{n:'Hôm nay',i:'🏠'},
  cal:{n:'Lịch',i:'📅',c:'#e08a1e'},
  diary:{n:'Nhật ký',i:'📔',c:'#c0623b'},
  task:{n:'Việc cần làm',s:'Việc',i:'✅',c:'#2f6fd6'},
  rem:{n:'Định kỳ',i:'🔁',c:'#d9534f'},
  people:{n:'Người thân',i:'👨‍👩‍👧',c:'#8e5bd6'},
  gio:{n:'Ngày giỗ',s:'Giỗ',i:'🕯️',c:'#8a7552'},
  money:{n:'Tài chính',i:'💰',c:'#2e9e6a'},
  sub:{n:'Gói đăng ký',s:'Gói ĐK',i:'💳',c:'#0f9fb0'},
  habit:{n:'Thói quen',i:'🌱',c:'#5aa02c'},
  vault:{n:'Kho cá nhân',s:'Kho',i:'🗂️',c:'#6b6f7a'},
  more:{n:'Thêm',i:'☰'},
  set:{n:'Cài đặt',i:'⚙️'}};
const TABBABLE=['cal','diary','task','rem','people','gio','money','sub','habit','vault'];
const LBL=[['personal','👤','Cá nhân'],['family','🏠','Gia đình'],['work','💼','Công việc'],['health','💊','Sức khoẻ'],['money','💵','Tài chính'],['bday','🎂','Sinh nhật'],['other','📌','Khác']];
const FREQ=[['day','Hằng ngày'],['week','Hằng tuần'],['month','Hằng tháng'],['year','Hằng năm']];
const CAT_OUT=[['food','🍜','Ăn uống'],['move','⛽','Đi lại'],['home','🏠','Nhà cửa'],['bill','🧾','Hoá đơn'],['shop','🛍️','Mua sắm'],['health','💊','Sức khoẻ'],['family','👨‍👩‍👧','Gia đình'],['edu','📚','Học tập'],['fun','🎉','Giải trí'],['gift','🎁','Hiếu hỉ'],['work','💼','Công việc'],['other','📦','Khác']];
const CAT_IN=[['salary','💼','Lương'],['comm','🤝','Hoa hồng'],['bonus','🎁','Thưởng'],['invest','📈','Đầu tư'],['rent','🏠','Cho thuê'],['other','💵','Khác']];
const TXT=[['out','Chi'],['in','Thu'],['xfer','Chuyển ví'],['lend','Cho vay'],['borrow','Đi vay']];
const VCAT=[['doc','🪪','Giấy tờ'],['warranty','🧾','Bảo hành'],['acct','🏦','Tài khoản'],['card','💳','Thẻ'],['health','💊','Sức khoẻ'],['other','📁','Khác']];
const GREL=['Cụ','Ông','Bà','Bố','Mẹ','Bác','Chú','Cô','Dì','Cậu','Anh','Chị','Em','Con','Họ hàng','Khác'];
const REL=['Bố','Mẹ','Vợ','Con','Anh','Chị','Em','Ông','Bà','Họ hàng','Bạn','Đồng nghiệp','Đối tác','Khác'];
const HICONS=['💧','🏃','📖','🧘','🙏','📞','🥗','😴','💪','🚶','✍️','🌅','🚭','💊','🎯','🧹'];
const HSUG=[['💧','Uống 8 ly nước'],['🏃','Tập thể dục 30 phút'],['📖','Đọc sách 10 trang'],['🧘','Thiền 10 phút'],['📞','Gọi điện cho bố mẹ'],['🚶','Đi bộ 5.000 bước'],['😴','Ngủ trước 23 giờ']];
const lblOf=id=>LBL.find(x=>x[0]===id)||LBL[0];
const catOf=(t,id)=>((t==='in'?CAT_IN:CAT_OUT).find(x=>x[0]===id))||['other','📦','Khác'];

/* ---------- trạng thái ---------- */
let R={};          // mọi bản ghi {id: {k, ...}} — nhật ký không có k
let tombs={};      // bản ghi đã xoá {id: thời điểm}
const SDEF={dark:false,font:16,lock:5,quote:true,remOn:false,remTime:'21:00',tkShow:true,tkOn:true,tkTime:'07:00',tkPre:false,
  tabs:['diary','task','rem'],evTime:'08:00',moon:false,ntf:true,ai:true,aiBrief:true,aiDiary:false};
const HDEF={hero:1,tk:1,today:1,up:1,mini:1,mem:1};
let S=Object.assign({},SDEF,get(K.set,{}));S.home=Object.assign({},HDEF,S.home||{});
if(!Array.isArray(S.tabs)||S.tabs.length!==3)S.tabs=SDEF.tabs.slice();
const saveSet=()=>put(K.set,S);
let view='home',calM=new Date();calM.setDate(1);let selDay=today();
let editDate=null,editKey=null,mood=null,fav=false,curPh=[],addedPh=[],filter='all',readCtx=null;
let taskSeg='today',remLbl='all',moneyTab='ov',moneyM=new Date();moneyM.setDate(1);let vaultCat='all',peopleQ='';
const isDiary=r=>r&&!r.k;
const recs=k=>Object.keys(R).filter(i=>(R[i].k||'diary')===k);
const migrate=o=>{const r={};for(const k in o){const e=o[k];if(/^\d{4}-\d\d-\d\d$/.test(k))r['e'+k.replace(/-/g,'')+'a']=Object.assign({date:k},e);else r[k]=e}return r};
const diaryIds=()=>recs('diary').sort((a,b)=>R[b].date.localeCompare(R[a].date)||(R[b].at||0)-(R[a].at||0));
const dayIds=d=>diaryIds().filter(i=>R[i].date===d);
const IDEAS=['Điều gì làm anh mỉm cười hôm nay?','Hôm nay anh học được điều gì?','Ba điều anh biết ơn hôm nay là gì?','Khoảnh khắc đáng nhớ nhất hôm nay?','Điều gì khiến anh lo lắng, và anh sẽ làm gì với nó?','Nếu được làm lại hôm nay, anh sẽ đổi điều gì?','Anh đã giúp ai hoặc ai đã giúp anh hôm nay?','Mục tiêu của anh cho ngày mai?','Hôm nay anh đã chăm sóc bản thân thế nào?'];

/* ---------- mã hoá (AES-GCM, khoá suy ra từ mật khẩu) ---------- */
const canCrypto=!!(window.crypto&&crypto.subtle);
let KEY=null;
const toB64=buf=>{const a=new Uint8Array(buf);let t='';for(let i=0;i<a.length;i+=0x8000)t+=String.fromCharCode.apply(null,a.subarray(i,i+0x8000));return btoa(t)};
const fromB64=b=>Uint8Array.from(atob(b),c=>c.charCodeAt(0));
async function deriveKey(pw,salt){
  const m=await crypto.subtle.importKey('raw',new TextEncoder().encode(pw),'PBKDF2',false,['deriveKey']);
  return crypto.subtle.deriveKey({name:'PBKDF2',salt:new TextEncoder().encode('k:'+salt),iterations:200000,hash:'SHA-256'},m,{name:'AES-GCM',length:256},false,['encrypt','decrypt'])}
async function enc(str,k=KEY){const iv=crypto.getRandomValues(new Uint8Array(12));
  const ct=await crypto.subtle.encrypt({name:'AES-GCM',iv},k,new TextEncoder().encode(str));return {enc:1,iv:toB64(iv),ct:toB64(ct)}}
async function dec(o,k=KEY){const p=await crypto.subtle.decrypt({name:'AES-GCM',iv:fromB64(o.iv)},k,fromB64(o.ct));return new TextDecoder().decode(p)}

/* ---------- kho ảnh & khoá (IndexedDB) ---------- */
let _db;
const idb=()=>_db||(_db=new Promise((res,rej)=>{const r=indexedDB.open('nk_photos',2);
  r.onupgradeneeded=()=>{const d=r.result;if(!d.objectStoreNames.contains('p'))d.createObjectStore('p');if(!d.objectStoreNames.contains('k'))d.createObjectStore('k')};
  r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)}));
const tx=async(st,mode,fn)=>{const db=await idb();return new Promise((res,rej)=>{const t=db.transaction(st,mode),rq=fn(t.objectStore(st));t.oncomplete=()=>res(rq&&rq.result);t.onerror=()=>rej(t.error)})};
const pRaw=id=>tx('p','readonly',s=>s.get(id));
const pPut=async(id,v)=>{const x=KEY?await enc(v):v;return tx('p','readwrite',s=>s.put(x,id))};
const pGet=async id=>{const r=await pRaw(id);if(r&&r.enc)return KEY?dec(r):null;return r};
const pDel=id=>tx('p','readwrite',s=>s.delete(id));
const pClear=()=>tx('p','readwrite',s=>s.clear());
const kPut=(k,v)=>tx('k','readwrite',s=>s.put(v,k));
const kGet=k=>tx('k','readonly',s=>s.get(k));
const kDel=k=>tx('k','readwrite',s=>s.delete(k));
const pCache={};
async function pUrl(id){if(pCache[id])return pCache[id];const v=await pGet(id).catch(()=>null);if(v)pCache[id]=v;return v}
const dropPhotos=ids=>(ids||[]).forEach(id=>{pDel(id);delete pCache[id]});
function resize(file){return new Promise((res,rej)=>{const img=new Image(),u=URL.createObjectURL(file);
  img.onload=()=>{const M=1100,k=Math.min(1,M/Math.max(img.width,img.height)),c=document.createElement('canvas');
    c.width=Math.round(img.width*k);c.height=Math.round(img.height*k);c.getContext('2d').drawImage(img,0,0,c.width,c.height);
    URL.revokeObjectURL(u);res(c.toDataURL('image/jpeg',.78))};img.onerror=rej;img.src=u})}
const tagsOf=e=>[...new Set(((e.title||'')+' '+(e.body||'')).match(/#[\p{L}\d_]+/gu)||[])].map(t=>t.toLowerCase());
const fillImgs=sel=>$$(sel).forEach(async i=>{const u=await pUrl(i.dataset.p);if(u)i.src=u;else if(i.classList.contains('thumb'))i.remove()});

/* ---------- ảnh đại diện ---------- */
function drawAvatar(){
  const a=localStorage.getItem('nk_avatar');
  const h=a?`<img src="${a}" alt="">`:'<img src="icon-192.png" alt="">';
  $('#avBox').innerHTML=h;
  const lg=$('.lockbox .logo');lg.innerHTML=h;lg.classList.add('has');
  $('#avDel').classList.toggle('hidden',!a)}
function cropSquare(file,size=192){return new Promise((res,rej)=>{const img=new Image(),u=URL.createObjectURL(file);
  img.onload=()=>{const m=Math.min(img.width,img.height),c=document.createElement('canvas');c.width=c.height=size;
    c.getContext('2d').drawImage(img,(img.width-m)/2,(img.height-m)/2,m,m,0,0,size,size);URL.revokeObjectURL(u);res(c.toDataURL('image/jpeg',.85))};
  img.onerror=rej;img.src=u})}

/* ---------- mật khẩu ---------- */
async function hash(pw,salt){
  if(canCrypto){
    const m=await crypto.subtle.importKey('raw',new TextEncoder().encode(pw),'PBKDF2',false,['deriveBits']);
    const b=await crypto.subtle.deriveBits({name:'PBKDF2',salt:new TextEncoder().encode('v:'+salt),iterations:200000,hash:'SHA-256'},m,256);
    return 'p'+[...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('')}
  return hashOld(pw,salt)}
async function checkPw(p){
  const salt=localStorage.getItem(K.salt),st=localStorage.getItem(K.pw)||'';
  if(st.startsWith('p'))return (await hash(p,salt))===st;
  if((await hashOld(p,salt))===st){if(canCrypto)localStorage.setItem(K.pw,await hash(p,salt));return true}
  return false}
async function hashOld(pw,salt){
  const data=new TextEncoder().encode(salt+':'+pw);
  if(crypto&&crypto.subtle){const b=await crypto.subtle.digest('SHA-256',data);return [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('')}
  let h=5381;for(const c of data)h=((h<<5)+h+c)>>>0;return 'x'+h}
const hasPw=()=>!!localStorage.getItem(K.pw);
function lockUI(){
  const first=!hasPw();
  $('#lkTitle').textContent=first?'Chào mừng anh':'Đăng Dũng Life';
  $('#lkSub').textContent=first?'Đặt mật khẩu. Nếu quên sẽ không khôi phục được dữ liệu đã mã hoá!':'Nhập mật khẩu để mở';
  $('#pw2').classList.toggle('hidden',!first);
  $('#lkBtn').textContent=first?'Tạo & vào':'Mở khoá';
  $('#pw1').value=$('#pw2').value='';$('#lkErr').textContent='';
  $('#bioBtn').classList.toggle('hidden',first||!bioOn());
  $('#linkBtn').classList.toggle('hidden',!first);$('#linkBox').classList.add('hidden')}
const bioOn=()=>!!(window.PublicKeyCredential&&canCrypto&&localStorage.getItem('nk_bio'));
async function submitLock(){
  const p=$('#pw1').value,err=$('#lkErr');
  try{
    if(!hasPw()){
      if(p.length<8)return err.textContent='Mật khẩu cần ít nhất 8 ký tự (càng dài càng an toàn)';
      if(p!==$('#pw2').value)return err.textContent='Hai mật khẩu chưa khớp';
      const salt=crypto.getRandomValues?[...crypto.getRandomValues(new Uint8Array(8))].join(''):String(Math.random());
      localStorage.setItem(K.salt,salt);localStorage.setItem(K.pw,await hash(p,salt));
      return unlock(canCrypto?await deriveKey(p,salt):null)}
    const salt=localStorage.getItem(K.salt),btn=$('#lkBtn');btn.disabled=true;btn.textContent='Đang mở…';
    const [ok,k]=await Promise.all([checkPw(p),canCrypto?deriveKey(p,salt):null]).finally(()=>{btn.disabled=false;btn.textContent='Mở khoá'});
    if(ok)unlock(k);
    else{err.textContent='Sai mật khẩu';$('#pw1').value=''}
  }catch(e){err.textContent='Lỗi mở khoá: '+(e.message||e)}}
async function bioUnlock(){
  try{
    await navigator.credentials.get({publicKey:{challenge:crypto.getRandomValues(new Uint8Array(32)),
      allowCredentials:[{type:'public-key',id:fromB64(localStorage.getItem('nk_bio'))}],userVerification:'required',timeout:60000}});
    const k=await kGet('key');if(!k)throw new Error('no key');await unlock(k);
  }catch(e){$('#lkErr').textContent='Không mở được bằng Face ID — dùng mật khẩu nhé'}}
async function unlock(k){
  KEY=k;
  try{await loadData()}catch(e){KEY=null;$('#lkErr').textContent='Không giải mã được dữ liệu';return}
  $('#lock').classList.add('hidden');$('#app').classList.remove('hidden');loadSet();view='home';render();bump();sync();remCheck()}
const SHEETS=['#sheet','#reader','#tkSheet','#form','#menu','#light'];
function lock(){
  KEY=null;R={};tombs={};Object.keys(pCache).forEach(k=>delete pCache[k]);
  $$('main .view.dyn').forEach(v=>{v.innerHTML='';delete v.dataset.built});
  ['#photos','#rPh','#rBody','#rTitle','#fBody','#tkList'].forEach(s=>$(s).innerHTML='');
  $('#eTitle').value=$('#eBody').value='';$('#lightImg').removeAttribute('src');
  SHEETS.forEach(s=>$(s).classList.add('hidden'));
  $('#app').classList.add('hidden');$('#lock').classList.remove('hidden');lockUI();$('#pw1').focus()}
let idle,lastAct=Date.now();
const unlocked=()=>!$('#app').classList.contains('hidden');
function bump(){lastAct=Date.now();clearTimeout(idle);if(S.lock>0&&unlocked())idle=setTimeout(lock,S.lock*60000)}
['click','keydown','touchstart','scroll'].forEach(e=>addEventListener(e,bump,true));
let picking=false;
// Chuyển app khác không khoá ngay; chỉ khoá khi tổng thời gian không thao tác (kể cả lúc ở app khác) ≥ thời gian cài đặt
document.addEventListener('visibilitychange',()=>{
  if(document.hidden||!unlocked()||S.lock<=0||!hasPw())return;
  if(picking){bump();return}
  const left=S.lock*60000-(Date.now()-lastAct);
  clearTimeout(idle);if(left<=0)lock();else idle=setTimeout(lock,left)});

/* ---------- lưu & nạp ---------- */
let saveQ=Promise.resolve();
const save=noSync=>{const snap=JSON.stringify({v:3,entries:R,tombs}),k=KEY;
  if(!noSync)scheduleSync();
  if(canCrypto&&!k)return saveQ;
  saveQ=saveQ.then(async()=>{try{localStorage.setItem(K.data,JSON.stringify(k?await enc(snap,k):JSON.parse(snap)))}catch(e){toast('Không lưu được dữ liệu')}});
  return saveQ};
async function loadData(){
  const raw=get(K.data,{}),wasEnc=!!(raw&&raw.enc);
  const obj=wasEnc?JSON.parse(await dec(raw)):(raw||{});
  if(obj&&obj.v>=2){R=obj.entries||{};tombs=obj.tombs||{}}else{R=obj||{};tombs={}}
  R=migrate(R);migAll();
  if(KEY&&!wasEnc&&Object.keys(R).length){await save();
    for(const e of Object.values(R))for(const id of e.photos||[]){const r=await pRaw(id);if(typeof r==='string')await pPut(id,r)}}}
function migGio(){let ch=false;
  for(const id of recs('person')){const p=R[id];if(!('gio' in p))continue;
    const gid='eg'+id.slice(1,40);
    if(p.gio&&!R[gid]&&!tombs[gid])R[gid]={k:'gio',name:p.name,rel:'',ld:p.gld||'1',lm:p.glm||'1',year:'',place:'',note:'',at:Date.now()};
    delete p.gio;delete p.gld;delete p.glm;p.at=Date.now();ch=true}
  if(ch)save();return ch}
function migOnce(){let ch=false;const t=today();
  for(const id of recs('rem')){const r=R[id];if(r.freq!=='once')continue;
    const done=!!(r.date&&r.date<t)||r.on===false;
    R[id]={k:'task',title:r.title,due:r.date||'',time:r.time||'',star:false,note:r.note||'',done,...(done?{doneAt:r.date?parse(r.date).getTime()+43200000:Date.now()}:{}),at:Date.now()};ch=true}
  if(ch)save();return ch}
const migAll=()=>!!(migGio()|migOnce()|(recs('tx').length&&ensureWallet()?(save(),1):0));
const putRec=(id,r)=>{R[id]=Object.assign(r,{at:Date.now()});delete tombs[id];save()};
const delRec=id=>{if(!R[id])return;dropPhotos(R[id].photos);delete R[id];tombs[id]=Date.now();save()};
function applyTheme(){
  document.documentElement.dataset.theme=S.dark?'dark':'light';
  document.documentElement.style.setProperty('--fs',S.font+'px');
  $('meta[name=theme-color]').content=S.dark?'#17161a':'#f6f1e9'}

/* ---------- sự kiện theo ngày (nhắc, sinh nhật, giỗ, gia hạn…) ---------- */
function lunarMatch(dk,ld,lm){
  const l=lunarOf(dk);if(lm&&(l.m!==lm||l.leap))return false;
  if(l.d===ld)return true;
  return ld===30&&l.d===29&&lunarOf(addDays(dk,1)).d===1}
const dim=d=>new Date(d.getFullYear(),d.getMonth()+1,0).getDate();
function remOn(r,dk){
  if(r.on===false)return false;
  if(r.freq==='once')return r.date===dk;
  if(r.lunar&&(r.freq==='month'||r.freq==='year'))return dk>=(r.date||'')&&lunarMatch(dk,+r.ld,r.freq==='year'?+r.lm:0);
  if(!r.date||dk<r.date)return false;
  const a=parse(r.date),d=parse(dk);
  switch(r.freq){
    case 'day':return true;
    case 'week':return a.getDay()===d.getDay();
    case 'month':return d.getDate()===Math.min(a.getDate(),dim(d));
    case 'year':return a.getMonth()===d.getMonth()&&d.getDate()===Math.min(a.getDate(),dim(d))}
  return false}
const remPres=r=>[...(r.pre7&&(r.freq==='month'||r.freq==='year')?[7]:[]),...(r.pre1&&r.freq!=='day'?[1]:[])];
function freqTxt(r){
  const t=r.time?' · '+r.time:'';
  switch(r.freq){
    case 'once':return 'Một lần · '+(r.date?fmtDMY(r.date):'')+t;
    case 'day':return 'Hằng ngày'+t;
    case 'week':return 'Hằng tuần · '+(r.date?DOWL[parse(r.date).getDay()]:'')+t;
    case 'month':return (r.lunar?`Hằng tháng · ngày ${r.ld} âm lịch`:`Hằng tháng · ngày ${r.date?+r.date.slice(8):''}`)+t;
    case 'year':return (r.lunar?`Hằng năm · ${r.ld}/${r.lm} âm lịch`:`Hằng năm · ${r.date?fmtDM(r.date):''}`)+t}
  return ''}
function bdayOn(p,dk){
  if(p.bmode==='solar'&&p.bday){
    const md=p.bday.slice(5),y=+dk.slice(0,4);
    const hit=md===dk.slice(5)||(md==='02-29'&&dk.slice(5)==='02-28'&&new Date(y,1,29).getMonth()!==1);
    if(!hit)return null;const n=y-+p.bday.slice(0,4);return n>0?`Tròn ${n} tuổi`:'Sinh nhật'}
  if(p.bmode==='lunar'&&lunarMatch(dk,+p.bld,+p.blm)){const n=p.byear?lunarOf(dk).y-+p.byear:0;return `${p.bld}/${p.blm} âm lịch`+(n>0?` · ${n} tuổi`:'')}
  return null}
function addMonthsK(k,n){const [y,m,d]=k.split('-').map(Number),t=new Date(y,m-1+n,1);return key(new Date(t.getFullYear(),t.getMonth(),Math.min(d,dim(t))))}
function subNext(s,from){
  if(!s.start)return null;const step=s.cycle==='year'?12:1,[y0,m0]=s.start.split('-').map(Number),[y1,m1]=from.split('-').map(Number);
  let n=Math.max(0,(Math.floor(((y1-y0)*12+(m1-m0))/step)-1)*step),k=addMonthsK(s.start,n);
  while(k<from){n+=step;k=addMonthsK(s.start,n)}return k}
const subMonthly=s=>s.cycle==='year'?(+s.price||0)/12:(+s.price||0);
function eventsOn(dk,withPre){
  const out=[];
  for(const id in R){const r=R[id];
    switch(r.k){
      case 'rem':if(remOn(r,dk))out.push({k:'rem',id,ic:lblOf(r.label)[1],c:MOD.rem.c,t:r.title,time:r.time,s:freqTxt(r)});
        else if(withPre)for(const n of remPres(r))if(remOn(r,addDays(dk,n)))out.push({k:'rem',id,ic:lblOf(r.label)[1],c:MOD.rem.c,t:(n===1?'Ngày mai: ':'Còn 1 tuần: ')+r.title,time:r.time,s:freqTxt(r),pre:1});break;
      case 'person':{const b=bdayOn(r,dk);if(b)out.push({k:'person',id,ic:'🎂',c:MOD.people.c,t:'Sinh nhật '+r.name,s:b});
        break}
      case 'gio':if(lunarMatch(dk,+r.ld,+r.lm))out.push({k:'gio',id,ic:'🕯️',c:MOD.gio.c,t:gioT(r),s:gioSub(r,dk)});
        else if(withPre)for(const n of [7,1])if(lunarMatch(addDays(dk,n),+r.ld,+r.lm))out.push({k:'gio',id,ic:'🕯️',c:MOD.gio.c,t:(n===1?'Ngày mai: ':'Còn 7 ngày: ')+gioT(r),s:gioSub(r,addDays(dk,n)),pre:1});break;
      case 'sub':if(r.on!==false){const n=subNext(r,dk);
        if(n===dk)out.push({k:'sub',id,ic:'💳',c:MOD.sub.c,t:'Gia hạn '+r.name,s:fmt(r.price)});
        else if(withPre&&+r.pre>0&&n===addDays(dk,+r.pre))out.push({k:'sub',id,ic:'💳',c:MOD.sub.c,t:`Còn ${r.pre} ngày gia hạn ${r.name}`,s:fmt(r.price)+' · '+fmtDM(n),pre:1})}break;
      case 'vault':if(r.exp){const n=diffDays(dk,r.exp);
        if(n===0)out.push({k:'vault',id,ic:'⏳',c:MOD.vault.c,t:'Hết hạn: '+r.title,s:'Kho cá nhân'});
        else if(withPre&&(n===30||n===7))out.push({k:'vault',id,ic:'⏳',c:MOD.vault.c,t:`Còn ${n} ngày hết hạn: ${r.title}`,s:fmtDMY(r.exp),pre:1})}break;
      case 'inc':if(!r.got&&r.date===dk)out.push({k:'inc',id,ic:'🤝',c:MOD.money.c,t:'Dự kiến về: '+r.title,s:fmt(r.amount)});break;
      case 'tx':if(isLoan(r)&&r.due&&loanLeft(r)){const L=loanLeft(r),w=r.type==='lend'?'Thu nợ ':'Trả nợ ';
        if(r.due===dk)out.push({k:'tx',id,ic:'🤝',c:MOD.money.c,t:w+(r.who||'')+' · '+fmtS(L),s:'Hạn hôm nay'});
        else if(withPre&&addDays(dk,1)===r.due)out.push({k:'tx',id,ic:'🤝',c:MOD.money.c,t:'Ngày mai: '+w+(r.who||'')+' · '+fmtS(L),s:'Vay nợ',pre:1})}break;
      case 'task':if(!r.done&&r.due===dk)out.push({k:'task',id,ic:'✅',c:MOD.task.c,t:r.title,time:r.time,s:'Việc cần làm'});break}}
  if(S.moon){const l=lunarOf(dk);if(l.d===1||l.d===15)out.push({k:'moon',id:'m',ic:l.d===15?'🌕':'🌑',c:'#b08a2e',t:`${l.d===15?'Rằm':'Mùng 1'} tháng ${l.m}${l.leap?' nhuận':''}`,s:'Âm lịch'})}
  out.forEach(e=>e.key=`${e.k}:${e.id}:${e.g?'g':''}${e.pre?'p':''}:${dk}`);
  return out.sort((a,b)=>(a.time||'99').localeCompare(b.time||'99'))}
const gioName=r=>r.name,gioT=r=>/giỗ/i.test(r.name)?r.name:'Giỗ '+r.name;
function gioNth(r,dk){const y=+r.year;if(!y)return '';const n=lunarOf(dk).y-y;return n===1?'Giỗ đầu':n===2?'Giỗ hết':n>2?`Giỗ lần thứ ${n}`:''}
const gioSub=(r,dk)=>[`${r.ld}/${r.lm} âm lịch`,gioNth(r,dk),r.place?'tại '+r.place:''].filter(Boolean).join(' · ');
const gioNext=(r,from)=>nextOf(k=>lunarMatch(k,+r.ld,+r.lm),from||today(),400);
function nextOf(test,from,max=400){for(let i=0;i<=max;i++){const k=addDays(from,i);if(test(k))return k}return null}
const evRow=(e,dk)=>`<button class="ev" data-edit="${e.k}:${e.id}"><i style="background:${e.c}">${e.ic}</i><div><b>${esc(e.t)}</b><small>${[dk?relDay(dk):'',e.k==='rem'?(e.time||''):e.s].filter(Boolean).map(esc).join(' · ')}</small></div></button>`;
function relDay(dk){const n=diffDays(today(),dk);if(n===0)return 'Hôm nay';if(n===1)return 'Ngày mai';if(n===2)return 'Ngày kia';if(n===-1)return 'Hôm qua';
  if(n<0)return `${DOW[(parse(dk).getDay()+6)%7]} ${fmtDM(dk)} · ${-n} ngày trước`;
  return `${DOW[(parse(dk).getDay()+6)%7]} ${fmtDM(dk)} · còn ${n} ngày`}

/* ---------- khung chung ---------- */
function greet(){const h=new Date().getHours();return h<11?'Chào buổi sáng':h<14?'Chào buổi trưa':h<18?'Chào buổi chiều':'Chào buổi tối'}
function drawNav(){
  const tabs=['home',...S.tabs,'more'];
  $('#navIn').innerHTML=tabs.map(t=>`<button data-v="${t}" class="${view===t||(t==='more'&&!tabs.includes(view))?'on':''}"><i>${MOD[t].i}</i>${MOD[t].s||MOD[t].n}</button>`).join('')}
const FAB={diary:()=>openEntry(null,today()),cal:()=>openMenu(selDay),home:()=>openMenu(today()),task:()=>openForm('task',null,{due:taskSeg==='today'?today():taskSeg==='up'?addDays(today(),1):''}),
  rem:()=>openForm('rem'),people:()=>openForm('person'),gio:()=>openForm('gio'),money:()=>moneyTab==='loan'?openForm('tx',null,{type:'lend'}):moneyTab==='plan'?openForm('inc'):openForm('tx'),sub:()=>openForm('sub'),habit:()=>openForm('habit'),vault:()=>openForm('vault')};
function go(v){view=v;render();$('main').scrollTop=0}
function render(){
  syncLastW();habCache();
  const tabs=['home',...S.tabs,'more'];
  $('#hTitle').textContent=view==='home'?greet():MOD[view].n;
  const subs={home:()=>{const d=new Date();return `${DOWL[d.getDay()]}, ${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()} · ${lunarTxt(today())} âm lịch`},
    diary:()=>`${recs('diary').length} bài viết`,cal:()=>'Chạm vào ngày để xem chi tiết'};
  $('#hSub').textContent=(subs[view]||(()=>''))();
  $('#hBack').classList.toggle('hidden',tabs.includes(view));
  $('#hCal').classList.toggle('hidden',view!=='home');
  $$('main .view').forEach(v=>v.classList.toggle('on',v.id==='v-'+view));
  drawNav();
  $('#fab').classList.toggle('hidden',!FAB[view]);
  const fn={home:renderHome,cal:renderCal,diary:renderDiary,task:renderTask,rem:renderRem,people:renderPeople,gio:renderGio,money:renderMoney,sub:renderSub,habit:renderHabit,vault:renderVault,more:renderMore}[view];
  if(fn)fn()}

/* ---------- HÔM NAY ---------- */
let qOff=0;
const dayNo=()=>{const d=new Date();return Math.floor(new Date(d.getFullYear(),d.getMonth(),d.getDate()).getTime()/864e5)};
function renderHome(){
  const t=today(),d=new Date(),l=lunarOf(t);let h='';
  if(S.home.hero){
    const [qt,qa]=QUOTES[((dayNo()+qOff)%QUOTES.length+QUOTES.length)%QUOTES.length];
    h+=`<div class="hero"><div class="hd"><b>${d.getDate()}</b><div class="hm"><span>${DOWL[d.getDay()]}</span><small>Tháng ${d.getMonth()+1}, ${d.getFullYear()}</small></div>
      <div class="al"><small>Âm lịch</small><b>${l.d}/${l.m}${l.leap?'N':''}</b><small>${canChiYear(l.y)}</small></div></div>
      ${S.quote?`<button class="hq" id="quoteCard"><q>“${esc(qt)}”</q>${qa?`<small>— ${esc(qa)}</small>`:''}</button>`:''}</div>`}
  if(S.ai)h+=`<button class="aiask" data-act="ai-open"><span>✨</span>Hỏi hoặc ghi nhanh… <small>VD: chi 45k cà phê bằng Momo</small></button>`+briefHtml();
  if(S.home.tk)h+=tkCardHtml();
  if(S.home.today){
    const ev=eventsOn(t,true).filter(e=>e.k!=='task');
    const tasks=recs('task').filter(i=>!R[i].done&&R[i].due&&R[i].due<=t).sort((a,b)=>R[a].due.localeCompare(R[b].due)||(R[a].time||'99').localeCompare(R[b].time||'99'));
    const habs=recs('habit');
    const pend=pendingPays(),pk=new Set(pend.filter(x=>x.k===t).map(x=>x.src));
    let b=pend.map(ppRow).join('')+ev.filter(e=>!(pk.has(e.id)&&!e.pre)).map(e=>evRow(e)).join('')+tasks.map(taskRow).join('');
    if(remDue())b+=`<div class="card remind"><span>🌙 Đến giờ viết nhật ký rồi.</span><button data-act="write">Viết ngay</button></div>`;
    if(habs.length)b+=`<div class="hchips">${habs.map(i=>{const r=R[i],on=r.days&&r.days[t];return `<button class="hchip${on?' on':''}" data-hab="${i}">${on?'✓':r.icon||'🌱'} ${esc(r.name)}</button>`}).join('')}</div>`;
    if(!b)b='<div class="dayempty">Hôm nay chưa có việc nào ☕</div>';
    h+=`<div class="box"><div class="bh"><b>Hôm nay</b><button class="lnk" data-go="cal">Lịch ›</button></div>${b}</div>`}
  if(S.home.up){
    const L=[];for(let i=1;i<=14&&L.length<8;i++){const k=addDays(t,i);eventsOn(k).filter(e=>(e.k!=='moon'||i<=3)&&!(e.k==='rem'&&R[e.id].freq==='day')&&!(e.k==='rem'&&R[e.id].freq==='week'&&i>7)).forEach(e=>L.length<8&&L.push([e,k]))}
    if(L.length)h+=`<div class="box"><div class="bh"><b>Sắp tới</b><small>14 ngày</small></div>${L.map(([e,k])=>evRow(e,k)).join('')}</div>`}
  if(S.home.mini){
    const st=streak(),wrote=recs('diary').some(i=>R[i].date===t);
    const mk=t.slice(0,7),txs=recs('tx').map(i=>R[i]).filter(r=>r.date&&r.date.startsWith(mk));
    const out=txs.filter(r=>r.type==='out').reduce((a,r)=>a+(+r.amount||0),0),inn=txs.filter(r=>r.type==='in').reduce((a,r)=>a+(+r.amount||0),0);
    const habs=recs('habit'),hd=habs.filter(i=>R[i].days&&R[i].days[t]).length;
    const subs=recs('sub').map(i=>R[i]).filter(s=>s.on!==false),sm=subs.reduce((a,s)=>a+subMonthly(s),0);
    const nx=subs.map(s=>[subNext(s,t),s]).filter(x=>x[0]).sort((a,b)=>a[0].localeCompare(b[0]))[0];
    const nt=recs('task').filter(i=>!R[i].done&&R[i].due&&R[i].due<=t).length,ni=recs('task').filter(i=>!R[i].done&&!R[i].due).length;
    const tile=(m,body)=>`<button class="tile" data-go="${m}"><span class="ti" style="background:${MOD[m].c}">${MOD[m].i}</span><b>${MOD[m].n}</b>${body}</button>`;
    h+=`<div class="tiles">`+
      tile('diary',`<small>${st?`🔥 Chuỗi ${st} ngày`:'Chưa có chuỗi'}</small><small>${wrote?'Hôm nay đã viết ✓':'Hôm nay chưa viết'}</small>${wrote?'':'<span class="tb" data-act="write">✍️ Viết hôm nay</span>'}`)+
      tile('task',`<small>${nt?`<b class="red">${nt}</b> việc hôm nay`:'Hôm nay đã xong việc'}</small><small>${ni} việc trong hộp chờ</small>`)+
      tile('money',`<small>Đang có <b>${fmtS(sumW(balances(),spendW()))}</b></small><small>T${+mk.slice(5)}: chi <b class="red">${fmtS(out)}</b> · thu <b class="grn">${fmtS(inn)}</b></small>`)+
      tile('habit',habs.length?`<small>Hôm nay ${hd}/${habs.length}</small><div class="bar"><i style="width:${habs.length?hd/habs.length*100:0}%"></i></div>`:'<small>Bắt đầu một thói quen nhỏ</small>')+
      tile('sub',subs.length?`<small>≈ ${fmtS(sm)}/tháng</small><small>${nx?`${esc(nx[1].name)} · ${fmtDM(nx[0])}`:''}</small>`:'<small>Theo dõi khoản gia hạn</small>')+
      tile('people',(()=>{const ps=recs('person').map(i=>[nextOf(k=>!!bdayOn(R[i],k),t,370),R[i]]).filter(x=>x[0]).sort((a,b)=>a[0].localeCompare(b[0]))[0];
        return ps?`<small>🎂 ${esc(ps[1].name)}</small><small>${relDay(ps[0])}</small>`:'<small>Sinh nhật</small>'})())+
      `</div>`}
  if(S.home.mem){
    const md=t.slice(4),mem=diaryIds().filter(i=>R[i].date.endsWith(md)&&R[i].date<t).slice(0,3);
    if(mem.length)h+=`<div class="box"><div class="bh"><b>Ngày này năm xưa</b></div>${mem.map(k=>{const e=R[k],y=d.getFullYear()-parseInt(e.date);
      return `<button class="ev" data-read="${k}"><i style="background:${MOD.diary.c}">📔</i><div><b>${y} năm trước</b><small>${esc((e.title||e.body||'').replace(/\s+/g,' ').slice(0,70))}</small></div></button>`}).join('')}</div>`}
  $('#v-home').innerHTML=h||'<div class="empty">Bật các thẻ trong Cài đặt › Trang Hôm nay</div>';if(S.ai&&S.aiBrief)aiBrief()}
function taskRow(i){const r=R[i],t=today(),late=r.due&&r.due<t&&!r.done;
  const meta=[r.due?(late?`Quá hạn ${diffDays(r.due,t)} ngày`:r.due===t?'Hôm nay':relDay(r.due)):'',r.time||'',r.note?'📝':''].filter(Boolean).join(' · ');
  return `<div class="trow${r.done?' done':''}"><button class="ck${r.done?' on':''}" data-done="${i}" aria-label="Xong">${r.done?'✓':''}</button><button class="tt" data-edit="task:${i}"><b>${r.star?'⭐ ':''}${esc(r.title)}</b>${meta?`<small class="${late?'red':''}">${esc(meta)}</small>`:''}</button></div>`}

/* ---------- LỊCH ---------- */
function renderCal(){
  const y=calM.getFullYear(),m=calM.getMonth(),t=today();
  const lead=(new Date(y,m,1).getDay()+6)%7,days=new Date(y,m+1,0).getDate();
  const tkS={};[...tkYear(y-1),...tkYear(y)].forEach(x=>tkS[x.key]=x);
  const by={};recs('diary').forEach(i=>{const e=R[i];(by[e.date]=by[e.date]||[]).push(e)});
  let g=DOW.map(d=>`<div class="dow">${d}</div>`).join('');for(let i=0;i<lead;i++)g+='<span></span>';let cnt=0;
  for(let d=1;d<=days;d++){
    const k=`${y}-${pad(m+1)}-${pad(d)}`,L=by[k],l=lunarOf(k),ev=eventsOn(k).length;if(L)cnt++;
    g+=`<button class="day${L?' has':''}${k===t?' today':''}${k===selDay?' sel':''}${l.d===1||l.d===15?' lu1':''}" data-d="${k}">${tkS[k]&&S.tkShow?'<span class="t">◆</span>':''}${d}<span class="lu">${l.d===1||d===1?l.d+'/'+l.m:l.d}</span>${ev?'<span class="evd"></span>':''}</button>`}
  const sd=parse(selDay),l=lunarOf(selDay),ev=eventsOn(selDay),L=dayIds(selDay),ta=tkAt(selDay),inf=TK_INFO[ta.cur.i];
  const tasks=recs('task').filter(i=>R[i].due===selDay&&R[i].done);
  $('#v-cal').innerHTML=`<div class="cal-h"><button class="nav" data-cm="-1">‹</button><h2>Tháng ${m+1}, ${y}</h2><button class="nav" data-cm="1">›</button></div>
    <div class="grid">${g}</div><div class="stat">Nhật ký tháng này: ${cnt}/${days} ngày${(()=>{const l1=lunarOf(`${y}-${pad(m+1)}-01`);return ` · Năm ${canChiYear(l1.y)}`})()}</div>
    <div class="dayhead"><div><b>${DOWL[sd.getDay()]}, ${sd.getDate()}/${sd.getMonth()+1}/${sd.getFullYear()}</b>
      <small>🌙 Ngày ${l.d} tháng ${l.m}${l.leap?' nhuận':''} năm ${canChiYear(l.y)} · ngày ${canChiDay(sd.getDate(),sd.getMonth()+1,sd.getFullYear())}</small>
      ${S.tkShow?`<span class="daytk">${inf[0]} ${ta.day===1?`Vào tiết ${ta.cur.name} lúc ${ta.cur.time}`:`Tiết ${ta.cur.name} · ngày ${ta.day}/${ta.len}`}</span>`:''}</div></div>
    <div class="qa"><button class="chip" data-act="write-sel">✍️ Nhật ký</button><button class="chip" data-act="task-sel">✅ Việc</button><button class="chip" data-act="rem-sel">🔔 Nhắc</button></div>
    ${ev.map(e=>e.k==='task'?taskRow(e.id):evRow(e)).join('')}${tasks.map(taskRow).join('')}
    ${L.map(k=>diaryItem(k,true)).join('')}
    ${!ev.length&&!L.length&&!tasks.length?'<div class="dayempty">Ngày này chưa có gì</div>':''}
    <button class="btn ghost" style="margin-top:14px" data-act="cal-today">Về hôm nay</button>`;
  fillImgs('#v-cal .thumb')}

/* ---------- NHẬT KÝ ---------- */
function streak(){const ds=new Set(recs('diary').map(i=>R[i].date));let n=0,d=new Date();if(!ds.has(key(d)))d.setDate(d.getDate()-1);
  while(ds.has(key(d))){n++;d.setDate(d.getDate()-1)}return n}
function diaryItem(k,noDate){const e=R[k],d=parse(e.date),np=(e.photos||[]).length,first=(e.body||'').trim().replace(/\s+/g,' ');
  return `<button class="item" data-read="${k}">${noDate?'':`<div class="dt"><b>${d.getDate()}</b><span>${DOW[(d.getDay()+6)%7]}</span></div>`}
    <div class="it"><div class="t">${esc(e.title||first.slice(0,40)||'(Không tiêu đề)')}${e.fav?'<span class="star">★</span>':''}</div><div class="p">${esc(first)}${np?` 📷${np}`:''}</div></div>
    ${np?`<img class="thumb" data-p="${e.photos[0]}" alt="">`:''}<div class="mood">${e.mood!=null?MOODS[e.mood]:''}</div></button>`}
function renderDiary(){
  const v=$('#v-diary');
  if(!v.dataset.built){v.innerHTML=`<input class="search" id="q" placeholder="🔍 Tìm trong nhật ký…"><div id="dTop"></div><div class="chips" id="chips"></div><div id="listBox"></div>`;v.dataset.built=1;
    $('#q').oninput=renderDiaryList}
  const st=streak();
  $('#dTop').innerHTML=(remDue()?`<div class="card remind"><span>🌙 Đến giờ viết nhật ký rồi — hôm nay anh chưa viết gì.</span><button data-act="write">Viết ngay</button></div>`:'')+
    `<div class="card">${st>0?`🔥 Chuỗi <b>${st} ngày</b> viết liên tiếp`:'✍️ Hôm nay anh chưa viết — bắt đầu chuỗi mới nhé'}</div>`;
  renderDiaryList()}
function renderDiaryList(){
  const q=$('#q').value.trim().toLowerCase(),all=diaryIds(),cnt={};
  all.forEach(k=>tagsOf(R[k]).forEach(t=>cnt[t]=(cnt[t]||0)+1));
  const tags=Object.keys(cnt).sort((a,b)=>cnt[b]-cnt[a]).slice(0,12);
  if(filter!=='all'&&filter!=='fav'&&!filter.startsWith('tk:')&&!cnt[filter])filter='all';
  const tkF=filter.startsWith('tk:')?filter.slice(3).split('|'):null;
  $('#chips').innerHTML=[['all','Tất cả'],...(tkF?[[filter,'🍃 '+tkAt(tkF[0]).cur.name+' '+tkF[0].slice(0,4)]]:[]),['fav','⭐ Yêu thích'],...tags.map(t=>[t,t])].map(([k,l])=>`<button class="chip${filter===k?' on':''}" data-f="${esc(k)}">${esc(l)}</button>`).join('');
  const keys=all.filter(k=>{const e=R[k];
    if(filter==='fav'&&!e.fav)return false;
    if(tkF){if(!(e.date>=tkF[0]&&e.date<tkF[1]))return false}
    else if(filter!=='all'&&filter!=='fav'&&!tagsOf(e).includes(filter))return false;
    return !q||((e.title||'')+' '+(e.body||'')+' '+e.date).toLowerCase().includes(q)});
  if(!keys.length){$('#listBox').innerHTML=`<div class="empty"><div class="big">✍️</div>${q||filter!=='all'?'Không tìm thấy kết quả':'Chưa có trang nhật ký nào.<br>Bấm ＋ để viết ngày hôm nay.'}</div>`;return}
  let html='',cur='';
  for(const k of keys){const d=parse(R[k].date),m=`Tháng ${d.getMonth()+1}, ${d.getFullYear()}`;
    if(m!==cur){html+=`<div class="month">${m}</div>`;cur=m}html+=diaryItem(k)}
  $('#listBox').innerHTML=html;fillImgs('#listBox .thumb')}

/* ---------- VIỆC CẦN LÀM ---------- */
function renderTask(){
  const t=today(),all=recs('task');
  const doneT=i=>R[i].done&&R[i].doneAt&&key(new Date(R[i].doneAt))===t;
  const segs={today:i=>!R[i].done&&R[i].due&&R[i].due<=t||R[i].done&&(R[i].due===t||doneT(i)&&R[i].due&&R[i].due<t),up:i=>!R[i].done&&R[i].due>t,inbox:i=>!R[i].done&&!R[i].due,done:i=>R[i].done};
  const n=s=>all.filter(i=>segs[s](i)&&!R[i].done).length;
  let L=all.filter(segs[taskSeg]);
  L.sort(taskSeg==='done'?(a,b)=>(R[b].doneAt||0)-(R[a].doneAt||0):(a,b)=>(+R[a].done-+R[b].done)||((R[a].due||'9')+(R[a].time||'99')).localeCompare((R[b].due||'9')+(R[b].time||'99'))||(+!!R[b].star-+!!R[a].star));
  if(taskSeg==='done')L=L.slice(0,60);
  const ph={today:'Thêm việc cho hôm nay…',up:'Thêm việc cho ngày mai…',inbox:'Ghi nhanh vào hộp chờ…',done:''}[taskSeg];
  $('#v-task').innerHTML=`<div class="seg">${[['today','Hôm nay'],['up','Sắp tới'],['inbox','Hộp chờ'],['done','Đã xong']].map(([k,l])=>`<button class="${taskSeg===k?'on':''}" data-seg="${k}">${l}${k!=='done'&&n(k)?` <em>${n(k)}</em>`:''}</button>`).join('')}</div>
    ${ph?`<div class="quick"><input id="tQuick" placeholder="${ph}" enterkeyhint="done"><button class="btn" id="tAdd">＋</button></div>`:''}
    ${L.length?L.map(taskRow).join(''):`<div class="empty"><div class="big">${taskSeg==='done'?'🏁':'☀️'}</div>${{today:'Hôm nay chưa có việc nào',up:'Chưa có việc sắp tới',inbox:'Hộp chờ trống — ghi nhanh những việc chưa có ngày',done:'Chưa hoàn thành việc nào'}[taskSeg]}</div>`}`;
  const q=$('#tQuick');if(q)q.onkeydown=e=>{if(e.key==='Enter')quickTask()}}
function quickTask(){const q=$('#tQuick'),v=q.value.trim();if(!v)return;
  putRec('e'+uid(),{k:'task',title:v,due:taskSeg==='today'?today():taskSeg==='up'?addDays(today(),1):'',time:'',star:false,note:'',done:false});
  render();setTimeout(()=>{const n=$('#tQuick');if(n)n.focus()},30)}
function toggleTask(id){const r=R[id];if(!r)return;r.done=!r.done;r.doneAt=r.done?Date.now():0;putRec(id,r);render();if(r.done)toast('Xong việc ✓')}

/* ---------- NHẮC NHỞ ---------- */
function renderRem(){
  const t=today(),all=recs('rem').filter(i=>remLbl==='all'||R[i].label===remLbl);
  const nx={};all.forEach(i=>nx[i]=R[i].on===false?null:nextOf(k=>remOn(R[i],k),t,R[i].freq==='year'?400:R[i].freq==='once'?Math.max(0,diffDays(t,R[i].date||t)):62));
  const on=all.filter(i=>nx[i]).sort((a,b)=>nx[a].localeCompare(nx[b])||(R[a].time||'').localeCompare(R[b].time||''));
  const off=all.filter(i=>!nx[i]);
  const row=i=>{const r=R[i],L=lblOf(r.label);return `<button class="ev" data-edit="rem:${i}"><i style="background:${MOD.rem.c}">${L[1]}</i><div><b>${esc(r.title)}</b><small>${esc(freqTxt(r))}</small>${nx[i]?`<small class="${nx[i]===t?'red':''}">${nx[i]===t?'🔔 Hôm nay':'Lần tới: '+relDay(nx[i])}</small>`:`<small>${r.on===false?'Đang tắt':'Đã qua'}</small>`}</div></button>`};
  $('#v-rem').innerHTML=`<div class="chips">${[['all','Tất cả'],...LBL.map(x=>[x[0],x[1]+' '+x[2]])].map(([k,l])=>`<button class="chip${remLbl===k?' on':''}" data-lbl="${k}">${l}</button>`).join('')}</div>
    ${on.length?`<div class="month">Sắp tới</div>${on.map(row).join('')}`:''}
    ${off.length?`<div class="month">Đã qua / đang tắt</div>${off.map(row).join('')}`:''}
    ${!all.length?`<div class="empty"><div class="big">🔁</div>Chưa có việc định kỳ nào.<br>Bấm ＋ để thêm những việc lặp lại: đóng tiền điện, uống thuốc, đi chùa ngày rằm…<br><small>Việc làm một lần thì ghi vào ✅ Việc cần làm.</small></div>`:''}
    <div class="note" style="margin-top:12px">Thông báo hiện khi app đang mở. Để chắc chắn được nhắc cả khi tắt app, vào Cài đặt › “Xuất tất cả ra Lịch điện thoại”.</div>`}

/* ---------- NGƯỜI THÂN ---------- */
function renderPeople(){
  const t=today(),q=peopleQ.toLowerCase();
  const L=recs('person').filter(i=>!q||(R[i].name+' '+(R[i].rel||'')+' '+(R[i].phone||'')).toLowerCase().includes(q)).map(i=>{
    const r=R[i],b=r.bmode&&r.bmode!=='none'?nextOf(k=>!!bdayOn(r,k),t,370):null;
    return {i,r,b,n:b||'9'}}).sort((a,b)=>a.n.localeCompare(b.n)||a.r.name.localeCompare(b.r.name,'vi'));
  $('#v-people').innerHTML=`<input class="search" id="pQ" placeholder="🔍 Tìm người…" value="${esc(peopleQ)}">
    ${L.map(({i,r,b})=>`<div class="prow"><button class="pav" data-edit="person:${i}" style="background:${MOD.people.c}">${esc((r.name.trim().split(/\s+/).pop()||'?')[0].toUpperCase())}</button>
      <button class="pi" data-edit="person:${i}"><b>${esc(r.name)}</b>${r.rel?` <span class="tag">${esc(r.rel)}</span>`:''}
      ${b?`<small>🎂 ${relDay(b)}${(()=>{const s=bdayOn(r,b);return s&&s!=='Sinh nhật'?' · '+esc(s):''})()}</small>`:''}</button>
      ${r.phone?`<a class="call" href="tel:${esc(r.phone.replace(/[^\d+]/g,''))}">📞</a>`:''}</div>`).join('')||`<div class="empty"><div class="big">👨‍👩‍👧</div>${q?'Không tìm thấy':'Thêm người thân để không quên sinh nhật.<br>Ngày giỗ đã có mục riêng 🕯️'}</div>`}`;
  const p=$('#pQ');p.oninput=()=>{peopleQ=p.value;const pos=p.selectionStart;renderPeople();const n=$('#pQ');n.focus();n.setSelectionRange(pos,pos)}}

/* ---------- NGÀY GIỖ ---------- */
function renderGio(){
  const t=today(),L=recs('gio').map(i=>({i,r:R[i],n:gioNext(R[i],t)})).sort((a,b)=>(a.n||'9').localeCompare(b.n||'9')||a.r.name.localeCompare(b.r.name,'vi'));
  let cur='';
  $('#v-gio').innerHTML=L.map(({i,r,n})=>{const d=n?diffDays(t,n):null,mh=n?`Tháng ${lunarOf(n).m} âm lịch`:'';let h='';
    if(mh!==cur){cur=mh;h+=`<div class="month">${mh}</div>`}
    return h+`<button class="ev" data-edit="gio:${i}"><i style="background:${MOD.gio.c}">🕯️</i><div><b>${esc(gioName(r))}</b><small>${esc(gioSub(r,n||t))}</small>${n?`<small class="${d<=7?'red':''}">${d===0?'🕯️ Hôm nay':relDay(n)} · ${fmtDMY(n)} dương lịch</small>`:''}</div></button>`}).join('')||
    `<div class="empty"><div class="big">🕯️</div>Chưa có ngày giỗ nào.<br>Bấm ＋ để thêm ngày giỗ ông bà, tổ tiên trong gia đình.</div>`;
  $('#v-gio').innerHTML+=`<div class="note" style="margin-top:12px">Mỗi ngày giỗ tự lặp lại hằng năm theo âm lịch, nhắc trước 7 ngày, trước 1 ngày và đúng ngày (lúc ${S.evTime||'08:00'}). Để được nhắc cả khi tắt app: Cài đặt › “Xuất tất cả ra Lịch điện thoại”.</div>`}

/* ---------- TÀI CHÍNH ---------- */
const WDEF='ewalletcash01';
const WTYPE=[['cash','💵','Tiền mặt'],['bank','🏦','Ngân hàng'],['card','💳','Thẻ tín dụng'],['ewallet','📱','Ví điện tử'],['goal','🎯','Quỹ / mục tiêu']];
const wtOf=t=>WTYPE.find(x=>x[0]===t)||WTYPE[0];
const wallets=()=>recs('wallet').sort((a,b)=>(R[a].c||0)-(R[b].c||0)||(R[a].name||'').localeCompare(R[b].name||'','vi'));
const spendW=()=>wallets().filter(i=>R[i].type!=='goal'),goalW=()=>wallets().filter(i=>R[i].type==='goal');
const wName=i=>R[i]?wtOf(R[i].type)[1]+' '+R[i].name:'💵 Tiền mặt';
const wOpts=()=>wallets().map(i=>[i,wName(i)]);
function ensureWallet(){if(recs('wallet').length)return false;R[WDEF]={k:'wallet',name:'Tiền mặt',type:'cash',init:0,c:1,at:Date.now()};delete tombs[WDEF];return true}
const payTotal=r=>(r.pays||[]).reduce((a,p)=>a+(+p.a||0),0);
const loanLeft=r=>r.paid&&!(r.pays||[]).length?0:Math.max(0,(+r.amount||0)-payTotal(r));
const isLoan=r=>r.type==='lend'||r.type==='borrow';
function balances(){
  const B={};for(const w of recs('wallet'))B[w]=+R[w].init||0;
  const add=(w,v)=>{if(!(w in B))w=WDEF;if(w in B)B[w]+=v};
  for(const i of recs('tx')){const r=R[i],a=+r.amount||0,w=r.w||WDEF;
    if(r.type==='out')add(w,-a);else if(r.type==='in')add(w,a);
    else if(r.type==='xfer'){add(w,-a);add(r.w2||WDEF,a)}
    else if(r.type==='lend'){add(w,-a);for(const p of r.pays||[])add(p.w||w,+p.a||0)}
    else if(r.type==='borrow'){add(w,a);for(const p of r.pays||[])add(p.w||w,-(+p.a||0))}}
  return B}
const sumW=(B,L)=>L.reduce((a,i)=>a+(B[i]||0),0);
const monthTx=mk=>recs('tx').map(i=>R[i]).filter(r=>r.date&&r.date.startsWith(mk));
const sumT=(L,t)=>L.filter(r=>r.type===t).reduce((a,r)=>a+(+r.amount||0),0);
const mkOf=d=>`${d.getFullYear()}-${pad(d.getMonth()+1)}`;
const mkAdd=(mk,n)=>{const [y,m]=mk.split('-').map(Number);return mkOf(new Date(y,m-1+n,1))};
// ngân sách
const budOf=cat=>R['ebud'+cat]&&R['ebud'+cat].k==='bud'?+R['ebud'+cat].amount||0:0;
const catSpent=(mk,cat)=>monthTx(mk).filter(r=>r.type==='out'&&r.cat===cat).reduce((a,r)=>a+(+r.amount||0),0);
const budCls=p=>p>=1?'over':p>=.8?'warn':'ok';
// khoản định kỳ có tiền → chờ xác nhận
function pendingPays(){const t=today(),L=[];
  for(const i of recs('rem')){const r=R[i];if(!r.money||!(+r.amt>0)||r.on===false)continue;
    const back=r.freq==='day'?0:r.freq==='week'?6:10;
    for(let d=back;d>=0;d--){const k=addDays(t,-d);if(remOn(r,k)&&!(r.pd&&r.pd[k]))L.push({src:i,k,amt:+r.amt,t:r.title,cat:r.cat||'bill',w:r.w})}}
  for(const i of recs('sub')){const r=R[i];if(r.on===false||!(+r.price>0)||!r.start)continue;
    for(let d=10;d>=0;d--){const k=addDays(t,-d);if(subNext(r,k)===k&&!(r.pd&&r.pd[k]))L.push({src:i,k,amt:+r.price,t:'Gia hạn '+r.name,cat:r.cat||'bill',w:r.w})}}
  return L.sort((a,b)=>a.k.localeCompare(b.k))}
const ppRow=p=>`<div class="pp"><i>${catOf('out',p.cat)[1]}</i><div><b>${esc(p.t)}</b><small>${relDay(p.k)} · <b class="red">${fmt(p.amt)}</b></small></div>
  <button class="ppok" data-pp="${p.src}|${p.k}">✓ Đã trả</button><button class="ppx" data-ps="${p.src}|${p.k}" title="Bỏ qua">✕</button></div>`;
function payPending(src,k,skip){const r=R[src];if(!r)return;r.pd=r.pd||{};
  if(skip){r.pd[k]='skip';putRec(src,r);toast('Đã bỏ qua');return render()}
  const p=pendingPays().find(x=>x.src===src&&x.k===k);if(!p)return;
  const id='e'+uid();putRec(id,{k:'tx',type:'out',amount:p.amt,cat:p.cat,w:p.w&&R[p.w]?p.w:WDEF,date:k,note:p.t,src});
  r.pd[k]=id;putRec(src,r);toast('Đã ghi chi '+fmt(p.amt)+' ✓');budAlert(p.cat,k.slice(0,7),p.amt);render()}
function avgDaily(){const t=today(),from=addDays(t,-90),L=recs('tx').map(i=>R[i]).filter(r=>r.type==='out'&&!r.src&&r.date);
  if(!L.length)return 0;const first=L.reduce((a,r)=>r.date<a?r.date:a,t),span=Math.max(30,Math.min(90,diffDays(first,t)+1));
  return L.filter(r=>r.date>=from&&r.date<=t).reduce((a,r)=>a+(+r.amount||0),0)/span}
function forecast(days=90){
  const t=today(),B=balances(),start=sumW(B,spendW()),ev=[];
  for(const p of pendingPays())ev.push({k:t,v:-p.amt,t:p.t,ic:catOf('out',p.cat)[1]});
  for(let d=1;d<days;d++){const k=addDays(t,d);
    for(const i of recs('rem')){const r=R[i];if(r.money&&+r.amt>0&&r.on!==false&&remOn(r,k))ev.push({k,v:-r.amt,t:r.title,ic:'🔁'})}
    for(const i of recs('sub')){const r=R[i];if(r.on!==false&&+r.price>0&&r.start&&subNext(r,k)===k)ev.push({k,v:-r.price,t:'Gia hạn '+r.name,ic:'💳'})}}
  for(const i of recs('inc')){const r=R[i];if(r.got||!(+r.amount>0))continue;const k=!r.date||r.date<t?t:r.date;if(diffDays(t,k)<days)ev.push({k,v:+r.amount,t:r.title,ic:'🤝',late:r.date<t})}
  for(const i of recs('tx')){const r=R[i];if(!isLoan(r)||!r.due)continue;const left=loanLeft(r);if(!left)continue;
    const k=r.due<t?t:r.due;if(diffDays(t,k)<days)ev.push({k,v:r.type==='lend'?left:-left,t:(r.type==='lend'?'Thu nợ ':'Trả nợ ')+(r.who||''),ic:'🤝',late:r.due<t})}
  ev.sort((a,b)=>a.k.localeCompare(b.k));
  const daily=S.fcVar===false?0:avgDaily(),series=[];let bal=start,j=0,min=start,minK=t;
  for(let d=0;d<days;d++){const k=addDays(t,d);if(d>0)bal-=daily;while(j<ev.length&&ev[j].k===k)bal+=ev[j++].v;series.push([k,bal]);if(bal<min){min=bal;minK=k}}
  return {start,series,ev,daily,min,minK,end:bal}}
function fcSvg(f){
  const W=340,H=130,P=6,vals=f.series.map(x=>x[1]),thr=+S.cashMin||0;
  let lo=Math.min(...vals,thr>0?thr:Infinity),hi=Math.max(thr,...vals);const pad2=(hi-lo)*.15||Math.abs(hi)*.05||1;lo-=pad2;hi+=pad2;
  const X=d=>P+d*(W-2*P)/(vals.length-1),Y=v=>H-P-(v-lo)*(H-2*P)/(hi-lo);
  const pts=vals.map((v,d)=>`${X(d).toFixed(1)},${Y(v).toFixed(1)}`).join(' ');
  const mi=vals.indexOf(Math.min(...vals));
  const ticks=[0,30,60,vals.length-1].map(d=>`<text x="${Math.min(W-30,X(d))}" y="${H+12}" class="tk">${fmtDM(f.series[d][0])}</text>`).join('');
  return `<svg viewBox="0 0 ${W} ${H+16}" class="fcsvg" role="img" aria-label="Dự báo số dư 90 ngày">
    ${lo<0?`<line x1="0" x2="${W}" y1="${Y(0)}" y2="${Y(0)}" class="zero"/>`:''}
    ${thr>0?`<line x1="0" x2="${W}" y1="${Y(thr)}" y2="${Y(thr)}" class="thr"/>`:''}
    <polygon points="${X(0)},${H-P} ${pts} ${X(vals.length-1)},${H-P}" class="area"/>
    <polyline points="${pts}" class="ln"/>
    <circle cx="${X(mi)}" cy="${Y(vals[mi])}" r="3.5" class="mn"/>${ticks}</svg>`}
// nhắc chi vượt ngân sách
function budAlert(cat,mk,added){const b=budOf(cat);if(!b)return;const s=catSpent(mk,cat),p=s/b,p0=(s-added)/b,C=catOf('out',cat);
  if(p>=1&&p0<1)toast(`⚠️ ${C[2]} đã vượt ngân sách tháng (${fmtS(s)}/${fmtS(b)})`);
  else if(p>=.8&&p0<.8)toast(`⚠️ ${C[2]} đã dùng ${Math.round(p*100)}% ngân sách tháng`)}
// gợi ý để riêng vào quỹ khi có thu nhập
function fundSuggest(r){const f=goalW().find(i=>+R[i].pct>0);if(!f||!(+r.amount>0))return;
  const a=Math.round(+r.amount*(+R[f].pct)/100/1000)*1000;if(!a)return;
  setTimeout(()=>{if(confirm(`Vừa có khoản thu ${fmt(r.amount)}.\nĐể riêng ${R[f].pct}% = ${fmt(a)} vào “${R[f].name}”?`)){
    putRec('e'+uid(),{k:'tx',type:'xfer',amount:a,w:r.w||WDEF,w2:f,date:today(),note:'Để riêng vào '+R[f].name});toast('Đã chuyển vào '+R[f].name+' ✓');render()}},350)}
function recvInc(id){const r=R[id];if(!r||r.got)return;const tid='e'+uid();
  const tx={k:'tx',type:'in',amount:+r.amount||0,cat:r.cat||'comm',w:r.w&&R[r.w]?r.w:WDEF,date:today(),note:r.title,src:id};
  putRec(tid,tx);r.got=true;r.gotTx=tid;r.gotOn=today();putRec(id,r);toast('Đã ghi thu '+fmt(r.amount)+' ✓');render();fundSuggest(tx)}
function unlinkTx(id){const r=R[id];if(!r||!r.src||!R[r.src])return;const s=R[r.src];
  if(s.k==='inc'&&s.gotTx===id){s.got=false;delete s.gotTx;delete s.gotOn;putRec(r.src,s)}
  else if(s.pd){for(const k in s.pd)if(s.pd[k]===id)delete s.pd[k];putRec(r.src,s)}}

function renderMoney(){
  if(ensureWallet())save();
  const tabs=[['ov','Tổng quan'],['tx','Thu chi'],['loan','Vay nợ'],['plan','Kế hoạch'],['rep','Báo cáo']];
  let h=`<div class="seg">${tabs.map(([k,l])=>`<button class="${moneyTab===k?'on':''}" data-mt="${k}">${l}</button>`).join('')}</div>`;
  h+=({ov:mOverview,tx:mTx,loan:mLoan,plan:mPlan,rep:mReport}[moneyTab]||mOverview)();
  $('#v-money').innerHTML=h}
function mOverview(){
  const t=today(),B=balances(),sp=spendW(),gl=goalW(),f=forecast(90),thr=+S.cashMin||0;
  let h=`<div class="mhero"><small>Tiền đang có</small><b class="${f.start<0?'red':''}">${fmt(f.start)}</b>
    ${gl.length?`<small>+ Quỹ & mục tiêu: ${fmt(sumW(B,gl))}</small>`:''}
    <div class="wals">${wallets().map(i=>`<button class="wal" data-edit="wallet:${i}"><span>${wtOf(R[i].type)[1]}</span><div><small>${esc(R[i].name)}</small><b class="${(B[i]||0)<0?'red':''}">${fmtS(B[i]||0)}</b></div></button>`).join('')}
    <button class="wal add" data-act="wallet-new"><span>＋</span><div><small>Thêm ví</small></div></button></div></div>`;
  const pend=pendingPays();
  if(pend.length)h+=`<div class="box"><div class="bh"><b>Chờ xác nhận</b><small>${pend.length} khoản</small></div>${pend.map(ppRow).join('')}</div>`;
  const low=f.min<thr;
  h+=`<div class="box"><div class="bh"><b>Dự báo 90 ngày</b><small>cuối kỳ ≈ ${fmtS(f.end)}</small></div>
    <div class="fcmsg ${low?'bad':'good'}">${low?`⚠️ Khoảng <b>${fmtDMY(f.minK)}</b> tiền có thể xuống còn <b>${fmt(Math.round(f.min/1000)*1000)}</b>${thr>0?` — dưới mức an toàn ${fmtS(thr)}`:''}`:`✓ 90 ngày tới tiền luôn trên <b>${fmtS(Math.max(thr,f.min))}</b>`}</div>
    ${fcSvg(f)}
    <div class="note">Đã tính: ${f.ev.filter(e=>e.v<0).length} khoản sắp chi, ${f.ev.filter(e=>e.v>0).length} khoản sắp thu${f.daily?`, chi tiêu sinh hoạt ≈ ${fmtS(f.daily)}/ngày (trung bình gần đây)`:''}. <button class="lnk" data-mt="plan">Chỉnh ›</button></div></div>`;
  const up=f.ev.filter(e=>diffDays(t,e.k)<=30).slice(0,14);
  if(up.length)h+=`<div class="box"><div class="bh"><b>30 ngày tới</b><small>${fmtS(up.filter(e=>e.v>0).reduce((a,e)=>a+e.v,0))} vào · ${fmtS(-up.filter(e=>e.v<0).reduce((a,e)=>a+e.v,0))} ra</small></div>
    ${up.map(e=>`<div class="fcrow"><i>${e.ic}</i><div><b>${esc(e.t)}</b><small class="${e.late?'red':''}">${e.late?'Quá hạn':relDay(e.k)}</small></div><b class="${e.v>0?'grn':'red'}">${e.v>0?'+':'−'}${fmtS(Math.abs(e.v))}</b></div>`).join('')}</div>`;
  if(!recs('tx').length&&!recs('inc').length)h+=`<div class="note">Bắt đầu: bấm vào ví “Tiền mặt” để nhập số dư hiện có, thêm ví ngân hàng, rồi ghi thu chi bằng nút ＋.</div>`;
  return h}
function mTx(){
  const y=moneyM.getFullYear(),m=moneyM.getMonth(),mk=`${y}-${pad(m+1)}`,multi=wallets().length>1;
  const L=recs('tx').filter(i=>['out','in','xfer'].includes(R[i].type)&&R[i].date&&R[i].date.startsWith(mk)).sort((a,b)=>R[b].date.localeCompare(R[a].date)||(R[b].at||0)-(R[a].at||0));
  const txs=L.map(i=>R[i]),out=sumT(txs,'out'),inn=sumT(txs,'in');
  const bc={};txs.filter(r=>r.type==='out').forEach(r=>bc[r.cat]=(bc[r.cat]||0)+(+r.amount||0));
  CAT_OUT.forEach(c=>{if(budOf(c[0])&&!(c[0] in bc))bc[c[0]]=0});
  const cats=Object.entries(bc).sort((a,b)=>b[1]-a[1]),mx=Math.max(1,...cats.map(c=>c[1]));
  let h=`<div class="cal-h"><button class="nav" data-mm="-1">‹</button><h2>Tháng ${m+1}, ${y}</h2><button class="nav" data-mm="1">›</button></div>
    <div class="msum"><div><small>Thu</small><b class="grn">${fmtS(inn)}</b></div><div><small>Chi</small><b class="red">${fmtS(out)}</b></div><div><small>Còn lại</small><b>${fmtS(inn-out)}</b></div></div>`;
  if(cats.length)h+=`<div class="box"><div class="bh"><b>Chi theo danh mục</b><button class="lnk" data-act="bud-new">Ngân sách ›</button></div>${cats.map(([c,v])=>{const C=catOf('out',c),b=budOf(c),p=b?v/b:0;
    return `<button class="cbar" data-act="bud-cat" data-cat="${c}"><span>${C[1]} ${C[2]}</span><div class="bar ${b?budCls(p):''}"><i style="width:${Math.min(100,b?p*100:v/mx*100)}%"></i></div><b>${b?`${fmtS(v)}/${fmtS(b)}`:fmtS(v)}</b></button>`}).join('')}</div>`;
  let cur='';
  for(const i of L){const r=R[i];
    if(r.date!==cur){cur=r.date;const d=parse(cur);h+=`<div class="month">${DOWL[d.getDay()]}, ${fmtDMY(cur)}</div>`}
    if(r.type==='xfer'){h+=`<button class="ev" data-edit="tx:${i}"><i style="background:#8a8277">↔️</i><div><b>${esc(r.note||'Chuyển tiền')}</b><small>${esc(wName(r.w||WDEF))} → ${esc(wName(r.w2||WDEF))}</small></div><b>${fmtN(r.amount)}</b></button>`;continue}
    const C=catOf(r.type,r.cat);
    h+=`<button class="ev" data-edit="tx:${i}"><i style="background:${r.type==='in'?MOD.money.c:'#c9764f'}">${C[1]}</i><div><b>${esc(r.note||C[2])}</b><small>${esc(C[2])}${multi?' · '+esc(wName(r.w||WDEF)):''}${r.src?' · 🔁':''}</small></div><b class="${r.type==='in'?'grn':'red'}">${r.type==='in'?'+':'−'}${fmtN(r.amount)}</b></button>`}
  if(!L.length)h+=`<div class="empty"><div class="big">💰</div>Tháng này chưa ghi khoản nào.<br>Bấm ＋ để ghi chi tiêu, thu nhập.</div>`;
  return h}
function mLoan(){
  const t=today(),L=recs('tx').filter(i=>isLoan(R[i])).map(i=>({i,r:R[i],left:loanLeft(R[i])}))
    .sort((a,b)=>(+!a.left-+!b.left)||((a.r.due||'9')).localeCompare(b.r.due||'9')||(b.r.date||'').localeCompare(a.r.date||''));
  const open=t2=>L.filter(x=>x.r.type===t2).reduce((a,x)=>a+x.left,0);
  let h=`<div class="msum two"><div><small>Người khác nợ anh</small><b class="grn">${fmt(open('lend'))}</b></div><div><small>Anh đang nợ</small><b class="red">${fmt(open('borrow'))}</b></div></div>`;
  h+=L.map(({i,r,left})=>{const done=!left,paidA=payTotal(r),od=r.due&&r.due<t&&!done;
    return `<div class="loan${done?' done':''}"><button class="tt" data-edit="tx:${i}"><b>${r.type==='lend'?'🫴 Cho':'🤲 Vay'} ${esc(r.who||'')}</b>
      <small>${fmt(r.amount)}${paidA?` · đã ${r.type==='lend'?'thu':'trả'} ${fmtS(paidA)}`:''}${r.date?' · từ '+fmtDM(r.date):''}</small>
      ${done?`<small>✓ Đã xong</small>`:`<small class="${od?'red':''}">Còn <b>${fmt(left)}</b>${r.due?` · hạn ${od?'đã qua ':''}${fmtDMY(r.due)}`:''}</small>`}
      ${(+r.amount||0)>0&&paidA?`<div class="bar"><i style="width:${Math.min(100,paidA/(+r.amount)*100)}%"></i></div>`:''}</button>
      ${done?'':`<button class="ppok" data-pay="${i}">${r.type==='lend'?'Thu':'Trả'}</button>`}</div>`}).join('')||`<div class="empty"><div class="big">🤝</div>Chưa có khoản vay mượn nào.<br>Bấm ＋ để ghi cho vay / đi vay, có hạn trả và trả dần từng phần.</div>`;
  return h}
function mPlan(){
  const t=today(),mk=t.slice(0,7),B=balances();
  const inc=recs('inc').map(i=>({i,r:R[i]})),wait=inc.filter(x=>!x.r.got).sort((a,b)=>(a.r.date||'').localeCompare(b.r.date||'')),got=inc.filter(x=>x.r.got).sort((a,b)=>(b.r.gotOn||'').localeCompare(a.r.gotOn||'')).slice(0,5);
  let h=`<div class="box"><div class="bh"><b>🤝 Sắp thu (hoa hồng, tiền về)</b><small>${fmtS(wait.reduce((a,x)=>a+(+x.r.amount||0),0))}</small></div>
    ${wait.map(({i,r})=>`<div class="pp"><i>${catOf('in',r.cat)[1]}</i><button class="tt" data-edit="inc:${i}"><b>${esc(r.title)}</b><small class="${r.date&&r.date<t?'red':''}">${r.date?(r.date<t?'Quá hạn · '+fmtDMY(r.date):relDay(r.date)):'Chưa rõ ngày'} · <b class="grn">${fmt(r.amount)}</b></small></button><button class="ppok" data-recv="${i}">Đã nhận</button></div>`).join('')||'<div class="note">Ghi trước các khoản hoa hồng sắp về để dự báo dòng tiền chính xác.</div>'}
    ${got.length?`<div class="sub">Đã nhận gần đây</div>${got.map(({i,r})=>`<button class="ev" data-edit="inc:${i}"><i style="background:${MOD.money.c}">✓</i><div><b>${esc(r.title)}</b><small>${fmt(r.amount)} · ${r.gotOn?fmtDMY(r.gotOn):''}</small></div></button>`).join('')}`:''}
    <button class="btn ghost sm" data-act="inc-new">＋ Thêm khoản sắp thu</button></div>`;
  const buds=recs('bud').map(i=>R[i]).filter(b=>+b.amount>0);
  h+=`<div class="box"><div class="bh"><b>📊 Ngân sách tháng ${+mk.slice(5)}</b><small>${buds.length?fmtS(buds.reduce((a,b)=>a+catSpent(mk,b.cat),0))+' / '+fmtS(buds.reduce((a,b)=>a+(+b.amount),0)):''}</small></div>
    ${buds.map(b=>{const C=catOf('out',b.cat),s=catSpent(mk,b.cat),p=s/(+b.amount);return `<button class="cbar" data-edit="bud:ebud${b.cat}"><span>${C[1]} ${C[2]}</span><div class="bar ${budCls(p)}"><i style="width:${Math.min(100,p*100)}%"></i></div><b>${fmtS(s)}/${fmtS(b.amount)}</b></button>`}).join('')||'<div class="note">Đặt mức chi tối đa mỗi tháng cho từng danh mục, app sẽ báo khi dùng tới 80% và khi vượt.</div>'}
    <button class="btn ghost sm" data-act="bud-new">＋ Đặt ngân sách</button></div>`;
  h+=subPlanHtml(12,true);
  const gl=goalW();
  h+=`<div class="box"><div class="bh"><b>🎯 Quỹ & mục tiêu</b><small>${gl.length?fmtS(sumW(B,gl)):''}</small></div>
    ${gl.map(i=>{const r=R[i],v=B[i]||0,tg=+r.target||0;return `<div class="pp"><i>🎯</i><button class="tt" data-edit="wallet:${i}"><b>${esc(r.name)}</b><small>${fmt(v)}${tg?` / ${fmtS(tg)} · ${Math.round(v/tg*100)}%`:''}${+r.pct>0?` · tự gợi ý ${r.pct}% mỗi khoản thu`:''}</small>${tg?`<div class="bar"><i style="width:${Math.max(0,Math.min(100,v/tg*100))}%"></i></div>`:''}</button><button class="ppok" data-fund="${i}">＋ Góp</button></div>`}).join('')||'<div class="note">Tạo “Quỹ dự phòng” để để riêng một phần mỗi khi nhận hoa hồng — tháng không có thu vẫn đủ chi. Hoặc mục tiêu như “Đặt cọc căn hộ 200tr”.</div>'}
    <button class="btn ghost sm" data-act="goal-new">＋ Tạo quỹ / mục tiêu</button></div>`;
  h+=`<div class="box"><div class="bh"><b>⚙️ Dự báo dòng tiền</b></div>
    <div class="row"><div>Mức an toàn<small>Cảnh báo khi dự báo tiền xuống dưới mức này</small></div><button class="chip" data-act="cashmin">${+S.cashMin?fmtS(S.cashMin):'Chưa đặt'}</button></div>
    <div class="row"><div>Tính chi tiêu sinh hoạt<small>Trừ dần theo mức chi trung bình gần đây (ăn uống, đi lại…)</small></div><input type="checkbox" class="sw" id="fcVar"${S.fcVar===false?'':' checked'}></div>
    <div class="note">Để dự báo chính xác: thêm số tiền vào các việc 🔁 Định kỳ (tiền điện, học phí…) và giá vào 💳 Gói đăng ký.</div></div>`;
  return h}
function mReport(){
  const t=today(),mk=t.slice(0,7),M=[];for(let n=5;n>=0;n--){const k=mkAdd(mk,-n),L=monthTx(k);M.push({k,inn:sumT(L,'in'),out:sumT(L,'out')})}
  const mx=Math.max(1,...M.map(x=>Math.max(x.inn,x.out))),W=340,H=120,bw=18;
  const svg=`<svg viewBox="0 0 ${W} ${H+18}" class="repsvg" role="img" aria-label="Thu chi 6 tháng">${M.map((x,j)=>{const cx=15+j*(W-30)/5;
    return `<rect x="${cx-bw-1}" y="${H-x.inn/mx*H}" width="${bw}" height="${x.inn/mx*H}" class="bi" rx="3"/><rect x="${cx+1}" y="${H-x.out/mx*H}" width="${bw}" height="${x.out/mx*H}" class="bo" rx="3"/><text x="${cx}" y="${H+14}" class="tk" text-anchor="middle">T${+x.k.slice(5)}</text>`}).join('')}</svg>`;
  const tot=M.reduce((a,x)=>({inn:a.inn+x.inn,out:a.out+x.out}),{inn:0,out:0}),rate=tot.inn?Math.round((tot.inn-tot.out)/tot.inn*100):null;
  let h=`<div class="msum"><div><small>Thu TB/tháng</small><b class="grn">${fmtS(tot.inn/6)}</b></div><div><small>Chi TB/tháng</small><b class="red">${fmtS(tot.out/6)}</b></div><div><small>Tiết kiệm</small><b>${rate==null?'—':rate+'%'}</b></div></div>
    <div class="box"><div class="bh"><b>Thu chi 6 tháng</b><small><span class="dot bi"></span>Thu <span class="dot bo"></span>Chi</small></div>${svg}
    ${M.slice().reverse().filter(x=>x.inn||x.out).map(x=>`<div class="fcrow"><i>📅</i><div><b>Tháng ${+x.k.slice(5)}/${x.k.slice(0,4)}</b><small>Thu ${fmtS(x.inn)} · Chi ${fmtS(x.out)}${x.inn?` · tiết kiệm ${Math.round((x.inn-x.out)/x.inn*100)}%`:''}</small></div><b class="${x.inn-x.out<0?'red':'grn'}">${x.inn-x.out<0?'−':'+'}${fmtS(Math.abs(x.inn-x.out))}</b></div>`).join('')}</div>`;
  const cur={},prev={};monthTx(mk).filter(r=>r.type==='out').forEach(r=>cur[r.cat]=(cur[r.cat]||0)+(+r.amount||0));
  for(let n=1;n<=3;n++)monthTx(mkAdd(mk,-n)).filter(r=>r.type==='out').forEach(r=>prev[r.cat]=(prev[r.cat]||0)+(+r.amount||0)/3);
  const an=Object.keys(cur).filter(c=>prev[c]>0&&cur[c]>prev[c]*1.3&&cur[c]-prev[c]>300000).map(c=>[c,cur[c],prev[c]]).sort((a,b)=>(b[1]-b[2])-(a[1]-a[2]));
  const top=Object.entries(cur).sort((a,b)=>b[1]-a[1]).slice(0,5),ct=Object.values(cur).reduce((a,v)=>a+v,0);
  h+=`<div class="box"><div class="bh"><b>Tháng này chi vào đâu</b><small>${fmtS(ct)}</small></div>${top.map(([c,v])=>{const C=catOf('out',c);return `<div class="cbar"><span>${C[1]} ${C[2]}</span><div class="bar"><i style="width:${v/ct*100}%"></i></div><b>${Math.round(v/ct*100)}%</b></div>`}).join('')||'<div class="note">Chưa có khoản chi nào tháng này.</div>'}</div>`;
  h+=`<div class="box"><div class="bh"><b>Bất thường</b><small>so với TB 3 tháng trước</small></div>${an.map(([c,v,p])=>{const C=catOf('out',c);return `<div class="fcrow"><i>${C[1]}</i><div><b>${C[2]} tăng ${Math.round((v/p-1)*100)}%</b><small>${fmtS(v)} so với TB ${fmtS(p)}</small></div><b class="red">+${fmtS(v-p)}</b></div>`}).join('')||'<div class="note">✓ Không có danh mục nào chi tăng bất thường.</div>'}</div>`;
  return h}

/* ---------- GÓI ĐĂNG KÝ ---------- */
// dự tính chi gói đăng ký theo từng tháng (tính đúng ngày gia hạn thật, không chia trung bình)
function subPlan(months=12){const t=today(),mk0=t.slice(0,7),end=mkAdd(mk0,months),M=[];
  for(let j=0;j<months;j++)M.push({k:mkAdd(mk0,j),sum:0,it:[]});
  for(const i of recs('sub')){const r=R[i];if(r.on===false||!r.start||!(+r.price>0))continue;let k=subNext(r,t),g=0;
    while(k&&k.slice(0,7)<end&&g++<400){const m=M.find(x=>x.k===k.slice(0,7));if(m){m.sum+=+r.price;m.it.push({i,n:r.name,k,p:+r.price,paid:!!(r.pd&&r.pd[k]&&r.pd[k]!=='skip')})}k=subNext(r,addDays(k,1))}}
  return M}
function subPlanHtml(months=12,compact){const M=subPlan(months),tot=M.reduce((a,m)=>a+m.sum,0),mx=Math.max(1,...M.map(m=>m.sum));
  if(!tot)return '';
  return `<div class="box"><div class="bh"><b>${compact?'💳 Gói đăng ký':'📅 Dự tính chi'} · ${months} tháng tới</b><small><b>${fmtS(tot)}</b></small></div>
    ${M.map(m=>`<details class="spm"${m.sum&&!compact&&m===M.find(x=>x.sum)?' open':''}><summary class="cbar"><span>T${+m.k.slice(5)}/${m.k.slice(2,4)}</span><div class="bar"><i style="width:${m.sum/mx*100}%"></i></div><b>${m.sum?fmtS(m.sum):'—'}</b></summary>
      ${m.it.sort((a,b)=>a.k.localeCompare(b.k)).map(x=>`<button class="fcrow" data-edit="sub:${x.i}"><i>💳</i><div><b>${esc(x.n)}</b><small>${fmtDMY(x.k)}${x.paid?' · ✓ đã trả':''}</small></div><b class="red">−${fmtS(x.p)}</b></button>`).join('')}</details>`).join('')}
    ${compact?`<button class="btn ghost sm" data-go="sub">Xem gói đăng ký ›</button>`:''}</div>`}
function renderSub(){
  const t=today(),L=recs('sub').map(i=>({i,r:R[i],n:R[i].on===false?null:subNext(R[i],t)})).sort((a,b)=>(a.n||'9').localeCompare(b.n||'9'));
  const act=L.filter(x=>x.n),mon=act.reduce((a,x)=>a+subMonthly(x.r),0);
  $('#v-sub').innerHTML=`<div class="msum two"><div><small>Mỗi tháng (ước tính)</small><b>${fmt(mon)}</b></div><div><small>Mỗi năm</small><b>${fmt(mon*12)}</b></div></div>
    ${subPlanHtml(12)}${L.length?'<div class="month">Các gói</div>':''}
    ${L.map(({i,r,n})=>`<button class="ev" data-edit="sub:${i}"><i style="background:${MOD.sub.c}">${esc((r.name||'?')[0].toUpperCase())}</i><div><b>${esc(r.name)}</b><small>${fmt(r.price)} / ${r.cycle==='year'?'năm':'tháng'}</small><small class="${n&&diffDays(t,n)<=(+r.pre||0)?'red':''}">${n?'Gia hạn: '+(n===t?'Hôm nay':relDay(n)):'Đã ngừng'}</small></div></button>`).join('')||
    `<div class="empty"><div class="big">💳</div>Chưa có gói nào.<br>Thêm iCloud, Netflix, Google One, tên miền, bảo hiểm… để được nhắc trước ngày gia hạn.</div>`}`}

/* ---------- THÓI QUEN ---------- */
const habMsg=r=>(r.rmsg||'').trim()||(/ngủ/i.test(r.name||'')?`${r.rt||'23:00'} rồi, đi ngủ thôi 😴`:`${r.rt||''} rồi — ${r.name||''}`);
// danh sách giờ nhắc thói quen (không chứa dữ liệu nhạy cảm) để vẫn nhắc được khi app đang khoá
function habCache(){try{put('nk_hrem',recs('habit').filter(i=>R[i].rem&&R[i].rt).map(i=>({id:i,t:R[i].rt,m:habMsg(R[i]),ic:R[i].icon||'⏰'})))}catch{}}
function habCheck(){
  if(!S.ntf)return;const L=get('nk_hrem',[]);if(!L.length)return;
  const t=today(),n=new Date(),now=`${pad(n.getHours())}:${pad(n.getMinutes())}`,sent=get('nk_ntf',{});let ch=false;
  for(const h of L){const k='h:'+h.id+':'+t,[hh,mm]=h.t.split(':').map(Number),end=`${pad(Math.min(23,hh+1))}:${hh>=23?'59':pad(mm)}`;
    if(now>=h.t&&now<=end&&!sent[k]){sent[k]=t;ch=true;notify(`${h.ic} ${h.m}`,'Đăng Dũng Life',k);if(!document.hidden)nudge(h)}}
  if(ch)put('nk_ntf',sent)}
function nudge(h){let el=$('#nudge');if(!el){el=document.createElement('div');el.id='nudge';document.body.appendChild(el)}
  el.innerHTML=`<div class="nbox"><div class="nic">${esc(h.ic)}</div><b>${esc(h.m)}</b><button class="btn" id="nudgeOk">OK</button></div>`;
  el.classList.add('on');$('#nudgeOk').onclick=()=>el.classList.remove('on')}
function habStreak(r){const t=today();let d=r.days&&r.days[t]?t:addDays(t,-1),n=0;while(r.days&&r.days[d]){n++;d=addDays(d,-1)}return n}
function renderHabit(){
  const t=today(),L=recs('habit').sort((a,b)=>(R[a].c||R[a].at||0)-(R[b].c||R[b].at||0));
  const days=Array.from({length:7},(_,i)=>addDays(t,i-6));
  $('#v-habit').innerHTML=L.map(i=>{const r=R[i],on=r.days&&r.days[t],st=habStreak(r),m30=Array.from({length:30},(_,j)=>addDays(t,-j)).filter(k=>r.days&&r.days[k]).length;
    return `<div class="hab${on?' on':''}"><div class="hh"><button class="hi" data-edit="habit:${i}">${r.icon||'🌱'}</button><button class="hn" data-edit="habit:${i}"><b>${esc(r.name)}</b><small>${st?`🔥 ${st} ngày liên tiếp · `:''}${m30}/30 ngày${r.rem&&r.rt?' · ⏰ '+r.rt:''}</small></button>
      <button class="hck${on?' on':''}" data-hab="${i}">${on?'✓':'○'}</button></div>
      <div class="hdays">${days.map(k=>`<button class="${r.days&&r.days[k]?'on':''}${k===t?' td':''}" data-habd="${i}|${k}"><small>${DOW[(parse(k).getDay()+6)%7]}</small>${+k.slice(8)}</button>`).join('')}</div></div>`}).join('')+
    (L.length?'':`<div class="empty"><div class="big">🌱</div>Bắt đầu từ một thói quen nhỏ</div>`)+
    `<div class="month">Gợi ý</div><div class="chips wrap">${HSUG.filter(s=>!L.some(i=>R[i].name===s[1])).map(s=>`<button class="chip" data-hsug="${esc(s[0]+'|'+s[1])}">${s[0]} ${esc(s[1])}</button>`).join('')}</div>`}
function toggleHab(id,k){const r=R[id];if(!r)return;r.days=r.days||{};if(r.days[k])delete r.days[k];else r.days[k]=1;putRec(id,r);render()}

/* ---------- KHO CÁ NHÂN ---------- */
function renderVault(){
  const L=recs('vault').filter(i=>vaultCat==='all'||R[i].cat===vaultCat).sort((a,b)=>(R[a].title||'').localeCompare(R[b].title||'','vi'));
  const t=today();
  $('#v-vault').innerHTML=`<div class="chips">${[['all','Tất cả'],...VCAT.map(x=>[x[0],x[1]+' '+x[2]])].map(([k,l])=>`<button class="chip${vaultCat===k?' on':''}" data-vc="${k}">${l}</button>`).join('')}</div>
    ${L.map(i=>{const r=R[i],C=VCAT.find(x=>x[0]===r.cat)||VCAT[5],n=r.exp?diffDays(t,r.exp):null;
      return `<button class="ev" data-vread="${i}"><i style="background:${MOD.vault.c}">${C[1]}</i><div><b>${esc(r.title)}</b><small>${esc(C[2])}${(r.photos||[]).length?' · 📷'+r.photos.length:''}</small>${r.exp?`<small class="${n<=30?'red':''}">${n<0?'Đã hết hạn '+fmtDMY(r.exp):'Hết hạn '+fmtDMY(r.exp)+` · còn ${n} ngày`}</small>`:''}</div></button>`}).join('')||
      `<div class="empty"><div class="big">🗂️</div>Lưu giấy tờ, phiếu bảo hành, số tài khoản… (được mã hoá như nhật ký).<br>Có ngày hết hạn sẽ được nhắc trước 30 và 7 ngày.</div>`}`}
async function openVault(id){
  const r=R[id];if(!r)return;readCtx={k:'vault',id};const C=VCAT.find(x=>x[0]===r.cat)||VCAT[5];
  $('#rDate').innerHTML=`${esc(r.title)}<small>${C[1]} ${C[2]}</small>`;
  $('#rMeta').textContent=r.exp?'Hết hạn: '+fmtDMY(r.exp):'';
  $('#rTitle').classList.add('hidden');$('#rBody').textContent=r.body||'';
  $('#rPh').innerHTML=(r.photos||[]).map(p=>`<img data-p="${p}" alt="">`).join('');
  $('#reader').classList.remove('hidden');$('#rScroll').scrollTop=0;
  for(const i of $$('#rPh img')){const u=await pUrl(i.dataset.p);if(u)i.src=u}}

/* ---------- THÊM ---------- */
function renderMore(){
  const cnt={cal:'',diary:recs('diary').length,task:recs('task').filter(i=>!R[i].done).length,rem:recs('rem').length,people:recs('person').length,gio:recs('gio').length,money:'',sub:recs('sub').length,habit:recs('habit').length,vault:recs('vault').length};
  $('#v-more').innerHTML=`<div class="mods">${TABBABLE.map(m=>`<button data-go="${m}"><span class="ti" style="background:${MOD[m].c}">${MOD[m].i}</span><b>${MOD[m].n}</b><small>${cnt[m]!==''&&cnt[m]!=null?cnt[m]+' mục':''}</small></button>`).join('')}
    <button data-act="tk"><span class="ti" style="background:var(--tk)">🍃</span><b>24 tiết khí</b><small></small></button>
    <button data-go="set"><span class="ti" style="background:#8a8277">⚙️</span><b>Cài đặt</b><small></small></button></div>
    <p class="copy" style="text-align:center">Đăng Dũng Life · © 2026 Đăng Dũng</p>`}

/* ---------- MENU THÊM NHANH ---------- */
function openMenu(dk){
  const it=[['write','📔','Nhật ký',MOD.diary.c],['task','✅','Việc',MOD.task.c],['rem','🔁','Định kỳ',MOD.rem.c],['out','💸','Khoản chi','#c9764f'],['in','💵','Khoản thu',MOD.money.c],['xfer','↔️','Chuyển ví','#8a8277'],['inc','🤝','Sắp thu',MOD.money.c],['person','👤','Người thân',MOD.people.c],['gio','🕯️','Ngày giỗ',MOD.gio.c],['sub','💳','Gói đăng ký',MOD.sub.c],['vault','🗂️','Lưu giấy tờ',MOD.vault.c]];
  $('#mGrid').innerHTML=it.map(([a,i,n,c])=>`<button data-m="${a}"><span class="ti" style="background:${c}">${i}</span>${n}</button>`).join('');
  $('#menu').dataset.d=dk;$('#menu').classList.remove('hidden')}
function menuAct(a,dk){
  $('#menu').classList.add('hidden');
  ({write:()=>openEntry(null,dk),task:()=>openForm('task',null,{due:dk}),rem:()=>openForm('rem',null,{date:dk}),out:()=>openForm('tx',null,{type:'out',date:dk}),in:()=>openForm('tx',null,{type:'in',cat:'salary',date:dk}),xfer:()=>openForm('tx',null,{type:'xfer',date:dk}),inc:()=>openForm('inc',null,{date:dk>today()?dk:addDays(today(),30)}),
    person:()=>openForm('person'),gio:()=>openForm('gio'),sub:()=>openForm('sub',null,{start:dk}),vault:()=>openForm('vault')})[a]()}

/* ---------- BIỂU MẪU CHUNG ---------- */
const DEF={task:()=>({title:'',due:'',time:'',star:false,note:'',done:false}),
  rem:()=>({title:'',freq:'month',money:false,amt:0,cat:'bill',w:WDEF,pre7:false,pre1:false,lunar:false,ld:'1',lm:'1',date:today(),time:'08:00',label:'personal',on:true,note:''}),
  person:()=>({name:'',rel:'',phone:'',bmode:'none',bday:'',bld:'1',blm:'1',byear:'',note:''}),
  gio:()=>({name:'',rel:'',ld:'1',lm:'1',year:'',place:'',note:''}),
  tx:()=>({type:'out',amount:0,cat:'food',who:'',due:'',w:S.lastW&&R[S.lastW]?S.lastW:WDEF,w2:'',date:today(),note:''}),
  wallet:()=>({name:'',type:'bank',bal:0,target:0,pct:'0',note:''}),
  inc:()=>({title:'',amount:0,date:addDays(today(),30),cat:'comm',w:WDEF,note:''}),
  bud:()=>({cat:'food',amount:0}),
  pay:()=>({a:0,d:today(),w:''}),
  sub:()=>({name:'',price:0,w:WDEF,cycle:'month',start:today(),pre:'3',on:true,note:''}),
  habit:()=>({name:'',icon:'💧',days:{},rem:false,rt:'',rmsg:''}),
  vault:()=>({title:'',cat:'doc',body:'',exp:'',photos:[]})};
const FORMS={
  task:{t:'Việc cần làm',f:v=>[{n:'title',t:'text',l:'Việc cần làm',req:1,ph:'VD: Gọi ngân hàng, gửi hồ sơ…'},{n:'due',t:'date',l:'Hạn (để trống = hộp chờ)',clear:1},
    ...(v.due?[{n:'time',t:'time',l:'Giờ báo (không bắt buộc — để trống sẽ báo lúc '+(S.evTime||'08:00')+')',clear:1}]:[]),{n:'star',t:'switch',l:'⭐ Quan trọng'},{n:'done',t:'switch',l:'Đã xong'},{n:'note',t:'area',l:'Ghi chú'}]},
  rem:{t:'Việc định kỳ',f:v=>{const lun=v.lunar&&(v.freq==='month'||v.freq==='year');return [
    {n:'title',t:'text',l:'Việc gì lặp lại',req:1,ph:'VD: Đóng tiền điện, uống thuốc, đi chùa ngày rằm…'},
    {n:'freq',t:'chips',l:'Tần suất',o:FREQ},
    ...(v.freq==='month'||v.freq==='year'?[{n:'lunar',t:'switch',l:'🌙 Theo âm lịch'}]:[]),
    ...(lun?[v.freq==='year'?{t:'lunar',l:'Ngày âm lịch',d:'ld',m:'lm'}:{n:'ld',t:'sel',l:'Ngày âm lịch',o:range(1,30)}]
      :[{n:'date',t:'date',l:v.freq==='once'?'Ngày':'Bắt đầu từ ngày',req:1}]),
    {n:'time',t:'time',l:'Giờ nhắc'},
    ...(v.freq==='month'||v.freq==='year'?[{n:'pre7',t:'switch',l:'🔔 Báo trước 1 tuần'}]:[]),
    ...(v.freq!=='day'?[{n:'pre1',t:'switch',l:'🔔 Báo trước 1 ngày'}]:[]),
    {n:'label',t:'chips',l:'Nhãn',o:LBL.map(x=>[x[0],x[1]+' '+x[2]])},
    {n:'money',t:'switch',l:'💸 Có khoản tiền phải trả'},
    ...(v.money?[{n:'amt',t:'money',l:'Số tiền mỗi lần'},{n:'cat',t:'chips',l:'Danh mục chi',o:CAT_OUT.map(x=>[x[0],x[1]+' '+x[2]])},...(wallets().length>1?[{n:'w',t:'sel',l:'Trả từ ví',o:wOpts()}]:[])]:[]),
    {n:'on',t:'switch',l:'Đang bật'},{n:'note',t:'area',l:'Ghi chú'},
    {t:'hint',h:v=>{const n=nextOf(k=>remOn(Object.assign({},v,{on:true}),k),today(),400),pr=remPres(v);return n?`🔔 Lần nhắc tiếp theo: <b>${relDay(n)==='Hôm nay'?'Hôm nay':DOWL[parse(n).getDay()]+', '+fmtDMY(n)}</b>${v.time?' lúc '+v.time:''} (âm lịch ${lunarTxt(n)})${pr.length?'<br>Báo trước: '+pr.map(d=>`${d===7?'1 tuần':'1 ngày'} (${fmtDM(addDays(n,-d))})`).join(', '):''}`:'Không có lần nhắc nào sắp tới'}}]}},
  person:{t:'Người thân',f:v=>[{n:'name',t:'text',l:'Họ tên',req:1},{n:'rel',t:'chips',l:'Quan hệ',o:REL.map(x=>[x,x])},{n:'phone',t:'tel',l:'Số điện thoại'},
    {n:'bmode',t:'chips',l:'Sinh nhật',o:[['none','Không rõ'],['solar','Dương lịch'],['lunar','Âm lịch']]},
    ...(v.bmode==='solar'?[{n:'bday',t:'date',l:'Ngày sinh'}]:v.bmode==='lunar'?[{t:'lunar',l:'Sinh nhật (âm lịch)',d:'bld',m:'blm'},{n:'byear',t:'num',l:'Năm sinh (không bắt buộc)'}]:[]),
    {n:'note',t:'area',l:'Ghi chú (sở thích, món thích ăn, size áo…)'}]},
  gio:{t:'Ngày giỗ',f:v=>[{n:'name',t:'text',l:'Tên ngày giỗ',req:1,ph:'VD: Ông nội, Bà ngoại, Tộc giỗ thu…'},
    {t:'lunar',l:'Ngày giỗ (âm lịch)',d:'ld',m:'lm'},
    {n:'year',t:'num',l:'Năm mất – âm lịch (không bắt buộc, để biết giỗ lần thứ mấy)'},
    {n:'place',t:'text',l:'Làm giỗ tại',ph:'VD: Nhà thờ họ, nhà bác Hai…'},{n:'note',t:'area',l:'Ghi chú (món cúng, người cần mời…)'},
    {t:'hint',h:v=>{const n=gioNext(v);return n?`🕯️ Giỗ tới: <b>${DOWL[parse(n).getDay()]}, ${fmtDMY(n)}</b> (${relDay(n)})<br>🔔 Nhắc trước 7 ngày (${fmtDM(addDays(n,-7))}), trước 1 ngày (${fmtDM(addDays(n,-1))}) và đúng ngày, lặp lại hằng năm theo âm lịch.`:''}}]},
  tx:{t:'Khoản tiền',f:v=>{const W=wOpts(),mw=W.length>1;return [{n:'type',t:'chips',l:'Loại',o:TXT},{n:'amount',t:'money',l:'Số tiền',req:1},
    ...(v.type==='out'||v.type==='in'?[{n:'cat',t:'chips',l:'Danh mục',o:(v.type==='in'?CAT_IN:CAT_OUT).map(x=>[x[0],x[1]+' '+x[2]])},...(mw?[{n:'w',t:'sel',l:v.type==='in'?'Vào ví':'Từ ví',o:W}]:[])]
      :v.type==='xfer'?[{n:'w',t:'sel',l:'Từ ví',o:W},{n:'w2',t:'sel',l:'Sang ví',o:[['','— chọn ví —'],...W]}]
      :[{n:'who',t:'text',l:v.type==='lend'?'Cho ai vay':'Vay của ai',req:1},...(mw?[{n:'w',t:'sel',l:v.type==='lend'?'Tiền ra từ ví':'Tiền vào ví',o:W}]:[]),
        {n:'due',t:'date',l:'Hạn trả (để được nhắc)',clear:1},
        ...(fId&&R[fId]&&(R[fId].pays||[]).length?[{t:'hint',h:()=>{const r=R[fId];return `Đã ${r.type==='lend'?'thu':'trả'}: ${r.pays.map(p=>`${fmtS(p.a)} (${fmtDM(p.d)})`).join(', ')}<br>Còn lại: <b>${fmt(Math.max(0,(+v.amount||0)-payTotal(r)))}</b>`}}]:[])]),
    {n:'date',t:'date',l:'Ngày',req:1},{n:'note',t:'text',l:'Ghi chú',ph:v.type==='xfer'?'VD: Rút tiền mặt':'VD: Cà phê với khách'}]},
    save:(r,id,old)=>{
      if(r.type==='xfer'){if(!r.w2||r.w2===r.w){toast('Anh chọn ví nhận khác ví chuyển nhé');return null}}else delete r.w2;
      if(!isLoan(r)){delete r.who;delete r.due;delete r.pays;delete r.paid}else{delete r.cat;r.paid=loanLeft(r)===0&&(+r.amount>0)&&(r.pays||[]).length>0||(!!old.paid&&!(old.pays||[]).length)}
      if(r.w){S.lastW=r.w;saveSet()}return r},
    after:(r,id,old)=>{if(!old.k){if(r.type==='out')budAlert(r.cat,r.date.slice(0,7),+r.amount||0);if(r.type==='in')fundSuggest(r)}}},
  wallet:{t:'Ví / tài khoản',f:v=>[{n:'name',t:'text',l:v.type==='goal'?'Tên quỹ / mục tiêu':'Tên ví',req:1,ph:v.type==='goal'?'VD: Quỹ dự phòng, Đặt cọc căn hộ…':'VD: Vietcombank, Momo, Tiền mặt…'},
    {n:'type',t:'chips',l:'Loại',o:WTYPE.map(x=>[x[0],x[1]+' '+x[2]])},
    {n:'bal',t:'money',l:v.type==='card'?'Dư nợ thẻ hiện tại':'Số dư hiện tại',neg:1},
    ...(v.type==='goal'?[{n:'target',t:'money',l:'Mục tiêu (không bắt buộc)'},{n:'pct',t:'chips',l:'Khi có khoản thu, gợi ý để riêng',o:[['0','Không'],['10','10%'],['20','20%'],['30','30%'],['50','50%']]}]:[]),
    {n:'note',t:'text',l:'Ghi chú',ph:'VD: số tài khoản, chi nhánh…'},
    {t:'hint',h:()=>'Số dư sẽ tự cộng trừ theo các khoản thu, chi, chuyển ví. Khi lệch với thực tế, mở ví và sửa “Số dư hiện tại”.'}],
    load:(v,id)=>{const b=id?(balances()[id]||0):0;v.bal=v.type==='card'?-b:b},
    save:(r,id,old)=>{const B=balances(),cur=old.k?(B[id]||0):0,flows=cur-(+old.init||0),want=r.type==='card'?-(+r.bal||0):(+r.bal||0);
      r.init=want-flows;delete r.bal;if(!old.c)r.c=Date.now();if(r.type!=='goal'){delete r.target;delete r.pct}return r},
    del:id=>{const used=recs('tx').some(i=>{const r=R[i];return r.w===id||r.w2===id||(r.pays||[]).some(p=>p.w===id)})||(id===WDEF&&recs('tx').some(i=>!R[i].w));
      if(used){toast('Ví đang có giao dịch — không xoá được');return false}if(recs('wallet').length<2){toast('Cần giữ ít nhất 1 ví');return false}return true}},
  inc:{t:'Khoản sắp thu',f:v=>[{n:'title',t:'text',l:'Khoản gì',req:1,ph:'VD: Hoa hồng căn A1205 Sun Cosmo'},{n:'amount',t:'money',l:'Số tiền dự kiến',req:1},
    {n:'date',t:'date',l:'Dự kiến về ngày'},{n:'cat',t:'chips',l:'Loại',o:CAT_IN.map(x=>[x[0],x[1]+' '+x[2]])},
    ...(wallets().length>1?[{n:'w',t:'sel',l:'Về ví',o:wOpts()}]:[]),{n:'note',t:'area',l:'Ghi chú (khách, dự án, điều kiện thanh toán…)'},
    {t:'hint',h:v=>v.got?`✓ Đã nhận ngày ${fmtDMY(v.gotOn)} — đã ghi vào Thu chi.`:'Khi tiền về, bấm “Đã nhận” trong Tài chính › Kế hoạch: app tự ghi khoản thu.'}]},
  bud:{t:'Ngân sách tháng',id:v=>'ebud'+v.cat,f:v=>[{n:'cat',t:'chips',l:'Danh mục',o:CAT_OUT.map(x=>[x[0],x[1]+' '+x[2]])},{n:'amount',t:'money',l:'Tối đa mỗi tháng',req:1},
    {t:'hint',h:v=>{const s=catSpent(today().slice(0,7),v.cat);return `Tháng này đã chi ${fmt(s)}${+v.amount?` · ${Math.round(s/v.amount*100)}%`:''}. App báo khi dùng tới 80% và khi vượt.`}}]},
  pay:{t:'Trả / thu nợ',f:v=>{const r=R[v.loan]||{};return [{t:'hint',h:()=>`${r.type==='lend'?'Thu lại từ':'Trả cho'} <b>${esc(r.who||'')}</b> · còn ${fmt(loanLeft(r))}`},
    {n:'a',t:'money',l:'Số tiền lần này',req:1},{n:'d',t:'date',l:'Ngày',req:1},...(wallets().length>1?[{n:'w',t:'sel',l:r.type==='lend'?'Tiền vào ví':'Trả từ ví',o:wOpts()}]:[])]},
    save:v=>{const r=R[v.loan];if(!r)return null;const a=Math.min(+v.a||0,loanLeft(r));r.pays=[...(r.pays||[]),{a,d:v.d,w:v.w||r.w||WDEF}];
      r.paid=loanLeft(r)===0;putRec(v.loan,r);toast(r.paid?'Đã xong khoản này ✓':`Đã ghi · còn ${fmt(loanLeft(r))}`);return null}},
  sub:{t:'Gói đăng ký',f:v=>[{n:'name',t:'text',l:'Tên dịch vụ',req:1,ph:'VD: iCloud, Netflix, tên miền…'},{n:'price',t:'money',l:'Giá mỗi kỳ'},
    {n:'cycle',t:'chips',l:'Chu kỳ',o:[['month','Hằng tháng'],['year','Hằng năm']]},{n:'start',t:'date',l:'Một ngày gia hạn (gần nhất hoặc sắp tới)',req:1},
    ...(wallets().length>1?[{n:'w',t:'sel',l:'Trả từ ví',o:wOpts()}]:[]),
    {n:'pre',t:'chips',l:'Nhắc trước',o:[['0','Đúng ngày'],['1','1 ngày'],['3','3 ngày'],['7','7 ngày'],['30','30 ngày']]},{n:'on',t:'switch',l:'Đang dùng'},
    {n:'note',t:'area',l:'Ghi chú (tài khoản, cách huỷ…)'},{t:'hint',h:v=>{const n=v.start?subNext(v,today()):null;return n?`Lần gia hạn tới: <b>${fmtDMY(n)}</b>`:''}}]},
  habit:{t:'Thói quen',f:v=>[{n:'name',t:'text',l:'Tên thói quen',req:1,ph:'VD: Uống 8 ly nước'},{n:'icon',t:'chips',l:'Biểu tượng',o:HICONS.map(x=>[x,x])},
    {n:'rem',t:'switch',l:'⏰ Nhắc theo giờ mỗi ngày'},
    ...(v.rem?[{n:'rt',t:'time',l:'Giờ nhắc'},{n:'rmsg',t:'text',l:'Lời nhắc',ph:habMsg(Object.assign({},v,{rmsg:''}))},
      {t:'hint',h:v=>`⏰ Mỗi ngày lúc <b>${v.rt||'—'}</b>: “${esc(habMsg(v))}”.<br>Đang mở app (điện thoại hoặc máy tính) thì app báo ngay. Để iPhone báo cả khi không mở app: Cài đặt › “Xuất tất cả ra Lịch điện thoại”.`}]:[])]},
  vault:{t:'Kho cá nhân',f:()=>[{n:'title',t:'text',l:'Tên',req:1,ph:'VD: CCCD, bảo hành máy lạnh, số tài khoản…'},{n:'cat',t:'chips',l:'Loại',o:VCAT.map(x=>[x[0],x[1]+' '+x[2]])},
    {n:'body',t:'area',l:'Nội dung',ph:'Số, mã, ngày cấp, nơi mua, ghi chú…'},{n:'exp',t:'date',l:'Ngày hết hạn (nếu có)',clear:1},{n:'photos',t:'photos',l:'Ảnh chụp'}]}};
let fK=null,fId=null,fV=null,fAdded=[];
function openForm(k,id,preset){
  fK=k;fId=id||null;fV=Object.assign(DEF[k](),id&&R[id]?JSON.parse(JSON.stringify(R[id])):{},preset||{});fAdded=[];
  if(fV.photos)fV.photos=[...fV.photos];
  if(FORMS[k].load)FORMS[k].load(fV,fId);
  $('#fTitle').innerHTML=`${MOD[{person:'people',tx:'money',wallet:'money',inc:'money',bud:'money',pay:'money'}[k]||k].i} ${FORMS[k].t}<small>${id?'Sửa':'Thêm mới'}</small>`;
  $('#fDel').classList.toggle('hidden',!id);
  renderForm();$('#form').classList.remove('hidden');$('#fBody').scrollTop=0;fitSheet();
  if(!id){const f=$('#fBody input[type=text]');if(f&&!['tx','pay','bud'].includes(k))setTimeout(()=>f.focus(),60);else if(['tx','pay','bud'].includes(k)){const a=$('#fBody [data-money]');if(a)setTimeout(()=>a.focus(),60)}}}
function dateHint(k){const d=parse(k);return `${DOWL[d.getDay()]} · âm lịch ${lunarTxt(k)}`}
function fieldHtml(f,v){
  const val=v[f.n],lab=f.l&&f.t!=='switch'?`<label class="fl">${esc(f.l)}${f.req?' <span class="red">*</span>':''}</label>`:'';
  switch(f.t){
    case 'text':case 'tel':return lab+`<input data-n="${f.n}" type="${f.t}" value="${esc(val)}" placeholder="${esc(f.ph||'')}" autocomplete="off">`;
    case 'num':return lab+`<input data-n="${f.n}" type="text" inputmode="numeric" value="${esc(val)}">`;
    case 'area':return lab+`<textarea data-n="${f.n}" rows="3" placeholder="${esc(f.ph||'')}">${esc(val)}</textarea>`;
    case 'date':return lab+`<div class="frow"><input data-n="${f.n}" type="date" value="${esc(val)}">${f.clear&&val?`<button class="chip" data-clear="${f.n}">Bỏ</button>`:''}</div>${val?`<div class="fh">${dateHint(val)}</div>`:''}`;
    case 'time':return lab+`<div class="frow"><input data-n="${f.n}" type="time" value="${esc(val)}">${f.clear&&val?`<button class="chip" data-clear="${f.n}">Bỏ</button>`:''}</div>`;
    case 'money':return lab+`<input data-n="${f.n}" data-money="1" type="text" inputmode="decimal" value="${val?fmtN(val):''}" placeholder="VD: 50000, 50k, 1,5tr" autocomplete="off"><div class="fh" data-mh="${f.n}">${val?'= '+fmt(val):'Gõ tắt được: 50k = 50.000đ, 2tr = 2.000.000đ'}</div>`;
    case 'chips':return lab+`<div class="fchips">${f.o.map(o=>`<button class="chip${String(val)===String(o[0])?' on':''}" data-chip="${f.n}" data-v="${esc(o[0])}">${esc(o[1])}</button>`).join('')}</div>`;
    case 'switch':return `<div class="row"><div>${esc(f.l)}</div><input type="checkbox" class="sw" data-n="${f.n}"${val?' checked':''}></div>`;
    case 'lunar':{const sel=(n,mx)=>`<select data-n="${n}">${range(1,mx).map(o=>`<option value="${o[0]}"${String(v[n])===String(o[0])?' selected':''}>${o[1]}</option>`).join('')}</select>`;
      return lab+`<div class="lunpick"><span>Ngày</span>${sel(f.d,30)}<span>tháng</span>${sel(f.m,12)}</div>`}
    case 'sel':return lab+`<select data-n="${f.n}">${f.o.map(o=>`<option value="${o[0]}"${String(val)===String(o[0])?' selected':''}>${o[1]}</option>`).join('')}</select>`;
    case 'photos':return lab+`<div class="photos" id="fPh">${(val||[]).map(id=>`<div class="ph1"><img data-p="${id}" alt=""><button data-fx="${id}">✕</button></div>`).join('')}</div><button class="btn ghost" data-act="fphoto">📷 Thêm ảnh</button>`;
    case 'hint':return `<div class="fhint">${f.h(v)}</div>`}
  return ''}
function renderForm(){
  const b=$('#fBody'),st=b.scrollTop;
  b.innerHTML=FORMS[fK].f(fV).map(f=>`<div class="fg">${fieldHtml(f,fV)}</div>`).join('');
  b.scrollTop=st;fillImgs('#fPh img')}
function formSave(){
  for(const f of FORMS[fK].f(fV)){if(!f.req)continue;const v=fV[f.n];
    if(f.t==='money'?!(+v>0):!String(v==null?'':v).trim()){toast('Anh nhập “'+f.l.replace(/\s*\(.*\)/,'')+'” nhé');return}}
  const F=FORMS[fK];let id=fId||(F.id?F.id(fV):'e'+uid());
  if(fId&&F.id&&F.id(fV)!==fId){delRec(fId);id=F.id(fV)}
  const old=R[id]?R[id]:{};
  if(old.photos)dropPhotos(old.photos.filter(p=>!(fV.photos||[]).includes(p)));
  let r=Object.assign({},old,fV,{k:fK});
  if(F.save){r=F.save(r,id,old);if(r===null){fAdded=[];closeForm();render();return}}
  ['title','name','who','note','body','phone'].forEach(n=>{if(typeof r[n]==='string')r[n]=r[n].trim()});
  if(fK==='task'&&r.done&&!old.done)r.doneAt=Date.now();
  if(fK==='habit'&&!old.c)r.c=Date.now();
  putRec(id,r);fAdded=[];closeForm();render();toast('Đã lưu ✓');if(F.after)F.after(r,id,old)}
function closeForm(discard){if(discard)dropPhotos(fAdded);fAdded=[];const f=$('#form');f.classList.add('hidden');f.style.top=f.style.height='';fK=fId=fV=null}

/* ---------- đồng bộ nhiều thiết bị (mã hoá đầu cuối) ---------- */
const SYNC_URL='https://nhatky-sync.vercel.app/api/sync';
const sha=async t=>[...new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(t)))].map(x=>x.toString(16).padStart(2,'0')).join('');
const ALPH='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const genCode=()=>{const b=crypto.getRandomValues(new Uint8Array(20));let t='';for(const x of b)t+=ALPH[x%32];return t.match(/.{5}/g).join('-')};
const normCode=c=>(c.toUpperCase().replace(/[^A-Z0-9]/g,'').match(/.{1,5}/g)||[]).join('-');
const syncCode=()=>localStorage.getItem('nk_sync');
async function api(method,qs,body,tok){
  const r=await fetch(SYNC_URL+'?'+qs,{method,headers:{'content-type':'application/json',...(tok?{'x-token':tok}:{})},body:body?JSON.stringify(body):undefined});
  let j=null;try{j=await r.json()}catch{}return {status:r.status,j}}
async function encPhoto(url){
  const i=url.indexOf(','),mime=url.slice(5,url.indexOf(';')),iv=crypto.getRandomValues(new Uint8Array(12));
  const ct=await crypto.subtle.encrypt({name:'AES-GCM',iv},KEY,fromB64(url.slice(i+1)));return {m:mime,iv:toB64(iv),ct:toB64(ct)}}
async function decPhoto(o){const b=await crypto.subtle.decrypt({name:'AES-GCM',iv:fromB64(o.iv)},KEY,fromB64(o.ct));return `data:${o.m};base64,`+toB64(b)}
let syncing=false,syncT,codeShown=false;
function scheduleSync(){clearTimeout(syncT);if(syncCode())syncT=setTimeout(()=>sync(),3000)}
function setSyncStatus(t,err){const el=$('#syncInfo');if(el){el.textContent=t;el.style.color=err?'#c0392b':''}}
function renderSyncUI(){
  const on=!!syncCode();$('#syncOff').classList.toggle('hidden',on);$('#syncOnBox').classList.toggle('hidden',!on);
  if(!on){setSyncStatus('Đang tắt');return}
  const t=localStorage.getItem('nk_lastsync');setSyncStatus(t?'Đồng bộ lần cuối: '+new Date(+t).toLocaleString('vi-VN'):'Đã bật');
  $('#syncCodeTxt').textContent=codeShown?syncCode():'•••••-•••••-•••••-•••••';$('#syncShow').textContent=codeShown?'Ẩn':'Hiện'}
async function sync(){
  const code=syncCode();if(!code||!KEY||syncing)return;
  syncing=true;setSyncStatus('Đang đồng bộ…');
  try{
    const id=await sha(code),tok=await sha('w:'+code);
    let g=await api('GET','id='+id);
    if(g.status===404){
      const i=await api('PUT','id='+id+'&init=1',{salt:localStorage.getItem(K.salt),chk:await enc('ok')},tok);
      if(i.status!==200)throw new Error('không tạo được kho đồng bộ ('+i.status+')');
      g=await api('GET','id='+id)}
    if(g.status!==200)throw new Error('máy chủ lỗi '+g.status);
    const idx=g.j.index||{},rph=g.j.photos||[];let changed=false;
    const localAt=e=>Math.max(R[e]?(R[e].at||1):0,tombs[e]||0);
    for(const eid in idx){
      if(idx[eid]<=localAt(eid))continue;
      const r=await api('GET',`id=${id}&e=${eid}`);if(r.status!==200)continue;
      let o;try{o=JSON.parse(await dec(r.j.enc))}catch{throw new Error('không giải mã được — kiểm tra mật khẩu')}
      if(o.del){if(R[eid]){dropPhotos(R[eid].photos);delete R[eid]}tombs[eid]=idx[eid]}
      else{o.at=idx[eid];R[eid]=o;delete tombs[eid]}
      changed=true}
    const push=async(eid,at,obj)=>{const r=await api('PUT',`id=${id}&e=${eid}`,{at,enc:await enc(JSON.stringify(obj))},tok);
      if(r.status!==200)throw new Error('không gửi được ('+r.status+')')};
    for(const eid in R){const at=R[eid].at||1;if(at>(idx[eid]||0))await push(eid,at,R[eid])}
    for(const eid in tombs){if(tombs[eid]>(idx[eid]||0)&&!R[eid])await push(eid,tombs[eid],{del:1})}
    for(const e of Object.values(R))for(const pid of e.photos||[]){
      const has=await pRaw(pid);
      if(!has&&rph.includes(pid)){const r=await api('GET',`id=${id}&p=${pid}`);if(r.status===200){try{const u=await decPhoto(r.j);await pPut(pid,u);pCache[pid]=u;changed=true}catch{}}}
      else if(has&&!rph.includes(pid)){const u=await pUrl(pid);if(u){const r=await api('PUT',`id=${id}&p=${pid}`,await encPhoto(u),tok);if(r.status===413)toast('Có ảnh quá lớn để đồng bộ')}}}
    if(changed&&migAll())changed=true;
    if(changed){await save(true);if(!$('#app').classList.contains('hidden')&&$('#form').classList.contains('hidden')&&$('#sheet').classList.contains('hidden'))render()}
    localStorage.setItem('nk_lastsync',String(Date.now()));renderSyncUI();
  }catch(e){setSyncStatus('Lỗi đồng bộ: '+(e.message||e),true)}
  finally{syncing=false}}
setInterval(()=>{if(KEY&&!document.hidden)sync()},120000);
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&KEY)sync()});
async function linkDevice(inApp){
  const pf=inApp?'#sl':'#lk',err=$(inApp?'#slErr':'#lkErr'),code=normCode($(pf+'Code').value),p=$(pf+'PwL').value;err.textContent='';
  if(code.length!==23)return err.textContent='Mã đồng bộ gồm 20 ký tự (4 nhóm 5 ký tự)';
  if(!p)return err.textContent='Nhập mật khẩu';
  try{
    err.textContent='Đang kết nối…';
    const g=await api('GET','id='+await sha(code));
    if(g.status===404)return err.textContent='Mã đồng bộ không đúng';
    if(g.status!==200)return err.textContent='Máy chủ lỗi '+g.status;
    const key=await deriveKey(p,g.j.salt);
    try{await dec(g.j.chk,key)}catch{return err.textContent='Mật khẩu chưa đúng'}
    if(hasPw()){
      if(!confirm('Máy này đang có dữ liệu riêng.\n\nNối đồng bộ sẽ XOÁ dữ liệu hiện có trên máy này và thay bằng dữ liệu từ mã đồng bộ (dữ liệu trên máy khác không bị ảnh hưởng).\n\nTiếp tục?'))return err.textContent='';
      for(const k of ['nk_data','nk_pw','nk_salt','nk_lastw','nk_lastsync','nk_bio','nk_sync','nk_remd','nk_ntf'])localStorage.removeItem(k);
      await pClear().catch(()=>{});await kDel('key').catch(()=>{})}
    localStorage.setItem(K.salt,g.j.salt);localStorage.setItem(K.pw,await hash(p,g.j.salt));localStorage.setItem('nk_sync',code);
    err.textContent='Đang tải dữ liệu…';if(inApp){lock();toast('Đã nối đồng bộ, đang tải dữ liệu…')}await unlock(key);
  }catch(e){err.textContent='Không kết nối được: '+(e.message||e)}}


/* ---------- TRỢ LÝ AI (Claude, qua máy chủ trung gian của anh) ---------- */
const AI_URL='https://nhatky-sync.vercel.app/api/ai';
let aiHist=[],aiBusy=false;
const aiSent=()=>'tài chính, việc, định kỳ, lịch, người thân, ngày giỗ, thói quen'+(S.aiDiary?', nhật ký 10 bài gần nhất':'')+' · không gồm kho cá nhân'+(S.aiDiary?'':', nhật ký');
function aiCtx(){
  const t=today(),B=balances(),f=forecast(90),lun=lunarOf(t),mk=t.slice(0,7);
  const months=[0,1,2,3].map(n=>{const k=mkAdd(mk,-n),L=monthTx(k),dm={};L.filter(r=>r.type==='out').forEach(r=>{const c=catOf('out',r.cat)[2];dm[c]=(dm[c]||0)+(+r.amount||0)});return {thang:k,thu:sumT(L,'in'),chi:sumT(L,'out'),chi_theo_danh_muc:dm}});
  const ev=[];for(let i=0;i<=30;i++){const k=addDays(t,i);eventsOn(k).filter(e=>!(e.k==='rem'&&R[e.id]&&R[e.id].freq==='day')).forEach(e=>ev.push([k,e.t+(e.s&&e.k!=='rem'?' · '+e.s:'')]))}
  const tk=tkToday();
  const c={
    hom_nay:{ngay:t,thu:DOWL[parse(t).getDay()],am_lich:`${lun.d}/${lun.m}${lun.leap?' nhuận':''} năm ${canChiYear(lun.y)}`,tiet_khi:tk.cur.name,gio:new Date().toTimeString().slice(0,5)},
    vi:wallets().map(i=>({ten:R[i].name,loai:wtOf(R[i].type)[2],so_du:Math.round(B[i]||0)})),
    tien_dang_co:Math.round(f.start),
    du_bao_90_ngay:{thap_nhat:Math.round(f.min),ngay_thap_nhat:f.minK,cuoi_ky:Math.round(f.end),muc_an_toan:+S.cashMin||0,chi_sinh_hoat_moi_ngay:Math.round(f.daily)},
    thu_chi_4_thang:months,
    ngan_sach_thang_nay:recs('bud').map(i=>R[i]).filter(b=>+b.amount>0).map(b=>({danh_muc:catOf('out',b.cat)[2],muc:+b.amount,da_chi:catSpent(mk,b.cat)})),
    cho_xac_nhan_chi:pendingPays().map(p=>({ngay:p.k,noi_dung:p.t,so_tien:p.amt})),
    su_kien_30_ngay:ev.slice(0,80),
    viec_chua_xong:recs('task').filter(i=>!R[i].done).map(i=>({viec:R[i].title,han:R[i].due||'',gio:R[i].time||'',quan_trong:!!R[i].star})).slice(0,60),
    dinh_ky:recs('rem').filter(i=>R[i].on!==false).map(i=>({viec:R[i].title,lich:freqTxt(R[i]),so_tien:R[i].money?+R[i].amt||0:0})),
    vay_no:recs('tx').filter(i=>isLoan(R[i])&&loanLeft(R[i])).map(i=>({loai:R[i].type==='lend'?'anh cho vay':'anh đi vay',nguoi:R[i].who,tong:+R[i].amount,con_lai:loanLeft(R[i]),han:R[i].due||''})),
    sap_thu:recs('inc').filter(i=>!R[i].got).map(i=>({khoan:R[i].title,so_tien:+R[i].amount,du_kien:R[i].date||''})),
    goi_dang_ky:recs('sub').filter(i=>R[i].on!==false).map(i=>({ten:R[i].name,gia:+R[i].price||0,chu_ky:R[i].cycle==='year'?'năm':'tháng',gia_han_toi:subNext(R[i],t)})),
    quy_muc_tieu:goalW().map(i=>({ten:R[i].name,dang_co:Math.round(B[i]||0),muc_tieu:+R[i].target||0})),
    giao_dich_gan_day:recs('tx').map(i=>R[i]).filter(r=>r.date&&!isLoan(r)).sort((a,b)=>b.date.localeCompare(a.date)).slice(0,40).map(r=>({ngay:r.date,loai:{out:'chi',in:'thu',xfer:'chuyển ví'}[r.type],so_tien:+r.amount,danh_muc:r.type==='xfer'?'':catOf(r.type,r.cat)[2],ghi_chu:r.note||''})),
    thoi_quen:recs('habit').map(i=>({ten:R[i].name,hom_nay_da_xong:!!(R[i].days&&R[i].days[t]),chuoi_ngay:habStreak(R[i])})),
    nguoi_than:recs('person').map(i=>{const r=R[i],b=r.bmode&&r.bmode!=='none'?nextOf(k=>!!bdayOn(r,k),t,370):null;return {ten:r.name,quan_he:r.rel||'',sinh_nhat_toi:b||''}}),
    ngay_gio:recs('gio').map(i=>({ten:R[i].name,am_lich:`${R[i].ld}/${R[i].lm}`,duong_lich_toi:gioNext(R[i],t)||''}))};
  if(S.aiDiary)c.nhat_ky_gan_day=recs('diary').map(i=>R[i]).sort((a,b)=>(b.date||'').localeCompare(a.date||'')).slice(0,10).map(r=>({ngay:r.date,tieu_de:r.title||'',trich:(r.body||'').slice(0,300)}));
  return c}
async function aiCall(body){
  const code=syncCode();if(!code)throw new Error('Cần bật Đồng bộ trước (Cài đặt › Đồng bộ) để kết nối trợ lý.');
  const id=await sha(code),tok=await sha('w:'+code);
  const r=await fetch(AI_URL+'?id='+id,{method:'POST',headers:{'content-type':'application/json','x-token':tok},body:JSON.stringify(body)});
  const j=await r.json().catch(()=>({}));
  if(!r.ok){const m={'ai-not-configured':'Máy chủ chưa có khoá API — xem hướng dẫn cài đặt trợ lý.','daily-limit':'Hôm nay đã dùng hết lượt (giới hạn '+(j.limit||'')+' lần/ngày).','not-owner':'Mã đồng bộ này không phải chủ của trợ lý.','auth':'Không xác thực được — kiểm tra mã đồng bộ.'}[j.error];
    throw new Error(m||('Trợ lý lỗi ('+(j.error||r.status)+')'))}
  return j}
// markdown nhẹ → HTML an toàn
const aiMd=s=>esc(s||'').replace(/\*\*(.+?)\*\*/g,'<b>$1</b>').split('\n').map(l=>/^\s*[-•*]\s+/.test(l)?`<li>${l.replace(/^\s*[-•*]\s+/,'')}</li>`:l?`<p>${l}</p>`:'').join('').replace(/(<li>.*?<\/li>)+/g,m=>`<ul>${m}</ul>`);
// item AI → bản ghi app
function aiRec(it){
  const t=today(),wl=(it.wallet||'').toLowerCase(),w=(wl&&wallets().find(i=>R[i].name.toLowerCase().includes(wl)||wl.includes(R[i].name.toLowerCase())))||(S.lastW&&R[S.lastW]?S.lastW:WDEF);
  const d=/^\d{4}-\d\d-\d\d$/.test(it.date)?it.date:'',tm=/^\d\d:\d\d$/.test(it.time)?it.time:'',amt=Math.max(0,Math.round(+it.amount||0));
  const okCat=(type,c)=>((type==='in'?CAT_IN:CAT_OUT).some(x=>x[0]===c)?c:type==='in'?'other':'other');
  const ld=String(Math.min(30,Math.max(1,+it.ld||1))),lm=String(Math.min(12,Math.max(1,+it.lm||1)));
  switch(it.kind){
    case 'tx':{const type=['out','in','xfer','lend','borrow'].includes(it.type)?it.type:'out';const r={k:'tx',type,amount:amt,w,date:d||t,note:(it.title||it.note||'').trim()};
      if(type==='out'||type==='in')r.cat=okCat(type,it.cat);if(type==='lend'||type==='borrow'){r.who=it.who||it.title||'';r.due=/^\d{4}-\d\d-\d\d$/.test(it.due)?it.due:'';r.note=it.note||''}
      if(type==='xfer'){r.w2=wallets().find(i=>i!==w)||w}return {kind:'tx',r}}
    case 'task':return {kind:'task',r:{k:'task',title:it.title,due:d,time:d?tm:'',star:false,note:it.note||'',done:false}};
    case 'rem':{const freq=['day','week','month','year'].includes(it.freq)?it.freq:'month',lunar=!!it.lunar&&(freq==='month'||freq==='year');
      return {kind:'rem',r:{k:'rem',title:it.title,freq,lunar,ld,lm,date:d||t,time:tm||'08:00',label:'personal',on:true,note:it.note||'',pre7:false,pre1:false,money:amt>0,amt,cat:okCat('out',it.cat||'bill'),w}}}
    case 'inc':return {kind:'inc',r:{k:'inc',title:it.title,amount:amt,date:d,cat:okCat('in',it.cat||'comm'),w,note:it.note||''}};
    case 'gio':return {kind:'gio',r:{k:'gio',name:it.title,rel:'',ld,lm,year:'',place:'',note:it.note||''}};
    case 'person':return {kind:'person',r:{k:'person',name:it.title,rel:'',phone:'',bmode:it.lunar?'lunar':d?'solar':'none',bday:it.lunar?'':d,bld:ld,blm:lm,byear:'',note:it.note||''}};
    case 'diary':return {kind:'diary',r:{date:d||t,title:it.title||'',body:it.note||'',mood:null,fav:false,photos:[]}}}
  return null}
function aiDesc(x){const r=x.r;switch(x.kind){
  case 'tx':return r.type==='xfer'?['↔️',`Chuyển ${fmt(r.amount)}`,`${wName(r.w)} → ${wName(r.w2)}`]:r.type==='lend'||r.type==='borrow'?['🤝',`${r.type==='lend'?'Cho':'Vay'} ${r.who} ${fmt(r.amount)}`,r.due?'Hạn trả '+fmtDMY(r.due):'Chưa có hạn trả']
    :[catOf(r.type,r.cat)[1],`${r.type==='in'?'Thu':'Chi'} ${fmt(r.amount)} · ${catOf(r.type,r.cat)[2]}`,`${r.note||''}${wallets().length>1?' · '+wName(r.w):''} · ${fmtDMY(r.date)}`];
  case 'task':return ['✅',r.title,r.due?`Hạn ${fmtDMY(r.due)}${r.time?' '+r.time:''}`:'Hộp chờ'];
  case 'rem':return ['🔁',r.title,freqTxt(r)+(r.money?' · '+fmt(r.amt):'')];
  case 'inc':return ['🤝',`Sắp thu: ${r.title}`,`${fmt(r.amount)}${r.date?' · dự kiến '+fmtDMY(r.date):''}`];
  case 'gio':return ['🕯️',`Ngày giỗ: ${r.name}`,`${r.ld}/${r.lm} âm lịch`];
  case 'person':return ['👤',r.name,r.bmode==='solar'?'Sinh nhật '+fmtDMY(r.bday):r.bmode==='lunar'?`Sinh nhật ${r.bld}/${r.blm} âm`:''];
  case 'diary':return ['📔','Nhật ký: '+(r.title||fmtDMY(r.date)),(r.body||'').slice(0,80)]}}
let aiPend=[];
function aiSaveOne(j){const x=aiPend[j];if(!x||x.done)return;
  if(x.kind==='diary'){const id='e'+uid();R[id]=Object.assign(x.r,{at:Date.now()});delete tombs[id];save()}
  else{if(x.kind==='tx'&&(x.r.type==='lend'||x.r.type==='borrow')&&!x.r.who)return toast('Thiếu tên người vay');putRec('e'+uid(),x.r);
    if(x.kind==='tx'&&x.r.type==='out')budAlert(x.r.cat,x.r.date.slice(0,7),x.r.amount)}
  x.done=true}
function aiOpen(q){
  let el=$('#aiSheet');
  if(!el){el=document.createElement('div');el.id='aiSheet';el.className='hidden';
    el.innerHTML=`<div class="aih"><b>✨ Trợ lý</b><button id="aiClose" class="lnk">Đóng</button></div><div id="aiMsgs"></div>
      <div class="aiin"><textarea id="aiIn" rows="1" placeholder="Hỏi hoặc ghi nhanh…"></textarea><button id="aiGo" aria-label="Gửi">➤</button></div>`;
    document.body.appendChild(el);
    $('#aiClose').onclick=()=>el.classList.add('hidden');
    $('#aiGo').onclick=()=>aiSend();
    $('#aiIn').addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();aiSend()}});
    $('#aiIn').addEventListener('input',e=>{e.target.style.height='auto';e.target.style.height=Math.min(120,e.target.scrollHeight)+'px'});
    $('#aiMsgs').addEventListener('click',e=>{const b=e.target.closest('[data-ai]');if(!b)return;const [a,j]=b.dataset.ai.split(':');
      if(a==='q'){$('#aiIn').value=b.textContent;return aiSend()}
      if(a==='all'){aiPend.forEach((x,i)=>aiSaveOne(i));toast('Đã lưu ✓');render();return aiDraw()}
      if(a==='one'){aiSaveOne(+j);toast('Đã lưu ✓');render();return aiDraw()}
      if(a==='edit'){const x=aiPend[+j];if(x.kind==='diary')return openEntry(null,x.r.date);x.done=true;aiDraw();const {k,...pre}=x.r;return openForm(x.kind,null,pre)}
      if(a==='new'){aiHist=[];aiPend=[];return aiDraw()}});
    if(KEY)lockWatch(el)}
  el.classList.remove('hidden');aiDraw();if(q){$('#aiIn').value=q;aiSend()}else setTimeout(()=>$('#aiIn').focus(),80)}
function lockWatch(el){new MutationObserver(()=>{if($('#app').classList.contains('hidden')){el.classList.add('hidden');aiHist=[];aiPend=[]}}).observe($('#app'),{attributes:true,attributeFilter:['class']})}
const AI_SUG=['Tháng này anh chi bao nhiêu, nhiều nhất vào đâu?','Ba tháng tới tiền có đủ không?','Ai đang nợ anh, còn bao nhiêu?','Tuần này anh có việc gì?'];
function aiDraw(){const m=$('#aiMsgs');if(!m)return;
  let h=aiHist.map(x=>x.role==='user'?`<div class="aim u">${esc(x.content)}</div>`:`<div class="aim a">${x.html||aiMd(x.content)}</div>`).join('');
  const open=aiPend.filter(x=>!x.done);
  if(aiPend.length)h+=`<div class="aicards">${aiPend.map((x,j)=>{const [ic,t1,t2]=aiDesc(x);return `<div class="aic${x.done?' done':''}"><i>${ic}</i><div><b>${esc(t1)}</b><small>${esc(t2||'')}</small></div>${x.done?'<span>✓</span>':`<button class="ppx" data-ai="edit:${j}" title="Sửa">✎</button><button class="ppok" data-ai="one:${j}">Lưu</button>`}</div>`}).join('')}
    ${open.length>1?`<button class="btn" data-ai="all">Lưu cả ${open.length} mục</button>`:''}</div>`;
  if(aiBusy)h+=`<div class="aim a typing"><span></span><span></span><span></span></div>`;
  if(!aiHist.length)h=`<div class="aihello"><div class="big">✨</div><b>Anh cần gì?</b><small>Gõ hoặc bấm 🎤 trên bàn phím để nói. Em ghi vào đúng mục, hoặc trả lời từ dữ liệu của anh.</small>
    <div class="chips wrap">${AI_SUG.map(s=>`<button class="chip" data-ai="q">${s}</button>`).join('')}</div>
    <div class="note">Mỗi lần hỏi, app gửi kèm bản tóm tắt: ${aiSent()}.</div></div>`;
  else h+=`<div class="aifoot"><button class="lnk" data-ai="new">＋ Cuộc trò chuyện mới</button></div>`;
  m.innerHTML=h;m.scrollTop=m.scrollHeight}
async function aiSend(){
  const inp=$('#aiIn'),text=inp.value.trim();if(!text||aiBusy)return;
  inp.value='';inp.style.height='auto';aiPend=aiPend.filter(x=>!x.done).length?aiPend:[];
  const hist=aiHist.slice(-6).map(x=>({role:x.role,content:x.content}));
  aiHist.push({role:'user',content:text});aiBusy=true;aiDraw();
  try{const j=await aiCall({mode:'chat',text,hist,ctx:aiCtx()});
    const items=(j.items||[]).map(aiRec).filter(Boolean);
    if(j.action==='create'&&items.length){aiPend=items;aiHist.push({role:'assistant',content:(j.answer||'Em đã soạn sẵn, anh kiểm tra rồi bấm Lưu nhé.')})}
    else aiHist.push({role:'assistant',content:j.answer||'(không có câu trả lời)'});
  }catch(e){aiHist.push({role:'assistant',content:'⚠️ '+(e.message||e)})}
  aiBusy=false;aiDraw()}
// bản tin buổi sáng (lưu trong dữ liệu đã mã hoá, mỗi ngày một lần)
const BRIEF='ebrief0001';
function briefHtml(){if(!S.ai)return '';const b=R[BRIEF],t=today();
  return `<div class="box aibrief"><div class="bh"><b>☀️ Bản tin sáng</b><button class="lnk" data-act="ai-open">✨ Hỏi trợ lý</button></div>
    ${b&&b.date===t&&b.text?`<div class="aitext">${aiMd(b.text)}</div>`:`<div class="note" id="briefSt">${S.aiBrief?'Đang soạn bản tin…':'<button class="lnk" data-act="ai-brief">Tạo bản tin hôm nay</button>'}</div>`}</div>`}
let briefBusy=false;
async function aiBrief(force){
  if(!S.ai||briefBusy||!KEY||!syncCode())return;const t=today(),b=R[BRIEF];
  if(!force&&b&&b.date===t)return;if(!force&&(!S.aiBrief||new Date().getHours()<5||localStorage.getItem('nk_brieftry')===t))return;
  briefBusy=true;localStorage.setItem('nk_brieftry',t);
  try{const j=await aiCall({mode:'brief',ctx:aiCtx()});if(j.text){putRec(BRIEF,{k:'brief',date:t,text:j.text});if(view==='home')renderHome()}}
  catch(e){const s=$('#briefSt');if(s)s.textContent='⚠️ '+(e.message||e)}
  briefBusy=false}

/* ---------- tiết khí ---------- */
const tkToday=()=>tkAt(today());
let tkView=null,tkOpen=null;
function tkCardHtml(){
  if(!S.tkShow)return '';
  const a=tkToday(),inf=TK_INFO[a.cur.i],start=a.day===1;
  return `<button class="tkcard${start?' start':''}" id="tkCard"><b>${inf[0]} ${start?'Hôm nay vào tiết ':'Tiết '}${a.cur.name}</b>${start?` · giao tiết lúc ${a.cur.time}`:` · ngày ${a.day}/${a.len}`}<small>${start?esc(inf[1])+'<br>':''}Còn ${a.left} ngày nữa sang ${a.next.name} (${fmtDM(a.next.key)}) · Xem 24 tiết ›</small></button>`}
function openTk(){const a=tkToday();tkView=a.cur.year;tkOpen=a.cur.i;renderTk();$('#tkSheet').classList.remove('hidden');
  const now=$('#tkList .now');$('#tkList').scrollTop=now?Math.max(0,now.offsetTop-$('#tkList').offsetTop-60):0}
function renderTk(){
  const list=tkYear(tkView),after=tkYear(tkView+1)[0],curKey=tkToday().cur.key,all=recs('diary').map(i=>R[i]);
  $('#tkYearTitle').textContent=`Năm ${tkView}`;$('#tkSub').textContent=`${fmtDMY(list[0].key)} – ${fmtDMY(list[23].key)}`;
  $('#tkList').innerHTML=list.map((t,i)=>{
    const end=(list[i+1]||after).key,n=all.filter(e=>e.date>=t.key&&e.date<end).length,inf=TK_INFO[i],now=t.key===curKey;
    return `<div class="tkrow${now?' now':''}" data-i="${i}"><div class="h"><b>${inf[0]} ${t.name}</b><span class="d">${fmtDMY(t.key)} · ${t.time}</span></div>
      <div class="d">${now?'Đang trong tiết này · ':''}${n?`📖 ${n} bài nhật ký`:'Chưa có bài nhật ký'}</div>
      ${tkOpen===i?`<div class="more"><p>${esc(inf[1])}</p><p>🌿 ${esc(inf[2])}</p><p>💡 <i>${esc(inf[3])}</i></p>${n?`<button class="btn ghost" data-f="${t.key}|${end}">Xem ${n} bài nhật ký trong tiết này</button>`:''}</div>`:''}</div>`}).join('')+
    '<div class="note" style="padding:6px 2px 0">Giờ giao tiết theo giờ Việt Nam, sai số khoảng ±15 phút. Gợi ý sinh hoạt mang tính tham khảo theo kinh nghiệm dân gian, không thay cho lời khuyên y tế.</div>'}
function tkCheck(){
  if(!S.tkOn)return;const now=new Date(),[h,m]=(S.tkTime||'07:00').split(':').map(Number);
  if(now.getHours()*60+now.getMinutes()<h*60+m)return;
  const t=today(),a=tkAt(t);
  if(a.day===1&&localStorage.getItem('nk_tkn')!==t){const inf=TK_INFO[a.cur.i];
    notify(`${inf[0]} Hôm nay vào tiết ${a.cur.name}`,`Giao tiết lúc ${a.cur.time}. ${inf[1]}`,'tk-'+a.cur.key);localStorage.setItem('nk_tkn',t)}
  if(S.tkPre&&a.left===1&&localStorage.getItem('nk_tkp')!==t){const inf=TK_INFO[a.next.i];
    notify(`${inf[0]} Ngày mai vào tiết ${a.next.name}`,`Giao tiết lúc ${a.next.time} ngày ${fmtDM(a.next.key)}.`,'tkp-'+a.next.key);localStorage.setItem('nk_tkp',t)}}

/* ---------- file Lịch (.ics) ---------- */
function icsEsc(t){return String(t).replace(/\\/g,'\\\\').replace(/;/g,'\\;').replace(/,/g,'\\,').replace(/\n/g,'\\n')}
function icsFold(line){const enc=new TextEncoder(),out=[];let cur='',n=0;
  for(const ch of line){const b=enc.encode(ch).length;if(n+b>73){out.push(cur);cur=' ';n=1}cur+=ch;n+=b}out.push(cur);return out.join('\r\n')}
const icsStamp=()=>new Date().toISOString().replace(/[-:]/g,'').slice(0,15)+'Z';
function icsEv(L,{uid,date,time,title,desc,rrule,alarms}){
  const [h,m]=(time||S.evTime||'08:00').split(':'),d=date.replace(/-/g,''),e=new Date(+d.slice(0,4),+d.slice(4,6)-1,+d.slice(6,8),+h,+m+30);
  L.push('BEGIN:VEVENT',`UID:${uid}@life.danangliving.com.vn`,`DTSTAMP:${icsStamp()}`,`DTSTART:${d}T${h}${m}00`,`DTEND:${e.getFullYear()}${pad(e.getMonth()+1)}${pad(e.getDate())}T${pad(e.getHours())}${pad(e.getMinutes())}00`);
  if(rrule)L.push('RRULE:'+rrule);
  L.push(icsFold('SUMMARY:'+icsEsc(title)));if(desc)L.push(icsFold('DESCRIPTION:'+icsEsc(desc)));
  for(const a of alarms||['PT0S'])L.push('BEGIN:VALARM','TRIGGER:'+(a==='PT0S'?a:'-'+a),'ACTION:DISPLAY',icsFold('DESCRIPTION:'+icsEsc(title)),'END:VALARM');
  L.push('END:VEVENT')}
function lunarDates(ld,lm,years){const out=[],y0=lunarOf(today()).y;
  for(let y=y0;y<y0+years;y++){let s=lunar2solar(ld,lm,y,0);if(!s)continue;let k=`${s[2]}-${pad(s[1])}-${pad(s[0])}`;
    if(ld===30&&lunarOf(k).d!==30){s=lunar2solar(29,lm,y,0);k=`${s[2]}-${pad(s[1])}-${pad(s[0])}`}
    if(k>=today())out.push(k)}return out}
function lunarMonthly(ld,months){const out=[];let k=today();for(let i=0;i<months*31&&out.length<months;i++){if(lunarMatch(k,ld,0))out.push(k);k=addDays(k,1)}return out}
function download(name,text,type){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([text],{type}));a.download=name;a.click()}
function makeAllIcs(){
  const L=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//DangDungLife//VI','X-WR-CALNAME:Đăng Dũng Life'],t=today();let n=0;
  for(const id of recs('rem')){const r=R[id];if(r.on===false)continue;const base={title:`${lblOf(r.label)[1]} ${r.title}`,desc:r.note,time:r.time,alarms:['PT0S',...remPres(r).map(d=>'P'+d+'D')]};
    if(r.lunar&&r.freq==='year')lunarDates(+r.ld,+r.lm,10).forEach(k=>{icsEv(L,{...base,uid:id+'-'+k,date:k});n++});
    else if(r.lunar&&r.freq==='month')lunarMonthly(+r.ld,36).forEach(k=>{icsEv(L,{...base,uid:id+'-'+k,date:k});n++});
    else if(r.freq==='once'){if(r.date>=t){icsEv(L,{...base,uid:id,date:r.date});n++}}
    else{icsEv(L,{...base,uid:id,date:r.date,rrule:'FREQ='+{day:'DAILY',week:'WEEKLY',month:'MONTHLY',year:'YEARLY'}[r.freq]});n++}}
  for(const id of recs('task')){const r=R[id];if(!r.done&&r.due&&r.time&&r.due>=t){icsEv(L,{uid:id,date:r.due,time:r.time,title:'✅ '+r.title,desc:r.note});n++}}
  for(const id of recs('person')){const p=R[id];
    if(p.bmode==='solar'&&p.bday){icsEv(L,{uid:id+'-sn',date:p.bday,title:'🎂 Sinh nhật '+p.name,desc:p.note,rrule:'FREQ=YEARLY',alarms:['PT0S','P1D']});n++}
    if(p.bmode==='lunar')lunarDates(+p.bld,+p.blm,10).forEach(k=>{icsEv(L,{uid:id+'-sn-'+k,date:k,title:`🎂 Sinh nhật ${p.name} (${p.bld}/${p.blm} âm)`,alarms:['PT0S','P1D']});n++});
  }
  for(const id of recs('gio')){const g=R[id];
    lunarDates(+g.ld,+g.lm,10).forEach(k=>{icsEv(L,{uid:id+'-'+k,date:k,title:`🕯️ ${gioT(g)} (${g.ld}/${g.lm} âm)`,desc:[gioNth(g,k),g.place?'Tại '+g.place:'',g.note].filter(Boolean).join('\n'),alarms:['PT0S','P1D','P7D']});n++})}
  for(const id of recs('tx')){const r=R[id];if(isLoan(r)&&r.due&&r.due>=t&&loanLeft(r)){icsEv(L,{uid:id+'-due',date:r.due,title:`🤝 ${r.type==='lend'?'Thu nợ':'Trả nợ'} ${r.who||''} · ${fmt(loanLeft(r))}`,alarms:['PT0S','P1D']});n++}}
  for(const id of recs('sub')){const s=R[id];if(s.on===false||!s.start)continue;
    icsEv(L,{uid:id,date:s.start,title:`💳 Gia hạn ${s.name} · ${fmt(s.price)}`,desc:s.note,rrule:'FREQ='+(s.cycle==='year'?'YEARLY':'MONTHLY'),alarms:+s.pre>0?['PT0S','P'+s.pre+'D']:['PT0S']});n++}
  for(const id of recs('vault')){const v=R[id];if(v.exp&&v.exp>=t){icsEv(L,{uid:id,date:v.exp,title:'⏳ Hết hạn: '+v.title,alarms:['PT0S','P7D','P30D']});n++}}
  for(const id of recs('habit')){const h=R[id];if(h.rem&&h.rt){icsEv(L,{uid:id+'-hab',date:t,time:h.rt,title:`${h.icon||'⏰'} ${habMsg(h)}`,rrule:'FREQ=DAILY'});n++}}
  if(S.moon)lunarMonthly(1,24).concat(lunarMonthly(15,24)).forEach(k=>{const l=lunarOf(k);icsEv(L,{uid:'moon-'+k,date:k,title:`${l.d===15?'🌕 Rằm':'🌑 Mùng 1'} tháng ${l.m} âm lịch`});n++});
  L.push('END:VCALENDAR');
  if(!n)return toast('Chưa có việc định kỳ, việc có giờ, sinh nhật hay gia hạn nào để xuất');
  download('dang-dung-life-nhac-nho.ics',L.join('\r\n'),'text/calendar');toast(`Đã tạo ${n} sự kiện — mở file để thêm vào Lịch`)}
function makeTkIcs(){
  const [h,m]=(S.tkTime||'07:00').split(':'),y0=tkToday().cur.year,L=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//DangDungLife//TietKhi//VI','X-WR-CALNAME:24 tiết khí'];
  for(let y=y0;y<y0+5;y++)for(const t of tkYear(y)){const inf=TK_INFO[t.i];
    icsEv(L,{uid:'tietkhi-'+t.key,date:t.key,time:`${h}:${m}`,title:`${inf[0]} Vào tiết ${t.name}`,desc:`Giao tiết lúc ${t.time} (giờ Việt Nam).\n${inf[1]}\n🌿 ${inf[2]}`,alarms:S.tkPre?['PT0S','P1D']:['PT0S']})}
  L.push('END:VCALENDAR');download('24-tiet-khi.ics',L.join('\r\n'),'text/calendar')}
function makeDiaryIcs(){
  const L=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//DangDungLife//VI'];
  icsEv(L,{uid:'nhatky-nhac-moi-toi',date:today(),time:S.remTime||'21:00',title:'📔 Viết nhật ký',desc:'Dành vài phút ghi lại ngày hôm nay.',rrule:'FREQ=DAILY'});
  L.push('END:VCALENDAR');download('nhac-viet-nhat-ky.ics',L.join('\r\n'),'text/calendar')}

/* ---------- thông báo đẩy tiết khí (qua máy chủ) ---------- */
const PUSH_URL='https://nhatky-sync.vercel.app/api/push';
const pushOK=()=>'serviceWorker' in navigator&&'PushManager' in window&&'Notification' in window;
const b64u=t=>{t=t.replace(/-/g,'+').replace(/_/g,'/');while(t.length%4)t+='=';return fromB64(t)};
async function pushSub(){if(!pushOK())return null;const r=await navigator.serviceWorker.getRegistration();return r?r.pushManager.getSubscription():null}
async function renderPushUI(){
  const b=$('#tkPushBtn'),tb=$('#tkPushTest');
  if(!pushOK()){b.textContent='🔔 Thông báo đẩy: cần cài app ra Màn hình chính';b.disabled=true;tb.classList.add('hidden');return}
  const s=await pushSub().catch(()=>null);b.disabled=false;
  b.textContent=s?'🔕 Tắt thông báo đẩy tiết khí':'🔔 Bật thông báo đẩy (cả khi đóng app)';tb.classList.toggle('hidden',!s)}
async function pushSave(sub){const r=await fetch(PUSH_URL,{method:'PUT',headers:{'content-type':'application/json'},body:JSON.stringify({sub:sub.toJSON(),pre:!!S.tkPre})});if(!r.ok)throw new Error('máy chủ lỗi '+r.status)}
async function pushToggle(){
  try{let s=await pushSub();
    if(s){await fetch(PUSH_URL,{method:'DELETE',headers:{'content-type':'application/json'},body:JSON.stringify({endpoint:s.endpoint})}).catch(()=>{});await s.unsubscribe();toast('Đã tắt thông báo đẩy')}
    else{if(await Notification.requestPermission()!=='granted')throw new Error('chưa cho phép thông báo');
      const reg=await navigator.serviceWorker.ready,k=await (await fetch(PUSH_URL+'?key=1')).json();
      s=await reg.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:b64u(k.pub)});await pushSave(s);toast('Đã bật thông báo đẩy tiết khí')}
  }catch(e){toast('Không bật được: '+(e.message||e))}
  renderPushUI()}
async function pushTest(){
  try{const s=await pushSub();if(!s)return;const r=await fetch(PUSH_URL+'?test=1',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({endpoint:s.endpoint})});
    toast(r.ok?'Đã gửi — chờ vài giây sẽ thấy thông báo':'Gửi thử lỗi '+r.status)}catch(e){toast('Gửi thử lỗi')}}

/* ---------- nhắc nhở & thông báo trong app ---------- */
const wroteToday=()=>localStorage.getItem('nk_lastw')===today();
function syncLastW(){const t=today();if(recs('diary').some(i=>R[i].date===t))localStorage.setItem('nk_lastw',t);else if(localStorage.getItem('nk_lastw')===t)localStorage.removeItem('nk_lastw')}
function remDue(){if(!S.remOn)return false;const n=new Date(),[h,m]=(S.remTime||'21:00').split(':').map(Number);return n.getHours()*60+n.getMinutes()>=h*60+m&&!wroteToday()}
function notify(t,b,tag){
  if(!('Notification' in window)||Notification.permission!=='granted')return false;
  const o={body:b,icon:'icon-192.png',tag:tag||'dd-rem'};
  if(navigator.serviceWorker&&navigator.serviceWorker.ready)navigator.serviceWorker.ready.then(r=>r.showNotification(t,o)).catch(()=>{try{new Notification(t,o)}catch{}});
  else try{new Notification(t,o)}catch{}
  return true}
function evCheck(){
  if(!S.ntf||!KEY)return;const t=today(),n=new Date(),now=`${pad(n.getHours())}:${pad(n.getMinutes())}`,sent=get('nk_ntf',{});let ch=false;
  for(const e of eventsOn(t,true)){const tm=e.time||S.evTime||'08:00';
    if(now>=tm&&!sent[e.key]){if(!notify(`${e.ic} ${e.t}`,e.k==='rem'?(R[e.id].note||freqTxt(R[e.id])):e.s,e.key))return;sent[e.key]=t;ch=true}}
  for(const k in sent)if(sent[k]<addDays(t,-3)){delete sent[k];ch=true}
  if(ch)put('nk_ntf',sent)}
function remCheck(){
  try{tkCheck()}catch{}try{evCheck()}catch{}try{habCheck()}catch{}
  if(!remDue())return;const t=today();
  if(localStorage.getItem('nk_remd')===t)return;
  if(notify('📔 Đến giờ viết nhật ký','Dành vài phút ghi lại ngày hôm nay nhé!'))localStorage.setItem('nk_remd',t);
  if(!$('#app').classList.contains('hidden')&&(view==='home'||view==='diary'))render()}
setInterval(remCheck,30000);
document.addEventListener('visibilitychange',()=>{if(!document.hidden)remCheck()});
let lastDay=today();setInterval(()=>{if(today()!==lastDay){lastDay=today();if(KEY&&$('#form').classList.contains('hidden')&&$('#sheet').classList.contains('hidden'))render()}},60000);

/* ---------- đọc bài nhật ký ---------- */
async function openReader(id){
  const e=R[id];if(!e)return;readCtx={k:'diary',id};const d=parse(e.date);
  $('#rDate').innerHTML=`${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()}<small>${DOWL[d.getDay()]} · ${lunarTxt(e.date)} âm</small>`;
  $('#rMeta').textContent=[e.mood!=null?MOODS[e.mood]:'',S.tkShow?'🍃 '+tkAt(e.date).cur.name:'',e.fav?'★ Yêu thích':'',e.at?new Date(e.at).toLocaleTimeString('vi-VN',{hour:'2-digit',minute:'2-digit'}):''].filter(Boolean).join('  ·  ');
  $('#rTitle').textContent=e.title||'';$('#rTitle').classList.toggle('hidden',!e.title);
  $('#rBody').textContent=e.body||'';
  $('#rPh').innerHTML=(e.photos||[]).map(p=>`<img data-p="${p}" alt="">`).join('');
  $('#reader').classList.remove('hidden');$('#rScroll').scrollTop=0;
  for(const i of $$('#rPh img')){const u=await pUrl(i.dataset.p);if(u)i.src=u}}

/* ---------- viết nhật ký ---------- */
function openEntry(id,date){
  editKey=id;const e=id?R[id]:null;editDate=e?e.date:date;const k=editDate;mood=e&&e.mood!=null?e.mood:null;
  const d=parse(k);
  $('#shDate').innerHTML=`${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()}<small>${DOWL[d.getDay()]}${k===today()?' · Hôm nay':''}</small>`;
  $('#eTitle').value=e?e.title||'':'';$('#eBody').value=e?e.body||'':'';
  $('#shDel').classList.toggle('hidden',!e);
  fav=!!(e&&e.fav);curPh=e&&e.photos?[...e.photos]:[];addedPh=[];drawFav();drawPhotos();drawMoods();count();
  $('#sheet').classList.remove('hidden');fitSheet();if(!e)$('#eBody').focus()}
function drawMoods(){$('#moods').innerHTML=MOODS.map((m,i)=>`<button data-i="${i}" class="${mood===i?'on':''}">${m}</button>`).join('')}
const count=()=>{const t=$('#eBody').value.trim();$('#cnt').textContent=(t?t.split(/\s+/).length:0)+' từ'};
function drawFav(){const b=$('#bFav');b.classList.toggle('on',fav);b.textContent=fav?'★ Yêu thích':'☆ Yêu thích'}
async function drawPhotos(){
  const box=$('#photos');box.innerHTML=curPh.map(id=>`<div class="ph1"><img data-p="${id}" alt=""><button data-x="${id}">✕</button></div>`).join('');
  for(const i of box.querySelectorAll('img')){const u=await pUrl(i.dataset.p);if(u)i.src=u}}
function fitSheet(){
  const v=window.visualViewport;if(!v)return;
  for(const s of ['#sheet','#form'].map($)){if(s.classList.contains('hidden'))continue;s.style.top=v.offsetTop+'px';s.style.bottom='auto';s.style.height=v.height+'px'}}
if(window.visualViewport){visualViewport.addEventListener('resize',fitSheet);visualViewport.addEventListener('scroll',fitSheet)}
function closeSheet(discard){
  if(discard)dropPhotos(addedPh);
  const sh=$('#sheet');sh.classList.add('hidden');sh.style.top=sh.style.bottom=sh.style.height='';editKey=null}
function saveEntry(){
  const title=$('#eTitle').value.trim(),body=$('#eBody').value;
  const old=(R[editKey]&&R[editKey].photos)||[];
  dropPhotos(old.filter(id=>!curPh.includes(id)));
  if(!title&&!body.trim()&&mood==null&&!curPh.length){if(R[editKey]){delete R[editKey];tombs[editKey]=Date.now();save()}closeSheet();return render()}
  const id=editKey||('e'+uid());
  R[id]={date:editDate,title,body,mood,fav,photos:curPh,at:Date.now()};delete tombs[id];selDay=editDate;save();addedPh=[];closeSheet();render();toast('Đã lưu ✓')}

/* ---------- sự kiện ---------- */
$('#lkBtn').onclick=submitLock;
['#pw1','#pw2'].forEach(s=>$(s).addEventListener('keydown',e=>{if(e.key==='Enter')submitLock()}));
$('#navIn').onclick=e=>{const b=e.target.closest('[data-v]');if(b)go(b.dataset.v)};
$('#hBack').onclick=()=>go('more');
$('#hCal').onclick=()=>{selDay=today();calM=new Date();calM.setDate(1);go('cal')};
$('#fab').onclick=()=>{const f=FAB[view];if(f)f()};
// một bộ xử lý chạm cho toàn bộ nội dung
$('main').addEventListener('change',e=>{if(e.target.id==='fcVar'){S.fcVar=e.target.checked;saveSet();renderMoney()}});
$('main').addEventListener('click',e=>{
  const T=s=>e.target.closest(s);let b;
  if(b=T('[data-done]'))return toggleTask(b.dataset.done);
  if(b=T('[data-pay]')){const r=R[b.dataset.pay];return openForm('pay',null,{loan:b.dataset.pay,a:loanLeft(r),w:r.w||WDEF})}
  if(b=T('[data-pp]')){const [s,k]=b.dataset.pp.split('|');return payPending(s,k)}
  if(b=T('[data-ps]')){const [s,k]=b.dataset.ps.split('|');return payPending(s,k,true)}
  if(b=T('[data-recv]'))return recvInc(b.dataset.recv);
  if(b=T('[data-fund]'))return openForm('tx',null,{type:'xfer',w:spendW()[0]||WDEF,w2:b.dataset.fund,note:'Góp vào '+R[b.dataset.fund].name});
  if(b=T('[data-hab]'))return toggleHab(b.dataset.hab,today());
  if(b=T('[data-habd]')){const [i,k]=b.dataset.habd.split('|');return toggleHab(i,k)}
  if(b=T('[data-hsug]')){const [ic,n]=b.dataset.hsug.split('|');putRec('e'+uid(),{k:'habit',name:n,icon:ic,days:{},c:Date.now()});toast('Đã thêm thói quen');return render()}
  if(b=T('[data-edit]')){const [k,id]=b.dataset.edit.split(':');if(k==='moon')return;return openForm(k,id)}
  if(b=T('[data-read]'))return openReader(b.dataset.read);
  if(b=T('[data-vread]'))return openVault(b.dataset.vread);
  if(b=T('[data-go]'))return go(b.dataset.go);
  if(b=T('#tkCard'))return openTk();
  if(T('#quoteCard')){qOff++;return renderHome()}
  if(b=T('[data-d]')){selDay=b.dataset.d;return renderCal()}
  if(b=T('[data-cm]')){calM.setMonth(calM.getMonth()+ +b.dataset.cm);return renderCal()}
  if(b=T('[data-mm]')){moneyM.setMonth(moneyM.getMonth()+ +b.dataset.mm);return renderMoney()}
  if(b=T('[data-mt]')){moneyTab=b.dataset.mt;return renderMoney()}
  if(b=T('[data-seg]')){taskSeg=b.dataset.seg;return renderTask()}
  if(T('#tAdd'))return quickTask();
  if(b=T('[data-lbl]')){remLbl=b.dataset.lbl;return renderRem()}
  if(b=T('[data-vc]')){vaultCat=b.dataset.vc;return renderVault()}
  if(b=T('[data-f]')){filter=b.dataset.f;return renderDiaryList()}
  if(b=T('[data-act]')){const a=b.dataset.act;e.stopPropagation();
    if(a==='write')return openEntry(null,today());
    if(a==='write-sel')return openEntry(null,selDay);
    if(a==='task-sel')return openForm('task',null,{due:selDay});
    if(a==='rem-sel')return openForm('rem',null,{date:selDay});
    if(a==='cal-today'){calM=new Date();calM.setDate(1);selDay=today();return renderCal()}
    if(a==='tk')return openTk();
    if(a==='ai-open')return aiOpen();
    if(a==='ai-brief')return aiBrief(true);
    if(a==='wallet-new')return openForm('wallet');
    if(a==='goal-new')return openForm('wallet',null,{type:'goal',name:recs('wallet').some(i=>R[i].type==='goal')?'':'Quỹ dự phòng',pct:'30'});
    if(a==='inc-new')return openForm('inc');
    if(a==='bud-new')return openForm('bud',null,{cat:(CAT_OUT.find(c=>!budOf(c[0]))||CAT_OUT[0])[0]});
    if(a==='bud-cat'){const c=b.dataset.cat;return budOf(c)?openForm('bud','ebud'+c):openForm('bud',null,{cat:c})}
    if(a==='cashmin'){const v=prompt('Cảnh báo khi dự báo tiền xuống dưới (VD: 10tr, 0 = tắt):',+S.cashMin?fmtS(S.cashMin):'');if(v==null)return;S.cashMin=parseMoney(v)||0;saveSet();return renderMoney()}}
});
$('#menu').onclick=e=>{const b=e.target.closest('[data-m]');if(b)return menuAct(b.dataset.m,$('#menu').dataset.d);if(e.target.id==='menu'||e.target.id==='mClose')$('#menu').classList.add('hidden')};
// biểu mẫu
$('#fBody').addEventListener('input',e=>{const el=e.target,n=el.dataset.n;if(!n||el.type==='checkbox'||el.tagName==='SELECT')return;
  if(el.dataset.money){fV[n]=parseMoney(el.value);const h=$(`[data-mh="${n}"]`);if(h)h.textContent=fV[n]?'= '+fmt(fV[n]):'Gõ tắt được: 50k = 50.000đ, 2tr = 2.000.000đ'}
  else fV[n]=el.value});
$('#fBody').addEventListener('change',e=>{const el=e.target,n=el.dataset.n;if(!n)return;
  if(el.type==='checkbox'){fV[n]=el.checked;if(fK==='habit'&&n==='rem'&&el.checked&&!fV.rt)fV.rt=/ngủ/i.test(fV.name||'')?'23:00':'08:00';renderForm()}
  else if(el.tagName==='SELECT'||el.type==='date'||el.type==='time'){fV[n]=el.value;renderForm()}
  else if(el.dataset.money)el.value=fV[n]?fmtN(fV[n]):''});
$('#fBody').addEventListener('click',async e=>{let b;
  if(b=e.target.closest('[data-chip]')){fV[b.dataset.chip]=b.dataset.v;
    if(fK==='tx'&&b.dataset.chip==='type'&&(fV.type==='in'||fV.type==='out'))fV.cat=fV.type==='in'?'salary':'food';
    if(fK==='tx'&&b.dataset.chip==='type'&&fV.type==='xfer'&&!fV.w2)fV.w2=(wallets().find(i=>i!==fV.w)||'');
    if(fK==='bud'&&b.dataset.chip==='cat'&&!fId&&budOf(fV.cat))fV.amount=budOf(fV.cat);
    if(fK==='rem'&&b.dataset.chip==='label'&&fV.label==='bday'&&fV.freq==='once')fV.freq='year';
    return renderForm()}
  if(b=e.target.closest('[data-clear]')){fV[b.dataset.clear]='';if(b.dataset.clear==='due')fV.time='';return renderForm()}
  if(b=e.target.closest('[data-fx]')){fV.photos=fV.photos.filter(i=>i!==b.dataset.fx);return renderForm()}
  if(e.target.closest('[data-act="fphoto"]')){picking=true;$('#fFile').click();setTimeout(()=>picking=false,120000);return}
  const i=e.target.closest('#fPh img');if(i){$('#lightImg').src=i.src;$('#light').classList.remove('hidden')}});
$('#fFile').onchange=async e=>{picking=false;
  for(const f of e.target.files){try{const d=await resize(f),id=uid();await pPut(id,d);pCache[id]=d;fV.photos.push(id);fAdded.push(id)}catch{toast('Không đọc được ảnh')}}
  e.target.value='';renderForm()};
$('#fSave').onclick=formSave;
$('#fClose').onclick=()=>{const old=fId&&R[fId]?Object.assign(DEF[fK](),R[fId]):DEF[fK]();
  const dirty=Object.keys(fV).some(k=>JSON.stringify(fV[k])!==JSON.stringify(old[k])&&!(k==='date'&&!fId)&&!(k==='due'&&!fId)&&!(k==='start'&&!fId)&&!(k==='type'&&!fId)&&!(k==='cat'&&!fId));
  if(dirty&&!confirm('Thoát mà chưa lưu?'))return;closeForm(true)};
$('#fDel').onclick=()=>{if(FORMS[fK].del&&FORMS[fK].del(fId)===false)return;if(!confirm('Xoá mục này?'))return;if(fK==='tx')unlinkTx(fId);delRec(fId);fAdded=[];closeForm();render();toast('Đã xoá')};
// đọc
$('#rClose').onclick=()=>$('#reader').classList.add('hidden');
$('#rEdit').onclick=()=>{$('#reader').classList.add('hidden');if(readCtx.k==='vault')openForm('vault',readCtx.id);else openEntry(readCtx.id)};
$('#rPh').onclick=e=>{const i=e.target.closest('img');if(i){$('#lightImg').src=i.src;$('#light').classList.remove('hidden')}};
// trình viết nhật ký
$('#moods').onclick=e=>{const b=e.target.closest('[data-i]');if(!b)return;const i=+b.dataset.i;mood=mood===i?null:i;drawMoods()};
$('#eBody').oninput=count;
$('#shClose').onclick=()=>{
  const e=R[editKey],dirty=(e?e.title||'':'')!==$('#eTitle').value.trim()||(e?e.body||'':'')!==$('#eBody').value||(e?e.mood:null)!==mood&&!(e==null&&mood==null)||fav!==!!(e&&e.fav)||curPh.length!==((e&&e.photos)||[]).length;
  if(dirty&&!confirm('Thoát mà chưa lưu?'))return;closeSheet(true)};
$('#shSave').onclick=saveEntry;
$('#shDel').onclick=()=>{if(confirm('Xoá bài viết này?')){dropPhotos((R[editKey]||{}).photos);addedPh=[];delete R[editKey];tombs[editKey]=Date.now();save();closeSheet();render();toast('Đã xoá')}};
$('#bFav').onclick=()=>{fav=!fav;drawFav()};
$('#bIdea').onclick=()=>{const t=Math.random()<.5?TK_INFO[tkAt(editDate||today()).cur.i][3]:IDEAS[Math.floor(Math.random()*IDEAS.length)],b=$('#eBody');
  b.value=(b.value?b.value+'\n\n':'')+'💡 '+t+'\n';b.focus();count()};
$('#bPhoto').onclick=()=>{picking=true;$('#pFile').click();setTimeout(()=>picking=false,120000)};
$('#pFile').onchange=async e=>{picking=false;
  for(const f of e.target.files){try{const d=await resize(f),id=uid();await pPut(id,d);pCache[id]=d;curPh.push(id);addedPh.push(id)}catch{toast('Không đọc được ảnh')}}
  e.target.value='';drawPhotos()};
$('#photos').onclick=async e=>{
  const x=e.target.closest('[data-x]');if(x){curPh=curPh.filter(i=>i!==x.dataset.x);drawPhotos();return}
  const i=e.target.closest('img');if(i){$('#lightImg').src=await pUrl(i.dataset.p);$('#light').classList.remove('hidden')}};
$('#light').onclick=()=>$('#light').classList.add('hidden');
// tiết khí
$('#tkClose').onclick=()=>$('#tkSheet').classList.add('hidden');
$('#tkPrev').onclick=()=>{tkView--;tkOpen=null;renderTk();$('#tkList').scrollTop=0};
$('#tkNext').onclick=()=>{tkView++;tkOpen=null;renderTk();$('#tkList').scrollTop=0};
$('#tkList').onclick=e=>{
  const f=e.target.closest('[data-f]');
  if(f){filter='tk:'+f.dataset.f;$('#tkSheet').classList.add('hidden');go('diary');return}
  const r=e.target.closest('.tkrow');if(r){const i=+r.dataset.i;tkOpen=tkOpen===i?null:i;renderTk()}};

/* ---------- cài đặt ---------- */
async function loadBioUI(){
  const ok=!!(window.PublicKeyCredential&&canCrypto&&PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable&&await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable().catch(()=>false));
  $('#bioRow').classList.toggle('hidden',!ok);$('#sBio').checked=!!localStorage.getItem('nk_bio')}
function loadSet(){
  $('#sTkShow').checked=S.tkShow;$('#sTkOn').checked=S.tkOn;$('#sTkTime').value=S.tkTime||'07:00';$('#sTkPre').checked=S.tkPre;renderPushUI();
  renderSyncUI();
  $('#sRem').checked=S.remOn;$('#sRemTime').value=S.remTime||'21:00';
  $('#sAi').checked=S.ai;$('#sAiBrief').checked=S.aiBrief;$('#sAiDiary').checked=S.aiDiary;$('#aiInfo').textContent=syncCode()?'Đã sẵn sàng (dùng mã đồng bộ để xác thực)':'Cần bật Đồng bộ để dùng trợ lý';
  $('#sQuote').checked=S.quote;$('#sNtf').checked=S.ntf;$('#sEvTime').value=S.evTime||'08:00';$('#sMoon').checked=S.moon;
  [0,1,2].forEach(i=>{const s=$('#sTab'+i);s.innerHTML=TABBABLE.map(m=>`<option value="${m}">${MOD[m].i} ${MOD[m].n}</option>`).join('');s.value=S.tabs[i]});
  $$('[data-home]').forEach(c=>c.checked=!!S.home[c.dataset.home]);
  $('#encInfo').textContent=canCrypto?'AES-256 — chỉ mở được bằng mật khẩu':'Trình duyệt này không hỗ trợ mã hoá (cần https)';
  loadBioUI();$('#sDark').checked=S.dark;$('#sFont').value=S.font;$('#sLock').value=S.lock}
const askNtf=async()=>{if('Notification' in window&&Notification.permission==='default'){try{await Notification.requestPermission()}catch{}}};
$('#sRem').onchange=async e=>{S.remOn=e.target.checked;saveSet();
  if(S.remOn){await askNtf();toast('Đã bật nhắc lúc '+S.remTime)}else toast('Đã tắt nhắc viết nhật ký');localStorage.removeItem('nk_remd')};
$('#sRemTime').onchange=e=>{S.remTime=e.target.value||'21:00';saveSet();localStorage.removeItem('nk_remd');toast('Giờ nhắc: '+S.remTime)};
$('#remTest').onclick=async()=>{await askNtf();if(!notify('🔔 Thử thông báo','Nếu thấy dòng này là thông báo đang hoạt động!'))toast('Chưa có quyền thông báo — hãy cho phép trong Cài đặt iPhone')};
$('#remIcs').onclick=()=>{makeDiaryIcs();toast('Mở file vừa tải để thêm vào Lịch')};
$('#sNtf').onchange=async e=>{S.ntf=e.target.checked;saveSet();if(S.ntf)await askNtf()};
$('#sEvTime').onchange=e=>{S.evTime=e.target.value||'08:00';saveSet()};
$('#sMoon').onchange=e=>{S.moon=e.target.checked;saveSet()};
$('#sAi').onchange=e=>{S.ai=e.target.checked;saveSet()};$('#sAiBrief').onchange=e=>{S.aiBrief=e.target.checked;saveSet()};$('#sAiDiary').onchange=e=>{S.aiDiary=e.target.checked;saveSet()};
$('#aiOpenBtn').onclick=()=>aiOpen();
$('#allIcs').onclick=makeAllIcs;
[0,1,2].forEach(i=>$('#sTab'+i).onchange=e=>{const v=e.target.value,j=S.tabs.indexOf(v);if(j>=0&&j!==i)S.tabs[j]=S.tabs[i];S.tabs[i]=v;saveSet();loadSet();drawNav()});
$$('[data-home]').forEach(c=>c.onchange=()=>{S.home[c.dataset.home]=c.checked?1:0;saveSet()});
$('#avBtn').onclick=()=>{picking=true;$('#avFile').click();setTimeout(()=>picking=false,120000)};
$('#avFile').onchange=async e=>{picking=false;const f=e.target.files[0];if(!f)return;
  try{localStorage.setItem('nk_avatar',await cropSquare(f));drawAvatar();toast('Đã đổi ảnh đại diện')}catch{toast('Không đọc được ảnh')}e.target.value=''};
$('#avDel').onclick=()=>{localStorage.removeItem('nk_avatar');drawAvatar()};
$('#sTkShow').onchange=e=>{S.tkShow=e.target.checked;saveSet()};
$('#sTkOn').onchange=async e=>{S.tkOn=e.target.checked;saveSet();if(S.tkOn)await askNtf();localStorage.removeItem('nk_tkn');toast(S.tkOn?'Đã bật thông báo tiết khí':'Đã tắt thông báo tiết khí')};
$('#sTkTime').onchange=e=>{S.tkTime=e.target.value||'07:00';saveSet();localStorage.removeItem('nk_tkn')};
$('#sTkPre').onchange=async e=>{S.tkPre=e.target.checked;saveSet();const s=await pushSub().catch(()=>null);if(s)pushSave(s).catch(()=>{})};
$('#tkPushBtn').onclick=pushToggle;
$('#tkPushTest').onclick=pushTest;
$('#tkIcs').onclick=()=>{makeTkIcs();toast('Mở file vừa tải để thêm vào Lịch')};
$('#tkOpenBtn').onclick=openTk;
$('#sQuote').onchange=e=>{S.quote=e.target.checked;saveSet()};
$('#sDark').onchange=e=>{S.dark=e.target.checked;saveSet();applyTheme()};
$('#sFont').onchange=e=>{S.font=+e.target.value;saveSet();applyTheme()};
$('#sLock').onchange=e=>{S.lock=+e.target.value;saveSet();bump()};
$('#lockNow').onclick=lock;
$('#chgPw').onclick=async()=>{
  const m=$('#pwMsg'),o=$('#oldPw').value,n=$('#newPw').value;m.style.color='#c0392b';
  if(syncCode()){m.textContent='Đang bật đồng bộ — hãy tắt đồng bộ trước khi đổi mật khẩu';return}
  const salt=localStorage.getItem(K.salt);
  if(!(await checkPw(o)))return m.textContent='Mật khẩu hiện tại chưa đúng';
  if(n.length<8)return m.textContent='Mật khẩu mới cần ít nhất 8 ký tự';
  m.textContent='Đang mã hoá lại…';
  try{await saveQ;
    const ph={};for(const e of Object.values(R))for(const id of e.photos||[]){const u=await pUrl(id);if(u)ph[id]=u}
    if(canCrypto){KEY=await deriveKey(n,salt);await save();for(const id in ph)await pPut(id,ph[id]);if(localStorage.getItem('nk_bio'))await kPut('key',KEY)}
    localStorage.setItem(K.pw,await hash(n,salt));
    $('#oldPw').value=$('#newPw').value='';m.style.color='#2e8b57';m.textContent='Đã đổi mật khẩu ✓'
  }catch(e){m.style.color='#c0392b';m.textContent='Lỗi: '+(e.message||e)}};
$('#sBio').onchange=async e=>{
  try{if(e.target.checked){const rnd=n=>crypto.getRandomValues(new Uint8Array(n));
      const c=await navigator.credentials.create({publicKey:{challenge:rnd(32),rp:{name:'Đăng Dũng Life'},user:{id:rnd(16),name:'ddlife',displayName:'Đăng Dũng Life'},
        pubKeyCredParams:[{type:'public-key',alg:-7},{type:'public-key',alg:-257}],
        authenticatorSelection:{authenticatorAttachment:'platform',userVerification:'required',residentKey:'discouraged'},timeout:60000}});
      await kPut('key',KEY);localStorage.setItem('nk_bio',toB64(c.rawId));toast('Đã bật mở bằng Face ID')}
    else{localStorage.removeItem('nk_bio');await kDel('key');toast('Đã tắt')}
  }catch(err){e.target.checked=!!localStorage.getItem('nk_bio');toast('Không bật được')}};
$('#bioBtn').onclick=bioUnlock;
$('#linkBtn').onclick=()=>{$('#linkBox').classList.toggle('hidden');$('#lkCode').focus()};
$('#linkGo').onclick=()=>linkDevice(false);
$('#slBtn').onclick=()=>{$('#slBox').classList.toggle('hidden');$('#slCode').focus()};
$('#slGo').onclick=()=>linkDevice(true);
$('#syncOn').onclick=async()=>{const c=genCode();localStorage.setItem('nk_sync',c);codeShown=true;renderSyncUI();
  alert('Mã đồng bộ của anh:\n\n'+c+'\n\nHãy chép lại ở nơi an toàn. Trên thiết bị khác, nhập mã này cùng mật khẩu.');await sync()};
$('#syncShow').onclick=()=>{codeShown=!codeShown;renderSyncUI()};
$('#syncNow').onclick=()=>sync();
$('#syncOffBtn').onclick=async()=>{
  if(!confirm('Tắt đồng bộ và xoá dữ liệu đã đồng bộ trên máy chủ? Dữ liệu trên các thiết bị vẫn còn.'))return;
  try{const c=syncCode();await api('DELETE','id='+await sha(c),null,await sha('w:'+c))}catch{}
  localStorage.removeItem('nk_sync');localStorage.removeItem('nk_lastsync');codeShown=false;renderSyncUI();toast('Đã tắt đồng bộ')};
$('#exp').onclick=async()=>{const photos={};
  for(const k in R)for(const id of R[k].photos||[]){const u=await pUrl(id);if(u)photos[id]=u}
  download(`dang-dung-life-${today()}.json`,JSON.stringify({app:'dd-life',v:3,entries:R,photos}),'application/json');toast('Đã xuất file')};
$('#imp').onclick=()=>$('#impFile').click();
$('#impFile').onchange=async e=>{const f=e.target.files[0];if(!f)return;
  try{const j=JSON.parse(await f.text());if(!j.entries||typeof j.entries!=='object')throw 0;
    if(!confirm(`Nhập ${Object.keys(j.entries).length} mục? Mục trùng sẽ bị ghi đè.`))return;
    for(const id in (j.photos||{})){await pPut(id,j.photos[id]);pCache[id]=j.photos[id]}
    const mi=migrate(j.entries);Object.keys(mi).forEach(k=>{delete tombs[k];mi[k].at=Date.now()});Object.assign(R,mi);migAll();save();render();toast('Đã nhập xong ✓')}
  catch{alert('File không hợp lệ')}e.target.value=''};
$('#wipe').onclick=()=>{if(confirm('Xoá TOÀN BỘ dữ liệu (nhật ký, việc, việc định kỳ, tài chính…)? Không thể khôi phục.')&&confirm('Chắc chắn xoá hết?')){
  Object.keys(R).forEach(k=>tombs[k]=Date.now());R={};save();pClear();Object.keys(pCache).forEach(k=>delete pCache[k]);render();toast('Đã xoá hết')}};

applyTheme();drawAvatar();lockUI();
if('serviceWorker' in navigator&&location.protocol.startsWith('http')){navigator.serviceWorker.register('sw.js').catch(()=>{});
  // bản mới tải ngầm xong → báo để chạm cập nhật (không làm mất dữ liệu)
  navigator.serviceWorker.addEventListener('message',e=>{if(e.data!=='updated')return;const t=$('#toast');
    t.innerHTML='✨ Có bản mới · <u>chạm để cập nhật</u>';clearTimeout(toast.t);t.classList.add('on','upd');t.onclick=()=>location.reload()});
  navigator.serviceWorker.ready.then(()=>setTimeout(()=>navigator.serviceWorker.controller&&navigator.serviceWorker.controller.postMessage('check'),3000))}
})();
