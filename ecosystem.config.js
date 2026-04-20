module.exports = {
  apps: [
    {
      name: 'server',
      script: 'server.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '800M', // Increased from 250M
      exp_backoff_restart_delay: 100,
      env: {
        NODE_ENV: 'production',
      },
    },
    {
      name: 'start-tunnel',
      script: 'start-tunnel.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '300M', // Increased from 150M
      exp_backoff_restart_delay: 100,
    }
  ],
};
