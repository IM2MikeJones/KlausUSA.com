module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("js");
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("projects");
  eleventyConfig.addPassthroughCopy("*.pdf");

  // Self-hosted fonts (Fontsource + Font Awesome)
  eleventyConfig.addPassthroughCopy({ "node_modules/@fontsource/roboto":               "fonts/roboto" });
  eleventyConfig.addPassthroughCopy({ "node_modules/@fontsource/saira":                "fonts/saira" });
  eleventyConfig.addPassthroughCopy({ "node_modules/@fontsource/saira-semi-condensed": "fonts/saira-semi-condensed" });
  eleventyConfig.addPassthroughCopy({ "node_modules/font-awesome":                     "fonts/font-awesome" });

  return {
    dir: {
      input: ".",
      includes: "_includes",
      data: "_data",
      output: "_site",
    },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
};
