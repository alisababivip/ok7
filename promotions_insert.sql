-- SQL Insert statements cho promotions table
INSERT INTO promotions (title, thumbnail, content, isRegister, status, createdAt, updatedAt, deletedAt) VALUES
  ('Khuyến mãi nạp tiền đầu tuần - Thưởng 100%', 'https://via.placeholder.com/300x200', 'Nhận thưởng 100% cho lần nạp tiền đầu tuần. Áp dụng từ thứ 2 đến chủ nhật hàng tuần.', true, 'active', NOW(), NOW(), NULL),
  ('Hoàn tiền casino hàng ngày - 0.8%', 'https://via.placeholder.com/300x200', 'Hoàn tiền 0.8% cho tất cả game casino. Không giới hạn số lần, tự động vào tài khoản.', false, 'active', NOW(), NOW(), NULL);