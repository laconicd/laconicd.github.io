#!/usr/bin/env nu

def main [] {
    print "📦 Bundling scripts..."
    print (pwd)

    let out_dir = "static/js"
    let scripts = (glob static/scripts/*.ts)
    deno bundle --platform browser --minify --sourcemap=linked --outdir $out_dir ...$scripts

    # sw.js는 root에 위치해야 scope가 전체에 적용됨
    mv static/js/sw.js static/sw.js
    mv static/js/sw.js.map static/sw.js.map

    print "✅ All scripts bundled."
}
