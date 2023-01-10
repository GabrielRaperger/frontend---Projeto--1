import React from "react";
import axios from "axios";
import Content from "../template/Content";
import { useParams } from "react-router";
import { baseApiUrl, showError, showSuccess } from "../../config/global";
import { useNavigate } from "react-router-dom";

const initState = {
  centers: [],
  rooms: {
    name: "",
    allow_capacity: 0,
    min_time_cleaning: 0,
    max_capacity: 0,
    center_id: ""
  },
  id: null,
  valid_name: "",
  valid_CapMax: "",
  valid_CapMin: "",
  valid_TempLimp: "",
};

class CenterForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { ...initState };
    this.updateOpening = this.updateOpening.bind(this);
    this.updateClosure = this.updateClosure.bind(this);
    this.updateName = this.updateName.bind(this);
    this.updateCapMax = this.updateCapMax.bind(this);
    this.updateCapMin = this.updateCapMin.bind(this);
    this.updateTempLimp = this.updateTempLimp.bind(this);
  }
  componentDidMount() {
    const id = this.props.params.id;
    if (id) {
      this.setState({ id });
      this.loadrooms(id);
      this.loadCenter();
    }
    this.loadCenter();
  }
  loadrooms(id) {
    const url = `${baseApiUrl}/room/${id}`;
    axios
      .get(url)
      .then((res) => this.setState({ rooms: res.data }))
      .catch(showError);
  }
  loadCenter() {
    const url = `${baseApiUrl}/center`;
    axios
      .get(url)
      .then((res) => {
        const centers = res.data;
        const room = this.state.rooms;
        room.center_id = centers[0].id;
        this.setState({ rooms: room });
        this.setState({ centers });
      })
      .catch(showError);
  }
  saverooms(event) {
    event.preventDefault();
    const rooms = this.state.rooms;
    delete rooms.status;
    delete rooms.center;
    const method = this.state.id ? "put" : "post";
    const url = this.state.id
      ? `${baseApiUrl}/room/${this.state.id}`
      : `${baseApiUrl}/room`;
    axios[method](url, rooms)
      .then((res) => {
        showSuccess("Sala registada com sucesso");
        this.state.id
          ? this.props.navigate(`/room-data/${this.state.id}`)
          : this.props.navigate(`/room-table`);
      })
      .catch(showError);
  }
  updateFields(event) {
    const rooms = this.state.rooms;
    rooms[event.target.name] = event.target.value;
    this.setState({ rooms });
  }

  updateOpening(time) {
    const rooms = this.state.rooms;
    rooms.opening = time;
    this.setState({ rooms });
  }
  updateClosure(time) {
    const rooms = this.state.rooms;
    rooms.allow_capacity = time;
    this.setState({ rooms });
  }
  updateName(name) {
    const rooms = this.state.rooms;
    console.log(name.target.value);
    rooms.name = name.target.value;
    this.setState({ rooms });
    this.state.rooms.name
      ? this.setState({ valid_name: "is-valid" })
      : this.setState({ valid_name: "is-invalid" });
  }
  updateCapMax(max) {
    const rooms = this.state.rooms;
    console.log(max.target.value);
    rooms.max_capacity = max.target.value;
    this.setState({ rooms });
  }
  updateCapMin(min) {
    const rooms = this.state.rooms;
    console.log(min.target.value);
    rooms.allow_capacity = min.target.value;
    this.setState({ rooms });
  }
  updateTempLimp(limp) {
    const rooms = this.state.rooms;
    console.log(limp.target.value);
    rooms.min_time_cleaning = limp.target.value;
    this.setState({ rooms });
  }
  clearForm(event) {
    this.setState({ rooms: initState.rooms });
  }
  cancel(event) {
    this.state.id
      ? this.props.navigate(`/room-data/${this.state.id}`)
      : this.props.navigate(`/room-table`);
  }
  select() {
    if (this.state.centers) {
      return this.state.centers.map((center) => {
        return (
          <option key={center.id} value={center.id}>
            {center.name}
          </option>
        );
      });
    }
  }
  renderForm() {
    return (
      <form className="row g-3">
        <div className="col-md-6 mb-3">
          <div className="form-floating">
            <input
              name="name"
              value={this.state.rooms.name}
              onChange={this.updateName}
              type="text"
              className={`form-control ${this.state.valid_name}`}
              placeholder="Sala 32"
              id="validationTooltip01"
            />
            <div class="invalid-tooltip">Campo invalido</div>
            <label for="validationTooltip01">Nome da Sala</label>
          </div>
        </div>
        <div className="col-md-6 mb-3">
          <div className="form-floating">
            <select
              name="center_id"
              className="form-select"
              onChange={(event) => this.updateFields(event)}
              value={this.state.rooms.center_id}
            >
              {this.select()}
            </select>
            <label>Centro</label>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="form-floating">
            <input
              type="number"
              className={`form-control ${this.state.valid_CapMin}`}
              name="allow_capacity"
              value={this.state.rooms.allow_capacity}
              onChange={this.updateCapMin}
              placeholder="00"
              id="validationTooltip01"
              min="0"
              max="99"
            />
            <div class="invalid-tooltip">
              Capacidade Permitida deve ser Inferior ou Igual a Maxima
            </div>
            <label for="validationTooltip01">Capacidade Permitida</label>
          </div>
        </div>
        <div className="col-md-5 mb-3">
          <div className="form-floating">
            <input
              type="number"
              className={`form-control ${this.state.valid_CapMax}`}
              name="max_capacity"
              value={this.state.rooms.max_capacity}
              onChange={this.updateCapMax}
              placeholder="99"
              id="validationTooltip01"
              min="0"
              max="99"
            />
            <div class="invalid-tooltip">
              Capacidade Maxima deve ser Superior ou Igual a permitda
            </div>
            <label for="validationTooltip01">Capacidade Maxima</label>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="form-floating">
            <input
              type="number"
              className={`form-control ${this.state.valid_TempLimp}`}
              name="min_time_cleaning"
              value={this.state.rooms.min_time_cleaning}
              onChange={this.updateTempLimp}
              placeholder="Portugal"
              id="validationTooltip01"
              min="0"
              max="60"
            />
            <div class="invalid-tooltip">Campo Não é Multiplo de 15</div>
            <label for="validationTooltip01">Tempo De Limpeza(min)</label>
          </div>
        </div>
        <div className="col-12 mb-3">
          <button
            className="btn btn-dark"
            onClick={(event) => this.saverooms(event)}
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
