import React from "react";
import axios from "axios";
import Content from "../template/Content";
import { useParams } from "react-router";
import { baseApiUrl, showError, showSuccess } from "../../config/global";
import { useNavigate } from "react-router-dom";
import { MultiSelect } from "react-multi-select-component";

const initState = {
  centers: [],
  users: {
    name: "",
    email: "",
    profile: "",
    phone: "",
    center_ids: [],
  },
  id: null,
  valid_name: "",
  valid_email: "",
  options: [],
  selectedCenters: [],
};

const lables = {
  allItemsAreSelected: "Todos",
  clearSearch: "Limpar",
  clearSelected: "",
  noOptions: "Nenhuma opção",
  search: "Pesquisar",
  selectAll: "Selecionar todos",
  selectAllFiltered: "Selecionar todos",
  selectSomeItems: "Selecionar",
  create: "",
};

class UserForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { ...initState };
    this.updateName = this.updateName.bind(this);
    this.updateEmail = this.updateEmail.bind(this);
    this.updateCargo = this.updateCargo.bind(this);
    this.updatePhone = this.updatePhone.bind(this);
  }
  componentDidMount() {
    const id = this.props.params.id;
    if (id) {
      this.setState({ id });
      this.loadusers(id);
    } else {
      this.loadCenter();
    }
  }
  loadusers(id) {
    const url = `${baseApiUrl}/account/${id}`;
    axios
      .get(url)
      .then((res) => {
        this.setState({ users: res.data }, () => {
          this.loadCenter()
        });
      })
      .catch(showError);
  }
  loadCenter() {
    const url = `${baseApiUrl}/center`;
    axios
      .get(url)
      .then((res) => {
        const centers = res.data;
        this.setState({ centers }, () => {
          this.select();
        });
      })
      .catch(showError);
  }
  saveusers(event) {
    event.preventDefault();
    const user = this.state.users;
    user.center_ids = [];
    const selectedCenters = this.state.selectedCenters;
    selectedCenters.forEach((element) => {
      user.center_ids.push(element.value);
    });
    delete user.status;
    delete user.centers;
    const method = this.state.id ? "put" : "post";
    const url = this.state.id
      ? `${baseApiUrl}/account/${this.state.id}`
      : `${baseApiUrl}/account`;
    axios[method](url, user)
      .then((res) => {
        showSuccess("Utilizador registado com sucesso");
        this.state.id
          ? this.props.navigate(`/user-data/${this.state.id}`)
          : this.props.navigate(`/user-table`);
      })
      .catch(showError);
  }
  updateCargo(event) {
    const users = this.state.users;
    users.profile = event.target.value;
    this.setState({ users });
  }
  updateFields(event) {
    const users = this.state.users;
    users[event.target.name] = event.target.value;
    this.setState({ users });
  }
  updateName(name) {
    const users = this.state.users;
    users.name = name.target.value;
    this.setState({ users });
    this.state.users.name
      ? this.setState({ valid_name: "is-valid" })
      : this.setState({ valid_name: "is-invalid" });
  }
  updateEmail(max) {
    const users = this.state.users;
    users.email = max.target.value;
    this.setState({ users });
    if (this.state.users.email) {
      this.setState({ valid_email: "is-valid" });
    } else {
      this.setState({ valid_email: "is-invalid" });
    }
  }
  updatePhone(event) {
    const users = this.state.users;
    users.phone = event.target.value;
    this.setState({ users });
  }
  cancel() {
    this.state.id
      ? this.props.navigate(`/user-data/${this.state.id}`)
      : this.props.navigate(`/user-table`);
  }
  select() {
    const centers = this.state.centers;
    const options = this.state.options;
    if (centers) {
      centers.forEach((center) => {
        const option = { label: center.name, value: center.id };
        if (!options.some((e) => e.value === option.value)) {
          options.push(option);
        }
      });
      this.setState({ options: options }, () => {
        const user = this.state.users;
        if (user.center_ids) {
          const selectedCenters = options.filter((item) => {
            return user.center_ids.includes(item.value);
          });
          this.setState({ selectedCenters: selectedCenters });
        }
      });
    }
  }
  renderForm() {
    return (
      <form className="row g-3">
        <div className="col-md-4 mb-3">
          <div className="form-floating">
            <input
              name="name"
              value={this.state.users.name}
              onChange={this.updateName}
              type="text"
              className={`form-control ${this.state.valid_name}`}
              placeholder="Robson Eduardo"
              id="validationTooltip01"
            />
            <div class="invalid-tooltip">Campo invalido</div>
            <label for="validationTooltip01">Nome do Utilizador</label>
          </div>
        </div>
        <div className="col-md-5 mb-3">
          <div className="form-floating">
            <input
              type="email"
              className={`form-control ${this.state.valid_email}`}
              name="email"
              value={this.state.users.email}
              onChange={this.updateEmail}
              placeholder="blabla@gmail.com"
              id="validationTooltip01"
            />
            <div class="invalid-tooltip">Email Invalido</div>
            <label for="validationTooltip01">Email </label>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="form-floating">
            <input
              type="phone"
              className={`form-control`}
              name="phone"
              value={this.state.users.phone}
              onChange={this.updatePhone}
              placeholder="phone"
            />
            <div class="invalid-tooltip">Telefone Invalido</div>
            <label for="validationTooltip01">Telefone</label>
          </div>
        </div>
        <div className="col-md-6 mb-3">
          <div className="form-group">
            <h5>Centro</h5>
            <MultiSelect
              options={this.state.options}
              overrideStrings={lables}
              value={this.state.selectedCenters}
              onChange={(options) =>
                this.setState({ selectedCenters: options })
              }
              labelledBy="Selecionar"
            />
          </div>
        </div>
        <div className="col-md-6 mb-3">
          <div className="form-group">
            <h5>Cargo</h5>
            <select
              name="cargo_user"
              className="form-select"
              onChange={this.updateCargo}
              value={this.state.users.profile}
            >
              <option value="user">Utilizador</option>,
              <option value="admin">Administrador</option>,
              <option value="staff">Equipa De Limpeza</option>
            </select>
          </div>
        </div>
        <div className="col-12 mb-3">
          <button
            className="btn btn-dark"
            onClick={(event) => this.saveusers(event)}
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
  return <UserForm {...props} params={params} navigate={navigate} />;
}
