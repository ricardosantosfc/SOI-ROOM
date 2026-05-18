export const imagesSrc = import.meta.env.VITE_MEDIA_SRC

export const images = [
  "p1", "p2", "p3", "p4", "p5", "p6", "p7", "p8", "p9", "p10", "p11", "p12", "p13", "p14", "p15", "p16", "p17", "p18"
];

export const pages = [
  {
    front: "front",
    back: images[0],
  },
];
for (let i = 1; i < images.length - 1; i += 2) {
  pages.push({
    front: images[i % images.length],
    back: images[(i + 1) % images.length],
  });
}

pages.push({
  front: images[images.length - 1],
  back: "front",
});

export const pageDescriptions = [

  {
    name: "Lucky",
    mediumYear: "Charcoal, 2021"
  },
  {
    name: "Hakuho",
    mediumYear: "Charcoal, 2022"
  },
  {
    name: "La Brasserie",
    mediumYear: "Watercolor and gouache, 2025"
  },
  {
    name: "A Walk",
    mediumYear: "Watercolor, 2021"
  },

  {
    name: "Animal studies",
    mediumYear: "Watercolor, 2022"
  },
  {
    name: "Futamigaura",
    mediumYear: "Watercolor and gouache, 2025"
  },

  {
    name: "Ink & wash sketches",
    mediumYear: "Ink, watercolor, and gouache, 2025"
  },

  {
    name: "Tiny landscapes",
    mediumYear: "Watercolor, 2020"
  },

  {
    name: "Hanadriel",
    mediumYear: "Charcoal, 2019 "
  },
  {
    name: "Girl portrait",
    mediumYear: "Charcoal, 2023"
  },
  {
    name: "Sunset studies",
    mediumYear: "Watercolor, 2021 "
  },
  {
    name: "Twilight Sailing",
    mediumYear: "Watercolor, 2025"
  },
  {
    name: "Small portraits",
    mediumYear: "Charcoal, 2021"
  },

  {
    name: "Musashi",
    mediumYear: "Charcoal, 2017"
  },

  {
    name: "Shadows of the Sun",
    mediumYear: "Ink and digital, 2024"
  },

  {
    name: "Fräulein Bürstner",
    mediumYear: "Watercolor, 2022"
  },
  {
    name: "Murmúrio da Tormenta",
    mediumYear: "Watercolor, 2021"
  },
  {
    name: "Meoto Iwa",
    mediumYear: "Watercolor, 2025"
  },

]
