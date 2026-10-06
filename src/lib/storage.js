export function downloadText(name,text,type='application/json'){
 const url=URL.createObjectURL(new Blob([text],{type}));const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
export function loadStatuses(jobs){try{const saved=JSON.parse(localStorage.getItem('loophow-jobs-v1')||'{}');const allowed=['未标记','考虑中','准备投递','已投递','不再考虑'];return Object.fromEntries(jobs.map(j=>[j.id,allowed.includes(saved[j.id])?saved[j.id]:'未标记']))}catch{return Object.fromEntries(jobs.map(j=>[j.id,'未标记']))}}
