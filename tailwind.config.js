/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      "colors": {
            "primary": {
                  "50": "#eafff2",
                  "100": "#d0ffe2",
                  "200": "#a4ffc8",
                  "300": "#68ffa0",
                  "400": "#26f471",
                  "500": "#00b140",
                  "600": "#009a3a",
                  "700": "#007d31",
                  "800": "#00622a",
                  "900": "#005124",
                  "950": "#002d13"
            },
            "secondary": {
                  "50": "#fdfff0",
                  "100": "#fbffe0",
                  "200": "#f7ffc2",
                  "300": "#f1ff98",
                  "400": "#e7ff62",
                  "500": "#baff29",
                  "600": "#a3e620",
                  "700": "#8cc518",
                  "800": "#75a416",
                  "900": "#5d8317",
                  "950": "#334a08"
            }
      },
      "spacing": {
            "0": "0rem",
            "1": "0.25rem",
            "2": "0.5rem",
            "3": "0.75rem",
            "4": "1rem",
            "5": "1.25rem",
            "6": "1.5rem",
            "8": "2rem",
            "10": "2.5rem",
            "12": "3rem",
            "16": "4rem",
            "20": "5rem",
            "24": "6rem"
      },
      "borderRadius": {
            "none": "0",
            "sm": "0.125rem",
            "DEFAULT": "0.25rem",
            "md": "0.375rem",
            "lg": "0.5rem",
            "xl": "0.75rem",
            "2xl": "1rem",
            "3xl": "1.5rem",
            "full": "9999px"
      },
      "fontFamily": {
            "primary": [
                  "DM Sans"
            ],
            "mono": [
                  "ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace"
            ]
      },
      "fontSize": {
            "xs": "0.75rem",
            "sm": "0.875rem",
            "base": "1rem",
            "lg": "1.125rem",
            "xl": "1.25rem",
            "2xl": "1.5rem",
            "3xl": "1.875rem",
            "4xl": "2.25rem",
            "5xl": "3rem",
            "6xl": "3.75rem"
      },
      "fontWeight": {
            "normal": "400",
            "medium": "500",
            "semibold": "600",
            "bold": "700"
      },
      "boxShadow": {},
      "opacity": {
            "0": {
                  "value": "0",
                  "type": "opacity",
                  "description": "Fully transparent"
            },
            "25": {
                  "value": "0.25",
                  "type": "opacity",
                  "description": "Quarter opacity"
            },
            "50": {
                  "value": "0.5",
                  "type": "opacity",
                  "description": "Half opacity"
            },
            "75": {
                  "value": "0.75",
                  "type": "opacity",
                  "description": "Three quarter opacity"
            },
            "100": {
                  "value": "1",
                  "type": "opacity",
                  "description": "Fully opaque"
            }
      },
      "zIndex": {},
      "transitionDuration": {},
      "transitionTimingFunction": {},
      "screens": {}
}
  },
  plugins: [],
}