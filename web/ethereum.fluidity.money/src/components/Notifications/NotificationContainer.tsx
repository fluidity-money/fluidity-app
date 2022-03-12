import {useState} from "react"
import {notificationContext} from "./notificationContext";
import PopupNotification from "./PopupNotification"

// generate a pseudorandom hex ID 
// allows notifications to be indexed by keys (not array position, which is unreliable, or message, allowing duplicate messages)
const generateNotificationId = () => Math.random().toString(16).slice(2);

interface Notification {
    id: string,
    message: string,
    type: 'Error' | 'Check' | 'Static'
}

// a container displaying the current queue of user-facing notification messages
const NotificationContainer = ({children}: {children?: React.ReactNode}) => {
    // queue of notifications
    const [notifications, setNotifications] = useState<Array<Notification>>([]);
    // queue of static notifications that sit below and are manually cleared by their owning elements (by ID)
    const [staticNotifications, setStaticNotifications] = useState<Array<Notification>>([]);
    // queue of notifications to remove - holds entries for a short time to allow the fadeout animation to play
    const [removalQueue, setRemovalQueue] = useState<{[id: string]: boolean}>({});

    // atomically add a new error to the queue
    const addError = (message: string) => {
        const id = generateNotificationId();
        setNotifications(notifications => [...notifications, {message, id, type: 'Error'}]);
    }

    // atomically add a new static notification
    const addStaticNotification = (message: string) => {
        const id = generateNotificationId();
        setStaticNotifications(s => [...s, {message, id, type: 'Static'}]);
        const remove = () => removeNotification(id, true);
        return remove;
    }

    // atomically add a new notification to the queue
    const addNotification = (message: string) => {
        const id = generateNotificationId();
        setNotifications(notifications => [...notifications, {message, id, type: 'Check'}]);
    }

    // atomically remove an notification from the queue
    const removeNotification = (id: string, isStatic = false) => {
        // add to the removal queue, triggering the animation
        setRemovalQueue(removalQueue => {
            return {...removalQueue, [id]: true}
        });
        
        // after 400ms, atomically clear from the removal queue and the main notification queue
        setTimeout(() => {
            if (isStatic)
                setStaticNotifications(notifications =>
                    notifications.filter(notification => notification.id !== id)
                )
            else setNotifications(notifications =>
                notifications.filter(notification => notification.id !== id)
            )
            setRemovalQueue(removalQueue => {
                const {[id]: _removedNotification, ...rest} = removalQueue;
                return rest;
            });
        }, 400);
    }

    return <notificationContext.Provider value={{notifications, addError, addNotification, addStaticNotification}}>
        <div className="error-container">
            {[...staticNotifications, ...notifications].map(notification =>
                // wrap in divs with stable keys (id), so that subsequent elements don't re-render their entry animations on removal
                <div key={notification.id}>
                    <PopupNotification
                        // enabled if not in the removal queue
                        isEnabled={!removalQueue[notification?.id]}
                        remove={() => removeNotification(notification.id)}
                        message={notification.message}
                        type={notification.type}
                    />
                </div>
            )}
        </div>
        {children}
    </notificationContext.Provider>
}

export default NotificationContainer;
