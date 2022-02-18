module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  devServer: {
    proxy: 'https://localhost:44347'
  }
}
