# Change Log

All notable changes to the "p5canvas" extension will be documented in this file.

## 1.5.0

- Changed communication from websockets to the internal messaging api

## 1.4.1

- Bugfix for a problem with events

## 1.4.0

- Always reloads the full canvas
- Enable all log levels
- Some improvements for ES 6 usage
- Cleaned up codebase

## 1.3.0

- Making JavaScript ES 6 the default

## 1.2.0

- Using the new WebView API

## 1.1.2

- Workaround for a bug where the p5canvas crashes and can not be re-opened

## 1.1.1

- Fixes a bug not saving the canvas under Windows
- Fixes a bug with the new ruler-layout and saving the canvas
- Resets the strokeWeight on every Code-Reload

## 1.1.0

- Adding Rulers for easier navigation

## 1.0.8

- New Save as PNG command
- Updated dependencies

## 1.0.7

- Fixed a bug, where the linting was done in all kind of files
- Fixed a bug with the p5 sound library and added relative paths for `loadSound`

## 1.0.6

- Fixed a bug, where the p5 static-object was no longer available globally
- Added support for loading images via a relative path

## 1.0.5

- Fixed a crash when selecting the preview window
- Reseting the values on restart
- Reload on Active Editor Change

## 1.0.4

- Clear the canvas on reload and resize

## 1.0.3

- New icon
- Updated p5 library
- Load after Websocket is connected between preview and editor

## 1.0.2

- Fixed a bug, where the preview was no longer updated

## 1.0.1

- Cleans the output channel after every reload

## 1.0.0

- Initial release
