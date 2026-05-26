const fs = require('fs');
const path = require('path');

const filesToProcess = [
  path.join(__dirname, 'app/dashboard/layout.tsx'),
  path.join(__dirname, 'components/dashboard/sidebar.tsx'),
  path.join(__dirname, 'app/dashboard/page.tsx'),
  path.join(__dirname, 'app/dashboard/history/page.tsx')
];

const replacements = [
  // Backgrounds
  { regex: /bg-\[#030303\]/g, replace: 'bg-[#FAF9F6]' },
  { regex: /bg-\[#0a0a0a\]/gi, replace: 'bg-[#FAF9F6]' },
  { regex: /bg-black\/40/g, replace: 'bg-[#FAF9F6]' },
  { regex: /bg-zinc-900/g, replace: 'bg-white' },
  { regex: /bg-zinc-950/g, replace: 'bg-white' },
  { regex: /bg-black\/20/g, replace: 'bg-zinc-50' },
  { regex: /bg-white\/10/g, replace: 'bg-black/5' },
  { regex: /bg-white\/5/g, replace: 'bg-black/5' },
  { regex: /hover:bg-white\/10/g, replace: 'hover:bg-black/5' },
  { regex: /hover:bg-white\/5/g, replace: 'hover:bg-black/5' },
  
  // Borders
  { regex: /border-white\/10/g, replace: 'border-zinc-200' },
  { regex: /border-white\/5/g, replace: 'border-zinc-200' },
  { regex: /border-zinc-800/g, replace: 'border-zinc-200' },
  { regex: /border-t-white/g, replace: 'border-t-black' },

  // Text
  { regex: /text-white/g, replace: 'text-black' },
  { regex: /text-zinc-400/g, replace: 'text-zinc-500' },
  { regex: /hover:text-white/g, replace: 'hover:text-black' },
  { regex: /text-zinc-300/g, replace: 'text-zinc-600' },
  { regex: /text-zinc-200/g, replace: 'text-zinc-700' },

  // Logos
  { regex: /logo-2\.png/g, replace: 'logo-1.png' },

  // Specific components
  { regex: /glass-card/g, replace: 'bg-white shadow-2xl rounded-2xl border border-zinc-200' },
  { regex: /glass/g, replace: '' },
];

filesToProcess.forEach(filePath => {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // We need to do a multi-pass or be careful with overlapping replacements. 
    // The order above should be mostly safe.
    let modifications = 0;
    replacements.forEach(rule => {
      const originalContent = content;
      content = content.replace(rule.regex, rule.replace);
      if (originalContent !== content) modifications++;
    });

    // Special fix for the active nav link in sidebar.tsx which might get messed up by simple replaces
    // Original: "bg-white/10 text-white" 
    // Replaced: "bg-black/5 text-black"
    // Let's make active state stand out more:
    content = content.replace(/bg-black\/5 text-black/g, 'bg-black text-white shadow-sm');
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated: ${filePath} (${modifications} rules applied)`);
  } else {
    console.log(`File not found: ${filePath}`);
  }
});

console.log("Migration script complete.");
