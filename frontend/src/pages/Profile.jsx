import React, { PureComponent } from 'react'
import Navbarmenu from '../components/Navbarmenu/Navbarmenu'
import Sidenav from '../components/Sidenav/Sidenav'
import InformationCard from '../components/Profile/InformationCard'
import PackageCard from '../components/Profile/PackageCard'
// import TicketsCard from '../components/Profile/TicketsCard'
import axios from 'axios'
import jwtDecode from 'jwt-decode'

const API_URL = process.env.REACT_APP_API_URL

class Profile extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            user_name: '',
            user_lastname: '',
            email: '',
            phone: '',
            comp_name: '',
            r_z: '',
            pers_type: '',
            RFC: '',
            country: '',
            city: '',
            region: '',
            street: '',
            ex_num: '',
            int_num: '',
            post_code: ''
        }
    }

    componentDidMount = () => {
        let user_id = jwtDecode(localStorage.getItem("id_token")).sub

        axios.get(API_URL + "/api/v1/search/percentages", {
            params: {
                user_id: user_id
            }
        }).then((res) => {
            
            this.setState({
                user_name: res.data.user_name,
                user_lastname: res.data.user_lastname,
                email: res.data.email,
                phone: res.data.phone,
                comp_name: res.data.comp_name,
                r_z: res.data.r_z,
                pers_type: res.data.pers_type,
                RFC: res.data.RFC,
                country: res.data.country,
                city: res.data.city,
                region: res.data.region,
                street: res.data.street,
                ex_num: res.data.ex_num,
                int_num: res.data.int_num,
                post_code: res.data.post_code
            })
        });
    }

    render() {
        
        return(
            <div>
                <Navbarmenu {...this.props}></Navbarmenu>
                <div className="container p-0">
                    <Sidenav />
                    <div className="container">
                        <div className="row">
                            <div className="col-12 col-lg-6">
                                <h4 className="title my-30">Ajustes de cuenta</h4>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12 col-lg-4">
                                <InformationCard 
                                    customClasses="mt-30"
                                    comp_name={this.state.comp_name}
                                    user_name={this.state.user_name}
                                    user_lastname={this.state.user_lastname}
                                    country={this.state.country}
                                    city={this.state.city}
                                    region={this.state.region}
                                    street={this.state.street}
                                    ex_num={this.state.ex_num}
                                    int_num={this.state.int_num}
                                    post_code={this.state.post_code}
                                    r_z={this.state.r_z}
                            />
                            </div>
                            <div className="col-12 col-lg-4">
                                <PackageCard customClasses="mt-30" />
                            </div>
                            {/* <div className="col-12 col-lg-4">
                                <TicketsCard customClasses="mt-30" />
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Profile