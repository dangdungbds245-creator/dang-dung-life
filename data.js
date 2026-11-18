/* Đăng Dũng Life — dữ liệu dùng chung (câu nói, tiết khí, âm lịch). © 2026 Đăng Dũng. Bảo lưu mọi quyền. */
const QUOTES=[
['Hành trình ngàn dặm bắt đầu từ một bước chân.','Lão Tử'],
['Có công mài sắt, có ngày nên kim.','Tục ngữ'],
['Hạnh phúc của đời bạn phụ thuộc vào chất lượng những suy nghĩ của bạn.','Marcus Aurelius'],
['Hãy luôn khao khát, hãy cứ dại khờ.','Steve Jobs'],
['Một cây làm chẳng nên non, ba cây chụm lại nên hòn núi cao.','Ca dao'],
['Chữ tâm kia mới bằng ba chữ tài.','Nguyễn Du'],
['Không có việc gì khó, chỉ sợ lòng không bền.','Hồ Chí Minh'],
['Ta chịu khổ trong tưởng tượng nhiều hơn trong thực tế.','Seneca'],
['Thất bại là mẹ thành công.','Tục ngữ'],
['Đi một ngày đàng, học một sàng khôn.','Tục ngữ'],
['Điều quan trọng không phải là bạn ngã bao nhiêu lần, mà là bạn đứng dậy được bao nhiêu lần.',''],
['Hôm nay là ngày đầu tiên của phần đời còn lại của bạn.',''],
['Biết đủ là đủ, biết đủ thì thường đủ.','Lão Tử'],
['Gần mực thì đen, gần đèn thì rạng.','Tục ngữ'],
['Hãy viết ra những gì bạn cảm thấy, rồi bạn sẽ hiểu chính mình.',''],
['Chậm mà chắc còn hơn nhanh mà sai.',''],
['Lời nói chẳng mất tiền mua, lựa lời mà nói cho vừa lòng nhau.','Ca dao'],
['Người thắng không bao giờ bỏ cuộc, người bỏ cuộc không bao giờ thắng.',''],
['Mỗi ngày là một trang giấy trắng — hãy viết điều đẹp vào đó.',''],
['Biết người biết ta, trăm trận trăm thắng.','Tôn Tử'],
['Uống nước nhớ nguồn.','Tục ngữ'],
['Nước chảy đá mòn.','Tục ngữ'],
['Điều gì không giết được bạn sẽ khiến bạn mạnh mẽ hơn.','Nietzsche'],
['Hãy sống như thể hôm nay là ngày cuối cùng của bạn.',''],
['Bình yên không phải là không có bão, mà là bình tĩnh giữa cơn bão.',''],
['Thương người như thể thương thân.','Tục ngữ'],
['Sức khoẻ là vàng.','Tục ngữ'],
['Đừng so sánh chương một của mình với chương mười của người khác.',''],
['Việc hôm nay chớ để ngày mai.','Tục ngữ'],
['Điều giản dị nhất thường là điều đẹp nhất.',''],
['Lá lành đùm lá rách.','Tục ngữ'],
['Hãy biết ơn những điều nhỏ bé, vì đó mới là những điều lớn lao.',''],
['Học, học nữa, học mãi.','Lênin'],
['Cái khó ló cái khôn.','Tục ngữ'],
['Cuộc sống là những gì xảy ra khi bạn đang bận lên kế hoạch cho những điều khác.','John Lennon'],
['Sau cơn mưa, trời lại sáng.','Tục ngữ'],
['Ăn quả nhớ kẻ trồng cây.','Tục ngữ'],
['Mỗi ngày tiến thêm một chút, rồi một ngày bạn sẽ ngạc nhiên về chặng đường mình đã đi.',''],
['Hãy dịu dàng với chính mình — bạn đang làm tốt hơn bạn nghĩ.',''],
['Thời gian là thứ quý giá nhất mà ta có thể tiêu.','Theophrastus'],
// Tôn Tử – Binh pháp
['Trăm trận trăm thắng chưa phải giỏi nhất; không đánh mà khuất phục được đối phương mới là giỏi nhất.','Tôn Tử – Binh pháp'],
['Đừng trông chờ việc địch không đến, hãy lo sao cho mình luôn sẵn sàng.','Tôn Tử – Binh pháp'],
['Người thắng là người đã thắng từ trước rồi mới ra trận.','Tôn Tử – Binh pháp'],
['Việc binh chuộng nhanh gọn, chưa thấy ai khéo mà kéo dài.','Tôn Tử – Binh pháp'],
['Giỏi dụng binh là khuất phục người mà không cần giao chiến.','Tôn Tử – Binh pháp'],
['Loạn lạc sinh ra từ trị bình, hèn nhát sinh ra từ dũng cảm, yếu đuối sinh ra từ mạnh mẽ — nên lúc yên ổn phải biết lo xa.','Tôn Tử – Binh pháp'],
// Gia Cát Lượng
['Không đạm bạc thì không sáng được chí, không tĩnh lặng thì không đi xa được.','Gia Cát Lượng'],
['Cúc cung tận tụy, đến chết mới thôi.','Gia Cát Lượng'],
['Mưu sự tại nhân, thành sự tại thiên.','Gia Cát Lượng'],
['Không học thì chẳng mở rộng được tài, không có chí thì chẳng thành được học.','Gia Cát Lượng'],
['Tuổi trẻ trôi đi như dòng nước, năm tháng chẳng chờ ai.','Gia Cát Lượng – Giới tử thư'],
// Tào Tháo
['Ngựa già nằm chuồng, chí vẫn ở ngàn dặm; người chí sĩ tuổi xế chiều, tráng tâm vẫn chẳng thôi.','Tào Tháo'],
['Trước chén rượu hãy cất tiếng hát, đời người được là bao?','Tào Tháo'],
['Núi không chê đất đá mà cao, biển không chê dòng nước mà sâu.','Tào Tháo'],
['Anh hùng là người biết dùng người tài.','Tào Tháo'],
// Tư Mã Ý
['Nhẫn nại chờ thời — việc lớn chẳng vội mà thành.','Theo tinh thần Tư Mã Ý'],
['Biết co để rồi vươn, biết nhịn để rồi thắng.','Theo tinh thần Tư Mã Ý'],
['Kẻ sống lâu hơn đối thủ thường là kẻ cuối cùng cười.','Theo tinh thần Tư Mã Ý'],
// Tam Quốc
['Thiên hạ hợp lâu ắt phân, phân lâu ắt hợp.','Tam Quốc diễn nghĩa'],
['Ba lần đến lều tranh — thành tâm đủ cảm động lòng người.','Tam Quốc diễn nghĩa'],
['Chớ thấy việc ác nhỏ mà làm, chớ thấy việc thiện nhỏ mà bỏ qua.','Lưu Bị – Tam Quốc'],
['Không cầu sinh cùng năm tháng ngày, chỉ nguyện chết cùng năm tháng ngày.','Tam Quốc – Kết nghĩa vườn đào'],
['Anh hùng không hỏi xuất thân, chỉ hỏi chí lớn.','Tam Quốc'],
// Cuộc sống tươi đẹp
['Hãy mỉm cười với cuộc sống, cuộc sống sẽ mỉm cười lại với bạn.',''],
['Mỗi sớm mai thức dậy là một món quà — hãy mở nó thật nhẹ nhàng.',''],
['Hạnh phúc là hành trình, không phải đích đến.',''],
['Đời đẹp ở những điều nhỏ bé: tách trà sáng, nắng qua ô cửa, tiếng cười của người thân.',''],
['Hãy tự trồng hoa trong vườn của mình, đừng đợi ai mang hoa đến.',''],
['Sống chậm lại một chút, bạn sẽ thấy đời đẹp hơn rất nhiều.',''],
['Nơi nào có lòng biết ơn, nơi đó có hạnh phúc.',''],
['Gia đình là bến đỗ bình yên nhất của mỗi người.',''],
['Mỗi ngày làm một điều tử tế, cuộc sống sẽ tươi đẹp hơn.',''],
['Hoa nào rồi cũng nở, chỉ cần đủ nắng và đủ kiên nhẫn.',''],
['Trời xanh, nắng đẹp, lòng bình an — thế là đủ cho một ngày.',''],
['Đời vẫn đẹp, vì còn người để thương và việc để mong chờ.',''],
['Hôm nay là một ngày đẹp trời để sống trọn vẹn.',''],
['Hãy làm điều mình yêu, rồi yêu điều mình làm.',''],
['Nụ cười là món quà rẻ nhất nhưng đẹp nhất mà ta có thể trao.','']
];
const TK_NAMES=['Lập xuân','Vũ thủy','Kinh trập','Xuân phân','Thanh minh','Cốc vũ','Lập hạ','Tiểu mãn','Mang chủng','Hạ chí','Tiểu thử','Đại thử','Lập thu','Xử thử','Bạch lộ','Thu phân','Hàn lộ','Sương giáng','Lập đông','Tiểu tuyết','Đại tuyết','Đông chí','Tiểu hàn','Đại hàn'];
function tkSunLon(jde){                          // kinh độ biểu kiến của Mặt Trời (độ)
  const T=(jde-2451545)/36525,r=Math.PI/180;
  const M=357.52911+35999.05029*T-0.0001537*T*T;
  const L0=280.46646+36000.76983*T+0.0003032*T*T;
  const C=(1.914602-0.004817*T-0.000014*T*T)*Math.sin(M*r)+(0.019993-0.000101*T)*Math.sin(2*M*r)+0.000289*Math.sin(3*M*r);
  const om=125.04-1934.136*T;
  return (((L0+C-0.00569-0.00478*Math.sin(om*r))%360)+360)%360}
const tkDeltaT=y=>(62.92+0.32217*(y-2000)+0.005589*(y-2000)*(y-2000))/86400;   // TT-UT (ngày)
function tkTermMs(year,i){                       // thời điểm (UTC ms) của tiết i trong chu kỳ bắt đầu từ Lập xuân năm `year`
  const target=(315+15*i)%360;
  let jd=Date.UTC(year,1,4)/864e5+2440587.5+i*15.2184;
  for(let k=0;k<10;k++){let d=target-tkSunLon(jd+tkDeltaT(year));d=((d%360)+540)%360-180;jd+=d/0.98565}
  return Math.round((jd-2440587.5)*864e5)}
const tkPad=n=>String(n).padStart(2,'0');
function tkVN(ms){const d=new Date(ms+7*3600e3);
  return {key:`${d.getUTCFullYear()}-${tkPad(d.getUTCMonth()+1)}-${tkPad(d.getUTCDate())}`,time:`${tkPad(d.getUTCHours())}:${tkPad(d.getUTCMinutes())}`}}
const _tkCache={};
function tkYear(year){                           // 24 tiết của chu kỳ năm `year` (Lập xuân năm đó → Đại hàn năm sau)
  if(!_tkCache[year])_tkCache[year]=TK_NAMES.map((name,i)=>{const ms=tkTermMs(year,i),v=tkVN(ms);return {i,name,year,ms,key:v.key,time:v.time}});
  return _tkCache[year]}
function tkAt(key){                              // tiết khí của một ngày 'YYYY-MM-DD' (ngày giao tiết tính là ngày đầu tiết mới)
  const y=+key.slice(0,4),all=[...tkYear(y-1),...tkYear(y),...tkYear(y+1)];
  let k=0;for(let j=0;j<all.length;j++)if(all[j].key<=key)k=j;
  const cur=all[k],next=all[k+1],dayMs=t=>Date.UTC(+t.slice(0,4),+t.slice(5,7)-1,+t.slice(8,10));
  return {cur,next,day:Math.round((dayMs(key)-dayMs(cur.key))/864e5)+1,len:Math.round((dayMs(next.key)-dayMs(cur.key))/864e5),left:Math.round((dayMs(next.key)-dayMs(key))/864e5)}}

/* ---- Nội dung 24 tiết khí: [biểu tượng, ý nghĩa & thời tiết, gợi ý sinh hoạt, câu hỏi gợi ý viết] ---- */
const TK_INFO=[
['🌱','Bắt đầu mùa xuân. Khí trời ấm dần, cây cối đâm chồi nảy lộc, mưa xuân lất phất.','Dậy sớm, vận động nhẹ ngoài trời; vẫn nên giữ ấm cổ và chân vì còn những đợt rét muộn.','Năm nay anh muốn gieo mầm cho điều gì?'],
['🌧️','Mưa bắt đầu nhiều hơn, băng tuyết phương Bắc tan, đất ẩm, cây cỏ xanh lên.','Trời ẩm, nên giữ nhà cửa khô thoáng, ăn đồ ấm và hạn chế đồ lạnh.','Điều gì trong anh đang dần tan chảy để đón cái mới?'],
['🐛','Sấm xuân bắt đầu vang, sâu bọ thức giấc sau mùa đông; nhà nông vào vụ mới.','Giao mùa dễ ốm, giữ ấm, ngủ đủ giấc và ăn uống đủ chất.','Điều gì vừa thức dậy trong anh dạo gần đây?'],
['🌸','Giữa mùa xuân, ngày và đêm dài gần bằng nhau. Nắng ấm, hoa nở rộ.','Cân bằng giữa làm việc và nghỉ ngơi; thời điểm đẹp để đi dạo, tập thể dục ngoài trời.','Điều gì trong cuộc sống của anh đang cần cân bằng lại?'],
['🌿','Trời trong sáng, cây cỏ xanh tươi. Người Việt thường đi tảo mộ, viếng thăm ông bà tổ tiên.','Hợp để ra ngoài hít thở không khí trong lành; người dễ dị ứng phấn hoa nên cẩn thận.','Anh muốn nhớ về và biết ơn ai trong gia đình?'],
['🌾','Mưa rào xuống nhiều, nuôi dưỡng lúa và hoa màu.','Trời ẩm ướt, nên giữ cơ thể khô ráo, ăn uống thanh đạm.','Anh đang chăm bón điều gì để sau này thu hoạch?'],
['☀️','Bắt đầu mùa hè. Nắng nóng tăng dần, cây cối phát triển mạnh.','Uống đủ nước, tránh nắng gắt buổi trưa, có thể ngủ trưa ngắn.','Mùa hè này anh muốn làm điều gì cho riêng mình?'],
['🌤️','Hạt lúa bắt đầu mẩy nhưng chưa chín hẳn – “tiểu mãn” là gần đầy.','Nóng ẩm tăng, nên ăn nhẹ, nhiều rau quả, uống đủ nước.','Điều gì anh đã gần đạt được, chỉ còn thiếu một chút nữa?'],
['🌾','Mùa gặt lúa và gieo trồng vụ mới, nhà nông bận rộn nhất năm.','Trời oi bức dễ mệt, giữ giấc ngủ đều và nghỉ ngơi hợp lý.','Việc gì đang khiến anh bận rộn nhất, và nó có đáng không?'],
['🌞','Ngày dài nhất, đêm ngắn nhất trong năm; nắng lên đến đỉnh.','Tránh nắng từ 10 đến 16 giờ, bổ sung nước, ăn đồ mát vừa phải.','Nửa đầu năm nay, điều anh tự hào nhất là gì?'],
['🔥','Bắt đầu những ngày nóng nực, gió mang hơi nóng.','Giữ cơ thể mát mẻ, nghỉ ngơi đủ, ăn uống thanh đạm.','Gần đây anh cần được nghỉ ngơi ở đâu, bằng cách nào?'],
['🌡️','Thời kỳ nóng nhất trong năm, oi bức, hay có mưa dông.','Hạn chế làm việc ngoài trời lúc nắng gắt, uống nhiều nước, ăn chín uống sôi.','Điều gì khiến anh “nóng” gần đây và anh đã xử lý ra sao?'],
['🍃','Bắt đầu mùa thu. Ở nước ta trời vẫn còn nóng nhưng sáng sớm đã dịu hơn.','Chuyển mùa, giữ ấm buổi sáng sớm, ăn uống điều độ.','Anh muốn thu xếp lại điều gì cho nửa cuối năm?'],
['🌥️','“Xử” là chấm dứt – cái nóng bắt đầu lùi dần.','Ban ngày còn nóng nhưng đêm mát hơn, chú ý giữ ấm khi ngủ.','Điều gì anh nên buông bỏ để lòng nhẹ hơn?'],
['💧','Sương trắng đọng buổi sớm, trời mát dần.','Sáng sớm se lạnh nên mặc ấm; hợp để tập thể dục nhẹ.','Khoảnh khắc yên bình nào gần đây anh thấy trân quý?'],
['🍂','Giữa mùa thu, ngày và đêm dài gần bằng nhau; trời cao, gió mát.','Không khí khô dần, uống đủ nước, ăn uống thanh đạm.','Điều gì trong năm nay anh thấy đã trọn vẹn?'],
['🍁','Sương lạnh hơn, không khí hanh khô.','Giữ ấm chân, dưỡng ẩm cho da, uống đủ nước.','Anh đang chuẩn bị gì cho những tháng cuối năm?'],
['🌫️','Sương giá xuống, trời lạnh rõ rệt, lá cây bắt đầu rụng.','Giữ ấm cơ thể, nhất là với người lớn tuổi và trẻ nhỏ.','Anh muốn giữ ấm và chăm sóc cho ai lúc này?'],
['❄️','Bắt đầu mùa đông. Trời lạnh dần, cây cối như vào kỳ nghỉ.','Ăn đồ ấm, ngủ sớm hơn, vận động nhẹ để tăng sức đề kháng.','Mùa đông này anh muốn bồi đắp điều gì cho bản thân?'],
['🌨️','Phương Bắc bắt đầu có tuyết nhỏ; ở nước ta trời se lạnh.','Giữ ấm, hạn chế ra ngoài khi trời rét đậm.','Điều nhỏ bé mà ấm áp nào anh nhận được gần đây?'],
['☃️','Tuyết rơi dày ở phương Bắc; trời rét sâu hơn.','Ăn uống đủ chất, giữ ấm, tránh gió lạnh.','Năm nay anh đã làm được điều gì mà chưa kịp ghi lại?'],
['🌙','Đêm dài nhất, ngày ngắn nhất trong năm; từ đây ngày bắt đầu dài dần.','Nghỉ ngơi đủ, ăn đồ ấm, dành thời gian sum họp gia đình.','Còn điều gì anh muốn hoàn thành trước khi năm cũ khép lại?'],
['🧣','Bắt đầu những đợt rét, nhưng chưa phải lúc rét nhất.','Giữ ấm, có thể tập luyện trong nhà khi trời quá lạnh.','Trong năm mới, anh sẽ làm điều gì khác đi?'],
['🥶','Thời kỳ rét nhất trong năm, khép lại vòng 24 tiết khí, mùa xuân sắp về.','Giữ ấm tay chân, ăn đồ nóng; quan tâm sức khoẻ người già trong nhà.','Cả một vòng tiết khí đã qua, điều anh biết ơn nhất là gì?']
];

/* ---- Âm lịch Việt Nam (thuật toán thiên văn, múi giờ UTC+7) — © 2026 Đăng Dũng ---- */
const LN_INT=Math.floor,LN_TZ=7;
function lnJd(dd,mm,yy){const a=LN_INT((14-mm)/12),y=yy+4800-a,m=mm+12*a-3;
  return dd+LN_INT((153*m+2)/5)+365*y+LN_INT(y/4)-LN_INT(y/100)+LN_INT(y/400)-32045}
function lnFromJd(jd){const a=jd+32044,b=LN_INT((4*a+3)/146097),c=a-LN_INT(b*146097/4),d=LN_INT((4*c+3)/1461),e=c-LN_INT(1461*d/4),m=LN_INT((5*e+2)/153);
  return [e-LN_INT((153*m+2)/5)+1,m+3-12*LN_INT(m/10),b*100+d-4800+LN_INT(m/10)]}
function lnNewMoon(k){
  const T=k/1236.85,T2=T*T,T3=T2*T,dr=Math.PI/180,s=Math.sin;
  let Jd1=2415020.75933+29.53058868*k+0.0001178*T2-0.000000155*T3;
  Jd1+=0.00033*s((166.56+132.87*T-0.009173*T2)*dr);
  const M=359.2242+29.10535608*k-0.0000333*T2-0.00000347*T3;
  const Mpr=306.0253+385.81691806*k+0.0107306*T2+0.00001236*T3;
  const F=21.2964+390.67050646*k-0.0016528*T2-0.00000239*T3;
  let C1=(0.1734-0.000393*T)*s(M*dr)+0.0021*s(2*dr*M);
  C1=C1-0.4068*s(Mpr*dr)+0.0161*s(dr*2*Mpr);
  C1=C1-0.0004*s(dr*3*Mpr);
  C1=C1+0.0104*s(dr*2*F)-0.0051*s(dr*(M+Mpr));
  C1=C1-0.0074*s(dr*(M-Mpr))+0.0004*s(dr*(2*F+M));
  C1=C1-0.0004*s(dr*(2*F-M))-0.0006*s(dr*(2*F+Mpr));
  C1=C1+0.0010*s(dr*(2*F-Mpr))+0.0005*s(dr*(2*Mpr+M));
  const dt=T<-11?0.001+0.000839*T+0.0002261*T2-0.00000845*T3-0.000000081*T*T3:-0.000278+0.000265*T+0.000262*T2;
  return Jd1+C1-dt}
function lnSunLon(jdn){const T=(jdn-2451545.0)/36525,T2=T*T,dr=Math.PI/180;
  const M=357.52910+35999.05030*T-0.0001559*T2-0.00000048*T*T2,L0=280.46645+36000.76983*T+0.0003032*T2;
  let DL=(1.914600-0.004817*T-0.000014*T2)*Math.sin(dr*M);DL+=(0.019993-0.000101*T)*Math.sin(dr*2*M)+0.000290*Math.sin(dr*3*M);
  let L=(L0+DL)*dr;L=L-Math.PI*2*LN_INT(L/(Math.PI*2));return L}
const lnSun=d=>LN_INT(lnSunLon(d-0.5-LN_TZ/24)/Math.PI*6);
const lnNM=k=>LN_INT(lnNewMoon(k)+0.5+LN_TZ/24);
function lnM11(yy){const k=LN_INT((lnJd(31,12,yy)-2415021)/29.530588853);let nm=lnNM(k);if(lnSun(nm)>=9)nm=lnNM(k-1);return nm}
function lnLeapOff(a11){const k=LN_INT((a11-2415021.076998695)/29.530588853+0.5);let last=0,i=1,arc=lnSun(lnNM(k+i));
  do{last=arc;i++;arc=lnSun(lnNM(k+i))}while(arc!==last&&i<14);return i-1}
const _lnC=new Map();
function solar2lunar(dd,mm,yy){                  // → {d,m,y,leap}
  const ck=yy*1e4+mm*100+dd;if(_lnC.has(ck))return _lnC.get(ck);
  const dn=lnJd(dd,mm,yy),k=LN_INT((dn-2415021.076998695)/29.530588853);
  let ms=lnNM(k+1);if(ms>dn)ms=lnNM(k);
  let a11=lnM11(yy),b11=a11,ly;
  if(a11>=ms){ly=yy;a11=lnM11(yy-1)}else{ly=yy+1;b11=lnM11(yy+1)}
  const ld=dn-ms+1,diff=LN_INT((ms-a11)/29);let leap=0,lm=diff+11;
  if(b11-a11>365){const lo=lnLeapOff(a11);if(diff>=lo){lm=diff+10;if(diff===lo)leap=1}}
  if(lm>12)lm-=12;if(lm>=11&&diff<4)ly-=1;
  const r={d:ld,m:lm,y:ly,leap};_lnC.set(ck,r);return r}
function lunar2solar(ld,lm,ly,leap){              // → [dd,mm,yy] hoặc null
  let a11,b11;if(lm<11){a11=lnM11(ly-1);b11=lnM11(ly)}else{a11=lnM11(ly);b11=lnM11(ly+1)}
  const k=LN_INT(0.5+(a11-2415021.076998695)/29.530588853);let off=lm-11;if(off<0)off+=12;
  if(b11-a11>365){const lo=lnLeapOff(a11);let lpm=lo-2;if(lpm<0)lpm+=12;
    if(leap&&lm!==lpm)return null;if(leap||off>=lo)off+=1}
  else if(leap)return null;
  return lnFromJd(lnNM(k+off)+ld-1)}
const CAN=['Giáp','Ất','Bính','Đinh','Mậu','Kỷ','Canh','Tân','Nhâm','Quý'],CHI=['Tý','Sửu','Dần','Mão','Thìn','Tỵ','Ngọ','Mùi','Thân','Dậu','Tuất','Hợi'];
const canChiYear=y=>CAN[(y+6)%10]+' '+CHI[(y+8)%12];
const canChiDay=(dd,mm,yy)=>{const j=lnJd(dd,mm,yy);return CAN[(j+9)%10]+' '+CHI[(j+1)%12]};
