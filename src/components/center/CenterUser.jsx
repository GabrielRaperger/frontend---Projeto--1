import React from "react";
import "./Center.css";
import axios from "axios";
import DataTable from "react-data-table-component";
import { baseApiUrl, showError } from "../../config/global";
import { Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

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
    name: "Ultimo Login",
    selector: (row) => row.last_login,
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
  users: [],
  selectedUsers: [],
  filteredUsers: [],
  clear: false,
  pending: true,
  filter: "",
  option: 1,
};

const contextMessage = {
  singular: "item selecionado",
  plural: "itens selecionados",
};

const paginationOptions = {
  rowsPerPageText: "Registos por página",
  rangeSeparatorText: "de",
};

class CenterUsers extends React.Component {
  constructor(props) {
    super(props);
    this.state = { ...initState };
  }
  componentDidMount() {

    const id = this.props.id
    this.loadRooms(id);
    this.setState({ pending: false });
  }

  loadRooms(id) {
    if(id)
    {
    const url = `${baseApiUrl}/center/${id}/accounts`;
    axios
      .get(url)
      .then((res) => {
        const users = res.data;
        this.setState({ filteredUsers: users });
        this.setState({ users });
      })
      .catch(showError);
    }
  }

  handleDoubleClick(row) {
    this.props.navigate(`/user-data/${row.id}`);
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
    return this.renderTable();
  }
}
export default function Center(props) {
  let navigate = useNavigate();
  return <CenterUsers {...props} navigate={navigate} />;
}
