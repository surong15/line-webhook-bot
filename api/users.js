import { getUserIds } from './userStore.js';

export default function handler(req, res) {
  const userIds = getUserIds();
  res.status(200).json({ count: userIds.length, userIds });
} 