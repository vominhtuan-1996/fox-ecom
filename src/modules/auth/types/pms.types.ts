export interface PmsUserModel {
  id?: string;
  email?: string;
  employeeCode?: string;
  userName?: string;
  role?: string;
  token?: string;
  branchId?: number;
  branchName?: string;
}

export interface PmsLoginRequest {
  userName: string;
  password: string;
}

export interface PmsTokenLoginRequest {
  code: string;
}
