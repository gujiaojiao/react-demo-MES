-- Initialize database schema only
CREATE TABLE IF NOT EXISTS `user` (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    role VARCHAR(20) DEFAULT 'user',
    status INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `role` (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    status INT DEFAULT 1,
    description VARCHAR(200),
    permissions VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `dict` (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    dict_type VARCHAR(50) NOT NULL,
    dict_code VARCHAR(50) NOT NULL,
    dict_label VARCHAR(50) NOT NULL,
    sort INT DEFAULT 0,
    status INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Material table
CREATE TABLE IF NOT EXISTS `material` (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    type VARCHAR(20) NOT NULL,
    stock_qty INT DEFAULT 0,
    unit VARCHAR(20) NOT NULL,
    status INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Device table
CREATE TABLE IF NOT EXISTS `device` (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    type VARCHAR(20) NOT NULL,
    location VARCHAR(100),
    status INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Process table (工序)
CREATE TABLE IF NOT EXISTS `mes_process` (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(200),
    status INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Product table
CREATE TABLE IF NOT EXISTS `product` (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    spec VARCHAR(200),
    status INT DEFAULT 1,
    description VARCHAR(200),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Material test data
INSERT INTO material (name, code, type, stock_qty, unit, status, created_at) VALUES
('锂电池3000mAh', 'MAT-001', 'part', 500, '个', 1, CURRENT_TIMESTAMP),
('AMOLED屏幕6.5寸', 'MAT-002', 'part', 300, '片', 1, CURRENT_TIMESTAMP),
('高通骁龙芯片', 'MAT-003', 'part', 200, '个', 1, CURRENT_TIMESTAMP),
('手机外壳-黑色', 'MAT-004', 'part', 400, '个', 1, CURRENT_TIMESTAMP),
('螺丝M2*5mm', 'MAT-005', 'part', 5000, '个', 1, CURRENT_TIMESTAMP),
('包装盒-A型', 'MAT-006', 'package', 600, '个', 1, CURRENT_TIMESTAMP),
('标签贴纸', 'MAT-007', 'package', 1000, '张', 1, CURRENT_TIMESTAMP),
('塑料颗粒ABS', 'MAT-008', 'raw', 500, 'kg', 1, CURRENT_TIMESTAMP),
('铜线0.5mm', 'MAT-009', 'raw', 200, '米', 1, CURRENT_TIMESTAMP),
('铝板2mm', 'MAT-010', 'raw', 150, 'kg', 0, CURRENT_TIMESTAMP);

-- Device test data
INSERT INTO device (name, code, type, location, status, created_at) VALUES
('SMT贴片机-1号', 'DEV-001', 'production', 'A车间-1号线-1号位', 1, CURRENT_TIMESTAMP),
('SMT贴片机-2号', 'DEV-002', 'production', 'A车间-1号线-2号位', 1, CURRENT_TIMESTAMP),
('自动组装线', 'DEV-003', 'production', 'A车间-2号线', 1, CURRENT_TIMESTAMP),
('多功能测试仪', 'DEV-004', 'inspection', 'B车间-检测区-1号位', 1, CURRENT_TIMESTAMP),
('光学检测仪', 'DEV-005', 'inspection', 'B车间-检测区-2号位', 1, CURRENT_TIMESTAMP),
('自动包装机', 'DEV-006', 'production', 'C车间-包装线', 1, CURRENT_TIMESTAMP),
('老化测试架', 'DEV-007', 'auxiliary', 'B车间-老化区', 1, CURRENT_TIMESTAMP),
('焊接机器人', 'DEV-008', 'production', 'A车间-焊接区', 0, CURRENT_TIMESTAMP),
('振动测试台', 'DEV-009', 'inspection', 'B车间-检测区-3号位', 1, CURRENT_TIMESTAMP),
('除尘设备', 'DEV-010', 'auxiliary', 'A车间-清洁区', 1, CURRENT_TIMESTAMP);

-- Process test data
INSERT INTO mes_process (name, code, description, status, created_at) VALUES
('SMT贴片', 'OP-001', '将芯片等元器件焊接到PCB板上', 1, CURRENT_TIMESTAMP),
('主板检测', 'OP-002', '检测主板电路连接是否正常', 1, CURRENT_TIMESTAMP),
('整机组装', 'OP-003', '将屏幕、电池、外壳等组装成整机', 1, CURRENT_TIMESTAMP),
('功能测试', 'OP-004', '检测手机各项功能是否正常工作', 1, CURRENT_TIMESTAMP),
('老化测试', 'OP-005', '模拟长时间使用检测产品稳定性', 1, CURRENT_TIMESTAMP),
('外观检验', 'OP-006', '检查产品外观是否有瑕疵', 1, CURRENT_TIMESTAMP),
('包装', 'OP-007', '产品装入包装盒并贴标签', 1, CURRENT_TIMESTAMP),
('入库', 'OP-008', '将成品入库管理', 1, CURRENT_TIMESTAMP),
('质检', 'OP-009', '质量检测并记录数据', 0, CURRENT_TIMESTAMP),
('返修', 'OP-010', '对不合格产品进行修复', 1, CURRENT_TIMESTAMP);

-- Product test data
INSERT INTO product (name, code, spec, status, description, created_at) VALUES
('智能手机A型', 'PHONE-A001', '6.5英寸, 128GB存储, 8GB内存', 1, '入门级智能手机，性价比高', CURRENT_TIMESTAMP),
('智能手机B型', 'PHONE-B002', '6.7英寸, 256GB存储, 12GB内存', 1, '高端旗舰智能手机', CURRENT_TIMESTAMP),
('智能手表X型', 'WATCH-X001', '1.8英寸AMOLED屏幕, IP68防水', 1, '运动健康智能手表', CURRENT_TIMESTAMP),
('智能手表Y型', 'WATCH-Y002', '1.6英寸屏幕, 心率监测', 0, '基础款智能手表', CURRENT_TIMESTAMP),
('平板电脑M型', 'TABLET-M001', '10.9英寸, 64GB存储, WiFi版', 1, '入门级平板电脑', CURRENT_TIMESTAMP),
('平板电脑N型', 'TABLET-N002', '12.9英寸, 256GB存储, 5G版', 1, '专业级平板电脑', CURRENT_TIMESTAMP),
('无线耳机P型', 'EARPHONE-P001', '主动降噪, 30小时续航', 1, '高端降噪耳机', CURRENT_TIMESTAMP),
('无线耳机Q型', 'EARPHONE-Q002', '入耳式, 24小时续航', 1, '入门级无线耳机', CURRENT_TIMESTAMP),
('智能音箱S型', 'SPEAKER-S001', '10W功率, 语音助手', 0, '智能家居音箱', CURRENT_TIMESTAMP),
('充电器C型', 'CHARGER-C001', '65W快充, Type-C接口', 1, '快充充电器', CURRENT_TIMESTAMP);

-- BOM table (物料清单)
CREATE TABLE IF NOT EXISTS `bom` (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT NOT NULL,
    material_id BIGINT NOT NULL,
    quantity INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Route table (工艺路线)
CREATE TABLE IF NOT EXISTS `route` (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(200),
    status INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- RouteProcess table (工艺路线工序关联)
CREATE TABLE IF NOT EXISTS `route_process` (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    route_id BIGINT NOT NULL,
    process_id BIGINT NOT NULL,
    sequence INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- BOM test data (产品A型的物料清单)
INSERT INTO bom (product_id, material_id, quantity, created_at) VALUES
(1, 1, 1, CURRENT_TIMESTAMP),   -- 智能手机A型: 锂电池1个
(1, 2, 1, CURRENT_TIMESTAMP),   -- 智能手机A型: AMOLED屏幕1片
(1, 3, 1, CURRENT_TIMESTAMP),   -- 智能手机A型: 骁龙芯片1个
(1, 4, 1, CURRENT_TIMESTAMP),   -- 智能手机A型: 手机外壳1个
(1, 5, 6, CURRENT_TIMESTAMP),   -- 智能手机A型: 螺丝6个
(1, 6, 1, CURRENT_TIMESTAMP),   -- 智能手机A型: 包装盒1个
(1, 7, 2, CURRENT_TIMESTAMP),   -- 智能手机A型: 标签贴纸2张
(2, 1, 1, CURRENT_TIMESTAMP),   -- 智能手机B型: 锂电池1个
(2, 2, 1, CURRENT_TIMESTAMP),   -- 智能手机B型: AMOLED屏幕1片
(2, 3, 1, CURRENT_TIMESTAMP),   -- 智能手机B型: 骁龙芯片1个
(3, 5, 4, CURRENT_TIMESTAMP),   -- 智能手表X型: 螺丝4个
(3, 6, 1, CURRENT_TIMESTAMP);   -- 智能手表X型: 包装盒1个

-- Route test data (工艺路线)
INSERT INTO route (name, code, description, status, created_at) VALUES
('手机标准生产线', 'ROUTE-001', '适用于智能手机A型的标准生产流程', 1, CURRENT_TIMESTAMP),
('手机高端生产线', 'ROUTE-002', '适用于智能手机B型的高端生产流程', 1, CURRENT_TIMESTAMP),
('手表生产线', 'ROUTE-003', '适用于智能手表X型的生产流程', 1, CURRENT_TIMESTAMP),
('平板标准线', 'ROUTE-004', '适用于平板电脑M型的生产流程', 0, CURRENT_TIMESTAMP),
('耳机生产线', 'ROUTE-005', '适用于无线耳机的生产流程', 1, CURRENT_TIMESTAMP);

-- RouteProcess test data (工艺路线工序关联)
INSERT INTO route_process (route_id, process_id, sequence, created_at) VALUES
(1, 1, 1, CURRENT_TIMESTAMP),  -- 手机标准线: SMT贴片 (工序1)
(1, 2, 2, CURRENT_TIMESTAMP),  -- 手机标准线: 主板检测 (工序2)
(1, 3, 3, CURRENT_TIMESTAMP),  -- 手机标准线: 整机组装 (工序3)
(1, 4, 4, CURRENT_TIMESTAMP),  -- 手机标准线: 功能测试 (工序4)
(1, 5, 5, CURRENT_TIMESTAMP),  -- 手机标准线: 老化测试 (工序5)
(1, 6, 6, CURRENT_TIMESTAMP),  -- 手机标准线: 外观检验 (工序6)
(1, 7, 7, CURRENT_TIMESTAMP),  -- 手机标准线: 包装 (工序7)
(2, 1, 1, CURRENT_TIMESTAMP),  -- 手机高端线: SMT贴片
(2, 2, 2, CURRENT_TIMESTAMP),  -- 手机高端线: 主板检测
(2, 3, 3, CURRENT_TIMESTAMP),  -- 手机高端线: 整机组装
(2, 4, 4, CURRENT_TIMESTAMP),  -- 手机高端线: 功能测试
(2, 5, 5, CURRENT_TIMESTAMP),  -- 手机高端线: 老化测试
(2, 6, 6, CURRENT_TIMESTAMP),  -- 手机高端线: 外观检验
(2, 7, 7, CURRENT_TIMESTAMP),  -- 手机高端线: 包装
(3, 3, 1, CURRENT_TIMESTAMP),  -- 手表生产线: 整机组装
(3, 4, 2, CURRENT_TIMESTAMP),  -- 手表生产线: 功能测试
(3, 6, 3, CURRENT_TIMESTAMP),  -- 手表生产线: 外观检验
(3, 7, 4, CURRENT_TIMESTAMP);  -- 手表生产线: 包装

-- Production Order table (生产订单)
CREATE TABLE IF NOT EXISTS `production_order` (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_no VARCHAR(50) NOT NULL UNIQUE,
    product_id BIGINT NOT NULL,
    route_id BIGINT NOT NULL,
    quantity INT NOT NULL,
    status INT DEFAULT 0,
    plan_start_date DATE,
    plan_end_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Production Order test data
INSERT INTO production_order (order_no, product_id, route_id, quantity, status, plan_start_date, plan_end_date, created_at) VALUES
('PO-20260416-001', 1, 1, 100, 0, '2026-04-20', '2026-04-25', CURRENT_TIMESTAMP),
('PO-20260416-002', 1, 1, 200, 0, '2026-04-22', '2026-04-30', CURRENT_TIMESTAMP),
('PO-20260416-003', 2, 2, 50, 0, '2026-04-25', '2026-04-28', CURRENT_TIMESTAMP),
('PO-20260416-004', 3, 3, 300, 1, '2026-04-15', '2026-04-18', CURRENT_TIMESTAMP),
('PO-20260416-005', 1, 1, 150, 2, '2026-04-10', '2026-04-14', CURRENT_TIMESTAMP),
('PO-20260416-006', 2, 2, 80, 1, '2026-04-16', '2026-04-20', CURRENT_TIMESTAMP),
('PO-20260416-007', 5, 4, 500, 0, '2026-04-28', '2026-05-05', CURRENT_TIMESTAMP),
('PO-20260416-008', 7, 5, 1000, 3, '2026-04-12', '2026-04-15', CURRENT_TIMESTAMP),
('PO-20260416-009', 1, 1, 250, 0, '2026-05-01', '2026-05-08', CURRENT_TIMESTAMP),
('PO-20260416-010', 3, 3, 150, 2, '2026-04-08', '2026-04-12', CURRENT_TIMESTAMP);