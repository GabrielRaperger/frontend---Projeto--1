import "./Center.css";
import axios from "axios";
import React from "react";
import DataTable from "react-data-table-component";
import { baseApiUrl, showError, showSuccess } from "../../config/global";
import Content from "../template/Content";
import { Spinner, Modal, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Papa from "papaparse";
import {
  existsOrError,
  isEmailOrError,
  isPhoneOrError,
} from "../../config/validator";
import template from "../../assets/meeting-accounts.csv";

const columns = [
  {
    name: "Nome",
    selector: (row) => row.name,
    sortable: true,
  },
  {
    name: "Email",
    selector: (row) => row.email,
    sortable: true,
  },
  {
    name: "Perfil",
    selector: (row) => row.profile,
    sortable: true,
  },
  {
    name: "Estado",
    selector: (row) => (row.status.code === 100 ? "Ativo" : "Inativo"),
    sortable: true,
  },
  {
    name: "Último Login",
    selector: (row) => row.last_login,
  },
  {
    name: "Criado em",
    selector: (row) => row.created_at,
  },
];

const initState = {
  users: [],
  selectedUsers: [],
  filteredUsers: [],
  clear: false,
  pending: true,
  filter: "",
  option: 1,
  ativo: 100,
  statusColor: "",
  statusAction: "",
  showActiveButton: true,
  showInactiveButton: false,
  showModal: false,
  accountsToCreate: [],
};

const contextMessage = {
  singular: "item selecionado",
  plural: "itens selecionados",
};

const paginationOptions = {
  rowsPerPageText: "Registos por página",
  rangeSeparatorText: "de",
};

class UserTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = { ...initState };
  }
  componentDidMount() {
    this.loadUsers();
    this.setState({ pending: false });
  }
  loadUsers() {
    const url = `${baseApiUrl}/account`;
    axios
      .get(url)
      .then((res) => {
        const users = res.data;
        this.setState({ filteredUsers: users });
        this.setState({ users });
        this.setState({ option: 1 });
        this.setState({ clear: false });
      })
      .catch(showError);
  }
  handleDoubleClick(row) {
    this.props.navigate(`/user-data/${row.id}`);
  }
  updateField(event) {
    const name = event.target.name;
    const value = event.target.value;
    this.setState({ [name]: value }, () => {
      this.filterData();
    });
  }
  onFileUpload(event) {
    const file = event.target.files[0];
    var data = [];
    Papa.parse(file, {
      worker: true,
      encoding: "UTC-8",
      skipEmptyLines: true,
      step: function (result) {
        if (result.data.length >= 4) data.push(result.data);
      },
      complete: function (result, filte) {
        var name = 0;
        var email = 1;
        var phone = 2;
        var profile = 3;
        var center_ids = 4;
        var accountsToCreate = [];
        try {
          for (var i = 1; i < data.length; i++) {
            const user = {};
            var element = [...data[i]];
            existsOrError(
              element[name],
              `Erro na linha ${i}: O campo name é obrigatório`
            );
            existsOrError(
              element[email],
              `Erro na linha ${i}: O campo email é obrigatório`
            );
            existsOrError(
              element[profile],
              `Erro na linha ${i}: O campo profile é obrigatório`
            );
            isEmailOrError(
              element[email],
              `Erro na linha ${i}: O valor do campo email não é válido`
            );
            if (typeof element[phone] === "string" && element[phone].length > 0)
              isPhoneOrError(
                element[phone],
                `Erro na linha ${i}: O valor do campo phone não é válido`
              );
            if (
              element[profile] !== "admin" &&
              element[profile] !== "staff" &&
              element[profile] !== "user"
            )
              throw `Erro na linha ${i}: O campo profile deve conter um dos seguintes valores {admin, staff, user}`;
            var centerIds = element[center_ids].split(";");
            if (element[profile] !== "admin" && centerIds.length === 0)
              throw `Erro na linha ${i}: O utilizador deve estar associado a pelo menos um centro`;
            if (element[profile] !== "admin") user.center_ids = centerIds;
            user.name = element[name];
            user.email = element[email];
            user.phone = element[phone];
            user.profile = element[profile];
            accountsToCreate.push(user);
          }
          this.setAccounts(accountsToCreate);
        } catch (msg) {
          showError(msg);
        }
      }.bind(this),
    });
  }
  setAccounts(accountsToCreate) {
    this.setState({ accountsToCreate });
  }
  filterData() {
    const users = this.state.users;
    const option = this.state.option;
    const filter = this.state.filter;
    const filtered = users
      .filter(
        (item) =>
          item.name.toLowerCase().includes(filter.toLowerCase()) ||
          item.email.toLowerCase().includes(filter.toLowerCase()) ||
          item.profile.toLowerCase().includes(filter.toLowerCase())
      )
      .filter((item) => {
        if (option == 2) return item.status.code == 100;
        else if (option == 3) return item.status.code != 100;
        else return true;
      });
    this.setState({ filteredUsers: filtered });
  }
  uploadFile(event) {
    event.preventDefault();
    const accounts = this.state.accountsToCreate;
    axios
      .post(`${baseApiUrl}/account/many`, accounts)
      .then((res) => {
        showSuccess("Utilizadores registados com sucesso");
        this.setState({ showModal: false });
        this.loadUsers();
      })
      .catch(showError);
  }
  renderModal() {
    var { showModal } = this.state;
    return (
      <Modal
        size="lg"
        centered
        show={showModal}
        onHide={() => this.setState({ showModal: false })}
      >
        <Modal.Header closeButton>
          <Modal.Title>Upload Ficheiro</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="formFile" className="mb-3">
            <Form.Control
              type="file"
              onChange={(event) => this.onFileUpload(event)}
            />
          </Form.Group>
          <a href={template} download className="text-success">
            <i className="fa fa-question-circle-o"></i> download template
          </a>
        </Modal.Body>
        <Modal.Footer>
          <button
            className="btn btn-dark ms-2"
            onClick={() => this.setState({ showModal: false })}
          >
            Cancelar
          </button>
          <button
            className="btn btn-dark ms-2"
            onClick={(e) => this.uploadFile(e)}
          >
            OK
          </button>
        </Modal.Footer>
      </Modal>
    );
  }
  renderHeader() {
    return (
      <form>
        <div className="mb-3 row">
          <div className="col-md-4">
            <input
              type="text"
              name="filter"
              value={this.state.filter}
              onChange={(event) => this.updateField(event)}
              placeholder="Pesquisar"
              className="form-control"
            ></input>
          </div>
          <div className="col-md-3">
            <Form.Select
              name="option"
              value={this.state.option}
              onChange={(event) => this.updateField(event)}
            >
              <option value={1}>Todos</option>
              <option value={2}>Ativos</option>
              <option value={3}>Inativos</option>
            </Form.Select>
          </div>
          <div className="col-md-3 offset-md-2 d-flex justify-content-end">
            <Link to="/user-form/" className="ms-3 btn btn-dark me-2">
              <i className="fa fa-plus"></i> Adicionar
            </Link>
            <Button
              variant="dark"
              onClick={() => this.setState({ showModal: true })}
            >
              <i className="fa fa-file-excel-o"></i> Upload
            </Button>
          </div>
        </div>
      </form>
    );
  }
  renderTable() {
    return (
      <DataTable
        title="Utilizadores"
        columns={columns}
        data={this.state.filteredUsers}
        contextMessage={contextMessage}
        clearSelectedRows={this.state.clear}
        pagination
        paginationComponentOptions={paginationOptions}
        progressPending={this.state.pending}
        progressComponent={<Spinner animation="border" className="p-3 m-3" />}
        onRowDoubleClicked={(row) => this.handleDoubleClick(row)}
      />
    );
  }
  render() {
    return (
      <Content>
        {this.renderModal()}
        {this.renderHeader()}
        {this.renderTable()}
      </Content>
    );
  }
}

export default function Center(props) {
  let navigate = useNavigate();
  return <UserTable {...props} navigate={navigate} />;
}
