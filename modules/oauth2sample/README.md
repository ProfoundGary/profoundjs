# OAuth2 Sample
This sample workspace provides a sample sign on screen, a screen for calling an API, a sample API, and back-end code to glue these parts together.

The sample application, "useful-app.json", requires users to authenticate via an OAuth2 provider. Once authenticated, a user can click a button causing the Profound.js (PJS) server to call the provided sample API route, defined in "mywebservices.api.json". The HTTP request to the API route includes an HTTP header containing the user's OAuth2 token, which verifies the user's identity. The API will return a message if the PJS security store permits the user to access the sample API.

Disclaimer: this sample is provided to demonstrate OAuth2 for Profound API. This example and its code are not meant as a demonstration of good sign-on coding and are provided AS-IS with no warranty. The sign-on code should not be used in production servers.
## Setup

### 1. Install Sample Workspace: oauth2sample
If you are reading this README from within your own Profound.js instance inside the /modules/oauth2sample/ directory, then you can skip this step.

Otherwise, the oauth2sample workspace can be installed by running this command from the directory of your Profound.js installation:
`node complete_install --installSamples`

If you do not already have a config.js file, then you will be prompted for some settings. When asked about sample code, answer y for yes.

For example, your terminal screen may look like below:
```
$ cd /your-profoundjs-instance/
$ node complete_install --installSamples

Specify port number for Profound.js server (8081):
Install with Git integration (y)? n
Install sample code (y)? y

config.js updated.
[...]
Copying pjssamples.
Copying sample workspace into /your-profoundjs-instance/modules/oauth2sample
[...]
Profound.js installation complete.
```

### 2. Setup an app with an OAuth2 Provider
Before the oauth2sample app can authenticate users via OAuth2, an app must be defined with an OAuth2 authorization server (identity provider).

An authorization server authorizes a user or an API consumer to access some resource. Common providers of authorization servers are Google, Facebook, and Microsoft.

Basic steps with the provider should include:
* creating an account if you do not already have one.
* specifying one or more Redirect URIs.
* obtaining a Client ID
* obtaining a Client Secret

You may use Google, Amazon, Microsoft, Facebook, GitHub, Twitter, or any other authorization server. This guide covers implementing with Microsoft, Google, and GitHub. The sample app requires at least one OAuth2 provider to be configured.

#### Microsoft Entra (Azure Active Directory)
1. Log into your Microsoft Entra / Azure account and go to: https://entra.microsoft.com/#blade/Microsoft_AAD_IAM/TenantOverview.ReactView
(or https://entra.microsoft.com/#home).
2. In the left panel, click Applications > App registrations.
    1. Click the "+ New registration" near the top of the screen.
    2. Enter a name, e.g. "OAuth2 Sample"
    3. For Supported account types, specify the intended users; e.g. "Accounts in this organizational directory only ... Single tenant".
    4. For Redirect URI specify:
        * Platform: "Platform: Single-page application (SPA)"
        * URI: specify a URI used to reach the sample express route running on your PJS server and a special parameter for redirecting; e.g., https://localhost:8081/run/oauth2sample/authpage?redir=1
    5. Click "Register"
3. After clicking Register you should be shown an "App registration" screen for the new app.
    1. Copy the "Application (client) ID" value, and paste it into a temporary text file. That value will become the "client_id" in the settings.json for the workspace.
    2. You should see an "Endpoints" button near the top of the screen. Click it to see some required URLs.
        * Copy the "OAuth 2.0 authorization endpoint (v2)" URL into a temporary text file. (This will become the "authorizationUrl" in the openapi.json)
        * Copy the "OAuth 2.0 token endpoint (v2)" URL into a temporary text file. (This will become the "tokenUrl" in the openapi.json)
4. Click the "Authentication" link on the left panel under Manage.
    1. Make sure you see a platform, "Single-page application" with "Redirect URIs" and an entry with the redirect URI that you set previously. If you do not, then set one or more URIs now.
    2. Do NOT check anything under "Implicit grant and hybrid flows"
    3. Under "Supported account types" you should see "Accounts in this organizational directory only" or what you picked previously.
    4. Leave "Allow public client flows" > "Enable the following mobile and desktop flows": as "No".
5. Click the "Certificates & secrets" link on the left panel under Manage.
    1. Click the "Client secrets" section.
    2. Click on the "+ New client secret" link.
    3. Set a name, e.g., "OAuth2 smaple secret"
    4. Set an expiration to something, e.g. "90 days (3 months)"
    5. Click "Add"
    6. While it is visible, copy the "Value" and paste it into a temporary text file. The value will become the "client_secret" later in your settings.js file in the workspace.
6. Click the "API permissions" link on the left panel under Manage.
    1. Under "Configured permissions" click "+ Add a permission".
        * Specify "Microsft Graph"
        * Choose "Delegated permissions
        * Add and enable permissions for "User.read" (Sign in and read user profile), "email" (View user's email address), and "openid" (Sign users in).
7. Paste the client_id and client_secret into the /modules/oauth2sample/settings.js file under the providerSettings.Microsoft entries, replacing the text "__enter-your-client-id-here__" and "__enter-your-client-secret-here__".


#### Google
1. Log in to a Google account and go to https://console.cloud.google.com/apis/credentials
2. Click "Create Project " if there is none. Input the following data and click "Create".
    1. Project Name: PAPI OAuth2 Project (e.g.)
    2. Location: (pick the default)
3. On the Left Panel, click "OAuth consent screen".
    1. For User Type, choose "External " and click "Create".
    2. For App Information, input the following data and click "Save and Continue".
        * App name: PAPI OAuth2 App (e.g.)
        * User support email: (pick the default)
        * Developer contact information email addresses: (same as support)
    3. For Scopes and Test Users, click "Save and Continue" to skip.
    4. For Summary, click "Back to Dashboard".
4. On the Left Panel, click "Credentials". Go to "+ Create Credentials -> OAuth client ID". Input the following data and click "Create".
    * Application type: Web application
    * Name: PAPI OAuth2 Client 1 (e.g.)
    * Authorized redirect URIs: The URL of your Profound.js instance including the special path to the custom Express program, authpage: /run/oauth2sample/authpage?redir=1 ; Examples:
        * https://myapp.example.com/run/oauth2sample/authpage?redir=1 
        * http://localhost:8081/run/oauth2sample/authpage?redir=1
5. Copy the Client ID and the Client Secret and store it in the /modules/oauth2sample/settings.js file under Google.

#### GitHub
1. Log in at https://github.com/
2. Go to "Settings -> Developer Settings -> OAuth Apps -> New OAuth App".
3. Input the following and click "Register Application".
    * Application Name: PAPI OAuth2 Application (e.g.)
    * Homepage URL: Specify the URL you use to reach your Profound.js instance in your browser; e.g., http://localhost:8081/
    * Authorization callback URL: The URL of your Profound.js instance including the special path, /run/oauth2sample/authpage?redir=1 ; e.g. http://localhost:8081/run/oauth2sample/authpage?redir=1
4. Click "Generate a new client secret" and authenticate on the security prompt.
5. Copy the Client ID and the Client Secret and store it in the /modules/oauth2sample/settings.js file under GitHub.

### 3. Configure Profound.js for OpenAPI
Your Profound.js instance will provide resources for users or API consumers and will handle the authentication. Your Profound.js server should already be setup and running. (The Profound.js server is considered the Resource Server in OAuth2 terminology. https://www.oauth.com/oauth2-servers/the-resource-server/)

Configuration for the OAuth2 component of PAPI is in the openapi.json file, which will exist in the base directory of your Profound.js installation when an OpenAPI security store is configured. (To setup the security store, please see https://docs.profoundlogic.com/Profound+API/Authentication+-+Authorization/Security+Store+Configuration)

If the openapi.json file does not exist yet, then the file can be created by navigating to the IDE (e.g. http://localhost:8081/ide), then clicking the "API Options" toolbar button, "OpenAPI Configuration". You will then be shown a basic editor with sample JSON for the openapi.json and can save the file to create it. 

If the openapi.json file already exists but does not have entries for OAuth2 under components.securitySchemes, then those entries need to be added.

To make sure you test your security settings correctly, ensure the value of "x-allowAnonymous" is false. The security property should be an array of objects, including which authorization schemes are permitted. e.g. just to allow OAuth2:
```
"security": [
  {
    "OAuth2": []
  }
]
```
Or to allow either "ApiKeyAuth" or an OAuth2 security scheme defined as "OAuth2_Example":
```
"security": [
  {
    "OAuth2_Example": []
  },
  {
    "ApiKeyAuth": []
  }
]
```

Instructions for adding entries for OAuth2 into openapi.json can be found here: https://docs.profoundlogic.com//Profound+API/Authentication+-+Authorization/OpenAPI+Configuration

#### 3.1 Sample openapi.json
```
{
  "openapi": "3.0.3",
  "info": {
    "title": "APIs",
    "version": "1.0.0"
  },
  "components": {
    "securitySchemes": {
      "ApiKeyAuth": {
        "type": "apiKey",
        "in": "header",
        "name": "X-API-Key"
      },
      "OAuth2_MS_Entra_Identity": {
        "type": "oauth2",
        "description": "Microsoft Azure Active Directory (Entra)",
        "flows": {
          "authorizationCode": {
            "authorizationUrl": "https://login.microsoftonline.com/__your-tenant-id__/oauth2/v2.0/authorize",
            "tokenUrl": "https://login.microsoftonline.com/__your-tenant-id__/oauth2/v2.0/token",
            "refreshUrl": "https://example.com",
            "scopes": {
              "openid": "required for consent page",
              "User.Read": "read user info, userPrincipalName"
            },
            "x-userinfoUrl": "https://graph.microsoft.com/v1.0/me",
            "x-userinfoField": "userPrincipalName"
          }
        }
      },
      "OAuth2_GitHub": {
        "type": "oauth2",
        "flows": {
          "authorizationCode": {
            "authorizationUrl": "https://github.com/login/oauth/authorize",
            "tokenUrl": "https://github.com/login/oauth/access_token",
            "refreshUrl": "not implemented for GitHub",
            "scopes": {
              "user": "GitHub user profile"
            },
            "x-userinfoUrl": "https://api.github.com/user",
            "x-userinfoField": "login",
            "x-cacheTokenTTL": 10
          }
        }
      },
      "OAuth2_Google": {
        "type": "oauth2",
        "flows": {
          "authorizationCode": {
            "authorizationUrl": "https://accounts.google.com/o/oauth2/auth",
            "tokenUrl": "https://oauth2.googleapis.com/token",
            "refreshUrl": "https://oauth2.googleapis.com/token",
            "scopes": {
              "email": "Google email address"
            },
            "x-userinfoUrl": "https://www.googleapis.com/oauth2/v3/userinfo",
            "x-userinfoField": "email",
            "x-cacheTokenTTL": 5
          }
        }
      }
    }
  },
  "x-allowAnonymous": false,
  "security": [
    {
      "OAuth2_MS_Entra_Identity": []
    },
    {
      "OAuth2_GitHub": []
    },
    {
      "OAuth2_Google": []
    },
    {
      "ApiKeyAuth": []
    }
  ]
}
```

### 4. Specify Provider Details in Settings
Modify the oauth2sample/settings.js file.

Inside this workspace is a file, settings.js, which contains some values that should be edited. Read the comments in the file to understand what each setting does.

At a minimum, this sample app requires a provider to be set, and one entry must be setup in "providerSettings", where the entry's property name matches the value of the "provider" property. e.g., if your "provider" is "Microsoft", then you should have an object under the property name, "Microsoft", inside the "propertySettings" object.

The values inside of your "propertySettings" entry will include at least a client_id and client_secret. Depending on your OAuth2 provider, more settings may be required. If your provider is not listed, then read the options under the `[example]` to determine what your provider needs.

Set the serverDomainName to the domain name that you will use to access your PJS server, or leave it as "localhost" if you are running the example locally.

### 5. Setup API Users

1. From your Profound.js instance's IDE:
2. Go to "Home Ribbon -> API Options -> User Authentication -> API Users -> Add New User "
3. Input the user or login name of an end-user authorized to use PAPI OAuth2 and choose "New -> oauth2 -> OK"
    * Note: the username added under this dialog must match the user's account via the OAuth2 provider, e.g. email address or username.

## Run the App
Run the sample app from the starting point; e.g. http://localhost:8081/run/oauth2sample/authpage

## More information
For documentation on OAuth2 in Profound.js, see: https://docs.profoundlogic.com/PAPI+OAuth2
