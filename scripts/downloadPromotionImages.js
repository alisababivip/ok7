/**
 * Script để download hình ảnh khuyến mãi từ https://qk3x72.katawee.net/system-assets/Web.Portal/Image/Upload/Promotion
 * Chạy: node scripts/downloadPromotionImages.js
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

class PromotionImageDownloader {
  constructor() {
    this.baseUrl = 'https://qk3x72.katawee.net/system-assets/Web.Portal/Image/Upload/Promotion';
    this.downloadDir = 'public/images/promotions';
    this.imageUrls = [];
    this.downloadedImages = [];
  }

  // Tạo thư mục download nếu chưa có
  createDownloadDirectory() {
    if (!fs.existsSync(this.downloadDir)) {
      fs.mkdirSync(this.downloadDir, { recursive: true });
      console.log(`📁 Đã tạo thư mục: ${this.downloadDir}`);
    }
  }

  // Lấy danh sách hình ảnh từ server
  async fetchImageList() {
    console.log('🔍 Đang quét thư mục hình ảnh...');
    
    // Danh sách các tên file hình ảnh phổ biến trong promotions
    const commonPromotionImages = [
      'aa3520c80dc1466fbf0355c212429ec7.png',
      'faa1ec5b26414bbd8a1e43cb628f2f6d.png', 
      'cc47a6364c9c4a38a5e14e124c0bd644.png',
      'f6e2daa978414152869197c18aef148d.png',
      '85b28aa17875442b9a8ded4f6a43f32b.png',
      '2f24013da7924d4f909fe6aca8af54a6.png',
      '7a81bb872b1a46a5876cb1ae749a2335.png',
      '352ca11cce7442c9b6ac2b7882494200.png',
      'd09935ed99e34c42a811fd09e70e8bce.png',
      '6fe6d33271bc44a8ac802abf11b448f9.png',
      '9a8ea6c8ec334dc8a8c756245887dc62.png',
      '0b254c8b38934fc6b1437a50499e88fc.png',
      '0e7a6228ec9c48e78304ac01959347b9.png',
      '8b8a9abafe85482f805f82a935c22235.png',
      '4d3aa8e027c5498dbe57da2c34445e48.png',
      '69dd0575380b47dd9fc2166f9dea7944.png',
      '67fa3c1a78e54948b3f6d84734c192ea.png',
      '5d850274453f450eb6f20a295893bbfa.png',
      '44f7c58362f241ec94fbf6eccec6cdca.png',
      '51c9286313be44b89cee600087e819f0.png'
    ];

    this.imageUrls = commonPromotionImages.map(filename => ({
      filename: filename,
      url: `${this.baseUrl}/${filename}`,
      localPath: path.join(this.downloadDir, filename)
    }));

    console.log(`📋 Tìm thấy ${this.imageUrls.length} hình ảnh để download`);
    return this.imageUrls;
  }

  // Download một hình ảnh
  downloadImage(imageInfo) {
    return new Promise((resolve, reject) => {
      console.log(`⬇️  Đang download: ${imageInfo.filename}`);
      
      const options = {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
          'Referer': 'https://qk3x72.katawee.net/',
          'Accept-Language': 'vi,en-US;q=0.9,en;q=0.8'
        }
      };

      const file = fs.createWriteStream(imageInfo.localPath);
      
      https.get(imageInfo.url, options, (response) => {
        if (response.statusCode === 200) {
          response.pipe(file);
          
          file.on('finish', () => {
            file.close();
            console.log(`✅ Hoàn thành: ${imageInfo.filename}`);
            resolve({
              ...imageInfo,
              success: true,
              size: fs.statSync(imageInfo.localPath).size
            });
          });
        } else {
          console.log(`❌ Lỗi ${response.statusCode}: ${imageInfo.filename}`);
          resolve({
            ...imageInfo,
            success: false,
            error: `HTTP ${response.statusCode}`
          });
        }
      }).on('error', (error) => {
        console.error(`❌ Lỗi download ${imageInfo.filename}:`, error.message);
        resolve({
          ...imageInfo,
          success: false,
          error: error.message
        });
      });
    });
  }

  // Download tất cả hình ảnh
  async downloadAllImages() {
    console.log('🚀 Bắt đầu download hình ảnh...\n');
    
    const results = [];
    
    // Download từng hình một để tránh quá tải server
    for (const imageInfo of this.imageUrls) {
      const result = await this.downloadImage(imageInfo);
      results.push(result);
      
      if (result.success) {
        this.downloadedImages.push(result);
      }
      
      // Delay giữa các download
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    return results;
  }

  // Tạo SQL update để cập nhật URLs trong database
  generateUpdateSQL() {
    if (this.downloadedImages.length === 0) {
      return '';
    }

    const updates = this.downloadedImages.map((img, index) => {
      const localUrl = `/images/promotions/${img.filename}`;
      const id = index + 1; // Giả sử ID bắt đầu từ 1
      
      return `UPDATE promotions SET thumbnail = '${localUrl}' WHERE id = ${id};`;
    }).join('\n');

    const sql = `-- Cập nhật URLs hình ảnh trong database
-- Chạy sau khi đã download xong các hình ảnh

${updates}

-- Kiểm tra kết quả
SELECT id, title, thumbnail FROM promotions WHERE thumbnail LIKE '/images/promotions/%';`;

    return sql;
  }

  // Tạo dữ liệu promotions với hình ảnh thực
  generatePromotionData() {
    const promotionTitles = [
      'Khuyến mãi nạp tiền đầu tuần - Thưởng 100%',
      'Hoàn tiền casino hàng ngày - 0.8%', 
      'Thưởng sinh nhật đặc biệt - 500K',
      'Bảo hiểm thể thao hàng ngày',
      'Thưởng giới thiệu bạn bè - 200K',
      'Cashback slot games - 1.2%',
      'Khuyến mãi VIP đặc biệt',
      'Thưởng nạp tiền cuối tuần',
      'Lucky spin hàng ngày',
      'Hoàn tiền baccarat - 0.5%',
      'Thưởng check-in hàng ngày',
      'Bảo hiểm cược thua',
      'Thưởng thành viên mới',
      'Khuyến mãi tết đặc biệt',
      'Thưởng nạp lần đầu - 200%',
      'Hoàn tiền sportsbook',
      'Lucky draw hàng tuần',
      'Thưởng loyalty points',
      'Bảo hiểm rút tiền',
      'Khuyến mãi hot nhất tháng'
    ];

    const promotions = this.downloadedImages.map((img, index) => {
      const title = promotionTitles[index] || `Khuyến mãi đặc biệt ${index + 1}`;
      const localUrl = `/images/promotions/${img.filename}`;
      
      return {
        id: index + 1,
        title: title,
        thumbnail: localUrl,
        content: `${title}. Tham gia ngay để nhận ưu đãi hấp dẫn! Áp dụng cho tất cả thành viên.`,
        isRegister: Math.random() > 0.5,
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        deletedAt: null
      };
    });

    return promotions;
  }

  // Lưu kết quả
  saveResults(downloadResults, promotionData, updateSQL) {
    // Lưu kết quả download
    fs.writeFileSync('download_results.json', JSON.stringify(downloadResults, null, 2));
    console.log('💾 Đã lưu kết quả download: download_results.json');

    // Lưu dữ liệu promotions với hình ảnh thực
    fs.writeFileSync('promotions_with_real_images.json', JSON.stringify(promotionData, null, 2));
    console.log('💾 Đã lưu dữ liệu promotions: promotions_with_real_images.json');

    // Lưu SQL update
    if (updateSQL) {
      fs.writeFileSync('update_promotion_images.sql', updateSQL);
      console.log('💾 Đã lưu SQL update: update_promotion_images.sql');
    }

    // Tạo SQL insert với hình ảnh thực
    const insertSQL = this.generateInsertSQL(promotionData);
    fs.writeFileSync('promotions_insert_with_images.sql', insertSQL);
    console.log('💾 Đã lưu SQL insert: promotions_insert_with_images.sql');
  }

  // Tạo SQL insert
  generateInsertSQL(promotions) {
    const values = promotions.map(promo => {
      const title = promo.title.replace(/'/g, "''");
      const content = promo.content.replace(/'/g, "''");
      
      return `  ('${title}', '${promo.thumbnail}', '${content}', ${promo.isRegister}, '${promo.status}', NOW(), NOW(), NULL)`;
    }).join(',\n');

    return `-- SQL Insert với hình ảnh thực từ server
DELETE FROM promotions WHERE id > 0; -- Xóa dữ liệu cũ

INSERT INTO promotions (title, thumbnail, content, isRegister, status, createdAt, updatedAt, deletedAt) VALUES
${values};

-- Kiểm tra kết quả
SELECT COUNT(*) as total_promotions FROM promotions;
SELECT id, title, thumbnail FROM promotions LIMIT 5;`;
  }

  // Tạo curl commands
  generateCurlCommands() {
    const commands = this.imageUrls.map(img => {
      return `curl -L -o "${img.localPath}" \\
  -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" \\
  -H "Accept: image/webp,image/apng,image/*,*/*;q=0.8" \\
  -H "Referer: https://qk3x72.katawee.net/" \\
  "${img.url}"`;
    }).join('\n\n');

    const curlScript = `#!/bin/bash
# Script curl để download tất cả hình ảnh khuyến mãi
# Chạy: bash download_images.sh

echo "🚀 Bắt đầu download hình ảnh khuyến mãi..."
mkdir -p ${this.downloadDir}

${commands}

echo "✅ Hoàn thành download!"
echo "📂 Hình ảnh đã được lưu trong: ${this.downloadDir}"`;

    fs.writeFileSync('download_images.sh', curlScript);
    fs.chmodSync('download_images.sh', '755');
    console.log('💾 Đã tạo bash script: download_images.sh');

    return curlScript;
  }

  // Hàm chính
  async run() {
    console.log('🎯 Download hình ảnh khuyến mãi từ server');
    console.log('==========================================\n');

    try {
      // Tạo thư mục
      this.createDownloadDirectory();

      // Lấy danh sách hình ảnh
      await this.fetchImageList();

      // Tạo curl commands
      this.generateCurlCommands();

      // Download hình ảnh
      const downloadResults = await this.downloadAllImages();

      // Tạo dữ liệu với hình ảnh thực
      const promotionData = this.generatePromotionData();

      // Tạo SQL update
      const updateSQL = this.generateUpdateSQL();

      // Lưu kết quả
      this.saveResults(downloadResults, promotionData, updateSQL);

      // Thống kê
      const successful = downloadResults.filter(r => r.success).length;
      const failed = downloadResults.filter(r => !r.success).length;

      console.log('\n📊 Thống kê download:');
      console.log(`✅ Thành công: ${successful}/${this.imageUrls.length}`);
      console.log(`❌ Thất bại: ${failed}/${this.imageUrls.length}`);

      if (successful > 0) {
        console.log('\n🎯 Files đã tạo:');
        console.log('1. download_results.json - Kết quả chi tiết');
        console.log('2. promotions_with_real_images.json - Dữ liệu promotions');
        console.log('3. update_promotion_images.sql - SQL update URLs');
        console.log('4. promotions_insert_with_images.sql - SQL insert hoàn chỉnh');
        console.log('5. download_images.sh - Bash script curl');
        console.log(`6. ${this.downloadDir}/ - Thư mục chứa hình ảnh`);

        console.log('\n🚀 Bước tiếp theo:');
        console.log('1. Kiểm tra hình ảnh trong thư mục public/images/promotions/');
        console.log('2. Chạy SQL để cập nhật database');
        console.log('3. Test giao diện admin với hình ảnh mới');
      }

    } catch (error) {
      console.error('❌ Lỗi:', error.message);
    }
  }
}

// Chạy script
const downloader = new PromotionImageDownloader();
downloader.run();