import React from "react";
import "./Reserve.css";
import axios from "axios";
import DataTable from "react-data-table-component";
import { baseApiUrl, showError, showSuccess } from "../../config/global";
import { Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import { Link } from "react-router-dom";
import {
  convertSeconds,
  convertSecondsToHoursAndMinutes,
  formatDateToISO,
  formatDateToReadble,
  formatDateToString,
  getCurrentAsISO,
  isAfter,
} from "../../config/moment";
import pt from "date-fns/locale/pt";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Content from "../template/Content";

const columns = [
  {
    name: "Título",
    selector: (row) => row.title,
    sortable: true,
  },
  {
    name: "Utilizador",
    selector: (row) => row.account.name,
    sortable: true,
  },
  {
    name: "Sala",
    selector: (row) => row.room.name,
    sortable: true,
  },
  {
    name: "Data",
    selector: (row) => formatDateToReadble(row.date),
  },
  {
    name: "Inicio",
    selector: (row) => convertSeconds(row.start_time),
  },
  {
    name: "Fim",
    selector: (row) => convertSeconds(row.end_time),
  },
  {
    name: "Estado",
    selector: (row) => formatReserveState(row),
    sortable: true,
  },
];

function formatReserveState(row) {
  const endDateTime = formatDateToISO(
    `${formatDateToString(row.date)} ${convertSecondsToHoursAndMinutes(
      row.end_time
    )}`
  );
  var current = getCurrentAsISO();
  return row.status_id === 100
    ? isAfter(endDateTime, current)
      ? "Pendente"
      : "Concluída"
    : "Inativa";
}

const initState = {
  reserves: [],
  filteredReserves: [],
  selectedRerserv: [],
  clear: false,
  pending: false,
  filter: "",
  option: 1,
  startDate: null,
  endtDate: null,
};

const contextMessage = {
  singular: "item selecionado",
  plural: "itens selecionados",
};

const paginationOptions = {
  rowsPerPageText: "Registos por página",
  rangeSeparatorText: "de",
};

class RoomReserv extends React.Component {
  constructor(props) {
    super(props);
    this.state = { ...initState };
    registerLocale("pt", pt);
  }
  componentDidMount() {
    const id = this.props.id;
    this.loadReserves(id);
  }
  loadReserves() {
    const startDate = this.state.startDate;
    const endtDate = this.state.endtDate;
    var params = "";
    if (startDate) {
      const date = formatDateToString(startDate);
      params = params.concat(`&start_date=${date}`);
    }
    if (endtDate) {
      const date = formatDateToString(endtDate);
      params = params.concat(`&end_date=${date}`);
    }
    const url = `${baseApiUrl}/reserve?${params}`;
    axios
      .get(url)
      .then((res) => {
        const reserves = res.data;
        this.setState({ filteredReserves: reserves });
        this.setState({ reserves });
        this.setState({ option: 1 });
        this.setState({ clear: false });
      })
      .catch(showError);
  }
  handleDoubleClick(row) {
    this.props.navigate(`/reserve-data/${row.id}`);
  }
  updateStartDate(date) {
    this.setState({ startDate: date });
  }
  updateEndDate(date) {
    this.setState({ endtDate: date });
  }
  updateField(event) {
    const name = event.target.name;
    const value = event.target.value;
    this.setState({ [name]: value }, () => {
      this.filterData();
    });
  }
  filterData() {
    const reserves = this.state.reserves;
    const option = this.state.option;
    const filtered = reserves.filter((item) => {
      const endDateTime = formatDateToISO(
        `${formatDateToString(item.date)} ${convertSecondsToHoursAndMinutes(
          item.end_time
        )}`
      );
      var current = getCurrentAsISO();
      if (option == 2)
        return isAfter(endDateTime, current) && item.status_id === 100;
      else if (option == 3)
        return !isAfter(endDateTime, current) && item.status_id === 100;
      else if (option == 4) return item.status_id !== 100;
      else return true;
    });
    this.setState({ filteredReserves: filtered });
  }
  contextActions() {
    return (
      <React.Fragment>
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
  handleDelete() {
    for (let i = 0; i < this.state.selectedRerserv.length; i++) {
      const a = this.state.selectedRerserv[i].id;
      var config = {
        method: "delete",
        url: `${baseApiUrl}/reserve/${a}`,
        headers: {
          "Content-Type": "application/json",
        },
      };

      axios(config)
        .then(() => {
          showSuccess("Reserva excluída com sucesso");
          this.setState({ clear: true });
          this.loadReserves();
        })
        .catch((error) => {
          showError(error);
          console.log(error);
        });
    }
  }
  renderHeader() {
    const { startDate, endtDate, option } = this.state;
    return (
      <div className="row mb-2">
        <div className="col-md-3">
          <DatePicker
            className="form-control "
            name="startDate"
            placeholderText="Data Inicial"
            dateFormat="dd/MM/yyyy"
            locale="pt"
            selected={startDate}
            onChange={(date) => this.updateStartDate(date)}
          />
        </div>
        <div className="col-md-3">
          <DatePicker
            className="form-control"
            name="endDate"
            placeholderText="Data Final"
            dateFormat="dd/MM/yyyy"
            locale="pt"
            selected={endtDate}
            onChange={(date) => this.updateEndDate(date)}
          />
        </div>
        <div className="col-md-2">
          <Form.Select
            name="option"
            value={option}
            onChange={(event) => this.updateField(event)}
          >
            <option value={1}>Todos</option>
            <option value={2}>Pendentes</option>
            <option value={3}>Concluídas</option>
            <option value={4}>Inativas</option>
          </Form.Select>
        </div>
        <div className="col-md-2">
          <button className="btn btn-dark" onClick={() => this.loadReserves()}>
            Pesquisar
          </button>
        </div>
        <div className="col-md-2 d-flex justify-content-end">
          <Link to="/reserve-form" className=" btn btn-dark">
            <i className="fa fa-plus"></i> Adicionar
          </Link>
        </div>
      </div>
    );
  }
  renderTable() {
    return (
      <DataTable
        title="Reservas"
        columns={columns}
        data={this.state.filteredReserves}
        contextMessage={contextMessage}
        contextActions={this.contextActions()}
        selectableRows
        onSelectedRowsChange={(rows) =>
          this.setState({ selectedRerserv: [...rows.selectedRows] })
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
  return <RoomReserv {...props} navigate={navigate} />;
}
