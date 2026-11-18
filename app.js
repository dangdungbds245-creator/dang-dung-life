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
const toast=m=>{const t=$('#toast');t.textContent=m;t.classList.add('on');clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove('on'),2000)};
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
const TXT=[['out','Chi'],['in','Thu'],['lend','Cho vay'],['borrow','Đi vay']];
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
  tabs:['diary','task','rem'],evTime:'08:00',moon:false,ntf:true};
const HDEF={hero:1,tk:1,today:1,up:1,mini:1,mem:1};
let S=Object.assign({},SDEF,get(K.set,{}));S.home=Object.assign({},HDEF,S.home||{});
if(!Array.isArray(S.tabs)||S.tabs.length!==3)S.tabs=SDEF.tabs.slice();
const saveSet=()=>put(K.set,S);
let view='home',calM=new Date();calM.setDate(1);let selDay=today();
let editDate=null,editKey=null,mood=null,fav=false,curPh=[],addedPh=[],filter='all',readCtx=null;
let taskSeg='today',remLbl='all',moneyTab='tx',moneyM=new Date();moneyM.setDate(1);let vaultCat='all',peopleQ='';
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
    const salt=localStorage.getItem(K.salt);
    if(await checkPw(p))unlock(canCrypto?await deriveKey(p,salt):null);
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
const migAll=()=>!!(migGio()|migOnce());
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
      case 'rem':if(remOn(r,dk))out.push({k:'rem',id,ic:lblOf(r.label)[1],c:MOD.rem.c,t:r.title,time:r.time,s:freqTxt(r)});break;
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
  rem:()=>openForm('rem'),people:()=>openForm('person'),gio:()=>openForm('gio'),money:()=>openForm('tx',null,moneyTab==='loan'?{type:'lend'}:{}),sub:()=>openForm('sub'),habit:()=>openForm('habit'),vault:()=>openForm('vault')};
function go(v){view=v;render();$('main').scrollTop=0}
function render(){
  syncLastW();
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
  if(S.home.tk)h+=tkCardHtml();
  if(S.home.today){
    const ev=eventsOn(t,true).filter(e=>e.k!=='task');
    const tasks=recs('task').filter(i=>!R[i].done&&R[i].due&&R[i].due<=t).sort((a,b)=>R[a].due.localeCompare(R[b].due)||(R[a].time||'99').localeCompare(R[b].time||'99'));
    const habs=recs('habit');
    let b=ev.map(e=>evRow(e)).join('')+tasks.map(taskRow).join('');
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
      tile('money',`<small>Tháng ${+mk.slice(5)}: chi <b class="red">${fmtS(out)}</b></small><small>thu <b class="grn">${fmtS(inn)}</b></small>`)+
      tile('habit',habs.length?`<small>Hôm nay ${hd}/${habs.length}</small><div class="bar"><i style="width:${habs.length?hd/habs.length*100:0}%"></i></div>`:'<small>Bắt đầu một thói quen nhỏ</small>')+
      tile('sub',subs.length?`<small>≈ ${fmtS(sm)}/tháng</small><small>${nx?`${esc(nx[1].name)} · ${fmtDM(nx[0])}`:''}</small>`:'<small>Theo dõi khoản gia hạn</small>')+
      tile('people',(()=>{const ps=recs('person').map(i=>[nextOf(k=>!!bdayOn(R[i],k),t,370),R[i]]).filter(x=>x[0]).sort((a,b)=>a[0].localeCompare(b[0]))[0];
        return ps?`<small>🎂 ${esc(ps[1].name)}</small><small>${relDay(ps[0])}</small>`:'<small>Sinh nhật</small>'})())+
      `</div>`}
  if(S.home.mem){
    const md=t.slice(4),mem=diaryIds().filter(i=>R[i].date.endsWith(md)&&R[i].date<t).slice(0,3);
    if(mem.length)h+=`<div class="box"><div class="bh"><b>Ngày này năm xưa</b></div>${mem.map(k=>{const e=R[k],y=d.getFullYear()-parseInt(e.date);
      return `<button class="ev" data-read="${k}"><i style="background:${MOD.diary.c}">📔</i><div><b>${y} năm trước</b><small>${esc((e.title||e.body||'').replace(/\s+/g,' ').slice(0,70))}</small></div></button>`}).join('')}</div>`}
  $('#v-home').innerHTML=h||'<div class="empty">Bật các thẻ trong Cài đặt › Trang Hôm nay</div>'}
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
function renderMoney(){
  const y=moneyM.getFullYear(),m=moneyM.getMonth(),mk=`${y}-${pad(m+1)}`,all=recs('tx');
  let h=`<div class="seg">${[['tx','Thu chi'],['loan','Vay mượn']].map(([k,l])=>`<button class="${moneyTab===k?'on':''}" data-mt="${k}">${l}</button>`).join('')}</div>`;
  if(moneyTab==='tx'){
    const L=all.filter(i=>(R[i].type==='out'||R[i].type==='in')&&R[i].date&&R[i].date.startsWith(mk)).sort((a,b)=>R[b].date.localeCompare(R[a].date)||(R[b].at||0)-(R[a].at||0));
    const sum=t=>L.filter(i=>R[i].type===t).reduce((a,i)=>a+(+R[i].amount||0),0),out=sum('out'),inn=sum('in');
    const bc={};L.filter(i=>R[i].type==='out').forEach(i=>bc[R[i].cat]=(bc[R[i].cat]||0)+(+R[i].amount||0));
    const cats=Object.entries(bc).sort((a,b)=>b[1]-a[1]),mx=cats.length?cats[0][1]:1;
    h+=`<div class="cal-h"><button class="nav" data-mm="-1">‹</button><h2>Tháng ${m+1}, ${y}</h2><button class="nav" data-mm="1">›</button></div>
      <div class="msum"><div><small>Thu</small><b class="grn">${fmt(inn)}</b></div><div><small>Chi</small><b class="red">${fmt(out)}</b></div><div><small>Còn lại</small><b>${fmt(inn-out)}</b></div></div>
      ${cats.length?`<div class="box"><div class="bh"><b>Chi theo danh mục</b></div>${cats.map(([c,v])=>{const C=catOf('out',c);return `<div class="cbar"><span>${C[1]} ${C[2]}</span><div class="bar"><i style="width:${v/mx*100}%"></i></div><b>${fmtS(v)}</b></div>`}).join('')}</div>`:''}`;
    let cur='';
    for(const i of L){const r=R[i],C=catOf(r.type,r.cat);
      if(r.date!==cur){cur=r.date;const d=parse(cur);h+=`<div class="month">${DOWL[d.getDay()]}, ${fmtDMY(cur)}</div>`}
      h+=`<button class="ev" data-edit="tx:${i}"><i style="background:${r.type==='in'?MOD.money.c:'#c9764f'}">${C[1]}</i><div><b>${esc(r.note||C[2])}</b><small>${esc(C[2])}</small></div><b class="${r.type==='in'?'grn':'red'}">${r.type==='in'?'+':'−'}${fmtN(r.amount)}</b></button>`}
    if(!L.length)h+=`<div class="empty"><div class="big">💰</div>Tháng này chưa ghi khoản nào.<br>Bấm ＋ để ghi chi tiêu, thu nhập.</div>`;
  }else{
    const L=all.filter(i=>R[i].type==='lend'||R[i].type==='borrow').sort((a,b)=>(+!!R[a].paid-+!!R[b].paid)||(R[b].date||'').localeCompare(R[a].date||''));
    const open=t=>L.filter(i=>R[i].type===t&&!R[i].paid).reduce((a,i)=>a+(+R[i].amount||0),0);
    h+=`<div class="msum two"><div><small>Cho vay chưa thu</small><b class="grn">${fmt(open('lend'))}</b></div><div><small>Đi vay chưa trả</small><b class="red">${fmt(open('borrow'))}</b></div></div>`;
    h+=L.map(i=>{const r=R[i];return `<div class="trow${r.paid?' done':''}"><button class="ck${r.paid?' on':''}" data-paid="${i}">${r.paid?'✓':''}</button><button class="tt" data-edit="tx:${i}"><b>${r.type==='lend'?'Cho':'Vay'} ${esc(r.who||'')} · ${fmt(r.amount)}</b><small>${r.date?fmtDMY(r.date):''}${r.note?' · '+esc(r.note):''}${r.paid?' · đã trả':''}</small></button></div>`}).join('')||
      `<div class="empty"><div class="big">🤝</div>Chưa có khoản vay mượn nào</div>`}
  $('#v-money').innerHTML=h}

/* ---------- GÓI ĐĂNG KÝ ---------- */
function renderSub(){
  const t=today(),L=recs('sub').map(i=>({i,r:R[i],n:R[i].on===false?null:subNext(R[i],t)})).sort((a,b)=>(a.n||'9').localeCompare(b.n||'9'));
  const act=L.filter(x=>x.n),mon=act.reduce((a,x)=>a+subMonthly(x.r),0);
  $('#v-sub').innerHTML=`<div class="msum two"><div><small>Mỗi tháng (ước tính)</small><b>${fmt(mon)}</b></div><div><small>Mỗi năm</small><b>${fmt(mon*12)}</b></div></div>
    ${L.map(({i,r,n})=>`<button class="ev" data-edit="sub:${i}"><i style="background:${MOD.sub.c}">${esc((r.name||'?')[0].toUpperCase())}</i><div><b>${esc(r.name)}</b><small>${fmt(r.price)} / ${r.cycle==='year'?'năm':'tháng'}</small><small class="${n&&diffDays(t,n)<=(+r.pre||0)?'red':''}">${n?'Gia hạn: '+(n===t?'Hôm nay':relDay(n)):'Đã ngừng'}</small></div></button>`).join('')||
    `<div class="empty"><div class="big">💳</div>Chưa có gói nào.<br>Thêm iCloud, Netflix, Google One, tên miền, bảo hiểm… để được nhắc trước ngày gia hạn.</div>`}`}

/* ---------- THÓI QUEN ---------- */
function habStreak(r){const t=today();let d=r.days&&r.days[t]?t:addDays(t,-1),n=0;while(r.days&&r.days[d]){n++;d=addDays(d,-1)}return n}
function renderHabit(){
  const t=today(),L=recs('habit').sort((a,b)=>(R[a].c||R[a].at||0)-(R[b].c||R[b].at||0));
  const days=Array.from({length:7},(_,i)=>addDays(t,i-6));
  $('#v-habit').innerHTML=L.map(i=>{const r=R[i],on=r.days&&r.days[t],st=habStreak(r),m30=Array.from({length:30},(_,j)=>addDays(t,-j)).filter(k=>r.days&&r.days[k]).length;
    return `<div class="hab${on?' on':''}"><div class="hh"><button class="hi" data-edit="habit:${i}">${r.icon||'🌱'}</button><button class="hn" data-edit="habit:${i}"><b>${esc(r.name)}</b><small>${st?`🔥 ${st} ngày liên tiếp · `:''}${m30}/30 ngày</small></button>
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
  const it=[['write','📔','Nhật ký',MOD.diary.c],['task','✅','Việc',MOD.task.c],['rem','🔁','Định kỳ',MOD.rem.c],['out','💸','Khoản chi','#c9764f'],['in','💵','Khoản thu',MOD.money.c],['person','👤','Người thân',MOD.people.c],['gio','🕯️','Ngày giỗ',MOD.gio.c],['sub','💳','Gói đăng ký',MOD.sub.c],['vault','🗂️','Lưu giấy tờ',MOD.vault.c]];
  $('#mGrid').innerHTML=it.map(([a,i,n,c])=>`<button data-m="${a}"><span class="ti" style="background:${c}">${i}</span>${n}</button>`).join('');
  $('#menu').dataset.d=dk;$('#menu').classList.remove('hidden')}
function menuAct(a,dk){
  $('#menu').classList.add('hidden');
  ({write:()=>openEntry(null,dk),task:()=>openForm('task',null,{due:dk}),rem:()=>openForm('rem',null,{date:dk}),out:()=>openForm('tx',null,{type:'out',date:dk}),in:()=>openForm('tx',null,{type:'in',cat:'salary',date:dk}),
    person:()=>openForm('person'),gio:()=>openForm('gio'),sub:()=>openForm('sub',null,{start:dk}),vault:()=>openForm('vault')})[a]()}

/* ---------- BIỂU MẪU CHUNG ---------- */
const DEF={task:()=>({title:'',due:'',time:'',star:false,note:'',done:false}),
  rem:()=>({title:'',freq:'month',lunar:false,ld:'1',lm:'1',date:today(),time:'08:00',label:'personal',on:true,note:''}),
  person:()=>({name:'',rel:'',phone:'',bmode:'none',bday:'',bld:'1',blm:'1',byear:'',note:''}),
  gio:()=>({name:'',rel:'',ld:'1',lm:'1',year:'',place:'',note:''}),
  tx:()=>({type:'out',amount:0,cat:'food',who:'',paid:false,date:today(),note:''}),
  sub:()=>({name:'',price:0,cycle:'month',start:today(),pre:'3',on:true,note:''}),
  habit:()=>({name:'',icon:'💧',days:{}}),
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
    {n:'label',t:'chips',l:'Nhãn',o:LBL.map(x=>[x[0],x[1]+' '+x[2]])},
    {n:'on',t:'switch',l:'Đang bật'},{n:'note',t:'area',l:'Ghi chú'},
    {t:'hint',h:v=>{const n=nextOf(k=>remOn(Object.assign({},v,{on:true}),k),today(),400);return n?`🔔 Lần nhắc tiếp theo: <b>${relDay(n)==='Hôm nay'?'Hôm nay':DOWL[parse(n).getDay()]+', '+fmtDMY(n)}</b>${v.time?' lúc '+v.time:''} (âm lịch ${lunarTxt(n)})`:'Không có lần nhắc nào sắp tới'}}]}},
  person:{t:'Người thân',f:v=>[{n:'name',t:'text',l:'Họ tên',req:1},{n:'rel',t:'chips',l:'Quan hệ',o:REL.map(x=>[x,x])},{n:'phone',t:'tel',l:'Số điện thoại'},
    {n:'bmode',t:'chips',l:'Sinh nhật',o:[['none','Không rõ'],['solar','Dương lịch'],['lunar','Âm lịch']]},
    ...(v.bmode==='solar'?[{n:'bday',t:'date',l:'Ngày sinh'}]:v.bmode==='lunar'?[{t:'lunar',l:'Sinh nhật (âm lịch)',d:'bld',m:'blm'},{n:'byear',t:'num',l:'Năm sinh (không bắt buộc)'}]:[]),
    {n:'note',t:'area',l:'Ghi chú (sở thích, món thích ăn, size áo…)'}]},
  gio:{t:'Ngày giỗ',f:v=>[{n:'name',t:'text',l:'Tên ngày giỗ',req:1,ph:'VD: Ông nội, Bà ngoại, Tộc giỗ thu…'},
    {t:'lunar',l:'Ngày giỗ (âm lịch)',d:'ld',m:'lm'},
    {n:'year',t:'num',l:'Năm mất – âm lịch (không bắt buộc, để biết giỗ lần thứ mấy)'},
    {n:'place',t:'text',l:'Làm giỗ tại',ph:'VD: Nhà thờ họ, nhà bác Hai…'},{n:'note',t:'area',l:'Ghi chú (món cúng, người cần mời…)'},
    {t:'hint',h:v=>{const n=gioNext(v);return n?`🕯️ Giỗ tới: <b>${DOWL[parse(n).getDay()]}, ${fmtDMY(n)}</b> (${relDay(n)})<br>🔔 Nhắc trước 7 ngày (${fmtDM(addDays(n,-7))}), trước 1 ngày (${fmtDM(addDays(n,-1))}) và đúng ngày, lặp lại hằng năm theo âm lịch.`:''}}]},
  tx:{t:'Khoản tiền',f:v=>[{n:'type',t:'chips',l:'Loại',o:TXT},{n:'amount',t:'money',l:'Số tiền',req:1},
    ...(v.type==='out'||v.type==='in'?[{n:'cat',t:'chips',l:'Danh mục',o:(v.type==='in'?CAT_IN:CAT_OUT).map(x=>[x[0],x[1]+' '+x[2]])}]
      :[{n:'who',t:'text',l:v.type==='lend'?'Cho ai vay':'Vay của ai',req:1},{n:'paid',t:'switch',l:'Đã trả xong'}]),
    {n:'date',t:'date',l:'Ngày',req:1},{n:'note',t:'text',l:'Ghi chú',ph:'VD: Cà phê với khách'}]},
  sub:{t:'Gói đăng ký',f:v=>[{n:'name',t:'text',l:'Tên dịch vụ',req:1,ph:'VD: iCloud, Netflix, tên miền…'},{n:'price',t:'money',l:'Giá mỗi kỳ'},
    {n:'cycle',t:'chips',l:'Chu kỳ',o:[['month','Hằng tháng'],['year','Hằng năm']]},{n:'start',t:'date',l:'Một ngày gia hạn (gần nhất hoặc sắp tới)',req:1},
    {n:'pre',t:'chips',l:'Nhắc trước',o:[['0','Đúng ngày'],['1','1 ngày'],['3','3 ngày'],['7','7 ngày'],['30','30 ngày']]},{n:'on',t:'switch',l:'Đang dùng'},
    {n:'note',t:'area',l:'Ghi chú (tài khoản, cách huỷ…)'},{t:'hint',h:v=>{const n=v.start?subNext(v,today()):null;return n?`Lần gia hạn tới: <b>${fmtDMY(n)}</b>`:''}}]},
  habit:{t:'Thói quen',f:()=>[{n:'name',t:'text',l:'Tên thói quen',req:1,ph:'VD: Uống 8 ly nước'},{n:'icon',t:'chips',l:'Biểu tượng',o:HICONS.map(x=>[x,x])}]},
  vault:{t:'Kho cá nhân',f:()=>[{n:'title',t:'text',l:'Tên',req:1,ph:'VD: CCCD, bảo hành máy lạnh, số tài khoản…'},{n:'cat',t:'chips',l:'Loại',o:VCAT.map(x=>[x[0],x[1]+' '+x[2]])},
    {n:'body',t:'area',l:'Nội dung',ph:'Số, mã, ngày cấp, nơi mua, ghi chú…'},{n:'exp',t:'date',l:'Ngày hết hạn (nếu có)',clear:1},{n:'photos',t:'photos',l:'Ảnh chụp'}]}};
let fK=null,fId=null,fV=null,fAdded=[];
function openForm(k,id,preset){
  fK=k;fId=id||null;fV=Object.assign(DEF[k](),id&&R[id]?JSON.parse(JSON.stringify(R[id])):{},preset||{});fAdded=[];
  if(fV.photos)fV.photos=[...fV.photos];
  $('#fTitle').innerHTML=`${MOD[{person:'people',tx:'money'}[k]||k].i} ${FORMS[k].t}<small>${id?'Sửa':'Thêm mới'}</small>`;
  $('#fDel').classList.toggle('hidden',!id);
  renderForm();$('#form').classList.remove('hidden');$('#fBody').scrollTop=0;fitSheet();
  if(!id){const f=$('#fBody input[type=text]');if(f&&k!=='tx')setTimeout(()=>f.focus(),60);else if(k==='tx'){const a=$('#fBody [data-money]');if(a)setTimeout(()=>a.focus(),60)}}}
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
  const id=fId||('e'+uid()),old=fId&&R[fId]?R[fId]:{};
  if(old.photos)dropPhotos(old.photos.filter(p=>!(fV.photos||[]).includes(p)));
  const r=Object.assign({},old,fV,{k:fK});
  ['title','name','who','note','body','phone'].forEach(n=>{if(typeof r[n]==='string')r[n]=r[n].trim()});
  if(fK==='task'&&r.done&&!old.done)r.doneAt=Date.now();
  if(fK==='habit'&&!old.c)r.c=Date.now();
  putRec(id,r);fAdded=[];closeForm();render();toast('Đã lưu ✓')}
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
  for(const id of recs('rem')){const r=R[id];if(r.on===false)continue;const base={title:`${lblOf(r.label)[1]} ${r.title}`,desc:r.note,time:r.time};
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
  for(const id of recs('sub')){const s=R[id];if(s.on===false||!s.start)continue;
    icsEv(L,{uid:id,date:s.start,title:`💳 Gia hạn ${s.name} · ${fmt(s.price)}`,desc:s.note,rrule:'FREQ='+(s.cycle==='year'?'YEARLY':'MONTHLY'),alarms:+s.pre>0?['PT0S','P'+s.pre+'D']:['PT0S']});n++}
  for(const id of recs('vault')){const v=R[id];if(v.exp&&v.exp>=t){icsEv(L,{uid:id,date:v.exp,title:'⏳ Hết hạn: '+v.title,alarms:['PT0S','P7D','P30D']});n++}}
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
  try{tkCheck()}catch{}try{evCheck()}catch{}
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
$('main').addEventListener('click',e=>{
  const T=s=>e.target.closest(s);let b;
  if(b=T('[data-done]'))return toggleTask(b.dataset.done);
  if(b=T('[data-paid]')){const r=R[b.dataset.paid];r.paid=!r.paid;putRec(b.dataset.paid,r);return render()}
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
    if(a==='tk')return openTk()}
});
$('#menu').onclick=e=>{const b=e.target.closest('[data-m]');if(b)return menuAct(b.dataset.m,$('#menu').dataset.d);if(e.target.id==='menu'||e.target.id==='mClose')$('#menu').classList.add('hidden')};
// biểu mẫu
$('#fBody').addEventListener('input',e=>{const el=e.target,n=el.dataset.n;if(!n||el.type==='checkbox'||el.tagName==='SELECT')return;
  if(el.dataset.money){fV[n]=parseMoney(el.value);const h=$(`[data-mh="${n}"]`);if(h)h.textContent=fV[n]?'= '+fmt(fV[n]):'Gõ tắt được: 50k = 50.000đ, 2tr = 2.000.000đ'}
  else fV[n]=el.value});
$('#fBody').addEventListener('change',e=>{const el=e.target,n=el.dataset.n;if(!n)return;
  if(el.type==='checkbox'){fV[n]=el.checked;renderForm()}
  else if(el.tagName==='SELECT'||el.type==='date'||el.type==='time'){fV[n]=el.value;renderForm()}
  else if(el.dataset.money)el.value=fV[n]?fmtN(fV[n]):''});
$('#fBody').addEventListener('click',async e=>{let b;
  if(b=e.target.closest('[data-chip]')){fV[b.dataset.chip]=b.dataset.v;
    if(fK==='tx'&&b.dataset.chip==='type'&&(fV.type==='in'||fV.type==='out'))fV.cat=fV.type==='in'?'salary':'food';
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
$('#fDel').onclick=()=>{if(!confirm('Xoá mục này?'))return;delRec(fId);fAdded=[];closeForm();render();toast('Đã xoá')};
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
if('serviceWorker' in navigator&&location.protocol.startsWith('http'))navigator.serviceWorker.register('sw.js').catch(()=>{});
})();
