/**
 * BHULEKH AI - Persistent Notification Management Service
 * Full lifecycle notifications triggered by genuine application events:
 * Submission, AI/OCR extraction, Stage advancements (BDO -> CO -> Collector),
 * Officer approvals/rejections, citizen correction requests, and final completions.
 */

import { UserRole } from '../types/landRecord';

export type NotificationType = 'info' | 'success' | 'alert' | 'warning';

export interface AppNotification {
  id: string;
  recipientAadhaar: string; // Citizen Aadhaar Mask or 'ALL' / Role
  recipientRole?: UserRole;
  caseId?: string;
  parcelId?: string;
  title: string;
  desc: string;
  time: string;
  createdAt: string; // ISO String
  read: boolean;
  type: NotificationType;
  actionTab?: string;
  actionParams?: Record<string, string>;
}

const NOTIFICATIONS_STORAGE_KEY = 'bhulekh_notifications_v1';

// Deterministic seed notifications for demo user Rajesh Kumar (XXXX-XXXX-9023)
const INITIAL_SEED_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-seed-1',
    recipientAadhaar: 'XXXX-XXXX-9023',
    caseId: 'CASE-2026-0125',
    title: 'Action Required: Supporting Document Requested',
    desc: 'Potential conflict detected on Khasra #125. Please upload legacy Khatiyan or succession proof for Circle Officer review.',
    time: '2 hours ago',
    createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    read: false,
    type: 'alert',
    actionTab: 'track-progress'
  },
  {
    id: 'notif-seed-2',
    recipientAadhaar: 'XXXX-XXXX-9023',
    caseId: 'CASE-2026-0341',
    title: 'BDO Verification Approved (Level 1 Passed)',
    desc: 'Block Development Officer (BDO) approved Khasra #341. Application forwarded to Circle Officer (CO) queue.',
    time: 'Yesterday',
    createdAt: new Date(Date.now() - 26 * 3600 * 1000).toISOString(),
    read: false,
    type: 'success',
    actionTab: 'track-progress'
  },
  {
    id: 'notif-seed-3',
    recipientAadhaar: 'XXXX-XXXX-9023',
    caseId: 'CASE-2026-0512',
    title: 'Circle Officer (CO) Review Sanctioned',
    desc: 'Application #CASE-2026-0512 has received CO sanction and is in the final District Collector verification stage.',
    time: '2 days ago',
    createdAt: new Date(Date.now() - 52 * 3600 * 1000).toISOString(),
    read: true,
    type: 'info',
    actionTab: 'track-progress'
  },
  {
    id: 'notif-seed-4',
    recipientAadhaar: 'XXXX-XXXX-9023',
    caseId: 'CASE-2026-0312',
    title: 'Application Completed & Certified Land Title Issued',
    desc: 'Primary document AI Direct Verification passed with 100% database match. Digital certificate is ready for download.',
    time: '3 days ago',
    createdAt: new Date(Date.now() - 76 * 3600 * 1000).toISOString(),
    read: true,
    type: 'success',
    actionTab: 'track-progress'
  },
  {
    id: 'notif-seed-5',
    recipientAadhaar: 'XXXX-XXXX-9023',
    caseId: 'CASE-2026-0689',
    title: 'Application Rejected by Circle Officer',
    desc: 'Case #CASE-2026-0689 was rejected: Mismatch in parental succession chain. You may submit a statutory appeal.',
    time: '4 days ago',
    createdAt: new Date(Date.now() - 98 * 3600 * 1000).toISOString(),
    read: false,
    type: 'alert',
    actionTab: 'track-progress'
  }
];

class NotificationService {
  private notifications: AppNotification[] = [];

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
      if (stored) {
        this.notifications = JSON.parse(stored);
      } else {
        this.notifications = INITIAL_SEED_NOTIFICATIONS;
        this.saveToStorage();
      }
    } catch (e) {
      console.warn('Could not parse notifications from localStorage, using seed data.', e);
      this.notifications = INITIAL_SEED_NOTIFICATIONS;
    }
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(this.notifications));
    } catch (e) {
      console.error('Failed to save notifications to localStorage', e);
    }
  }

  /**
   * Get all notifications applicable to a citizen or officer
   */
  public getNotificationsForUser(aadhaarMasked = 'XXXX-XXXX-9023', role?: UserRole): AppNotification[] {
    return this.notifications.filter(n => {
      if (n.recipientAadhaar === 'ALL') return true;
      if (role && role !== 'citizen' && n.recipientRole === role) return true;
      if (n.recipientAadhaar === aadhaarMasked) return true;
      return false;
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  /**
   * Get unread notification count
   */
  public getUnreadCount(aadhaarMasked = 'XXXX-XXXX-9023', role?: UserRole): number {
    return this.getNotificationsForUser(aadhaarMasked, role).filter(n => !n.read).length;
  }

  /**
   * Dispatch a new notification triggered by a real application/case event
   */
  public notify(params: {
    recipientAadhaar?: string;
    recipientRole?: UserRole;
    caseId?: string;
    parcelId?: string;
    title: string;
    desc: string;
    type: NotificationType;
    actionTab?: string;
    actionParams?: Record<string, string>;
  }): AppNotification {
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      recipientAadhaar: params.recipientAadhaar || 'XXXX-XXXX-9023',
      recipientRole: params.recipientRole,
      caseId: params.caseId,
      parcelId: params.parcelId,
      title: params.title,
      desc: params.desc,
      time: 'Just now',
      createdAt: new Date().toISOString(),
      read: false,
      type: params.type,
      actionTab: params.actionTab || 'track-progress',
      actionParams: params.actionParams
    };

    // Avoid exact duplicate events within a 5-second window
    const isDuplicate = this.notifications.some(
      n => n.caseId === params.caseId && n.title === params.title && 
      (Date.now() - new Date(n.createdAt).getTime()) < 5000
    );

    if (!isDuplicate) {
      this.notifications = [newNotif, ...this.notifications];
      this.saveToStorage();
    }

    return newNotif;
  }

  /**
   * Mark a single notification as read
   */
  public markAsRead(id: string): void {
    this.notifications = this.notifications.map(n => n.id === id ? { ...n, read: true } : n);
    this.saveToStorage();
  }

  /**
   * Mark all notifications as read for a user
   */
  public markAllAsRead(aadhaarMasked = 'XXXX-XXXX-9023', role?: UserRole): void {
    this.notifications = this.notifications.map(n => {
      if (n.recipientAadhaar === 'ALL' || n.recipientAadhaar === aadhaarMasked || (role && n.recipientRole === role)) {
        return { ...n, read: true };
      }
      return n;
    });
    this.saveToStorage();
  }

  /**
   * Delete a notification
   */
  public deleteNotification(id: string): void {
    this.notifications = this.notifications.filter(n => n.id !== id);
    this.saveToStorage();
  }

  /**
   * Clear all notifications for a user
   */
  public clearAll(aadhaarMasked = 'XXXX-XXXX-9023'): void {
    this.notifications = this.notifications.filter(n => n.recipientAadhaar !== aadhaarMasked);
    this.saveToStorage();
  }
}

export const notificationService = new NotificationService();
