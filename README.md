# Vee Wallet Gui

vee wallet gui based on the basic wallet and clod wallet.

### Directory Structure

```
.
├── src                                  // all files of the application
│   ├── assets
│   │   └── images                       // image files
│   ├── components/                      // js files of components
│   ├── views/                           // js files of view
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

### How to run

  1. install node.js (homebrew or https://nodejs.org/)
  
  2. clone this project
  
``` bash
$ git clone https://github.com/excelsia/vee-wallet-gui.git
```

  3. install packages
  
```bash
  $ cd vee-wallet-gui
  $ npm install
```

  4. run
  
```
$ npm run serve
```
