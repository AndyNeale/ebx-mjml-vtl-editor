import Mustache from "mustache";
import mjml2html from "mjml";

import campaign from "./templates/campaign.mustache";
import section from "./templates/section.mustache";
import hero from "./templates/hero.mustache";
import article from "./templates/article.mustache";

import data from "./data/data.json";

const Render = () => {
  const output = Mustache.render(campaign, data, {
    section: section,
    hero: hero,
    article: article
  });
  const mjml = mjml2html(output);

  return (
    <>
      <iframe srcDoc={mjml.html} title="Live preview" />
      <pre>{output}</pre>
    </>
  );
};

export default Render;
