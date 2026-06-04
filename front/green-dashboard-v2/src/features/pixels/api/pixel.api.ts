import { api } from '@/shared/lib/axios';
import { ApiResponse } from '@/shared/types/api';
import type { CreatePixelDTO, Pixel, UpdatePixelDTO } from '../types';

class PixelService {
  async getPixels(): Promise<Pixel[]> {
    const response = await api.get<ApiResponse<Pixel[]>>('/store/pixels', {
      withCredentials: true,
    });
    if (!response.data?.data) throw new Error('Invalid pixels response');
    return response.data.data;
  }

  async createPixel(data: CreatePixelDTO): Promise<Pixel> {
    const response = await api.post<ApiResponse<Pixel>>('/store/pixels', data, {
      withCredentials: true,
    });
    if (!response.data?.data) throw new Error('Invalid create pixel response');
    return response.data.data;
  }

  async updatePixel(id: string, data: UpdatePixelDTO): Promise<Pixel> {
    const response = await api.put<ApiResponse<Pixel>>(`/store/pixels/${id}`, data, {
      withCredentials: true,
    });
    if (!response.data?.data) throw new Error('Invalid update pixel response');
    return response.data.data;
  }

  async deletePixel(id: string): Promise<void> {
    await api.delete(`/store/pixels/${id}`, { withCredentials: true });
  }
}

export const pixelService = new PixelService();
