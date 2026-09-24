# Loophow — AI 产品 / 数据作品集

用于 2027 届校园招聘的个人作品集。站点包含一个克制的作品集首页，以及两个可交互产品项目：

- `/projects/job-intelligence` — AI 招聘信息与 JD 智能分析工作台（主项目）
- `/projects/football-analytics` — 足球数据统计分析与可视化（轻量副项目）

招聘项目使用截至 2026-09-23 核验的公开招聘页面与 JD 摘要；匹配度、投递优先级和简历建议是针对 Loophow 当前材料的演示分析，不是招聘方结论。岗位可能随时更新或关闭，投递前必须返回官网确认。足球项目使用截至 2026-09-23 核验的英超第 5 轮赛果、第 6 轮赛程、积分榜、比赛动量、阵容、评分与关键统计；球员活动区域因没有可导出的触球坐标，明确标记为阵型与角色示意。

## Recruitment Data Sources

- 美团招聘：AI 产品经理岗、智能商业分析师（BA/DS）
- 阿里巴巴校园招聘：AI 产品经理与 2027 届校招入口
- 百度校园招聘：北京 AI 产品经理（J100665）
- 字节跳动校园招聘：产品经理－业务中台（地图数据 / GIS 方向）
- 华为校园招聘：2027 届招聘范围与 AI 工程师岗位意向

岗位数据集中在 `src/data/jobData.js`，公司图标位于 `public/companies/`。图标来自 Simple Icons，仅用于本地求职作品集演示。

## Football Data Sources

- FotMob 英超联赛页：第 5 轮 10 场赛果、第 6 轮 10 场赛程和 20 队积分榜
- FotMob 比赛详情：Brentford 3–0 Chelsea 的比分、进球、比赛动量、双方阵型与关键统计
- FotMob 球员详情：Igor Thiago 及双方 22 名首发的评分、触球、传球、跑动与速度数据
- FotMob Image Resources：球队队徽与球员头像，仅用于本地求职作品集演示

足球数据集中在 `src/data/footballData.js`，图片位于 `public/football/`。项目不会在运行时抓取第三方网站，便于稳定演示；后续更新时应重新核验来源与图片使用许可。

## Design Direction

参考招聘网站常见的信息层级、大面积留白、克制品牌色，以及体育数据产品对数字、主图和辅助指标的节奏处理。最终保留暖灰底、深色文字、单一黄绿色主强调色与少量运动橙；用边框、留白和字体层级替代重阴影。主动舍弃紫蓝渐变、玻璃拟态、发光边框、机器人/星星图标、模板化 Bento Grid 和无意义 3D 动效。

## 项目结构

```text
src/
  components/        共享组件与招聘项目视图
  data/jobData.js    已核验的公开岗位与逐岗匹配分析
  data/footballData.js 已核验的足球赛程与比赛数据
  pages/             首页与两个项目页面
  styles.css         全局设计系统与首页样式
  product.css        产品界面、图表与响应式样式
public/favicon.svg   站点图标
```

## 本地运行

```bash
npm install
npm run dev
```

生产构建与预览：

```bash
npm run build
npm run preview
```

## 部署

项目是标准 Vite 静态前端，并保留 Product Design 模板中的 Sites Worker 与部署配置。构建完成后可交给 Sites 发布，也可把 `dist/client` 部署到支持 SPA 回退的静态托管平台。托管端应把未知路径回退到 `index.html`，以保证两个项目路由可直接打开。

仓库内的 GitHub Actions 会在推送到 `main` 后执行 `npm run build:pages`，将 `dist/client` 发布到 GitHub Pages，并复制 `index.html` 为 `404.html`，保证岗位详情和比赛详情可以直接访问。

## Portfolio Usage

面试介绍建议先用首页一句话说明定位：我把复杂问题拆成可运行的产品。随后重点演示招聘情报项目的完整链路：岗位收集、JD 结构化、匹配判断、建议边界与数据可追溯性。足球项目控制在 2–3 分钟，从积分榜与完整赛程进入 Brentford–Chelsea 单场，再演示比赛动量、双方阵型与球员详情，并说明真实比赛统计和示意活动区域之间的数据边界。不要声称真实用户、DAU、商业转化或生产环境收益。
