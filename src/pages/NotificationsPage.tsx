import React, { useState, useEffect } from 'react'
import { Bell, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { notificationApi } from '../lib/api'
import type { User, Notification } from '../types'

interface NotificationsPageProps {
  user: User
}

export function NotificationsPage({ user }: NotificationsPageProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadNotifications()
  }, [])

  const loadNotifications = async () => {
    try {
      setIsLoading(true)
      const data = await notificationApi.list()
      setNotifications(data.data)
    } catch (error) {
      console.error('Failed to load notifications:', error)
      toast.error('加载通知失败')
    } finally {
      setIsLoading(false)
    }
  }

  const handleMarkAsRead = async (id: number) => {
    try {
      await notificationApi.markAsRead(id)
      setNotifications(notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ))
      toast.success('已标记为已读')
    } catch (error) {
      console.error('Failed to mark as read:', error)
      toast.error('操作失败')
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await notificationApi.markAllAsRead()
      setNotifications(notifications.map((n) => ({ ...n, read: true })))
      toast.success('已标记全部为已读')
    } catch (error) {
      console.error('Failed to mark all as read:', error)
      toast.error('操作失败')
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'new_repair':
        return '🔧'
      case 'inspection_abnormal':
        return '⚠️'
      case 'repair_update':
        return '📝'
      case 'system':
        return 'ℹ️'
      default:
        return '📢'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Bell className="w-8 h-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">消息通知</h1>
        </div>
        {notifications.some((n) => !n.read) && (
          <button
            onClick={handleMarkAllAsRead}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            全部标记为已读
          </button>
        )}
      </div>

      {/* Notifications List */}
      {isLoading ? (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">加载中...</p>
          </div>
        </div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-12">
          <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">暂无通知</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`rounded-lg p-4 border transition ${
                notification.read
                  ? 'bg-white border-gray-200'
                  : 'bg-blue-50 border-blue-200'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{getNotificationIcon(notification.type)}</span>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(notification.createdAt).toLocaleString('zh-CN')}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {!notification.read && (
                    <button
                      onClick={() => handleMarkAsRead(notification.id)}
                      className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                    >
                      标记已读
                    </button>
                  )}
                  <button className="text-gray-400 hover:text-gray-600">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
