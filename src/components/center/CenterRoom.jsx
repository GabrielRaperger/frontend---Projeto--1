import React from "react";
import "./Center.css";
import axios from "axios";
import DataTable from "react-data-table-component";
import { baseApiUrl, showError, showSuccess } from "../../config/global";
import { Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import If from "../template/If";

const columns = [
  {
    name: "Sala",
    selector: (row) => row.name,
    sortable: true,
  },
  {
    name: "Centro",
    selector: (row) => row.center.name,
    sortable: true,
  },
  {
    name: "Capacidade Permitida",
    selector: (row) => row.allow_capacity,
    sortable: true,
  },
  {
    name: "Tempo Limpeza",
    selector: (row) => row.min_time_cleaning,
    sortable: true,
  },
  {
    name: "Estado",
    selector: (row) => (row.status.code === 100 ? "Ativo" : "Inativo"),
    sortable: true,
  },
  {
    name: "Criado em",
    selector: (row) => row.created_at,
  },
];

const initState = {
  rooms: [],
  selectedRooms: [],
  clear: false,
  pending: true,
  filter: "",
  option: 1,
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

class CenterRooms extends React.Component {
  constructor(props) {
    super(props);
    this.state = { ...initState };
  }
  componentDidMount() {
    this.loadRooms();
    this.setState({ pending: false });
  }

  loadRooms() {
    const id = this.props.id;
    if (id) {
      const url = `${baseApiUrl}/center/${id}/rooms`;
      axios
        .get(url)
        .then((res) => {
          this.setState({ clear: false });
          const rooms = res.data;
          this.setState({ rooms });
        })
        .catch(showError);
    }
  }

  handleDoubleClick(row) {
    this.props.navigate(`/room-data/${row.id}`);
  }
  changeStatus(code) {
    const rooms = this.state.selectedRooms;
    if (rooms) {
      for (let i = 0; i < rooms.length; i++) {
        axios
          .put(`${baseApiUrl}/room/${rooms[i].id}/status?status=${code}`)
          .then(() => {
            showSuccess("Operação realizada com sucesso");
            this.setState({ clear: true });
            this.loadRooms();
          })
          .catch((error) => {
            showError(error);
            console.log(error);
          });
      }
    }
  }
  displayButtons() {
    const rooms = this.state.selectedRooms;
    if (rooms) {
      const active = rooms.filter((item) => item.status.code == 100);
      const inactive = rooms.filter((item) => item.status.code != 100);
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
          showSuccess("Centro excluído com sucesso");
          this.setState({ clear: true });
          this.loadRooms();
        })
        .catch((error) => {
          showError(error);
          console.log(error);
        });
    }
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

  renderTable() {
    return (
      <DataTable
        title="Salas"
        columns={columns}
        data={this.state.rooms}
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
    return this.renderTable();
  }
}
export default function Center(props) {
  let navigate = useNavigate();
  return <CenterRooms {...props} navigate={navigate} />;
}
