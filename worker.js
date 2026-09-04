const HTML = __HURAM_INLINE_HTML__;
const SERVICE = "dashxd-com";

function json(data, init = {}) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      "x-content-type-options": "nosniff",
      ...(init.headers || {}),
    },
  });
}

export default {
  async fetch(request) {
    const url = new URL(request.url);

    if (url.hostname === "dashxd.com") {
      url.hostname = "www.dashxd.com";
      url.protocol = "https:";
      return Response.redirect(url.toString(), 308);
    }

    if (url.hostname !== "www.dashxd.com") {
      return new Response("Not Found", { status: 404 });
    }

    if (url.pathname === "/meta") {
      const cf = request.cf || {};
      return json({
        service: SERVICE,
        colo: cf.colo || null,
        country: cf.country || null,
        httpProtocol: cf.httpProtocol || null,
        tlsVersion: cf.tlsVersion || null,
        ray: request.headers.get("cf-ray"),
      });
    }

    if (url.pathname !== "/") {
      return new Response("Not Found", { status: 404 });
    }

    return new Response(request.method === "HEAD" ? null : HTML, {
      status: 200,
      headers: {
        "content-type": "text/html; charset=utf-8",
        "cache-control": "public, max-age=300",
        "x-content-type-options": "nosniff",
      },
    });
  },
};
