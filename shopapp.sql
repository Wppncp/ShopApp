-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- 主机： 127.0.0.1:3306
-- 生成日期： 2022-08-22 12:53:53
-- 服务器版本： 8.0.21
-- PHP 版本： 7.3.21

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- 数据库： `shopapp`
--

-- --------------------------------------------------------

--
-- 表的结构 `address`
--

DROP TABLE IF EXISTS `address`;
CREATE TABLE IF NOT EXISTS `address` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `tel` varchar(255) NOT NULL,
  `province` varchar(255) NOT NULL,
  `city` varchar(255) NOT NULL,
  `district` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `isDefault` varchar(255) NOT NULL,
  `userId` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- 转存表中的数据 `address`
--

INSERT INTO `address` (`id`, `name`, `tel`, `province`, `city`, `district`, `address`, `isDefault`, `userId`) VALUES
(1, 'admin1', '12345678910', '湖南', '长沙', '科技园', '创业大厦', '0', 1),
(3, 'admin2', '12345678910', '', '湖南省-长沙市-芙蓉区', '', 'cyy', '1', 1);

-- --------------------------------------------------------

--
-- 表的结构 `goods_cart`
--

DROP TABLE IF EXISTS `goods_cart`;
CREATE TABLE IF NOT EXISTS `goods_cart` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uid` int NOT NULL,
  `goods_id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `imgUrl` varchar(255) NOT NULL,
  `pprice` double NOT NULL,
  `num` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- 表的结构 `goods_search`
--

DROP TABLE IF EXISTS `goods_search`;
CREATE TABLE IF NOT EXISTS `goods_search` (
  `id` int NOT NULL AUTO_INCREMENT,
  `imgUrl` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `pprice` double NOT NULL,
  `oprice` double NOT NULL,
  `discount` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- 转存表中的数据 `goods_search`
--

INSERT INTO `goods_search` (`id`, `imgUrl`, `name`, `pprice`, `oprice`, `discount`) VALUES
(1, 'https://img12.360buyimg.com/babel/s320x320_jfs/t1/167865/31/3079/143686/60040515Ef5f63556/f527e4e4b3118e56.jpg!cc_320x320.webp', 'MLB官方 男女帽子NY渔夫帽LOGO刺绣运动休闲时尚21年春季新款32CPHB-07B 洛杉矶道奇队/米色 57', 399, 399, 'No discounts'),
(2, 'https://img10.360buyimg.com/babel/s320x320_jfs/t1/209376/2/25426/55485/62f1f836Ea517b9b3/7a722cb5078245d0.jpg!cc_320x320.webp', '哥弟真的好女装2022秋季新款宽松bf慵懒风休闲运动连帽卫衣裤女套装A300925 A100133 暖杏 XL(5码)', 115, 99, '9'),
(3, 'https://img14.360buyimg.com/babel/s320x320_jfs/t1/159033/36/267/239844/5fea98f4Ed310d356/6c7ce3060724bc99.jpg!cc_320x320.webp', '曼德诗（MARVALAS） 曼德诗绿色印花衬衫女高品质季新款百搭图案长袖时尚缎面雪纺上衣 绿花 M', 265, 249, '9'),
(4, 'https://img12.360buyimg.com/babel/s320x320_jfs/t1/75143/15/21224/147883/62f13668E845c4c3b/37e3d362722d8ba4.jpg!cc_320x320.webp', '诗篇可颜女装秋季新款简约圆领珍珠扣波浪边长袖衬衫 白色 36', 69, 69, '多买多惠'),
(5, 'https://img14.360buyimg.com/n1/jfs/t1/162051/30/29828/234714/62f6752bEc6bbe9a9/86c56312f486abb6.jpg', '李宁篮球鞋男2022新品中帮专业比赛鞋官方旗舰网ABAS027 月白蓝/标准白-4 42', 799, 3890, '2.4'),
(6, 'https://img11.360buyimg.com/n7/jfs/t1/22526/3/19193/50973/62f6267cEe76048de/b2b76bd6da7ff3f3.jpg', '阿迪达斯（Adidas）短裤男 新款透气舒适百搭休闲五分裤运动短裤 五分裤-小LOGO L', 129, 129, '每满200减30'),
(7, 'https://img11.360buyimg.com/n1/jfs/t1/188134/20/7134/40810/60befc8aEf3532b70/1425dee17628e748.jpg', '李宁篮球鞋男鞋新品驭帅15男子减震回弹中帮篮球专业比赛鞋运动鞋鞋子官方旗舰网ABAR043 黑色/蝴蝶蓝-8 43', 649, 699, '满469减50'),
(8, 'https://img13.360buyimg.com/n7/jfs/t1/38352/13/17539/589320/62ebf6bdEed8488c9/626787a9cf1ebb58.png', 'Rianne.He 2022夏季新款户外骑行纯色连帽拉链透气防紫外线薄款冰丝女防晒衣 悦动粉 M', 106, 126, '满100减20'),
(9, 'https://m.360buyimg.com/babel/jfs/t1/218735/6/13461/60474/621dbc70E96198993/39b539772b5cd811.jpg.webp', '优寸羊毛西服套装男 春季意大利进口纯羊毛商务正装西装轻正装 塞纳金深灰 手机在线量体', 3870, 3890, '满200减30'),
(10, 'https://m.360buyimg.com/babel/jfs/t1/205816/1/4557/266163/6131ee1eE4735df53/18138e51ff22874a.jpg!q70.dpg', '七匹狼双肩包男士背包大容量防泼水初中高中大学生书包15.6英寸电脑包商务休闲轻便旅行包男黑色CD006060-1', 139, 139, 'PLUS限购'),
(11, 'https://img12.360buyimg.com/babel/s320x320_jfs/t1/167865/31/3079/143686/60040515Ef5f63556/f527e4e4b3118e56.jpg!cc_320x320.webp', 'MLBL 男女帽子NY渔夫帽LOGO刺绣运动休闲时尚21年春季新款32CPHB-07B 洛杉矶道奇队/米色 57', 39.9, 59.9, '6.9'),
(12, 'https://img12.360buyimg.com/babel/s320x320_jfs/t1/167865/31/3079/143686/60040515Ef5f63556/f527e4e4b3118e56.jpg!cc_320x320.webp', 'MLBL 男女帽子NY渔夫帽LOGO刺绣运动休闲时尚21年春季新款32CPHB-07B 洛杉矶道奇队/米色 57', 59.9, 59.9, 'No discounts'),
(13, 'https://img12.360buyimg.com/babel/s320x320_jfs/t1/167865/31/3079/143686/60040515Ef5f63556/f527e4e4b3118e56.jpg!cc_320x320.webp', 'MLB 官方正品 男女帽子NY渔夫帽LOGO刺绣运动休闲时尚21年春季新款32CPHB-07B ', 410, 599, '6.9'),
(14, 'https://img14.360buyimg.com/n1/jfs/t1/162051/30/29828/234714/62f6752bEc6bbe9a9/86c56312f486abb6.jpg', '李宁篮球鞋男2022新品中帮专业比赛鞋官方旗舰网ABAS027 ', 2999, 3890, '7'),
(15, 'https://img11.360buyimg.com/n1/jfs/t1/188134/20/7134/40810/60befc8aEf3532b70/1425dee17628e748.jpg', '中国李宁篮球鞋男鞋新品驭帅15男子减震回弹中帮篮球专业比赛鞋运动鞋鞋子官方旗舰网ABAR043 ', 699, 699, 'No Discounts'),
(16, 'https://m.360buyimg.com/babel/jfs/t1/82814/39/20566/340046/62b54ef7E661e5bf1/1d01a52f9084d35b.jpg.webp', '曼奴诺思 冰丝运动裤女2022夏季薄款高腰垂感凉凉裤小个子直筒拖地裤女 黑色常规款 L', 113.4, 113.4, '多买多惠'),
(17, 'https://m.360buyimg.com/babel/jfs/t1/120867/34/28439/200639/62f53de4E281e2b2e/74687c1deeb0f6ac.jpg.webp', '森马外套男2022秋季新款宽松休闲西装都市通勤简约基础时尚个性潮 烟灰银2335 175/92A/L', 225, 299, '7.5');

-- --------------------------------------------------------

--
-- 表的结构 `store_order`
--

DROP TABLE IF EXISTS `store_order`;
CREATE TABLE IF NOT EXISTS `store_order` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uId` varchar(255) NOT NULL,
  `order_id` varchar(255) NOT NULL,
  `goods_name` varchar(255) NOT NULL,
  `goods_price` varchar(255) NOT NULL,
  `goods_num` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `order_status` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- 表的结构 `user`
--

DROP TABLE IF EXISTS `user`;
CREATE TABLE IF NOT EXISTS `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userName` varchar(255) NOT NULL,
  `userPwd` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `imgUrl` varchar(255) NOT NULL,
  `nickName` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `provider` varchar(255) NOT NULL,
  `openid` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- 转存表中的数据 `user`
--

INSERT INTO `user` (`id`, `userName`, `userPwd`, `phone`, `imgUrl`, `nickName`, `token`, `provider`, `openid`) VALUES
(1, 'admin', '123456', '12345678910', 'https://tse2-mm.cn.bing.net/th/id/OIP-C.zT8K6LMSrAgSfIgNgSVF6gHaHa?w=200&h=200&c=7&r=0&o=5&dpr=1.25&pid=1.7', '管理员', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiMTIzNDU2Nzg5MTAiLCJpYXQiOjE2NjEwNjQ3MjZ9.kg9a9WozUZSQCJtc4vwfVVQH9lCY9xv-SYXbSfHGtTs', 'undefined', 'undefined');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
