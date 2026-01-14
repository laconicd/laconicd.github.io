/**
 * Post page logic (Sharing, Navigation, etc.)
 */
(function() {
  const shareBtn = document.getElementById('post-share-btn');
  const shareModal = document.getElementById('share_modal');
  if (shareBtn) {
    shareBtn.onclick = async () => {
      try {
        await navigator.clipboard.writeText(window.location.href);
        
        const label = shareBtn.querySelector('.label');
        const originalText = label.innerText;
        shareBtn.classList.add('copied');
        label.innerText = 'Copied!';
        
        if (shareModal && shareModal.showPopover) shareModal.showPopover();

        setTimeout(() => {
          shareBtn.classList.remove('copied');
          label.innerText = originalText;
        }, 2000);
      } catch (err) { 
        console.error(err);
      }
    };
  }
})();
