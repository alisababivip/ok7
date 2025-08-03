# Hướng Dẫn Hệ Thống Quản Lý Khuyến Mãi

## 📋 Tổng Quan
Hệ thống quản lý khuyến mãi được tích hợp vào ứng dụng với khả năng:
- Lấy dữ liệu từ website https://789be89.com/Promotion
- Quản lý khuyến mãi với CRUD đầy đủ
- Database schema chuẩn theo yêu cầu
- Giao diện quản trị thân thiện

## 🗃️ Database Schema
```sql
SELECT * FROM `promotions`
- id: int(11) AUTO_INCREMENT
- title: varchar(255) - Tiêu đề khuyến mãi
- thumbnail: text - URL hình ảnh
- content: text - Nội dung chi tiết
- isRegister: tinyint(1) - Yêu cầu đăng ký (0/1)
- status: enum('active','inactive','pending') - Trạng thái
- createdAt: timestamp - Ngày tạo
- updatedAt: timestamp - Ngày cập nhật
- deletedAt: timestamp - Ngày xóa (soft delete)
```

## 🚀 Cài Đặt

### 1. Tạo Database
```bash
# Chạy SQL script để tạo bảng và dữ liệu mẫu
mysql -u username -p database_name < database/create_promotions_table.sql
```

### 2. Cấu Hình API Endpoints
Các API endpoints đã được tạo sẵn trong `src/api/services/promotion.service.ts`:
- GET `/api/promotions` - Lấy danh sách khuyến mãi
- GET `/api/promotions/:id` - Lấy chi tiết khuyến mãi
- POST `/api/promotions` - Tạo khuyến mãi mới
- PUT `/api/promotions/:id` - Cập nhật khuyến mãi
- DELETE `/api/promotions/:id` - Xóa khuyến mãi
- GET `/api/promotions/active` - Lấy khuyến mãi đang hoạt động
- POST `/api/promotions/sync-external` - Đồng bộ từ website bên ngoài

### 3. Sử Dụng Component
```tsx
import PromotionManager from "@/components/PromotionManager";

// Trong component của bạn
<PromotionManager />
```

## 📊 Lấy Dữ Liệu Từ Website

### Phương pháp 1: Script Node.js
```bash
# Chạy script tự động
node scripts/fetchPromotions.js

# Kết quả sẽ tạo ra:
# - promotions_raw.html: HTML gốc
# - promotions_extracted.json: Dữ liệu đã extract
# - promotions_data.json: Dữ liệu đã format
# - promotions_insert.sql: SQL để insert
```

### Phương pháp 2: Browser Console
1. Mở https://789be89.com/Promotion trong browser
2. Nhấn F12 → Console tab
3. Chạy script:
```javascript
const promotions = Array.from(document.querySelectorAll('[data-promotion], .promotion-item')).map(el => ({
  title: el.querySelector('.title, h2, h3')?.textContent?.trim(),
  thumbnail: el.querySelector('img')?.src,
  content: el.querySelector('.content, .description, p')?.textContent?.trim(),
  isRegister: el.dataset.requireRegister === 'true',
  status: 'active'
}));

console.log(JSON.stringify(promotions, null, 2));
```

### Phương pháp 3: Postman/cURL
```bash
curl -X GET "https://789be89.com/Promotion" \
  -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" \
  -H "Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
```

### Phương pháp 4: Python Script
```python
import requests
from bs4 import BeautifulSoup

response = requests.get("https://789be89.com/Promotion")
soup = BeautifulSoup(response.content, 'html.parser')

# Tìm các element chứa thông tin khuyến mãi
promotions = soup.find_all('div', class_='promotion-item')
```

## 🎯 Sử Dụng Giao Diện

### Trang Quản Lý: `/admin/promotions`
1. **Thêm khuyến mãi**: Click nút "Thêm khuyến mãi"
2. **Chỉnh sửa**: Click icon pencil ở cột "Thao tác"
3. **Xóa**: Click icon trash ở cột "Thao tác"
4. **Đồng bộ**: Click "Đồng bộ từ 789be89.com"
5. **Hướng dẫn**: Click "Hướng dẫn Scraping"
6. **Dữ liệu mẫu**: Click "Tạo dữ liệu mẫu"

### Tích Hợp Vào Trang Khuyến Mãi Hiện Tại
```tsx
// Thay thế dataTagPromotion bằng API call
import promotionService from "@/api/services/promotion.service";

// Trong component
useEffect(() => {
  const fetchPromotions = async () => {
    const response = await promotionService.getActivePromotions();
    setPromotions(response);
  };
  fetchPromotions();
}, []);
```

## 🔧 Tùy Chỉnh

### Thêm Trường Mới
1. Cập nhật database schema
2. Sửa interface trong `src/interface/promotion.interface.ts`
3. Cập nhật form trong `src/components/PromotionManager/index.tsx`
4. Cập nhật API service

### Thay Đổi Logic Scraping
Chỉnh sửa file `src/utils/promotionScraper.ts`:
- `transformToPromotionFormat()`: Format dữ liệu
- `generateInsertSQL()`: Tạo SQL
- `getScrapingInstructions()`: Hướng dẫn

## 📁 Cấu Trúc Files Đã Tạo

```
src/
├── interface/
│   └── promotion.interface.ts          # TypeScript interfaces
├── api/
│   └── services/
│       └── promotion.service.ts        # API service layer
├── utils/
│   └── promotionScraper.ts            # Scraping utilities
├── components/
│   └── PromotionManager/
│       └── index.tsx                  # Admin component
└── app/
    └── admin/
        └── promotions/
            └── page.tsx               # Admin page

scripts/
└── fetchPromotions.js                 # Node.js scraping script

database/
└── create_promotions_table.sql        # Database schema
```

## 🚨 Lưu Ý Quan Trọng

### Bảo Mật
- Website có thể chặn request từ script
- Sử dụng User-Agent giống browser thật
- Có thể cần VPN/proxy nếu bị chặn IP

### Performance
- Cache kết quả scraping
- Không scrape quá thường xuyên
- Sử dụng pagination cho danh sách lớn

### Legal
- Tuân thủ robots.txt của website
- Không gây quá tải server
- Chỉ lấy dữ liệu công khai

## 🆘 Troubleshooting

### Lỗi CORS khi gọi API
```javascript
// Thêm vào next.config.js
async headers() {
  return [
    {
      source: '/api/:path*',
      headers: [
        { key: 'Access-Control-Allow-Origin', value: '*' },
        { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE' },
      ],
    },
  ];
}
```

### Script bị chặn
1. Thử với User-Agent khác
2. Sử dụng proxy/VPN
3. Thêm delay giữa các request
4. Scrape thủ công qua browser

### Database connection
1. Kiểm tra thông tin kết nối
2. Đảm bảo MySQL đang chạy
3. Tạo database trước khi chạy script

## 📞 Hỗ Trợ

Nếu gặp vấn đề, kiểm tra:
1. Console browser để xem lỗi JavaScript
2. Network tab để xem API calls
3. Server logs để xem lỗi backend
4. Database logs để xem lỗi SQL

Hệ thống đã sẵn sàng sử dụng! 🎉