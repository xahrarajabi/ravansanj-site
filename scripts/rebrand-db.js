const { PrismaClient } = require("@prisma/client");
const p = new PrismaClient();

async function main() {
  const items = await p.faqItem.findMany();
  for (const f of items) {
    const question = f.question.split("میزون").join("روان‌سنج");
    const answer = f.answer.split("میزون").join("روان‌سنج");
    if (question !== f.question || answer !== f.answer) {
      await p.faqItem.update({ where: { id: f.id }, data: { question, answer } });
      console.log("faq", f.id);
    }
  }
  const demos = await p.demographicQuestion.findMany();
  for (const d of demos) {
    const text = d.text.split("میزون").join("روان‌سنج");
    if (text !== d.text) {
      await p.demographicQuestion.update({ where: { id: d.id }, data: { text } });
      console.log("demo", d.key);
    }
  }
}

main()
  .then(() => p.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await p.$disconnect();
    process.exit(1);
  });
