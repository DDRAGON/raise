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
nginx -s reload
停止
nginx -s stop

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


