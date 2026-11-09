module.exports = {
  apps: [
    {
      name: 'polishedbyanshika-api',
      cwd: './server',
      script: 'server.js',
      instances: 'max',
      exec_mode: 'cluster',
      max_memory_restart: '300M',
      time: true, // Merged logs with human-readable timestamps
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
      // Restart & Resilience Policies
      autorestart: true,
      watch: false,
      restart_delay: 2000,
      max_restarts: 10,
      listen_timeout: 10000,
      kill_timeout: 5000,
      // Logging
      merge_logs: true,
      error_file: '../logs/pm2-error.log',
      out_file: '../logs/pm2-out.log',
    },
  ],
};

