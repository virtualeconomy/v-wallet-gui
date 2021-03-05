# V Wallet Gui

v wallet gui based on the basic wallet and cold wallet.

### Directory Structure

```
.
├── src                                  // all files of the application
│   ├── assets
│   │   └── imgs                         // image files
│   │   └── style                        // common less styles
│   ├── components/                      // js files of components
│   ├── utils/                           // js utils
│   ├── lib/                             // common library
│   ├── main.js                          // entrance of js
│   ├── router.js                        // defination of router
│   └── App.vue                          // entrance of vue
│
├── public                               // static html and icon files
│   ├── favicon.ico
│   └── index.html
│
├── .gitignore
├── README.md
├── babel.config.js                      // config of babel
├── gulpfile.js                          // scripts of gulp
├── package.json                         // npm settings
└── server.js                            // local server for development
```

### How to run locally

  1. install node.js (homebrew or https://nodejs.org/)

  2. clone this project

``` bash
$ git clone https://github.com/virtualeconomy/v-wallet-gui.git
```

  3. clone submodule

``` bash
  $ cd v-wallet-gui
  $ git submodule update --init
```

  4. install packages

```bash
  $ npm install
```

  5. run

```
# This runs testnet by default, if you want to switch network to mainnet, modify the NETWORK_BYTE of network.js from T to M
$ npm run dev
```
  6. open the website on ```localhost:8080```

  7. if you want the wallet to access data from a different address, edit ```config/nginx.default.conf```

```bash
  proxy_pass https://wallet.v.systems/api
```
to a particular address
