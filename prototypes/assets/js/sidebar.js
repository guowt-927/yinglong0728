(() => {
  const sidebar = document.querySelector('[data-yl-sidebar]');
  if (!sidebar) return;

  const mainContent = document.querySelector('main');
  if (mainContent && !mainContent.id) mainContent.id = 'yl-main-content';

  const contentShell = sidebar.nextElementSibling;
  const topbar = contentShell
    ? Array.from(contentShell.children).find(element => element.tagName === 'HEADER')
    : null;
  if (topbar) topbar.classList.add('yl-topbar');

  const tabLists = new Set(document.querySelectorAll('.tabs'));
  document.querySelectorAll('.tab-btn, .page-tab, button[class*="border-b-2"]').forEach(button => {
    if (button.classList.contains('request-type') || button.closest('.decision, [role="dialog"]')) return;
    if (button.parentElement) tabLists.add(button.parentElement);
  });
  tabLists.forEach(tabList => tabList.classList.add('yl-tablist'));

  const ROLE_KEY = 'ylResourceRole';
  const fileName = decodeURIComponent(window.location.pathname.split('/').pop() || '');
  const forcedRole = fileName === 'sys_resource_application.html'
    ? 'applicant'
    : fileName === 'sys_resource_approval.html' ? 'admin' : null;
  let currentRole = forcedRole || (localStorage.getItem(ROLE_KEY) === 'admin' ? 'admin' : 'applicant');

  const groups = [
    {
      label: '工作台',
      items: [
        { file: '../index.html', label: '系统概览', icon: 'fa-chart-pie' }
      ]
    },
    {
      label: '算力调度',
      items: [
        { file: 'sys_dispatch.html', label: '算力调度', icon: 'fa-sliders-h' },
        { file: 'sys_task_list.html', label: '我的任务', icon: 'fa-tasks' }
      ]
    },
    {
      label: '模型管理',
      items: [
        { file: 'sys_model_repo.html', label: '模型资产', icon: 'fa-box' },
        { file: 'sys_model_training.html', label: '模型训练', icon: 'fa-brain' },
        { file: 'sys_model_service.html', label: '模型服务', icon: 'fa-server' },
        { file: 'sys_model_governance.html', label: '模型纳管规范', icon: 'fa-clipboard-list' },
        { file: 'sys_model_monitor.html', label: '模型监测', icon: 'fa-chart-line' }
      ]
    },
    {
      label: '资源与运维',
      items: [
        { file: 'sys_resource_application.html', label: '资源申请', icon: 'fa-file-circle-plus', role: 'applicant' },
        { file: 'sys_resource_approval.html', label: '授权与审批', icon: 'fa-user-check', role: 'admin' },
        { file: 'sys_infrastructure_mgmt.html', label: '集群与节点', icon: 'fa-network-wired' },
        { file: 'sys_api_key_mgmt.html', label: '请求监控分析', icon: 'fa-chart-bar' },
        { file: 'sys_request_tracing.html', label: '链路跟踪', icon: 'fa-route' }
      ]
    }
  ];

  const parentPages = {
    'sys_task_detail.html': 'sys_task_list.html',
    'task_config_modal.html': 'sys_dispatch.html',
    'sys_model_version_detail.html': 'sys_model_repo.html',
    'sys_model_training_detail.html': 'sys_model_training.html',
    'sys_training_records.html': 'sys_model_training.html',
    'sys_model_deploy.html': 'sys_model_service.html',
    'sys_cluster_list.html': 'sys_infrastructure_mgmt.html',
    'sys_node_mgmt.html': 'sys_infrastructure_mgmt.html',
    'sys_node_detail.html': 'sys_infrastructure_mgmt.html'
  };

  const pageMeta = {
    'sys_dispatch.html': ['算力调度', '算力调度'],
    'sys_task_list.html': ['算力调度', '我的任务'],
    'sys_task_detail.html': ['算力调度', '任务详情'],
    'sys_model_repo.html': ['模型管理', '模型资产'],
    'sys_model_version_detail.html': ['模型管理', '模型版本详情'],
    'sys_model_training.html': ['模型管理', '模型训练'],
    'sys_model_training_detail.html': ['模型管理', '训练详情'],
    'sys_training_records.html': ['模型管理', '训练记录'],
    'sys_model_service.html': ['模型管理', '模型服务'],
    'sys_model_deploy.html': ['模型管理', '模型部署'],
    'sys_model_governance.html': ['模型管理', '模型纳管规范'],
    'sys_model_monitor.html': ['模型管理', '模型监控'],
    'sys_resource_application.html': ['资源与运维', '资源申请'],
    'sys_resource_approval.html': ['资源与运维', '授权与审批'],
    'sys_infrastructure_mgmt.html': ['资源与运维', '集群与节点'],
    'sys_cluster_list.html': ['资源与运维', '集群列表'],
    'sys_node_mgmt.html': ['资源与运维', '节点管理'],
    'sys_node_detail.html': ['资源与运维', '节点详情'],
    'sys_api_key_mgmt.html': ['资源与运维', '请求监控分析'],
    'sys_request_tracing.html': ['资源与运维', '链路跟踪']
  };

  function activeFile() {
    return parentPages[fileName] || fileName;
  }

  function renderItem(item) {
    if (item.role && item.role !== currentRole) return '';
    const active = item.file === activeFile();
    const roleQuery = item.role ? `?role=${item.role}` : '';
    return `
      <a class="yl-sidebar-item${active ? ' active' : ''}" href="${item.file}${roleQuery}"${active ? ' aria-current="page"' : ''}>
        <i class="fa-solid ${item.icon}" aria-hidden="true"></i>
        <span>${item.label}</span>
      </a>`;
  }

  function render() {
    const admin = currentRole === 'admin';
    sidebar.className = 'yl-sidebar';
    sidebar.setAttribute('aria-label', '应龙主导航');
    sidebar.innerHTML = `
      <a class="yl-skip-link" href="#yl-main-content">跳到主要内容</a>
      <div class="yl-sidebar-brand">
        <span class="yl-sidebar-mark" aria-hidden="true">应</span>
        <span><strong>应龙</strong><small>大模型推理平台</small></span>
      </div>
      <nav class="yl-sidebar-nav">
        ${groups.map(group => `
          <section class="yl-sidebar-group">
            <h2>${group.label}</h2>
            ${group.items.map(renderItem).join('')}
          </section>`).join('')}
      </nav>
      <div class="yl-sidebar-footer">
        <div class="yl-sidebar-role-label"><span>当前工作视角</span><span class="yl-sidebar-online">权限已同步</span></div>
        <div class="yl-sidebar-role" role="group" aria-label="切换角色">
          <button type="button" data-sidebar-role="applicant" class="${admin ? '' : 'active'}">申请人</button>
          <button type="button" data-sidebar-role="admin" class="${admin ? 'active' : ''}">管理员</button>
        </div>
      </div>`;

    sidebar.querySelectorAll('[data-sidebar-role]').forEach(button => {
      button.addEventListener('click', () => switchRole(button.dataset.sidebarRole));
    });
  }

  function normalizePageChrome() {
    if (!contentShell || contentShell.querySelector(':scope > .yl-global-topbar')) return;

    const meta = pageMeta[fileName] || ['工作台', document.title];
    contentShell.classList.add('yl-content-shell');

    let pageHeader = Array.from(contentShell.children).find(element => element.tagName === 'HEADER');
    if (!pageHeader) {
      const workspace = document.createElement('div');
      workspace.className = 'yl-page-workspace';
      while (contentShell.firstChild) workspace.appendChild(contentShell.firstChild);
      contentShell.appendChild(workspace);

      pageHeader = document.createElement('header');
      pageHeader.innerHTML = `<h1>${meta[1]}</h1>`;
      contentShell.insertBefore(pageHeader, workspace);
    }
    pageHeader.classList.add('yl-page-header');
    const pageHeading = pageHeader.querySelector('h1, h2');
    if (pageHeading) pageHeading.textContent = meta[1];

    const globalTopbar = document.createElement('div');
    globalTopbar.className = 'yl-global-topbar';
    globalTopbar.innerHTML = `
      <nav class="yl-breadcrumb" aria-label="面包屑">
        <a href="../index.html">应龙</a>
        <span class="yl-breadcrumb-separator" aria-hidden="true">/</span>
        <span>${meta[0]}</span>
        <span class="yl-breadcrumb-separator" aria-hidden="true">/</span>
        <span class="yl-breadcrumb-current" aria-current="page">${meta[1]}</span>
      </nav>
      <div class="yl-global-user" aria-label="当前用户">
        <span class="yl-global-user-avatar" aria-hidden="true">${currentRole === 'admin' ? 'A' : 'U'}</span>
        <span>${currentRole === 'admin' ? '资源管理员' : '当前登录用户'}</span>
      </div>`;
    contentShell.insertBefore(globalTopbar, pageHeader);
  }

  function switchRole(role) {
    if (role === currentRole) return;
    currentRole = role;
    localStorage.setItem(ROLE_KEY, role);

    if (fileName === 'sys_resource_application.html' || fileName === 'sys_resource_approval.html') {
      window.location.href = role === 'admin'
        ? 'sys_resource_approval.html?role=admin'
        : 'sys_resource_application.html?role=applicant';
      return;
    }

    render();
    const globalUser = contentShell && contentShell.querySelector('.yl-global-user');
    if (globalUser) {
      globalUser.innerHTML = `<span class="yl-global-user-avatar" aria-hidden="true">${role === 'admin' ? 'A' : 'U'}</span><span>${role === 'admin' ? '资源管理员' : '当前登录用户'}</span>`;
    }
    window.dispatchEvent(new CustomEvent('yl:role-change', { detail: { role } }));
  }

  localStorage.setItem(ROLE_KEY, currentRole);
  render();
  normalizePageChrome();
})();
