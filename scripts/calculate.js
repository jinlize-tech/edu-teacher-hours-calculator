const fs = require('fs');
const input = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const entries = (input.entries || []).map(entry => ({
  teacher: String(entry.teacher),
  scheduledHours: Number(entry.scheduledHours || 0),
  deliveredHours: Number(entry.deliveredHours || 0),
  makeupHours: Number(entry.makeupHours || 0),
  substituteHours: Number(entry.substituteHours || 0)
}));
const total = entries.reduce((acc, entry) => {
  acc.scheduledHours += entry.scheduledHours;
  acc.deliveredHours += entry.deliveredHours;
  acc.makeupHours += entry.makeupHours;
  acc.substituteHours += entry.substituteHours;
  return acc;
}, {scheduledHours:0,deliveredHours:0,makeupHours:0,substituteHours:0});
console.log(JSON.stringify({status:'ok',formula_version:'1.0.0',entries,total}, null, 2));
