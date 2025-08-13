// PM2 Ecosystem Configuration (Alternative format)
// Usage: pm2 start pm2.config.js

module.exports = {
  apps: [
    {
      name: 'sustainovate-api',
      script: './apps/api/dist/index.js',
      instances: 1,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'development',
        PORT: 4000
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 4000
      }
    },
    {
      name: 'sustainovate-jobs',
      script: './services/jobs/dist/worker.js',
      instances: 2,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'development'
      },
      env_production: {
        NODE_ENV: 'production'
      }
    },
    {
      name: 'sustainovate-export',
      script: './services/export/dist/index.js',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'development'
      },
      env_production: {
        NODE_ENV: 'production'
      }
    }
  ]
};
