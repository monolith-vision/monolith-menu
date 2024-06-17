fx_version 'cerulean'
game 'gta5'
lua54 'yes'

author 'Open Source by Monolith Vision and Contributors'
version '1.1.0'
description 'A modern interaction menu with Lua API made for FiveM.'

ui_page 'web/dist/index.html'
files {
  'web/dist/**',

  'imports/menu.lua',
  'imports/dialog.lua'
}

client_scripts {
  'client/main.lua',
  'client/keys.lua'
}

server_script 'version.lua'
