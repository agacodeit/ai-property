import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Property, PropertyHttpResponse } from '../../shared/models/property/property';
import { lastValueFrom, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { PropertyCommodity } from '../../shared/models/property/propertyCommodity';

@Injectable({
  providedIn: 'root'
})
export class PropertyService {

  private propertyListData: Array<Property> | null = null;
  private commodityListData: Array<PropertyCommodity> = [];

  get commodityList() {
    return this.commodityListData;
  }

  get propertyList() {
    return this.propertyListData;
  }

  constructor(private http: HttpClient) { }

  async createProperty(property: Property): Promise<PropertyHttpResponse> {
    try {
      await lastValueFrom(
        this.http.post(`${environment.url}/secure/property/create`, property)
      );
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error
      };
    }
  }

  async listProperties(): Promise<PropertyHttpResponse> {
    try {
      const response = await lastValueFrom(
        this.http.get<Array<Property>>(`${environment.url}/secure/property/listAll`)
      );
      this.propertyListData = response;
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error
      };
    }
  }

  async deleteProperty(propertyId: string): Promise<PropertyHttpResponse> {
    try {
      await lastValueFrom(this.http.delete(`${environment.url}/secure/property/delete/${propertyId}`));
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error
      };
    }
  }

  async updateProperty(property: Property): Promise<PropertyHttpResponse> {
    try {
      await lastValueFrom(
        this.http.put(`${environment.url}/secure/property/update/${property.id}`, property)
      );
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error
      };
    }
  }

  clearPropertyList() {
    this.propertyListData = null;
  }


  patchFormValues(formGroup: FormGroup, data: any): void {
    Object.keys(data).forEach(key => {
      let value = data[key];
      const control = formGroup.get(key);

      if (!control) return;

      if (control instanceof FormGroup && value && typeof value === 'object' && !Array.isArray(value)) {
        this.patchFormValues(control, value);

      } else if (control instanceof FormArray) {
        if (!Array.isArray(value)) {
          value = [];
        }
        control.clear();
        value.forEach((val: any) => {
          control.push(new FormControl(val));
        });

      } else {
        control.setValue(value ?? '');
      }
    });
  }

  async listCommodities(): Promise<any> {
    try {
      const response = await lastValueFrom(
        this.http.get<Array<PropertyCommodity>>(`${environment.url}/secure/commodities/listAll`)
      );
      this.commodityListData = response;
    } catch (error) { }
  }

}

