import React from "react";
import axios from "axios";
import Content from "../template/Content";
import StatCard from "../template/StatCard";
import { useNavigate } from "react-router-dom";
import { baseApiUrl, showError } from "../../config/global";
import { getEndOfMonth, getStartOfMonth } from "../../config/moment";
import DataTable from "react-data-table-component";

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
    name: "Alocação",
    selector: (row) => row.allow_capacity,
    sortable: true,
  },
  {
    name: "Última limpeza",
    selector: (row) => row.last_cleaning,
  },
  {
    name: "Reservas",
    selector: (row) => row.reserveCount,
    sortable: true,
  },
];

const INTI_STATE = {
  accounts: {
    total_accounts: 0,
    active_accounts: 0,
    inactive_accounts: 0,
  },
  rooms: {
    total_rooms: 0,
    active_rooms: 0,
    inactive_rooms: 0,
  },
  total_reserves: 0,
  pending_reserves: 0,
  completed_reserves: 0,
  mostUsedRooms: [],
};

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = { ...INTI_STATE };
  }
  componentDidMount() {
    this.countAccountsAndRooms();
    this.countReserves();
    this.getMostUsedRooms();
  }
  countAccountsAndRooms() {
    axios
      .get(`${baseApiUrl}/dashboard/statistics/count`)
      .then((res) => {
        const accounts = res.data.accounts;
        const rooms = res.data.rooms;
        this.setState({ accounts });
        this.setState({ rooms });
      })
      .catch(showError);
  }
  countReserves() {
    const startDate = getStartOfMonth();
    const endDate = getEndOfMonth();
    axios
      .get(
        `${baseApiUrl}/reserve/statistics/count?start_date=${startDate}&end_date=${endDate}`
      )
      .then((res) => {
        const totalReserves = res.data.total_reserves;
        const pendingReserves = res.data.pending_reserves;
        const completedReserves = res.data.completed_reserves;
        this.setState({ total_reserves: totalReserves });
        this.setState({ pending_reserves: pendingReserves });
        this.setState({ completed_reserves: completedReserves });
      })
      .catch(showError);
  }
  getMostUsedRooms() {
    axios
      .get(`${baseApiUrl}/room/statistics/mostUsed`)
      .then((res) => {
        this.setState({ mostUsedRooms: res.data });
      })
      .catch(showError);
  }
  handleDoubleClick(row) {
    this.props.navigate(`/room-data/${row.id}`);
  }
  renderStats() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-lg-4 col-md-6">
            <StatCard
              title="Utilizadores"
              icon="fa fa-user"
              text="Total"
              hasExtra={true}
              value={`${this.state.accounts.total_accounts}`}
              positive={`Ativos: ${this.state.accounts.active_accounts}`}
              negative={`Inativos: ${this.state.accounts.inactive_accounts}`}
            />
          </div>
          <div className="col-lg-4 col-md-6">
            <StatCard
              title="Salas"
              icon="fa fa-home"
              text="Total"
              hasExtra={true}
              value={`${this.state.rooms.total_rooms}`}
              positive={`Ativas: ${this.state.rooms.active_rooms}`}
              negative={`Inativas: ${this.state.rooms.inactive_rooms}`}
            />
          </div>
          <div className="col-lg-4 col-md-6">
            <StatCard
              title="Reservas"
              icon="fa fa-calendar-check-o"
              text="Este mês"
              hasExtra={true}
              value={`${this.state.total_reserves}`}
              positive={`Pendentes: ${this.state.pending_reserves}`}
              negative={`Concluídas: ${this.state.completed_reserves}`}
            />
          </div>
        </div>
      </div>
    );
  }
  renderTable() {
    return (
      <DataTable
        title="TOP 10 Salas Mais Frequentadas"
        columns={columns}
        data={this.state.mostUsedRooms}
        onRowDoubleClicked={(row) => this.handleDoubleClick(row)}
      />
    );
  }
  render() {
    return (
      <Content>
        {this.renderStats()}
        {this.renderTable()}
      </Content>
    );
  }
}

export default function Main(props) {
  let navigate = useNavigate();
  return <Dashboard {...props} navigate={navigate} />;
}
