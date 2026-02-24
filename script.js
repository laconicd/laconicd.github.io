document.addEventListener("DOMContentLoaded",()=>{let e=document.getElementById("index-popover");e&&e.querySelectorAll("a[href]")?.forEach(t=>{t.addEventListener("htmx:configRequest",()=>e.hidePopover())})});

//# sourceMappingURL=./script.js.map