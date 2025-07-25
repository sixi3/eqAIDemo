// Design Tokens Configuration for Next.js
// Generated by design-tokens-sync

module.exports = {
  tokens: {
    input: 'tokens.json',
    validation: {
      required: ['core.colors', 'core.spacing', 'core.typography'],
      optional: ['semantic', 'component']
    }
  },
  output: {
    css: 'styles/tokens.css',
    typescript: 'types/tokens.d.ts',
    tailwind: 'tailwind.config.js',
    scss: 'styles/_tokens.scss'
  },
  nextjs: {
    // Next.js specific configuration
    appDir: true,  // App Router support
    pages: 'app',  // App directory structure
    components: 'components',
    styles: 'styles',
    cssModules: false,
    styledJsx: false
  },
  git: {
    enabled: true,
    autoCommit: true,
    autoPush: false,
    commitMessage: '🎨 Update design tokens'
  },
  analytics: {
    enabled: true,
    autoCollect: true,
    scanDirs: ['app/**/*', 'components/**/*', 'pages/**/*'],
    fileExtensions: ['.ts', '.tsx', '.js', '.jsx', '.css', '.scss', '.module.css'],
    outputDir: '.tokens-analytics'
  },
  watch: {
    enabled: true,
    ignore: ['node_modules', '.git', '.next', 'out', 'dist']
  },
  build: {
    // Next.js build integration
    beforeBuild: 'npm run tokens:sync',
    validateBeforeCommit: true,
    generateStatic: true
  }
}; 