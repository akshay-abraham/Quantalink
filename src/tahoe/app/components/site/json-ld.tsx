import React from "react";

/**
 * Structured data. The `<` escape keeps user content from closing the script
 * tag early.
 */
const JsonLd: React.FC<{ data: unknown }> = ({ data }) => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{
      __html: JSON.stringify(data).replace(/</g, "\\u003c"),
    }}
  />
);

export default JsonLd;
