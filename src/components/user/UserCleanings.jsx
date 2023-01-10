import React from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { baseApiUrl, showError, showSuccess } from "../../config/global";
import { Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {
  convertSeconds,
  formatDateToReadble,
  formatDateToString,
} from "../../config/moment";
import pt from "date-fns/locale/pt";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function formatDuration(secs) {
  var hours = Math.floor(secs / 3600);
  var minutes = Math.floor((secs % 3600) / 60);
  var duration = "";
  if (hours == 0) duration = `${minutes} Min`;
  else if (minutes == 0) duration = `${hours} H`;
  else duration = `${hours} H ${minutes} Min`;
  return duration;
}

const columns = [
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
    name: "Duração",
    selector: (row) => formatDuration(row.duration),
  },
];

const initState = {
  cleanings: [],
  selectedCleanings: [],
  clear: false,
  pending: true,
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
    this.loadCleanings();
    this.setState({ pending: false });
  }
  loadCleanings() {
    const id = this.props.id;
    const startDate = this.state.startDate;
    const endtDate = this.state.endtDate;
    var params = `account_id=${id}`;
    if (startDate) {
      const date = formatDateToString(startDate);
      params = params.concat(`&start_date=${date}`);
    }
    if (endtDate) {
      const date = formatDateToString(endtDate);
      params = params.concat(`&end_date=${date}`);
    }
    const url = `${baseApiUrl}/cleaning?${params}`;
    axios
      .get(url)
      .then((res) => {
        const cleanings = res.data;
        this.setState({ clear: false });
        this.setState({ cleanings });
      })
      .catch(showError);
  }

  handleDelete() {
    for (let i = 0; i < this.state.selectedCleanings.length; i++) {
      const a = this.state.selectedCleanings[i].id;
      var config = {
        method: "delete",
        url: `${baseApiUrl}/cleaning/${a}`,
        headers: {
          "Content-Type": "application/json",
        },
      };

      axios(config)
        .then(() => {
          showSuccess("Limpeza excluída com sucesso");
          this.setState({ clear: true });
          this.loadCleanings();
        })
        .catch((error) => {
          showError(error);
        });
    }
  }
  updateStartDate(date) {
    this.setState({ startDate: date });
  }
  updateEndDate(date) {
    this.setState({ endtDate: date });
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
  renderHeader() {
    const { startDate, endtDate } = this.state;
    return (
      <div className="row mb-2">
        <div className="col-md-3">
          <DatePicker
            className="form-control "
            name="startDate"
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
            dateFormat="dd/MM/yyyy"
            locale="pt"
            selected={endtDate}
            onChange={(date) => this.updateEndDate(date)}
          />
        </div>
        <div className="col-md-3">
          <button className="btn btn-dark" onClick={() => this.loadCleanings()}>
            Pesquisar
          </button>
        </div>
      </div>
    );
  }
  renderTable() {
    return (
      <DataTable
        title="Histórico de Limpezas"
        columns={columns}
        data={this.state.cleanings}
        contextMessage={contextMessage}
        contextActions={this.contextActions()}
        selectableRows
        onSelectedRowsChange={(rows) =>
          this.setState({ selectedCleanings: [...rows.selectedRows] })
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
      <React.Fragment>
        {this.renderHeader()}
        {this.renderTable()}
      </React.Fragment>
    );
  }
}
export default function Center(props) {
  let navigate = useNavigate();
  return <RoomReserv {...props} navigate={navigate} />;
}
