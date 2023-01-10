import React from "react";
import axios from "axios";
import Content from "../template/Content";
import { useParams } from "react-router";
import { baseApiUrl, showError, showSuccess } from "../../config/global";
import TimePicker from "react-bootstrap-time-picker";
import { useNavigate } from "react-router-dom";

const initState = {
  center: {
    address: "",
    country: "",
    email: "",
    name: "",
    phone_primary: "",
    phone_secondary: "",
    postal_code: "",
    region: "",
    website_url: "",
    closure: 84600,
    opening: 0, 
  },
  valid_name:"",
  valid_endereco:"",
  valid_postal:"",
  valid_city:"",
  valid_pais:"",
 
  id: null,
};

class CenterForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { ...initState };
    this.updateOpening = this.updateOpening.bind(this);
    this.updateClosure = this.updateClosure.bind(this);
    this.updateName = this.updateName.bind(this);
    this.updateEndereco = this.updateEndereco.bind(this);
    this.updatePostal = this.updatePostal.bind(this);
    this.updateCity = this.updateCity.bind(this);
    this.updatePais = this.updatePais.bind(this);
  }
  componentDidMount() {
    const id = this.props.params.id;
    if (id) {
      this.setState({ id:id });
      this.loadCenter(id);
    }
  }
  loadCenter(id) {
    const url = `${baseApiUrl}/center/${id}`;
    axios
      .get(url)
      .then((res) => this.setState({ center: res.data }))
      .catch(showError);
  }
  saveCenter(event) {
    event.preventDefault();
    const center = this.state.center;
    delete center.status
    delete center.total_accounts
    delete center.total_rooms
    const method = this.state.id ? "put" : "post";
    const url = this.state.id ? `${baseApiUrl}/center/${this.state.id}` : `${baseApiUrl}/center`;
    console.log(url)
    axios[method](url, center)
      .then((res) => {
        showSuccess("Centro registado com sucesso");
        this.state.id
          ? this.props.navigate(`/center-data/${this.state.id}`)
          : this.props.navigate(`/center-table`);
      })
      .catch(showError);
  }
  updateFields(event) {
    const center = this.state.center;
    center[event.target.name] = event.target.value;
    this.setState({ center });
  }
  updateOpening(time) {
    const center = this.state.center;
    center.opening = time;
    this.setState({ center });
  }
  updateClosure(time) {
    const center = this.state.center;
    center.closure = time;
    this.setState({ center });
  }
  clearForm(event) {
    console.log("passei aqui")
    this.setState({ center: initState.center });
  }
  cancel(event) {
    this.state.id
      ? this.props.navigate(`/center-data/${this.state.id}`)
      : this.props.navigate(`/center-table`);
  }
  updateName(name){
    const center = this.state.center;
    center.name = name.target.value;
    this.setState({ center });
    this.state.center.name ? this.setState({valid_name: 'is-valid'}) : this.setState({valid_name: 'is-invalid'})
  }
  updateEndereco(endereco){
    const center = this.state.center;
    center.address = endereco.target.value;
    this.setState({ center });
    this.state.center.address ? this.setState({valid_endereco: 'is-valid'}) : this.setState({valid_endereco: 'is-invalid'})
  }
  updatePostal(postal){
    const center = this.state.center;
    center.postal_code = postal.target.value;
    this.setState({ center });
    this.state.center.postal_code ? this.setState({valid_postal: 'is-valid'}) : this.setState({valid_postal: 'is-invalid'})
  }
  updateCity(city){
    const center = this.state.center;
    center.region = city.target.value;
    this.setState({ center });
    this.state.center.region ? this.setState({valid_city: 'is-valid'}) : this.setState({valid_city: 'is-invalid'})
  }
  updatePais(pais){
    const center = this.state.center;
    center.country = pais.target.value;
    this.setState({ center });
    this.state.center.country ? this.setState({valid_pais: 'is-valid'}) : this.setState({valid_pais: 'is-invalid'})
  }
  renderForm() {
    return (
      <form className="row g-3 needs-validation" novalidate>
        <div className="col-md-6 mb-3">
          <div className="form-floating">
            <input
              name="name"
              value={this.state.center.name}
              onChange={this.updateName}
              type="text"
              className={`form-control ${this.state.valid_name}`}
              placeholder="Centro Geográfico de Viseu"
              id="validationTooltip01"
              />
              <div class="invalid-tooltip">
                Campo invalido
            </div>
            <label for="validationTooltip01">Nome do Centro Geográfico</label>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="form-floating">
            <TimePicker
              value={this.state.center.opening}
              onChange={this.updateOpening}
              className="form-select"
              aria-label="Floating label select example"
              format={24}
            />
            <label>Abertura</label>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="form-floating">
            <TimePicker
              value={this.state.center.closure}
              onChange={this.updateClosure}
              className="form-select"
              aria-label="Floating label select example"
              format={24}
            />
            <label>Encerramento</label>
          </div>
        </div>
        <div className="col-12 mb-3">
          <div className="form-floating">
            <input
              name="address"
              value={this.state.center.address}
              onChange={this.updateEndereco}
              type="address"
              className={`form-control ${this.state.valid_endereco}`}
              placeholder="1234 Main St"
              id="validationTooltip01"
            />
            <div class="invalid-tooltip">
                Campo invalido
            </div>
            <label className="validationTooltip01">Endereço</label>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="form-floating">
            <input
              type="text"
              className={`form-control ${this.state.valid_postal}`}
              name="postal_code"
              value={this.state.center.postal_code}
              onChange={this.updatePostal}
              placeholder="0000-000"
              id="validationTooltip01"
            />
            <div class="invalid-tooltip">
                Campo invalido
            </div>
            <label className="validationTooltip01">Código Postal</label>
          </div>
        </div>
        <div className="col-md-5 mb-3">
          <div className="form-floating">
            <input
              type="text"
              className={`form-control ${this.state.valid_city}`}
              name="region"
              value={this.state.center.region}
              onChange={this.updateCity}
              placeholder="Viseu"
              id="validationTooltip01"
            />
            <div class="invalid-tooltip">
                Campo invalido
            </div>
            <label className="validationTooltip01">Cidade</label>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="form-floating">
            <input
              type="text"
              className={`form-control ${this.state.valid_pais}`}
              name="country"
              value={this.state.center.country}
              onChange={this.updatePais}
              placeholder="Portugal"
              id="validationTooltip01"
            />
            <div class="invalid-tooltip">
                Campo invalido
            </div>
            <label className="validationTooltip01">País</label>
          </div>
        </div>
        <div className="col-6 mb-3">
          <div className="form-floating">
            <input
              type="tel"
              className="form-control"
              name="phone_primary"
              value={this.state.center.phone_primary}
              onChange={(event) => this.updateFields(event)}
              placeholder="999999999"
            />
            <label className="form-label">Telefone 1</label>
          </div>
        </div>
        <div className="col-6 mb-3">
          <div className="form-floating">
            <input
              type="tel"
              className="form-control"
              name="phone_secondary"
              value={this.state.center.phone_secondary}
              onChange={(event) => this.updateFields(event)}
              placeholder="999999999"
            />
            <label className="form-label">Telefone 2</label>
          </div>
        </div>
        <div className="col-6 mb-3">
          <div className="form-floating">
            <input
              type="email"
              name="email"
              value={this.state.center.email}
              onChange={(event) => this.updateFields(event)}
              className="form-control"
              placeholder="email@example.com"
            />
            <label className="form-label">E-mail</label>
          </div>
        </div>
        <div className="col-6 mb-3">
          <div className="form-floating">
            <input
              type="url"
              name="website_url"
              value={this.state.center.website_url}
              onChange={(event) => this.updateFields(event)}
              className="form-control"
              placeholder="http://www.example.com"
            />
            <label className="form-label">Website</label>
          </div>
        </div>
        <div className="col-12 mb-3">
          <button
            className="btn btn-dark"
            onClick={(event) => this.saveCenter(event)}
          >
            Guardar
          </button>
          <button
            className="btn btn-dark ms-2"
            onClick={(event) => this.cancel(event)}
          >
            Cancelar
          </button>
        </div>
      </form>
    );
  }
  render() {
    return <Content>{this.renderForm()}</Content>;
  }
}

export default function Center(props) {
  let params = useParams();
  let navigate = useNavigate();
  return <CenterForm {...props} params={params} navigate={navigate} />;
}
