import { build } from 'esbuild';
import fs from 'node:fs';
import path from 'node:path';
const output=process.argv[2] || '../portfolio-preview.html';
const assets={};
const mime={'.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.svg':'image/svg+xml','.pdf':'application/pdf','.webp':'image/webp','.ico':'image/x-icon'};
function scan(dir){for(const item of fs.readdirSync(dir,{withFileTypes:true})){const file=path.join(dir,item.name);if(item.isDirectory())scan(file);else if(mime[path.extname(file)])assets['/'+path.relative('public',file).split(path.sep).join('/')]='data:'+mime[path.extname(file)]+';base64,'+fs.readFileSync(file).toString('base64');}}
scan('public');
const bundle=await build({entryPoints:['src/main.jsx'],bundle:true,jsx:'automatic',write:false,outfile:'preview.js',format:'iife',minify:true,define:{'process.env.NODE_ENV':'"production"'},plugins:[{name:'offline-routes',setup(b){b.onLoad({filter:/\.[jt]sx?$/},async args=>{if(args.path.includes('node_modules'))return;const source=fs.readFileSync(args.path,'utf8').replaceAll('window.location.pathname',"(window.location.hash.slice(1) || '/')");return{contents:source,loader:args.path.endsWith('jsx')?'jsx':'js'};});}}]});
const js=bundle.outputFiles.find(f=>f.path.endsWith('.js')).text;
const css=bundle.outputFiles.find(f=>f.path.endsWith('.css')).text;
const boot=`const assets=${JSON.stringify(assets)};for(const method of ['pushState','replaceState']){const original=history[method].bind(history);history[method]=(state,title,url)=>original(state,title,url&&url.startsWith('/')?'#'+url:url)};addEventListener('hashchange',()=>dispatchEvent(new PopStateEvent('popstate')));function patch(el){if(el.nodeType!==1)return;for(const attr of ['src','href']){const value=el.getAttribute(attr);if(assets[value])el.setAttribute(attr,assets[value]);}const style=el.getAttribute('style');if(style&&style.includes('/football/')){const fixed=style.replace(/url\\(["']?([^"')]+)["']?\\)/g,(all,url)=>assets[url]?'url("'+assets[url]+'")':all);if(fixed!==style)el.setAttribute('style',fixed)}};new MutationObserver(records=>{for(const record of records){patch(record.target);for(const node of record.addedNodes){patch(node);if(node.querySelectorAll)node.querySelectorAll('[src],[href],[style]').forEach(patch)}}}).observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['src','href','style']});`;
fs.writeFileSync(output,`<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>路普昊 · 个人作品集预览</title><style>${css}</style><div id="root"></div><script>${(boot+js).replaceAll('</script','<\\/script')}</script></html>`);
console.log('Preview:',output,fs.statSync(output).size,'bytes');
