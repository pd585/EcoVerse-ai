const fs=require('fs');
const s=fs.readFileSync('src/features/auth/components/AuthPage.tsx','utf8');
const lines=s.split('\n');
let stack=[];
for(let i=0;i<lines.length;i++){
  const line=lines[i];
  const regex=/(<\/div>|<div[^>]*>)/g;
  let m;
  while((m=regex.exec(line))){
    if(m[1] === '</div>'){
      if(stack.length===0){
        console.log('Unmatched closing </div> at', i+1);
      } else {
        stack.pop();
      }
    } else {
      // ignore self-closing like <div ... />
      if(/<div[^>]*\/\s*>/.test(m[1])) continue;
      stack.push({line:i+1});
    }
  }
}
if(stack.length>0){
  console.log('Unclosed <div> count', stack.length, 'first unclosed at line', stack[0].line);
} else {
  console.log('All divs closed');
}
