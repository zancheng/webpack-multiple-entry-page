module.exports = {
  "root": true,
  "parserOptions": {
    "sourceType": "module"
  },
  "extends": "airbnb",
  "env": {
    "browser": true
  },
  "rules": {
    // 强制使用一致的换行风格
    "linebreak-style": [1,"windows"],
    "indent": ["error", 4],
    "quotes": ["error", "single"],
    "semi": ["error", "always"],
    "no-console": process.env.NODE_ENV === 'production' ? 2 : 0,
    "arrow-parens": 0
  }
};
