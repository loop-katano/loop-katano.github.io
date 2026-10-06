// Local evidence rules: not an LLM or a hiring probability.
const evidence = [
 {terms:['python','数据处理','数据分析','多源数据','数据清洗','统计分析'],level:'matched',proof:'新疆科考：使用Python处理多源数据、开展区域分析。'},
 {terms:['gis','地理信息','空间数据','时空','专题制图'],level:'matched',proof:'GIS专业背景；ArcGIS空间分析、空间数据处理和专题制图。'},
 {terms:['水资源','水利','水文','资源环境'],level:'matched',proof:'新疆14地州市水资源研究、多情景模拟和优化配置。'},
 {terms:['需求调研','行业调研','需求分析','调研','行业方案','方案表达','项目材料','技术文档'],level:'matched',proof:'6个地州市实地调研、政府部门座谈、研究报告及咨询建议编制。'},
 {terms:['科研','科研项目','技术调研','论文'],level:'matched',proof:'参与国家自然科学基金及省级科研项目申报材料编制。'},
 {terms:['质量','异常','问题定位','评测'],level:'matched',proof:'50余项Agent任务：异常识别、重新验证和数据质量控制。'},
 {terms:['智能体评测','agent评测','gui'],level:'matched',proof:'大模型Agent任务评测及GUI交互数据采集。'},
 {terms:['英语'],level:'matched',proof:'CET-6：531分。'},
 {terms:['sql'],level:'partial',proof:'具备SQL基础，熟练度及复杂查询能力需进一步验证。'},
 {terms:['agent','智能体','大模型','ai应用','ai产品','提示词'],level:'partial',proof:'有Agent评测和AI工具使用实践，不能替代模型研发或生产级Agent开发。'},
 {terms:['产品','原型','工作流'],level:'partial',proof:'个人网站实现和迭代可展示；缺少正式产品实习及线上用户验证。'},
 {terms:['北斗','gnss','定位','导航','遥感','机器学习','模型'],level:'partial',proof:'具备相关专业知识或科研方法基础；具体技术栈和工程应用需逐项核查。'},
 {terms:['沟通','协作','协调'],level:'partial',proof:'科研协作和学生工作经验可迁移，不等同于企业研发协同经验。'},
];
const clean=s=>s.toLowerCase().replaceAll(/\s/g,'');
export function evaluateRequirements(requirements){
 const grouped={matched:[],partial:[],gaps:[]};
 for(const requirement of [...new Set(requirements)]){
  const rule=evidence.find(r=>r.terms.some(t=>clean(requirement).includes(clean(t))));
  grouped[rule?.level||'gaps'].push({requirement,proof:rule?.proof||'当前材料中没有足够的直接证据，需要补充或人工确认。'});
 }
 return grouped;
}
export const evaluateJob=job=>evaluateRequirements(job.keywords||[]);
export function summarizeJD(text){
 const lines=text.split(/[\n；;。]/).map(s=>s.trim()).filter(Boolean);
 const terms=[...new Set(evidence.flatMap(r=>r.terms))].filter(t=>clean(text).includes(clean(t)));
 return {lines,terms,evaluation:evaluateRequirements(terms)};
}
