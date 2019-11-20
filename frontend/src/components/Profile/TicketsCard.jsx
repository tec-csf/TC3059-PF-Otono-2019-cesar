import React, { PureComponent } from 'react'
import {
    ButtonPrimary,
    ButtonOutline
} from '../Button/Button'

class TicketsCard extends PureComponent {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <div className={`cm-card -white -no-cursor ${this.props.customClasses}`}>
                <p className="title mb-30">Tickets</p>

                <p className="subtitle">#231 Datos de acceso</p>
                <p className="mb-0">Ultima actualización</p>
                <p>31/07/2019</p>

                <p className="mt-30 subtitle">#232 Activas de Twitter</p>
                <p className="mb-0">Ultima actualización</p>
                <p>22/08/2019</p>

                <ButtonPrimary customClass="mt-30" title="Agregar"></ButtonPrimary>
            </div>
        )
    }
}

export default TicketsCard