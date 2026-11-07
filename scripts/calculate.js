const fs = require('fs');
const input = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const errors = [];
if (!Array.isArray(input.entries) || input.entries.length === 0) errors.push('教师课时明细不能为空');
const numericFields = ['scheduledHours','deliveredHours','makeupHours','substituteHours'];
const entries = (Array.isArray(input.entries) ? input.entries : []).map((entry, index) => {
  const normalized = {teacher:String(entry.teacher || `教师${index + 1}`)};
  for (const field of numericFields) {
    const value = Number(entry[field]);
    if (!Number.isFinite(value) || value < 0) errors.push(`${normalized.teacher}.${field}必须是非负有限数值`);
    normalized[field] = Number.isFinite(value) && value >= 0 ? value : 0;
  }
  normalized.balanceHours = Number((normalized.deliveredHours + normalized.makeupHours - normalized.scheduledHours).toFixed(2));
  return normalized;
});
if (errors.length) {
  console.log(JSON.stringify({status:'invalid',formula_version:'1.0.1',errors}, null, 2));
  process.exit(2);
}
const total = entries.reduce((acc, entry) => {
  acc.scheduledHours += entry.scheduledHours;
  acc.deliveredHours += entry.deliveredHours;
  acc.makeupHours += entry.makeupHours;
  acc.substituteHours += entry.substituteHours;
  return acc;
}, {scheduledHours:0,deliveredHours:0,makeupHours:0,substituteHours:0});
total.balanceHours = Number((total.deliveredHours + total.makeupHours - total.scheduledHours).toFixed(2));
console.log(JSON.stringify({status:'ok',formula_version:'1.0.1',entries,total}, null, 2));
