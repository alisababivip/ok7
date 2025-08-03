-- SQL Insert với hình ảnh thực từ server
DELETE FROM promotions WHERE id > 0; -- Xóa dữ liệu cũ

INSERT INTO promotions (title, thumbnail, content, isRegister, status, createdAt, updatedAt, deletedAt) VALUES
  ('Khuyến mãi nạp tiền đầu tuần - Thưởng 100%', '/images/promotions/aa3520c80dc1466fbf0355c212429ec7.png', 'Khuyến mãi nạp tiền đầu tuần - Thưởng 100%. Tham gia ngay để nhận ưu đãi hấp dẫn! Áp dụng cho tất cả thành viên.', true, 'active', NOW(), NOW(), NULL),
  ('Hoàn tiền casino hàng ngày - 0.8%', '/images/promotions/faa1ec5b26414bbd8a1e43cb628f2f6d.png', 'Hoàn tiền casino hàng ngày - 0.8%. Tham gia ngay để nhận ưu đãi hấp dẫn! Áp dụng cho tất cả thành viên.', true, 'active', NOW(), NOW(), NULL),
  ('Thưởng sinh nhật đặc biệt - 500K', '/images/promotions/cc47a6364c9c4a38a5e14e124c0bd644.png', 'Thưởng sinh nhật đặc biệt - 500K. Tham gia ngay để nhận ưu đãi hấp dẫn! Áp dụng cho tất cả thành viên.', true, 'active', NOW(), NOW(), NULL),
  ('Bảo hiểm thể thao hàng ngày', '/images/promotions/f6e2daa978414152869197c18aef148d.png', 'Bảo hiểm thể thao hàng ngày. Tham gia ngay để nhận ưu đãi hấp dẫn! Áp dụng cho tất cả thành viên.', false, 'active', NOW(), NOW(), NULL),
  ('Thưởng giới thiệu bạn bè - 200K', '/images/promotions/85b28aa17875442b9a8ded4f6a43f32b.png', 'Thưởng giới thiệu bạn bè - 200K. Tham gia ngay để nhận ưu đãi hấp dẫn! Áp dụng cho tất cả thành viên.', false, 'active', NOW(), NOW(), NULL),
  ('Cashback slot games - 1.2%', '/images/promotions/2f24013da7924d4f909fe6aca8af54a6.png', 'Cashback slot games - 1.2%. Tham gia ngay để nhận ưu đãi hấp dẫn! Áp dụng cho tất cả thành viên.', true, 'active', NOW(), NOW(), NULL),
  ('Khuyến mãi VIP đặc biệt', '/images/promotions/7a81bb872b1a46a5876cb1ae749a2335.png', 'Khuyến mãi VIP đặc biệt. Tham gia ngay để nhận ưu đãi hấp dẫn! Áp dụng cho tất cả thành viên.', false, 'active', NOW(), NOW(), NULL),
  ('Thưởng nạp tiền cuối tuần', '/images/promotions/352ca11cce7442c9b6ac2b7882494200.png', 'Thưởng nạp tiền cuối tuần. Tham gia ngay để nhận ưu đãi hấp dẫn! Áp dụng cho tất cả thành viên.', true, 'active', NOW(), NOW(), NULL),
  ('Lucky spin hàng ngày', '/images/promotions/d09935ed99e34c42a811fd09e70e8bce.png', 'Lucky spin hàng ngày. Tham gia ngay để nhận ưu đãi hấp dẫn! Áp dụng cho tất cả thành viên.', false, 'active', NOW(), NOW(), NULL),
  ('Hoàn tiền baccarat - 0.5%', '/images/promotions/6fe6d33271bc44a8ac802abf11b448f9.png', 'Hoàn tiền baccarat - 0.5%. Tham gia ngay để nhận ưu đãi hấp dẫn! Áp dụng cho tất cả thành viên.', true, 'active', NOW(), NOW(), NULL),
  ('Thưởng check-in hàng ngày', '/images/promotions/9a8ea6c8ec334dc8a8c756245887dc62.png', 'Thưởng check-in hàng ngày. Tham gia ngay để nhận ưu đãi hấp dẫn! Áp dụng cho tất cả thành viên.', true, 'active', NOW(), NOW(), NULL),
  ('Bảo hiểm cược thua', '/images/promotions/0b254c8b38934fc6b1437a50499e88fc.png', 'Bảo hiểm cược thua. Tham gia ngay để nhận ưu đãi hấp dẫn! Áp dụng cho tất cả thành viên.', true, 'active', NOW(), NOW(), NULL),
  ('Thưởng thành viên mới', '/images/promotions/0e7a6228ec9c48e78304ac01959347b9.png', 'Thưởng thành viên mới. Tham gia ngay để nhận ưu đãi hấp dẫn! Áp dụng cho tất cả thành viên.', false, 'active', NOW(), NOW(), NULL),
  ('Khuyến mãi tết đặc biệt', '/images/promotions/8b8a9abafe85482f805f82a935c22235.png', 'Khuyến mãi tết đặc biệt. Tham gia ngay để nhận ưu đãi hấp dẫn! Áp dụng cho tất cả thành viên.', false, 'active', NOW(), NOW(), NULL),
  ('Thưởng nạp lần đầu - 200%', '/images/promotions/4d3aa8e027c5498dbe57da2c34445e48.png', 'Thưởng nạp lần đầu - 200%. Tham gia ngay để nhận ưu đãi hấp dẫn! Áp dụng cho tất cả thành viên.', true, 'active', NOW(), NOW(), NULL),
  ('Hoàn tiền sportsbook', '/images/promotions/69dd0575380b47dd9fc2166f9dea7944.png', 'Hoàn tiền sportsbook. Tham gia ngay để nhận ưu đãi hấp dẫn! Áp dụng cho tất cả thành viên.', true, 'active', NOW(), NOW(), NULL),
  ('Lucky draw hàng tuần', '/images/promotions/67fa3c1a78e54948b3f6d84734c192ea.png', 'Lucky draw hàng tuần. Tham gia ngay để nhận ưu đãi hấp dẫn! Áp dụng cho tất cả thành viên.', false, 'active', NOW(), NOW(), NULL),
  ('Thưởng loyalty points', '/images/promotions/5d850274453f450eb6f20a295893bbfa.png', 'Thưởng loyalty points. Tham gia ngay để nhận ưu đãi hấp dẫn! Áp dụng cho tất cả thành viên.', false, 'active', NOW(), NOW(), NULL),
  ('Bảo hiểm rút tiền', '/images/promotions/44f7c58362f241ec94fbf6eccec6cdca.png', 'Bảo hiểm rút tiền. Tham gia ngay để nhận ưu đãi hấp dẫn! Áp dụng cho tất cả thành viên.', true, 'active', NOW(), NOW(), NULL),
  ('Khuyến mãi hot nhất tháng', '/images/promotions/51c9286313be44b89cee600087e819f0.png', 'Khuyến mãi hot nhất tháng. Tham gia ngay để nhận ưu đãi hấp dẫn! Áp dụng cho tất cả thành viên.', false, 'active', NOW(), NOW(), NULL);

-- Kiểm tra kết quả
SELECT COUNT(*) as total_promotions FROM promotions;
SELECT id, title, thumbnail FROM promotions LIMIT 5;