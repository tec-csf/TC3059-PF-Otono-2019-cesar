import React, { PureComponent } from 'react'
import {
    ButtonPrimary,
    ButtonOutline
} from '../Button/Button'

class PackageCard extends PureComponent {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <div className={`cm-card -white -no-cursor ${this.props.customClasses}`}>
                <p className="title mb-30">Tipo de paquete</p>
                <p className="subtitle">Empresarial</p>
                <p className="subtitle">Mensual</p>                

                <div className="date">
                    <p className="mb-0">Fecha de Contratación</p>
                    <p>23 de julio de 2019</p>
                </div>
                <div className="date">
                    <p className="mb-0">Fecha de Vencimiento</p>
                    <p>23 de julio de 2019</p>
                </div>
                <div className="date">
                    <p className="mb-0">Fecha de Renovación</p>
                    <p>23 de julio de 2019</p>
                </div>
                <div className="date">
                    <p className="mb-0">Fecha de Corte</p>
                    <p>23 de julio de 2019</p>
                </div>
                {/* <ButtonPrimary customClass="mt-30" title="Actualizar"></ButtonPrimary> */}
            </div>
        );
    }
}

export default PackageCard