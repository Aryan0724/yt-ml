const fs = require('fs');
const path = require('path');

const pagesToCreate = [
  { route: 'integrations', title: 'Integrations' },
  { route: 'roadmap', title: 'Roadmap' },
  { route: 'creators', title: 'For Creators' },
  { route: 'brands', title: 'For Brands' },
  { route: 'agencies', title: 'For Agencies' },
  { route: 'guides', title: 'Guides & Resources' },
  { route: 'help-center', title: 'Help Center' },
  { route: 'templates', title: 'Templates' },
  { route: 'careers', title: 'Careers' },
  { route: 'partners', title: 'Partners' },
];

const template = (title) => `import { ComingSoonLight } from "@/components/landing/coming-soon-light"

export default function Page() {
  return <ComingSoonLight title="${title}" />
}
`;

pagesToCreate.forEach(page => {
  const dirPath = path.join(__dirname, 'app', page.route);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  
  const filePath = path.join(dirPath, 'page.tsx');
  fs.writeFileSync(filePath, template(page.title), 'utf8');
  console.log(`Created placeholder for /${page.route}`);
});

console.log('All placeholder pages generated.');
