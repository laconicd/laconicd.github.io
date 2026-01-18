#!/usr/bin/env nu

def main [] {
    print "🛠️  Starting environment setup..."

    # 1. Create necessary directories in static/
    let static_dirs = [
        "static/fonts/outfit",
        "static/styles",
        "static/scripts"
    ]

    for dir in $static_dirs {
        if not ($dir | path exists) {
            print $"📁 Creating ($dir)..."
            mkdir $dir
        }
    }

    # 2. Copy Styles
    print "📋 Copying styles to static/..."
    cp -r styles/* static/styles/

    # 3. Copy Dependencies (Node Modules)
    print "📦 Copying library dependencies..."
    cp node_modules/fuse.js/dist/fuse.min.mjs static/
    cp -r node_modules/@fontsource-variable/outfit/files/* static/fonts/outfit/

    print "✨ Setup complete!"
}
