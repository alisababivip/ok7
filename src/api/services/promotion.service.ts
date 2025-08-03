import apiClient from "../apiClient";
import { Promotion, PromotionResponse, CreatePromotionDto, UpdatePromotionDto } from "../../interface/promotion.interface";

class PromotionService {
  private baseUrl = "/promotions";

  // Get all promotions with pagination
  async getPromotions(page: number = 1, limit: number = 10): Promise<PromotionResponse> {
    return apiClient.get<PromotionResponse>({
      url: `${this.baseUrl}?page=${page}&limit=${limit}`,
    });
  }

  // Get promotion by ID
  async getPromotionById(id: number): Promise<Promotion> {
    return apiClient.get<Promotion>({
      url: `${this.baseUrl}/${id}`,
    });
  }

  // Create new promotion
  async createPromotion(data: CreatePromotionDto): Promise<Promotion> {
    return apiClient.post<Promotion>({
      url: this.baseUrl,
      data,
    });
  }

  // Update promotion
  async updatePromotion(data: UpdatePromotionDto): Promise<Promotion> {
    return apiClient.put<Promotion>({
      url: `${this.baseUrl}/${data.id}`,
      data,
    });
  }

  // Delete promotion (soft delete)
  async deletePromotion(id: number): Promise<void> {
    return apiClient.delete<void>({
      url: `${this.baseUrl}/${id}`,
    });
  }

  // Get active promotions only
  async getActivePromotions(): Promise<Promotion[]> {
    return apiClient.get<Promotion[]>({
      url: `${this.baseUrl}/active`,
    });
  }

  // Fetch promotions from external source (789be89.com)
  async fetchExternalPromotions(): Promise<Promotion[]> {
    return apiClient.get<Promotion[]>({
      url: `${this.baseUrl}/fetch-external`,
    });
  }

  // Sync promotions from external source
  async syncExternalPromotions(): Promise<{ success: boolean; count: number }> {
    return apiClient.post<{ success: boolean; count: number }>({
      url: `${this.baseUrl}/sync-external`,
    });
  }
}

export default new PromotionService();