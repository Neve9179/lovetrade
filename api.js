/* ═══════════════════════════════════════════════════════════
   LoveTrade · 数据层
   ───────────────────────────────────────────────────────────
   目前这个文件是空的 —— 所有数据都存在浏览器本地。
   接入 Supabase 后端时，所有与数据库对话的代码都会放在这里，
   不会跟界面逻辑（app.js）混在一起。

   现在保留这个文件，是为了：
   1. 提前占好位置，接后端时不用再改 index.html
   2. 让「数据从哪来」这件事有一个固定的去处
   ═══════════════════════════════════════════════════════════ */

/* 后端开关：接入 Supabase 后改成 true */
var USE_BACKEND = false;

/* Supabase 配置（接入时填写）
var SUPABASE_URL = '';
var SUPABASE_KEY = '';
var sb = null;
*/

/* 接入后端后，这里会有这些函数：
   initAuth()              匿名登录
   createRelationship()    创建关系
   getByTicker()           按代号查关系
   myRelationships()       我参与的所有关系
   openPosition()          开仓
   addPosition()           加仓
   cutPosition()           减仓
   closePosition()         平仓
   joinAsRole()            以某个身份加入并领取硬币
   gradeQuiz()             服务端评分（朋友拿不到标准答案）
   placeBet()              下注
   getPositions()          读取所有下注
   settleAll()             平仓结算
   subscribeToRelationship()  实时订阅 —— 别人下注，你的页面自动更新
*/
