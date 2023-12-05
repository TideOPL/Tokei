module.exports = {
  root: true,
  extends: ['plugin:tailwindcss/recommended', 'plugin:react/recommended', 'prettier'],
  overrides: [
    {
      files: ['*.ts', '*.tsx', '*.js'],
      parser: '@typescript-eslint/parser',
    },
  ],
  rules: {
        // 1: Turn off rules that are no longer necessary in React 17 and in Next.js
        'react/jsx-uses-react': 'off',
        'react/react-in-jsx-scope': 'off',
        // 2: We do not need to use prop types with TypeScript
        'react/prop-types': 'off',
        'react/require-default-props': 'off',
        'tailwindcss/no-custom-classname': 'off'
  }
};