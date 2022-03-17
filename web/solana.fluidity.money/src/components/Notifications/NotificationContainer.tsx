import {useState} from "react"
import {notificationContext} from "./notificationContext";
import PopupNotification from "./PopupNotification"

// generate a pseudorandom hex ID 
// allows notifications to be indexed by keys (not array position, which is unreliable, or message, allowing duplicate messages)
const generateNotificationId = () => Math.random().toString(16).slice(2);

interface Notification {
    id: string,
    message: string,
    type: 'Error' | 'Check'
}

// a container displaying the current queue of user-facing notification messages
const NotificationContainer = ({children}: {children?: React.ReactNode}) => {
    // queue of notifications
    const [notifications, setNotifications] = useState<Array<Notification>>([]);
    // queue of notifications to remove - holds entries for a short time to allow the fadeout animation to play
    const [removalQueue, setRemovalQueue] = useState<{[id: string]: boolean}>({});

    // atomically add a new error to the queue
    const addError = (message: string) => {
        const id = generateNotificationId();
        setNotifications(notifications => [...notifications, {message, id, type: 'Error'}]);
    }

    // atomically add a new notification to the queue
    const addNotification = (message: string) => {
        const id = generateNotificationId();
        setNotifications(notifications => [...notifications, {message, id, type: 'Check'}]);
    }

    // atomically remove an notification from the queue
    const removeNotification = (id: string) => {
        // add to the removal queue, triggering the animation
        setRemovalQueue(removalQueue => ({
            ...removalQueue,
            [id]: true
        }));
        
        // after 400ms, atomically clear from the removal queue and the main notification queue
        setTimeout(() => {
            setNotifications(notifications =>
                notifications.filter(notification => notification.id !== id)
            )
            setRemovalQueue(removalQueue => {
                const {[id]: _removedNotification, ...rest} = removalQueue;
                return rest;
            });
        }, 400);
    }

    return <notificationContext.Provider value={{notifications, addError, addNotification}}>
        <div className="error-container">
        {notifications.map(err =>
            // wrap in divs with stable keys (id), so that subsequent elements don't re-render their entry animations on removal
            <div key={err.id}>
                <PopupNotification
                    // enabled if not in the removal queue
                    isEnabled={!removalQueue[err?.id]}
                    remove={() => removeNotification(err.id)}
                    message={err.message}
                    type={err.type}
                />
            </div>
            )}
        </div>
        {children}
    </notificationContext.Provider>
}

export default NotificationContainer;
