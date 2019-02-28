# 動かし方
1. [node](http://nodejs.org/)をインストールする
- [npm](https://github.com/npm/npm)をインストールする

    ```
    git clone git://github.com/npm/npm.git
    cd npm
    node cli.js install npm -gf
    ```
- [raise](https://github.com/DDRAGON/raise)をダウンロードする

    ```
    git clone https://github.com/DDRAGON/raise
    ```
- 依存モジュール(express, stylus, async, sokect.io, jade)をインストールする

    ```
    cd raise
    npm install express
    npm install stylus
    npm install async
    npm install sokect.io
    npm install jade
    ```
- raiseを起動する

    ```
    node app.js
    ```
- [http://localhost:3000](http://localhost:3000) にアクセスする

### gruntメモ

参考にしたサイト
http://dangerous-animal141.hatenablog.com/entry/2013/08/14/145033

sudo npm install -g grunt-cli
npm install grunt -save-dev
//grunt
npm install grunt-contrib -save-dev
//プラグイン
npm install grunt-contrib-uglify
// これがなくて動かなかった

Gruntfile.jsを作成
パスなどが正しいことを確認したら
$ grunt
で圧縮


### nginx について

nginxの設定ファイルを編集
sudo vim /etc/nginx/nginx.conf

nginxの起動
sudo service nginx start
再起動
sudo nginx -s reload
停止
sudo nginx -s stop

nginxのインストールについて
http://nomnel.net/blog/install-nginx-in-centos6-using-yum/
http://qiita.com/n0bisuke/items/1b3b4bf95b5fdfce90f8


### iptables
/etc/sysconfig/iptables
service iptables restart


### https 証明書

#### 更新のしかた
ファイルを更新したら、 nginx を再起動しよう！

#### 場所
/root/raise/httpsKeys/LETSENCRYPT1106445.cert
/root/raise/httpsKeys/LETSENCRYPT1106445.key


### config 設定
本番サーバーでの config 設定
var hostAddress = 'allin.jp';
var winAPIHostAddress = '10.0.0.13';

### nginx の設定内容

sudo cat /etc/nginx/nginx.conf

user  nginx;
worker_processes  1;

error_log  /var/log/nginx/error.log warn;
pid        /var/run/nginx.pid;


events {
    worker_connections  1024;
}


http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  /var/log/nginx/access.log  main;

    sendfile        on;
    #tcp_nopush     on;

    keepalive_timeout  65;

    #gzip  on;

    include /etc/nginx/conf.d/*.conf;

    server {
         listen      80;
         server_name allin.jp;
         return 301 https://allin.jp$request_uri;
#        location / {
#            proxy_pass https://allin.jp:3000;
#        }
    }
    server {
        listen 443 default ssl;
        ssl on;
        ssl_certificate      /home/davide/raise/httpsKeys/LETSENCRYPT1106445.cert;
        ssl_certificate_key  /home/davide/raise/httpsKeys/LETSENCRYPT1106445.key;
        server_name  allin.jp;
        ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
        location / {
            proxy_pass https://allin.jp:3000;
        }
    }
}