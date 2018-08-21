module.exports = {
  branch: 'production',
  verifyConditions: ['@semantic-release/github', '@semantic-release/npm'],
  analyzeCommits: ['@semantic-release/commit-analyzer'],
  verifyRelease: [],
  generateNotes: ['@semantic-release/release-notes-generator'],
  prepare: ['@semantic-release/npm', './tasks/semantic/repo.js'],
  publish: ['@semantic-release/github', './tasks/semantic/repo.js'], // '@semantic-release/npm', ,
  success: ['./tasks/semantic/repo.js', '@semantic-release/github'], // ,
  fail: ['@semantic-release/github'],
  npmPublish: false
};
