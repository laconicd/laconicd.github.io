#!/usr/bin/env nu

def main [--minify] {
    print "📦 Bundling scripts..."
    
    let out_dir = "static/scripts"
    if not ($out_dir | path exists) { mkdir $out_dir }

    let flags = if $minify {
        ["--platform" "browser" "--minify"]
    } else {
        ["--platform" "browser"]
    }

    # Bundle all TS files in scripts/
    let scripts = (ls scripts/*.ts).name
    
    for script in $scripts {
        let name = ($script | path parse).stem
        print $"  ⚡ Bundling ($name)..."
        
        # Construct output path
        let output = $"($out_dir)/($name).js"
        
        # Execute deno bundle
        deno bundle ...$flags -o $output $script
    }

    print "✅ All scripts bundled."
}
