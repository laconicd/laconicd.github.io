#!/usr/bin/env nu

def main [] {
    print "📦 Bundling scripts..."
    print (pwd)

    let out_dir = "static/scripts"
    let scripts = (glob scripts/*.ts)
    deno bundle --platform browser --minify --sourcemap=linked --outdir $out_dir ...$scripts

    print "✅ All scripts bundled."
}
