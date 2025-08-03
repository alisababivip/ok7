export interface Promotion {
  id: number;
  title: string;
  thumbnail: string;
  content: string;
  isRegister: boolean;
  status: 'active' | 'inactive' | 'pending';
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

export interface PromotionResponse {
  data: Promotion[];
  total: number;
  page: number;
  limit: number;
}

export interface CreatePromotionDto {
  title: string;
  thumbnail: string;
  content: string;
  isRegister: boolean;
  status: 'active' | 'inactive' | 'pending';
}

export interface UpdatePromotionDto extends Partial<CreatePromotionDto> {
  id: number;
}