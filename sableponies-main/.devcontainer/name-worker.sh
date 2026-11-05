#!/bin/sh
# Renames the Cloudflare Worker and its crowdriff.build subdomain in wrangler.jsonc after
# this repo, so each repo made from the template deploys to its own Worker and address. Runs on every codespace start; it does nothing
# once the name is changed, outside a codespace, and in the template repo itself.
set -eu

TEMPLATE_NAME=destination-converge
TEMPLATE_REPO=Converge-2026/web-app-template

[ -n "${GITHUB_REPOSITORY:-}" ] || exit 0
[ "$GITHUB_REPOSITORY" != "$TEMPLATE_REPO" ] || exit 0
grep -q "\"name\": \"$TEMPLATE_NAME\"" wrangler.jsonc || exit 0

# Worker names allow only lowercase letters, digits and dashes, up to 63 characters.
name=$(echo "${GITHUB_REPOSITORY#*/}" | tr 'A-Z' 'a-z' | sed 's/[^a-z0-9-]/-/g' | cut -c1-63 | sed 's/^-*//; s/-*$//')

sed -i.bak -e "s/\"name\": \"$TEMPLATE_NAME\"/\"name\": \"$name\"/" \
  -e "s/\"$TEMPLATE_NAME\.crowdriff\.build\"/\"$name.crowdriff.build\"/" wrangler.jsonc && rm wrangler.jsonc.bak
echo "Named the Cloudflare Worker \"$name\" at $name.crowdriff.build in wrangler.jsonc"
