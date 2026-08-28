import fs from 'fs';
import path from 'path';
import { officialTemplatesData } from '../lib/templates-data.ts';

const downloadsDir = path.join(process.cwd(), 'public', 'downloads');
if (!fs.existsSync(downloadsDir)) {
  fs.mkdirSync(downloadsDir, { recursive: true });
}

// توليد ملفات Word (.doc) الرسمية النقية وحفظها مباشرة كملفات ثابتة في /public/downloads/
officialTemplatesData.forEach((template) => {
  const republic = template.documentContent.header.republic;
  const ministry = template.documentContent.header.ministry;
  const direction = template.documentContent.header.direction || '';
  const title = template.documentContent.docTitle;

  let bodyHtml = '';
  template.documentContent.sections.forEach((sec) => {
    bodyHtml += `<div style="margin-top: 18px; margin-bottom: 12px;">
      <h3 style="font-size: 13pt; color: #0f172a; border-bottom: 1.5pt solid #475569; padding-bottom: 4px; font-weight: bold; background-color: #f1f5f9; padding: 4pt 8pt;">${sec.title}</h3>`;

    if (sec.type === 'form-grid' && sec.fields) {
      bodyHtml += `<table style="width: 100%; border-collapse: collapse; margin-top: 8px; margin-bottom: 8px;" dir="rtl">`;
      for (let i = 0; i < sec.fields.length; i += 2) {
        const f1 = sec.fields[i];
        const f2 = sec.fields[i + 1];
        bodyHtml += `<tr>
          <td style="border: 1pt solid #475569; padding: 6pt 8pt; width: 25%; font-weight: bold; background-color: #f8fafc; font-size: 11pt;">${f1.label}:</td>
          <td style="border: 1pt solid #475569; padding: 6pt 8pt; width: ${f2 ? '25%' : '75%'}; font-size: 11pt; color: #334155;">............................................</td>
          ${f2 ? `
          <td style="border: 1pt solid #475569; padding: 6pt 8pt; width: 25%; font-weight: bold; background-color: #f8fafc; font-size: 11pt;">${f2.label}:</td>
          <td style="border: 1pt solid #475569; padding: 6pt 8pt; width: 25%; font-size: 11pt; color: #334155;">............................................</td>
          ` : ''}
        </tr>`;
      }
      bodyHtml += `</table>`;
    } else if (sec.bodyText) {
      const formattedText = sec.bodyText.replace(/\n/g, '<br/>');
      bodyHtml += `<div style="font-size: 11.5pt; line-height: 1.8; text-align: justify; margin: 10px 0; color: #0f172a; background-color: #ffffff; padding: 10pt; border: 1pt solid #94a3b8;">
        ${formattedText}
      </div>`;
    }
    bodyHtml += `</div>`;
  });

  const footer = template.documentContent.footerNotice.replace(/\n/g, '<br/>');

  const htmlDoc = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset='utf-8'>
      <title>${template.title}</title>
      <style>
        @page {
          size: A4;
          margin: 20mm 15mm 20mm 15mm;
        }
        body {
          font-family: 'Traditional Arabic', 'Amiri', 'Arial', sans-serif;
          direction: rtl;
          text-align: right;
          line-height: 1.6;
          color: #000;
        }
      </style>
    </head>
    <body>
      <div style="text-align: center; margin-bottom: 20px;">
        <h4 style="font-size: 13pt; margin: 0; font-weight: bold;">${republic}</h4>
        <h5 style="font-size: 11pt; margin: 4px 0; color: #334155;">${ministry.replace(/\n/g, '<br/>')}</h5>
        ${direction ? `<p style="font-size: 10pt; margin: 2px 0; color: #64748b;">${direction.replace(/\n/g, '<br/>')}</p>` : ''}
        <div style="margin: 15px auto; padding: 8px 18px; border: 2pt solid #0f172a; display: inline-block; background-color: #f1f5f9;">
          <h2 style="font-size: 15pt; margin: 0; font-weight: bold; color: #0f172a;">${title}</h2>
        </div>
      </div>
      ${bodyHtml}
      <div style="margin-top: 30px; padding-top: 15px; font-size: 11pt; line-height: 1.8; border-top: 1pt solid #94a3b8;">
        ${footer}
      </div>
    </body>
    </html>
  `;

  // حفظ كملف Word رسمي ثابت
  const wordFilePath = path.join(downloadsDir, `${template.slug}.doc`);
  fs.writeFileSync(wordFilePath, '\ufeff' + htmlDoc, 'utf-8');
});

console.log(`Successfully prepared all ${officialTemplatesData.length} official documents in public/downloads/`);
