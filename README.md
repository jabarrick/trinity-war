# 三教鼎立 · Trinity War

一款在浏览器里运行的三方卡牌对战游戏。**藏传佛教 ☸**、**共产主义 ☭**、**基督教 ✝** 三方互相克制，在一座丝路绿洲的论坛上进行一场友好的较量。整个游戏只有一个 `index.html` 文件，离线可玩，手机和电脑都能用。

A three-way card battle that runs in the browser. Tibetan Buddhism, Communism and Christianity are friendly rivals at a Silk Road forum, and each one counters another (rock-paper-scissors). The whole game is one self-contained `index.html`. It works offline on desktop and phone.

Uma batalha de cartas a três para o navegador: Budismo Tibetano, Comunismo e Cristianismo são rivais amigáveis num fórum da Rota da Seda. Tudo num único `index.html`, que funciona sem ligação à internet.

## 怎么玩 / How to play

- 直接用浏览器打开 `index.html`，或访问 GitHub Pages 上的部署版本。Open `index.html` in any modern browser, or use the GitHub Pages deployment.
- 语言 / Language / Idioma：中文 · English · Português (pt-PT)。用标题画面右上角或游戏内的 🌐 按钮切换，选择会被记住。Switch with the buttons on the title screen or 🌐 in game; the choice is saved in `localStorage`.

### 模式 / Modes

| 模式 | Mode | 说明 / Notes |
|---|---|---|
| ⚔ 快速对战 | Quick match | 选一个阵营，对战两个 AI。Pick a side and face two AIs. |
| 🐪 丝路论道 | Silk Road Forum (story) | 序章 + 5 章 + 每个阵营各自的尾声。每章有独特规则，进度按阵营分别保存。Prologue, 5 chapters with special rules, and an epilogue for each side. Progress is saved per side. |
| 📚 图鉴 | Codex | 阵营典故与全部卡牌说明。Lore for each side and the full card list with effect explanations. |
| 👁 观战 | Spectate | 三个 AI 互相对战。Watch three AIs play. |

### 规则速览 / Rules in brief

- 每方 40 生命；起手 1 张攻击牌，每回合抽 1 张，手牌上限 6。Life 40; you start with 1 attack card, draw 1 per turn, hand limit 6.
- **攻击牌**（每方 24 张）消耗 🔮信仰，每回合最多 3 张。**Attack cards** (24 per side) cost faith; at most 3 per turn.
- 五类**功能牌**（装备/伟人/信条/组织/经典），各 3 档，每类只能部署 1 张：分别提供攻击力、减伤、换牌率、⭐影响/回合、🔮信仰/回合。Five kinds of **function cards** (Gear, Sage, Creed, Order, Scripture), 3 tiers each, one per zone.
- ⭐影响满 10 可放大招：☸涅槃（回满血+净化+护盾）、☭批斗（全敌-2 并拆光功能牌）、✝审判（复活 3 张攻击牌+全场灼烧+信仰）。At 10 influence, unleash your ultimate: Nirvana, Class Struggle or Judgement.
- 克制关系：☸ 克 ☭ 克 ✝ 克 ☸（伤害 ×1.2，并回血、加信仰）。Counters: ☸ beats ☭ beats ✝ beats ☸.
- 后手补偿：第 2 位起始 +1.5 信仰；第 3 位起始 +1 信仰并多 1 张起手牌。Seat 2 starts with +1.5 faith; seat 3 starts with +1 faith and an extra card.

完整规则见游戏内「📖 游戏规则」。The full rules are in the in-game Rules screen.

## 平衡 / Balance

数值用无界面的 AI 对 AI 模拟调过（每次 2–3 万局，座位随机）：

| | ☸ 藏传佛教 | ☭ 共产主义 | ✝ 基督教 | 座位 1 / 2 / 3 |
|---|---|---|---|---|
| 改动前 / before | 32.4% | 33.0% | 34.4% | 37.2% / 32.7% / 29.8% |
| 改动后 / after | 32.6% | 34.1% | 33.3% | 34.0% / 32.8% / 33.2% |

## 关于题材 / About the theme

三种传统在这里是彼此尊重的对手，不是被嘲弄的对象。卡牌取材于各自的经典、人物与历史，只是为了好玩，无意冒犯任何信仰或立场。The three traditions are treated as respectful rivals, not as targets of mockery. Cards draw on each side's scriptures, figures and history for fun, and no offence to any faith or conviction is intended.

## 开发 / Development

没有构建步骤：所有代码、样式和封面图都内嵌在 `index.html` 里。推送到 `main` 后，`.github/workflows/pages.yml` 会自动部署到 GitHub Pages。There is no build step: code, styles and the cover image are all inlined in `index.html`. Pushing to `main` deploys to GitHub Pages via `.github/workflows/pages.yml`.
