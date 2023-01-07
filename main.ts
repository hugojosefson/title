#!/usr/bin/env -S deno run --allow-net --allow-env=PORT
import { serve } from "https://deno.land/std@0.170.0/http/server.ts";
import { escapeHtml } from "https://deno.land/x/escape_html@1.0.0/mod.ts";

interface TitleResponse {
  title: string;
  h1: string;
  p?: string;
}

function getTitle(request: Request): TitleResponse {
  const url = new URL(request.url);
  const path = url.pathname.slice(1);
  const search = url.search.slice(1);
  const decodedPath = decodeURIComponent(path);
  const decodedSearch = decodeURIComponent(search);
  if (decodedPath === "" && decodedSearch === "") {
    const suggestedLinkUrl = `${url.origin}/Hello World`;
    const suggestedLinkText = suggestedLinkUrl.replace(/^https?:\/\//, "");
    return {
      title: "Type something in the URL",
      h1: "Type something in the URL",
      p: `for example like <a href="${suggestedLinkUrl}">${suggestedLinkText}</a>`,
    };
  }
  return {
    title: escapeHtml(decodedPath),
    h1: escapeHtml(decodedPath),
    p: escapeHtml(decodedSearch),
  };
}

/**
 * Returns an HTML page containing an h1 element with the text from the requested path.
 * @param {Request} request
 * @returns {Response}
 */
export const handler = (request: Request): Response => {
  const title = getTitle(request);
  const body = `
<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="utf-8">
      <title>${title.title}</title>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <meta name="description" content="create link with title, and optional text">
      <meta name="keywords" content="url, placeholder, bookmark, tabs, tab, title, divider">
      <meta name="theme-color" content="#000000">
      <meta name="msapplication-TileColor" content="#000000">

      <style>
        body {
            text-align: center;
            font-family: sans-serif;
            font-size: 1rem;
            background-color: black;
            color: #b6b6b6;
            margin: 0;
            padding: 0;
            display: grid;
            place-items: center;
        }
        
        main {
            max-width: 800px;
            margin-top: 30vh;
            margin-left: 2em;
            margin-right: 2em;
            min-height: 70vh;
        }
        
        h1 {
            font-size: 2rem;
            margin: 0;
        }
        
        a {
            color: #788cbb;
        }
        </style>
    </head>
    <body>
    <main>
        ${title.h1 ? `<h1>${title.h1}</h1>` : ""}
        ${title.p ? `<p>${title.p}</p>` : ""}
        </main>
    </body>
  </html>
      `.trim();

  return new Response(body, {
    status: 200,
    headers: { "content-type": "text/html" },
  });
};

if (import.meta.main) {
  const port: number = parseInt(Deno.env.get("PORT") ?? "8080", 10);
  await serve(handler, { port });
}
