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

    this.client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      reconnectDelay: 5000,
      onConnect: () => {
        console.log('Connected to WebSockets');
        
        if (this.client) {
          this.client.subscribe('/topic/telemetry', (message) => {
            if (this.onTelemetryCallback) {
              const data = JSON.parse(message.body);
              const summary: DashboardSummary = {
                currentPower: data.currentPowerDraw,
                dailyUsage: data.dailyUsageKwh,
                monthlyUsage: data.monthlyUsageKwh,
                estimatedBill: data.estimatedBill,
                activeDevices: data.activeDevices,
                totalDevices: data.totalDevices
              };
              this.onTelemetryCallback(summary);
            }
          });

          this.client.subscribe('/topic/alerts', (message) => {
            if (this.onAlertCallback) {
              const data = JSON.parse(message.body);
              const alert: Alert = {
                id: data.id.toString(),
                type: data.type.toLowerCase() === 'critical' ? 'critical' : data.type.toLowerCase() === 'warning' ? 'warning' : 'info',
                message: data.message,
                timestamp: data.createdAt,
                read: data.read,
                deviceId: data.deviceName
              };
              this.onAlertCallback(alert);
            }
          });
        }
      },
      onStompError: (frame) => {
        console.error('Broker reported error: ' + frame.headers['message']);
        console.error('Additional details: ' + frame.body);
      },
    });

    this.client.activate();
  }

  disconnect() {
    if (this.client) {
      this.client.deactivate();
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
