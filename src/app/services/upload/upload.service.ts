import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PropertyHttpResponse, PropertyImage } from '../../shared/models/property/property';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor(private http: HttpClient) { }

  async uploadFile(file: File): Promise<PropertyHttpResponse> {
    try {
      const formData = new FormData();
      formData.append('arquivo', file);
      const response = await lastValueFrom(this.http.post<any>(`${environment.url}/bucket/upload`, formData))
      return { success: true, content: response };
    } catch (error) {
      return {
        success: false,
        error: error
      };
    }
  }

}
