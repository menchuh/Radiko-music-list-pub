# Radiko-music-list

## Overview

A program that retrieves a list of songs broadcast on Radiko and records them in a Google Spreadsheet.  
Additionally, it retrieves the song data and adds the track to a specific playlist in Spotify.

Radiko  
Radiko is a Japanese radio streaming application.

## Needs

- TypeScript
- ESLint
- @google/clasp
- Pretitter
- Babel
- Webpack
- yarn

## Source

- main.ts
  - main function
- programs.ts
  - Programs related to radio programs. Radio programs to be crawled should also be listed here.
- edit_sheets.ts
  - Programs related to the operation of Google Spreadsheet.
- station.ts
  - Station code enum.
- edit_playlist.ts
  - Programs related to the operation of Spotify.

## Author

Mench
