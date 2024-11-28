# p5canvas

The p5canvas extensions allows you to preview your p5js code in a canvas side by side with your code. The canvas refreshes live, while editing.

![Example Screenshot](images/example_01.png)
Image by Quynh Han Tran

There is a standard setup script included which setups a full width/height canvas that will be resized automatically, but you can override that with your script.

## Features

- Side Preview while editing the JavaScript file
- JSHint integration to find errors
- Loading images and fonts with relative path
- Saving the current canvas as PNG (as a command)
- Fully ES 6 compatible
- Support for `import` Statements in Beta

## Setup

This can be installed from within VS Code's "Extensions" menu by searching for `p5canvas`. You can also run `ext install garrit.p5canvas` from your terminal, or go to [the visual Studio Marketplace page of p5canvas](https://marketplace.visualstudio.com/items?itemName=garrit.p5canvas) to download the vsix file and manually install it. It is also available as extension in VS Codium.

## Usage

If a JavaScript file is open, a p5canvas button appears in the status bar bottom left. Click on it, to open the preview.

## Known Issues

If you find any issues, please feel free, to write an issue on [Github](https://github.com/pixelkind/p5canvas).

## Release Notes

### 1.7.2

- Updated the p5.js friendly error system to support line numbers, thanks to @ccoenen
- Fixed a bug with wrong width and height, if you use custom canvas size
- Added support for loadFont

### 1.7.1

- Forwarding the p5.js friendly errors
- Updated to p5.js 1.4.2
- Fixing bug with wrong `width` and `height` values

### 1.7.0

- Update to the latest version of p5js
- Adding support for `preload` function
- Adding support for `setup` function
- Adding support to use `createCanvas` to create a fixed size or a `WEBGL` canvas

### 1.6.1

- Showing internal JavaScript errors in the output (thanks to @ccoenen)
- Added mouse position on top ruler
- Bugfix for cannot read property document of undefined

### 1.6.0

- Beta Support for `import` Statements

For more Information, please look at the [Changelog](CHANGELOG.md).

## License

This Library is licensed under the MIT License. Please refer to the `LICENSE.txt` for more information.
