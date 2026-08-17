(function () {
  const defaults = {
    mode: 'deploy',
    model: 'DeepSeek-R1',
    version: 'v1.0.0',
    service: 'svc-deepseek-r1-prod',
    serviceType: 'offline',
    imageMode: 'path',
    imagePath: 'registry.yinglong.ai/inference/vllm:0.6.2-cuda12.1',
    imageRepository: 'registry.yinglong.ai/inference/vllm:0.6.2-cuda12.1',
    cluster: '192.192.140.6',
    gpu: 'nvidia-l40s',
    nodeMode: 'auto',
    nodeIp: '',
    replicas: '1',
    gpuPerReplica: '1',
    portMode: 'random',
    port: '8080',
    runtimeConfig: 'vllm-standard'
  };
  let trigger = null;
  let currentMode = 'deploy';

  const icon = (paths, className = 'icon icon-sm') => `<svg class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths.map(path => `<path d="${path}"/>`).join('')}</svg>`;
  const closeIcon = icon(['M18 6 6 18', 'M6 6l12 12'], 'icon');
  const rocketIcon = icon(['M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09Z', 'm12 15-3-3a22 22 0 0 1 2-3.95A12.7 12.7 0 0 1 22 2c0 2.72-.78 7.5-6.05 11A22 22 0 0 1 12 15Z', 'M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0', 'M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5']);
  const chevronIcon = icon(['m9 18 6-6-6-6'], 'icon icon-sm deploy-chevron');
  const serverIcon = icon(['M5 12H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h18a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2', 'M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7', 'M9 16h6']);

  function render() {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
      <div class="modal-backdrop hidden" id="deployModal" role="dialog" aria-modal="true" aria-labelledby="deployModalTitle">
        <section class="modal deploy-modal">
          <header class="modal-header deploy-modal-header">
            <div><h2 id="deployModalTitle">部署模型服务</h2></div>
            <button class="btn btn-icon btn-ghost" id="closeDeployModal" type="button" aria-label="关闭部署服务弹窗">${closeIcon}</button>
          </header>
          <form id="deployForm" novalidate>
            <div class="modal-body deploy-modal-body">
              <section class="deploy-base-section" aria-label="基础配置">
                <div class="deploy-form-row">
                  <label for="deployModelVersion"><span class="required">*</span> 模型</label>
                  <select class="control" id="deployModelVersion" required></select>
                </div>
                <div class="deploy-form-row">
                  <label for="deployServiceName"><span class="required">*</span> 服务名称</label>
                  <div class="deploy-control-stack"><input class="control mono" id="deployServiceName" type="text" required aria-describedby="deployServiceNameError"><p class="deploy-field-error hidden" id="deployServiceNameError" role="alert">请输入服务名称。</p></div>
                </div>
                <div class="deploy-form-row deploy-radio-row" role="group" aria-labelledby="deployServiceTypeLabel">
                  <span class="deploy-field-label" id="deployServiceTypeLabel"><span class="required">*</span> 服务类型</span>
                  <div class="deploy-radio-group">
                    <label><input type="radio" name="deployServiceType" value="offline"><span>离线批处理</span></label>
                    <label><input type="radio" name="deployServiceType" value="online"><span>在线实时调用</span></label>
                  </div>
                </div>
                <div class="deploy-form-row">
                  <span class="deploy-field-label"><span class="required">*</span> 镜像</span>
                  <div class="deploy-image-stack">
                    <div class="deploy-image-mode" role="group" aria-label="镜像选择方式">
                      <label><input type="radio" name="deployImageMode" value="path"><span>填写镜像路径</span></label>
                      <label><input type="radio" name="deployImageMode" value="repository"><span>从镜像仓库选择</span></label>
                    </div>
                    <div id="deployImagePathPanel">
                      <input class="control mono" id="deployImagePath" type="text" placeholder="例如：registry.yinglong.ai/inference/vllm:0.6.2" aria-label="镜像路径" aria-describedby="deployImageHelp deployImagePathError">
                      <p class="deploy-field-error hidden" id="deployImagePathError" role="alert">请输入完整的镜像路径。</p>
                    </div>
                    <div class="hidden" id="deployImageRepositoryPanel">
                      <select class="control mono" id="deployImageRepository" aria-label="镜像仓库中的镜像" aria-describedby="deployImageHelp">
                        <option value="registry.yinglong.ai/inference/vllm:0.6.2-cuda12.1">vLLM 0.6.2 · CUDA 12.1</option>
                        <option value="registry.yinglong.ai/inference/triton:24.07-py3">Triton 24.07 · Python 3</option>
                        <option value="registry.yinglong.ai/inference/mindie:1.0.0-rc2">MindIE 1.0.0 RC2</option>
                      </select>
                    </div>
                    <p class="deploy-image-help" id="deployImageHelp">填写可直接拉取的完整镜像地址与标签。</p>
                  </div>
                </div>
              </section>

              <section class="deploy-config-section">
                <button class="deploy-section-toggle" id="resourceToggle" type="button" aria-expanded="true" aria-controls="resourceConfig">
                  <span class="deploy-section-title">${serverIcon}<strong>资源配置</strong></span>${chevronIcon}
                </button>
                <div class="deploy-section-content" id="resourceConfig">
                  <h3>算力资源池选择</h3>
                  <div class="deploy-form-row">
                    <label for="deployCluster"><span class="required">*</span> 选择集群</label>
                    <select class="control mono" id="deployCluster" required>
                      <option value="192.192.140.6">192.192.140.6 · 生产推理集群</option>
                      <option value="192.192.140.18">192.192.140.18 · 在线服务集群</option>
                      <option value="192.192.140.32">192.192.140.32 · 测试集群</option>
                    </select>
                  </div>

                  <div class="deploy-gpu-panel">
                    <div class="deploy-subtitle">显卡信息</div>
                    <div class="deploy-table-wrap">
                      <table class="deploy-resource-table">
                        <thead><tr><th>序号</th><th>节点名</th><th>节点 IP</th><th>显卡名</th><th>可用</th><th>总数</th></tr></thead>
                        <tbody id="deployGpuTableBody"></tbody>
                      </table>
                    </div>
                  </div>

                  <div class="deploy-form-row">
                    <label for="deployGpu"><span class="required">*</span> 显卡型号</label>
                    <select class="control" id="deployGpu" required>
                      <option value="nvidia-l40s">NVIDIA L40S (48GB)</option>
                      <option value="nvidia-a100-80g">NVIDIA A100 (80GB)</option>
                      <option value="nvidia-h800">NVIDIA H800 (80GB)</option>
                      <option value="nvidia-t4">NVIDIA T4 (16GB)</option>
                    </select>
                  </div>
                  <div class="deploy-form-row deploy-radio-row" role="group" aria-labelledby="deployNodeModeLabel">
                    <span class="deploy-field-label" id="deployNodeModeLabel"><span class="required">*</span> 节点指定</span>
                    <div class="deploy-radio-group deploy-node-mode">
                      <label><input type="radio" name="deployNodeMode" value="auto"><span>不指定（自动调度）</span></label>
                      <label><input type="radio" name="deployNodeMode" value="specified"><span>指定节点</span></label>
                    </div>
                  </div>
                  <div class="deploy-form-row hidden" id="deployNodePanel">
                    <label for="deployNodeIp"><span class="required">*</span> 节点 IP</label>
                    <div class="deploy-control-stack">
                      <select class="control mono" id="deployNodeIp" aria-describedby="deployNodeHelp deployNodeError"></select>
                      <p class="deploy-image-help" id="deployNodeHelp">仅显示当前集群中匹配所选显卡型号的节点。</p>
                      <p class="deploy-field-error hidden" id="deployNodeError" role="alert">当前集群没有匹配该显卡型号的可用节点。</p>
                    </div>
                  </div>
                  <div class="deploy-form-row">
                    <label for="deployReplicas"><span class="required">*</span> 副本数</label>
                    <div class="deploy-replica-control">
                      <input class="control" id="deployReplicas" type="number" min="1" max="32" value="1" aria-label="副本数">
                      <span>×</span>
                      <input class="control" id="deployGpuPerReplica" type="number" min="1" max="8" value="1" aria-label="每副本 GPU 数">
                      <span>GPUs</span>
                    </div>
                  </div>
                  <div class="deploy-form-row">
                    <label>端口号</label>
                    <div class="deploy-port-control">
                      <div class="deploy-segmented" role="group" aria-label="端口分配方式">
                        <button type="button" data-port-mode="custom">自定义</button>
                        <button type="button" data-port-mode="random">随机</button>
                      </div>
                      <input class="control mono hidden" id="deployPort" type="number" min="1024" max="65535" value="8080" aria-label="自定义端口号">
                    </div>
                  </div>
                </div>
              </section>

              <section class="deploy-runtime-section">
                <div class="deploy-form-row">
                  <label for="deployRuntimeConfig"><span class="required">*</span> 选择配置</label>
                  <select class="control" id="deployRuntimeConfig" required>
                    <option value="vllm-standard">vLLM 标准推理配置</option>
                    <option value="vllm-throughput">vLLM 高吞吐配置</option>
                    <option value="triton-general">Triton 通用配置</option>
                  </select>
                </div>
              </section>

              <section class="deploy-advanced-section">
                <button class="advanced-toggle" id="deployAdvancedToggle" type="button" aria-expanded="false" aria-controls="deployAdvanced">${chevronIcon}<span>高级配置（YAML）</span></button>
                <div class="deploy-yaml-panel hidden" id="deployAdvanced">
                  <div class="deploy-yaml-head"><label for="deployYaml">服务 YAML</label><span>修改表单会自动同步</span></div>
                  <textarea class="control yaml-editor deploy-yaml-editor" id="deployYaml" wrap="off" spellcheck="false" aria-label="服务 YAML 配置"></textarea>
                </div>
              </section>
            </div>
            <footer class="modal-footer"><span></span><div class="modal-actions"><button class="btn" id="cancelDeploy" type="button">取消</button><button class="btn btn-primary" id="submitDeploy" type="submit">${rocketIcon}<span>一键部署</span></button></div></footer>
          </form>
        </section>
      </div>`;
    document.body.appendChild(wrapper.firstElementChild);
  }

  const clusterNodes = {
    '192.192.140.6': [
      { name: 'node6', ip: '192.192.140.6', gpu: 'NVIDIA L40S', gpuId: 'nvidia-l40s', available: 6, total: 8 },
      { name: 'node7', ip: '192.192.140.7', gpu: 'NVIDIA L40S', gpuId: 'nvidia-l40s', available: 4, total: 8 },
      { name: 'node8', ip: '192.192.140.8', gpu: 'NVIDIA A100', gpuId: 'nvidia-a100-80g', available: 2, total: 8 }
    ],
    '192.192.140.18': [
      { name: 'node18', ip: '192.192.140.18', gpu: 'NVIDIA A100', gpuId: 'nvidia-a100-80g', available: 12, total: 16 },
      { name: 'node19', ip: '192.192.140.19', gpu: 'NVIDIA A100', gpuId: 'nvidia-a100-80g', available: 8, total: 16 },
      { name: 'node20', ip: '192.192.140.20', gpu: 'NVIDIA H800', gpuId: 'nvidia-h800', available: 6, total: 8 }
    ],
    '192.192.140.32': [
      { name: 'node32', ip: '192.192.140.32', gpu: 'NVIDIA T4', gpuId: 'nvidia-t4', available: 24, total: 32 },
      { name: 'node33', ip: '192.192.140.33', gpu: 'NVIDIA T4', gpuId: 'nvidia-t4', available: 18, total: 32 },
      { name: 'node34', ip: '192.192.140.34', gpu: 'NVIDIA L40S', gpuId: 'nvidia-l40s', available: 4, total: 8 }
    ]
  };

  function previousVersionFor(model, version) {
    const versions = { 'DeepSeek-R1': 'v0.9.5-beta', 'Qwen-72B': 'v2.0.0', 'Llama3-8B': 'v0.9.0' };
    return versions[model] || `${version}-previous`;
  }

  function yamlScalar(value) {
    return JSON.stringify(String(value));
  }

  function currentValues() {
    const versionSelect = document.getElementById('deployModelVersion');
    const imageMode = document.querySelector('input[name="deployImageMode"]:checked')?.value || 'path';
    return {
      model: versionSelect.dataset.model,
      version: versionSelect.value,
      service: document.getElementById('deployServiceName').value.trim(),
      serviceType: document.querySelector('input[name="deployServiceType"]:checked')?.value || 'offline',
      imageMode,
      image: imageMode === 'repository' ? document.getElementById('deployImageRepository').value : document.getElementById('deployImagePath').value.trim(),
      cluster: document.getElementById('deployCluster').value,
      gpu: document.getElementById('deployGpu').value,
      nodeMode: document.querySelector('input[name="deployNodeMode"]:checked')?.value || 'auto',
      nodeIp: document.getElementById('deployNodeIp').value,
      replicas: Number(document.getElementById('deployReplicas').value) || 1,
      gpuPerReplica: Number(document.getElementById('deployGpuPerReplica').value) || 1,
      portMode: document.querySelector('[data-port-mode].active')?.dataset.portMode || 'random',
      port: Number(document.getElementById('deployPort').value) || 8080,
      runtimeConfig: document.getElementById('deployRuntimeConfig').value
    };
  }

  function yamlFor(values) {
    const portLine = values.portMode === 'custom' ? `\n    port: ${values.port}` : '';
    const nodeLine = values.nodeMode === 'specified' && values.nodeIp ? `\n    nodeIp: ${yamlScalar(values.nodeIp)}` : '';
    return [
      'apiVersion: serving.yinglong.io/v1alpha1',
      'kind: ModelService',
      'metadata:',
      `  name: ${yamlScalar(values.service || 'model-service')}`,
      'spec:',
      `  serviceType: ${values.serviceType}`,
      '  model:',
      `    name: ${yamlScalar(values.model)}`,
      `    version: ${yamlScalar(values.version)}`,
      `  image: ${yamlScalar(values.image)}`,
      '  placement:',
      `    cluster: ${yamlScalar(values.cluster)}${nodeLine}`,
      '    accelerator:',
      `      type: ${values.gpu}`,
      `      countPerReplica: ${values.gpuPerReplica}`,
      `  replicas: ${values.replicas}`,
      '  network:',
      `    portMode: ${values.portMode}${portLine}`,
      '  runtime:',
      `    config: ${values.runtimeConfig}`,
      '    engine: vllm',
      '    parameters:',
      '      maxModelLen: 32768',
      '      tensorParallelSize: 4',
      '      gpuMemoryUtilization: 0.95'
    ].join('\n');
  }

  function syncYaml() {
    document.getElementById('deployYaml').value = yamlFor(currentValues());
  }

  function renderNodeOptions(preferredNodeIp = '') {
    const cluster = document.getElementById('deployCluster').value;
    const gpu = document.getElementById('deployGpu').value;
    const nodes = (clusterNodes[cluster] || []).filter(node => node.gpuId === gpu && node.available > 0);
    const select = document.getElementById('deployNodeIp');
    select.innerHTML = nodes.length
      ? nodes.map(node => `<option value="${node.ip}">${node.ip} · ${node.name}（可用 ${node.available}/${node.total} 卡）</option>`).join('')
      : '<option value="">暂无匹配的可用节点</option>';
    if (preferredNodeIp && nodes.some(node => node.ip === preferredNodeIp)) select.value = preferredNodeIp;
    select.disabled = document.querySelector('input[name="deployNodeMode"]:checked')?.value !== 'specified' || nodes.length === 0;
    document.getElementById('deployNodeHelp').textContent = nodes.length
      ? `已筛选出 ${nodes.length} 个匹配所选显卡型号的可用节点。`
      : '当前集群没有匹配所选显卡型号的可用节点，请调整显卡型号或集群。';
  }

  function renderClusterNodes(syncGpu = false, preferredNodeIp = '') {
    const cluster = document.getElementById('deployCluster').value;
    const nodes = clusterNodes[cluster] || [];
    document.getElementById('deployGpuTableBody').innerHTML = nodes.map((node, index) => `<tr><td>${index + 1}</td><td>${node.name}</td><td class="mono">${node.ip}</td><td>${node.gpu}</td><td><strong class="resource-available">${node.available}</strong></td><td>${node.total}</td></tr>`).join('');
    if (syncGpu && nodes.length) document.getElementById('deployGpu').value = nodes[0].gpuId;
    renderNodeOptions(preferredNodeIp);
  }

  function setNodeMode(mode, sync = true) {
    const specified = mode === 'specified';
    document.querySelectorAll('input[name="deployNodeMode"]').forEach(radio => { radio.checked = radio.value === mode; });
    document.getElementById('deployNodePanel').classList.toggle('hidden', !specified);
    document.getElementById('deployNodeError').classList.add('hidden');
    renderNodeOptions(document.getElementById('deployNodeIp').value);
    if (sync) syncYaml();
  }

  function setPortMode(mode) {
    document.querySelectorAll('[data-port-mode]').forEach(button => {
      const active = button.dataset.portMode === mode;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    document.getElementById('deployPort').classList.toggle('hidden', mode !== 'custom');
    syncYaml();
  }

  function setImageMode(mode, sync = true) {
    const pathMode = mode === 'path';
    document.getElementById('deployImagePathPanel').classList.toggle('hidden', !pathMode);
    document.getElementById('deployImageRepositoryPanel').classList.toggle('hidden', pathMode);
    document.getElementById('deployImagePath').disabled = !pathMode;
    document.getElementById('deployImageRepository').disabled = pathMode;
    document.getElementById('deployImageHelp').textContent = pathMode ? '填写可直接拉取的完整镜像地址与标签。' : '列表来自平台镜像仓库，可直接选择已同步的推理镜像。';
    document.getElementById('deployImagePathError').classList.add('hidden');
    if (sync) syncYaml();
  }

  function readTrigger(button) {
    return {
      ...defaults,
      mode: button.dataset.deployMode || defaults.mode,
      model: button.dataset.deployModel || defaults.model,
      version: button.dataset.deployVersion || defaults.version,
      service: button.dataset.deployService || defaults.service,
      serviceType: button.dataset.deployServiceType || defaults.serviceType,
      imageMode: button.dataset.deployImageMode || defaults.imageMode,
      imagePath: button.dataset.deployImagePath || defaults.imagePath,
      imageRepository: button.dataset.deployImageRepository || defaults.imageRepository,
      nodeMode: button.dataset.deployNodeMode || defaults.nodeMode,
      nodeIp: button.dataset.deployNodeIp || defaults.nodeIp,
      replicas: button.dataset.deployReplicas || defaults.replicas
    };
  }

  function open(button) {
    trigger = button;
    const values = readTrigger(button);
    currentMode = values.mode;
    const isConfigure = currentMode === 'configure';
    document.getElementById('deployModalTitle').textContent = isConfigure ? '配置服务实例' : '部署模型服务';
    document.getElementById('deployServiceName').value = values.service;
    const versionSelect = document.getElementById('deployModelVersion');
    const previousVersion = previousVersionFor(values.model, values.version);
    versionSelect.innerHTML = `<option value="${values.version}">${values.model} (${values.version})</option><option value="${previousVersion}">${values.model} (${previousVersion})</option>`;
    versionSelect.dataset.model = values.model;
    document.querySelectorAll('input[name="deployServiceType"]').forEach(radio => { radio.checked = radio.value === values.serviceType; });
    document.querySelectorAll('input[name="deployImageMode"]').forEach(radio => { radio.checked = radio.value === values.imageMode; });
    document.getElementById('deployImagePath').value = values.imagePath;
    document.getElementById('deployImageRepository').value = values.imageRepository;
    document.getElementById('deployCluster').value = values.cluster;
    document.getElementById('deployGpu').value = values.gpu;
    document.querySelectorAll('input[name="deployNodeMode"]').forEach(radio => { radio.checked = radio.value === values.nodeMode; });
    document.getElementById('deployReplicas').value = values.replicas;
    document.getElementById('deployGpuPerReplica').value = values.gpuPerReplica;
    document.getElementById('deployPort').value = values.port;
    document.getElementById('deployRuntimeConfig').value = values.runtimeConfig;
    renderClusterNodes(false, values.nodeIp);
    setNodeMode(values.nodeMode, false);
    setImageMode(values.imageMode, false);
    setPortMode(values.portMode);
    document.getElementById('resourceConfig').classList.remove('hidden');
    document.getElementById('resourceToggle').setAttribute('aria-expanded', 'true');
    document.getElementById('deployAdvanced').classList.add('hidden');
    document.getElementById('deployAdvancedToggle').setAttribute('aria-expanded', 'false');
    document.getElementById('deployServiceNameError').classList.add('hidden');
    document.getElementById('deployImagePathError').classList.add('hidden');
    document.getElementById('submitDeploy').querySelector('span').textContent = isConfigure ? '保存配置' : '一键部署';
    syncYaml();
    document.getElementById('deployModal').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => versionSelect.focus());
  }

  function close() {
    document.getElementById('deployModal').classList.add('hidden');
    document.body.style.overflow = '';
    trigger?.focus();
  }

  function notify(title, message) {
    if (typeof window.showToast === 'function') window.showToast(title, message);
  }

  function toggleSection(button, content) {
    const expanded = content.classList.toggle('hidden') === false;
    button.setAttribute('aria-expanded', String(expanded));
  }

  render();
  document.addEventListener('click', event => {
    const button = event.target.closest('[data-deploy-open]');
    if (button) { event.preventDefault(); open(button); }
  });
  document.getElementById('closeDeployModal').addEventListener('click', close);
  document.getElementById('cancelDeploy').addEventListener('click', close);
  document.getElementById('deployModal').addEventListener('click', event => { if (event.target.id === 'deployModal') close(); });
  document.getElementById('resourceToggle').addEventListener('click', event => toggleSection(event.currentTarget, document.getElementById('resourceConfig')));
  document.getElementById('deployAdvancedToggle').addEventListener('click', event => toggleSection(event.currentTarget, document.getElementById('deployAdvanced')));
  document.querySelectorAll('[data-port-mode]').forEach(button => button.addEventListener('click', () => setPortMode(button.dataset.portMode)));
  document.querySelectorAll('input[name="deployImageMode"]').forEach(radio => radio.addEventListener('change', () => setImageMode(radio.value)));
  document.getElementById('deployCluster').addEventListener('change', () => { renderClusterNodes(true); document.getElementById('deployNodeError').classList.add('hidden'); syncYaml(); });
  document.querySelectorAll('input[name="deployNodeMode"]').forEach(radio => radio.addEventListener('change', () => setNodeMode(radio.value)));
  document.getElementById('deployNodeIp').addEventListener('change', () => { document.getElementById('deployNodeError').classList.add('hidden'); syncYaml(); });
  ['deployServiceName', 'deployModelVersion', 'deployImagePath', 'deployImageRepository', 'deployGpu', 'deployReplicas', 'deployGpuPerReplica', 'deployPort', 'deployRuntimeConfig'].forEach(id => {
    const eventName = ['deployServiceName', 'deployImagePath', 'deployReplicas', 'deployGpuPerReplica', 'deployPort'].includes(id) ? 'input' : 'change';
    document.getElementById(id).addEventListener(eventName, () => {
      if (id === 'deployGpu') { renderNodeOptions(); document.getElementById('deployNodeError').classList.add('hidden'); }
      syncYaml();
    });
  });
  document.querySelectorAll('input[name="deployServiceType"]').forEach(radio => radio.addEventListener('change', syncYaml));
  document.getElementById('deployForm').addEventListener('submit', event => {
    event.preventDefault();
    const values = currentValues();
    document.getElementById('deployServiceNameError').classList.toggle('hidden', Boolean(values.service));
    if (!values.service) { document.getElementById('deployServiceName').focus(); return; }
    const imageInvalid = values.imageMode === 'path' && !values.image;
    document.getElementById('deployImagePathError').classList.toggle('hidden', !imageInvalid);
    if (imageInvalid) { document.getElementById('deployImagePath').focus(); return; }
    const nodeInvalid = values.nodeMode === 'specified' && !values.nodeIp;
    document.getElementById('deployNodeError').classList.toggle('hidden', !nodeInvalid);
    if (nodeInvalid) {
      const nodeSelect = document.getElementById('deployNodeIp');
      (nodeSelect.disabled ? document.getElementById('deployGpu') : nodeSelect).focus();
      return;
    }
    close();
    notify(currentMode === 'configure' ? '服务配置已保存' : '服务部署已提交', currentMode === 'configure' ? `${values.service} 将按新配置滚动更新。` : `${values.service} 正在创建模型服务实例。`);
  });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && !document.getElementById('deployModal').classList.contains('hidden')) close(); });
})();
