# p5canvas

The p5canvas extensions allows you to preview your p5js code in a canvas side by side with your code. The canvas refreshes live, while editing.

![Example Screenshot](images/example_01.png)
Image by Quynh Han Tran

There is a standard setup script included which setups a full width/height canvas that will be resized automatically. In one of the next versions this will become optional.

## Features

- Side Preview while editing the JavaScript file
- JSHint integration to find errors
- Loading images with relative path
- Saving the current canvas as PNG (as a command)
- Fully ES 6 compatible
- Support for `import` Statements in Beta

## Setup

This can be installed from within VS Code's "Extensions" menu by searching for `p5canvas`. You can also run `ext install garrit.p5canvas` from your terminal, or go to [the visual Studio Marketplace page of p5canvas](https://marketplace.visualstudio.com/items?itemName=garrit.p5canvas) to download the vsix file and manually install it. This last method also works in VS Codium.

## Usage

If a JavaScript file is open, a p5canvas button appears in the status bar bottom left. Click on it, to open the preview.

## Known Issues

There are currently no known issues. If you find any issues, please feel free, to message me on [Twitter](https://twitter.com/pixelkind) or [Github](https://github.com/pixelkind/p5canvas).

## Release Notes

### 1.6.1

- Showing internal JavaScript errors in the output (thanks to @ccoenen)
- Added mouse position on top ruler
- Bugfix for cannot read property document of undefined

### 1.6.0

- Beta Support for `import` Statements

### 1.5.1

- Bugfix: Canvas not showing on first open

### 1.5.0

- Changed communication from websockets to the internal messaging api

For more Information, please look at the [Changelog](CHANGELOG.md).

## License

This Library is licensed under the MIT License. Please refer to the `LICENSE.txt` for more information.
