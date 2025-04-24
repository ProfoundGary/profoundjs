/**
 * Values in this sample configuration file should be changed to reflect the app you configured with your OAuth2 provider(s),
 * and your Profound.js server configuration.
 * This file gets read by oautils.js by the sample application code.
 */
module.exports = {
  // If you will reach the sample app on your PJS server via some domain name, then enter it here; e.g.
  // serverDomainName: "myapi.example.com",
  serverDomainName: "localhost",

  // Uncomment whichever provider you are using for the sample app, and comment out the others.
  // The app uses whichever provider is set here; and, the sample UI used the text from this property.
  provider: "[example]",
  // provider: "Microsoft",
  // provider: "GitHub",
  // provider: "Google",

  // Credentials for your OAuth2 app supplied by your provider when you configure an app; e.g. Microsoft, GitHub, Google, etc.
  // WARNING: ensure that this file is protected from unauthorized access.
  // Alternately, develop a different solution for storing and retrieving the OAuth2 app credentials.

  // Provider-specific settings can be set here. Multiple providers can be coded, but the sample
  // application currently only supports authenticating a user via one provider at a time.
  providerSettings: {
    "[example]": {
      // Most authorization servers should require a client_id and client_secret.
      client_id: "__enter-your-client-id-here__",
      client_secret: "__enter-your-client-secret-here__",

      // Authorization servers may require data to be sent via HTTP POST or by HTTP GET. The default "authMethod"
      // in this sample is GET, so this property is only necessary when the method required is not GET:
      authMethod: "GET",

      // "User-Agent" is not set by default, but if an OAuth2 provider requires an HTTP Header for "User-Agent",
      // then set this to some value.
      "User-Agent": "Profound API",

      // Some providers allow token data to be sent with the Header, "Content-Type: application/json", the default in
      // this sample app. If the authorization server expects a different content-type, then set it here.
      // The sample app sends the data as JSON by default. When content-type is x-www-form-urlencoded, then values are
      // sent as &key=value pairs.
      tokenUrlContentType: "application/x-www-form-urlencoded, charset=utf-8",

      // When exchanging code for token: some providers require the client_secret, the default. Some providers will fail
      // if the client secret is passed during that exchange. Set this to true to not send client_secret during the
      // code to token exchange.
      tokenNoSecret: true
    },

    Microsoft: {
      // Microsoft Azure AD
      client_id: "__enter-your-client-id-here__",
      client_secret: "__enter-your-client-secret-here__",

      // The settings below are necessary for Microsoft Entra (Azure AD).
      tokenUrlContentType: "application/x-www-form-urlencoded, charset=utf-8",
      tokenNoSecret: true,
      authMethod: "POST"
    },

    GitHub: {
      client_id: "__enter-your-client-id-here__",
      client_secret: "__enter-your-client-secret-here__",
      // Send the User-Agent header with requests to GitHub.
      "User-Agent": "Profound API"
    },

    Google: {
      // For a google app, only client_id and client_secret are necessary.
      client_id: "__enter-your-client-id-here__",
      client_secret: "__enter-your-client-secret-here__"
    }
  }
};

// The below lines ensure that changes to this config.js can be used without restarting the PJS server.
// Consequently, this config.js file is read and evaluated every time it is used.
resolvedMod = require.resolve(__filename);
delete require.cache[resolvedMod];
