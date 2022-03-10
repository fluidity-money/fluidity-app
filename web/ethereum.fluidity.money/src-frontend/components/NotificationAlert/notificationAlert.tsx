import {useEffect, useState} from "react";
const fluidIcon = 'img/fluiditylogo.png';

export const enableNotifications = async(callback?: () => void) => {
    //check for notification support
    if (!("Notification" in window) || Notification.permission === "denied")
        return;

    //request the permission
    return Notification.requestPermission(() => {
        if(callback) callback();
    });
}

const sendNotification = async(message: string, body?: string) => {
    new Promise(() => enableNotifications(() => {Promise.resolve()}));
    const permission = Notification.permission;


    console.log(Notification.requestPermission());

    //if they accepted, send the notification
    if (permission === "granted") {
        new Notification(message, {body, icon: fluidIcon});
    }
}

export const EnabledButton = ({children, enabled}: {children: React.CElement<string, any>; enabled: boolean}) => {
    if(enabled && children) {
        return children
    }
    return <></>
}

const NotificationAlert = ({active, enable, setEnable, message}: {active: boolean, enable: boolean, setEnable: () => void, message: string;}) => {
    useEffect(() => {
        // After 4 seconds, auto-dismiss
        if(enable) {
            sendNotification("Fluidity", message)
            setTimeout(() => {
                setEnable();
            }, 4000);
        }
    }, [enable]);

    return <></>;
}

export default NotificationAlert;
