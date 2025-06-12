module.exports = {
  apps: [
    {
      // probably should autodetect
      instances: 1,
      max_memory_restart: '500M',
      vizion: false,
      watch: false,
      name: 'server',
      script: './build/index.js',
      watch: '.',
      ignore_watch: ['node_modules', 'data', 'sessions'],
      env_production: {
        NODE_ENV: 'production'
      },
      env_development: {
        NODE_ENV: 'development'
      },
      interpreter: 'node'
    }
  ],
  deploy: {
    production: {
      user: 'root',
      host: '67.205.189.6',
      ref: 'origin/main',
      repo: 'git@github.com:conradbkay/Snap-MDA.git',
      path: '/var/www/snapmda.com',
      'post-deploy': 'npm install'
    }
  }
}
