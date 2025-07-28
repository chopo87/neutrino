# Notes

## electron-builder
Reminder: We use electron-builder to package and sign our releases as it is more flexible and configurable than electron-forge. Particularly it allows us to configure and script the signing of MSI installers.

## electron-updater
`electron-updater` is an auto-update module provided by `electron-builder`.

It supports at the very lease distribution via:
- GitHub
- S3
- Hoasted service by `electron-updater`

# Resources
- [ electron-builder's electron-updater](https://www.electron.build/auto-update.html)
- [ How to implement Automatic Updates in your Electron JS Application ](https://www.youtube.com/watch?v=oaza9tqCWXg)