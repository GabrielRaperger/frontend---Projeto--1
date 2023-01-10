import React from "react";
import axios from "axios";
import Content from "../template/Content";
import { useParams } from "react-router";
import { baseApiUrl, showError, showSuccess } from "../../config/global";
import { useNavigate } from "react-router-dom";
import DatePicker, { registerLocale } from "react-datepicker";
import TimePicker from "react-bootstrap-time-picker";
import pt from "date-fns/locale/pt";
import { convertToDate, formatDateToString } from "../../config/moment";
import Select, { components } from "react-select";

const CustomOption = ({ ...props }) => {
  return (
    <components.Option {...props} value={props.data.value}>
      <div className="d-flex flex-column">
        <h6>{props.data.label}</h6>
        <span>{props.data.custom}</span>
      </div>
    </components.Option>
  );
};

const initState = {
  reserve: {
    title: "",
    account_id: "",
    room_id: "",
    start_time: 0,
    end_time: 0,
    description: "",
  },
  selected_user: null,
  selected_room: null,
  date: null,
  users: [],
  users_options: [],
  rooms: [],
  rooms_options: [],
};

class CenterForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { ...initState };
    registerLocale("pt", pt);
    this.updateStartTime = this.updateStartTime.bind(this);
    this.updateEndTime = this.updateEndTime.bind(this);
  }
  componentDidMount() {
    if (this.props.params.id) {
      this.loadReserve();
    } else {
      this.loadUsers();
    }
  }
  loadReserve() {
    const id = this.props.params.id;
    const url = `${baseApiUrl}/reserve/${id}`;
    axios
      .get(url)
      .then(async (res) => {
        const reserve = res.data;
        this.setState({ reserve }, () => {
          const date = convertToDate(reserve.date);
          this.setState({ date });
          this.loadUsers()
          this.loadRooms(reserve.account_id)
        });
      })
      .catch(showError);
  }
  loadUsers() {
    const url = `${baseApiUrl}/account`;
    axios
      .get(url)
      .then((res) => {
        const accounts = res.data;
        const users = accounts.filter((item) => {
          return item.profile !== "staff";
        });
        this.setState({ users }, () => {
          this.mapUsers();
        });
      })
      .catch(showError);
  }
  mapUsers() {
    if (this.state.users) {
      const options = [];
      this.state.users.forEach((user) => {
        const option = {};
        option.value = user.id;
        option.label = user.email;
        option.custom = user.name;
        options.push(option);
      });
      this.setState({ users_options: options }, () => {
        const reserve = this.state.reserve
        if (reserve.account_id) {
          const selectedUser = options.find(
            (user) => user.value === reserve.account_id
          );
          this.setState({ selected_user: selectedUser });
        } 
      });
    }
  }
  mapRooms() {
    if (this.state.rooms) {
      const options = [];
      this.state.rooms.forEach((room) => {
        const option = {};
        option.value = room.id;
        option.label = room.name;
        option.custom = room.center ? room.center.name : "";
        options.push(option);
      });
      this.setState({ rooms_options: options }, () => {
        const reserve = this.state.reserve
        if (reserve.room_id) {
          const selectedRoom = options.find(
            (room) => room.value === reserve.room_id
          );
          this.setState({ selected_room: selectedRoom });
        } 
      });
    }
  }
  updateFields(event) {
    const reserve = this.state.reserve;
    reserve[event.target.name] = event.target.value;
    this.setState({ reserve });
  }
  updateStartTime(time) {
    const reserve = this.state.reserve;
    reserve.start_time = time;
    this.setState({ reserve });
  }
  updateEndTime(time) {
    const reserve = this.state.reserve;
    reserve.end_time = time;
    this.setState({ reserve });
  }
  loadRooms(userId) {
    const url = `${baseApiUrl}/room?active=true&account_id=${userId}`;
    axios
      .get(url)
      .then(async (res) => {
        const rooms = res.data;
        this.setState({ rooms }, async () => {
          this.mapRooms();
        });
      })
      .catch(showError);
  }
  updateUser(option) {
    const reserve = this.state.reserve;
    if (option) {
      this.setState({ selected_user: option });
      const userId = option.value;
      reserve.account_id = userId;
      this.setState({ reserve });
      this.loadRooms(userId);
    } else {
      this.setState({ selected_user: null });
      this.setState({ rooms: [] }, () => {
        this.mapRooms();
      });
    }
  }
  saveReserve(event) {
    event.preventDefault();
    const reserve = this.state.reserve;
    delete reserve.status;
    delete reserve.account;
    delete reserve.room;
    const date = this.state.date;
    reserve.date = formatDateToString(date);
    const method = this.props.params.id ? "put" : "post";
    const url = this.props.params.id
      ? `${baseApiUrl}/reserve/${this.props.params.id}`
      : `${baseApiUrl}/reserve`;
    axios[method](url, reserve)
      .then(() => {
        showSuccess("Operação realizada com sucesso");
        this.props.params.id
          ? this.props.navigate(`/reserve-data/${this.props.params.id}`)
          : this.props.navigate(`/reserve-table`);
      })
      .catch(showError);
  }
  updateRoom(option) {
    const reserve = this.state.reserve;
    if (option) {
      this.setState({ selected_room: option });
      const roomId = option.value;
      reserve.room_id = roomId;
      this.setState({ reserve });
    } else {
      this.setState({ selected_room: null });
    }
  }
  updateDate(date) {
    this.setState({ date });
  }
  cancel() {
    this.props.params.id
      ? this.props.navigate(`/reserve-data/${this.props.params.id}`)
      : this.props.navigate(`/reserve-table`);
  }
  renderForm() {
    return (
      <form className="row g-3">
        <div className="col-md-12">
          <div className="form-floating">
            <input
              name="title"
              value={this.state.reserve.title}
              onChange={(e) => this.updateFields(e)}
              type="text"
              className={`form-control`}
              placeholder="Título da Reserva"
            />
            <label>Título da Reserva</label>
          </div>
        </div>
        <div className="col-md-6 mt-4">
          <Select
            placeholder="Selecionar Utilizador"
            isClearable={true}
            isSearchable={true}
            value={this.state.selected_user}
            onChange={(e) => this.updateUser(e)}
            options={this.state.users_options}
            components={{ Option: CustomOption }}
          />
        </div>
        <div className="col-md-6 mt-4">
          <Select
            placeholder="Selecionar Sala"
            isClearable={true}
            isSearchable={true}
            value={this.state.selected_room}
            onChange={(e) => this.updateRoom(e)}
            options={this.state.rooms_options}
            components={{ Option: CustomOption }}
          />
        </div>
        <div className="col-md-6 mt-4">
          <div className="form-group">
            <h5>Data</h5>
            <DatePicker
              className="form-select"
              name="date"
              placeholderText="Data da Reserva"
              dateFormat="dd/MM/yyyy"
              locale="pt"
              selected={this.state.date}
              onChange={(date) => this.updateDate(date)}
            />
          </div>
        </div>
        <div className="col-md-3 mt-4">
          <div className="form-group">
            <h5>Início</h5>
            <TimePicker
              value={this.state.reserve.start_time}
              onChange={this.updateStartTime}
              className="form-select"
              step={10}
              aria-label="Floating label select example"
              format={24}
            />
          </div>
        </div>
        <div className="col-md-3 mt-4">
          <div className="form-group">
            <h5>Fim</h5>
            <TimePicker
              value={this.state.reserve.end_time}
              onChange={this.updateEndTime}
              className="form-select"
              step={10}
              aria-label="Floating label select example"
              format={24}
            />
          </div>
        </div>
        <div className="col-md-12 mt-4">
          <textarea
            className="form-control"
            name="description"
            value={this.state.reserve.description}
            onChange={(e) => this.updateFields(e)}
            placeholder="Descrição"
            rows="3"
          ></textarea>
        </div>
        <div className="col-12 mb-3 mt-4">
          <button
            className="btn btn-dark"
            onClick={(event) => this.saveReserve(event)}
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
