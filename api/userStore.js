import fs from 'fs';
const file = 'userIds.json';

export function addUserId(userId) {
  let userIds = [];
  if (fs.existsSync(file)) {
    userIds = JSON.parse(fs.readFileSync(file));
  }
  if (!userIds.includes(userId)) {
    userIds.push(userId);
    fs.writeFileSync(file, JSON.stringify(userIds));
  }
}

export function getUserIds() {
  if (fs.existsSync(file)) {
    return JSON.parse(fs.readFileSync(file));
  }
  return [];
} 