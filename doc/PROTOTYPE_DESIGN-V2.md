# 应龙大模型推理平台 原型设计方案文档

---

## 1. 项目背景与设计目标

### 1.1 项目定位

**「应龙大模型推理平台 (Yinglong LLM Inference Platform)」** 是面向企业级 AI 算力调度、大模型全生命周期纳管、在线推理服务发布及批处理任务分发的综合基础设施管理平台。

---

## 2. 页面设计风格与 UI 视觉规范 (Design Tokens)

遵循企业级 B2B 基础设施平台的**高数据密度、高易读性、沉稳可靠**原则，杜绝无意义的视觉堆砌与低效卡片嵌套。

### 2.1 色彩体系 (Color System)


| 色彩类型                      | Tailwind 类名 / HEX                                | 使用场景                                                                 |
| :---------------------------- | :------------------------------------------------- | :----------------------------------------------------------------------- |
| **主品牌色 (Primary)**        | `Brand Blue` (`#266EFF`) / `Blue-600`              | Logo 标识、侧边栏选中态高亮、主操作按钮、高优先级聚焦                    |
| **导航/侧边栏底色 (Sidebar)** | `White` (`#FFFFFF`) / `Slate-100` 悬停             | 纯白透亮侧边栏与 Header，搭配 1px 细分割线`border-slate-200` (`#E2E8F0`) |
| **画布背景色 (Canvas)**       | `Slate-50` (`#F8FAFC`) / `Slate-100` (`#F1F5F9`)   | 低疲劳中性浅灰底，保障长时间运维监控舒适度                               |
| **表面/卡片色 (Surface)**     | `White` (`#FFFFFF`) / 1px 细边框                   | 数据表格背景、抽屉视图、弹窗 Modal 背景                                  |
| **辅助/决策色 (Accent)**      | `Amber-500` (`#F59E0B`) / `Indigo-600` (`#4F46E5`) | 纳管评估、审核操作、算力测算器与核心决策按钮                             |
| **状态 - 运行/正常**          | `Emerald-600` (`#059669`) / `bg-emerald-50`        | 在线服务、节点 Health、审批通过、成功任务                                |
| **状态 - 试用/排队**          | `Sky-600` (`#0284C7`) / `bg-sky-50`                | 试用版模型、排队等待中、审批中                                           |
| **状态 - 警告/高压**          | `Amber-600` (`#D97706`) / `bg-amber-50`            | 显存利用率 >85%、SLA 超时告警                                            |
| **状态 - 异常/拒绝**          | `Rose-600` (`#E11D48`) / `bg-rose-50`              | 节点 OOM/故障、审批拒绝、服务下线                                        |

### 2.2 字体与阶梯规范 (Typography)

- **字体族**：系统优先无衬线字体 (`system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "PingFang SC", "Microsoft YaHei", sans-serif`)。
- **阶梯比例**：采用 1.125 (Major Second) 低对比度比率，适配高密度 UI：
  - `H1` (页面大标题)：`text-xl` (20px), `font-semibold` / `font-bold` (`650`)
  - `H2` (模块/卡片标题)：`text-base` (16px), `font-medium` / `font-semibold`
  - `Body` (正文与表格数字)：`text-sm` (14px), `font-normal`
  - `Caption` (状态标签/次级提示)：`text-xs` (12px), `font-normal`
- **标签排版禁忌**：所有胶囊/按钮/标签内的文字强制 `whitespace-nowrap`，禁止任何换行或折行。
- H1有标题名称和标题说明，其他H2、H3等仅保留标题，不要有标题说明，保持页面简洁

### 2.3 布局与微边框规范 (Grid & Cards)

- **卡片边框**：统一使用 1px 极细边框 `border border-slate-200/80` (`#E2E8F0`)，搭配 `shadow-sm` 或 `shadow-xs`。
- **圆角规范**：
  - 外层主容器/卡片：`rounded-lg` (8px) 或 `rounded-xl` (12px)
  - 内部按钮/输入框：`rounded-md` (6px)
  - 胶囊/状态 Badges：`rounded-full` (9999px)
- **嵌套圆角开方公式**：`内圆角 = 外圆角 - 内边距`（防止出现凹凸不平的接缝）。

### 2.4 列表组件与筛选/搜索样式规范 (Table & List Pattern Standards)

#### 2.4.1 基础列表规范 (Standard Data Table)

- **容器与边框**：外层包装卡片使用 `bg-white border border-slate-200/80 rounded-xl shadow-xs overflow-hidden`。
- **表头 (Table Header)**：`bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider`
- **表体 (Table Body)**：行分割线 `divide-y divide-slate-100 text-xs text-slate-700`，悬停 `hover:bg-slate-50/80 transition`。
- **底栏/分页 (Footer Pagination)**：`p-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 bg-slate-50/50`。

#### 2.4.2 列表带搜索框规范 (Table with Search Bar)

- **工具栏布局 (Toolbar)**：`p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white`。
- **搜索输入框组件**：相对定位容器 `<div class="relative w-64">`，左侧放大镜 SVG 图标，右侧提供一键清除叉号。

#### 2.4.3 列表带多维筛选框规范 (Table with Filter Controls)

- **筛选工具栏结构**：组合区 `flex flex-wrap items-center gap-2.5`，按“搜索框 + 下拉筛选器组 + 状态快照 + 重置按钮”紧凑排列。
- **下拉筛选选择器**：`text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-md text-slate-700`。

### 2.5 弹窗/模态框样式规范 (Modal & Dialog Pattern Standards)

- **遮罩层 (Backdrop)**：`fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4`
- **弹窗容器 (Dialog Container)**：`bg-white rounded-xl border border-slate-200/80 shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden`
- **Header/Body/Footer 三段式解构**：清楚区分标题、表单/反馈主体与操作确认区。

### 2.6 多条折线图与时序图表规范 (Multi-Series Line Chart Standards)

- **连接线型规范 (Straight Line Segments Only)**：所有时序折线图统一使用**直折线 (Linear / Straight)** 连接，**严格禁止使用平滑曲线 (Monotone / Bezier)**，确保真实采样点数据不失真。
- **横屏双视图 1:1 对齐**：支持左右双图列排布，相同时间轴与 Crosshair 联动。
- **控制组件**：集成时间范围（`1h`, `6h`, `24h`, `7d`, `30d`）与采样粒度（`1s`, `5s`, `1m`, `5m`）双重切换。

### 2.7 带图标的指标与特性卡片规范 (Icon Card & KPI Feature Card Standards)

- **形态 A：横向 KPI 数据卡片** (图标居左 + 数值 + 趋势 Badge)
- **形态 B：纵向单操作入口卡片** (图标 + 标题 + 简介 + 单链接按钮)
- **形态 C：纵向多操作项/组合操作卡片** (图标 + 状态 Badge + 描述 + 主次双按钮/Chip 操作网格)

---

### 2.8 侧栏导航、顶栏与页面标题规范 (Sidebar, Global Header & Page Heading Standards)

结合 `index.html` 与 `sys_dispatch.html` 的原型架构，平台统一采用 **“侧栏主导型”应用框架**。信息职责划分清晰且彻底解耦：

1. **左侧导航栏 (`aside.sidebar`)**：承载品牌标识、环境 State、按业务域划分的五大导航分组与页面跳转。
2. **右侧全局顶栏 (`header.global-header`)**：采用 Sticky 吸顶，仅保留左侧面包屑定位和右侧当前用户信息。不堆叠搜索框、告警通知或业务操作按钮。
3. **页面标题与操作区 (`main .page-heading` / `.overview-heading`)**：属于主画布页面内容的一部分，位于全局顶栏下方，统一承载当前页面的业务标题、说明与页面级工具栏（如调度域选择、刷新、导出等）。

```
┌──────────────────┬──────────────────────────────────────────────────────────────────────────────┐
│ [应] 应龙推理平台  │ 面包屑：应龙 / 算力调度 / 调度工作台                           资源管理员 [A]│
│      [PROD]       ├──────────────────────────────────────────────────────────────────────────────┤
├──────────────────┤ 页面标题：算力调度                             当前调度域 / 刷新 / 导出明细  │
│ 工作台            │ 观察调度域健康、任务积压与算力占用，并在沙盘中推演策略影响。                │
│  系统概览         ├──────────────────────────────────────────────────────────────────────────────┤
│                  │ 智能调度建议 Banner                                                         │
│ 算力调度          │ ┌───────────────────────┐  ┌───────────────────────┐  ┌──────────────────┐ │
│  算力调度 (Active)│ │ 核心指标 / KPI 卡片    │  │ 吞吐与 KV Cache 水位  │  │ 任务队列明细表格 │ │
│  我的任务         │ └───────────────────────┘  └───────────────────────┘  └──────────────────┘ │
│                  │                                                                              │
│ 模型管理          │                                                                              │
│  模型仓库         │                                                                              │
│  ...              │                                                                              │
└──────────────────┴──────────────────────────────────────────────────────────────────────────────┘
```

#### 2.8.1 左侧导航栏规范 (Sidebar Navigation Bar - `aside.sidebar`)

- **定位与容器尺寸 (Positioning & Dimensions)**：

  - 桌面端固定于视口左侧，`position: fixed; inset: 0 auto 0 0; z-index: 40`。
  - 标准宽度为 `224px` (`--sidebar-width: 224px`)，最小高度覆盖完整视口 `min-height: 100vh`。
  - 背景为纯白 `#FFFFFF` (`var(--surface)` / `bg-white`)，右侧使用 `1px solid #E2E8F0` (`var(--border)`) 细分割线，无重影无重度渐变。
  - 响应式折叠逻辑 (Responsive Breakpoints)：
    - **桌面端 (> 900px)**：展开 `224px` 完整宽度，显示图标、分组标题与文字 Label。
    - **平板中屏 (641px ~ 900px)**：收窄为 `64px` (`--sidebar-width: 64px`)，居中仅显示 Logo 徽章与导航图标，隐藏品牌文本、环境 Badge、分组标题与文字 Label。
    - **移动端 (<= 640px)**：隐藏侧边栏 (`display: none; width: 0px`)，右侧画布占满 100% 宽度。
- **品牌区 (Brand Area - `a.brand`)**：

  - 位于侧栏最顶部，高度固定为 `56px`，与右侧全局顶栏保持绝对等高对齐。
  - 布局样式：`display: flex; min-height: 56px; align-items: center; gap: 10px; padding: 0 16px; border-bottom: 1px solid #E2E8F0; text-decoration: none`。
  - **Logo 标志徽章 (`.brand-mark`)**：
    - 尺寸：`28×28px` 正方形容器，圆角 `border-radius: 7px`。
    - 视觉：`display: grid; place-items: center`，品牌蓝 background `#266EFF` (`var(--brand)`), text `#FFFFFF`, 字体 "应", font-size `12px`, font-weight `800`, 投影 `box-shadow: 0 2px 6px rgba(38, 110, 255, .22)`。
  - **品牌名称 (`.brand-name`)**：
    - 文案："应龙推理平台"，颜色 `#0F172A` (`var(--ink)`), font-size `15px`, font-weight `650`, `white-space: nowrap`。
  - **环境标识 Badge (`.env-badge`)**：
    - 文案："PROD"。
    - 样式：`padding: 1px 6px`, `border: 1px solid #BFDBFE`, `border-radius: 4px`, color `#266EFF` (`var(--brand)`), background `#EFF6FF`, font `600 10px/16px var(--font-mono)`, `white-space: nowrap`。
- **导航视图与分组 (`.sidebar-nav`, `.nav-group`)**：

  - 内容滚动容器 `.sidebar-nav`：`flex: 1; overflow-y: auto; padding: 12px 10px 16px`。
  - 分组间距：`.nav-group + .nav-group { margin-top: 14px; }`。
  - 分组标题 (`.nav-group-title`)：`margin: 0 0 5px; padding: 0 10px; color: #94A3B8 (var(--subtle)); font-size: 11px; line-height: 20px; font-weight: 600`。
  - **全平台标准的五大导航分组与精准页面清单**：
    1. **工作台**：`系统概览` (`index.html`)
    2. **算力调度**：`算力调度` (`sys_dispatch.html`)、`我的任务` (`sys_task_list.html`)
    3. **模型管理**：`模型仓库` (`sys_model_repo.html`)、`模型服务` (`sys_model_service.html`)、`模型训练` (`sys_model_training.html`)、`模型纳管` (`sys_model_governance.html`)、`模型监测` (`sys_model_monitor.html`)
    4. **资源与运维**：`资源申请` (`sys_resource_application.html`)、`授权审批` (`sys_resource_approval.html`)、`集群管理` (`sys_infrastructure_mgmt.html`)、`请求监控` (`sys_api_key_mgmt.html`)、`链路追踪` (`sys_request_tracing.html`)
    5. **系统设置**：`调度设置` (`sys_scheduler_settings.html`)
- **导航项 (`.nav-item`)**：

  - 布局：`display: flex; min-height: 38px; align-items: center; gap: 10px; margin: 2px 0; padding: 8px 10px; border-radius: 6px; text-decoration: none; white-space: nowrap; transition: color .16s ease, background-color .16s ease`。
  - 默认状态：文字颜色 `#475569`, 背景透明。
  - 悬停状态 (`:hover`)：文字颜色 `#0F172A` (`var(--ink)`), 背景 `#F1F5F9` (`bg-slate-100`)。
  - 激活状态 (`.active`)：文字颜色 `#266EFF` (`var(--brand)`), 背景 `#EFF6FF` (`bg-blue-50`), font-weight `600`, 配合 HTML 属性 `aria-current="page"`。
  - 图标规范：统一采用 Lucide SVG 线框图标 `<svg class="icon"><use href="#i-..."/></svg>` (`16×16px`, `stroke-width: 2`)。

---

#### 2.8.2 右侧全局顶栏规范 (Global Header Bar - `header.global-header`)

- **定位与尺寸 (Positioning & Dimensions)**：

  - Sticky 吸顶：`position: sticky; top: 0; z-index: 30`。
  - 高度：固定 `56px` (`height: 56px`)。
  - 宽度与偏移：覆盖右侧主画布区域 (`width: calc(100% - var(--sidebar-width)); margin-left: var(--sidebar-width)`)。
  - 背景与分割线：`background: rgba(255, 255, 255, .98)` (微润高质感磨砂白), 底部 `1px solid rgba(226, 232, 240, .9)`, 阴影 `box-shadow: 0 1px 2px rgba(15, 23, 42, .03)`。
  - 布局与边距：`padding: 0 24px`, `display: flex; align-items: center; justify-content: space-between`。
- **左侧面包屑导航 (`nav.breadcrumb`)**：

  - HTML 结构：`<nav class="breadcrumb" aria-label="面包屑"><a href="index.html">应龙</a><span>/</span><span>算力调度</span><span>/</span><span class="breadcrumb-current" aria-current="page">调度工作台</span></nav>`
  - 字体与颜色：`font-size: 12px`, 默认文本与分隔符颜色 `#64748B` (`var(--muted)`), `white-space: nowrap`。
  - 父级链接：`color: #64748B`, 悬停 `color: #266EFF` (`var(--brand)`)。
  - 当前页面 (`.breadcrumb-current`)：`color: #334155` (`var(--text)`), `font-weight: 600`, 超长截断 `overflow: hidden; text-overflow: ellipsis`。
- **右侧用户信息 (`.header-profile` / `.user-profile`)**：

  - HTML 结构：`<div class="header-profile" aria-label="当前用户"><span class="avatar">A</span><span>资源管理员</span></div>` (或 `<div class="user-profile"><span>资源管理员</span><span class="user-avatar" aria-hidden="true">A</span></div>`)。
  - 布局与排版：`display: flex; align-items: center; gap: 8px; color: #334155; font-size: 12px; white-space: nowrap`。
  - 用户角色/名称：`<span>资源管理员</span>`，字号 `12px`，字重 `normal` / `500`。
  - 用户头像 (`.avatar` / `.user-avatar`)：
    - 尺寸：`28×28px` 圆形 (`width: 28px; height: 28px; border-radius: 50%`)。
    - 样式：`display: grid; place-items: center; border: 1px solid #60A5FA; color: #FFFFFF; background: #266EFF (var(--brand)); font-size: 11px; font-weight: 700`。
  - **极致无干扰原则 (Clean Header Constraint)**：全局顶栏右侧严格仅包含当前用户信息。**严禁**在顶栏放置搜索输入框、消息通知铃铛、全局刷新/导出按钮或业务筛选下拉框，避免破坏全局视觉沉静感。

---

#### 2.8.3 页面标题与主画布操作区规范 (Page Heading & Canvas Actions)

- **定位与容器层级**：
  - 标题与操作区位于全局顶栏下方的 `<main id="main-content">` 内，作为主画布的首个页面级区块，不属于 `header.global-header`。
  - 推荐结构为 `.section > .section-heading.overview-heading`。后续业务内容可位于同一 `.section` 内，也可作为独立区块紧随标题区之后；不得为了满足结构形式而增加无业务含义的嵌套容器。
- **桌面端主画布边界**：
  - 主画布占满侧栏以外的全部可用宽度，统一使用 `width: 100%; max-width: none; margin: 0; padding: 18px 24px 28px`。
  - 通用业务页面不得设置固定画布宽度或 `max-width` 居中限宽。确需限制阅读宽度的表单、详情正文或长文本，应在主画布内部使用局部内容容器实现。
  - 首个页面级区块使用 `.section { margin-top: 16px; }`；标题行 `.overview-heading` 使用 `padding-bottom: 12px` 和 `1px solid #E2E8F0` 底边框分隔后续内容。
- **标题行布局 (`.section-heading.overview-heading`)**：
  - 标题行采用 `display: flex; align-items: flex-end; justify-content: space-between; gap: 12px`，使左侧标题信息与右侧工具栏底部对齐。
  - 每页必须且只能存在一个页面级 `h1.page-title`。标题左侧信息区可在 `h1` 下方提供一行可选的 `p.page-description`，不得出现第二个页面级 `h1`。
  - 页面标题样式为 `margin: 0; color: #0F172A; font-size: 20px; line-height: 28px; font-weight: 650`。
  - 页面说明样式为 `margin: 2px 0 0; color: #64748B; font-size: 12px`；文案应简要说明页面职责、数据范围或当前上下文，避免重复标题。
- **主画布操作区 (`.toolbar-actions`)**：
  - 存在页面级操作时，右侧统一使用 `.toolbar-actions`，采用 `display: flex; flex-wrap: wrap; align-items: center; justify-content: flex-end; gap: 8px`。
  - 页面级筛选、范围选择、刷新、导出、新建等操作按“状态或范围信息 → 次要操作 → 主操作”的顺序排列；同一区域原则上只保留一个主按钮。
  - 没有页面级操作时可省略 `.toolbar-actions`，不得保留空白工具栏或无意义占位容器。
  - 图标按钮必须提供可访问名称，例如同时设置准确的 `aria-label` 与 `title`；所有按钮和表单控件须保留统一的 `:focus-visible` 键盘焦点状态。

---

### 2.9 操作二次确认规范 (Double Confirmation & Popconfirm Standards)

- **2.9.1 破坏性/高风险操作二次确认 Modal**：销毁 Endpoint / 排空生产节点时，触发带红色警告图标的 Modal，要求强匹配输入资源名称。
- **2.9.2 行内/局部二次确认 Popconfirm**：表格单行清空缓存/重置 Key 时，在触发源按钮正上方浮现 Popover 气泡。

### 2.10 操作失败告警与异常反馈规范 (Operation Failure & Error Feedback Standards)

- **2.10.1 全局 Toast 浮动通知** (`fixed top-5 right-5`, 红色左边条)
- **2.10.2 页面/区域级 Banner 告警** (`bg-rose-50 border-rose-200`, 附带诊断代码)
- **2.10.3 表单项行内校验错误** (输入框红边 + 正下方 `text-rose-600` 提示)
- **2.10.4 表格行内失败状态 Badge** (`bg-rose-50 text-rose-700` + "原因 →" 按钮)

### 2.11 图标库与大模型 Logo 资产规范 (Icon Library & Brand Logo Guidelines)

- **图标选型**：全平台统一 Lucide SVG 线框图标 (`stroke-width: 2`)，尺寸划分为 14px、16px、20px、24px。**严禁使用 Emoji** 充当功能 Icon。
- **大模型 Logo 映射**：统一存储于 `/model-icon/`（如 `deepseek.jpg`, `qianwen.jpg`, `hunyun.png`, `minimax.jpeg`），失效时回退至首字徽章。

### 2.12 自定义时间段筛选组件规范 (Custom Date/Time Range Filter Standards)

在大模型推理平台中，针对实时监控、高频快筛以及精细化日志审计等业务场景，全平台统一划分为以下 2 种核心场景的规范标准：

#### 2.12.1 场景一：快捷相对时间段切换器 (Quick Relative Time Range Segment)

- **业务场景**：实时算力监控看板、系统概览页面、实时 QPS/显存水位监控等高频快筛场景。
- **结构与控件**：组合式分段按钮 (Segmented Control) + 自定义下拉触发器。
  - **选项集合**：`实时` | `15m` | `1h` (默认) | `24h` | `7d` | `30d` | `自定义...`
- **样式规范**：
  - 容器：`bg-slate-100 p-0.5 rounded-lg border border-slate-200 inline-flex items-center gap-0.5`
  - 未选中项：`px-2.5 py-1 text-xs font-medium rounded-md text-slate-600 hover:text-slate-900 transition`
  - 选中激活态：`bg-white text-brand-PRIMARY (#266EFF) font-semibold shadow-2xs`
  - “自定义...”项：触发点击后在正下方浮出轻量 Popover，供用户填入绝对起止时间。

#### 2.12.2 场景二：精确绝对时间段选择器 (Precision Datetime Range Picker Popover)

- **业务场景**：请求监控 (API Key Request Logs)、链路追踪 (Request Tracing)、系统故障诊断与安全审计等需要精确到秒 (`YYYY-MM-DD HH:mm:ss`) 的场景。
- **结构与控件**：
  - **触发外框 (Trigger Bar)**：`📅 2026-08-12 00:00:00 ~ 2026-08-13 23:59:59 ▾` (`bg-white border border-slate-200 px-3 py-1.5 rounded-md text-xs font-mono text-slate-700 shadow-2xs hover:border-[#266EFF]`)
  - **下沉 Popover 浮层结构**：
    1. **左侧快捷区间预设 (Presets Bar)**：`今天` | `昨天` | `近 3 天` | `近 7 天` | `近 30 天` | `本月`
    2. **中间双月份日历 (Dual Calendar Grid)**：支持跨月份区间高亮选区 (`bg-blue-50 text-[#266EFF] font-bold`)。
    3. **顶部/底部精确时间输入**：精确到秒 (`HH:mm:ss`) 的输入框与重置、确认应用按钮。
  - **数据校验规则**：开始时间必须 `<= 结束时间`，选择跨度超过系统日志保存期限（如 90 天）时禁止提交并给出警告。

---

## 3. 整体布局架构 (Layout Architecture)

```
┌──────────────────┬──────────────────────────────────────────────────────────────────────────────┐
│ [应] 应龙推理平台  │ 面包屑：应龙 / 算力调度 / 调度工作台                           资源管理员 [A]│
│      [PROD]       ├──────────────────────────────────────────────────────────────────────────────┤
├──────────────────┤ 页面标题：算力调度                             当前调度域 / 刷新 / 导出明细  │
│ 工作台            │ 观察调度域健康、任务积压与算力占用，并在沙盘中推演策略影响。                │
│  系统概览         ├──────────────────────────────────────────────────────────────────────────────┤
│                  │ 智能调度建议 Banner                                                         │
│ 算力调度          │ ┌───────────────────────┐  ┌───────────────────────┐  ┌──────────────────┐ │
│  算力调度 (Active)│ │ 核心指标 / KPI 卡片    │  │ 吞吐与 KV Cache 水位  │  │ 任务队列明细表格 │ │
│  我的任务         │ └───────────────────────┘  └───────────────────────┘  └──────────────────┘ │
│                  │                                                                              │
│ 模型管理          │                                                                              │
│  模型仓库         │                                                                              │
│  ...              │                                                                              │
└──────────────────┴──────────────────────────────────────────────────────────────────────────────┘
```

### 3.1 导航结构与路由映射 (Navigation Matrix)

- **工作台**
  - 系统概览 (`/index.html`)
- **算力调度**
  - 算力调度 (`/prototypes/sys_dispatch.html`)
  - 我的任务 (`/prototypes/sys_task_list.html`)
- **模型管理**
  - 模型仓库 (`/prototypes/sys_model_repo.html`)
  - 模型服务 (`/prototypes/sys_model_service.html`)
  - 模型训练 (`/prototypes/sys_model_training.html`)
  - 模型纳管 (`/prototypes/sys_model_governance.html`)
  - 模型监测 (`/prototypes/sys_model_monitor.html`)
- **资源与运维**
  - 资源申请 (`/prototypes/sys_resource_application.html`)
  - 授权审批 (`/prototypes/sys_resource_approval.html`)
  - 集群管理 (`/prototypes/sys_infrastructure_mgmt.html`)
  - 请求监控 (`/prototypes/sys_api_key_mgmt.html`)
  - 链路追踪 (`/prototypes/sys_request_tracing.html`)
- **系统设置**
  - 调度设置 (`/prototypes/sys_scheduler_settings.html`)

---
