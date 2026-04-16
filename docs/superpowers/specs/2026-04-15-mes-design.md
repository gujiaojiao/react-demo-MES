---
name: MES 系统练手项目设计
description: 基于 CRUD 练习目标的 MES 制造执行系统雏形，包含七大核心模块
type: project
---

# MES 系统练手项目设计

> 创建时间：2026-04-15
> 用途：React + TypeScript 练手项目，基于现有后台管理系统扩展

## 一、MES 系统概述

### 1.1 什么是 MES

MES（Manufacturing Execution System，制造执行系统）是介于 ERP（企业资源计划）和生产线之间的管理系统。简单理解：

```
ERP（计划层） → MES（执行层） → 生产设备（控制层）
   ↓               ↓                ↓
 制定生产计划    执行和监控生产     实际生产操作
```

### 1.2 MES 的核心职责

- 把 ERP 下达的"要生产什么"转化为具体的"怎么生产"
- 跟踪生产过程：哪个订单在生产、用到哪些物料、在哪些设备上执行
- 记录生产结果：生产了多少、用了多少物料、设备状态如何

### 1.3 项目目标

本项目为 MES 系统练手雏形，重点是：
- **基础 CRUD 练习**：完整体验增删改查 + 表单交互 + 状态管理
- **数据关联理解**：学习外键关联、一对多关系
- **业务逻辑认知**：理解 MES 基础业务概念

---

## 二、模块总览

### 2.1 系统管理模块（基础设施）

| 序号 | 模块名称 | 表名 | 说明 |
|------|----------|------|------|
| 1 | 用户管理 | user | 已实现 |
| 2 | 角色管理 | role | 已实现，新增权限配置功能 |
| 3 | 数据字典 | dict | 管理下拉选项（新增） |

### 2.2 MES 业务模块

| 序号 | 模块名称 | 表名 | 说明 |
|------|----------|------|------|
| 1 | 产品管理 | product | 企业生产的成品信息 |
| 2 | 物料管理 | material | 生产所需的原材料、零部件 |
| 3 | BOM 管理 | bom | 产品与物料的组成关系 |
| 4 | 工序管理 | process | 生产过程中的具体操作步骤 |
| 5 | 工艺路线 | route / route_process | 工序的有序组合 |
| 6 | 设备管理 | device | 生产设备台账 |
| 7 | 生产订单 | production_order | MES 核心业务对象 |

---

## 三、系统管理模块详细设计

### 3.1 数据字典管理（Dict）

**业务含义**：

数据字典用于统一管理系统中的下拉选项，避免硬编码。

**举例**：
- 物料类型：原材料、零部件、包装材料
- 设备类型：生产设备、检测设备、辅助设备
- 订单状态：待产、生产中、已完成、已取消

**为什么需要数据字典？**
- 新增选项无需修改代码，只需在后台添加字典项
- 前端动态获取下拉选项，便于维护
- 不同系统可复用同一套字典数据

**数据模型**：

| 字段 | 类型 | 必填 | 说明 | 示例 |
|------|------|------|------|------|
| id | BIGINT | 是 | 主键，自增 | |
| dict_type | VARCHAR(50) | 是 | 字典类型（分组标识） | "material_type" |
| dict_code | VARCHAR(50) | 是 | 字典编码（值） | "raw" |
| dict_label | VARCHAR(50) | 是 | 字典标签（显示文本） | "原材料" |
| sort | INT | 是 | 排序号 | 1 |
| status | INT | 是 | 状态：1=启用，0=禁用 | 1 |
| created_at | DATETIME | 是 | 创建时间 | |

**业务场景**：
- 系统初始化时，录入各模块需要的字典数据
- 前端下拉框调用字典接口获取选项列表
- 管理员可随时新增、编辑、禁用字典项

**API 设计**：

| 接口 | 方法 | 说明 | 请求参数 |
|------|------|------|----------|
| /api/dict/list | GET | 字典列表（分页） | page, pageSize, dictType |
| /api/dict/type/{dictType} | GET | 按类型获取字典项 | dictType（路径参数） |
| /api/dict | POST | 创建字典项 | DictDTO（body） |
| /api/dict/{id} | PUT | 更新字典项 | id（路径参数），DictDTO（body） |
| /api/dict/{id} | DELETE | 删除字典项 | id（路径参数） |

**前端页面字段**：
- 字典类型（必填，Input，如 material_type）
- 字典编码（必填，Input，如 raw）
- 字典标签（必填，Input，如 原材料）
- 排序（必填，InputNumber）
- 状态（必填，Select：启用/禁用）

**预置字典数据**：

| dict_type | dict_code | dict_label | sort |
|-----------|-----------|------------|------|
| material_type | raw | 原材料 | 1 |
| material_type | part | 零部件 | 2 |
| material_type | package | 包装材料 | 3 |
| device_type | production | 生产设备 | 1 |
| device_type | inspection | 检测设备 | 2 |
| device_type | auxiliary | 辅助设备 | 3 |
| order_status | 0 | 待产 | 1 |
| order_status | 1 | 生产中 | 2 |
| order_status | 2 | 已完成 | 3 |
| order_status | 3 | 已取消 | 4 |
| common_status | 1 | 启用 | 1 |
| common_status | 0 | 禁用 | 2 |

---

### 3.2 角色权限配置（集成到角色管理）

**业务含义**：

为角色分配菜单访问权限，控制用户能看到哪些功能模块。

**交互设计**：

在角色编辑弹窗中新增"权限配置"区域，使用 Tree 组件展示权限树：

```
系统管理
  ├── 用户管理 (user)
  ├── 角色管理 (role)
  └── 数据字典 (dict)

MES 管理
  ├── 产品管理 (product)
  ├── 物料管理 (material)
  ├── BOM 管理 (bom)
  ├── 工序管理 (process)
  ├── 工艺路线 (route)
  ├── 设备管理 (device)
  └── 生产订单 (order)
```

**数据模型调整**：

Role 表新增 permissions 字段：

| 字段 | 类型 | 必填 | 说明 | 示例 |
|------|------|------|------|------|
| permissions | VARCHAR(500) | 否 | 权限列表（逗号分隔） | "user,role,product,material" |

**权限标识对应菜单**：

| 权限标识 | 菜单路径 |
|----------|----------|
| user | /system/user |
| role | /system/role |
| dict | /system/dict |
| product | /mes/product |
| material | /mes/material |
| bom | /mes/bom |
| process | /mes/process |
| route | /mes/route |
| device | /mes/device |
| order | /mes/order |

**API 设计调整**：

角色管理接口保持不变，DTO 新增 permissions 字段：

| 接口 | 方法 | 说明 |
|------|------|------|
| /api/role/list | GET | 角色列表 |
| /api/role/{id} | GET | 角色详情（含权限） |
| /api/role | POST | 创建角色（含权限） |
| /api/role/{id} | PUT | 更新角色（含权限） |

**前端设计**：

角色编辑弹窗使用 Tabs 分两区域：
- Tab 1：基本信息（名称、编码、状态、描述）
- Tab 2：权限配置（Tree 组件，勾选菜单权限）

**权限校验逻辑**：
- 用户登录后，根据角色权限过滤左侧菜单
- 无权限的菜单不显示
- 后端接口也可根据权限拦截请求（可选）

---

## 四、MES 业务模块详细设计

### 3.1 产品管理（Product）

**业务含义**：

产品是企业生产并销售的最终成品。比如：
- 汽车工厂的产品：某型号汽车
- 手机工厂的产品：某型号手机
- 饮料工厂的产品：某品牌饮料

**数据模型**：

| 字段 | 类型 | 必填 | 说明 | 示例 |
|------|------|------|------|------|
| id | BIGINT | 是 | 主键，自增 | |
| name | VARCHAR(50) | 是 | 产品名称 | "智能手机 A 型" |
| code | VARCHAR(50) | 是 | 产品编码（唯一） | "PROD-001" |
| spec | VARCHAR(100) | 否 | 规格 | "黑色 128GB" |
| status | INT | 是 | 状态：1=可生产，0=停产 | 1 |
| created_at | DATETIME | 是 | 创建时间 | |
| updated_at | DATETIME | 是 | 更新时间 | |

**业务场景**：
- 新产品上线时，在系统录入产品信息
- 产品停产时，修改状态为"停产"，后续订单不再选择该产品

**API 设计**：

| 接口 | 方法 | 说明 | 请求参数 |
|------|------|------|----------|
| /api/product/list | GET | 产品列表（分页） | page, pageSize, keyword |
| /api/product/{id} | GET | 获取单个产品详情 | id（路径参数） |
| /api/product | POST | 创建产品 | ProductDTO（body） |
| /api/product/{id} | PUT | 更新产品 | id（路径参数），ProductDTO（body） |
| /api/product/{id} | DELETE | 删除产品 | id（路径参数） |

**前端页面字段**：
- 产品名称（必填，Input）
- 产品编码（必填，Input）
- 规格（可选，Input）
- 状态（必填，Select：可生产/停产）

---

### 3.2 物料管理（Material）

**业务含义**：

物料是生产产品所需的原材料、零部件。比如：
- 生产手机的物料：屏幕、电池、芯片、外壳、螺丝
- 生产饮料的物料：水、糖、香精、包装瓶、瓶盖

**物料类型分类**：
- **原材料（raw）**：直接用于生产的基础材料（如钢板、塑料颗粒）
- **零部件（part）**：组装产品的组件（如电池、屏幕）
- **包装材料（package）**：用于包装的材料（如纸箱、标签）

**数据模型**：

| 字段 | 类型 | 必填 | 说明 | 示例 |
|------|------|------|------|------|
| id | BIGINT | 是 | 主键，自增 | |
| name | VARCHAR(50) | 是 | 物料名称 | "锂电池 3000mAh" |
| code | VARCHAR(50) | 是 | 物料编码（唯一） | "MAT-001" |
| type | VARCHAR(20) | 是 | 物料类型：raw/part/package | "part" |
| stock_qty | INT | 是 | 库存数量 | 500 |
| unit | VARCHAR(20) | 是 | 计量单位 | "个" |
| status | INT | 是 | 状态：1=可用，0=禁用 | 1 |
| created_at | DATETIME | 是 | 创建时间 | |
| updated_at | DATETIME | 是 | 更新时间 | |

**业务场景**：
- 新物料入库时录入系统，记录初始库存
- 生产消耗物料后，库存数量减少（可后续扩展）
- 库存不足时，系统可预警

**API 设计**：

| 接口 | 方法 | 说明 | 请求参数 |
|------|------|------|----------|
| /api/material/list | GET | 物料列表（分页） | page, pageSize, keyword, type |
| /api/material/{id} | GET | 获取单个物料详情 | id（路径参数） |
| /api/material | POST | 创建物料 | MaterialDTO（body） |
| /api/material/{id} | PUT | 更新物料 | id（路径参数），MaterialDTO（body） |
| /api/material/{id} | DELETE | 删除物料 | id（路径参数） |

**前端页面字段**：
- 物料名称（必填，Input）
- 物料编码（必填，Input）
- 物料类型（必填，Select：原材料/零部件/包装材料）
- 库存数量（必填，InputNumber）
- 计量单位（必填，Select：个/kg/米/箱）
- 状态（必填，Select：可用/禁用）

---

### 3.3 BOM 管理（物料清单）

**业务含义**：

BOM（Bill of Materials）定义"一个产品由哪些物料组成，每种用多少"。

**举例**：
- 产品"智能手机 A 型"的 BOM：
  - 屏幕：1 个
  - 电池：1 个
  - 芯片：1 个
  - 外壳：1 个
  - 螺丝：6 个
  - 包装盒：1 个

**为什么需要 BOM？**
- 生产订单下达时，系统根据 BOM 计算需要多少物料
- 比如：生产 100 台手机，需要 100 个屏幕、100 个电池、600 个螺丝

**数据模型**：

| 字段 | 类型 | 必填 | 说明 | 示例 |
|------|------|------|------|------|
| id | BIGINT | 是 | 主键，自增 | |
| product_id | BIGINT | 是 | 产品ID（外键） | 关联 product 表 |
| material_id | BIGINT | 是 | 物料ID（外键） | 关联 material 表 |
| quantity | INT | 是 | 单件用量 | 6（生产1个产品需要多少该物料） |
| created_at | DATETIME | 是 | 创建时间 | |

**业务场景**：
- 新产品上线时，配置其 BOM：录入该产品需要的所有物料及用量
- 生产订单创建时，系统自动计算物料需求总量（可后续扩展）

**API 设计**：

| 接口 | 方法 | 说明 | 请求参数 |
|------|------|------|----------|
| /api/bom/list | GET | BOM列表（按产品筛选） | productId |
| /api/bom/{id} | GET | 获取单个BOM详情 | id（路径参数） |
| /api/bom | POST | 创建BOM项 | BomDTO（body） |
| /api/bom/{id} | PUT | 更新BOM项 | id（路径参数），BomDTO（body） |
| /api/bom/{id} | DELETE | 删除BOM项 | id（路径参数） |
| /api/bom/by-product/{productId} | GET | 获取某产品的完整BOM | productId |

**前端页面设计**：
- BOM 页面通常不独立展示，而是在"产品详情"或"产品编辑"页面中以子表格形式展示
- 用户选择产品 → 展示该产品的 BOM 列表 → 可添加/编辑/删除 BOM 项

**前端页面字段**：
- 产品（必填，Select，选择已有产品）
- 物料（必填，Select，选择已有物料）
- 用量（必填，InputNumber）

---

### 3.4 工序管理（Process）

**业务含义**：

工序是生产过程中的一个具体操作步骤。比如生产手机的工序：

1. **SMT贴片**：将芯片焊接到电路板上
2. **组装**：将屏幕、电池等组装成整机
3. **测试**：检测手机功能是否正常
4. **包装**：放入包装盒、贴标签

**工序的特点**：
- 每个工序是一个独立的生产环节
- 工序有先后顺序
- 工序可能用到设备

**数据模型**：

| 字段 | 类型 | 必填 | 说明 | 示例 |
|------|------|------|------|------|
| id | BIGINT | 是 | 主键，自增 | |
| name | VARCHAR(50) | 是 | 工序名称 | "整机组装" |
| code | VARCHAR(50) | 是 | 工序编码（唯一） | "OP-001" |
| description | VARCHAR(200) | 否 | 工序描述 | "将屏幕、电池等组件组装成整机" |
| status | INT | 是 | 状态：1=启用，0=禁用 | 1 |
| created_at | DATETIME | 是 | 创建时间 | |
| updated_at | DATETIME | 是 | 更新时间 | |

**业务场景**：
- 工艺工程师定义产品的生产工序，录入系统
- 生产时按工序顺序执行

**API 设计**：

| 接口 | 方法 | 说明 | 请求参数 |
|------|------|------|----------|
| /api/process/list | GET | 工序列表（分页） | page, pageSize, keyword |
| /api/process/{id} | GET | 获取单个工序详情 | id（路径参数） |
| /api/process | POST | 创建工序 | ProcessDTO（body） |
| /api/process/{id} | PUT | 更新工序 | id（路径参数），ProcessDTO（body） |
| /api/process/{id} | DELETE | 删除工序 | id（路径参数） |

**前端页面字段**：
- 工序名称（必填，Input）
- 工序编码（必填，Input）
- 工序描述（可选，TextArea）
- 状态（必填，Select：启用/禁用）

---

### 3.5 工艺路线管理（Route）

**业务含义**：

工艺路线是一组工序的有序排列，定义"如何生产这个产品"。

**举例**：
- 工艺路线"手机标准生产线"：
  - 工序1：SMT贴片
  - 工序2：主板检测
  - 工序3：整机组装
  - 工序4：功能测试
  - 工序5：包装

**工艺路线与工序的关系**：
- 工序是"原子操作"，可以被多条工艺路线共用
- 工艺路线是"工序的组合"，定义生产流程

**数据模型 - 主表（工艺路线）**：

| 字段 | 类型 | 必填 | 说明 | 示例 |
|------|------|------|------|------|
| id | BIGINT | 是 | 主键，自增 | |
| name | VARCHAR(50) | 是 | 路线名称 | "手机标准生产线" |
| code | VARCHAR(50) | 是 | 路线编码（唯一） | "ROUTE-001" |
| description | VARCHAR(200) | 否 | 路线描述 | "适用于A型手机的标准生产流程" |
| status | INT | 是 | 状态：1=启用，0=禁用 | 1 |
| created_at | DATETIME | 是 | 创建时间 | |
| updated_at | DATETIME | 是 | 更新时间 | |

**数据模型 - 子表（工艺路线工序关联）**：

表名：route_process

| 字段 | 类型 | 必填 | 说明 | 示例 |
|------|------|------|------|------|
| id | BIGINT | 是 | 主键，自增 | |
| route_id | BIGINT | 是 | 工艺路线ID（外键） | 关联 route 表 |
| process_id | BIGINT | 是 | 工序ID（外键） | 关联 process 表 |
| sequence | INT | 是 | 在路线中的顺序 | 1, 2, 3... |

**业务场景**：
- 新产品上线时，工艺工程师定义其工艺路线
- 生产订单指定使用哪条工艺路线
- 生产执行时，按路线中工序的顺序依次完成

**API 设计**：

| 接口 | 方法 | 说明 | 请求参数 |
|------|------|------|----------|
| /api/route/list | GET | 工艺路线列表（分页） | page, pageSize, keyword |
| /api/route/{id} | GET | 获取单个路线详情（含工序列表） | id（路径参数） |
| /api/route | POST | 创建工艺路线（含工序） | RouteDTO（body） |
| /api/route/{id} | PUT | 更新工艺路线 | id（路径参数），RouteDTO（body） |
| /api/route/{id} | DELETE | 删除工艺路线 | id（路径参数） |

**前端页面设计**：
- 工艺路线页面需要包含工序选择功能
- 用户创建路线时，可添加多个工序并设置顺序
- 前端使用可拖拽列表或表格展示工序顺序

**前端页面字段**：
- 路线名称（必填，Input）
- 路线编码（必填，Input）
- 路线描述（可选，TextArea）
- 状态（必填，Select：启用/禁用）
- 工序列表（子表格，可添加/删除工序，设置顺序）

---

### 3.6 设备管理（Device）

**业务含义**：

设备是生产过程中使用的机器、工具。比如：

- SMT贴片机：用于芯片焊接
- 组装线：用于产品组装
- 测试仪：用于功能检测
- 包装机：用于产品包装

**设备类型分类**：
- **生产设备（production）**：直接参与生产加工
- **检测设备（inspection）**：用于质量检测
- **辅助设备（auxiliary）**：辅助生产操作

**数据模型**：

| 字段 | 类型 | 必填 | 说明 | 示例 |
|------|------|------|------|------|
| id | BIGINT | 是 | 主键，自增 | |
| name | VARCHAR(50) | 是 | 设备名称 | "多功能测试仪" |
| code | VARCHAR(50) | 是 | 设备编码（唯一） | "DEV-001" |
| type | VARCHAR(20) | 是 | 设备类型：production/inspection/auxiliary | "inspection" |
| location | VARCHAR(100) | 否 | 设备位置 | "A车间-1号线-3号位" |
| status | INT | 是 | 设备状态：1=正常，0=故障/停用 | 1 |
| created_at | DATETIME | 是 | 创建时间 | |
| updated_at | DATETIME | 是 | 更新时间 | |

**业务场景**：
- 设备台账管理：录入所有生产设备信息
- 设备状态监控：记录设备是否正常运行
- 生产排产时考虑设备可用性

**API 设计**：

| 接口 | 方法 | 说明 | 请求参数 |
|------|------|------|----------|
| /api/device/list | GET | 设备列表（分页） | page, pageSize, keyword, type |
| /api/device/{id} | GET | 获取单个设备详情 | id（路径参数） |
| /api/device | POST | 创建设备 | DeviceDTO（body） |
| /api/device/{id} | PUT | 更新设备 | id（路径参数），DeviceDTO（body） |
| /api/device/{id} | DELETE | 删除设备 | id（路径参数） |

**前端页面字段**：
- 设备名称（必填，Input）
- 设备编码（必填，Input）
- 设备类型（必填，Select：生产设备/检测设备/辅助设备）
- 设备位置（可选，Input）
- 状态（必填，Select：正常/故障）

---

### 3.7 生产订单管理（Production Order）

**业务含义**：

生产订单是 MES 的核心业务对象，代表"需要生产什么、生产多少"。

**来源**：
生产订单通常来自 ERP 系统或人工手动创建。

**生产订单的生命周期**：

```
待产(status=0) → 生产中(status=1) → 已完成(status=2)
                      ↓
                   已取消(status=3)
```

**数据模型**：

| 字段 | 类型 | 必填 | 说明 | 示例 |
|------|------|------|------|------|
| id | BIGINT | 是 | 主键，自增 | |
| order_no | VARCHAR(50) | 是 | 订单号（唯一） | "PO-20260415-001" |
| product_id | BIGINT | 是 | 产品ID（外键） | 关联 product 表 |
| route_id | BIGINT | 是 | 工艺路线ID（外键） | 关联 route 表 |
| quantity | INT | 是 | 计划生产数量 | 1000 |
| status | INT | 是 | 订单状态：0=待产,1=生产中,2=已完成,3=已取消 | 0 |
| plan_start_date | DATE | 否 | 计划开始日期 | 2026-04-20 |
| plan_end_date | DATE | 否 | 计划完成日期 | 2026-04-25 |
| created_at | DATETIME | 是 | 创建时间 | |
| updated_at | DATETIME | 是 | 更新时间 | |

**业务场景**：
1. 创建订单：指定产品、数量、工艺路线
2. 开始生产：状态从"待产"变为"生产中"
3. 完成生产：状态变为"已完成"
4. 取消订单：特殊情况取消生产

**API 设计**：

| 接口 | 方法 | 说明 | 请求参数 |
|------|------|------|----------|
| /api/order/list | GET | 订单列表（分页） | page, pageSize, keyword, status |
| /api/order/{id} | GET | 获取单个订单详情 | id（路径参数） |
| /api/order | POST | 创建订单 | OrderDTO（body） |
| /api/order/{id} | PUT | 更新订单信息 | id（路径参数），OrderDTO（body） |
| /api/order/{id}/start | PUT | 开始生产（状态→生产中） | id（路径参数） |
| /api/order/{id}/complete | PUT | 完成生产（状态→已完成） | id（路径参数） |
| /api/order/{id}/cancel | PUT | 取消订单（状态→已取消） | id（路径参数） |
| /api/order/{id} | DELETE | 删除订单（仅待产状态可删） | id（路径参数） |

**前端页面字段**：
- 订单号（系统自动生成，或手动输入）
- 产品（必填，Select，选择已有产品）
- 工艺路线（必填，Select，选择已有路线）
- 数量（必填，InputNumber）
- 计划开始日期（可选，DatePicker）
- 计划完成日期（可选，DatePicker）
- 状态（展示，Select：待产/生产中/已完成/已取消）

**前端操作按钮**：
- 根据状态显示不同操作：
  - 待产：编辑、开始生产、删除
  - 生产中：完成生产、取消
  - 已完成：查看详情
  - 已取消：查看详情

---

## 四、数据关系图

```
                        ┌─────────────┐
                        │   设备管理   │
                        │  (Device)   │
                        └──────┬──────┘
                               │（暂不关联工序，简化设计）
                               
┌─────────────┐    ┌─────────────────────┐    ┌─────────────┐
│   产品管理   │───▶│      工艺路线        │───▶│   工序管理   │
│  (Product)  │    │ (Route + RouteProc)  │    │  (Process)  │
└──────┬──────┘    └──────────┬──────────┘    └─────────────┘
       │                      │
       │                      │
       ▼                      ▼
┌─────────────┐         ┌─────────────┐
│    BOM      │         │  生产订单   │
│ (物料清单)  │         │   (Order)   │
└──────┬──────┘         └──────┬──────┘
       │                       │
       ▼                       │
┌─────────────┐                │
│   物料管理   │◀───────────────┘
│  (Material) │    （订单关联产品、路线）
└─────────────┘
```

**一句话总结**：
- 生产订单指定"生产什么产品、用哪条路线"
- 产品通过 BOM 知道"需要哪些物料"
- 工艺路线通过工序知道"怎么生产"

---

## 五、实现顺序

### 5.1 系统管理模块（优先）

1. **数据字典** — 基础设施，其他模块依赖
2. **角色权限** — 集成到角色管理，控制菜单显示

### 5.2 MES 业务模块

按数据依赖关系，推荐实现顺序：

1. **物料管理** — 无依赖，最先实现
2. **设备管理** — 无依赖，独立实现
3. **工序管理** — 无依赖，独立实现
4. **产品管理** — 无依赖，独立实现
5. **BOM 管理** — 依赖产品和物料
6. **工艺路线** — 依赖工序
7. **生产订单** — 依赖产品和工艺路线（核心模块，最后实现）

---

## 六、数据库表结构

### 6.1 系统管理表

```sql
-- 1. 数据字典表
CREATE TABLE dict (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    dict_type VARCHAR(50) NOT NULL COMMENT '字典类型',
    dict_code VARCHAR(50) NOT NULL COMMENT '字典编码',
    dict_label VARCHAR(50) NOT NULL COMMENT '字典标签',
    sort INT DEFAULT 0 COMMENT '排序号',
    status INT DEFAULT 1 COMMENT '状态：1启用，0禁用',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. 角色表（已有，新增 permissions 字段）
ALTER TABLE role ADD COLUMN permissions VARCHAR(500) COMMENT '权限列表（逗号分隔）';
```

```sql
-- 1. 物料表
CREATE TABLE material (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL COMMENT '物料名称',
    code VARCHAR(50) NOT NULL UNIQUE COMMENT '物料编码',
    type VARCHAR(20) NOT NULL COMMENT '物料类型：raw/part/package',
    stock_qty INT DEFAULT 0 COMMENT '库存数量',
    unit VARCHAR(20) NOT NULL COMMENT '计量单位',
    status INT DEFAULT 1 COMMENT '状态：1可用，0禁用',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. 设备表
CREATE TABLE device (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL COMMENT '设备名称',
    code VARCHAR(50) NOT NULL UNIQUE COMMENT '设备编码',
    type VARCHAR(20) NOT NULL COMMENT '设备类型：production/inspection/auxiliary',
    location VARCHAR(100) COMMENT '设备位置',
    status INT DEFAULT 1 COMMENT '状态：1正常，0故障',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 3. 工序表
CREATE TABLE process (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL COMMENT '工序名称',
    code VARCHAR(50) NOT NULL UNIQUE COMMENT '工序编码',
    description VARCHAR(200) COMMENT '工序描述',
    status INT DEFAULT 1 COMMENT '状态：1启用，0禁用',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 4. 产品表
CREATE TABLE product (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL COMMENT '产品名称',
    code VARCHAR(50) NOT NULL UNIQUE COMMENT '产品编码',
    spec VARCHAR(100) COMMENT '规格',
    status INT DEFAULT 1 COMMENT '状态：1可生产，0停产',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 5. BOM表（物料清单）
CREATE TABLE bom (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    product_id BIGINT NOT NULL COMMENT '产品ID',
    material_id BIGINT NOT NULL COMMENT '物料ID',
    quantity INT NOT NULL COMMENT '单件用量',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES product(id),
    FOREIGN KEY (material_id) REFERENCES material(id)
);

-- 6. 工艺路线表
CREATE TABLE route (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL COMMENT '路线名称',
    code VARCHAR(50) NOT NULL UNIQUE COMMENT '路线编码',
    description VARCHAR(200) COMMENT '路线描述',
    status INT DEFAULT 1 COMMENT '状态：1启用，0禁用',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 7. 工艺路线工序关联表
CREATE TABLE route_process (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    route_id BIGINT NOT NULL COMMENT '工艺路线ID',
    process_id BIGINT NOT NULL COMMENT '工序ID',
    sequence INT NOT NULL COMMENT '工序顺序',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (route_id) REFERENCES route(id),
    FOREIGN KEY (process_id) REFERENCES process(id)
);

-- 8. 生产订单表
CREATE TABLE production_order (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    order_no VARCHAR(50) NOT NULL UNIQUE COMMENT '订单号',
    product_id BIGINT NOT NULL COMMENT '产品ID',
    route_id BIGINT NOT NULL COMMENT '工艺路线ID',
    quantity INT NOT NULL COMMENT '计划生产数量',
    status INT DEFAULT 0 COMMENT '状态：0待产，1生产中，2已完成，3已取消',
    plan_start_date DATE COMMENT '计划开始日期',
    plan_end_date DATE COMMENT '计划完成日期',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES product(id),
    FOREIGN KEY (route_id) REFERENCES route(id)
);
```

---

## 七、学习目标对照

| 模块 | React 知识点 | 复杂度 |
|------|-------------|--------|
| 物料/设备/工序/产品 | 基础 CRUD、Table、Form、Modal | 简单 |
| BOM | 外键关联、子表格、Select 选择器 | 中等 |
| 工艺路线 | 一对多关系、动态添加/删除工序、顺序调整 | 中等 |
| 生产订单 | 状态流转、条件按钮、日期选择 | 中等 |

---

## 八、后续扩展方向（可选）

完成基础模块后，可考虑扩展：

1. **生产报工**：记录每个工序的实际完成情况
2. **物料消耗**：订单完成时自动扣减物料库存
3. **设备维护记录**：设备故障维修记录
4. **报表统计**：订单完成率、物料消耗统计

---

**Why:** 用户需要 React CRUD 练手项目，通过 MES 系统学习基础业务概念和数据关联。
**How to apply:** 按实现顺序逐步完成模块，先由 AI 提供后端 API，用户自行实现前端页面练习。