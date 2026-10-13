import { useState } from 'react';
import { OrderItem } from '@gdx/shared-types';
import { INITIAL_ORDERS } from '../data/mockData';

export function useOrder() {
  const [orders, setOrders] = useState<OrderItem[]>(INITIAL_ORDERS);

  const addOrder = (order: OrderItem) => {
    setOrders((prev) => [order, ...prev]);
  };

  return {
    orders,
    addOrder,
  };
}
