import { useEffect, useMemo, useState, type CSSProperties } from "react";

import burnMarkImg from "./assets/cards/burn_mark.jpg";
import dreamAwakeImg from "./assets/cards/dream_awake.jpg";
import emptyCrownImg from "./assets/cards/empty_crown.jpg";
import goodNewsImg from "./assets/cards/good_news.jpg";
import lateSugarImg from "./assets/cards/late_sugar.jpg";
import lateWickImg from "./assets/cards/late_wick.jpg";
import oldNightEchoImg from "./assets/cards/old_night_echo.jpg";
import rationalButcherImg from "./assets/cards/rational_butcher.jpg";
import secondHeartImg from "./assets/cards/second_heart.jpg";
import softRibNotRustedImg from "./assets/cards/soft_rib_not_rusted.jpg";
import stillWaterLighthouseImg from "./assets/cards/still_water_lighthouse.jpg";
import windForgivenessImg from "./assets/cards/wind_forgiveness.jpg";

type Stage =
  | "cover"
  | "intro"
  | "origin"
  | "originDone"
  | "node"
  | "feedback"
  | "identity"
  | "result";

type OriginQuestion = {
  id: string;
  title: string;
  options: {
    id: string;
    text: string;
    effects: Partial<Traits>;
  }[];
};

type NodeOption = {
  id: string;
  text: string;
  feedback: string;
  effects: Partial<Traits>;
};

type NodeItem = {
  id: string;
  title: string;
  prompt: string;
  options: NodeOption[];
};

type ResultCard = {
  id: string;
  name: string;
};

type Traits = {
  resilience: number;
  rebellion: number;
  control: number;
  warmth: number;
  trust: number;
  alertness: number;
  alienation: number;
  reflection: number;
  realism: number;
  idealism: number;
  compensation: number;
  reinvention: number;
};

const resultCards: ResultCard[] = [
  { id: "dream_awake", name: "大梦初醒" },
  { id: "rational_butcher", name: "理性屠夫" },
  { id: "good_news", name: "喜报传来！！！" },
  { id: "empty_crown", name: "空心王冠" },
  { id: "late_sugar", name: "一罐晚熟的糖" },
  { id: "old_night_echo", name: "旧夜回声" },
  { id: "still_water_lighthouse", name: "静水灯塔" },
  { id: "second_heart", name: "第二颗心脏" },
  { id: "late_wick", name: "迟燃灯芯" },
  { id: "wind_forgiveness", name: "风的赦免" },
  { id: "soft_rib_not_rusted", name: "未锈尽的软肋" },
  { id: "burn_mark", name: "灼痕" },
];

const resultImageMap: Record<string, string> = {
  dream_awake: dreamAwakeImg,
  rational_butcher: rationalButcherImg,
  good_news: goodNewsImg,
  empty_crown: emptyCrownImg,
  late_sugar: lateSugarImg,
  old_night_echo: oldNightEchoImg,
  still_water_lighthouse: stillWaterLighthouseImg,
  second_heart: secondHeartImg,
  late_wick: lateWickImg,
  wind_forgiveness: windForgivenessImg,
  soft_rib_not_rusted: softRibNotRustedImg,
  burn_mark: burnMarkImg,
};

const originQuestions: OriginQuestion[] = [
  {
    id: "family",
    title: "家庭结构",
    options: [
      {
        id: "A1",
        text: "所有目光都落在你身上",
        effects: {
          compensation: 2,
          alertness: 1,
          control: 1,
          resilience: 1,
        },
      },
      {
        id: "A2",
        text: "你从不是家里唯一的孩子",
        effects: {
          alertness: 1,
          trust: -1,
          rebellion: 1,
          alienation: 1,
        },
      },
      {
        id: "A3",
        text: "你在长辈手里被养大",
        effects: {
          alienation: 1,
          reflection: 1,
          warmth: 1,
          alertness: 1,
        },
      },
    ],
  },
  {
    id: "economy",
    title: "经济土壤",
    options: [
      {
        id: "B1",
        text: "资源充足，容错很高",
        effects: {
          idealism: 2,
          trust: 1,
          warmth: 1,
          realism: -1,
        },
      },
      {
        id: "B2",
        text: "日子普通，但尚能周转",
        effects: {
          resilience: 1,
          realism: 1,
          warmth: 1,
        },
      },
      {
        id: "B3",
        text: "很多选择从一开始就不属于你",
        effects: {
          realism: 2,
          compensation: 2,
          alertness: 1,
          idealism: -1,
        },
      },
    ],
  },
  {
    id: "emotion",
    title: "情感气候",
    options: [
      {
        id: "C1",
        text: "大人们彼此相爱，也爱你",
        effects: {
          warmth: 2,
          trust: 2,
          idealism: 1,
          alertness: -1,
        },
      },
      {
        id: "C2",
        text: "你总能闻到家里快要下雨",
        effects: {
          alertness: 2,
          reflection: 1,
          alienation: 1,
          warmth: -1,
        },
      },
      {
        id: "C3",
        text: "你很早就知道，能保护你的只有自己",
        effects: {
          control: 2,
          trust: -2,
          resilience: 1,
          realism: 1,
          compensation: 1,
        },
      },
    ],
  },
  {
    id: "feedback",
    title: "外界反馈",
    options: [
      {
        id: "D1",
        text: "你常得到偏爱与夸奖",
        effects: {
          trust: 1,
          warmth: 1,
          idealism: 1,
          control: 1,
        },
      },
      {
        id: "D2",
        text: "你并不显眼，但也不难堪",
        effects: {
          alienation: 1,
          reflection: 1,
          realism: 1,
        },
      },
      {
        id: "D3",
        text: "你很早就理解了评价的刺",
        effects: {
          alertness: 2,
          compensation: 1,
          rebellion: 1,
          warmth: -1,
        },
      },
    ],
  },
];

const storyNodes: NodeItem[] = [
  {
    id: "N1",
    title: "第一次被比较",
    prompt:
      "饭桌上，大人把你和另一个孩子放在同一束灯下。那是你第一次知道，原来成长也会被拿来排先后。",
    options: [
      {
        id: "N1A",
        text: "我会更努力，直到没人能轻易拿我比较",
        feedback:
          "那天以后，你对“更好”这两个字格外认真。有些人后来那样拼命，不过是因为很早以前，心里就落下了一句“不够”。",
        effects: {
          resilience: 2,
          control: 1,
          compensation: 2,
          realism: 1,
        },
      },
      {
        id: "N1B",
        text: "我表面无所谓，但会把这句话悄悄记很久",
        feedback:
          "你没有接话。可那句话像一根细刺，后来碰到相似的场景时，总会轻轻发疼。",
        effects: {
          alertness: 1,
          reflection: 1,
          compensation: 1,
          alienation: 1,
        },
      },
      {
        id: "N1C",
        text: "我开始怀疑，是否怎样都不会被真正满意",
        feedback:
          "你心里第一次浮出一种说不清的疲惫。好像无论做成什么样，都还差一点。",
        effects: {
          alienation: 1,
          compensation: 2,
          reflection: 1,
          idealism: -1,
        },
      },
      {
        id: "N1D",
        text: "我心里生出一点反骨，凭什么一定要和别人放在一起看",
        feedback:
          "你心里悄悄长出一截不愿驯服的枝。那一点反骨，后来替你挡过很多次低头。",
        effects: {
          rebellion: 2,
          control: 1,
          reinvention: 1,
          warmth: -1,
        },
      },
    ],
  },
  {
    id: "N2",
    title: "第一次发现，好看与讨喜真的会被优待",
    prompt:
      "同样的话，有人说出口就容易被接住；同样的沉默，有人会被体谅，有人却像从来没有存在过。你慢慢看懂，世界给人的回声，并不总是一样的。",
    options: [
      {
        id: "N2A",
        text: "那我就尽量把自己修成更讨喜的样子",
        feedback:
          "你很早就懂了，讨人喜欢有时也算一种通行证。于是你开始留心自己的神情、语气和分寸，盼着世界能回你一点温柔。",
        effects: {
          compensation: 2,
          alertness: 1,
          control: 1,
          warmth: 1,
        },
      },
      {
        id: "N2B",
        text: "我不服，我想靠能力让世界闭嘴",
        feedback:
          "你心里并不认这个账。你更想把力气花在别处，想看看不靠偏爱的人，能不能照样走到前面。",
        effects: {
          rebellion: 1,
          resilience: 2,
          control: 1,
          realism: 1,
        },
      },
      {
        id: "N2C",
        text: "我学会把自己藏进不被点评的角落",
        feedback:
          "你慢慢把自己往人群的暗处挪了半步。许多个瞬间里，你宁可安静地待着，也不愿先迎上那些打量的目光。",
        effects: {
          alienation: 2,
          alertness: 1,
          trust: -1,
          warmth: -1,
        },
      },
      {
        id: "N2D",
        text: "我开始留意，什么样的人更容易被世界温柔对待",
        feedback:
          "你开始观察别人是怎样被喜欢的。眼神、语气、停顿、笑意，这些细小的东西，慢慢都进了你的心里。",
        effects: {
          alertness: 2,
          reflection: 1,
          realism: 1,
          warmth: 1,
        },
      },
    ],
  },
  {
    id: "N3",
    title: "第一次友情受伤",
    prompt: "你把真心递出去，对方却先拿它做了一个轻巧的试验。",
    options: [
      {
        id: "N3A",
        text: "以后我会更谨慎，不再轻易把底牌给人",
        feedback:
          "你心里那扇门没有完全关上。不过钥匙，从此不再随手交给别人。",
        effects: {
          trust: -2,
          alertness: 1,
          control: 1,
          realism: 1,
        },
      },
      {
        id: "N3B",
        text: "我还是想相信人，只是会慢一点",
        feedback:
          "你没有把这次受伤当成全部。往后每一次靠近，你会多看一眼，多等一会儿。",
        effects: {
          warmth: 1,
          trust: 1,
          reflection: 1,
          alertness: 1,
        },
      },
      {
        id: "N3C",
        text: "我会让自己变得更有价值，这样就不容易被丢下",
        feedback:
          "你把那份失落悄悄记在自己身上。后来你对“值得被留下”这件事，越来越认真。",
        effects: {
          compensation: 2,
          resilience: 1,
          control: 1,
          trust: -1,
        },
      },
      {
        id: "N3D",
        text: "我不再问谁对谁错，我只记住以后该把情绪放在哪里",
        feedback:
          "你没有急着追问一个结论。你记住的，是情绪该放向哪里，人又该离谁近一点、远一点。",
        effects: {
          reflection: 2,
          realism: 1,
          alienation: 1,
          control: 1,
        },
      },
    ],
  },
  {
    id: "N4",
    title: "第一次觉得努力未必有用",
    prompt:
      "你见过有人轻轻松松拿到你拼命追赶的东西。命运像一块微微倾斜的地面，你站在上面，很难装作什么都没看见。",
    options: [
      {
        id: "N4A",
        text: "我接受现实，然后研究规则怎么赢",
        feedback:
          "你心里的委屈没有散。它后来长成了另一种东西，藏在你看规则、记门路、辨机会的眼神里。",
        effects: {
          realism: 2,
          control: 2,
          resilience: 1,
          idealism: -1,
        },
      },
      {
        id: "N4B",
        text: "我很难接受，但还是会咬牙往前",
        feedback:
          "你心里并不服气。可脚下也没有停，很多韧劲，就是这样一点一点拧出来的。",
        effects: {
          resilience: 2,
          compensation: 1,
          idealism: 1,
          control: 1,
        },
      },
      {
        id: "N4C",
        text: "我会后退一步，重新想想自己到底值不值得这样活",
        feedback:
          "你第一次认真打量自己走的这条路。那个问题从此留在心里，隔一阵子，就会回来敲你一下。",
        effects: {
          reflection: 2,
          alienation: 1,
          reinvention: 1,
          idealism: 1,
        },
      },
      {
        id: "N4D",
        text: "我慢慢明白，有些时候，继续拼下去未必是答案，换一条路看看也许更像活着",
        feedback:
          "你不再只盯着眼前这一条路。有些时候，人换个方向，反而更能走出自己。",
        effects: {
          reinvention: 2,
          reflection: 1,
          idealism: 1,
          compensation: -1,
        },
      },
    ],
  },
  {
    id: "N5",
    title: "第一次想要接近某人",
    prompt:
      "因为一个人的出现，你开始偷偷调整自己的步伐。你会记住对方随口说过的话，也会在某些瞬间忽然变得不自然。你知道，这样的靠近一旦被说破，很多东西都可能变味。",
    options: [
      {
        id: "N5A",
        text: "我会想办法靠近一点，哪怕只是多说几句话",
        feedback:
          "你朝那个人多走了几步。距离没变多少，心里的水面却已经起了波纹。",
        effects: {
          warmth: 2,
          trust: 1,
          idealism: 1,
        },
      },
      {
        id: "N5B",
        text: "我表面装得和平时一样，其实会默默关注很久",
        feedback:
          "你什么都没有说。可那份在意已经先住了下来，安静地占着一个角落。",
        effects: {
          alertness: 1,
          warmth: 1,
          alienation: 1,
          reflection: 1,
        },
      },
      {
        id: "N5C",
        text: "我会先确认对方有没有可能也在看向我",
        feedback:
          "你想靠近，又怕扑空。于是你总会先看一眼风向，盼着哪怕只有一点回应。",
        effects: {
          alertness: 2,
          control: 1,
          trust: -1,
          compensation: 1,
        },
      },
      {
        id: "N5D",
        text: "我宁愿把这份心思留在心里，也不想让它变得难堪",
        feedback:
          "你把这份心思放得很轻，也放得很深。时间一长，连自己都未必说得清，那里面装着多少喜欢。",
        effects: {
          alienation: 2,
          trust: -1,
          warmth: 1,
          reflection: 1,
        },
      },
    ],
  },
  {
    id: "N6",
    title: "第一次发现，不是所有委屈都值得说出来",
    prompt:
      "有一次，你明明受了委屈。真要开口时，你又觉得解释太耗人，争辩太费力，有些人听了也未必会懂。你心里忽然明白，表达自己，并不总能换来理解。",
    options: [
      {
        id: "N6A",
        text: "我会说出来，哪怕最后也未必有人站在我这边",
        feedback:
          "你还是给自己留了一点声音。哪怕不够响，这一下也算替自己站了一回。",
        effects: {
          rebellion: 1,
          warmth: 1,
          control: 1,
          resilience: 1,
        },
      },
      {
        id: "N6B",
        text: "我会先忍下去，但这件事我不会轻易忘",
        feedback:
          "你把情绪按住了。可心里那页纸没有翻过去，上面清清楚楚记着这件事。",
        effects: {
          alertness: 1,
          compensation: 1,
          reflection: 1,
          alienation: 1,
        },
      },
      {
        id: "N6C",
        text: "我开始学着少说，把情绪留给自己消化",
        feedback:
          "很多话你没有再往外送。慢慢地，沉默变得熟练，像一件随手就能披上的衣服。",
        effects: {
          alienation: 2,
          alertness: 1,
          warmth: -1,
          reflection: 1,
        },
      },
      {
        id: "N6D",
        text: "我会换一种更平静、更不容易被反驳的方式表达",
        feedback:
          "你没有把话咽回去。你开始学着把情绪放平，把句子理顺，希望它们能走到别人耳朵里。",
        effects: {
          control: 1,
          realism: 1,
          reflection: 1,
          resilience: 1,
        },
      },
    ],
  },
  {
    id: "N7",
    title: "第一次离开原生环境",
    prompt: "你终于站到更大的城市、更远的街灯下。自由到了，孤独也跟着来了。",
    options: [
      {
        id: "N7A",
        text: "我会把自己变得锋利，好让陌生世界记住我",
        feedback:
          "你心里升起一股往前闯的劲。陌生的地方没有先接住你，于是你决定先让自己亮一点。",
        effects: {
          control: 2,
          resilience: 1,
          compensation: 1,
          warmth: -1,
        },
      },
      {
        id: "N7B",
        text: "我在自由里先学会照顾自己",
        feedback:
          "你一点点学会安排自己的生活。吃饭、休息、撑住情绪，这些事慢慢把你托住了。",
        effects: {
          warmth: 1,
          resilience: 1,
          reflection: 1,
          trust: 1,
        },
      },
      {
        id: "N7C",
        text: "我表面适应，其实一直带着一点流亡感",
        feedback:
          "你走进了新地方，心却没有立刻安顿下来。很多夜里，你会觉得自己像借住在某一段人生里。",
        effects: {
          alienation: 2,
          reflection: 1,
          idealism: -1,
          warmth: -1,
        },
      },
      {
        id: "N7D",
        text: "到了新的地方，我忽然觉得自己也可以换一种样子重新开始",
        feedback:
          "新的环境让你松了一口气。像有人轻轻把旧的一页揭过去，留给你一点重新书写的余地。",
        effects: {
          reinvention: 2,
          idealism: 1,
          warmth: 1,
          control: 1,
        },
      },
    ],
  },
  {
    id: "N8",
    title: "第一次拿到自己真正赚来的钱",
    prompt:
      "那笔钱不算多。可它落进你手里的时候，你还是很清楚地感觉到，有什么东西和以前不一样了。",
    options: [
      {
        id: "N8A",
        text: "我先想到的，是终于能少向别人伸一次手",
        feedback:
          "你先感到的不是开心，而是身体变得轻快了。像终于有一小块地，是靠自己占住的。",
        effects: {
          control: 1,
          realism: 1,
          resilience: 1,
          trust: -1,
        },
      },
      {
        id: "N8B",
        text: "我会很认真地记住这笔钱，因为它像某种证明",
        feedback:
          "你把这笔钱看得很重。它不多，却像在悄悄告诉你，你不是只能被安排的人。",
        effects: {
          compensation: 2,
          resilience: 1,
          control: 1,
          realism: 1,
        },
      },
      {
        id: "N8C",
        text: "我想立刻拿它去买一点自己以前舍不得要的东西",
        feedback:
          "你没有想太多。那一刻你只是想补回一点，曾经没能落到自己手里的东西。",
        effects: {
          warmth: 1,
          idealism: 1,
          compensation: 1,
          reflection: 1,
        },
      },
      {
        id: "N8D",
        text: "我忽然意识到，钱不只是钱，它还意味着选择权",
        feedback:
          "你忽然看见了另一层东西。很多人拼命想要的，未必只是钱，而是它背后那一点不必受制于人的余地。",
        effects: {
          realism: 2,
          reflection: 1,
          control: 1,
          reinvention: 1,
        },
      },
    ],
  },
  {
    id: "N9",
    title: "第一次意识到，自己也会嫉妒别人",
    prompt:
      "你看见某个人拥有了你也想要的东西。那一瞬间，你心里很清楚地知道，自己也会嫉妒。",
    options: [
      {
        id: "N9A",
        text: "我会逼自己更往前一点，不想只停在羡慕里",
        feedback:
          "你没有让那点情绪只留在心里。它后来常常变成你继续往前拧的力气。",
        effects: {
          resilience: 2,
          control: 1,
          compensation: 1,
          rebellion: 1,
        },
      },
      {
        id: "N9B",
        text: "我会很羞于承认这件事，像看见了自己不太体面的部分",
        feedback:
          "你对自己一向有要求。所以连这种很普通的人性，也让你觉得有点难堪。",
        effects: {
          alertness: 1,
          reflection: 1,
          alienation: 1,
          warmth: -1,
        },
      },
      {
        id: "N9C",
        text: "我会认真想一想，我到底是在嫉妒什么",
        feedback:
          "你没有急着压下去。你只是慢慢看了一眼，那里面到底藏着什么没被承认的想要。",
        effects: {
          reflection: 2,
          idealism: 1,
          reinvention: 1,
          compensation: -1,
        },
      },
      {
        id: "N9D",
        text: "我会装作没事，但那股酸意会留很久",
        feedback:
          "你把那一下按了下去。表面上什么都没有发生，心里却悄悄记住了那个让你发酸的瞬间。",
        effects: {
          alertness: 1,
          compensation: 1,
          alienation: 1,
          reflection: 1,
        },
      },
    ],
  },
  {
    id: "N10",
    title: "第一次发现，自己在人群里会扮演某种版本的自己",
    prompt:
      "你并不是故意伪装。只是面对不同的人，你会自然地换一种语气、神情和分寸，像在不同场合借住不同的自己。",
    options: [
      {
        id: "N10A",
        text: "我觉得这很正常，活着本来就需要一点角色感",
        feedback:
          "你没有把这件事看得太重。很多时候，你更在意怎么把局面走顺。",
        effects: {
          realism: 1,
          control: 1,
          alienation: 1,
        },
      },
      {
        id: "N10B",
        text: "我会忽然有点累，像总在照顾场面，却不太知道哪个才是真正的我",
        feedback:
          "你不是不会适应。只是适应得太久，有时候会让人忘记，自己原本想怎样说话。",
        effects: {
          reflection: 2,
          alienation: 1,
          warmth: 1,
          reinvention: 1,
        },
      },
      {
        id: "N10C",
        text: "我会把这种能力用好，让自己在很多地方都更顺",
        feedback:
          "你很早就明白，表达也是一种门路。有些东西未必要硬碰，换一种方式，也能走过去。",
        effects: {
          control: 2,
          realism: 1,
          alertness: 1,
          warmth: -1,
        },
      },
      {
        id: "N10D",
        text: "我会有点抗拒，想知道如果我不配合表演，会发生什么",
        feedback:
          "你心里有一部分，不想一直借角色活着。那个想把面具摘下来的人，后来会越来越常出现。",
        effects: {
          rebellion: 2,
          reinvention: 1,
          warmth: 1,
          control: -1,
        },
      },
    ],
  },
  {
    id: "N11",
    title: "第一次在一段关系里觉得，自己像被需要，但也被消耗",
    prompt:
      "有人开始依赖你。你不是不在意，只是慢慢地，你发现自己像一块被反复取用的电池，一点点地在掉电。",
    options: [
      {
        id: "N11A",
        text: "我会继续撑着，因为我不忍心先抽身",
        feedback:
          "你还是先顾了对方。很多时候，你的心软不是因为不累，而是总想再撑一下。",
        effects: {
          warmth: 2,
          compensation: 1,
          alertness: 1,
          resilience: 1,
        },
      },
      {
        id: "N11B",
        text: "我会开始计算这段关系值不值得继续投入",
        feedback:
          "你忽然从情绪里站出来了一点。当关系开始失衡，你也会本能地问一句，凭什么总是我来填这个口子。",
        effects: {
          realism: 2,
          control: 1,
          trust: -1,
          warmth: -1,
        },
      },
      {
        id: "N11C",
        text: "我会尝试说清楚，我不是不能给，而是不能一直这样给",
        feedback:
          "你第一次认真地替自己划了一道线。你希望别人也能看见，你不是无底洞。",
        effects: {
          control: 1,
          warmth: 1,
          reflection: 1,
          resilience: 1,
        },
      },
      {
        id: "N11D",
        text: "我表面上还在配合，心里其实已经悄悄退了半步",
        feedback:
          "你没有立刻离开。但心已经先往回收了，那种安静的抽离，有时比争吵还更早宣告结束。",
        effects: {
          alienation: 2,
          reflection: 1,
          trust: -1,
          warmth: -1,
        },
      },
    ],
  },
  {
    id: "N12",
    title: "第一次认真拒绝别人",
    prompt:
      "那一次，你知道自己其实可以答应。只是如果再答应下去，你心里会有某个地方继续塌陷。",
    options: [
      {
        id: "N12A",
        text: "我会拒绝，但会尽量把话说得圆一点",
        feedback:
          "你还是顾了体面。哪怕要说不，你也更习惯给别人留一点台阶。",
        effects: {
          warmth: 1,
          control: 1,
          realism: 1,
          alertness: 1,
        },
      },
      {
        id: "N12B",
        text: "我拒绝的时候会有很重的愧疚感",
        feedback:
          "你明明已经做了对自己更好的选择。可那一下说出口时，你还是像辜负了谁。",
        effects: {
          warmth: 1,
          compensation: 1,
          alertness: 1,
          reflection: 1,
        },
      },
      {
        id: "N12C",
        text: "我会很坚定，因为我知道这次不能再退",
        feedback:
          "你心里那条线第一次变得很清楚。有些拒绝不是变坏，而是终于不再随手牺牲自己。",
        effects: {
          control: 2,
          rebellion: 1,
          resilience: 1,
          compensation: -1,
        },
      },
      {
        id: "N12D",
        text: "我会拖着不回，直到这件事自己过去",
        feedback:
          "你没有真正说出口。很多时候，你不是不会拒绝，只是还不习惯承受拒绝之后的空气。",
        effects: {
          alienation: 2,
          alertness: 1,
          trust: -1,
          control: -1,
        },
      },
    ],
  },
  {
    id: "N13",
    title: "第一次发现，自己想走的方向和家里期待的不一样",
    prompt:
      "有一天你终于意识到，你心里真正想走的路，和别人替你想好的那条，并不是同一条。",
    options: [
      {
        id: "N13A",
        text: "我会先照着期待走，但心里不会彻底认领它",
        feedback:
          "你没有立刻反抗。可那条不属于你的路，你也从来没有真正走得心安理得。",
        effects: {
          compensation: 1,
          alienation: 1,
          reflection: 1,
          realism: 1,
        },
      },
      {
        id: "N13B",
        text: "我会很痛苦，因为我知道不管选哪边，都会失去一点什么",
        feedback:
          "你第一次很具体地感到，选择不是轻松的自由。它有时候更像一把刀，哪边都得割掉一点。",
        effects: {
          reflection: 2,
          alienation: 1,
          warmth: 1,
          idealism: 1,
        },
      },
      {
        id: "N13C",
        text: "我会慢慢替自己争，哪怕一开始争得很小",
        feedback:
          "你没有一下子掀桌。你只是开始一点一点，把自己从既定轨道上挪开。",
        effects: {
          reinvention: 2,
          rebellion: 1,
          resilience: 1,
          warmth: 1,
        },
      },
      {
        id: "N13D",
        text: "我会想先做出成绩，再回头证明自己的方向没有错",
        feedback:
          "你不想空口争辩。你更想等某一天拿着结果回去，让质疑变成沉默。",
        effects: {
          compensation: 2,
          control: 1,
          resilience: 1,
          realism: 1,
        },
      },
    ],
  },
  {
    id: "N14",
    title: "第一次拥有一个可以离开的机会",
    prompt:
      "那是一个你以前很想要的机会。它像一扇门，真的开在你面前。可真到了这一刻，你又忽然知道，离开也不只是离开。",
    options: [
      {
        id: "N14A",
        text: "我会抓住它，先走出去再说",
        feedback:
          "你没有再站在门口反复想象。很多时候，命运真正转向，就是因为有人先迈了那一步。",
        effects: {
          reinvention: 2,
          resilience: 1,
          control: 1,
          idealism: 1,
        },
      },
      {
        id: "N14B",
        text: "我会犹豫很久，因为自由有时候也意味着失去熟悉的依靠",
        feedback:
          "你不是不想走。你只是很清楚，一切新的可能，都同时带着一点代价。",
        effects: {
          warmth: 1,
          trust: 1,
          alertness: 1,
          alienation: 1,
        },
      },
      {
        id: "N14C",
        text: "我会很冷静地衡量利弊，不想被“终于有机会了”冲昏头脑",
        feedback:
          "你没有把机会想得太重。你更在意的是，它到底能不能把你带去更接近自己的地方。",
        effects: {
          realism: 2,
          control: 1,
          reflection: 1,
          idealism: -1,
        },
      },
      {
        id: "N14D",
        text: "我会意识到，原来我真正想离开的，未必只是一个地方",
        feedback:
          "你忽然看见，困住人的不总是现实条件。有时候只是过去的自己不舍得放手。",
        effects: {
          reflection: 2,
          reinvention: 1,
          alienation: 1,
          compensation: -1,
        },
      },
    ],
  },
  {
    id: "N15",
    title: "第一次发现，自己其实已经没那么想证明了",
    prompt:
      "曾经有一件你很执着的事。你以为一定要做到、一定要赢、一定要让某些人看见。可后来某一天，你忽然发现，那股劲好像没那么重了。",
    options: [
      {
        id: "N15A",
        text: "我会松一口气，像终于能把某块一直绷着的骨头放下来",
        feedback:
          "你没有输给谁。你只是终于不用一直顶着那口气，才敢承认自己也会累。",
        effects: {
          warmth: 1,
          reinvention: 1,
          compensation: -2,
          control: -1,
        },
      },
      {
        id: "N15B",
        text: "我会有点茫然，因为那股“我要证明”的劲曾经撑了我很久",
        feedback:
          "很多人不是靠热爱活着，是靠不服活着。所以当那股劲慢慢退下去，人反而会先愣一下。",
        effects: {
          reflection: 2,
          alienation: 1,
          compensation: 1,
          idealism: -1,
        },
      },
      {
        id: "N15C",
        text: "我会觉得这不是放弃，而是终于不再把自己绑在那件事上",
        feedback:
          "你不是不要结果了。你只是开始把自己，从那个必须赢一次的执念里解下来。",
        effects: {
          reinvention: 2,
          reflection: 1,
          compensation: -1,
          realism: 1,
        },
      },
      {
        id: "N15D",
        text: "我表面说自己不在意了，其实心里还是会偶尔回头看一眼",
        feedback:
          "你嘴上已经松开了。可心里那根线，还没有真正断干净。",
        effects: {
          compensation: 1,
          reflection: 1,
          alienation: 1,
          warmth: 1,
        },
      },
    ],
  },
  {
    id: "N16",
    title: "回头命名自己",
    prompt:
      "走到这里，你忽然发现，很多选择既像自由，也像补偿。你终于要为自己命名。",
    options: [
      {
        id: "N16A",
        text: "我愿成为能掌控命运的人",
        feedback:
          "你不愿意再把自己交给风向。往后的日子里，你更想握住方向盘，哪怕路并不平。",
        effects: {
          control: 2,
          realism: 1,
          resilience: 1,
          warmth: -1,
        },
      },
      {
        id: "N16B",
        text: "我愿成为仍然保有温度的人",
        feedback:
          "你见过很多人慢慢冷下去。走到这里，你仍愿意替自己守着一点柔软。",
        effects: {
          warmth: 2,
          trust: 1,
          idealism: 1,
          resilience: 1,
        },
      },
      {
        id: "N16C",
        text: "我愿成为看清一切也能继续活下去的人",
        feedback:
          "你心里没有太多幻觉了。可你还是愿意往前走，把清醒和活着放在同一副骨架里。",
        effects: {
          reflection: 2,
          realism: 1,
          resilience: 1,
          alienation: 1,
        },
      },
      {
        id: "N16D",
        text: "我愿成为随风而动的人",
        feedback:
          "你终于不再执着于每一步都要有答案。风往哪里吹，你也愿意在那里，慢慢长出自己的形状。",
        effects: {
          reinvention: 2,
          idealism: 1,
          compensation: -1,
          control: -1,
          warmth: 1,
        },
      },
    ],
  },
];

const initialTraits: Traits = {
  resilience: 0,
  rebellion: 0,
  control: 0,
  warmth: 0,
  trust: 0,
  alertness: 0,
  alienation: 0,
  reflection: 0,
  realism: 0,
  idealism: 0,
  compensation: 0,
  reinvention: 0,
};

function addEffects(base: Traits, effects: Partial<Traits>): Traits {
  const next: Traits = { ...base };
  Object.entries(effects).forEach(([key, value]) => {
    const typedKey = key as keyof Traits;
    next[typedKey] += value ?? 0;
  });
  return next;
}

function countHits(picks: Set<string>, ids: string[]): number {
  return ids.filter((id) => picks.has(id)).length;
}

function breakTie(
  scoreMap: Record<string, number>,
  traits: Traits,
  picks: Set<string>
): string {
  const sorted = Object.entries(scoreMap).sort((a, b) => b[1] - a[1]);
  const [first, second] = sorted;

  if (!first) return "dream_awake";
  if (!second) return first[0];
  if (first[1] - second[1] > 1.5) return first[0];

  const pair = [first[0], second[0]].sort().join("__");

  switch (pair) {
    case "empty_crown__good_news": {
      const crownHits = countHits(picks, ["N9A", "N10C", "N13D", "N14C", "N16A"]);
      const newsHits = countHits(picks, ["N2A", "N3C", "N6B", "N6C", "N12A", "N12B"]);
      return crownHits >= newsHits ? "empty_crown" : "good_news";
    }
    case "second_heart__still_water_lighthouse": {
      const heartHits = countHits(picks, ["N11A", "N12B", "N6C", "N2D", "N5C"]);
      const towerHits = countHits(picks, ["N11C", "N12A", "N14B", "N6D", "N7B"]);
      return towerHits > heartHits ? "still_water_lighthouse" : "second_heart";
    }
    case "burn_mark__old_night_echo": {
      const burnHits = countHits(picks, ["N1C", "N3C", "N6B", "N9D", "N15D"]);
      const echoHits = countHits(picks, ["N2C", "N5D", "N7C", "N12D", "N15B"]);
      return burnHits > echoHits ? "burn_mark" : "old_night_echo";
    }
    case "dream_awake__wind_forgiveness": {
      const awakeHits = countHits(picks, ["N1B", "N1C", "N10B", "N13B", "N15B", "N15D"]);
      const windHits = countHits(picks, ["N4D", "N7D", "N10D", "N13C", "N15A", "N15C", "N16D"]);
      return windHits > awakeHits ? "wind_forgiveness" : "dream_awake";
    }
    case "late_sugar__soft_rib_not_rusted": {
      return traits.trust >= 2 && traits.idealism >= 3
        ? "late_sugar"
        : "soft_rib_not_rusted";
    }
    default:
      return first[0];
  }
}

function calculateResult(
  originAnswers: Record<string, string>,
  nodeAnswers: string[]
): ResultCard {
  let traits = { ...initialTraits };

  originQuestions.forEach((q) => {
    const selectedId = originAnswers[q.id];
    const selected = q.options.find((o) => o.id === selectedId);
    if (selected) traits = addEffects(traits, selected.effects);
  });

  storyNodes.forEach((node) => {
    const selectedId = nodeAnswers.find((id) => id.startsWith(node.id));
    const selected = node.options.find((o) => o.id === selectedId);
    if (selected) traits = addEffects(traits, selected.effects);
  });

  const scoreMap: Record<string, number> = {
    dream_awake: 0,
    rational_butcher: 0,
    good_news: 0,
    empty_crown: 0,
    late_sugar: 0,
    old_night_echo: 0,
    still_water_lighthouse: 0,
    second_heart: 0,
    late_wick: 0,
    wind_forgiveness: 0,
    soft_rib_not_rusted: 0,
    burn_mark: 0,
  };

  scoreMap.empty_crown +=
    traits.control * 2.2 +
    traits.resilience * 2.1 +
    traits.compensation * 1.8 +
    traits.realism * 1.2 +
    Math.max(0, -traits.trust) * 1.1 +
    Math.max(0, -traits.warmth) * 0.8;

  scoreMap.good_news +=
    traits.compensation * 2.1 +
    traits.alertness * 1.9 +
    traits.realism * 1.4 +
    traits.control * 1.1 +
    Math.max(0, traits.alienation) * 0.5;

  scoreMap.rational_butcher +=
    traits.realism * 2.3 +
    traits.control * 2.1 +
    traits.reflection * 1.3 +
    Math.max(0, -traits.warmth) * 1.2 +
    Math.max(0, -traits.trust) * 1.1 +
    traits.resilience * 0.8;

  scoreMap.dream_awake +=
    traits.reflection * 2.1 +
    traits.compensation * 1.4 +
    traits.reinvention * 1.7 +
    traits.alienation * 1.1 +
    Math.max(0, traits.idealism) * 0.8;

  scoreMap.wind_forgiveness +=
    traits.reinvention * 2.4 +
    traits.reflection * 1.7 +
    Math.max(0, traits.idealism) * 1 +
    Math.max(0, traits.warmth) * 0.7 -
    Math.max(0, traits.compensation - 4) * 0.8 -
    Math.max(0, traits.control - 5) * 0.7;

  scoreMap.late_wick +=
    traits.idealism * 2.1 +
    traits.reflection * 1.5 +
    traits.warmth * 1.1 +
    traits.reinvention * 1.3 +
    traits.resilience * 0.8;

  scoreMap.second_heart +=
    traits.warmth * 2 +
    traits.alertness * 1.9 +
    traits.compensation * 1.8 +
    traits.resilience * 0.9 +
    traits.reflection * 0.8;

  scoreMap.still_water_lighthouse +=
    traits.warmth * 2.1 +
    traits.resilience * 1.4 +
    traits.reflection * 1.4 +
    Math.max(0, traits.trust) * 1.1 +
    Math.max(0, traits.compensation) * 0.3;

  scoreMap.late_sugar +=
    traits.warmth * 1.9 +
    traits.idealism * 2 +
    Math.max(0, traits.trust) * 1.2 +
    traits.reflection * 0.8 +
    Math.max(0, traits.compensation) * 0.5;

  scoreMap.soft_rib_not_rusted +=
    traits.warmth * 1.8 +
    traits.alertness * 1.4 +
    traits.reflection * 1.1 +
    Math.max(0, traits.trust) * 0.7 +
    traits.alienation * 0.6;

  scoreMap.old_night_echo +=
    traits.alienation * 2.1 +
    traits.reflection * 2 +
    Math.max(0, -traits.idealism) * 1 +
    Math.max(0, -traits.trust) * 0.8 +
    Math.max(0, -traits.warmth) * 0.5;

  scoreMap.burn_mark +=
    traits.compensation * 1.9 +
    traits.alienation * 1.8 +
    traits.reflection * 1.4 +
    traits.resilience * 1.3 +
    Math.max(0, -traits.idealism) * 0.6;

  const picks = new Set(nodeAnswers);

  if (countHits(picks, ["N1A", "N4A", "N7A", "N9A", "N10C", "N13D", "N16A"]) >= 4) {
    scoreMap.empty_crown += 12;
  }

  if (
    countHits(picks, ["N2A", "N3C", "N6B", "N6C", "N10C", "N12A", "N12B", "N13A", "N13D", "N16A"]) >=
    4
  ) {
    scoreMap.good_news += 10;
  }

  if (countHits(picks, ["N3A", "N4A", "N6D", "N8D", "N11B", "N12C", "N14C", "N16A", "N16C"]) >= 4) {
    scoreMap.rational_butcher += 11;
  }

  if (
    countHits(
      picks,
      ["N1B", "N1C", "N4C", "N4D", "N9C", "N10B", "N10D", "N13B", "N13C", "N14D", "N15B", "N15D", "N16C", "N16D"]
    ) >= 4
  ) {
    scoreMap.dream_awake += 10;
  }

  if (countHits(picks, ["N4D", "N7D", "N10D", "N13C", "N14D", "N15A", "N15C", "N16D"]) >= 4) {
    scoreMap.wind_forgiveness += 12;
  }

  if (countHits(picks, ["N4C", "N4D", "N8C", "N9C", "N13C", "N14A", "N14D", "N15C", "N16B", "N16C"]) >= 4) {
    scoreMap.late_wick += 9;
  }

  if (countHits(picks, ["N2A", "N2D", "N5B", "N5C", "N6B", "N6C", "N10B", "N11A", "N12B", "N16B"]) >= 4) {
    scoreMap.second_heart += 10;
  }

  if (countHits(picks, ["N3B", "N6D", "N7B", "N11C", "N12A", "N14B", "N16B", "N16C"]) >= 4) {
    scoreMap.still_water_lighthouse += 10;
  }

  if (countHits(picks, ["N3B", "N5B", "N5D", "N8C", "N14B", "N15D", "N16B"]) >= 4) {
    scoreMap.late_sugar += 9;
  }

  if (countHits(picks, ["N3B", "N5B", "N5D", "N6B", "N11C", "N12B", "N14B", "N15D", "N16B"]) >= 4) {
    scoreMap.soft_rib_not_rusted += 9;
  }

  if (countHits(picks, ["N2C", "N5D", "N6C", "N7C", "N11D", "N12D", "N15B", "N16C"]) >= 4) {
    scoreMap.old_night_echo += 10;
  }

  if (countHits(picks, ["N1C", "N3C", "N3D", "N6B", "N6C", "N7C", "N9D", "N11D", "N15D", "N16C"]) >= 4) {
    scoreMap.burn_mark += 10;
  }

  const softReleaseHits = countHits(picks, ["N9C", "N10D", "N13C", "N14D", "N15A", "N15C", "N16D"]);
  if (softReleaseHits >= 2) {
    scoreMap.empty_crown -= 6;
    scoreMap.good_news -= 4;
  }

  const warmthBoundaryHits = countHits(picks, ["N11C", "N12A", "N14B", "N16B"]);
  if (warmthBoundaryHits >= 2) {
    scoreMap.second_heart -= 3;
    scoreMap.still_water_lighthouse += 3;
  }

  const silentWithdrawalHits = countHits(picks, ["N11D", "N12D", "N15B", "N15D"]);
  if (silentWithdrawalHits >= 2) {
    scoreMap.old_night_echo += 2;
    scoreMap.burn_mark += 2;
  }

  const winnerId = breakTie(scoreMap, traits, picks);
  return resultCards.find((card) => card.id === winnerId) || resultCards[0];
}

function App() {
  const [stage, setStage] = useState<Stage>("cover");
  const [originIndex, setOriginIndex] = useState(0);
  const [nodeIndex, setNodeIndex] = useState(0);
  const [currentFeedback, setCurrentFeedback] = useState("");
  const [identityMode, setIdentityMode] = useState<"self" | "parallel" | "">("");
  const [originAnswers, setOriginAnswers] = useState<Record<string, string>>({});
  const [nodeAnswers, setNodeAnswers] = useState<string[]>([]);
  const [imageFailed, setImageFailed] = useState(false);

  const currentOrigin = originQuestions[originIndex];
  const currentNode = storyNodes[nodeIndex];

  const result = useMemo(() => {
    return calculateResult(originAnswers, nodeAnswers);
  }, [originAnswers, nodeAnswers]);

  const resultImage = resultImageMap[result.id] || "";

  useEffect(() => {
    setImageFailed(false);
  }, [result.id, stage, identityMode]);

  if (stage === "cover") {
    return (
      <main className="fate-shell">
        <div className="fate-panel" style={{ ...wrapStyle, textAlign: "center", lineHeight: 1.9 }}>
          <p className="fate-eyebrow">命运侧录</p>
          <h1 style={{ fontSize: "38px", marginBottom: "12px", letterSpacing: "0.08em" }}>
            命运侧录
          </h1>
          <p style={{ fontSize: "14px", opacity: 0.7, marginBottom: "28px" }}>
            一次关于命运、补偿与自我命名的互动阅读
          </p>
          <p style={{ marginBottom: "32px", fontSize: "16px" }}>
            有些人生适合被讲述，
            <br />
            有些人生只适合被侧写。
            <br />
            请开始读取你的那一份。
          </p>
          <button onClick={() => setStage("intro")} style={buttonStyle}>
            开始侧写
          </button>
        </div>
      </main>
    );
  }

  if (stage === "intro") {
    return (
      <main className="fate-shell">
        <div className="fate-panel" style={{ ...wrapStyle, textAlign: "center" }}>
          <h1 style={titleStyle}>进入侧录</h1>
          <p style={promptStyle}>
            接下来，你将进入一段由起点、环境与选择共同塑造的人生。
            <br />
            你可以复录自己，也可以替另一个版本的你做决定。
            <br />
            这里没有答案。
          </p>
          <button onClick={() => setStage("origin")} style={buttonStyle}>
            进入侧录
          </button>
        </div>
      </main>
    );
  }

  if (stage === "origin" && currentOrigin) {
    const selectedOrigin = originAnswers[currentOrigin.id] || "";

    return (
      <main className="fate-shell">
        <div className="fate-panel" style={wrapStyle}>
          <p style={kickerStyle}>
            开局四维 {originIndex + 1} / {originQuestions.length}
          </p>
          <h1 style={titleStyle}>{currentOrigin.title}</h1>

          <div style={listStyle}>
            {currentOrigin.options.map((option) => (
              <button
                key={option.id}
                onClick={() =>
                  setOriginAnswers((prev) => ({
                    ...prev,
                    [currentOrigin.id]: option.id,
                  }))
                }
                style={getOptionStyle(selectedOrigin === option.id)}
              >
                {option.text}
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              if (originIndex < originQuestions.length - 1) {
                setOriginIndex((prev) => prev + 1);
              } else {
                setStage("originDone");
              }
            }}
            disabled={!selectedOrigin}
            style={{
              ...buttonStyle,
              opacity: selectedOrigin ? 1 : 0.45,
              cursor: selectedOrigin ? "pointer" : "not-allowed",
            }}
          >
            {originIndex < originQuestions.length - 1 ? "下一步" : "完成开局设定"}
          </button>
        </div>
      </main>
    );
  }

  if (stage === "originDone") {
    return (
      <main className="fate-shell">
        <div className="fate-panel" style={{ ...wrapStyle, textAlign: "center" }}>
          <p style={kickerStyle}>开局完成</p>
          <h1 style={titleStyle}>你已完成开局四维</h1>

          <div style={summaryBoxStyle}>
            {originQuestions.map((q) => {
              const selected = q.options.find((o) => o.id === originAnswers[q.id]);
              return (
                <p key={q.id}>
                  <strong>{q.title}：</strong>
                  {selected?.text || ""}
                </p>
              );
            })}
          </div>

          <button
            onClick={() => {
              setNodeIndex(0);
              setStage("node");
            }}
            style={buttonStyle}
          >
            下一步进入关键节点
          </button>
        </div>
      </main>
    );
  }

  if (stage === "node" && currentNode) {
    const selectedNodeId = nodeAnswers.find((id) => id.startsWith(currentNode.id)) || "";

    return (
      <main className="fate-shell">
        <div className="fate-panel" style={wrapStyle}>
          <p style={kickerStyle}>
            关键节点 {nodeIndex + 1} / {storyNodes.length}
          </p>
          <h1 style={titleStyle}>{currentNode.title}</h1>
          <p style={promptStyle}>{currentNode.prompt}</p>

          <div style={listStyle}>
            {currentNode.options.map((option) => (
              <button
                key={option.id}
                onClick={() => {
                  setNodeAnswers((prev) => [
                    ...prev.filter((id) => !id.startsWith(currentNode.id)),
                    option.id,
                  ]);
                  setCurrentFeedback(option.feedback);
                  setStage("feedback");
                }}
                style={getOptionStyle(selectedNodeId === option.id)}
              >
                {option.text}
              </button>
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (stage === "feedback") {
    return (
      <main className="fate-shell">
        <div className="fate-panel" style={{ ...wrapStyle, textAlign: "center" }}>
          <p style={promptStyle}>{currentFeedback}</p>

          <button
            onClick={() => {
              if (nodeIndex < storyNodes.length - 1) {
                setNodeIndex((prev) => prev + 1);
                setStage("node");
              } else {
                setStage("identity");
              }
            }}
            style={buttonStyle}
          >
            继续
          </button>
        </div>
      </main>
    );
  }

  if (stage === "identity") {
    return (
      <main className="fate-shell">
        <div className="fate-panel" style={wrapStyle}>
          <p style={promptStyle}>
            这一路的选择，属于你自己，还是属于平行世界里那个从未真正活过的你？
          </p>

          <div style={listStyle}>
            <button
              onClick={() => {
                setIdentityMode("self");
                setStage("result");
              }}
              style={getOptionStyle(identityMode === "self")}
            >
              这是我自己
            </button>

            <button
              onClick={() => {
                setIdentityMode("parallel");
                setStage("result");
              }}
              style={getOptionStyle(identityMode === "parallel")}
            >
              这是平行世界的我
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="fate-shell">
      <div className="fate-panel" style={{ ...wrapStyle, textAlign: "center" }}>
        <p style={kickerStyle}>
          {identityMode === "self"
            ? "这一份侧录，已归入你本人名下。"
            : "这一份侧录，来自那个差一点活成真的你。"}
        </p>

        <div
          className={identityMode === "parallel" ? "fate-card-frame parallel" : "fate-card-frame"}
          style={{
            padding: imageFailed ? "40px 20px" : "0",
            marginBottom: "24px",
          }}
        >
          {!imageFailed && resultImage ? (
            <img
              src={resultImage}
              alt={result.name}
              className="fate-card-image"
              onError={() => {
                setImageFailed(true);
              }}
            />
          ) : (
            <div>
              <p style={{ ...kickerStyle, marginBottom: "8px" }}>卡牌图片没有成功加载</p>
              <h2 style={{ fontSize: "28px", margin: 0 }}>{result.name}</h2>
              <p style={{ ...promptStyle, marginBottom: 0 }}>
                请检查 src/assets/cards 中是否存在对应图片文件。
              </p>
            </div>
          )}
        </div>

        <div style={{ display: "flex", gap: "12px", flexDirection: "column" }}>
          <button
            style={buttonStyle}
            onClick={() => {
              alert("这一步先留作占位，后面我们再做保存图片功能。");
            }}
          >
            保存这份侧录
          </button>

          <button
            onClick={() => {
              setStage("cover");
              setOriginIndex(0);
              setNodeIndex(0);
              setCurrentFeedback("");
              setIdentityMode("");
              setOriginAnswers({});
              setNodeAnswers([]);
              setImageFailed(false);
            }}
            style={secondaryButtonStyle}
          >
            再读一次人生
          </button>
        </div>
      </div>
    </main>
  );
}

const wrapStyle: CSSProperties = {
  maxWidth: "430px",
  width: "100%",
};

const kickerStyle: CSSProperties = {
  fontSize: "13px",
  opacity: 0.62,
  marginBottom: "12px",
  textAlign: "center",
  lineHeight: 1.8,
  letterSpacing: "0.08em",
};

const titleStyle: CSSProperties = {
  fontSize: "30px",
  marginBottom: "24px",
  textAlign: "center",
  lineHeight: 1.35,
};

const promptStyle: CSSProperties = {
  fontSize: "16px",
  lineHeight: 1.95,
  marginBottom: "28px",
  textAlign: "center",
};

const listStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  marginBottom: "28px",
};

const summaryBoxStyle: CSSProperties = {
  border: "1px solid rgba(255,255,255,0.15)",
  borderRadius: "20px",
  padding: "20px",
  textAlign: "left",
  lineHeight: 1.9,
  marginBottom: "28px",
  background: "rgba(255,255,255,0.03)",
};

const buttonStyle: CSSProperties = {
  border: "1px solid rgba(255,255,255,0.25)",
  background: "transparent",
  color: "#fff",
  padding: "13px 24px",
  borderRadius: "999px",
  fontSize: "16px",
  cursor: "pointer",
  width: "100%",
};

const secondaryButtonStyle: CSSProperties = {
  border: "1px solid rgba(255,255,255,0.15)",
  background: "rgba(255,255,255,0.03)",
  color: "#fff",
  padding: "13px 24px",
  borderRadius: "999px",
  fontSize: "16px",
  cursor: "pointer",
  width: "100%",
};

function getOptionStyle(selected: boolean): CSSProperties {
  return {
    width: "100%",
    textAlign: "left",
    padding: "16px",
    borderRadius: "18px",
    border: selected
      ? "1px solid rgba(255,255,255,0.62)"
      : "1px solid rgba(255,255,255,0.18)",
    background: selected ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.02)",
    color: "#fff",
    fontSize: "15px",
    cursor: "pointer",
    lineHeight: 1.8,
    transition: "all 0.18s ease",
  };
}

export default App;