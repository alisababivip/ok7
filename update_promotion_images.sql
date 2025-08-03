-- Cập nhật URLs hình ảnh trong database
-- Chạy sau khi đã download xong các hình ảnh

UPDATE promotions SET thumbnail = '/images/promotions/aa3520c80dc1466fbf0355c212429ec7.png' WHERE id = 1;
UPDATE promotions SET thumbnail = '/images/promotions/faa1ec5b26414bbd8a1e43cb628f2f6d.png' WHERE id = 2;
UPDATE promotions SET thumbnail = '/images/promotions/cc47a6364c9c4a38a5e14e124c0bd644.png' WHERE id = 3;
UPDATE promotions SET thumbnail = '/images/promotions/f6e2daa978414152869197c18aef148d.png' WHERE id = 4;
UPDATE promotions SET thumbnail = '/images/promotions/85b28aa17875442b9a8ded4f6a43f32b.png' WHERE id = 5;
UPDATE promotions SET thumbnail = '/images/promotions/2f24013da7924d4f909fe6aca8af54a6.png' WHERE id = 6;
UPDATE promotions SET thumbnail = '/images/promotions/7a81bb872b1a46a5876cb1ae749a2335.png' WHERE id = 7;
UPDATE promotions SET thumbnail = '/images/promotions/352ca11cce7442c9b6ac2b7882494200.png' WHERE id = 8;
UPDATE promotions SET thumbnail = '/images/promotions/d09935ed99e34c42a811fd09e70e8bce.png' WHERE id = 9;
UPDATE promotions SET thumbnail = '/images/promotions/6fe6d33271bc44a8ac802abf11b448f9.png' WHERE id = 10;
UPDATE promotions SET thumbnail = '/images/promotions/9a8ea6c8ec334dc8a8c756245887dc62.png' WHERE id = 11;
UPDATE promotions SET thumbnail = '/images/promotions/0b254c8b38934fc6b1437a50499e88fc.png' WHERE id = 12;
UPDATE promotions SET thumbnail = '/images/promotions/0e7a6228ec9c48e78304ac01959347b9.png' WHERE id = 13;
UPDATE promotions SET thumbnail = '/images/promotions/8b8a9abafe85482f805f82a935c22235.png' WHERE id = 14;
UPDATE promotions SET thumbnail = '/images/promotions/4d3aa8e027c5498dbe57da2c34445e48.png' WHERE id = 15;
UPDATE promotions SET thumbnail = '/images/promotions/69dd0575380b47dd9fc2166f9dea7944.png' WHERE id = 16;
UPDATE promotions SET thumbnail = '/images/promotions/67fa3c1a78e54948b3f6d84734c192ea.png' WHERE id = 17;
UPDATE promotions SET thumbnail = '/images/promotions/5d850274453f450eb6f20a295893bbfa.png' WHERE id = 18;
UPDATE promotions SET thumbnail = '/images/promotions/44f7c58362f241ec94fbf6eccec6cdca.png' WHERE id = 19;
UPDATE promotions SET thumbnail = '/images/promotions/51c9286313be44b89cee600087e819f0.png' WHERE id = 20;

-- Kiểm tra kết quả
SELECT id, title, thumbnail FROM promotions WHERE thumbnail LIKE '/images/promotions/%';