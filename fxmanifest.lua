fx_version 'cerulean'
game 'gta5'
lua54 'yes'

author 'Open Source by Monolith Vision and Contributors'
version '0.0.1 (BETA)'
description 'A modern interaction menu with Lua API made for FiveM.'

ui_page 'web/dist/index.html'
files {
  'web/dist/**',
  'menu.lua'
}

client_scripts {
  'client/main.lua',
  'lib/console.lua'
}
