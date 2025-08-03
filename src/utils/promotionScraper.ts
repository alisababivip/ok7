import { Promotion } from "../interface/promotion.interface";

/**
 * Utility để lấy dữ liệu khuyến mãi từ website 789be89.com
 * Do hạn chế bảo mật, không thể trực tiếp truy cập website từ browser
 * Cần sử dụng server-side hoặc tool bên ngoài
 */

export interface ScrapedPromotionData {
  title: string;
  thumbnail: string;
  content: string;
  isRegister: boolean;
  status: 'active' | 'inactive' | 'pending';
}

export class PromotionScraper {
  private readonly targetUrl = 'https://789be89.com/Promotion';

  /**
   * Chuyển đổi dữ liệu scraped thành format database
   */
  public transformToPromotionFormat(scrapedData: ScrapedPromotionData[]): Omit<Promotion, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>[] {
    return scrapedData.map(data => ({
      title: data.title,
      thumbnail: data.thumbnail,
      content: data.content,
      isRegister: data.isRegister,
      status: data.status
    }));
  }

  /**
   * Tạo SQL INSERT statement từ dữ liệu khuyến mãi
   */
  public generateInsertSQL(promotions: ScrapedPromotionData[]): string {
    const values = promotions.map(promo => {
      const title = promo.title.replace(/'/g, "''"); // Escape single quotes
      const content = promo.content.replace(/'/g, "''");
      const thumbnail = promo.thumbnail.replace(/'/g, "''");
      
      return `('${title}', '${thumbnail}', '${content}', ${promo.isRegister}, '${promo.status}', NOW(), NOW(), NULL)`;
    }).join(',\n  ');

    return `INSERT INTO promotions (title, thumbnail, content, isRegister, status, createdAt, updatedAt, deletedAt) VALUES
  ${values};`;
  }

  /**
   * Tạo mẫu dữ liệu để test
   */
  public generateSampleData(): ScrapedPromotionData[] {
    return [
      {
        title: "Khuyến mãi nạp tiền đầu tuần",
        thumbnail: "https://example.com/promotion1.jpg",
        content: "Nhận thưởng 100% cho lần nạp tiền đầu tuần. Áp dụng từ thứ 2 đến chủ nhật.",
        isRegister: true,
        status: "active"
      },
      {
        title: "Hoàn tiền casino hàng ngày",
        thumbnail: "https://example.com/promotion2.jpg", 
        content: "Hoàn tiền 0.8% cho tất cả game casino. Không giới hạn số lần.",
        isRegister: false,
        status: "active"
      },
      {
        title: "Thưởng sinh nhật đặc biệt",
        thumbnail: "https://example.com/promotion3.jpg",
        content: "Nhận ngay 500k trong ngày sinh nhật của bạn. Chỉ cần xác minh thông tin.",
        isRegister: true,
        status: "pending"
      }
    ];
  }

  /**
   * Hướng dẫn sử dụng các công cụ scraping
   */
  public getScrapingInstructions(): string {
    return `
HƯỚNG DẪN LẤY DỮ LIỆU TỪ ${this.targetUrl}

1. SỬ DỤNG POSTMAN HOẶC CURL:
   curl -X GET "${this.targetUrl}" \\
     -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" \\
     -H "Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"

2. SỬ DỤNG PYTHON REQUESTS:
   import requests
   from bs4 import BeautifulSoup
   
   response = requests.get("${this.targetUrl}")
   soup = BeautifulSoup(response.content, 'html.parser')
   
   # Tìm các element chứa thông tin khuyến mãi
   promotions = soup.find_all('div', class_='promotion-item')

3. SỬ DỤNG PUPPETEER (Node.js):
   const puppeteer = require('puppeteer');
   
   (async () => {
     const browser = await puppeteer.launch();
     const page = await browser.newPage();
     await page.goto('${this.targetUrl}');
     
     const promotions = await page.evaluate(() => {
       // JavaScript code để extract dữ liệu
       return Array.from(document.querySelectorAll('.promotion')).map(el => ({
         title: el.querySelector('.title')?.textContent,
         thumbnail: el.querySelector('img')?.src,
         content: el.querySelector('.content')?.textContent
       }));
     });
     
     await browser.close();
     return promotions;
   })();

4. SỬ DỤNG BROWSER DEVELOPER TOOLS:
   - Mở ${this.targetUrl} trong browser
   - Nhấn F12 để mở Developer Tools
   - Chạy script trong Console tab:
   
   const promotions = Array.from(document.querySelectorAll('[data-promotion], .promotion-item')).map(el => ({
     title: el.querySelector('.title, h2, h3')?.textContent?.trim(),
     thumbnail: el.querySelector('img')?.src,
     content: el.querySelector('.content, .description, p')?.textContent?.trim(),
     isRegister: el.dataset.requireRegister === 'true',
     status: 'active'
   }));
   
   console.log(JSON.stringify(promotions, null, 2));
`;
  }
}

export default new PromotionScraper();