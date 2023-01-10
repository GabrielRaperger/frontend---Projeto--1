import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";
import { baseApiUrl, showError } from "../../config/global";
import DataTable from "react-data-table-component";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import StatCard from "../template/StatCard";
import pt from "date-fns/locale/pt";
import { convertSecondsToHours, formatDateToString } from "../../config/moment";

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
    name: "Próxima limpeza",
    selector: (row) => row.next_cleaning,
  },
  {
    name: "Total",
    selector: (row) =>
      row.reserveCount ? row.reserveCount : row.cleaningCount,
    sortable: true,
  },
];

const INTI_STATE = {
  mostUsedRooms: [],
  startDate: null,
  endtDate: null,
  total: 0,
  pending_reserves: 0,
  completed_reserves: 0,
  averageDuration: "",
  countTitle: "Número de reservas",
  countHasExtra: true,
  avgTitle: "Duração média da reserva",
};

class UserStatistics extends React.Component {
  constructor(props) {
    super(props);
    this.state = { ...INTI_STATE };
    registerLocale("pt", pt);
  }
  componentDidMount() {
    const profile = this.props.profile;
    this.loadMostUsedRooms();
    if (profile === "staff") {
      this.setState({ countTitle: "Número de limpezas" });
      this.setState({ countHasExtra: false });
      this.setState({ avgTitle: "Duração média da limpeza" });
      this.countCleanings();
      this.getAvgCleaningDuration();
    } else {
      this.countReserves();
      this.getAvgReserveDuration();
    }
  }
  loadMostUsedRooms() {
    const account_id = this.props.id;
    const profile = this.props.profile;
    axios
      .get(
        `${baseApiUrl}/room/statistics/mostUsed?account_id=${account_id}&profile=${profile}`
      )
      .then((res) => {
        this.setState({ mostUsedRooms: res.data });
      })
      .catch(showError);
  }
  countReserves() {
    const account_id = this.props.id;
    const startDate = this.state.startDate;
    const endtDate = this.state.endtDate;
    var params = `account_id=${account_id}`;
    if (startDate) {
      const date = formatDateToString(startDate);
      params = params.concat(`&start_date=${date}`);
    }
    if (endtDate) {
      const date = formatDateToString(endtDate);
      params = params.concat(`&end_date=${date}`);
    }
    axios
      .get(`${baseApiUrl}/reserve/statistics/count?${params}`)
      .then((res) => {
        const totalReserves = res.data.total_reserves;
        const pendingReserves = res.data.pending_reserves;
        const completedReserves = res.data.completed_reserves;
        this.setState({ total: totalReserves });
        this.setState({ pending_reserves: pendingReserves });
        this.setState({ completed_reserves: completedReserves });
      })
      .catch(showError);
  }
  getAvgReserveDuration() {
    const account_id = this.props.id;
    var params = `account_id=${account_id}`;
    axios
      .get(`${baseApiUrl}/reserve/statistics/average?${params}`)
      .then((res) => {
        const averageDuration = res.data.averageDuration;
        const formated = convertSecondsToHours(averageDuration);
        this.setState({ averageDuration: formated });
      })
      .catch(showError);
  }
  countCleanings() {
    const account_id = this.props.id;
    const startDate = this.state.startDate;
    const endtDate = this.state.endtDate;
    var params = `account_id=${account_id}`;
    if (startDate) {
      const date = formatDateToString(startDate);
      params = params.concat(`&start_date=${date}`);
    }
    if (endtDate) {
      const date = formatDateToString(endtDate);
      params = params.concat(`&end_date=${date}`);
    }
    axios
      .get(`${baseApiUrl}/cleaning/statistics/count?${params}`)
      .then((res) => {
        const totalCleanings = res.data.total_cleanings;
        this.setState({ total: totalCleanings });
      })
      .catch(showError);
  }
  getAvgCleaningDuration() {
    const account_id = this.props.id;
    var params = `account_id=${account_id}`;
    axios
      .get(`${baseApiUrl}/cleaning/statistics/average?${params}`)
      .then((res) => {
        const averageDuration = res.data.averageDuration;
        const formated = convertSecondsToHours(averageDuration);
        this.setState({ averageDuration: formated });
      })
      .catch(showError);
  }
  updateStartDate(date) {
    this.setState({ startDate: date });
  }
  updateEndDate(date) {
    this.setState({ endtDate: date });
  }
  handleDoubleClick(row) {
    this.props.navigate(`/room-data/${row.id}`);
  }
  renderTable() {
    return (
      <DataTable
        title="TOP 5 Salas Mais Frequentadas"
        columns={columns}
        data={this.state.mostUsedRooms}
        onRowDoubleClicked={(row) => this.handleDoubleClick(row)}
      />
    );
  }
  renderStats() {
    var {
      startDate,
      endtDate,
      averageDuration,
      countTitle,
      countHasExtra,
      avgTitle,
    } = this.state;
    return (
      <div className="row">
        <div className="col-md-12">
          <div className="row">
            <div className="col-4">
              <DatePicker
                className="form-control "
                name="startDate"
                dateFormat="dd/MM/yyyy"
                placeholderText="Data Inicial"
                locale="pt"
                selected={startDate}
                onChange={(date) => this.updateStartDate(date)}
              />
            </div>
            <div className="col-4">
              <DatePicker
                className="form-control"
                placeholderText="Data Final"
                name="endDate"
                dateFormat="dd/MM/yyyy"
                locale="pt"
                selected={endtDate}
                onChange={(date) => this.updateEndDate(date)}
              />
            </div>
            <div className="col-4">
              <button
                className="btn btn-dark"
                onClick={() => this.countReserves()}
              >
                Pesquisar
              </button>
            </div>
          </div>
        </div>
        <div className="col-md-12">
          <StatCard
            className="mt-4"
            title={countTitle}
            icon="fa fa-calendar-check-o"
            text="Total"
            hasExtra={countHasExtra}
            value={`${this.state.total}`}
            positive={`Pendentes: ${this.state.pending_reserves}`}
            negative={`Concluídas: ${this.state.completed_reserves}`}
          />
        </div>
        <div className="col-md-12">
          <StatCard
            title={avgTitle}
            icon="fa fa-clock-o"
            text="Total"
            value={`${averageDuration}`}
            hasExtra={false}
          />
        </div>
      </div>
    );
  }
  render() {
    return (
      <div className="row">
        <div className="col-md-7">{this.renderTable()}</div>
        <div className="col-md-5">{this.renderStats()}</div>
      </div>
    );
  }
}

export default function Main(props) {
  let navigate = useNavigate();
  return <UserStatistics {...props} navigate={navigate} />;
}
