import { CarryUser } from '../../modules/carry/types';
import { HUBS } from '../../modules/carry/CarryService';

/** Mock user hiện tại — thay bằng auth session khi có backend */
export const CURRENT_USER: CarryUser = {
  id: 'u1',
  name: 'Nguyễn Văn A',
  dept: 'Phòng CNTT',
  avatarColor: '#284EEB',
};

export const CURRENT_USER_ID = CURRENT_USER.id;

export const DEFAULT_FROM_HUB = HUBS[0]; // HCM - Q1
export const DEFAULT_TO_HUB   = HUBS[1]; // HCM - Q7
