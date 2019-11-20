import React, {Component} from 'react'
import {
    FaBell
} from 'react-icons/fa'

class NotificationsRow extends Component {
    
    render() {
        return(
            <div className="notification-row">
                <div className="notification-text">
                    <div className="notification-name">
                        <p className="subtitle">Pablo Macias Landa</p>
                    </div>
                    <div className="notification-date">
                        <p className="subtitle">03/08/2019</p>
                    </div>
                    <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Exercitationem cum.</p>
                </div>
                <div className="notification-bell">
                    <FaBell/>
                </div>
            </div>
        );
    }
}

export default NotificationsRow