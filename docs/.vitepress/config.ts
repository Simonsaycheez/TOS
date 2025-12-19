import { defineConfig } from 'vitepress';

// refer https://vitepress.dev/reference/site-config for details
export default defineConfig({
  lang: 'en-US',
  title: 'VitePress',
  description: 'Vite & Vue powered static site generator.',

  themeConfig: {
    // nav: [
    //   { text: 'Definition', link: '/definition' },

    //   {
    //     text: 'Specification',
    //     items: [
    //       { text: 'Base Protocol', link: '/item-1' },
    //       { text: 'Architecture', link: '/item-3' },
    //       { text: 'Schema Reference', link: '/item-2' },
    //       { text: 'Envelope Type Reference', link: '/item-3' },
    //     ],
    //   },
    // ],

    sidebar: [
      {
        // text: 'Guide',
        items: [
          { text: 'Definition', link: '/definition' },
          {
            text: 'Specification',
            items: [
              {
                text: 'Base Protocol',
                collapsed: false,
                items: [{ text: 'Overview', link: '/base/overview' }],
              },
              { text: 'Architecture', link: '/item-3' },
              {
                text: 'Schema Reference',
                collapsed: false,
                items: [
                  { text: 'Common Type', link: '/schema/commonType' },
                  { text: 'Governance', link: '/schema/governance' },
                ],
              },
              { text: 'Envelope Type Reference', link: '/item-3' },
            ],
          },
        ],
      },
    ],
  },
});
