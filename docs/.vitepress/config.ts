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
          { text: 'Definition', collapsed: false, items: [
            {
              text: 'Overview',
              link: '/definition/overview',
            },
            { text: 'Criterion 0', link: '/definition/c0' },
            { text: 'Criterion 1', link: '/definition/c1' },
            { text: 'Criterion 2', link: '/definition/c2' },
            { text: 'Criterion 3', link: '/definition/c3' },
            { text: 'Criterion 4', link: '/definition/c4' },
            { text: 'Criterion 5', link: '/definition/c5' },
            { text: 'Criterion 6', link: '/definition/c6' },
            { text: 'Criterion 7', link: '/definition/c7' },
            { text: 'Criterion 8', link: '/definition/c8' },
            { text: 'Criterion 9', link: '/definition/c9' },
            { text: 'Criterion 10', link: '/definition/c10' },
          ], },
          {
            text: 'Specification',
            collapsed: false,
            items: [
              {
                text: 'Base Protocol',
                collapsed: false,
                items: [{ text: 'Overview', link: '/base/overview' }],
              },
              { text: 'Architecture', link: '/architecture' },
              {
                text: 'Schema Reference',
                collapsed: false,
                items: [
                  { text: 'Common Type', link: '/schema/commonType' },
                  { text: 'Governance', link: '/schema/governance' },
                  { text: 'Provenance', link: '/schema/provenance' },
                  { text: 'Lifecycle and Knowledge Management', link: '/schema/lifecycle' },
                  { text: 'Control Plane and Explanation', link: '/schema/controlPlane' },
                  { text: 'Execution', link: '/schema/execution' },
                  { text: 'SIA', link: '/schema/sia' },
                ],
              },
              { text: 'Envelope Type Reference', link: '/envelope' },
            ],
          },
        ],
      },
    ],
  },
});
