# 开发工具 / Dev tools

不参与游戏运行，只用于测试。Not shipped with the game; testing only.

| 命令 | 作用 |
|---|---|
| `node tools/sim.js quick 30000` | AI 对战模拟器：随机座位，统计三方胜率与座位胜率 |
| `node tools/sim.js story 3000` | 故事模式难度：AI 代替玩家（座位 1），统计每章、每个阵营的胜率 |
| `node tools/i18n-check.js` | 检查三语键值完整、占位符一致、英葡文本中没有中文 |
| `node tools/browser.js [截图目录]` | Playwright 试玩：三语 × 电脑/手机，走遍所有界面并中途切换语言，检查控制台报错、中文残留、横向溢出 |

`SEED=n` 固定随机种子；`TUNE="js"` 在模拟前执行一段代码，用于试验数值，例如 `TUNE='CB.c08.atk=4.5' node tools/sim.js quick 8000`。
