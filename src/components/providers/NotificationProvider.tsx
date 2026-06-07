'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'

export type NotificationType = 'success' | 'error' | 'info' | 'warning'

export interface Notification {
  id: string
  message: string
  type: NotificationType
  duration?: number
}

interface NotificationContextProps {
  showNotification: (message: string, type?: NotificationType, duration?: number) => void
  notifications: Notification[]
  removeNotification: (id: string) => void
}

const NotificationContext = createContext<NotificationContextProps | undefined>(undefined)

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }, [])

  const showNotification = useCallback(
    (message: string, type: NotificationType = 'info', duration = 4000) => {
      const id = Math.random().toString(36).substring(2, 9)
      setNotifications((prev) => [{ id, message, type, duration }, ...prev])

      setTimeout(() => {
        removeNotification(id)
      }, duration)
    },
    [removeNotification]
  )

  return (
    <NotificationContext.Provider value={{ showNotification, notifications, removeNotification }}>
      {children}
      <NotificationList />
    </NotificationContext.Provider>
  )
}

export function useNotification() {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider')
  }
  return context
}

function NotificationList() {
  const { notifications, removeNotification } = useNotification()

  return (
    <div className="fixed top-20 right-5 z-55 flex flex-col gap-3 w-full max-w-sm pointer-events-none px-4 sm:px-0 left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0">
      {notifications.map((n) => (
        <div
          key={n.id}
          className={`pointer-events-auto flex items-start justify-between gap-3 px-4 py-3.5 rounded-2xl border backdrop-blur-xl shadow-xl transition-all duration-300 animate-fade-down ${
            n.type === 'success'
              ? 'bg-emerald-950/90 border-emerald-500/20 text-emerald-100'
              : n.type === 'error'
              ? 'bg-red-950/90 border-red-500/20 text-red-100'
              : n.type === 'warning'
              ? 'bg-amber-950/90 border-amber-500/20 text-amber-100'
              : 'bg-gray-900/90 border-white/10 text-white'
          }`}
        >
          <div className="flex gap-2.5 min-w-0">
            {/* SVG Icons for each type */}
            {n.type === 'success' && (
              <svg className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            {n.type === 'error' && (
              <svg className="w-5 h-5 text-red-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            {n.type === 'warning' && (
              <svg className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            )}
            {n.type === 'info' && (
              <svg className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            <p className="text-sm font-medium leading-tight min-w-0 break-words">{n.message}</p>
          </div>
          <button
            onClick={() => removeNotification(n.id)}
            className="text-gray-400 hover:text-white transition-colors p-0.5 rounded-lg hover:bg-white/5 shrink-0 ml-1"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  )
}
