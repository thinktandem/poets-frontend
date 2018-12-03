var path = require("path");

/**
 * GET /poem-a-day?_format=json
 *
 * accept: application/json, text/plain, * / *
 * user-agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/70.0.3538.77 Chrome/70.0.3538.77 Safari/537.36
 * accept-encoding: gzip, deflate
 * accept-language: en-US,en;q=0.9
 * cookie: _gcl_au=1.1.760022406.1543268620; _ga=GA1.2.1224447554.1543268620; _vwo_uuid_v2=D55BB05551DCE444E11EA9E728F2AA2EE|44bd52e0d21f891d5413a664d3f6e98b; _gid=GA1.2.149089741.1543859192; _fbp=fb.1.1543859192257.1694956720
 * if-none-match: "2b71db-NY41E79c195ZcQO1LA+SlSfXpcM"
 * referer: https://poetsd8.lndo.site/poems
 * upgrade-insecure-requests: 1
 * x-forwarded-for: 172.19.0.1
 * x-forwarded-host: poetsd8.lndo.site
 * x-forwarded-port: 443
 * x-forwarded-proto: https
 * x-forwarded-server: f7681e687ef2
 * x-real-ip: 172.19.0.1
 * host: apipoetsd8.lndo.site
 * connection: close
 */

module.exports = function (req, res) {
  res.statusCode = 200;

  res.setHeader("server", "nginx/1.15.7");
  res.setHeader("content-type", "application/json");
  res.setHeader("transfer-encoding", "chunked");
  res.setHeader("connection", "close");
  res.setHeader("x-powered-by", "PHP/7.2.12");
  res.setHeader("set-cookie", ["XDEBUG_SESSION=www-data; expires=Mon, 03-Dec-2018 19:32:23 GMT; Max-Age=3600; path=/","SSESS304f8f6f48a5969623d7509f2c775e82=r3cFPMxbNMgBYBMPyUcMyBYWCCWmQLEjsgI8AU-3jlE; expires=Wed, 26-Dec-2018 22:05:43 GMT; Max-Age=2000000; path=/; domain=.apipoetsd8.lndo.site; secure; HttpOnly"]);
  res.setHeader("cache-control", "must-revalidate, no-cache, private");
  res.setHeader("date", "Mon, 03 Dec 2018 18:32:23 GMT");
  res.setHeader("x-ua-compatible", "IE=edge");
  res.setHeader("content-language", "en");
  res.setHeader("x-content-type-options", "nosniff");
  res.setHeader("x-frame-options", "SAMEORIGIN");
  res.setHeader("expires", "Sun, 19 Nov 1978 05:00:00 GMT");
  res.setHeader("vary", "");
  res.setHeader("x-generator", "Drupal 8 (https://www.drupal.org)");

  res.setHeader("x-yakbak-tape", path.basename(__filename, ".js"));

  res.write(new Buffer("eyJwb2VtIjp7InRpdGxlIjoiZnV0dXJlIHNvbWF0aWNzIHRvLWRvIGxpc3QiLCJ0ZXh0IjoiXHUwMDNDcHJlXHUwMDNFXHUwMDNDZW1cdTAwM0UgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGEgbG92ZSBsZXR0ZXIgdG8gdHJhY2kgYWtlbWkga2F0by1raXJpeWFtYVx1MDAzQ1wvZW1cdTAwM0VcclxuIFxyXG5kb2VzIGEgdm9pY2UgaGF2ZSB0byBiZSBhdWRpdG9yeSB0byBiZSBhIHZvaWNlP1xyXG4gXHJcbndoZXJlIGluIHRoZSBib2R5IGRvZXMgaGVhcmluZyB0YWtlIHBsYWNlP1xyXG4gXHJcbndoaWNoIGFyZSB0aGUgcXVlc3Rpb25zIHRoYXQgY2Fubm90IGJlIGFkZHJlc3NlZCBpbiBsYW5ndWFnZT9cclxuIFxyXG53aGljaCBhcmUgdGhlIHF1ZXN0aW9ucyB3aGVyZSBwcm9taXNlcyBsb2RnZT9cclxuIFxyXG5ob3cgZG8gd2UgaGVhciB3aGF0IGlzIG91dHNpZGUgb3VyIGVhcnNob3Q/XHJcbiBcclxud2hlbiBkb2VzIGRpc3RhbmNlIGxvb2sgbGlrZSBjbG9zZW5lc3MsIGZlZWwgbGlrZSB2ZWx2ZXQgc3VucmlzZSBjaGVlayB0byBjaGVlaz9cclxuIFxyXG53aGF0IGFyZSB0aGUgb2JqZWN0cywgaWRlYXMsIG9yIGV4cGVyaWVuY2VzIHdlIGRyb3AgYmVuZWF0aCB0aGUgbW9yZSBldmlkZW50IHN1cmZhY2VzIG9mIG91ciBsaXZlcyB0byB0aGUgYWlyIG9yIHdhdGVyIG9yIGdyb3VuZCBiZW5lYXRoPyBkbyB3ZSBkcm9wIHRoZW0gcHVycG9zZWZ1bGx5PyBhcmUgdGhleSBmb3Jnb3R0ZW4/XHJcbiBcclxud2hhdCB3b3JkIG1ha2VzIHRoZSBib2R5P1xyXG4gXHJcbndoYXQgYm9keSBkZWZpZXMgdGhlIHdvcmQ/XHJcbiBcclxud2hpY2ggZmlndXJlcywgc2hhcGVzLCBwcmVzZW5jZXMsIGhhdW50cywgbWV0aG9kcywgbWVkaWEsIG1vZGVzLCBlcGhlbWVyYSwgZ2VzdHVyZXMsIGFiYW5kb25tZW50cywgbW9kZWxzLCBhbnRpLW1vZGVscywgYnJlYXRocywgaGFybW9uaWNzPyB3aGljaCBzb2lsPyB3aGljaCBmaWVsZHM/XHJcbiBcclxud2hhdCBkb2VzIGJlZ2lubmluZyBzb3VuZCBsaWtlPyB3aGF0IGJvZHkgZG9lcyBjb250aW51aW5nIGZvcm0/IHdoYXQgbm90ZSBkb2VzIHBlcnNldmVyYW5jZSBodW0/XHJcbiBcclxuaXMgYSB3b3JkIGEgYm9keT9cclxuIFxyXG53aGljaCBhcGVydHVyZXM/IHdoaWNoIGhpbmdlcz9cclxuIFxyXG53aGVyZSBkb2VzIGEgYm9keSBzdGFuZCB3aXRob3V0IHNldHRsaW5nP1xyXG4gXHJcbnRocm91Z2ggd2hpY2ggaG9sZXMgZG9lcyBoaXN0b3J5IGJyZWFrIGludG8gb3VyIGRheT9cclxuIFxyXG53aGVyZSBpbiB0aGUgcGFzdCBkb2VzIHRoZSBmdXR1cmUgZXhjYXZhdGU/XHJcbiBcclxud2hlcmUgaW4gdGhlIGZ1dHVyZSBkb2VzIHRoZSBwYXN0IHByb3BlbD9cclxuIFxyXG53aGF0IGFyZSB0aGUgZGlzdGluY3Rpb25zIGJldHdlZW4gcHJveGltaXR5IGFuZCBzaW11bHRhbmVpdHk/XHJcbiBcclxud2hlcmUgZG9lcyBhIGJvZHkgcmVzaXN0IHdpdGhvdXQgcmVmdXNhbD9cclxuIFxyXG5jYW4gYm9yZGVycyBiZSBleGNlZWRlZD8gY2FuIGJvcmRlcnMgYmUgZGlzaW50ZWdyYXRlZD9cclxuIFxyXG53aGVyZSBpbiB0aGUgYm9keSBkb2VzIGhlYXJpbmcgdGFrZSBwbGFjZT9cclxuIFxyXG53aGVyZSBpbiB0aGUgYm9keSBkb2VzIGxvdmluZyB0YWtlIHBsYWNlP1xyXG4gXHJcbmhvdyBkbyB3ZSBtYWtlIGZhbWlseSB3aXRoIHNvbWVvbmUgd2UgZG8gbm90IGtub3c/XHJcbiBcclxud2hhdCBkbyB3ZSBjYXJyeSB3aXRoIHVzIGFuZCB3aGVyZSBpbiB0aGUgYm9keSBkbyB3ZSBjYXJyeSBpdD9cclxuIFxyXG5taWdodCB3ZSBiZSBwZXJtaXR0ZWQgYSB3ZSB0aGlzIGV2ZW5pbmc/XHJcbiBcclxubWF5IEkgaG9sZCB5b3VyIGhhbmQ/IHRvIGZlZWwgeW91ciBoYW5kIGFzIGl0cyBhY3R1YWwgc2hhcGUsIGNsb3RoZWQgaW4gaXRzIHBhcGVyeSB1c2VmdWwgdW5lcXVpdm9jYWwgc2tpbiwgYm9uZXMgc3RhY2tlZCBsaWtlIHRpbnkgYnJhbmNoZXMsIHRoZSBiYWxhbmNpbmcgYWN0IG9mIGEgYmlyZCwgam9pbnRzIHVubG9ja2luZywgc3BhbiBmcm9tIHRodW1iIHRvIHBpbmt5IG9jdGF2aW5nIG91dCB0b3dhcmQgdW5mYW1pbGlhciBoYXJtb25pY3M/XHJcbiBcclxud2hhdCBzcGFjZSBkb2VzIHRoZSBib2R5IG9jY3VweSBkZXNwaXRlIGV2ZXJ5dGhpbmc/XHJcbiBcclxud2hhdCBkb2VzIFx1MDAzQ2VtXHUwMDNFZGVzcGl0ZVx1MDAzQ1wvZW1cdTAwM0Ugc291bmQgbGlrZT8gd2hhdCBkb2VzIFx1MDAzQ2VtXHUwMDNFd2l0aFx1MDAzQ1wvZW1cdTAwM0Ugc291bmQgbGlrZT9cclxuIFxyXG53aGVyZSBkb2VzIFx1MDAzQ2VtXHUwMDNFYXRcdTAwM0NcL2VtXHUwMDNFIHRha2UgcGxhY2U/IHdoZXJlIGRvZXMgcmVzcGl0ZSB0YWtlIHBsYWNlPyBcclxuXHUwMDNDXC9wcmVcdTAwM0VcclxuIiwic291bmRjbG91ZCI6Ilx1MDAzQ2lmcmFtZSB3aWR0aD1cdTAwMjIxMDAlXHUwMDIyIGhlaWdodD1cdTAwMjIxNjZcdTAwMjIgc2Nyb2xsaW5nPVx1MDAyMm5vXHUwMDIyIGZyYW1lYm9yZGVyPVx1MDAyMm5vXHUwMDIyIGFsbG93PVx1MDAyMmF1dG9wbGF5XHUwMDIyIHNyYz1cdTAwMjJodHRwczpcL1wvdy5zb3VuZGNsb3VkLmNvbVwvcGxheWVyXC8/dXJsPWh0dHBzJTNBXC9cL2FwaS5zb3VuZGNsb3VkLmNvbVwvdHJhY2tzXC81MTYzODEwNzUlM0ZzZWNyZXRfdG9rZW4lM0RzLTQyN21aXHUwMDI2Y29sb3I9JTIzZmY1NTAwXHUwMDI2YXV0b19wbGF5PWZhbHNlXHUwMDI2aGlkZV9yZWxhdGVkPWZhbHNlXHUwMDI2c2hvd19jb21tZW50cz10cnVlXHUwMDI2c2hvd191c2VyPXRydWVcdTAwMjZzaG93X3JlcG9zdHM9ZmFsc2VcdTAwMjZzaG93X3RlYXNlcj10cnVlXHUwMDIyXHUwMDNFXHUwMDNDXC9pZnJhbWVcdTAwM0UifSwicG9ldCI6eyJuYW1lIjoiSmVuIEhvZmVyIiwiaW1hZ2UiOm51bGx9fQ==", "base64"));
  res.end();

  return __filename;
};
