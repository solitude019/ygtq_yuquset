# DESIGN.md

## 品牌定位
- 品牌名称: APEX BALL
- 定位: 专业球类运动装备品牌，面向海外市场
- 气质: 专业、活力、现代、可信赖

## Design Tokens

### 色彩
- 主色: Deep Navy #0F172A (深海蓝，象征专业与信赖)
- 强调色: Electric Orange #F97316 (活力橙，象征运动能量)
- 背景色: Pure White #FFFFFF / Light Gray #F8FAFC
- 文字色: Slate #334155 / Light #94A3B8
- 成功色: Emerald #10B981
- 错误色: Rose #EF4444

### 字体
- 标题字体: Montserrat (Google Fonts) - 力量感、运动感
- 正文字体: Inter (Google Fonts) - 清晰易读
- 中文字体回退: system-ui, -apple-system, sans-serif

### 间距与圆角
- 基础间距单位: 4px
- 组件圆角: rounded-lg (8px) / rounded-xl (12px)
- 卡片圆角: rounded-2xl (16px)

### 阴影
- 卡片阴影: shadow-sm (默认) / shadow-md (悬停)
- 导航栏阴影: shadow-sm

### 动效
- 过渡时间: 200ms-300ms
- 缓动曲线: ease-out
- 卡片悬停: translateY(-4px) + shadow 增强
- 按钮悬停: 背景色加深 + 轻微放大

## 布局与响应式
- 最大内容宽度: 1280px (mx-auto)
- 导航栏: 固定顶部，半透明毛玻璃效果
- 商品网格: 移动端1列 / 平板2列 / 桌面3-4列
- 页面间距: py-16 ~ py-24

## 设计禁忌
- 不使用渐变背景（保持干净）
- 不使用过多装饰元素
- 不使用小于 14px 的字体
- 不使用超过 3 种主色调
