# 应龙大模型推理平台 页面设计和前端开发规范

---

## 1. 项目定位与设计目标

### 1.1 项目定位

**「应龙大模型推理平台 (Yinglong LLM Inference Platform)」** 面向企业级 AI 算力调度、模型全生命周期管理、在线推理服务发布和批处理任务分发。

设计目标：

- 在高数据密度下保持清晰的信息层级和稳定的操作路径。
- 统一导航、页面标题、表格、弹窗和状态反馈，减少跨页面的学习成本。
- 优先表达运行状态、资源风险和待处理任务，不使用无业务含义的装饰。

---

## 2. 页面设计风格与 UI 视觉规范 (Design Tokens)

界面面向高频运维与管理操作，视觉规则以易读和稳定为主。

### 2.1 色彩体系 (Color System)


| 色彩类型                      | Tailwind 类名 / HEX                              | 使用场景                                                     |
| :---------------------------- | :----------------------------------------------- | :----------------------------------------------------------- |
| **主品牌色 (Primary)**        | `Brand Blue` (`#266EFF`) / `Blue-600`            | 侧边栏选中态、主操作按钮、高优先级聚焦                       |
| **导航/侧边栏底色 (Sidebar)** | `White` (`#FFFFFF`) / `Slate-100` 悬停           | 纯白透亮侧边栏与 Header，搭配 1px 细分割线`border-slate-200` (`#E2E8F0`) |
| **画布背景色 (Canvas)**       | `Slate-50` (`#F8FAFC`) / `Slate-100` (`#F1F5F9`) | 低疲劳中性浅灰底，保障长时间运维监控舒适度                   |
| **表面/卡片色 (Surface)**     | `White` (`#FFFFFF`) / 1px 细边框                 | 数据表格背景、抽屉视图、弹窗 Modal 背景                      |
| **辅助色 (Accent)**           | `Indigo-600` (`#4F46E5`)                         | 纳管评估、算力测算等需与主操作区分的信息                     |
| **状态 - 运行/正常**          | `Emerald-600` (`#059669`) / `bg-emerald-50`      | 在线服务、节点 Health、审批通过、成功任务                    |
| **状态 - 信息/等待**          | `Sky-600` (`#0284C7`) / `bg-sky-50`              | 已提交、排队中、试用版模型                                   |
| **状态 - 审核中/警告**        | `Amber-600` (`#D97706`) / `bg-amber-50`          | 审核中、显存利用率 > 85%、SLA 超时告警                       |
| **状态 - 异常/拒绝**          | `Rose-600` (`#E11D48`) / `bg-rose-50`            | 节点 OOM/故障、审批拒绝、服务下线                            |

### 2.2 字体与阶梯规范 (Typography)

- **字体族**：系统优先无衬线字体 (`system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "PingFang SC", "Microsoft YaHei", sans-serif`)。
- **字号阶梯**：
  - `H1` (页面标题)：20px，`font-weight: 650`
  - `H2` (模块标题)：16px，`font-weight: 600`
  - `H3` (卡片或表单分组标题)：14px，`font-weight: 600`
  - `Body` (正文)：14px，`font-weight: 400`
  - `Table` (表格正文)：12–13px，`font-weight: 400`
  - `Caption` (状态标签和次级提示)：11–12px，`font-weight: 400`
- **标签排版禁忌**：所有胶囊/按钮/标签内的文字强制 `whitespace-nowrap`，禁止任何换行或折行。
- `H2` 和 `H3` 不配说明文案；页面级标题结构见 2.8.3 节。

### 2.3 布局与微边框规范 (Grid & Cards)

- **卡片边框**：使用 1px 边框 `border border-slate-200/80` (`#E2E8F0`) 和 `shadow-xs`。
- **圆角规范**：
  - 外层主容器/卡片：`rounded-lg` (8px) 或 `rounded-xl` (12px)
  - 内部按钮/输入框：`rounded-md` (6px)
  - 胶囊/状态 Badges：`rounded-full` (9999px)
- **嵌套圆角**：内层圆角应小于外层，并与容器间距协调。不把「外圆角 - 内边距」当作强制公式，避免在小圆角容器中得到负值。

### 2.4 列表组件与筛选/搜索样式规范 (Table & List Pattern Standards)

#### 2.4.1 基础列表规范 (Standard Data Table)

- **容器与边框**：外层包装卡片使用 `bg-white border border-slate-200/80 rounded-xl shadow-xs overflow-hidden`。
- **表头 (Table Header)**：`bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-500 tracking-wide`。中文表头不使用 `uppercase`。
- **表体 (Table Body)**：表格文字使用 12–13px，行分割线 `divide-y divide-slate-100 text-slate-700`，悬停态为 `hover:bg-slate-50/80`。
- **底栏/分页 (Footer Pagination)**：`p-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 bg-slate-50/50`。

#### 2.4.2 列表带搜索框规范 (Table with Search Bar)

- **工具栏布局 (Toolbar)**：`p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white`。
- **搜索输入框组件**：相对定位容器 `<div class="relative w-64">`，左侧放大镜 SVG 图标，右侧提供一键清除叉号。

#### 2.4.3 列表带多维筛选框规范 (Table with Filter Controls)

- **筛选工具栏结构**：组合区 `flex flex-wrap items-center gap-2.5`，按“搜索框 + 下拉筛选器组 + 状态快照 + 重置按钮”紧凑排列。
- **下拉筛选选择器**：`text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-md text-slate-700`。

### 2.5 弹窗/模态框样式规范 (Modal & Dialog Pattern Standards)

- **遮罩层 (Backdrop)**：`fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4`
- **弹窗容器 (Dialog Container)**：普通确认或短表单宽度不超过 672px；平台资源审核等包含表格和多组授权项的弹窗可扩展到 900px。共用基础样式为 `bg-white rounded-xl border border-slate-200/80 shadow-2xl w-full max-h-[90vh] flex flex-col overflow-hidden`。
- **Header/Body/Footer 三段式结构**：分别承载标题、表单或结果、底部操作。Body 负责滚动，Header 和 Footer 保持可见。

### 2.6 多条折线图与时序图表规范 (Multi-Series Line Chart Standards)

- **连接线型规范 (Straight Line Segments Only)**：所有时序折线图统一使用**直折线 (Linear / Straight)** 连接，**严格禁止使用平滑曲线 (Monotone / Bezier)**，确保真实采样点数据不失真。
- **横屏双视图 1:1 对齐**：支持左右双图列排布，相同时间轴与 Crosshair 联动。
- **控制组件**：时间范围统一使用 2.12 节定义的快捷时间组件；图表可另外提供采样粒度（`1s`, `5s`, `1m`, `5m`），不再维护第二套时间范围选项。

### 2.7 带图标的指标与特性卡片规范 (Icon Card & KPI Feature Card Standards)

- **形态 A：横向 KPI 数据卡片** (图标居左 + 数值 + 趋势 Badge)
- **形态 B：纵向单操作入口卡片** (图标 + 标题 + 简介 + 单链接按钮)
- **形态 C：纵向多操作项/组合操作卡片** (图标 + 状态 Badge + 描述 + 主次双按钮/Chip 操作网格)

---

### 2.8 侧栏导航、顶栏与页面标题规范 (Sidebar, Global Header & Page Heading Standards)

结合 `index.html` 与 `sys_dispatch.html` 的原型架构，平台统一采用 **“侧栏主导型”应用框架**：

1. **左侧导航栏 (`aside.sidebar`)**：承载品牌标识、四组主导航与页面跳转。
2. **右侧全局顶栏 (`header.global-header`)**：采用 Sticky 吸顶，仅保留左侧面包屑定位和右侧当前用户信息。不堆叠搜索框、告警通知或业务操作按钮。
3. **页面标题与操作区 (`main .page-heading` / `.overview-heading`)**：属于主画布页面内容的一部分，位于全局顶栏下方，统一承载当前页面的业务标题、说明与页面级工具栏（如调度域选择、刷新、导出等）。

整体结构示意见第 3 节，主导航与路由以 3.1 节为准。

#### 2.8.1 左侧导航栏规范 (Sidebar Navigation Bar - `aside.sidebar`)

- **定位与容器尺寸 (Positioning & Dimensions)**：

  - 桌面端固定于视口左侧，`position: fixed; inset: 0 auto 0 0; z-index: 40`。
  - 标准宽度为 `224px` (`--sidebar-width: 224px`)，最小高度覆盖完整视口 `min-height: 100vh`。
  - 背景为纯白 `#FFFFFF` (`var(--surface)` / `bg-white`)，右侧使用 `1px solid #E2E8F0` (`var(--border)`) 细分割线，无重影无重度渐变。
  - 响应式折叠逻辑 (Responsive Breakpoints)：
    - **桌面端 (> 900px)**：展开 `224px` 完整宽度，显示图标、分组标题与文字 Label。
    - **平板中屏 (641px ~ 900px)**：收窄为 `64px` (`--sidebar-width: 64px`)，居中显示 Logo 与导航图标，隐藏品牌文字、分组标题和导航文字。
    - **移动端 (<= 640px)**：隐藏侧边栏 (`display: none; width: 0px`)，右侧画布占满 100% 宽度。
- **品牌区 (Brand Area - `a.brand`)**：

  - 位于侧栏顶部，最小高度 `68px`。
  - 布局：`display: flex; min-height: 68px; align-items: center; gap: 11px; padding: 0 16px; border-bottom: 1px solid #E2E8F0; text-decoration: none`。
  - **Logo (`.brand-mark`)**：使用 2.11 节定义的平台品牌资产，按 `38×38px` 显示；容器保持透明，不增加底色、圆角或投影。
  - **品牌文字 (`.brand-copy`)**：上下排列主标题“应龙”和副标题“AI算力基座”。主标题使用 `15px/20px`、字重 `700`；副标题使用 `11px/16px`、颜色 `#64748B`。
  - 不显示独立的环境标识；如后续需要区分环境，应在全局配置或页面上下文中单独设计。
- **导航视图与分组 (`.sidebar-nav`, `.nav-group`)**：

  - 内容滚动容器 `.sidebar-nav`：`flex: 1; overflow-y: auto; padding: 12px 10px 16px`。
  - 分组间距：`.nav-group + .nav-group { margin-top: 14px; }`。
  - 分组标题 (`.nav-group-title`)：`margin: 0 0 5px; padding: 0 10px; color: #94A3B8 (var(--subtle)); font-size: 11px; line-height: 20px; font-weight: 600`。
  - 当前主导航分为工作台、算力调度、模型管理、资源与运维四组，页面清单与路由见 3.1 节。
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
  - 宽度与偏移：由 `.app-main { margin-left: var(--sidebar-width); }` 统一避让侧栏；顶栏使用 `width: 100%`，不再重复设置左偏移。
  - 背景与分割线：`background: rgba(255, 255, 255, .98)`，底部 `1px solid rgba(226, 232, 240, .9)`，阴影 `box-shadow: 0 1px 2px rgba(15, 23, 42, .03)`。
  - 布局与边距：`padding: 0 24px`, `display: flex; align-items: center; justify-content: space-between`。
- **左侧面包屑导航 (`nav.breadcrumb`)**：

  - HTML 结构：`<nav class="breadcrumb" aria-label="面包屑"><a href="index.html">应龙</a><span>/</span><span>算力调度</span><span>/</span><span class="breadcrumb-current" aria-current="page">调度工作台</span></nav>`
  - 字体与颜色：`font-size: 12px`, 默认文本与分隔符颜色 `#64748B` (`var(--muted)`), `white-space: nowrap`。
  - 父级链接：`color: #64748B`, 悬停 `color: #266EFF` (`var(--brand)`)。
  - 当前页面 (`.breadcrumb-current`)：`color: #334155` (`var(--text)`), `font-weight: 600`, 超长截断 `overflow: hidden; text-overflow: ellipsis`。
- **右侧用户信息 (`.user-profile`)**：

  - 新页面统一使用 `<div class="user-profile" aria-label="当前用户"><span>资源管理员</span><span class="user-avatar" aria-hidden="true">A</span></div>`。`index.html` 中的 `.header-profile` / `.avatar` 为现有兼容类名，不再扩展使用。
  - 布局与排版：`display: flex; align-items: center; gap: 8px; color: #334155; font-size: 12px; white-space: nowrap`。
  - 用户角色/名称：`<span>资源管理员</span>`，字号 `12px`，字重 `normal` / `500`。
  - 用户头像 (`.user-avatar`)：
    - 尺寸：`28×28px` 圆形 (`width: 28px; height: 28px; border-radius: 50%`)。
    - 样式：`display: grid; place-items: center; border: 1px solid #60A5FA; color: #FFFFFF; background: #266EFF (var(--brand)); font-size: 11px; font-weight: 700`。
  - 顶栏右侧仅保留当前用户信息。搜索、通知、刷新、导出和业务筛选放在对应页面的操作区。

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

### 2.10 页面消息提示与状态反馈规范 (Page Alert & Notification Standards)

根据消息提示的紧急程度与业务语境，平台统一划分为 **提示 (Info)**、**成功 (Success)**、**警告 (Warning)** 与 **错误 (Error)** 四种等级。各类消息在背景、边框、文本、图标及不同展现形态下遵循严格的视觉映射规范。

#### 2.10.1 消息等级与 Design Tokens 视觉映射矩阵

| 消息等级 | 代表业务场景 | 背景色 / 边框色 (Tailwind & HEX) | 文本与图标颜色 | 专属 Lucide 图标与 Line Width |
| :--- | :--- | :--- | :--- | :--- |
| **信息 / 提示 (Info)** | 系统版本升级预告、后台排队异步任务、常规操作提示 | `bg-sky-50` / `border-sky-200` (`#E0F2FE`) | 标题/正文: `text-sky-900`<br/>图标: `text-sky-600` (`#0284C7`) | `<Info>` (`w-4 h-4`) 圆圈叹号，线条 2px |
| **成功 (Success)** | 资源审批通过、服务发布下发成功、API 密钥重置完成 | `bg-emerald-50` / `border-emerald-200` (`#A7F3D0`) | 标题/正文: `text-emerald-900`<br/>图标: `text-emerald-600` (`#059669`) | `<CheckCircle>` (`w-4 h-4`) 圆圈勾选，线条 2px |
| **警告 (Warning)** | 显存利用率 > 85%、配额即将耗尽、SLA 延迟升高等告警 | `bg-amber-50` / `border-amber-200` (`#FDE68A`) | 标题/正文: `text-amber-900`<br/>图标: `text-amber-600` (`#D97706`) | `<AlertTriangle>` (`w-4 h-4`) 三角感叹号，线条 2px |
| **错误 / 失败 (Error)** | GPU OOM 崩溃、节点离线故障、API 签发失败、审批拒绝 | `bg-rose-50` / `border-rose-200` (`#FECDD3`) | 标题/正文: `text-rose-900`<br/>图标: `text-rose-600` (`#E11D48`) | `<AlertCircle>` (`w-4 h-4`) 圆圈叉号，线条 2px |

#### 2.10.2 页面消息展现形态规范 (Message Form Factor Standards)

1. **页面/区域级 Banner 消息 (In-Page Alert Banner)**：
   - 位于页面顶部或卡片内部，用于全页或模块级上下文提示。
   - 基础样式：`p-3.5 rounded-xl border flex items-start justify-between gap-3 text-xs`。
   - 颜色映射：根据消息等级使用对应的 `bg-*-50 border-*-200 text-*-900`。
   - 结构要求：左侧为专属等级图标 + 标题及说明文本，右侧可带操作按钮（如“查看日志 →”）或关闭叉号。
2. **全局 Toast 浮动通知 (Global Floating Toast)**：
   - 浮动于屏幕右上角 `fixed top-5 right-5 z-50`。
   - 基础样式：`bg-white border border-slate-200 shadow-lg rounded-xl p-3.5 flex items-start gap-3 text-xs`，左侧带有 4px 级别的特定颜色强化边条 (`border-l-4 border-l-*-500`)。
   - 交互规则：支持自动 4 秒倒计时淡出，或点击右上角关闭按钮手动关闭。
3. **表单项行内校验与提示 (Inline Field Feedback)**：
   - 输入框下方：`mt-1 text-[11px] font-medium flex items-center gap-1`，配有等级图标。
   - 状态高亮：校验失败时输入框高亮为对应的警告/错误边框 (`border-rose-500` 或 `border-amber-500`)。
4. **表格行内状态 Badge (Table Row Status Badge)**：
   - 胶囊型：`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border inline-flex items-center gap-1.5`。
   - 颜色与圆点：搭配 6px 呼吸圆点 (`w-1.5 h-1.5 rounded-full bg-*-500`)，不同等级呈现对应的背景与边框。

### 2.11 图标与 Logo 资产规范 (Icon and Logo Guidelines)

- **图标选型**：全平台统一 Lucide SVG 线框图标 (`stroke-width: 2`)，尺寸划分为 14px、16px、20px、24px。**严禁使用 Emoji** 充当功能 Icon。
- **平台品牌 Logo**：使用 `/doc/logo/icon_01.svg` 青龙图形；侧栏显示方式见 2.8.1 节。
- **大模型 Logo 映射**：统一存储于 `/prototypes/icon/model-icon/`（如 `deepseek.jpg`, `qianwen.jpg`, `hunyun.png`, `minimax.jpeg`），加载失败时回退至首字徽章。

### 2.12 自定义时间段筛选组件规范 (Custom Date/Time Range Filter Standards)

平台按筛选精度使用两类时间控件：

#### 2.12.1 场景一：快捷相对时间段切换器 (Quick Relative Time Range Segment)

- **业务场景**：算力看板、系统概览、QPS 或显存水位监控等高频筛选场景。
- **结构与控件**：组合式分段按钮 (Segmented Control) + 自定义下拉触发器。
  - **选项集合**：`实时` | `15m` | `1h` (默认) | `24h` | `7d` | `30d` | `自定义...`
- **样式规范**：
  - 容器：`bg-slate-100 p-0.5 rounded-lg border border-slate-200 inline-flex items-center gap-0.5`
  - 未选中项：`px-2.5 py-1 text-xs font-medium rounded-md text-slate-600 hover:text-slate-900 transition`
  - 选中激活态：`bg-white text-brand-PRIMARY (#266EFF) font-semibold shadow-xs`
  - “自定义...”项：触发点击后在正下方浮出轻量 Popover，供用户填入绝对起止时间。

#### 2.12.2 场景二：精确绝对时间段选择器 (Precision Datetime Range Picker Popover)

- **业务场景**：请求日志、链路追踪、故障诊断与安全审计等需要精确到秒 (`YYYY-MM-DD HH:mm:ss`) 的场景。
- **结构与控件**：
  - **触发外框 (Trigger Bar)**：Lucide Calendar 图标 + `2026-08-12 00:00:00 至 2026-08-13 23:59:59` + 下拉箭头（`bg-white border border-slate-200 px-3 py-1.5 rounded-md text-xs font-mono text-slate-700 shadow-xs hover:border-[#266EFF]`）。
  - **下沉 Popover 浮层结构**：
    1. **左侧快捷区间预设 (Presets Bar)**：`今天` | `昨天` | `近 3 天` | `近 7 天` | `近 30 天` | `本月`
    2. **中间双月份日历 (Dual Calendar Grid)**：支持跨月份区间高亮选区 (`bg-blue-50 text-[#266EFF] font-bold`)。
    3. **顶部/底部精确时间输入**：精确到秒 (`HH:mm:ss`) 的输入框与重置、确认应用按钮。
  - **数据校验规则**：开始时间必须 `<= 结束时间`，选择跨度超过系统日志保存期限（如 90 天）时禁止提交并给出警告。

---

## 3. 整体布局架构 (Layout Architecture)

```
┌──────────────────┬──────────────────────────────────────────────────────────────────────────────┐
│ [青龙] 应龙        │ 面包屑：应龙 / 算力调度 / 调度工作台                           资源管理员 [A]│
│    AI算力基座      ├──────────────────────────────────────────────────────────────────────────────┤
├──────────────────┤ 页面标题：算力调度                             当前调度域 / 刷新 / 导出明细  │
│ 工作台            │ 观察调度域健康、任务积压与算力占用，并在沙盘中推演策略影响。                │
│  系统概览         ├──────────────────────────────────────────────────────────────────────────────┤
│                  │ 智能调度建议 Banner                                                         │
│ 算力调度          │ ┌───────────────────────┐  ┌───────────────────────┐  ┌──────────────────┐ │
│  算力调度 (Active)│ │ 核心指标 / KPI 卡片    │  │ 吞吐与 KV Cache 水位  │  │ 任务队列明细表格 │ │
│  我的任务         │ └───────────────────────┘  └───────────────────────┘  └──────────────────┘ │
│                  │                                                                              │
│ 模型管理          │                                                                              │
│  模型资产         │                                                                              │
│  ...              │                                                                              │
└──────────────────┴──────────────────────────────────────────────────────────────────────────────┘
```

### 3.1 当前主导航与路由映射 (Navigation Matrix)

- **工作台**
  - 系统概览 (`/index.html`)
- **算力调度**
  - 算力调度 (`/prototypes/sys_dispatch.html`)
  - 我的任务 (`/prototypes/sys_task_list.html`)
- **模型管理**
  - 模型资产 (`/prototypes/sys_model_repo.html`)
  - 模型服务 (`/prototypes/sys_model_service.html`)
  - 模型训练 (`/prototypes/sys_model_training.html`)
  - 模型纳管 (`/prototypes/sys_model_governance.html`)
  - 模型监测 (`/prototypes/sys_model_monitor.html`)
- **资源与运维**
  - 资源申请 (`/prototypes/sys_resource_application.html`，当前跳转至模型纳管页的资源申请区域)
  - 授权审批 (`/prototypes/sys_resource_approval.html`)
  - 集群管理 (`/prototypes/sys_infrastructure_mgmt.html`)
  - 链路追踪 (`/prototypes/sys_request_tracing.html`)

`请求监控` 与 `调度设置` 尚无对应原型页面，暂不纳入当前主导航。

---