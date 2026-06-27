import React, { useRef, useState } from 'react';
import { Navigator } from '../navigator/Navigator';
import { NavigatorRef, ScreenProps } from '../navigator/types';
import { BoardScreen } from '../screens/carry/BoardScreen';
import { CreateScreen } from '../screens/carry/CreateScreen';
import { DetailScreen } from '../screens/carry/detail/DetailScreen';
import { ShowQrScreen } from '../screens/qr/ShowQrScreen';
import { ScanScreen } from '../screens/qr/ScanScreen';
import { RouteFilterScreen, RouteFilter } from '../screens/orders/RouteFilterScreen';
import { CarryService } from '../../modules/carry/CarryService';
import { Order } from '../../modules/carry/types';
import { CURRENT_USER } from './currentUser';

interface CarryNavigatorProps {
  currentUserId: string;
  onClose?: () => void;
  initialOrderId?: string;
}

export const CarryNavigator: React.FC<CarryNavigatorProps> = ({
  currentUserId,
  onClose,
  initialOrderId,
}) => {
  const navRef = useRef<NavigatorRef>(null);
  const [routeFilter, setRouteFilter] = useState<RouteFilter>({ myRouteOnly: false });
  const initialRoute = initialOrderId ? 'detail' : 'board';

  const routes = [
    { key: 'board',   component: null },
    { key: 'create',  component: null },
    { key: 'detail',  component: null },
    { key: 'showQr',  component: null },
    { key: 'scan',    component: null },
    { key: 'filter',  component: null },
  ];

  function resolveOrder(params: Record<string, unknown>): Order | undefined {
    const id = params.orderId as string | undefined;
    if (id) return CarryService.getOrder(id);
    // fallback: đơn đầu tiên phù hợp filter
    return CarryService.getBoard(routeFilter.fromHub?.id, routeFilter.toHub?.id)[0];
  }

  function renderScreen(key: string, sp: ScreenProps) {
    const params = sp.params ?? {};

    switch (key) {
      case 'board':
        return (
          <BoardScreen
            onBack={onClose}
            onCreateOrder={() => sp.push('create')}
            onOpenOrder={(order: Order) => sp.push('detail', { orderId: order.id })}
            onOpenFilter={() => sp.push('filter', { filter: routeFilter })}
            onQrScan={() => sp.push('scan', { orderId: '', type: 'pickup' })}
            routeFilter={routeFilter}
          />
        );

      case 'create':
        return (
          <CreateScreen
            onBack={sp.pop}
            currentUser={CURRENT_USER}
            onCreated={(orderId) => sp.replace('detail', { orderId, fromCreate: true })}
          />
        );

      case 'detail': {
        const order = resolveOrder(params);
        if (!order) return null;
        const fromCreate = params.fromCreate as boolean | undefined;

        // Xác định qrType dựa trên role: sender dùng pickup khi CLAIMED, dropoff khi DELIVERED
        const role = order.sender.id === currentUserId ? 'sender'
          : order.carrier?.id === currentUserId ? 'carrier' : 'other';
        const qrType = (role === 'sender' && order.status === 'DELIVERED') ? 'dropoff' : 'pickup';

        return (
          <DetailScreen
            order={order}
            currentUserId={currentUserId}
            onBack={fromCreate ? () => { navRef.current?.reset('board'); } : sp.pop}
            onShowQr={() => sp.push('showQr', { orderId: order.id, type: qrType })}
            onScanQr={() => sp.push('scan',   { orderId: order.id, type: qrType })}
            onClaim={() => {
              CarryService.claimOrder(order.id, CURRENT_USER);
              // refresh detail — replace với cùng orderId để re-render
              sp.replace('detail', { orderId: order.id });
            }}
            onCancel={() => {
              CarryService.updateStatus(order.id, 'CANCELLED');
              sp.replace('detail', { orderId: order.id });
            }}
            onReport={() => {
              CarryService.updateStatus(order.id, 'DISPUTED');
              sp.replace('detail', { orderId: order.id });
            }}
            onContact={(_userId) => {
              // ponytail: mở messaging app — implement sau khi có deep link
            }}
          />
        );
      }

      case 'showQr':
        return (
          <ShowQrScreen
            orderId={params.orderId as string}
            type={(params.type as 'pickup' | 'dropoff') ?? 'pickup'}
            onBack={sp.pop}
          />
        );

      case 'scan':
        return (
          <ScanScreen
            orderId={params.orderId as string}
            type={(params.type as 'pickup' | 'dropoff') ?? 'pickup'}
            onBack={sp.pop}
            onSuccess={(result) => {
              if (result === 'ok') {
                // Cập nhật trạng thái đơn sau khi scan thành công
                const orderId = params.orderId as string;
                const type    = params.type as 'pickup' | 'dropoff';
                if (type === 'pickup')  CarryService.updateStatus(orderId, 'IN_TRANSIT');
                if (type === 'dropoff') CarryService.updateStatus(orderId, 'DELIVERED');
                sp.pop();
                // navigate về detail để thấy trạng thái mới
                sp.push('detail', { orderId });
              } else {
                sp.pop();
              }
            }}
          />
        );

      case 'filter':
        return (
          <RouteFilterScreen
            initial={routeFilter}
            onApply={(filter) => {
              setRouteFilter(filter);
              sp.pop();
            }}
            onClose={sp.pop}
          />
        );

      default:
        return null;
    }
  }

  return (
    <Navigator
      ref={navRef}
      initialRoute={initialRoute}
      initialParams={initialOrderId ? { orderId: initialOrderId } : undefined}
      routes={routes}
      renderScreen={renderScreen}
      hideHeader
      pushTransition="slide"
      popTransition="slide"
    />
  );
};
