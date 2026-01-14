#!/usr/bin/env nu

def main [] {
    let media_dir = "assets/media"
    
    print "🚀 Starting asset synchronization..."

    # 1. Sync Submodule (assets/media)
    if ($media_dir | path exists) {
        cd $media_dir
        
        # Check for changes in submodule
        let status = (git status --porcelain | str trim)
        if ($status | is-empty) {
            print "✅ No changes in assets/media."
        } else {
            print "📝 Committing changes in assets/media..."
            git add .
            git commit -m "feat: update assets"
            print "📤 Pushing assets to remote..."
            git push origin main
        }
        cd -
    } else {
        error make {msg: $"Directory not found: ($media_dir)"}
    }

    # 2. Update Submodule Reference in Main Repo
    print "🔗 Updating submodule reference in main repository..."
    git add assets/media
    
    let main_status = (git status --porcelain assets/media | str trim)
    if ($main_status | is-empty) {
        print "✅ Submodule reference is already up to date."
    } else {
        print "💾 Committing submodule reference update..."
        git commit -m "chore: update assets submodule reference"
        print "✨ Done! Submodule reference updated."
    }
}
