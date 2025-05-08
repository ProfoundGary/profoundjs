/**
 * Handle the initial authentication page and the redirect from the OAuth2 provider
 * to the Rich Display File application, "useful-app".
 */
const crypto = require("crypto");

const HTML_HEAD = `<!doctype html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, target-densitydpi=device-dpi">
<link href="/profoundui/proddata/css/profoundui.css" rel="stylesheet" type="text/css">`;

const HTML_TAIL = "</body></html>";

/**
 * Route a request to this URL to either show the initial auth page, or draw the redirect page.
 * @param {HTTPRequest} request
 * @param {HTTPResponse} response
 */
function authpage(request, response) {
  response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  response.setHeader("Pragma", "no-cache");
  response.setHeader("Expires", "0");

  if (request.query.redir === "1") {
    redirect(request, response);
  }
  else {
    start(request, response);
  }
}

/**
 * Draw the initial auth page.
 */
function start(request, response) {
  // "state" is a cryptographically strong random sequence of characters, used later to
  // protect against cross-site forgery attacks.
  const formdata = {
    response_type: "code",
    redirect_uri: "",
    client_id: "",
    scope: "",
    state: crypto.randomUUID(),
    method: "GET",
    url: "",
    provider: ""
  };

  let message = request.query.error;

  // Get 64 random characters needed for PKCE code verification. The characters must be URL-safe
  // so that they can be passed without alteration to verify the code later.
  let code_verifier_str = "";
  while (code_verifier_str.length < 64) {
    const rand = crypto.randomInt(45, 127);
    // permitted: - . _ ~ 0-9 A-Z a-z
    if (rand === 0x2d || rand === 0x2e || rand === 0x5f || rand === 0x7e ||
    (rand >= 0x30 && rand <= 0x39) ||
    (rand >= 0x41 && rand <= 0x5a) || (rand >= 0x61 && rand <= 0x7a)) {
      code_verifier_str += String.fromCharCode(rand);
    }
  }

  const hash = crypto.createHash("sha256");
  hash.update(code_verifier_str, "utf8"); // read the random bytes into the hash object.

  let oautils;

  if (typeof message !== "string") message = "";
  try {
    oautils = require("./oautils.js");

    formdata.redirect_uri = oautils.redirectURI;
    formdata.client_id = oautils.client_id;
    formdata.scope = oautils.scope;

    formdata.code_challenge = hash.digest("base64url"); // the hash is expected to be base64url encoding.
    formdata.code_challenge_method = "S256";

    if (typeof oautils.authMethod === "string" && oautils.authMethod.length > 0 && oautils.authMethod !== "GET") {
      formdata.method = oautils.authMethod;
    }

    formdata.provider = oautils.provider;
    formdata.url = oautils.authorizationUrl;
  }
  catch (err) {
    message = String(err);
  }

  let urlErrStr = "";
  if (typeof formdata.url !== "string" || formdata.url.length < 1) {
    urlErrStr = `<p class="error">This sample app requires an "authorizationUrl" property to be defined for the OAuth2 
    provider. Please check your openapi.json file and compare with the sample in the README.md file.</p>`;
  }

  const responseHTML = `${HTML_HEAD}
<script type="text/javascript">
function init(){
  /* Store value that are only available to pages in the same origin as this page. */
  /* These values will persist even when the page redirects to the OAuth2 provider's site and back. */
  localStorage.setItem("pjs_oadata", "${formdata.state}");
  localStorage.setItem("pjs_codver", "${code_verifier_str}");
}
</script>
<style type="text/css">
p.error {
  color: red;
  white-space: normal;
}
pre {
  color: #999999;
}
div#pui {
  width: calc(100% - 20px);
  left: 10px;
  top: 10px;
}
#submit {
  width: 100px;
  height: 25px;
}
</style>
</head>
<body onload="init();">
<div id="pui">
  <p>Click Sign On to use your ${formdata.provider} account to access this app.</p>
  <form action="${formdata.url}" method="${formdata.method}">
    <input type="hidden" name="response_type" value="${formdata.response_type}" />
    <input type="hidden" name="redirect_uri" value="${formdata.redirect_uri}" />
    <input type="hidden" name="client_id" value="${formdata.client_id}" />
    <input type="hidden" name="scope" value="${formdata.scope}" />
    <input type="hidden" name="state" value="${formdata.state}" />
    <input type="hidden" name="code_challenge" value="${formdata.code_challenge}" />
    <input type="hidden" name="code_challenge_method" value="${formdata.code_challenge_method}" />

    <input type="submit" value="Sign On" class="pui-solid-button-yes blueprint-defaults" id="submit" />
  </form>
  ${urlErrStr}
  <pre>${message}</pre>
</div>
${HTML_TAIL}`;
  response.send(responseHTML);
}

/**
 * Respond to a redirect from the OAuth2 authentication server.
 */
async function redirect(request, response) {
  let strResp;
  try {
    const rquery = request.query;
    if (rquery.error) {
      // Pass on any errors to the user.
      throw new Error(`${rquery.error}\nDescription: ${rquery.error_description}\n${rquery.error_uri}\nState: ${rquery.state}`);
    }

    if (typeof rquery.code !== "string" || rquery.code.length < 1 ||
        typeof rquery.state !== "string" || rquery.state.length < 1) {
      throw new Error("Authentication server did not provide code or state.");
    }

    strResp = `${HTML_HEAD}
  <script type="text/javascript">
  function sendTokens(){
    const state = localStorage.getItem("pjs_oadata");
    if (typeof state === "string" && state.length > 0 && state === "${rquery.state}"){
      localStorage.setItem("pjs_oadata", "${rquery.code}");
      window.location = "/run/oauth2sample/useful-app";
    }
    else {
      document.body.innerHTML = '<b>Error:</b> Unable to authenticate. Invalid state.';
    }
  }
  </script>
</head>
<body onload="sendTokens();">Redirecting to session...</body>
</html>`;
  }
  catch (err) {
    strResp = `${HTML_HEAD}</head><body><pre>${err.message}\n${err.stack}</pre>${HTML_TAIL}`;
  }

  response.send(strResp);
}

exports.run = authpage;
