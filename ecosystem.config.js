module.exports = {
  apps: [
    {
      name: 'server',
      script: 'server.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '250M', // Restart if process hits 250MB
      exp_backoff_restart_delay: 100, // Exponential backoff
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
      max_memory_restart: '150M',
      exp_backoff_restart_delay: 100,
    }
  ],
};
