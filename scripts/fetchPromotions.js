/**
 * Script để lấy dữ liệu khuyến mãi từ https://789be89.com/Promotion
 * Chạy: node scripts/fetchPromotions.js
 */

const https = require('https');
const fs = require('fs');

// Hàm để fetch dữ liệu từ URL
function fetchPromotions() {
  const url = 'https://789be89.com/Promotion';
  
  console.log('🚀 Đang lấy dữ liệu từ:', url);
  
  const options = {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'vi,en-US;q=0.9,en;q=0.8',
      'Accept-Encoding': 'gzip, deflate, br',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1'
    }
  };

  https.get(url, options, (response) => {
    let data = '';

    // Nhận dữ liệu
    response.on('data', (chunk) => {
      data += chunk;
    });

    // Khi nhận xong dữ liệu
    response.on('end', () => {
      console.log('✅ Lấy dữ liệu thành công!');
      console.log('📄 Độ dài HTML:', data.length, 'ký tự');
      
      // Lưu HTML vào file để phân tích
      fs.writeFileSync('promotions_raw.html', data, 'utf8');
      console.log('💾 Đã lưu HTML vào file: promotions_raw.html');
      
      // Phân tích dữ liệu
      analyzePromotions(data);
    });

  }).on('error', (error) => {
    console.error('❌ Lỗi khi lấy dữ liệu:', error.message);
    console.log('\n🔧 Các cách khắc phục:');
    console.log('1. Kiểm tra kết nối internet');
    console.log('2. Website có thể chặn request từ script');
    console.log('3. Thử sử dụng VPN hoặc proxy');
    console.log('4. Sử dụng browser để lấy dữ liệu thủ công');
  });
}

// Hàm phân tích HTML và extract thông tin khuyến mãi
function analyzePromotions(html) {
  console.log('\n🔍 Đang phân tích dữ liệu...');
  
  // Tìm các pattern có thể chứa thông tin khuyến mãi
  const patterns = [
    /<title[^>]*>(.*?)<\/title>/gi,
    /<h[1-6][^>]*>(.*?)<\/h[1-6]>/gi,
    /<img[^>]*src="([^"]*)"[^>]*>/gi,
    /<div[^>]*class="[^"]*promotion[^"]*"[^>]*>(.*?)<\/div>/gi,
    /<div[^>]*class="[^"]*banner[^"]*"[^>]*>(.*?)<\/div>/gi,
    /<div[^>]*class="[^"]*offer[^"]*"[^>]*>(.*?)<\/div>/gi,
    /<p[^>]*>(.*?)<\/p>/gi
  ];

  const extractedData = {
    title: '',
    images: [],
    headings: [],
    promotionDivs: [],
    paragraphs: []
  };

  // Extract title
  const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i);
  if (titleMatch) {
    extractedData.title = titleMatch[1].trim();
  }

  // Extract images
  const imgMatches = html.match(/<img[^>]*src="([^"]*)"[^>]*>/gi);
  if (imgMatches) {
    imgMatches.forEach(img => {
      const srcMatch = img.match(/src="([^"]*)"/);
      if (srcMatch) {
        extractedData.images.push(srcMatch[1]);
      }
    });
  }

  // Extract headings
  const headingMatches = html.match(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/gi);
  if (headingMatches) {
    headingMatches.forEach(heading => {
      const textMatch = heading.match(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/i);
      if (textMatch) {
        extractedData.headings.push(textMatch[1].replace(/<[^>]*>/g, '').trim());
      }
    });
  }

  // Tạo dữ liệu mẫu dựa trên thông tin extract được
  const promotions = generatePromotionData(extractedData);
  
  // Tạo SQL insert statements
  const sqlStatements = generateSQL(promotions);
  
  // Lưu kết quả
  saveResults(extractedData, promotions, sqlStatements);
}

// Tạo dữ liệu khuyến mãi từ thông tin extract được
function generatePromotionData(extractedData) {
  const promotions = [];
  let id = 1;

  // Sử dụng headings làm title cho promotions
  extractedData.headings.forEach((heading, index) => {
    if (heading && heading.length > 10) { // Chỉ lấy heading có độ dài hợp lý
      const promotion = {
        id: id++,
        title: heading,
        thumbnail: extractedData.images[index % extractedData.images.length] || 'https://via.placeholder.com/300x200',
        content: `Khuyến mãi đặc biệt: ${heading}. Tham gia ngay để nhận ưu đãi hấp dẫn!`,
        isRegister: Math.random() > 0.5, // Random boolean
        status: ['active', 'pending', 'inactive'][Math.floor(Math.random() * 3)],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        deletedAt: null
      };
      promotions.push(promotion);
    }
  });

  // Nếu không có heading, tạo dữ liệu mẫu
  if (promotions.length === 0) {
    const samplePromotions = [
      {
        id: 1,
        title: "Khuyến mãi nạp tiền đầu tuần - Thưởng 100%",
        thumbnail: extractedData.images[0] || "https://via.placeholder.com/300x200",
        content: "Nhận thưởng 100% cho lần nạp tiền đầu tuần. Áp dụng từ thứ 2 đến chủ nhật hàng tuần.",
        isRegister: true,
        status: "active",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        deletedAt: null
      },
      {
        id: 2,
        title: "Hoàn tiền casino hàng ngày - 0.8%",
        thumbnail: extractedData.images[1] || "https://via.placeholder.com/300x200",
        content: "Hoàn tiền 0.8% cho tất cả game casino. Không giới hạn số lần, tự động vào tài khoản.",
        isRegister: false,
        status: "active",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        deletedAt: null
      }
    ];
    promotions.push(...samplePromotions);
  }

  return promotions;
}

// Tạo SQL insert statements
function generateSQL(promotions) {
  const values = promotions.map(promo => {
    const title = promo.title.replace(/'/g, "''");
    const content = promo.content.replace(/'/g, "''");
    const thumbnail = promo.thumbnail.replace(/'/g, "''");
    
    return `  ('${title}', '${thumbnail}', '${content}', ${promo.isRegister}, '${promo.status}', NOW(), NOW(), NULL)`;
  }).join(',\n');

  return `-- SQL Insert statements cho promotions table
INSERT INTO promotions (title, thumbnail, content, isRegister, status, createdAt, updatedAt, deletedAt) VALUES
${values};`;
}

// Lưu kết quả vào files
function saveResults(extractedData, promotions, sqlStatements) {
  // Lưu dữ liệu extract
  fs.writeFileSync('promotions_extracted.json', JSON.stringify(extractedData, null, 2), 'utf8');
  console.log('💾 Đã lưu dữ liệu extract: promotions_extracted.json');
  
  // Lưu dữ liệu promotions
  fs.writeFileSync('promotions_data.json', JSON.stringify(promotions, null, 2), 'utf8');
  console.log('💾 Đã lưu dữ liệu promotions: promotions_data.json');
  
  // Lưu SQL statements
  fs.writeFileSync('promotions_insert.sql', sqlStatements, 'utf8');
  console.log('💾 Đã lưu SQL statements: promotions_insert.sql');
  
  console.log('\n📊 Kết quả:');
  console.log('- Title trang:', extractedData.title);
  console.log('- Số lượng images:', extractedData.images.length);
  console.log('- Số lượng headings:', extractedData.headings.length);
  console.log('- Số lượng promotions tạo được:', promotions.length);
  
  console.log('\n🎯 Các file đã tạo:');
  console.log('1. promotions_raw.html - HTML gốc từ website');
  console.log('2. promotions_extracted.json - Dữ liệu đã extract');
  console.log('3. promotions_data.json - Dữ liệu promotions đã format');
  console.log('4. promotions_insert.sql - SQL để insert vào database');
  
  console.log('\n🚀 Bước tiếp theo:');
  console.log('1. Kiểm tra file promotions_insert.sql');
  console.log('2. Chạy SQL trong database để insert dữ liệu');
  console.log('3. Cập nhật API endpoints để sử dụng dữ liệu thực');
}

// Chạy script
console.log('🎯 Script lấy dữ liệu khuyến mãi từ 789be89.com');
console.log('===============================================');
fetchPromotions();