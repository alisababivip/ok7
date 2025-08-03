-- Tạo bảng promotions theo schema yêu cầu
CREATE TABLE IF NOT EXISTS `promotions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL COMMENT 'Tiêu đề khuyến mãi',
  `thumbnail` text NOT NULL COMMENT 'URL hình ảnh thumbnail',
  `content` text NOT NULL COMMENT 'Nội dung chi tiết khuyến mãi',
  `isRegister` tinyint(1) NOT NULL DEFAULT 0 COMMENT 'Có yêu cầu đăng ký không (0: không, 1: có)',
  `status` enum('active','inactive','pending') NOT NULL DEFAULT 'pending' COMMENT 'Trạng thái khuyến mãi',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Ngày tạo',
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Ngày cập nhật',
  `deletedAt` timestamp NULL DEFAULT NULL COMMENT 'Ngày xóa (soft delete)',
  PRIMARY KEY (`id`),
  INDEX `idx_status` (`status`),
  INDEX `idx_isRegister` (`isRegister`),
  INDEX `idx_createdAt` (`createdAt`),
  INDEX `idx_deletedAt` (`deletedAt`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Bảng quản lý khuyến mãi';

-- Thêm dữ liệu mẫu
INSERT INTO `promotions` (`title`, `thumbnail`, `content`, `isRegister`, `status`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
('Khuyến mãi nạp tiền đầu tuần - Thưởng 100%', 'https://via.placeholder.com/300x200/FF6B6B/FFFFFF?text=Nap+Tien', 'Nhận thưởng 100% cho lần nạp tiền đầu tuần. Áp dụng từ thứ 2 đến chủ nhật hàng tuần. Số tiền thưởng tối đa 5.000.000 VNĐ.', 1, 'active', NOW(), NOW(), NULL),
('Hoàn tiền casino hàng ngày - 0.8%', 'https://via.placeholder.com/300x200/4ECDC4/FFFFFF?text=Hoan+Tien', 'Hoàn tiền 0.8% cho tất cả game casino. Không giới hạn số lần, tự động vào tài khoản mỗi ngày lúc 00:00.', 0, 'active', NOW(), NOW(), NULL),
('Thưởng sinh nhật đặc biệt - 500K', 'https://via.placeholder.com/300x200/FFE66D/FFFFFF?text=Sinh+Nhat', 'Nhận ngay 500.000 VNĐ trong ngày sinh nhật của bạn. Chỉ cần xác minh thông tin và hoàn thành KYC.', 1, 'active', NOW(), NOW(), NULL),
('Thưởng giới thiệu bạn bè - 200K', 'https://via.placeholder.com/300x200/A8E6CF/FFFFFF?text=Gioi+Thieu', 'Giới thiệu bạn bè đăng ký và nạp tiền lần đầu, nhận ngay 200.000 VNĐ. Không giới hạn số lượng bạn bè.', 1, 'active', NOW(), NOW(), NULL),
('Bảo hiểm thể thao hàng ngày', 'https://via.placeholder.com/300x200/FF8B94/FFFFFF?text=Bao+Hiem', 'Hoàn tiền 100% nếu thua cược thể thao trong ngày. Áp dụng cho cược đầu tiên mỗi ngày, tối đa 1.000.000 VNĐ.', 0, 'active', NOW(), NOW(), NULL),
('Khuyến mãi VIP đặc biệt', 'https://via.placeholder.com/300x200/C7CEEA/FFFFFF?text=VIP', 'Thành viên VIP nhận thưởng hàng tháng từ 1% đến 5% tổng cược. Càng cao cấp, thưởng càng lớn.', 1, 'pending', NOW(), NOW(), NULL),
('Thưởng nạp tiền cuối tuần', 'https://via.placeholder.com/300x200/B4F8C8/FFFFFF?text=Cuoi+Tuan', 'Thứ 7 và Chủ nhật: Thưởng 50% mọi lần nạp tiền. Tối thiểu 100.000 VNĐ, tối đa 2.000.000 VNĐ.', 0, 'active', NOW(), NOW(), NULL),
('Cashback thất bại - 10%', 'https://via.placeholder.com/300x200/FFEAA7/FFFFFF?text=Cashback', 'Hoàn tiền 10% tổng số tiền thua trong tuần. Tính từ thứ 2 đến chủ nhật, nhận thưởng vào thứ 2 tuần sau.', 0, 'active', NOW(), NOW(), NULL);

-- Query để lấy tất cả khuyến mãi (như yêu cầu)
-- SELECT * FROM `promotions`;

-- Query để lấy khuyến mãi đang hoạt động
-- SELECT * FROM `promotions` WHERE `status` = 'active' AND `deletedAt` IS NULL;

-- Query để lấy khuyến mãi có yêu cầu đăng ký
-- SELECT * FROM `promotions` WHERE `isRegister` = 1 AND `deletedAt` IS NULL;