/* ═══════════════ i18n ═══════════════ */
var LANG = (function(){
  try{var s=localStorage.getItem('lt_lang');if(s)return s}catch(e){}
  return (navigator.language||'zh').toLowerCase().indexOf('zh')===0?'zh':'en';
})();
function setLang(l){
  LANG=l;
  try{localStorage.setItem('lt_lang',l)}catch(e){}
  applyI18n();
  rerenderAll();
}
function toggleLang(){setLang(LANG==='zh'?'en':'zh')}
/* 静态 HTML：首次运行把中文存进 data-zh，之后在 data-zh / data-en 间切换 */
function applyI18n(){
  var els=document.querySelectorAll('[data-en]');
  for(var i=0;i<els.length;i++){
    var e=els[i];
    if(!e.hasAttribute('data-zh'))e.setAttribute('data-zh',e.textContent.trim());
    e.textContent=LANG==='en'?e.getAttribute('data-en'):e.getAttribute('data-zh');
  }
  var hs=document.querySelectorAll('[data-en-html]');
  for(var k=0;k<hs.length;k++){
    var e2=hs[k];
    if(!e2.hasAttribute('data-zh-html'))e2.setAttribute('data-zh-html',e2.innerHTML);
    e2.innerHTML=LANG==='en'?e2.getAttribute('data-en-html'):e2.getAttribute('data-zh-html');
  }
  var ph=document.querySelectorAll('[data-en-ph]');
  for(var j=0;j<ph.length;j++){
    var p=ph[j];
    if(!p.hasAttribute('data-zh-ph'))p.setAttribute('data-zh-ph',p.getAttribute('placeholder')||'');
    p.setAttribute('placeholder',LANG==='en'?p.getAttribute('data-en-ph'):p.getAttribute('data-zh-ph'));
  }
  document.documentElement.lang=LANG==='en'?'en':'zh-CN';
  var lb=document.getElementById('lang-btn');
  if(lb)lb.textContent=LANG==='zh'?'EN':'中';
}
/* 动态文本字典 */
function t(k,vars){
  var d=(I18N[LANG]&&I18N[LANG][k])||(I18N.zh[k])||k;
  if(vars)for(var v in vars)d=d.split('{'+v+'}').join(vars[v]);
  return d;
}
/* 双语数组取值：['中文','English'] */
function p(pair){return LANG==='en'?pair[1]:pair[0]}
function rerenderAll(){
  try{
    renderLabor();updStab();
    var r=cur();
    renderPF();
    if(r){renderDT();renderPD();renderAN();setTimeout(drawDT,60)}
    if(window._lastResult)showResult(window._lastResult);
  }catch(e){}
}
var I18N={zh:{},en:{}};

I18N.zh={
 lab_me:'我',lab_them:'对方',lab_even:'差不多',own_you:'你',
 verdict_liq:'立即平仓 — 止损触发',verdict_red:'减持，保护剩余资本',verdict_hold:'持有，密切观察',verdict_buy:'高确信度持仓',
 phase_crash:'崩盘',phase_bear:'熊市',phase_range:'震荡',phase_bull:'牛市',
 sig:'交易信号',score_pe:'认知对等 PE',score_cf:'财务协同 CF',score_vol:'波动率 VOL',
 bd_title:'评分明细',bd_base:'基本面基础分',bd_pos:'正面事件',bd_neg:'负面事件',bd_hard:'硬性止损触发',
 bd_soft:'软性风险因子',bd_macro:'宏观环境',bd_labor:'情感劳动损耗',bd_laborpen:'情感劳动失衡',bd_gap:'情绪稳定性落差',bd_total:'综合指数',
 rpt_title:'分析师报告',rpt_empty_t:'暂无报告',rpt_empty_s:'完成评估后报告将出现在这里',kline_title:'感情 K 线图',kline_cap:'基于你填写的事件时间线生成 · 非市场价格',
 disclaim:'⚠ 本工具提供情感资产风险评估，而非绝对真理。所有开仓/平仓操作均需在现实中手动执行。',
 back_dt:'← 返回详情页开仓',
 f_hardstop:'硬性止损已触发',
 cri_hd:'🔴 检测到高危信号',
 cri_body:'这不是「关系问题」，这是伤害。<br>评分系统在这里没有意义 —— 无论其他指标看起来多好。<br><br>任何把这件事解释成「他只是脾气不好」「我也有错」的说法，都不成立。',
 cri_help:'如果你需要帮助：<br><b>全国妇联维权服务热线 12338</b><br><b>紧急情况请拨 110</b><br><br>如果查看记录可能给你带来危险，记得清理浏览记录。',
 cri_note:'⚠ 本次评估未生成分数。在存在人身安全风险的情况下，任何形式的量化权衡都是不恰当的。',
 ctl_hd:'⚠️ 检测到控制型行为',
 ctl_body:'这些行为往往是渐进的，而且常常以关心的形式出现，所以很难在当下认出来。<br><br>它们的共同点是：让你可支配的东西变少 —— 钱、社交、行动自由、对自己判断的信任。<br><br>下面的分数已被封顶，因为在这类结构里，其他指标的参考价值有限。',f_volhi:'高波动率 · 市场易被小额资金推动',f_volmid:'中等波动率',f_vollo:'低波动率 · 抗舆论操纵',
 f_negroi:'负ROI行为模式',f_llmatch:'爱语言高度匹配',f_llmiss:'爱语言错位',f_pe:'认知兼容性强',
 f_struct:'结构性风险溢价激活',f_gap:'情绪稳定性落差 {n} · 照顾者结构',f_labor:'情感劳动失衡 {n}%',f_laborsk:'情感劳动偏斜 {n}%',
 f_mktlong:'市场情绪：做多占优',f_mktshort:'市场情绪：做空占优',
 l5:'⬡ LAYER 5 激活 — ',l5def:'结构性风险溢价已加载。',
 lab_card:'情感劳动分布',lab_me_n:'我 {n} 项',lab_even_n:'均衡 {n}',lab_them_n:'对方 {n} 项',lab_even_note:'另有 {n} 项两人相当',
 lab_heavy:'主要由你承担：',lab_light:'主要由对方承担：',
 lab_warn:'失衡度 {n}% — 这不是感受，是清单上的事实。长期单向的情感劳动会被双方共同视为理所当然，且很少被计入关系的账本。',
 lab_answered:'情感劳动分布 · 已回答 {n}/26',
 gap_title:'⚠ 情绪稳定性落差',gap_a:'A方',gap_b:'B方',gap_d:'落差',
 gap_text:'这类配置容易固化成「照顾者—被照顾者」结构：稳定的一方持续承担情绪劳动，不稳定的一方逐渐失去自我调节的动力。稳定方的付出因为「他本来就情绪好」而被视为理所当然，往往不被计入关系的账本。',
 gap_both:'🔺 双重信号叠加：情绪稳定性落差 {g} + 情感劳动失衡 {s}%。这个组合比任何单一指标都更值得警惕——它描述的是一个已经固化的单向供养结构。',
 stab_combined:'综合稳定度',stab_gap_ok:'落差 {n} · 双方节奏一致',stab_gap_near:'落差 {n} · 双方节奏较接近',
 stab_gap_warn:'落差 {n} · 接近警戒线',stab_gap_bad:'⚠ 落差 {n} · 照顾者—被照顾者结构风险',
 stab_gap_bad2:'稳定的一方会持续承担情绪劳动，其付出因「本来就情绪好」而被视为理所当然。',
 pos_probe:'试探仓 — 保持距离，随时可以抽身',pos_light:'轻仓 — 有投入，但生活重心还在别处',
 pos_half:'半仓 — 认真对待，同时保留了自己',pos_heavy:'重仓 — 这段关系已是你生活的主轴',
 pos_full:'全仓 — 你把自己全部押了进去，没有留退路',
 hold_title:'持仓档案',hold_days:'已持仓 <b style="color:var(--g)">{d}</b> 天 · 加仓 <b>{a}</b> 次 · 减仓 <b style="color:{cc}">{c}</b> 次',
 hold_lastadd:'最近一次加仓：',hold_never:'从未加仓',hold_daysago:'{n} 天前',hold_realized:'已兑现盈亏：',
 hold_cutwarn:'你已经连续减仓 {n} 次。持续降低投入通常不是一个决定，而是一个已经在发生的过程。',
 div_title:'⚠️ <b>立场背离</b>',div_hi_no:'你的仓位是 {p}%，但你自己判断这段关系走不到一年。',div_hi_no2:'你知道答案，但你还没走。',
 div_hi_maybe:'重仓 {p}%，但你对一年后并不确定。',div_hi_maybe2:'高投入配上低确信度，是最消耗人的持仓结构。',
 div_lo_yes:'你只投入了 {p}%，却相信这段关系能长久。',div_lo_yes2:'可能是保护自己，也可能是你已经在慢慢抽身而还没承认。',
 ins_title:'👑 内部人信号 · 公开披露',ins_add:'当事人增持 +{n}%',ins_cut:'当事人减持 −{n}%',ins_price:'市场价 ',
 ins_foot:'当事人的仓位变动会直接推动市场价格 — 内部人比任何旁观者都更了解真实情况。',
 rec_title:'我的预测档案',rec_settled:'已结算',rec_acc:'准确率',rec_tilt:'倾向',
 rec_short:'偏空',rec_long:'偏多',rec_even:'均衡',
 rec_detail:'{r} 次判断正确 · {w} 次判断错误 · 做多 {l} / 做空 {s}',
 q_high:'高权重 · 60%',q_mid:'中权重 · 30%',q_low:'低权重 · 10%',
 q_next:'下一题 →',q_result:'查看结果 →',
 qr_high:'高权重题（Q1-Q10）',qr_mid:'中权重题（Q11-Q16）',qr_low:'低权重题（Q17-Q19）',qr_acc:'综合准确率',
 who_a:'{n} — 我对ta了解更多',who_b:'{n} — 我对ta了解更多',
 earn_hint:'每个身份在每段关系里只能领取一次硬币',earn_hint_n:'已在这段关系领取 {n} 个身份的硬币 · 每个身份仅限一次',
 pf_sub:'{n} 段关系 · {m} 段已评估 · 🪙 {c}',pf_empty_t:'持仓为空',pf_empty_s:'创建一段情感持仓开始<br>给它一个代号',
 rc_pending:'待评估',rc_closed:'已平仓',rc_open:'持仓中',rc_none:'未开仓',rc_pos:'仓位 {n}%',rc_bets:'{n} 次预测',
 dt_notassessed:'尚未评估 — 去分析师页面填写',dt_closed:'● 已平仓 · 仓位已清空',
 dt_cost:'成本价 ',dt_val:'估值 ',
 roi_settled:'已结算',roi_notopen:'未开仓',roi_waiting:'待开盘',
 cap_closed:'仓位已清算 · 指数归零',cap_market:'市场价格 · 由预测市场买卖推动',cap_val:'评估估值走势 · 尚无人交易',
 pred_none:'暂无预测 — 分享代号邀请朋友',pl_empty:'暂无持仓 — 成为第一个预测者',pl_ops:'{n} 次操作 · 累计 {a}🪙',pl_ops2:'{n} 次操作 · 累计投入 {a} 🪙',
 pl_net_long:'净多',pl_net_short:'净空',pl_op:'操作 {n}',pl_rev:'⚠️ 立场反转',
 pl_right:'✓ 判断正确 +{n}',pl_wrong:'✗ 判断错误',
 mkt_people:'参与者 {p} 人 · {o} 次操作',sum_long:'{n} 人做多',sum_short:'{n} 人做空',sum_locked:'🔒 谁在做多、谁在做空、各自的了解程度 —— 解锁后可见',
 btn_assess:'去评估 →',btn_reassess_new:'重新评估开启新一轮 →',btn_open_at:'开仓 @{n}',btn_reassess:'重新评估',
 btn_add:'加仓',btn_add_full:'加仓（满仓）',btn_cut:'减仓',btn_close_pos:'平仓（清空 {n}% 仓位）',
 pu_text:'这段关系创建于「仓位」功能上线之前，当前的 <b id="pu-cur">{n}</b>% 是系统补的默认值，不是你的真实选择。请设置成你实际投入的程度。',
 max_add:'最多 +{n}%',max_cut:'最多 −{n}%',cut_zero:'⚠ 减到 0% 等同于平仓，市场将关闭并结算所有亲友仓位。',
 an1:'Layer 1：校准用户画像...',an2:'应用爱语言匹配系数...',an3:'依恋类型放大器已激活...',an4:'Layer 2：事件影响评分中...',
 an5:'Layer 3：时间衰减与修复系数...',an6:'Layer 4：宏观环境因子已加载...',an7:'Layer 5：结构性风险档案加载中...',
 an8:'读取预测市场情绪数据...',an9:'根据事件时间线生成 K 线...',an10:'综合报告编译中...',
 ts_created:'已创建 ${n}',ts_switched:'已切换到 ${n}',ts_joined:'已加入 ${n}',
 ts_opened:'已开仓 · {p}% 仓位 @ {e}',ts_added:'已加仓 +{a}% · 仓位 {p}% · 成本价 {e}',
 ts_cut:'已减仓 −{a}% · 仓位 {p}%',ts_cutn:'已减仓 −{a}% · 这是第 {n} 次了',
 ts_zero:'仓位已清零 · 视同平仓',ts_closed:'已平仓 · 市场结算完毕',ts_calib:'仓位已校准为 {n}%',
 ts_bet_long:'做多 {n} 硬币已记录',ts_bet_short:'做空 {n} 硬币已记录',
 ts_pickrel:'请先创建或选择一段关系',ts_needname:'请输入关系名称',ts_needab:'请填写双方称呼',
 ts_badticker:'代号只能是2-6位字母或数字',ts_dupticker:'代号已存在，换一个',ts_needticker:'请输入代号',
 ts_needassess:'请先完成评估',ts_isopen:'已经是持仓状态',ts_noopen:'当前没有持仓',
 ts_full:'已是满仓，无法继续加仓',ts_nopos:'已无仓位可减',ts_closedmkt:'该关系已平仓，市场已关闭',
 ts_needrole:'请先在「赚取硬币」中选择你的身份',ts_earned:'该身份在这段关系里已领取过硬币',
 ts_needamt:'请选择投入金额',ts_needevent:'请至少选择一个事件或填写描述',
 ts_copied:'链接已复制',ts_copiedcode:'代号已复制',ts_nocopy:'没有可复制的内容',ts_manualcopy:'请长按上方链接手动复制',
 ts_reset:'已清空全部数据',ts_selectrel:'请先选择一段关系',ts_selectrel2:'请先选择关系',
 ts_assessdone:'评估完成 · 可前往详情页开仓',reassess_hint:'已回填上次评估的内容（{d}）。只改动变化的部分就行，不用重填。',ts_createfirst:'请先创建一段关系',
 confirm_reset:'这会清空所有关系、持仓和硬币记录，且无法恢复。确定继续吗？',confirm_del:'删除 {n} ？这段关系的评估、仓位和所有预测记录都会消失，无法恢复。',ts_deleted:'已删除',
 self_role:'当事人（本人）',anon_parent:'父母/长辈',anon_sibling:'兄弟姐妹',anon_bestfriend:'闺蜜/死党',
 anon_friend:'普通朋友',anon_acquaintance:'路人甲',anon_third:'神秘第三者 😈',anon_default:'匿名用户',
 share_local:'⚠ 当前是本地预览环境，无法生成可分享的链接。',
 share_local2:'请把这个文件部署到网上（例如 Netlify），在正式网址下打开本页再生成链接。',
 share_local3:'现在你可以先把代号 <b style="color:var(--go)">${n}</b> 直接发给朋友，让他们在应用里点「输入代号加入」。',
 share_copy:'复制邀请链接',share_copycode:'复制关系代号',
 share_note:'💡 如果对方也是当事人，让ta用这个链接加入后，在「赚取硬币」里选择「我是当事人」即可获得同等权限。',
 share_note2:'注意：当前版本数据存在各自设备上，双方看到的下注记录不会实时同步，需要后端才能打通。',
 rel_sub:'选择你与「{n}」的身份',
 lock_hint:'🔒 请先开仓锁定你自己的判断，再邀请亲友预测',lock_answers:'🔒 请先填写标准答案，朋友答题才有分可评',
 ph_5:'5% 试探仓',ph_100:'100% 全仓',ph_bal:'{n}% 余额',
 owner_only:'只有当事人可以操作仓位',obs_banner:'👀 你正在观察 <b>{n}</b> 的关系 — 可以预测，不能操作仓位',
 obs_tag:'观察中',mine_tag:'我的',grp_mine:'我的持仓',grp_obs:'我在观察',btn_predict:'去预测市场 →',
 pf_none:'还没有任何情感持仓',side_a:'A方',side_b:'B方',shared_from:'来自分享',hold_curpos:'当前仓位',dt_tkpos:'  ·  仓位 {n}%',bet_long_t:'📈 做多',bet_short_t:'📉 做空',
 bet_long_s:'看好这段感情，感情结束则损失本金',bet_short_s:'不看好这段感情，感情结束则获得收益',
 bar_long:'做多 {n}%',bar_short:'做空 {n}%',qr_role_fb:'参与者',
 ll_match:'爱语言高度匹配——双方以对方能接收的方式表达爱，每次互动的效能被自动放大。',
 ll_miss:'爱语言存在错位。双方都在努力，但货币不对——这可能是你感到付出未被领会的根源，而不是感情本身的问题。',
 at_anx:'你的焦虑型依恋意味着负面信号的注册权重比安全型高约50%。K线并未失真——是你的灵敏度本身被调高了。',
 at_avo:'你的回避型依恋会压制所有信号的强度，正面和负面事件都只以实际权重的60%被处理。这段关系可能比你内部读数更健康。',
 at_fea:'恐惧型依恋制造了极端的信号不对称：正面事件几乎无感，负面事件被放大近两倍。这是已知的市场扭曲——资产基本面可能好于K线显示。',
 at_sec:'安全型依恋基准意味着数据被干净地处理——你所看到的接近实际情况。',
 sl_l5:'\n\nLayer 5激活：{n}这些是市场条件，不是个人失败。',
 pl_mkt:'\n\n预测市场：做多{l}币，做空{s}币。',pl_mktlong:'外部观察者整体看多。',pl_mktshort:'外部观察者偏向做空，请注意旁观者可能看到的信号。',
 vt_liq:'综合指数已突破临界阈值。{s}/100的评分配合{v}%的波动率，这个仓位已无法通过等待或增加投入来修复。硬性止损触发器已激活。数据明确：继续持有不是忠诚，是未能执行自己风险管理协议的系统性失败。\n\n行动建议：执行全仓平仓。将你的情感资本——时间、精力、未来——重新配置到不需要你绕过自身保护机制才能持有的资产上。',
 vt_red:'指数读数{s}/100——并非崩溃，但趋势方向错误。{v}%的波动率意味着你在为一个贬值中的仓位支付高昂的每日持仓成本。\n\n{ll}\n\n{an}\n\n行动建议：开始有意识地减少情感投入。设立90天观察窗口，定义2-3个具体的行为信号来判断真正的趋势反转。若信号未出现，升级至全仓平仓。',
 vt_hold:'指数{s}/100，处于盘整区间。这不是牛市，但也不是结构性崩溃。基本面——PE {pe}，CF {cf}——提供了可信的支撑底部。\n\n{ll}\n\n{an}\n\n行动建议：主动管理式持有。识别具体条件来触发从横盘到上涨的转变。调整沟通频率、重置共同目标、确保双方价值流动比例对等。',
 vt_buy:'指数{s}/100——这是一个需要多年才能找到的高质量资产。PE {pe}和CF {cf}反映的是真实的结构性匹配，不是表面兼容性。{v}%的波动率处于可控范围内。\n\n{ll}\n\n{an}\n\n复利型关系：每次真诚的互动叠加在上一次之上，产生加速而非停滞的回报。数据支持加仓。\n\n行动建议：明确你的长期论点。定义共同路径——财务目标、人生节点、价值观对齐。',
 sn_lgbtq:'法律与社会风险溢价已加载。',sn_wlw:'WLW隐形与抹除因子激活。',sn_trans:'跨性别系统性风险已提升。',
 sn_closet:'未出柜张力作为背景压力。',sn_labor:'性别化劳动负担已纳入计算。',sn_hostile:'敌对环境：安全本身是市场条件。',sn_marry:'时间线压力扭曲理性决策。'
};
I18N.en={
 lab_me:'Me',lab_them:'Them',lab_even:'Even',own_you:'you',
 verdict_liq:'Liquidate now — stop-loss triggered',verdict_red:'Reduce, protect remaining capital',verdict_hold:'Hold, watch closely',verdict_buy:'High-conviction position',
 phase_crash:'Crash',phase_bear:'Bear',phase_range:'Range',phase_bull:'Bull',
 sig:'SIGNAL',score_pe:'PARITY PE',score_cf:'FIN SYNC CF',score_vol:'VOLATILITY',
 bd_title:'SCORE BREAKDOWN',bd_base:'Fundamentals',bd_pos:'Positive events',bd_neg:'Negative events',bd_hard:'Hard stop triggered',
 bd_soft:'Soft risk factors',bd_macro:'Macro environment',bd_labor:'Emotional labor drain',bd_laborpen:'Labor imbalance',bd_gap:'Stability gap',bd_total:'INDEX',
 rpt_title:'ANALYST REPORT',rpt_empty_t:'No report yet',rpt_empty_s:'Your report will appear here after assessment',kline_title:'RELATIONSHIP CHART',kline_cap:'Generated from your event timeline · not market price',
 disclaim:'⚠ This tool offers a risk assessment, not absolute truth. All open/close actions must be executed by you in real life.',
 back_dt:'← Back to detail to open a position',
 f_hardstop:'Hard stop-loss triggered',
 cri_hd:'🔴 HIGH-RISK SIGNAL DETECTED',
 cri_body:'This is not a "relationship problem". This is harm.<br>Scoring has no meaning here — no matter how good the other indicators look.<br><br>Any framing that turns this into "he just has a temper" or "I played a part too" does not hold.',
 cri_help:'If you need help:<br><b>Find your local domestic violence hotline</b><br><b>In an emergency, call your local emergency number</b><br><br>If being seen looking at this could put you at risk, remember to clear your history.',
 cri_note:'⚠ No score was generated. Where physical safety is at risk, any form of quantified trade-off is inappropriate.',
 ctl_hd:'⚠️ CONTROLLING BEHAVIOR DETECTED',
 ctl_body:'These patterns are gradual, and they often arrive disguised as care — which is why they are hard to name in the moment.<br><br>What they share: the range of things you can freely decide keeps shrinking — money, friendships, movement, trust in your own judgment.<br><br>The score below has been capped, because in this kind of structure other indicators tell you little.',f_volhi:'High volatility · easily moved by small capital',f_volmid:'Moderate volatility',f_vollo:'Low volatility · resists manipulation',
 f_negroi:'Negative-ROI behavior pattern',f_llmatch:'Love languages aligned',f_llmiss:'Love language mismatch',f_pe:'Strong cognitive compatibility',
 f_struct:'Structural risk premium active',f_gap:'Stability gap {n} · caretaker structure',f_labor:'Labor imbalance {n}%',f_laborsk:'Labor skew {n}%',
 f_mktlong:'Sentiment: longs lead',f_mktshort:'Sentiment: shorts lead',
 l5:'⬡ LAYER 5 ACTIVE — ',l5def:'Structural risk premium loaded.',
 lab_card:'EMOTIONAL LABOR',lab_me_n:'Me {n}',lab_even_n:'Even {n}',lab_them_n:'Them {n}',lab_even_note:'{n} more shared evenly',
 lab_heavy:'Mostly you: ',lab_light:'Mostly them: ',
 lab_warn:'Imbalance {n}% — this is not a feeling, it is what the checklist says. One-directional emotional labor becomes invisible to both people and rarely enters the ledger.',
 lab_answered:'EMOTIONAL LABOR · {n}/26 answered',
 gap_title:'⚠ EMOTIONAL STABILITY GAP',gap_a:'Side A',gap_b:'Side B',gap_d:'Gap',
 gap_text:'This configuration tends to harden into a caretaker/cared-for structure: the stable one keeps absorbing emotional labor while the unstable one loses the incentive to self-regulate. The caretaker’s work gets taken for granted because "they are just naturally fine", and rarely enters the ledger.',
 gap_both:'🔺 Double signal: stability gap {g} plus labor imbalance {s}%. This combination matters more than either alone — it describes an already-hardened one-way supply structure.',
 stab_combined:'Combined stability',stab_gap_ok:'Gap {n} · in sync',stab_gap_near:'Gap {n} · fairly close',
 stab_gap_warn:'Gap {n} · approaching the line',stab_gap_bad:'⚠ Gap {n} · caretaker structure risk',
 stab_gap_bad2:'The stable one will keep carrying the emotional labor, and it will be taken for granted.',
 pos_probe:'Probe — keeping distance, can exit anytime',pos_light:'Light — invested, but life centers elsewhere',
 pos_half:'Half — taking it seriously while keeping yourself',pos_heavy:'Heavy — this relationship is the axis of your life',
 pos_full:'Full — everything is in, no exit left',
 hold_title:'POSITION RECORD',hold_days:'Held <b style="color:var(--g)">{d}</b> days · added <b>{a}</b>× · cut <b style="color:{cc}">{c}</b>×',
 hold_lastadd:'Last add: ',hold_never:'never added',hold_daysago:'{n} days ago',hold_realized:'Realized P&L: ',
 hold_cutwarn:'You have cut {n} times now. Steadily reducing investment is usually not a decision — it is a process already underway.',
 div_title:'⚠️ <b>DIVERGENCE</b>',div_hi_no:'Your position is {p}%, yet you judge this will not last a year.',div_hi_no2:'You know the answer. You have not left.',
 div_hi_maybe:'Heavy at {p}%, but unsure about a year from now.',div_hi_maybe2:'High investment with low conviction is the most draining structure there is.',
 div_lo_yes:'Only {p}% invested, yet you believe this will last.',div_lo_yes2:'Could be self-protection — or you are already withdrawing without admitting it.',
 ins_title:'👑 INSIDER SIGNALS · PUBLIC DISCLOSURE',ins_add:'Insider added +{n}%',ins_cut:'Insider cut −{n}%',ins_price:'price ',
 ins_foot:'Insider position changes move the market price directly — they know more than any observer.',
 rec_title:'MY PREDICTION RECORD',rec_settled:'Settled',rec_acc:'Accuracy',rec_tilt:'Tilt',
 rec_short:'Short',rec_long:'Long',rec_even:'Even',
 rec_detail:'{r} correct · {w} wrong · {l} long / {s} short',
 q_high:'HIGH WEIGHT · 60%',q_mid:'MID WEIGHT · 30%',q_low:'LOW WEIGHT · 10%',
 q_next:'Next →',q_result:'See result →',
 qr_high:'High weight (Q1-Q10)',qr_mid:'Mid weight (Q11-Q16)',qr_low:'Low weight (Q17-Q19)',qr_acc:'Overall accuracy',
 who_a:'{n} — I know them better',who_b:'{n} — I know them better',
 earn_hint:'Each role can claim coins only once per relationship',earn_hint_n:'{n} role(s) claimed here · one claim per role',
 pf_sub:'{n} relationships · {m} assessed · 🪙 {c}',pf_empty_t:'No positions',pf_empty_s:'Create your first position<br>and give it a ticker',
 rc_pending:'Not assessed',rc_closed:'Closed',rc_open:'Holding',rc_none:'Not opened',rc_pos:'{n}% position',rc_bets:'{n} bets',
 dt_notassessed:'Not assessed — go to the Analyst tab',dt_closed:'● Closed · position cleared',
 dt_cost:'entry ',dt_val:'value ',
 roi_settled:'Settled',roi_notopen:'Not open',roi_waiting:'Pre-market',
 cap_closed:'Position liquidated · index at zero',cap_market:'Market price · driven by prediction trades',cap_val:'Valuation trend · no trades yet',
 pred_none:'No predictions yet — share your ticker',pl_empty:'No positions yet — be the first',pl_ops:'{n} ops · {a}🪙 total',pl_ops2:'{n} ops · {a} 🪙 committed',
 pl_net_long:'Net long',pl_net_short:'Net short',pl_op:'Op {n}',pl_rev:'⚠️ Position reversed',
 pl_right:'✓ Correct +{n}',pl_wrong:'✗ Wrong',
 mkt_people:'{p} people · {o} ops',sum_long:'{n} long',sum_short:'{n} short',sum_locked:'🔒 Who went long, who went short, and how well each knows you — unlock to see',
 btn_assess:'Go assess →',btn_reassess_new:'Reassess to start a new round →',btn_open_at:'Open @{n}',btn_reassess:'Reassess',
 btn_add:'Add',btn_add_full:'Add (full)',btn_cut:'Cut',btn_close_pos:'Close ({n}% position)',
 pu_text:'This relationship predates the position feature. The current <b id="pu-cur">{n}</b>% is a system default, not your choice. Please set your actual level of investment.',
 max_add:'up to +{n}%',max_cut:'up to −{n}%',cut_zero:'⚠ Cutting to 0% equals closing. The market will shut and all bets settle.',
 an1:'Layer 1: calibrating profile...',an2:'Applying love-language coefficient...',an3:'Attachment amplifier engaged...',an4:'Layer 2: scoring event impact...',
 an5:'Layer 3: decay and repair coefficients...',an6:'Layer 4: macro factors loaded...',an7:'Layer 5: structural risk profile...',
 an8:'Reading prediction market sentiment...',an9:'Generating chart from event timeline...',an10:'Compiling report...',
 ts_created:'Created ${n}',ts_switched:'Switched to ${n}',ts_joined:'Joined ${n}',
 ts_opened:'Opened · {p}% position @ {e}',ts_added:'Added +{a}% · position {p}% · entry {e}',
 ts_cut:'Cut −{a}% · position {p}%',ts_cutn:'Cut −{a}% · that is {n} times now',
 ts_zero:'Position cleared · treated as closed',ts_closed:'Closed · market settled',ts_calib:'Position calibrated to {n}%',
 ts_bet_long:'Long {n} coins recorded',ts_bet_short:'Short {n} coins recorded',
 ts_pickrel:'Create or select a relationship first',ts_needname:'Enter a relationship name',ts_needab:'Fill in both names',
 ts_badticker:'Ticker must be 2-6 letters or digits',ts_dupticker:'That ticker exists, pick another',ts_needticker:'Enter a ticker',
 ts_needassess:'Run the assessment first',ts_isopen:'Already holding',ts_noopen:'No open position',
 ts_full:'Already at full position',ts_nopos:'No position left to cut',ts_closedmkt:'This relationship is closed, market shut',
 ts_needrole:'Pick your role in "Earn coins" first',ts_earned:'This role already claimed coins here',
 ts_needamt:'Choose an amount',ts_needevent:'Select at least one event or write a description',
 ts_copied:'Link copied',ts_copiedcode:'Ticker copied',ts_nocopy:'Nothing to copy',ts_manualcopy:'Long-press the link above to copy',
 ts_reset:'All data cleared',ts_selectrel:'Select a relationship first',ts_selectrel2:'Select a relationship first',
 ts_assessdone:'Assessment done · open a position on the detail tab',reassess_hint:'Your last assessment ({d}) has been restored. Just change what is different.',ts_createfirst:'Create a relationship first',
 confirm_reset:'This clears all relationships, positions and coins. It cannot be undone. Continue?',confirm_del:'Delete {n}? Its assessment, position and all predictions will be gone for good.',ts_deleted:'Deleted',
 self_role:'Insider (you)',anon_parent:'Parent / elder',anon_sibling:'Sibling',anon_bestfriend:'Best friend',
 anon_friend:'Friend',anon_acquaintance:'Acquaintance',anon_third:'Mystery third party 😈',anon_default:'Anonymous',
 share_local:'⚠ This is a local preview — a shareable link cannot be generated here.',
 share_local2:'Deploy the file online (e.g. Netlify) and open this page from the real URL to generate a link.',
 share_local3:'For now, send your friends the ticker <b style="color:var(--go)">${n}</b> and have them use "Enter a ticker".',
 share_copy:'Copy invite link',share_copycode:'Copy ticker',
 share_note:'💡 If the other person is also in the relationship, have them open this link and pick their role under "Earn coins".',
 share_note2:'Note: in this version data lives on each device, so bets do not sync between you. That needs a backend.',
 rel_sub:'Choose your role in "{n}"',
 lock_hint:'🔒 Open a position first to lock in your own view, then invite others',lock_answers:'🔒 Fill in the answer key first — otherwise friends cannot be scored',
 ph_5:'5% probe',ph_100:'100% full',ph_bal:'{n}% of balance',
 owner_only:'Only the person in the relationship can manage the position',obs_banner:'👀 You are observing <b>{n}</b> — you can predict, but not manage the position',
 obs_tag:'Observing',mine_tag:'Mine',grp_mine:'MY POSITIONS',grp_obs:'OBSERVING',btn_predict:'Go to market →',
 pf_none:'No positions yet',side_a:'Side A',side_b:'Side B',shared_from:'shared',hold_curpos:'Current position',dt_tkpos:'  ·  {n}% position',bet_long_t:'📈 Long',bet_short_t:'📉 Short',
 bet_long_s:'Bullish — you lose your stake if it ends',bet_short_s:'Bearish — you profit if it ends',
 bar_long:'Long {n}%',bar_short:'Short {n}%',qr_role_fb:'Participant',
 ll_match:'Love languages are aligned — both express love in a currency the other can actually receive, so every interaction compounds.',
 ll_miss:'Love languages are mismatched. Both of you are trying, but in the wrong currency — this may be why your effort feels unseen, rather than a problem with the relationship itself.',
 at_anx:'Anxious attachment registers negative signals roughly 50% heavier than secure. The chart is not distorted — your sensitivity is turned up.',
 at_avo:'Avoidant attachment dampens all signals; positive and negative events both register at about 60% of actual weight. This relationship may be healthier than your internal reading.',
 at_fea:'Fearful attachment creates extreme asymmetry: positive events barely register, negative ones amplify nearly twofold. This is a known distortion — the fundamentals may be better than the chart shows.',
 at_sec:'Secure attachment baseline means the data processes cleanly — what you see is close to what is there.',
 sl_l5:'\n\nLayer 5 active: {n}These are market conditions, not personal failures.',
 pl_mkt:'\n\nPrediction market: {l} long, {s} short.',pl_mktlong:'Outside observers lean bullish.',pl_mktshort:'Outside observers lean bearish — note what they may be seeing that you are not.',
 vt_liq:'The index has broken its critical threshold. A score of {s}/100 with {v}% volatility puts this position beyond repair by waiting or investing more. Hard stop-loss triggers are active. The data is unambiguous: continuing to hold is not loyalty, it is a systematic failure to execute your own risk protocol.\n\nAction: liquidate fully. Reallocate your emotional capital — time, energy, future — into an asset that does not require you to bypass your own protective mechanisms.',
 vt_red:'The index reads {s}/100 — not a collapse, but the trend is wrong. {v}% volatility means you are paying a steep daily carrying cost on a depreciating position.\n\n{ll}\n\n{an}\n\nAction: begin deliberately reducing emotional investment. Set a 90-day observation window and define 2-3 concrete behavioral signals that would mark a genuine reversal. If they do not appear, escalate to full liquidation.',
 vt_hold:'Index {s}/100, in a consolidation range. Not a bull market, but not a structural collapse either. The fundamentals — PE {pe}, CF {cf} — provide a credible support floor.\n\n{ll}\n\n{an}\n\nAction: hold, but actively. Identify the specific conditions that would trigger a shift from sideways to upward. Adjust contact frequency, reset shared goals, ensure value flows in both directions at comparable rates.',
 vt_buy:'Index {s}/100 — this is a quality asset that takes years to find. PE {pe} and CF {cf} reflect genuine structural fit, not surface compatibility. Volatility at {v}% is within manageable range.\n\n{ll}\n\n{an}\n\nCompounding relationships work like quality growth stocks: each honest interaction stacks on the last, producing accelerating rather than stagnant returns. The data supports adding.\n\nAction: define your long thesis. Map the shared path — financial goals, life milestones, value alignment.',
 sn_lgbtq:'Legal and social risk premium loaded.',sn_wlw:'WLW invisibility and erasure factors active.',sn_trans:'Trans systemic risk elevated.',
 sn_closet:'Closeting tension as background pressure.',sn_labor:'Gendered labor burden factored in.',sn_hostile:'Hostile environment: safety itself is a market condition.',sn_marry:'Timeline pressure distorts rational decisions.'
};


/* ═══ STATE & STORAGE ═══ */
var DB={coins:0,rels:[],active:null};
function save(){
  if(BACKEND_READY) return;              // 后端模式下由各操作直接写库
  try{localStorage.setItem('lovetrade_v2',JSON.stringify(DB))}catch(e){}
}
/* 从数据库重新拉取全部关系 */
async function syncAll(){
  if(!BACKEND_READY) return;
  try{
    var rels = await apiMyRels();
    var coins = await apiMyCoins();
    var prof  = await apiMyProfile();
    for(var i=0;i<rels.length;i++){
      rels[i].earned = await apiEarnedRoles(rels[i].id);
    }
    DB.rels = rels;
    DB.coins = coins;
    DB.record = prof ? {total:prof.total,right:prof.correct,correct:prof.correct,
                        wrong:prof.wrong,longs:prof.longs,shorts:prof.shorts} : null;
    if(DB.active && !cur()) DB.active = rels.length?rels[0].id:null;
  }catch(e){ console.warn('sync failed',e) }
}
/* 只刷新当前这一段关系 */
async function syncOne(relId){
  if(!BACKEND_READY) return;
  try{
    var fresh = await apiRefreshRel(relId);
    if(!fresh) return;
    fresh.earned = await apiEarnedRoles(relId);
    for(var i=0;i<DB.rels.length;i++){
      if(DB.rels[i].id===relId){ DB.rels[i]=fresh; break }
    }
    DB.coins = await apiMyCoins();
  }catch(e){ console.warn('syncOne failed',e) }
}
function load(){
  try{var d=localStorage.getItem('lovetrade_v2');if(d)DB=JSON.parse(d)}catch(e){}
  migrate();
}
/* 旧数据迁移：补齐仓位相关字段，避免 NaN */
function hardReset(){
  if(!confirm(t('confirm_reset')))return;
  try{localStorage.removeItem('lovetrade_v2')}catch(e){}
  DB={coins:0,rels:[],active:null};
  save();renderPF();goTab('pf');tst(t('ts_reset'));
}
/* 顶部后端状态提示 */
function setNetBadge(){
  var el=document.getElementById('net-badge');
  if(!el) return;
  if(BACKEND_READY){ el.textContent='\u25CF SYNC'; el.style.color='var(--g)'; el.title='已连接云端'; }
  else { el.textContent='\u25CF LOCAL'; el.style.color='var(--y)'; el.title='本地模式：'+(BACKEND_ERR||'未连接'); }
}
function migrate(){
  if(!DB.rels)DB.rels=[];
  if(typeof DB.coins!=='number'||isNaN(DB.coins))DB.coins=0;
  for(var i=0;i<DB.rels.length;i++){
    var r=DB.rels[i];
    if(!r.positions)r.positions=[];
    if(!r.earned)r.earned={};
    // 清理下注记录
    for(var p=0;p<r.positions.length;p++){
      var P=r.positions[p];
      if(typeof P.amount!=='number'||isNaN(P.amount))P.amount=0;
      if(!P.ts)P.ts=r.created||Date.now();
      delete P.weight; delete P.isSelf;
      if(P.role==='self')P.role='friend';
    }
    if(r.status==='open'){
      if(typeof r.entryPrice!=='number'||isNaN(r.entryPrice))r.entryPrice=r.result?r.result.score:50;
      if(typeof r.position!=='number'||isNaN(r.position)){r.position=50;r.posUnset=true}
      if(typeof r.realized!=='number'||isNaN(r.realized))r.realized=0;
      if(!r.entryTime)r.entryTime=r.created||Date.now();
      if(!r.lots||!r.lots.length)r.lots=[{price:r.entryPrice,ts:r.entryTime,type:'open',size:r.position}];
    }
    // 补齐每笔 lot
    if(r.lots)for(var L=0;L<r.lots.length;L++){
      var lt=r.lots[L];
      if(typeof lt.size!=='number'||isNaN(lt.size))lt.size=10;
      if(typeof lt.price!=='number'||isNaN(lt.price))lt.price=r.entryPrice||50;
      if(!lt.ts)lt.ts=r.created||Date.now();
    }
  }
  if(DB.record){
    var R=DB.record;
    ['total','right','wrong','longs','shorts'].forEach(function(k){if(typeof R[k]!=='number'||isNaN(R[k]))R[k]=0});
  }
  save();
}
function cur(){for(var i=0;i<DB.rels.length;i++)if(DB.rels[i].id===DB.active)return DB.rels[i];return null}
function uid(){return 'r'+Date.now().toString(36)+Math.random().toString(36).slice(2,6)}
function genTicker(){var c='ABCDEFGHJKLMNPQRSTUVWXYZ23456789',s='';for(var i=0;i<4;i++)s+=c[Math.floor(Math.random()*c.length)];return s}

var SESS={rel:null,who:null,qIdx:0,qSel:null,qSc:{high:0,highMax:0,mid:0,midMax:0,low:0,lowMax:0},betType:'long',pct:1,amt:0};

var ROLES=[
 {role:'parent',base:800,emoji:'👨‍👩‍👧',label:['父母/长辈','Parent / elder'],note:['最高 800 币','up to 800']},
 {role:'sibling',base:700,emoji:'👫',label:['兄弟姐妹/亲属','Sibling / relative'],note:['最高 700 币','up to 700']},
 {role:'bestfriend',base:600,emoji:'🫂',label:['闺蜜/死党','Best friend'],note:['最高 600 币','up to 600']},
 {role:'friend',base:400,emoji:'👋',label:['普通朋友','Friend'],note:['最高 400 币','up to 400']},
 {role:'acquaintance',base:200,emoji:'🧑‍💼',label:['点头之交/路人','Acquaintance'],note:['最高 200 币','up to 200']},
 {role:'third',base:300,emoji:'😈',label:['第三者（恶意做空专用）','The other person (for spite-shorting)'],note:['最高 300 币','up to 300'],danger:true}
];
var RLM={self:['当事人 👑','Insider 👑'],parent:['父母/长辈','Parent / elder'],sibling:['兄弟姐妹','Sibling'],bestfriend:['闺蜜/死党','Best friend'],friend:['普通朋友','Friend'],acquaintance:['路人甲','Acquaintance'],third:['第三者 😈','The other person 😈']};
var RL=new Proxy({},{get:function(o,k){return RLM[k]?p(RLM[k]):undefined}});

var QS=[
{w:'high',q:['{X}在亲密关系里最典型的依恋模式是？',"What is {X}'s typical attachment style?"],sub:['根据你对ta的了解判断','Based on what you know about them'],opts:[['安全型 — 稳定、信任、能良好处理分离','Secure — stable, trusting, handles separation well'],['焦虑型 — 害怕被抛弃、需要频繁确认','Anxious — fears abandonment, needs reassurance'],['回避型 — 情感钝感、倾向于保持距离','Avoidant — emotionally distant, keeps space'],['恐惧型 — 既渴望亲密又害怕受伤','Fearful — craves closeness but fears being hurt']],qo:['你在亲密关系里最典型的依恋模式是？',"What is your typical attachment style?"],subo:['选择最贴近你自己的描述',"Pick what fits you best"]},
{w:'high',q:['{X}的原生家庭留下的最主要影响是？',"What did {X}'s family of origin leave them with?"],sub:['选择最接近实际情况的答案','Pick what is closest to reality'],opts:[['情感忽视 — 父母在情感上不在场','Emotional neglect — parents absent emotionally'],['高压控制 — 习惯了被管控或反抗管控','Control — used to being managed, or resisting it'],['冲突环境 — 见证过激烈的家庭矛盾','Conflict — witnessed intense family fighting'],['相对健康 — 没有明显的家庭创伤','Relatively healthy — no obvious family trauma']],qo:['你的原生家庭留下的最主要影响是？',"What did your family of origin leave you with?"],subo:['选择最接近实际情况的答案',"Pick what is closest to reality"]},
{w:'high',q:['在这段感情里，{X}最渴望得到的是？','In this relationship, what does {X} most want?'],sub:['选择最能描述核心需求的选项','Pick the option closest to their core need'],opts:[['被深度理解，不需要解释自己','To be deeply understood without explaining themselves'],['稳定的安全感，知道对方不会离开','Security — knowing the other will not leave'],['持续的激情与新鲜感','Ongoing passion and novelty'],['有人陪着一起成长和进步','Someone to grow alongside'],['伴侣作为某种需求的满足来源——情感支撑、经济依托、社交需要或其他','A partner as a source of need-fulfillment — emotional support, financial security, social standing or otherwise']],qo:['在这段感情里，你最渴望得到的是？',"In this relationship, what do you most want?"],subo:['选择最能描述你核心需求的选项',"Pick what is closest to your core need"]},
{w:'high',q:['{X}对亲密关系最深的恐惧是？',"What is {X}'s deepest fear about intimacy?"],sub:['选择最能描述内心恐惧的选项','Pick what best describes their inner fear'],opts:[['被抛弃或被替代','Being abandoned or replaced'],['在关系里失去自我','Losing themselves in the relationship'],['被控制或窒息','Being controlled or suffocated'],['付出了却得不到对等的回应','Giving without getting anything back']],qo:['你对亲密关系最深的恐惧是？',"What is your deepest fear about intimacy?"],subo:['选择最能描述你内心恐惧的选项',"Pick what best describes your inner fear"]},
{w:'high',q:['亲密关系在{X}生活里的位置是？',"Where does intimacy rank in {X}'s life?"],sub:['根据平时的状态和行为判断','Based on their usual behavior'],opts:[['排第一，是生活的核心','First — the center of their life'],['很重要，但不是唯一','Important, but not everything'],['事业/个人目标优先，感情是加分项','Career first; love is a bonus'],['习惯独立，不太依赖亲密关系','Independent, not reliant on relationships']],qo:['亲密关系在你生活里的位置是？',"Where does intimacy rank in your life?"],subo:['诚实评估它的优先级',"Be honest about the priority"]},
{w:'high',q:['在感情里，{X}通常是哪种角色？','What role does {X} usually play?'],sub:['观察在关系中的行为模式','Observe their pattern in the relationship'],opts:[['付出更多的那个，容易委屈自己','The one who gives more, often at their own cost'],['接受更多的那个，有时候不自知','The one who receives more, sometimes unaware'],['比较平衡，能清楚表达需求','Balanced, communicates needs clearly'],['忽冷忽热，状态不稳定','Hot and cold, inconsistent']],qo:['在感情里，你通常是哪种角色？',"What role do you usually play?"],subo:['回想你在这段关系里的行为模式',"Recall your pattern in this relationship"]},
{w:'high',q:['{X}在情绪低谷时，最需要对方做什么？','When {X} is low, what do they need most?'],sub:['回想遇到困难时的反应','Recall how they react to hard times'],opts:[['主动靠近，给予安慰和拥抱','Closeness — comfort and reassurance'],['给空间，独处消化','Space to process alone'],['帮忙解决问题，给出实际建议','Practical help and concrete advice'],['什么都不用做，只要在就好','Nothing — just be there']],qo:['你在情绪低谷时，最需要对方做什么？',"When you are low, what do you need most?"],subo:['想想你真正需要的是什么',"Think about what you actually need"]},
{w:'high',q:['以下哪一项最接近{X}在感情里的绝对底线？',"Which is closest to {X}'s absolute dealbreaker?"],sub:['最可能导致提出分手的情况','What would most likely end it for them'],opts:[['任何形式的欺骗或隐瞒','Any form of deceit or concealment'],['情感冷漠或长期被忽视','Emotional coldness or chronic neglect'],['被限制自由或过度控制','Restricted freedom or excessive control'],['在外人面前被贬低或不被维护','Being belittled or unsupported in public']],qo:['以下哪一项最接近你在感情里的绝对底线？',"Which is closest to your absolute dealbreaker?"],subo:['什么情况会让你提出分手',"What would make you end it"]},
{w:'high',q:['从过去的感情经历看，{X}倾向于？','Based on past relationships, {X} tends to?'],sub:['根据过往经历判断','Based on their history'],opts:[['投入很深，分手后很难走出来','Invests deeply, struggles to move on'],['理性断舍离，能相对快速恢复','Cuts clean, recovers relatively fast'],['反复拉锯，容易与前任藕断丝连','Back and forth, lingering ties with exes'],['很少认真谈感情，这次比较特别','Rarely serious about love; this one is different']],qo:['从你过去的感情经历看，你倾向于？',"Based on your past relationships, you tend to?"],subo:['根据你的过往判断',"Based on your own history"]},
{w:'high',q:['你观察到{X}在这段感情里的真实状态是？',"What is {X}'s real state in this relationship?"],sub:['抛开嘴上说的，说说你真实观察到的','Set aside what they say — what do you observe'],opts:[['比以前更好了，明显更快乐','Better than before, visibly happier'],['差不多，没什么变化','About the same'],['有些消耗，但本人说没事','Somewhat drained, though they say it is fine'],['明显变差了，但还在坚持','Clearly worse, but still holding on']],qo:['你在这段感情里的真实状态是？',"What is your real state in this relationship?"],subo:['诚实一点，这份答案不会给任何人看',"Be honest — nobody else sees this"],opo:[['比以前更好了，明显更快乐','Better than before, visibly happier'],['差不多，没什么变化','About the same'],['有些消耗，但我对外说没事','Somewhat drained, though I tell others it is fine'],['明显变差了，但我还在坚持','Clearly worse, but I am still holding on']]},
{w:'mid',q:['你观察到他们最常见的冲突模式是？','What is their most common conflict pattern?'],sub:['根据你亲眼见过或听说的情况','Based on what you have seen or heard'],opts:[['一方追着沟通，另一方回避逃跑','One pursues, the other withdraws'],['两个人都会爆发，但冷静后能和好','Both blow up, then reconcile'],['表面平静，但有明显的冷战和隔阂','Calm on the surface, cold war underneath'],['几乎很少正面冲突','Almost never fight openly']],qo:['你们最常见的冲突模式是？',"What is your most common conflict pattern?"],subo:['回想最近几次争吵',"Recall your recent arguments"]},
{w:'mid',q:['谁更多地在维系这段关系的运转？','Who does more to keep this relationship running?'],sub:['谁在更多地主动沟通、照顾和推进','Who initiates, cares and pushes things forward'],opts:[['{A}明显付出更多','{A} clearly gives more'],['{B}明显付出更多','{B} clearly gives more'],['比较平衡','Fairly balanced'],['很难判断，他们不太展示','Hard to tell, they do not show much']],qo:['谁更多地在维系这段关系的运转？',"Who does more to keep this relationship running?"],subo:['谁在更多地主动沟通、照顾和推进',"Who initiates, cares and pushes things forward"],opo:[['{A}明显付出更多','{A} clearly gives more'],['{B}明显付出更多','{B} clearly gives more'],['比较平衡','Fairly balanced'],['说不好，我也没细想过','Hard to say, I have not really thought about it']]},
{w:'mid',q:['他们有没有讨论过共同的未来？','Have they discussed a shared future?'],sub:['比如同居、结婚、定居城市等','Living together, marriage, where to settle'],opts:[['有明确规划，且有具体行动','Concrete plans with real steps taken'],['聊过但很模糊，没有具体行动','Talked about it vaguely, no action'],['没有聊过，或一方回避这个话题','Never discussed, or one avoids it'],['不清楚','Not sure']],qo:['你们有没有讨论过共同的未来？',"Have you discussed a shared future?"],subo:['比如同居、结婚、定居城市等',"Living together, marriage, where to settle"],opo:[['有明确规划，且有具体行动','Concrete plans with real steps taken'],['聊过但很模糊，没有具体行动','Talked about it vaguely, no action'],['没有聊过，或一方回避这个话题','Never discussed, or one of us avoids it'],['刻意没去想这件事','We deliberately avoid thinking about it']]},
{w:'mid',q:['面对家庭或外部压力时，他们会？','Facing family or external pressure, they?'],sub:['比如父母反对、工作压力、经济困难','Parental disapproval, work stress, money trouble'],opts:[['站在彼此这边，一起应对','Stand together and handle it as a team'],['各自应付各自的，没有明显协同','Deal with it separately, little coordination'],['有时因外部压力内部产生裂缝','External pressure sometimes cracks them internally'],['不清楚，没见过他们处理这类情况','Not sure, never seen them handle this']],qo:['面对家庭或外部压力时，你们会？',"Facing family or external pressure, you two?"],subo:['比如父母反对、工作压力、经济困难',"Parental disapproval, work stress, money trouble"],opo:[['站在彼此这边，一起应对','We stand together and handle it as a team'],['各自应付各自的，没有明显协同','We deal with it separately, little coordination'],['有时因外部压力内部产生裂缝','External pressure sometimes cracks us internally'],['还没真正遇到过这种情况','We have not really faced this yet']]},
{w:'mid',q:['自从在一起，{X}的整体状态？','Since getting together, how is {X} overall?'],sub:['综合情绪、精力、生活状态来看','Considering mood, energy and daily life'],opts:[['变好了，更有活力和安全感','Better — more energy and security'],['没什么变化','No real change'],['有些消耗，但偶尔也有好的状态','Somewhat drained, with good stretches'],['明显变差了，但还在坚持','Clearly worse, but still holding on']],qo:['自从在一起，你的整体状态？',"Since getting together, how are you overall?"],subo:['综合情绪、精力、生活状态来看',"Considering mood, energy and daily life"]},
{w:'mid',q:['在你看来，他们在一起的核心驱动是？','What really holds them together?'],sub:['剥开表面，最根本的原因','Beneath the surface, the root reason'],opts:[['真实的情感连接和价值观匹配','Real connection and shared values'],['习惯和惰性，分开成本太高','Habit and inertia — leaving costs too much'],['相互需要，但不一定是真正的爱','Mutual need, not necessarily love'],['其中一方比另一方投入多很多','One is far more invested than the other']],qo:['在你看来，你们在一起的核心驱动是？',"What really holds you two together?"],subo:['剥开表面，最根本的原因',"Beneath the surface, the root reason"]},
{w:'low',q:['他们是怎么认识的？','How did they meet?'],sub:['选择最接近实际情况的答案','Pick what is closest to reality'],opts:[['通过朋友介绍','Through friends'],['在学校或工作中认识','At school or work'],['通过社交软件或约会平台','Dating app or social media'],['在某个活动或特定场合偶遇','At an event or by chance']],qo:['你们是怎么认识的？',"How did you two meet?"],subo:['选择最接近实际情况的答案',"Pick what is closest to reality"]},
{w:'low',q:['他们在一起多久了？','How long have they been together?'],sub:['根据你的了解估计','Your best estimate'],opts:[['不到6个月','Under 6 months'],['6个月到1年','6 months to 1 year'],['1到3年','1 to 3 years'],['3年以上','Over 3 years']],qo:['你们在一起多久了？',"How long have you been together?"],subo:['根据实际情况',"Actual duration"]},
{w:'low',q:['你认为五年后他们还会在一起吗？','Will they still be together in five years?'],sub:['这也是你进入预测市场前的最后一题','Your last question before entering the market'],opts:[['会，我觉得他们能走到最后','Yes — I think they will go the distance'],['可能会，但有变数','Maybe, but it could go either way'],['不太可能，问题比较根本','Unlikely — the problems run deep'],['肯定不会，我非常确定','Definitely not — I am certain']],qo:['你认为五年后你们还会在一起吗？',"Will you still be together in five years?"],subo:['这份答案只有你自己知道',"Only you will see this answer"]}
];
var WS={high:10,mid:6,low:2};

/* ═══ UTIL ═══ */
function $(id){return document.getElementById(id)}
function tst(m){var t=document.createElement('div');t.className='tst';t.textContent=m;document.body.appendChild(t);setTimeout(function(){t.style.opacity='0';setTimeout(function(){t.remove()},300)},2200)}
function openMo(id){$('mo-'+id).classList.add('show')}
function closeMo(id){$('mo-'+id).classList.remove('show')}
function tc(el){el.classList.toggle('on')}
(function tick(){var n=new Date();$('clk').textContent=String(n.getHours()).padStart(2,'0')+':'+String(n.getMinutes()).padStart(2,'0');setTimeout(tick,10000)})();
var mos=document.querySelectorAll('.mo');for(var i=0;i<mos.length;i++)mos[i].addEventListener('click',function(e){if(e.target===this)this.classList.remove('show')});

function goTab(t){
  if((t==='dt'||t==='an'||t==='pd')&&!cur()){tst(window.t('ts_pickrel'));t='pf'}
  if(t==='an'&&cur()&&cur().joined){tst(window.t('owner_only'));t='pd'}
  var s=document.querySelectorAll('.screen');for(var i=0;i<s.length;i++)s[i].classList.remove('on');
  var b=document.querySelectorAll('.tab');for(var j=0;j<b.length;j++)b[j].classList.remove('on');
  $('s-'+t).classList.add('on');$('t-'+t).classList.add('on');$('scroll').scrollTop=0;
  if(typeof watchActive==='function')watchActive();
  if(t==='pf')renderPF();
  if(t==='dt'){renderDT();setTimeout(drawDT,60)}
  if(t==='an')renderAN();
  if(t==='pd')renderPD();
}
function goSub(n,el){var s=document.querySelectorAll('.snav');for(var i=0;i<s.length;i++)s[i].classList.remove('on');var p=document.querySelectorAll('.sub');for(var j=0;j<p.length;j++)p[j].classList.remove('on');el.classList.add('on');$('sub-'+n).classList.add('on')}

/* ═══ PORTFOLIO ═══ */
function relCard(r){
  var sc=r.result?(r.status==='closed'?0:r.result.score):null;
  var col=sc===null?'var(--t2)':sc<28?'#ff4d6d':sc<45?'#ffbe0b':'#00d68f';
  var np=r.positions?r.positions.length:0;
  var tag,posTag='',vd;
  if(r.joined){
    tag='<span class="rc-tag tag-obs">'+t('obs_tag')+'</span>';
    vd=sc===null?'--':t('obs_tag');
  }else{
    tag=r.status==='open'?'<span class="rc-tag tag-open">'+t('rc_open')+'</span>':r.status==='closed'?'<span class="rc-tag tag-closed">'+t('rc_closed')+'</span>':'<span class="rc-tag tag-none">'+t('rc_none')+'</span>';
    vd=r.status==='closed'?t('rc_closed'):r.result?r.result.verdict:t('rc_pending');
    posTag=r.status==='open'?'<span style="color:var(--g)">'+t('rc_pos',{n:(r.position||0)})+'</span> · ':'';
  }
  return '<div class="rel-card'+(r.id===DB.active?' active':'')+(r.joined?' obs':'')+'" onclick="pickRel(\''+r.id+'\')">'+
    '<div class="rc-del" onclick="event.stopPropagation();delRel(\''+r.id+'\')" title="删除">×</div>'+
    '<div class="rc-top"><div><div class="rc-ticker">$'+r.ticker+'</div><div class="rc-name">'+r.name+' · '+r.nameA+' & '+r.nameB+'</div></div>'+
    '<div><div class="rc-score" style="color:'+col+'">'+(sc===null?'--':sc)+'</div><div class="rc-verdict" style="color:'+col+'">'+vd+'</div></div></div>'+
    '<div class="rc-bot">'+tag+'<span>'+posTag+t('rc_bets',{n:np})+'</span></div></div>';
}
function renderPF(){
  var mine=[],obs=[];
  for(var i=0;i<DB.rels.length;i++){(DB.rels[i].joined?obs:mine).push(DB.rels[i])}
  var scored=[];for(var j=0;j<mine.length;j++)if(mine[j].result)scored.push(mine[j].status==='closed'?0:mine[j].result.score);
  var avg=scored.length?Math.round(scored.reduce(function(a,b){return a+b},0)/scored.length):null;
  $('pf-sub').textContent=DB.rels.length?t('pf_sub',{n:mine.length,m:scored.length,c:DB.coins.toLocaleString()}):t('pf_none');
  var L=$('rel-list');
  if(!DB.rels.length){L.innerHTML='<div class="empty-pf"><div style="font-size:30px;margin-bottom:10px">💼</div><div style="font-size:13px;font-weight:700;font-family:Syne,sans-serif;margin-bottom:5px">'+t('pf_empty_t')+'</div><div style="font-size:11px;line-height:1.6">'+t('pf_empty_s')+'</div></div>';return}
  var h='';
  if(mine.length){
    if(obs.length)h+='<div class="grp-hd">'+t('grp_mine')+'</div>';
    for(var k=0;k<mine.length;k++)h+=relCard(mine[k]);
  }
  if(obs.length){
    h+='<div class="grp-hd">'+t('grp_obs')+'</div>';
    for(var m=0;m<obs.length;m++)h+=relCard(obs[m]);
  }
  L.innerHTML=h;
}
async function delRel(id){
  var r=null;
  for(var i=0;i<DB.rels.length;i++) if(DB.rels[i].id===id) r=DB.rels[i];
  if(!r) return;
  if(!confirm(t('confirm_del',{n:'$'+r.ticker}))) return;
  if(BACKEND_READY && !r.joined){
    try{ await apiDeleteRel(id); }catch(e){ tst('删除失败'); return }
  }
  DB.rels = DB.rels.filter(function(x){ return x.id!==id });
  if(DB.active===id) DB.active = DB.rels.length?DB.rels[0].id:null;
  _rptLoadedFor=null; _formLoadedFor=null;
  save(); renderPF(); tst(t('ts_deleted'));
}
function pickRel(id){DB.active=id;save();goTab('dt');if(typeof watchActive==='function')watchActive();}

async function createRel(){
  var nm=$('nr-name').value.trim(),a=$('nr-a').value.trim(),b=$('nr-b').value.trim(),tk=$('nr-tk').value.trim().toUpperCase();
  if(!nm){tst(t('ts_needname'));return}
  if(!a||!b){tst(t('ts_needab'));return}
  if(!tk)tk=genTicker();
  if(!/^[A-Z0-9]{2,6}$/.test(tk)){tst(t('ts_badticker'));return}
  for(var i=0;i<DB.rels.length;i++)if(DB.rels[i].ticker===tk){tst(t('ts_dupticker'));return}
  var r;
  if(BACKEND_READY){
    try{ r = await apiCreateRel({ticker:tk,name:nm,nameA:a,nameB:b}); }
    catch(e){
      if(e && (e.code==='23505'||(''+e.message).indexOf('duplicate')>=0)){tst(t('ts_dupticker'));return}
      tst('创建失败：'+((e&&e.message)||'')); return;
    }
    DB.rels.push(r);
  }else{
    r={id:uid(),ticker:tk,name:nm,nameA:a,nameB:b,created:Date.now(),result:null,positions:[],lots:[],earned:{},status:'none'};
    DB.rels.push(r);
  }
  DB.active=r.id;_rptLoadedFor=null;_formLoadedFor=null;save();
  $('nr-name').value='';$('nr-a').value='';$('nr-b').value='';$('nr-tk').value='';
  closeMo('newrel');tst(t('ts_created',{n:tk}));goTab('an');
}
async function joinByCode(){
  var c=$('jn-code').value.trim().toUpperCase();
  if(!c){tst(t('ts_needticker'));return}
  for(var i=0;i<DB.rels.length;i++)if(DB.rels[i].ticker===c){
    DB.active=DB.rels[i].id;save();closeMo('join');tst(t('ts_switched',{n:c}));goTab('dt');return}
  if(BACKEND_READY){
    var row=null;
    try{ row = await apiGetByTicker(c); }catch(e){}
    if(!row){ tst(t('ts_nosuch')); return }
    await apiClaimAccess(row.id);                 // 先建立关联，否则读不到
    var fresh = await apiRefreshRel(row.id);
    if(!fresh){ tst(t('ts_nosuch')); return }
    fresh.earned = await apiEarnedRoles(row.id);
    DB.rels.push(fresh); DB.active=fresh.id;
  }else{
    var r={id:uid(),ticker:c,name:'$'+c,nameA:t('side_a'),nameB:t('side_b'),created:Date.now(),result:null,positions:[],lots:[],earned:{},status:'none',joined:true};
    DB.rels.push(r);DB.active=r.id;
  }
  save();$('jn-code').value='';
  closeMo('join');tst(t('ts_joined',{n:c}));goTab('dt');
}
/* URL join —— 通过邀请链接进入 */
var PENDING_JOIN = null;
(function(){
  try{
    var m=location.search.match(/[?&]j=([^&]+)/);
    if(m){
      PENDING_JOIN = JSON.parse(decodeURIComponent(atob(m[1])));
      history.replaceState(null,'',location.pathname);
    }
  }catch(e){}
})();
async function handlePendingJoin(){
  if(!PENDING_JOIN) return;
  var d = PENDING_JOIN; PENDING_JOIN = null;
  for(var i=0;i<DB.rels.length;i++) if(DB.rels[i].ticker===d.t){ DB.active=DB.rels[i].id; save(); return }
  if(BACKEND_READY){
    var row=null;
    try{ row = await apiGetByTicker(d.t) }catch(e){}
    if(row){
      await apiClaimAccess(row.id);
      var fresh = await apiRefreshRel(row.id);
      if(fresh){
        fresh.earned = await apiEarnedRoles(row.id);
        DB.rels.push(fresh); DB.active=fresh.id; save(); return;
      }
    }
  }
  var r={id:uid(),ticker:d.t,name:d.n||('$'+d.t),nameA:d.a||t('side_a'),nameB:d.b||t('side_b'),
    created:Date.now(),result:d.s?{score:d.s,verdict:d.v||'Hold',
      color:d.s<28?'#ff4d6d':d.s<45?'#ffbe0b':'#00d68f',desc:t('shared_from'),phase:'--',
      peScore:'--',cfScore:'--',volatility:'--',flags:[],flagTypes:[],klinePts:null,
      analysis:'',structT:[],breakdown:null}:null,
    positions:[],lots:[],earned:{},status:'none',joined:true};
  DB.rels.push(r); DB.active=r.id; save();
}

/* ═══ DETAIL ═══ */
function renderDT(){
  var r=cur();if(!r)return;
  $('dt-title').textContent=r.name;
  $('dt-tk').textContent='$'+r.ticker+' · '+r.nameA+' & '+r.nameB+(r.status==='open'?t('dt_tkpos',{n:(r.position||0)}):'');
  $('dt-code').textContent='$'+r.ticker;
  var closed=r.status==='closed',sc=r.result?(closed?0:r.result.score):null;
  var col=sc===null?'var(--t1)':closed?'#ff4d6d':r.result.color;
  $('dt-price').textContent=sc===null?'--':sc;$('dt-price').style.color=col;
  var ch=$('dt-chg');
  if(sc===null){ch.textContent=t('dt_notassessed');ch.style.cssText='font-size:12px;color:var(--t2);margin-top:3px'}
  else if(closed){ch.textContent=t('dt_closed');ch.style.cssText='font-size:12px;color:#ff4d6d;background:rgba(255,77,109,.1);padding:3px 9px;border-radius:20px;display:inline-flex;margin-top:3px'}
  else{var d=sc-50;ch.textContent=(d>=0?'▲ ':'▼ ')+Math.abs(d)+' pts · '+r.result.verdict;ch.style.cssText='font-size:12px;color:'+col+';background:'+col+'18;padding:3px 9px;border-radius:20px;display:inline-flex;margin-top:3px'}
  var st=[['dt-pe',closed?0:(r.result?r.result.peScore:null)],['dt-cf',closed?0:(r.result?r.result.cfScore:null)],['dt-vol',closed?0:(r.result?r.result.volatility:null)]];
  for(var i=0;i<st.length;i++){var e=$(st[i][0]);e.textContent=st[i][1]===null?'--':st[i][1];e.style.color=st[i][1]===null?'var(--t2)':closed?'#ff4d6d':(st[i][1]>55?'#00d68f':'#ff4d6d')}
  var roi=$('dt-roi'),ms=mktSeries(r),hasPos=ms&&ms.ev&&ms.ev.length>0;
  var ep=r.entryPrice;
  if(closed){roi.textContent=t('roi_settled');roi.style.color='#ff4d6d';roi.style.fontSize='11px'}
  else if(!r.result){roi.textContent='--';roi.style.color='var(--t2)'}
  else if(r.status!=='open'){roi.textContent=t('roi_notopen');roi.style.color='var(--t3)';roi.style.fontSize='10px'}
  else if(!hasPos){roi.textContent=t('roi_waiting');roi.style.color='var(--t3)';roi.style.fontSize='10px'}
  else{var rr=(isFinite(ep)&&ep>0)?((ms.price-ep)/ep*100):0;if(!isFinite(rr))rr=0;roi.textContent=(rr>=0?'+':'')+rr.toFixed(1)+'%';roi.style.color=rr>=0?'#00d68f':'#ff4d6d';roi.style.fontSize='12px'}
  if(!closed&&r.result&&r.status==='open'&&hasPos){
    var shownP=isFinite(ms.price)?ms.price:(isFinite(ep)?ep:r.result.score);
    $('dt-price').textContent=shownP.toFixed(1);
    var mv=shownP-ep;if(!isFinite(mv))mv=0;
    var mvp=(isFinite(ep)&&ep>0)?(mv/ep*100):0;
    ch.textContent=(mv>=0?'▲ ':'▼ ')+Math.abs(mv).toFixed(1)+' · '+t('dt_cost')+ep+' · '+(mv>=0?'+':'')+mvp.toFixed(1)+'%';
    ch.style.cssText='font-size:12px;color:'+(mv>=0?'#00d68f':'#ff4d6d')+';background:'+(mv>=0?'#00d68f':'#ff4d6d')+'18;padding:3px 9px;border-radius:20px;display:inline-flex;margin-top:3px';
  }else if(!closed&&r.result&&r.status==='open'){
    ch.textContent='';
    ch.style.cssText='display:none';
  }
  // holding stats
  var hs=$('hold-stats');
  if(r.status==='open'&&r.entryTime){
    var days=Math.max(1,Math.floor((Date.now()-r.entryTime)/86400000));
    var adds=0,cuts=0,lastAdd=null;
    if(r.lots)for(var q=0;q<r.lots.length;q++){var lt=r.lots[q];if(lt.type==='add'){adds++;lastAdd=lt.ts}if(lt.type==='cut')cuts++}
    var la=lastAdd?t('hold_daysago',{n:Math.floor((Date.now()-lastAdd)/86400000)}):t('hold_never');
    var pos=r.position||0;
    var pcol=pos>=85?'var(--y)':pos>=40?'var(--g)':'var(--t2)';
    var rz=r.realized||0;
    hs.style.display='block';
    hs.innerHTML='<div style="font-size:9px;color:var(--t2);letter-spacing:1.5px;margin-bottom:8px">'+t('hold_title')+'</div>'+
      '<div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:4px"><span style="font-size:10px;color:var(--t2)">'+t('hold_curpos')+'</span><span style="font-size:20px;font-weight:800;font-family:Syne,sans-serif;color:'+pcol+'">'+pos+'%</span></div>'+
      '<div style="height:6px;border-radius:3px;background:var(--s3);overflow:hidden;margin-bottom:4px"><div style="height:100%;width:'+pos+'%;background:'+pcol+';border-radius:3px;transition:width .4s"></div></div>'+
      '<div style="font-size:9px;color:var(--t3);margin-bottom:8px">'+posDesc(pos)+'</div>'+
      '<div style="font-size:11px;color:var(--t1);line-height:1.8;border-top:1px solid var(--b);padding-top:8px">'+t('hold_days',{d:days,a:adds,c:cuts,cc:(cuts>=3?'var(--r)':'var(--y)')})+'<br><span style="color:var(--t2)">'+t('hold_lastadd')+la+'</span>'+
      (rz!==0?'<br><span style="color:var(--t2)">'+t('hold_realized')+'</span><b style="color:'+(rz>=0?'var(--g)':'var(--r)')+'">'+(rz>=0?'+':'')+rz+'%</b>':'')+'</div>'+
      (cuts>=3?'<div style="margin-top:8px;padding:8px 10px;background:var(--yd);border:1px solid rgba(255,190,11,.2);border-radius:8px;font-size:10px;color:var(--y);line-height:1.6">'+t('hold_cutwarn',{n:cuts})+'</div>':'')+
      divergenceNote(r,pos);
  }else hs.style.display='none';
  var ob=$('obs-banner');
  if(r.joined){ob.style.display='block';ob.innerHTML=t('obs_banner',{n:'$'+r.ticker})}
  else ob.style.display='none';
  var pu=$('pos-unset');
  if(!r.joined&&r.status==='open'&&r.posUnset){pu.style.display='block';$('pu-text').innerHTML=t('pu_text',{n:(r.position||50)})}
  else pu.style.display='none';
  renderInsider(r,ms);
  renderActions(r);
  var needAns = BACKEND_READY && !r.joined && r.status==='open' && !r.answersDone;
  $('ans-card').style.display = needAns ? 'block' : 'none';
  var canShare=!r.joined && r.status==='open' && (!BACKEND_READY || r.answersDone);
  $('share-bar').style.display=r.joined?'none':'block';
  $('sb-btn').style.display=canShare?'block':'none';
  $('share-lock').style.display=canShare?'none':'block';
  if(needAns) $('share-lock').innerHTML=t('lock_answers');
  updBars(r);
  var hasChart=(r.result&&!closed)||closed||hasPos;
  $('dt-chartwrap').style.display=hasChart?'block':'none';
  $('dt-nochart').style.display=hasChart?'none':'block';
  var cap=closed?t('cap_closed'):(hasPos?t('cap_market'):t('cap_val'));
  $('dt-chart-cap').textContent=hasChart?cap:'';
}
function groupPos(ps){
  var map={},order=[];
  for(var i=0;i<ps.length;i++){
    var p=ps[i];
    var k=p.actorId ? (p.actorId+'|'+p.role) : p.role;   // 同一个人的同一身份算一组
    if(!map[k]){map[k]={role:p.role,emoji:p.emoji,name:p.name,actorId:p.actorId,ops:[],net:0,total:0};order.push(k)}
    map[k].ops.push(p);map[k].total+=p.amount;
    map[k].net+=(p.type==='long'?1:-1)*p.amount;
  }
  var out=[];for(var j=0;j<order.length;j++)out.push(map[order[j]]);
  return out;
}
/* 真实参与人数：按 actorId 去重 */
function countPeople(ps){
  var s={},n=0;
  for(var i=0;i<ps.length;i++){
    var k=ps[i].actorId || ('anon'+i);
    if(!s[k]){s[k]=1;n++}
  }
  return n;
}
function fmtTime(ts){var d=new Date(ts);return (d.getMonth()+1)+'/'+d.getDate()+' '+String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0')}
function updBars(r){
  var lT=0,sT=0,rL=0,rS=0,ps=r.positions||[];
  for(var i=0;i<ps.length;i++){var p=ps[i],w=p.weight||1;if(p.type==='long'){lT+=p.amount*w;rL+=p.amount}else{sT+=p.amount*w;rS+=p.amount}}
  var tot=lT+sT||1,lp=Math.round(lT/tot*100);
  $('dt-bl').style.width=lp+'%';
  $('dt-bl').textContent = lp>=18 ? t('bar_long',{n:lp}) : (lp>=8 ? lp+'%' : '');
  $('dt-bs').style.width=(100-lp)+'%';
  $('dt-bs').textContent = (100-lp)>=18 ? t('bar_short',{n:(100-lp)}) : ((100-lp)>=8 ? (100-lp)+'%' : '');
  var people=countPeople(ps);
  $('dt-tc').textContent=(rL+rS).toLocaleString();
  $('dt-pc').textContent=t('mkt_people',{p:people,o:ps.length});
  var L=$('dt-plist');
  if(!ps.length){L.innerHTML='<div style="text-align:center;padding:10px 0;font-size:10px;color:var(--t3)">'+t('pred_none')+'</div>';return}
  // 只给汇总，身份细节留给付费解锁
  var nL=0,nS=0,seenL={},seenS={};
  for(var i2=0;i2<ps.length;i2++){
    var k2=ps[i2].actorId||('a'+i2);
    if(ps[i2].type==='long'){ if(!seenL[k2]){seenL[k2]=1;nL++} }
    else { if(!seenS[k2]){seenS[k2]=1;nS++} }
  }
  L.innerHTML='<div style="display:flex;justify-content:space-between;padding:8px 0 2px;font-size:11px">'+
    '<span style="color:var(--g)">'+t('sum_long',{n:nL})+'</span>'+
    '<span style="color:var(--r)">'+t('sum_short',{n:nS})+'</span></div>'+
    '<div style="font-size:9px;color:var(--t3);line-height:1.6">'+t('sum_locked')+'</div>';
}
function divergenceNote(r,pos){
  if(!r.outlook)return'';
  var o=r.outlook;
  if(pos>=70&&o==='no')
    return'<div style="margin-top:8px;padding:10px 12px;background:var(--rd);border:1px solid rgba(255,77,109,.25);border-radius:8px;font-size:11px;color:var(--r);line-height:1.7">'+t('div_title')+'<br>'+t('div_hi_no',{p:pos})+'<br><span style="color:var(--t2)">'+t('div_hi_no2')+'</span></div>';
  if(pos>=70&&o==='maybe')
    return'<div style="margin-top:8px;padding:10px 12px;background:var(--yd);border:1px solid rgba(255,190,11,.2);border-radius:8px;font-size:11px;color:var(--y);line-height:1.7">'+t('div_hi_maybe',{p:pos})+'<br><span style="color:var(--t2)">'+t('div_hi_maybe2')+'</span></div>';
  if(pos<=30&&o==='yes')
    return'<div style="margin-top:8px;padding:10px 12px;background:var(--pd);border:1px solid rgba(155,93,229,.2);border-radius:8px;font-size:11px;color:var(--pu);line-height:1.7">'+t('div_lo_yes',{p:pos})+'<br><span style="color:var(--t2)">'+t('div_lo_yes2')+'</span></div>';
  return'';
}
function renderInsider(r,ms){
  var f=$('insider-feed');
  var lots=(r.lots||[]).filter(function(l){return l.type==='add'||l.type==='cut'});
  if(!lots.length){f.style.display='none';return}
  f.style.display='block';
  var h='<div style="font-size:9px;color:var(--t2);letter-spacing:1.5px;margin-bottom:8px">'+t('ins_title')+'</div>';
  for(var i=lots.length-1;i>=0&&i>=lots.length-4;i--){
    var L=lots[i],isAdd=L.type==='add',c=isAdd?'var(--g)':'var(--y)';
    h+='<div style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid var(--b)">'+
      '<div><div style="font-size:11px;color:'+c+';font-weight:600">'+t(isAdd?'ins_add':'ins_cut',{n:L.size})+'</div>'+
      '<div style="font-size:9px;color:var(--t3);margin-top:1px">'+fmtTime(L.ts)+' · '+t('ins_price')+L.price.toFixed(1)+'</div></div>'+
      '<span style="font-size:16px">'+(isAdd?'📈':'📉')+'</span></div>';
  }
  h+='<div style="font-size:9px;color:var(--t3);margin-top:8px;line-height:1.5">'+t('ins_foot')+'</div>';
  f.innerHTML=h;
}
function drawDT(){
  var r=cur();if(!r)return;
  var cv=$('dt-canvas');if(!cv||!cv.offsetWidth)return;
  var closed=r.status==='closed';
  var dpr=window.devicePixelRatio||1,W=cv.offsetWidth,H=150;
  cv.width=W*dpr;cv.height=H*dpr;
  var ctx=cv.getContext('2d');ctx.scale(dpr,dpr);
  ctx.clearRect(0,0,W,H);
  ctx.strokeStyle='rgba(255,255,255,.04)';ctx.lineWidth=1;
  var gl=[.25,.5,.75];for(var g=0;g<gl.length;g++){var y=10+(H-20)*gl[g];ctx.beginPath();ctx.moveTo(6,y);ctx.lineTo(W-6,y);ctx.stroke()}
  var toY=function(v){return 10+((100-v)/100)*(H-20)};
  if(closed){
    // Liquidation: decline to zero then flat
    var pts=[],start=r.result?r.result.score:50;
    for(var i=0;i<10;i++)pts.push(start+(Math.random()-.5)*4);
    for(var j=0;j<6;j++)pts.push(Math.max(0,start*(1-(j+1)/6)));
    for(var k=0;k<8;k++)pts.push(0);
    var xS=(W-16)/(pts.length-1);
    ctx.beginPath();ctx.moveTo(8,toY(pts[0]));
    for(var m=0;m<pts.length;m++)ctx.lineTo(8+m*xS,toY(pts[m]));
    ctx.strokeStyle='#ff4d6d';ctx.lineWidth=2;ctx.lineJoin='round';ctx.stroke();
    ctx.beginPath();ctx.arc(8+(pts.length-1)*xS,toY(0),4,0,Math.PI*2);ctx.fillStyle='#ff4d6d';ctx.fill();
    ctx.fillStyle='#ff4d6d';ctx.font='10px DM Mono,monospace';ctx.textAlign='right';ctx.fillText('0.0',W-10,toY(0)-8);
    return;
  }
  var ms0=mktSeries(r);
  if(ms0&&ms0.ev&&ms0.ev.length&&r.result){
    var ms=ms0,raw=ms.pts;
    var color=ms.price>=ms.base?'#00d68f':'#ff4d6d';
    // interpolate to at least 20 points for a smoother line
    var pts2=[];
    for(var b=0;b<raw.length;b++){
      pts2.push(raw[b]);
      if(b<raw.length-1){var steps=Math.max(1,Math.floor(18/raw.length));
        for(var s=1;s<=steps;s++)pts2.push(raw[b]+(raw[b+1]-raw[b])*(s/(steps+1)))}
    }
    while(pts2.length<20)pts2.push(pts2[pts2.length-1]);
    var xS2=(W-16)/(pts2.length-1);
    ctx.beginPath();ctx.moveTo(8,toY(pts2[0]));
    for(var c=0;c<pts2.length;c++)ctx.lineTo(8+c*xS2,toY(pts2[c]));
    ctx.lineTo(8+(pts2.length-1)*xS2,H-6);ctx.lineTo(8,H-6);ctx.closePath();
    ctx.fillStyle=color+'14';ctx.fill();
    ctx.beginPath();ctx.moveTo(8,toY(pts2[0]));
    for(var d2=0;d2<pts2.length;d2++)ctx.lineTo(8+d2*xS2,toY(pts2[d2]));
    ctx.strokeStyle=color;ctx.lineWidth=2;ctx.lineJoin='round';ctx.stroke();
    // baseline (assessment value)
    ctx.strokeStyle='rgba(255,255,255,.15)';ctx.setLineDash([3,4]);ctx.lineWidth=1;
    ctx.beginPath();ctx.moveTo(8,toY(ms.base));ctx.lineTo(W-8,toY(ms.base));ctx.stroke();ctx.setLineDash([]);
    ctx.fillStyle='#6b6b80';ctx.font='9px DM Mono,monospace';ctx.textAlign='left';
    ctx.fillText((r.status==='open'?t('dt_cost'):t('dt_val'))+ms.base,10,toY(ms.base)-5);
    // insider markers on the event line
    var stepX=(W-16)/Math.max(1,raw.length-1);
    for(var L=0;L<ms.ev.length;L++){
      var e2=ms.ev[L];
      if(e2.kind!=='insider')continue;
      var ratio=(L+1)/(raw.length-1);
      var fx=8+ratio*(W-16)*((pts2.length-1)/(pts2.length-1));
      fx=8+((L+1)/(raw.length-1))*(W-16);
      var fy=toY(raw[L+1]);
      var mc=e2.dir>0?'#00d68f':'#ffbe0b';
      ctx.beginPath();ctx.arc(fx,fy,4,0,Math.PI*2);
      ctx.fillStyle=mc;ctx.fill();
      ctx.strokeStyle='#060608';ctx.lineWidth=2;ctx.stroke();
      ctx.fillStyle=mc;ctx.font='8px DM Mono,monospace';ctx.textAlign='center';
      ctx.fillText((e2.dir>0?'+':'−')+e2.size+'%',fx,fy-9);
    }
    ctx.beginPath();ctx.arc(8+(pts2.length-1)*xS2,toY(ms.price),4,0,Math.PI*2);
    ctx.fillStyle=color;ctx.fill();
    ctx.fillStyle=color;ctx.font='10px DM Mono,monospace';ctx.textAlign='right';
    ctx.fillText(ms.price.toFixed(1),W-10,toY(ms.price)-8);
    return;
  }
  if(r.result&&r.result.klinePts){drawK(ctx,W,H,r.result.klinePts,r.result.color);return}
}
function drawK(ctx,W,H,pts,color){
  var pad=6,cw=(W-pad*2)/pts.length,bW=Math.max(2,cw*.55),hi=[],lo=[];
  for(var i=0;i<pts.length;i++){hi.push(pts[i].high);lo.push(pts[i].low)}
  var maxP=Math.max.apply(null,hi)+2,minP=Math.min.apply(null,lo)-2,range=maxP-minP||1;
  var toY=function(v){return pad+((maxP-v)/range)*(H-pad*2)};
  for(var j=0;j<pts.length;j++){var p=pts[j],cx=pad+j*cw+cw/2,ig=p.close>=p.open,cc=ig?color:'#ff4d6d';
    ctx.strokeStyle=cc+'99';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(cx,toY(p.high));ctx.lineTo(cx,toY(p.low));ctx.stroke();
    ctx.fillStyle=cc;ctx.globalAlpha=.9;
    ctx.fillRect(cx-bW/2,toY(Math.max(p.open,p.close)),bW,Math.max(1,toY(Math.min(p.open,p.close))-toY(Math.max(p.open,p.close))));ctx.globalAlpha=1}
  var lc=pts[pts.length-1].close;
  ctx.strokeStyle=color+'55';ctx.setLineDash([3,4]);ctx.beginPath();ctx.moveTo(pad,toY(lc));ctx.lineTo(W-pad,toY(lc));ctx.stroke();ctx.setLineDash([]);
  ctx.beginPath();ctx.arc(Math.min(pad+(pts.length-.5)*cw,W-pad-4),toY(lc),3,0,Math.PI*2);ctx.fillStyle=color;ctx.fill();
}

/* ═══ OPEN / CLOSE ═══ */
function doOpen(){
  var r=cur();if(!r)return;
  if(r.joined){tst(t('owner_only'));return}
  if(r.status==='open'){tst(t('ts_isopen'));return}
  if(!r.result){tst(t('ts_needassess'));goTab('an');return}
  $('op-p').textContent=r.result.score;
  $('op-sl').value=50;updOpenPos();
  openMo('open');
}
/* ── 仓位描述 ── */
var OUTLOOK={ap:null,cp:null};
function setOutlook(el){
  var m=el.getAttribute('data-m'),v=el.getAttribute('data-v');
  var sib=document.querySelectorAll('.ol-o[data-m="'+m+'"]');
  for(var i=0;i<sib.length;i++)sib[i].classList.remove('on');
  el.classList.add('on');OUTLOOK[m]=v;
}
function doCalib(){
  var r=cur();if(!r)return;
  if(r.joined){tst(t('owner_only'));return}
  $('cb-sl').value=r.position||50;updCalib();openMo('calib');
}
function updCalib(){
  var v=+$('cb-sl').value;
  $('cb-pos').textContent=v+'%';
  $('cb-desc').textContent=posDesc(v);
  $('cb-pos').style.color=v>=85?'var(--y)':'var(--g)';
}
async function confirmCalib(){
  var r=cur(),v=+$('cb-sl').value;
  if(BACKEND_READY){
    try{ await apiCalib(r.id, v); await syncOne(r.id); }catch(e){ tst('保存失败'); return }
  }else{
    r.position=v; r.posUnset=false;
    if(r.lots&&r.lots.length)r.lots[0].size=v;
    save();
  }
  closeMo('calib');renderDT();setTimeout(drawDT,60);
  tst(t('ts_calib',{n:v}));
}
function posDesc(v){
  if(v<=15)return t('pos_probe');
  if(v<=35)return t('pos_light');
  if(v<=60)return t('pos_half');
  if(v<=85)return t('pos_heavy');
  return t('pos_full');
}
function updOpenPos(){
  var v=+$('op-sl').value;
  $('op-pos').textContent=v+'%';
  $('op-desc').textContent=posDesc(v);
  $('op-pos').style.color=v>=85?'var(--y)':'var(--g)';
}
async function confirmOpen(){
  var r=cur(),pz=+$('op-sl').value;
  if(BACKEND_READY){
    try{ await apiOpen(r.id, r.result.score, pz); await syncOne(r.id); r=cur(); }
    catch(e){ tst('保存失败'); return }
  }else{
    r.status='open'; r.entryPrice=r.result.score; r.entryTime=Date.now();
    r.position=pz; r.realized=0;
    r.lots=[{price:r.result.score,ts:Date.now(),type:'open',size:pz}];
    save();
  }
  closeMo('open');renderDT();setTimeout(drawDT,60);
  tst(t('ts_opened',{p:pz,e:r.entryPrice}));
}
function doAdd(){
  var r=cur();if(!r||r.status!=='open')return;
  if(r.joined){tst(t('owner_only'));return}
  var room=100-(r.position||0);
  if(room<=0){tst(t('ts_full'));return}
  var sl=$('ap-sl');sl.max=room;sl.value=Math.min(10,room);
  $('ap-max').textContent=t('max_add',{n:room});
  updAddPos();openMo('addpos');
}
function updAddPos(){
  var r=cur(),add=+$('ap-sl').value,cp=r.position||0;
  var newEntry=(r.entryPrice*cp+r.result.score*add)/(cp+add);
  $('ap-pos').textContent='+'+add+'%';
  $('ap-cur').textContent=cp+'%';
  $('ap-after').textContent=(cp+add)+'%';
  $('ap-entry').textContent=r.entryPrice;
  $('ap-now').textContent=r.result.score;
  $('ap-new').textContent=newEntry.toFixed(1);
  $('ap-new').style.color=newEntry>r.entryPrice?'var(--y)':'var(--g)';
}
async function confirmAdd(){
  var r=cur(),add=+$('ap-sl').value,cp=r.position||0;
  var newEntry=+((r.entryPrice*cp+r.result.score*add)/(cp+add)).toFixed(1);
  var newPos=cp+add, ol=OUTLOOK.ap;
  if(BACKEND_READY){
    try{ await apiAdd(r.id, r.result.score, add, newEntry, newPos, ol); await syncOne(r.id); r=cur(); }
    catch(e){ tst('保存失败'); return }
  }else{
    r.entryPrice=newEntry; r.position=newPos;
    if(!r.lots)r.lots=[];
    r.lots.push({price:r.result.score,ts:Date.now(),type:'add',size:add});
    if(ol)r.outlook=ol;
    save();
  }
  OUTLOOK.ap=null;
  var oo=document.querySelectorAll('.ol-o[data-m="ap"]');for(var z=0;z<oo.length;z++)oo[z].classList.remove('on');
  closeMo('addpos');renderDT();setTimeout(drawDT,60);
  tst(t('ts_added',{a:add,p:r.position,e:r.entryPrice}));
}
function doCut(){
  var r=cur();if(!r||r.status!=='open')return;
  if(r.joined){tst(t('owner_only'));return}
  var cp=r.position||0;
  if(cp<=0){tst(t('ts_nopos'));return}
  var sl=$('cp-sl');sl.max=cp;sl.value=Math.min(10,cp);
  $('cp-max').textContent=t('max_cut',{n:cp});
  var c=0;if(r.lots)for(var i=0;i<r.lots.length;i++)if(r.lots[i].type==='cut')c++;
  $('cp-count').textContent=c;
  updCutPos();openMo('cutpos');
}
function updCutPos(){
  var r=cur(),cut=+$('cp-sl').value,cp=r.position||0;
  var ms=mktSeries(r),now=ms?ms.price:r.result.score;
  var pnl=(isFinite(r.entryPrice)&&r.entryPrice>0)?((now-r.entryPrice)/r.entryPrice*cut):0;
  if(!isFinite(pnl))pnl=0;
  $('cp-pos').textContent='−'+cut+'%';
  $('cp-cur').textContent=cp+'%';
  $('cp-after').textContent=(cp-cut)+'%';
  $('cp-pnl').textContent=(pnl>=0?'+':'')+pnl.toFixed(1)+'%';
  $('cp-pnl').style.color=pnl>=0?'var(--g)':'var(--r)';
  var w=$('cp-warn');
  if(cp-cut<=0){w.style.display='block';w.innerHTML=t('cut_zero');}
  else w.style.display='none';
}
async function confirmCut(){
  var r=cur(),cut=+$('cp-sl').value,cp=r.position||0;
  var ms=mktSeries(r),now=ms?ms.price:r.result.score;
  var pnl=(isFinite(r.entryPrice)&&r.entryPrice>0)?((now-r.entryPrice)/r.entryPrice*cut):0;
  if(!isFinite(pnl))pnl=0;
  var newRealized=+((r.realized||0)+pnl).toFixed(1), newPos=cp-cut, ol=OUTLOOK.cp;
  if(BACKEND_READY){
    try{ await apiCut(r.id, now, cut, newPos, +pnl.toFixed(1), newRealized, ol); await syncOne(r.id); r=cur(); }
    catch(e){ tst('保存失败'); return }
  }else{
    r.realized=newRealized; r.position=newPos;
    if(!r.lots)r.lots=[];
    r.lots.push({price:now,ts:Date.now(),type:'cut',size:cut,pnl:+pnl.toFixed(1)});
    if(ol)r.outlook=ol;
    if(newPos<=0){ r.status='closed'; r.closeTime=Date.now(); settlePositions(r) }
    save();
  }
  OUTLOOK.cp=null;
  var oc=document.querySelectorAll('.ol-o[data-m="cp"]');for(var z2=0;z2<oc.length;z2++)oc[z2].classList.remove('on');
  closeMo('cutpos');renderDT();renderPD();setTimeout(drawDT,60);
  if(newPos<=0){ tst(t('ts_zero')); return }
  var c=0;for(var i=0;i<(r.lots||[]).length;i++)if(r.lots[i].type==='cut')c++;
  tst(c>=3?t('ts_cutn',{a:cut,n:c}):t('ts_cut',{a:cut,p:r.position}));
}
function doClose(){
  var r=cur();if(!r)return;
  if(r.joined){tst(t('owner_only'));return}
  if(r.status!=='open'){tst(t('ts_noopen'));return}
  $('cl-p').textContent=r.result?r.result.score:'--';openMo('close');
}
async function confirmClose(){
  var r=cur();
  if(BACKEND_READY){
    try{ await apiClose(r.id); await syncOne(r.id); }
    catch(e){ tst('保存失败'); return }
  }else{
    r.status='closed'; r.closeTime=Date.now(); settlePositions(r); save();
  }
  closeMo('close');renderDT();renderPD();setTimeout(drawDT,60);
  tst(t('ts_closed'));
}
/* ═══ A3 · 平仓结算 ═══ */
function settlePositions(r){
  var ps=r.positions||[];
  if(!DB.record)DB.record={total:0,right:0,wrong:0,longs:0,shorts:0};
  for(var i=0;i<ps.length;i++){
    var p=ps[i];
    if(p.settled)continue;
    p.settled=true;
    p.correct=(p.type==='short');
    p.payout=p.correct?p.amount*2:0;
    if(p.correct)DB.coins+=p.payout;
    DB.record.total++;
    if(p.correct)DB.record.right++;else DB.record.wrong++;
    if(p.type==='long')DB.record.longs++;else DB.record.shorts++;
  }
}
/* ═══ 动线 · 状态按钮 ═══ */
function renderActions(r){
  var a=$('act-area'),h='';
  if(r.joined){
    a.innerHTML='<button class="btn-o" style="width:100%;background:var(--go);color:#000" onclick="goTab(\'pd\')">'+t('btn_predict')+'</button>';
    return;
  }
  if(!r.result){
    h='<button class="btn-c" style="width:100%" onclick="goTab(\'an\')">'+t('btn_assess')+'</button>';
  }else if(r.status==='closed'){
    h='<button class="btn-c" style="width:100%" onclick="goTab(\'an\')">'+t('btn_reassess_new')+'</button>';
  }else if(r.status!=='open'){
    h='<div style="display:grid;grid-template-columns:1fr 1fr;gap:9px"><button class="btn-o" onclick="doOpen()">'+t('btn_open_at',{n:r.result.score})+'</button><button class="btn-c" onclick="goTab(\'an\')">'+t('btn_reassess')+'</button></div>';
  }else{
    var pz=r.position||0;
    h='<div style="display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-bottom:9px"><button class="btn-o" onclick="doAdd()">'+(pz>=100?t('btn_add_full'):t('btn_add'))+'</button><button class="btn-c" style="border-color:rgba(255,190,11,.3);color:var(--y)" onclick="doCut()">'+t('btn_cut')+'</button></div>'+
      '<button class="btn-c" style="width:100%;border-color:rgba(255,77,109,.3);color:var(--r)" onclick="doClose()">'+t('btn_close_pos',{n:pz})+'</button>';
  }
  a.innerHTML=h;
}

/* ═══ SHARE ═══ */
var SHARE_OK=false;
function openShare(){
  var r=cur();if(!r){tst(t('ts_selectrel'));return}
  $('sh-code').textContent='$'+r.ticker;
  var payload={t:r.ticker,n:r.name,a:r.nameA,b:r.nameB};
  if(r.result)payload.s=r.result.score,payload.v=r.result.verdict;
  var code='';
  try{code=btoa(encodeURIComponent(JSON.stringify(payload)))}catch(e){code=''}
  var proto=location.protocol,valid=(proto==='http:'||proto==='https:')&&location.host;
  if(valid&&code){
    SHARE_OK=true;
    var path=location.pathname.replace(/index\.html$/,'');
    $('sh-link').textContent=location.origin+path+'?j='+code;
    $('sh-link').style.color='var(--t2)';
    $('sh-btn-copy').textContent=t('share_copy');
    $('sh-btn-copy').style.background='var(--go)';
  }else{
    SHARE_OK=false;
    $('sh-link').innerHTML='<span style="color:var(--y)">'+t('share_local')+'</span><br><br>'+t('share_local2')+'<br><br>'+t('share_local3',{n:r.ticker});
    $('sh-btn-copy').textContent=t('share_copycode');
    $('sh-btn-copy').style.background='var(--s3)';
  }
  $('sh-note').innerHTML=t('share_note')+'<br><span style="color:var(--t2)">'+t('share_note2')+'</span>';
  openMo('share');
}
function copyLink(){
  var r=cur();
  var t=SHARE_OK?$('sh-link').textContent:(r?r.ticker:'');
  if(!t){tst(t('ts_nocopy'));return}
  if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(t).then(function(){tst(SHARE_OK?t('ts_copied'):t('ts_copiedcode'))},function(){fallbackCopy(t)});
  else fallbackCopy(t);
}
function fallbackCopy(t){var ta=document.createElement('textarea');ta.value=t;document.body.appendChild(ta);ta.select();try{document.execCommand('copy');tst(t('ts_copied'))}catch(e){tst(t('ts_manualcopy'))}ta.remove()}

/* ═══ EARN FLOW ═══ */
function startRelPick(){closeMo('earn');renderRelOpts();openMo('rel')}
function renderRelOpts(){
  var r=cur(),h='';
  $('rel-sub').textContent=t('rel_sub',{n:(r?r.name:'—')});
  for(var i=0;i<ROLES.length;i++){var o=ROLES[i];
    h+='<div class="ro'+(o.self?' self':'')+'" data-i="'+i+'" onclick="selRel(this)">'+o.emoji+' '+p(o.label)+' <span style="color:'+(o.danger?'var(--r)':o.self?'var(--pu)':'var(--go)')+';font-size:9px">'+p(o.note)+'</span></div>'}
  $('rel-opts').innerHTML=h;
  var b=$('rel-nx');b.style.background='var(--s3)';b.style.color='var(--t2)';b.disabled=true;SESS.rel=null;
}
function selRel(el){
  var o=document.querySelectorAll('#rel-opts .ro');for(var i=0;i<o.length;i++)o[i].classList.remove('sel');
  el.classList.add('sel');SESS.rel=ROLES[parseInt(el.getAttribute('data-i'))];
  var b=$('rel-nx');b.style.background=SESS.rel.self?'var(--pu)':'var(--go)';b.style.color=SESS.rel.self?'#fff':'#000';b.disabled=false;
  b.textContent=t('q_next').replace('→','→');
}
function afterRel(){
  if(!SESS.rel)return;
  var r=cur();
  if(!r.earned)r.earned={};
  if(r.earned[SESS.rel.role]){
    closeMo('rel');
    tst(t('ts_earned'));
    return;
  }
  if(BACKEND_READY && !r.answersDone){
    closeMo('rel');
    tst(t('ts_no_answers'));
    return;
  }
  SESS.mode='guest';
  closeMo('rel');
  if(SESS.rel.self){
    DB.coins+=SESS.rel.base;
    r.earned[SESS.rel.role]=SESS.rel.base;save();
    $('qr-p').textContent='👑';$('qr-lbl').textContent=t('qr_acc');
    $('qr-c').textContent=SESS.rel.base.toLocaleString();
    $('qr-r').textContent='';
    $('qr-bd').innerHTML='';
    openMo('qres');return;
  }
  renderWho();openMo('who');
}
function renderWho(){
  var r=cur(),a=r?r.nameA:t('side_a'),b=r?r.nameB:t('side_b');
  $('who-opts').innerHTML=
    '<div class="wo" data-w="A" onclick="selWho(this)"><div class="wr"></div><div>'+t('who_a',{n:a})+'</div></div>'+
    '<div class="wo" data-w="B" onclick="selWho(this)"><div class="wr"></div><div>'+t('who_b',{n:b})+'</div></div>';
  var n=$('who-nx');n.style.background='var(--s3)';n.style.color='var(--t2)';n.disabled=true;SESS.who=null;
}
function selWho(el){
  var o=document.querySelectorAll('#who-opts .wo');for(var i=0;i<o.length;i++)o[i].classList.remove('sel');
  el.classList.add('sel');SESS.who=el.getAttribute('data-w');
  var n=$('who-nx');n.style.background='var(--pu)';n.style.color='#fff';n.disabled=false;
}
function startQuiz(){closeMo('who');SESS.qIdx=0;SESS.qSel=null;SESS.ans={};SESS.qSc={high:0,highMax:0,mid:0,midMax:0,low:0,lowMax:0};renderQ();openMo('quiz')}
function renderQ(){
  var q=QS[SESS.qIdx],tot=QS.length,r=cur();
  var A=r?r.nameA:t('side_a'),B=r?r.nameB:t('side_b'),X=SESS.who==='A'?A:B;
  var dp='';for(var i=0;i<tot;i++)dp+='<div class="qpd'+(i<SESS.qIdx?' done':'')+'"></div>';
  $('qpr').innerHTML=dp;
  var wm={high:{c:'qw-h',l:t('q_high')},mid:{c:'qw-m',l:t('q_mid')},low:{c:'qw-l',l:t('q_low')}}[q.w];
  $('qwb').innerHTML='<div class="qw '+wm.c+'">Q'+(SESS.qIdx+1)+'/'+QS.length+' &nbsp;·&nbsp; '+wm.l+'</div>';
  var own = (SESS.mode==='owner');
  var Q = (own && q.qo) ? p(q.qo) : p(q.q);
  var S = (own && q.subo) ? p(q.subo) : p(q.sub);
  if(own) X = t('own_you');
  $('qt').textContent=Q.replace(/\{X\}/g,X).replace(/\{A\}/g,A).replace(/\{B\}/g,B);
  $('qs').textContent=S;
  var OPTS = (own && q.opo) ? q.opo : q.opts;
  var h='';for(var k=0;k<OPTS.length;k++){var op=p(OPTS[k]).replace(/\{X\}/g,X).replace(/\{A\}/g,A).replace(/\{B\}/g,B);h+='<div class="qo" data-i="'+k+'" onclick="selQ(this)">'+op+'</div>'}
  $('qop').innerHTML=h;
  var n=$('qnx');n.style.background='var(--s3)';n.style.color='var(--t2)';n.disabled=true;
  n.textContent=SESS.qIdx<tot-1?t('q_next'):t('q_result');
}
function selQ(el){var o=document.querySelectorAll('#qop .qo');for(var i=0;i<o.length;i++)o[i].classList.remove('sel');el.classList.add('sel');SESS.qSel=parseInt(el.getAttribute('data-i'));var n=$('qnx');n.style.background='var(--g)';n.style.color='#000';n.disabled=false}
function nextQ(){
  if(SESS.qSel===null)return;
  if(!SESS.ans)SESS.ans={};
  SESS.ans['q'+(SESS.qIdx+1)] = SESS.qSel;
  if(SESS.qIdx<QS.length-1){ SESS.qIdx++; SESS.qSel=null; renderQ(); }
  else if(SESS.mode==='owner') ownerAnswersDone();
  else quizDone();
}
async function quizDone(){
  closeMo('quiz');
  var r=cur(), g=null;
  if(BACKEND_READY){
    try{ g = await apiGradeQuiz(r.id, SESS.who, SESS.ans); }catch(e){ g=null }
  }
  if(!g || !g.graded){
    // 当事人还没设置标准答案 —— 诚实告知，不编分数
    $('qr-p').textContent='—';
    $('qr-lbl').textContent=t('nogr_lbl');
    $('qr-c').textContent='0';
    $('qr-r').textContent='';
    $('qr-bd').innerHTML='<div style="font-size:11px;color:var(--y);line-height:1.7">'+t('nogr_text')+'</div>';
    openMo('qres');
    return;
  }
  var pct=g.accuracy|0;
  var earned=Math.round(SESS.rel.base*(pct/100));
  if(BACKEND_READY){
    try{ await apiJoinRole(r.id, SESS.rel.role, SESS.who, earned, pct); }
    catch(e){ if((''+e.message)==='DUP'){ tst(t('ts_earned')); return } }
    await syncOne(r.id);
  }else{
    DB.coins+=earned;
    if(!r.earned)r.earned={}; r.earned[SESS.rel.role]=earned; save();
  }
  $('qr-p').textContent=pct+'%';$('qr-lbl').textContent=t('qr_acc');
  $('qr-c').textContent=earned.toLocaleString();
  $('qr-r').textContent=RL[SESS.rel.role]||t('qr_role_fb');
  $('qr-bd').innerHTML=
    '<div class="qsr"><span class="qsl">'+t('qr_high')+'</span><span class="qsv" style="color:var(--g)">'+g.high+'/'+g.high_max+'</span></div>'+
    '<div class="qsr"><span class="qsl">'+t('qr_mid')+'</span><span class="qsv" style="color:var(--y)">'+g.mid+'/'+g.mid_max+'</span></div>'+
    '<div class="qsr"><span class="qsl">'+t('qr_low')+'</span><span class="qsv" style="color:var(--t2)">'+g.low+'/'+g.low_max+'</span></div>'+
    '<div class="qsr"><span class="qsl" style="color:var(--t1);font-weight:600">'+t('qr_acc')+'</span><span class="qsv" style="color:var(--go);font-size:13px">'+pct+'%</span></div>';
  openMo('qres');
}
function finishEarn(){closeMo('qres');renderPD()}

/* ═══ 标准答案 · 当事人填写 ═══ */
function startOwnerAnswers(side){
  var r=cur(); if(!r) return;
  if(r.joined){ tst(t('owner_only')); return }
  SESS.mode='owner'; SESS.who=side;
  SESS.qIdx=0; SESS.qSel=null; SESS.ans={};
  renderQ(); openMo('quiz');
}
function pickAnswerSide(){
  var r=cur(); if(!r) return;
  $('as-a').textContent=r.nameA;
  $('as-b').textContent=r.nameB;
  openMo('ansside');
}
async function ownerAnswersDone(){
  closeMo('quiz');
  var r=cur();
  if(BACKEND_READY){
    try{ await apiSaveAnswers(r.id, SESS.who, SESS.ans); await syncOne(r.id); }
    catch(e){ tst('保存失败：'+((e&&e.message)||'')); SESS.mode=null; return }
  }else{
    r.answersDone=true; save();
  }
  SESS.mode=null;
  renderDT();
  tst(t('ts_answers_saved'));
  setTimeout(function(){ openShare(); }, 600);   // 填完直接引导去邀请
}

/* ═══ A4 · 预测档案（本地版）═══ */
function renderRecord(){
  var c=$('rec-card'),R=DB.record;
  if(!R||!R.total){c.style.display='none';return}
  var acc=Math.round(R.right/R.total*100);
  var tilt=R.shorts>R.longs?t('rec_short'):R.longs>R.shorts?t('rec_long'):t('rec_even');
  c.style.display='block';
  c.innerHTML='<div style="font-size:9px;color:var(--t2);letter-spacing:1.5px;margin-bottom:8px">'+t('rec_title')+'</div>'+
    '<div style="display:flex;gap:12px">'+
    '<div style="flex:1"><div style="font-size:9px;color:var(--t2)">'+t('rec_settled')+'</div><div style="font-size:18px;font-weight:800;font-family:Syne,sans-serif">'+R.total+'</div></div>'+
    '<div style="flex:1"><div style="font-size:9px;color:var(--t2)">'+t('rec_acc')+'</div><div style="font-size:18px;font-weight:800;font-family:Syne,sans-serif;color:'+(acc>=60?'var(--g)':acc>=40?'var(--y)':'var(--r)')+'">'+acc+'%</div></div>'+
    '<div style="flex:1"><div style="font-size:9px;color:var(--t2)">'+t('rec_tilt')+'</div><div style="font-size:18px;font-weight:800;font-family:Syne,sans-serif;color:var(--t2)">'+tilt+'</div></div>'+
    '</div><div style="font-size:9px;color:var(--t3);margin-top:8px;line-height:1.5">'+t('rec_detail',{r:R.correct||R.right||0,w:R.wrong,l:R.longs,s:R.shorts})+'</div>';
}
/* ═══ BET ═══ */
function renderPD(){
  var r=cur();if(!r)return;
  $('pd-ctx').textContent='$'+r.ticker;
  $('coin').textContent=DB.coins.toLocaleString();
  var closed=r.status==='closed';
  $('pd-closed').style.display=closed?'block':'none';
  $('pd-stance').style.display=closed?'none':'block';
  renderRecord();
  // earned-status hint
  var earnedRoles=r.earned?Object.keys(r.earned).length:0;
  $('earn-hint').textContent=earnedRoles?t('earn_hint_n',{n:earnedRoles}):t('earn_hint');
  var ps=r.positions||[],lT=0,sT=0,rL=0,rS=0;
  for(var i=0;i<ps.length;i++){var p=ps[i],w=p.weight||1;if(p.type==='long'){lT+=p.amount*w;rL+=p.amount}else{sT+=p.amount*w;rS+=p.amount}}
  var tot=lT+sT||1,lp=Math.round(lT/tot*100);
  $('lp').textContent=lp;$('sp').textContent=100-lp;$('msf').style.width=lp+'%';
  var gs=groupPos(ps);
  $('tc2').textContent=(rL+rS).toLocaleString();
  $('tp2').textContent=t('mkt_people',{p:gs.length,o:ps.length});
  var L=$('plb');
  if(!ps.length){L.innerHTML='<div style="text-align:center;padding:24px 0;color:var(--t3);font-size:11px">'+t('pl_empty')+'</div>';return}
  var h='';
  for(var k=0;k<gs.length;k++){
    var g=gs[k];
    h+='<div style="margin-bottom:10px;background:var(--s1);border:1px solid '+(g.role==='self'?'rgba(244,196,48,.25)':'var(--b)')+';border-radius:12px;padding:10px 12px">'+
      '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">'+
      '<div style="display:flex;align-items:center;gap:8px"><div class="pav">'+g.emoji+'</div><div><div class="pnm">'+(RL[g.role]||'—')+(g.role==='self'?' <span style="color:var(--go);font-size:8px">×3</span>':'')+'</div><div class="prl">'+t('pl_ops2',{n:g.ops.length,a:g.total.toLocaleString()})+'</div></div></div>'+
      '<span class="'+(g.net>=0?'bl':'bs')+'">'+(g.net>=0?t('pl_net_long'):t('pl_net_short'))+'</span></div>';
    for(var m=0;m<g.ops.length;m++){var o=g.ops[m];
      var rev=m>0&&g.ops[m-1].type!==o.type;
      var st=o.settled?(o.correct?'<span style="color:var(--g);font-size:9px">'+t('pl_right',{n:o.payout.toLocaleString()})+'</span>':'<span style="color:var(--r);font-size:9px">'+t('pl_wrong')+'</span>'):'';
      h+='<div style="padding:5px 0;border-top:1px solid var(--b);font-size:10px">'+
        '<div style="display:flex;align-items:center;justify-content:space-between">'+
        '<span style="color:var(--t2)">'+t('pl_op',{n:m+1})+' &nbsp;<span style="color:var(--t3);font-size:9px">'+fmtTime(o.ts)+'</span></span>'+
        '<span style="display:flex;align-items:center;gap:6px"><span class="'+(o.type==='long'?'bl':'bs')+'">'+(o.type==='long'?t('rec_long'):t('rec_short'))+'</span><span style="color:var(--go);font-weight:700">'+o.amount.toLocaleString()+'</span></span></div>'+
        (rev?'<div style="font-size:9px;color:var(--y);margin-top:2px">'+t('pl_rev')+'</div>':'')+
        (st?'<div style="margin-top:2px">'+st+'</div>':'')+
        '</div>';
    }
    h+='</div>';
  }
  L.innerHTML=h;
}
function openBet(type){
  var r=cur();if(!r){tst(t('ts_selectrel2'));return}
  if(r.status==='closed'){tst(t('ts_closedmkt'));return}
  if(!SESS.rel){tst(t('ts_needrole'));openMo('earn');return}
  if(DB.coins<=0){openMo('earn');return}
  SESS.betType=type;
  SESS.pct=Math.min(1,1000/Math.max(1,DB.coins));
  SESS.amt=Math.round(DB.coins*SESS.pct);
  $('bt-sl').value=Math.round(SESS.pct*100);
  var sh=type==='short';
  $('bt-t').textContent=sh?t('bet_short_t'):t('bet_long_t');
  $('bt-s').textContent=sh?t('bet_short_s'):t('bet_long_s');
  $('bt-note').style.display='none';
  $('bt-tabs').style.display='flex';
  $('bi-rr').style.display=sh?'flex':'none';
  $('bt-ok').style.background=sh?'var(--r)':'var(--g)';$('bt-ok').style.color=sh?'#fff':'#000';
  swBt(type);updBet();openMo('bet');
}
function swBt(t){SESS.betType=t;$('btb-l').classList.toggle('on',t==='long');$('btb-s').classList.toggle('on',t==='short');$('bi-rr').style.display=t==='short'?'flex':'none';$('bt-ok').style.background=t==='short'?'var(--r)':'var(--g)';$('bt-ok').style.color=t==='short'?'#fff':'#000';updBet()}
function slideBet(v){SESS.pct=+v/100;SESS.amt=Math.round(DB.coins*SESS.pct);updBet()}
function setPct(f){SESS.pct=f;SESS.amt=Math.round(DB.coins*f);$('bt-sl').value=Math.round(f*100);updBet()}
function updBet(){
  var a=SESS.amt;
  $('bt-am').textContent=a.toLocaleString();
  $('bt-pctlbl').textContent=t('ph_bal',{n:Math.round(SESS.pct*100)});
  $('bt-maxlbl').textContent=DB.coins.toLocaleString();
  $('bi-b').textContent=DB.coins.toLocaleString()+' 🪙';
  $('bi-a').textContent=(DB.coins-a).toLocaleString()+' 🪙';
  $('bi-r').textContent='+'+Math.round(a*1.8).toLocaleString()+' 🪙';
  $('bt-ok').style.opacity=a>0?'1':'.4';
}
var _betting=false;
async function confirmBet(){
  if(_betting) return;
  var r=cur(),a=SESS.amt;
  if(a<=0){tst(t('ts_needamt'));return}
  if(a>DB.coins)return;
  _betting=true;
  var btn=$('bt-ok'); if(btn){btn.disabled=true;btn.style.opacity='.5'}
  if(BACKEND_READY){
    try{ await apiBet(r.id, SESS.rel.role, SESS.betType, a); await syncOne(r.id); }
    catch(e){ _betting=false; if(btn){btn.disabled=false;btn.style.opacity='1'} tst('下注失败：'+((e&&e.message)||'')); return }
  }else{
    DB.coins-=a;
    var nm={parent:t('anon_parent'),sibling:t('anon_sibling'),bestfriend:t('anon_bestfriend'),friend:t('anon_friend'),acquaintance:t('anon_acquaintance'),third:t('anon_third')};
    if(!r.positions)r.positions=[];
    r.positions.push({name:nm[SESS.rel.role]||t('anon_default'),emoji:SESS.rel.emoji,
      role:SESS.rel.role,type:SESS.betType,amount:a,ts:Date.now()});
    save();
  }
  _betting=false;
  if(btn){btn.disabled=false;btn.style.opacity='1'}
  closeMo('bet');renderPD();
  tst(t(SESS.betType==='long'?'ts_bet_long':'ts_bet_short',{n:a.toLocaleString()}));
  setTimeout(function(){goTab('dt')},700);
}
/* ── market price: deterministic, drives both chart and ROI ── */
/* 市场事件流：亲友下注（资金）+ 当事人仓位变动（内部人信号）*/
function mktEvents(r){
  var ev=[],ps=r.positions||[],lots=r.lots||[];
  for(var i=0;i<ps.length;i++){
    var amt=+ps[i].amount;if(!isFinite(amt))amt=0;
    ev.push({kind:'bet',ts:ps[i].ts||0,dir:ps[i].type==='long'?1:-1,amt:amt,role:ps[i].role});
  }
  for(var j=1;j<lots.length;j++){
    var L=lots[j],sz=+L.size;if(!isFinite(sz)||sz<=0)sz=10;
    if(L.type==='add')ev.push({kind:'insider',ts:L.ts||0,dir:1,size:sz});
    else if(L.type==='cut')ev.push({kind:'insider',ts:L.ts||0,dir:-1,size:sz});
  }
  ev.sort(function(a,b){return a.ts-b.ts});
  return ev;
}
function mktSeries(r){
  if(!r||!r.result)return null;
  var base=(r.status==='open'&&isFinite(+r.entryPrice))?+r.entryPrice:+r.result.score;
  if(!isFinite(base))base=50;
  var ev=mktEvents(r);
  if(!ev.length)return{base:base,price:base,pts:null,ev:[]};
  var vol=+r.result.volatility;if(!isFinite(vol))vol=50;
  var volF=0.5+vol/100;
  var pts=[base],price=base;
  for(var k=0;k<ev.length;k++){
    var e=ev[k],delta=0;
    if(e.kind==='bet'){
      // 资金推动：每 1000 币约推动 1.2 分，受波动率放大
      delta=e.dir*Math.min(8,(e.amt/1000)*1.2)*volF;
    }else{
      // 内部人信号：每 10% 仓位变动约推动 2 分，权重更高
      delta=e.dir*(e.size/10)*2*volF;
    }
    if(!isFinite(delta))delta=0;
    price=Math.max(2,Math.min(98,price+delta));
    if(!isFinite(price))price=base;
    pts.push(price);
  }
  return{base:base,price:price,pts:pts,ev:ev};
}


/* ═══ C · 双人情绪稳定度 ═══ */
function combinedStab(a,b){
  var lo=Math.min(a,b),hi=Math.max(a,b);
  var base=lo*0.65+hi*0.35;
  var gap=hi-lo;
  if(gap>40)base-=(gap-40)*0.15;
  return{val:Math.max(0,Math.round(base)),gap:gap};
}
function updStab(){
  var a=+$('stabA').value,b=+$('stabB').value;
  $('sta-v').textContent=a;$('stb-v').textContent=b;
  var c=combinedStab(a,b);
  var el=$('stab-combined');
  el.textContent=c.val;
  el.style.color=c.val>=60?'var(--g)':c.val>=40?'var(--y)':'var(--r)';
  var g=$('stab-gap');
  if(c.gap>40){
    g.innerHTML='<span style="color:var(--r)">'+t('stab_gap_bad',{n:c.gap})+'</span><br>'+t('stab_gap_bad2');
    g.style.color='var(--t2)';
  }else if(c.gap>25){
    g.innerHTML='<span style="color:var(--y)">'+t('stab_gap_warn',{n:c.gap})+'</span>';
  }else{
    g.textContent=c.gap<10?t('stab_gap_ok',{n:c.gap}):t('stab_gap_near',{n:c.gap});
    g.style.color='var(--t3)';
  }
}

/* ═══ B · 情感劳动清单 ═══ */
var LABOR=[
 {g:['记忆与时间管理','Memory & time management'],items:[['记得双方的纪念日和重要日期','Remembers anniversaries and key dates'],['记得对方家人的生日和喜好','Remembers their family birthdays and tastes'],['主动安排约会和共同活动','Plans dates and shared activities'],['记得对方提过的小事','Remembers small things the other mentioned'],['负责规划旅行和行程','Plans trips and itineraries'],['提醒对方处理生活事务','Reminds the other about life admin'],['协调双方的日程和空闲时间','Coordinates both schedules']]},
 {g:['情绪照护','Emotional care'],items:[['察觉对方情绪不对并主动询问','Notices when the other is off and asks'],['在对方压力大时提供安慰和支持','Comforts and supports under stress'],['吵架后先主动打破沉默','Breaks the silence first after a fight'],['消化对方发泄的负面情绪','Absorbs the other person’s venting'],['为避免冲突而压下自己的不满','Swallows own grievances to avoid conflict'],['在对方需要时调整自己的计划','Adjusts own plans when needed'],['主动修复关系裂痕','Initiates repair after ruptures'],['承担「让气氛不尴尬」的责任','Carries the job of keeping things comfortable']]},
 {g:['关系维护','Relationship upkeep'],items:[['主动提出讨论关系中的问题','Raises problems in the relationship'],['推动关于未来的对话','Pushes conversations about the future'],['处理与对方家人的关系','Manages the in-law relationships'],['在双方朋友圈里维持形象','Maintains the couple image socially'],['记录和分享共同回忆','Records and shares shared memories'],['主动学习如何更好地相处','Actively learns how to do better']]},
 {g:['现实事务','Practical labor'],items:[['承担更多家务','Does more housework'],['处理共同的财务和账单','Handles shared finances and bills'],['在对方生病时照顾','Cares for the other when sick'],['为对方的职业发展让路或调整','Adjusts own career for theirs'],['承担搬家、异地等现实成本','Bears relocation or distance costs']]}
];
var LAB={};
function renderLabor(){
  var h='',n=0;
  for(var i=0;i<LABOR.length;i++){
    var G=LABOR[i];
    h+='<div class="lab-grp"><div class="lab-gt"><span>'+p(G.g)+'</span><b id="lg-'+i+'">0/'+G.items.length+'</b></div>';
    for(var j=0;j<G.items.length;j++){
      var k='L'+n;
      h+='<div class="lab-row"><div class="lab-q">'+p(G.items[j])+'</div><div class="lab-opts">'+
        '<div class="lab-o" data-k="'+k+'" data-v="me" onclick="setLab(this)">'+t('lab_me')+'</div>'+
        '<div class="lab-o b" data-k="'+k+'" data-v="them" onclick="setLab(this)">'+t('lab_them')+'</div>'+
        '<div class="lab-o e" data-k="'+k+'" data-v="even" onclick="setLab(this)">'+t('lab_even')+'</div>'+
        '</div></div>';
      n++;
    }
    h+='</div>';
  }
  $('labor-mod').innerHTML=h;
  // 重新渲染后恢复已选状态，否则界面和计数会对不上
  for(var k in LAB){
    var el=document.querySelector('.lab-o[data-k="'+k+'"][data-v="'+LAB[k]+'"]');
    if(el) el.classList.add('on');
  }
  updLaborResult();
}
function setLab(el){
  var k=el.getAttribute('data-k'),v=el.getAttribute('data-v');
  var sibs=document.querySelectorAll('.lab-o[data-k="'+k+'"]');
  for(var i=0;i<sibs.length;i++)sibs[i].classList.remove('on');
  if(LAB[k]===v){delete LAB[k]}else{LAB[k]=v;el.classList.add('on')}
  updLaborResult();
}
function laborStats(){
  var me=0,them=0,even=0,byG=[],n=0;
  for(var i=0;i<LABOR.length;i++){
    var gm=0,gt=0,ge=0;
    for(var j=0;j<LABOR[i].items.length;j++){
      var v=LAB['L'+n];n++;
      if(v==='me'){me++;gm++}else if(v==='them'){them++;gt++}else if(v==='even'){even++;ge++}
    }
    byG.push({g:p(LABOR[i].g),me:gm,them:gt,even:ge,total:LABOR[i].items.length});
  }
  var ans=me+them+even;
  var divided=me+them;
  // 失衡度只看「分工明确」的部分：均衡项不该稀释失衡信号
  var skew=divided?Math.round(Math.max(me,them)/divided*100):50;
  return{me:me,them:them,even:even,answered:ans,divided:divided,
         skew:skew,heavier:me>=them?'me':'them',byG:byG};
}
function updLaborResult(){
  var s=laborStats(),n=0;
  for(var i=0;i<LABOR.length;i++){
    var c=0;
    for(var j=0;j<LABOR[i].items.length;j++){if(LAB['L'+n])c++;n++}
    var e=$('lg-'+i);if(e)e.textContent=c+'/'+LABOR[i].items.length;
  }
  var box=$('labor-result');
  if(s.answered<5){box.style.display='none';return}
  box.style.display='block';
  var tot=s.answered,mw=Math.round(s.me/tot*100),tw=Math.round(s.them/tot*100),ew=100-mw-tw;
    var div=s.me+s.them, skewMe=div?Math.round(s.me/div*100):50, skewThem=100-skewMe;
  var heavy=[],light=[];
  for(var k=0;k<s.byG.length;k++){var g=s.byG[k];
    if(g.me>g.them&&g.me>0)heavy.push(g.g+' '+g.me+'/'+g.total);
    if(g.them>g.me&&g.them>0)light.push(g.g+' '+g.them+'/'+g.total);}
  var warn='';
  if(s.skew>=70)warn='<div style="margin-top:8px;padding:8px 10px;background:var(--rd);border:1px solid rgba(255,77,109,.2);border-radius:8px;font-size:10px;color:var(--r);line-height:1.6">'+t('lab_warn',{n:s.skew})+'</div>';
  box.innerHTML=
    '<div style="font-size:9px;color:var(--t2);letter-spacing:1.5px;margin-bottom:8px">'+t('lab_answered',{n:s.answered})+'</div>'+
    '<div style="display:flex;justify-content:space-between;font-size:11px;margin-bottom:3px"><span style="color:var(--g)">'+t('lab_me_n',{n:s.me})+'</span><span style="color:var(--pu)">'+t('lab_them_n',{n:s.them})+'</span></div>'+
    '<div class="lab-bar"><i style="width:'+skewMe+'%;background:var(--g);color:#000">'+(skewMe>14?skewMe+'%':'')+'</i><i style="width:'+skewThem+'%;background:var(--pu);color:#fff">'+(skewThem>14?skewThem+'%':'')+'</i></div>'+
    '<div style="font-size:9px;color:var(--t3);margin-top:4px">'+t('lab_even_note',{n:s.even})+'</div>'+
    (heavy.length?'<div style="font-size:10px;color:var(--t2);margin-top:6px;line-height:1.6"><span style="color:var(--g)">'+t('lab_heavy')+'</span>'+heavy.join(' · ')+'</div>':'')+
    (light.length?'<div style="font-size:10px;color:var(--t2);margin-top:3px;line-height:1.6"><span style="color:var(--pu)">'+t('lab_light')+'</span>'+light.join(' · ')+'</div>':'')+
    warn;
}
function laborPenalty(){
  var s=laborStats();
  if(s.answered<5)return{pen:0,skew:50,stats:s};
  if(s.divided<3)return{pen:0,skew:s.skew,stats:s};   // 分工项太少，不下判断
  if(s.skew<=50)return{pen:0,skew:s.skew,stats:s};
  // 分工项占比越高，这个失衡越有分量
  var weight=Math.min(1, s.divided/8);
  var pen=-Math.round(Math.min(20,(s.skew-50)/10*3)*weight);
  return{pen:pen,skew:s.skew,stats:s};
}

function crisisCard(R){
  if(R.hasCrisis){
    var items=R.crisisList.map(function(x){return '<span>'+x+'</span>'}).join('');
    return '<div class="crisis-card">'+
      '<div class="crisis-hd">'+t('cri_hd')+'</div>'+
      '<div class="crisis-items">'+items+'</div>'+
      '<div class="crisis-body">'+t('cri_body')+'</div>'+
      '<div class="crisis-help">'+t('cri_help')+'</div>'+
      '</div>';
  }
  if(R.hasControl){
    var it=R.controlList.map(function(x){return '<span>'+x+'</span>'}).join('');
    return '<div class="control-card">'+
      '<div class="control-hd">'+t('ctl_hd')+'</div>'+
      '<div class="crisis-items">'+it+'</div>'+
      '<div class="control-body">'+t('ctl_body')+'</div>'+
      '</div>';
  }
  return '';
}
function labCard(R){
  var out='';
  var s=R.laborStats;
  if(s&&s.answered>=5){
    var tot=s.answered,mw=Math.round(s.me/tot*100),tw=Math.round(s.them/tot*100),ew=100-mw-tw;
    var div=s.me+s.them, skewMe=div?Math.round(s.me/div*100):50, skewThem=100-skewMe;
    var heavy=[],light=[];
    for(var k=0;k<s.byG.length;k++){var g=s.byG[k];
      if(g.me>g.them&&g.me>0)heavy.push(g.g+' '+g.me+'/'+g.total);
      if(g.them>g.me&&g.them>0)light.push(g.g+' '+g.them+'/'+g.total)}
    out+='<div class="ac"><div class="act">'+t('lab_card')+'</div>'+
      '<div style="display:flex;justify-content:space-between;font-size:11px;margin-bottom:3px"><span style="color:var(--g)">'+t('lab_me_n',{n:s.me})+'</span><span style="color:var(--pu)">'+t('lab_them_n',{n:s.them})+'</span></div>'+
      '<div class="lab-bar"><i style="width:'+skewMe+'%;background:var(--g);color:#000">'+(skewMe>14?skewMe+'%':'')+'</i><i style="width:'+skewThem+'%;background:var(--pu);color:#fff">'+(skewThem>14?skewThem+'%':'')+'</i></div>'+
    '<div style="font-size:9px;color:var(--t3);margin-top:4px">'+t('lab_even_note',{n:s.even})+'</div>'+
      (heavy.length?'<div style="font-size:10px;color:var(--t2);margin-top:6px;line-height:1.6"><span style="color:var(--g)">'+t('lab_heavy')+'</span>'+heavy.join(' · ')+'</div>':'')+
      (light.length?'<div style="font-size:10px;color:var(--t2);margin-top:3px;line-height:1.6"><span style="color:var(--pu)">'+t('lab_light')+'</span>'+light.join(' · ')+'</div>':'')+
      (R.laborSkew>=70?'<div style="margin-top:8px;padding:8px 10px;background:var(--rd);border:1px solid rgba(255,77,109,.2);border-radius:8px;font-size:10px;color:var(--r);line-height:1.6">'+t('lab_warn',{n:R.laborSkew})+'</div>':'')+
      '</div>';
  }
  if(R.stabGap>40){
    out+='<div class="ac" style="border-color:rgba(255,77,109,.2)"><div class="act" style="color:var(--r)">'+t('gap_title')+'</div>'+
      '<div style="display:flex;gap:10px;margin-bottom:8px"><div style="flex:1"><div style="font-size:9px;color:var(--t2)">'+t('gap_a')+'</div><div style="font-size:18px;font-weight:800;font-family:Syne,sans-serif;color:'+(R.stabA>=60?'var(--g)':'var(--r)')+'">'+R.stabA+'</div></div>'+
      '<div style="flex:1"><div style="font-size:9px;color:var(--t2)">'+t('gap_b')+'</div><div style="font-size:18px;font-weight:800;font-family:Syne,sans-serif;color:'+(R.stabB>=60?'var(--g)':'var(--r)')+'">'+R.stabB+'</div></div>'+
      '<div style="flex:1"><div style="font-size:9px;color:var(--t2)">'+t('gap_d')+'</div><div style="font-size:18px;font-weight:800;font-family:Syne,sans-serif;color:var(--r)">'+R.stabGap+'</div></div></div>'+
      '<div style="font-size:10px;color:var(--t2);line-height:1.7">'+t('gap_text')+'</div></div>';
  }
  if(R.stabGap>40&&R.laborSkew>=70){
    out+='<div class="l5" style="background:var(--rd);border-color:rgba(255,77,109,.25);color:var(--r)">'+t('gap_both',{g:R.stabGap,s:R.laborSkew})+'</div>';
  }
  return out;
}
/* ═══ ENGINE ═══ */
var _formLoadedFor = null;
var _rptLoadedFor  = null;
function renderAN(){
  var r=cur();
  $('an-ctx').textContent = r ? '$'+r.ticker : '--';
  if(!r){ clearReport(); _rptLoadedFor=null; _formLoadedFor=null; return }

  // 表单：切换关系时回填或清空
  if(_formLoadedFor !== r.id){
    _formLoadedFor = r.id;
    if(r.form) restoreForm(r.form); else clearForm();
  }

  // 报告：从存储里读，切换关系时跟着换
  if(_rptLoadedFor !== r.id){
    _rptLoadedFor = r.id;
    if(r.result) showResult(r.result, true); else clearReport();
  }

  var b=$('reassess-hint');
  if(b){
    if(r.result && r.form){
      b.style.display='block';
      b.innerHTML=t('reassess_hint',{d:fmtDate(r.result.ts||r.created)});
    }else b.style.display='none';
  }
}
function clearReport(){
  window._lastResult=null;
  $('rpt').innerHTML='<div style="text-align:center;padding:40px 0;color:var(--t2)">'+
    '<div style="font-size:28px;margin-bottom:10px">📊</div>'+
    '<div style="font-size:14px;font-weight:700;font-family:Syne,sans-serif;margin-bottom:5px">'+t('rpt_empty_t')+'</div>'+
    '<div style="font-size:11px">'+t('rpt_empty_s')+'</div></div>';
}
function fmtDate(ts){var d=new Date(ts);return (d.getMonth()+1)+'月'+d.getDate()+'日'}
function isObs(){var r=cur();return !!(r&&r.joined)}
function gv(id){return $(id).value}
function gc(id){var e=document.querySelectorAll('#'+id+' .chip.on'),o=[];for(var i=0;i<e.length;i++){var v=parseInt(e[i].getAttribute('data-s'));if(!isNaN(v))o.push(v)}return o}
function chipLabels(id){
  var e=document.querySelectorAll('#'+id+' .chip.on'),o=[];
  for(var i=0;i<e.length;i++)o.push(e[i].textContent.trim());
  return o;
}
function gcT(id){var e=document.querySelectorAll('#'+id+' .chip.on'),o=[];for(var i=0;i<e.length;i++){var t=e[i].getAttribute('data-t');if(t)o.push(t)}return o}
function genKLine(score,vol,trend,posS,negS,hardT,labor){
  var pts=[],n=30,price=Math.max(10,Math.min(95,score+15+Math.random()*10));
  var tb={bull:.8,sideways:.1,bear:-.7,crash:-2}[trend]||0,pi=[],ni=[];
  for(var a=0;a<posS.length;a++)pi.push(Math.floor(Math.random()*n*.6+n*.3));
  for(var b=0;b<negS.length;b++)ni.push(Math.floor(Math.random()*n*.6+n*.2));
  var hi=hardT<0?Math.floor(Math.random()*n*.4+n*.3):-1;
  for(var i=0;i<n;i++){
    var vf=(vol/100)*6,d=tb*.3+(Math.random()-.5)*vf;
    for(var c=0;c<posS.length;c++)if(pi[c]===i)d+=(posS[c]/100)*8;
    for(var e=0;e<negS.length;e++)if(ni[e]===i)d+=(negS[e]/100)*8;
    if(hi===i)d+=(hardT/100)*12;
    if(i===n-4&&labor<0)d+=labor*.3;
    price=Math.max(3,Math.min(97,price+d));
    var o=price-d*.5,cl=price,wH=Math.random()*vf*.5,wL=Math.random()*vf*.5;
    pts.push({open:Math.max(2,Math.min(96,o)),high:Math.max(2,Math.min(97,Math.max(o,cl)+wH)),low:Math.max(1,Math.min(95,Math.min(o,cl)-wL)),close:Math.max(2,Math.min(96,cl))})}
  return pts;
}
/* ═══ 表单快照 · 存起来下次回填 ═══ */
function snapForm(){
  var chips={};
  ['pos-c','neg-c','hard-c','hard-c2','hard-c3','soft-c','macro-c','struct-c'].forEach(function(id){
    var e=document.querySelectorAll('#'+id+' .chip'),on=[];
    for(var i=0;i<e.length;i++) if(e[i].classList.contains('on')) on.push(i);
    chips[id]=on;
  });
  var sels={};
  ['my-ll','my-at','th-ll','th-pe','dur','loc','pat','trend'].forEach(function(id){
    var el=$(id); if(el) sels[id]=el.value;
  });
  return{
    sels:sels, chips:chips,
    pe:+gv('pe'), cf:+gv('cf'), stabA:+gv('stabA'), stabB:+gv('stabB'),
    labor:JSON.parse(JSON.stringify(LAB)),
    evt:$('evt').value
  };
}
function restoreForm(f){
  if(!f) return;
  try{
    if(f.sels) for(var k in f.sels){ var el=$(k); if(el) el.value=f.sels[k]; }
    if(f.chips) for(var id in f.chips){
      var e=document.querySelectorAll('#'+id+' .chip');
      for(var i=0;i<e.length;i++) e[i].classList.remove('on');
      (f.chips[id]||[]).forEach(function(i){ if(e[i]) e[i].classList.add('on') });
    }
    if(f.pe!=null){ $('pe').value=f.pe; $('pe-v').textContent=f.pe }
    if(f.cf!=null){ $('cf').value=f.cf; $('cf-v').textContent=f.cf }
    if(f.stabA!=null) $('stabA').value=f.stabA;
    if(f.stabB!=null) $('stabB').value=f.stabB;
    updStab();
    if(f.labor){ LAB=JSON.parse(JSON.stringify(f.labor)); renderLabor(); }
    if(f.evt!=null) $('evt').value=f.evt;
  }catch(e){ console.warn('restoreForm',e) }
}
function clearForm(){
  var cs=document.querySelectorAll('.chip.on');for(var i=0;i<cs.length;i++)cs[i].classList.remove('on');
  $('pe').value=60;$('pe-v').textContent='60';
  $('cf').value=55;$('cf-v').textContent='55';
  $('stabA').value=60;$('stabB').value=60;updStab();
  LAB={};renderLabor();
  $('evt').value='';
  ['my-ll','my-at','th-ll','th-pe'].forEach(function(id){$(id).selectedIndex=0});
  $('dur').value='6to12';$('loc').value='samecity';$('pat').value='normal';$('trend').value='sideways';
}
function runEngine(){
  var r=cur();
  var myLL=gv('my-ll'),myAt=gv('my-at'),thLL=gv('th-ll'),thPe=gv('th-pe'),dur=gv('dur'),loc=gv('loc'),
    pe=+gv('pe'),cf=+gv('cf'),pat=gv('pat'),trend=gv('trend');
  var sA=+gv('stabA'),sB=+gv('stabB'),cs=combinedStab(sA,sB),stab=cs.val,stabGap=cs.gap;
  var LP=laborPenalty();
  var posS=gc('pos-c'),negS=gc('neg-c'),softS=gc('soft-c'),macroS=gc('macro-c'),structT=gcT('struct-c');
  var hardS=gc('hard-c').concat(gc('hard-c2'),gc('hard-c3'));
  var crisisList=chipLabels('hard-c'), controlList=chipLabels('hard-c2');
  var hasCrisis=crisisList.length>0, hasControl=controlList.length>0;
  var hasHard=hardS.length>0,llM=myLL===thLL?1.8:.6;
  var aM={secure:{p:1,n:1},anxious:{p:.8,n:1.5},avoidant:{p:.6,n:.6},fearful:{p:.5,n:1.8}}[myAt]||{p:1,n:1};
  var pM={supportive:1.3,neutral:1,competitive:.4,controlling:.2,avoidant_p:.7,volatile:.5}[thPe]||1;
  var locM={together:5,samecity:0,longdist:-8,intl:-15}[loc]||0;
  var pT2=0,nT=0,hT=0,sT2=0,mT=0;
  for(var i=0;i<posS.length;i++)pT2+=posS[i]*llM*aM.p*pM;
  for(var j=0;j<negS.length;j++)nT+=negS[j]*aM.n;
  for(var k=0;k<hardS.length;k++)hT+=hardS[k];
  for(var l=0;l<softS.length;l++)sT2+=softS[l];
  for(var m=0;m<macroS.length;m++)mT+=macroS[m]>0?macroS[m]*pM:macroS[m];
  var labor=pat==='drainer'?-8:pat==='mixed'?-3:0;
  var base=(pe*.28)+(cf*.18)+(stab*.28)+18;
  if(pat==='builder')base+=12;if(pat==='drainer')base-=16;if(pat==='mixed')base-=5;
  if(trend==='bull')base+=10;if(trend==='sideways')base-=2;if(trend==='bear')base-=12;if(trend==='crash')base-=22;
  if(dur==='over3')base+=5;if(dur==='under3')base-=5;
  var gapPen=stabGap>40?-Math.min(10,Math.round((stabGap-40)*0.2)):0;
  var score=base+pT2+nT+hT+sT2+mT+labor+locM+LP.pen+gapPen;
  if(hasHard)score=Math.min(score,25);
  if(hasControl)score=Math.min(score,18);
  if(hasCrisis)score=4;
  var sVol=0,sNote='';
  function hs(t){return structT.indexOf(t)>=0}
  if(hs('lgbtq')){sVol+=15;sNote+=t('sn_lgbtq')}
  if(hs('wlw')){sVol+=12;sNote+=t('sn_wlw')}
  if(hs('trans')){sVol+=18;sNote+=t('sn_trans')}
  if(hs('closeted')){sVol+=10;sNote+=t('sn_closet')}
  if(hs('family-pressure')){sVol+=8;score-=5}
  if(hs('gender-labor')){sVol+=10;score-=6;sNote+=t('sn_labor')}
  if(hs('hostile-env')){sVol+=20;score-=8;sNote+=t('sn_hostile')}
  if(hs('marry-pressure')){sVol+=8;score-=4;sNote+=t('sn_marry')}
  score=Math.max(4,Math.min(98,Math.round(score)));
  var vol=(100-stab)*.6;
  if(pat==='drainer')vol+=18;if(trend==='crash')vol+=22;if(trend==='bear')vol+=10;
  if(hasHard)vol+=28;if(myAt==='fearful')vol+=15;if(myAt==='anxious')vol+=8;
  if(stabGap>40)vol+=Math.min(15,(stabGap-40)*0.3);
  vol+=sVol;vol=Math.max(5,Math.min(95,Math.round(vol)));
  var lT=0,shT=0,ps=(r&&r.positions)||[];
  for(var n2=0;n2<ps.length;n2++){var p2=ps[n2],w2=p2.weight||1;if(p2.type==='long')lT+=p2.amount*w2;else shT+=p2.amount*w2}
  var pTot=lT+shT;
  if(pTot>0)score=Math.max(4,Math.min(98,Math.round(score+(lT-shT)/pTot*5)));
  var vd,em,de,ph,co;
  if(hasHard||score<28){vd='Liquidate';em='🔴';co='#ff4d6d';de=t('verdict_liq');ph=t('phase_crash')}
  else if(score<45){vd='Reduce';em='🟡';co='#ffbe0b';de=t('verdict_red');ph=t('phase_bear')}
  else if(score<65){vd='Hold';em='🟢';co='#00d68f';de=t('verdict_hold');ph=t('phase_range')}
  else{vd='Strong Buy';em='🚀';co='#00d68f';de=t('verdict_buy');ph=t('phase_bull')}
  var peS=pe,cfS=cf;
  var fl=[],ft=[];
  if(hasHard){fl.push(t('f_hardstop'));ft.push('r')}
  if(vol>65){fl.push(t('f_volhi'));ft.push('r')}else if(vol>40){fl.push(t('f_volmid'));ft.push('y')}else{fl.push(t('f_vollo'));ft.push('g')}
  if(pat==='drainer'){fl.push(t('f_negroi'));ft.push('r')}
  if(llM===1.8){fl.push(t('f_llmatch'));ft.push('g')}else{fl.push(t('f_llmiss'));ft.push('y')}
  if(pe>65){fl.push(t('f_pe'));ft.push('g')}
  if(structT.length>0){fl.push(t('f_struct'));ft.push('p')}
  if(stabGap>40){fl.push(t('f_gap',{n:stabGap}));ft.push('r')}
  if(LP.skew>=70&&LP.stats.answered>=5){fl.push(t('f_labor',{n:LP.skew}));ft.push('r')}
  else if(LP.skew>=60&&LP.stats.answered>=5){fl.push(t('f_laborsk',{n:LP.skew}));ft.push('y')}
  if(pTot>0){fl.push(lT>shT?t('f_mktlong'):t('f_mktshort'));ft.push(lT>shT?'g':'r')}
  var kp=genKLine(score,vol,trend,posS,negS,hT,labor);
  var ll=llM===1.8?t('ll_match'):t('ll_miss');
  var an={anxious:t('at_anx'),avoidant:t('at_avo'),fearful:t('at_fea'),secure:t('at_sec')}[myAt]||'';
  var sl=structT.length>0?t('sl_l5',{n:sNote}):'';
  var pl=pTot>0?(t('pl_mkt',{l:lT.toLocaleString(),s:shT.toLocaleString()})+(lT>shT?t('pl_mktlong'):t('pl_mktshort'))):'';
  var vt={
    Liquidate:t('vt_liq',{s:score,v:vol})+sl+pl,
    Reduce:t('vt_red',{s:score,v:vol,ll:ll,an:an})+sl+pl,
    Hold:t('vt_hold',{s:score,pe:pe,cf:cf,ll:ll,an:an})+sl+pl,
    'Strong Buy':t('vt_buy',{s:score,pe:pe,cf:cf,v:vol,ll:ll,an:an})+sl+pl
  };
  return{score:score,verdict:vd,emoji:em,desc:de,phase:ph,color:co,peScore:peS,cfScore:cfS,volatility:vol,flags:fl,flagTypes:ft,klinePts:kp,analysis:vt[vd]||vt.Hold,sNote:sNote,structT:structT,hasCrisis:hasCrisis,crisisList:crisisList,hasControl:hasControl,controlList:controlList,
    breakdown:{base:Math.round(base),posTotal:Math.round(pT2),negTotal:Math.round(nT),hardTotal:hT,softTotal:sT2,macroTotal:Math.round(mT),labor:labor,laborPen:LP.pen,gapPen:gapPen},laborStats:LP.stats,laborSkew:LP.skew,stabA:sA,stabB:sB,stabGap:stabGap};
}
function startAn(){
  var r=cur();if(!r){tst(t('ts_createfirst'));goTab('pf');return}
  if(r.joined){tst(t('owner_only'));goTab('pd');return}
  var ev=$('evt').value.trim(),ch=document.querySelectorAll('#pos-c .chip.on,#neg-c .chip.on,#hard-c .chip.on').length;
  if(!ev&&!ch){$('evt').focus();tst(t('ts_needevent'));return}
  $('a-form').style.display='none';$('a-an').style.display='block';$('scroll').scrollTop=0;
  var steps=[t('an1'),t('an2'),t('an3'),t('an4'),t('an5'),t('an6'),t('an7'),t('an8'),t('an9'),t('an10')];
  var log=$('prog');log.innerHTML='';var i=0;
  var iv=setInterval(function(){if(i<steps.length){var d=document.createElement('div');d.className='pit';d.innerHTML='<div class="pdt"></div>'+steps[i];log.appendChild(d);i++}},370);
  setTimeout(async function(){
    clearInterval(iv);
    var R=runEngine();
    r.result=R;
    if(r.status==='closed'){r.status='none';r.positions=[]}
    var snap = snapForm();
    r.form = snap;
    if(BACKEND_READY){
      try{
        await apiSaveResult(r.id, R, snap);
        await apiAddAssessment(r.id, R, snap);
        await syncOne(r.id);
      }catch(e){ console.warn('保存评估失败',e); tst('评估保存失败，请重试'); }
    }else{
      if(!r.history)r.history=[];
      r.history.push({score:R.score,verdict:R.verdict,ts:Date.now()});
      save();
    }
    _rptLoadedFor = r.id;
    renderPD(); showResult(R);
  },4000);
}
function showResult(R, silent){
  window._lastResult=R;
  $('a-an').style.display='none';$('a-form').style.display='block';
  var c=R.color;
  var fH='';for(var i=0;i<R.flags.length;i++)fH+='<span class="fl-'+(R.flagTypes[i]||'y')+'">'+R.flags[i]+'</span>';
  var rows=[[t('bd_base'),R.breakdown.base,R.breakdown.base>0?'#00d68f':'#ff4d6d'],[t('bd_pos'),R.breakdown.posTotal,'#00d68f'],[t('bd_neg'),R.breakdown.negTotal,'#ff4d6d'],[t('bd_hard'),R.breakdown.hardTotal||0,R.breakdown.hardTotal<0?'#ff4d6d':'#00d68f'],[t('bd_soft'),R.breakdown.softTotal||0,R.breakdown.softTotal<0?'#ffbe0b':'#00d68f'],[t('bd_macro'),R.breakdown.macroTotal||0,R.breakdown.macroTotal>=0?'#00d68f':'#ffbe0b'],[t('bd_labor'),R.breakdown.labor||0,R.breakdown.labor<0?'#ffbe0b':'#00d68f'],[t('bd_laborpen'),R.breakdown.laborPen||0,R.breakdown.laborPen<0?'#ff4d6d':'#00d68f'],[t('bd_gap'),R.breakdown.gapPen||0,R.breakdown.gapPen<0?'#ff4d6d':'#00d68f']];
  var bR='';for(var j=0;j<rows.length;j++){var rr=rows[j];bR+='<div class="brw"><span class="brl">'+rr[0]+'</span><span class="brv" style="color:'+rr[2]+'">'+(rr[1]>0?'+':'')+rr[1]+'</span></div>'}
  var sH=R.structT.length>0?'<div class="l5">'+t('l5')+(R.sNote||t('l5def'))+'</div>':'';
  if(R.hasCrisis){
    $('rpt').innerHTML = crisisCard(R) +
      '<div class="dis">'+t('cri_note')+'</div>'+
      '<button class="rst" onclick="goTab(\'dt\')">'+t('back_dt')+'</button><div style="height:6px"></div>';
    if(!silent){
      var sn0=document.querySelectorAll('.snav');for(var k0=0;k0<sn0.length;k0++)sn0[k0].classList.remove('on');
      var sb0=document.querySelectorAll('.sub');for(var m0=0;m0<sb0.length;m0++)sb0[m0].classList.remove('on');
      sn0[1].classList.add('on');$('sub-rp').classList.add('on');$('scroll').scrollTop=0;
    }
    return;
  }
  $('rpt').innerHTML=
   crisisCard(R)+
   '<div class="vc" style="background:'+c+'10;border-color:'+c+'30"><div><div class="vcs" style="color:'+c+'">'+t('sig')+'</div><div class="vca" style="color:'+c+'">'+R.verdict+'</div><div class="vcd">'+R.desc+'</div></div><div class="vce">'+R.emoji+'</div></div>'+
   '<div class="sg"><div class="sc"><div class="scl">'+t('score_pe')+'</div><div class="scv" style="color:'+(R.peScore>60?'#00d68f':'#ff4d6d')+'">'+R.peScore+'</div></div><div class="sc"><div class="scl">'+t('score_cf')+'</div><div class="scv" style="color:'+(R.cfScore>60?'#00d68f':'#ff4d6d')+'">'+R.cfScore+'</div></div><div class="sc"><div class="scl">'+t('score_vol')+'</div><div class="scv" style="color:'+(R.volatility<40?'#00d68f':R.volatility<65?'#ffbe0b':'#ff4d6d')+'">'+R.volatility+'</div></div></div>'+
   '<div class="bk"><div class="bkt">'+t('bd_title')+'</div>'+bR+'<div class="brw" style="border-top:1px solid var(--b2);margin-top:3px"><span style="font-weight:700;color:var(--t1);font-size:10px">'+t('bd_total')+'</span><span style="color:'+c+';font-size:15px;font-weight:800;font-family:Syne,sans-serif">'+R.score+'</span></div></div>'+
   '<div class="ac"><div class="act">'+t('rpt_title')+'</div><div class="acb" id="stx"><span class="cur"></span></div><div class="fls">'+fH+'</div>'+sH+'</div>'+
   labCard(R)+
   '<div class="ac"><div class="act" style="margin-bottom:8px">'+t('kline_title')+'</div><canvas id="rk" style="width:100%;height:140px;display:block"></canvas><div style="font-size:9px;color:var(--t3);margin-top:6px;text-align:center">'+t('kline_cap')+'</div></div>'+
   '<div class="dis">'+t('disclaim')+'</div>'+
   '<button class="rst" onclick="goTab(\'dt\')">'+t('back_dt')+'</button><div style="height:6px"></div>';
  setTimeout(function(){var cv=$('rk');if(cv&&cv.offsetWidth){var dpr=window.devicePixelRatio||1,W=cv.offsetWidth,H=140;cv.width=W*dpr;cv.height=H*dpr;var ctx=cv.getContext('2d');ctx.scale(dpr,dpr);ctx.strokeStyle='rgba(255,255,255,.04)';ctx.lineWidth=1;var gl=[.25,.5,.75];for(var g=0;g<gl.length;g++){var y=6+(H-12)*gl[g];ctx.beginPath();ctx.moveTo(6,y);ctx.lineTo(W-6,y);ctx.stroke()}drawK(ctx,W,H,R.klinePts,c)}},120);
  var b=$('stx');b.innerHTML='';
  if(silent){
    b.textContent=R.analysis;
  }else{
    var cu=document.createElement('span');cu.className='cur';b.appendChild(cu);
    var ix=0,tx=R.analysis;
    var ti=setInterval(function(){if(ix<tx.length){cu.parentNode.insertBefore(document.createTextNode(tx[ix]),cu);ix++}else{clearInterval(ti);cu.remove()}},12);
  }
  if(!silent){
    var sn=document.querySelectorAll('.snav');for(var k=0;k<sn.length;k++)sn[k].classList.remove('on');
    var _sb=document.querySelectorAll('.sub');for(var m=0;m<_sb.length;m++)_sb[m].classList.remove('on');
    sn[1].classList.add('on');$('sub-rp').classList.add('on');$('scroll').scrollTop=0;
    tst(t('ts_assessdone'));
  }
}

/* ═══ INIT ═══ */
renderLabor();
updStab();
applyI18n();

(async function boot(){
  var ok = await initBackend();
  setNetBadge();

  if(ok){
    try{ localStorage.removeItem('lovetrade_v2') }catch(e){}   // 云端为准
    DB={coins:0,rels:[],active:null};
    await syncAll();
    await handlePendingJoin();
    if(DB.rels.length && !cur()) DB.active=DB.rels[0].id;
  }else{
    load();
    await handlePendingJoin();
    if(DB.rels.length && !cur()) DB.active=DB.rels[0].id;
  }

  renderPF();
  if(cur()) { goTab('dt'); } else { goTab('pf'); }
  watchActive();
})();

/* 订阅当前关系的实时变化 */
var _watching = null;
function watchActive(){
  if(!BACKEND_READY) return;
  var r = cur();
  if(!r){ apiUnsubscribe(); _watching=null; return }
  if(_watching === r.id) return;
  _watching = r.id;
  apiSubscribe(r.id, async function(kind, payload){
    await syncOne(r.id);
    if($('s-dt').classList.contains('on')){ renderDT(); setTimeout(drawDT,60) }
    if($('s-pd').classList.contains('on')) renderPD();
    if($('s-pf').classList.contains('on')) renderPF();
    if(kind==='position') tst(t('rt_bet'));
    else if(kind==='lot')  tst(t('rt_lot'));
  });
}

window.addEventListener('resize',function(){if($('s-dt').classList.contains('on'))setTimeout(drawDT,60)});
