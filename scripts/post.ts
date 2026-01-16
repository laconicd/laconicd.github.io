/**
 * Post page logic (Sharing, Navigation, etc.)
 */
(function() {
  const shareBtn = document.getElementById('post-share-btn');
  const shareModal = document.getElementById('share_modal');
  if (shareBtn) {
    shareBtn.onclick = async () => {
      const url = window.location.href;
      const label = shareBtn.querySelector('.label') as HTMLElement;
      const originalText = label.innerText;

      const success = () => {
        shareBtn.classList.add('copied');
        label.innerText = 'Copied!';
        if (shareModal && (shareModal as any).showPopover) (shareModal as any).showPopover();
        setTimeout(() => {
          shareBtn.classList.remove('copied');
          label.innerText = originalText;
        }, 2000);
      };

      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(url);
        success();
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = url;
        document.body.appendChild(textArea);
        textArea.select();
        try {
          document.execCommand('copy');
          success();
        } catch (err) {
          console.error('Copy failed', err);
        }
        document.body.removeChild(textArea);
      }
    };
  }
})();
