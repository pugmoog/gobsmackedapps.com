# Recipe Hog recipe-link deployment

Deploy this folder's `index.html` at:

`https://gobsmackedapps.com/rh-recipe`

Every shared recipe uses `https://gobsmackedapps.com/rh-recipe#[RECIPEDATA]`. When Recipe Hog is installed, the Universal Link opens the app and immediately imports the recipe. Without the app, this page displays the recipe in the browser. Its Recipe Hog link points to:

`https://apps.apple.com/app/id6798717648`

Also deploy `apple-app-site-association` at the domain root as:

`https://gobsmackedapps.com/.well-known/apple-app-site-association`

Serve the association file without a filename extension, without a redirect, and with an `application/json` content type. Keep the app's `applinks:gobsmackedapps.com` Associated Domains entitlement enabled.
