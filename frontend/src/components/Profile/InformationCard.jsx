import React, { PureComponent } from 'react'
import {
    ButtonPrimary,
    ButtonOutline
} from '../Button/Button'
class InformationCard extends PureComponent {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <div className={`cm-card -white -no-cursor ${this.props.customClasses}`} >
                <p className="title mb-30">Datos de contacto</p>                
                <p className=" mb-0">Nombre de Empresa</p>
                <p>{this.props.comp_name}</p>
                <p className=" mb-0">Nombre</p>
                <p>{this.props.user_name} {this.props.user_lastname}</p>
                <p className=" mb-0">Dirección</p>
                <p className="mb-0">{this.props.city} {this.props.country}</p>
                <p className="mb-0">{this.props.street} {this.props.ex_num}</p>
                <p>C.P. {this.props.post_code}</p>                
                <p className=" mb-0">Razón Social</p>
                <p>{this.props.r_z}</p>
                <p className=" mb-0">Dirección de Facturación</p>
                <p className="mb-0">{this.props.city} {this.props.country}</p>
                <p className="mb-0">{this.props.street} {this.props.ex_num}</p>
                <p>C.P. {this.props.post_code}</p>
                {/* <ButtonPrimary customClass="mt-30" title="Actualizar"></ButtonPrimary> */}
            </div>
        );
    }
}

export default InformationCard