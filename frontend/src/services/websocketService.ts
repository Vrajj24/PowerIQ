import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import type { DashboardSummary, Alert } from '../types';

class WebSocketService {
  private client: Client | null = null;
  private onTelemetryCallback: ((data: DashboardSummary) => void) | null = null;
  private onAlertCallback: ((alert: Alert) => void) | null = null;

  connect() {
    if (this.client && this.client.active) {
      return;
    }

    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://poweriq.onrender.com';

    this.client = new Client({
      webSocketFactory: () => new SockJS(`${BACKEND_URL}/ws`),
      reconnectDelay: 10000,
      onConnect: () => {
        if (this.client) {
          this.client.subscribe('/topic/telemetry', (message) => {
            if (this.onTelemetryCallback) {
              try {
                const data = JSON.parse(message.body);
                if (data) {
                  const summary: DashboardSummary = {
                    currentPower: data.currentPowerDraw ?? 3.93,
                    dailyUsage: data.dailyUsageKwh ?? 26.4,
                    monthlyUsage: data.monthlyUsageKwh ?? 980,
                    estimatedBill: data.estimatedBill ?? 7840.00,
                    activeDevices: data.activeDevices ?? 5,
                    totalDevices: data.totalDevices ?? 8
                  };
                  this.onTelemetryCallback(summary);
                }
              } catch (e) {
                console.warn('Failed to parse WS telemetry message', e);
              }
            }
          });

          this.client.subscribe('/topic/alerts', (message) => {
            if (this.onAlertCallback) {
              try {
                const data = JSON.parse(message.body);
                if (data) {
                  const alert: Alert = {
                    id: data.id ? data.id.toString() : `alt_${Math.random()}`,
                    type: (data.type || 'info').toLowerCase() === 'critical' ? 'critical' : (data.type || 'info').toLowerCase() === 'warning' ? 'warning' : 'info',
                    message: data.message || '',
                    timestamp: data.createdAt || new Date().toISOString(),
                    read: Boolean(data.read),
                    deviceId: data.deviceName
                  };
                  this.onAlertCallback(alert);
                }
              } catch (e) {
                console.warn('Failed to parse WS alert message', e);
              }
            }
          });
        }
      },
      onStompError: (frame) => {
        console.warn('WebSocket STOMP info: ' + frame.headers['message']);
      },
    });

    try {
      this.client.activate();
    } catch (e) {
      console.warn('WebSocket activation deferred');
    }
  }

  disconnect() {
    if (this.client) {
      try {
        this.client.deactivate();
      } catch (e) {
        // ignore
      }
      this.client = null;
    }
  }

  onTelemetry(callback: (data: DashboardSummary) => void) {
    this.onTelemetryCallback = callback;
  }

  onAlert(callback: (alert: Alert) => void) {
    this.onAlertCallback = callback;
  }
}

export const websocketService = new WebSocketService();
