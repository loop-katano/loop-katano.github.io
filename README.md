# 路普昊 · 个人作品集

三个可交互产品：城市会合点、招聘情报中心、足球数据实验室。

## 本地运行

```sh
npm ci
npm run dev -- --host 127.0.0.1
```

`npm run build` 生成 dist/client；`npm test` 校验空间计算及证据匹配。
`node scripts/build-preview.mjs` 生成可直接用浏览器打开的独立 HTML 预览。

## 实际实现

- 城市会合点：西安南大街局部地图，双起点、类别/距离筛选、候选排序、方案保存、CSV 导出。距离为球面直线距离，不是步行路线；地点为静态快照，营业状态未核验。
- 招聘情报中心：岗位筛选、要求提取、简历证据匹配、投递状态保存及导出。目前为 JavaScript 本地规则；没有接入在线 LLM，也不展示未经计算的匹配百分比。
- 足球数据实验室：保留联赛及比赛快照，新增世界杯决赛传球网络、向前推进分布和持球事件热区，支持球队/时段/球员筛选。没有真实上线用户指标。

## 数据来源

地图：OpenStreetMap API，范围 108.935–108.95 / 34.25–34.26，2026-10-06 获取。© OpenStreetMap contributors，ODbL 1.0，https://www.openstreetmap.org/copyright 。生成数据保留地点原始链接。

足球空间分析：StatsBomb Open Data，2022-12-18 阿根廷对法国，match 3869685。https://github.com/statsbomb/open-data 。数据集最新更新时间 2024-12-16；本项目仅分发分析聚合结果，不打包原始事件。使用条款见 public/football/StatsBomb-LICENSE.pdf。

联赛页面为已有 FotMob 比赛快照，不提供实时比分。缺少坐标的快照不生成球员活动热区。向前推进采用产品定义：纵向推进至少 10 米，不宣称与其他供应商口径等同。

数据预处理脚本 scripts/prepare-data.py 接收本地源文件；原始数据不随源码包分发。
