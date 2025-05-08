/**
 * Utilities to handle user authentication with an OAuth2 provider through a sample user interface.
 * The code in useful-app.json or authpage.js depends on this module.
 */
module.exports = {};
const mod = module.exports;

const workspaceCfg = require("./settings.js");

mod.provider = workspaceCfg.provider;
if (typeof mod.provider !== "string" || mod.provider.length < 1) {
  throw new Error("provider was not specified in oauth2sample config");
}

const provCfg = workspaceCfg.providerSettings[mod.provider];
if (typeof provCfg !== "object" || provCfg === null) {
  throw new Error("oauth2sample config provider did not have matching providerSettings entry");
}

// Gather the server scheme, HTTP or HTTPS, and secure or insecure port.
// WARNING: Always use encryption via HTTPS for production servers.
let scheme = "https";
let port = profound.settings.securePort;
if (port === 443) {
  port = "";
}
else if (isNaN(port)) {
  scheme = "http";
  port = (profound.settings.port === 80 ? "" : ":" + profound.settings.port);
}
else {
  port = ":" + port;
}

// PROTOCOL_HOST_PORT becomes a URL for the OAuth2 redirect URL and other components in the sample app.
mod.PROTOCOL_HOST_PORT = `${scheme}://${workspaceCfg.serverDomainName}${port}`;

// This is the route in this sample application that handles the OAuth2 server's redirection of the
// client browser after authenticating or fetching an authentication code.
// Each application can have its own redirect URL.
mod.redirectURI = mod.PROTOCOL_HOST_PORT + "/run/oauth2sample/authpage?redir=1";
mod.startURI = mod.PROTOCOL_HOST_PORT + "/run/oauth2sample/authpage";

// Use provider-dependent settings if set, or use defaults.
mod.tokenUrlContentType = typeof provCfg.tokenUrlContentType === "string" ? provCfg.tokenUrlContentType : "";
mod.authMethod = typeof provCfg.authMethod === "string" ? provCfg.authMethod : "GET";
mod.tokenNoSecret = provCfg.tokenNoSecret === true;

// Headers needed by many APIs of popular OAuth2 providers.
const HTTP_REQ_HEADERS = {
  "Accept": "application/json",
  "Content-Type": "application/json"
};
if (typeof provCfg["User-Agent"] === "string") HTTP_REQ_HEADERS["User-Agent"] = provCfg["User-Agent"];

mod.client_id = provCfg.client_id;
mod.client_secret = provCfg.client_secret;

/**
 * Exchange authorization code for OAuth tokens.
 * Pre-condition: the RDF application has already validated the state.
 * @param {String} code
 * @param {undefined|String} codver  code_verifier (for PKCE for some providers)
 * @returns {Object}  with properties: access_token, expires_in, refresh_token
 */
mod.fetchTokensAsync = async function(code, codver) {
  // Assemble OAuth2 standard parameters.
  const requestData = {
    "grant_type": "authorization_code",
    "redirect_uri": this.redirectURI,
    "client_id": this.client_id,
    "client_secret": this.client_secret,
    code
  };
  if (typeof codver === "string") {
    requestData.code_verifier = codver;
  }
  if (this.tokenNoSecret) {
    // MS AD does not allow you to send client_secret. but GitHub requires it. Implementation dependent.
    delete requestData.client_secret;
  }

  const headers = JSON.parse(JSON.stringify(HTTP_REQ_HEADERS)); // copy object.
  headers.Origin = mod.PROTOCOL_HOST_PORT;

  // Some providers use a different content-type header.
  const tokenUrlContentType = this.tokenUrlContentType;
  if (typeof tokenUrlContentType === "string" && tokenUrlContentType.length > 0) {
    headers["Content-Type"] = tokenUrlContentType;
  }

  let body;
  const contentType = headers["Content-Type"];
  if (typeof contentType === "string" && contentType.indexOf("application/x-www-form-urlencoded") === 0) {
    body = "";
    let sep = "";
    for (const prop in requestData) {
      body += `${sep}${prop}=${requestData[prop]}`;
      sep = "&";
    }
  }
  else {
    body = JSON.stringify(requestData);
  }

  let responseData;
  if (typeof this.tokenUrl !== "string" || this.tokenUrl.length < 1) {
    throw new Error(`This sample app requires a "tokenUrl" property to be defined for the OAuth2
    provider. Please check your openapi.json file and compare with the sample in the README.md file.`);
  }

  try {
    responseData = await profound.httpRequest({
      method: "POST",
      uri: this.tokenUrl,
      body,
      json: true,
      headers,
      alwaysReadBody: true
    });
  }
  catch (err) {
    throw new Error(`Unable to fetch token from remote host: ${this.tokenUrl}`, { cause: err });
  }

  if (typeof responseData !== "object" || responseData === null) {
    throw new Error("Request for OAuth2 token was missing expected object.");
  }

  if (typeof responseData.access_token !== "string") {
    throw new Error("Request for OAuth2 token was missing expected access_token.", { cause: responseData });
  }

  return responseData;
};

/**
 * Request an object with user identification by providing a user access token.
 * @param {String} accessToken
 * @returns {String}
 * @throws
 */
mod.getUserIdAsync = async function(accessToken) {
  const userinfoUrl = this["x-userinfoUrl"];
  if (typeof userinfoUrl !== "string" || userinfoUrl.length < 1) {
    throw new Error("No user info URL specified");
  }
  // Use access token to request user info from the resource server.
  let userInfo;
  try {
    const headers = JSON.parse(JSON.stringify(HTTP_REQ_HEADERS)); // copy object.
    headers.Authorization = "Bearer " + accessToken;
    userInfo = await profound.httpRequest({
      method: "GET",
      uri: userinfoUrl,
      json: true,
      headers,
      alwaysReadBody: true
    });
  }
  catch (err) {
    throw new Error(`Unable to get user info from remote host: ${userinfoUrl}`, { cause: err });
  }

  if (typeof userInfo !== "object" || userInfo === null) {
    throw new Error("Response for user info request was invalid.");
  }

  const userField = this["x-userinfoField"];
  const userid = userInfo[userField];
  if (typeof userid !== "string" || userid.length < 1) {
    throw new Error("User info could not be read. Found: " + JSON.stringify(userInfo));
  }

  return userid;
};

//
// Read OpenAPI OAuth2 properties from an openapi.json config file, and assign the properties to the module object.
//

// Get the User Info URL from the openapi.json file.
const path = require("path");
const filePath = path.join(profound.dir, (profound.DEV ? "profoundjs" : ""), "openapi.json");

const openAPIConfig = require(filePath).components.securitySchemes;
// Prevent the openapi.json module from being cached; changes should be permitted without restarting PJS.
let resolvedMod = require.resolve(filePath);
delete require.cache[resolvedMod];

// Find a security scheme in openapi.json for OAuth2. (This sample code assumes one has a description or key matching mod.provider.)
let oaSecurityScheme;
let lastOaSecurityScheme;
for (const secSchemeName in openAPIConfig) {
  const secScheme = openAPIConfig[secSchemeName];
  if (typeof secScheme === "object" && secScheme !== null && typeof secScheme.type === "string" && secScheme.type.length > 0) {
    if (secScheme.type === "oauth2") {
      lastOaSecurityScheme = secScheme;

      let secSchemeDescr = secScheme.description;
      if (typeof secSchemeDescr !== "string") secSchemeDescr = "";
      else secSchemeDescr = secSchemeDescr.toLowerCase();

      const lcProv = mod.provider.toLowerCase();
      const secSchLC = secSchemeName.toLowerCase();

      // Try to find the setting matching the provider, either in the "description" property or the key name.
      if (secSchLC.indexOf(lcProv) >= 0 || secSchemeDescr.indexOf(lcProv) >= 0) {
        // Use the first OAuth2 provider found in openapi.json that matches PROVIDER.
        oaSecurityScheme = secScheme;
        break;
      }
    }
  }
}

const hint = " Check the openapi.json configuration file.";

if (typeof oaSecurityScheme !== "object" || oaSecurityScheme === null) {
  if (typeof lastOaSecurityScheme === "object" && lastOaSecurityScheme !== null) {
    // If the name of the provider could not match any description in openapi.json, then
    // use the last valid OAuth2 entry.
    oaSecurityScheme = lastOaSecurityScheme;
  }
  else {
    throw new Error(`Failed to find a security scheme of type oauth2.` + hint);
  }
}

const flows = oaSecurityScheme.flows;
if (typeof flows !== "object" || flows === null) {
  throw new Error("'flows' property is missing." + hint);
}

const authCode = oaSecurityScheme.flows.authorizationCode;
if (typeof authCode !== "object" || authCode === null) {
  throw new Error("'authorizationCode' property is missing." + hint);
}

// Scopes are required for identifying to the OAuth2 provider what resources are requested on behalf of the user.
// The requested scopes are the property names of the object defined in the "scopes" property in openapi.json.
// The "scope" data passed to APIs is expected to be a space-delimited list.
// See: https://swagger.io/specification/
const scopes = authCode.scopes;
mod.scope = typeof scopes === "object" && scopes !== null ? Object.keys(scopes).join(" ") : "";

// For convenience, copy these properties from the openapi.json into exported properties of this module.
// (PAPI security store user validation needs these properties defined in openapi.json.)
const copyList = ["authorizationUrl", "tokenUrl", "refreshUrl", "x-userinfoUrl", "x-userinfoField"];
copyList.forEach(el => {
  const exportKey = el;
  if (typeof authCode[el] === "string" || typeof authCode[el] === "boolean") {
    mod[exportKey] = authCode[el];
  }
  else {
    mod[exportKey] = "";
  }
});

// Make sure oautils is not cached so that changes to config.js can be seen without restarting the PJS server.
resolvedMod = require.resolve(__filename);
delete require.cache[resolvedMod];
