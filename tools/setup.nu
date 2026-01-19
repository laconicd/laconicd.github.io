#!/usr/bin/env nu

def main [] {
    print "🛠️  Starting environment setup..."

    # 1. Create necessary directories in static/
    let static_dirs = [
        "static/fonts/outfit"
    ]

    for dir in $static_dirs {
        if not ($dir | path exists) {
            print $"📁 Creating ($dir)..."
            mkdir $dir
        }
    }

    # 2. Copy Dependencies (Node Modules)
    print "📦 Copying library dependencies..."
    cp -r node_modules/@fontsource-variable/outfit/files/* static/fonts/outfit/

    print "✨ Setup complete!"
}
