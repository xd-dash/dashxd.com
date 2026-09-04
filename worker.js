export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.hostname === "dashxd.com") {
      url.hostname = "www.dashxd.com";
      url.protocol = "https:";
      return Response.redirect(url.toString(), 308);
    }

    if (url.hostname !== "www.dashxd.com") {
      return new Response("Not Found", { status: 404 });
    }

    return env.ASSETS.fetch(request);
  },
};
