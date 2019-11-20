import React, {Component} from 'react'
import NotificationsRow from './NotificationsRow'

class NotificationsCard extends Component {
    
    render() {
        return (
            <div className="notifications-card">
                <p className="title">Notificaciones</p>
                <NotificationsRow/>
                <NotificationsRow/>
            </div>
        );
    }
}

export default NotificationsCard
