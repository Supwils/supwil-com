interface Notification {
  show: boolean;
  message: string;
  type: 'success' | 'error';
}

interface NotificationToastProps {
  notification: Notification;
}

const NotificationToast = ({ notification }: NotificationToastProps) => {
  if (!notification.show) return null;

  return (
    <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg z-[1000] min-w-[250px] text-center font-medium text-sm md:text-base transition-all duration-300 animate-in fade-in slide-in-from-top-2 ${
      notification.type === 'success'
        ? 'bg-green-500 text-white'
        : 'bg-red-500 text-white'
    }`}>
      {notification.message}
    </div>
  );
};

export default NotificationToast;

