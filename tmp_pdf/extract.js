const fs = require('fs');
const pdf = require('pdf-parse');

async function extract() {
  const files = fs.readdirSync('d:/online/public/images').filter(f => f.endsWith('.pdf'));
  for (const file of files) {
    const dataBuffer = fs.readFileSync(`d:/online/public/images/${file}`);
    const data = await pdf(dataBuffer);
    fs.writeFileSync(`d:/online/tmp_pdf/${file}.txt`, data.text);
    console.log(`Extracted: ${file} (${data.text.length} chars)`);
  }
}
extract();
