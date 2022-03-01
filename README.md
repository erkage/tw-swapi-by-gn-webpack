# tw-swapi-by-gn-webpack

A basic SPA for list People and their Planet details using [SWAPI - The Star Wars API](https://swapi.dev/).

## Demo
[tw-swapi-by-gn.netlify.app](https://tw-swapi-by-gn.netlify.app)

## Features
- Load People data
- Load People's Planet data
- Sorting with 3 state (original, asc, desc)
- Configurable People and Planet data displaying
- 3 way modal closing option (button, click outside, Esc key)
- Dark mode
- Mobile support

## Stack
- Vue3
- SASS
- Webpack

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

## Further improvement ideas
- [ ] caching the fetched data with sessionStorage or localStorage
- [ ] optimized way to get Planet names and show it instead of urls
- [ ] show the original sorting would be easier to handle if people would have an Id.
- [ ] the \<table> can be replaced with \<div>'s and css grid
- [ ] services can be refactored to be more generic
- [ ] using css vars
- [ ] enhance favicon in normal and dark mode
- [ ] add more Star Wars stuff 😉

## Copyright
Star Wars and all associated names are copyright Lucasfilm Ltd.

### Icons
- BB-8: https://www.iconfinder.com/R.Fidel
- LightSabers: https://www.iconfinder.com/sensibleworld

## License
MIT License © 2022 [Gábor Németh](https://github.com/erkage)