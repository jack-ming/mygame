<script setup>
import { computed, ref, onMounted } from 'vue'
import {
  Activity,
  Banknote,
  Brain,
  BriefcaseBusiness,
  Download,
  GraduationCap,
  Heart,
  RefreshCw,
  Sparkles,
  Trophy,
  Upload,
  Users,
} from '@lucide/vue'

const families = [
  {
    id: 'wealthy',
    name: '富二代家庭',
    desc: '资源充足，见识面广，但容易缺少现实压力。',
    wealth: 82,
    happiness: 68,
    health: 76,
    education: 32,
    network: 34,
    grit: -4,
    risk: 14,
  },
  {
    id: 'middle',
    name: '普通职工家庭',
    desc: '收入稳定，支持有限，人生多靠长期积累。',
    wealth: 40,
    happiness: 64,
    health: 70,
    education: 18,
    network: 10,
    grit: 8,
    risk: 6,
  },
  {
    id: 'smallBiz',
    name: '小生意家庭',
    desc: '现金流时好时坏，从小接触交易与人情。',
    wealth: 50,
    happiness: 59,
    health: 67,
    education: 13,
    network: 20,
    grit: 12,
    risk: 18,
  },
  {
    id: 'rural',
    name: '农村务农家庭',
    desc: '生活朴素，经济压力明显，但韧性很强。',
    wealth: 24,
    happiness: 56,
    health: 73,
    education: 7,
    network: 4,
    grit: 21,
    risk: 4,
  },
  {
    id: 'lowIncome',
    name: '低收入临工家庭',
    desc: '资源稀缺，成长过程更容易被现实打断。',
    wealth: 13,
    happiness: 46,
    health: 59,
    education: 2,
    network: 2,
    grit: 25,
    risk: -4,
  },
  {
    id: 'scholar',
    name: '教师书香家庭',
    desc: '金钱不宽裕，但学习环境和方法意识较好。',
    wealth: 36,
    happiness: 66,
    health: 68,
    education: 30,
    network: 11,
    grit: 10,
    risk: 0,
  },
]

const talents = [
  { id: 'math', name: '擅长数学计算', study: 18, career: 6, art: 0, sport: 0, business: 3 },
  { id: 'music', name: '擅长音乐', study: 3, career: 0, art: 20, sport: 0, business: 4 },
  { id: 'art', name: '擅长美术', study: 3, career: 2, art: 22, sport: 0, business: 3 },
  { id: 'sport', name: '擅长体育', study: 0, career: 3, art: 0, sport: 23, business: 1 },
  { id: 'social', name: '社交表达强', study: 2, career: 12, art: 5, sport: 0, business: 16 },
]

const stageDefinitions = [
  {
    id: 'childhood',
    age: '6-12 岁',
    title: '小学阶段',
    prompt: '家庭资源决定了起点，但一次现实分流也会发生。',
    options: [
      {
        text: '进入重点公立小学',
        requirements: { minWealth: 35, minEducation: 18 },
        unavailable: '家庭资源或教育环境不足，进重点公立小学概率太低。',
        result: {
          note: '你进入了管理严格的学校，学习习惯被较早建立。',
          stats: { wealth: -3, happiness: -2, health: -1, study: 16, network: 4 },
        },
      },
      {
        text: '进入普通公立小学',
        result: {
          note: '你按部就班上学，资源普通，但仍有向上空间。',
          stats: { wealth: -1, happiness: 1, health: 1, study: 8, grit: 3 },
        },
      },
      {
        text: '上私立或双语学校',
        requirements: { minWealth: 55 },
        unavailable: '学费太高，家庭支撑不了。',
        result: {
          note: '你接触了更丰富的课程和圈子，但家庭经济压力不小。',
          stats: { wealth: -6, happiness: 3, health: 1, study: 12, network: 8, social: 4 },
        },
      },
      {
        text: '借读或频繁转学',
        result: {
          note: '你跟着家庭迁移，适应能力变强，学习连续性受影响。',
          stats: { wealth: -2, happiness: -7, health: -2, study: -2, grit: 9, social: 5 },
        },
      },
      {
        text: '没钱稳定上学，半工半读',
        result: {
          note: '家庭压力很早压到你身上，赚钱意识提前出现。',
          stats: { wealth: 4, happiness: -11, health: -6, study: -12, grit: 16, business: 8 },
        },
      },
      {
        text: '直接辍学打工',
        result: {
          note: '你过早进入劳动市场，短期有收入，长期学历门槛变高。',
          stats: { wealth: 8, happiness: -16, health: -10, study: -24, career: 3, business: 6 },
          flags: { dropout: true },
        },
      },
    ],
  },
  {
    id: 'highschool',
    age: '13-18 岁',
    title: '高中阶段',
    prompt: '努力、天赋和运气共同影响高考。',
    options: [
      {
        text: '高度自律，努力学习',
        result: {
          note: '你把大部分时间投入学习，成绩显著提升，但压力也上来了。',
          stats: { happiness: -7, health: -5, study: 24, grit: 7 },
        },
      },
      {
        text: '正常学习，兼顾生活',
        result: {
          note: '你保持稳定节奏，成绩不爆炸，但身心状态更均衡。',
          stats: { happiness: 3, health: 2, study: 11, social: 3 },
        },
      },
      {
        text: '参加艺体特长路线',
        result: {
          note: '你把天赋转化为升学筹码，成本和不确定性都不低。',
          stats: { wealth: -6, happiness: 2, health: 2, study: 3, art: 9, sport: 9 },
        },
      },
      {
        text: '荒废学业，沉迷娱乐',
        result: {
          note: '短期轻松，但基础知识和学习习惯被拉开差距。',
          stats: { happiness: 9, health: -3, study: -18, grit: -5 },
        },
      },
      {
        text: '走军校或国防生路线',
        requirements: { minHealth: 55 },
        unavailable: '身体条件不达标。',
        result: {
          note: '纪律严苛，但你获得了学费全免和强健体魄。',
          stats: { wealth: 3, happiness: -4, health: 10, study: 8, grit: 14, career: 4 },
        },
      },
      {
        text: '出国读高中',
        requirements: { minWealth: 60, minStudy: 30 },
        unavailable: '经济和学业条件不够出国。',
        result: {
          note: '你提前适应了国外教育体系，但远离家乡也不容易。',
          stats: { wealth: -10, happiness: -2, health: 1, study: 10, network: 6, social: 5 },
          event: 'studyAbroad',
        },
      },
      {
        text: '继续打工补贴家庭',
        result: {
          note: '现实压力让你更早懂钱，但学习时间被严重挤压。',
          stats: { wealth: 7, happiness: -9, health: -8, study: -13, business: 8, grit: 9 },
        },
      },
    ],
    event: 'gaokao',
  },
  {
    id: 'earlywork',
    age: '13-22 岁',
    title: '早入社会',
    prompt: '学历通道提前变窄，但技术、客户、现金流和自学仍可能改变轨迹。',
    options: [
      {
        text: '做低门槛体力或服务工作',
        result: {
          note: '你很早开始挣钱，生活经验增加，但收入天花板明显。',
          stats: { wealth: 12, happiness: -4, health: -10, career: 5, grit: 10 },
        },
      },
      {
        text: '跟师傅学一门手艺',
        result: {
          note: '你用时间换技能，前期收入一般，后期稳定性更好。',
          stats: { wealth: 8, happiness: 1, health: -5, career: 12, business: 3, grit: 7 },
        },
      },
      {
        text: '摆摊或做小买卖',
        result: {
          note: '你开始理解成本、客流和复购，也承担了更直接的风险。',
          stats: { wealth: 10, happiness: -2, health: -7, business: 18, social: 7 },
        },
      },
      {
        text: '进厂做流水线工人',
        result: {
          note: '工作单调重复，收入稳定但很低，身体磨损严重。',
          stats: { wealth: 10, happiness: -8, health: -12, career: 3, grit: 8 },
        },
      },
      {
        text: '打工同时自学补学历',
        result: {
          note: '你走得更慢，但重新打开了一部分学历和技能门槛。',
          stats: { wealth: 4, happiness: -5, health: -8, study: 14, career: 7, grit: 12 },
        },
      },
      {
        text: '自学技术，抓住互联网机会',
        result: {
          note: '没有学历，但互联网给了你一个不看出身的赛道。',
          stats: { wealth: 5, happiness: -3, health: -5, study: 12, career: 9, grit: 7 },
        },
      },
    ],
  },
  {
    id: 'college',
    age: '18-22 岁',
    title: '大学阶段',
    prompt: '大学不只给学历，也给方法、人脉和试错机会。',
    options: [
      {
        text: '一心打游戏',
        result: {
          note: '你收获了快乐和圈子，但专业积累明显不足。',
          stats: { happiness: 10, health: -7, study: -20, career: -8, social: 3 },
        },
      },
      {
        text: '只专注学业',
        result: {
          note: '专业基础扎实，适合继续深造，但社会经验偏少。',
          stats: { happiness: -3, health: -2, study: 22, career: 3, network: 2 },
        },
      },
      {
        text: '保证通过，学习赚钱技巧',
        result: {
          note: '你没有追求满绩点，但开始理解市场、客户和现金流。',
          stats: { wealth: 7, happiness: 3, health: -1, study: 4, business: 18, social: 8 },
        },
      },
      {
        text: '参加竞赛和项目',
        result: {
          note: '你在项目里积累履历，机会更多，压力也更硬。',
          stats: { wealth: -2, happiness: -2, health: -3, study: 14, career: 14, network: 7 },
        },
      },
      {
        text: '当学生会或社团干部',
        result: {
          note: '你练了协调和组织能力，人脉变广，但占用不少时间。',
          stats: { happiness: 2, health: -2, study: -4, career: 4, network: 10, social: 10 },
        },
      },
      {
        text: '大学就开始创业',
        result: {
          note: '你很早就试水商业，成败各半，但经验是真的。',
          stats: { wealth: -3, happiness: 1, health: -4, study: -6, business: 16, network: 6 },
          event: 'startupJoin',
        },
      },
    ],
  },
  {
    id: 'graduation',
    age: '22 岁',
    title: '毕业选择',
    prompt: '你要进入社会，还是继续延长学术路线？',
    options: [
      {
        text: '直接就业',
        result: {
          note: '你进入职场，收入开始稳定，但上限取决于行业和个人策略。',
          stats: { wealth: 10, happiness: 0, health: -2, career: 8 },
          next: 'work',
        },
      },
      {
        text: '继续考研',
        result: {
          note: '你继续冲学历，短期收入推迟，长期专业门槛提高。',
          stats: { wealth: -7, happiness: -3, health: -3, study: 10, career: 3 },
          next: 'postgrad',
        },
      },
      {
        text: '考公务员',
        result: {
          note: '你把筹码压在了体制内考试上，结果取决于积累和运气。',
          stats: { happiness: -2, health: -2 },
          event: 'civilService',
          next: 'work',
        },
      },
      {
        text: '出国读研',
        requirements: { minWealth: 35, minStudy: 35 },
        unavailable: '经济或学业条件不够申请出国。',
        result: {
          note: '你投入大量时间和金钱准备，结果取决于申请运气。',
          stats: { wealth: -8, happiness: -1, study: 4 },
          event: 'studyAbroad',
          next: 'postgrad',
        },
      },
      {
        text: '参加支教或西部计划',
        result: {
          note: '你选择先去基层服务两年，履历加分但收入推迟。',
          stats: { wealth: -4, happiness: 6, health: -3, study: 2, grit: 10, network: 4 },
          next: 'work',
        },
      },
    ],
  },
  {
    id: 'postgrad',
    age: '23-25 岁',
    title: '研究生阶段',
    prompt: '研究生阶段决定你是继续学术积累，还是向产业靠拢。',
    options: [
      {
        text: '专注学术研究',
        result: {
          note: '你论文和研究能力增强，适合更高学历或研发岗位。',
          stats: { wealth: -5, happiness: -4, health: -4, study: 22, career: 5 },
        },
      },
      {
        text: '边读研边实习',
        result: {
          note: '你把学历和职场经验结合起来，就业竞争力更实际。',
          stats: { wealth: 4, happiness: -2, health: -4, study: 10, career: 16, network: 8 },
        },
      },
      {
        text: '延续大学玩法，得过且过',
        result: {
          note: '学历拿到了，但核心竞争力增长有限。',
          stats: { happiness: 6, health: -2, study: -5, career: -3 },
        },
      },
      {
        text: '积极参加行业会议和竞赛',
        result: {
          note: '你用学术平台拓展行业人脉，机会变多但精力分散。',
          stats: { happiness: -1, health: -3, study: 6, career: 8, network: 10, social: 5 },
        },
      },
    ],
  },
  {
    id: 'phdchoice',
    age: '25 岁',
    title: '硕士毕业',
    prompt: '是否继续考博，决定你是否把人生押到更长的学术周期。',
    options: [
      {
        text: '继续考博',
        result: {
          note: '你进入更长周期，精神压力上升，但专业壁垒更深。',
          stats: { wealth: -10, happiness: -7, health: -6, study: 26, career: 7 },
          next: 'academic',
        },
      },
      {
        text: '申请海外博士',
        requirements: { minStudy: 50, minNetwork: 12 },
        unavailable: '学术成果或推荐信不够申请海外博士。',
        result: {
          note: '海外博士含金量更高，但申请和适应都有风险。',
          stats: { wealth: -8, happiness: -4, health: -3, study: 8 },
          event: 'studyAbroad',
          next: 'academic',
        },
      },
      {
        text: '硕士毕业就业',
        result: {
          note: '你带着学历优势进入职场，起点更高。',
          stats: { wealth: 12, happiness: 1, health: -2, career: 14 },
          next: 'work',
        },
      },
    ],
  },
  {
    id: 'academic',
    age: '26-30 岁',
    title: '博士与科研',
    prompt: '学术道路回报更慢，也更依赖方向、导师、成果和机会。',
    options: [
      {
        text: '持续产出，冲高校和研究院',
        result: {
          note: '你换来专业声誉，但牺牲了不少生活弹性。',
          stats: { wealth: 9, happiness: -4, health: -7, study: 22, career: 20, network: 9 },
        },
      },
      {
        text: '博士毕业转产业研发',
        result: {
          note: '你把深度能力转到高门槛岗位，收入兑现更直接。',
          stats: { wealth: 24, happiness: 2, health: -4, career: 24, business: 3 },
        },
      },
      {
        text: '专注成果转化和专利',
        result: {
          note: '你把研究成果推向市场，收入比纯学术好，但不确定性也高。',
          stats: { wealth: 6, happiness: 1, health: -5, study: 10, career: 12, business: 14 },
          event: 'startupJoin',
        },
      },
    ],
  },
  {
    id: 'work',
    age: '23-33 岁',
    title: '职场十年',
    prompt: '工作态度会决定薪资曲线，也会改变健康和幸福。',
    options: [
      {
        text: '只完成分内工作，得过且过',
        result: {
          note: '你获得稳定生活，但能力和收入增长较慢。',
          stats: { wealth: 14, happiness: 7, health: 3, career: 3 },
        },
      },
      {
        text: '深入研究工作，升职加薪',
        result: {
          note: '你愿意承担难题，职位和收入上升，压力同步增加。',
          stats: { wealth: 28, happiness: -3, health: -7, career: 24, network: 7 },
        },
      },
      {
        text: '利用业余时间发展副业',
        result: {
          note: '你把工资作为安全垫，用副业寻找第二曲线。',
          stats: { wealth: 20, happiness: -2, health: -9, career: 8, business: 24 },
        },
      },
      {
        text: '频繁跳槽追涨薪',
        result: {
          note: '你用市场机会提升收入，但稳定性和人际信用会波动。',
          stats: { wealth: 23, happiness: -4, health: -4, career: 13, network: -2 },
        },
      },
      {
        text: '注重工作生活平衡',
        result: {
          note: '你拒绝过度消耗，收入增长慢一些，但身心状态更稳定。',
          stats: { wealth: 7, happiness: 9, health: 7, career: 2 },
        },
      },
      {
        text: '加入创业公司拿期权',
        result: {
          note: '你赌一把，用稳定工作换了不确定的期权和成长。',
          stats: { happiness: -2, health: -5 },
          event: 'startupJoin',
        },
      },
      {
        text: '转行考公务员/体制内',
        requirements: { minStudy: 25 },
        unavailable: '学业基础太差，考公希望渺茫。',
        result: {
          note: '你放弃现有积累，重新投入体制考试，结果看积累和运气。',
          stats: { happiness: -3, health: -2, career: -4 },
          event: 'civilService',
        },
      },
    ],
  },
  {
    id: 'marriage',
    age: '26-33 岁',
    title: '婚姻与家庭',
    prompt: '是否组建家庭？这个决定将深刻影响你的财富、幸福和未来选择。',
    options: [
      {
        text: '结婚生子',
        result: {
          note: '你组建了家庭，获得了情感支撑，但也承担了更大的经济压力和责任。',
          stats: { wealth: -12, happiness: 13, health: 2, social: 7, network: 4, grit: 3 },
          flags: { married: true, hasChild: true },
        },
      },
      {
        text: '结婚，暂时不要孩子',
        result: {
          note: '两个人一起扛生活，经济压力相对可控，但迟早要面对生娃的选择。',
          stats: { wealth: -5, happiness: 9, health: 1, social: 5 },
          flags: { married: true },
        },
      },
      {
        text: '被催婚，相亲妥协',
        result: {
          note: '你在家庭压力下结了婚，感情基础一般，但至少堵住了长辈的嘴。',
          stats: { wealth: -8, happiness: -2, health: 0, social: 4, grit: 2 },
          flags: { married: true },
        },
      },
      {
        text: '先不结婚，专注事业',
        result: {
          note: '你把精力集中在自我提升上，经济更自由，但独自扛压力也不小。',
          stats: { wealth: 7, happiness: -3, career: 5, grit: 3 },
          flags: { single: true },
        },
      },
      {
        text: '遇到对的人，裸婚',
        requirements: { minGrit: 15 },
        unavailable: '心态和韧性还不够成熟，还没准备好面对裸婚的挑战。',
        result: {
          note: '物质不多，但你们决定一起扛。压力更大，幸福感也更纯粹。',
          stats: { wealth: -3, happiness: 16, health: 3, grit: 7, social: 5 },
          flags: { married: true },
        },
      },
    ],
  },
  {
    id: 'housing',
    age: '28-36 岁',
    title: '安居决策',
    prompt: '房子是最大的资产，也是最大的负债。你的选择会影响未来几十年的现金流。',
    options: [
      {
        text: '掏空积蓄贷款买房',
        requirements: { minWealth: 38 },
        unavailable: '首付都不够，贷款买房暂时不现实。',
        result: {
          note: '你背上房贷，有了稳定的居所，但每月还款压力开始影响生活质量。',
          stats: { wealth: -18, happiness: 5, health: -2, grit: 3 },
          flags: { homeowner: true },
        },
      },
      {
        text: '继续租房，保持灵活',
        result: {
          note: '你没有被房贷绑定，保持了流动性，但缺少资产积累的锚点。',
          stats: { wealth: -3, happiness: -2, health: 1 },
        },
      },
      {
        text: '在家乡或小城市买房',
        result: {
          note: '你用更低的成本解决了住房，但距离大城市的机会更远了。',
          stats: { wealth: -9, happiness: 3, health: 2, career: -3 },
          flags: { homeowner: true },
        },
      },
      {
        text: '家里帮忙全款或首付',
        requirements: { minWealth: 65 },
        unavailable: '家庭资源不够支撑买房。',
        result: {
          note: '家庭帮你解决了最大的支出，你的人生起点和别人不一样。',
          stats: { wealth: -5, happiness: 9, health: 2, network: 2 },
          flags: { homeowner: true },
        },
      },
      {
        text: '和伴侣或朋友合伙买房',
        requirements: { minNetwork: 20 },
        unavailable: '没有足够的信任关系和人脉来合伙。',
        result: {
          note: '你分担了压力，但也多了一层关系风险。',
          stats: { wealth: -10, happiness: 3, health: 0, network: 3, social: 3 },
          flags: { homeowner: true },
        },
      },
    ],
  },
  {
    id: 'midlife',
    age: '35-45 岁',
    title: '中年分岔',
    prompt: '这个阶段更考验复利：积累、家庭、身体和风险偏好一起结算。',
    options: [
      {
        text: '稳健发展，重视家庭和健康',
        result: {
          note: '你放慢冒险节奏，生活质量和身体状态更稳。',
          stats: { wealth: 16, happiness: 14, health: 12, career: 5 },
        },
      },
      {
        text: '冲击管理层或专家岗',
        result: {
          note: '你投入大量精力竞争关键岗位，结果取决于积累和运气。',
          stats: { happiness: -3, health: -5 },
          event: 'promotion',
        },
      },
      {
        text: '副业转创业',
        result: {
          note: '你开始承担商业风险，成败取决于经验、现金流与运气。',
          stats: { wealth: -6, happiness: -5, health: -10, business: 24, career: 6 },
          event: 'startup',
        },
      },
      {
        text: '中年转行，重新出发',
        result: {
          note: '你放弃了积累多年的行业，赌一个新方向。',
          stats: { happiness: -2, health: -3, wealth: -4 },
          event: 'careerSwitch',
        },
      },
      {
        text: '长期透支，维持高收入',
        result: {
          note: '你赚到了更多钱，但身体和关系被透支。',
          stats: { wealth: 38, happiness: -10, health: -22, career: 16 },
        },
      },
      {
        text: '身体亮红灯，被迫调整',
        requirements: { maxHealth: 40 },
        unavailable: '你身体还行，还没到这个地步。',
        result: {
          note: '身体发出严重警告，你不得不放弃一部分收入来换健康。',
          stats: { wealth: -8, happiness: -4, health: 14, career: -6, grit: 4 },
        },
      },
    ],
  },
  {
    id: 'late',
    age: '45-60 岁',
    title: '阶段性成果',
    prompt: '最后一段不是简单冲刺，而是看前面积累如何兑现。',
    options: [
      {
        text: '逐步稳定，守住资产和生活',
        result: {
          note: '你把风险降下来，阶段成果更稳健。',
          stats: { wealth: 20, happiness: 12, health: 7 },
        },
      },
      {
        text: '继续扩张事业',
        result: {
          note: '你仍在争取更高天花板，收益和压力都被放大。',
          stats: { wealth: 34, happiness: -2, health: -10, career: 13, business: 10 },
          event: 'lateCareer',
        },
      },
      {
        text: '回归生活，减少工作投入',
        result: {
          note: '你降低收入增速，换回时间、关系和健康。',
          stats: { wealth: 8, happiness: 20, health: 16, career: -2 },
        },
      },
      {
        text: '半退休，带带年轻人',
        result: {
          note: '你开始传授经验，收入减少但成就感和自由度上升。',
          stats: { wealth: 4, happiness: 14, health: 8, network: 6, career: -4 },
        },
      },
      {
        text: '搞个兴趣爱好变现',
        result: {
          note: '你把积累多年的爱好变成小生意，赚的不多但快乐。',
          stats: { wealth: 6, happiness: 16, health: 4, business: 8 },
        },
      },
    ],
    ending: true,
  },
]

const randomEvents = [
  {
    id: 'illness',
    title: '突发疾病',
    text: '身体突然出了问题，需要住院治疗，花费了不少钱和时间。',
    condition: (g) => g.health < 48 && g.wealth > 14,
    stats: { wealth: -9, health: -7, happiness: -5 },
    tone: 'bad',
  },
  {
    id: 'familyCrisis',
    title: '家庭变故',
    text: '家里出了意外，你不得不回去处理，时间和金钱都受了影响。',
    condition: (g) => g.wealth > 18,
    stats: { wealth: -7, happiness: -9, health: -2, grit: 4 },
    tone: 'bad',
  },
  {
    id: 'bonus',
    title: '意外收入',
    text: '一次意想不到的机会让你获得了一笔额外收入。',
    condition: (g) => g.career > 28,
    stats: { wealth: 10, happiness: 5 },
    tone: 'good',
  },
  {
    id: 'mentor',
    title: '遇到贵人',
    text: '一位前辈给了你关键的建议和资源，人脉和视野都打开了。',
    condition: (g) => g.network > 14,
    stats: { network: 7, career: 5, happiness: 3 },
    tone: 'good',
  },
  {
    id: 'economicDownturn',
    title: '经济下行',
    text: '行业不景气，收入缩水，你开始重新评估风险。',
    condition: (g) => g.wealth > 28,
    stats: { wealth: -10, happiness: -4, career: -3 },
    tone: 'bad',
  },
  {
    id: 'luckyInvestment',
    title: '投资小赚',
    text: '你之前的一次小额投资获得了不错的回报。',
    condition: (g) => g.business > 18 && g.wealth > 22,
    stats: { wealth: 12, happiness: 4, business: 3 },
    tone: 'good',
  },
  {
    id: 'childJoy',
    title: '孩子带来惊喜',
    text: '孩子的一个瞬间让你觉得一切都值得。',
    condition: (g) => g.flags.hasChild,
    stats: { happiness: 9, grit: 2 },
    tone: 'good',
  },
  {
    id: 'healthWakeUp',
    title: '体检警告',
    text: '体检结果不太理想，你开始认真对待身体。',
    condition: (g) => g.health < 42,
    stats: { health: 5, wealth: -3, happiness: -2 },
    tone: 'bad',
  },
]

const initialState = () => ({
  wealth: 0,
  happiness: 0,
  health: 0,
  study: 0,
  career: 0,
  business: 0,
  art: 0,
  sport: 0,
  social: 0,
  network: 0,
  grit: 0,
  family: null,
  talents: [],
  flags: {},
  log: [],
  route: ['childhood', 'highschool', 'college', 'graduation'],
  currentRouteIndex: 0,
  finished: false,
})

const game = ref(initialState())

const currentStage = computed(() => stageDefinitions.find((stage) => stage.id === game.value.route[game.value.currentRouteIndex]))
const currentOptions = computed(() => {
  if (!currentStage.value) return []
  return currentStage.value.options.map((option) => ({
    ...option,
    disabled: !isAvailable(option),
  }))
})

const totals = computed(() => [
  { label: '财富', value: game.value.wealth, icon: Banknote },
  { label: '幸福', value: game.value.happiness, icon: Heart },
  { label: '健康', value: game.value.health, icon: Activity },
  { label: '学业', value: game.value.study, icon: GraduationCap },
  { label: '事业', value: game.value.career, icon: BriefcaseBusiness },
  { label: '人脉', value: game.value.network, icon: Users },
  { label: '综合评分', value: compositeScore.value, icon: Trophy },
])

const compositeScore = computed(() => {
  return Math.round(
    game.value.wealth * 0.24 +
      game.value.happiness * 0.2 +
      game.value.health * 0.22 +
      game.value.study * 0.1 +
      game.value.career * 0.14 +
      game.value.network * 0.04 +
      game.value.business * 0.06,
  )
})

const endingTitle = computed(() => {
  const score = compositeScore.value
  const { wealth, happiness, health, career, study, business } = game.value
  if (score >= 68 && wealth >= 60 && health >= 48) return '高质量跃迁人生'
  if (business >= 50 && wealth >= 55) return '创业兑现型人生'
  if (study >= 60 && career >= 50) return '专业壁垒型人生'
  if (happiness >= 56 && health >= 52) return '稳健幸福型人生'
  if (happiness >= 50 && game.value.flags.married && health >= 38) return '家庭幸福型人生'
  if (wealth >= 60 && health < 32) return '高收入透支型人生'
  if (score >= 45) return '稳步上升型人生'
  if (health < 28 || happiness < 25) return '压力警戒型人生'
  return '普通起伏型人生'
})

const endingText = computed(() => {
  const age = game.value.health >= 48 ? '60 岁' : '55 岁'
  const married = game.value.flags.married ? '你组建了家庭，' : ''
  const homeowner = game.value.flags.homeowner ? '有了自己的房子，' : ''
  return `${age} 时回看，${married}${homeowner}你的财富为 ${game.value.wealth}，幸福为 ${game.value.happiness}，健康为 ${game.value.health}。这不是单次选择的结果，而是出身、天赋、努力、风险和运气共同滚出来的一条曲线。`
})

function clamp(value) {
  return Math.max(0, Math.min(96, Math.round(value)))
}

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function pickMany(list, count) {
  const pool = [...list]
  const result = []
  while (result.length < count && pool.length) {
    result.push(pool.splice(rand(0, pool.length - 1), 1)[0])
  }
  return result
}

function applyStats(stats = {}) {
  Object.entries(stats).forEach(([key, value]) => {
    game.value[key] = clamp((game.value[key] ?? 0) + value)
  })
}

function addLog(title, body, tone = 'neutral') {
  game.value.log.unshift({ title, body, tone })
}

function getTalentBonus(optionText) {
  const bonus = {}
  const ids = game.value.talents.map((t) => t.id)
  if (ids.includes('sport') && /体育|运动|锻炼|体能|艺体|军校/.test(optionText)) {
    bonus.health = 3
    bonus.sport = 4
  }
  if (ids.includes('math') && /数学|计算|理科|分析|技术|编程/.test(optionText)) {
    bonus.study = 4
    bonus.career = 2
  }
  if (ids.includes('music') && /音乐|乐器|表演|艺术|艺体/.test(optionText)) {
    bonus.art = 4
    bonus.happiness = 2
  }
  if (ids.includes('art') && /美术|绘画|设计|艺术|艺体/.test(optionText)) {
    bonus.art = 4
    bonus.happiness = 2
  }
  if (ids.includes('social') && /社交|沟通|表达|人际|人脉|学生会|干部/.test(optionText)) {
    bonus.network = 3
    bonus.social = 4
  }
  return bonus
}

function maybeRandomEvent() {
  if (Math.random() > 0.32) return
  const eligible = randomEvents.filter((e) => e.condition(game.value))
  if (!eligible.length) return
  const event = eligible[Math.floor(Math.random() * eligible.length)]
  applyStats(event.stats)
  addLog(event.title, event.text, event.tone)
}

function startGame() {
  const family = families[rand(0, families.length - 1)]
  const chosenTalents = pickMany(talents, rand(2, 3))
  showHistory.value = false
  game.value = initialState()
  game.value.family = family
  game.value.talents = chosenTalents
  applyStats({
    wealth: family.wealth,
    happiness: family.happiness,
    health: family.health,
    study: family.education,
    network: family.network,
    grit: family.grit,
    business: family.risk,
  })
  chosenTalents.forEach((talent) => {
    const { id, name, ...stats } = talent
    applyStats(stats)
  })
  addLog('出生设定', `${family.name}，天赋：${chosenTalents.map((item) => item.name).join('、')}。`, 'good')
}

function isAvailable(option) {
  const req = option.requirements
  if (!req) return true
  if (req.minWealth && game.value.wealth < req.minWealth) return false
  if (req.minEducation && game.value.study < req.minEducation) return false
  if (req.minGrit && game.value.grit < req.minGrit) return false
  if (req.minNetwork && game.value.network < req.minNetwork) return false
  if (req.minCareer && game.value.career < req.minCareer) return false
  if (req.minStudy && game.value.study < req.minStudy) return false
  if (req.minHealth && game.value.health < req.minHealth) return false
  if (req.noDropout && game.value.flags.dropout) return false
  if (req.maxHealth && game.value.health >= req.maxHealth) return false
  return true
}

function choose(option) {
  if (!isAvailable(option)) return

  applyStats(option.result.stats)

  const talentBonus = getTalentBonus(option.text)
  if (Object.keys(talentBonus).length > 0) {
    applyStats(talentBonus)
  }

  if (option.result.flags) game.value.flags = { ...game.value.flags, ...option.result.flags }

  const talentNote = Object.keys(talentBonus).length > 0 ? '（天赋发挥了作用）' : ''
  addLog(currentStage.value.title, `${option.text}。${option.result.note}${talentNote}`)

  if (currentStage.value.event === 'gaokao') resolveGaokao()
  if (option.result.event === 'startup') resolveStartup()
  if (option.result.event === 'lateCareer') resolveLateCareer()
  if (option.result.event === 'promotion') resolvePromotion()
  if (option.result.event === 'civilService') resolveCivilService()
  if (option.result.event === 'studyAbroad') resolveStudyAbroad()
  if (option.result.event === 'startupJoin') resolveStartupJoin()
  if (option.result.event === 'careerSwitch') resolveCareerSwitch()

  if (currentStage.value.id === 'childhood' && option.result.flags?.dropout) {
    game.value.route = ['childhood', 'earlywork', 'work', 'marriage', 'housing', 'midlife', 'late']
  }
  if (currentStage.value.id === 'graduation') setRouteAfterGraduation(option.result.next)
  else if (currentStage.value.id === 'phdchoice') setRouteAfterPhdChoice(option.result.next)

  if (currentStage.value.ending) {
    game.value.finished = true
    addLog('阶段结算', endingText.value, 'good')
    return
  }

  maybeRandomEvent()

  game.value.currentRouteIndex += 1
}

function setRouteAfterGraduation(next) {
  if (next === 'postgrad') {
    game.value.route = ['childhood', 'highschool', 'college', 'graduation', 'postgrad', 'phdchoice']
  } else {
    game.value.route = ['childhood', 'highschool', 'college', 'graduation', 'work', 'marriage', 'housing', 'midlife', 'late']
  }
}

function setRouteAfterPhdChoice(next) {
  const prefix = ['childhood', 'highschool', 'college', 'graduation', 'postgrad', 'phdchoice']
  game.value.route = next === 'academic'
    ? [...prefix, 'academic', 'marriage', 'housing', 'midlife', 'late']
    : [...prefix, 'work', 'marriage', 'housing', 'midlife', 'late']
}

function resolveGaokao() {
  if (game.value.flags.dropout) {
    applyStats({ study: -8, career: 2, business: 4 })
    addLog('高考节点', '你此前辍学，高考这条路基本关闭，人生进入更早的社会竞争。', 'bad')
    return
  }

  const ability = game.value.study * 0.6 + game.value.grit * 0.16 + game.value.happiness * 0.06 + game.value.health * 0.06
  const luck = rand(-20, 22)
  const score = ability + luck
  if (score >= 78) {
    applyStats({ study: 16, happiness: 8, career: 7, network: 7 })
    addLog('高考节点', `超常发挥，运气修正 ${luck}。你进入了更高平台。`, 'good')
  } else if (score >= 55) {
    applyStats({ study: 5, happiness: 2, career: 3 })
    addLog('高考节点', `正常发挥，运气修正 ${luck}。结果与长期积累基本匹配。`)
  } else {
    applyStats({ study: -5, happiness: -10, career: -2, grit: 6 })
    addLog('高考节点', `发挥失常，运气修正 ${luck}。这次挫折会影响起点，但不会直接判死刑。`, 'bad')
  }
}

function resolveStartup() {
  const chance = game.value.business * 0.46 + game.value.network * 0.2 + game.value.grit * 0.14 + game.value.wealth * 0.08 + rand(-26, 30)
  if (chance >= 68) {
    applyStats({ wealth: 38, happiness: 7, career: 10, business: 16 })
    addLog('创业节点', '产品、现金流和窗口期撞上了，你的创业取得明显突破。', 'good')
  } else if (chance >= 44) {
    applyStats({ wealth: 10, happiness: -2, health: -3, business: 8 })
    addLog('创业节点', '创业勉强跑通，但增长并不轻松，主要收获是经验。')
  } else {
    applyStats({ wealth: -22, happiness: -12, health: -7, business: 5, grit: 8 })
    addLog('创业节点', '项目没有穿越现金流压力，你付出代价，也补上了商业认知。', 'bad')
  }
}

function resolveLateCareer() {
  const chance = game.value.career * 0.34 + game.value.business * 0.22 + game.value.health * 0.16 + game.value.network * 0.12 + rand(-16, 22)
  if (chance >= 66) {
    applyStats({ wealth: 24, happiness: 3, career: 9 })
    addLog('后半程节点', '你抓住行业或组织机会，后半程继续上升。', 'good')
  } else {
    applyStats({ wealth: 4, happiness: -7, health: -8 })
    addLog('后半程节点', '外部环境和身体状态限制了扩张，继续硬冲的边际收益下降。', 'bad')
  }
}

function resolvePromotion() {
  const chance = game.value.career * 0.34 + game.value.network * 0.24 + game.value.grit * 0.14 + game.value.social * 0.08 + rand(-18, 18)
  if (chance >= 58) {
    applyStats({ wealth: 28, career: 18, network: 7, happiness: 5 })
    addLog('升职节点', '竞争成功！你拿下了管理岗位，收入和影响力都上了一个台阶。', 'good')
  } else if (chance >= 40) {
    applyStats({ wealth: 12, career: 7, network: 3 })
    addLog('升职节点', '虽然没拿到目标岗位，但过程中表现不错，涨了一级。')
  } else {
    applyStats({ happiness: -7, career: -2, health: -2 })
    addLog('升职节点', '竞争失败，还消耗了不少精力和人情。', 'bad')
  }
}

function resolveCivilService() {
  const chance = game.value.study * 0.38 + game.value.grit * 0.24 + game.value.happiness * 0.08 + rand(-16, 16)
  if (chance >= 58) {
    applyStats({ wealth: 7, happiness: 9, career: 12, health: 2, network: 5 })
    addLog('考公节点', '上岸了！体制内稳定性给你带来了安全感。', 'good')
    game.value.flags.civilServant = true
  } else if (chance >= 42) {
    applyStats({ study: 3, grit: 2, happiness: -3 })
    addLog('考公节点', '差一点进面，明年再战还是算了？先积累着。')
  } else {
    applyStats({ happiness: -7, health: -2, grit: 3, wealth: -2 })
    addLog('考公节点', '笔试就没过，几个月的准备打了水漂。', 'bad')
  }
}

function resolveStudyAbroad() {
  const chance = game.value.study * 0.38 + game.value.wealth * 0.18 + game.value.network * 0.1 + rand(-14, 14)
  if (chance >= 52) {
    applyStats({ study: 14, career: 8, network: 8, happiness: 5, wealth: -8 })
    addLog('留学节点', '你在国外打开了视野，学历和经历都有了提升。', 'good')
  } else {
    applyStats({ wealth: -10, study: 5, happiness: -5 })
    addLog('留学节点', '出去了，但学校一般，花费不少，收获有限。', 'bad')
  }
}

function resolveStartupJoin() {
  const chance = game.value.career * 0.24 + game.value.business * 0.2 + game.value.network * 0.18 + rand(-20, 20)
  if (chance >= 56) {
    applyStats({ wealth: 20, career: 12, business: 8, network: 5 })
    addLog('创业加入节点', '公司发展不错，你的期权开始值钱了。', 'good')
  } else if (chance >= 36) {
    applyStats({ wealth: 3, career: 5, happiness: -1 })
    addLog('创业加入节点', '公司没起飞也没倒闭，期权暂时等于废纸，但履历还行。')
  } else {
    applyStats({ wealth: -5, career: -1, happiness: -5 })
    addLog('创业加入节点', '公司倒了，期权归零，白忙一场。', 'bad')
  }
}

function resolveCareerSwitch() {
  const chance = game.value.study * 0.24 + game.value.grit * 0.24 + game.value.health * 0.14 + rand(-18, 18)
  if (chance >= 52) {
    applyStats({ career: 8, happiness: 7, wealth: -3, health: 1 })
    addLog('转行节点', '虽然降薪了，但新方向让你重新找到了节奏。', 'good')
  } else {
    applyStats({ career: -5, wealth: -6, happiness: -7, grit: 3 })
    addLog('转行节点', '转行不如预期，收入下降，之前的积累也打了折扣。', 'bad')
  }
}

const showHistory = ref(false)
const fileInput = ref(null)

function exportRecord() {
  const record = {
    version: 1,
    exportedAt: new Date().toISOString(),
    family: game.value.family,
    talents: game.value.talents,
    stats: {
      wealth: game.value.wealth,
      happiness: game.value.happiness,
      health: game.value.health,
      study: game.value.study,
      career: game.value.career,
      business: game.value.business,
      art: game.value.art,
      sport: game.value.sport,
      social: game.value.social,
      network: game.value.network,
      grit: game.value.grit,
    },
    flags: { ...game.value.flags },
    log: [...game.value.log],
    route: [...game.value.route],
    endingTitle: endingTitle.value,
    endingText: endingText.value,
    compositeScore: compositeScore.value,
  }
  const blob = new Blob([JSON.stringify(record, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  const now = new Date()
  const pad = (n) => String(n).padStart(2, '0')
  a.href = url
  a.download = `life-record-${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}.json`
  a.click()
  URL.revokeObjectURL(url)
}

function importRecord(event) {
  const file = event.target.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const record = JSON.parse(e.target.result)
      loadRecord(record)
    } catch {
      alert('无法解析记录文件，请确认是有效的 JSON 文件。')
    }
  }
  reader.readAsText(file)
  event.target.value = ''
}

function loadRecord(record) {
  game.value.family = record.family
  game.value.talents = record.talents || []
  Object.assign(game.value, record.stats || {})
  game.value.flags = record.flags || {}
  game.value.log = record.log || []
  game.value.route = record.route || []
  game.value.currentRouteIndex = game.value.route.length - 1
  game.value.finished = true
  showHistory.value = true
}

function triggerFileInput() {
  fileInput.value?.click()
}

onMounted(() => {
  fetch('/api/count', { method: 'POST' }).catch(() => {})
})

startGame()
</script>

<template>
  <main class="app-shell">
    <section class="topbar">
      <div>
        <p class="eyebrow">Vue3 + Vite 人生路径模拟</p>
        <h1>人生路径模拟器</h1>
      </div>
      <div class="topbar-actions">
        <button class="icon-button" type="button" title="加载记录" @click="triggerFileInput">
          <Upload :size="20" />
        </button>
        <button class="icon-button" type="button" title="重新出生" @click="startGame">
          <RefreshCw :size="20" />
        </button>
      </div>
    </section>

    <section class="layout">
      <aside class="profile-panel">
        <div class="birth-card">
          <div class="family-mark">
            <Sparkles :size="22" />
          </div>
          <div>
            <p class="muted">出生家庭</p>
            <h2>{{ game.family.name }}</h2>
            <p>{{ game.family.desc }}</p>
          </div>
        </div>

        <div class="talent-list">
          <p class="section-label">随机天赋</p>
          <span v-for="talent in game.talents" :key="talent.id">{{ talent.name }}</span>
        </div>

        <div class="stat-grid">
          <article v-for="item in totals" :key="item.label" class="stat-card">
            <component :is="item.icon" :size="18" />
            <span>{{ item.label }}</span>
            <strong>{{ item.value }}</strong>
            <div class="bar">
              <i :style="{ width: `${item.value}%` }"></i>
            </div>
          </article>
        </div>
      </aside>

      <section class="stage-panel">
        <template v-if="!game.finished">
          <div class="stage-head">
            <span>{{ currentStage.age }}</span>
            <h2>{{ currentStage.title }}</h2>
            <p>{{ currentStage.prompt }}</p>
          </div>

          <div class="option-grid">
            <button
              v-for="option in currentOptions"
              :key="option.text"
              class="choice"
              type="button"
              :disabled="option.disabled"
              :title="option.disabled ? option.unavailable : option.result.note"
              @click="choose(option)"
            >
              <Brain :size="18" />
              <span>{{ option.text }}</span>
              <small>{{ option.disabled ? option.unavailable : option.result.note }}</small>
            </button>
          </div>
        </template>

        <template v-else>
          <div class="ending">
            <Trophy :size="42" />
            <p class="eyebrow">{{ showHistory ? '历史记录回顾' : '55/60 岁阶段成果' }}</p>
            <h2>{{ endingTitle }}</h2>
            <p>{{ endingText }}</p>
            <div class="ending-actions">
              <button class="primary-button" type="button" @click="exportRecord">
                <Download :size="18" />
                下载本次记录
              </button>
              <button v-if="!showHistory" class="primary-button" type="button" @click="startGame">
                <RefreshCw :size="18" />
                再模拟一次
              </button>
            </div>
          </div>
        </template>
      </section>

      <aside class="timeline-panel">
        <p class="section-label">人生记录</p>
        <div class="timeline">
          <article v-for="entry in game.log" :key="entry.title + entry.body" :class="['log-item', entry.tone]">
            <strong>{{ entry.title }}</strong>
            <p>{{ entry.body }}</p>
          </article>
        </div>
      </aside>
    </section>
    <input ref="fileInput" type="file" accept=".json" style="display:none" @change="importRecord" />
  </main>
</template>
