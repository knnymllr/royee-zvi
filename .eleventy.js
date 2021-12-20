const CleanCSS = require("clean-css");
const { minify } = require("terser");
const markdownIt = require("markdown-it");

module.exports = function (eleventyConfig) {

  const md = new markdownIt({
    html: true,
  });

  eleventyConfig.addFilter("markdown", (content) => {
    return md.render(content);
  });

  eleventyConfig.addFilter("cssmin", function (code) {
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

  eleventyConfig.addPassthroughCopy("src/admin");
  eleventyConfig.addPassthroughCopy("_includes/src/css");
  eleventyConfig.addPassthroughCopy("_includes/src/js");
  eleventyConfig.addPassthroughCopy("src/img");
  eleventyConfig.addPassthroughCopy("src/fonts");

  eleventyConfig.addCollection("essays", function(collection) {
    let pages = collection.getFilteredByTag("essays");
    return pages.sort(function (a,b) {
      return a.data.weight - b.data.weight;
    })
  })

  eleventyConfig.addCollection("published", function(collection) {
    let pages = collection.getFilteredByTag("published");
    return pages.sort(function (a,b) {
      return a.data.weight - b.data.weight;
    })
  })

  eleventyConfig.addCollection("stories", function(collection) {
    let pages = collection.getFilteredByTag("stories");
    return pages.sort(function (a,b) {
      return a.data.weight - b.data.weight;
    })
  })

  return {
    dir: {
      input: "src"
    }
  };
}
