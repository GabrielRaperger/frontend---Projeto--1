import "./Room.css";
import axios from "axios";
import React from "react";
import DataTable from "react-data-table-component";
import { baseApiUrl, showError, showSuccess } from "../../config/global";
import Content from "../template/Content";
import { Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import If from "../template/If";

const columns = [
  {
    name: "Nome",
    selector: (row) => row.name,
    sortable: true,
  },
  {
    name: "Centro",
    selector: (row) => row.center.name,
    sortable: true,
  },
  {
    name: "Alocação",
    selector: (row) => row.allow_capacity,
    sortable: true,
  },
  {
    name: "Estado",
    selector: (row) => (row.status.code === 100 ? "Ativo" : "Inativo"),
    sortable: true,
  },
  {
    name: "Última limpeza",
    selector: (row) => row.last_cleaning,
  },
  {
    name: "Criado Em",
    selector: (row) => row.created_at,
  },
];

const initState = {
  rooms: [],
  selectedRooms: [],
  filteredRooms: [],
  clear: false,
  pending: true,
  filter: "",
  option: 1,
  ativo: 100,
  statusColor: "",
  statusAction: "",
  showActiveButton: true,
  showInactiveButton: false,
};

const contextMessage = {
  singular: "item selecionado",
  plural: "itens selecionados",
};

const paginationOptions = {
  rowsPerPageText: "Registos por página",
  rangeSeparatorText: "de",
};

class CenterTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = { ...initState };
  }
  componentDidMount() {
    this.loadRooms();
    this.setState({ pending: false });
  }
  loadRooms() {
    const url = `${baseApiUrl}/room`;
    axios
      .get(url)
      .then((res) => {
        const rooms = res.data;
        this.setState({ filteredRooms: rooms });
        this.setState({ rooms });
        this.setState({ option: 1 });
        this.setState({ clear: false });
      })
      .catch(showError);
  }
  handleDoubleClick(row) {
    this.props.navigate(`/room-data/${row.id}`);
  }
  changeStatus(code) {
    const selectedRooms = this.state.selectedRooms;
    if (selectedRooms) {
      for (let i = 0; i < selectedRooms.length; i++) {
        axios
          .put(
            `${baseApiUrl}/room/${selectedRooms[i].id}/status?status=${code}`
          )
          .then(() => {
            showSuccess("Operação realizada com sucesso");
            this.setState({ clear: true });
            this.loadRooms();
          })
          .catch(showError);
      }
    }
  }
  displayButtons() {
    const selectedRooms = this.state.selectedRooms;
    if (selectedRooms) {
      const active = selectedRooms.filter((item) => item.status.code == 100);
      const inactive = selectedRooms.filter((item) => item.status.code != 100);
      if (active.length != 0 && inactive.length != 0) {
        this.setState({ showActiveButton: false });
        this.setState({ showInactiveButton: false });
      } else if (active.length != 0 && inactive.length == 0) {
        this.setState({ showActiveButton: false });
        this.setState({ showInactiveButton: true });
      } else if (active.length == 0 && inactive.length != 0) {
        this.setState({ showActiveButton: true });
        this.setState({ showInactiveButton: false });
      }
    }
  }
  handleDelete() {
    for (let i = 0; i < this.state.selectedRooms.length; i++) {
      const a = this.state.selectedRooms[i].id;

      var config = {
        method: "delete",
        url: `${baseApiUrl}/room/${a}`,
        headers: {
          "Content-Type": "application/json",
        },
      };

      axios(config)
        .then(() => {
          showSuccess("Sala excluída com sucesso");
          this.setState({ clear: true });
          this.loadRooms();
        })
        .catch(showError);
    }
  }
  updateField(event) {
    const name = event.target.name;
    const value = event.target.value;
    this.setState({ [name]: value }, () => {
      this.filterData();
    });
  }
  filterData() {
    const centers = this.state.rooms;
    const option = this.state.option;
    const filter = this.state.filter;
    const filtered = centers
      .filter(
        (item) =>
          item.name.toLowerCase().includes(filter.toLowerCase()) ||
          item.center.name.toLowerCase().includes(filter.toLowerCase())
      )
      .filter((item) => {
        if (option == 2) return item.status.code == 100;
        else if (option == 3) return item.status.code != 100;
        else return true;
      });
    this.setState({ filteredRooms: filtered });
  }
  contextActions() {
    return (
      <React.Fragment>
        {this.displayButtons()}
        <If test={this.state.showActiveButton}>
          <button
            type="button"
            className="btn btn-success"
            onClick={() => this.changeStatus(100)}
          >
            <i className="text-success"></i>
            Ativar
          </button>
        </If>
        <If test={this.state.showInactiveButton}>
          <button
            type="button"
            className="btn btn-warning"
            onClick={() => this.changeStatus(104)}
          >
            <i className="text-warning"></i>
            Inativar
          </button>
        </If>
        <button
          type="button"
          className="ms-2 btn btn-danger"
          onClick={() => this.handleDelete()}
        >
          <i className="fa fa-trash"></i> Remover
        </button>
      </React.Fragment>
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
            <Link to="/room-form/" className="ms-3 btn btn-dark">
              <i className="fa fa-plus"></i> Adicionar
            </Link>
          </div>
        </div>
      </form>
    );
  }
  renderTable() {
    return (
      <DataTable
        title="Salas"
        columns={columns}
        data={this.state.filteredRooms}
        contextMessage={contextMessage}
        contextActions={this.contextActions()}
        selectableRows
        onSelectedRowsChange={(rows) =>
          this.setState({ selectedRooms: [...rows.selectedRows] })
        }
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
        {this.renderHeader()}
        {this.renderTable()}
      </Content>
    );
  }
}

export default function Center(props) {
  let navigate = useNavigate();
  return <CenterTable {...props} navigate={navigate} />;
}
