module.exports = async description => ({
  title: description.split(" ").slice(0, 3).join(" "),
  sections: ["Hero", "Features", "CTA"],
  theme: "dark"
});
