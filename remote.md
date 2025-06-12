# Remote

Instructions for setting up a deployment server

Setup A record in DNS settings

cd /var/www/conradkay.com

mkdir Mantella

vim .env

_paste_

cd /etc/nginx/sites-available

vim mantella.conradkay.com

```conf
server {
server_name mantella.conradkay.com;

    location / {
        proxy_pass http://localhost:4008;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

sudo ln -s /etc/nginx/sites-available/mantella.conradkay.com /etc/nginx/sites-enabled/mantella.conradkay.com

sudo systemctl restart nginx

nginx -s reload

- app needs to be running properly before this

sudo certbot --nginx -d mantella.conradkay.com
