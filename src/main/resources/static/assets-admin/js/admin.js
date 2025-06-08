document.addEventListener('DOMContentLoaded', () => {
  const sidebar = document.getElementById('sidebar');

  // 1. Cấu hình collapse events để xoay mũi tên
  document.querySelectorAll('.collapse.submenu').forEach(sub => {
    const bs = new bootstrap.Collapse(sub, { toggle: false });

    sub.addEventListener('show.bs.collapse', () => {
      const toggle = document.querySelector(`[aria-controls="${sub.id}"]`);
      toggle.querySelector('.arrow-icon').classList.add('rotate');
    });
    sub.addEventListener('hide.bs.collapse', () => {
      const toggle = document.querySelector(`[aria-controls="${sub.id}"]`);
      toggle.querySelector('.arrow-icon').classList.remove('rotate');
    });
  });

  // 2. Đóng tất cả submenu khi chuột rời sidebar
  sidebar.addEventListener('pointerleave', () => {
    document.querySelectorAll('.collapse.submenu.show').forEach(sub => {
      bootstrap.Collapse.getInstance(sub).hide();
    });
  });

  // 3. Giữ active state cho link (bỏ qua toggler có data-bs-toggle)
  document.querySelectorAll('.sidebar-link').forEach(link => {
    if (!link.hasAttribute('data-bs-toggle')) {
      link.addEventListener('click', () => {
        document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      });
    }
  });
});
