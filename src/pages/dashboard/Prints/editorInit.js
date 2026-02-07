export const LANDSCAPE_EDITOR_INIT = {
  plugins: 'print',
  visual: false,
  readonly: true,
  height: '100vh',
  content_style: `
    body {
      background: #fff;
    }

    .editable-section:focus-visible {
      outline: none !important;
    }

    .header,
    .footer {
      font-size: 0.8rem;
      color: #ddd;
    }

    .header {
      display: flex;
      justify-content: space-between;
      padding: 0 0 1rem 0;
    }

    .header .right-text {
      text-align: right;
    }

    .footer {
      padding: 2rem 0 0 0;
      text-align: center;
    }

    /* === LANDSCAPE PAGE STYLE === */
    @media (min-width: 1100px) {
      html {
        background: #eceef4;
        min-height: 100%;
        padding: 0.5rem;
      }

      body {
        background-color: #fff;
        box-shadow: 0 0 4px rgba(0, 0, 0, 0.15);
        box-sizing: border-box;
        margin: 1rem auto 0;

        max-width: 1120px;
        min-height: 720px;
        padding: 2.5rem 4rem;
      }
    }
  `
};
