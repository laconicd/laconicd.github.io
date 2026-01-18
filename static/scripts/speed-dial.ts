/**
 * Speed Dial (Floating Action Button) Logic
 */
declare global {
  interface Window {
    __POST_LIST__?: string[];
  }
}

const setupDial = () => {
  const dial = document.querySelector('.app-speed-dial') as HTMLElement;
  const trigger = document.getElementById('speed-dial-trigger');
  const topBtn = document.getElementById('speed-dial-top');
  const searchBtn = document.getElementById('speed-dial-search');
  const randomBtn = document.getElementById('speed-dial-random');
  const searchModal = document.getElementById('search_modal') as any;

  if (!dial || !trigger) return;

  const currentTheme = document.documentElement.getAttribute('data-theme');
  const isDark = currentTheme === 'dim';
  dial.querySelectorAll('.theme-controller').forEach((el: any) => {
    el.checked = isDark;
  });

  trigger.onclick = (e) => {
    e.stopPropagation();
    dial.classList.toggle('open');
  };

  document.addEventListener('click', (e) => {
    if (!dial.contains(e.target as Node)) dial.classList.remove('open');
  });

  if (topBtn) {
    topBtn.onclick = () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      dial.classList.remove('open');
    };
  }

  if (searchBtn) {
    searchBtn.onclick = () => {
      if (searchModal?.showPopover) {
        searchModal.showPopover();
      }
      dial.classList.remove('open');
    };
  }

  const posts = window.__POST_LIST__ || [];
  if (randomBtn && posts.length > 0) {
    randomBtn.onclick = () => {
      const currentPath = window.location.href;
      const otherPosts = posts.filter((p: string) => p !== currentPath);
      const targetPosts = otherPosts.length > 0 ? otherPosts : posts;
      const randomPost = targetPosts[Math.floor(Math.random() * targetPosts.length)];
      window.location.href = randomPost;
    };
  }
};

document.addEventListener('DOMContentLoaded', setupDial);
window.addEventListener('page:updated', setupDial);

export {}; // Module scope
