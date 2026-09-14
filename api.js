/* ═══════════════════════════════════════════════════════════
   LoveTrade · 数据层
   所有和 Supabase 数据库打交道的代码都在这里
   ═══════════════════════════════════════════════════════════ */

var SUPABASE_URL = 'https://udeexgfwojtqhbatmizv.supabase.co';
var SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVkZWV4Z2Z3b2p0cWhiYXRtaXp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkzMDYxMTksImV4cCI6MjEwNDg4MjExOX0.gbNvDUg23PWA1yAKA9EKdFTzs7eCS2K8phLBP6XOv2A';

/* 后端开关。设为 false 会退回纯本地模式 */
var USE_BACKEND = true;

var sb = null;
var ME = null;
var BACKEND_READY = false;
var BACKEND_ERR = '';

/* ─── 初始化 + 匿名登录 ──────────────────────────────────── */
async function initBackend(){
  if(!USE_BACKEND) return false;
  if(typeof supabase==='undefined'){ BACKEND_ERR='SDK 未加载'; return false; }
  if(!SUPABASE_URL || !SUPABASE_KEY){ BACKEND_ERR='未配置密钥'; return false; }
  try{
    sb = supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
      auth:{ persistSession:true, autoRefreshToken:true, storageKey:'lt_auth' }
    });
    var s = await sb.auth.getSession();
    if(s.data && s.data.session){
      ME = s.data.session.user.id;
    }else{
      var r = await sb.auth.signInAnonymously();
      if(r.error) throw r.error;
      ME = r.data.user.id;
    }
    BACKEND_READY = true;
    return true;
  }catch(e){
    BACKEND_ERR = (e && e.message) || '连接失败';
    console.warn('[LoveTrade] 后端不可用：', BACKEND_ERR);
    return false;
  }
}

/* ─── 行 ⇄ 本地对象 互转 ─────────────────────────────────── */
function roleEmoji(r){
  return {parent:'\uD83D\uDC68\u200D\uD83D\uDC69\u200D\uD83D\uDC67',sibling:'\uD83D\uDC6B',bestfriend:'\uD83E\uDEC2',friend:'\uD83D\uDC4B',acquaintance:'\uD83E\uDDD1\u200D\uD83D\uDCBC',third:'\uD83D\uDE08'}[r] || '\uD83D\uDC64';
}
function rowToPos(p){
  return {
    id:p.id, actorId:p.actor_id, role:p.role, type:p.type,
    amount:p.amount, settled:!!p.settled, correct:p.correct,
    payout:p.payout||0, emoji:roleEmoji(p.role),
    name:(typeof RL!=='undefined' && RL[p.role]) ? RL[p.role] : p.role,
    ts:p.created_at ? new Date(p.created_at).getTime() : Date.now()
  };
}
function rowToLot(l){
  return {
    type:l.type, size:l.size, price:+l.price,
    pnl:l.pnl!=null ? +l.pnl : undefined,
    ts:l.created_at ? new Date(l.created_at).getTime() : Date.now()
  };
}
function rowToRel(row, positions, lots){
  return {
    id:row.id, ticker:row.ticker, name:row.name,
    nameA:row.name_a, nameB:row.name_b,
    ownerId:row.owner_id, partnerId:row.partner_id,
    joined:(row.owner_id!==ME && row.partner_id!==ME),
    result:row.result||null,
    entryPrice:row.entry_price!=null ? +row.entry_price : undefined,
    position:row.position||0,
    realized:row.realized!=null ? +row.realized : 0,
    outlook:row.outlook||null,
    status:row.status||'none',
    answersDone:!!row.answers_done,
    unlocked:!!row.unlocked,
    entryTime:row.entry_time ? new Date(row.entry_time).getTime() : null,
    closeTime:row.close_time ? new Date(row.close_time).getTime() : null,
    created:row.created_at ? new Date(row.created_at).getTime() : Date.now(),
    positions:(positions||[]).map(rowToPos),
    lots:(lots||[]).map(rowToLot),
    earned:{}
  };
}

/* ─── 关系 ───────────────────────────────────────────────── */
async function apiCreateRel(o){
  var r = await sb.from('relationships').insert({
    ticker:o.ticker, name:o.name, name_a:o.nameA, name_b:o.nameB, owner_id:ME
  }).select().single();
  if(r.error) throw r.error;
  return rowToRel(r.data, [], []);
}
async function apiGetByTicker(tk){
  var r = await sb.from('relationships').select('*').eq('ticker', tk.toUpperCase()).maybeSingle();
  if(r.error) throw r.error;
  return r.data;
}
async function apiMyRels(){
  var out = {};
  var owned = await sb.from('relationships').select('*')
    .or('owner_id.eq.'+ME+',partner_id.eq.'+ME);
  (owned.data||[]).forEach(function(row){ out[row.id]=row });

  var parts = await sb.from('participants').select('rel_id').eq('actor_id', ME);
  var bets  = await sb.from('positions').select('rel_id').eq('actor_id', ME);
  var ids = {};
  (parts.data||[]).forEach(function(p){ ids[p.rel_id]=1 });
  (bets.data||[]).forEach(function(p){ ids[p.rel_id]=1 });
  var need = Object.keys(ids).filter(function(id){ return !out[id] });
  if(need.length){
    var more = await sb.from('relationships').select('*').in('id', need);
    (more.data||[]).forEach(function(row){ out[row.id]=row });
  }

  var rows = Object.keys(out).map(function(k){ return out[k] });
  if(!rows.length) return [];

  var relIds = rows.map(function(r){ return r.id });
  var ps = await sb.from('positions').select('*').in('rel_id', relIds).order('created_at');
  var ls = await sb.from('lots').select('*').in('rel_id', relIds).order('created_at');
  var bp={}, bl={};
  (ps.data||[]).forEach(function(p){ (bp[p.rel_id]=bp[p.rel_id]||[]).push(p) });
  (ls.data||[]).forEach(function(l){ (bl[l.rel_id]=bl[l.rel_id]||[]).push(l) });

  return rows.map(function(row){ return rowToRel(row, bp[row.id], bl[row.id]) })
             .sort(function(a,b){ return a.created-b.created });
}
async function apiRefreshRel(relId){
  var r = await sb.from('relationships').select('*').eq('id', relId).maybeSingle();
  if(r.error || !r.data) return null;
  var ps = await sb.from('positions').select('*').eq('rel_id', relId).order('created_at');
  var ls = await sb.from('lots').select('*').eq('rel_id', relId).order('created_at');
  return rowToRel(r.data, ps.data, ls.data);
}
async function apiSaveResult(relId, result){
  await sb.from('relationships').update({
    result:result, updated_at:new Date().toISOString()
  }).eq('id', relId);
}

/* ─── 仓位操作 ───────────────────────────────────────────── */
async function apiOpen(relId, price, size){
  await sb.from('relationships').update({
    status:'open', entry_price:price, position:size,
    entry_time:new Date().toISOString(), realized:0
  }).eq('id', relId);
  await sb.from('lots').insert({ rel_id:relId, type:'open', size:size, price:price });
}
async function apiAdd(relId, price, size, newEntry, newPos, outlook){
  var patch = { entry_price:newEntry, position:newPos };
  if(outlook) patch.outlook = outlook;
  await sb.from('relationships').update(patch).eq('id', relId);
  await sb.from('lots').insert({ rel_id:relId, type:'add', size:size, price:price });
}
async function apiCut(relId, price, size, newPos, pnl, newRealized, outlook){
  var patch = { position:newPos, realized:newRealized };
  if(outlook) patch.outlook = outlook;
  if(newPos<=0){
    patch.status='closed';
    patch.close_time=new Date().toISOString();
    var d=new Date(); d.setMonth(d.getMonth()+3);
    patch.followup_at=d.toISOString();
  }
  await sb.from('relationships').update(patch).eq('id', relId);
  await sb.from('lots').insert({ rel_id:relId, type:'cut', size:size, price:price, pnl:pnl });
  if(newPos<=0) await apiSettle(relId);
}
async function apiClose(relId){
  var d=new Date(); d.setMonth(d.getMonth()+3);
  await sb.from('relationships').update({
    status:'closed', close_time:new Date().toISOString(), followup_at:d.toISOString()
  }).eq('id', relId);
  await apiSettle(relId);
}
async function apiCalib(relId, size){
  await sb.from('relationships').update({ position:size }).eq('id', relId);
}

/* ─── 参与者与硬币 ───────────────────────────────────────── */
async function apiJoinRole(relId, role, side, coins, accuracy){
  var r = await sb.from('participants').insert({
    rel_id:relId, actor_id:ME, role:role, knows_side:side,
    coins:coins, accuracy:accuracy
  }).select().single();
  if(r.error){
    if(r.error.code==='23505') throw new Error('DUP');
    throw r.error;
  }
  return r.data;
}
async function apiMyCoins(){
  var r = await sb.from('participants').select('coins').eq('actor_id', ME);
  if(r.error) return 0;
  return (r.data||[]).reduce(function(s,p){ return s+(p.coins||0) }, 0);
}
async function apiSpendCoins(amount){
  var r = await sb.from('participants').select('id,coins')
    .eq('actor_id', ME).order('coins',{ascending:false});
  var left = amount;
  for(var i=0;i<(r.data||[]).length && left>0;i++){
    var p=r.data[i], take=Math.min(p.coins, left);
    if(take<=0) continue;
    await sb.from('participants').update({coins:p.coins-take}).eq('id', p.id);
    left -= take;
  }
}
async function apiEarnedRoles(relId){
  var r = await sb.from('participants').select('role').eq('rel_id', relId).eq('actor_id', ME);
  var o={}; (r.data||[]).forEach(function(p){ o[p.role]=1 });
  return o;
}
async function apiMyRoleIn(relId){
  var r = await sb.from('participants').select('*').eq('rel_id', relId).eq('actor_id', ME);
  return (r.data && r.data[0]) || null;
}

/* ─── 标准答案 ───────────────────────────────────────────── */
async function apiSaveAnswers(relId, side, answers){
  var r = await sb.from('standard_answers')
    .upsert({ rel_id:relId, side:side, answers:answers }, { onConflict:'rel_id,side' });
  if(r.error) throw r.error;
  await sb.from('relationships').update({ answers_done:true }).eq('id', relId);
}
async function apiHasAnswers(relId){
  var r = await sb.from('standard_answers').select('side').eq('rel_id', relId);
  return (r.data||[]).map(function(x){ return x.side });
}
async function apiGradeQuiz(relId, side, answers){
  var r = await sb.rpc('grade_quiz', { p_rel_id:relId, p_side:side, p_answers:answers });
  if(r.error) throw r.error;
  return r.data;
}

/* ─── 下注 ───────────────────────────────────────────────── */
async function apiBet(relId, role, type, amount){
  var r = await sb.from('positions').insert({
    rel_id:relId, actor_id:ME, role:role, type:type, amount:amount
  });
  if(r.error) throw r.error;
  await apiSpendCoins(amount);
}

/* ─── 结算 + 档案 ────────────────────────────────────────── */
async function apiSettle(relId){
  var r = await sb.from('positions').select('*').eq('rel_id', relId).eq('settled', false);
  var list = r.data||[];
  for(var i=0;i<list.length;i++){
    var p=list[i], correct=(p.type==='short'), payout=correct?p.amount*2:0;
    await sb.from('positions').update({settled:true, correct:correct, payout:payout}).eq('id', p.id);
    await apiBumpProfile(p.actor_id, correct, p.type);
  }
}
async function apiBumpProfile(actorId, correct, type){
  var g = await sb.from('profiles').select('*').eq('actor_id', actorId).maybeSingle();
  var n = g.data || {actor_id:actorId,total:0,correct:0,wrong:0,longs:0,shorts:0};
  n.total=(n.total||0)+1;
  if(correct) n.correct=(n.correct||0)+1; else n.wrong=(n.wrong||0)+1;
  if(type==='long') n.longs=(n.longs||0)+1; else n.shorts=(n.shorts||0)+1;
  n.updated_at=new Date().toISOString();
  await sb.from('profiles').upsert(n, {onConflict:'actor_id'});
}
async function apiMyProfile(){
  var r = await sb.from('profiles').select('*').eq('actor_id', ME).maybeSingle();
  return r.data || null;
}

/* ─── 付费订单 ───────────────────────────────────────────── */
async function apiCreateOrder(relId, orderNo, note){
  var r = await sb.from('orders').insert({
    rel_id:relId, actor_id:ME, order_no:orderNo, note:note||null
  }).select().single();
  if(r.error) throw r.error;
  return r.data;
}
async function apiMyOrder(relId){
  var r = await sb.from('orders').select('*')
    .eq('rel_id', relId).eq('actor_id', ME)
    .order('created_at',{ascending:false}).limit(1);
  return (r.data && r.data[0]) || null;
}

/* ─── 实时订阅 ───────────────────────────────────────────── */
var _ch = null;
function apiSubscribe(relId, onChange){
  if(!BACKEND_READY) return;
  if(_ch){ try{ sb.removeChannel(_ch) }catch(e){} _ch=null }
  _ch = sb.channel('rel:'+relId)
    .on('postgres_changes',
        {event:'*', schema:'public', table:'positions', filter:'rel_id=eq.'+relId},
        function(p){ onChange('position', p) })
    .on('postgres_changes',
        {event:'*', schema:'public', table:'lots', filter:'rel_id=eq.'+relId},
        function(p){ onChange('lot', p) })
    .on('postgres_changes',
        {event:'UPDATE', schema:'public', table:'relationships', filter:'id=eq.'+relId},
        function(p){ onChange('relationship', p) })
    .subscribe();
}
function apiUnsubscribe(){
  if(_ch){ try{ sb.removeChannel(_ch) }catch(e){} _ch=null }
}
