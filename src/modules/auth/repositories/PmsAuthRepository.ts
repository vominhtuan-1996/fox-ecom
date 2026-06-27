import { ApiClient } from '../../../data/network/api_client/ApiClient';
import { ApiException } from '../../../data/network/api_client/ApiException';
import { SdkStrings } from '../../../common/language';
import { PmsUserModel, PmsLoginRequest, PmsTokenLoginRequest } from '../types/pms.types';

const BASE = 'pms/api/m/v1/users';

class PmsAuthRepository {
  private get client() {
    return ApiClient.instance;
  }

  // POST pms/api/m/v1/users/loginInternal
  async loginWithCredentials(req: PmsLoginRequest): Promise<PmsUserModel> {
    const data = await this.client.post<any>(`${BASE}/loginInternal`, req);
    return data?.data ?? data;
  }

  // POST pms/api/m/v1/users/login (token SOP)
  async loginWithToken(req: PmsTokenLoginRequest): Promise<PmsUserModel> {
    const data = await this.client.post<any>(`${BASE}/login`, req);
    return data?.data ?? data;
  }

  // GET pms/api/m/v1/users/menu
  async getPermissions(token: string): Promise<string[]> {
    const data = await this.client.get<any>(`${BASE}/menu`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return this._collectCodes(data?.data ?? []);
  }

  private _collectCodes(items: any[]): string[] {
    const codes: string[] = [];
    const recurse = (nodes: any[]) => {
      for (const node of nodes) {
        if (node?.code) codes.push(node.code);
        if (Array.isArray(node?.childrens)) recurse(node.childrens);
      }
    };
    recurse(items);
    return codes;
  }
}

export const pmsAuthRepository = new PmsAuthRepository();
