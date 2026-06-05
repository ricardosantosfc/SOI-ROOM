<picture>
  <source media="(prefers-color-scheme: dark)" srcset="./repo-assets/logo_dark.png">
  <img alt="SÓI ROOM logo." src="./repo-assets/logo_light.png">
</picture>

![React](https://img.shields.io/badge/React-%2320232a.svg?logo=react&logoColor=%2361DAFB)
![Three.js](https://img.shields.io/badge/Three.js-000?logo=threedotjs&logoColor=fff)

SÓI ROOM is a virtual space built to showcase works resulting from my creative hobbies, while also serving as a React and Three.js exploration project.
 


## Installing, running and building

Refer to the README in [`/app`](https://github.com/ricardosantosfc/SOI-ROOM/tree/main/app).

## Tools, libraries, credits and mentions

- Built with [Vite](https://vite.dev/).

- Most of the Three.js logic is handled via [React-Three-fiber](https://r3f.docs.pmnd.rs/getting-started/introduction) and [Drei](https://drei.docs.pmnd.rs/getting-started/introduction) wrappers and hooks. 

- State management via [Zustand](https://zustand.docs.pmnd.rs/learn/getting-started/introduction).

- Physics via [Three-Rapier](https://github.com/pmndrs/react-three-rapier). 

-  The GLB models were turned into JSX components and optimized for the web using [gltfjsx](https://github.com/pmndrs/gltfjsx).

- The app's radio is driven by [react-h5-audio-player](https://www.npmjs.com/package/react-h5-audio-player).

- [Leva](https://github.com/pmndrs/leva) generated control panels helped me easily tweak mesh colliders and animations.

- [r3f-perf](https://github.com/utsuboco/r3f-perf) helped me monitor and debug performance-related issues.

- I used [motion](https://motion.dev/) to animate a couple divs' exits.

- Sketchbook logic is partially based on [Wawa sensei's book tutorial](https://www.youtube.com/watch?v=b7a_Y1Ja6js).

- Hosted on [Cloudlflare Pages](https://pages.cloudflare.com/). Sketchbook images and radio songs are also fetched from a [R2 bucket](https://www.cloudflare.com/developer-platform/products/r2/) bound to a [Worker](https://workers.cloudflare.com/product/workers). 

- GLB models created, textured, and baked in [Blender](https://www.blender.org/).

- [Plant](https://polyhaven.com/a/potted_plant_01) and [tree](https://polyhaven.com/a/island_tree_02) meshes originally from Poly Haven, as well as most GLB meshes' textures.

- UIs and icons designed in [Figma](https://www.figma.com/). Additional icons from [Simple Design System](https://www.figma.com/community/file/1380235722331273046) and [Material Design](https://www.figma.com/community/file/1014241558898418245).

- Sound effects sourced from Pixabay. I've modified and used the following:
  
  - [seagulls](https://pixabay.com/sound-effects/seagulls-435999/), [distant ocean](https://pixabay.com/sound-effects/nature-distant-gentle-ocean-dawn-chorus-23535/), [morning birds](https://pixabay.com/sound-effects/nature-a-beautiful-morning-concert-by-birds-16042017-haar-germany-461378/)
  - [button toggle](https://pixabay.com/sound-effects/film-special-effects-button-press-85188/) 
  - [footsteps](https://pixabay.com/sound-effects/film-special-effects-walking-on-wood-363349/) 
  - [page flip](https://pixabay.com/sound-effects/household-closing-a-book-14771/)
  - [radio switch](https://pixabay.com/sound-effects/film-special-effects-radio-switch-83014/), [radio noise](https://pixabay.com/sound-effects/film-special-effects-old-radio-noise-46734/)
