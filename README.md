# KLE Matrix to QMK Layout Converter

This project helps porting QMK layouts to VIA using the board header file that describes the matrix `<board_name>.h`, along with the config file `config.h` and the layout file `info.json`.

## Building in Windows

Electron is apparently having a lot of issues with building dependencies, so a little bit of work is needed:

```
cd node_modules/canvas
npm i nan@2.14.0
cd ../..
yarn run electron-rebuild
```
