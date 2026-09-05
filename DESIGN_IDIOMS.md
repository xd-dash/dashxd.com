# dashxd.com design idioms

`@xd-dash/dashxd.com/design` is the canonical vanilla design language for dash xd web surfaces.

## Composition

Consumers import the design source directly and pin an exact repository commit, the same way internal packages such as `auth.net.im` are composed.

```js
import {
  renderDocument,
  workerMetaFromRequest,
} from '@xd-dash/dashxd.com/design'
```

The package is deliberately framework-free and zero-runtime: it exports CSS and HTML rendering primitives rather than introducing a browser component lifecycle without a concrete need for one.

Product-specific forms, routes, state, and behavior remain in the consuming application. Shared visual and footer behavior belongs here.

## Stable visual language

The canonical primitives are:

- centered narrow page shell
- centered dash xd logo
- black controls with white text and cyan borders
- square corners
- cyan active/hover surface with black text
- magenta offset interaction shadow
- monospace text inputs/editors and runtime metadata
- centered GitHub/footer treatment

The canonical palette is defined by `DASHXD_CSS` and must not be independently redefined by consumers.

## Worker metadata

Edge metadata is response-instance data, not a separately fetched resource.

A Worker that renders a page must derive footer metadata from the **same incoming request** used to render that page:

```js
const meta = workerMetaFromRequest(request, SERVICE)
const html = renderDocument({ title, body, meta })
```

Do not add or fetch a `/meta` endpoint for footer data. A second request may execute in a different edge context and therefore describe a different request than the page itself.

HTML responses containing request-specific footer metadata should use `Cache-Control: no-store` unless the caller has explicitly removed or generalized that metadata.

## Logo

The canonical public logo URL is:

```text
https://www.dashxd.com/logo
```

The dashxd.com Worker serves that URL from the repository-owned `.site/logo` asset. Consumers reference the canonical URL rather than copying the image into each repository.

## Escaping boundary

`renderDocument`, `renderBrand`, and `renderFooter` escape values they own. Consumer-supplied `body`, `head`, and `script` are trusted composition fragments and are intentionally inserted verbatim. Consumers must escape untrusted values before placing them in those fragments.
