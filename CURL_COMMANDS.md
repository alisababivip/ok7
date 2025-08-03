# Hướng Dẫn Sử Dụng CURL Commands

## 🎯 Tổng Quan
Đã thành công download 20 hình ảnh khuyến mãi từ server `https://qk3x72.katawee.net/system-assets/Web.Portal/Image/Upload/Promotion/`

## 📋 Thông Tin Server
- **Base URL**: `https://qk3x72.katawee.net/system-assets/Web.Portal/Image/Upload/Promotion/`
- **Định dạng**: PNG files
- **Kích thước**: Từ 74KB đến 91KB mỗi file
- **Tổng cộng**: 20 hình ảnh khuyến mãi

## 🚀 Cách Sử Dụng

### 1. Script Node.js (Đã chạy thành công)
```bash
node scripts/downloadPromotionImages.js
```

### 2. Bash Script với CURL
```bash
# Chạy script đã tạo sẵn
bash download_images.sh
```

### 3. CURL Commands Thủ Công

#### Download một hình ảnh cụ thể:
```bash
curl -L -o "public/images/promotions/aa3520c80dc1466fbf0355c212429ec7.png" \
  -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" \
  -H "Accept: image/webp,image/apng,image/*,*/*;q=0.8" \
  -H "Referer: https://qk3x72.katawee.net/" \
  "https://qk3x72.katawee.net/system-assets/Web.Portal/Image/Upload/Promotion/aa3520c80dc1466fbf0355c212429ec7.png"
```

#### Download với kiểm tra kết quả:
```bash
curl -L -o "image.png" \
  -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" \
  -H "Accept: image/webp,image/apng,image/*,*/*;q=0.8" \
  -H "Referer: https://qk3x72.katawee.net/" \
  -w "HTTP Status: %{http_code}, Size: %{size_download} bytes, Time: %{time_total}s\n" \
  "https://qk3x72.katawee.net/system-assets/Web.Portal/Image/Upload/Promotion/aa3520c80dc1466fbf0355c212429ec7.png"
```

## 📊 Kết Quả Download

### ✅ Thành Công: 20/20 files
- `aa3520c80dc1466fbf0355c212429ec7.png` - 85KB
- `faa1ec5b26414bbd8a1e43cb628f2f6d.png` - 86KB  
- `cc47a6364c9c4a38a5e14e124c0bd644.png` - 85KB
- `f6e2daa978414152869197c18aef148d.png` - 80KB
- `85b28aa17875442b9a8ded4f6a43f32b.png` - 85KB
- `2f24013da7924d4f909fe6aca8af54a6.png` - 85KB
- `7a81bb872b1a46a5876cb1ae749a2335.png` - 91KB
- `352ca11cce7442c9b6ac2b7882494200.png` - 91KB
- `d09935ed99e34c42a811fd09e70e8bce.png` - 86KB
- `6fe6d33271bc44a8ac802abf11b448f9.png` - 80KB
- `9a8ea6c8ec334dc8a8c756245887dc62.png` - 85KB
- `0b254c8b38934fc6b1437a50499e88fc.png` - 85KB
- `0e7a6228ec9c48e78304ac01959347b9.png` - 86KB
- `8b8a9abafe85482f805f82a935c22235.png` - 91KB
- `4d3aa8e027c5498dbe57da2c34445e48.png` - 80KB
- `69dd0575380b47dd9fc2166f9dea7944.png` - 74KB
- `67fa3c1a78e54948b3f6d84734c192ea.png` - 84KB
- `5d850274453f450eb6f20a295893bbfa.png` - 80KB
- `44f7c58362f241ec94fbf6eccec6cdca.png` - 80KB
- `51c9286313be44b89cee600087e819f0.png` - 74KB

## 🗂️ Files Đã Tạo

### 1. Hình Ảnh
```
public/images/promotions/
├── aa3520c80dc1466fbf0355c212429ec7.png
├── faa1ec5b26414bbd8a1e43cb628f2f6d.png
├── cc47a6364c9c4a38a5e14e124c0bd644.png
└── ... (17 files khác)
```

### 2. Database Files
- `promotions_insert_with_images.sql` - SQL insert với URLs local
- `update_promotion_images.sql` - SQL update cho database hiện tại
- `promotions_with_real_images.json` - Dữ liệu JSON đã format

### 3. Scripts
- `download_images.sh` - Bash script với curl commands
- `scripts/downloadPromotionImages.js` - Node.js script

## 🔧 Curl Parameters Giải Thích

### Headers Quan Trọng:
```bash
-H "User-Agent: Mozilla/5.0..."     # Giả mạo browser
-H "Accept: image/webp,image/apng..." # Chấp nhận format hình ảnh
-H "Referer: https://qk3x72.katawee.net/" # Trang nguồn
```

### Flags:
- `-L` - Follow redirects
- `-o filename` - Output to file
- `-w "format"` - Write output format
- `-s` - Silent mode
- `-S` - Show errors even in silent mode

## 🚨 Lưu Ý

### Bảo Mật
- ✅ Server cho phép download (không bị chặn)
- ✅ Headers User-Agent hoạt động tốt
- ✅ Referer header được chấp nhận

### Performance
- Delay 500ms giữa các request để tránh quá tải
- Download tuần tự thay vì parallel
- File size trung bình ~83KB mỗi hình

### Legal
- ✅ Tất cả hình ảnh đều public accessible
- ✅ Không có protection mechanism
- ✅ Server response 200 OK cho tất cả requests

## 🎯 Sử Dụng Tiếp Theo

### 1. Import vào Database
```bash
mysql -u username -p database_name < promotions_insert_with_images.sql
```

### 2. Verify Images
```bash
ls -la public/images/promotions/
file public/images/promotions/*.png
```

### 3. Test trong Application
- Truy cập: `http://localhost:3010/admin/promotions`
- Kiểm tra hình ảnh hiển thị đúng
- Test responsive design

## ✅ Hoàn Thành!

Hệ thống đã sẵn sàng với:
- ✅ 20 hình ảnh khuyến mãi thực tế từ server
- ✅ Database schema hoàn chỉnh
- ✅ SQL scripts để import dữ liệu
- ✅ CURL commands có thể tái sử dụng
- ✅ Giao diện quản trị React component

🚀 **Ready to use!** 🚀