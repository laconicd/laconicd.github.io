#!/usr/bin/env nu

# curl -sLO https://github.com/saadeghi/daisyui/releases/latest/download/daisyui.mjs --output-dir assets/
# curl -sLO https://github.com/saadeghi/daisyui/releases/latest/download/daisyui-theme.mjs --output-dir assets/

let base_url = "https://github.com/saadeghi/daisyui/releases/latest/download";
let files_to_download = ["daisyui.mjs", "daisyui-theme.mjs"];

$files_to_download | each { |f|
    let download_url = $"($base_url)/($f)";
    let save_path = $"static/($f)";

    http get $download_url | save -f $save_path
    print $"✅ Downloaded ($f) to ($save_path)"
}
