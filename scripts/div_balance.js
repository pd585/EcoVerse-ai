const fs=require('fs');
const s=fs.readFileSync('src/features/auth/components/AuthPage.tsx','utf8');
const regex = new RegExp('(<div[^>]*\\/>)|(<div[^>]*>)|(</div>)','g');
let m;let stack=[];let idx=0;const lines=s.split('\n');
while((m=regex.exec(s))){
  const whole=m[0];
  const selfClosing=m[1];
  const open=m[2];
  const close=m[3];
  const upto = s.slice(0, m.index);
  const line = upto.split('\n').length;
  if(selfClosing){
    // ignore
  } else if(open){
    stack.push({line, snippet: open});
  } else if(close){
    if(stack.length===0){
      console.log('Unmatched closing </div> at line', line);
    } else {
      stack.pop();
    }
  }
}
if(stack.length) console.log('Unclosed <div> count', stack.length, 'first unclosed at line', stack[0].line);
else console.log('Balanced divs');
