const CleanCSS = require("clean-css");
const { minify } = require("terser");

module.exports = function (eleventyConfig) {
    
    eleventyConfig.addFilter("cssmin", function(code) {
        return new CleanCSS({}).minify(code).styles;
      });

    eleventyConfig.addNunjucksAsyncFilter("jsmin", async function (
        code,
        callback
      ) {
        try {
          const minified = await minify(code);
          callback(null, minified.code);
        } catch (err) {
          console.error("Terser error: ", err);
          // Fail gracefully.
          callback(null, code);
        }
      });

    eleventyConfig.addPassthroughCopy("_includes/src/css");
    eleventyConfig.addPassthroughCopy("_includes/src/js");
    eleventyConfig.addPassthroughCopy("src/img");
    eleventyConfig.addPassthroughCopy("src/fonts");

    return {
        dir: {
            input: "src"
        }
    };
}
