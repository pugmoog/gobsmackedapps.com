# Recipe Hog recipe-link viewer

Production URL: `https://gobsmackedapps.com/rh-recipe/#6.<payload>`

## Current format (app build 19)

1. Serialize version-2 recipe metadata as minified UTF-8 JSON.
2. Compress with raw DEFLATE, level 9 (no ZIP/gzip wrapper).
3. Encode in **standard Base64** (`+` and `/`, not Base64url); omit `=` padding.
4. Insert a hyphen after every 250 encoded characters, with no trailing hyphen.
5. Prefix with `6.` and place in the URL fragment.

The viewer strips hyphens, restores Base64 padding, decodes, and decompresses
locally using `DecompressionStream('deflate-raw')` (Safari 16.4+ and current
Chrome/Firefox). Recipe fragments are not sent to the web server. Decompression
is capped at 1 MiB. Recipe text, source, rating, IDs, and tags remain in metadata;
photos are not included. Existing visual styling is retained.

Do not change this payload to Base64url without a new format version: its `-`
character would conflict with the separator. The format marker distinguishes
new links from uncompressed Base64 (version 2), Base16384 (3), custom Base32768
(4), normalization-safe Base32768 with hyphens (5), and the legacy version-1
image-bearing fragment/query formats. Those formats remain readable.

The hyphen workaround is based on Messages testing documented at
https://www.patrickweaver.net/blog/imessage-mystery/ . The user verified the
Base64/DEFLATE/250-character-break combination in the local test bench. This
is not a guarantee of unlimited URL length across all Messages versions.

## Hosting

This folder is served directly by the existing GitHub Pages site. Keep the
Universal Link association at `/.well-known/apple-app-site-association` and the
app's `applinks:gobsmackedapps.com` entitlement. Production import links use the
same version-6 format and are decoded by the app when a Universal Link opens it.

The notice links to https://apps.apple.com/app/id6798717648 . The older
Base32768 decoder's attribution is in `BASE32768-LICENSE.txt`.

For local preview, run `python3 -m http.server 8000` from the website root.
